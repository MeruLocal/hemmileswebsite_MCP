# Plan: paginate `hemmiles_list_pages` and `hemmiles_list_resources`

- **Severity:** P2
- **Effort:** S

## Finding

- `hemmiles_list_pages` (`src/tools/pages.ts:79-107`) and `hemmiles_list_resources` (`src/tools/resources.ts:70-95`) return every matching page in one response:
  - `structured = { total: pages.length, count: pages.length, … }` (`pages.ts:97`, `resources.ts:87`)
  - no `limit`/`offset`
- `hemmiles_search_site` already paginates (`limitSchema`/`offsetSchema` from `src/schemas/product.js`, with `has_more`/`next_offset`), so the tools are inconsistent.
- The sitemap index lists ~31 canonical pages today (README "Verified site findings"). It is small now, but it grows with every blog post and guide, and the 25,000-character cap (`CHARACTER_LIMIT`) silently truncates the markdown output.

Not checked: the current live sitemap size (sandbox egress is blocked).

## Proposed fix

- Add `limit: limitSchema` and `offset: offsetSchema` to `ListPagesInput` and `ListResourcesInput`. Same defaults as search: limit 1–50, default 20.
  - Default 20 means a no-argument `list_pages` now returns the first page plus `has_more` instead of all ~31 pages. Agents follow `next_offset`.
  - Alternative: default 50, so today's list fits in one page. **Decision below.**
- After filtering and sorting, slice, and return `{ total, count, offset, has_more, next_offset?, … }`. Extend the `outputSchema` to match.
- Extract a small `paginate(rows, offset, limit)` helper into `src/tools/helpers.ts`, and reuse it in search.
- Markdown: "Showing X–Y of N. Use offset=… for more."
- Update the tool descriptions and README.

## Tests to add

`tests/pagination.test.ts`, using `InMemoryTransport` + a stub sitemap with 45 pages:
- default returns 20, `has_more: true`, `next_offset: 20`
- `offset: 40` returns 5 and `has_more: false`
- `sections` still lists all sections
- `paginate()` unit tests: bounds, empty input, offset past the end

## Risks / decisions

- **Decision:** default limit 20 (consistent with search) or 50 (no behaviour change for today's ~31 pages).
