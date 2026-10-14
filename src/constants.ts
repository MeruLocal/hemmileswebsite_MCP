import { createRequire } from "node:module";

/**
 * Shared constants for the Hemmiles MCP server.
 *
 * Everything here is derived from a direct inspection of the public
 * hemmiles.com site (robots.txt, sitemaps, and server-rendered JSON-LD).
 * No endpoints or data are invented.
 */

/** Canonical origin. The server restricts all requests to this host. */
export const BASE_ORIGIN = "https://hemmiles.com";

/**
 * The only hosts the client is permitted to contact (SSRF allowlist). Exact
 * matches: other subdomains are NOT allowed unless listed here.
 */
export const ALLOWED_HOSTS: readonly string[] = ["hemmiles.com", "www.hemmiles.com"];

/**
 * robots.txt disallows `/api/` for every user agent, so the client refuses
 * any path under this prefix regardless of what a caller asks for.
 */
export const DISALLOWED_PATH_PREFIXES: readonly string[] = ["/api/", "/api"];

/** Market locales advertised via hreflang in the sitemap. */
export const LOCALES = [
  "global",
  "in",
  "us",
  "gb",
  "ca",
  "au",
  "nz",
  "ie",
  "sg",
  "ae",
  "za",
] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Canonical, locale-agnostic page paths discovered in sitemaps/pages.xml.
 * Used as a resilient fallback when the live sitemap cannot be fetched, and
 * to group pages into sections. The live sitemap remains the source of truth.
 */
export const KNOWN_PAGES: ReadonlyArray<{ path: string; section: string }> = [
  { path: "", section: "home" },
  { path: "product", section: "product" },
  { path: "how-it-works", section: "product" },
  { path: "pricing", section: "pricing" },
  { path: "features", section: "features" },
  { path: "features/visit-planning", section: "features" },
  { path: "features/route-planning", section: "features" },
  { path: "features/gps-check-in", section: "features" },
  { path: "features/photos-notes", section: "features" },
  { path: "features/follow-ups", section: "features" },
  { path: "features/offline-mode", section: "features" },
  { path: "features/manager-dashboard", section: "features" },
  { path: "features/reports", section: "features" },
  { path: "teams", section: "teams" },
  { path: "teams/field-sales", section: "teams" },
  { path: "teams/service", section: "teams" },
  { path: "teams/distribution", section: "teams" },
  { path: "teams/collections", section: "teams" },
  { path: "teams/medical-reps", section: "teams" },
  { path: "integrations", section: "integrations" },
  { path: "security", section: "security" },
  { path: "resources", section: "resources" },
  { path: "docs", section: "docs" },
  { path: "help", section: "help" },
  { path: "guides", section: "guides" },
  { path: "guides/planning-a-field-day", section: "guides" },
  { path: "guides/rolling-out-gps-check-in", section: "guides" },
  { path: "guides/writing-useful-visit-notes", section: "guides" },
  { path: "blog", section: "blog" },
  { path: "blog/why-field-visits-fall-out-of-the-crm", section: "blog" },
  { path: "blog/gps-check-in-without-surveillance", section: "blog" },
  { path: "blog/offline-first-field-apps", section: "blog" },
  { path: "about", section: "company" },
  { path: "contact", section: "company" },
  { path: "demo", section: "company" },
  { path: "partners", section: "company" },
  { path: "careers", section: "company" },
];

/** Pages likely to carry policy/compliance content (probed at runtime). */
export const POLICY_CANDIDATE_PATHS: readonly string[] = [
  "security",
  "privacy",
  "terms",
  "legal",
  "cookies",
];

/** Maximum characters returned in a single tool response before truncation. */
export const CHARACTER_LIMIT = 25000;

/** Hard cap on pages fetched for a single deep search, to bound load. */
export const MAX_SEARCH_FETCH = 24;

/**
 * Default number of UNCACHED pages a deep search fetches. Every fetch is
 * spaced by HEMMILES_MIN_REQUEST_INTERVAL_MS process-wide, so 8 keeps a cold
 * search to roughly 8 x 600 ms of spacing. Callers can raise it with
 * `max_pages` (up to MAX_SEARCH_FETCH). Cached pages are scored for free.
 */
export const DEFAULT_DEEP_FETCH = 8;

/** Largest upstream response body the client will read (2 MB). */
export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

export const SERVER_NAME = "hemmiles-mcp-server";

/**
 * Version read from package.json, so the runtime, /version and server.json
 * cannot drift. `../package.json` resolves to the repo root from both `src/`
 * (tsx) and `dist/` (compiled); the Docker image copies package.json too.
 */
export const SERVER_VERSION: string = (
  createRequire(import.meta.url)("../package.json") as { version: string }
).version;

/** Public website and MCP endpoint path, advertised in discovery docs. */
export const WEBSITE_URL = "https://hemmiles.com";
export const MCP_ENDPOINT = "/mcp";
