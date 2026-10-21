# STATE (updated by each tick)

- Programme start: 2026-10-21
- Branch: research/hemmiles-30-loop-2026-10-21 (repo hemmileswebsite_MCP)
- Next loop to run: 21
- Loops complete: 20

| Loop | Status | File | Notes |
|---|---|---|---|
| 1 | researched | loops/L01-prior-work-and-provenance.md | Site repo = MeruLocal/hemmileswebsite; guides now 8 not 3; prod deploy commit unknown; local GA4 commit unpushed |
| 2 | researched | loops/L02-search-and-commercial-baseline.md | No actual baseline: GSC unverified, Ahrefs WA 0 data, rank tracker 16 kw India-only, 0 positions; GA4/Clarity/CRM unverified |
| 3 | researched (first pass) | loops/L03-technical-inventory.md | 152 sitemap URLs; 5 new guides 404 live (prod behind main); 77 off-topic mileage/tax CMS posts; bare URLs sitemapped but canonical=/in; privacy placeholders confirmed; full crawl/render still to do |
| 4 | researched | loops/L04-country-page-audit.md | Core country pages ~99.7% identical text; Ahmedabad/Surat sample data on every market; x-default+en point to bare URL whose canonical is /in; fr/de noindex live, PR #7 would flip; Q12-Q14 gate PR #7 |
| 5 | researched | loops/L05-united-states.md | Decision VALIDATE. US vocabulary = field sales app/software/CRM, outside sales; "field visit app" has 0 measured US volume; SERP led by AI Overview + vendor listicles + Reddit + Gartner; Ahrefs units ~1,200 |
| 6 | researched | loops/L06-canada.md | Decision DEFER as separate market: Ahrefs CA volume 10-20/mo; /ca shows Ahmedabad coordinates; CAD shown but charge raised in USD (wording tension); Quebec needs express-consent/French check by counsel |
| 7 | researched | loops/L07-united-kingdom.md | Decision VALIDATE (2nd after US). "field service app" 250/mo UK is the standout; /gb still shows Ahmedabad data, no UK data-protection/VAT facts; privacy page blank blocks UK B2B; hosting/DPA unknown |
| 8 | researched | loops/L08-australia-nz-ireland.md | AU/NZ/IE all DEFER; "field service app" is the only meaningful term (AU 200, NZ 30, IE 10); AUD prices equal CAD figures (check FX); same Ahmedabad data on all three |
| 9 | researched | loops/L09-singapore-uae.md | SG and AE both DEFER; field service app SG 90 / AE 50; no local facts on pages; readiness rubric introduced (score /14, both 2) for Loop 10 |
| 10 | researched | loops/L10-south-africa-india-market-selection.md | ZA DEFER. India widest measured demand (12 terms 60-350/mo). Recommended execution markets: India + US (UK reserve); others deferred. Scorecard /14 is a tie-breaker (proof/legal all 0). Q26 founder confirm |
| 11 | researched | loops/L11-claims-features-pricing.md | Claim ledger C1-C18; plan matrix confirmed ($117/$147/$495 minimums); gate gaps: route map + CRM write-back are Professional but unlabelled on feature pages; location/retention controls Enterprise-only vs security copy; exhibition plan unstated; no claim verified (no demo env) |
| 12 | researched | loops/L12-existing-commercial-pages.md | 31 pages crawled (tags healthy: 1 H1, descriptions 135-161, OG, JSON-LD); weakness = differentiation/proof: team pages ~97% identical, shared H2 on every page, "engineers teams" grammar bug, 0 real screenshots; 10 refresh briefs; mobile not tested |
| 13 | researched | loops/L13-existing-blogs-and-guides.md | 6 live articles ~300 words, labels 4-6 min (about 3x overstated), no links to features; 5 new guides not live; 77 CMS mileage/SOC2 posts while product pages have 0 mileage mentions -> HOLD, Q10/Q34 owner decision |
| 14 | researched | loops/L14-sales-and-distribution.md | Blueprint A (CRM-connected account visiting, Professional) + B (beat/outlet coverage); KPI definitions fixed; boundary = no orders/stock/invoicing; recurring beat templates unverified; hero mockup implies CRM sync on all plans |
| 15 | researched | loops/L15-service-industries.md | US service demand 3x sales (field service app 1,700; FSM software 3,100); Hemmiles = visit evidence for teams with an existing job system, NOT FSM (0 mentions of work order/dispatch/parts/invoicing); sign-off undefined; Loop 5/10 revision note; SERP check for Loop 21 |
| 16 | researched | loops/L16-medical-reps-and-collections.md | Both roles = supported with boundaries, not search-led (mr app 100, payment collection app 100, India); med reps = visit log not compliance/detailing; collections = B2B visit+promise tracking, no payments, not consumer debt; "recovery app" 900 is ambiguous; regulatory claims need counsel |
| 17 | researched | loops/L17-exhibition-and-vertical-selection.md | Exhibition: US "lead retrieval app" 400 / "trade show lead capture app" 150 at CPC $25-30, but WhatsApp send, ROI widgets, card OCR unverified, plan unstated; 6 use cases consolidated, NO new vertical URLs approved; Phase C complete |
| 18 | researched (spec) | loops/L18-connector-readiness-and-migration.md | Integration unproven: no named connectors; gaps G1-G9 (photos/notes not claimed to sync, no conflict rule, geocoding, retry, identity, back-fill); test matrix T1-T14 incl. offline+owner-change; migration checklist; Gate G18 for any CRM-named page |
| 19 | researched | loops/L19-integration-demand.md | CRM-named queries are near-unmeasurable (salesforce field sales 20, route planning 0); integration = objection-removal not traffic; no "Hemmiles + CRM" pages until Gate G18; add "which CRM?" field to forms (Q48); competitor Badger has per-CRM pages and tiered integration pricing (vendor claim) |
| 20 | researched | loops/L20-competitor-benchmarks.md | Hemmiles lowest published price, 3-seat min, no-card trial; missing route optimisation, named CRMs, certifications (BeatRoute/Lystloc show SOC/ISO badges); India SERP top 10 includes DR 2/5/10 sites; 1 comparison candidate (vs Map My Customers, gated on G18); fetch-tool summaries must be re-verified |
