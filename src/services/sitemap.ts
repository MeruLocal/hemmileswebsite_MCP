/**
 * Sitemap service: discovers the live list of Hemmiles pages from
 * /sitemap.xml (+ its child sitemaps), normalizes them into locale-aware
 * entries, and caches the result. Falls back to the static KNOWN_PAGES list
 * when the network is unavailable, so page discovery degrades gracefully.
 */

import {
  BASE_ORIGIN,
  KNOWN_PAGES,
  UNVERIFIED_BLOG_SLUG_PATTERN,
  type Locale,
} from "../constants.js";
import { stripLocale } from "../utils/validation.js";
import { extractSitemapLocs } from "./product-normalizer.js";
import type { HemmilesClient } from "./hemmiles-client.js";

export interface PageEntry {
  /** Absolute canonical URL as listed in the sitemap. */
  url: string;
  /** Canonical, locale-stripped path, no leading slash (""== home). */
  path: string;
  /** Top-level section (home, pricing, features, teams, guides, blog, …). */
  section: string;
  /** Locale segment if the URL carries one, else "global". */
  locale: Locale | "global";
}

function sectionFor(path: string): string {
  if (path === "") return "home";
  const seg = path.split("/")[0] ?? "";
  const known = KNOWN_PAGES.find((p) => p.path === path);
  return known?.section ?? seg ?? "other";
}

function toEntry(url: string): PageEntry | null {
  try {
    const u = new URL(url);
    const { locale, path } = stripLocale(u.pathname);
    const canonical = path.replace(/^\/+/, "").replace(/\/+$/, "");
    return {
      url,
      path: canonical,
      section: sectionForWithLocaleStripped(canonical),
      locale: locale ?? "global",
    };
  } catch {
    return null;
  }
}

function sectionForWithLocaleStripped(canonicalPath: string): string {
  return sectionFor(canonicalPath);
}

/** True for CMS blog posts on topics the product does not cover (see constants). */
export function isUnverifiedCmsPost(entry: Pick<PageEntry, "path" | "section">): boolean {
  if (entry.section !== "blog") return false;
  const slug = entry.path.split("/").slice(1).join("/");
  return slug !== "" && UNVERIFIED_BLOG_SLUG_PATTERN.test(slug);
}

export class SitemapService {
  private readonly client: HemmilesClient;
  private cache: { entries: PageEntry[]; expires: number } | null = null;
  private readonly ttlMs: number;

  private readonly includeUnverified: boolean;

  constructor(client: HemmilesClient, ttlMs: number, includeUnverified = false) {
    this.client = client;
    this.ttlMs = ttlMs;
    this.includeUnverified = includeUnverified;
  }

  private fallbackEntries(): PageEntry[] {
    return KNOWN_PAGES.map((p) => ({
      url: `${BASE_ORIGIN}/${p.path}`.replace(/\/+$/, "") || BASE_ORIGIN,
      path: p.path,
      section: p.section,
      locale: "global" as const,
    }));
  }

  /**
   * Return all page entries from the live sitemap. On any failure, returns the
   * static fallback list rather than throwing, so discovery always works.
   */
  async getEntries(): Promise<PageEntry[]> {
    if (this.cache && this.cache.expires > Date.now()) return this.cache.entries;

    try {
      const index = await this.client.fetchHtml(`${BASE_ORIGIN}/sitemap.xml`);
      const childSitemaps = extractSitemapLocs(index.html).filter((l) => l.endsWith(".xml"));

      const all = new Set<string>();
      if (childSitemaps.length > 0) {
        for (const sm of childSitemaps) {
          try {
            const child = await this.client.fetchHtml(sm);
            for (const loc of extractSitemapLocs(child.html)) all.add(loc);
          } catch {
            // Skip an unreachable child sitemap; keep whatever we gathered.
          }
        }
      } else {
        // /sitemap.xml was a urlset, not an index.
        for (const loc of extractSitemapLocs(index.html)) all.add(loc);
      }

      const entries = [...all]
        .map(toEntry)
        .filter((e): e is PageEntry => e !== null)
        .filter((e) => this.includeUnverified || !isUnverifiedCmsPost(e));

      if (entries.length === 0) throw new Error("empty sitemap");

      this.cache = { entries, expires: Date.now() + this.ttlMs };
      return entries;
    } catch {
      const entries = this.fallbackEntries();
      // Cache the fallback only briefly so we retry the live sitemap soon.
      this.cache = { entries, expires: Date.now() + Math.min(this.ttlMs, 30000) };
      return entries;
    }
  }

  /** Unique canonical paths (locale-stripped), useful for search/listing. */
  async getCanonicalPages(): Promise<Array<{ path: string; section: string }>> {
    const entries = await this.getEntries();
    const map = new Map<string, string>();
    for (const e of entries) {
      if (!map.has(e.path)) map.set(e.path, e.section);
    }
    return [...map.entries()].map(([path, section]) => ({ path, section }));
  }
}
