/** Registers every Hemmiles tool on the given server. */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolContext } from "./helpers.js";
import { registerPageTools } from "./pages.js";
import { registerSearchTool } from "./search.js";
import { registerFeatureTools } from "./features.js";
import { registerPricingTool } from "./pricing.js";
import { registerResourceTools } from "./resources.js";
import { registerStoreTools } from "./store.js";

export function registerAllTools(server: McpServer, ctx: ToolContext): void {
  registerPageTools(server, ctx);
  registerSearchTool(server, ctx);
  registerFeatureTools(server, ctx);
  registerPricingTool(server, ctx);
  registerResourceTools(server, ctx);
  registerStoreTools(server, ctx);
}

export type { ToolContext } from "./helpers.js";
