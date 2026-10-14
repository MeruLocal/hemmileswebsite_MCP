# Plan: record tool-call usage (tool, client, latency, outcome) without arguments

- **Severity:** P2
- **Effort:** S–M
- **Audit check:** skill §4 V4 (`C18.usage`)

## Finding

- The server records nothing about how it is used. The only logging is three `console.error` lines: startup (`src/index.ts:22,105`) and fatal exit (`src/index.ts:121`).
- There is no way to answer: which tools do agents call, from which clients (`clientInfo.name` in `initialize`), how slow are they, how often do they fail (`isError`), and how often deep search hits the outbound gate.
- That makes it impossible to judge the other plans by data (e.g. how often deep search runs: plan #5; whether `get_started` converts: plan #6).

Not checked: whether the host (Docker/Cloudflare) already logs request paths. That would only show `POST /mcp`, not the tool.

## Proposed fix

- New `src/utils/usage.ts`: `recordToolCall({ tool, client, ms, ok, errorCode? })` writing **one JSON line to stderr** (stdio-safe) with `event:"tool_call"`. No arguments, no query text, no URLs, no IPs.
- Wrap tool handlers centrally: in `runTool()` (`src/tools/helpers.ts:56`) take the tool name and time the call; `ok = !isError`; `errorCode` = the `HemmilesError.code` only.
- Client name: on stdio, `server.server.getClientVersion()?.name`. On stateless HTTP each call has no `initialize`, so use the `User-Agent` header's first product token (e.g. `claude-ai`, `node`), truncated to 40 chars, else `unknown`.
- Env switch `HEMMILES_USAGE_LOG=0` to turn it off (default on).
- Later (needs decision): ship lines to a store; until then the container log is the store.

## Tests to add

- `tests/usage.test.ts`: a stubbed sink receives exactly one record per call with `tool`, `ms`, `ok`, and **no** key named `arguments`/`query`/`path`; a failing call records `ok:false` with `errorCode`.

## Risks / decisions

- **Decision (founder):** where usage data should land (container logs only, or the admin site's usage tables). No PII is recorded either way.
- Must land after plan #2 (per-request server) if the client name is read in the HTTP handler.
