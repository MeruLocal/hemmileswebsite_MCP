/**
 * Zod schemas: shared input fragments and the normalized output shapes that
 * every tool returns. Output objects are intentionally lenient (most fields
 * optional) so that structuredContent always validates even when a given page
 * omits some metadata.
 */

import { z } from "zod";
import { LOCALES } from "../constants.js";

/** Output format shared by all tools. */
export const ResponseFormat = {
  MARKDOWN: "markdown",
  JSON: "json",
} as const;

export const responseFormatSchema = z
  .enum([ResponseFormat.MARKDOWN, ResponseFormat.JSON])
  .default(ResponseFormat.MARKDOWN)
  .describe("Output format: 'markdown' (human-readable) or 'json' (structured).");

export const localeSchema = z
  .enum(LOCALES as unknown as [string, ...string[]])
  .describe(
    "Market locale/region. One of: " +
      LOCALES.join(", ") +
      ". 'global' uses the locale-less canonical pages. Defaults to the server's configured locale.",
  );

export const limitSchema = z
  .number()
  .int()
  .min(1)
  .max(50)
  .default(20)
  .describe("Maximum number of results to return (1–50).");

export const offsetSchema = z
  .number()
  .int()
  .min(0)
  .default(0)
  .describe("Number of results to skip, for pagination.");

// ---------------------------------------------------------------------------
// Normalized output object shapes (reused as structuredContent)
// ---------------------------------------------------------------------------

export const pageSummarySchema = z.object({
  url: z.string(),
  path: z.string(),
  section: z.string(),
  locale: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const normalizedPageSchema = z.object({
  url: z.string(),
  path: z.string(),
  locale: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  headings: z.array(z.object({ level: z.number(), text: z.string() })).optional(),
  breadcrumbs: z.array(z.string()).optional(),
  jsonldTypes: z.array(z.string()).optional(),
  links: z.array(z.object({ text: z.string(), href: z.string() })).optional(),
  text: z.string().optional(),
});

export const billingOptionSchema = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  priceCurrency: z.string().optional(),
  unitText: z.string().optional(),
});

export const offerSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  price: z.string().optional(),
  priceCurrency: z.string().optional(),
  unit: z.string().optional(),
  availability: z.string().optional(),
  minUsers: z.number().optional(),
  maxUsers: z.number().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  billing: z.array(billingOptionSchema).optional(),
});

export const pricingSchema = z.object({
  url: z.string(),
  locale: z.string(),
  currency: z.string().optional(),
  summary: z.string().optional(),
  plans: z.array(offerSchema),
});

export const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const companyInfoSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  logo: z.string().optional(),
  email: z.string().optional(),
  description: z.string().optional(),
  sameAs: z.array(z.string()).optional(),
  contactPoints: z
    .array(
      z.object({
        contactType: z.string().optional(),
        email: z.string().optional(),
        telephone: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
});

export type ResponseFormatValue = (typeof ResponseFormat)[keyof typeof ResponseFormat];
