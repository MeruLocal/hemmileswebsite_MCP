# Loop 12 - Existing commercial pages audit and ten refresh briefs

Retrieved: 2026-10-21. Method: scripted fetch of 31 live commercial pages at `https://hemmiles.com/in/...` (the canonical market, Loop 3 F3; `/us` etc. share the same structure per Loop 4), extracting `<title>`, meta description, `<main>` text, headings, links, images, JSON-LD types. No browser rendering: **mobile flow, visual design, tap targets and Core Web Vitals were not tested** (carry to Loop 25/28 with a browser pass). Status: **researched**.

## 1. Page-level facts (31 pages)

| Item | Result |
|---|---|
| H1 count | exactly 1 on every page |
| Meta description length | 135-161 characters on every page; none missing |
| Title length | 28-54 chars; shortest are team/partner pages (28-32) |
| Open Graph image | present on all |
| JSON-LD | Organization + SoftwareApplication on all; BreadcrumbList on all but home; FAQPage on pricing, integrations, help; no `HowTo`/`Article` sampled |
| Images in main | home 3, product 2, a few others 1; the rest 0 (UI shown as drawn mockups, no real product screenshots). 3 of 3 home images and 2 of 2 product images have no alt text |
| Word count (main) | home ~1,890; product ~1,070; pricing ~990; how-it-works ~930; resources ~600; features index ~660; each feature ~470-580; each team ~490-530; help ~720; about ~300; guides hub ~260; partners ~230; demo ~190; contact ~140 |
| CTA links | demo/contact/pricing on all content pages; `demo` page has none (it is the form); `partners` has none |
Technical hygiene is generally **good**; the weaknesses are content differentiation and proof, not tags.

## 2. Findings

### F1 (high) Team pages share one template; copy is ~96-97% identical
Pairwise text similarity: field-sales vs service 0.970; distribution vs collections 0.961; field-sales vs distribution 0.974. Each has the same H2 skeleton ("Where X work gets lost today", "The features X teams use most", "From assigned visit to completed report", "Also built for") with swapped nouns. A grammar bug appears: "The features **service engineers teams** use most." Titles are bare ("Field Sales in India | Hemmiles", 31 chars) with no category term from Loop 5/10 research ("field sales app", "field force management software"). The description sentences are good and specific (service: checklist, before/after photos, sign-off; collections: amount, balance, promised date; distribution: beats, outlet coverage, stock/shelf photos). These are the real differentiators and should drive the body.

### F2 (high) Feature pages repeat one skeleton and one shared H2
Every feature page uses "<Feature>, step by step." / "From assigned visit to completed report." / "Works together with" / "Give your field team a better way to work." The same H2 also appears on product, how-it-works and every team page. Pairwise: gps-check-in vs route-planning 0.936; product vs how-it-works 0.899. Pages do not answer a distinct buyer question beyond the first screen (Loop 21 owns query mapping).

### F3 (high) Claims and plan gating (from Loop 11)
Route planning and CRM write-back appear without plan labels; security copy implies Enterprise-only controls; exhibition capture plan unstated. These affect briefs 5, 7, 9.

### F4 (medium) No product proof on pages
Zero real screenshots, no video, no customer evidence (customers page is illustrative and noindex). The mockups contain India sample data on every market (Loop 4). The most valuable proof assets are a short real-product walkthrough video and annotated screenshots (Loop 23 specifies).

### F5 (medium) Thin or weakly useful pages
`partners` (~230 words, no CTA link), `guides` hub (~260 words), `about` (~300 words), `contact` (~140 words; fine for a form page). `resources` (~600) and `docs` (~490) exist but docs content depth is not assessed.

### F6 (low) Mobile and speed
Not measured here. Static HTML size and absence of heavy images suggest low page weight; do not state performance claims without a test.

## 3. Ten refresh briefs (priority order; no new URLs)

Each brief lists: purpose, buyer, changes, proof, links, dependencies. Wording must follow the Loop 11 ledger.

1. **Home `/`** - Purpose: buyer fit and routing. Changes: lead with the category phrase of the chosen market (IN: "field force / field sales tracking"; US: "field sales app / outside sales"); replace India mockups with market-neutral or market-specific data; add 3 team-selector links; add plan-neutral pricing teaser (from 3 users, 14-day trial). Proof: one real screenshot set. Links: product, how-it-works, pricing, demo. Deps: Q12/Q13 (India-first?), Loop 10.
2. **Product `/product`** - Purpose: product detail. Changes: keep PR #8 "field sales app" optimisation (merged to main, not live; Loop 3 F1); differentiate from how-it-works by organising by *role* (rep / manager / admin) and *capability*, not the same 7 steps; add feature-to-plan table with gating (C1, C5). Proof: annotated screenshots. Deps: deploy of main.
3. **How it works `/how-it-works`** - Purpose: end-to-end workflow. Changes: one real worked example ("a day for a rep and a manager") with timestamps; add exception paths (weak GPS, offline, missed visit); remove repeated H2 shared with other pages. Proof: demo recording. Deps: Q28.
4. **Pricing `/pricing`** - Purpose: commitment clarity. Changes: show the minimum monthly spend per plan ($117 / $147 / $495 in USD) and "managers count as users"; state billing currency in one sentence on converted-price markets; add "what you need for CRM connection" row; link demo for Enterprise and pilots. Proof: billing owner confirmation (Q17, Q30). Deps: Loop 11.
5. **Route planning `/features/route-planning`** - Purpose: set accurate expectations. Changes: add "Professional and Enterprise" label; spell out what it does (map, order, status, directions handoff) and what it does not (no optimisation); link to a decision article "route planning vs route optimisation" (Loop 21 candidate). Proof: iOS + Android demo.
6. **GPS check-in `/features/gps-check-in`** - Purpose: trust and evaluation. Changes: add a "what is recorded, when, who sees it" table (C2, C3, C15); show a weak-GPS exception example; link to the GPS blog (principles) and rollout guide (implementation). Proof: privacy owner sign-off.
7. **Offline mode `/features/offline-mode`** - Purpose: reliability proof. Changes: capability matrix (what works offline, by platform), reconnect behaviour, conflict handling; link to the offline article; remove or caveat the CRM write-back step for non-Professional readers (C5). Proof: controlled offline test (Loop 18).
8. **Integrations `/integrations`** - Purpose: reduce CRM-fit anxiety. Changes: add an object/direction/ownership table once evidenced; keep "depends on your CRM" until connectors are demonstrated; add a "questions to ask any vendor" checklist (CRM integration checklist candidate). Proof: Loop 18 tests. **No named CRMs yet.**
9. **Service team `/teams/service`** - Purpose: first alternative beachhead (UK 250, AU 200, SG 90 "field service app"; India 300). Changes: rewrite with service-specific workflow (checklist, before/after photos, sign-off, next service date), fix the "engineers teams" grammar, new title using "field service app" vocabulary; add a worked service-visit record. Proof: Loop 15; note the checklist/sign-off features must be verified as product capabilities (page claims them).
10. **Field sales team `/teams/field-sales`** - Purpose: primary commercial team page for IN and US. Changes: lead with account coverage, visit evidence, follow-up ownership, manager review; use the Loop 5 US vocabulary and Loop 10 India vocabulary; differentiate from distribution page.

## 4. Remaining pages: initial decisions

| Page | Decision |
|---|---|
| features/visit-planning, photos-notes, follow-ups, manager-dashboard, reports | Retain; apply skeleton fix in Loop 29 batch; add plan labels and one worked example each |
| features/exhibition-capture | Retain; state plan availability (Q29) |
| teams/distribution, collections, medical-reps | Retain; rewrite bodies after Loops 14-16; fix title/H2 template |
| features index, teams index, resources, docs, help | Retain; link-density and differentiation review in Loop 25 |
| security | Retain; align plan gating with pricing (C12); sub-processor/retention facts after Q3 |
| demo, contact | Retain; check form flow, confirmation message and lead-tracking in Loop 28 |
| about, partners, guides, blog hubs | Retain; add substance (team/entity facts need owner; partner programme specifics need owner) |
| privacy, terms | **Owner task first** (Loop 3 F4); not an SEO page |

## 5. Decisions
1. Metadata is not the bottleneck; differentiation, proof and plan clarity are.
2. Ten briefs above feed Loop 29 tickets; no new URLs are approved until Loop 21.
3. Fix-once template items (shared H2, "X teams" grammar, India mockups, plan labels) are single tickets, not per-page tickets.

## 6. Open questions
- Q31: Can we get real screenshots and a 2-3 minute product walkthrough (rep + manager)?
- Q32: Who owns partners-page facts (programme tiers, terms)?

## 7. Next
Loop 13: existing blogs and guides (3 blogs, 8 guides, plus the 77 CMS posts sample).
