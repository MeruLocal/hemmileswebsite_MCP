#!/usr/bin/env node
/**
 * Version-parity check: package.json and server.json must agree, so a release
 * cannot advertise one version to npm and another to the MCP Registry.
 * If package.json carries `mcpName` (needed only for npm publishing), it must
 * equal server.json `name`. Exits non-zero on any mismatch.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(readFileSync(`${root}package.json`, "utf8"));
const server = JSON.parse(readFileSync(`${root}server.json`, "utf8"));

const problems = [];
if (pkg.version !== server.version) {
  problems.push(`package.json version ${pkg.version} != server.json version ${server.version}`);
}
for (const p of server.packages ?? []) {
  if (p.version !== undefined && p.version !== pkg.version) {
    problems.push(`server.json packages[${p.identifier}] version ${p.version} != package.json ${pkg.version}`);
  }
}
if (pkg.mcpName !== undefined && pkg.mcpName !== server.name) {
  problems.push(`package.json mcpName ${pkg.mcpName} != server.json name ${server.name}`);
}
for (const r of server.remotes ?? []) {
  if (!/^https:\/\/.+\/mcp$/.test(r.url ?? "")) problems.push(`server.json remote url ${r.url} must be https and end in /mcp`);
}

if (problems.length) {
  for (const p of problems) console.error(`check-versions: ${p}`);
  process.exit(1);
}
console.log(`check-versions: ok (${pkg.version})`);
