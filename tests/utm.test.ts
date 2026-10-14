import { test } from "node:test";
import assert from "node:assert/strict";
import { withUtm } from "../src/utils/utm.ts";

test("tags hemmiles.com URLs with source, medium and campaign", () => {
  const u = new URL(withUtm("https://hemmiles.com/in/demo", "hemmiles_get_started"));
  assert.equal(u.searchParams.get("utm_source"), "mcp");
  assert.equal(u.searchParams.get("utm_medium"), "ai_agent");
  assert.equal(u.searchParams.get("utm_campaign"), "hemmiles_get_started");
  assert.equal(u.pathname, "/in/demo");
});

test("preserves the existing query and fragment", () => {
  const out = withUtm("https://www.hemmiles.com/pricing?plan=a#faq", "hemmiles_get_pricing");
  const u = new URL(out);
  assert.equal(u.searchParams.get("plan"), "a");
  assert.equal(u.hash, "#faq");
  assert.equal(u.searchParams.get("utm_campaign"), "hemmiles_get_pricing");
});

test("does not double-tag or overwrite existing UTM values", () => {
  const once = withUtm("https://hemmiles.com/contact", "hemmiles_get_contact_options");
  const twice = withUtm(once, "other_tool");
  assert.equal(twice, once);
  assert.equal(new URL(twice).searchParams.getAll("utm_source").length, 1);
});

test("leaves external hosts, mailto: and junk alone", () => {
  assert.equal(withUtm("https://www.linkedin.com/company/example", "t"), "https://www.linkedin.com/company/example");
  assert.equal(withUtm("https://hemmiles.com.evil.example/x", "t"), "https://hemmiles.com.evil.example/x");
  assert.equal(withUtm("mailto:someone@example.com", "t"), "mailto:someone@example.com");
  assert.equal(withUtm("not a url", "t"), "not a url");
});
