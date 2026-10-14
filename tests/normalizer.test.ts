import { test } from "node:test";
import assert from "node:assert/strict";
import {
  extractJsonLd,
  extractSitemapLocs,
  normalizeCompany,
  normalizeFaqs,
  normalizeFeatureList,
  normalizePage,
  normalizePricing,
} from "../src/services/product-normalizer.ts";
import {
  PRICING_FIXTURE_HTML,
  PRICING_FIXTURE_URL,
  SITEMAP_PAGES_XML,
} from "./fixtures.ts";

test("extractJsonLd flattens @graph and skips malformed blocks", () => {
  const nodes = extractJsonLd(PRICING_FIXTURE_HTML);
  const types = nodes.flatMap((n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]));
  assert.ok(types.includes("SoftwareApplication"));
  assert.ok(types.includes("Organization"));
  assert.ok(types.includes("FAQPage"));
  // The invalid JSON-LD block must not throw or appear.
  assert.ok(nodes.length >= 6);
});

test("normalizePage extracts title, description, headings, breadcrumbs, links", () => {
  const page = normalizePage(PRICING_FIXTURE_HTML, PRICING_FIXTURE_URL);
  assert.equal(page.title, "Field Visit App Pricing in India");
  assert.match(page.description ?? "", /per user per month/);
  assert.equal(page.locale, "in");
  assert.equal(page.path, "/pricing");
  assert.deepEqual(page.breadcrumbs, ["Home", "Pricing"]);
  assert.ok(page.headings.some((h) => h.level === 1 && h.text === "Pricing"));
  // In-page (#), mailto and nav-duplicate links are filtered; real link kept.
  assert.ok(page.links.some((l) => l.href === "/in/features/offline-mode"));
  assert.ok(!page.links.some((l) => l.href.startsWith("#") || l.href.startsWith("mailto:")));
  // Script contents stripped from body text.
  assert.ok(!page.text.includes("window.x"));
  assert.match(page.text, /offline mode and GPS check-in/i);
});

test("normalizePricing parses offers across three price shapes", () => {
  const pricing = normalizePricing(PRICING_FIXTURE_HTML, PRICING_FIXTURE_URL, "in");
  assert.equal(pricing.currency, "INR");
  assert.equal(pricing.plans.length, 3);
  const starter = pricing.plans.find((p) => p.name === "Starter");
  const pro = pricing.plans.find((p) => p.name === "Professional");
  const ent = pricing.plans.find((p) => p.name === "Enterprise");
  assert.equal(starter?.price, "3500"); // numeric 3500 coerced to string
  assert.equal(starter?.unit, "per user per month");
  assert.equal(starter?.minUsers, 3);
  assert.equal(starter?.maxUsers, 10);
  assert.equal(starter?.availability, "https://schema.org/InStock");
  assert.equal(starter?.billing?.length, 2); // monthly + annual
  assert.ok(starter?.billing?.some((b) => b.name === "Annual billing" && b.price === "2900"));
  assert.equal(pro?.price, "4500"); // from priceSpecification array
  assert.equal(pro?.priceCurrency, "INR");
  assert.equal(ent?.price, "8000");
  assert.equal(ent?.billing, undefined); // no priceSpecification on enterprise
});

test("normalizeFeatureList returns the 8 capabilities", () => {
  const features = normalizeFeatureList(PRICING_FIXTURE_HTML);
  assert.equal(features.length, 8);
  assert.ok(features.includes("GPS check-in"));
  assert.ok(features.includes("Photos & notes"));
});

test("normalizeFaqs returns question/answer pairs", () => {
  const faqs = normalizeFaqs(PRICING_FIXTURE_HTML);
  assert.equal(faqs.length, 2);
  assert.equal(faqs[0]?.question, "Who counts as a user?");
  assert.match(faqs[1]?.answer ?? "", /14 days/);
});

test("normalizeCompany reads Organization + contact points", () => {
  const company = normalizeCompany(PRICING_FIXTURE_HTML);
  assert.equal(company.name, "Hemmiles");
  assert.equal(company.email, "hello@hemmiles.com");
  assert.equal(company.logo, "https://hemmiles.com/icon.svg");
  assert.deepEqual(company.sameAs, ["https://www.linkedin.com/company/hemmiles"]);
  assert.equal(company.contactPoints?.length, 2);
  assert.ok(company.contactPoints?.some((c) => c.contactType === "sales" && c.url === "https://hemmiles.com/demo"));
});

test("extractSitemapLocs pulls <loc> entries", () => {
  const locs = extractSitemapLocs(SITEMAP_PAGES_XML);
  assert.ok(locs.includes("https://hemmiles.com/pricing"));
  assert.ok(locs.includes("https://hemmiles.com/features/gps-check-in"));
  assert.equal(locs.length, 4);
});

test("normalizePage degrades gracefully on empty HTML", () => {
  const page = normalizePage("<html><body></body></html>", "https://hemmiles.com/x");
  assert.equal(page.title, undefined);
  assert.deepEqual(page.headings, []);
  assert.equal(page.jsonldTypes.length, 0);
});
