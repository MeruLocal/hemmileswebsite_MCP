# Loop 31 - Full crawl pass

Retrieved: 2026-10-21, direct HTTP (default research user-agent; redirects observed first, then followed). Scope: **422 URLs** = all 152 URLs in the four live child sitemaps (33 pages, 30 `/in` market pages, 12 resources, 77 CMS posts) + 270 market-prefixed commercial pages (the same 30 paths under `/us /gb /ca /au /nz /ie /sg /ae /za`). Static HTML only (no JavaScript rendering; Loop 32 covers rendering). Status: **researched**. Extends Loop 3 (first pass) and Loop 4.

## 1. Results at a glance

| Check | Result |
|---|---|
| Fetch errors | **0** of 422 |
| First response | 385 x 200; **37 x 307** (all 37 are sitemap URLs) |
| Final status after redirects | all 200 (386 distinct final URLs) |
| `noindex` (meta or `X-Robots-Tag`) | **0** in this set |
| Missing canonical | 0 |
| H1 count | exactly 1 on every page |
| Missing `<title>` | 0 |
| Duplicate titles across distinct final URLs | **0** |
| Canonical = final URL | 385 of 386 (exception: `/in/partners`, see F3) |
| Soft 404 test | unknown URLs return a real **404** (`/zz-test-404-page`, `/in/zz-...`, `/xx`) |
| Host/protocol | `http://hemmiles.com` -> 301 https; `https://www` -> 308 apex; `http://www` -> 301 -> https www -> apex (two hops); trailing slash `/in/` and `/in/pricing/` -> 308 no-slash; `/IN` (uppercase) returns 200 with canonical `/in` |

## 2. Findings

### F1 (high) 37 of 152 sitemap URLs (24%) are redirects
`pages.xml` lists the 33 bare commercial URLs and `resources.xml` lists 6 bare article URLs; for a default user-agent **37 of these answer 307 to `/in/...`** (the exceptions are the global-only `/careers` and `/delete-account`). A sitemap should list final, canonical, 200 URLs. The canonical of each redirecting URL is the `/in/...` target, so the sitemap submits non-canonical, redirecting URLs while the real targets appear only in `markets.xml`. Duplicated intent with Loop 3 F3, now quantified. (Earlier test: a Googlebot-user-agent request received 200 at the bare URL; conditional behaviour by user-agent remains unexplained, Q11.)

### F2 (high) hreflang `en` and `x-default` point to redirecting URLs on 340 pages
All 30 commercial paths x 10 markets (about 330) plus the bare pages carry 12 `<link rel="alternate" hreflang>` tags (11 markets + `x-default`). `en` and `x-default` target the **bare** URL (e.g. `/pricing`), which 307-redirects to `/in/pricing`. Self-reference passes and all 270 non-India market pages have a self-canonical. The conflict (alternate target = redirect = a different cluster member) is the same one found in Loop 4 F4, confirmed across the whole commercial set. Decision O05 (India-first vs global) governs the fix (D03).

### F3 (medium) `/partners` canonical loop and no hreflang
`/partners` (bare, in `pages.xml`) 307-redirects to `/in/partners`, whose canonical is the **bare** `/partners` and which has **zero hreflang tags**. A canonical that points to a URL which redirects back to the page is a self-referential conflict. The other global-only pages (`/careers`, `/delete-account`) are consistent (200, self-canonical, no redirect). Add to D03.

### F4 (medium) 270 indexable market pages are outside every sitemap
All 270 pages under the nine non-India core markets return 200, self-canonical, no `noindex`, 12 hreflang tags; none is listed in a sitemap (Loop 3 F5, PR #5). They rely on hreflang and links for discovery. Combined with Loop 4 (about 99.7% similar text), this is 270 near-duplicate indexable URLs: a duplication and crawl-budget decision for O05/O07 (keep indexable, consolidate, or noindex the deferred markets).

### F5 (medium) CMS posts: long titles, no hreflang, bare URLs
- 77 CMS post titles exceed 60 characters (maximum 141, minimum 44 across the 80 article titles); search results will truncate them.
- CMS posts carry **no hreflang tags**, self-canonical on the bare URL; their nav links redirect (Loop 25 F3). They are 200, indexable, in `blog.xml`.
- Hand-written articles use the `/in/...` form with full hreflang clusters; the CMS uses a different pattern. Decision O06 applies.

### F6 (low) URL normalisation
Uppercase `/IN` returns 200 (canonical `/in`) rather than redirecting; case variants are harmless with a canonical but can be normalised. `http://www` takes two hops. No soft 404s. Trailing-slash handling is correct (308).

### F7 (positive) Basics are healthy
Every page has one H1, a title, a canonical, no accidental `noindex` and valid 404 behaviour; there are no duplicate titles across distinct URLs. Fixing sitemap/hreflang/canonical alignment (D03) should be small template work.

## 3. Impact on the backlog
- **D03** (canonical/hreflang/sitemap) gains: (a) replace bare URLs in `pages.xml`/`resources.xml` with the final canonical URLs or make the bare URLs return 200 canonical pages; (b) point `en` and `x-default` hreflang at a URL that returns 200 and is its own canonical; (c) fix `/in/partners` canonical and add hreflang; (d) decide the sitemap policy for the 270 non-India market pages (O05, O07).
- **D10** gains: title-length limit for CMS posts if they stay.
- **D15/V04**: V04 (full crawl) is now baseline-complete; re-run after the next deploy to compare counts (37 redirecting sitemap URLs, 340 hreflang alternates pointing at redirects, `/in/partners` conflict).

## 4. Decisions
1. Baseline metrics for the post-deploy comparison: 422 URLs crawled, 37 sitemap redirects, 1 canonical conflict, 0 noindex, 0 errors.
2. Add F1-F3 to D03; no new ticket needed.
3. Keep the crawl script's definitions (user-agent, redirect handling) fixed so the recheck is comparable.

## 5. Open questions
- Q11 (still open): is the bare-URL 307 vs Googlebot 200 behaviour deliberate (geo/user-agent logic)? It decides whether F1 and F2 are real for Google or an artefact of non-Google clients.
- Q69: Should the nine non-India core markets remain indexable while deferred (Loop 10), or be consolidated for now?

## 6. Next
Loop 32: rendering, mobile and performance audit in a real browser.
