/**
 * Streamable HTTP transport (stateless, JSON responses).
 *
 * `createHttpApp(ctx)` returns a plain `http.Server` so tests can run it
 * in-process on port 0. Every POST /mcp gets its OWN McpServer and transport:
 * the SDK allows a server to be connected to one transport at a time, so a
 * shared server fails overlapping requests with "Already connected to a
 * transport". The tool context (client, caches, outbound rate-limit gate) is
 * shared, so outbound load on hemmiles.com does not change.
 */

import { createServer as createNodeServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "./server.js";
import { SERVER_NAME, SERVER_VERSION } from "./constants.js";
import { landingPageHtml, versionInfo, discoveryDoc } from "./http-pages.js";
import type { ToolContext } from "./tools/index.js";
import {
  BodyTooLargeError,
  RateLimiter,
  clientIp,
  corsHeaders,
  isHostAllowed,
  isOriginAllowed,
  loadHttpSecurityConfig,
  readBody,
  type HttpSecurityConfig,
} from "./http-security.js";

export interface HttpAppOptions {
  security?: HttpSecurityConfig;
}

const PUBLIC_CORS = { "Access-Control-Allow-Origin": "*" };

function sendJson(res: ServerResponse, status: number, payload: unknown, headers: Record<string, string> = {}): void {
  if (!res.headersSent) res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify(payload));
}

function rpcError(code: number, message: string): Record<string, unknown> {
  return { jsonrpc: "2.0", error: { code, message }, id: null };
}

export function createHttpApp(ctx: ToolContext, options: HttpAppOptions = {}): Server {
  const security = options.security ?? loadHttpSecurityConfig();
  const limiter = new RateLimiter(security.rateLimitPerMinute);
  const startedAt = Date.now();
  const locale = ctx.config.defaultLocale;

  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const path = (req.url ?? "").split("?")[0] ?? "";

    if (req.method === "GET") {
      if (path === "/" || path === "/index.html") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", ...PUBLIC_CORS });
        res.end(landingPageHtml(locale));
        return;
      }
      if (path === "/health" || path === "/healthz") {
        sendJson(
          res,
          200,
          {
            status: "ok",
            name: SERVER_NAME,
            version: SERVER_VERSION,
            transport: "http",
            locale,
            uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
            mcpEndpoint: "/mcp",
          },
          PUBLIC_CORS,
        );
        return;
      }
      if (path === "/version") {
        sendJson(res, 200, versionInfo(locale), PUBLIC_CORS);
        return;
      }
      if (path === "/.well-known/mcp.json") {
        sendJson(res, 200, discoveryDoc(locale), PUBLIC_CORS);
        return;
      }
    }

    const isMcp = path.startsWith("/mcp");
    if (isMcp && (req.method === "POST" || req.method === "OPTIONS")) {
      // Guards run before the body is read.
      if (!isHostAllowed(req.headers.host, security)) {
        sendJson(res, 403, rpcError(-32000, "Forbidden: host not allowed."));
        return;
      }
      const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;
      if (!isOriginAllowed(origin, security)) {
        sendJson(res, 403, rpcError(-32000, "Forbidden: origin not allowed."));
        return;
      }
      const cors = origin !== undefined ? corsHeaders(origin) : {};

      if (req.method === "OPTIONS") {
        res.writeHead(204, cors);
        res.end();
        return;
      }

      const rate = limiter.check(clientIp(req, security.trustProxy));
      if (!rate.allowed) {
        sendJson(res, 429, rpcError(-32000, "Too many requests. Retry later."), {
          ...cors,
          "Retry-After": String(rate.retryAfterSeconds),
        });
        return;
      }

      let raw: Buffer;
      try {
        raw = await readBody(req, security.maxBodyBytes);
      } catch (error) {
        if (error instanceof BodyTooLargeError) {
          sendJson(res, 413, rpcError(-32600, "Request body too large."), { ...cors, Connection: "close" });
          return;
        }
        throw error;
      }

      let body: unknown;
      try {
        body = raw.length ? JSON.parse(raw.toString("utf8")) : undefined;
      } catch {
        sendJson(res, 400, rpcError(-32700, "Parse error: request body is not valid JSON."), cors);
        return;
      }

      for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);
      const server = createMcpServer(ctx);
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      res.on("close", () => {
        void transport.close();
        void server.close();
      });
      try {
        await server.connect(transport);
        await transport.handleRequest(req, res, body);
      } catch (error) {
        console.error("MCP request failed:", (error as Error)?.message ?? error);
        sendJson(res, 500, rpcError(-32603, "Internal server error."));
      }
      return;
    }

    sendJson(
      res,
      404,
      { error: "Not found. GET / for info, GET /health for status, or POST JSON-RPC to /mcp." },
      PUBLIC_CORS,
    );
  }

  return createNodeServer((req, res) => {
    handle(req, res).catch((error: unknown) => {
      console.error("HTTP handler error:", (error as Error)?.message ?? error);
      if (!res.writableEnded) sendJson(res, 500, rpcError(-32603, "Internal server error."));
    });
  });
}
