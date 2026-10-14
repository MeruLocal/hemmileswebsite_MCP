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

export interface ToolInfo {
  name: string;
  title?: string;
}

let catalog: ToolInfo[] | undefined;

/**
 * Names and titles of every registered tool, derived by running the real
 * registration against a recorder (no network, no context use). Discovery docs
 * use this instead of a hand-maintained list, so they cannot drift.
 */
export function toolCatalog(): ToolInfo[] {
  if (!catalog) {
    const found: ToolInfo[] = [];
    const recorder = {
      registerTool(name: string, config: { title?: string }) {
        found.push(config.title !== undefined ? { name, title: config.title } : { name });
        return {};
      },
    };
    registerAllTools(recorder as unknown as McpServer, {} as ToolContext);
    catalog = found;
  }
  return catalog;
}
