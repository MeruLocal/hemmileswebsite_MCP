/**
 * UTM attribution for own-site URLs returned to agents, so traffic that comes
 * from AI assistants can be told apart in hemmiles.com analytics.
 *
 * Applied only at the OUTPUT edge of a tool, to URLs a user may click (page
 * URLs, demo/contact/pricing links). Never applied to URLs used for fetching
 * or caching, to `path` fields, to in-page `links[]`, to external hosts, or to
 * `mailto:` links.
 */

export const UTM_SOURCE = "mcp";
export const UTM_MEDIUM = "ai_agent";

function isOwnSite(host: string): boolean {
  const h = host.toLowerCase();
  return h === "hemmiles.com" || h.endsWith(".hemmiles.com");
}

/** Add utm_source/utm_medium/utm_campaign to a hemmiles.com URL, unless already present. */
export function withUtm(url: string, toolName: string): string {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  if ((u.protocol !== "https:" && u.protocol !== "http:") || !isOwnSite(u.hostname)) return url;
  const params = u.searchParams;
  if (!params.has("utm_source")) params.set("utm_source", UTM_SOURCE);
  if (!params.has("utm_medium")) params.set("utm_medium", UTM_MEDIUM);
  if (!params.has("utm_campaign")) params.set("utm_campaign", toolName);
  return u.toString();
}

/** withUtm for an optional value. */
export function withUtmOpt(url: string | undefined, toolName: string): string | undefined {
  return url === undefined ? undefined : withUtm(url, toolName);
}
