# Loop 27 - Trust and authority

Retrieved: 2026-10-21. Sources: live `/in/privacy`, `/in/terms`, `/in/about`, `/in/contact`, `/in/security`, footer text; DNS lookups via public resolver (Google DNS 8.8.8.8) for `hemmiles.com` (MX, TXT, `_dmarc`, NS); Ahrefs backlinks stats (50 units; estimates). Status: **researched**. Company, legal and security facts below are what the site/DNS shows; the programme does not invent legal identity, retention periods or contract terms.

## 1. Findings

### F1 (critical) The published support/security email address cannot receive mail
`hello@hemmiles.com` is the contact address on the site (contact page, JSON-LD, `llms.txt`, privacy placeholder, security page "Need a security questionnaire completed?"). DNS on 2026-10-21 via Google public DNS: **no MX record** (the MX query returns only the zone SOA), **no SPF**, **no DMARC** (`_dmarc.hemmiles.com` does not exist). The only TXT record is a `google-site-verification` token. Name servers are Cloudflare. Unless mail is routed by a method not visible in public DNS (unlikely; confirm in the DNS/mail dashboard), messages to `hello@hemmiles.com` bounce, so the contact page's "one team answers every market by email" and security-questionnaire route currently fail. The contact **form** and demo/callback forms save to the CRM (Loop 1), so leads can still arrive, but anyone who emails directly is lost. Fix = choose the mailbox provider first, then publish MX + SPF + DKIM + DMARC; do not add a second mail path on top of an existing one (Q63).

### F2 (high) Privacy and Terms are unfinished templates (confirms Loops 3, 7)
- **Privacy** (905 words): 6 unfilled placeholders - company legal name, registered address and contact details; sub-processor categories; retention periods for enquiries and customer data; rights under applicable law and how to exercise them; contact email; effective date.
- **Terms** (445 words): 7 placeholders - company legal name; order form / master agreement precedence; pricing, billing and renewal terms; warranties, limitations of liability and indemnities; term, termination and data export on exit; jurisdiction; contact email.
Both are `noindex, follow` and `/privacy`, `/terms` redirect to `/in/...` (Loop 3). A B2B buyer (and a UK/EU/AU/SG buyer) cannot complete diligence. **Owner task, legal input needed;** research only lists the fields.

### F3 (high) No identifiable company
The About page describes beliefs ("one product and one team") with no company name, location, founders, year or registration. Footer: "© 2026 Hemmiles". Contact page: "We have no office or phone line in India - one team answers every market by email." No legal entity is stated anywhere I read. Prospects checking "who is behind this?" find nothing. Needs the legal entity name and a statement the owner is comfortable publishing (Q64).

### F4 (medium) Security evidence is thin but honest
Security page: encryption mentioned (3 times), role-based access, audit trail, consent text; explicitly "makes no claim about where data is stored"; offers questionnaires. **Absent:** certifications (SOC/ISO), GDPR/DPDP statements, sub-processor list, DPA, backup/uptime/status page, penetration-test statement, incident process, hosting region. Competitors BeatRoute and Lystloc display SOC/ISO badges (Loop 20). Do not claim any until true.

### F5 (medium) No proof of use
No real customers, logos, reviews, case studies, or press (illustrative profiles only, Loop 23). Changelog page is a placeholder (`CHANGELOG_IS_PLACEHOLDER = true`, noindex): sample entries do not signal an active product.

### F6 (medium) Authority is effectively zero
Ahrefs (2026-10-20): **2 live backlinks from 2 referring domains**, DR 0 (Loop 2). No AI-search citations (Loop 26).

### F7 (positive/lead) A Google site-verification token exists
The TXT record `google-site-verification=...` means someone has verified (or started verifying) the domain with Google, probably in Search Console. Find which Google account owns the property (Q5 refined): GSC access may already exist without new setup.

### F8 (low) Cookie/consent
Footer has "Cookie settings". Consent behaviour and the analytics tag were not tested (browser pass pending; Loop 28).

## 2. Trust backlog (ordered)

| # | Item | Why | Owner | Effort | Depends |
|---|---|---|---|---|---|
| T1 | Fix email: pick mailbox provider; publish MX, SPF, DKIM, DMARC for hemmiles.com; send/receive test; keep `hello@` | F1 - leads and diligence lost | founder/IT | low | decision Q63 |
| T2 | Complete Privacy: legal name/address, sub-processors, retention, rights, date, contact | F2 | founder + counsel | medium | Q64, hosting facts (Q20) |
| T3 | Complete Terms: entity, order form precedence, billing/renewal, liability, term/exit/export, jurisdiction | F2 | founder + counsel | medium | T2 |
| T4 | Publish company identity on About/footer (legal entity, location or region of operation, contact) | F3 | founder | low | Q64 |
| T5 | Security fact sheet (hosting region, encryption in transit/at rest, access roles, audit trail, sub-processors, DPA availability, backups, incident contact) on `/security` | F4 | founder + engineering | medium | Q20, Q50 |
| T6 | Verify Search Console via the existing token; add Bing Webmaster Tools | F7; prerequisite for Loops 24-26 | founder | low | Q5 |
| T7 | Real proof: first approved case study and testimonial (Loop 23 protocol) | F5 | founder + sales | medium | customer |
| T8 | Changelog: publish real release notes or remove the page and nav link until real | F5 | product | low | release history |
| T9 | Author/reviewer block on articles (named person + role + reviewed date) | E-E-A-T (Loop 13) | founder | low | Q33 |
| T10 | Cookie banner and analytics consent audit in a browser | F8 | dev | low | - |

## 3. Legitimate authority opportunities (no purchased links, no fake reviews)
Prerequisite for any outreach: T1 (email), T4 (identity) and T2/T3 (legal pages), otherwise outreach points at an untrustworthy site.

| Rank | Opportunity | Basis | Preconditions |
|---|---|---|---|
| 1 | Claim/create vendor profiles on software directories (the GetApp/Capterra/FitGap-type sites that AI and search results cite, Loop 26) with accurate claim-ledger wording | where answers cite from | T1, T4, screenshots (Q31) |
| 2 | App-store listings (if the apps are not listed) | ranking surface for service queries (Loop 21) | Q52 |
| 3 | CRM marketplace listings for connectors that pass the Loop 18 tests | authoritative referral per CRM | gate G18 |
| 4 | Publish the templates and the capacity calculator as linkable resources (Loop 22) and pitch them to relevant industry blogs, associations and newsletters (field sales, FMCG distribution, pharma distribution in India; field service in US/UK) | utility earns links | assets built |
| 5 | Original, defensible data piece (e.g. anonymised aggregate benchmarks from consenting customers, or a survey with stated method) | only if real data exists | customers; legal consent |
| 6 | Partner pages: implementation partners and CRM consultancies list Hemmiles; partner page content with real terms | partners page exists, thin (Loop 12) | Q32 |
| 7 | Thoughtful, disclosed participation in relevant communities (e.g. sales-ops forums) answering questions | Reddit thread ranks for head term (Loop 5) | disclose affiliation; follow rules |
| 8 | Company profile on LinkedIn and a YouTube channel for the three videos (Loop 23) | brand entity signals | T4, videos |
Do not: buy links, run link exchanges, post unverified reviews, claim certifications, or use competitor names in deceptive ways.

## 4. Decisions
1. T1 (email) is a P0 owner action, ahead of every acquisition effort; it is the cheapest high-impact fix in the whole programme.
2. Legal pages and company identity are P0 owner tasks; research supplies the field list only.
3. No outreach or listing work starts before T1, T4 and T2/T3.
4. Token in DNS suggests GSC may already be verified; check before creating new properties.

## 5. Open questions
- Q63: Which mailbox provider is intended for hemmiles.com (Google Workspace, Zoho, other, or Cloudflare Email Routing)? Is `hello@hemmiles.com` receiving mail today by some route not visible publicly?
- Q64: What is the legal entity name and what company facts may be published (registered office, jurisdiction, founders)?

## 6. Next
Loop 28: demo, trial and activation - successful and failed journeys, setup, attribution, ownership, first value; conversion-friction report and activation experiments.
