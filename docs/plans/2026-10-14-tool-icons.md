# Plan: add server and tool icons

- **Severity:** P2
- **Effort:** S
- **Audit check:** skill §4 A4 (`C2.titles` – `title` + `icons`)

## Finding

- Every tool has a `title` (measured: `PASS C2.titles every tool has a title`), but no tool and no `serverInfo` carries `icons` (`rg -n "icons" src` → no hits).
- Clients that show icons (connector lists, tool pickers) fall back to a generic glyph, so the server does not look like Hemmiles' own.
- The Organization JSON-LD already exposes a `logo` (`src/services/product-normalizer.ts:349`), but its URL is only known at runtime from the live site.

Not checked: the logo URL on hemmiles.com and its size/format (egress blocked).

## Proposed fix

- `src/constants.ts`: `SERVER_ICON = { src: "<logo URL confirmed by the founder>", mimeType: "image/png" | "image/svg+xml", sizes: ["any"] }`. Do not invent a path.
- `src/server.ts`: pass `icons: [SERVER_ICON]` in the `McpServer` implementation info (supported by the installed SDK 1.32.1).
- Every `registerTool` call: `icons: [SERVER_ICON]` via a shared constant in `src/tools/helpers.ts` next to `READ_ONLY_ANNOTATIONS`.
- `/.well-known/mcp.json` (`src/http-pages.ts`): add `icon` with the same URL.

## Tests to add

- `tests/identity.test.ts` (or new): over `InMemoryTransport`, `initialize` `serverInfo.icons[0].src` is an `https://hemmiles.com/` URL, and every tool in `tools/list` has `icons`.

## Risks / decisions

- **Decision (founder):** which logo asset and URL to publish (a square, stable URL; ideally SVG or 256×256 PNG).
- Merge after plan #4 if both touch `serverInfo`.
