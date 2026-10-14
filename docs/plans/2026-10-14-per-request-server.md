# Plan: create a new McpServer per HTTP request (concurrency crash)

- **Severity:** P0
- **Effort:** S

## Finding

On the HTTP transport, a single `McpServer` is created once at startup (`src/index.ts:29`) and then `connect()`ed to a new `StreamableHTTPServerTransport` on every `POST /mcp` (`src/index.ts:87`). The SDK allows a server to be connected to only one transport at a time. So when requests overlap, every one except the first throws `Already connected to a transport`.

The catch block (`src/index.ts:91-101`) reports every exception as JSON-RPC `-32700 Parse error` with HTTP 400 and echoes the raw exception message. The request JSON was valid, so the code is wrong.

Evidence (measured on `main`, local build, `HEMMILES_TRANSPORT=http`):

```
3 concurrent tools/call hemmiles_list_pages:
  200 {"result":{...}}
  400 {"jsonrpc":"2.0","error":{"code":-32700,"message":"Parse error: Already connected to a transport. Call close() before co…
  400 {"jsonrpc":"2.0","error":{"code":-32700,"message":"Parse error: Already connected to a transport. Call close() before co…
invalid JSON body: -32700 "Parse error: Expected property name or '}' in JSON at position 1 (line 1 column 2)"
```

`audit-live-mcp.mjs` does not test concurrency. The baseline was 3 fail · 4 warn · 13 pass (scratch copy pointed at `/mcp` with a JSON-response fallback, since the script hard-codes `/sse` and SSE frames).

Not checked: behaviour under real production load, and content against the live hemmiles.com (sandbox egress is blocked).

## Proposed fix

1. `src/server.ts`: split `createServer()` into two functions.
   - `createToolContext(config)` builds the `HemmilesClient` and `SitemapService` once per process. These hold the page cache, the sitemap cache and the rate-limit gate, so they must be shared.
   - `createMcpServer(ctx)` returns a new `McpServer` with all tools registered. This is cheap: it does no network or cache work.
   - Keep `createServer()` as a wrapper for stdio.
2. New `src/http.ts` with `createHttpApp(ctx): http.Server`. Move the handler out of `index.ts` so tests can run it in-process. For each POST:
   ```
   parse body            -> on failure: 400, -32700 "Parse error: request body is not valid JSON." (no echo)
   server = createMcpServer(ctx); transport = new StreamableHTTPServerTransport({stateless, json})
   res.on('close') -> transport.close(); server.close()
   connect + handleRequest -> on failure: log detail to stderr; 500, -32603 "Internal server error."
   ```
3. `src/index.ts#runHttp`: `createToolContext()` once, then `createHttpApp(ctx).listen(...)`.

stdio is unchanged.

## Tests to add

`tests/http.test.ts`, with an in-process server on port 0 and a stub context whose sitemap returns fixed pages after ~25 ms (no network):
- 6 concurrent `tools/call hemmiles_list_pages`: all return 200, each with its own id and no `error`.
- An invalid JSON body returns 400 / `-32700`, and the message has no parser detail.

A prototype of this design was run before the switch to plan-only. The concurrency test passed with a per-request server and failed with a shared one ("Already connected to a transport"). The probe went from `200/400/400` to `200/200/200`.

## Risks / rollout

- Building a server per request re-registers 10 tools (cheap). Caches stay shared, so outbound load on hemmiles.com does not change.
- The HTTP-hardening plan touches the same handler and should be implemented after this one.
- No founder decision needed.
