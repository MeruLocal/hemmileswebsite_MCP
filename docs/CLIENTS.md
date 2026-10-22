# Connecting a client

The public server is read-only and needs no API key: `https://mcp.hemmiles.com/mcp` (Streamable HTTP, stateless JSON).

| Client | How |
|---|---|
| Claude Code | `claude mcp add --transport http hemmiles https://mcp.hemmiles.com/mcp` |
| Claude Desktop / Claude.ai | Settings > Connectors > add custom connector, URL above. Older Desktop builds: `examples/claude-desktop.remote.json` (uses the `mcp-remote` bridge). |
| Cursor | `examples/cursor.mcp.json` into `~/.cursor/mcp.json` |
| VS Code | `examples/vscode.mcp.json` into `.vscode/mcp.json` |
| Local stdio | build (`npm install && npm run build`), then `examples/claude-desktop.stdio.json` |
| MCP Inspector | `npx @modelcontextprotocol/inspector --cli https://mcp.hemmiles.com/mcp --transport http --method tools/list` |

Quick check without a client:
```bash
curl -s https://mcp.hemmiles.com/mcp -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```
`GET /mcp` is not an SSE stream; use POST. Never send credentials to this server.
