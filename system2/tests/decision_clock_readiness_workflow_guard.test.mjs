import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-decision-clock-readiness-readonly.yml", import.meta.url),
  "utf8",
);

assert.match(workflow, /schedule:\s*\n\s*- cron: "30 0 \* \* \*"/);
assert.match(workflow, /actions: read/);
assert.match(workflow, /github\.token/);
assert.match(workflow, /aggregate_decision_clock_artifacts_readonly\.mjs/);
assert.match(workflow, /Coverage finalization/);
assert.match(workflow, /Pending unfinalized runs/);
assert.doesNotMatch(workflow, /secrets\./i);
assert.doesNotMatch(workflow, /wrangler\s+(deploy|delete)|d1\s+(create|execute)/i);
assert.doesNotMatch(workflow, /SYSTEM2_CAPTURE_ENABLED\s*=\s*true/i);
assert.doesNotMatch(workflow, /fugle-test|V7_DB|STOCKS_KV/i);

console.log("System2 Decision Clock readiness workflow guard tests passed");
