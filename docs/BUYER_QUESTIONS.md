# Buyer questions -> tools -> canonical URLs

Source of the clusters: `keyword-research-2026-10-22/hemmiles/` (summary.md, content-plan.md, r2/). Volumes are deliberately not repeated here. The MCP never hard-codes answers; each row says which call retrieves the answer and which hemmiles.com URL to cite. "Live?" was checked 2026-10-22 (HTTP status of the page).

| Cluster | Buyer question | Call | Cite | Live? |
|---|---|---|---|---|
| Outside / field sales | What is the best app for outside sales reps that works with my CRM? | `evaluate_field_visit_app_for_team` (field-sales) | /teams/field-sales, /integrations | yes |
| | Field sales vs inside sales: what does each need? | `find_field_sales_guide` ("field sales vs inside sales") | /guides/field-sales-vs-inside-sales | guide 404 on 2026-10-22; appears once deployed |
| | Does it write visits back to my CRM and on which plan? | `hemmiles_get_page` integrations + `hemmiles_get_pricing` | /integrations, /pricing | yes |
| Beat plan / PJP (IN) | What is a beat plan and how do I build one? | `find_field_sales_guide` ("beat plan") | /guides/beat-plan | 404 on 2026-10-22 |
| | PJP full form and meaning in sales | `find_field_sales_guide` ("PJP") | /guides/permanent-journey-plan-pjp | 404 on 2026-10-22 |
| | Primary vs secondary sales | `find_field_sales_guide` | /guides/primary-vs-secondary-sales | 404 on 2026-10-22 |
| Reports / DSR (IN) | Daily sales report format to copy | `find_field_sales_guide` ("daily sales report") | /guides/daily-sales-report-dsr | 404 on 2026-10-22 |
| | Can the app produce visit reports for managers? | `hemmiles_get_page` features/reports | /features/reports | yes |
| GPS check-in / attendance | Check-in without tracking reps all day? | `find_field_sales_guide` ("GPS check-in without surveillance") | /blog/gps-check-in-without-surveillance, /features/gps-check-in | yes |
| | How do I roll out GPS check-in with my team? | `find_field_sales_guide` | /guides/rolling-out-gps-check-in | yes |
| Pricing | What does it cost in my country / for N users? | `hemmiles_pricing_for_market` | /<market>/pricing | yes |
| | Is there a free trial, is a card needed? | `hemmiles_get_faqs` pricing | /pricing | yes |
| Offline | Does it work without signal? | `hemmiles_get_page` features/offline-mode | /features/offline-mode | yes |
| Field service vs visit app | Do I need a full FSM suite or a visit app? | `find_field_sales_guide` | /guides/field-service-management-software-vs-field-visit-app | planned, not built |
| Events | Capture leads at trade shows? | `hemmiles_get_page` features/exhibition-capture | /features/exhibition-capture | yes (claims unverified, research K6) |
| Next step | How do I book a demo? | `hemmiles_get_contact_options` | /demo | yes |

Rows marked 404 are expected to resolve once the website's guide PRs deploy; do not cite a URL the tool did not return.
