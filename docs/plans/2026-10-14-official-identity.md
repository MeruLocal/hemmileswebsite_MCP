# Plan: present the server as the official Hemmiles MCP and clean up copy

- **Severity:** P1
- **Effort:** S

## Finding

The server is run by Hemmiles, but its public copy says it is unofficial, and it leaks internal wording.

| Where | Problem |
|---|---|
| `src/http-pages.ts:121` | Landing-page footer: "unofficial, not affiliated with Hemmiles." |
| `README.md:3` | "An unofficial, **read-only** …" |
| `README.md:259` | "Unofficial and not affiliated with Hemmiles." |
| `LICENSE:25-29` | Notice: "unofficial, independent integration. It is not affiliated with, endorsed by, or sponsored by Hemmiles." |
| `src/tools/store.ts:41` | Tool description: `This is the brief's "get_store_information" for a SaaS vendor.` (internal build-brief wording, sent to every client in `tools/list`) |
| `src/tools/store.ts:88` | "(the brief's get_shipping_information / get_return_policy do not apply)" |
| `src/tools/store.ts:184` | "the brief's add_to_cart / get_cart / remove_from_cart / create_checkout_link tools are not implemented" |
| `src/tools/pages.ts:116` | "the brief's "get_product_details"" (same issue, not in the original list) |
| `src/config.ts:44`, `.env.example:34` | Outbound User-Agent points at the placeholder `https://github.com/your-org/hemmiles-mcp-server` |
| `src/http-pages.ts:92-95` and `:104-107` | The "Read-only Hemmiles website mirror (product knowledge: …)" paragraph appears twice on the landing page |
| `src/config.ts:36` | Default port is 3000, but `Dockerfile:57/73/78` and the `README.md:133,138` health examples use 3001, and `README.md:108-109,185` say 3000 |

Not checked: the live landing page at mcp.hemmiles.com (sandbox egress is blocked).

## Proposed fix

- **Landing page** (`src/http-pages.ts`):
  - One description paragraph: "The official MCP server for Hemmiles … read-only … No API key is required."
  - Footer: "the official MCP server for Hemmiles", linked to hemmiles.com.
  - Meta description and the `/.well-known/mcp.json` description say "official".
  - H1: "Hemmiles MCP Server".
- **README:**
  - line 3 → "The official, read-only …"
  - line 259 → "Published by Hemmiles as its official MCP server."
- **LICENSE:** replace only the "unofficial … not affiliated" sentence with "This project is the official MCP server for Hemmiles." The copyright holder line stays unchanged.
- **Tool descriptions:** drop every "brief's …" phrase (`store.ts:41,88,184`, `pages.ts:116`) and keep the user-facing meaning ("there are no cart or checkout tools"). Code comments that say "brief" can stay or go; they are not sent to clients.
- **User-Agent:** `hemmiles-mcp-server/1.0 (+https://github.com/MeruLocal/hemmileswebsite_MCP)` in `config.ts` and `.env.example`.
- **Port:** make the default 3001 everywhere (`config.ts`, `.env.example`, README run example and config table), matching the Dockerfile.

## Tests to add

`tests/identity.test.ts`:
- `landingPageHtml()` and `discoveryDoc()` contain no `unofficial|not affiliated`, and the description paragraph appears exactly once.
- `tools/list` over `InMemoryTransport` has no tool description matching `\bbrief\b` or `unofficial`.
- `loadConfig()` with no env gives `port === 3001` and a User-Agent without `your-org`.

A prototype was run before the switch to plan-only: 26/26 tests passed, and the audit was unchanged at 3 fail · 4 warn · 13 pass.

## Risks / decisions

- **Decision (founder):** confirm the official public wording, and that `mcp.hemmiles.com` / the GitHub repo are the URLs to publish. The legal owner / copyright holder name is out of scope and stays as it is.
- Changing the default port affects anyone running `npm start` without `PORT`. Docker already uses 3001.
- The README "Tool mapping (vs. the original e-commerce brief)" section is internal history. Optionally rewrite it later; it is not sent to clients.
