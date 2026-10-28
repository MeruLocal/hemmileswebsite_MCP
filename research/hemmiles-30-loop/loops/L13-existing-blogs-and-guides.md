# Loop 13 - Existing blogs and guides

Retrieved: 2026-10-21. Method: scripted fetch of the 6 live hand-written articles at `/in/...`, a 6-post sample of the 77 CMS blog posts (`/blog/<slug>`), the `/in/blog` index, and the source of the 5 new guides on `origin/main` (not live; Loop 3 F1). Word counts are `<main>` text including the related-links and CTA blocks, so body text is somewhat smaller. Status: **researched**.

## 1. Inventory

| Set | Count | Live? | Source |
|---|---:|---|---|
| Hand-written blog posts | 3 | yes | `lib/content.ts` |
| Hand-written guides (original) | 3 | yes | `lib/site.ts` |
| Hand-written guides (added 2026-10-21, PR #8) | 5 | **no (404)** | `lib/site.ts` on main |
| CMS blog posts | 77 (sitemap) | yes | `lib/cms-blog.ts`, `/sitemaps/blog.xml` |
Total article URLs on the international/IN site: 88 intended; 83 live.

## 2. The six live hand-written articles

| Article | Words (main) | Reading-time label | H2 | Schema | Author | Contextual links to features/docs |
|---|---:|---|---:|---|---|---|
| blog: why-field-visits-fall-out-of-the-crm | 355 | 6 min | 3 | BlogPosting | "Hemmiles team" | **none** |
| blog: gps-check-in-without-surveillance | 317 | 5 min | 3 | BlogPosting | "Hemmiles team" | none |
| blog: offline-first-field-apps | 312 | 4 min | 2 | BlogPosting | "Hemmiles team" | none |
| guide: planning-a-field-day | 341 | 6 min | 3 | Article | none | none |
| guide: rolling-out-gps-check-in | 304 | 5 min | 3 | Article | none | none |
| guide: writing-useful-visit-notes | 294 | 4 min | 3 | Article | none | none |
Findings:
1. **Reading-time labels overstate by roughly 3x.** 294-355 words is about 1.5-2 minutes at 200 words/min; labels say 4-6 minutes. (Brief asked to check this; confirmed.) Fix: compute the label from the actual body, or lengthen the content with real assets (below).
2. **Every article is three short sections, no table, no template, no worked example, no screenshot.** These are intros, not reference assets.
3. **No article links to any feature page, team page, docs or integrations.** Internal links go only to the blog/guides hub, sibling articles, `/demo` and `/pricing`. The brief's "contextual links to the relevant feature" is the single biggest cheap win.
4. **No reviewer or date line** visible in the extracted text; guides have no author at all. E-E-A-T signals are thin: add author, role, reviewed date; do not invent names (owner supplies).
5. **GPS blog and GPS guide overlap in subject**; assign roles (blog = principles and evaluation questions; guide = implementation checklist) as the brief recommends.
6. Unsupported frequency claims: not found in the three blogs sampled; recheck on rewrite.

### Refresh briefs (keep URLs)
| Article | Role | Add |
|---|---|---|
| Why field visits fall out of the CRM | Diagnose missing/late field reporting | Visit-record checklist; an *illustrative* (labelled) completed record; who owns each field; common failure points; links to /features/photos-notes, /features/follow-ups, /integrations |
| GPS check-in without surveillance | Principles and buyer questions | Event-based vs continuous comparison table; "what is recorded / when / who sees it" (Loop 11 C2, C3, C15); weak-GPS error example; link to /features/gps-check-in, /security; legal wording only after owner sign-off |
| Why field apps have to work offline | Evaluate reliability | Offline capability matrix by platform; reproducible 10-minute test checklist; screenshots of queued items; reconnect example with timestamps/photos/retries/conflicts (needs Loop 18 evidence) |
| Planning a field day that actually works | Manager's procedure | Worked day plan (visit length, travel allowance, appointment windows, breaks, cancellations, unplanned visits); editable schedule download (Loop 22 spec) |
| Rolling out GPS check-in | Implementation checklist | Pilot scope, staff communication, permissions, address validation, weak-GPS exceptions, support/escalation, acceptance criteria |
| Writing visit notes | Report format | Blank template + two completed examples (sales, service): objective, observations, customer request, outcome, next action, owner, due date (Loop 22) |

## 3. The five new guides (merged to main, not live)
Slugs: primary-vs-secondary-sales, beat-plan, daily-sales-report-dsr, field-sales-vs-inside-sales, permanent-journey-plan-pjp. Source structure (primary-vs-secondary sampled): title, summary, ~6 min label, category ("Distribution"), 3-4 sections of short paragraphs. Vocabulary is India/FMCG (beat plan, DSR, PJP, primary/secondary sales); Ahrefs shows 40 US searches/month for "beat plan" and 0 India app-query volume for "beat plan app"/"dsr app" (Loops 5, 10), though informational-intent search may differ (test with GSC later, Loop 24).
Decisions:
- **Do not publish more India-vocabulary guides** until GSC shows demand.
- **field-sales-vs-inside-sales** is the only one with US relevance: keep, localise examples, link to /teams/field-sales and the US product page.
- Others: keep for India; attach to the distribution/field-sales team pages; add the same practical assets (e.g. DSR template, beat plan sheet) rather than new URLs.
- All five need a "live" check after the next deploy (Q9).

## 4. The 77 CMS posts (sample of 6)
- Titles: US mileage reimbursement, IRS rules, SOC 2 compliance with mileage tracking, last-mile delivery, 1099 contractors, Maharashtra DPDP/GST, a "what is a mileage log" explainer.
- Length 1,000-2,530 words; structure "Key takeaways" + question-style H2s + 11-84 list items; labels 5-12 min; no JSON-LD Article/BlogPosting detected; byline "The hemmiles.com team"; dated 2026-10-10..21 (newest content on the site); canonicals self; indexable.
- **The product pages contain zero mentions of mileage** (home, product, reports, route-planning, pricing, help: 0 each). The posts discuss "AI mileage tracking" and "SOC 2 compliant mileage tracking" without any product page supporting a mileage feature or a SOC 2 status. This is a claims and intent mismatch: the posts attract a different buyer (tax/expense/mileage reimbursement) than the field-visit product. Possible readings: (a) a second product line, (b) repurposed content from another site, (c) programmatic content. Unknown (Q10).
- The sampled `/in/blog` first page lists only these CMS posts; the three hand-written posts did not appear in that page's post links (they are older; ordering or pagination hides them). Visitors who land on the blog see mileage content first.
- Per-post quality cannot be judged from a 6-post sample; the volume, templated titles ("How X in <place> can use mileage tracking to <outcome>") and 6 near-duplicate Delaware / Maharashtra variants are programmatic-pattern risks.
Decision (provisional, owner-gated): **hold, do not expand**. Options for the owner: (1) keep as a separate "mileage" content hub with product support, (2) noindex and unlink from the main blog until a mileage feature exists, (3) retire and redirect. Cheap safe step now: exclude them from the Hemmiles blog index and sitemap pending Q10. No SOC 2 or AI claims may be repeated in new content (ledger NO list).

## 5. Practical-asset backlog (feeds Loop 22)
1. Visit-report template (+ two examples) -> visit-notes guide.
2. Editable field-day plan -> field-day guide.
3. Offline evaluation checklist -> offline article.
4. GPS rollout checklist and "what is recorded" table -> GPS guide/blog.
5. CRM visit-record checklist -> CRM article.

## 6. Decisions
1. All six live articles: refresh in place (no new URLs), with practical assets, feature links, author/reviewed-date fields, corrected reading-time labels.
2. Five new guides: keep, flag not-live; no more India-vocabulary guides without GSC evidence.
3. 77 CMS posts: HOLD; owner decision needed (Q10); never cite their SOC 2/AI claims.
4. Fix-once items for Loop 29: reading-time calculation; add contextual-link component to articles; author/reviewer block.

## 7. Open questions
- Q10 (repeat, now urgent): Who created the 77 mileage/tax posts, for which product, and should they be on hemmiles.com?
- Q33: Who is the named author/reviewer for articles and what credentials can be stated?
- Q34: Is there any mileage-tracking capability in the product? If not, the posts mislead intent.

## 8. Next
Loop 14: sales and distribution workflows (account selection, visits, capture, outcomes, follow-ups, coverage) and two workflow blueprints.
