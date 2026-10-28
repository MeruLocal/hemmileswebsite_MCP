import { test } from "node:test";
import assert from "node:assert/strict";
import { isUnverifiedCmsPost } from "../src/services/sitemap.ts";

test("hides US mileage / compliance CMS posts", () => {
  for (const slug of [
    "accountable-plan-mileage-reimbursement-in-united-states-rules-setup-and-policy",
    "how-to-use-mileage-tracking-to-prepare-for-irs-mileage-audits-in-united-states",
    "support-compliance-with-the-us-department-of-transportation-dot-hours-of-service-rules",
    "support-compliance-with-the-new-california-assembly-bill-5-ab5",
  ]) {
    assert.equal(isUnverifiedCmsPost({ section: "blog", path: `blog/${slug}` }), true, slug);
  }
});

test("keeps product blog posts, the blog hub and non-blog pages", () => {
  for (const [section, path] of [
    ["blog", "blog"],
    ["blog", "blog/gps-check-in-without-surveillance"],
    ["blog", "blog/why-field-visits-fall-out-of-the-crm"],
    ["blog", "blog/offline-first-field-apps"],
    ["guides", "guides/planning-a-field-day"],
    ["features", "features/reports"],
  ] as const) {
    assert.equal(isUnverifiedCmsPost({ section, path }), false, path);
  }
});
