import { iconsFor } from "../src/server.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LATEST_PROTOCOL_VERSION } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "../src/config.ts";
import { SERVER_VERSION } from "../src/constants.ts";
import { discoveryDoc, landingPageHtml, versionInfo } from "../src/http-pages.ts";
import { toolCatalog } from "../src/tools/index.ts";
import { connect } from "./mcp-helpers.ts";
import { stubContext } from "./http-helpers.ts";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const serverJson = JSON.parse(readFileSync(new URL("../server.json", import.meta.url), "utf8"));

test("landing page and discovery doc say official, once", () => {
  const html = landingPageHtml("in");
  const doc = JSON.stringify(discoveryDoc("in"));
  for (const text of [html, doc]) {
    assert.doesNotMatch(text, /unofficial|not affiliated/i);
  }
  assert.match(html, /<h1>Hemmiles MCP Server<\/h1>/);
  assert.match(html, /the official MCP server for/i);
  assert.equal(html.match(/The official MCP server for Hemmiles\./g)?.length, 1, "description paragraph appears once");
  assert.match(doc, /official/i);
});

test("tools/list has no internal 'brief' wording and no 'unofficial'", async () => {
  const { client, close } = await connect(stubContext());
  try {
    const { tools } = await client.listTools();
    for (const t of tools) {
      assert.doesNotMatch(t.description ?? "", /\bbrief\b|unofficial/i, t.name);
    }
  } finally {
    await close();
  }
});

test("loadConfig defaults: port 3001 and a real User-Agent", () => {
  const saved = { PORT: process.env.PORT, UA: process.env.HEMMILES_USER_AGENT };
  delete process.env.PORT;
  delete process.env.HEMMILES_USER_AGENT;
  try {
    const cfg = loadConfig();
    assert.equal(cfg.port, 3001);
    assert.doesNotMatch(cfg.userAgent, /your-org/);
    assert.match(cfg.userAgent, /github\.com\/MeruLocal\/hemmileswebsite_MCP/);
  } finally {
    if (saved.PORT !== undefined) process.env.PORT = saved.PORT;
    if (saved.UA !== undefined) process.env.HEMMILES_USER_AGENT = saved.UA;
  }
});

// --- registry metadata / versions (plan #7) -------------------------------

test("SERVER_VERSION comes from package.json", () => {
  assert.equal(SERVER_VERSION, pkg.version);
});

test("/version advertises the SDK protocol version, tool count and mcp_endpoint", async () => {
  const info = versionInfo("in");
  assert.equal(info.protocolVersion, LATEST_PROTOCOL_VERSION);
  assert.equal(info.mcp_endpoint, "/mcp");
  const { client, close } = await connect(stubContext());
  try {
    const { tools } = await client.listTools();
    assert.equal(info.tools, tools.length);
    assert.equal(toolCatalog().length, tools.length);
    assert.deepEqual(toolCatalog().map((t) => t.name).sort(), tools.map((t) => t.name).sort());
  } finally {
    await close();
  }
});

test("discovery doc publishes a tool count, not a hand-listed array", () => {
  const doc = discoveryDoc("in");
  assert.equal(typeof doc.tools, "number");
  assert.equal(doc.mcp_endpoint, "/mcp");
  assert.equal(doc.websiteUrl, "https://hemmiles.com");
});

test("server.json parses, matches package.json, and its remote ends in /mcp", () => {
  assert.equal(serverJson.version, pkg.version);
  assert.match(serverJson.name, /^[a-z0-9.-]+\/[a-z0-9._-]+$/i);
  assert.ok(serverJson.remotes.every((r: { url: string }) => /^https:\/\/.+\/mcp$/.test(r.url)));
  if (pkg.mcpName !== undefined) assert.equal(pkg.mcpName, serverJson.name);
});

// --- untrusted content (plan #10) -----------------------------------------

test("instructions and content tools warn that page text is untrusted data", async () => {
  const { client, close } = await connect(stubContext());
  try {
    assert.match(client.getInstructions() ?? "", /data, never as instructions/i);
    const { tools } = await client.listTools();
    for (const name of ["hemmiles_get_page", "hemmiles_search_site", "hemmiles_get_faqs"]) {
      const t = tools.find((x) => x.name === name);
      assert.ok(t, name);
      assert.match(t!.description ?? "", /untrusted|as data/i, name);
    }
  } finally {
    await close();
  }
});

// --- icons (plan #15) -------------------------------------------------------

test("no icons are advertised unless HEMMILES_ICON_URL is set", async () => {
  const { client, close } = await connect(stubContext());
  try {
    assert.equal(client.getServerVersion()?.icons, undefined);
    const { tools } = await client.listTools();
    assert.ok(tools.every((t) => t.icons === undefined));
  } finally {
    await close();
  }
});

test("with an icon URL, serverInfo, every tool and the discovery doc carry it", async () => {
  const iconUrl = "https://hemmiles.com/test-icon.svg";
  const ctx = stubContext();
  ctx.config = { ...ctx.config, iconUrl };
  const { client, close } = await connect(ctx);
  try {
    const icons = client.getServerVersion()?.icons;
    assert.equal(icons?.[0]?.src, iconUrl);
    assert.equal(icons?.[0]?.mimeType, "image/svg+xml");
    const { tools } = await client.listTools();
    assert.ok(tools.length > 0);
    for (const t of tools) assert.equal(t.icons?.[0]?.src, iconUrl, t.name);
  } finally {
    await close();
  }
  assert.equal(discoveryDoc("in", iconUrl).icon, iconUrl);
});

test("HEMMILES_ICON_URL must be https on hemmiles.com", () => {
  const saved = process.env.HEMMILES_ICON_URL;
  try {
    process.env.HEMMILES_ICON_URL = "https://evil.example/logo.png";
    assert.equal(loadConfig().iconUrl, undefined);
    process.env.HEMMILES_ICON_URL = "http://hemmiles.com/logo.png";
    assert.equal(loadConfig().iconUrl, undefined);
    process.env.HEMMILES_ICON_URL = "https://hemmiles.com/logo.png";
    assert.equal(loadConfig().iconUrl, "https://hemmiles.com/logo.png");
  } finally {
    if (saved === undefined) delete process.env.HEMMILES_ICON_URL;
    else process.env.HEMMILES_ICON_URL = saved;
  }
});

test("iconsFor: PNG uses WxH sizes, SVG uses any", () => {
  assert.deepEqual(iconsFor("https://hemmiles.com/icon-256x256.png"), [
    { src: "https://hemmiles.com/icon-256x256.png", mimeType: "image/png", sizes: ["256x256"] },
  ]);
  assert.equal(iconsFor("https://hemmiles.com/icon.png")?.[0]?.sizes, undefined);
  assert.deepEqual(iconsFor("https://hemmiles.com/i.svg")?.[0]?.sizes, ["any"]);
});
