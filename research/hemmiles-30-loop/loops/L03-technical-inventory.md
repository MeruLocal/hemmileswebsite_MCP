# Loop 3 - Complete technical inventory (first pass)

Retrieved: 2026-10-21, direct HTTP from this machine (UA `Mozilla/5.0 research` and one Googlebot-UA comparison; not real Googlebot, so UA-based behaviour is indicative only). Status: **researched**. Rendering, indexing and mobile-template checks are NOT done yet (see section 6).

## 1. Inventory sources and what each shows
Every URL below is tagged with its discovery source.

| Source | Result |
|---|---|
| **Live sitemap index** `/sitemap.xml` (200) | 4 children: pages, markets, resources, blog |
| Live `/sitemaps/pages.xml` | 33 URLs, bare paths (home + 32), each with 360 hreflang annotations in file |
| Live `/sitemaps/markets.xml` | 30 URLs, **all under `/in`** (only market prefix present) |
| Live `/sitemaps/resources.xml` | **12 URLs**: 6 articles x (bare + `/in`) - 3 blogs + 3 guides |
| Live `/sitemaps/blog.xml` | **77 URLs**, `/blog/<slug>`, lastmod 2026-10-10 .. 2026-10-21; no overlap with resources.xml; none are `/blog/page/N` |
| Source routes (origin/main, Loop 1) | 9 features, 5 teams, 8 guides, 3 hand-written posts, `/customers`, `/changelog`, `/delete-account`, `/careers`, market-prefixed variants for core + long-tail markets |
| `/robots.txt` (200) | Allows all named crawlers incl. GPTBot, ClaudeBot, Google-Extended, CCBot, PerplexityBot; `Disallow: /api/`; one `Sitemap:` line; **no AI-bot blocking** |
| `/llms.txt` (200, 6,665 bytes) | exists (note: Google says it does not affect Google Search; keep as low priority) |
| Search-engine discovery | **Not done** (no GSC; Loop 2). `site:` checks deferred to Loop 24/26 |

Static fallback / MCP-derived lists: none used in this loop. (MCP fallback risk from Loop 1 is therefore not what hides the new guides - see 2.)

## 2. Findings (ranked)

### F1 (high) Production does not serve the 5 new guides; sitemap does not list them
All five return **404** live: `/guides/primary-vs-secondary-sales`, `/guides/beat-plan`, `/guides/daily-sales-report-dsr`, `/guides/field-sales-vs-inside-sales`, `/guides/permanent-journey-plan-pjp`. They are merged on `origin/main` (PR #8, 2026-10-21) so **production is behind main** (deploy pending or failing). Answers Loop 1 Q1 partially: the host sits behind Cloudflare (`Server: cloudflare`); the deployed commit is still unknown. Anything written against main (incl. Loop 13 scope of 8 guides) must carry a "not yet live" flag.

### F2 (high) 77-URL "blog" sitemap is off-topic mileage / tax content
`blog.xml` lists 77 posts whose slugs are about US mileage reimbursement, IRS rules, Delaware small business, Maharashtra GST / e-way, SOC 2 and QuickBooks/Stripe integration (e.g. `/blog/how-to-create-an-irs-compliant-mileage-log-in-united-states`). That is a different product theme from field-visit software and conflicts with the site's positioning (GPS check-in, visit planning, follow-ups). The repo's static blog has 3 posts; these come from the CMS blog source (`lib/cms-blog.ts`). Needs a content-fit decision in Loop 13/21 (keep, rewrite, noindex or retire), including whether `/blog` index mixes both sets. Risk to flag: thin/templated programmatic-style titles; do not judge quality until bodies are sampled in Loop 13.

### F3 (high) Bare URLs are sitemapped but are not canonical
`/`, `/product`, `/pricing`, `/guides`, `/blog`, article pages etc. declare `rel=canonical` = the `/in/...` version (e.g. `/` -> `https://hemmiles.com/in`, `/product` -> `/in/product`). `pages.xml` still lists the bare URLs and their `hreflang` clusters point `en` / x-default to bare. A sitemap URL whose canonical points elsewhere is a conflicting signal. Also, for a default browser UA the bare URLs answer **307 -> /in/...**, while the Googlebot UA gets **200** at the bare URL. Treat as an unresolved dynamic-serving question: is it geo/UA-conditioned? (Cloudflare country header is not testable from here.) Loop 4 decides retain/consolidate; do not ship fixes while PR #7 (canonical changes) is open.

### F4 (high) Privacy page still has template placeholders
Live `/in/privacy` text contains unfilled bracket text: "[Company legal name, registered address and contact details.]", "[List categories of sub-processors.]", "[Retention periods for website enquiries and customer data ...]", "[Rights available under applicable law ...]", "[date]". Page is `noindex, follow` and `/privacy` + `/terms` 307 to `/in/privacy` / `/in/terms`. Confirms the brief's immediate owner task. Terms not read in this pass.

### F5 (medium) Only `/in` is in market sitemaps
`markets.xml` contains only `/in` (30 URLs). `/us`, `/gb`, `/ca`, `/au`, `/fr` all return 200 and have own canonicals (`/us` canonical = `/us`, `/gb` = `/gb`), but are not in any sitemap; US/UK/CA pages therefore rely on hreflang annotations and internal links for discovery. Consistent with PR #5 ("only /in in market sitemaps") - likely intentional pending market selection (Loop 10). `/fr` (long tail) returns 200: confirm indexability in Loop 4.

### F6 (medium) Pages that should not be indexed behave as expected
`/customers`, `/changelog`, `/privacy`, `/terms`: all `noindex, follow`; none in sitemaps. Matches `CHANGELOG_IS_PLACEHOLDER`/placeholder flags. `/customers` stays noindex while stories are illustrative (keep label, per brief).

### F7 (low) Titles are market-templated
`/` -> "Field Visit App for Teams in India | Hemmiles" (bare URL titled India). `/us` -> "Field Visit App for US Field Teams". Titles reflect market, which is good for /us /gb but means the "international" bare URL is effectively India.

## 3. URL counts (live sitemap, deduped)
| Group | Count |
|---|---:|
| pages.xml (bare) | 33 |
| markets.xml (`/in`) | 30 |
| resources.xml | 12 |
| blog.xml (CMS) | 77 |
| **Total sitemap URLs** | **152** |
Not in any sitemap but live (200): `/us`, `/gb`, `/ca`, `/au`, `/fr` and their subpages (counts TBD).

## 4. Pages 33 bare URLs (pages.xml)
/ , /about, /blog, /careers, /contact, /delete-account, /demo, /docs, /features, 9 feature pages, /guides, /help, /how-it-works, /integrations, /partners, /pricing, /product, /resources, /security, /teams, 5 team pages. Note `/delete-account` and `/careers` are in the index sitemap; fine, but low commercial value.
Missing from pages.xml vs source routes: `/customers`, `/changelog` (intentional noindex).

## 5. Decisions
1. Loop 13 audits 3 hand-written blogs + 3 live guides + 5 not-yet-live guides (flagged) + a **sampled** review of the 77 CMS posts (decide keep/noindex/rewrite).
2. F1 becomes an owner/dev action (confirm deploy of main). Raised as Q9.
3. F3 handed to Loop 4 with PR #7 dependency.
4. No code changes made by this programme.

## 6. Not yet done in this loop (carry to ticks that touch them)
- Full per-URL crawl of all 152 + market pages for status, title, canonical, robots, H1, internal links (do in Loops 12, 25 with a crawler).
- Rendering/JS and mobile template checks, structured data validation, Core Web Vitals, hreflang reciprocity check (Loop 4).
- Terms page placeholder read.

## 7. Open questions (owner)
- Q9: Is production deploying from `origin/main`? Why are the 5 new guides 404? (Cloudflare-fronted host; need deploy dashboard.)
- Q10: Who created the 77 mileage/tax CMS posts and are they intended for this product (or a related site)? Keep or retire?
- Q11: Is the bare-URL 307 -> /in intended geo/default behaviour, and does Googlebot get different handling on purpose?

## 8. Next
Loop 4: country-page audit - reciprocal hreflang across bare / `/in` / `/us` / `/gb` / `/ca` etc., canonical logic, long-tail copies (PR #7), the UK page duplicate/Ahmedabad example.
