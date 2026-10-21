# Loop 17 - Exhibition capture and vertical selection

Retrieved: 2026-10-21. Sources: live `/us/features/exhibition-capture` and keyword scan of help, pricing and integrations; Ahrefs US and India keyword overviews (132 units each; third-party estimates, not our traffic; `cpc` in USD cents). Status: **researched**. Nothing here is demonstrated; the capture-to-follow-up workflow is **not verified** (Q28).

## 1. What the exhibition page claims
"Scan a business card, record a voice note or let a visitor register through a QR form. The whole team sees the leads in one live feed, with follow-up settings ready for after the event."
Steps: (1) set up the pre-event plan - what to capture and who follows up; (2) capture at the stand - scan card, voice note, or share the QR registration form; (3) **send a quick WhatsApp message from the lead** and apply follow-up settings; (4) watch the event live - **live lead feed, team leaderboard and ROI widgets**. Features: business-card scanning, QR self-registration form, multi-language capture.
Scan: "CRM" 20 mentions across the four pages (leads flow to CRM is implied); "consent" 1 (location consent only); no GDPR/privacy statement for visitor data; no plan listed for exhibition capture in the pricing matrix (Q29); help/integrations pages do not explain the event workflow.

## 2. Demand

| Keyword | US vol. | US KD | US CPC | India vol. | India CPC |
|---|---:|---:|---:|---:|---:|
| business card scanner app | 600 | 33 | ~$1.70 | 100 | ~$0.02 |
| lead retrieval app | 400 | 6 | ~$25 | 40 | ~$0.25 |
| trade show lead capture app | 150 | 4 | **~$30** | 30 | - |
| lead capture app for events | 40 | - | - | - | - |
| event lead capture software | 30 | 7 | - | - | - |
| exhibition lead capture app | 30 | - | - | 10 | - |
US buyers say "trade show" and "lead retrieval"; the page says "exhibition". The commercial value (CPC $25-30) is among the highest seen in this programme, but the volumes are modest (hundreds). "Business card scanner app" (600) is a consumer-grade query with different intent (individuals, free apps); do not chase it.

## 3. Fit and risk
- It is a different job from field visits: acquire leads at an event, then follow up. Competitors for these queries are event-lead-retrieval products, not field-sales tools (Loop 20 will name them).
- It reuses the follow-up engine and the CRM connection, so there is a coherent story: "events feed the same follow-up and CRM flow as field visits".
- Claim risks (all PAGE-only): business-card scanning accuracy; voice note handling (transcribed or stored audio?); WhatsApp sending (needs approved WhatsApp Business messaging and recipient consent - policy/legal check); ROI widgets (what is measured, with what inputs?); multi-language capture (which languages, OCR or UI?); visitor personal data collected via QR form (privacy notice, consent, retention - the privacy page is a template).
- Plan availability unstated: do not quote a plan until Q29.

## 4. Workflow to verify (for a demo)
Plan event -> assign who follows up -> capture 5 leads (3 card scans, 1 voice note, 1 QR) -> duplicate handling -> live feed -> send WhatsApp -> follow-up created with owner/date -> leads reach the CRM -> ROI widget inputs. Pass/fail table and screenshots needed before any article ("trade-show capture to first follow-up" candidate from the brief stays **conditional**).

## 5. Vertical and use-case consolidation (Loops 14-17)

| # | Use case | Evidence of demand (estimates) | Product fit | Status |
|---|---|---|---|---|
| 1 | Field sales with an existing CRM (account visiting) | US 450-600 head terms, India 150-350 | Strong on claims (Blueprint A) | **Primary** - IN, US |
| 2 | Distribution / beat coverage | India vocabulary; app-query volume ~0; guides drafted | Good on claims; recurring beats unverified | **Supported, India-first**; no new pages |
| 3 | Service visit evidence | US 1,700 "field service app"; UK 250, AU 200, IN 300 | Visit evidence only, not FSM; sign-off undefined | **Conditional wedge** - validate (Q37-Q39) |
| 4 | Trade-show / event lead capture | US 400-600 with CPC $25-30 | Plausible; many unverified claims | **Conditional** - verify first; optimise existing page, no new URL |
| 5 | Medical representatives | India ~100 "mr app" | Visit log only | Supported with boundary; no investment |
| 6 | Collections | India ~100 "payment collection app" | Visit + promise tracking only | Supported with boundary; no investment |

## 6. Decisions
1. **No new vertical or use-case URLs are approved.** Existing team/feature pages cover all six; changes are rewrites and boundaries (Loop 12 briefs, Loop 29 tickets).
2. Exhibition capture: rename the visible vocabulary for US to "trade show lead capture / lead retrieval" in the page's title/H1 after verification; keep URL `/features/exhibition-capture`; label the plan; add a privacy note for visitor data; hold the WhatsApp and ROI claims until proven (ledger C11 stays PAGE).
3. Priority order for evidence collection (Loop 28 demo requests): sales workflow, then service, then exhibition.

## 7. Open questions
- Q42: Is exhibition capture in production for all plans, and has it been used at a real event?
- Q43: How does the WhatsApp send work (WhatsApp Business API, template approval, per-message cost, consent capture)?
- Q44: What do the "ROI widgets" measure and from what inputs?

## 8. Next
Loop 18: connector readiness and migration - objects, directions, imports, relationships, retries, ownership and recovery; build the integration test matrix (Phase D).
