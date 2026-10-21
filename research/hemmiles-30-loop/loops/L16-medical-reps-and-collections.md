# Loop 16 - Medical representatives and collections

Retrieved: 2026-10-21. Sources: live `/in/teams/medical-reps`, `/in/teams/collections` plus keyword scan of photos-notes, security and help pages; Ahrefs India (154 units) and US (50 units) keyword overviews (third-party estimates, not our traffic; `cpc` in USD cents). Regulatory points are general knowledge and **unverified** - counsel must confirm before any compliance wording. Status: **researched**.

## 1. Demand

| Keyword | Volume | KD | CPC (USD) |
|---|---:|---:|---:|
| India: recovery app | 900 | 0 | ~$0.01 | *ambiguous: likely data/phone/account recovery, not collections; do not use* |
| India: payment collection app | 100 | 0 | ~$0.10 |
| India: mr app | 100 | 0 | ~$0.03 |
| India: medical representative app | 20 | - | ~$0.10 |
| India: doctor visit app | 10 | - | ~$0.20 |
| India: collection agent app / field collection app | 0 | - | - |
| US: pharma sales crm | 10 | - | - |
| US: pharmaceutical sales rep app | 0 | - | - |
Demand for both roles is small. Only "payment collection app" and "mr app" (100/mo each, India) are measurable and they are low-value. **Neither role is a search-led opportunity today**; they matter as use-case coverage for buyers who arrive through other terms.

## 2. Live claims (what the pages actually say)
**Medical reps:** "Plan doctor calls, record samples and discussion points, and schedule the next call - without the evening reporting session." Pain points: daily call reports typed up after the day; hard to track whether each doctor is visited as planned; "what was given and discussed isn't consistently recorded." Features: "Doctor and clinic call plans", "Samples and discussion notes". 
**Collections:** "Record every collection visit with the amount collected, the balance and the promised date - verified by time and location." Pain points: reconciled at the end of the day/week; "balance on Monday" not followed up; no record of when the collector attended. Feature: "Collection outcome per visit."
Scan results across those pages + photos-notes, security, help: "sample" 2, "doctor" 5, "clinic" 3, "balance" 2, "amount" 1, "promise" 1, "consent" 1 (security: location consent). **Zero mentions** of: compliance code, sample accountability/stock, product detailing, CLM/e-detailing, call-frequency targets by doctor tier, payments/UPI/receipts, patient data, HIPAA/DPDP.
Both pages reuse the generic template (shared H2s, Ahmedabad mockup, "Saved to the customer record - synced to your CRM" hero; Loops 4, 12) and were not rewritten for the roles.

## 3. Matrix A - Medical representatives: requirement vs capability

| Typical requirement (hypothesis, to validate with buyers) | Hemmiles claim | Status |
|---|---|---|
| Plan calls by doctor/clinic with target frequency | "Doctor and clinic call plans"; visit planning (daily/weekly) | PAGE; frequency targets by doctor tier not claimed |
| Prove the call happened (time, place) | GPS check-in/out, time on site | PAGE |
| Record discussion points | Notes, outcome tags | PAGE |
| Record samples given (item, quantity, batch) | "Samples and discussion notes" | PAGE; **free-text note, not stock/batch accountability** (verify) |
| Product detailing / presentation (e-detailing) | none | Not offered |
| Compliance record (e.g. regulated marketing practices, sample controls, spend reporting) | none | Not offered; counsel required |
| Chemist/stockist visits | visit types (custom: Professional) | Unverified |
| Manager coverage review (doctors not seen) | Dashboard, reports, territory coverage (Prof.) | PAGE |
| Integration with pharma CRM | CRM connection (Prof.), custom (Ent.) | Unverified |
| Offline in clinics/low signal | Offline mode | PAGE |
| Privacy: doctor and (incidentally) patient data | Generic privacy page (template) | **Gap**: no statement; do not record patient data |
Unverified regulatory hypotheses for counsel: India marketing-practice code for pharma and its restrictions on samples/gifts and reporting expectations; India's data protection law; US federal rules on drug-sample accountability and transfer-of-value reporting; HIPAA only if patient data is recorded. Until reviewed, **no compliance, audit-ready or regulated-industry claims**.

Verdict: a *visit log* for medical reps (who, when, where, what was discussed, samples noted, next call). Not a pharma-compliance or detailing system.

## 4. Matrix B - Collections: requirement vs capability

| Typical requirement | Hemmiles claim | Status |
|---|---|---|
| Prove collector attended (time, place) | GPS check-in/out | PAGE |
| Record amount collected, balance, promised date, outcome | "Collection outcome per visit" | PAGE; likely custom visit type/required fields (Professional); structured numeric fields and totals unverified |
| Follow-up on promise-to-pay with owner and date | Follow-ups with owner, due date, reminder, overdue visible | PAGE |
| Reconciliation of cash/cheque/transfer collected | none | Not offered; "amount collected" is a record, not a receipt or ledger |
| Issue receipts, accept payments (UPI, cards, cash handling) | none | Not offered |
| Aging/outstanding data from accounting/ERP | CRM connection / custom ERP (Enterprise) | Unverified |
| Route/visit prioritisation by overdue amount | visit planning; map (Prof.) | PAGE (manual); no automatic prioritisation claimed |
| Offline | Offline mode | PAGE |
| Legal/ethical rules on collection conduct | none | Counsel required; **B2B trade receivables only** |
Verdict: a *visit and promise tracking layer* for collectors who work trade/B2B receivables. **Do not position for consumer debt recovery** (heavily regulated; visit evidence alone does not make conduct compliant; the search term "recovery app" is also not collections). No payments or receipts.

## 5. Decisions
1. Both roles stay as **supported-with-boundaries** use cases, not search-led pages. No new pages; refresh the two team pages after Q28 verification with role-specific mockups (doctor/clinic call; collection record with amount, balance, promise date) replacing the Ahmedabad sales mockup.
2. Mandatory boundary lines: medical reps -> "visit log, not a compliance or detailing system"; collections -> "visit and follow-up record, not payment processing".
3. Do not use "recovery app" (ambiguous intent).
4. No regulated-industry claims until counsel review (Q19, Q40).

## 6. Open questions
- Q40: Are "samples" structured (item, qty, batch) or free text? Are collection amount/balance structured numeric fields with totals?
- Q41: Do you have any pharma or collections customers or pilots? Which regulated rules do they require evidenced?

## 7. Next
Loop 17: exhibition capture (verify the capture-to-follow-up workflow) and consolidate vertical opportunities into a limited, justified shortlist.
