/**
 * Shared constants for the Hemmiles MCP server.
 *
 * Everything here is derived from a direct inspection of the public
 * hemmiles.com site (robots.txt, sitemaps, and server-rendered JSON-LD).
 * No endpoints or data are invented.
 */

/** Canonical origin. The server restricts all requests to this host. */
export const BASE_ORIGIN = "https://hemmiles.com";

/** The only host the client is permitted to contact (SSRF allowlist). */
export const ALLOWED_HOSTS: readonly string[] = ["hemmiles.com"];

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

export const SERVER_NAME = "hemmiles-mcp-server";
export const SERVER_VERSION = "1.0.0";

/**
 * Blog slugs about topics Hemmiles has no product behind (US mileage
 * reimbursement, IRS rules, hours-of-service, FLSA, AB5, SOC 2). The site's CMS
 * publishes ~77 such posts; the 2026-10-21 research (Loop 35, K11) flags them as
 * legal-compliance advice with no product or legal entity backing. They are hidden
 * from discovery (list/search/resources) unless HEMMILES_INCLUDE_UNVERIFIED_CMS=true.
 * get_page by explicit path still works.
 */
export const UNVERIFIED_BLOG_SLUG_PATTERN =
  /(mileage|reimburse|hours-of-service|fair-labor|per-diem|expense-report|(^|-)(irs|dot|flsa|ab5|soc-?2)(-|$))/i;
