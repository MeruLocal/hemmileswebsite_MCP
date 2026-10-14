/**
 * Shared tool infrastructure: the tool context, a consistent result builder,
 * a uniform error wrapper, and locale resolution. Keeping these here avoids
 * duplicating response/error logic across every tool (DRY).
 */

import type { ServerConfig } from "../config.js";
import type { HemmilesClient } from "../services/hemmiles-client.js";
import type { SitemapService } from "../services/sitemap.js";
import { type Locale } from "../constants.js";
import { isLocale } from "../utils/validation.js";
import { formatError } from "../utils/errors.js";
import { enforceLimit } from "../utils/format.js";
import { ResponseFormat, type ResponseFormatValue } from "../schemas/product.js";

export interface ToolContext {
  client: HemmilesClient;
  sitemap: SitemapService;
  config: ServerConfig;
}

export interface ToolResult {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
  /** The SDK's CallToolResult carries an open index signature; mirror it. */
  [key: string]: unknown;
}

/** Resolve the effective locale for a call, falling back to the config default. */
export function resolveLocale(ctx: ToolContext, requested?: string): Locale {
  if (requested && isLocale(requested)) return requested;
  return ctx.config.defaultLocale;
}

/**
 * Build a successful tool result. `structured` is returned verbatim as
 * structuredContent; `markdown` is used for the human-readable text when the
 * caller asked for markdown, otherwise pretty JSON of `structured` is shown.
 */
export function success(
  structured: Record<string, unknown>,
  markdown: string,
  format: ResponseFormatValue,
  truncationHint?: string,
): ToolResult {
  const text =
    format === ResponseFormat.JSON ? JSON.stringify(structured, null, 2) : markdown;
  return {
    content: [{ type: "text", text: enforceLimit(text, truncationHint) }],
    structuredContent: structured,
  };
}

/** Run a tool body, converting any thrown error into an actionable result. */
export async function runTool(fn: () => Promise<ToolResult>): Promise<ToolResult> {
  try {
    return await fn();
  } catch (error) {
    return {
      content: [{ type: "text", text: formatError(error) }],
      isError: true,
    };
  }
}

export const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;
