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
import { formatError, HemmilesError } from "../utils/errors.js";
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

/**
 * Error code of a failed tool result, for usage records. A symbol key, so it
 * is never serialized to the client.
 */
export const ERROR_CODE = Symbol("hemmiles.errorCode");

/** Run a tool body, converting any thrown error into an actionable result. */
export async function runTool(fn: () => Promise<ToolResult>): Promise<ToolResult> {
  try {
    return await fn();
  } catch (error) {
    const result: ToolResult = {
      content: [{ type: "text", text: formatError(error) }],
      isError: true,
    };
    Object.defineProperty(result, ERROR_CODE, {
      value: error instanceof HemmilesError ? error.code : "INTERNAL",
      enumerable: false,
    });
    return result;
  }
}

export interface Page<T> {
  rows: T[];
  total: number;
  offset: number;
  count: number;
  has_more: boolean;
  next_offset?: number;
}

/** Slice already-filtered, already-sorted rows into one page. */
export function paginate<T>(rows: readonly T[], offset: number, limit: number): Page<T> {
  const start = Math.max(0, Math.floor(offset));
  const size = Math.max(0, Math.floor(limit));
  const slice = rows.slice(start, start + size);
  const hasMore = start + slice.length < rows.length;
  const page: Page<T> = { rows: slice, total: rows.length, offset: start, count: slice.length, has_more: hasMore };
  if (hasMore) page.next_offset = start + slice.length;
  return page;
}

/** Fields of a Page for structuredContent (everything except the rows). */
export function pageMeta<T>(p: Page<T>): Record<string, unknown> {
  const meta: Record<string, unknown> = { total: p.total, count: p.count, offset: p.offset, has_more: p.has_more };
  if (p.next_offset !== undefined) meta.next_offset = p.next_offset;
  return meta;
}

/** "Showing X–Y of N." plus a next-offset hint when there is more. */
export function pageLine<T>(p: Page<T>): string {
  if (p.count === 0) return `Showing 0 of ${p.total}.`;
  const line = `Showing ${p.offset + 1}–${p.offset + p.count} of ${p.total}.`;
  return p.next_offset !== undefined ? `${line} Use offset=${p.next_offset} for more.` : line;
}

export const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
} as const;
