# Plan: registry metadata (server.json) and a single source for versions

- **Severity:** P2
- **Effort:** S

## Finding

- **No `server.json`**, so the server cannot be published to the MCP Registry. The public remote would be `https://mcp.hemmiles.com/mcp` (streamable-http).
- **Version is hard-coded** as `SERVER_VERSION = "1.0.0"` (`src/constants.ts:99`), separately from `package.json` `"version": "1.0.0"`. They will drift on the first release.
- **Protocol version is hard-coded** as `MCP_PROTOCOL_VERSION = "2025-06-18"` (`src/http-pages.ts:9`). The installed SDK (1.32.1) exports `LATEST_PROTOCOL_VERSION = "2025-11-25"`, so `/version` and `/.well-known/mcp.json` advertise an older version than the server negotiates.
- **`/.well-known/mcp.json` hand-lists tool names** (`TOOLS`, `src/http-pages.ts:11-22`). `/version` has no tool count and no `mcp_endpoint`, and there is no `websiteUrl`.
- Measured with `audit-live-mcp.mjs` on `main`:
  - `FAIL discovery — the manifest hand-lists tools — a second copy of the tool surface WILL rot`
  - `FAIL tools — /version says undefined tools, tools/list returns 10`
  - `WARN version — /version does not advertise mcp_endpoint`
  - The audit script's other session-id FAIL/WARN are HelloGrowthCRM-specific; this server is stateless by design.

Not checked: whether `mcp.hemmiles.com` resolves (sandbox egress is blocked), or whether the npm name `hemmiles-mcp-server` is free.

## Proposed fix

- **`server.json`** at the repo root, the same shape as the HelloGrowthCRM one:
  - `$schema`: `https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json`
  - `name`: `io.github.merulocal/hemmiles-mcp-server`
  - `description`: the official Hemmiles read-only description
  - `version`: from `package.json`
  - `repository`: `{ url: https://github.com/MeruLocal/hemmileswebsite_MCP, source: github }`
  - `websiteUrl`: `https://hemmiles.com`
  - `remotes`: `[{ type: "streamable-http", url: "https://mcp.hemmiles.com/mcp" }]`
  - `packages[]` (npm, stdio) only if/when the package is published, with the env vars from `.env.example`
- **Runtime version from `package.json`:** `src/constants.ts` reads `../package.json` via `createRequire(import.meta.url)` and exports `SERVER_VERSION = pkg.version`. This works from both `src/` (tsx) and `dist/` (both are one level below the root; the Dockerfile already copies `package.json`).
- **Protocol version:** `import { LATEST_PROTOCOL_VERSION } from "@modelcontextprotocol/sdk/types.js"` in `http-pages.ts`.
- **Discovery doc / `/version`:**
  - Replace the hand-listed `tools` array with `tools: <count>`, derived once from the registered tools (keep a list only in the landing HTML, or derive it there too).
  - Add `mcp_endpoint: "/mcp"` and `websiteUrl`.
- **Version-parity check:** `scripts/check-versions.mjs` asserts `package.json` version = `server.json` `version`. Run it in CI (see the CI plan).

## Tests to add

- `SERVER_VERSION === package.json.version`.
- `versionInfo().protocolVersion === LATEST_PROTOCOL_VERSION`.
- `server.json` parses, its `version` matches `package.json`, and the remote URL ends in `/mcp`.
- `/version` tool count equals `tools/list` length (via `InMemoryTransport`).

## Risks / decisions

- **Decision (founder):** confirm `https://mcp.hemmiles.com/mcp` is the public endpoint, and choose the registry namespace (`io.github.merulocal/…` vs. a `com.hemmiles/…` domain-verified name).
- **Decision (founder):** publish to npm or remote-only.

## Re-audit correction (2026-10-14, new audit script)

- New script output on `main` for this plan's area: `FAIL C13.well_known the manifest hand-lists tools`. The old "`/version` says undefined tools" FAIL and the `mcp_endpoint` WARN are no longer emitted by the new script; the fix for them still stands.
- **Measured:** `https://registry.npmjs.org/hemmiles-mcp-server` → **404**. The name is unpublished (and appears free).
- **Missed (B4 / C13):** `package.json` has no `repository`, `homepage` or `bugs` fields. Add `repository: { type: git, url: https://github.com/MeruLocal/hemmileswebsite_MCP }` and `homepage: https://hemmiles.com`. If the founder chooses npm publishing, the MCP Registry also requires **`"mcpName": "<the server.json name>"`** in `package.json` to verify package ownership; add it in the same change and assert it equals `server.json` `name` in `scripts/check-versions.mjs`.
- The `author` field and the LICENSE copyright line stay as they are (legal-owner names are out of scope).
