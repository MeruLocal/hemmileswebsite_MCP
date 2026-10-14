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
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server.js";
import { SERVER_NAME, SERVER_VERSION } from "./constants.js";
import { landingPageHtml, versionInfo, discoveryDoc } from "./http-pages.js";

async function runStdio(): Promise<void> {
  const { server, config } = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `${SERVER_NAME} v${SERVER_VERSION} running on stdio (locale=${config.defaultLocale}).`,
  );
}

async function runHttp(): Promise<void> {
  const { createServer: createHttpServer } = await import("node:http");
  const { server, config } = createServer();

  const startedAt = Date.now();
  const httpServer = createHttpServer((req, res) => {
    void (async () => {
      const path = (req.url ?? "").split("?")[0] ?? "";

      if (req.method === "GET") {
        // Human-facing landing page.
        if (path === "/" || path === "/index.html") {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(landingPageHtml(config.defaultLocale));
          return;
        }
        // Liveness check for monitors / load balancers.
        if (path === "/health" || path === "/healthz") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              status: "ok",
              name: SERVER_NAME,
              version: SERVER_VERSION,
              transport: "http",
              locale: config.defaultLocale,
              uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
              mcpEndpoint: "/mcp",
            }),
          );
          return;
        }
        if (path === "/version") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(versionInfo(config.defaultLocale)));
          return;
        }
        if (path === "/.well-known/mcp.json") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(discoveryDoc(config.defaultLocale)));
          return;
        }
      }

      if (req.method !== "POST" || !path.startsWith("/mcp")) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found. GET / for info, GET /health for status, or POST JSON-RPC to /mcp." }));
        return;
      }
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : undefined;

        // New stateless transport per request avoids request-id collisions.
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
          enableJsonResponse: true,
        });
        res.on("close", () => void transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, body);
      } catch (error) {
        if (!res.headersSent) {
          res.writeHead(400, { "Content-Type": "application/json" });
        }
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32700, message: `Parse error: ${(error as Error).message}` },
            id: null,
          }),
        );
      }
    })();
  });

  httpServer.listen(config.port, () => {
    console.error(
      `${SERVER_NAME} v${SERVER_VERSION} running on http://localhost:${config.port}/mcp (locale=${config.defaultLocale}).`,
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
