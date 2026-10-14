#!/usr/bin/env node
/**
 * Entry point for the Hemmiles MCP server.
 *
 * Transport is chosen by HEMMILES_TRANSPORT:
 *   - "stdio" (default): for local clients such as Claude Desktop.
 *   - "http": Streamable HTTP (stateless JSON) on PORT, endpoint POST /mcp.
 *
 * All logging goes to stderr so it never corrupts the stdio JSON-RPC stream.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, createToolContext } from "./server.js";
import { createHttpApp } from "./http.js";
import { SERVER_NAME, SERVER_VERSION } from "./constants.js";

async function runStdio(): Promise<void> {
  const { server, config } = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `${SERVER_NAME} v${SERVER_VERSION} running on stdio (locale=${config.defaultLocale}).`,
  );
}

async function runHttp(): Promise<void> {
  const ctx = createToolContext();
  const { config } = ctx;
  const httpServer = createHttpApp(ctx);
  httpServer.listen(config.port, config.host, () => {
    const shownHost = config.host ?? "localhost";
    console.error(
      `${SERVER_NAME} v${SERVER_VERSION} running on http://${shownHost}:${config.port}/mcp (locale=${config.defaultLocale}).`,
    );
  });
}

async function main(): Promise<void> {
  const transport = (process.env.HEMMILES_TRANSPORT ?? "stdio").trim().toLowerCase();
  if (transport === "http") {
    await runHttp();
  } else {
    await runStdio();
  }
}

main().catch((error) => {
  console.error("Fatal error starting Hemmiles MCP server:", error);
  process.exit(1);
});
