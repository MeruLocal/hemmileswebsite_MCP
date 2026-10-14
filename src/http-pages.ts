/**
 * Human-facing HTTP pages/endpoints for the HTTP transport: a landing page at
 * `/`, a `/version` status doc, and a `/.well-known/mcp.json` discovery doc.
 * These are informational only — all MCP traffic goes to POST /mcp.
 *
 * Tool counts come from the registered tools (toolCatalog), and the protocol
 * version from the SDK, so nothing here is a second hand-maintained copy.
 */

import { LATEST_PROTOCOL_VERSION } from "@modelcontextprotocol/sdk/types.js";
import {
  SERVER_NAME,
  SERVER_VERSION,
  BASE_ORIGIN,
  MCP_ENDPOINT,
  WEBSITE_URL,
  type Locale,
} from "./constants.js";
import { toolCatalog } from "./tools/index.js";

export const SERVER_DESCRIPTION =
  "The official MCP server for Hemmiles: read-only access to public hemmiles.com content " +
  "(pricing, features, resources, FAQs, company and contact info).";

export function versionInfo(locale: Locale): Record<string, unknown> {
  return {
    name: SERVER_NAME,
    version: SERVER_VERSION,
    protocolVersion: LATEST_PROTOCOL_VERSION,
    transport: "streamable-http",
    endpoint: MCP_ENDPOINT,
    mcp_endpoint: MCP_ENDPOINT,
    tools: toolCatalog().length,
    defaultLocale: locale,
    source: BASE_ORIGIN,
    websiteUrl: WEBSITE_URL,
    auth: "none",
  };
}

export function discoveryDoc(locale: Locale, iconUrl?: string): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    name: SERVER_NAME,
    version: SERVER_VERSION,
    description: SERVER_DESCRIPTION,
    protocolVersion: LATEST_PROTOCOL_VERSION,
    transport: { type: "streamable-http", endpoint: MCP_ENDPOINT, enableJsonResponse: true },
    mcp_endpoint: MCP_ENDPOINT,
    authentication: "none",
    defaultLocale: locale,
    source: BASE_ORIGIN,
    websiteUrl: WEBSITE_URL,
    // A count, not names: tools/list is the single source of tool names.
    tools: toolCatalog().length,
  };
  if (iconUrl) doc.icon = iconUrl;
  return doc;
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export function landingPageHtml(_locale: Locale): string {
  const toolCount = toolCatalog().length;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hemmiles MCP Server</title>
<meta name="description" content="${esc(SERVER_DESCRIPTION)}" />
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
    <h1>Hemmiles MCP Server</h1>

    <p>The official MCP server for Hemmiles. It gives AI assistants read-only access to public
    content from <a href="${esc(BASE_ORIGIN)}" rel="noopener noreferrer" target="_blank">hemmiles.com</a>:
    pricing, features, resources, FAQs, and company &amp; contact info. Connect via the Streamable
    HTTP endpoint at <code>${MCP_ENDPOINT}</code>. No API key is required.</p>

    <p class="status">Status: <a href="/version">/version</a> ·
    Health: <a href="/health">/health</a> ·
    Discovery: <a href="/.well-known/mcp.json">/.well-known/mcp.json</a> ·
    Tools: <code>POST ${MCP_ENDPOINT}</code> → <code>tools/list</code></p>

    <p>Hemmiles is field-visit / field-sales SaaS with no online store, so there is no product
    catalog, cart, checkout, or reviews. All ${toolCount} tools are public and read-only: there are no
    content-management, write, or transactional tools, and none require an authenticated session.
    The server respects <code>robots.txt</code> and never requests <code>/api/</code> or submits forms.</p>

    <p class="note">This is not a customer CRM or commerce API. It holds no customer data, performs no
    transactions, and needs no API key — never send one here.</p>

    <footer>${esc(SERVER_NAME)} v${esc(SERVER_VERSION)} · the official MCP server for
    <a href="${esc(WEBSITE_URL)}" rel="noopener noreferrer" target="_blank">Hemmiles</a>.</footer>
  </main>
</body>
</html>`;
}
