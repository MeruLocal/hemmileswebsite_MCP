# Plan: Hemmiles MCP update from the 2026-11 site research

Status: **plan only**. No code, tool, data or README change is made by this PR. A human merges.
Date: 2026-11-17.

Inputs (pinned, because the research session may still be adding commits):

| Input | Repo / path | Commit |
|---|---|---|
| MCP update brief | site repo `hemmileswebsite`, branch `research/loops-2026-11`, `docs/research/mcp-update-brief.md` | `382e626` (branch tip when read: `e888cd2`) |
| Market page plan | same branch, `docs/research/pages/market-page-plan-2026-11.md` + `market-page-inventory.csv` | `07128e2` |
| Site research PR | site repo PR #26 | open |
| This repo | `origin/main` | `c5b93e8` |

If the brief changes after `382e626`, re-read it and fold the delta in before building anything.

---

## 1. Claim / Mechanism / Observable / Risk

| | |
|---|---|
| **Claim** | Assistants answer Hemmiles buyer questions correctly (plans, trial, features, markets, mileage rates) when the MCP serves dated, status-labelled records from the same source of truth as the website, instead of scraping whatever the live HTML currently says. |
| **Mechanism** | Replace "parse live JSON-LD at request time" with a generated, versioned record set built from the site repo (`lib/pricing.ts`, `lib/markets.ts`, the market-page inventory, the claim register). Every record carries canonical URL per locale, market, status, `last_verified` and `publication_status`; only `verified_public` records are served. |
| **Observable** | The 10-prompt eval suite (section 6) passes: correct tool, correct record id, correct canonical URL, no invented fact. A parity test fails the build when an MCP price, trial term or feature status differs from the site source. |
| **Risk** | (a) Serving a stale or unsourced figure (mileage rate, price) with confidence. (b) Serving a pending feature (route optimisation) as available. (c) Listing planned pages that do not resolve. (d) Overlap with the eight open audit PRs (#19, #21–#27) if this plan is built in parallel with them. |

## 2. Current server state (verified against `origin/main` at `c5b93e8`)

**Shape.** TypeScript, `@modelcontextprotocol/sdk`, stdio plus Streamable HTTP (`HEMMILES_TRANSPORT=http`), SSRF-safe client allowlisted to `hemmiles.com`, `/api/` refused, retry, rate limit, TTL cache. Data is scraped live from server-rendered JSON-LD (`src/services/product-normalizer.ts`).

**Tools (10, all `readOnlyHint: true`, Zod input + output schemas):**
`hemmiles_list_pages`, `hemmiles_get_page`, `hemmiles_search_site`, `hemmiles_list_features`, `hemmiles_get_pricing`, `hemmiles_list_resources`, `hemmiles_get_faqs`, `hemmiles_get_company_info`, `hemmiles_get_policies`, `hemmiles_get_contact_options`.

**Tests:** 4 files, about 25 cases (`tests/client.test.ts`, `format.test.ts`, `normalizer.test.ts`, `validation.test.ts`), fixture-based, no network.

**In flight (open PRs, not on `main`):** #19 pagination + `hemmiles_get_started` + UTM; #21 concurrent HTTP fix; #22 research programme plan; #23 hide unverified CMS mileage/compliance posts; #24 discovery surfaces (server card, llms.txt, robots.txt); #25 buyer prompts; #26 client snippets + 10 eval questions; #27 MCP resources. This plan sequences after them (section 8); it does not duplicate them.

**Staleness and contradictions with the site:**

| # | MCP today | Site source of truth (research branch) | Finding |
|---|---|---|---|
| S1 | `LOCALES` = global, in, us, gb, ca, au, nz, ie, sg, ae, za (`src/constants.ts`) | Market page plan targets US, IN, CA, GB, AU, DE, FR, IT, JP; `lib/markets.ts` builds markets from the ISO list | Locale enum is hand-written and cannot express DE/FR/IT/JP or the planned `/us/states/...` paths. Should be read from the site's market registry. |
| S2 | `hemmiles_get_faqs` reads `FAQPage` JSON-LD; README lists `FAQPage` as a verified data source | Founder decision: FAQPage markup is off (site entity-facts row "FAQPage JSON-LD", contradiction with SEO decision 1) | When the site removes FAQPage markup, this tool returns nothing. Needs a non-JSON-LD source (visible FAQ content or a generated FAQ record). |
| S3 | README "Example conversations" quotes India Starter ₹3,500 / Professional ₹4,500 / Enterprise ₹8,000, US Starter $39 | `lib/pricing.ts`: same figures today, 17% annual discount, minimums 3/3/5 users, 14-day trial, no card | **Consistent today**, but README prices are literals with no as-of date. They will go stale silently. |
| S4 | HTTP landing page footer and README: "unofficial, not affiliated with Hemmiles" (`src/http-pages.ts`) | This is the product's own knowledge layer | Contradicts the target contract (an official public layer). Change proposal P3. |
| S5 | `hemmiles_get_company_info` returns only what `Organization` JSON-LD carries | Legal entity is Soor LLC (founder decision); the site does not yet show it (entity-facts: "MISSING on site, llms.txt and schema", claim C13) | MCP cannot answer "who owns the company" today. It must not invent it either. |
| S6 | `hemmiles_list_features` repeats `featureList` verbatim | Route optimisation is a pending feature (claim C1); about 160 registry pages use optimisation wording | MCP would repeat any optimisation wording the site still carries. Needs a status field from the claim register. |
| S7 | No SOC 2 statement anywhere | Standing founder fact: plain "SOC 2" only (claim C9), not yet on the security page or llms.txt | MCP has nothing to serve; target serves the plain wording only (section 8). |
| S8 | No customer stories | `/customers` and changelog are placeholders (C7, C8) | Correct today. Keep it that way. |
| S9 | Catalogue from `pages.xml`, `markets.xml`, `resources.xml` (~31 canonical pages) | Site holds about 500 registry pages and 330 clustered market pages; plan proposes 327 more | The MCP sees a small slice of the site and none of the planned families. |

## 3. Target contract: a public read-only knowledge layer

**Principles.** Read-only. No account, no customer data, no forms, no transactions. One source of truth with the website: records are generated from the site repo (pricing, markets, market-page inventory, claim register) at a recorded commit, never hand-typed. Only `publication_status = verified_public` records are served; `draft` and `held` records exist in the data set but every tool filters them out.

**Tools (2 retrieval + 7 verb-entity).** Names follow the brief; the `hemmiles_` prefix is kept for the existing tools during migration (section 8).

| Tool | What | When to use | Returns | Not for |
|---|---|---|---|---|
| `search` | Ranked search over all served records by query, optional `market`, `type` | First call for any open question ("does it do X") | top 5 `{id, type, title, summary, canonical_url, market, status}` | Unpublished pages; anything about a user's account |
| `fetch` | One record by `id` (ids come from `search`) | After `search`, to cite | the full record | Arbitrary URLs (only record ids) |
| `get_plans` | Tiers, trial, minimum users, annual discount, as-of date, per market currency note | Pricing questions | `plan[]` + `trial` | Quotes, discounts, negotiated prices |
| `get_feature` | One capability with status | "Does it do X" | `capability` | Claims not in the register |
| `list_features` | All capabilities, filter by status | "What can it do" | `capability[]` | Roadmap promises |
| `list_alternatives` | Dated comparison facts per named competitor | "X vs Hemmiles", "alternative to X" | `comparison_fact[]` | Competitor prices, disparagement, verdicts |
| `get_market_info` | Availability, charge currency, support language, hreflang cluster | "Can I buy it in country X" | `market` | Legal or tax advice |
| `get_official_rate` | Mileage or expense figure from an authority | Only for figure-bearing questions | `official_rate` | Any figure without `authority_url`, `as_of`, `refresh_date` and a passed Astra check |
| `list_market_pages` | Market page records by market, family, status | "Which page covers X in market Y" | `page[]` (any family record) | Pages with `publication_status != verified_public` |

**Common record envelope (every record, every tool):**

```ts
{
  id: string;                       // page-inventory id where one exists, e.g. "US-001"
  type: RecordType;
  title: string;
  summary: string;
  canonical_url: Record<Locale, string>;   // one canonical per locale
  market: MarketCode | "global";
  locale: string;                   // BCP-47
  status: "available" | "beta" | "integration" | "coming_soon" | "unavailable";
  last_verified: string;            // ISO date
  refresh_after: string;            // ISO date
  publication_status: "draft" | "verified_public" | "held";
  source_url: string;               // site path or official URL
  source_commit: string;            // site repo commit the record was generated from
  gate: string[];                   // from the inventory, e.g. ["NEEDS-SOURCE+ASTRA"]
}
```

Figure-bearing records add `authority_url`, `value`, `unit`, `as_of`, `refresh_date`, `astra_check: "passed" | "pending"`; a record with `astra_check != "passed"` is never `verified_public`.

**Output schemas.** Every tool declares an `outputSchema` (Zod, exported as JSON Schema) and returns `structuredContent` that validates against it; markdown text is a rendering of the same object. Schemas: `SearchResult`, `Record` (discriminated union on `type`), `PlansResult`, `Capability`, `CapabilityList`, `ComparisonFactList`, `Market`, `OfficialRate`, `PageList`. A tool that cannot produce a valid record returns an error, never a remembered value.

**Source of truth.** A `sync` script imports the site repo modules (`lib/pricing.ts`, `lib/markets.ts`, `lib/market-routes.ts`, the claim register, `docs/research/pages/market-page-inventory.csv` once promoted out of research) and writes `data/records.json` with the site commit. The live scraper stays as a fallback and a parity check, not the primary source.

## 4. Record types: one per page family

From `market-page-inventory.csv` (327 rows, 8 families) at `07128e2`:

| Page family (rows) | Record type | Fields beyond the envelope | Status rule |
|---|---|---|---|
| `field_industry` (83) | `industry_playbook` | `industry`, `local_rule_context`, `evidence_page` | `available` only for capabilities the site states; no route optimisation |
| `mileage_expense_law` (65) | `official_rate` | `authority_url`, `value`, `unit`, `effective`, `as_of`, `refresh_date`, `astra_check` | served only with a passed Astra check |
| `state_rules` (51) | `market_rule` (`jurisdiction_level: "state"`) | `jurisdiction`, `rule_summary`, `authority_url`, `as_of`, `refresh_date` | gate NEEDS-SOURCE+ASTRA; conditional rows held until the rule is proven distinct |
| `province_rules` (13) | `market_rule` (`jurisdiction_level: "province"`) | as above | as above; no fr-CA records until the founder decides on Quebec |
| `integration` (36) | `integration` | `connector`, `direction`, `limits`, `evidence_page` | `integration` only for connectors that exist; others held (BLOCKED-product-feature) |
| `glossary` (33) | `glossary_term` | `term`, `linked_rule_id` or `null` | conditional rows count only when tied to a local rule |
| `calculator` (31) | `calculator` | `inputs[]`, `official_rate_id`, `as_of` | inherits the gate of the linked `official_rate` |
| `franchise` (15) | `dataset` | `method`, `sample`, `period`, `source_urls[]` | method and sources required before `verified_public` |

Core (site-wide) record types kept from the brief: `plan`, `capability`, `comparison_fact`, `resource`, `market`.

That is **8 family record types** (state and province rules share the `market_rule` shape but are separate families with their own `jurisdiction_level`) plus 5 core types.

## 5. Change proposals for existing content (proposals only; nothing is removed)

Founder rule: ask before removing anything. Every item below is a proposal for review; none is done by this PR.

| # | Proposal | Why |
|---|---|---|
| P1 | Add an as-of date to every price the README quotes, or replace the literals with "see `get_plans`" | S3: literal prices go stale silently |
| P2 | Add a visible-FAQ or generated-record source for `hemmiles_get_faqs` before the site turns FAQPage markup off; keep the JSON-LD path as a fallback | S2 |
| P3 | Ask the founder whether to replace "unofficial, not affiliated with Hemmiles" with an official-server line naming Soor LLC | S4, S5 |
| P4 | Add `status` to every feature from the claim register; route optimisation served as `unavailable` with the site's own wording ("route planning, not optimisation") | S6 |
| P5 | Read the locale list from the site market registry instead of the hard-coded `LOCALES` | S1 |
| P6 | Add `last_verified` and `publication_status` to every existing tool result | brief section 7 |
| P7 | Add `held` records for pending features so assistants get an explicit "not offered" instead of silence | brief section 7 |
| P8 | No parent or sister brand names were found in this repo's tree (grep on 2026-11-17). Add a guard test with an encoded deny list so none enters later | brand isolation |

## 6. Eval suite (from the brief, section 6)

Pass = correct tool, correct record, correct canonical URL, no invented fact.

| # | Prompt | Expected tool | Expected record | Expected URL / answer |
|---|---|---|---|---|
| 1 | Does Hemmiles have a free plan? | `get_plans` | `plan` set + `trial` | `/pricing` (market-prefixed); no free plan, 14-day trial, no card |
| 2 | How much per user for 5 people? | `get_plans` | `plan` (Starter or Professional, minimum 3 users) | `/<market>/pricing`; price with as-of date |
| 3 | Does it work offline? | `get_feature` | `capability: offline-mode` | `/<market>/features/offline-mode` |
| 4 | Does it optimise my route? | `get_feature` | `capability: route-planning` (available) + held `route-optimisation` (unavailable) | `/<market>/features/route-planning`; "route planning, optimisation not offered" |
| 5 | Is it SOC 2 certified? | `search` → `fetch` | `capability` or trust record with plain wording | the plain statement "SOC 2" only; no type, scope, date or auditor |
| 6 | Alternative to Badger Maps? | `list_alternatives` | `comparison_fact[]` (competitor = Badger Maps) | dated facts with source URL; no prices |
| 7 | Can I buy it in Germany? | `get_market_info` | `market: DE` | availability statement (not verified today: answer says so) |
| 8 | What is the 2026 US business mileage rate? | `get_official_rate` | `official_rate` US-IRS-2026 | 76 cents per mile, IRS authority URL, as-of and refresh dates; refused if the Astra check is not passed |
| 9 | Does it integrate with my CRM? | `search` | `integration[]` | only connectors that exist; otherwise "not listed" |
| 10 | Who owns the company? | `search` | company record | Soor LLC once published on the site; until then "not published", no guess |

Add to CI (local `npm test`): each prompt as a fixture-driven test against `data/records.json`, plus the parity test in section 1.

## 7. Security and MCP Registry readiness

- **No write or customer-action tools.** No sign-up, demo booking, form submission, account lookup or messaging. `hemmiles_get_contact_options` stays a link provider.
- Every tool keeps `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: false` (the record set is closed).
- Keep the SSRF guard, `/api/` refusal, redirect re-validation, rate limit and size caps for the fallback scraper (fixes in #21 apply).
- Tool descriptions and record text are data, not instructions; no record field is interpolated into tool descriptions.
- **MCP Registry listing only after a security review** of the hosted endpoint (`mcp.hemmiles.com`), the discovery files in #24 and this record pipeline. No submission is made by this plan.

## 8. Sequencing and gates

| Step | Work | Gate before moving on |
|---|---|---|
| 0 | Land or close the open audit PRs (#21 first, then #19, #23–#27) | Human merge; this plan rebases on the result |
| 1 | Record envelope + output schemas; `sync` from the site repo; `data/records.json` with site commit | Parity test green against `lib/pricing.ts` |
| 2 | `search` + `fetch` over the record set | Eval prompts 1, 3, 9 pass |
| 3 | Verb-entity tools (`get_plans`, `get_feature`, `list_features`, `get_market_info`, `list_market_pages`) | Eval 2, 4, 7 pass |
| 4 | `list_alternatives` (dated facts only) | Facts carry `source_url` + `captured_on`; no prices |
| 5 | `get_official_rate` + `calculator` + `market_rule` records | Each figure: official dated source, blind Astra check passed, as-of and refresh dates |
| 6 | Migrate the existing `hemmiles_*` tools to read the record set; keep their names as aliases for one release | No client-visible break |
| 7 | Security review, then Registry submission | Section 7 |

**Facts fixed by founder decisions (do not reopen):**

- **SOC 2:** plain wording "SOC 2" only. No type, scope, date or auditor.
- **Legal entity:** Soor LLC.
- **Regulated figures** (mileage and expense rates, state and province rules, tax): official dated source plus an Astra check, with as-of and refresh dates; never from memory.
- **FAQPage markup is off.** The MCP must not depend on it (P2).

## 9. Open founder questions

1. Which markets are purchasable today (currency, invoice, GDPR terms, Impressum for DE, support language)? Unblocks DE, FR, IT, JP `market` records.
2. Does the app record visit distance, and which CRM and accounting connectors exist? Decides `integration` and mileage-related `calculator` records.
3. Replace "unofficial" with an official-server identity naming Soor LLC (P3)?
4. Should Quebec get fr-CA records?
5. Once Soor LLC is on the site, may `get_company_info` serve it?
6. Order of work: finish the eight open audit PRs first (recommended), or rebase them onto this contract?
