import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow = await readFile(
  new URL("../../.github/workflows/system2-hot-history-bootstrap.yml", import.meta.url),
  "utf8",
);
const runtime = await readFile(
  new URL("../runtime/daily_shadow_hot_history_bootstrap_v0_1.mjs", import.meta.url),
  "utf8",
);
const script = await readFile(
  new URL("../scripts/run_daily_shadow_hot_history_bootstrap.mjs", import.meta.url),
  "utf8",
);

assert.match(workflow, /group: system2-isolated-d1-writer/);
assert.match(workflow, /cancel-in-progress: false/);
assert.match(workflow, /WRITE_SYSTEM2_HOT_HISTORY_BOOTSTRAP/);
assert.match(workflow, /SYSTEM2_HOT_HISTORY_SESSION_COUNT/);
assert.match(workflow, /insertedBarCount>9000/);
assert.match(workflow, /continuity remains UNVERIFIED/);
assert.doesNotMatch(workflow, /^\s*schedule:/m, "bootstrap must not become an unattended recurring schedule");
assert.doesNotMatch(workflow, /FUGLE_API_KEY|V7_ADMIN_TOKEN|wrangler.*deploy|secret put/);
assert.match(runtime, /HOT_HISTORY_MAX_SESSIONS_PER_RUN = 3/);
assert.match(runtime, /HOT_HISTORY_MAX_SOURCE_ROWS_PER_MARKET_DATE = 1500/);
assert.match(runtime, /availabilityBasis: "PROSPECTIVE_OBSERVATION"/);
assert.match(runtime, /continuityState: "UNVERIFIED"/);
assert.match(runtime, /selectionAuthority: false/);
assert.match(runtime, /capacityWriteAuthorized: false/);
assert.match(script, /databaseName: "system2-research"/);
assert.match(script, /system1RuntimeChanged: false/);

console.log("System2 hot-history bootstrap workflow guard tests passed");
