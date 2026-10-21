# Loop 11 - Claims, features and pricing (claim ledger)

Retrieved: 2026-10-21, live `https://hemmiles.com/us/...` (route-planning, offline-mode, gps-check-in, exhibition-capture, integrations, security, pricing), text extracted by script. Status: **researched**. Evidence level for every row is "what the public page says". **No product demonstration, build, or release record has been seen**, so no claim below is "verified"; the ledger defines what proof is needed and what wording is safe now.

Legend: PAGE = stated on live page only; DEMO = needs a recorded demonstration; DOC = needs written policy/legal; NO = do not claim.

## 1. Plan matrix (live /us/pricing; matches the brief's seeds)

| | Starter | Professional | Enterprise |
|---|---|---|---|
| Price per user per month (monthly billing) | $39 | $49 | $99 |
| Annual billing (17% off, "figure shown is the figure charged, in US dollars") | $32 | $41 | $82 |
| Users | 3-10 | 3-100 | 5+, no upper limit |
| Minimum monthly (3 / 3 / 5 seats), arithmetic before tax | **$117** | **$147** | **$495** |
| Minimum annual-billed, per month (3 / 3 / 5 seats) | $96 | $123 | $410 |
| Daily visit plans, GPS check-in/out, photos and notes, follow-ups, offline mode, manager dashboard, CSV customer import | yes | yes | yes |
| Visit map and navigation | **no** | yes | yes |
| Territories; role-based access (Starter: basic roles); audit trail | no | yes | yes |
| Custom visit types and fields (Starter: standard types) | no | yes | yes |
| **CRM connection** | **no** | yes | yes |
| Reports | Basic | Full + CSV export | Full + CSV export |
| Multiple teams / business units; ERP and other integrations; location and retention controls; security review support | no | no | yes |
| Support | Email | Email and chat | Priority + onboarding |
Trial: 14 days, no credit card, every plan (Enterprise: "Talk to sales"). A "user" is anyone who signs in, field or manager/admin (FAQ). Arithmetic checks: 39x3=117, 49x3=147, 99x5=495; 17% discounts round to 32/41/82. Other markets show converted prices; billing is in USD (Loops 4-9).

## 2. Claim ledger (rows on live pages)

| ID | Claim (as published) | Page | Plan gate | Status | Proof needed / permitted wording |
|---|---|---|---|---|---|
| C1 | Planned visits placed on a map; rep works through visits in plan order; status shown; one-tap handoff to turn-by-turn directions in the phone's maps app | route-planning | **Professional+** | PAGE | Demo on iOS + Android, with and without map app. Safe: "see the day's visits on a map and open directions". **NO**: route optimisation, driving savings, appointment windows |
| C2 | Time, location and GPS accuracy captured at check-in; distance to customer shown; configurable radius; exceptions flagged; location consent shown | gps-check-in | all | PAGE | Demo of record fields, radius setting, weak-GPS example, consent text per OS. Safe: "location recorded when the rep checks in and out" |
| C3 | Location captured at check-in and check-out only, not continuous | gps-check-in, security | all | PAGE | Engineering/privacy confirmation that no background tracking exists (also needed for the GPS blog). **NO**: "no tracking" absolutes without that |
| C4 | Offline: visits and customer details stored on phone; check-in, notes, photos, completion work offline; original timestamp and location preserved; automatic sync; sync status visible | offline-mode | all | PAGE | Controlled test: airplane mode, photo queue, reconnect, retry, conflict (owner changed in CRM). Supported actions list by platform. **NO**: "works fully offline" without the matrix |
| C5 | "Visit record saved to the CRM" after sync | offline-mode mockup | **Professional+ (CRM connection)** | PAGE | Page shows a CRM write-back step to a Starter reader without saying it is Professional-only. Add gate wording or demo-only caveat |
| C6 | Manager dashboard; reports; "report reviewed without a single call" | feature pages, route-planning | Starter: basic reports | PAGE | Define metrics per role; "without a single call" is an outcome claim -> soften or evidence |
| C7 | Follow-ups: "never lose the next action" | feature pages | all | PAGE | Demo: owner, due date, reminder delivery, overdue state. "Never" is absolute -> rewrite as "next action recorded with owner and date" |
| C8 | Keep your CRM; Hemmiles adds a field layer; connection options depend on CRM and setup; CSV import/export for spreadsheets | integrations | CRM connection: Professional+ | PAGE | No named connectors, directions, mappings or write-back evidence yet. **NO**: any named CRM until demonstrated (Loop 18) |
| C9 | "Is the integration different in our country? No." | integrations | - | PAGE | Fine; consistent with design. |
| C10 | Custom ERP / other integrations | pricing | Enterprise | PAGE | Scope per project; do not list systems |
| C11 | Exhibition capture: scan business card, voice note, QR registration form, live shared feed | exhibition-capture | not in plan matrix | PAGE | **Plan availability unstated.** Demo: card-scan accuracy, voice note handling, QR form, hand-off to follow-up |
| C12 | Role-based visibility; admins decide who sees locations, reports, exports; audit log of who changed what | security | RBAC basic in Starter; audit trail Professional+; "location and retention controls" **Enterprise only** | PAGE | Security page presents location controls to all readers; pricing gates them to Enterprise. Align |
| C13 | Data moves over encrypted connections | security, pricing | all | PAGE | DOC: encryption in transit and at rest statement owner-approved |
| C14 | "Makes no claim about where data is stored" (hosting) | security | - | PAGE | Honest and safe. DOC needed before any residency, UK/EU or sector claim (Loops 7, 27) |
| C15 | Reps "told what's collected and why before location is used"; manager sees visit locations "not your personal time" | security | all | PAGE | Show consent screens; define what manager can see by role |
| C16 | Customer profiles on /customers (3 stories) | customers | - | PAGE | **Illustrative**; page noindex; keep label; no real-customer outcomes |
| C17 | Trial: 14 days no credit card | pricing | all | PAGE | Confirm trial actually requires no card and what happens at day 15 |
| C18 | "Mobile, built for teams of 3-100" etc. user bands | pricing | - | PAGE | Confirm >100 on Professional is handled (route to Enterprise) |

## 3. Findings
1. **Plan-gating gaps (high).** Route planning (C1) and CRM write-back (C5) are Professional features, but feature pages and mockups present them without a plan label. A Starter buyer can read the route and offline pages as if included. Add "Professional" labels or move to a plan comparison on each page.
2. **Security page vs pricing (high).** Location/retention controls are Enterprise-only (pricing) yet security copy describes admin control without a plan caveat (C12).
3. **Unstated plan for exhibition capture (medium).** Not in the comparison table (C11).
4. **No claim of certifications (good).** No SOC 2/ISO/GDPR certification claim appears on the pages sampled. Keep it that way until evidence exists.
5. **Over-absolute phrases (low).** "Never lose the next action", "without a single call", "wherever work happens" (C6, C7). Soften where used in new content.
6. **Seed hypotheses from the brief are confirmed against the live page**: prices, seats, plan gating of CRM connection and visit map/navigation, route claims limited to map/order/status/directions. Older broader route wording was not seen live (cached-page issue not reproducible here).
7. **Claim-vs-code**: the product app is not in this repo; only the marketing site is. Verification needs a demo environment or release notes (Q28).

## 4. Permitted wording now (for any article, ad or page written under this programme)
- "See the day's visits on a map and open directions in your phone's maps app" (Professional and Enterprise).
- "Check-in and check-out record time, location and GPS accuracy."
- "Visits, notes and photos are saved on the phone offline and sync when the signal returns" (until C4 matrix exists, add "supported actions listed in the demo").
- "Your CRM stays the system of record; connection options depend on your CRM and setup."
- Pricing: quote only the live page figures and state billing in USD; say "from 3 users".
- Never: optimisation percentages, named CRM compatibility, compliance/certification, data location, "continuous tracking", customer results.

## 5. Decisions
1. This ledger is the claim register for all later loops; new claims are added with ID and proof level.
2. Gate wording fixes (C5, C11, C12) go to the Loop 29 backlog as P1 content items.
3. Verification route: owner provides a demo workspace or recorded walkthrough (Q28).

## 6. Open questions
- Q28: Can we get a demo environment or recorded walkthrough per feature (iOS + Android, web), plus release notes?
- Q29: Is exhibition capture included in every plan, or an add-on?
- Q30: Is the "no card, 14-day trial" accurate in the sign-up flow, and what happens after day 14?

## 7. Next
Loop 12: audit every existing commercial page (buyer fit, sections, proof, metadata, links, CTA, mobile flow) and produce ten refresh briefs.
