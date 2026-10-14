/**
 * Typed errors and a single helper that turns any thrown value into a clear,
 * actionable message for an MCP client. Error text never contains secrets
 * (the server holds none) and avoids leaking internal stack details.
 */

export type HemmilesErrorCode =
  | "INVALID_INPUT"
  | "INVALID_URL"
  | "DISALLOWED_PATH"
  | "NOT_FOUND"
  | "HTTP_ERROR"
  | "TIMEOUT"
  | "NETWORK"
  | "TOO_MANY_REDIRECTS"
  | "PARSE_ERROR"
  | "RATE_LIMITED";

export class HemmilesError extends Error {
  public readonly code: HemmilesErrorCode;
  /** Optional HTTP status associated with the failure. */
  public readonly status?: number;

  constructor(code: HemmilesErrorCode, message: string, status?: number) {
    super(message);
    this.name = "HemmilesError";
    this.code = code;
    if (status !== undefined) this.status = status;
  }
}

/**
 * Convert any error into a user-facing, actionable string. Returned to the
 * caller as tool text (with `isError: true`) rather than thrown, so agents
 * receive guidance instead of a protocol-level failure.
 */
export function formatError(error: unknown): string {
  if (error instanceof HemmilesError) {
    switch (error.code) {
      case "NOT_FOUND":
        return `Error (NOT_FOUND): ${error.message} The page may not exist on hemmiles.com — try hemmiles_list_pages or hemmiles_search_site to find valid paths.`;
      case "DISALLOWED_PATH":
        return `Error (DISALLOWED_PATH): ${error.message} This path is blocked by the site's robots.txt and will not be requested.`;
      case "INVALID_URL":
        return `Error (INVALID_URL): ${error.message} Provide a path like "pricing" or a full https://hemmiles.com/... URL.`;
      case "TIMEOUT":
        return `Error (TIMEOUT): ${error.message} The site is slow or rate-limiting; retry shortly.`;
      case "RATE_LIMITED":
        return `Error (RATE_LIMITED): ${error.message} Wait a few seconds before retrying.`;
      case "NETWORK":
        return `Error (NETWORK): ${error.message} The connection to hemmiles.com failed; this is often transient — retry shortly.`;
      case "HTTP_ERROR":
        return `Error (HTTP_ERROR${error.status ? ` ${error.status}` : ""}): ${error.message}`;
      default:
        return `Error (${error.code}): ${error.message}`;
    }
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return `Error: ${String(error)}`;
}
