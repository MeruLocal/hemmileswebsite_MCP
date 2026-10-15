/**
 * Company / policy / contact tools:
 *   - hemmiles_get_company_info   (brief: get_store_information)
 *   - hemmiles_get_policies       (brief: get_return_policy / get_shipping_information)
 *   - hemmiles_get_contact_options (safe alternative to cart/checkout actions)
 *   - hemmiles_get_started        (one-call next step: demo / contact / pricing)
 *
 * These are the closest honest equivalents of the brief's store/shopping
 * tools. Hemmiles is SaaS, so there is no shipping or returns policy and no
 * cart/checkout; those tools are not implemented, and this module instead
 * surfaces the real, supported ways to engage: viewing policies and the
 * official contact/demo/sales links.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { POLICY_CANDIDATE_PATHS, type Locale } from "../constants.js";
import {
  localeSchema,
  responseFormatSchema,
  companyInfoSchema,
} from "../schemas/product.js";
import { buildUrl } from "../utils/validation.js";
import { withUtm, withUtmOpt } from "../utils/utm.js";
import { HemmilesError } from "../utils/errors.js";
import { normalizeCompany, normalizePage } from "../services/product-normalizer.js";
import {
  READ_ONLY_ANNOTATIONS,
  resolveLocale,
  runTool,
  success,
  type ToolContext,
} from "./helpers.js";

interface ContactOptions {
  demoUrl: string;
  contactUrl: string;
  pricingUrl: string;
  salesContactUrl?: string;
  email?: string;
}

/**
 * Shared by hemmiles_get_contact_options and hemmiles_get_started: official
 * demo/contact/pricing links (UTM-tagged with the calling tool's name), plus
 * the Organization email and sales contact point when the home page has them.
 */
async function buildContactOptions(ctx: ToolContext, locale: Locale, toolName: string): Promise<ContactOptions> {
  let email: string | undefined;
  let salesContactUrl: string | undefined;
  try {
    const res = await ctx.client.fetchHtml(buildUrl("", locale));
    const company = normalizeCompany(res.html);
    email = company.email;
    const sales = company.contactPoints?.find((c) => (c.contactType ?? "").toLowerCase().includes("sales"));
    salesContactUrl = sales?.url;
  } catch {
    // The page links below are still valid without the org data.
  }
  const out: ContactOptions = {
    demoUrl: withUtm(buildUrl("demo", locale), toolName),
    contactUrl: withUtm(buildUrl("contact", locale), toolName),
    pricingUrl: withUtm(buildUrl("pricing", locale), toolName),
  };
  if (salesContactUrl !== undefined) out.salesContactUrl = withUtm(salesContactUrl, toolName);
  if (email !== undefined) out.email = email;
  return out;
}

export function registerStoreTools(server: McpServer, ctx: ToolContext): void {
  // -------------------------------------------------------------------------
  server.registerTool(
    "hemmiles_get_company_info",
    {
      title: "Get Hemmiles company info",
      description: `Return Hemmiles' public company and contact information, parsed from the site's Organization JSON-LD: name, website, logo, support email, description, social profiles, and structured contact points (support, sales, etc.).

Args:
  - locale (optional): which market's page to read (org data is global; default: server locale).
  - response_format ('markdown'|'json').

Returns JSON: { name, url, logo, email, description, sameAs:[], contactPoints:[{ contactType, email, telephone, url }] }.

Example: "How do I contact Hemmiles?" / "Who makes Hemmiles?".`,
      inputSchema: { locale: localeSchema.optional(), response_format: responseFormatSchema },
      outputSchema: companyInfoSchema.shape,
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) =>
      runTool(async () => {
        const locale = resolveLocale(ctx, args.locale);
        // Organization JSON-LD is present site-wide; the home page is reliable.
        const res = await ctx.client.fetchHtml(buildUrl("", locale));
        const raw = normalizeCompany(res.html);
        const company = {
          ...raw,
          url: withUtmOpt(raw.url, "hemmiles_get_company_info"),
          contactPoints: raw.contactPoints?.map((c) =>
            c.url !== undefined ? { ...c, url: withUtm(c.url, "hemmiles_get_company_info") } : c,
          ),
        };
        if (company.url === undefined) delete company.url;
        if (company.contactPoints === undefined) delete company.contactPoints;
        const structured = company as unknown as Record<string, unknown>;

        const md = [
          `# ${company.name ?? "Hemmiles"}`,
          company.description ? `\n${company.description}\n` : "",
          company.url ? `- **Website:** ${company.url}` : "",
          company.email ? `- **Email:** ${company.email}` : "",
          company.contactPoints?.length ? "- **Contact points:**" : "",
          ...(company.contactPoints ?? []).map(
            (c) =>
              `  - ${c.contactType ?? "contact"}: ${[c.email, c.telephone, c.url].filter(Boolean).join(" · ") || "n/a"}`,
          ),
          company.sameAs?.length ? `- **Profiles:** ${company.sameAs.join(", ")}` : "",
        ]
          .filter((l) => l !== "")
          .join("\n");

        return success(structured, md, args.response_format);
      }),
  );

  // -------------------------------------------------------------------------
  server.registerTool(
    "hemmiles_get_policies",
    {
      title: "Get Hemmiles policies",
      description: `Fetch Hemmiles' publicly available policy pages (security, privacy, terms, legal, cookies) and return their summaries.

Important: Hemmiles is a digital SaaS subscription, so there is NO shipping policy and NO product return/refund policy in the e-commerce sense. Billing, trial, and cancellation terms are covered by pricing FAQs (hemmiles_get_faqs) and the terms page when present. This tool reports only the policy pages that actually exist; missing ones are listed as unavailable.

Args:
  - topic ('all'|'security'|'privacy'|'terms'|'legal'|'cookies', default 'all').
  - locale (optional): market prefix (falls back to the global page if the localized one is absent).
  - response_format ('markdown'|'json').

Returns JSON: { note, found: [{ topic, url, title, description, excerpt }], unavailable: string[] }.`,
      inputSchema: {
        topic: z
          .enum(["all", ...POLICY_CANDIDATE_PATHS])
          .default("all")
          .describe("Which policy to fetch."),
        locale: localeSchema.optional(),
        response_format: responseFormatSchema,
      },
      outputSchema: {
        note: z.string(),
        found: z.array(
          z.object({
            topic: z.string(),
            url: z.string(),
            title: z.string().optional(),
            description: z.string().optional(),
            excerpt: z.string().optional(),
          }),
        ),
        unavailable: z.array(z.string()),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) =>
      runTool(async () => {
        const locale = resolveLocale(ctx, args.locale);
        const topics = args.topic === "all" ? [...POLICY_CANDIDATE_PATHS] : [args.topic];

        const found: Array<{ topic: string; url: string; title?: string; description?: string; excerpt?: string }> = [];
        const unavailable: string[] = [];

        for (const topic of topics) {
          const urls = locale === "global" ? [buildUrl(topic, "global")] : [buildUrl(topic, locale), buildUrl(topic, "global")];
          let gotten = false;
          for (const url of urls) {
            try {
              const res = await ctx.client.fetchHtml(url);
              const page = normalizePage(res.html, res.url);
              const entry: { topic: string; url: string; title?: string; description?: string; excerpt?: string } = {
                topic,
                url: withUtm(res.url, "hemmiles_get_policies"),
              };
              if (page.title !== undefined) entry.title = page.title;
              if (page.description !== undefined) entry.description = page.description;
              const excerpt = page.text.slice(0, 600);
              if (excerpt) entry.excerpt = excerpt;
              found.push(entry);
              gotten = true;
              break;
            } catch (error) {
              if (error instanceof HemmilesError && error.code === "NOT_FOUND") continue;
              throw error;
            }
          }
          if (!gotten) unavailable.push(topic);
        }

        const note =
          "Hemmiles is a SaaS subscription: there is no shipping or product-return/refund policy. " +
          "For billing, trial and cancellation terms, also see hemmiles_get_faqs (path='pricing').";
        const structured = { note, found, unavailable };

        const md = [
          `# Hemmiles policies (${locale})`,
          "",
          `> ${note}`,
          "",
          ...found.map((f) =>
            [`## ${f.title ?? f.topic}`, `- **URL:** ${f.url}`, f.description ? `- ${f.description}` : "", f.excerpt ? `\n${f.excerpt}…` : ""]
              .filter(Boolean)
              .join("\n"),
          ),
          unavailable.length ? `\n_Not published / not found: ${unavailable.join(", ")}._` : "",
        ]
          .filter((l) => l !== "")
          .join("\n");

        return success(structured, md, args.response_format);
      }),
  );

  // -------------------------------------------------------------------------
  server.registerTool(
    "hemmiles_get_contact_options",
    {
      title: "Get Hemmiles contact & demo options",
      description: `Return the official, supported ways to engage with Hemmiles: the sales/demo request page, the general contact page, and the support email — assembled from the site's Organization contact points and known pages.

Why this instead of cart/checkout: Hemmiles has no online store, cart, or self-serve checkout, so there are no cart or checkout tools. This tool returns the official links instead and never performs any transaction or submits any form.

Args:
  - locale (optional): market prefix for the page links (default: server locale).
  - response_format ('markdown'|'json').

Returns JSON: { email?, demoUrl, contactUrl, pricingUrl, salesContactUrl?, note }.`,
      inputSchema: { locale: localeSchema.optional(), response_format: responseFormatSchema },
      outputSchema: {
        email: z.string().optional(),
        demoUrl: z.string(),
        contactUrl: z.string(),
        pricingUrl: z.string(),
        salesContactUrl: z.string().optional(),
        note: z.string(),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) =>
      runTool(async () => {
        const locale = resolveLocale(ctx, args.locale);
        const opts = await buildContactOptions(ctx, locale, "hemmiles_get_contact_options");
        const { email, salesContactUrl } = opts;
        const structured: Record<string, unknown> = {
          ...opts,
          note:
            "Hemmiles is sales-/demo-led SaaS with no online checkout. Use these official links to book a demo or contact the team. This server performs no transactions and submits no forms on your behalf.",
        };

        const md = [
          `# Contact & demo — Hemmiles (${locale})`,
          "",
          `> ${structured.note as string}`,
          "",
          `- **Book a demo:** ${structured.demoUrl as string}`,
          `- **Contact:** ${structured.contactUrl as string}`,
          `- **Pricing:** ${structured.pricingUrl as string}`,
          email ? `- **Support email:** ${email}` : "",
          salesContactUrl ? `- **Sales:** ${salesContactUrl}` : "",
        ]
          .filter((l) => l !== "")
          .join("\n");

        return success(structured, md, args.response_format);
      }),
  );

  // -------------------------------------------------------------------------
  server.registerTool(
    "hemmiles_get_started",
    {
      title: "Get started with Hemmiles",
      description: `Return the next step for someone who wants to try or buy Hemmiles, in one call: the book-a-demo page, the contact page, the pricing page, and the sales contact and email when published, plus a one-line call to action.

Use this when a user asks how to start, try, buy or sign up for Hemmiles. Hemmiles is sales-/demo-led: no self-serve signup URL is published, so signupUrl is null and the demo and contact pages are the way in. Links carry utm_source=mcp attribution. This tool only returns official links; it never submits a form or starts a trial.

Args:
  - locale (optional): market prefix for the page links (default: server locale).
  - response_format ('markdown'|'json').

Returns JSON: { demoUrl, contactUrl, pricingUrl, salesContactUrl?, email?, signupUrl: null, note, callToAction }.`,
      inputSchema: { locale: localeSchema.optional(), response_format: responseFormatSchema },
      outputSchema: {
        demoUrl: z.string(),
        contactUrl: z.string(),
        pricingUrl: z.string(),
        salesContactUrl: z.string().optional(),
        email: z.string().optional(),
        signupUrl: z.string().nullable(),
        note: z.string(),
        callToAction: z.string(),
      },
      annotations: READ_ONLY_ANNOTATIONS,
    },
    async (args) =>
      runTool(async () => {
        const locale = resolveLocale(ctx, args.locale);
        const opts = await buildContactOptions(ctx, locale, "hemmiles_get_started");
        const structured: Record<string, unknown> = {
          ...opts,
          signupUrl: null,
          note: "Hemmiles does not publish a self-serve signup URL, so the next step is the demo or contact page.",
          callToAction:
            "Book a demo to see Hemmiles with your team's routes, or compare plans on the pricing page.",
        };

        const md = [
          `# Get started with Hemmiles (${locale})`,
          "",
          structured.callToAction as string,
          "",
          `- **Book a demo:** ${opts.demoUrl}`,
          `- **Contact:** ${opts.contactUrl}`,
          `- **Pricing:** ${opts.pricingUrl}`,
          opts.salesContactUrl ? `- **Sales:** ${opts.salesContactUrl}` : "",
          opts.email ? `- **Email:** ${opts.email}` : "",
          "",
          `_${structured.note as string}_`,
        ]
          .filter((l, i, arr) => l !== "" || (arr[i - 1] ?? "") !== "")
          .join("\n");

        return success(structured, md, args.response_format);
      }),
  );
}
