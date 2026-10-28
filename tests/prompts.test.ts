import { test } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.ts";
import { loadConfig } from "../src/config.ts";

async function connect() {
  const { server } = createServer(loadConfig());
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "t", version: "1" });
  await Promise.all([server.connect(b), client.connect(a)]);
  return client;
}

test("lists three buyer prompts and renders one", async () => {
  const client = await connect();
  const { prompts } = await client.listPrompts();
  assert.deepEqual(prompts.map((p) => p.name).sort(), [
    "evaluate_field_visit_app_for_team",
    "find_field_sales_guide",
    "hemmiles_pricing_for_market",
  ]);
  const r = await client.getPrompt({ name: "hemmiles_pricing_for_market", arguments: { country: "in" } });
  const text = (r.messages[0]!.content as { text: string }).text;
  assert.match(text, /hemmiles_get_pricing/);
  assert.match(text, /cite the hemmiles\.com URLs/);
  assert.doesNotMatch(text, /₹|\$\d/);
  await client.close();
});
