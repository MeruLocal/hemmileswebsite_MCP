# Loop 15 - Service industries

Retrieved: 2026-10-21. Sources: live `/us/teams/service`, `/customers/equipment-service` (illustrative profile), keyword scan of nine pages, Ahrefs US keyword overview (110 units; third-party estimates), one WebSearch on what field service management (FSM) buyers expect (vendor marketing, so a starting checklist, not testing). Status: **researched**.

## 1. Revision note to Loops 5 and 10
Loop 5 measured US *sales* terms only. Service terms in the US are much larger:

| US keyword | Volume (est.) | KD | CPC (USD) |
|---|---:|---:|---:|
| field service management software | **3,100** | 41 | ~$0.70 |
| field service app | **1,700** | 0 | ~$1.10 |
| service technician app | 90 | 1 | ~$11 |
| field service checklist app | n/a (KD 3 only) | 3 | - |
| job sign off app | 0 | - | - |
For comparison, US "field sales app" = 600, "field sales software" = 450. So US **service** demand for the app-level term is about 3x the sales equivalent. Loop 10's US selection stands (US is the demand leader), but the *wedge inside the US* may be service, not only outside sales. This needs one SERP check on "field service app" to see whether the intent is FSM (work orders, dispatch, invoicing) or visit-level apps (Loop 21 will spend one SERP pull; Ahrefs does not show intent without it). Cross-market pattern, all estimates: field service app UK 250, AU 200, IN 300, SG 90, ZA 50, AE 50, US 1,700.

## 2. What Hemmiles says for service teams (live)
- Hero: "Every service visit gets a checklist, before-and-after photos, job notes and a sign-off - on the job record, where the next engineer can find it."
- Pain points listed: photos on personal phones and paper notes; disputes about whether/when an engineer attended; plant rooms and basements break online-only apps.
- "What changes": service checklists per visit type; time-stamped photos on the job; GPS check-in and time on site; offline mode for low-signal sites.
- Illustrative customer profile `equipment-service` (page noindex; labelled illustrative): mentions checklist and sign-off.
- Keyword scan across nine pages: "checklist" appears only on the service page (2), help (1) and the illustrative story (2); "sign-off" 1 on the service page, 2 in the story; **zero mentions** of work order, job card, parts, invoice, dispatch, warranty, asset, SLA, contract, maintenance schedule, service history on any product, pricing, docs or integration page.
- Template flaws carried from Loop 12: "service engineers teams" grammar, shared H2s, Ahmedabad mockup, "Saved to the customer record - synced to your CRM" hero (Professional-gated).

## 3. FSM buyer expectations vs what is claimed (secondary sources)
FSM vendors present: work orders from request to completion with notes, photos and signatures; scheduling and dispatch by skill, location, availability; invoicing and quoting from the job; mobile status updates. Check-in is generally treated as tracking or status, not a headline feature.

| Buyer requirement | Hemmiles claim | Status |
|---|---|---|
| Visit assignment and schedule | Visit planning, bulk assignment, reassign during day | PAGE (partial vs dispatch) |
| Skill-based dispatch, availability view | none | Not offered |
| Work order lifecycle | none | Not offered |
| Checklist per job type | "Service checklists per visit type" (Professional: custom visit types and required fields; Starter: standard types) | PAGE; plan gate unclear (Q37) |
| Before/after photos, notes | Photos and notes | PAGE |
| Customer or manager **sign-off** | "a sign-off" (undefined: customer signature, manager approval, or status?) | **Define** (Q38) |
| Time on site / proof of attendance | GPS check-in, check-out, time on site | PAGE |
| Service history on the customer/job | "on the job record, where the next engineer can find it" | PAGE; depth unverified |
| Parts and inventory | none | Not offered |
| Quotes and invoicing | none | Not offered |
| SLA and contract tracking | none | Not offered |
| Offline in plant rooms/basements | Offline mode | PAGE; matrix needed |
| Integration with job/accounting system | CRM connection (Professional), custom ERP (Enterprise) | PAGE; unverified |

## 4. Supported use case and boundaries
**Supported positioning (on current claims):** *visit evidence and attendance proof for service teams that already run jobs, quotes and invoices in another system* - the same "Keep your CRM; add a field layer" model the site already uses. Core value: proof that the visit happened (time, location, accuracy), a checklist completed per visit type, before/after photos, notes, next action with owner, and an offline-capable record.
**Not supported (do not imply):** full FSM - dispatch optimisation, work-order management, parts, invoicing, SLA. Buyers searching "field service management software" (3,100 US) expect these; Hemmiles would disappoint on that head term. "Field service app" (1,700 US, KD 0) and long-tail "service visit report / checklist" terms are the realistic targets.

## 5. Conditional vertical shortlist (hypotheses, not approvals)
Only verticals the existing pages already point to and that need visit evidence:
1. Industrial / equipment servicing (plant rooms, basements; engineers; "disputes about attendance") - the page's own example.
2. Facility, maintenance and installation visits needing before/after photos.
3. Inspection/audit-style visits with required fields (depends on custom visit types and required fields, Professional).
Not shortlisted: field service businesses needing dispatch/invoicing (home services, HVAC franchises), regulated verticals (medical device service) until compliance facts exist. Vertical pages are Loop 17's decision; none approved here.

## 6. Service-visit evidence record (feeds a template, Loop 22)
Fields: customer/site, visit type, assigned engineer, planned window, check-in time/location/accuracy, checklist items with pass/fail/NA, before photo, after photo, findings, parts needed (free text, not inventory), customer representative and sign-off type (to define), check-out time, time on site, next action + owner + due date.

## 7. Decisions
1. Service is a **validated-by-demand, unvalidated-by-product** wedge: keep as second angle; do not rewrite the service page until Q37/Q38 and the demo (Q28) confirm checklist, sign-off and history.
2. Position as visit evidence, never "FSM replacement"; add a boundary line like the sales pages.
3. One SERP pull for "field service app" (US) in Loop 21 to confirm intent before any new URL is approved.
4. Loop 10 stands; add service as the explicit candidate wedge for US/UK.

## 8. Open questions
- Q37: Are service checklists and "required fields" available on Starter, or Professional only?
- Q38: What does "sign-off" mean in the product (customer signature, manager approval, completion status)? Is a signature captured?
- Q39: Does the job/visit record keep per-customer service history across engineers and dates, and where is it searchable?

## 9. Next
Loop 16: medical representatives and collections (separate roles, records, exceptions, integrations, product limits) with two requirement-versus-capability matrices.
