import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-prospective-clock-evidence-readonly.yml", import.meta.url),
  "utf8",
);

assert.match(workflow, /schedule:\s*\n\s*- cron: "25 5 \* \* 1-5"/);
assert.match(workflow, /workflow_dispatch:/);
assert.match(workflow, /permissions:\s*\n\s*contents: read/);
assert.match(workflow, /check_twse_trading_day_readonly\.mjs/);
assert.match(workflow, /--stop-when-daily-gate-ready true/);
assert.match(workflow, /--required-daily-only true/);
assert.match(workflow, /measure_required_dependency_series_readonly\.mjs/);
assert.match(workflow, /build_decision_clock_daily_bundle\.mjs/);
assert.match(workflow, /prospective_clock_schedule_guard\.test\.mjs/);
assert.doesNotMatch(workflow, /secrets\./i);
assert.doesNotMatch(workflow, /wrangler\s+(deploy|delete)|d1\s+(create|execute)/i);
assert.doesNotMatch(workflow, /fugle-test|V7_DB|STOCKS_KV/i);
assert.doesNotMatch(workflow, /SYSTEM2_CAPTURE_ENABLED\s*=\s*true/i);
assert.doesNotMatch(workflow, /system2-shadow-research/i);

console.log("System2 prospective clock schedule guard tests passed");
