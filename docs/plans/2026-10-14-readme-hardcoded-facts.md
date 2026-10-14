# Plan: stop hard-coding prices and trial terms in the README

- **Severity:** P1
- **Effort:** S
- **Audit check:** skill §3 / §4 V3 (`C5.<fact>`)

## Finding

The server reads pricing live from the pricing page JSON-LD (`src/tools/pricing.ts`), which is correct. But the README states fixed figures that will rot and that assistants quote verbatim:

| Where | Text |
|---|---|
| `README.md:40` | "e.g. India ₹3,500 / US $39 Starter" |
| `README.md:197` | Example answer: Starter ₹3,500, Professional ₹4,500, Enterprise ₹8,000 per user/month … "with a 14‑day free trial" |
| `README.md:220-223` | Example JSON output: `"price": "3500"`, `"minUsers": 3, "maxUsers": 10` |

These were not checked against a canonical source: the sandbox cannot reach hemmiles.com, and no founder-named canonical pricing file was available. **This plan does not change or assert any price.**

## Proposed fix

- Replace the figures with placeholders that make the shape clear without numbers, e.g. "prices are per user per month in the market's currency (INR for `in`, USD for `us`) — call `hemmiles_get_pricing` for current figures".
- In the example conversation, show the tool call and say "(current plans and prices from the pricing page)" instead of amounts and trial length.
- In the JSON example, use obviously fake values (`"price": 0, "minUsers": 1`) marked "illustrative".
- Add a one-line rule to the README "Known limitations": figures are never hard-coded in this repo.

## Tests to add

- None in code. Optional CI grep (with the CI plan #9): fail if `README.md` matches `/[₹$€£]\s?\d/`.

## Risks / decisions

- **Decision (founder):** keep any example figures in the README at all? If yes, name the canonical source to copy them from, and who updates them.
- Prices, plan names and trial terms stay out of scope for any code change.
