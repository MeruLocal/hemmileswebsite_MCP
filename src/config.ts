/**
 * Runtime configuration, read from environment variables with safe defaults.
 * No secrets are required; the server only reads public web content.
 */

import { LOCALES, type Locale } from "./constants.js";

export interface ServerConfig {
  transport: "stdio" | "http";
  port: number;
  /** Listen address for the HTTP transport. Unset = all interfaces. */
  host?: string;
  defaultLocale: Locale;
  timeoutMs: number;
  maxRetries: number;
  minRequestIntervalMs: number;
  cacheTtlMs: number;
  userAgent: string;
  /**
   * Optional https URL of the server/tool icon on hemmiles.com
   * (HEMMILES_ICON_URL). Unset = no icons are advertised.
   */
  iconUrl?: string;
}

function intEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function localeEnv(name: string, fallback: Locale): Locale {
  const raw = (process.env[name] ?? "").trim().toLowerCase();
  return (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : fallback;
}

/** Accept only an https URL on hemmiles.com / www.hemmiles.com. */
function iconUrlEnv(name: string): string | undefined {
  const raw = (process.env[name] ?? "").trim();
  if (raw === "") return undefined;
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return undefined;
    if (!["hemmiles.com", "www.hemmiles.com"].includes(u.hostname.toLowerCase())) return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
}

export function loadConfig(): ServerConfig {
  const transport = (process.env.HEMMILES_TRANSPORT ?? "stdio").trim().toLowerCase();
  return {
    transport: transport === "http" ? "http" : "stdio",
    port: intEnv("PORT", 3001, 1, 65535),
    host: (process.env.HOST ?? "").trim() || undefined,
    defaultLocale: localeEnv("HEMMILES_DEFAULT_LOCALE", "in"),
    timeoutMs: intEnv("HEMMILES_TIMEOUT_MS", 20000, 1000, 60000),
    maxRetries: intEnv("HEMMILES_MAX_RETRIES", 3, 0, 5),
    minRequestIntervalMs: intEnv("HEMMILES_MIN_REQUEST_INTERVAL_MS", 600, 0, 10000),
    cacheTtlMs: intEnv("HEMMILES_CACHE_TTL_SECONDS", 300, 0, 86400) * 1000,
    userAgent:
      (process.env.HEMMILES_USER_AGENT ?? "").trim() ||
      "hemmiles-mcp-server/1.0 (+https://github.com/MeruLocal/hemmileswebsite_MCP)",
    iconUrl: iconUrlEnv("HEMMILES_ICON_URL"),
  };
}
