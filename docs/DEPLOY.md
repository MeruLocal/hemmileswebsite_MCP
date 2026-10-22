# Remote deployment plan (documentation only; nothing is deployed by this PR)

Current state (observed 2026-10-22): `https://mcp.hemmiles.com` is already live behind Cloudflare/Apache, HTTP transport, version 1.0.0. The deployed commit is not recorded anywhere in the repo. This plan makes redeploys repeatable.

1. **Build image:** the repo `Dockerfile` (Node, `HEMMILES_TRANSPORT=http`, `PORT`). Tag images with the git SHA.
2. **Expose the SHA:** return `commit` from `/version` (set `GIT_SHA` at build time) so "what is live" is answerable from outside.
3. **Env:** `HEMMILES_TRANSPORT=http`, `PORT`, `HEMMILES_DEFAULT_LOCALE=in` (decide per audience), `HEMMILES_CACHE_TTL_SECONDS=300`. No secrets exist; do not add any.
4. **Edge:** Cloudflare proxy already in front; add a rate-limit rule on `POST /mcp` at the edge as well as in-process, and cache `GET /.well-known/*`, `/llms.txt`.
5. **Health:** `/health` for the load balancer; alert when `uptimeSeconds` resets repeatedly or `/mcp` `tools/list` fails (see `docs/CLIENTS.md` curl).
6. **Rollout:** deploy to a second hostname first, run the acceptance checks (tools/list, `evaluations/hemmiles.xml`), then switch DNS/proxy. Keep the previous image for rollback.
7. **Order of merges:** concurrency fix (#16 or #21) first, then content filter, discovery files, prompts, resources, docs.
