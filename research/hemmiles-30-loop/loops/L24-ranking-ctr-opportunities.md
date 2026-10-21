# Loop 24 - Existing ranking and CTR opportunities

Retrieved: 2026-10-21. Sources: Ahrefs GSC connector (re-tried), two WebSearch queries, Loops 2-3, 12, 21. Status: **researched; blocked on data**. Confidence for every opportunity below is **low** because no search-performance data exists for hemmiles.com.

## 1. What can and cannot be known today
- **Search Console:** re-tried 2026-10-21 for 2026-09-01..10-21 (weekly): "No GSC data available" (the Ahrefs project is unverified; Loop 2). No page, query, country or device performance exists in the tools available.
- **Ahrefs Site Explorer:** 0 organic keywords, 0 organic traffic, DR 0 (Loop 2). The Rank Tracker holds 16 India keywords with no position.
- **Web search spot-checks (this tool's index, which may not be Google's; weak evidence):** `site:hemmiles.com` returned **no hemmiles.com pages** (the operator may be unsupported); the brand query "Hemmiles field visit app" returned **no hemmiles.com result**, only other vendors' pages (Jotform template, Upteams, MileApp, FieldVisits). The brand name is also easily read as "miles"/mileage, so brand-query results drift to unrelated pages (war-graves records, mileage apps).
- **Conclusion:** there is **no measurable ranking or CTR to optimise**. The opportunity right now is *discovery and indexing*, not click-through tuning. CTR work before indexing is premature.

## 2. Pre-GSC checklist (indexing-first)
1. Verify hemmiles.com in Google Search Console (domain property, DNS) and Bing Webmaster Tools; add the research account. (Q5)
2. Submit `https://hemmiles.com/sitemap.xml` (index of 4 child sitemaps; 152 URLs, Loop 3) and confirm the coverage report.
3. Inspect 10 key URLs with URL Inspection (home `/in`, `/in/product`, `/in/pricing`, `/in/features/gps-check-in`, `/in/teams/field-sales`, `/in/teams/service`, one guide, one blog, `/us`, `/gb`): indexed? canonical chosen by Google? crawl date? rendered HTML?
4. Resolve the signals that can block or split indexing before expecting rank: sitemap lists bare URLs whose canonical is `/in` (Loop 3 F3); bare `/` 307s to `/in` for a default UA but returns 200 to a Googlebot UA; 5 new guides 404 live; 77 off-topic CMS posts dominating the blog index and sitemap.
5. Confirm analytics: GA4 property, Ahrefs Web Analytics script, Clarity (Q6, Q8) so that first-party sessions exist alongside GSC.
6. Re-verify `robots.txt` (allows all; blocks only `/api/`) after deploys.

## 3. First GSC pull - the exact specification
Run once access exists, then every 28 days.
- Windows: last 28 days and last 90 days (whichever exists), compared with the previous equal period.
- Dimensions: page x query, page x country, page x device; filter brand vs non-brand (brand regex: hemmiles, hemiles, hemmile).
- Outputs, per owner URL from the Loop 21 register: impressions, clicks, CTR, average position; share of impressions by market (IN/US/GB/other).
- Segments: (a) positions 8-20 with meaningful impressions = refresh candidates; (b) positions 1-7 with CTR below the **site's own median CTR for that position band** = title/description candidates (do not use external CTR benchmarks); (c) queries with impressions but no owning page = gaps; (d) wrong-market impressions (e.g. `/in` page shown to US users) = hreflang/canonical issue; (e) page-level cannibalisation: two URLs ranking for one query; (f) the 77 CMS posts: impressions/clicks vs the product pages.
- Confidence rule: a page-query pair needs a minimum impression count agreed with the founder (suggested: set after seeing the distribution) before it is labelled an opportunity; otherwise "insufficient data".
- Record each opportunity with: page, query set, country, device, period, metric, hypothesis, change, expected direction (no invented effect size), test window, outcome.

## 4. Opportunity hypotheses (all low confidence until data)

| # | Hypothesis | Basis | Test once data exists | Confidence |
|---|---|---|---|---|
| H1 | The India head terms (field force management software 350, field sales app 200, field sales tracking app 200) are winnable because India page one includes DR 2-10 sites | Loop 20 SERP | Position and impressions for `/in/product` and `/in/teams/field-sales` after indexing | Low |
| H2 | India report-format informational queries (daily sales report format 350, visit report format 200, dsr format 150) can be captured by the five guides plus downloadable templates | Loop 21 | Impressions/clicks per guide; template downloads | Low |
| H3 | Bare/`/in` canonical conflict is suppressing or splitting signals | Loop 3 F3 | Google-selected canonical in URL Inspection; index coverage | Medium (technical, but unmeasured effect) |
| H4 | The 77 CMS posts dilute topical focus and consume crawl attention | Loop 13 | Crawl stats; share of impressions | Low |
| H5 | Titles like "Product for field teams in India | Hemmiles" under-use the category phrases buyers search | Loop 12/21 | CTR vs site median at positions 1-7 | Low |
| H6 | US `/us` pages with US vocabulary and non-India samples would convert impressions better than the current India-derived page | Loops 4-5 | US-country CTR and engagement for `/us` vs `/in` | Low |
| H7 | Service queries ("field service app", "service report template") bring impressions to `/teams/service` and the visit-notes guide | Loops 15, 21 | Query/page report | Low |
| H8 | Brand misspelling/confusion ("hemmiles" vs "miles") loses brand searches | this loop | Brand regex impressions and variants; Ads brand terms later | Low |
| H9 | Trade-show/lead-retrieval vocabulary (US 400/150) would lift the exhibition page | Loop 17 | Query report on `/features/exhibition-capture` | Low |
| H10 | An answer-style passage per head term (definition, who it is for, limits) improves AI-Overview inclusion | Loops 5, 21 | AI visibility tracking (Loop 26) | Low |

## 5. Decisions
1. No title/meta or CTR work is commissioned yet; indexing and measurement setup come first.
2. The first GSC pull (section 3) is the gating deliverable for Loops 25-26 and 28-30 follow-ups.
3. Do not quote any ranking or traffic figures in any deliverable until the pull exists.

## 6. Open questions
- Q58: Can the founder verify GSC and Bing Webmaster Tools this week (Q5)? Without it, Loops 24-26 remain hypothesis-only.
- Q59: What minimum impression threshold should define an "opportunity"? (suggested: decide after the first distribution)

## 7. Next
Loop 25: internal links - orphan pages, contextual journeys, wrong-market links and redirects; exact source, destination, anchor and purpose (crawl-based, no GSC needed).
