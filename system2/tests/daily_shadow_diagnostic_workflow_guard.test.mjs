import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const workflow = await readFile(new URL("../../.github/workflows/system2-daily-shadow-diagnostic.yml", import.meta.url), "utf8");
assert.match(workflow, /cron: "35 10 \* \* 1-5"/);
assert.match(workflow, /group: system2-isolated-d1-writer/);
assert.match(workflow, /cancel-in-progress: false/);
assert.match(workflow, /github.ref == 'refs\/heads\/main'/);
assert.match(workflow, /environment: system2-research/);
assert.match(workflow, /WRITE_SYSTEM2_DAILY_DIAGNOSTIC_ONLY/);
assert.match(workflow, /daily_shadow_a1_exact_date_fallback_v0_2\.test\.mjs/);
assert.match(workflow, /current_listing_metadata_v0_1\.test\.mjs/);
for (const requiredSourceTrigger of [
  "system2/runtime/daily_shadow_a1_source_v0_1.mjs",
  "system2/runtime/a1_symbol_snapshot_adapter.mjs",
  "system2/runtime/current_listing_metadata_v0_1.mjs",
  "system2/runtime/official_historical_a1_source_v0_1.mjs",
  "system2/runtime/official_historical_backfill_source_v0_1.mjs",
  "system2/runtime/daily_shadow_input_preflight_v0_1.mjs",
  "system2/runtime/daily_shadow_history_reader_v0_1.mjs",
]) {
  assert.equal(workflow.includes(requiredSourceTrigger), true, "missing physical diagnostic source trigger: " + requiredSourceTrigger);
}
assert.match(workflow, /IMMUTABLE_D1_READBACK_VERIFIED/);
assert.match(workflow, /r.zeroPickDay!==null/);
assert.doesNotMatch(workflow, /wrangler.*deploy|secret put|V7_ADMIN_TOKEN|FUGLE_API_KEY|SYSTEM2_CAPTURE_ENABLED/);
const runtime = await readFile(new URL("../runtime/daily_shadow_diagnostic_orchestrator_v0_1.mjs", import.meta.url), "utf8");
assert.doesNotMatch(runtime, /buildDailyShadowCapacityOrchestration|runDailyLimitedShadowOrchestrator|BUY_ELIGIBLE|SELECTED/);
assert.match(runtime, /continuityState: "UNVERIFIED"/);
assert.match(runtime, /countsTowardDecisionClockReadiness: false/);
console.log("Daily diagnostic scheduled writer isolation guard PASS");
