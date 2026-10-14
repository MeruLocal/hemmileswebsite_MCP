# Plan: add `hemmiles_get_started` and UTM-tag own-site URLs

- **Severity:** P2 (conversion)
- **Effort:** M

## Finding

- No tool points an agent at the next step (trial, demo, pricing) in one call.
  - `hemmiles_get_contact_options` (`src/tools/store.ts:179-243`) already assembles `demoUrl`, `contactUrl` and `pricingUrl` with `buildUrl("demo"|"contact"|"pricing", locale)` (`store.ts:218-220`), plus the Organization email and sales contact point.
  - It is framed as a cart/checkout substitute, not a call to action.
- No URL the server returns carries attribution. Traffic from AI agents cannot be told apart in hemmiles.com analytics.
  - `buildUrl` (`src/utils/validation.ts:92`) builds bare URLs.
  - They are returned by `list_pages`, `get_page`, `search_site`, `list_resources`, `get_faqs`, `get_pricing`, `get_policies`, `get_company_info` (Organization `url` / contact-point URLs) and `get_contact_options`.
- **No signup / free-trial URL is known in the repo.** `KNOWN_PAGES` (`src/constants.ts:43-81`) has `demo`, `contact`, `pricing`, but no `signup`/`trial`. The pricing FAQ fixture mentions a 14-day trial, but no trial page path is known.

Not checked: whether hemmiles.com has a signup page (sandbox egress is blocked). Paths are not invented.

## Proposed fix

1. **UTM helper** `src/utils/utm.ts`:
   ```
   withUtm(url, toolName):
     parse URL; if host is not hemmiles.com (or a subdomain) -> return unchanged
     set utm_source=mcp, utm_medium=ai_agent, utm_campaign=<toolName> unless already present
     keep the existing query and #fragment
   ```
   - Apply it at the output edge of each tool to every own-site URL in `structuredContent` and markdown: page `url`s, `demoUrl`/`contactUrl`/`pricingUrl`/`salesContactUrl`, and company `url`.
   - Do **not** tag:
     - URLs used for fetching or caching
     - `path` fields
     - external URLs (e.g. the LinkedIn `sameAs`)
     - `mailto:`
   - `get_page` `links[]` (in-page links) stay untagged. They are page content, not a call to action.
2. **`hemmiles_get_started`** (`src/tools/store.ts`):
   - read-only, same annotations, `locale` + `response_format`
   - Reuse the contact-options logic: extract the shared part into `buildContactOptions(ctx, locale)`, used by both tools.
   - Returns: `{ demoUrl, contactUrl, pricingUrl, salesContactUrl?, email?, signupUrl: null, note, callToAction }`. Every URL is tagged with `utm_campaign=hemmiles_get_started`.
   - `note` says no self-serve signup URL is published, so it gives the demo and contact pages.
   - `callToAction` is one line, e.g. "Book a demo to see Hemmiles with your team's routes, or compare plans on the pricing page."
   - Add the tool to:
     - the server `instructions`
     - the `TOOLS` list in `src/http-pages.ts`
     - the README tool table

## Tests to add

- `tests/utm.test.ts`:
  - tags hemmiles.com URLs
  - preserves the existing query and fragment
  - does not double-tag
  - leaves external hosts and `mailto:` alone
- `tests/get-started.test.ts`, using `InMemoryTransport` + a stub client returning the pricing fixture HTML:
  - tool is listed with read-only annotations
  - returns demo/contact/pricing with UTM
  - `signupUrl` is null
- Update any tool-count assertions (10 → 11).

## Risks / decisions

- **Decision (founder):** confirm whether a signup/trial page exists and its path. Until then, get_started returns demo/contact/pricing only.
- UTM on canonical URLs may be repeated by AI assistants in answers. That is the intended attribution. Prices are untouched.
