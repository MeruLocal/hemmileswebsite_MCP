/**
 * MCP prompts: ready-made buyer-question workflows. Each prompt only tells the
 * assistant which Hemmiles tools to call and to cite hemmiles.com URLs; it
 * carries no product facts of its own, so it cannot drift from the website.
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { LOCALES } from "./constants.js";

const TEAM_TYPES = ["field-sales", "service", "distribution", "collections", "medical-reps"] as const;

function user(text: string) {
  return { messages: [{ role: "user" as const, content: { type: "text" as const, text } }] };
}

const CITE =
  "Use only what the tools return, quote prices exactly as returned, and cite the hemmiles.com URLs the tools give you. " +
  "If a tool does not cover something (for example a specific CRM connector), say so rather than guessing.";

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "evaluate_field_visit_app_for_team",
    {
      title: "Evaluate Hemmiles for a field team",
      description:
        "Is Hemmiles a fit for my team? Pulls the team page, features, integrations page and pricing for one team type and market.",
      argsSchema: {
        team_type: z.enum(TEAM_TYPES).describe("Which kind of team: field-sales, service, distribution, collections or medical-reps."),
        country: z.enum(LOCALES).default("us").describe("Market code, e.g. us, in, gb."),
      },
    },
    ({ team_type, country }) =>
      user(
        `I run a ${team_type} team in market "${country}". Is Hemmiles a fit? ` +
          `Call hemmiles_get_page with path "teams/${team_type}" and locale "${country}", hemmiles_list_features, ` +
          `hemmiles_get_page with path "integrations", and hemmiles_get_pricing for locale "${country}". ` +
          `Summarise what it does for this team, how it works alongside an existing CRM, what each plan costs and its user limits, and the next step (hemmiles_get_contact_options). ${CITE}`,
      ),
  );

  server.registerPrompt(
    "hemmiles_pricing_for_market",
    {
      title: "Hemmiles pricing for a market",
      description: "Current published plans, user limits, trial and billing terms for one market.",
      argsSchema: {
        country: z.enum(LOCALES).default("us").describe("Market code, e.g. us, in, gb."),
        team_size: z.string().max(10).optional().describe("Number of users, if known."),
      },
    },
    ({ country, team_size }) =>
      user(
        `What does Hemmiles cost in market "${country}"${team_size ? ` for ${team_size} users` : ""}? ` +
          `Call hemmiles_get_pricing with locale "${country}" and hemmiles_get_faqs for path "pricing". ` +
          `State each plan's monthly and annual price, currency, user minimum and maximum, the trial terms and whether taxes are included, and say which plan fits${team_size ? ` ${team_size} users` : ""}. ${CITE}`,
      ),
  );

  server.registerPrompt(
    "find_field_sales_guide",
    {
      title: "Find a Hemmiles field-sales guide",
      description: "Find the Hemmiles guide or article on a field-sales topic (beat plan, DSR, PJP, check-in rollout, outside vs inside sales).",
      argsSchema: {
        topic: z.string().min(2).max(80).describe("Topic or question, e.g. 'beat plan' or 'outside sales vs inside sales'."),
      },
    },
    ({ topic }) =>
      user(
        `Find what Hemmiles has published about "${topic}". Call hemmiles_search_site with query "${topic}" and section "guides", ` +
          `then again without a section if nothing relevant comes back; open the best match with hemmiles_get_page. ` +
          `Answer the question from that page and link it. ${CITE}`,
      ),
  );
}
