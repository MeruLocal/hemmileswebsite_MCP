# Loop 26 - AI visibility

Retrieved: 2026-10-21. Sources: Ahrefs site-explorer AI-responses count (120 units) and Brand Radar report list, live `https://hemmiles.com/llms.txt` and `robots.txt`, two WebSearch probes (Loops 24 and this loop). Google's current guidance (as cited in the brief): a dedicated generative-AI performance report exists in Search Console and `llms.txt` does not affect visibility in Google Search; check actual account capabilities after verification. Status: **researched (baseline: zero)**.

## 1. Baseline (2026-10-20/21)

| Measure | Result | Source |
|---|---|---|
| AI-platform citations of hemmiles.com | **0** on every platform (ChatGPT, Google AI Overviews, Google AI Mode, Gemini, Perplexity, Copilot, Grok); 0 cited pages | Ahrefs AI responses count |
| Brand Radar report for Hemmiles | **none exists** (two reports exist for other projects in the account; none for project 10459002) | Ahrefs Brand Radar reports |
| Brand search "Hemmiles field visit app" | no hemmiles.com result; other vendors only | WebSearch probe |
| Buyer-question probe: "best field visit app GPS check-in photos follow-ups works with existing CRM small field team pricing per user" | Answer cited **third-party listing pages** (GetApp country sites, FitGap, vendor pricing pages) and named other tools: The Field (Salesforce-centred), Checkmob, Outfield, Onsight App, Kickserv; **Hemmiles absent** | WebSearch probe |
| Referral traffic from AI domains | not measurable (analytics not wired; Loop 2) | - |
Meaning: Hemmiles has no AI-search presence yet; the starting line is empty, consistent with no Google index data (Loop 24). Treat as a clean baseline, not a decline.

### Correction to Loop 20
Loop 20 said Hemmiles has the lowest published price **among the six benchmarked vendors**. The probe above surfaces aggregator listings for Outfield (listed tiers $14.99 / $29.99 / $59.99 per user per month, with a free version) and The Field ($29 per user per month), both below Hemmiles' $39-$49 (aggregator figures; not verified on official pages; may be outdated). The "lowest price" statement must not be published beyond that scoped set, and Loop 20's wording is amended accordingly.

## 2. Repeatable prompt set (run monthly, same wording, record raw answers)
Platforms: ChatGPT (search on), Gemini, Perplexity, Copilot, Google AI Overviews / AI Mode (via search), logged-out where possible; one location per run (US, IN, GB); date and model/version noted.

| ID | Prompt (buyer question) | Market |
|---|---|---|
| P1 | What is the best field sales app for a team of 10 reps that already uses a CRM? | US |
| P2 | Field visit app with GPS check-in, photos and follow-ups: options and pricing? | US |
| P3 | Is there a field visit tracking app that records location only at check-in, not continuously? | US/UK |
| P4 | Best field force management software for a small sales team in India? | IN |
| P5 | Field sales tracking app with offline mode and photo capture for India? | IN |
| P6 | How do I write a daily sales report (DSR) for field sales reps? | IN |
| P7 | What is a beat plan and how do I build one for FMCG distribution? | IN |
| P8 | Visit report template for sales calls and site visits? | US/IN |
| P9 | What is the difference between primary and secondary sales? | IN |
| P10 | Field service app that records before and after photos and a checklist per visit? | US/UK/AU |
| P11 | What is the difference between CRM and field service management software? | US |
| P12 | Trade show lead capture app with business card scanning and QR registration? | US |
| P13 | Does <our CRM name> have a field visit app that writes visits back to the CRM? | US (per proven connector only) |
| P14 | Alternatives to Map My Customers / Badger Maps for small teams? | US |
| P15 | Is Hemmiles a good field visit app? What does it cost? | all (brand accuracy check) |
| P16 | Which field sales apps offer a free trial with no credit card? | US |
Per answer record: Hemmiles mentioned (Y/N); cited URL on hemmiles.com (Y/N, which); other cited domains; statements about Hemmiles and their accuracy (correct / incorrect / unsupported against the claim ledger); competitor set; date.

## 3. Factual-error register (our own pages that could seed wrong answers)

| ID | Item | Where | Risk | Fix owner |
|---|---|---|---|---|
| E1 | `llms.txt` says location is recorded "for route suggestions" | llms.txt | Implies suggestion/optimisation; ledger C1 says map, order, status, directions only | content/dev |
| E2 | `llms.txt` says Hemmiles "works alongside your existing CRM ... sends that activity back" with no plan note | llms.txt | CRM connection is Professional+ (Loop 11) | content |
| E3 | Absolute phrases ("never lose the next action", "know exactly where they need to be") | llms.txt, feature pages | AI quotes absolutes | content |
| E4 | 77 CMS posts about AI mileage tracking and SOC 2-compliant tracking on hemmiles.com | blog | AI answers may attribute mileage/SOC 2 capabilities to Hemmiles (no product page supports them) | owner decision (Q10, Q34) |
| E5 | `llms.txt` links the bare (non-canonical, 307) URLs | llms.txt | citation to non-canonical URLs | dev |
| E6 | "field sales and field service app" positioning | llms.txt, home | Service buyers expect FSM features (Loop 15) | content |
| E7 | Starter plan implies map (feature pages) | feature pages | Visit map is Professional+ | content |
Note: `llms.txt` is accurate on pricing, trial and annual discount, and correctly describes the market structure; it is useful for AI crawlers that read it but has no effect on Google Search, so corrections are low effort rather than a priority program.

## 4. Citation-gap map (where answers come from)
- Software directories and review aggregators (GetApp / Capterra family, FitGap, Gartner Peer Insights per Loop 5) and vendor listicles; Reddit threads (r/SalesOperations ranked in US SERPs); app-store listings (service queries; Loop 21).
- Hemmiles presence today: none of these. Actions (all external-facing, owner approval needed): create/claim vendor profiles on the relevant directories with accurate claim-ledger wording; collect real customer reviews only from real users; publish product screenshots and a pricing summary; app-store listings (Q52); participate in relevant forums only transparently and per community rules; no fabricated reviews.
- On-site: answer-ready passages (plain definition, who it is for, what is included by plan, limits, price, trial) on `/product`, `/pricing`, `/integrations`, `/teams/*`, using ledger-approved wording; comparison tables with dates; `Organization`/`SoftwareApplication` JSON-LD already present (Loop 12).

## 5. Technical access
- `robots.txt` allows Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot and all others (Loop 3). Whether to allow training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot) is a policy decision for the owner (Q61); search/answer crawlers should stay allowed.
- Pages are server-rendered HTML with JSON-LD (Loop 12); fast static text is crawler-friendly.
- GA4/analytics: add referrer groups for chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com, bing.com/chat once GA4 is live (Q6).
- Ahrefs Brand Radar: no Hemmiles report; creating one changes the account (and consumes units) - owner decision (Q62). If created, use the prompt set above, one report, daily frequency off except for ChatGPT/Perplexity/AI Overviews to limit units.

## 6. Decisions
1. Baseline recorded as zero; first prompt-set run after the next deploy of main and after GSC/analytics are set up, then monthly.
2. Fix E1-E3, E5-E7 as part of the Loop 29 content tickets; E4 awaits the Loop 13 owner decision.
3. External profile building is a Loop 27 workstream; no fabricated reviews or unverifiable claims.
4. Loop 20's price statement is scoped to the six benchmarked vendors.

## 7. Open questions
- Q61: Allow or block AI training crawlers (GPTBot, ClaudeBot, Google-Extended, CCBot)? Currently all allowed.
- Q62: Create an Ahrefs Brand Radar report for Hemmiles (units cost)?

## 8. Next
Loop 27: trust and authority - legal/company facts, security evidence, genuine proof, partners and publications; trust backlog and legitimate authority opportunities.
