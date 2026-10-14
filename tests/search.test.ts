import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.ts";
import type { HemmilesClient, FetchResult } from "../src/services/hemmiles-client.ts";
import type { SitemapService } from "../src/services/sitemap.ts";
import type { ToolContext } from "../src/tools/index.ts";
import { DEFAULT_DEEP_FETCH, MAX_SEARCH_FETCH } from "../src/constants.ts";
import { connect } from "./mcp-helpers.ts";

const PAGES = Array.from({ length: 30 }, (_, i) => ({ path: `guides/page-${i}`, section: "guides" }));

function html(i: number): string {
  return `<html><head><title>Page ${i}</title><meta name="description" content="About routes ${i}"></head><body><main><p>Offline routes for field teams, page ${i}.</p></main></body></html>`;
}

function stub(preCached: string[] = []) {
  const cache = new Map<string, FetchResult>();
  for (const url of preCached) {
    const i = Number(url.split("page-")[1]);
    cache.set(url, { url, status: 200, html: html(i) });
  }
  const calls: string[] = [];
  const client = {
    peekCached: (url: string) => cache.get(url),
    async fetchHtml(url: string): Promise<FetchResult> {
      calls.push(url);
      const i = Number(url.split("page-")[1]);
      return { url, status: 200, html: html(i) };
    },
  } as unknown as HemmilesClient;
  const sitemap = { getCanonicalPages: async () => PAGES } as unknown as SitemapService;
  const ctx: ToolContext = { client, sitemap, config: { ...loadConfig(), defaultLocale: "global" } };
  return { ctx, calls };
}

async function search(ctx: ToolContext, args: Record<string, unknown>) {
  const { client, close } = await connect(ctx);
  try {
    const res = await client.callTool({ name: "hemmiles_search_site", arguments: { response_format: "json", ...args } });
    return res.structuredContent as { total: number; count: number; has_more: boolean; next_offset?: number; results: Array<{ score: number; path: string; title?: string }> };
  } finally {
    await close();
  }
}

test("default deep search fetches at most DEFAULT_DEEP_FETCH (8) pages", async () => {
  const { ctx, calls } = stub();
  const out = await search(ctx, { query: "offline" });
  assert.equal(DEFAULT_DEEP_FETCH, 8);
  assert.ok(calls.length <= 8, `fetched ${calls.length}`);
  assert.equal(calls.length, 8);
  assert.equal(out.total, 8, "only fetched pages can match body text");
});

test("max_pages: 24 fetches at most 24; above the hard cap is rejected", async () => {
  const { ctx, calls } = stub();
  await search(ctx, { query: "offline", max_pages: 24 });
  assert.equal(calls.length, MAX_SEARCH_FETCH);
  const { ctx: ctx2 } = stub();
  const { client, close } = await connect(ctx2);
  try {
    const res = await client.callTool({ name: "hemmiles_search_site", arguments: { query: "offline", max_pages: 25 } });
    assert.equal(res.isError, true);
  } finally {
    await close();
  }
});

test("cached pages are scored without counting toward the budget", async () => {
  const cachedUrls = PAGES.slice(20, 30).map((p) => `https://hemmiles.com/${p.path}`);
  const { ctx, calls } = stub(cachedUrls);
  const out = await search(ctx, { query: "offline", max_pages: 2, limit: 50 });
  assert.equal(calls.length, 2, "only 2 uncached fetches");
  assert.ok(!calls.some((u) => cachedUrls.includes(u)), "cached pages are never fetched");
  assert.equal(out.total, 12, "10 cached + 2 fetched pages matched");
});

test("results stay ranked and paginated", async () => {
  const { ctx } = stub();
  const out = await search(ctx, { query: "offline", limit: 3, offset: 0 });
  assert.equal(out.count, 3);
  assert.equal(out.has_more, true);
  assert.equal(out.next_offset, 3);
  for (let i = 1; i < out.results.length; i++) {
    assert.ok(out.results[i - 1]!.score >= out.results[i]!.score);
  }
  const slugOnly = await search(stub().ctx, { query: "page", deep: false });
  assert.equal(slugOnly.total, 30, "slug-only search still matches every page by slug");
});
