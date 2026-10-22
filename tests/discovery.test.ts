import { test } from "node:test";
import assert from "node:assert/strict";
import { serverCard, llmsTxt, robotsTxt, discoveryDoc } from "../src/http-pages.ts";

test("server card lists every tool and needs no auth", () => {
  const card = serverCard() as any;
  assert.equal(card.authentication.required, false);
  assert.equal(card.transport.endpoint, "https://mcp.hemmiles.com/mcp");
  const names = (discoveryDoc("in") as any).tools as string[];
  assert.deepEqual(card.tools.map((t: any) => t.name), names);
  assert.ok(card.tools.every((t: any) => t.readOnly === true));
});

test("llms.txt names the endpoint and cites canonical hemmiles.com URLs only", () => {
  const txt = llmsTxt();
  assert.match(txt, /https:\/\/mcp\.hemmiles\.com\/mcp/);
  assert.match(txt, /https:\/\/hemmiles\.com\/pricing/);
  assert.doesNotMatch(txt, /₹|\$\d/); // no prices hard-coded
  assert.match(robotsTxt(), /Allow: \//);
});
