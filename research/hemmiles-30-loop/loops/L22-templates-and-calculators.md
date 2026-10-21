# Loop 22 - Templates and calculators (specifications)

Retrieved: 2026-10-21. Sources: `MeruLocal/hemmileswebsite` origin/main (search for existing tools), Ahrefs India SERP "daily sales report format" (630 units; estimates), Loops 13-21. Status: **specified** (no assets built; no site changes). All example numbers below are **illustrative** and must be labelled so wherever used.

## 1. Existing assets
None. A search of `origin/main` found no calculator, template, download, spreadsheet or PDF files and no tool components; `public/` holds brand images and country flags only. Everything below is new.

## 2. Evidence that shapes the specs
- India SERP "daily sales report format" (350/mo): page one is **template galleries and image packs** (Smartsheet DR 90, WPS, Pinterest, Excel sites, an accounting-software page DR 64, YouTube) and PAAs ("How to write a daily sales report?", "How can I create a daily sales report in Excel?", "What is a daily sales report (DSR)?"). The generic intent is a **retail/shop sales summary**, not a field-visit report. A Hemmiles DSR template must say clearly it is a *field visit* DSR and be genuinely useful (visual preview, XLSX + Google-Sheet copy, instructions, completed example) to compete.
- US: "field service report template" 150, "sales call report template" 90, "site visit report template" 40 (Loop 21).
- Product boundary (Loop 14): templates may contain fields the product does not capture (e.g. order value), but copy must not imply Hemmiles captures orders or stock.

## 3. Template and checklist specs

### A. Visit report template (owner: `/guides/writing-useful-visit-notes`)
Targets: IN "visit report format" 200 / "field visit report format" 80; US "sales call report template" 90 / "site visit report template" 40 / "field service report template" 150.
- Formats: in-page copyable text block; XLSX; Google Sheet copy; printable PDF (one page). No email gate for the file.
- Fields: date; rep; customer/site; visit type (sales / service / collection / follow-up); planned or unplanned; arrival and departure time; objective; what happened; customer request; outcome tag; evidence (photo count, reference); next action; owner; due date; **service variant**: checklist items (pass / fail / N/A), before/after photo references, findings, customer representative.
- Completed examples (two, labelled illustrative): one sales visit, one service visit.
- Guidance box: write for someone who was not there; one outcome tag; every next action has an owner and a date.
- Soft CTA: "capture this on the phone with check-in, photos, and follow-ups" -> `/features/photos-notes`, `/demo`.
- Acceptance: opens in Excel and Google Sheets without macros; prints on one A4/Letter page; fields match this spec; labelled illustrative examples; date-stamped version v1.0.

### B. Editable field-day plan (owner: `/guides/planning-a-field-day`)
- Format: XLSX / Google Sheet with a 1-day and 1-week tab.
- Columns: time window, customer, address area, visit purpose, planned duration, travel allowance, fixed appointment (Y/N), priority, buffer.
- Rows for breaks, travel gaps, and a protected buffer (default 15% of the day, editable); unplanned-visit slots; cancellation/reschedule log.
- Auto-calculation: total planned minutes, remaining buffer, flag when the plan exceeds working hours (simple formula, documented).
- Worked day (illustrative) in the guide: 6 visits with appointment windows on 2.
- Acceptance: totals match manual calculation on the worked example; protects against negative/zero durations with visible error text.

### C. Offline evaluation checklist (owner: `/blog/offline-first-field-apps`)
- Format: one-page checklist, PDF + in-page.
- Test steps (10 minutes): airplane mode before the first visit; open today's plan; check in; add a note; add two photos; complete the visit; set a follow-up; kill and reopen the app; reconnect; confirm timestamps and location preserved; confirm nothing duplicated; confirm sync status visible; repeat with weak (not absent) signal.
- Capability matrix columns: action x platform (iOS / Android / web) x works offline (Y/N/partial) x notes.
- Questions for a vendor: what happens to a photo upload interrupted at 80%? how are conflicts resolved? how long can the device stay offline?
- Acceptance: every step is verifiable in under a minute; the matrix has no empty cells in the published Hemmiles version (Loop 18 T8 evidence required before publishing Hemmiles' own column).

### D. Field DSR template (owner: `/guides/daily-sales-report-dsr`; evidence-driven addition)
Targets: IN "daily sales report format" 350, "dsr format" 150.
- Tabs: Daily (one row per visit), Summary (formulas), Weekly roll-up.
- Daily columns: date, rep, territory, outlet/customer, visit time, outcome, order taken (value; "record in your sales system"), collection (amount), issue, next action, owner, due date.
- Summary formulas: visits planned vs completed, outlets covered, follow-ups opened/closed, collections sum, order value sum (labelled "as entered").
- Include "How to write a DSR" (answers the PAA) and a screenshot-style preview image for the gallery SERP.
- Acceptance: formulas verified against a manual tally; labelled "field visit DSR".

### E. Beat plan / PJP sheet (owners: `/guides/beat-plan`, `/guides/permanent-journey-plan-pjp`; evidence-driven addition)
- Outlet list with tier (A/B/C), target frequency, assigned weekday, cycle (weekly / fortnightly), last visit date; coverage check (days since last visit vs target interval) with conditional highlight.
- Acceptance: example workbook produces correct "overdue" flags on a test set.

## 4. Calculator specs

Delivery: client-side only, no data stored or sent, no sign-in, shareable state in URL parameters containing only numbers (no personal data), accessible labels, keyboard operable, mobile layout; each output shows the formula used and the disclaimer "aggregate estimate, not a schedule". Analytics events: calculator_started, calculator_completed, result_copied, cta_clicked (no input values logged).

### Calculator 1 - Visit capacity and coverage planner
Placement: a section inside `/guides/planning-a-field-day` (no new URL).
Inputs (all numeric, >= 0): accounts per tier (A, B, C); required visits per account per period per tier; number of reps R; working days D in the period (after leave); available field hours per day H (<= 24); average visit duration v (min); average travel per visit t (min); average admin per visit a (min).
Formulas:
- required = sum over tiers of (accounts x frequency)
- time per visit m = v + t + a (minutes)
- capacity per rep = floor((H x 60 x D) / m), only if m > 0
- team capacity = R x capacity per rep
- shortfall = max(0, required - team capacity); surplus = max(0, team capacity - required)
- utilisation = required / team capacity (only if team capacity > 0)
- reps needed = ceil(required / capacity per rep) (only if capacity per rep > 0)
Edge cases: m = 0 or capacity per rep = 0 -> show "Enter a visit duration greater than zero" / "Capacity is zero with these inputs" and no ratios; negative or non-numeric inputs rejected with field-level messages; H > 24 or D > number of days in the period rejected; show results as whole visits.
Illustrative worked example (label as such): accounts A 20 x 4, B 50 x 2, C 130 x 1 -> required 310; R = 5, D = 20, H = 7, v = 40, t = 30, a = 10 -> m = 80, capacity per rep = floor(8,400 / 80) = 105, team capacity 525, surplus 215, utilisation 310 / 525 = 59%, reps needed ceil(310 / 105) = 3.
Test cases required: the example above; m = 0; R = 0 (capacity 0, shortfall = required); frequencies with decimals; D = 0.

### Calculator 2 - Cost per completed visit
Placement: optional standalone guide "Cost per field visit" (new URL **only if** Loop 24 shows demand; otherwise a section on a related guide). Lowest priority; "cost per sales visit" returned no Ahrefs data.
Inputs: field labour cost for the period; vehicle/travel cost; software cost; support/admin allocation; other costs; optional one-time setup cost and months to amortise it (N); planned visits P; planned visits completed Cp; unplanned visits completed U; currency symbol (display only, no conversion).
Formulas:
- operating cost = labour + travel + software + support + other
- completed (all) = Cp + U
- cost per completed visit = operating / completed (only if completed > 0)
- with setup = (operating + setup / N) / completed (N >= 1)
- plan completion = Cp / P (only if P > 0); **never** (Cp + U) / P, so unplanned visits cannot inflate plan completion
Validation: all >= 0; Cp <= P; show "n/a" when completed = 0; separate lines for operating-only and setup-inclusive.
Illustrative example: labour 500,000 + travel 120,000 + software 15,000 + support 20,000 + other 10,000 = operating 665,000; P = 400, Cp = 310, U = 40 -> completed 350; cost per completed visit = 665,000 / 350 = 1,900; plan completion = 310 / 400 = 77.5%.
Sensitivity chart: cost per visit vs completed visits (-20% to +20%) and vs travel cost; axes labelled, source = user inputs, units = chosen currency.

## 5. Maintenance and governance
- Owners: content owner (guides) and a developer for calculator code; review quarterly or when product wording changes; version stamp + changelog in each file.
- Every file carries: "Illustrative example data", version, date, and a one-line link back to the owning guide.
- No claims of savings or ROI from the calculators; outputs describe the user's own inputs only.
- Test: unit tests for each formula and edge case above; spreadsheet checks against manual calculations; accessibility check.
- Measurement: downloads, calculator completions, progression to feature/pricing/demo pages (Loop 28 definitions).

## 6. Decisions
1. Five template/checklist specs (A-C from the brief, D-E from evidence) attach to existing guides - no new URLs.
2. Calculator 1 ships inside the field-day guide; Calculator 2 is optional and deferred.
3. Template files must not be email-gated at launch.

## 7. Open questions
- Q54: Who builds and hosts the spreadsheet/PDF files and calculator code (developer vs content)?
- Q55: Where should downloadable files live (site `public/` vs a cloud drive) and who approves the version stamp?

## 8. Next
Loop 23: visuals, case studies and video - six to eight visual briefs and three video scripts with evidence requirements and data definitions.
