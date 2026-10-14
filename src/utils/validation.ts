/**
 * URL / path validation and SSRF protection.
 *
 * Every outbound request passes through `assertAllowedUrl`, which enforces:
 *   - https only
 *   - host is on the allowlist (hemmiles.com, www.hemmiles.com; exact match)
 *   - path is not under a robots-disallowed prefix (/api/)
 *
 * `normalizeToPath` accepts either a bare path ("pricing", "/in/pricing") or a
 * full Hemmiles URL and returns a clean, root-relative path.
 */

import {
  ALLOWED_HOSTS,
  BASE_ORIGIN,
  DISALLOWED_PATH_PREFIXES,
  LOCALES,
  type Locale,
} from "../constants.js";
import { HemmilesError } from "./errors.js";

export function isAllowedHost(host: string): boolean {
  return ALLOWED_HOSTS.includes(host.toLowerCase());
}

export function isDisallowedPath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return DISALLOWED_PATH_PREFIXES.some(
    (prefix) => p === prefix || p.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`),
  );
}

/**
 * Throw unless `urlString` is a safe, allowed Hemmiles URL. Returns the parsed
 * URL on success. Used for both the initial request and every redirect hop.
 */
export function assertAllowedUrl(urlString: string): URL {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new HemmilesError("INVALID_URL", `"${urlString}" is not a valid URL.`);
  }
  if (url.protocol !== "https:") {
    throw new HemmilesError("INVALID_URL", `Only https is allowed, got "${url.protocol}".`);
  }
  if (!isAllowedHost(url.hostname)) {
    throw new HemmilesError(
      "INVALID_URL",
      `Host "${url.hostname}" is not allowed. Only hemmiles.com is permitted.`,
    );
  }
  if (isDisallowedPath(url.pathname)) {
    throw new HemmilesError(
      "DISALLOWED_PATH",
      `Path "${url.pathname}" is disallowed by robots.txt.`,
    );
  }
  return url;
}

/** Normalize caller input (path or full URL) to a root-relative path. */
export function normalizeToPath(input: string): string {
  const trimmed = (input ?? "").trim();
  if (trimmed === "") return "/";

  if (/^https?:\/\//i.test(trimmed)) {
    const url = assertAllowedUrl(trimmed);
    return url.pathname + url.search;
  }
  // Treat as a path; ensure a single leading slash, strip trailing slash.
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (isDisallowedPath(withSlash)) {
    throw new HemmilesError(
      "DISALLOWED_PATH",
      `Path "${withSlash}" is disallowed by robots.txt.`,
    );
  }
  return withSlash;
}

/** True if `value` is one of the known market locales. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Build an absolute Hemmiles URL for a canonical path + locale.
 * `global` (or empty) means the locale-less canonical path.
 */
export function buildUrl(path: string, locale: Locale): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  if (locale === "global") {
    return `${BASE_ORIGIN}/${clean}`.replace(/\/+$/, "") || BASE_ORIGIN;
  }
  const localized = clean ? `${locale}/${clean}` : locale;
  return `${BASE_ORIGIN}/${localized}`;
}

/** Strip a leading locale segment from a path, returning the canonical path. */
export function stripLocale(pathname: string): { locale: Locale | null; path: string } {
  const segments = pathname.replace(/^\/+/, "").split("/");
  const first = segments[0] ?? "";
  if (first !== "" && first !== "global" && isLocale(first)) {
    return { locale: first, path: segments.slice(1).join("/") };
  }
  return { locale: null, path: segments.join("/") };
}
