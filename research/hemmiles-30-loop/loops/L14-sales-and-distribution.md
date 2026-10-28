# Loop 14 - Sales and distribution workflows

Retrieved: 2026-10-21. Sources: live `/us/teams/field-sales`, `/us/teams/distribution`, `/us/features/{visit-planning,manager-dashboard,reports,follow-ups}`; guide source on `origin/main` (`beat-plan`, `daily-sales-report-dsr`, `primary-vs-secondary-sales`, `field-sales-vs-inside-sales`, `permanent-journey-plan-pjp`; not live). Claim IDs refer to Loop 11. **All steps are what the pages say; none has been demonstrated** (Q28). Status: **researched**.

## 1. What the product claims to cover for sales and distribution
- Plan: daily/weekly plans; pick customers from the CRM; visit types (sales, service, collection, follow-up); bulk assignment by territory (Professional+: territories); rep-created visits visible to managers; planned vs completed tracking.
- Execute: GPS check-in/out; notes, photos, outcome tags; offline.
- Close: follow-up with owner, reason, due date; reminder; overdue visible to managers; convert follow-up to visit.
- Review: manager dashboard (planned, in progress, completed, delayed; live status; reassign/reschedule); reports by day/week/month, team, rep, territory; export (full + CSV in Professional+).
- Explicit boundary (DSR guide, on main): "Hemmiles covers the visit; your CRM or sales system still owns the orders and the pipeline." **No order capture, no stock counting, no invoicing claimed.**

## 2. Blueprint A - Account-visiting field sales with an existing CRM (Professional)

| Step | Who | What happens | Product feature (plan) | Claim IDs | Evidence / metric | Exceptions to document |
|---|---|---|---|---|---|---|
| 1 Select accounts | Manager | Choose accounts due for a visit from CRM accounts/territory | CRM connection (Prof.), Territories (Prof.) | C8 | Accounts imported, owner mapped | Account owner changed in CRM after planning |
| 2 Plan the day | Manager | Assign visits, type, time window; rep sees plan with directions | Visit planning; Visit map and navigation (Prof.) | C1 | Planned count per rep | Reassign mid-day; unplanned visit by rep |
| 3 Travel | Rep | Open directions in phone maps app | Navigation handoff | C1 | - | No map app; address missing/wrong |
| 4 Check in | Rep | Time, location, accuracy recorded vs customer location and radius | GPS check-in | C2, C3 | Distance and accuracy on the record | Weak GPS fix; wrong saved location; check-in outside radius |
| 5 Capture | Rep | Outcome tag, notes, photos | Photos and notes | - | Required fields (Prof.: custom visit types) | Offline; large photo queue |
| 6 Next action | Rep | Follow-up with owner and due date | Follow-ups | C7 | Follow-up created before check-out | Owner is not the rep; due date missed |
| 7 Sync to CRM | System | Visit record written back to CRM | CRM connection | C5, C8 | Verified write-back, attachment handling, retries | Conflict; failed sync; duplicates |
| 8 Review | Manager | See planned vs completed, outcomes, overdue follow-ups | Dashboard, Reports | C6 | KPIs below | Reps with no data; late check-in visible same day |

KPI definitions (use identically in articles, calculators and reports; Loops 22-24):
- **Visit completion rate** = completed visits **from the planned cohort** / planned visits in the period (unplanned visits reported separately, so they cannot inflate completion).
- **Account coverage** = unique eligible accounts with at least one completed visit in the period / eligible accounts in the territory (eligible = defined by the manager, e.g. active accounts).
- **Visit frequency attainment** = accounts meeting their target frequency / accounts with a target.
- **Follow-up completion** = follow-ups closed by due date / follow-ups due.
- **Record completeness** = completed visits with required fields filled / completed visits.
Whether the product's reports actually compute these exact measures is unverified; the page lists "visit completion and follow-up completion", "team and territory performance", and the field-sales page lists "Account coverage by rep and territory" and "Hard to see which accounts haven't been visited this month" (needs a demo; Q28).

Fit statements allowed now: field-sales teams who visit named accounts and already have a CRM, 3+ users, Professional plan ($147/month minimum for 3 seats; Loop 11). Not a fit on current evidence: teams needing order booking, van sales, invoicing, quotes, or optimised routes.

## 3. Blueprint B - Distribution / beat coverage (Starter or Professional)

| Step | Who | What happens | Product feature | Evidence | Gap or question |
|---|---|---|---|---|---|
| 1 Build the beat | Manager | List outlets by territory, set visit frequency (e.g. weekly top accounts, monthly long tail), assign days | Visit planning, bulk assignment by territory (territories = Prof.), CSV import (all) | Outlet list imported | **Recurring beat cycles (weekly/fortnightly templates) not claimed**: visit planning says daily and weekly plans; the beat-plan guide describes a repeating cycle. Verify that a recurring schedule can be created or whether managers re-plan every period |
| 2 Daily beat on the phone | Rep | See outlets with addresses and (Prof.) map | Visit plan; map (Prof.) | Starter has plan but **no map/navigation** | Starter reps get a list, not a map |
| 3 Outlet visit | Rep | GPS check-in, shelf and stock **photos**, note | GPS, photos and notes | Photo evidence | **No stock count or order capture claimed**; stock = photo only |
| 4 Next action | Rep | Follow-up (re-visit, collect, replenish) | Follow-ups | Owner and date | - |
| 5 Coverage review | Manager | Which outlets missed in the period | Reports, dashboard ("Outlet coverage by territory", "Manager view of daily coverage") | Coverage metric as defined above | Verify "missed for weeks" detection (alerts vs report) |
| 6 Secondary-sales context | Manager | Compare field observations with sales data from elsewhere | Not in product | - | Secondary sales numbers live in the customer's own system; guide copy must say Hemmiles shows what the rep saw, not the sales figures |

Fit statements: distributor/FMCG-style teams who need **visit and coverage evidence and photos**, with orders/stock managed elsewhere. Starter ($117/month minimum, 3-10 users) covers plans, check-in, photos, follow-ups, dashboard; it lacks territories, map and CRM connection, so coverage "by territory" and map navigation need Professional.

## 4. Solution-page improvements (feed Loop 12 briefs 10 and the distribution rewrite)
1. State the boundary in one sentence on both pages: visits, evidence, follow-ups and coverage; not orders, stock or invoicing.
2. Add the plan label for each capability (map, territories, CRM write-back) next to "What changes".
3. Replace "Saved to the customer record - synced to your CRM" on the hero mockup with a Professional-labelled version or generic text (Starter has no CRM connection).
4. Add the KPI definitions (as a short "how we measure coverage" box) so articles/calculators and the product reports agree.
5. Use India-specific vocabulary (beat, outlet, DSR, PJP) on `/in` and US vocabulary (account, territory, route, outside sales) on `/us` (Loops 5, 10); the same page template does not do this today (Loop 4).
6. Link each team page to its two best articles and to the matching template (Loop 22), not to generic blog/guide hubs.

## 5. Guide-to-blueprint mapping (existing and new guides)
- primary-vs-secondary-sales, beat-plan, permanent-journey-plan-pjp -> Blueprint B (India vocabulary; not live).
- daily-sales-report-dsr -> Blueprint A step 8 and the "report builds itself" claim (verify C6 "builds itself").
- field-sales-vs-inside-sales -> positioning for Blueprint A in the US.
- planning-a-field-day -> Blueprint A steps 2-3 and Blueprint B step 2.

## 6. Decisions
1. Two blueprints approved as the working definitions for later loops (A: CRM-connected account visiting; B: beat/outlet coverage).
2. Product boundary statement (no orders/stock/invoicing) becomes a mandatory line in sales/distribution content.
3. Verification list for the demo (Q28): recurring beat schedule, coverage report computation, overdue alerts, CRM write-back, Starter list view without map.

## 7. Open questions
- Q35: Can managers create recurring beat templates, or only daily/weekly plans per period?
- Q36: Does the product compute account coverage and frequency attainment as defined, or only visit counts?

## 8. Next
Loop 15: service industries (visit evidence, checklists, sign-off, history and broader buyer requirements); test the "service" beachhead hypothesis from Loops 7-9.
