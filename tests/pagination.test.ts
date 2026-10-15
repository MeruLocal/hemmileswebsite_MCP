import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.ts";
import type { HemmilesClient } from "../src/services/hemmiles-client.ts";
import type { SitemapService } from "../src/services/sitemap.ts";
import type { ToolContext } from "../src/tools/index.ts";
import { paginate, pageLine } from "../src/tools/helpers.ts";
import { connect } from "./mcp-helpers.ts";

const PAGES = [
  ...Array.from({ length: 40 }, (_, i) => ({ path: `guides/g${String(i).padStart(2, "0")}`, section: "guides" })),
  ...Array.from({ length: 5 }, (_, i) => ({ path: `blog/b${i}`, section: "blog" })),
];

function ctx(): ToolContext {
  const client = { fetchHtml: async () => { throw new Error("no network"); } } as unknown as HemmilesClient;
  const sitemap = { getCanonicalPages: async () => PAGES } as unknown as SitemapService;
  return { client, sitemap, config: { ...loadConfig(), defaultLocale: "global" } };
}

async function call(name: string, args: Record<string, unknown>) {
  const { client, close } = await connect(ctx());
  try {
    const res = await client.callTool({ name, arguments: { response_format: "json", ...args } });
    assert.notEqual(res.isError, true, JSON.stringify(res.content));
    return res.structuredContent as {
      total: number; count: number; offset: number; has_more: boolean; next_offset?: number;
      sections?: string[]; pages: Array<{ path: string; url: string }>;
    };
  } finally {
    await close();
  }
}

test("list_pages default returns 20 with has_more and next_offset 20", async () => {
  const out = await call("hemmiles_list_pages", {});
  assert.equal(out.total, 45);
  assert.equal(out.count, 20);
  assert.equal(out.offset, 0);
  assert.equal(out.has_more, true);
  assert.equal(out.next_offset, 20);
  assert.deepEqual(out.sections, ["blog", "guides"], "sections lists every section");
  assert.match(out.pages[0]!.url, /utm_campaign=hemmiles_list_pages/);
  assert.doesNotMatch(out.pages[0]!.path, /utm_/, "path fields are not tagged");
});

test("list_pages offset 40 returns the last 5 and has_more false", async () => {
  const out = await call("hemmiles_list_pages", { offset: 40 });
  assert.equal(out.count, 5);
  assert.equal(out.has_more, false);
  assert.equal(out.next_offset, undefined);
});

test("list_resources paginates too", async () => {
  const out = await call("hemmiles_list_resources", { kind: "guides", limit: 15, offset: 30 });
  assert.equal(out.total, 40);
  assert.equal(out.count, 10);
  assert.equal(out.has_more, false);
  const first = await call("hemmiles_list_resources", {});
  assert.equal(first.count, 20);
  assert.equal(first.next_offset, 20);
});

test("paginate(): bounds, empty input, offset past the end", () => {
  assert.deepEqual(paginate([], 0, 20), { rows: [], total: 0, offset: 0, count: 0, has_more: false });
  const p = paginate([1, 2, 3, 4, 5], 2, 2);
  assert.deepEqual(p.rows, [3, 4]);
  assert.equal(p.next_offset, 4);
  const end = paginate([1, 2, 3], 10, 5);
  assert.equal(end.count, 0);
  assert.equal(end.has_more, false);
  assert.equal(pageLine(paginate([1, 2, 3], 0, 2)), "Showing 1–2 of 3. Use offset=2 for more.");
  assert.equal(pageLine(paginate([], 0, 2)), "Showing 0 of 0.");
  assert.equal(pageLine(paginate([1, 2, 3], 10, 2)), "Showing 0 of 3.");
});
