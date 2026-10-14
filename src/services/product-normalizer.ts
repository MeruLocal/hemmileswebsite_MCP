/**
 * product-normalizer — pure HTML/JSON-LD extraction (no network).
 *
 * Hemmiles renders rich schema.org JSON-LD on every page
 * (SoftwareApplication, Organization, WebPage, FAQPage, BreadcrumbList), so
 * the normalizer is JSON-LD-first and falls back to DOM parsing for titles,
 * descriptions, headings and body text. All functions are deterministic and
 * side-effect free, which makes them straightforward to unit-test with
 * fixtures.
 *
 * Naming note: the module keeps the "product-normalizer" name from the project
 * brief, but — since Hemmiles is SaaS, not an online store — it normalizes
 * marketing/product-information pages rather than catalog products.
 */

import * as cheerio from "cheerio";
import { squashWhitespace } from "../utils/format.js";
import { stripLocale } from "../utils/validation.js";

export interface JsonLdNode {
  "@type"?: string | string[];
  [key: string]: unknown;
}

export interface NormalizedPage {
  url: string;
  path: string;
  locale: string;
  title?: string;
  description?: string;
  headings: Array<{ level: number; text: string }>;
  breadcrumbs: string[];
  jsonldTypes: string[];
  links: Array<{ text: string; href: string }>;
  text: string;
}

export interface BillingOption {
  name?: string;
  price?: string;
  priceCurrency?: string;
  unitText?: string;
}

export interface Offer {
  id?: string;
  name?: string;
  price?: string;
  priceCurrency?: string;
  unit?: string;
  availability?: string;
  minUsers?: number;
  maxUsers?: number;
  description?: string;
  url?: string;
  /** All published billing variants (e.g. monthly, annual). */
  billing?: BillingOption[];
}

export interface Pricing {
  url: string;
  locale: string;
  currency?: string;
  summary?: string;
  plans: Offer[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ContactPoint {
  contactType?: string;
  email?: string;
  telephone?: string;
  url?: string;
}

export interface CompanyInfo {
  name?: string;
  url?: string;
  logo?: string;
  email?: string;
  description?: string;
  sameAs?: string[];
  contactPoints?: ContactPoint[];
}

const MAX_TEXT = 8000;
const MAX_LINKS = 60;

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function typesOf(node: JsonLdNode): string[] {
  return asArray(node["@type"]).filter((t): t is string => typeof t === "string");
}

/** Parse all JSON-LD <script> blocks and flatten any @graph arrays. */
export function extractJsonLd(html: string): JsonLdNode[] {
  const $ = cheerio.load(html);
  const nodes: JsonLdNode[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw.trim()) return;
    try {
      const parsed = JSON.parse(raw) as JsonLdNode | { "@graph"?: JsonLdNode[] };
      const graph = (parsed as { "@graph"?: JsonLdNode[] })["@graph"];
      if (Array.isArray(graph)) nodes.push(...graph);
      else nodes.push(parsed as JsonLdNode);
    } catch {
      // Ignore malformed JSON-LD rather than failing the whole page.
    }
  });
  return nodes;
}

export function findByType(nodes: JsonLdNode[], type: string): JsonLdNode | undefined {
  return nodes.find((n) => typesOf(n).includes(type));
}

function textOrUndefined(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return undefined;
}

/** Coerce a string or number scalar to a trimmed string (JSON-LD prices are often numeric). */
function scalarToString(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return textOrUndefined(value);
}

function numOrUndefined(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function urlOf(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "url" in value) {
    const u = (value as { url?: unknown }).url;
    if (typeof u === "string") return u;
  }
  return undefined;
}

/** Build a normalized page object from HTML + its final URL. */
export function normalizePage(html: string, finalUrl: string): NormalizedPage {
  const $ = cheerio.load(html);
  const nodes = extractJsonLd(html);
  const webPage = findByType(nodes, "WebPage");

  const title =
    textOrUndefined(webPage?.["name"]) ??
    textOrUndefined($("title").first().text()) ??
    textOrUndefined($("h1").first().text());

  const description =
    textOrUndefined(webPage?.["description"]) ??
    textOrUndefined($('meta[name="description"]').attr("content")) ??
    textOrUndefined($('meta[property="og:description"]').attr("content"));

  const headings: Array<{ level: number; text: string }> = [];
  $("h1, h2, h3").each((_, el) => {
    const level = Number(el.tagName.substring(1));
    const text = squashWhitespace($(el).text());
    if (text) headings.push({ level, text });
  });

  const breadcrumbs: string[] = [];
  const crumb = findByType(nodes, "BreadcrumbList");
  for (const item of asArray((crumb?.["itemListElement"] as JsonLdNode[]) ?? [])) {
    const name = textOrUndefined((item as { name?: unknown }).name);
    if (name) breadcrumbs.push(name);
  }

  const container = $("main").length ? $("main") : $("body");
  const links: Array<{ text: string; href: string }> = [];
  const seen = new Set<string>();
  container.find("a[href]").each((_, el) => {
    if (links.length >= MAX_LINKS) return;
    const href = $(el).attr("href");
    const text = squashWhitespace($(el).text());
    if (!href || !text) return;
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    const key = `${text}|${href}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ text, href });
  });

  container.find("script, style, noscript").remove();
  const text = squashWhitespace(container.text()).slice(0, MAX_TEXT);

  const { path } = (() => {
    try {
      const u = new URL(finalUrl);
      const sl = stripLocale(u.pathname);
      return { path: "/" + sl.path };
    } catch {
      return { path: finalUrl };
    }
  })();

  let locale = "global";
  try {
    const sl = stripLocale(new URL(finalUrl).pathname);
    if (sl.locale) locale = sl.locale;
  } catch {
    /* keep default */
  }

  const base: NormalizedPage = {
    url: finalUrl,
    path,
    locale,
    headings,
    breadcrumbs,
    jsonldTypes: nodes.flatMap(typesOf),
    links,
    text,
  };
  if (title !== undefined) base.title = title;
  if (description !== undefined) base.description = description;
  return base;
}

/** Extract pricing plans from SoftwareApplication.offers (schema.org). */
export function normalizePricing(html: string, finalUrl: string, locale: string): Pricing {
  const nodes = extractJsonLd(html);
  const software = findByType(nodes, "SoftwareApplication");
  const webPage = findByType(nodes, "WebPage");

  const rawOffers = asArray((software?.["offers"] as JsonLdNode[]) ?? []);
  const plans: Offer[] = rawOffers.map((o) => {
    // priceSpecification may be a single object or an array (e.g. monthly +
    // annual billing). Normalize to an array of BillingOptions.
    const specs = asArray((o["priceSpecification"] as JsonLdNode[]) ?? []);
    const billing: BillingOption[] = specs.map((s) => {
      const b: BillingOption = {};
      const bName = textOrUndefined(s["name"]);
      const bPrice = scalarToString(s["price"]);
      const bCurrency = textOrUndefined(s["priceCurrency"]);
      const bUnit = textOrUndefined(s["unitText"]);
      if (bName !== undefined) b.name = bName;
      if (bPrice !== undefined) b.price = bPrice;
      if (bCurrency !== undefined) b.priceCurrency = bCurrency;
      if (bUnit !== undefined) b.unitText = bUnit;
      return b;
    });
    const primary = specs[0] as JsonLdNode | undefined;

    const price = scalarToString(o["price"]) ?? scalarToString(primary?.["price"]);
    const priceCurrency =
      textOrUndefined(o["priceCurrency"]) ?? textOrUndefined(primary?.["priceCurrency"]);
    const unit =
      textOrUndefined(primary?.["unitText"]) ??
      textOrUndefined((o["referenceQuantity"] as { unitText?: unknown } | undefined)?.unitText);
    const eligibleQty = o["eligibleQuantity"] as JsonLdNode | undefined;
    const minUsers = numOrUndefined(eligibleQty?.["minValue"]);
    const maxUsers = numOrUndefined(eligibleQty?.["maxValue"]);

    const offer: Offer = {};
    const id = textOrUndefined(o["@id"]);
    const name = textOrUndefined(o["name"]);
    const availability = textOrUndefined(o["availability"]);
    const description = textOrUndefined(o["description"]);
    const url = urlOf(o["url"]);
    if (id !== undefined) offer.id = id;
    if (name !== undefined) offer.name = name;
    if (price !== undefined) offer.price = price;
    if (priceCurrency !== undefined) offer.priceCurrency = priceCurrency;
    if (unit !== undefined) offer.unit = unit;
    if (availability !== undefined) offer.availability = availability;
    if (minUsers !== undefined) offer.minUsers = minUsers;
    if (maxUsers !== undefined) offer.maxUsers = maxUsers;
    if (description !== undefined) offer.description = description;
    if (url !== undefined) offer.url = url;
    if (billing.length) offer.billing = billing;
    return offer;
  });

  const currency = plans.find((p) => p.priceCurrency)?.priceCurrency;
  const summary = textOrUndefined(webPage?.["description"]);

  const result: Pricing = { url: finalUrl, locale, plans };
  if (currency !== undefined) result.currency = currency;
  if (summary !== undefined) result.summary = summary;
  return result;
}

/** Extract Q&A pairs from a FAQPage node, if present. */
export function normalizeFaqs(html: string): Faq[] {
  const nodes = extractJsonLd(html);
  const faqPage = findByType(nodes, "FAQPage");
  const out: Faq[] = [];
  for (const q of asArray((faqPage?.["mainEntity"] as JsonLdNode[]) ?? [])) {
    const question = textOrUndefined((q as { name?: unknown }).name);
    const answerNode = (q as { acceptedAnswer?: { text?: unknown } }).acceptedAnswer;
    const answer = textOrUndefined(answerNode?.text);
    if (question && answer) out.push({ question, answer });
  }
  return out;
}

/** Extract the product's advertised feature list (SoftwareApplication). */
export function normalizeFeatureList(html: string): string[] {
  const nodes = extractJsonLd(html);
  const software = findByType(nodes, "SoftwareApplication");
  return asArray((software?.["featureList"] as string[]) ?? []).filter(
    (f): f is string => typeof f === "string",
  );
}

/** Extract Organization details for company/contact information. */
export function normalizeCompany(html: string): CompanyInfo {
  const nodes = extractJsonLd(html);
  const org = findByType(nodes, "Organization");
  const software = findByType(nodes, "SoftwareApplication");
  if (!org && !software) return {};

  const contactPoints: ContactPoint[] = [];
  for (const cp of asArray((org?.["contactPoint"] as JsonLdNode[]) ?? [])) {
    const point: ContactPoint = {};
    const contactType = textOrUndefined((cp as { contactType?: unknown }).contactType);
    const email = textOrUndefined((cp as { email?: unknown }).email);
    const telephone = textOrUndefined((cp as { telephone?: unknown }).telephone);
    const url = urlOf((cp as { url?: unknown }).url);
    if (contactType !== undefined) point.contactType = contactType;
    if (email !== undefined) point.email = email;
    if (telephone !== undefined) point.telephone = telephone;
    if (url !== undefined) point.url = url;
    if (Object.keys(point).length) contactPoints.push(point);
  }

  const sameAs = asArray((org?.["sameAs"] as string[]) ?? []).filter(
    (s): s is string => typeof s === "string",
  );

  const info: CompanyInfo = {};
  const name = textOrUndefined(org?.["name"]) ?? textOrUndefined(software?.["name"]);
  const url = urlOf(org?.["url"]) ?? urlOf(software?.["url"]);
  const logo = urlOf(org?.["logo"]);
  const email = textOrUndefined(org?.["email"]);
  const description = textOrUndefined(org?.["description"]) ?? textOrUndefined(software?.["description"]);
  if (name !== undefined) info.name = name;
  if (url !== undefined) info.url = url;
  if (logo !== undefined) info.logo = logo;
  if (email !== undefined) info.email = email;
  if (description !== undefined) info.description = description;
  if (sameAs.length) info.sameAs = sameAs;
  if (contactPoints.length) info.contactPoints = contactPoints;
  return info;
}

/** Parse <loc> entries from a sitemap or sitemap index XML document. */
export function extractSitemapLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    if (m[1]) locs.push(m[1]);
  }
  return locs;
}
