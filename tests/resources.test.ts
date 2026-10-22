import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.ts";
import { loadConfig } from "../src/config.ts";

test("resources are listed and templates cover every market", async () => {
  const { server } = createServer(loadConfig());
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "t", version: "1" });
  await Promise.all([server.connect(b), client.connect(a)]);
  const { resources } = await client.listResources();
  const uris = resources.map((r) => r.uri);
  assert.ok(uris.includes("hemmiles://features"));
  assert.ok(uris.includes("hemmiles://company"));
  assert.ok(uris.includes("hemmiles://pricing/in"));
  assert.ok(uris.includes("hemmiles://faqs/pricing/us"));
  const { resourceTemplates } = await client.listResourceTemplates();
  assert.equal(resourceTemplates.length, 2);
  await client.close();
});
