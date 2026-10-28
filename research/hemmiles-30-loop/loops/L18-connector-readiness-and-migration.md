# Loop 18 - Connector readiness and migration

Retrieved: 2026-10-21. Sources: live `/us/integrations`, `/us/docs` (admin setup), `/us/help`, `/us/pricing`. The product application is not in the repositories available to this programme, so **no connector behaviour has been observed**. This loop converts the public claims into a test matrix and a migration checklist that a demo/QA run can fill in. Status: **researched (spec + gaps); verification pending Q28**.

## 1. What is publicly claimed

**Data moving between CRM and Hemmiles (integrations page table)**

| Data | Direction (as published) | Detail published |
|---|---|---|
| Customers and contacts | From your CRM | names, addresses, saved locations |
| Users and territories | From your CRM | who covers which accounts |
| Visit plans | **Both ways** | "planned in either system" |
| Check-in / check-out | To your CRM | time, location, accuracy; attached to the visit record |
| Outcomes and follow-ups | To your CRM | tags, owners, due dates |
| Photos, field notes | listed as what "Hemmiles adds"; **not stated as sent to the CRM** | - |
| Existing visit history, team members | "already in your CRM" | no statement of import/back-fill |

**Other statements:** CRM stays the system of record; "connection options depend on your CRM and how it's set up - we'll look at what your system supports during the demo"; spreadsheet data can be imported (customers, contacts, territories) and visit activity exported; ERP/other systems via Enterprise custom integrations; integration is the same in every country. **Plan:** CRM connection starts at Professional; Starter has CSV import only.
**Admin setup (docs):** 1 bring in customer data (required: name and address; recommended: saved map location "used for routes and check-in verification"; optional: contacts, territory, customer type); 2 users, roles, territories; 3 visit types (sales, service, collection, follow-up, doctor call); 4 check-in rules (e.g. 100 m radius, exception handling); 5 invite reps (location consent prompt); 6 first-week review (planned vs completed, check-ins outside radius, skipped fields).

## 2. Gaps in the public description (each is a verification item)
G1. **No named connectors, no connector list** - only "depends on your CRM". Named-CRM pages are not allowed until a connector passes the matrix.
G2. **Photos and notes** are not stated to sync to the CRM; only check-in data and outcomes are. Attachment handling (size, format, count) is undefined.
G3. **"Planned in either system"** (two-way plans) has no conflict rule: what wins if the same visit is edited in both, or the account owner changes in the CRM after planning?
G4. **Saved map locations**: required for check-in verification, "recommended" at import. Who geocodes addresses, how are bad addresses handled, and what happens at check-in when a customer has no saved location?
G5. **Sync method and timing** (real-time, scheduled, manual) and **retry/failure behaviour** are not stated.
G6. **Identity mapping**: how CRM users map to Hemmiles users; duplicates; deactivated users.
G7. **Back-fill**: whether prior visit history from the CRM is imported or only new activity is written.
G8. **Starter vs Professional**: a Starter team using CSV import cannot get write-back; the exports must cover visit, photo and follow-up data (format and fields undefined).
G9. **Data ownership and deletion**: what is removed from Hemmiles vs the CRM when a customer or user is deleted; retention defaults (Enterprise has "location and retention controls").

## 3. Integration test matrix (one column per connector candidate; fill per run)

Columns required per connector: connection type (native API / CSV / middleware) -> supported records -> direction -> field mapping -> ownership rule -> attachments -> retries/errors -> limitations -> plan and setup effort/cost -> demonstration link/date/version tested.

| ID | Test | Pass condition | Priority |
|---|---|---|---|
| T1 | Initial import: 100 customers with contacts, addresses, territories | all present, no duplicates, import report lists rejects with reasons | P0 |
| T2 | Missing/invalid address; no saved location | clear error or flagged record; check-in behaviour documented | P0 |
| T3 | User and territory mapping, including a deactivated user | assignments correct; deactivation propagates | P0 |
| T4 | Plan a visit in Hemmiles | appears in CRM (if two-way claimed) within stated time | P0 |
| T5 | Plan a visit in the CRM | appears in the rep's app | P0 |
| T6 | Complete a visit online: check-in/out, notes, outcome tag, follow-up with owner and due date | all fields in the CRM record, correct owner, time, location, accuracy | P0 |
| T7 | Photos and notes sync | photos attached to the CRM record or documented as not synced; size/format limits recorded | P0 |
| T8 | **Offline scenario (brief):** go offline, check in, add notes and 2 photos, set a follow-up, complete visit; meanwhile change the account owner in the CRM; reconnect | original timestamps and location preserved; visit lands on the correct account; ownership conflict handled by a documented rule; no duplicates | P0 |
| T9 | Retry: force a CRM API failure then recover | queued, retried, status visible to admin; no data loss | P0 |
| T10 | Conflict: same visit edited in both systems | documented winner; no silent overwrite | P1 |
| T11 | Rate/volume: 20 reps x 8 visits/day with photos for a day | completes inside the stated window; failures reported | P1 |
| T12 | Delete/merge a customer in the CRM | Hemmiles reflects the change without orphaning visit history | P1 |
| T13 | Export: visit activity CSV (all plans) | columns documented; includes timestamps, location, outcome, follow-up | P1 |
| T14 | Disconnect/reconnect the integration | no duplicate import; mapping preserved | P2 |
Record for each: app version, platform (iOS/Android/web), tester, date, evidence (screen recording/screenshots/logs).

## 4. Migration checklist (spreadsheets and chat groups to Hemmiles; feeds the "moving from spreadsheets" guide candidate)
1. Inventory: customer list columns, territory logic, who owns each account, existing visit history (if any).
2. Clean: required name and address; deduplicate; standardise addresses; add map locations for the accounts that matter first (check-in verification depends on them).
3. Map: spreadsheet columns -> customer, contact, territory, customer type.
4. Pilot: 3-10 reps (Starter band) or a single territory, one visit type, check-in radius agreed (docs example 100 m), exception rule written.
5. Rollout: invite, consent prompt, first-week review per docs step 6.
6. Report: compare planned vs completed and check-ins outside radius; fix locations; shorten forms where fields are skipped.
Acceptance criteria for the pilot: all pilot accounts have saved locations; >= an agreed share of visits completed with required fields; follow-ups have owners; manager reviewed without phone calls; for CRM-connected pilots, T6-T9 pass.

## 5. Readiness verdict (current evidence)
| Capability | Readiness |
|---|---|
| CSV import of customers/territories | Claimed; **unverified** |
| CSV/other export of visit activity | Claimed; format undefined |
| CRM read of customers/users/territories | Claimed; **no named connector** |
| CRM write-back of check-in and outcomes | Claimed; unverified |
| Two-way visit plans | Claimed; conflict rule unknown |
| Photos/notes to CRM | **Not claimed** |
| Offline + CRM ownership change | Unknown (T8) |
| ERP / custom (Enterprise) | Claimed, scope per project |
Overall: **unproven**. Gate G18 (for Loop 19 and any "Hemmiles + CRM" page): at least one connector passes T1-T9 with evidence; otherwise only the generic integrations page and the checklist article may be published.

## 6. Decisions
1. Use the matrix above as the contract for demos and for the integration page's data table.
2. Add G2 (photos/notes), G3 (conflict rule), G4 (geocoding) to the claim ledger as open items.
3. Publish "CRM integration checklist" and "moving from spreadsheets" only after the owner supplies at least the generic answers to G1-G9 (they can be generic, but must be true).

## 7. Open questions
- Q45: Which CRMs have you actually connected for customers, and by what method (native, API, CSV, middleware)?
- Q46: Answers to G2-G7 (photos, conflicts, geocoding, timing/retry, identity, back-fill).
- Q47: Is a sandbox with a test CRM available to run T1-T14?

## 8. Next
Loop 19: integration demand - which connections remove real objections and attract relevant searches (Ahrefs volumes by CRM name, labelled estimates), plus conditional page briefs.
