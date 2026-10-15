#!/usr/bin/env node
/**
 * README hygiene checks:
 *   - no hard-coded prices (currency symbol followed by a digit); pricing is
 *     read live by hemmiles_get_pricing
 *   - no personal Windows user-folder paths
 * Exits non-zero on any hit.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const lines = readFileSync(`${root}README.md`, "utf8").split("\n");
const rules = [
  { re: /[₹$€£]\s?\d/, why: "hard-coded price (call hemmiles_get_pricing instead)" },
  { re: /[A-Z]:\\\\?Users\\\\?/i, why: "personal Windows user path" },
];
let bad = 0;
lines.forEach((line, i) => {
  for (const { re, why } of rules) {
    if (re.test(line)) {
      console.error(`README.md:${i + 1}: ${why}`);
      bad++;
    }
  }
});
if (bad) process.exit(1);
console.log("check-docs: ok");
