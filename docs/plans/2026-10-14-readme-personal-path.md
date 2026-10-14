# Plan: remove the personal machine path from the README setup example

- **Severity:** P2
- **Effort:** S
- **Audit check:** skill §4 D6 (repo hygiene)

## Finding

- `README.md:146` says "**Windows** (this machine's path):" and `README.md:153` shows `"C:\\Users\\Hp\\Desktop\\Hemmiles_MCP\\dist\\index.js"`. That is a developer's personal Windows user folder, published in a public repo.
- The folder name `Hemmiles_MCP` also differs from the repo name `hemmileswebsite_MCP`, so a reader copying it gets a wrong path.
- Related port drift (README 3000 vs Docker 3001) is already covered by plan #4 (official identity); not repeated here.

## Proposed fix

- `README.md` Windows block: heading "**Windows** (adjust the path)" and `"C:\\path\\to\\hemmileswebsite_MCP\\dist\\index.js"`.
- macOS/Linux block (`README.md:169`): `/absolute/path/to/hemmileswebsite_MCP/dist/index.js`.
- The project-tree block (`README.md:282`, `Hemmiles_MCP/`) gets the repo name too.
- Optionally add an `npx` variant once the package is published (see plan #7).

## Tests to add

- None in code. Optional CI grep (CI plan #9): fail if `README.md` matches `/[A-Z]:\\\\Users\\\\/`.

## Risks / decisions

- Docs only. No founder decision needed.
