/**
 * HemmilesClient — the single gateway for all network access.
 *
 * Responsibilities:
 *   - SSRF protection: only https + hemmiles.com, validated on every redirect.
 *   - robots.txt compliance: never requests /api/.
 *   - Resilience: per-request timeout, retry with exponential backoff for
 *     transient failures (ECONNRESET / network / 5xx / 429).
 *   - Conservative rate limiting: requests are serialized with a configurable
 *     minimum spacing (the live site intermittently resets connections).
 *   - In-memory caching with TTL to avoid re-fetching the same page.
 *
 * It never logs URLs with query strings or response bodies, and holds no
 * credentials.
 */

import { assertAllowedUrl } from "../utils/validation.js";
import { HemmilesError } from "../utils/errors.js";
import type { ServerConfig } from "../config.js";

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECTS = 5;

interface CacheEntry {
  value: string;
  expires: number;
}

export interface FetchResult {
  /** Final URL after following redirects. */
  url: string;
  status: number;
  html: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Transient errors are worth retrying. */
function isTransientNetworkError(error: unknown): boolean {
  if (error instanceof HemmilesError) {
    return error.code === "TIMEOUT" || error.code === "NETWORK";
  }
  const code = (error as { cause?: { code?: string }; code?: string })?.cause?.code
    ?? (error as { code?: string })?.code;
  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "EAI_AGAIN" ||
    code === "UND_ERR_SOCKET" ||
    code === "UND_ERR_CONNECT_TIMEOUT"
  );
}

export class HemmilesClient {
  private readonly config: ServerConfig;
  private readonly cache = new Map<string, CacheEntry>();
  /** Serializes outbound requests so rate-limit spacing is honored. */
  private gate: Promise<void> = Promise.resolve();
  private lastRequestAt = 0;

  constructor(config: ServerConfig) {
    this.config = config;
  }

  /** Acquire the rate-limit slot: at most one request in flight, spaced out. */
  private async acquireSlot(): Promise<void> {
    const prior = this.gate;
    let release!: () => void;
    this.gate = new Promise<void>((resolve) => (release = resolve));
    await prior;
    const since = Date.now() - this.lastRequestAt;
    const wait = this.config.minRequestIntervalMs - since;
    if (wait > 0) await sleep(wait);
    this.lastRequestAt = Date.now();
    // Release the gate immediately: spacing is enforced by lastRequestAt, and
    // serialization only needs to order the spacing checks.
    release();
  }

  private getCached(key: string): string | undefined {
    if (this.config.cacheTtlMs <= 0) return undefined;
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (entry.expires < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  private setCached(key: string, value: string): void {
    if (this.config.cacheTtlMs <= 0) return;
    this.cache.set(key, { value, expires: Date.now() + this.config.cacheTtlMs });
  }

  /** Perform a single fetch with an AbortController timeout. */
  private async fetchOnce(url: string): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      return await fetch(url, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": this.config.userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en",
        },
      });
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        throw new HemmilesError("TIMEOUT", `Request to ${url} timed out after ${this.config.timeoutMs}ms.`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  /** Follow redirects manually, validating each hop against the allowlist. */
  private async fetchFollowingRedirects(startUrl: string): Promise<FetchResult> {
    let current = assertAllowedUrl(startUrl).toString();
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await this.acquireSlot();
      const res = await this.fetchOnce(current);

      if (REDIRECT_STATUSES.has(res.status)) {
        const location = res.headers.get("location");
        if (!location) {
          throw new HemmilesError("HTTP_ERROR", `Redirect ${res.status} without a Location header.`, res.status);
        }
        const next = new URL(location, current).toString();
        assertAllowedUrl(next); // reject off-site / downgraded redirects
        current = next;
        continue;
      }

      if (res.status === 404 || res.status === 410) {
        throw new HemmilesError("NOT_FOUND", `${current} returned HTTP ${res.status}.`, res.status);
      }
      if (res.status === 429) {
        throw new HemmilesError("RATE_LIMITED", `${current} returned HTTP 429 (too many requests).`, 429);
      }
      if (res.status >= 500) {
        throw new HemmilesError("HTTP_ERROR", `${current} returned server error HTTP ${res.status}.`, res.status);
      }
      if (res.status >= 400) {
        throw new HemmilesError("HTTP_ERROR", `${current} returned HTTP ${res.status}.`, res.status);
      }

      const html = await res.text();
      return { url: current, status: res.status, html };
    }
    throw new HemmilesError("TOO_MANY_REDIRECTS", `Exceeded ${MAX_REDIRECTS} redirects starting at ${startUrl}.`);
  }

  /**
   * Fetch a URL (absolute Hemmiles URL) as HTML, with retries on transient
   * failures and in-memory caching. 404/410 are surfaced as NOT_FOUND and are
   * not retried.
   */
  async fetchHtml(url: string): Promise<FetchResult> {
    assertAllowedUrl(url);
    const cached = this.getCached(url);
    if (cached !== undefined) {
      return { url, status: 200, html: cached };
    }

    let lastError: unknown;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await this.fetchFollowingRedirects(url);
        this.setCached(url, result.html);
        // Cache under the final URL too, so later direct hits are free.
        if (result.url !== url) this.setCached(result.url, result.html);
        return result;
      } catch (error) {
        lastError = error;
        const retryable =
          isTransientNetworkError(error) ||
          (error instanceof HemmilesError &&
            (error.code === "RATE_LIMITED" ||
              (error.code === "HTTP_ERROR" && (error.status ?? 0) >= 500)));
        if (!retryable || attempt === this.config.maxRetries) break;
        const backoff = Math.min(4000, 400 * 2 ** attempt) + Math.floor(Math.random() * 200);
        await sleep(backoff);
      }
    }

    if (lastError instanceof HemmilesError) throw lastError;
    if (isTransientNetworkError(lastError)) {
      throw new HemmilesError("NETWORK", `Network error contacting ${url}: ${(lastError as Error)?.message ?? "connection failed"}.`);
    }
    throw new HemmilesError("NETWORK", `Failed to fetch ${url}: ${(lastError as Error)?.message ?? String(lastError)}.`);
  }

  /** Clear the in-memory cache (used by tests). */
  clearCache(): void {
    this.cache.clear();
  }
}
