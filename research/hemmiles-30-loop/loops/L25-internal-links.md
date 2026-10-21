# Loop 25 - Internal links

Retrieved: 2026-10-21. Method: scripted crawl (static HTML, `href` attributes) of 113 live URLs: the 30 `/in` commercial URLs from `markets.xml`, the 6 `/in` article URLs from `resources.xml`, the 77 CMS posts from `blog.xml`, plus all 14 `/in/blog/page/N` pagination pages. Links were captured both from the whole document and from `<main>` only ("in-body"). All 113 returned 200. JS-injected links are not seen. The 5 new guides are not live, so they are not in the graph. Status: **researched**.

## 1. Structure observed
- **Sitewide navigation** gives every page one link to each commercial page (35 `/in` pages x 35 inbound each). In-body links are what differs.
- **Home** is linked from all pages (112 inbound). **Country switcher** on every page links to the same page in 9 other markets (about 149 links to each market prefix).
- All 77 CMS posts are reachable (no orphans): `/in/blog` plus 14 paginated pages of 6 links each (14 pages -> 80 article links = 77 CMS + the 3 hand-written posts). Listing is newest-first, so the **3 hand-written field posts sit on the last pages (13-14)**, about 4-5 clicks from the home page, while 77 mileage posts occupy the top.

## 2. Findings

### F1 (high) Two disconnected silos: product pages and articles
- **0 of 9 feature pages link to any guide or blog post**; **0 of 6 articles link to any feature, team, docs or integrations page** (Loop 13). Articles link only to the hub, siblings, `/demo`, `/pricing`.
- Body-link counts: features 11-15 each; team pages 6 each; the three field blogs 3 each; the three guides 5-7 each.
- **`/in/product` has exactly 1 in-body inbound link (from home); `/in/integrations` has 1 (home); `/in/security` has 1 (from gps-check-in).** The product page, the owner of the head terms (Loop 21), is almost unreferenced in context; it relies on the menu.

### F2 (high) Hand-written articles are buried
Relevant posts sit deepest in the chronological blog index while the off-topic CMS posts appear first (Loop 13). A visitor or crawler entering `/blog` meets mileage content first.

### F3 (medium) Links that redirect, on every page
Every page (113 of 113) links to bare `/privacy`, `/terms`, `/customers`, `/careers`; `/privacy` and `/terms` answer **307 -> `/in/privacy` / `/in/terms`**. The 77 CMS posts live on bare URLs and their nav/footer links to bare `/about`, `/blog`, `/contact`, `/demo`, `/docs`, `/features...`, which also 307 to `/in/...` for a default UA (79 pages carry these). So the CMS template uses unprefixed links; `/in` pages use `/in/...` links (1,345 prefixed links). Fix at template level so every internal link points to its final market URL.

### F4 (medium) Noindex page linked sitewide
`/customers` is `noindex, follow` yet linked from every page's nav/footer; harmless for ranking but it sends crawl and users to an illustrative page. Keep link only if the page serves a purpose (Loop 23: separate real vs illustrative first).

### F5 (low) Wrong-market links
No `/in` page body links to another market's content page (only the switcher). Switcher is correct; ensure the switcher keeps the same path (it does). The risk is rather that bare-URL pages (CMS posts) have no market context.

## 3. Link plan (exact source -> destination, anchor, purpose)

Rule: market-prefixed URLs only (`/in/...`, `/us/...` per market); descriptive anchors; maximum 2-3 contextual links per section; never link to a not-yet-live page. Items marked (live-check) apply after the 5 new guides deploy.

### Articles -> product pages
| Source | Destination | Anchor | Purpose |
|---|---|---|---|
| blog/why-field-visits-fall-out-of-the-crm | features/photos-notes | "photos and notes captured at the visit" | evidence capture |
| same | features/follow-ups | "follow-ups with an owner and a due date" | next action |
| same | integrations | "alongside your existing CRM" | CRM fit |
| blog/gps-check-in-without-surveillance | features/gps-check-in | "GPS check-in" | feature definition |
| same | security | "who can see location data" | trust |
| same | guides/rolling-out-gps-check-in | "rolling out GPS check-in with your team" | implementation |
| blog/offline-first-field-apps | features/offline-mode | "offline mode" | feature definition |
| guides/planning-a-field-day | features/visit-planning | "daily visit plans" | feature |
| same | features/route-planning | "visits on a map with directions" | feature (Professional) |
| guides/rolling-out-gps-check-in | features/gps-check-in | "GPS check-in" | feature |
| same | docs | "check-in rules in the setup guide" | setup |
| guides/writing-useful-visit-notes | features/photos-notes | "visit notes and photos" | feature |
| guides/daily-sales-report-dsr (live-check) | features/reports | "reports that build from the day's visits" | feature |
| same | features/manager-dashboard | "live manager dashboard" | feature |
| guides/beat-plan, permanent-journey-plan-pjp, primary-vs-secondary-sales (live-check) | teams/distribution | "Hemmiles for distribution teams" | solution parent |
| guides/beat-plan (live-check) | features/visit-planning | "bulk assignment by territory" | feature |
| guides/field-sales-vs-inside-sales (live-check) | teams/field-sales | "Hemmiles for field sales teams" | solution parent |

### Product pages -> articles
| Source | Destination | Anchor | Purpose |
|---|---|---|---|
| features/gps-check-in | blog/gps-check-in-without-surveillance | "GPS check-in without surveillance" | principles |
| features/gps-check-in | guides/rolling-out-gps-check-in | "rolling out GPS check-in" | implementation |
| features/offline-mode | blog/offline-first-field-apps | "why field apps have to work offline" | evaluation |
| features/visit-planning | guides/planning-a-field-day | "planning a field day" | procedure + template |
| features/photos-notes | guides/writing-useful-visit-notes | "writing visit notes someone else can use" | template |
| features/follow-ups | blog/why-field-visits-fall-out-of-the-crm | "why field visits fall out of the CRM" | diagnosis |
| features/reports (live-check) | guides/daily-sales-report-dsr | "daily sales report (DSR) guide" | template |
| teams/distribution (live-check) | guides/beat-plan, guides/permanent-journey-plan-pjp, guides/primary-vs-secondary-sales | titles of the guides | cluster |
| teams/field-sales (live-check) | guides/field-sales-vs-inside-sales | "field sales vs inside sales" | context |
| teams/service | features/photos-notes (+ future service template) | "before-and-after photos and notes" | feature |

### Hub, product and trust pages
| Source | Destination | Anchor | Purpose |
|---|---|---|---|
| features index, teams index, how-it-works, teams/* (5 pages) | product | "product overview" | give `/in/product` real in-body inbound |
| pricing (CRM connection row) | integrations | "how CRM connection works" | plan clarity |
| pricing (location controls row) | security | "location data controls" | trust |
| teams/field-sales, teams/service | integrations | "works with your CRM" | CRM fit |
| security | features/gps-check-in, blog gps | descriptive | proof |
| /blog (hub) | pin the three field posts at the top; link `guides` hub | "Field operations" section heading | fix depth (F2) |
| docs | each relevant guide | "rolling out GPS check-in", "planning a field day" | setup journey |
| resources | guides, blog, templates (when live) | descriptive | hub |

### Template-level fixes (single tickets)
1. Footer/nav `privacy`, `terms`, `customers`, `careers` links generated with the market prefix (remove 307 hop on 113 pages).
2. CMS post template uses the same prefixed nav/footer as other pages (or the posts move behind the hold decision in Loop 13).
3. Add a "related product pages" component to article templates and a "related guides" component to feature/team templates (ends the silo).
4. Reading-time label from actual text (Loop 13).
5. `/customers` nav link only after the real/illustrative split (Loop 23).

## 4. Metrics (after deploy)
In-body inbound for `/in/product`, `/in/integrations`, `/in/security` >= 5 each; every article >= 2 outbound product links; every feature/team page >= 1 outbound article link; 0 internal links that redirect; click depth of the three field posts <= 2 from `/blog`.

## 5. Decisions
1. Implement the plan as template components, not hand edits per page (fewest tickets).
2. Do not link to the 5 new guides until they are live.
3. No new pages are required for linking.

## 6. Open questions
- Q60: Does the CMS blog use a separate template/repo, and who can change it? (affects F3 and the Loop 13 hold)

## 7. Next
Loop 26: AI visibility - repeatable buyer questions, cited sources, referrals and available reporting; baseline and factual-error register.
