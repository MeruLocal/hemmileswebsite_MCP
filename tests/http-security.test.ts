import { test } from "node:test";
import assert from "node:assert/strict";
import type { IncomingMessage } from "node:http";
import {
  DEFAULT_RATE_LIMIT_PER_MINUTE,
  RateLimiter,
  clientIp,
  hostnameOf,
  isHostAllowed,
  isOriginAllowed,
  loadHttpSecurityConfig,
} from "../src/http-security.ts";

test("defaults: loopback + mcp.hemmiles.com hosts, 60/min, no proxy trust", () => {
  const cfg = loadHttpSecurityConfig({});
  assert.deepEqual(cfg.allowedHosts.sort(), ["127.0.0.1", "::1", "localhost", "mcp.hemmiles.com"].sort());
  assert.deepEqual(cfg.allowedOrigins, ["https://mcp.hemmiles.com"]);
  assert.equal(cfg.rateLimitPerMinute, DEFAULT_RATE_LIMIT_PER_MINUTE);
  assert.equal(cfg.trustProxy, false);
  assert.equal(cfg.maxBodyBytes, 1024 * 1024);
});

test("env overrides", () => {
  const cfg = loadHttpSecurityConfig({
    MCP_ALLOWED_HOSTS: "Example.test, other.test",
    MCP_ALLOWED_ORIGINS: "https://app.example.test, not a url",
    MCP_RATE_LIMIT_PER_MINUTE: "0",
    TRUST_PROXY: "1",
  });
  assert.deepEqual(cfg.allowedHosts, ["example.test", "other.test"]);
  assert.deepEqual(cfg.allowedOrigins, ["https://app.example.test"]);
  assert.equal(cfg.rateLimitPerMinute, 0);
  assert.equal(cfg.trustProxy, true);
  assert.equal(loadHttpSecurityConfig({ MCP_RATE_LIMIT_PER_MINUTE: "-5" }).rateLimitPerMinute, 60);
});

test("hostnameOf strips port and IPv6 brackets", () => {
  assert.equal(hostnameOf("localhost:3001"), "localhost");
  assert.equal(hostnameOf("MCP.Hemmiles.com"), "mcp.hemmiles.com");
  assert.equal(hostnameOf("[::1]:3001"), "::1");
  assert.equal(hostnameOf("[::1]"), "::1");
  assert.equal(hostnameOf("::1"), "::1");
  assert.equal(hostnameOf(undefined), undefined);
  assert.equal(hostnameOf(""), undefined);
});

test("Host decisions", () => {
  const cfg = loadHttpSecurityConfig({});
  assert.equal(isHostAllowed("localhost:3001", cfg), true);
  assert.equal(isHostAllowed("[::1]:3001", cfg), true);
  assert.equal(isHostAllowed("mcp.hemmiles.com", cfg), true);
  assert.equal(isHostAllowed("evil.com", cfg), false);
  assert.equal(isHostAllowed("mcp.hemmiles.com.evil.com", cfg), false);
  assert.equal(isHostAllowed(undefined, cfg), false);
});

test("Origin decisions", () => {
  const cfg = loadHttpSecurityConfig({});
  assert.equal(isOriginAllowed(undefined, cfg), true);
  assert.equal(isOriginAllowed("http://localhost:6274", cfg), true);
  assert.equal(isOriginAllowed("http://127.0.0.1:9999", cfg), true);
  assert.equal(isOriginAllowed("http://[::1]:8080", cfg), true);
  assert.equal(isOriginAllowed("https://mcp.hemmiles.com", cfg), true);
  assert.equal(isOriginAllowed("http://localhost.evil.com", cfg), false);
  assert.equal(isOriginAllowed("https://evil.com", cfg), false);
  assert.equal(isOriginAllowed("null", cfg), false);
  assert.equal(isOriginAllowed("file://x", cfg), false);
});

function fakeReq(remote: string, xff?: string): IncomingMessage {
  return { headers: xff ? { "x-forwarded-for": xff } : {}, socket: { remoteAddress: remote } } as unknown as IncomingMessage;
}

test("clientIp uses the socket unless TRUST_PROXY, then the right-most XFF hop", () => {
  assert.equal(clientIp(fakeReq("10.0.0.1", "203.0.113.5, 198.51.100.7"), false), "10.0.0.1");
  assert.equal(clientIp(fakeReq("10.0.0.1", "203.0.113.5, 198.51.100.7"), true), "198.51.100.7");
  assert.equal(clientIp(fakeReq("10.0.0.1"), true), "10.0.0.1");
});

test("RateLimiter fixed window", () => {
  const rl = new RateLimiter(2, 60_000);
  assert.equal(rl.check("a", 0).allowed, true);
  assert.equal(rl.check("a", 1).allowed, true);
  const third = rl.check("a", 1000);
  assert.equal(third.allowed, false);
  assert.equal(third.retryAfterSeconds, 59);
  assert.equal(rl.check("b", 1000).allowed, true, "separate key, separate window");
  assert.equal(rl.check("a", 60_000).allowed, true, "window resets");
  assert.equal(new RateLimiter(0).check("x").allowed, true, "0 disables");
});

test("RateLimiter prunes when the key map is full", () => {
  const rl = new RateLimiter(5, 1000, 3);
  rl.check("a", 0);
  rl.check("b", 0);
  rl.check("c", 0);
  rl.check("d", 2000); // a, b, c expired -> pruned
  assert.equal(rl.size, 1);
});
