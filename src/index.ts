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
import {
  landingPageHtml,
  versionInfo,
  discoveryDoc,
  serverCard,
  llmsTxt,
  robotsTxt,
} from "./http-pages.js";

/**
 * True when the request looks like a browser navigating to the URL rather than a
 * client speaking the protocol. `Sec-Fetch-*` are sent by current browsers; the
 * Accept check covers older ones and excludes a genuine SSE stream request.
 */
function isBrowserNavigation(headers: NodeJS.Dict<string | string[]>): boolean {
  if (headers["sec-fetch-mode"] === "navigate") return true;
  if (headers["sec-fetch-dest"] === "document") return true;
  const accept = String(headers.accept ?? "");
  return accept.includes("text/html") && !accept.includes("text/event-stream");
}

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
        if (path === "/.well-known/mcp/server-card.json") {
          res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
          res.end(JSON.stringify(serverCard()));
          return;
        }
        if (path === "/llms.txt") {
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(llmsTxt());
          return;
        }
        if (path === "/robots.txt") {
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(robotsTxt());
          return;
        }
        if (path === "/.well-known/mcp.json") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(discoveryDoc(config.defaultLocale)));
          return;
        }
      }

      // `/mcp` exists but speaks JSON-RPC over POST. A browser address bar sends
      // GET, so show the landing page rather than a misleading 404; anything else
      // gets a 405 naming the method it should have used.
      if (path.startsWith("/mcp") && req.method !== "POST") {
        if (req.method === "GET" && isBrowserNavigation(req.headers)) {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(landingPageHtml(config.defaultLocale));
          return;
        }
        res.writeHead(405, { "Content-Type": "application/json", Allow: "POST" });
        res.end(
          JSON.stringify({
            error: "Method not allowed. /mcp speaks JSON-RPC over POST.",
            hint: "GET / for the landing page, GET /health for status, or POST a JSON-RPC request to /mcp.",
          }),
        );
        return;
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
