import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-recent-a1-hot-history-warmup.yml", import.meta.url),
  "utf8",
);
const script = await readFile(
  new URL("../scripts/run_recent_a1_hot_history_warmup_v0_1.mjs", import.meta.url),
  "utf8",
);
const runtime = await readFile(
  new URL("../runtime/recent_a1_hot_history_warmup_v0_1.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /group: system2-isolated-d1-writer/);
assert.match(workflow, /cancel-in-progress: false/);
assert.match(workflow, /environment: system2-research/);
assert.match(workflow, /WRITE_SYSTEM2_RECENT_A1_HOT_HISTORY_ONLY/);
assert.match(workflow, /SYSTEM2_HOT_HISTORY_MAX_DATES: "5"/);
assert.match(workflow, /SYSTEM2_HOT_HISTORY_REQUIRED_SESSIONS: "60"/);
assert.match(workflow, /cron: "30 8 \* \* \*"/);
assert.match(workflow, /recent_a1_hot_history_warmup_v0_1\.test\.mjs/);
assert.match(workflow, /git diff --exit-code -- Worker\.js wrangler\.toml/);

for (const requiredPath of [
  "system2/runtime/recent_a1_hot_history_warmup_v0_1.mjs",
  "system2/runtime/official_historical_a1_source_v0_1.mjs",
  "system2/runtime/historical_store_v0_1.mjs",
  "system2/runtime/historical_bulk_persistence_v0_1.mjs",
  "system2/deploy/remote_d1_rest_adapter.mjs",
]) {
  assert.equal(workflow.includes(requiredPath), true, "missing warmup trigger: " + requiredPath);
}

assert.doesNotMatch(
  workflow,
  /FUGLE_API_KEY|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|wrangler.*deploy|secret put/,
);
assert.doesNotMatch(
  script,
  /FUGLE_API_KEY|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|s2_capacity_runs|BUY_ELIGIBLE|SELECTED/,
);
assert.match(script, /continuityState: "UNVERIFIED"/);
assert.match(script, /availabilityBasis: "PROSPECTIVE_OBSERVATION"/);
assert.match(script, /capacityRunProduced: false/);
assert.match(script, /selectionAuthority: false/);
assert.match(runtime, /maxDatesPerRun.*max: 5/s);
assert.match(runtime, /continuityPromotionPerformed: false/);
assert.match(runtime, /continuityStateForNewRows: "UNVERIFIED"/);

console.log("System2 recent A1 hot-history workflow guard tests passed");
