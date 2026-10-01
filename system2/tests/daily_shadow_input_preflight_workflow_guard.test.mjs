import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-daily-shadow-input-preflight-readonly.yml", import.meta.url),
  "utf8",
);
const source = await readFile(
  new URL("../runtime/daily_shadow_a1_source_v0_1.mjs", import.meta.url),
  "utf8",
);
const history = await readFile(
  new URL("../runtime/daily_shadow_history_reader_v0_1.mjs", import.meta.url),
  "utf8",
);
const assessor = await readFile(
  new URL("../runtime/daily_shadow_assessor_readiness_v0_1.mjs", import.meta.url),
  "utf8",
);
const preflight = await readFile(
  new URL("../runtime/daily_shadow_input_preflight_v0_1.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /environment: system2-research/);
assert.match(workflow, /run_daily_shadow_input_preflight_readonly\.mjs/);
assert.match(workflow, /rowsWritten!==0/);
assert.match(workflow, /capacityWriteAuthorized!==false/);
assert.match(workflow, /zeroPickMayBeClaimed!==false/);
assert.match(workflow, /System1 production files unchanged PASS/);
assert.doesNotMatch(workflow, /wrangler\s+deploy|secret\s+put/);

assert.match(source, /DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK/);
assert.match(source, /buildA1SymbolSnapshotBatch/);
assert.match(history, /pit_replay_eligible = 1/);
assert.match(history, /available_at <= \?/);
assert.match(history, /REVISION_AMBIGUITY/);
assert.match(assessor, /ASSESSOR_POLICY_NOT_FROZEN/);
assert.match(assessor, /NO_PREREGISTERED_SETUP_LEVEL_THRESHOLDS/);
assert.match(preflight, /ASSESSOR_POLICY_BLOCKED/);
assert.match(preflight, /zeroPickMayBeClaimed: sourceAndHistoryReady && assessorReady/);
assert.match(preflight, /scheduledCaptureAuthorized: false/);
assert.match(preflight, /system1RuntimeUsed: false/);

console.log("System2 daily Shadow input preflight workflow guard tests passed");
