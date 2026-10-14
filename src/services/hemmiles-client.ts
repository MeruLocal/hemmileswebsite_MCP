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
 *   - In-memory caching with TTL to avoid re-fetching the same page, plus a
 *     negative cache of NOT_FOUND URLs for the same TTL.
 *   - Response guards: only HTML/XML content types, and bodies are capped at
 *     MAX_RESPONSE_BYTES (checked on Content-Length and while streaming).
 *
 * It never logs URLs with query strings or response bodies, and holds no
 * credentials.
 */

import { assertAllowedUrl } from "../utils/validation.js";
import { HemmilesError } from "../utils/errors.js";
import type { ServerConfig } from "../config.js";
import { MAX_RESPONSE_BYTES } from "../constants.js";

/** Content types the client will read. Anything else is refused unread. */
const ACCEPTED_CONTENT_TYPES = new Set([
  "text/html",
  "application/xhtml+xml",
  "application/xml",
  "text/xml",
]);

export type FetchImpl = (input: string, init?: RequestInit) => Promise<Response>;

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
  /** URLs that returned NOT_FOUND, with their expiry (same TTL as the cache). */
  private readonly missing = new Map<string, number>();
  private readonly fetchImpl: FetchImpl;
  /** Serializes outbound requests so rate-limit spacing is honored. */
  private gate: Promise<void> = Promise.resolve();
  private lastRequestAt = 0;

  /**
   * `fetchImpl` exists for tests only (to point at a local server). The URL
   * allowlist is still enforced before it is called.
   */
  constructor(config: ServerConfig, fetchImpl: FetchImpl = (input, init) => fetch(input, init)) {
    this.config = config;
    this.fetchImpl = fetchImpl;
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

  private isKnownMissing(key: string): boolean {
    if (this.config.cacheTtlMs <= 0) return false;
    const expires = this.missing.get(key);
    if (expires === undefined) return false;
    if (expires < Date.now()) {
      this.missing.delete(key);
      return false;
    }
    return true;
  }

  private setMissing(key: string): void {
    if (this.config.cacheTtlMs <= 0) return;
    this.missing.set(key, Date.now() + this.config.cacheTtlMs);
  }

  /**
   * Return a cached page without any network access, or undefined. Lets
   * callers (deep search) score already-cached pages for free.
   */
  peekCached(url: string): FetchResult | undefined {
    const cached = this.getCached(url);
    return cached === undefined ? undefined : { url, status: 200, html: cached };
  }

  /**
   * Perform a single fetch with an AbortController timeout. The timeout keeps
   * running until `done()` is called, so it also bounds reading the body.
   */
  private async fetchOnce(url: string): Promise<{ res: Response; controller: AbortController; done: () => void }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    const done = () => clearTimeout(timer);
    try {
      const res = await this.fetchImpl(url, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": this.config.userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en",
        },
      });
      return { res, controller, done };
    } catch (error) {
      done();
      if ((error as Error)?.name === "AbortError") {
        throw new HemmilesError("TIMEOUT", `Request to ${url} timed out after ${this.config.timeoutMs}ms.`);
      }
      throw error;
    }
  }

  /**
   * Read a response body as text, refusing non-HTML/XML content types and
   * bodies larger than MAX_RESPONSE_BYTES (declared or streamed).
   */
  private async readCapped(res: Response, controller: AbortController): Promise<string> {
    const type = (res.headers.get("content-type") ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
    // A missing Content-Type is tolerated; a present, non-HTML/XML one is not.
    if (type !== "" && !ACCEPTED_CONTENT_TYPES.has(type)) {
      controller.abort();
      throw new HemmilesError("HTTP_ERROR", `Unexpected content type "${type}".`);
    }
    const declared = Number.parseInt(res.headers.get("content-length") ?? "", 10);
    if (!Number.isNaN(declared) && declared > MAX_RESPONSE_BYTES) {
      controller.abort();
      throw new HemmilesError("HTTP_ERROR", `Response too large (over ${MAX_RESPONSE_BYTES} bytes).`);
    }
    if (!res.body) return "";
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let total = 0;
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_RESPONSE_BYTES) {
        controller.abort();
        await reader.cancel().catch(() => undefined);
        throw new HemmilesError("HTTP_ERROR", `Response too large (over ${MAX_RESPONSE_BYTES} bytes).`);
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  }

  /** Follow redirects manually, validating each hop against the allowlist. */
  private async fetchFollowingRedirects(startUrl: string): Promise<FetchResult> {
    let current = assertAllowedUrl(startUrl).toString();
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await this.acquireSlot();
      const { res, controller, done } = await this.fetchOnce(current);
      try {
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

        const html = await this.readCapped(res, controller);
        return { url: current, status: res.status, html };
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          throw new HemmilesError("TIMEOUT", `Request to ${current} timed out after ${this.config.timeoutMs}ms.`);
        }
        throw error;
      } finally {
        done();
      }
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
    if (this.isKnownMissing(url)) {
      throw new HemmilesError("NOT_FOUND", `${url} returned HTTP 404 (cached).`, 404);
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
        if (error instanceof HemmilesError && error.code === "NOT_FOUND") this.setMissing(url);
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
    this.missing.clear();
  }
}
