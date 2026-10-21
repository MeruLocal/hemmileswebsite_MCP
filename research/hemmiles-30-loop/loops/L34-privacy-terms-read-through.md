# Loop 34 - Privacy and Terms full read-through

Retrieved: 2026-10-21, live `https://hemmiles.com/in/privacy` and `/in/terms` (full text read), compared with Loops 11, 17, 18, 27, 28, 32 and the site code (lead pipeline, analytics docs). **This is a fact-and-consistency review, not legal advice and not a draft.** Counsel must decide wording, lawful bases and jurisdictional compliance. Status: **researched**.

## 1. What the pages are
Both pages carry a visible internal notice at the top: "Template content. This page must be reviewed and completed by your legal counsel - including company details, jurisdiction and effective date - before the site goes live. Until then it is kept out of search results." Both are `noindex` (Loop 3) but linked from every page's nav/footer (Loop 25), so any visitor can read the notice. Both also say: "the same one company's document in every market: Hemmiles has one legal entity, and this page states no India-specific contract, jurisdiction or data-residency position."
- **Privacy** (905 words): 10 sections; 6 placeholders (legal name/address, sub-processor categories, retention, rights, contact email, effective date).
- **Terms** (445 words): 9 numbered sections; 7 placeholders (legal name, order-form precedence, fees, liability, termination/export, jurisdiction, contact email). Five of nine sections are placeholder-only; the other four are one or two sentences.

## 2. Privacy: statement-by-statement check

| # | Statement on the page | Checked against | Result |
|---|---|---|---|
| P1 | Forms collected: name, work email, company, phone, team details, message | Lead pipeline and demo form fields (Loop 28) | **Matches** code (also country, team type, team size, CRM, website) |
| P2 | Referrer, campaign tags, pages viewed, GA visitor ID stored in browser and sent only with a submitted form; "not used for advertising" | `lib/lead-attribution.ts` captures UTM tags **and ad-click IDs (gclid, fbclid, msclkid, li_fat_id)** "so the CRM can tie a lead back to a paid click"; page-journey with time per page | **Tension:** click-ID capture is advertising attribution; the statement "not used for advertising" should match actual use (counsel/owner) |
| P3 | Google Analytics 4 and Microsoft Clarity named, with cookies `_ga`, `_ga_*`, `_clck`, `_clsk`; no advertising cookies; Clarity masks typed text | Analytics docs (Loop 28), live HTML | **Matches** code. Note: the **cookie banner names only Google Analytics** (Loop 32 F3); the policy is more complete than the banner |
| P4 | EEA/UK/Switzerland opt-in; elsewhere on unless declined or GPC | `docs/analytics.md`, `lib/analytics.ts` | **Matches** code; India-specific consent expectations are a counsel question (Q71) |
| P5 | Cloudflare web analytics | Live HTML loads `static.cloudflareinsights.com` (Loop 32) | **Not disclosed** in policy or banner |
| P6 | "Location data recorded at visit actions such as check-in and check-out, **and for route suggestions**, after the user has been informed" | Route page claims map, plan order, status, directions hand-off only (Loop 11 C1) | **Inconsistent**: either the app suggests routes (then the route page under-claims) or the policy over-claims. Verify in V01 (error E8 in the register) |
| P7 | Location "after the user has been informed" | Security page says "clear location consent"; app prompt per docs | "Informed" vs "consent" are different legal concepts; counsel to choose; align all three pages |
| P8 | "Access to location data is controlled by our customer's administrators through role-based permissions" | Pricing: "Location and retention controls" are **Enterprise only** (Loop 11) | Plan-gating omission; align with D05 |
| P9 | We act on our customer's instructions for app data | Terms mention "any data processing agreement"; none is published or offered | **Gap**: no DPA exists publicly (Q20/O11) |
| P10 | Hemmiles has one legal entity | About/footer name none (Loop 27) | **Unverified claim** with no entity named |
| P11 | Sharing with service providers "under appropriate agreements" [sub-processors blank] | Site code: leads go to a CRM, an admin database and optionally a webhook; analytics providers are Google, Microsoft (and Cloudflare); maps/app hosting providers unknown | Recipients exist but none is listed; the list must be completed by the owner |
| P12 | Retention, rights, contact, effective date | blank | Blocking |

## 3. Topics a B2B reader (and counsel) will look for that the policy does not mention
Lawful bases; international transfers and data location (the Security page says no hosting claim is made); security measures (encryption in transit is claimed on the Security page, not here); who the controller vs processor is for each data set; how to exercise rights and whom to complain to; children's data; automated decisions; **data of third parties captured by customers** (exhibition capture: business-card scans, QR registrations, voice notes, WhatsApp messages; Loop 17); **photos and notes that may contain third-party personal data**; deletion on account closure; breach notification; DPO/contact point; cookie list beyond analytics. No drafting here; this is a checklist for counsel.

## 4. Terms: gaps and consistency

| # | Observation | Cross-check |
|---|---|---|
| T1 | Section 2 describes the service as "software for planning, recording and reviewing field visits" | Consistent with the visit-evidence positioning (Loop 15); no FSM/orders implied |
| T2 | Section 4 "Customers own their data... any data processing agreement" | No DPA available publicly (P9) |
| T3 | Section 5: customers must use location features lawfully with notice and consent | Good boundary; matches the product's consent prompt |
| T4 | Section 6 Fees empty | Pricing page publishes 3 plans, 14-day no-card trial, 17% annual discount, 3/3/5-seat minimums, billing in USD (Loops 6, 11); the terms do not mention trial, minimum seats, auto-renewal, taxes, currency, refunds |
| T5 | Liability, termination/data export, governing law, entity all empty | Blocking for contracting |
| T6 | Not covered: service levels or uptime, support terms, acceptable-use beyond location, suspension, IP/licence, confidentiality, security obligations, subprocessors, third-party services (maps, WhatsApp), changes to terms | Counsel checklist |
| T7 | The cross-market notice says one legal entity and no India-specific position | Same as P10; also means there is no Indian contract entity or GST invoicing information stated |
Pricing page claims that the terms should support: "The figure shown is the figure charged, in US dollars" (US page); "prices exclude applicable taxes"; "14-day free trial, no credit card".

## 5. Inconsistencies list (for the owner)
I1 Privacy "route suggestions" vs route page claims (P6). I2 "Not used for advertising" vs click-ID capture (P2). I3 Banner names only Google Analytics vs policy naming Clarity (P3). I4 Cloudflare beacon undisclosed (P5). I5 Location controls Enterprise-only vs policy wording (P8). I6 "One legal entity" with no entity named (P10). I7 Terms silent on trial, minimum seats and renewals that the pricing page states (T4). I8 Internal "template content" notice visible to the public on both pages (section 1). I9 Wording defect: "the same one company's document" reads as a typo.

## 6. Owner and counsel handoff checklist (facts to supply, not text)
1. Legal entity name, registered address, jurisdiction, contact point, effective date.
2. Where data is hosted; list of sub-processors and tools that receive personal data (analytics, CRM, admin database, webhook destination, email, maps, any messaging provider).
3. Retention periods by data type (enquiries, customer data, photos, location, backups) and deletion on exit.
4. Rights process: contact route and response time; complaint authority wording by market (counsel).
5. Whether click IDs are used for ad conversion measurement; if not, stop capturing or state it.
6. Whether the app suggests routes; if not, remove the phrase in all places (policy, `llms.txt`, route page).
7. Whether a DPA will be offered; where it will be published or how requested.
8. Commercial terms for fees: trial, minimum seats, billing cycle, renewal, currency, taxes, refunds, late payment.
9. Service levels and support commitments the company is willing to state.
10. Position on third-party data captured through exhibition features (controller/processor roles).
11. Counsel review for India (data protection law), UK/EU GDPR, Canada/Quebec, Australia, Singapore, UAE, US state laws if those markets are pursued.

## 7. Backlog impact
- **O02** gains items I1-I9 and the section 6 checklist (counsel-led; addendum in `L29-implementation-tickets.md`).
- **D09** (`llms.txt`) and **D05** (plan labels) pick up the route-suggestion and location-control alignment.
- **D12** (trust/consent): banner text must name Google Analytics, Microsoft Clarity and any Cloudflare analytics and match the final policy.
- Remove the internal "template content" notice from public view as soon as the pages are completed (or hide until then).

## 8. Decisions
1. Privacy and Terms remain P0 owner/counsel tasks; research supplies the checklist only.
2. Use "I1-I9" as the review list when counsel reviews drafts.
3. Until reviewed, no public claim about compliance, retention or data residency is allowed (consistent with the ledger).

## 9. Open questions
- Q74: Does the app suggest routes (privacy policy says it does)? Who confirms (product)?
- Q75: Are ad-click IDs used for advertising measurement or ad conversion uploads?
- Q76: Which tools and providers receive personal data from the website and app (full list for the sub-processor section)?

## 10. Next
Loop 35: contradiction audit across all public pages against the claim ledger; final consolidated update of the backlog and handoff.
