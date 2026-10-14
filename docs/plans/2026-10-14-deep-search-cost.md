# Plan: bound the cost of deep search and make cache TTL 0 really disable caching

- **Severity:** P1
- **Effort:** S–M

## Finding

1. **Deep search is the default and is slow.**
   - `hemmiles_search_site` defaults to `deep: true` (`src/tools/search.ts:41`).
   - With `deep`, it fetches up to `MAX_SEARCH_FETCH = 24` pages (`src/constants.ts:96`, used at `search.ts:131`), one after another in a `for … await` loop (`search.ts:144-153`).
   - Every outbound fetch goes through `HemmilesClient.acquireSlot()` (`src/services/hemmiles-client.ts:69`, called at `:128`). It spaces requests by `HEMMILES_MIN_REQUEST_INTERVAL_MS` (default 600 ms) **process-wide**.
   - A cold deep search therefore takes at least 24 × 600 ms ≈ **14.4 s** of spacing alone, before response time, retries/backoff, and the sitemap index + child sitemaps.
   - Because the gate is shared, one deep search also delays every other client's tool calls on the same process.
   - This lower bound is derived from the code, not measured: sandbox egress to hemmiles.com is blocked, so real latency could not be timed.
2. **TTL 0 does not disable the sitemap cache.**
   - `src/server.ts:20` passes `config.cacheTtlMs || 300000` to `SitemapService`.
   - `HEMMILES_CACHE_TTL_SECONDS=0` (documented as "0 disables caching" in `.env.example` and README) yields `0 || 300000` → a 5-minute sitemap cache.
   - The page cache in `HemmilesClient` does honour 0 (`hemmiles-client.ts:84,95`), so the two caches disagree.

Not checked: real end-to-end latency against hemmiles.com, and how often clients actually call deep search.

## Proposed fix

- **Smaller deep budget:**
  - Add `DEFAULT_DEEP_FETCH = 8` in `constants.ts`.
  - Add an optional input `max_pages` (1–24, default 8) to `hemmiles_search_site`. `MAX_SEARCH_FETCH = 24` stays the hard cap.
  - The slug pre-score already orders candidates, so the budget goes to the most promising pages first.
  - Mention the trade-off in the tool description.
- **Use the cache first:**
  - Add `HemmilesClient.peekCached(url)`, a read without network.
  - In the search loop, pages already cached are scored for free and do not count against the fetch budget.
  - Only uncached pages consume the budget.
- **Optional (follow-up, needs decision):** after startup, a background warm-up that fetches the sitemap plus the `KNOWN_PAGES` set at the normal spacing and refreshes at TTL. Then most deep searches are cache hits. Off by default (`HEMMILES_WARM_CACHE=1`) because it adds steady outbound traffic to hemmiles.com.
- **TTL fix:** `src/server.ts:20` → `new SitemapService(client, config.cacheTtlMs)`. In `SitemapService.getEntries`, skip storing when `ttlMs <= 0`, so the fallback cache uses `Math.min(ttl, 30000)` only when `ttl > 0`.

## Tests to add

`tests/search.test.ts`, with a stub client that counts `fetchHtml` calls and a stub sitemap with 30 pages:
- default deep search makes ≤ 8 fetches
- `max_pages: 24` makes ≤ 24
- pages pre-seeded in the cache are scored without counting toward the budget
- results are still ranked and paginated as before

`tests/sitemap.test.ts`, with TTL 0: two `getEntries()` calls fetch the sitemap twice; with TTL > 0, once.

## Risks / decisions

- A lower default budget can miss a body-text match on a low slug-score page. Callers can raise `max_pages`.
- **Decision (founder):** whether to enable cache warm-up in production (extra steady load on hemmiles.com, much faster searches).
