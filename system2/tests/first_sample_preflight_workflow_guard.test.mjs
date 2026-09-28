import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-first-sample-preflight-readonly.yml", import.meta.url),
  "utf8",
);

assert.match(workflow, /schedule:\s*\n\s*- cron: "45 4 \* \* 1-5"/);
assert.match(workflow, /permissions:\s*\n\s*contents: read\s*\n\s*actions: read/);
assert.match(workflow, /check_twse_trading_day_readonly\.mjs/);
assert.match(workflow, /decision_clock_collector_freeze_guard_v0_1\.test\.mjs/);
assert.match(workflow, /prospective_clock_schedule_guard\.test\.mjs/);
assert.match(workflow, /check_prospective_collector_workflow_readonly\.mjs/);
assert.match(workflow, /prospective-collector-workflow-preflight\.json/);
assert.match(workflow, /first-sample-operational-preflight\.json/);
assert.match(workflow, /Prospective collector intended time: 13:25 Asia\/Taipei/);
assert.match(workflow, /This preflight creates prospective evidence: false/);
assert.doesNotMatch(workflow, /secrets\./i);
assert.doesNotMatch(workflow, /wrangler\s+(deploy|delete)|d1\s+(create|execute)/i);
assert.doesNotMatch(workflow, /SYSTEM2_CAPTURE_ENABLED\s*=\s*true/i);
assert.doesNotMatch(workflow, /fugle-test|V7_DB|STOCKS_KV/i);

console.log("System2 first-sample preflight workflow guard tests passed");
