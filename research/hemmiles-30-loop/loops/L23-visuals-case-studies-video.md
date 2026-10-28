# Loop 23 - Visuals, case studies and video (briefs and scripts)

Retrieved: 2026-10-21. Sources: live `/customers` and `/customers/pharma-distributor` (illustrative profiles), Loops 11-22. Status: **specified** (nothing produced). Every numeric graphic needs source, period, units, denominator, formula and limitations; illustrative sample data stays labelled. All real-product visuals and videos depend on a demo workspace and release build (Q28/Q31).

## 1. Current state
- Site visuals are drawn HTML/SVG mockups with India sample data (Ahmedabad, Surat, Vadodara) on every market (Loop 4); no real screenshots, no video (Loop 12).
- `/customers` (noindex) holds three **illustrative** profiles (regional pharma distributor, industrial equipment service company, FMCG distributor), labelled "illustrative ... representative, not a named customer". The pharma profile contains specific-sounding details ("10-12 doctors a day", "Surat and Ahmedabad") and a claim of "call frequency per doctor, calls completed against plan" that the product is unverified to compute (Loop 16). Keep the label; do not reuse these details as facts in ads, sales material or AI-answer content.

## 2. Eight visual briefs

| # | Visual | Question it answers | Owner page | Type | Data and definition | Evidence status / what is needed |
|---|---|---|---|---|---|---|
| V1 | Visit workflow (rep -> manager -> CRM) | Who acts next and where does the record go? | `/how-it-works`, `/product` | Swim-lane diagram, 7 steps | Steps from Loop 14 Blueprint A; mark Professional-only steps (map, CRM write-back) | Demonstrated steps and exceptions; no data |
| V2 | Planned vs completed visits | Which work needs attention? | `/features/reports`, manager-dashboard | Stacked bar by rep, one day or week | Planned cohort only; completed = completed from that cohort; unplanned shown separately (Loop 14 definitions) | Real or labelled sample; denominator printed; cohort rule stated |
| V3 | Account coverage | Are the right accounts receiving visits? | `/teams/field-sales`, `/teams/distribution`, guide | Matrix: accounts x week, or coverage % by territory | Coverage = unique eligible accounts with >= 1 completed visit / eligible accounts; eligibility rule stated | Needs verification that product computes it (Q36); otherwise a how-to chart from the template |
| V4 | Where the field day goes | Where does time go (travel, visit, admin, waiting)? | `planning-a-field-day` guide | Stacked bar / waterfall | Must come from an observed time-and-motion sample (method, n reps, days, date) | **No data exists.** Publish only as a user-input output of Calculator 1 or as an unlabelled-number-free diagram; never quote percentages without a method |
| V5 | Offline sync timeline | What happens before and after reconnection? | `/features/offline-mode`, offline blog | Annotated timeline (check-in, note, photo, complete, signal returns, sync, CRM record) | Original timestamps vs sync timestamp from a controlled run (Loop 18 T8) | Controlled demonstration with screen recording; app version and date on the figure |
| V6 | Location data: recorded / when / who sees it | What is recorded, when, and who can see it? | `/features/gps-check-in`, `/security`, GPS blog | Matrix table by role (rep, manager, admin) and event (check-in, check-out, plan view) | Ledger C2, C3, C15; no continuous tracking only if confirmed | Engineering/privacy sign-off; per-platform consent screens |
| V7 | CRM object map | What synchronises and how? | `/integrations` | Two-column map with arrows and ownership labels | Loop 18 table and test results; plan gates | Connector tests passed; one map per connector, no generic "supported" art |
| V8 | Capacity and cost sensitivity | How do assumptions change the result? | `planning-a-field-day` (capacity); cost guide if built | Line/heat chart from calculator | Formulas in Loop 22; user inputs; axis units and currency labelled | Calculator built and unit-tested; illustrative defaults labelled |
Accessibility and format for all: alt text and long description; colour-independent encoding; text-based SVG so it can be indexed; no embedded numbers as images only; consistent colour for the same status across charts (planned, completed, delayed, unplanned); mobile layout at 360 px.
Priority (evidence readiness): V1, V6 (after sign-off), V2 (labelled sample) first; V5 and V7 after demos; V3 after Q36; V4 and V8 after Calculator 1.

## 3. Case-study protocol (real stories, separate from illustrative profiles)
1. Candidate: a real customer team with >= 3 users and >= 4 weeks of use.
2. Permission in writing: named use, logo, quote, and metrics; approval of final text; right to withdraw.
3. Baseline window (4 weeks before) and after window (4 weeks after) using Loop 14 definitions: visit completion (planned cohort), account coverage, record completeness, follow-up completion; record how each was obtained (spreadsheet before, product reports after) and flag methodology differences.
4. Evidence: exports or screenshots kept privately; claims limited to what the data shows ("completion rose from X to Y over N weeks for this team"), no extrapolation.
5. Disclosures: team size, industry, plan, period, any concurrent changes; "results vary".
6. Keep two labelled families: **"Customer story"** (real, approved) and **"Illustrative profile"** (representative). Never mix labels, never add real-sounding logos to illustrative profiles.
7. `/customers` stays `noindex` until at least one approved real story exists and the page structure separates the two families. Only then reconsider indexing (Loop 27).
Open dependency: no real customer is known to the programme (Q41, Q24, Q22 asked in earlier loops).

## 4. Three video scripts (real product screen recordings; captions and transcript required)

### Video 1 - "One field visit, from plan to record" (about 2:30)
Purpose: show the core workflow once (Blueprint A). Needs Professional build, iOS demo device, manager web.
- 0:00-0:15 Manager assigns three visits for a rep (map, plan order). VO: "A manager sets today's visits."
- 0:15-0:40 Rep opens the plan, taps directions (hands off to the phone's maps app). VO: "The rep sees the day on a map and opens directions."
- 0:40-1:05 Check-in: shows time, distance to customer, accuracy. VO: "Time, location and GPS accuracy are recorded at check-in."
- 1:05-1:35 Notes, outcome tag, two photos, follow-up with owner and due date.
- 1:35-1:50 Check-out; time on site.
- 1:50-2:15 Manager dashboard: completed visit, photos, follow-up. VO: "The manager sees what happened without a call."
- 2:15-2:30 CTA to demo; on-screen: "CRM connection: Professional and above."
Rules: use only ledger-approved wording; show real data from a demo account with neutral names; no optimisation claims; state app version and date in the description.

### Video 2 - "Offline test: airplane mode" (about 1:45)
Purpose: prove the offline behaviour (C4) and model a buyer's test (checklist C).
- 0:00-0:15 Phone in airplane mode; plan still open.
- 0:15-0:55 Check in, add note, two photos, complete visit; show queued/sync status.
- 0:55-1:10 Close and reopen the app; items remain.
- 1:10-1:30 Turn network back on; show sync completing and the original time and location preserved.
- 1:30-1:45 On-screen text: what works offline (from the matrix) and what does not.
Rules: publish only if the run is unedited in the critical section and passes T8 (Loop 18); show failures honestly if any occur (they become copy).

### Video 3 - "What a manager sees at 10 AM" (about 1:30)
Purpose: manager value without surveillance framing.
- 0:00-0:20 Dashboard: planned, in progress, completed, delayed.
- 0:20-0:45 A late check-in is visible; manager reassigns a visit.
- 0:45-1:05 Overdue follow-up with owner; convert to visit.
- 1:05-1:20 Role-based visibility: what the manager can and cannot see (location at visit events only, if C3 confirmed).
- 1:20-1:30 CTA.
Rules: no names of real people; consent screen shown; no "tracking" language beyond ledger wording.

Publishing: host on the owner's video channel and embed on the owner page with transcript, captions, `VideoObject` structured data, no autoplay, descriptive title, chapter markers; each video listed in the Loop 25 internal-link plan.

## 5. Decisions
1. Visual build order and evidence gates as above; V4 not to be published with numbers.
2. Case-study protocol adopted; illustrative profiles stay labelled and noindex.
3. Videos 1-3 require a demo workspace and release build; no scripts proceed to production before Q28/Q31 answers.

## 6. Open questions
- Q56: Who records and edits video (founder, contractor), and on what device/build?
- Q57: Is there any customer willing to be a named case study, and what baseline data exists?

## 7. Next
Loop 24 (Phase E): existing ranking and CTR opportunities - blocked on actual search data; will state what can be done without GSC and what the first GSC pull must answer.
