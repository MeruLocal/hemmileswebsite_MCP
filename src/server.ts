/**
 * Server factory: wires config → client → sitemap service → tools and returns
 * a ready-to-connect McpServer instance.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERVER_NAME, SERVER_VERSION } from "./constants.js";
import { loadConfig, type ServerConfig } from "./config.js";
import { HemmilesClient } from "./services/hemmiles-client.js";
import { SitemapService } from "./services/sitemap.js";
import { registerAllTools, type ToolContext } from "./tools/index.js";
import { registerPrompts } from "./prompts.js";

export interface BuiltServer {
  server: McpServer;
  config: ServerConfig;
}

export function createServer(config: ServerConfig = loadConfig()): BuiltServer {
  const client = new HemmilesClient(config);
  const sitemap = new SitemapService(client, config.cacheTtlMs || 300000);
  const ctx: ToolContext = { client, sitemap, config };

  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        "Read-only access to the public hemmiles.com website (Hemmiles field-visit / " +
        "field-sales SaaS). Use hemmiles_search_site and hemmiles_list_pages to discover " +
        "content, hemmiles_get_page for a page's full content, hemmiles_get_pricing for " +
        "plans (locale-specific), hemmiles_list_features for capabilities, " +
        "hemmiles_get_faqs for FAQs, and hemmiles_get_company_info / " +
        "hemmiles_get_contact_options for how to reach the vendor. There is no product " +
        "catalog, cart, or checkout.",
    },
  );

  registerAllTools(server, ctx);
  registerPrompts(server);
  return { server, config };
}
