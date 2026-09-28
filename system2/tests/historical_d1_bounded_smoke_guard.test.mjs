import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const provision = await readFile(
  new URL("../deploy/provision_system2_d1.mjs", import.meta.url),
  "utf8",
);
const workflow = await readFile(
  new URL("../../.github/workflows/system2-historical-d1-bounded-smoke.yml", import.meta.url),
  "utf8",
);
const smoke = await readFile(
  new URL("../scripts/historical_d1_bounded_smoke.mjs", import.meta.url),
  "utf8",
);

assert.match(provision, /0004_historical_universe\.sql/);
assert.match(provision, /s2_historical_universe_memberships/);
assert.match(provision, /s2_historical_universe_snapshots/);
assert.match(provision, /0005_historical_packs\.sql/);
assert.match(provision, /s2_historical_a1_packs/);
assert.match(provision, /s2_historical_pack_ingest_receipts/);
assert.match(provision, /schema_value[\s\S]*"0\.9"/);
assert.doesNotMatch(provision, /schema_value[\s\S]*"0\.8"/);

assert.match(workflow, /workflow_dispatch:/);
assert.match(workflow, /WRITE_SYSTEM2_HISTORICAL_SMOKE/);
assert.match(workflow, /environment: system2-research/);
assert.match(workflow, /provision_system2_d1\.mjs/);
assert.match(workflow, /SYSTEM2_CONFIRM: "CREATE_SYSTEM2_ISOLATED_D1"/);
assert.match(workflow, /historical_d1_bounded_smoke\.mjs/);
assert.doesNotMatch(workflow, /^\s*schedule:/m);

assert.match(smoke, /databaseName: "system2-research"/);
assert.match(smoke, /schema_value/);
assert.match(smoke, /"0\.9"/);
assert.match(smoke, /fullBackfillPerformed: false/);
assert.match(smoke, /historicalReplayRunPerformed: false/);
assert.match(smoke, /GITHUB_RUN_ID/);
assert.match(smoke, /second bounded smoke write must be idempotent/);

console.log("System2 bounded historical D1 smoke guard tests passed");
