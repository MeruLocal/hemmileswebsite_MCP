# Loop 35 - Contradiction audit

Retrieved: 2026-10-21. Method: scripted read of the `<main>` text of 38 live pages (36 `/in` commercial and article pages, `/customers`, plus the `/in/blog` hub) and phrase scans for: optimisation, route suggestions, real-time/live, absolutes, certifications/compliance, AI, named CRMs, orders/invoicing/stock, attendance/tracking, automation, native/official, savings/outcomes, WhatsApp, unlimited; plus cross-page checks of repeated facts and plan labels. Every hit was compared with the claim ledger (Loop 11) and Loops 14-18, 26 and 34. Static text only. Status: **researched**.

## 1. What is clean
- **No** claim of route optimisation, AI features, SOC/ISO/GDPR certifications, named-CRM compatibility, "native/official/certified partner", or quantified savings/ROI on the product pages scanned.
- The 30-minute demo statement and the "7 steps" workflow appear identically on every page that uses them; trial terms (14 days, no card) and plan minimums appear only on `/pricing` (consistent, but see U1).
- Mileage content appears **only** on the `/in/blog` hub (the CMS posts), nowhere on any product page.

## 2. Contradiction and over-claim register

| ID | Where | What | Conflicts with | Severity | Ticket |
|---|---|---|---|---|---|
| K1 | `/security` ("and to suggest routes"), privacy policy, `llms.txt` | Location is used "to suggest routes" | Route page claims only map, plan order, status, directions hand-off (C1); no optimisation claimed | High | D09, O02, D05; verify with V01 (Q74) |
| K2 | All non-pricing pages | **Zero plan names** appear on route-planning, offline, security, field-sales, how-it-works, product and integrations pages (integrations has 19 CRM mentions, home 16) while CRM connection, visit map, territories, audit trail and location controls are Professional/Enterprise | Pricing matrix (Loop 11) | High | D05 |
| K3 | `/features/reports` mockup | A reports panel shows "Orders placed 36%" (labelled "Sample data") | Product boundary: no order capture (Loop 14) | Medium | D01/D05; replace the metric or caveat |
| K4 | Home and offline mockups | "Visit record saved to the CRM at 11:18 AM" and "Visit record saved to the CRM" shown as part of the standard flow | Starter has no CRM connection (Loop 11 C5) | Medium | D05 |
| K5 | Home hero, how-it-works, feature and team pages (76 hits on 35 pages) | Absolutes and outcomes in shared copy: "Never lose the next action", "Report reviewed without a single call", "Live status, not status calls", "Know that the visit actually happened", "Verify that the rep reached the right location" | GPS records time, location and accuracy; it cannot prove attendance by itself (weak fix shown as exception, Loop 11 C2, C7) | Medium | D07, D09 (soften to "records time, location and accuracy"; "next action recorded with owner and date") |
| K6 | `/features/exhibition-capture` | WhatsApp quick-send, live lead feed, team leaderboard, ROI widgets, multi-language capture, card scanning | Unverified (Loop 17); plan unstated | Medium | C05, O09 |
| K7 | 35 of 38 pages | Ahmedabad/Gujarat sample data (coordinates, cities, customers, dates) on every market | Market pages for US/UK/etc. (Loop 4) | High (known) | D01 |
| K8 | Privacy vs code vs banner | "Not used for advertising" vs ad-click-ID capture; banner names only Google Analytics; Cloudflare analytics undisclosed | Loop 34 | Medium | O02, D12 |
| K9 | Privacy/Terms | "Hemmiles has one legal entity" with none named; internal "template content" notice public | Loop 27, 34 | High | O02 |
| K10 | Security vs pricing | Admin control of location data described to all readers; location and retention controls are Enterprise-only | Loop 11 C12 | Medium | D05 |
| K11 | `/in/blog` hub | Newer CMS posts include **regulatory-compliance topics**: "Support Compliance with the US Department of Transportation (DOT) Hours of Service Rules", "...with the Fair Labor Standards Act (FLSA) for Hourly Employees", "...with the New California Assembly Bill 5 (AB5)", plus IRS and SOC 2 posts seen earlier | No product feature or compliance statement exists (mileage appears nowhere else); legal-compliance advice from a site with no stated legal entity | **High** | O06 (escalated: noindex/unlink/retire is the safe default until decided) |
| K12 | `/customers` and `/customers/pharma-distributor` | Illustrative profile includes specific details and metrics-sounding outcomes ("call frequency per doctor, calls completed against plan") | Product's ability to compute these is unverified (Loops 16, 23) | Low-Medium | D12, V01 |
| K13 | `llms.txt` vs service page | "field sales and field service app" | Visit-evidence boundary (Loop 15) | Low | D09 |
| K14 | `llms.txt` "Help & FAQ: 12 common questions" vs help page | The help page text contains 16 question marks | Count may differ from FAQ item count | Low | D09 (verify count) |

## 3. Under-advertised strengths (facts that exist but are hard to find)
- **Trial terms (14 days, no card) and 3-seat minimum** are stated only on the pricing page, not on home, demo or product pages where the "Start free trial" CTAs sit (U1).
- **Offline mode is in every plan, including Starter**, but this is visible only in the pricing matrix (U2).
- **Event-based location (check-in/out only)** is explained on the GPS page, blog and security page but not in the home hero or sales copy where it differentiates from live-tracking vendors (Loop 20, 33) (U3), subject to verification of C3.
- **CRM connection is included from Professional at 3 seats** (U4) - competitor structures differ (Loop 19), subject to Loop 18 evidence.
- **Full price transparency** is itself a differentiator among vendors that hide prices (Loop 33) (U5).
Action: after verification, surface U1-U5 on home/product/demo with ledger-approved wording (C01).

## 4. Net effect on the backlog (consolidated at the end of the programme)
- **Tickets updated, no new IDs needed:** D01 (add K3 reports metric), D05 (K2, K4, K10, plan labels on every page type), D07/D09 (K5 phrases, K13, K14), O02 (K8, K9), O06 (K11 escalated), C05/O09/V01 (K6, K12).
- **Tickets added earlier in the extension:** O16 (India pricing/packaging, Loop 33); D03 expanded (Loop 31); D15 follow-ups (Loop 32); O02 expanded (Loop 34).
- **Net total:** 61 tickets (60 from Loop 29 + O16).

## 5. Decisions
1. K11 is the top content-risk item; the safe interim action is to remove the CMS posts from the Hemmiles blog index, nav and sitemap (noindex or unpublish) until the owner decides, because they present legal-compliance guidance without any product or entity backing.
2. Treat K1 and K2 as the first claim-ledger fixes (cheapest; no new product evidence needed beyond one product answer, Q74).
3. Re-run this scan after any content release (script definitions are stable: 38 pages, 14 phrase groups) and compare counts.

## 6. Open questions
- Q74 (repeat): does the app suggest routes? Governs K1.
- Q77: Was the mileage/tax content created for a different product or site, and may it be removed from hemmiles.com now (interim noindex)?

## 7. Programme status
Loops 1-35 complete. See `L30-consolidated-handoff.md` section 11 for the extension results and the updated risk and question registers.
