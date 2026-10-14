# Hemmiles MCP Server

An unofficial, **read-only** [Model Context Protocol](https://modelcontextprotocol.io) server that lets MCP clients (Claude Desktop, MCP Inspector, etc.) query the public **[hemmiles.com](https://hemmiles.com)** website through structured tools.

> **Important — what Hemmiles actually is.** The site was inspected directly before any code was written. **Hemmiles is not an online store.** It is the marketing website for **Hemmiles, a B2B SaaS "field‑visit / field‑sales management" product** (visit planning, route planning, GPS check‑in, photos & notes, follow‑ups, manager dashboard, reports). There is **no product catalog, cart, checkout, stock, or customer reviews.** This server therefore exposes the site's *real* capabilities — content, features, pricing, resources, FAQs, and company/contact info — and does **not** fake e‑commerce actions that the site does not support. See [Tool mapping](#tool-mapping) and [Known limitations](#known-limitations).

---

## Table of contents

- [Verified site findings (Stage 1)](#verified-site-findings-stage-1)
- [Architecture](#architecture)
- [Tools](#tools)
- [Tool mapping](#tool-mapping) (vs. the original e‑commerce brief)
- [Install & build](#install--build)
- [Run](#run)
- [Connect to Claude Desktop](#connect-to-claude-desktop)
- [Configuration](#configuration)
- [Example conversations](#example-conversations)
- [Example tool calls](#example-tool-calls)
- [Testing](#testing)
- [Security & compliance](#security--compliance)
- [Known limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)
- [Project structure](#project-structure)

---

## Verified site findings (Stage 1)

| Check | Result |
|---|---|
| `GET /products.json` (Shopify probe) | Next.js **404** (`__next_error__`, `/_next/static/…`) → **not Shopify / WooCommerce** |
| Platform | **Next.js (App Router)**, React Server Components streamed into **server‑rendered HTML** |
| `robots.txt` | `Allow: /`, **`Disallow: /api/` for all agents** → the server never requests `/api/` |
| `sitemap.xml` | Index → `pages.xml`, `markets.xml`, `resources.xml` (~31 canonical pages) |
| Root `/` | **HTTP 307** geo‑redirect to a locale (e.g. `/in`); redirects must be followed |
| Locales | `global, in, us, gb, ca, au, nz, ie, sg, ae, za` |
| Structured data | Rich **JSON‑LD** on every page: `SoftwareApplication` (name, `featureList`, `offers[]`), `Organization` (email, contact points), `WebPage`, `FAQPage`, `BreadcrumbList` |
| Pricing | Per user / month, **locale‑specific currency** (e.g. India ₹3,500 / US $39 Starter). Monthly + annual billing in `offers[].priceSpecification[]` |
| Reliability | Intermittent `ECONNRESET` (rate‑limiting) → retry/backoff + conservative throttling required |

Because content and pricing are delivered as JSON‑LD inside server‑rendered HTML, **plain `fetch` is sufficient — Playwright is not used.**

## Architecture

- **TypeScript + Node 18+**, ESM.
- **Official MCP SDK** (`@modelcontextprotocol/sdk`), tools registered with `registerTool` (Zod input + output schemas, annotations, `structuredContent`).
- **stdio** transport by default (for Claude Desktop); optional **Streamable HTTP** (`HEMMILES_TRANSPORT=http`).
- **`HemmilesClient`** — the single network gateway:
  - SSRF‑safe: HTTPS only, host allowlisted to `hemmiles.com`, **every redirect hop re‑validated**, `/api/` refused.
  - Resilient: per‑request timeout (AbortController), retry with exponential backoff on transient errors (ECONNRESET / 5xx / 429), manual redirect following.
  - Conservative rate limiting (serialized requests with a configurable minimum interval) + in‑memory TTL cache.
- **`product-normalizer`** — pure, JSON‑LD‑first extraction (via `cheerio`), unit‑tested with fixtures.
- No secrets, no credentials, no writes, no transactions.

## Tools

All tools are read‑only (`readOnlyHint: true`) and support `response_format: "markdown" | "json"`. Locale defaults to the server's configured locale (`in` out of the box).

| Tool | Purpose |
|---|---|
| `hemmiles_list_pages` | Enumerate site pages by section (from the live sitemap). |
| `hemmiles_get_page` | Full normalized content of one page: title, description, headings, breadcrumbs, links, JSON‑LD types, body text. |
| `hemmiles_search_site` | Keyword search across pages (slug + deep full‑text), ranked, with snippets & pagination. |
| `hemmiles_list_features` | The product's capabilities from `SoftwareApplication.featureList`, linked to feature pages. |
| `hemmiles_get_pricing` | Subscription plans for a market: price, currency, unit, user limits, monthly/annual billing. |
| `hemmiles_list_resources` | Guides, blog posts, docs/help hubs. |
| `hemmiles_get_faqs` | FAQ Q&A from a page's `FAQPage` JSON‑LD (pricing page has a detailed set). |
| `hemmiles_get_company_info` | Organization data: name, site, logo, support email, contact points. |
| `hemmiles_get_policies` | Security / privacy / terms / legal / cookies pages that actually exist. |
| `hemmiles_get_contact_options` | Official demo / contact / sales links + support email (the safe alternative to cart/checkout). |

## Tool mapping

How the original e‑commerce brief maps onto this SaaS site:

| Brief tool | Status | Implemented as |
|---|---|---|
| `search_products` | ✅ remapped | `hemmiles_search_site` |
| `get_product_details` | ✅ remapped | `hemmiles_get_page` |
| `list_categories` | ✅ remapped | `hemmiles_list_pages` |
| `get_featured_products` | ✅ remapped | `hemmiles_list_features` |
| `get_product_price` | ✅ remapped | `hemmiles_get_pricing` |
| `get_store_information` | ✅ remapped | `hemmiles_get_company_info` |
| `get_return_policy` / `get_shipping_information` | ⚠️ partial | `hemmiles_get_policies` — **no shipping/returns exist for a digital SaaS**; billing/trial terms are in `hemmiles_get_faqs`. Documented, not faked. |
| `get_product_reviews` | ❌ not implemented | No public reviews/testimonials in the site's structured data. |
| `check_product_availability` | ❌ not implemented | No stock/inventory concept (SaaS). Plan availability is reflected in `hemmiles_get_pricing` (`availability` field). |
| `add_to_cart`, `get_cart`, `remove_from_cart`, `create_checkout_link` | ❌ not implemented | **No cart or checkout exists.** Use `hemmiles_get_contact_options` to reach the official demo/sales flow. The server never performs transactions or submits forms. |

## Install & build

Requires **Node.js ≥ 18**.

```bash
npm install
npm run build
```

This compiles TypeScript to `dist/`, with the entry point at `dist/index.js`.

## Run

```bash
# stdio (default)
npm start

# Streamable HTTP on :3000 (POST JSON-RPC to /mcp)
HEMMILES_TRANSPORT=http PORT=3000 npm start

# Development (auto-reload, no build needed)
npm run dev

# Explore interactively with the MCP Inspector
npm run inspector
```

Startup logs go to **stderr** only, so the stdio JSON‑RPC stream stays clean.

### HTTP endpoints

When running with `HEMMILES_TRANSPORT=http`, the following informational endpoints are served alongside MCP (which stays on `POST /mcp`):

| Method & path | Returns |
|---|---|
| `GET /` | HTML landing page (overview, endpoints, tool list, markets) — open it in a browser |
| `GET /health`, `GET /healthz` | Liveness JSON `{status:"ok", version, uptimeSeconds, …}` |
| `GET /version` | Version/protocol JSON |
| `GET /.well-known/mcp.json` | Discovery doc (transport, endpoint, tool names) |
| `POST /mcp` | MCP JSON-RPC (Streamable HTTP) |
| `OPTIONS /mcp` | CORS preflight (**204** for allowed origins) |

Every `POST /mcp` gets its own MCP server instance, so overlapping requests are safe; the page cache, sitemap cache and outbound rate limit are shared. Requests to `/mcp` are checked before the body is read: `Host` and `Origin` allowlists (**403**), per‑IP rate limit (**429**), and a 1 MB body cap (**413**). The public `GET` docs above send `Access-Control-Allow-Origin: *`.

```bash
curl http://localhost:3001/health
# {"status":"ok","name":"hemmiles-mcp-server","version":"1.0.0",
#  "transport":"http","locale":"in","uptimeSeconds":6,"mcpEndpoint":"/mcp"}
```

Open `http://localhost:3001/` in a browser to see the landing page. (stdio transport has no HTTP endpoints; its health is simply that the process is running and `tools/list` responds.)

## Connect to Claude Desktop

1. `npm install && npm run build`.
2. Open Claude Desktop → **Settings → Developer → Edit Config** (this opens `claude_desktop_config.json`).
3. Add the server using the **absolute path to the compiled entry point**, then restart Claude Desktop.

**Windows** (this machine's path):

```json
{
  "mcpServers": {
    "hemmiles": {
      "command": "node",
      "args": ["C:\\Users\\Hp\\Desktop\\Hemmiles_MCP\\dist\\index.js"],
      "env": {
        "HEMMILES_DEFAULT_LOCALE": "in"
      }
    }
  }
}
```

**macOS / Linux** (adjust the path):

```json
{
  "mcpServers": {
    "hemmiles": {
      "command": "node",
      "args": ["/absolute/path/to/Hemmiles_MCP/dist/index.js"],
      "env": { "HEMMILES_DEFAULT_LOCALE": "us" }
    }
  }
}
```

After restarting, the 🔌 tools menu will list the `hemmiles_*` tools.

## Configuration

All environment variables are **optional** (no secrets required). See `.env.example`.

| Variable | Default | Meaning |
|---|---|---|
| `HEMMILES_TRANSPORT` | `stdio` | `stdio` or `http` |
| `PORT` | `3000` | HTTP transport port |
| `HEMMILES_DEFAULT_LOCALE` | `in` | Default market (`global,in,us,gb,ca,au,nz,ie,sg,ae,za`) |
| `HEMMILES_TIMEOUT_MS` | `20000` | Per‑request timeout (1000–60000) |
| `HEMMILES_MAX_RETRIES` | `3` | Retries for transient errors (0–5) |
| `HEMMILES_MIN_REQUEST_INTERVAL_MS` | `600` | Minimum spacing between requests |
| `HEMMILES_CACHE_TTL_SECONDS` | `300` | In‑memory cache TTL (0 disables) |
| `HEMMILES_USER_AGENT` | `hemmiles-mcp-server/1.0 …` | Outbound User‑Agent |
| `HOST` | *(unset: all interfaces)* | HTTP listen address, e.g. `127.0.0.1` |
| `MCP_ALLOWED_HOSTS` | `localhost,127.0.0.1,[::1],::1,mcp.hemmiles.com` | HTTP: `Host` header allowlist (hostname only, port ignored). Other hosts get **403**. |
| `MCP_ALLOWED_ORIGINS` | `https://mcp.hemmiles.com` | HTTP: browser `Origin` allowlist. Loopback origins on any port are always allowed; requests without `Origin` (agents, curl) are allowed. |
| `MCP_RATE_LIMIT_PER_MINUTE` | `60` | HTTP: `POST /mcp` requests per client IP per minute (**429** + `Retry-After` above it). `0` = off. |
| `TRUST_PROXY` | *(unset)* | HTTP: `1` = take the client IP from the right‑most `X-Forwarded-For` hop. Leave unset unless the proxy in front sets it to the real client IP. |

## Example conversations

**Discover and price:**
> **User:** What does Hemmiles do, and how much is it in India?
> **Claude:** *(calls `hemmiles_list_features` → Visit planning, Route planning, GPS check‑in, Photos & notes, Follow‑ups, Offline mode, Manager dashboard, Reports; then `hemmiles_get_pricing {locale:"in"}`)* Hemmiles is field‑visit software… India pricing is Starter **₹3,500**, Professional **₹4,500**, Enterprise **₹8,000** per user/month (annual billing is cheaper), with a 14‑day free trial.

**Research a capability:**
> **User:** Does it work without signal? Show me the details.
> **Claude:** *(`hemmiles_search_site {query:"offline"}` → `features/offline-mode`, then `hemmiles_get_page {path:"features/offline-mode"}`)* Yes — Offline mode lets reps keep working without signal and syncs later…

**Get in touch:**
> **User:** How do I get a demo?
> **Claude:** *(`hemmiles_get_contact_options`)* Book a demo at `https://hemmiles.com/in/demo`, or email `hello@hemmiles.com`. (The server only returns official links; it doesn't submit anything for you.)

## Example tool calls

MCP `tools/call` request and the resulting `structuredContent` (abridged, verified against the live site):

```jsonc
// hemmiles_get_pricing
{ "name": "hemmiles_get_pricing", "arguments": { "locale": "in", "response_format": "json" } }
// → structuredContent:
{
  "url": "https://hemmiles.com/in/pricing",
  "locale": "in",
  "currency": "INR",
  "plans": [
    { "name": "Starter plan", "price": "3500", "priceCurrency": "INR",
      "unit": "per user per month", "minUsers": 3, "maxUsers": 10,
      "availability": "https://schema.org/InStock",
      "billing": [ { "name": "Monthly billing", "price": "3500" },
                   { "name": "Annual billing",  "price": "2900" } ] }
    // … Professional, Enterprise
  ]
}
```

```jsonc
// hemmiles_search_site
{ "name": "hemmiles_search_site",
  "arguments": { "query": "offline", "locale": "in", "limit": 3, "response_format": "json" } }
// → results[0]: { "url": ".../in/features/offline-mode", "section": "features",
//                 "score": 19, "title": "Offline mode for field teams in India", "snippet": "…" }
```

```jsonc
// hemmiles_get_company_info  →  { "name": "Hemmiles", "email": "hello@hemmiles.com",
//   "url": "https://hemmiles.com", "contactPoints": [ { "contactType": "sales", "url": ".../demo" } ] }
```

## Testing

```bash
npm test        # unit tests (no network): validation, SSRF, normalizer, formatting
npm run typecheck
```

The unit tests use HTML fixtures whose **structure** mirrors the live site (JSON‑LD with numeric prices, array `priceSpecification`, `FAQPage`, `Organization`) but with test values. SSRF/robots rejections are asserted to happen **before** any network call.

## Security & compliance

- **Read‑only.** No writes, purchases, sign‑ins, form submissions, or transactions.
- **robots.txt respected.** `/api/` is never requested.
- **SSRF‑hardened.** HTTPS + `hemmiles.com` only; every redirect hop re‑validated; arbitrary‑URL fetching is impossible.
- **No sensitive logging.** No credentials exist; request logs avoid bodies.
- **Rate‑limited & cached** to be a good citizen of the site.
- Unofficial and not affiliated with Hemmiles.

## Known limitations

- **Not an e‑commerce integration** — no products/cart/checkout/reviews/stock, because the site has none. See [Tool mapping](#tool-mapping).
- **Pricing** reflects the publicly displayed list price only (monthly + annual as published); negotiated/promo pricing isn't exposed.
- **Search** ranks by keyword relevance across titles/descriptions/slugs/body; deep full‑text fetching is bounded (`MAX_SEARCH_FETCH`) to limit load, so very long‑tail matches on huge sites could be capped (the site is small, ~31 canonical pages).
- **Content changes** on the live site can change returned text; schema types are stable but values are live.
- Relies on the site's JSON‑LD; if a page omits structured data, tools fall back to DOM parsing and may return less detail.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `NETWORK` / `TIMEOUT` errors | The site rate‑limits and occasionally resets connections. Retry; the client already backs off. Raise `HEMMILES_TIMEOUT_MS` / `HEMMILES_MAX_RETRIES`. |
| `NOT_FOUND` | The path doesn't exist for that locale. Use `hemmiles_list_pages` / `hemmiles_search_site` to find valid paths, or try `locale:"global"`. |
| `DISALLOWED_PATH` | You asked for a robots‑blocked path (e.g. `/api/…`). This is intentional and cannot be overridden. |
| Server not visible in Claude Desktop | Ensure `npm run build` ran, the `args` path is **absolute** and uses escaped backslashes on Windows, then fully restart Claude Desktop. |
| Empty pricing plans | A locale page may lack offer JSON‑LD; the tool returns the page URL so you can view it directly. |

## Project structure

```
Hemmiles_MCP/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── src/
│   ├── index.ts                  # entry point + transport selection
│   ├── server.ts                 # shared tool context + per-request McpServer factory
│   ├── http.ts                   # Streamable HTTP handler (/mcp + public GET docs)
│   ├── http-security.ts          # Host/Origin allowlists, CORS, rate limit, body cap
│   ├── http-pages.ts             # landing page, /version, /.well-known/mcp.json
│   ├── config.ts                 # env configuration
│   ├── constants.ts              # hosts, locales, page list, limits
│   ├── schemas/product.ts        # Zod input + output schemas
│   ├── services/
│   │   ├── hemmiles-client.ts    # SSRF-safe fetch, retry, rate limit, cache
│   │   ├── product-normalizer.ts # pure JSON-LD / HTML extraction
│   │   └── sitemap.ts            # sitemap discovery + fallback
│   ├── tools/
│   │   ├── index.ts  pages.ts  search.ts  features.ts
│   │   ├── pricing.ts  resources.ts  store.ts  helpers.ts
│   └── utils/
│       ├── errors.ts  validation.ts  format.ts
└── tests/
    ├── fixtures.ts
    ├── validation.test.ts  normalizer.test.ts
    ├── client.test.ts  format.test.ts
    ├── http.test.ts  http-security.test.ts  http-helpers.ts
```

## License

MIT — see [LICENSE](./LICENSE).
