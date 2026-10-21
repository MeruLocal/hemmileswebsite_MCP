# Loop 30 - Consolidated handoff

Date: 2026-10-21. Covers Loops 1-29 (index: `../INDEX.md`). Status vocabulary: nothing in this programme is **implemented, merged, deployed or measured**. Every deliverable is **researched / specified / drafted** only. Figures from Ahrefs and similar tools are third-party estimates, never Hemmiles traffic.

## 1. Executive summary
1. **Hemmiles has a coherent, modestly priced product proposition and almost no discoverability or trust infrastructure.** The marketing site is technically tidy (one H1, descriptions, JSON-LD, GA4 and Clarity live, a robust lead pipeline) but: the domain has no Search Console data, no AI citations, 2 backlinks, no company identity, unfinished Privacy and Terms (13 placeholders), and **no mail records, so the published `hello@` address almost certainly bounces**.
2. **Production is behind the code:** the five new guides merged on 2026-10-21 return 404 live.
3. **Positioning is India-derived everywhere.** Every market page is the India page with currency and a few nouns swapped (about 99.7% identical), still showing Ahmedabad sample data; `x-default`/`en` point at a bare URL that canonicalises to `/in`.
4. **Demand evidence points to India and the US**, with service teams a promising but unverified wedge and everything else deferred.
5. **Claims are unverified.** The ledger (18 claims) is page-only; integration, offline, sign-off, exhibition and several sales/service features need a demo workspace.
6. **The evidence supports about 3 new URLs and about 6 template/asset upgrades to existing pages, not eight new topics.**
7. **A large block of off-topic content (77 mileage/tax CMS posts) sits on the site and dominates the blog index** with no supporting product feature.

## 2. Conflicts between loops and how they are resolved

| # | Conflict | Resolution |
|---|---|---|
| 1 | Brief priority (US, Canada, UK first) vs evidence (India strongest, Canada negligible) | **India + US execute (US gated); UK reserve; others deferred** (Loop 10). Founder confirms (Q26) |
| 2 | US wedge: sales (Loop 5) vs service (Loop 15: US "field service app" 3x larger) | Service is a **supporting angle and long-tail template play**, not a new head-term URL: the service SERP is app stores and platform vendors (Loop 21); product supports visit evidence, not FSM. Sales remains primary US positioning |
| 3 | "No more India-vocabulary guides" (Loop 13) vs India format queries have real volume (Loop 21) | Keep the five guides; attach templates; no *additional* guides without GSC evidence |
| 4 | "Lowest price" (Loop 20) vs cheaper tools surfaced (Loop 26) | Scoped to the six benchmarked vendors only; do not claim "lowest" publicly |
| 5 | GA4/Clarity unverified (Loops 1, 2, 24) vs live in production (Loop 28) | Tags are live; only account **access** is unknown. Local unpushed GA4 commit is superseded |
| 6 | "Add a CRM field to forms" (Loop 19) vs form already has `crm` (Loop 28) | No change needed; report on it |
| 7 | Brief says ~8 new topics vs Loop 21 evidence | ~3 new URLs (2 approve-ready, 1 candidate) + 6 asset upgrades |
| 8 | Metadata is healthy (Loop 12) vs no search visibility (Loop 24) | Not contradictory: visibility problem is indexing/trust/duplication, not tags |
| 9 | Duplicate question numbers (Q10 asked twice) | Consolidated register in section 7 |

## 3. First release cohort (days 1-30)
Ship only what needs no proof of product behaviour and fixes trust, discoverability and duplication:
- **Owner actions:** O01 email, O02 legal entity + Privacy/Terms, O03 deploy parity, O04 Search Console / GA4 / Clarity access, O05 India-first decision (and PR #7), O06 mileage-post decision, O07 markets confirmation, O08 demo workspace, O09 product fact sheet.
- **Template/site fixes:** D01 sample data, D02 currency sentence, D03 canonical/hreflang/sitemap, D04 internal links, D05 plan labels, D06 reading time, D07 shared-copy fixes, D09 llms.txt, D10 blog hub, D15 browser audit.
- **Content that needs no product proof:** C01 (home, pricing, product structure, route-planning labels, generic integrations), C06 (five India guides live, templates later), C02 (article structure and links; assets follow).
- **Measurement:** M01 first Search Console pull; M02 AI prompt baseline; metric glossary adopted (Loop 28).
Exit test for cohort 1: no placeholders on legal pages, email works, five guides live, canonical/sitemap clean, sample data corrected, internal-link metrics met, GSC receiving data.

**Cohort 2 (days 31-60):** verification (V01-V04) with the demo workspace; D13 templates and Calculator 1; C02 assets; C03-C05 role/vertical rewrites; C07 CRM checklist and C08 decision guide; videos and visuals needing product evidence; P01 instrumentation; D08/D12 trust blocks; D14 events.
**Cohort 3 (days 61-90):** M03-M06 directories/app stores/marketplaces and outreach; C09, C11, C12 conditional content; activation experiments; comparison page only after gates; Brand Radar if approved.

## 4. 30/60/90-day roadmap (delivery windows, not ranking or revenue promises)

| Window | Goals | Exit criteria |
|---|---|---|
| Days 1-30 | Trust and plumbing: email, legal identity, deploy parity, canonical clean-up, correct sample data, link structure, measurement access | Cohort 1 exit test met; first GSC and analytics pull reviewed; decisions O05-O07 recorded |
| Days 31-60 | Proof: demo-verified claims, connector tests, templates/calculator, role pages, videos, in-app events | Ledger rows marked verified/changed; at least one connector tested (pass or documented fail); templates live; activation events flowing |
| Days 61-90 | Authority and optimisation: directories, app stores, marketplaces, outreach; first opportunity refreshes from real data; activation/pilot experiments; second market decision | First 90-day search data review; AI prompt re-run; experiments launched; market re-score done |

## 5. Measurement plan
Baselines today: **organic clicks/impressions unknown, AI citations 0, backlinks 2, referring domains 2, DR 0, tracked-keyword positions none, demo/trial/activation counts unavailable.** No targets are set until a 28-day baseline exists.

| Layer | Metric (Loop 28 definitions) | Source | Owner | Cadence |
|---|---|---|---|---|
| Discovery | Indexed pages, impressions, clicks by market; non-brand queries; position bands | GSC | content/SEO | monthly |
| Discovery | AI-prompt mentions/citations and accuracy | prompt set + Ahrefs counts | content/SEO | monthly |
| Content utility | Template downloads, calculator completions, article-to-feature progression | GA4 events (D14) | content | monthly |
| Intent | pricing views, demo_click, signup_click, form_start | GA4 | marketing | monthly |
| Conversion | demo requested, qualified demo (company, team >= 3, non-free-mail, CRM stated), demo attended | GA4 + CRM | sales | monthly |
| Activation | trial created, activated team (Loop 28 proposal), week-4 active reps | app events (P01) | product | weekly in pilots |
| Commercial | paid conversion, onboarding effort | billing + support log | founder | monthly |
| Trust | legal pages complete, email deliverability, certifications held (yes/no), real case studies (count) | checklist | founder | monthly |
Every report states period, denominators, definitions and limitations; UK/EU analytics undercount because of consent (Loop 28).

## 6. Top risks
1. Lost enquiries from dead email (O01) - highest, cheapest fix.
2. Publishing unverified claims (route optimisation, named CRMs, offline completeness, certifications) - mitigated by the ledger.
3. Duplicate/near-duplicate market pages wasting crawl and diluting signals (D01, D03, D07).
4. Off-topic CMS content distorting topical focus and AI answers (O06).
5. Measurement not connected (GSC/GA4/app events) so nothing can be proven (O04, P01).
6. Over-promising to buyers who expect field service management or order capture (boundary lines).
7. Legal exposure from missing legal identity and privacy statements, especially for UK/EU/AU/SG buyers.
8. Competitors with certifications and review-site presence outranking in AI answers (M03).
9. Product changes outdating claims (ledger refresh triggers each release).
10. Single-person dependency for founder decisions (Q68).

## 7. Consolidated open-question register (founder/owner)
Priority A (blocks cohort 1):
- **Email:** provider and whether `hello@` receives mail (Q63).
- **Legal entity and legal pages:** name, address, jurisdiction, counsel (Q3, Q64).
- **Deploy:** why production is behind `main`; deployed commit (Q1, Q9).
- **Measurement access:** Search Console (existing Google token), Bing, GA4 `G-95536GJEJ5`, Clarity (Q4, Q5, Q6, Q8, Q58).
- **Strategy:** India-first or global; x-default; PR #7 (Q12-Q14); confirm India + US execution markets (Q26).
- **Mileage/tax CMS posts:** origin, intent, mileage feature, template ownership (Q10, Q34, Q60).
- **Demo workspace and assets:** workspace, screenshots, walkthrough (Q28, Q31, Q56).
Priority B (blocks cohort 2):
- **Product facts:** sign-off, checklist plan gate, structured samples/collections, recurring beats, coverage reports, Territories scope, exhibition plan/WhatsApp/ROI, trial day-15 (Q29, Q30, Q35-Q39, Q40-Q44, Q53).
- **Integrations:** connectors built, G1-G9, sandbox (Q45-Q47).
- **Security/privacy:** hosting region, retention, DPA, certifications held/planned, AI-crawler policy (Q20, Q50, Q61).
- **Billing/sales process:** invoicing currency, follow-up owner and SLA, qualified lead (Q17, Q66), post-signup flow and cross-domain measurement (Q65, Q67), app-store listings (Q52).
- **People/proof:** named author/reviewer, case-study customer, partners-page facts (Q33, Q57, Q32), leads/customers by market (Q16, Q18, Q21, Q22, Q24, Q41), assignee per ticket group (Q68).
Priority C: Brand Radar report (Q62), minimum impression threshold (Q59), template/file hosting and build ownership (Q54, Q55), service/vertical specifics and regulatory counsel (Q19, Q40, Q41).

## 8. Reuse and repository notes
- All research lives on branch `research/hemmiles-30-loop-2026-10-21` of `MeruLocal/hemmileswebsite_MCP`; one rolling draft PR (#22) carries a one-line log per loop. It changes no application code.
- Open MCP-repo PRs #2-#21 (audit plans and MCP hardening) are unrelated to the site tickets here except as the tooling that reads the public site (its sitemap fallback should be reconciled with the live sitemap before it is used for inventories again; Loops 1, 3).
- Site-repo PR #7 (canonical/robots) is held pending O05.

## 9. Decisions recorded
1. Programme complete at 30 loops; deliverables are research and specifications only.
2. Cohort 1 scope and exit test as in section 3.
3. No numeric targets until a 28-day baseline exists.
4. Extension loops (full crawl, rendering and mobile audit, India competitor price benchmark, Terms read-through, contradiction audit, and post-unblock verification loops) are available if the founder wants them.

## 10. Status
Researched/specified: Loops 1-30. Implemented: none. Merged: none. Deployed: none. Measured: none.
