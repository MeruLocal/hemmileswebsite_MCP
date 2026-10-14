import { test } from "node:test";
import assert from "node:assert/strict";
import { HemmilesClient } from "../src/services/hemmiles-client.ts";
import { HemmilesError } from "../src/utils/errors.ts";
import { loadConfig } from "../src/config.ts";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { MAX_RESPONSE_BYTES } from "../src/constants.ts";
import { SitemapService } from "../src/services/sitemap.ts";
import { connect } from "./mcp-helpers.ts";

function client(): HemmilesClient {
  return new HemmilesClient({ ...loadConfig(), maxRetries: 0, minRequestIntervalMs: 0, cacheTtlMs: 0 });
}

test("fetchHtml rejects non-allowlisted hosts before any network call", async () => {
  await assert.rejects(
    () => client().fetchHtml("https://evil.example.com/"),
    (e) => e instanceof HemmilesError && e.code === "INVALID_URL",
  );
});

test("fetchHtml rejects http (non-https)", async () => {
  await assert.rejects(
    () => client().fetchHtml("http://hemmiles.com/"),
    (e) => e instanceof HemmilesError && e.code === "INVALID_URL",
  );
});

test("fetchHtml refuses robots-disallowed /api paths", async () => {
  await assert.rejects(
    () => client().fetchHtml("https://hemmiles.com/api/internal"),
    (e) => e instanceof HemmilesError && e.code === "DISALLOWED_PATH",
  );
});

// ---------------------------------------------------------------------------
// Response guards, tested against a local HTTP server. The URL allowlist is NOT
// loosened: requests still use https://hemmiles.com/... URLs, and only the
// injected fetch maps them onto the local server.


async function withLocalServer(
  handler: (req: IncomingMessage, res: ServerResponse) => void,
  run: (c: HemmilesClient, hits: () => number) => Promise<void>,
  cacheTtlMs = 0,
): Promise<void> {
  let hits = 0;
  const srv = createServer((req, res) => {
    hits++;
    handler(req, res);
  });
  await new Promise<void>((r) => srv.listen(0, "127.0.0.1", r));
  const port = (srv.address() as AddressInfo).port;
  const c = new HemmilesClient(
    { ...loadConfig(), maxRetries: 0, minRequestIntervalMs: 0, cacheTtlMs },
    (input, init) => fetch(`http://127.0.0.1:${port}${new URL(input).pathname}`, init),
  );
  try {
    await run(c, () => hits);
  } finally {
    srv.closeAllConnections();
    await new Promise<void>((r) => srv.close(() => r()));
  }
}

test("a declared Content-Length over 2 MB is refused without reading the body", async () => {
  let bytesWritten = 0;
  await withLocalServer(
    (_req, res) => {
      res.writeHead(200, { "Content-Type": "text/html", "Content-Length": "3000000" });
      const chunk = Buffer.alloc(64 * 1024, 0x61);
      bytesWritten += chunk.length;
      res.write(chunk); // the rest never arrives; the client must not wait for it
    },
    async (c) => {
      await assert.rejects(
        () => c.fetchHtml("https://hemmiles.com/big"),
        (e) => e instanceof HemmilesError && e.code === "HTTP_ERROR" && /too large/i.test(e.message),
      );
    },
  );
  assert.ok(bytesWritten < MAX_RESPONSE_BYTES);
});

test("a chunked 3 MB body without Content-Length is cut off after ~2 MB", async () => {
  await withLocalServer(
    (_req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      const chunk = Buffer.alloc(256 * 1024, 0x61);
      let sent = 0;
      const pump = () => {
        while (sent < 3 * 1024 * 1024) {
          sent += chunk.length;
          if (!res.write(chunk)) return void res.once("drain", pump);
        }
        res.end();
      };
      res.on("error", () => undefined);
      pump();
    },
    async (c) => {
      await assert.rejects(
        () => c.fetchHtml("https://hemmiles.com/stream"),
        (e) => e instanceof HemmilesError && e.code === "HTTP_ERROR" && /too large/i.test(e.message),
      );
    },
  );
});

test("a non-HTML content type (image/png) is refused", async () => {
  await withLocalServer(
    (_req, res) => {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    },
    async (c) => {
      await assert.rejects(
        () => c.fetchHtml("https://hemmiles.com/logo"),
        (e) => e instanceof HemmilesError && e.code === "HTTP_ERROR" && /content type/i.test(e.message),
      );
    },
  );
});

test("normal HTML and XML responses are read", async () => {
  await withLocalServer(
    (req, res) => {
      const xml = req.url?.endsWith(".xml");
      res.writeHead(200, { "Content-Type": xml ? "application/xml" : "text/html; charset=utf-8" });
      res.end(xml ? "<urlset></urlset>" : "<html><title>ok</title></html>");
    },
    async (c) => {
      assert.match((await c.fetchHtml("https://hemmiles.com/page")).html, /ok/);
      assert.match((await c.fetchHtml("https://hemmiles.com/sitemap.xml")).html, /urlset/);
    },
  );
});

test("NOT_FOUND is cached for the TTL (no second fetch), and not cached with TTL 0", async () => {
  await withLocalServer(
    (_req, res) => {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("missing");
    },
    async (c, hits) => {
      for (let i = 0; i < 2; i++) {
        await assert.rejects(() => c.fetchHtml("https://hemmiles.com/privacy"), (e) => e instanceof HemmilesError && e.code === "NOT_FOUND");
      }
      assert.equal(hits(), 1);
    },
    60_000,
  );
  await withLocalServer(
    (_req, res) => {
      res.writeHead(404);
      res.end();
    },
    async (c, hits) => {
      for (let i = 0; i < 2; i++) {
        await assert.rejects(() => c.fetchHtml("https://hemmiles.com/privacy"));
      }
      assert.equal(hits(), 2);
    },
    0,
  );
});

test("peekCached returns cached pages without network, else undefined", async () => {
  await withLocalServer(
    (_req, res) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<p>hi</p>");
    },
    async (c, hits) => {
      assert.equal(c.peekCached("https://hemmiles.com/a"), undefined);
      await c.fetchHtml("https://hemmiles.com/a");
      assert.equal(c.peekCached("https://hemmiles.com/a")?.html, "<p>hi</p>");
      assert.equal(hits(), 1);
    },
    60_000,
  );
});

test("hemmiles_get_policies: a second call within the TTL does not re-fetch missing pages", async () => {
  await withLocalServer(
    (_req, res) => {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end();
    },
    async (c, hits) => {
      const ctx = { client: c, sitemap: new SitemapService(c, 60_000), config: { ...loadConfig(), cacheTtlMs: 60_000, defaultLocale: "in" as const } };
      const { client, close } = await connect(ctx);
      try {
        await client.callTool({ name: "hemmiles_get_policies", arguments: { response_format: "json" } });
        const first = hits();
        assert.equal(first, 10, "5 topics x (localized + global)");
        const again = await client.callTool({ name: "hemmiles_get_policies", arguments: { response_format: "json" } });
        assert.equal(hits(), first, "no new fetches for known-missing pages");
        assert.equal((again.structuredContent as { unavailable: string[] }).unavailable.length, 5);
      } finally {
        await close();
      }
    },
    60_000,
  );
});
