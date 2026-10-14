/**
 * hemmiles_get_pricing  (brief: get_product_price)
 *
 * Returns the published pricing plans for a market from the pricing page's
 * SoftwareApplication.offers JSON-LD. Prices vary by locale (e.g. INR for
 * /in, USD for /us), so the locale argument matters.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  localeSchema,
  responseFormatSchema,
  pricingSchema,
} from "../schemas/product.js";
import { buildUrl } from "../utils/validation.js";
import { withUtm } from "../utils/utm.js";
import { normalizePricing } from "../services/product-normalizer.js";
import {
  READ_ONLY_ANNOTATIONS,
  resolveLocale,
  runTool,
  success,
  type ToolContext,
} from "./helpers.js";

const Input = {
  locale: localeSchema.optional().describe("Market whose pricing to return (e.g. 'in' for INR, 'us' for USD)."),
  response_format: responseFormatSchema,
};

export function registerPricingTool(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "hemmiles_get_pricing",
    {
      title: "Get Hemmiles pricing",
      description: `Get Hemmiles subscription pricing for a market, parsed from the pricing page's schema.org Offer data.

Pricing is per user per month and varies by locale/currency (for example, India is billed in INR, the US in USD). Always pass the locale you care about.

Args:
  - locale (optional): market to price (default: server locale). One of global/in/us/gb/ca/au/nz/ie/sg/ae/za.
  - response_format ('markdown'|'json').

Returns JSON: { url, locale, currency, summary, plans: [{ id, name, price, priceCurrency, unit, description, url }] }.

Example: "How much is Hemmiles in India?" -> locale='in'.
Note: this reports the publicly displayed list price only; it does not include negotiated, annual-discount, or promotional pricing beyond what the page states.`,
      inputSchema: Input,
      outputSchema: pricingSchema.shape,
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) =>
      runTool(async () => {
        const locale = resolveLocale(ctx, args.locale);
        const url = buildUrl("pricing", locale);
        const res = await ctx.client.fetchHtml(url);
        const raw = normalizePricing(res.html, res.url, locale);
        // Tag clickable own-site URLs only; prices and plan data are untouched.
        const pricing = {
          ...raw,
          url: withUtm(raw.url, "hemmiles_get_pricing"),
          plans: raw.plans.map((p) => (p.url !== undefined ? { ...p, url: withUtm(p.url, "hemmiles_get_pricing") } : p)),
        };
        const structured = pricing as unknown as Record<string, unknown>;

        const md =
          pricing.plans.length === 0
            ? [
                `# Hemmiles pricing (${locale})`,
                "",
                "No machine-readable pricing plans were found in the page's structured data.",
                `See the pricing page directly: ${pricing.url}`,
              ].join("\n")
            : [
                `# Hemmiles pricing (${locale})`,
                pricing.summary ? `\n${pricing.summary}\n` : "",
                ...pricing.plans.map((p) => {
                  const priceLine =
                    p.price !== undefined
                      ? `${p.priceCurrency ?? ""} ${p.price}${p.unit ? ` ${p.unit}` : ""}`.trim()
                      : "See page";
                  const users =
                    p.minUsers !== undefined || p.maxUsers !== undefined
                      ? `- **Users:** ${p.minUsers ?? 1}${p.maxUsers ? `–${p.maxUsers}` : "+"}`
                      : "";
                  const billing =
                    p.billing && p.billing.length > 1
                      ? `- **Billing options:** ${p.billing
                          .map((b) => `${b.name ?? "plan"} ${b.priceCurrency ?? ""} ${b.price ?? "?"}`.trim())
                          .join("; ")}`
                      : "";
                  return [
                    `## ${p.name ?? p.id ?? "Plan"}`,
                    `- **Price:** ${priceLine}`,
                    users,
                    billing,
                    p.description ? `- ${p.description}` : "",
                  ]
                    .filter(Boolean)
                    .join("\n");
                }),
                "",
                `Source: ${pricing.url}`,
              ]
                .filter((l) => l !== "")
                .join("\n");

        return success(structured, md, args.response_format);
      }),
  );
}
