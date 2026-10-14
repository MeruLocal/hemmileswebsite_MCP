/**
 * Shared response-formatting helpers: character-limit truncation and a small
 * markdown list builder reused across tools (DRY).
 */

import { CHARACTER_LIMIT } from "../constants.js";

/**
 * Enforce the response character budget. If `text` is too long, replace it
 * with a short, honest truncation notice plus as much of the head as fits.
 */
export function enforceLimit(text: string, hint?: string): string {
  if (text.length <= CHARACTER_LIMIT) return text;
  const notice =
    `\n\n---\n[Response truncated: ${text.length} characters exceeded the ${CHARACTER_LIMIT} limit.` +
    (hint ? ` ${hint}` : "") +
    `]`;
  const head = text.slice(0, Math.max(0, CHARACTER_LIMIT - notice.length));
  return head + notice;
}

/** Collapse whitespace and trim — used when turning DOM text into snippets. */
export function squashWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Build a short snippet around the first occurrence of `query` in `text`. */
export function makeSnippet(text: string, query: string, radius = 140): string {
  const clean = squashWhitespace(text);
  if (!query) return clean.slice(0, radius * 2);
  const idx = clean.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return clean.slice(0, radius * 2);
  const start = Math.max(0, idx - radius);
  const end = Math.min(clean.length, idx + query.length + radius);
  return (start > 0 ? "…" : "") + clean.slice(start, end) + (end < clean.length ? "…" : "");
}
