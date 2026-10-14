import { test } from "node:test";
import assert from "node:assert/strict";
import { enforceLimit, makeSnippet, squashWhitespace } from "../src/utils/format.ts";
import { formatError } from "../src/utils/errors.ts";
import { HemmilesError } from "../src/utils/errors.ts";
import { CHARACTER_LIMIT } from "../src/constants.ts";

test("squashWhitespace collapses runs of whitespace", () => {
  assert.equal(squashWhitespace("  a\n\n b   c "), "a b c");
});

test("enforceLimit truncates oversized text with a notice", () => {
  const big = "x".repeat(CHARACTER_LIMIT + 1000);
  const out = enforceLimit(big, "hint here");
  assert.ok(out.length <= CHARACTER_LIMIT);
  assert.match(out, /Response truncated/);
  assert.match(out, /hint here/);
});

test("enforceLimit leaves small text unchanged", () => {
  assert.equal(enforceLimit("short"), "short");
});

test("makeSnippet centers on the query match", () => {
  const text = "lorem ipsum offline mode dolor sit amet";
  const snip = makeSnippet(text, "offline", 5);
  assert.match(snip, /offline/);
  assert.ok(snip.includes("…"));
});

test("formatError produces actionable messages for known codes", () => {
  assert.match(formatError(new HemmilesError("NOT_FOUND", "no page")), /NOT_FOUND/);
  assert.match(formatError(new HemmilesError("DISALLOWED_PATH", "blocked")), /robots\.txt/);
  assert.match(formatError(new Error("boom")), /boom/);
});
