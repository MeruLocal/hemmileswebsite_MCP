import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assertAllowedUrl,
  buildUrl,
  isAllowedHost,
  isDisallowedPath,
  isLocale,
  normalizeToPath,
  stripLocale,
} from "../src/utils/validation.ts";
import { HemmilesError } from "../src/utils/errors.ts";

test("isAllowedHost accepts hemmiles.com and subdomains only", () => {
  assert.equal(isAllowedHost("hemmiles.com"), true);
  assert.equal(isAllowedHost("www.hemmiles.com"), true);
  assert.equal(isAllowedHost("evil.com"), false);
  assert.equal(isAllowedHost("hemmiles.com.evil.com"), false);
});

test("isDisallowedPath blocks /api per robots.txt", () => {
  assert.equal(isDisallowedPath("/api/products"), true);
  assert.equal(isDisallowedPath("/api"), true);
  assert.equal(isDisallowedPath("/pricing"), false);
});

test("assertAllowedUrl rejects non-https, wrong host, and /api", () => {
  assert.throws(() => assertAllowedUrl("http://hemmiles.com/"), (e) => e instanceof HemmilesError && e.code === "INVALID_URL");
  assert.throws(() => assertAllowedUrl("https://evil.com/"), (e) => e instanceof HemmilesError && e.code === "INVALID_URL");
  assert.throws(() => assertAllowedUrl("https://hemmiles.com/api/x"), (e) => e instanceof HemmilesError && e.code === "DISALLOWED_PATH");
  assert.ok(assertAllowedUrl("https://hemmiles.com/in/pricing") instanceof URL);
});

test("normalizeToPath handles paths and full URLs", () => {
  assert.equal(normalizeToPath("pricing"), "/pricing");
  assert.equal(normalizeToPath("/pricing"), "/pricing");
  assert.equal(normalizeToPath(""), "/");
  assert.equal(normalizeToPath("https://hemmiles.com/in/pricing"), "/in/pricing");
  assert.throws(() => normalizeToPath("/api/secret"), (e) => e instanceof HemmilesError);
});

test("buildUrl composes locale-aware URLs", () => {
  assert.equal(buildUrl("pricing", "in"), "https://hemmiles.com/in/pricing");
  assert.equal(buildUrl("pricing", "global"), "https://hemmiles.com/pricing");
  assert.equal(buildUrl("", "in"), "https://hemmiles.com/in");
  assert.equal(buildUrl("", "global"), "https://hemmiles.com");
});

test("stripLocale separates locale from canonical path", () => {
  assert.deepEqual(stripLocale("/in/pricing"), { locale: "in", path: "pricing" });
  assert.deepEqual(stripLocale("/pricing"), { locale: null, path: "pricing" });
  assert.deepEqual(stripLocale("/in/features/gps-check-in"), { locale: "in", path: "features/gps-check-in" });
});

test("isLocale validates known markets", () => {
  assert.equal(isLocale("in"), true);
  assert.equal(isLocale("global"), true);
  assert.equal(isLocale("xx"), false);
});
