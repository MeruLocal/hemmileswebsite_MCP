/**
 * MCP resources: stable, citable read-only documents an assistant can attach as
 * context. Each resource is built live from the same hemmiles.com JSON-LD the
 * tools use, so nothing is hard-coded and nothing can drift from the website.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LOCALES } from "./constants.js";
import { buildUrl, isLocale } from "./utils/validation.js";
import {
  normalizeCompany,
  normalizeFaqs,
  normalizeFeatureList,
  normalizePricing,
} from "./services/product-normalizer.js";
import type { ToolContext } from "./tools/helpers.js";

const JSON_MIME = "application/json";

function asContents(uri: URL, body: unknown) {
  return { contents: [{ uri: uri.href, mimeType: JSON_MIME, text: JSON.stringify(body, null, 2) }] };
}

function localeFrom(value: string | string[] | undefined, fallback: string): string {
  const v = Array.isArray(value) ? value[0] : value;
  return v && isLocale(v) ? v : fallback;
}

export function registerResources(server: McpServer, ctx: ToolContext): void {
  const localeList = () => ({
    resources: LOCALES.map((l) => ({ uri: `hemmiles://pricing/${l}`, name: `Hemmiles pricing (${l})` })),
  });

  server.registerResource(
    "pricing",
    new ResourceTemplate("hemmiles://pricing/{locale}", { list: localeList }),
    {
      title: "Hemmiles pricing by market",
      description: "Published plans, user limits and billing options for one market, from the pricing page JSON-LD. Cite the returned url.",
      mimeType: JSON_MIME,
    },
    async (uri, vars) => {
      const locale = localeFrom(vars.locale, ctx.config.defaultLocale);
      const res = await ctx.client.fetchHtml(buildUrl("pricing", locale as never));
      return asContents(uri, normalizePricing(res.html, res.url, locale));
    },
  );

  server.registerResource(
    "pricing-faqs",
    new ResourceTemplate("hemmiles://faqs/pricing/{locale}", {
      list: () => ({
        resources: LOCALES.map((l) => ({ uri: `hemmiles://faqs/pricing/${l}`, name: `Hemmiles pricing FAQs (${l})` })),
      }),
    }),
    {
      title: "Hemmiles pricing FAQs",
      description: "Who counts as a user, minimums, trial, annual discount and tax treatment, from the pricing page FAQPage JSON-LD.",
      mimeType: JSON_MIME,
    },
    async (uri, vars) => {
      const locale = localeFrom(vars.locale, ctx.config.defaultLocale);
      const res = await ctx.client.fetchHtml(buildUrl("pricing", locale as never));
      return asContents(uri, { url: res.url, faqs: normalizeFaqs(res.html) });
    },
  );

  server.registerResource(
    "features",
    "hemmiles://features",
    {
      title: "Hemmiles feature list",
      description: "The product's capabilities as published in the SoftwareApplication feature list.",
      mimeType: JSON_MIME,
    },
    async (uri) => {
      const res = await ctx.client.fetchHtml(buildUrl("", ctx.config.defaultLocale));
      return asContents(uri, { url: res.url, features: normalizeFeatureList(res.html) });
    },
  );

  server.registerResource(
    "company",
    "hemmiles://company",
    {
      title: "Hemmiles company and contact",
      description: "Organization JSON-LD: name, site, logo, support email and contact points.",
      mimeType: JSON_MIME,
    },
    async (uri) => {
      const res = await ctx.client.fetchHtml(buildUrl("", ctx.config.defaultLocale));
      return asContents(uri, normalizeCompany(res.html));
    },
  );
}
