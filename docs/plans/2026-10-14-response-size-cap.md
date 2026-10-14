# Plan: cap the size of upstream responses read from hemmiles.com

- **Severity:** P2
- **Effort:** S
- **Audit check:** skill §4 S2 (`X.ssrf_surface`, response size cap)

## Finding

The outbound client is otherwise well hardened. Checked clean on `main` (14fc7e9):
- `redirect: "manual"` and every hop re-validated (`src/services/hemmiles-client.ts:106,126-139`).
- https + host allowlist; measured on localhost: `hemmiles_get_page {path:"http://169.254.169.254/latest"}` → `INVALID_URL` "Only https is allowed"; `https://hemmiles.com.evil.example/x` → `INVALID_URL` "Host … is not allowed". No network call in either case.
- Timeout via `AbortController` (`:100-122`).

The gap: `const html = await res.text();` (`hemmiles-client.ts:155`) reads the whole body with no length guard, and caches it (`:177-179`) for the TTL. A misconfigured page, a huge sitemap or a hostile response on an allowlisted host (note `isAllowedHost` also accepts **any subdomain** of hemmiles.com, `src/utils/validation.ts:22-25`) is buffered fully in memory, per page, per cache entry.

Not checked: real page sizes on hemmiles.com (egress blocked).

## Proposed fix

- `HemmilesClient.fetchOnce`/`fetchFollowingRedirects`:
  - If `Content-Length` > `MAX_RESPONSE_BYTES` (new constant, 2 MB), throw `HemmilesError("HTTP_ERROR", "Response too large")` without reading.
  - Otherwise read `res.body` as a stream, counting bytes; abort the controller and throw the same error once the cap is crossed.
  - Accept only `text/html`, `application/xhtml+xml`, `application/xml`, `text/xml` content types; anything else → `HTTP_ERROR` "Unexpected content type".
- `validation.ts`: narrow `isAllowedHost` to `hemmiles.com` and `www.hemmiles.com` unless a subdomain is needed (decision below).

## Tests to add

`tests/client.test.ts` (extend), with `fetch` stubbed via a local `http` server on port 0 (the allowlist is bypassed only through an injected `fetch`, not by loosening it):
- `Content-Length: 3000000` → error, body never read.
- chunked 3 MB body without length → error after ~2 MB.
- `image/png` → error.
- `isAllowedHost("evil.hemmiles.com")` is false after the change.

## Risks / decisions

- **Decision (ops):** does any content live on a hemmiles.com subdomain (e.g. `docs.` or `help.`)? If yes, list it explicitly instead of allowing every subdomain.
- 2 MB is far above a normal marketing page; sitemaps for ~31 pages are a few KB.
