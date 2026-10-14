/**
 * Server factory.
 *
 * - `createToolContext(config)` builds the network client and sitemap service
 *   ONCE per process. They hold the page cache, the sitemap cache and the
 *   outbound rate-limit gate, so every request must share them.
 * - `createMcpServer(ctx)` returns a NEW McpServer with every tool registered.
 *   It does no network or cache work, so it is cheap to call per HTTP request.
 *   An McpServer can be connected to only one transport at a time, so the HTTP
 *   transport must never reuse one across overlapping requests.
 * - `createServer()` is the one-shot wrapper used by the stdio transport.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERVER_NAME, SERVER_VERSION } from "./constants.js";
import { loadConfig, type ServerConfig } from "./config.js";
import { HemmilesClient } from "./services/hemmiles-client.js";
import { SitemapService } from "./services/sitemap.js";
import { registerAllTools, type ToolContext } from "./tools/index.js";

export interface BuiltServer {
  server: McpServer;
  config: ServerConfig;
}

export const SERVER_INSTRUCTIONS =
  "Read-only access to the public hemmiles.com website (Hemmiles field-visit / " +
  "field-sales SaaS). Use hemmiles_search_site and hemmiles_list_pages to discover " +
  "content, hemmiles_get_page for a page's full content, hemmiles_get_pricing for " +
  "plans (locale-specific), hemmiles_list_features for capabilities, " +
  "hemmiles_get_faqs for FAQs, and hemmiles_get_company_info / " +
  "hemmiles_get_contact_options for how to reach the vendor. There is no product " +
  "catalog, cart, or checkout.";

/** Build the shared, process-wide tool context (client, caches, rate-limit gate). */
export function createToolContext(config: ServerConfig = loadConfig()): ToolContext {
  const client = new HemmilesClient(config);
  const sitemap = new SitemapService(client, config.cacheTtlMs);
  return { client, sitemap, config };
}

/** Build a new McpServer bound to a shared context. Cheap: no I/O. */
export function createMcpServer(ctx: ToolContext): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { instructions: SERVER_INSTRUCTIONS },
  );
  registerAllTools(server, ctx);
  return server;
}

/** One context + one server, for the single-connection stdio transport. */
export function createServer(config: ServerConfig = loadConfig()): BuiltServer {
  const ctx = createToolContext(config);
  return { server: createMcpServer(ctx), config };
}
