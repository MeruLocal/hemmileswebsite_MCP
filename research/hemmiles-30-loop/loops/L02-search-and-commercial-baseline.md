# Loop 2 - Search and commercial baseline

Retrieved: 2026-10-21 via Ahrefs MCP (project and API reads, 0 units except DR lookup). Status: **researched**.
Rule: Ahrefs figures are third-party estimates, never "our traffic". Actuals must come from GSC / GA4 / server logs.

## 1. Which baseline sources are actually reachable (the point of this loop)

| Source | Reachable? | Evidence (2026-10-21) | Consequence |
|---|---|---|---|
| Google Search Console | **No** | Ahrefs project "Hemmiles" (id 10459002, hemmiles.com) is `verified: false`; `gsc-performance-history` 2026-09-21..10-21 returned "No GSC data available" | Zero actual search data in hand. Owner must verify GSC (or share access) before Loops 24, 25 can use actuals |
| Ahrefs Web Analytics | **Installed key exists, no data** | `web-analytics-stats` 2026-09-21..10-21: 0 pageviews, 0 visitors, 0 visits | Tracking script is not firing or not installed on production. Do not treat as zero traffic |
| Ahrefs Site Explorer (index) | Yes, but empty | Metrics 2026-10-20: 0 organic keywords, 0 organic traffic, DR 0.0, no Ahrefs rank | Domain effectively absent from Ahrefs' index / no ranking data (estimate-level fact) |
| Ahrefs Rank Tracker | Yes | 16 keywords tracked, **all located in India**; no keyword has a position (position null for all 16, desktop, 2026-10-20) | Existing tracker mismatches the priority markets (US/CA/UK) and shows no ranking yet |
| GA4 | **Not verified** | Not probed this loop (no property id on record). Site repo local-only commit `6d61ecf` "Add GA4 tracking" is not on origin/main (Loop 1) | Owner must confirm property id, that the tag is live, and grant access |
| Microsoft Clarity | **Not verified** | Not probed; no project id on record | Owner to confirm |
| CRM / product (demo, trial, signup counts) | **Not verified** | Lead forms exist in site repo (`/api/lead`, `/api/leads`, PR #1 "Lead capture ... save to CRM + admin panel") | Lead counts live in that CRM/admin panel; needs read access (Loop 28) |

Net: **no actual baseline exists today.** The honest baseline is "nothing measurable yet; measurement is not wired". Fixing that is the pre-requisite for every later ranking/CTR claim.

## 2. Tracked keyword set (Ahrefs Rank Tracker, India, English) with Ahrefs volume estimates
Volumes are Ahrefs' monthly India estimates as returned; they are third-party estimates, not demand guarantees; the seed set was chosen for India.

| Keyword | Est. volume (India) | Position |
|---|---:|---|
| field force management software | 350 | none |
| field staff tracking app | 200 | none |
| field sales tracking app | 150 | none |
| field force tracking app | 60 | none |
| employee gps tracking app | 50 | none |
| sales rep tracking app | 50 | none |
| sales team location tracking | 50 | none |
| staff location tracking app | 50 | none |
| mileage tracking app | 20 | none |
| employee attendance app with gps, field employee attendance app, field visit tracking app, geo fencing attendance app, hemmiles, live location tracking for employees, travel allowance tracking app | 0 | none |

Observations:
- Total of the nine non-zero rows is small; the highest is 350/mo. Seed keywords skew to *attendance / tracking* vocabulary, which attracts the surveillance-adjacent search intent that the site's GPS positioning explicitly avoids (Loop 11/26 to resolve).
- The brief's priority markets (US, Canada, UK) have **no tracked keywords at all**. The 2026-10-21 guides (primary/secondary sales, beat plan, DSR, PJP) target India/FMCG vocabulary - consistent with the India-first keyword set, in tension with the US/CA/UK priority. Flag for Loop 10 market selection.
- Brand term "hemmiles" tracked with 0 volume and no position: brand search not yet established.

## 3. Conversion definitions (proposed, for the brief's measurement section)
Define once; use identically in every later loop. Counts are TBD until sources exist.

| Event | Definition | Source needed |
|---|---|---|
| Qualified visit | Non-brand organic session landing on a feature/team/guide/pricing page | GSC + GA4 |
| Demo request | Successful `/api/lead` submission with form type = demo | CRM/admin panel (PR #1) |
| Trial created | Account created in product | Product DB |
| Activation (proposed) | Valid account + assigned visit + completed visit with evidence + manager review + owned next action (+ verified CRM writeback for CRM-connected buyers) | Product events - needs instrumentation check (Loop 28) |
| Qualified | Demo requester matching target buyer (team >= 3 users, has/will have CRM) | Sales process; seat minimums from Loop 11 pricing check |

## 4. Decisions
1. No ranking, CTR or traffic claim is allowed in later loops unless it cites GSC, GA4 or logs. Ahrefs estimates must be labelled as such.
2. Measurement wiring (GSC verification, analytics tag live, rank-tracker locations for US/CA/UK) is promoted to a **prerequisite owner task** alongside the privacy/terms task; it gates Loops 24, 25, 28.
3. Seed keyword set is re-based in Loop 21; do not extend the India list further until markets are selected (Loop 10).

## 5. Open questions (owner)
- Q5: Verify hemmiles.com in Google Search Console, or add the research account as a user? (Ahrefs project is unverified.)
- Q6: GA4 property id and is the tag live in production? Clarity project id?
- Q7: Where do demo/contact leads land (CRM/admin panel), and can this research read counts?
- Q8: Is the Ahrefs Web Analytics script intentionally absent from production?

## 6. Next
Loop 3: complete technical inventory - fetch live robots, sitemap index and child sitemaps, reconcile against source routes (Loop 1) and the 8 guides + 3 blogs; tag each URL's discovery source.

## Update from Loop 28 (2026-10-21)
GA4 (`G-95536GJEJ5`) and Microsoft Clarity (`yugnoc43y8`) **are present in the live HTML** and documented in the site repo (`docs/analytics.md`). The "GA4/Clarity unverified" rows above should read: tag live; property/project **access** unknown (Q6). The demo/contact forms already feed the CRM and admin panel with attribution (Loop 28).
