# Loop 1 - Prior work and production provenance

Retrieved: 2026-10-21 (git fetch + `gh` against GitHub; no live-site fetch this loop).
Status: **researched** (not implemented/deployed/measured).

## 1. Production source (answers the brief's open gap)
- Website source repo: **MeruLocal/hemmileswebsite** (Next.js App Router, Dockerfile with standalone output). Trunk `main`, head `2ca78be` = merge of PR #8 (`seo/merge-hemmiles-all-2026-10-21`), 2026-10-21.
- Deployed commit / host: **NOT established** (Dockerfile exists; no deploy record found in repo). Needs owner input or a live-header check (Loop 3).
- Local clone `C:\Software RSS\hemmileswebsite` is **35 commits behind origin/main and has 1 local-only commit** (`6d61ecf` "Add GA4 tracking - browser + server-side API"). That commit is not on origin; do not assume GA4 is live from the repo. Flag to owner (Loop 2).
- Companion tool repo: **MeruLocal/hemmileswebsite_MCP** (reads the public site). `main` holds only the base implementation + PR #1.

## 2. The brief's inventory is already stale (important)
The brief said the site exposes 3 blog posts and 3 guides. Source on `main` shows:

| Collection | Brief | Source on main (lib/site.ts, lib/content.ts) |
|---|---|---|
| Features | 9 | 9: visit-planning, route-planning, gps-check-in, photos-notes, follow-ups, offline-mode, manager-dashboard, reports, exhibition-capture |
| Teams | 5 | 5: field-sales, service, distribution, collections, medical-reps |
| Guides | 3 | **8**: planning-a-field-day, rolling-out-gps-check-in, writing-useful-visit-notes + 5 added 2026-10-21 (primary-vs-secondary-sales, beat-plan, daily-sales-report-dsr, field-sales-vs-inside-sales, permanent-journey-plan-pjp) |
| Blog posts | 3 | 3: why-field-visits-fall-out-of-the-crm (2026-09-15, 6 min), gps-check-in-without-surveillance (2026-08-28, 5 min), offline-first-field-apps (2026-08-06, 4 min); plus a CMS blog source (`lib/cms-blog.ts`) not yet inventoried |
| Customer stories | - | `/customers/[slug]` exist (3 sample slugs in content.ts: pharma-distributor, equipment-service, fmcg-distribution) |
| Changelog | - | `CHANGELOG_IS_PLACEHOLDER = true` (sample entries; page noindex) |

Consequence: Loop 13 audits **8 guides + 3 blogs (+ CMS posts)**, not 6. The 5 new guides (merged same day as the brief) overlap three brief "new topic" candidates and pre-empt Loop 21 ownership decisions; they need a fit check against the shortlist (field-day plan, coverage measurement).

## 3. Route and sitemap provenance (source routes, 2026-10-21)
- Source routes under `app/` and `app/[country]/`: home, about, blog (+`/page/N`), contact, demo, docs, features(+slug), guides(+slug), help, how-it-works, integrations, partners, pricing, privacy, product, resources, security, teams(+slug), terms; global-only: `/careers`, `/changelog`, `/customers(+slug)`, `/delete-account`; machine: `/robots.ts`, `/llms.txt`, `/sitemap.xml`, `/sitemaps/{pages,markets,resources,blog}.xml`, `/api/{lead,leads,revalidate-blog}`.
- Sitemap design (lib/sitemap.ts): index + pages/markets/resources static + request-time blog. Source comment states noindex (and therefore absent from sitemaps) for `/login`, `/signup`, `/changelog`, `/customers`, `/privacy`, `/terms` while placeholder flags are on. **To verify in Loop 3** which flags are currently on - the brief says privacy/terms contain template wording.
- Markets: 10 core (IN, US, GB, CA, AU, NZ, IE, SG, AE, ZA) plus a long-tail set (up to 249 ISO countries registered; long-tail copies canonicalise to the international page per open PR #7). `SITEMAP_MARKET_SLUGS` controls which prefixes are sitemapped. Index pages are `indexableMarkets` = core only.
- Inventory-source tag for this loop: **source routes + source data files only**. Live sitemap / crawl / search discovery not yet reconciled (Loop 3).

## 4. Prior work register (reuse before redoing)
### hemmileswebsite (site repo) PRs
| PR | State | What | Reuse for |
|---|---|---|---|
| #1 lead-capture-crm | merged | forms to CRM + admin panel | Loop 28 (attribution/lead flow) |
| #2 [PLAN] audit fixes T1 | merged | SEO audit plan | Loops 3, 12 - read plan doc |
| #3 Next 15.5.28 | merged | security pin | none |
| #4 plan-fixes | merged | route claims, testimonials, delete-account page, titles, sitemap | Loops 11, 12, 27 |
| #5 indexing-fixes | merged | only /in in market sitemaps; dropped 404 canonical | Loop 4 |
| #6 blog pagination | merged | prerender /blog, paginate /blog/page/N | Loop 3 |
| #7 seo-audit-crawler-ua | **OPEN** | explicit index,follow; long-tail canonical to international; Ahrefs UA exempt | Loop 4 (do not duplicate) |
| #8 merge-hemmiles-all | merged | /product "field sales app" optimisation + 5 guides | Loops 12, 13, 21 |
| branch `seo/aeo-geo-audit-2026-10-08` | merged earlier (technical/AEO/GEO fixes) | Loop 26 |

### hemmileswebsite_MCP PRs (20 PRs + base)
- #1 merged (test:coverage script). #20 merged (usage records + CI) **into an intermediate branch, not main** (brief's caution confirmed: main log shows only #1 merged).
- Open build PRs: #16 per-request McpServer + HTTP hardening, #17 bound deep-search cost, #18 identity/registry metadata, #19 pagination + get_started + UTM, #21 concurrency fix (overlaps #16).
- Open plan PRs: #2-#15 (plan docs for the above + README fixes, icons, CI, size cap, usage analytics, untrusted-content).
- Relevance to this programme: the MCP is the audit/inventory tool for Loops 3 and 21. Known risk (to verify in Loop 3): sitemap service skips failed child sitemaps or falls back to a static list that omits current pages (e.g. the 5 new guides). Any MCP-derived inventory must tag its source.

### Earlier research programmes
- No Hemmiles 30-loop SEO output found in the three repos or memory (brief: "completion not established"). Treat as not done; this programme starts a fresh register.

## 5. Decisions
1. Source of truth for page/article inventory = `MeruLocal/hemmileswebsite` `origin/main`, re-fetched at each loop that needs it.
2. Loop 13 scope raised from 6 to 8 guides + 3 blogs (+ CMS blogs after inventory).
3. Do not open competing SEO PRs on canonical/robots/index topics while PR #7 is open.

## 6. Open questions (owner)
- Q1: What host/commit is production serving? (header or deploy dashboard)
- Q2: Is the local-only GA4 commit `6d61ecf` live? Is GA4 property for hemmiles.com configured and who has access (needed for Loop 2)?
- Q3: Who owns privacy/terms legal facts? (immediate owner task)
- Q4: Is GSC verified for hemmiles.com and is access available to this tooling?

## 7. Next
Loop 2: search and commercial baseline - confirm which data sources are actually reachable (GSC/GA4/Ahrefs/Clarity) before promising any baseline.
