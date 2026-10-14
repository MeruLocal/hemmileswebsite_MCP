/**
 * Request guards for the Streamable HTTP transport.
 *
 * - Host allowlist (DNS-rebinding protection) and Origin allowlist, checked
 *   BEFORE the request body is read. The SDK's own `allowedHosts` compares the
 *   raw Host header including the port and only runs after the body is read,
 *   so this module does its own hostname-only comparison.
 * - CORS headers for allowed browser origins.
 * - A fixed one-minute window rate limit per client IP.
 * - A request body cap.
 *
 * Everything is configurable through environment variables; see README and
 * `.env.example`.
 */

import type { IncomingMessage } from "node:http";

/** Maximum accepted request body, in bytes (1 MB). */
export const MAX_BODY_BYTES = 1024 * 1024;

export const DEFAULT_ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]", "::1", "mcp.hemmiles.com"];
export const DEFAULT_ALLOWED_ORIGINS = ["https://mcp.hemmiles.com"];
export const DEFAULT_RATE_LIMIT_PER_MINUTE = 60;

export const CORS_ALLOW_METHODS = "GET, POST, OPTIONS";
export const CORS_ALLOW_HEADERS =
  "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID";
export const CORS_EXPOSE_HEADERS = "Mcp-Session-Id, Mcp-Protocol-Version";

export interface HttpSecurityConfig {
  /** Lower-case hostnames, no port, no IPv6 brackets. */
  allowedHosts: string[];
  /** Lower-case origins (`scheme://host[:port]`). Loopback origins are always allowed. */
  allowedOrigins: string[];
  /** Requests per IP per minute on POST /mcp. 0 disables the limit. */
  rateLimitPerMinute: number;
  /**
   * Number of trusted proxy hops in front of this server. 0 = use the socket
   * address. N = the client IP is the X-Forwarded-For entry N from the right.
   */
  trustProxy: number;
  maxBodyBytes: number;
}

type Env = Record<string, string | undefined>;

function listEnv(env: Env, name: string, fallback: string[]): string[] {
  const raw = env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function stripBrackets(host: string): string {
  return host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
}

function normalizeOrigin(value: string): string | undefined {
  try {
    const u = new URL(value);
    if (u.protocol !== "http:" && u.protocol !== "https:") return undefined;
    return u.origin.toLowerCase();
  } catch {
    return undefined;
  }
}

/** `TRUST_PROXY`: a hop count; legacy `true`/`yes` mean 1; anything else is 0. */
export function parseTrustProxy(value: string): number {
  const v = value.trim().toLowerCase();
  if (v === "true" || v === "yes") return 1;
  if (!/^\d+$/.test(v)) return 0;
  const n = Number.parseInt(v, 10);
  return Number.isSafeInteger(n) ? Math.min(n, 16) : 0;
}

export function loadHttpSecurityConfig(env: Env = process.env): HttpSecurityConfig {
  const rawLimit = (env.MCP_RATE_LIMIT_PER_MINUTE ?? "").trim();
  const parsedLimit = Number.parseInt(rawLimit, 10);
  const rateLimitPerMinute =
    rawLimit === "" || Number.isNaN(parsedLimit) || parsedLimit < 0
      ? DEFAULT_RATE_LIMIT_PER_MINUTE
      : parsedLimit;
  const trust = (env.TRUST_PROXY ?? "").trim().toLowerCase();
  return {
    allowedHosts: [
      ...new Set(listEnv(env, "MCP_ALLOWED_HOSTS", DEFAULT_ALLOWED_HOSTS).map((h) => stripBrackets(h.toLowerCase()))),
    ],
    allowedOrigins: listEnv(env, "MCP_ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
      .map(normalizeOrigin)
      .filter((o): o is string => o !== undefined),
    rateLimitPerMinute,
    trustProxy: parseTrustProxy(trust),
    maxBodyBytes: MAX_BODY_BYTES,
  };
}

/** Hostname of a Host header, lower-case, without port or IPv6 brackets. */
export function hostnameOf(hostHeader: string | undefined): string | undefined {
  if (!hostHeader) return undefined;
  const h = hostHeader.trim().toLowerCase();
  if (h === "") return undefined;
  if (h.startsWith("[")) {
    const end = h.indexOf("]");
    return end === -1 ? undefined : h.slice(1, end);
  }
  // A bare IPv6 literal (more than one colon) has no port to strip.
  if (h.split(":").length > 2) return h;
  return h.split(":")[0] || undefined;
}

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function isHostAllowed(hostHeader: string | undefined, cfg: HttpSecurityConfig): boolean {
  const name = hostnameOf(hostHeader);
  return name !== undefined && cfg.allowedHosts.includes(name);
}

/**
 * A missing Origin (agents, curl, server-to-server) is allowed. A browser
 * Origin must be loopback on any port, or listed in `allowedOrigins`.
 */
export function isOriginAllowed(origin: string | undefined, cfg: HttpSecurityConfig): boolean {
  if (origin === undefined) return true;
  let u: URL;
  try {
    u = new URL(origin);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  if (LOOPBACK_HOSTS.has(stripBrackets(u.hostname.toLowerCase()))) return true;
  return cfg.allowedOrigins.includes(u.origin.toLowerCase());
}

/**
 * Client IP for rate limiting. With `trustedHops` = N the client is the
 * X-Forwarded-For entry at position `len - N` (counted from the right), so
 * entries a client forges on the left are ignored. Falls back to the socket
 * address when N is 0 or the header has fewer than N entries.
 */
export function clientIp(req: IncomingMessage, trustedHops: number): string {
  if (trustedHops > 0) {
    const xff = req.headers["x-forwarded-for"];
    const raw = Array.isArray(xff) ? xff.join(",") : xff;
    if (raw) {
      const hops = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (hops.length >= trustedHops) {
        const ip = hops[hops.length - trustedHops];
        if (ip) return ip;
      }
    }
  }
  return req.socket.remoteAddress ?? "unknown";
}

/** CORS response headers for an allowed, present Origin. */
export function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
    "Access-Control-Allow-Methods": CORS_ALLOW_METHODS,
    "Access-Control-Allow-Headers": CORS_ALLOW_HEADERS,
    "Access-Control-Expose-Headers": CORS_EXPOSE_HEADERS,
    "Access-Control-Max-Age": "600",
  };
}

export interface RateDecision {
  allowed: boolean;
  /** Seconds until the current window resets (only meaningful when not allowed). */
  retryAfterSeconds: number;
}

/** Fixed one-minute window counter per key, pruned when the map grows large. */
export class RateLimiter {
  private readonly windows = new Map<string, { start: number; count: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs = 60_000,
    private readonly maxKeys = 10_000,
  ) {}

  check(key: string, now: number = Date.now()): RateDecision {
    if (this.limit <= 0) return { allowed: true, retryAfterSeconds: 0 };
    let w = this.windows.get(key);
    if (!w || now - w.start >= this.windowMs) {
      if (!w && this.windows.size >= this.maxKeys) this.prune(now);
      w = { start: now, count: 0 };
      this.windows.set(key, w);
    }
    w.count++;
    if (w.count <= this.limit) return { allowed: true, retryAfterSeconds: 0 };
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((w.start + this.windowMs - now) / 1000)) };
  }

  get size(): number {
    return this.windows.size;
  }

  private prune(now: number): void {
    for (const [k, w] of this.windows) {
      if (now - w.start >= this.windowMs) this.windows.delete(k);
    }
    // Still full of live windows: drop everything rather than grow unbounded.
    if (this.windows.size >= this.maxKeys) this.windows.clear();
  }
}

export class BodyTooLargeError extends Error {
  constructor(readonly via: "content-length" | "stream" = "stream") {
    super("Request body too large.");
    this.name = "BodyTooLargeError";
  }
}

/**
 * Read a request body, rejecting early on Content-Length and again while
 * streaming if the byte count crosses `maxBytes`.
 */
export async function readBody(req: IncomingMessage, maxBytes: number): Promise<Buffer> {
  const declared = Number.parseInt(String(req.headers["content-length"] ?? ""), 10);
  if (!Number.isNaN(declared) && declared > maxBytes) throw new BodyTooLargeError("content-length");
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = chunk as Buffer;
    total += buf.length;
    if (total > maxBytes) throw new BodyTooLargeError("stream");
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
}
