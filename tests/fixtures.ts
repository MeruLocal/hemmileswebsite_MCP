/**
 * Synthetic HTML fixture for unit tests. Its STRUCTURE mirrors what was
 * observed on hemmiles.com (schema.org @graph with SoftwareApplication offers,
 * FAQPage, Organization, BreadcrumbList), but the values here are test data,
 * not scraped content. Offers deliberately use three different price shapes to
 * exercise the normalizer's fallbacks.
 */

export const PRICING_FIXTURE_URL = "https://hemmiles.com/in/pricing";

export const PRICING_FIXTURE_HTML = `<!DOCTYPE html>
<html lang="en-IN">
<head>
<title>Pricing | Hemmiles</title>
<meta name="description" content="Hemmiles pricing in India: three plans billed per user per month." />
<meta property="og:description" content="OG fallback description" />
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
  {"@type":"WebPage","@id":"https://hemmiles.com/in/pricing#webpage","name":"Field Visit App Pricing in India","description":"Hemmiles pricing in India: Starter, Professional and Enterprise, billed per user per month.","inLanguage":"en-IN"},
  {"@type":"BreadcrumbList","@id":"https://hemmiles.com/in/pricing#breadcrumb","itemListElement":[
     {"@type":"ListItem","position":1,"name":"Home"},
     {"@type":"ListItem","position":2,"name":"Pricing"}]},
  {"@type":"SoftwareApplication","@id":"https://hemmiles.com/#software","name":"Hemmiles","url":"https://hemmiles.com","applicationCategory":"BusinessApplication","featureList":["Visit planning","Route planning","GPS check-in","Photos & notes","Follow-ups","Offline mode","Manager dashboard","Reports"],"offers":[
     {"@type":"Offer","@id":"https://hemmiles.com/in/pricing#offer-starter","name":"Starter","price":3500,"priceCurrency":"INR","availability":"https://schema.org/InStock","description":"Up to 10 users","eligibleQuantity":{"@type":"QuantitativeValue","minValue":3,"maxValue":10,"unitText":"users"},"priceSpecification":[{"@type":"UnitPriceSpecification","name":"Monthly billing","price":3500,"priceCurrency":"INR","unitText":"per user per month"},{"@type":"UnitPriceSpecification","name":"Annual billing","price":2900,"priceCurrency":"INR","unitText":"per user per month, billed yearly"}]},
     {"@type":"Offer","@id":"https://hemmiles.com/in/pricing#offer-professional","name":"Professional","description":"Up to 100 users","priceSpecification":[{"@type":"UnitPriceSpecification","price":4500,"priceCurrency":"INR","unitText":"per user per month"}]},
     {"@type":"Offer","@id":"https://hemmiles.com/in/pricing#offer-enterprise","name":"Enterprise","price":8000,"priceCurrency":"INR","description":"Unlimited users"}]},
  {"@type":"FAQPage","@id":"https://hemmiles.com/in/pricing#faq","mainEntity":[
     {"@type":"Question","name":"Who counts as a user?","acceptedAnswer":{"@type":"Answer","text":"Anyone who signs in."}},
     {"@type":"Question","name":"Is there a free trial?","acceptedAnswer":{"@type":"Answer","text":"Yes, 14 days."}}]}
]}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
  {"@type":"Organization","@id":"https://hemmiles.com/#organization","name":"Hemmiles","url":"https://hemmiles.com","logo":{"@type":"ImageObject","url":"https://hemmiles.com/icon.svg"},"email":"hello@hemmiles.com","description":"Field visit software.","sameAs":["https://www.linkedin.com/company/hemmiles"],"contactPoint":[
     {"@type":"ContactPoint","contactType":"customer support","email":"hello@hemmiles.com","url":"https://hemmiles.com/contact"},
     {"@type":"ContactPoint","contactType":"sales","url":"https://hemmiles.com/demo"}]},
  {"@type":"WebSite","@id":"https://hemmiles.com/#website","url":"https://hemmiles.com","name":"Hemmiles"}
]}
</script>
<script type="application/ld+json">{ this is not valid json }</script>
</head>
<body>
<header><nav><a href="/in/product">Product</a></nav></header>
<main>
  <h1>Pricing</h1>
  <p>Hemmiles offers offline mode and GPS check-in for field teams.</p>
  <h2>Starter</h2>
  <h2>Professional</h2>
  <a href="/in/features/offline-mode">Offline mode</a>
  <a href="#top">Back to top</a>
  <a href="mailto:hello@hemmiles.com">Email us</a>
  <script>window.x = 1;</script>
</main>
</body>
</html>`;

export const SITEMAP_INDEX_XML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://hemmiles.com/sitemaps/pages.xml</loc></sitemap>
</sitemapindex>`;

export const SITEMAP_PAGES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://hemmiles.com</loc></url>
  <url><loc>https://hemmiles.com/pricing</loc></url>
  <url><loc>https://hemmiles.com/features/gps-check-in</loc></url>
  <url><loc>https://hemmiles.com/in/pricing</loc></url>
</urlset>`;
