# Loop 4 - Country-page audit

Retrieved: 2026-10-21, live HTTP (UA `Mozilla/5.0 research`), text extracted with scripts and diffed; plus repo `MeruLocal/hemmileswebsite` origin/main and open PR #7 stat. Status: **researched**. Similarity ratios are `difflib` quick ratios on visible text (script output, not a Google metric).

## 1. Locale family as served (live)

| Path | Status | Canonical | Robots | hreflang entries | Title |
|---|---|---|---|---|---|
| `/` | 200 (UA default: 307 -> `/in`) | `/in` | index | 12 | Field Visit App for Teams in India |
| `/in` | 200 | self | index | 12 | same as `/` |
| `/us` | 200 | self | index | 12 | Field Visit App for US Field Teams |
| `/gb` | 200 | self | index | 12 | ... for UK Field Teams |
| `/ca` `/au` `/nz` `/ie` `/sg` `/ae` `/za` | 200 | self | index | 12 | market-named titles |
| `/fr` `/de` (long tail, sampled) | 200 | self | **noindex, follow** | 0 | "Field Visit App for France / Germany" |

Core cluster = 10 markets (IN, US, GB, CA, AU, NZ, IE, SG, AE, ZA) + `x-default`. Each core page carries the same 12-entry cluster (`en`, `en-IN`, `en-US`, `en-GB`, `en-CA`, `en-AU`, `en-NZ`, `en-IE`, `en-SG`, `en-AE`, `en-ZA`, `x-default`). Self-reference and canonical-in-cluster checks passed for /in /us /gb /ca. Reciprocity is true by construction (identical cluster on every page).

Long-tail markets: live is `noindex, follow` self-canonical. Open **PR #7** (6 files: lib/geo.ts, market-seo.ts, meta.ts + 3 test files) changes this to index,follow canonicalising to the international page. That PR is not merged, so live behaviour differs from what the repo will do.

## 2. Findings

### F1 (high) Core country homepages are ~99.7% identical text
Visible-text similarity /us vs every other country page: 0.996-0.998. Each is ~2,175-2,182 words with the **same H1** ("Your field team, connected wherever work happens."). Actual differences between /us and /gb are about ten token swaps:
- US -> UK, United States -> United Kingdom, dollars -> pounds sterling;
- team vocabulary: "distribution, collections" -> "merchandising, credit control"; "pharma" -> "medical" (/gb);
- tax line: sales tax -> a generic "is on top" line.
/us vs /in: "pharma sales" -> "medical representative", sales tax -> GST, dollars -> rupees, "US Field" removed, "collections" -> "collection".
So market pages differ in title, currency/pricing, a few nouns and tax wording. They are market-labelled, not market-written. Google's guidance allows regional versions of similar content with correct hreflang/canonical (no penalty by similarity alone), but the only genuine, defensible differences today are price/currency/tax and terminology. This matches the repo's own design comment (markets differ by currency/tax position, vocabulary, spelling, notes, form placeholders).

### F2 (high) Ahmedabad / Gujarat sample data appears on every market page
The product mockups on `/us` (and all markets) show "Ahmedabad West", "Surat", "Vadodara", "Mehta Medicals", "Tue 29 Sep", "Ahmedabad region", rep names Alex K./Priya S./Rahul M. This is hard-coded sample UI. For a US/UK/Canada visitor it reads as an India-only product. Candidate fix (owner decision, not done here): market-specific mockup data (city/customer names/date), or market-neutral sample text. Confirms the brief's "UK homepage retains an Ahmedabad example" and widens it to all non-India markets.

### F3 (high) International article copy is identical across markets
`/gb/blog/gps-check-in-without-surveillance` vs `/us/...` similarity 0.997; vs bare 0.998; 541 words each. Same pattern as home. Brief's observation confirmed for the sampled article. All hand-written articles likely share this (Loop 13 to check each).

### F4 (high) hreflang / canonical conflict on the "international" bare URL
- `hreflang="en"` and `x-default` point to the bare URL `https://hemmiles.com`, but the bare URL's canonical is `/in`. A canonical that points to a different cluster member while hreflang references the bare URL is a mixed signal.
- The bare URL is effectively the India page (same text, same title). So the site has no true "international" (non-India) page: x-default is India.
- Bare `/` redirects 307 -> `/in` for a default UA but returns 200 for a Googlebot UA (Loop 3 F3).
Decision needed from the owner: is the product India-first (then say so; bare = redirect to /in; x-default -> /in) or global (then bare should canonical to itself and carry non-India copy)?

### F5 (medium) Pricing differs by market, but the currency set is a derived/converted display
Pricing pages (monthly list, per user): US $39 / $49 / $99; GB 29 / 37 / 75 (GBP); IN 3,500 / 4,500 / 8,000 (INR); AE AED 145 / 180 / 365. A second price set is also shown (US $32 / $41 / $82; probably annual billing, to verify in Loop 11). Repo design: only USD and INR are contracted; other currencies are converted at dated FX rates in `lib/fx-rates.json` with fine print. **Check Loop 11**: that the converted prices are stated as display-only, that FX rates are dated and refreshed, and that GBP/AED/etc. never imply local billing.
(US numbers equal the brief's seeds: 39 / 49 / 99; minimum seats still to verify.)

### F6 (medium) Long-tail strategy is cautious and sound; PR #7 flips it
Repo comments call 249 thin country pages "doorway pages" and publish only core markets. Live long-tail pages (`/fr`, `/de`) exist at 200 but are noindex - consistent. PR #7 would make them index,follow while canonicalising to the international page - that is a valid consolidation, but depends on F4 (what is "the international page"?). Do not merge PR #7 before F4 is decided.

### F7 (low) Selector / navigation
Not audited (needs a rendered browser pass; carry to Loop 12).

## 3. Retain / share / localise / consolidate / defer (initial, pending Loops 5-10)

| Group | Decision now | Reason |
|---|---|---|
| `/in` | **Retain** as primary | Product, pricing and examples are India-grounded today |
| `/us`, `/gb`, `/ca` | **Localise for real, or defer** | 99.7% duplicate of India page + Ahmedabad data; localisation requires content (Loops 5-7) |
| `/au`, `/nz`, `/ie` | **Defer** | no market evidence yet (Loop 8); keep indexable per current config but no further investment |
| `/sg`, `/ae`, `/za` | **Defer** | readiness unknown (Loops 9-10) |
| Long-tail `/fr` `/de` ... | **Keep noindex / consolidate** | thin; wait for PR #7 decision |
| Bare `/` | **Decide** | see F4 |

## 4. Decisions
1. No localisation work is commissioned before Loop 10 selects at most two execution markets.
2. Three owner-level decisions required (Q12-Q14), all of which gate PR #7.
3. Replacing Ahmedabad sample data is a candidate P1 content fix; ranked in Loop 12 / 29.

## 5. Open questions (owner)
- Q12: Is Hemmiles India-first or global? Which URL is the international page / x-default?
- Q13: Is a market-neutral or market-specific set of mockup data acceptable (Ahmedabad etc.)?
- Q14: Do you want PR #7 merged as is, held, or revised after Q12?

## 6. Next
Loop 5: United States - buyer, vocabulary and SERP research for the US market (WebSearch-based; Ahrefs keyword data only for volumes, labelled as estimates).
