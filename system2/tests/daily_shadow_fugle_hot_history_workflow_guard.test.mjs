import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(
  new URL("../../.github/workflows/system2-fugle-raw-hot-history-bootstrap.yml", import.meta.url),
  "utf8",
);
const runtime=await readFile(
  new URL("../runtime/daily_shadow_fugle_hot_history_bootstrap_v0_1.mjs", import.meta.url),
  "utf8",
);
const source=await readFile(
  new URL("../runtime/fugle_raw_daily_history_v0_1.mjs", import.meta.url),
  "utf8",
);
const script=await readFile(
  new URL("../scripts/run_daily_shadow_fugle_hot_history_bootstrap.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /environment: system2-research/);
assert.match(workflow, /group: system2-isolated-d1-writer/);
assert.match(workflow, /cancel-in-progress: false/);
assert.match(workflow, /SYSTEM2_FUGLE_HOT_HISTORY_SYMBOL_LIMIT: "45"/);
assert.match(workflow, /SYSTEM2_FUGLE_HOT_HISTORY_PAUSE_MS: "1100"/);
assert.match(workflow, /WRITE_SYSTEM2_FUGLE_RAW_HOT_HISTORY_ONLY/);
assert.match(workflow, /FUGLE_API_KEY/);
assert.match(workflow, /git diff --exit-code -- Worker\.js wrangler\.toml/);
assert.doesNotMatch(workflow, /^\s*schedule:/m, "bootstrap must not become an unattended recurring API consumer");
assert.doesNotMatch(workflow, /wrangler.*deploy|secret put|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL/);

assert.match(source, /adjusted=false/);
assert.match(source, /priceSpace: "RAW"/);
assert.match(source, /continuityState: "UNVERIFIED"/);
assert.match(source, /availabilityBasis: "PROSPECTIVE_OBSERVATION"/);
assert.match(source, /change: null/);
assert.doesNotMatch(source, /adjusted=true/);

assert.match(runtime, /FUGLE_HOT_HISTORY_MAX_SYMBOL_LIMIT = 50/);
assert.match(runtime, /FUGLE_HOT_HISTORY_REQUIRED_BARS = 60/);
assert.match(runtime, /continuityPromotionPerformed: false/);
assert.match(runtime, /strategyEvaluationPerformed: false/);
assert.match(runtime, /capacityRunProduced: false/);
assert.match(runtime, /selectionAuthority: false/);
assert.match(runtime, /system1RuntimeUsed: false/);
assert.match(script, /databaseName: "system2-research"/);
assert.match(script, /continuityState, "UNVERIFIED"/);
assert.doesNotMatch(script, /Worker\.js|wrangler.*deploy|V7_DB|STOCKS_KV/);

console.log("System2 Fugle raw hot-history workflow guard tests passed");
