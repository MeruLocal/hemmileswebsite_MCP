/** In-process HTTP helpers for transport tests (no outbound network). */

import { request as httpRequest, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { loadConfig } from "../src/config.ts";
import type { ToolContext } from "../src/tools/index.ts";
import type { HemmilesClient } from "../src/services/hemmiles-client.ts";
import type { SitemapService } from "../src/services/sitemap.ts";

export function stubContext(delayMs = 25, pageCount = 5): ToolContext {
  const pages = Array.from({ length: pageCount }, (_, i) => ({ path: `features/f${i}`, section: "features" }));
  const sitemap = {
    async getCanonicalPages() {
      await new Promise((r) => setTimeout(r, delayMs));
      return pages;
    },
    async getEntries() {
      return [];
    },
  } as unknown as SitemapService;
  const client = {
    async fetchHtml() {
      throw new Error("network disabled in tests");
    },
  } as unknown as HemmilesClient;
  return { client, sitemap, config: { ...loadConfig(), defaultLocale: "global" } };
}

export async function listen(server: Server): Promise<number> {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  return (server.address() as AddressInfo).port;
}

export async function close(server: Server): Promise<void> {
  server.closeAllConnections?.();
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

export interface RawResponse {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
}

export function send(
  port: number,
  opts: { method?: string; path?: string; headers?: Record<string, string>; body?: string | Buffer },
): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    const req = httpRequest(
      {
        host: "127.0.0.1",
        port,
        method: opts.method ?? "POST",
        path: opts.path ?? "/mcp",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          ...opts.headers,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () =>
          resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks).toString("utf8") }),
        );
        res.on("error", reject);
      },
    );
    // A server that rejects an oversized body may close the socket mid-upload.
    req.on("error", reject);
    if (opts.body !== undefined) req.write(opts.body);
    req.end();
  });
}

export function rpc(id: number, method: string, params: Record<string, unknown> = {}): string {
  return JSON.stringify({ jsonrpc: "2.0", id, method, params });
}

export function callTool(id: number, name: string, args: Record<string, unknown> = {}): string {
  return rpc(id, "tools/call", { name, arguments: args });
}
