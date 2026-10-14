import { test } from "node:test";
import assert from "node:assert/strict";
import { createHttpApp } from "../src/http.ts";
import { loadHttpSecurityConfig, MAX_BODY_BYTES } from "../src/http-security.ts";
import { callTool, close, listen, send, stubContext } from "./http-helpers.ts";

const security = (env: Record<string, string> = {}) => loadHttpSecurityConfig({ MCP_RATE_LIMIT_PER_MINUTE: "0", ...env });

test("6 concurrent tools/call requests all succeed (per-request McpServer)", async () => {
  const app = createHttpApp(stubContext(25), { security: security() });
  const port = await listen(app);
  try {
    const results = await Promise.all(
      Array.from({ length: 6 }, (_, i) =>
        send(port, { body: callTool(i + 1, "hemmiles_list_pages", { response_format: "json" }) }),
      ),
    );
    results.forEach((r, i) => {
      assert.equal(r.status, 200, r.body);
      const json = JSON.parse(r.body);
      assert.equal(json.id, i + 1);
      assert.equal(json.error, undefined, r.body);
      assert.equal(json.result.isError, undefined);
      assert.equal(json.result.structuredContent.total, 5);
    });
  } finally {
    await close(app);
  }
});

test("invalid JSON body returns 400 / -32700 without parser detail", async () => {
  const app = createHttpApp(stubContext(), { security: security() });
  const port = await listen(app);
  try {
    const r = await send(port, { body: "{not json" });
    assert.equal(r.status, 400);
    const json = JSON.parse(r.body);
    assert.equal(json.error.code, -32700);
    assert.equal(json.error.message, "Parse error: request body is not valid JSON.");
    assert.doesNotMatch(r.body, /position|Expected|Unexpected/);
  } finally {
    await close(app);
  }
});

test("Host evil.com is rejected with 403 before the body is read", async () => {
  const app = createHttpApp(stubContext(), { security: security() });
  const port = await listen(app);
  try {
    const r = await send(port, { headers: { Host: "evil.com" }, body: callTool(1, "hemmiles_list_pages") });
    assert.equal(r.status, 403);
    assert.equal(JSON.parse(r.body).error.code, -32000);
    const ok = await send(port, { headers: { Host: `localhost:${port}` }, body: callTool(2, "hemmiles_list_pages") });
    assert.equal(ok.status, 200);
  } finally {
    await close(app);
  }
});

test("Origin evil.com is rejected; loopback and allowlisted origins get CORS", async () => {
  const app = createHttpApp(stubContext(), { security: security() });
  const port = await listen(app);
  try {
    const bad = await send(port, { headers: { Origin: "https://evil.com" }, body: callTool(1, "hemmiles_list_pages") });
    assert.equal(bad.status, 403);
    const sneaky = await send(port, { headers: { Origin: "http://localhost.evil.com" }, body: callTool(1, "hemmiles_list_pages") });
    assert.equal(sneaky.status, 403);
    const good = await send(port, { headers: { Origin: "https://mcp.hemmiles.com" }, body: callTool(2, "hemmiles_list_pages") });
    assert.equal(good.status, 200);
    assert.equal(good.headers["access-control-allow-origin"], "https://mcp.hemmiles.com");
    assert.match(String(good.headers["access-control-expose-headers"]), /Mcp-Session-Id/);
  } finally {
    await close(app);
  }
});

test("OPTIONS preflight returns 204 with MCP CORS headers", async () => {
  const app = createHttpApp(stubContext(), { security: security() });
  const port = await listen(app);
  try {
    const r = await send(port, {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:6274", "Access-Control-Request-Method": "POST" },
    });
    assert.equal(r.status, 204);
    assert.equal(r.headers["access-control-allow-origin"], "http://localhost:6274");
    assert.match(String(r.headers["access-control-allow-headers"]), /Mcp-Protocol-Version/);
    assert.match(String(r.headers["access-control-allow-headers"]), /Mcp-Session-Id/);
    assert.equal(r.headers.vary, "Origin");
  } finally {
    await close(app);
  }
});

test("a body of 1 MB + 10 bytes is rejected with 413", async () => {
  const app = createHttpApp(stubContext(), { security: security() });
  const port = await listen(app);
  try {
    const r = await send(port, { body: Buffer.alloc(MAX_BODY_BYTES + 10, 0x20) });
    assert.equal(r.status, 413);
    assert.equal(JSON.parse(r.body).error.code, -32600);
  } finally {
    await close(app);
  }
});

test("an oversized chunked body without Content-Length is rejected with 413", async () => {
  const hits: string[] = [];
  const app = createHttpApp(stubContext(), { security: security(), onBodyTooLarge: (via) => hits.push(via) });
  const port = await listen(app);
  try {
    const r = await send(port, {
      headers: { "Transfer-Encoding": "chunked" },
      body: Buffer.alloc(MAX_BODY_BYTES + 10, 0x20),
    }).catch((e: Error) => ({ status: -1, headers: {}, body: e.message }));
    // Either a clean 413, or the socket was closed after the 413 was sent.
    assert.ok(r.status === 413 || r.status === -1, `status ${r.status}`);
    // Server-side proof the streaming cap (not a Content-Length check) fired.
    assert.deepEqual(hits, ["stream"]);
  } finally {
    await close(app);
  }
});

test("rate limit 3/minute gives [200,200,200,429] with Retry-After", async () => {
  const app = createHttpApp(stubContext(1), { security: security({ MCP_RATE_LIMIT_PER_MINUTE: "3" }) });
  const port = await listen(app);
  try {
    const statuses: number[] = [];
    let last;
    for (let i = 0; i < 4; i++) {
      last = await send(port, { body: callTool(i, "hemmiles_list_pages") });
      statuses.push(last.status);
    }
    assert.deepEqual(statuses, [200, 200, 200, 429]);
    assert.ok(Number(last!.headers["retry-after"]) >= 1);
    assert.equal(JSON.parse(last!.body).error.code, -32000);
  } finally {
    await close(app);
  }
});

test("public GET docs send Access-Control-Allow-Origin: *", async () => {
  const app = createHttpApp(stubContext(), { security: security() });
  const port = await listen(app);
  try {
    for (const path of ["/.well-known/mcp.json", "/health", "/version", "/"]) {
      const r = await send(port, { method: "GET", path });
      assert.equal(r.status, 200, path);
      assert.equal(r.headers["access-control-allow-origin"], "*", path);
    }
  } finally {
    await close(app);
  }
});

test("an empty POST body gets the same sanitized 400 / -32700 as invalid JSON", async () => {
  const app = createHttpApp(stubContext(), { security: security() });
  const port = await listen(app);
  try {
    const empty = await send(port, { body: "" });
    const bad = await send(port, { body: "{nope" });
    assert.equal(empty.status, 400);
    assert.equal(JSON.parse(empty.body).error.code, -32700);
    assert.equal(empty.body, bad.body);
  } finally {
    await close(app);
  }
});

test("only /mcp and /mcp/ are routed; /mcpfoo is 404", async () => {
  const app = createHttpApp(stubContext(), { security: security() });
  const port = await listen(app);
  try {
    assert.equal((await send(port, { path: "/mcpfoo", body: callTool(1, "hemmiles_list_pages") })).status, 404);
    assert.equal((await send(port, { path: "/mcp/", body: callTool(2, "hemmiles_list_pages") })).status, 200);
    const health = await send(port, { method: "GET", path: "/health" });
    assert.ok(Array.isArray(JSON.parse(health.body).hostCheck.allowedHosts));
  } finally {
    await close(app);
  }
});
