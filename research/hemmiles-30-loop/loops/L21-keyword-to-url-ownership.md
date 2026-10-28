# Loop 21 - Keyword-to-URL ownership

Retrieved: 2026-10-21. Sources: Loops 5-20 plus this loop's Ahrefs pulls (US SERP for "field service app", 300 units; US informational keywords, 242 units; India informational keywords, 242 units; third-party estimates, not our traffic; `cpc` in USD cents; absent keywords = unmeasured). Status: **researched**. Rule: **one owning URL per distinct purpose per market**; a new URL needs a stated reason; countries share an owner via hreflang, not via duplicate targeting.

## 1. New evidence this loop

### US SERP "field service app" (intent check promised in Loop 15)
AI Overview first; then App Store / Google Play listings (Salesforce Field Service, Intrflex, Tofu), Microsoft Dynamics 365 Field Service docs, Salesforce product pages, a vendor guide, Reddit, Quora, a utilities-industry page. Intent = **mobile technician apps from platform vendors and app-store listings**, with DR 92-100 domains. Conclusion: a new Hemmiles URL for the head term would not be competitive; a supporting mention on the service page is enough. App-store presence is a ranking surface here (Q52).

### Informational / template demand (estimates)
| India keyword | Vol. | KD | | US keyword | Vol. | KD |
|---|---:|---:|---|---|---:|---:|
| daily sales report format | **350** | 0 | | sales territory planning | **250** | 0 |
| visit report format | **200** | 0 | | field service report template | **150** | 0 |
| dsr format | 150 | 0 | | field sales route planning | 100 | 0 |
| primary and secondary sales | 100 | 0 | | sales call report template | 90 | 0 |
| pjp in sales | 80 | 0 | | site visit report template | 40 | 0 |
| field visit report format | 80 | 0 | | route planner for sales reps | 40 | 4 |
| journey plan | 30 | - | | customer visit report | 30 | 0 |
| sales visit report format / daily call report format | 20 / 20 | - | | sales visit report template | 20 | - |
| beat plan format | 0 (CPC ~$0.45) | 0 | | field visit report template | 10 | - |
Correction to Loops 10/13: "beat plan app"/"dsr app" had no app-query volume, but **format/report informational queries do** (350, 200, 150 in India). The five new guides line up with measurable India informational demand, and their natural companion is a downloadable template (DSR, visit report, beat plan sheet, PJP sheet).

## 2. Ownership map (existing URLs; IN and US; other markets inherit)

| Purpose / cluster | Owner URL (market-prefixed) | Key phrases | Notes |
|---|---|---|---|
| Brand + category | `/` (`/in`, `/us`) | brand, "field visit app" | routing page only |
| Product head term | `/product` | IN: field force management software (350), field sales app (200), field sales tracking app (200); US: field sales app (600), outside sales app (200), sales rep tracking app (100) | PR #8 optimisation; not live (Loop 3) |
| Team: field sales | `/teams/field-sales` | IN: salesman tracking app (150), sales team tracking app (70); US: field sales software (450), field sales management software (100), field sales CRM (300) | differentiate from `/product` by workflow/role |
| Team: service | `/teams/service` | IN: field service app (300); UK/AU/US/SG: field service app | supporting only (SERP competitive); service report template via guide |
| Team: distribution | `/teams/distribution` | outlet coverage, beat | India vocabulary on `/in` |
| Team: collections | `/teams/collections` | IN: payment collection app (100) | boundary line |
| Team: medical reps | `/teams/medical-reps` | IN: mr app (100) | boundary line |
| Feature: route | `/features/route-planning` | US: field sales route planning (100), route planner for sales reps (40) | planning, not optimisation |
| Feature: GPS check-in | `/features/gps-check-in` | check-in, geo-fencing attendance (IN tracked) | blog owns principles |
| Feature: offline | `/features/offline-mode` | offline field app | |
| Feature: exhibition | `/features/exhibition-capture` | US: lead retrieval app (400), trade show lead capture app (150) | rename vocabulary after verification |
| Feature: follow-ups, photos/notes, reports, dashboard, visit planning | each own feature page | feature names | no extra URLs |
| CRM fit | `/integrations` | CRM integration questions | generic only until G18 |
| Pricing | `/pricing` | price, per-user | |
| Report-format informational (IN) | `/guides/daily-sales-report-dsr` (DSR format 350 / dsr format 150), `/guides/writing-useful-visit-notes` (visit report format 200, field visit report format 80), `/guides/permanent-journey-plan-pjp` (pjp in sales 80), `/guides/primary-vs-secondary-sales` (100), `/guides/beat-plan` (beat plan; 0 as format) | one guide each + a template download each | five guides not yet live |
| Report-template informational (US) | `/guides/writing-useful-visit-notes` | sales call report template (90), site visit report template (40), field service report template (150) | **one URL carries two examples (sales, service)**; split into dedicated pages only if Loop 24 shows separate query impressions and the SERP rewards dedicated pages |
| GPS principles | `/blog/gps-check-in-without-surveillance` | | blog = principles, guide = implementation |
| GPS implementation | `/guides/rolling-out-gps-check-in` | | |
| Field-day planning | `/guides/planning-a-field-day` | | owns the schedule procedure/planner asset |
| Offline evaluation | `/blog/offline-first-field-apps` | | owns checklist asset |
| CRM data capture | `/blog/why-field-visits-fall-out-of-the-crm` | | owns visit-record checklist |
| Field vs inside sales (US) | `/guides/field-sales-vs-inside-sales` | | not live |

Cannibalisation risks to monitor: product vs field-sales team page (US "field sales" terms); home vs product; GPS blog vs GPS guide; any two country pages for the same market term (hreflang cluster rule); the 77 CMS mileage posts vs nothing (no Hemmiles page owns mileage; hold).

## 3. New URL candidates and verdicts (reason required)

| # | Candidate | Evidence | Verdict |
|---|---|---|---|
| N1 | CRM integration checklist (evaluation guide) | objection removal (Loop 19); no volume needed | **APPROVE-READY** once owner answers G1-G9 generically |
| N2 | Field CRM vs sales-force automation vs field service software (decision guide) | PAA "difference between CRM and FSM"; service SERP is platform-dominated | **APPROVE-READY, release cohort 2**; position Hemmiles honestly as a visit-evidence layer |
| N3 | Sales territory planning guide | US 250, KD 0, CPC ~$3.50; Territories feature (Professional) exists | **CANDIDATE**; confirm what Territories actually does (Q53) before approving |
| N4 | Route planning vs route optimisation | no measured phrase volume; adjacent "field sales route planning" 100 | **HOLD**; fold content into the route-planning page first |
| N5 | Account coverage and visit frequency (guide + worked dataset) | KPI definitions exist (Loop 14); no measured volume | **HOLD**; ship as a section + calculator (Loop 22) |
| N6 | Field manager's weekly review checklist | no measured volume | **HOLD**; fold into the manager-dashboard page/asset |
| N7 | Moving from spreadsheets and chat groups | depends on Loop 18 evidence | **HOLD** until migration facts confirmed |
| N8 | Cost per field visit / visit capacity (calculators) | cost per sales visit: no data | **HOLD**; decide in Loop 22 as linkable assets, not SEO bets |
| N9 | Trade-show capture to first follow-up | needs verified workflow (Loop 17) | **CONDITIONAL** |
| N10 | Named-CRM pages | gate G18 | **BLOCKED** |
| N11 | Hemmiles vs Map My Customers | gates in Loop 20 | **BLOCKED** |
| N12 | Industrial service-visit documentation guide | service positioning unverified | **HOLD**; reuse the service-visit evidence record (Loop 15) in templates |
| N13 | Distributor outlet-visit programme guide | covered by beat-plan/DSR/primary-secondary guides + distribution page | **DO NOT CREATE** (duplicate) |
Net: **0 new URLs approved today; 2 approve-ready (N1, N2), 1 candidate (N3), conditional/blocked/hold for the rest.** The brief's "roughly eight new topics" is not supported by evidence; the evidence supports **~3 new URLs + ~6 template/asset upgrades to existing URLs**.

## 4. Decisions
1. This table is the ownership register; every later content ticket must name its owner row.
2. Template downloads attach to the five India guides and the visit-notes guide (Loop 22 specs) - highest-evidence, lowest-cost win.
3. No dedicated "field service app" URL; keep service as team page + decision guide + template.
4. Pursue app-store listing presence if the mobile apps are in the stores (Q52).

## 5. Open questions
- Q52: Are the Hemmiles iOS and Android apps listed in the App Store / Google Play, under what names and URLs? (App listings rank for "field service app".)
- Q53: What exactly do Territories do (assignment of accounts to reps, boundaries on a map, coverage reporting)? Needed before N3.

## 6. Next
Loop 22: templates and calculators - existing assets, usability, formulas, validation, exports and maintenance; three template specs and two calculator specs.
