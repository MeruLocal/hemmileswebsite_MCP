/**
 * hemmiles_list_features  (brief: get_featured_products / list_categories)
 *
 * Returns the product's advertised capabilities from SoftwareApplication
 * .featureList (schema.org JSON-LD), linked to their dedicated feature pages
 * where one exists in the sitemap.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { localeSchema, responseFormatSchema } from "../schemas/product.js";
import { buildUrl } from "../utils/validation.js";
import { normalizeFeatureList } from "../services/product-normalizer.js";
import {
  READ_ONLY_ANNOTATIONS,
  resolveLocale,
  runTool,
  success,
  type ToolContext,
} from "./helpers.js";

const Input = {
  locale: localeSchema.optional(),
  response_format: responseFormatSchema,
};

function featureSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function registerFeatureTools(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "hemmiles_list_features",
    {
      title: "List Hemmiles product features",
      description: `List the Hemmiles product's capabilities (the "featured" items on a SaaS site), taken from the site's SoftwareApplication JSON-LD feature list and linked to each feature's dedicated page when one exists.

Args:
  - locale (optional): market whose feature-page URLs to return (default: server locale).
  - response_format ('markdown'|'json').

Returns JSON: { total, features: [{ name, url? }] }.
Typical features include Visit planning, Route planning, GPS check-in, Photos & notes, Follow-ups, Offline mode, Manager dashboard, Reports.

Example: "What can Hemmiles do?" / "List Hemmiles features".`,
      inputSchema: Input,
      outputSchema: {
        total: z.number(),
        features: z.array(z.object({ name: z.string(), url: z.string().optional() })),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) =>
      runTool(async () => {
        const locale = resolveLocale(ctx, args.locale);

        // The SoftwareApplication node appears on content pages; /features is
        // the natural source. Fall back to /product, then to sitemap pages.
        let names: string[] = [];
        for (const path of ["features", "product", "pricing"]) {
          try {
            const res = await ctx.client.fetchHtml(buildUrl(path, locale));
            names = normalizeFeatureList(res.html);
            if (names.length) break;
          } catch {
            // try next source
          }
        }

        const canonical = await ctx.sitemap.getCanonicalPages();
        const featurePaths = new Set(canonical.filter((p) => p.section === "features").map((p) => p.path));

        if (names.length === 0) {
          // Fallback: derive feature names from feature subpages.
          names = [...featurePaths]
            .filter((p) => p.startsWith("features/"))
            .map((p) =>
              p
                .substring("features/".length)
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()),
            );
        }

        const features = names.map((name) => {
          const slugPath = `features/${featureSlug(name)}`;
          const entry: { name: string; url?: string } = { name };
          if (featurePaths.has(slugPath)) entry.url = buildUrl(slugPath, locale);
          return entry;
        });

        const structured = { total: features.length, features };
        const md = [
          `# Hemmiles features (${locale})`,
          "",
          ...features.map((f) => (f.url ? `- [${f.name}](${f.url})` : `- ${f.name}`)),
        ].join("\n");

        return success(structured, md, args.response_format);
      }),
  );
}
