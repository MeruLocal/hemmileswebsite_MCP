# Plan: add CI (typecheck, build, test) and optional lint

- **Severity:** P2
- **Effort:** S

## Finding

- No `.github/` directory: nothing runs typecheck, build or tests on push or PR. Merges rely on whoever ran `npm test` locally.
- Locally on `main`: `npm ci` is clean (0 vulnerabilities), `npm run typecheck` passes, `npm test` gives 23/23 pass (Node 22.22.0).
- No linter is configured. `package.json` has `build`, `typecheck`, `test`, `test:coverage`; no `lint`.

## Proposed fix

- `.github/workflows/ci.yml`:
  ```
  on: push (branches: main), pull_request
  permissions: contents: read
  concurrency: cancel in-progress per ref
  jobs.ci: ubuntu-latest, actions/checkout@v4, actions/setup-node@v4 (node-version 22, cache npm)
    npm ci
    npm run typecheck
    npm run build
    npm test
  ```
  Pin actions to major versions (or SHAs, if the org requires it).
- Once the registry plan lands, add the `node scripts/check-versions.mjs` step.
- **ESLint (light, optional second commit):**
  - `eslint` + `typescript-eslint` flat config (`eslint.config.js`) with `recommended` rules only, over `src/` and `tests/`
  - `"lint": "eslint ."`, run in CI after typecheck
  - Fix or disable any initial findings in the same PR so CI starts green.
- Tests cannot reach hemmiles.com in CI. The current tests are offline (fixtures, SSRF rejections before network). Keep it that way.

## Tests to add

The workflow is the test. Verify with a draft PR run: green on the plan's branch, and red on a throwaway commit with a type error.

## Risks / decisions

- **Decision:** include ESLint now or later. Adding it brings dev dependencies and a possible one-off cleanup diff.
- If branch protection should require this check, a repo admin must set that; CI cannot.

## Re-audit correction (2026-10-14, new audit skill)

- The audit skill (§4 D4) expects CI to also run `npm audit --omit=dev`. Add it as a step after `npm ci` (today: 0 vulnerabilities, re-measured 2026-10-14). Use `--audit-level=high` so a low-severity advisory does not block every PR.
- Re-measured on `main` (14fc7e9): `npm ci` clean, `npm run typecheck` passes, `npm test` 23/23 pass (Node 22.22.0). Still no `.github/` directory.
- The README grep checks proposed in the readme-hardcoded-facts and readme-personal-path plans can be added here as one optional `docs` step once those plans land.
