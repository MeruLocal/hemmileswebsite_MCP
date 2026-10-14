import { test } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../src/config.ts";
import type { HemmilesClient } from "../src/services/hemmiles-client.ts";
import type { SitemapService } from "../src/services/sitemap.ts";
import type { ToolContext } from "../src/tools/index.ts";
import { connect } from "./mcp-helpers.ts";
import { PRICING_FIXTURE_HTML } from "./fixtures.ts";

function ctx(): ToolContext {
  const client = {
    async fetchHtml(url: string) {
      return { url, status: 200, html: PRICING_FIXTURE_HTML };
    },
    peekCached: () => undefined,
  } as unknown as HemmilesClient;
  const sitemap = { getCanonicalPages: async () => [] } as unknown as SitemapService;
  return { client, sitemap, config: { ...loadConfig(), defaultLocale: "in" } };
}

test("hemmiles_get_started is listed with read-only annotations", async () => {
  const { client, close } = await connect(ctx());
  try {
    const { tools } = await client.listTools();
    const t = tools.find((x) => x.name === "hemmiles_get_started");
    assert.ok(t);
    assert.equal(t!.annotations?.readOnlyHint, true);
    assert.equal(t!.annotations?.destructiveHint, false);
    assert.equal(tools.length, 11);
  } finally {
    await close();
  }
});

test("hemmiles_get_started returns UTM-tagged demo/contact/pricing and signupUrl null", async () => {
  const { client, close } = await connect(ctx());
  try {
    const res = await client.callTool({ name: "hemmiles_get_started", arguments: { response_format: "json" } });
    assert.notEqual(res.isError, true);
    const s = res.structuredContent as Record<string, unknown>;
    for (const key of ["demoUrl", "contactUrl", "pricingUrl", "salesContactUrl"]) {
      const u = new URL(s[key] as string);
      assert.equal(u.hostname, "hemmiles.com", key);
      assert.equal(u.searchParams.get("utm_source"), "mcp", key);
      assert.equal(u.searchParams.get("utm_campaign"), "hemmiles_get_started", key);
    }
    assert.match(s.demoUrl as string, /^https:\/\/hemmiles\.com\/in\/demo\?/);
    assert.equal(s.signupUrl, null);
    assert.equal(typeof s.callToAction, "string");
    assert.equal(typeof s.note, "string");
  } finally {
    await close();
  }
});

test("contact options use their own campaign; company sameAs and email stay untagged", async () => {
  const { client, close } = await connect(ctx());
  try {
    const contact = await client.callTool({ name: "hemmiles_get_contact_options", arguments: { response_format: "json" } });
    const c = contact.structuredContent as Record<string, string>;
    assert.equal(new URL(c.demoUrl!).searchParams.get("utm_campaign"), "hemmiles_get_contact_options");
    assert.doesNotMatch(c.email ?? "", /utm_/);

    const company = await client.callTool({ name: "hemmiles_get_company_info", arguments: { response_format: "json" } });
    const co = company.structuredContent as { url?: string; sameAs?: string[]; logo?: string };
    assert.equal(new URL(co.url!).searchParams.get("utm_campaign"), "hemmiles_get_company_info");
    assert.ok(co.sameAs!.every((u) => !u.includes("utm_")), "external profiles are not tagged");
    assert.doesNotMatch(co.logo ?? "", /utm_/, "logo is an asset, not a link");
  } finally {
    await close();
  }
});

test("pricing: page URL tagged, prices unchanged", async () => {
  const { client, close } = await connect(ctx());
  try {
    const res = await client.callTool({ name: "hemmiles_get_pricing", arguments: { response_format: "json" } });
    const s = res.structuredContent as { url: string; plans: Array<{ price?: string; url?: string }> };
    assert.equal(new URL(s.url).searchParams.get("utm_campaign"), "hemmiles_get_pricing");
    assert.deepEqual(s.plans.map((p) => p.price), ["3500", "4500", "8000"]);
  } finally {
    await close();
  }
});
