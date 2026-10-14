# Plan: harden the HTTP transport (Host/Origin, CORS, rate limit, body cap, HOST)

- **Severity:** P1
- **Effort:** M

## Finding

The `POST /mcp` handler (`src/index.ts:70-102`) has no request guards:

| Check | Evidence | Measured on `main` |
|---|---|---|
| Body size | `index.ts:77-79` buffers the whole body | 2 MB body → **200** |
| Host allowlist | none | `Host: evil.com` → **200** (DNS-rebinding exposure) |
| Origin allowlist | none | `Origin: https://evil.com` → **200** |
| CORS / preflight | `OPTIONS` falls through to the 404 branch (`index.ts:70`) | `OPTIONS /mcp` → **404**, no `Access-Control-*`; browser inspectors cannot connect |
| Rate limit | none | unlimited |
| Bind address | `httpServer.listen(config.port)` (`index.ts:105`); `Dockerfile:62` sets `HOST=0.0.0.0` but nothing reads it | `HOST` is ignored |

`audit-live-mcp.mjs` baseline: 3 fail · 4 warn · 13 pass, including WARN "manifest lacks Access-Control-Allow-Origin: *".

Not checked: the production proxy chain (Cloudflare → origin) and the Host header the container actually receives.

## Proposed fix

New `src/http-security.ts`, wired into the HTTP handler (after the per-request-server plan):

- **Config** (env, documented in README and `.env.example`):
  - `MCP_ALLOWED_HOSTS`: default `localhost,127.0.0.1,[::1],::1,mcp.hemmiles.com`
  - `MCP_ALLOWED_ORIGINS`: default `https://mcp.hemmiles.com`; loopback origins on any port are always allowed
  - `MCP_RATE_LIMIT_PER_MINUTE`: default 60, 0 = off
  - `TRUST_PROXY=1`: use the right-most `X-Forwarded-For` hop, else the socket address
  - body cap: 1 MB
- **Host/Origin check** before the body is read. Compare the hostname without the port. A missing Origin (agents, curl) is allowed. Failures get 403 with `-32000` and a generic message.
  - Why a custom check rather than the SDK's `allowedHosts` / `enableDnsRebindingProtection`: the SDK compares the raw Host header including the port, and only runs after the body has been read.
- **CORS** for allowed origins:
  - echo the origin, plus `Vary: Origin`
  - `Allow-Headers: Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID`
  - `Expose-Headers: Mcp-Session-Id, Mcp-Protocol-Version`
  - `OPTIONS` → 204
  - Public GET docs (`/`, `/health`, `/version`, `/.well-known/mcp.json`) send `Access-Control-Allow-Origin: *`.
- **Rate limit:** a fixed one-minute window per IP in a `Map`, pruned when it gets large. Over the limit: 429, `Retry-After`, `-32000`.
- **Body cap:** reject early on `Content-Length`, and also count bytes while streaming. Over the cap: 413 with `-32600`.
- **HOST:** `config.host = process.env.HOST || undefined`, then `listen(port, host)`. Unset keeps today's all-interfaces behaviour.

## Tests to add

- `tests/http-security.test.ts` (unit):
  - defaults and env overrides
  - `hostnameOf` (including IPv6 `[::1]:3001`)
  - Host/Origin decisions, including that `http://localhost.evil.com` is rejected
  - `clientIp` with and without `TRUST_PROXY`
  - `RateLimiter` window behaviour
- `tests/http.test.ts` (in-process):
  - Host `evil.com` → 403
  - Origin `evil.com` → 403
  - preflight → 204 with the MCP headers
  - 1 MB + 10 bytes → 413
  - limit 3 → `[200,200,200,429]` with `Retry-After`
  - `.well-known` has `*`

A prototype was run before the switch to plan-only:
- 37/37 tests passed.
- curl: `Host: evil.com` → 403; 62 requests → 60 × 200 then 429; 2 MB → 413; `OPTIONS` → 204.
- Audit went to 3 fail · 3 warn · 13 pass, clearing the CORS WARN.

## Risks / rollout / decisions

- **Decision (ops):** production is behind Cloudflare.
  - With `TRUST_PROXY=1`, the right-most XFF hop is the last proxy's view, possibly a Cloudflare edge IP, so many clients share one bucket.
  - Options: leave it unset, or have the origin proxy set the real client IP first.
- **Decision (ops):** confirm the Host reaching the container is `mcp.hemmiles.com` or loopback. Otherwise set `MCP_ALLOWED_HOSTS`, or every request gets 403.
- Implement after the per-request-server plan (same handler).
