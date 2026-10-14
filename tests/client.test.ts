import { test } from "node:test";
import assert from "node:assert/strict";
import { HemmilesClient } from "../src/services/hemmiles-client.ts";
import { HemmilesError } from "../src/utils/errors.ts";
import { loadConfig } from "../src/config.ts";

function client(): HemmilesClient {
  return new HemmilesClient({ ...loadConfig(), maxRetries: 0, minRequestIntervalMs: 0, cacheTtlMs: 0 });
}

test("fetchHtml rejects non-allowlisted hosts before any network call", async () => {
  await assert.rejects(
    () => client().fetchHtml("https://evil.example.com/"),
    (e) => e instanceof HemmilesError && e.code === "INVALID_URL",
  );
});

test("fetchHtml rejects http (non-https)", async () => {
  await assert.rejects(
    () => client().fetchHtml("http://hemmiles.com/"),
    (e) => e instanceof HemmilesError && e.code === "INVALID_URL",
  );
});

test("fetchHtml refuses robots-disallowed /api paths", async () => {
  await assert.rejects(
    () => client().fetchHtml("https://hemmiles.com/api/internal"),
    (e) => e instanceof HemmilesError && e.code === "DISALLOWED_PATH",
  );
});
