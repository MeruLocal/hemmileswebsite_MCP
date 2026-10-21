# Loop 28 - Demo, trial and activation

Retrieved: 2026-10-21. Sources: `MeruLocal/hemmileswebsite` origin/main (`docs/analytics.md`, `lib/analytics.ts`, `lib/server/handle-lead.ts`, `lib/server/lead-sinks.ts`, `lib/lead-attribution.ts`, `lib/leads.ts`, `lib/submit-lead.ts`), live HTML of `/in/demo` and `/in/pricing`, HTTP status of `app.hemmiles.com`. **No form was submitted and no account was created.** In-app behaviour (sign-up, setup, activation) is not visible from the site repo or the public site. Status: **researched (static)**.

## 1. Corrections to earlier loops (new evidence)
- **GA4 and Clarity are live in production.** Live `/in/demo` HTML contains GA4 measurement ID `G-95536GJEJ5`, the gtag script and a Clarity snippet (project `yugnoc43y8`); `docs/analytics.md` on main documents them. Loops 1-2 and 24 treated GA4/Clarity as unverified and the local-only "GA4 tracking" commit as a concern: the live site already carries analytics from main. **What remains unknown is who has access to the GA4 property and Clarity project** (Q6 narrowed to access, not existence).
- **The demo form already captures the prospect's CRM.** Live form fields: name, email, company, phone, country, teamType, teamSize, crm, website, message. Loop 19's Q48 is answered; add a "which CRM" field is not needed, but reporting on it is.

## 2. The conversion paths as built

| Step | Path A: self-serve trial | Path B: demo / contact / callback |
|---|---|---|
| Entry | "Start free trial" CTAs (pricing, home, nav) link to `https://app.hemmiles.com/signup` (live, 200) | Forms: `demo`, `contact`, `partner`, `popup`, `sales`, `callback`, `newsletter` (`lib/leads.ts`) |
| Tracking on the marketing site | `signup_click` (GA4, Clarity custom event), `cta_click`, `pricing_click`, `view_pricing`, `login_click` | `form_start`, `form_submit`, `generate_lead` (only when the API confirms delivery), `demo_click`, `contact_click` |
| What happens after | Sign-up occurs on the app domain; **not visible** from this site | Lead saved through the admin "door" (admin panel copy + CRM), with fallback direct sinks (CRM, admin table, webhook); one retry on 5xx/429 |
| Spam/abuse control | - | rate limit 6 submissions per 5 minutes per client; honeypot; instant-submit (<1 s) dropped quietly; body cap 24 KB |
| Attribution captured | - | first touch (landing page, referrer, UTM, click IDs gclid/fbclid/msclkid/li_fat_id, 90-day localStorage), last touch (session), page journey with time per page, timezone/language, GA client and session IDs, visitor country from CDN header, user agent |
| Qualification signals | - | company, team size, team type, CRM, free-mail detection (`isFreeMail`) in sink formatting |
Good practice already present: server-side delivery check before the conversion event; no field values sent to analytics (sanitizer drops values that look like emails/phones); consent mode v2 with opt-in for EEA/UK/Switzerland, Global Privacy Control respected, Clarity input masking on.

## 3. Friction and gap findings (static review; hypotheses where marked)
1. **Path A is a black box.** After `signup_click` the journey leaves the marketing domain. Unknown: sign-up fields, email verification, account creation event, first-run experience, trial-day-14 behaviour (Q30), any analytics on the app. Without these there is no trial or activation measurement. **Verify** whether GA cross-domain measurement is configured (the signup `href` is a plain URL; a linker parameter would be added at click time by gtag if configured); if not, trial sign-ups cannot be tied to the marketing session or campaign.
2. **Email deliverability affects both paths.** Any confirmation, verification or sales-reply email sent from `hemmiles.com` lacks SPF/DKIM/DMARC and has no MX for replies (Loop 27 F1). Verification emails may land in spam, and replies to `hello@` bounce.
3. **Setup effort vs a 14-day trial (hypothesis).** The public setup guide has six steps (import customers, add users/roles/territories, set visit types, configure check-in rules, invite reps, first-week review) and Starter/Professional require 3 users. A team that has not prepared customer data may not reach a completed visit inside 14 days. Needs trial-cohort data to confirm.
4. **Demo page content is short** (~190 words, one "What you'll see" list), 10 form fields; required ones are name, email and company (code); others optional. Copy states a 30-minute walkthrough "over a video call in English". Fine, but there is no sample of the output (no screenshot or video; Loop 23) and no statement of who attends or what to prepare.
5. **Lead follow-up ownership is not defined** in the public materials: who responds, within what time, and how a lead moves to qualified. Free-mail flag exists but no routing rule is visible.
6. **Callback and sales forms exist but the page set was not walked:** the popup/sales/callback surfaces were not triggered. Check their copy and consent text in a browser pass.
7. **Attribution is strong for forms, absent for trials** (see 1).
8. **Consent:** analytics storage is denied by default in the EEA/UK/Switzerland and granted elsewhere; GPC counts as denied. Expect undercounting of UK/EU sessions; GA cookieless pings model some. Document this when reporting UK results.

## 4. Metric and event definitions (shared with Loops 2, 24, 29, 30)

| Metric | Definition | Source today |
|---|---|---|
| Qualified organic visit | Session from organic search landing on product/feature/team/guide/pricing page, non-brand query | GA4 + GSC (access pending) |
| Template/calculator use | download or completion event (Loop 22) | to build (no events yet) |
| Demo requested | `generate_lead` with `form_name` = demo (delivered) | GA4 live; CRM record |
| Qualified demo | demo lead with company, team size >= 3, non-free-mail email, plus a stated CRM or a fit teamType | CRM fields (exist) |
| Demo attended | meeting held (calendar/call record) | internal; not in site |
| Trial created | account created on app domain | app data (not visible) |
| Activated team (proposal, calibrate with first cohort) | within 14 days of sign-up: >= 3 users invited; customers loaded; >= 5 completed visits with evidence (photo or note and outcome) by >= 2 reps; >= 1 manager review; >= 1 follow-up with owner and due date; for CRM-connected teams, verified write-back (Loop 18 T6) | in-app events (to instrument) |
| Retained | active reps in week 4 and week 8 (>= 1 completed visit) | in-app |
| Paid conversion | first paid invoice | billing |
| Onboarding effort | hours of founder/support time per account | internal log |
The activation thresholds above are **proposals** drawn from the brief's definition; they carry no benchmark claim and should be tested against whether they predict continued use.
Required in-app events (for the product team): account_created, user_invited, customers_imported(count), visit_assigned, first_checkin, visit_completed(with evidence flag), manager_review, followup_created(with owner), crm_writeback_verified, and week-N active users.

## 5. Activation experiments (to run once instrumentation exists; no effect sizes assumed)
1. **Sample-data workspace:** pre-load five neutral sample customers so a rep can complete a first test visit in minutes (measure time to first completed visit).
2. **"First visit in 15 minutes" setup path:** a single guided path replacing the six-step guide for trials.
3. **CRM question at sign-up:** if absent in Path A, ask which CRM the team uses (parity with the demo form).
4. **Milestone email nudges** (day 1, 3, 7) keyed to missing milestones - only after SPF/DKIM/DMARC exist.
5. **Pilot offer:** pricing already mentions pilots; define a pilot with success criteria (3-10 reps, one territory, 4 weeks) and measure conversion to paid.
6. **Demo follow-up standard:** response time target and next-step template; track time to first response.
7. **Cross-domain measurement** for `app.hemmiles.com` so campaigns tie to trials.

## 6. Decisions
1. Use section 4 as the single metric glossary for the roadmap.
2. Instrumentation of the app (events in section 4) and cross-domain measurement are prerequisites for any activation claim; they belong in the Loop 29 backlog as product tickets.
3. Pre-requisite owner actions for conversion: email DNS (Loop 27), demo workspace/video (Loop 23), sales follow-up ownership.
4. No forms to be submitted by research; a test lead can be submitted by the owner when ready, to validate the pipeline end to end.

## 7. Open questions
- Q6 (narrowed): Who owns the GA4 property `G-95536GJEJ5` and Clarity project `yugnoc43y8`; can the research be given read access?
- Q65: What happens after "Start free trial": sign-up fields, verification email, first-run flow, trial expiry, and does the app have analytics/events?
- Q66: Who responds to demo/contact leads, within what time, and what makes a lead "qualified"?
- Q67: Is GA cross-domain measurement configured between hemmiles.com and app.hemmiles.com?

## 8. Next
Loop 29: implementation tickets - consolidate all findings into an executable backlog with owners, dependencies, effort and acceptance criteria, merging template-level duplicates.
