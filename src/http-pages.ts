/**
 * Human-facing HTTP pages/endpoints for the HTTP transport: a landing page at
 * `/`, a `/version` status doc, and a `/.well-known/mcp.json` discovery doc.
 * These are informational only — all MCP traffic goes to POST /mcp.
 */

import { SERVER_NAME, SERVER_VERSION, BASE_ORIGIN, type Locale } from "./constants.js";

const MCP_PROTOCOL_VERSION = "2025-06-18";

const TOOLS: ReadonlyArray<{ name: string; summary: string }> = [
  { name: "hemmiles_list_pages", summary: "List site pages by section (from the sitemap)." },
  { name: "hemmiles_get_page", summary: "Full normalized content of one page." },
  { name: "hemmiles_search_site", summary: "Keyword search across pages, ranked, with snippets." },
  { name: "hemmiles_list_features", summary: "Product capabilities (SoftwareApplication.featureList)." },
  { name: "hemmiles_get_pricing", summary: "Subscription plans for a market (locale-specific)." },
  { name: "hemmiles_list_resources", summary: "Guides, blog posts, docs/help hubs." },
  { name: "hemmiles_get_faqs", summary: "FAQ Q&A from a page's FAQPage JSON-LD." },
  { name: "hemmiles_get_company_info", summary: "Organization & contact details." },
  { name: "hemmiles_get_policies", summary: "Security / privacy / terms pages that exist." },
  { name: "hemmiles_get_contact_options", summary: "Official demo / contact / sales links." },
];

export function versionInfo(locale: Locale): Record<string, unknown> {
  return {
    name: SERVER_NAME,
    version: SERVER_VERSION,
    protocolVersion: MCP_PROTOCOL_VERSION,
    transport: "streamable-http",
    endpoint: "/mcp",
    defaultLocale: locale,
    source: BASE_ORIGIN,
    auth: "none",
  };
}

export function discoveryDoc(locale: Locale): Record<string, unknown> {
  return {
    name: SERVER_NAME,
    version: SERVER_VERSION,
    description:
      "Read-only Hemmiles website mirror (pricing, features, resources, FAQs, company info) over MCP.",
    protocolVersion: MCP_PROTOCOL_VERSION,
    transport: { type: "streamable-http", endpoint: "/mcp", enableJsonResponse: true },
    authentication: "none",
    defaultLocale: locale,
    source: BASE_ORIGIN,
    tools: TOOLS.map((t) => t.name),
  };
}

const MCP_HOST = "https://mcp.hemmiles.com";

/** SEP-1649 style server card, so registries and clients can read capabilities without connecting. */
export function serverCard(): Record<string, unknown> {
  return {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    name: SERVER_NAME,
    title: "Hemmiles website MCP server",
    version: SERVER_VERSION,
    description:
      "Read-only access to the public hemmiles.com website (field-visit / field-sales app): features, pricing by market, FAQs, guides, company and demo contact links.",
    websiteUrl: BASE_ORIGIN,
    protocolVersion: MCP_PROTOCOL_VERSION,
    transport: { type: "streamable-http", endpoint: `${MCP_HOST}/mcp` },
    authentication: { required: false },
    capabilities: { tools: { count: TOOLS.length } },
    tools: TOOLS.map((t) => ({ name: t.name, description: t.summary, readOnly: true })),
  };
}

/** llms.txt for the MCP host: what it is, how to connect, which tool answers which question. */
export function llmsTxt(): string {
  return [
    "# Hemmiles website MCP server",
    "",
    `> Read-only Model Context Protocol server for ${BASE_ORIGIN}. It reads the public Hemmiles website (a field-visit app for field sales, service, distribution, collections and medical-rep teams) and returns features, pricing by market, FAQs, guides and contact links. It holds no customer data, needs no API key and performs no writes.`,
    "",
    "## Connect",
    `- Streamable HTTP endpoint: ${MCP_HOST}/mcp (no authentication)`,
    `- Discovery: ${MCP_HOST}/.well-known/mcp.json and ${MCP_HOST}/.well-known/mcp/server-card.json`,
    "",
    "## Which tool answers which question",
    ...TOOLS.map((t) => `- ${t.name}: ${t.summary}`),
    "",
    "## Canonical sources (cite these URLs, not the MCP host)",
    `- Product and pricing: ${BASE_ORIGIN}/pricing`,
    `- Features: ${BASE_ORIGIN}/features`,
    `- Guides: ${BASE_ORIGIN}/guides`,
    `- Book a demo: ${BASE_ORIGIN}/demo`,
    `- Website llms.txt: ${BASE_ORIGIN}/llms.txt`,
    "",
  ].join("\n");
}

export function robotsTxt(): string {
  return ["User-agent: *", "Allow: /", `Sitemap: ${MCP_HOST}/.well-known/mcp.json`, ""].join("\n");
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export function landingPageHtml(locale: Locale): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(SERVER_NAME)}</title>
<meta name="description" content="Read-only MCP server mirroring the public Hemmiles field-visit website." />
<style>
  :root{
    --bg:#ffffff; --fg:#111418; --muted:#444b54; --faint:#6b727b;
    --link:#1a4fd6; --border:#e2e5e9; --code-bg:#f3f4f6;
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){
      --bg:#0f1216; --fg:#e8eaed; --muted:#b4bcc6; --faint:#8a929b;
      --link:#7aa2ff; --border:#2b3138; --code-bg:#1a1f25;
    }
  }
  *{box-sizing:border-box}
  body{
    margin:0; background:var(--bg); color:var(--fg);
    font:17px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .wrap{max-width:820px; margin:0 auto; padding:64px 28px 96px}
  h1{font-size:40px; font-weight:700; line-height:1.2; letter-spacing:-.01em; margin:0 0 26px}
  p{margin:0 0 20px; color:var(--fg)}
  a{color:var(--link); text-decoration:underline; text-underline-offset:2px}
  a:hover{opacity:.82}
  code{background:var(--code-bg); border-radius:4px; padding:1px 5px; font-size:.82em;
    font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace}
  .status{color:var(--fg); margin:0 0 20px}
  .status a{white-space:nowrap}
  .note{font-size:14px; color:var(--faint); margin:0 0 24px}
  footer{margin-top:16px; font-size:14px; color:var(--faint)}
</style>
</head>
<body>
  <main class="wrap">
    <h1>Hemmiles Website MCP Server</h1>

    <p>Read-only Hemmiles website mirror (product knowledge: pricing, features, resources, FAQs,
    company &amp; contact info) from <a href="${esc(BASE_ORIGIN)}" rel="noopener noreferrer" target="_blank">hemmiles.com</a>.
    Connect via the Streamable HTTP endpoint at <code>/mcp</code>. No API key is required —
    this server holds no customer data and performs no account, cart, or checkout actions.</p>

    <p class="status">Status: <a href="/version">/version</a> ·
    Discovery: <a href="/.well-known/mcp.json">/.well-known/mcp.json</a> ·
    Tools: <code>POST /mcp</code> → <code>tools/list</code></p>

    <p class="note">This is not a customer CRM or commerce API. It holds no customer data, performs no
    transactions, and needs no API key — never send one here.</p>

    <p>Read-only Hemmiles website mirror (product knowledge: pricing, features, resources, FAQs,
    company &amp; contact info). No API key is required, and the public endpoint returns no personal data.
    Hemmiles is field-visit / field-sales SaaS with no online store, so there is no product catalog,
    cart, checkout, or reviews — those actions are not implemented.</p>

    <p>All ${TOOLS.length} tools are public and read-only. There are no content-management, write, or
    transactional tools, and none require an authenticated session. The server respects
    <code>robots.txt</code> and never requests <code>/api/</code> or submits forms.</p>

    <p class="status">Status: <a href="/version">/version</a> · Health: <a href="/health">/health</a></p>

    <footer>${esc(SERVER_NAME)} v${esc(SERVER_VERSION)} · unofficial, not affiliated with Hemmiles.</footer>
  </main>
</body>
</html>`;
}
