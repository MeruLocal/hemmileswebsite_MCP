# Loop 32 - Rendering, mobile and performance audit

Retrieved: 2026-10-21, built-in browser pane (Chromium) with the 375x812 mobile emulation, plus in-page Performance API reads. **Limits:** lab measurements from an emulated pane on one machine and network, not field data, not Lighthouse/CrUX, no real iOS/Android device, no INP (needs real interaction). The first desktop reading ran with a zero-size (hidden) viewport and is only used for request counts and third-party hosts. LCP was captured reliably only on the home page; later page loads returned no LCP. No form was submitted. Status: **researched (lab)**.

## 1. Results (mobile 375x812)

| Page | LCP | CLS | Horizontal page scroll | TTFB | Load event | Notes |
|---|---|---|---|---|---|---|
| `/in` (home) | **1,940 ms** (the H1 text; FCP the same) | **0** | none | ~535 ms | ~1.4 s | one H1, viewport meta correct, `lang="en"` |
| `/in/pricing` | not captured | 0 | none (page); **plan table overflows its container** | ~540 ms | ~1.3 s | see F2 |
| `/in/demo` | not captured | 0 | none | - | - | form audit below |
| `/in/features/gps-check-in` | not captured | 0 | none | ~350 ms | ~0.6 s | 7,494 px tall |
| `/in/blog` | not captured | 0 | none | ~480 ms | ~1.0 s | 20 post links on page 1 |
Cold desktop-style first load of `/in`: **28 requests, about 458 KB transferred**, 16 script requests, 1 CSS file. A warm reload on mobile showed 36 requests / 42 KB (cache effects), so only the cold figure is used. Console: **no errors or warnings** logged across the pages visited. Third-party hosts contacted from the home page: `www.googletagmanager.com`, `www.google-analytics.com`, `www.clarity.ms` (+ `scripts.clarity.ms`, `e.clarity.ms`), `static.cloudflareinsights.com`.
Reading: on this lab run the site is **light and stable** (CLS 0, no page-level horizontal scroll, no console errors). Thresholds for "good" Core Web Vitals (LCP under 2.5 s, CLS under 0.1) are met in this single lab measurement; this is not evidence about real visitors.

## 2. Findings

### F1 (medium) Persistent cookie banner covers about a fifth of the mobile screen
The consent banner (Accept / Decline) is a fixed card over the bottom of the viewport (it overlaps the hero CTA area on the home page and the plan table on pricing) until a choice is made. It appears in India too, where analytics storage defaults to granted (Loop 28). Consider a slimmer bar, or not showing it where consent is not required and the policy allows (counsel decision with O02).

### F2 (high on pricing) The mobile plan-comparison table hides the plan columns
On `/in/pricing` the comparison table's first column ("FEATURE") fills the card and the plan column heading is cut off ("S..."), so the user must scroll the table sideways to see Starter / Professional / Enterprise, with no visible scroll cue in the screenshot. The table overflows its container by design (page-level scroll is fine). On the page where buyers compare plans, a phone user sees feature names without plans. Suggested fix: stacked per-plan cards on small screens, or a sticky first column with narrower text plus a scroll cue (D05 can carry the plan-gate labels at the same time).

### F3 (medium) Consent text discloses Google Analytics only
Banner: "We use Google Analytics cookies to understand how this site is used. No advertising cookies." The site also loads **Microsoft Clarity** (session recordings and heatmaps) and the **Cloudflare Web Analytics** beacon; the privacy page is a template (Loop 27). Disclosure should name each tool and its purpose, and match the privacy policy; Clarity is consent-gated in the site code (Loop 28) but the banner text does not mention it. Add to D12 / O02.

### F4 (low/medium) Small touch targets and tiny text
Home: 62 of 77 visible interactive elements are under 44 px in at least one dimension (pricing: 43 of 60). The most common size is about 24 px tall (in-body text links and mockup list items). 24 px meets the WCAG 2.2 AA minimum target size but not the larger 44 px touch guideline; primary buttons are fine (the demo form submit is 48 px, fields 46-50 px). **105 text elements are under 12 px (minimum 8.5 px)**, most likely inside the drawn phone mockups (not verified element by element). Increase nav/footer/CTA targets and any real UI text below 12 px.

### F5 (low) Demo form accessibility and validation
Demo form: every field has a label and sensible `autocomplete` (name, email, organization, tel); submit button 48 px; honeypot field present (autocomplete off). Required fields (name, email, company per server code, Loop 28) are **not marked with the `required` attribute or `aria-required`** (the form uses `noValidate` and custom validation); verify visual required markers and error messages in the form flow (no submission was made). A second form (footer newsletter) also has an email field.

### F6 (low) Images
Home has 1 header logo (alt "Hemmiles", 552 px wide shown at 124 px) and a footer logo (589 px at 133 px); 15 lazy-loaded decorative images present with empty alt (appropriate for decorative) but zero rendered width at measurement (not yet loaded). The logos are about 4x the displayed width: modest weight saving possible (srcset or smaller asset). Alt text issue from Loop 12 stands for the content images counted there.

### F7 (positive) Structure and stability
Exactly one H1 per page, viewport meta, `lang` set, no layout shift, no console errors, no page-level horizontal scroll at 375 px, fast server response (TTFB about 0.35-0.55 s in lab).

## 3. Backlog impact
- **D15** done as specified; follow-up items: F1 banner, F2 pricing table, F4 targets and text size, F5 required markers.
- **D05 + D01**: fold the pricing-table redesign into the plan-label work.
- **D12 / O02**: consent and privacy text must name Google Analytics, Microsoft Clarity and Cloudflare Web Analytics and match the legal pages.
- **New field-data requirement:** once GSC is verified, check the Core Web Vitals report (real-user data) before treating performance as solved (M01).

## 4. Decisions
1. Performance is not the bottleneck; usability on the pricing page and consent disclosure are the issues.
2. Do not claim "fast" or "Core Web Vitals pass" publicly without field data.
3. Re-test on a real iOS and Android device and with Lighthouse when available (Q70).

## 5. Open questions
- Q70: Can someone run Lighthouse/PageSpeed and a real-device check (iOS Safari, Android Chrome) on home, pricing, demo, and one feature page?
- Q71: Is the consent banner required in India for the intended policy, or should it be limited to the regions where opt-in applies (counsel)?

## 6. Next
Loop 33: India competitor price and feature benchmark (Trackolap, Trackobit, Spoors, PepUpSales, Lystloc, FieldBlaze and similar) from official pages.

## Update from Loop 34 (2026-10-21)
F3 correction: the **privacy policy does name** Google Analytics, Microsoft Clarity and their cookies (`_ga`, `_clck`, `_clsk`); the gap is the **cookie banner text**, which names only Google Analytics, and the **Cloudflare web-analytics beacon**, which appears in neither the banner nor the policy.
