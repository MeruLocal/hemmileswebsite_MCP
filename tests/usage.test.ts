import { test } from "node:test";
import assert from "node:assert/strict";
import { createHttpApp } from "../src/http.ts";
import { loadHttpSecurityConfig } from "../src/http-security.ts";
import { clientFromUserAgent, setUsageSink, usageLogEnabled } from "../src/utils/usage.ts";
import { connect } from "./mcp-helpers.ts";
import { callTool, close, listen, send, stubContext } from "./http-helpers.ts";

function capture() {
  const lines: Array<Record<string, unknown>> = [];
  setUsageSink((l) => lines.push(l));
  return { lines, restore: () => setUsageSink(undefined) };
}

const FORBIDDEN_KEYS = ["arguments", "args", "query", "path", "url", "ip"];

test("one record per successful call, with tool/ms/ok and no argument data", async () => {
  const { lines, restore } = capture();
  const { client, close: done } = await connect(stubContext(1));
  try {
    await client.callTool({ name: "hemmiles_list_pages", arguments: { section: "features", response_format: "json" } });
    assert.equal(lines.length, 1);
    const rec = lines[0]!;
    assert.equal(rec.event, "tool_call");
    assert.equal(rec.tool, "hemmiles_list_pages");
    assert.equal(rec.ok, true);
    assert.equal(typeof rec.ms, "number");
    assert.equal(rec.client, "test-client", "stdio-style sessions use clientInfo.name");
    for (const k of FORBIDDEN_KEYS) assert.ok(!(k in rec), `no ${k}`);
    assert.doesNotMatch(JSON.stringify(rec), /features/, "argument values never appear");
  } finally {
    await done();
    restore();
  }
});

test("a failing call records ok:false with the HemmilesError code", async () => {
  const { lines, restore } = capture();
  const { client, close: done } = await connect(stubContext(1));
  try {
    const res = await client.callTool({ name: "hemmiles_get_page", arguments: { path: "/api/secret" } });
    assert.equal(res.isError, true);
    assert.equal(lines.length, 1);
    assert.equal(lines[0]!.ok, false);
    assert.equal(lines[0]!.errorCode, "DISALLOWED_PATH");
    assert.ok(!JSON.stringify(res).includes("hemmiles.errorCode"), "the code is not sent to the client");
    assert.doesNotMatch(JSON.stringify(lines[0]), /secret/);
  } finally {
    await done();
    restore();
  }
});

test("stateless HTTP uses the User-Agent's first product token as the client", async () => {
  const { lines, restore } = capture();
  const app = createHttpApp(stubContext(1), { security: loadHttpSecurityConfig({ MCP_RATE_LIMIT_PER_MINUTE: "0" }) });
  const port = await listen(app);
  try {
    const r = await send(port, { headers: { "User-Agent": "claude-ai/1.0 (+test)" }, body: callTool(1, "hemmiles_list_pages") });
    assert.equal(r.status, 200);
    assert.equal(lines.length, 1);
    assert.equal(lines[0]!.client, "claude-ai");
  } finally {
    await close(app);
    restore();
  }
});

test("clientFromUserAgent and the HEMMILES_USAGE_LOG switch", () => {
  assert.equal(clientFromUserAgent("node"), "node");
  assert.equal(clientFromUserAgent(undefined), "unknown");
  assert.equal(clientFromUserAgent("bad<x>\"name/1 more"), "badxname");
  assert.equal(clientFromUserAgent("x".repeat(100)).length, 40);
  assert.equal(usageLogEnabled({}), true);
  assert.equal(usageLogEnabled({ HEMMILES_USAGE_LOG: "0" }), false);
});

test("HEMMILES_USAGE_LOG=0 records nothing", async () => {
  const { lines, restore } = capture();
  process.env.HEMMILES_USAGE_LOG = "0";
  const { client, close: done } = await connect(stubContext(1));
  try {
    await client.callTool({ name: "hemmiles_list_pages", arguments: {} });
    assert.equal(lines.length, 0);
  } finally {
    delete process.env.HEMMILES_USAGE_LOG;
    await done();
    restore();
  }
});
