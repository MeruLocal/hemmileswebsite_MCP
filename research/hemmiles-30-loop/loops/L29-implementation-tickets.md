# Loop 29 - Implementation tickets (executable backlog)

Date: 2026-10-21. Built from Loops 1-28. Status: **backlog drafted** (nothing implemented; this programme makes no site, DNS or account changes). Effort is relative (S small, M medium, L large) - no hours or revenue are estimated. Priority: P0 do first / blocks other work; P1 first release cohort; P2 later. "Source" = the loop that evidences the ticket. Template-level fixes are single tickets that list every page they cover (no per-page duplicates).

## 0. Wave plan
- **Wave 0 (days 1-10): owner/blocking decisions** - O01-O09, plus start O10.
- **Wave 1 (days 1-30): template and trust fixes** - D01-D12, content briefs that do not need product proof.
- **Wave 2 (days 31-60): proof-dependent work** - verification runs (V01-V04), content that needs demos, templates/calculator, integration facts.
- **Wave 3 (days 61-90): measurement and authority** - first GSC reviews, AI prompt runs, directory/app-store/marketplace presence, activation experiments.

## 1. Owner and decision tickets (P0 unless stated)

| ID | Ticket | Why / source | Acceptance | Depends |
|---|---|---|---|---|
| O01 | Fix email for hemmiles.com: choose mailbox provider; publish MX, SPF, DKIM, DMARC; send/receive test to hello@ | No MX/SPF/DMARC; contact and security routes dead (L27 F1) | Test mail to and from hello@ delivered; DMARC record present; SPF passes | provider decision (Q63) |
| O02 | Supply company legal name, registered address, jurisdiction, contact; counsel completes Privacy (6 placeholders) and Terms (7 placeholders) | L27 F2-F3, L3 F4 | No bracket placeholders on `/privacy`, `/terms`; entity shown on About/footer; pages reviewed by counsel | Q64 |
| O03 | Confirm production deployment source and why `main` is not live (5 guides 404; `/guides` lists 3) | L3 F1 | Production serves latest `main`; the 5 guides return 200; deploy record noted | Q9 |
| O04 | Verify Search Console (existing Google token in DNS) and Bing Webmaster Tools; grant research access; confirm GA4 `G-95536GJEJ5` and Clarity access | L2, L24, L27 F7, L28 | GSC property shows data; sitemap index submitted; access list recorded | Q5, Q6 |
| O05 | Decide positioning: India-first or global; which URL is the international page and x-default; hold or revise open PR #7 | L4 F4 | Written decision; PR #7 merged/held accordingly | Q12-Q14 |
| O06 | Decide the 77 mileage/tax CMS posts: keep as separate hub / noindex and unlink / retire; confirm whether any mileage feature exists | L13 F, L3 F2, L26 E4 | Decision recorded; blog index/sitemap updated accordingly (D10) | Q10, Q34, Q60 |
| O07 | Confirm execution markets: India + US (UK reserve) | L10 | Decision recorded; deferred markets frozen | Q26 |
| O08 | Provide a demo workspace (and release build/version) plus 2-3 minute walkthrough and real screenshots | L11, L12, L23 | Workspace access; screenshot set; walkthrough link | Q28, Q31 |
| O09 | Product fact sheet: sign-off meaning; checklists/required fields by plan; samples structure; recurring beat templates; Territories scope; exhibition plan, WhatsApp send, ROI widgets; coverage and frequency reports; trial day-15 behaviour | L11, L14, L15, L16, L17, L28 | Each question answered in writing and mapped to claim-ledger IDs | Q29, Q30, Q35-Q44, Q53, Q65 |
| O10 | Integration facts: connectors actually built; G1-G9 answers; sandbox for tests | L18, L19 | Written answers; sandbox access | Q45-Q47 |
| O11 | Security/privacy facts: hosting region, encryption, sub-processors, retention, DPA availability, certifications held or planned; AI-training-crawler policy | L7, L20, L26, L27 | Fact sheet approved for publication (D12) | Q20, Q50, Q61 |
| O12 | Billing facts: invoicing currency, trial terms; sales follow-up owner and time target; qualified-lead definition | L6, L28 | One approved sentence for currency; follow-up SLA documented | Q17, Q30, Q66 |
| O13 | App-store facts: are the iOS/Android apps listed? names/URLs | L21 | Listing URLs or "not listed" recorded | Q52 |
| O14 (P1) | Named author/reviewer and credentials for articles; real customer for first case study | L13, L23 | Names/approvals supplied | Q33, Q57 |
| O15 (P1) | Decide whether to create an Ahrefs Brand Radar report for Hemmiles | L26 | Yes/no recorded | Q62 |

## 2. Site development and template tickets (repo: MeruLocal/hemmileswebsite)

| ID | Ticket (covers) | Priority | Source | Acceptance | Depends |
|---|---|---|---|---|---|
| D01 | Replace India sample data in mockups (Ahmedabad coordinates, cities, customer names, dates) with market-neutral or market-specific data. Covers home, product, feature, team pages on all markets | P1 | L4 F2, L6, L7, L8, L9 | No "Ahmedabad/Surat/Vadodara/Mehta" strings on non-India markets; sample data labelled | O05 |
| D02 | One billing-currency sentence on converted-price markets (CAD, GBP, AUD, NZD, EUR, SGD, AED, ZAR); fix mismatch between "prices in X" and "charged in USD" | P1 | L6, L7, L8 | Approved sentence on every converted pricing page | O12 |
| D03 | Canonical / hreflang / sitemap alignment: sitemaps list canonical URLs only; x-default and `en` point to the chosen international page; bare-URL behaviour documented and consistent for all user agents | P1 | L3 F3, L4 F4 | URL Inspection shows Google-selected canonical equals declared; no sitemap URL canonicalises elsewhere | O05, O03 |
| D04 | Internal-link components and fixes: market-prefixed privacy/terms/customers/careers links; CMS template parity; "related product pages" in articles; "related guides" in feature/team templates; apply link plan | P1 | L25 | 0 redirecting internal links; in-body inbound for `/product`, `/integrations`, `/security` >= 5; every article >= 2 product links | O06 |
| D05 | Plan-gate component: "Professional and above" labels for visit map, CRM write-back, territories, audit trail, location/retention controls; exhibition capture plan once known | P1 | L11 C1, C5, C12 | Labels shown on route-planning, offline, security, team pages; consistent with pricing matrix | O09 |
| D06 | Reading time computed from body text (guides and blog) | P1 | L13 | Labels match word count / 200 wpm | - |
| D07 | Fix shared template copy: repeated H2 across pages; "service engineers teams" grammar; team page titles and descriptions using market vocabulary; differentiate body copy | P1 | L12 F1-F2 | Pairwise body similarity of team pages materially reduced (re-measure); titles use Loop 21 phrases | O05 |
| D08 | Article author/reviewer/date block with schema | P1 | L13, L27 T9 | Named author + role + reviewed date on every article | O14 |
| D09 | `llms.txt` and robots corrections: remove "route suggestions"; add CRM plan note; canonical URLs; soften absolutes; align positioning | P1 | L26 E1-E3, E5-E7 | File matches claim ledger; links canonical | O03 |
| D10 | Blog hub: pin the three field posts; apply O06 decision to CMS posts (noindex/unlink/redirect); dedupe sitemap `blog.xml` accordingly | P1 | L13, L25 F2 | Field posts within two clicks of `/blog`; sitemap per decision | O06 |
| D11 | Alt text for home/product images; add real screenshots and video embeds with transcript/`VideoObject` | P1/P2 | L12, L23 | All images have alt; screenshots from O08 live | O08 |
| D12 | `/customers`: separate real stories from illustrative profiles; changelog: real notes or remove nav link; security fact sheet from O11 on `/security`; company identity on About/footer | P1 | L23, L27 | Labels preserved; no placeholder changelog in nav; facts published | O02, O11 |
| D13 | Build templates (5) and Calculator 1 per specs; downloads ungated; labelled illustrative examples; unit tests for formulas | P2 | L22 | Files/tool pass the spec's acceptance and test cases | content owner |
| D14 | Instrumentation: events for template download, calculator start/complete/copy; cross-domain measurement for `app.hemmiles.com`; monthly report on the demo form's CRM field | P2 | L22, L28 | Events visible in GA4 DebugView; cross-domain verified | O04 |
| D15 | Browser audit: mobile layout, tap targets, Core Web Vitals, cookie banner/consent behaviour, forms (without submitting) | P1 | L12 F6, L27 T10 | Written pass/fail per template | - |

## 3. Content tickets (no new URLs unless stated)

| ID | Ticket | Priority | Source | Acceptance | Depends |
|---|---|---|---|---|---|
| C01 | Ten commercial page refreshes: home, product, how-it-works, pricing (minimum monthly spend, currency sentence), route planning (plan label, no optimisation), GPS check-in (recorded/when/who sees), offline (capability matrix), integrations (generic until G18), service team page, field-sales team page | P1 | L12 | Each brief's changes shipped using ledger wording | D01, D05, O08-O09 |
| C02 | Six article refreshes with practical assets and feature links (visit-record checklist, event vs continuous table, offline matrix, field-day plan, rollout checklist, visit-report template) | P1 | L13 | Each article has asset(s), >= 2 product links, author block | D04, D08, D13 |
| C03 | Distribution/sales page rewrites with the product-boundary line; India vocabulary on `/in`, US vocabulary on `/us`; distribution, collections, medical reps pages | P1 | L14, L16 | Boundary sentence present; vocabulary per market | O09 |
| C04 | Service page rewrite (visit evidence positioning; boundary line) | P2 | L15 | Claims match ledger after O09 | O09, O08 |
| C05 | Exhibition capture page: US vocabulary (trade show / lead retrieval), plan label, privacy note | P2 | L17 | Wording matches verified capabilities | O09, O11 |
| C06 | Five India guides: add downloadable templates (DSR, beat/PJP sheet, visit report) once live | P1 | L21, L22 | Templates linked; guides live (O03) | O03, D13 |
| C07 | New URL N1: CRM integration checklist | P1 | L21 | Generic but true; links to integrations | O10 |
| C08 | New URL N2: CRM vs sales-force automation vs field service software decision guide | P2 | L21 | Honest positioning; PAA answers | O09 |
| C09 | New URL N3 (candidate): sales territory planning guide - only after Territories scope is confirmed | P2 | L21 | Product-accurate | O09 (Q53) |
| C10 | Video 1-3 production per scripts; visuals V1, V6, V2 first | P2 | L23 | Videos with captions/transcripts; visuals with sources and definitions | O08 |
| C11 | Case study (real) using the protocol | P2 | L23 | Written permission; baseline vs after | O14 |
| C12 | "Moving from spreadsheets" guide (N7) and trade-show workflow guide (N9) | P2 (conditional) | L21 | Only if O10/O09 evidence exists | O09, O10 |

## 4. Product / in-app tickets (to the product team)

| ID | Ticket | Priority | Source | Acceptance |
|---|---|---|---|---|
| P01 | In-app activation events (account_created, user_invited, customers_imported, visit_assigned, first_checkin, visit_completed with evidence flag, manager_review, followup_created, crm_writeback_verified) + weekly active users | P1 | L28 | Events flow to a report; activation definition computable |
| P02 | Sample-data workspace for trials (neutral customers) and a "first visit in 15 minutes" path | P2 | L28 | First completed test visit possible without importing data |
| P03 | If missing: recurring beat templates; coverage and frequency attainment reports; structured sample/collection fields | P2 | L14, L16 | Match Loop 14/16 requirements (or documented as not offered) |
| P04 | Define and document "sign-off"; clarify checklist availability by plan | P1 | L15 | Documented in help/docs |
| P05 | Integration behaviour documentation: photos/notes sync, conflict rule, geocoding, retry, identity mapping, back-fill | P1 | L18 | Docs cover G2-G7 |

## 5. Marketing, authority and measurement tickets

| ID | Ticket | Priority | Source | Acceptance | Depends |
|---|---|---|---|---|---|
| M01 | First Search Console pull per Loop 24 spec; monthly review; opportunity register | P1 | L24 | Pull delivered; opportunities labelled with periods and confidence | O04 |
| M02 | AI visibility: run the 16-prompt set monthly; maintain factual-error register | P1 | L26 | Raw answers stored; register updated | D09 |
| M03 | Directory profiles (accurate ledger wording), app-store listings, CRM marketplace listings for proven connectors | P2 | L26, L27 | Profiles live; no unverifiable claims | O01, O02, O08, O13 |
| M04 | Pitch templates/calculator to relevant blogs and associations; disclosed community participation | P2 | L27 | Outreach log; no purchased links | D13 |
| M05 | LinkedIn company page and YouTube channel | P2 | L27 | Pages live with company identity | O02 |
| M06 | Rank tracker re-base: add US/UK keywords and India informational set, retire non-applicable terms; schedule monthly | P2 | L2, L21 | Tracker aligned with ownership register | O05 |
| M07 | Competitor re-check on day of use; comparison page only after gates (Hemmiles vs Map My Customers) | P2 (blocked) | L20 | Gates passed | V02, D05 |
| M08 | Monthly measurement report: demos, qualified demos, trials, activation, paid, onboarding effort | P1 | L28 | Report uses the Loop 28 glossary | O04, P01 |

## 6. Verification tickets

| ID | Ticket | Source | Acceptance |
|---|---|---|---|
| V01 | Run the claim ledger C1-C18 against the demo workspace (iOS, Android, web) | L11 | Each claim marked verified/changed/removed with evidence |
| V02 | Run connector tests T1-T14 for any connector offered; record version/date | L18 | Pass/fail table with recordings |
| V03 | Offline test (T8 plus airplane-mode video test) | L18, L23 | Result published only after pass; failures stated |
| V04 | Full crawl of all 152 sitemap URLs plus market pages: status, canonical, robots, hreflang, headings, links; re-check after deploy | L3 | Report after O03 deploy; no unexplained non-200 or canonical conflict |
| V05 | Post-deploy recheck: five guides live, sitemap includes them, internal link metrics, AI prompt re-run | L3, L25, L26 | Metrics meet Loop 25 targets |

## 7. Consolidation check (duplicates removed)
- India sample data across 10 market pages and mockups -> **D01** only.
- Currency-sentence mismatch on 8 converted markets -> **D02** only.
- Plan-gate omissions on route/offline/security/team/exhibition pages -> **D05** only.
- Reading-time labels on 6 articles -> **D06** only; shared H2/grammar on 14+ pages -> **D07** only.
- Redirecting internal links on 113 pages -> inside **D04**; CMS template parity inside D04/D10.
- All llms.txt errors -> **D09** only.

## 8. Dependencies in one view
O01-O02 -> M03/M05 and any outreach. O03 -> D03, C06, V04-V05. O04 -> M01, M08, D14. O05 -> D01, D03, D07, M06. O06 -> D04, D10. O08/O09 -> D05, C01-C05, V01, C10. O10 -> C07, V02, M07. O11/O14 -> D08, D12. D13 -> C02, C06, M04.

## 9. Open questions
- Q68: Who is the owner/assignee for each ticket group (founder, developer, content, product, sales)? The tickets above name functions, not people.

## 10. Next
Loop 30: consolidated handoff - resolve conflicts, select the first release cohort, define measurement, and produce the index and 30/60/90-day roadmap; then stop the scheduled job.

## Addendum from Loop 33 (2026-10-21)
| ID | Ticket | Priority | Source | Acceptance | Depends |
|---|---|---|---|---|---|
| O16 | India pricing and packaging review: are INR 3,500 / 4,500 / 8,000 per user per month (about 5-6x the TrackoField figures, Loop 33) intended; add a pilot offer or lower tier; positioning against attendance/tracking bundles | P1 | L33 | Written decision on India price points, minimums, pilot terms | Q72, O07 |
