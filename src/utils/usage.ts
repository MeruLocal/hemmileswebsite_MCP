/**
 * Tool-call usage records: which tool, which client, how long, and whether it
 * worked. One JSON line per call on stderr (safe for the stdio transport).
 *
 * Never recorded: tool arguments, query text, paths, URLs, IP addresses or
 * any response content. Turn off with HEMMILES_USAGE_LOG=0.
 */

export interface ToolCallRecord {
  tool: string;
  client: string;
  ms: number;
  ok: boolean;
  errorCode?: string;
}

export type UsageSink = (line: Record<string, unknown>) => void;

const stderrSink: UsageSink = (line) => {
  process.stderr.write(`${JSON.stringify(line)}\n`);
};

let sink: UsageSink = stderrSink;

/** Replace the sink (tests). Pass undefined to restore stderr. */
export function setUsageSink(next: UsageSink | undefined): void {
  sink = next ?? stderrSink;
}

export function usageLogEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const v = (env.HEMMILES_USAGE_LOG ?? "").trim().toLowerCase();
  return !(v === "0" || v === "false" || v === "off" || v === "no");
}

/** Keep client names short and log-safe. */
export function cleanClientName(raw: string | undefined): string {
  const name = (raw ?? "").trim().replace(/[^A-Za-z0-9._-]/g, "").slice(0, 40);
  return name || "unknown";
}

/** First product token of a User-Agent ("claude-ai/1.0 (x)" -> "claude-ai"). */
export function clientFromUserAgent(ua: string | undefined): string {
  const first = (ua ?? "").trim().split(/\s+/)[0] ?? "";
  return cleanClientName(first.split("/")[0]);
}

export function recordToolCall(rec: ToolCallRecord): void {
  if (!usageLogEnabled()) return;
  const line: Record<string, unknown> = {
    event: "tool_call",
    ts: new Date().toISOString(),
    tool: rec.tool,
    client: cleanClientName(rec.client),
    ms: Math.round(rec.ms),
    ok: rec.ok,
  };
  if (rec.errorCode) line.errorCode = rec.errorCode;
  try {
    sink(line);
  } catch {
    // Usage logging must never break a tool call.
  }
}
