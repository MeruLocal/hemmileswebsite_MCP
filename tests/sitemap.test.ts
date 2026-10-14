import { test } from "node:test";
import assert from "node:assert/strict";
import { SitemapService } from "../src/services/sitemap.ts";
import type { HemmilesClient } from "../src/services/hemmiles-client.ts";
import { SITEMAP_PAGES_XML } from "./fixtures.ts";

function countingClient() {
  let calls = 0;
  const client = {
    async fetchHtml(url: string) {
      calls++;
      return { url, status: 200, html: SITEMAP_PAGES_XML };
    },
  } as unknown as HemmilesClient;
  return { client, calls: () => calls };
}

test("TTL 0 disables the sitemap cache: two getEntries() fetch twice", async () => {
  const { client, calls } = countingClient();
  const svc = new SitemapService(client, 0);
  await svc.getEntries();
  await svc.getEntries();
  assert.equal(calls(), 2);
});

test("TTL > 0 caches the sitemap: two getEntries() fetch once", async () => {
  const { client, calls } = countingClient();
  const svc = new SitemapService(client, 60_000);
  const a = await svc.getEntries();
  await svc.getEntries();
  assert.equal(calls(), 1);
  assert.ok(a.length > 0);
});

test("TTL 0 does not cache the fallback list either", async () => {
  let calls = 0;
  const failing = {
    async fetchHtml() {
      calls++;
      throw new Error("offline");
    },
  } as unknown as HemmilesClient;
  const svc = new SitemapService(failing, 0);
  const a = await svc.getEntries();
  await svc.getEntries();
  assert.equal(calls, 2);
  assert.ok(a.length > 0, "fallback KNOWN_PAGES are returned");
});

test("createToolContext passes TTL 0 through (no silent 5-minute default)", async () => {
  const { createToolContext } = await import("../src/server.ts");
  const { loadConfig } = await import("../src/config.ts");
  const ctx = createToolContext({ ...loadConfig(), cacheTtlMs: 0 });
  assert.equal((ctx.sitemap as unknown as { ttlMs: number }).ttlMs, 0);
});
