import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(
  new URL("../../.github/workflows/system2-r2-physical-smoke.yml",import.meta.url),
  "utf8",
);
const script=await readFile(
  new URL("../scripts/historical_r2_physical_smoke_v0_1.mjs",import.meta.url),
  "utf8",
);

assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.match(workflow,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.match(workflow,/SYSTEM2_R2_BUCKET/);
assert.match(workflow,/historical_r2_physical_smoke_v0_1\.mjs/);
assert.doesNotMatch(workflow,/historical_pack_year_backfill_v0_1\.mjs/,"bounded smoke must never invoke annual backfill");

assert.match(script,/createRemoteR2S3Adapter/);
assert.match(script,/fetchOfficialHistoricalA1DateV0_1/);
assert.match(script,/smoke\/r2-physical-v0\.1/);
assert.match(script,/putIfAbsent/);
assert.match(script,/objectStore\.get/);
assert.match(script,/unpackHistoricalA1PackResearchV0_1/);
assert.match(script,/create-only rerun guard/);
assert.match(script,/d1WritePerformed:false/);
assert.match(script,/annualManifestWritePerformed:false/);
assert.match(script,/fullBackfillPerformed:false/);
assert.doesNotMatch(script,/executeHistoricalColdPackSetV0_1/,"bounded credential smoke must not write annual D1 manifests");
assert.doesNotMatch(script,/historical_pack_year_backfill/,"bounded smoke must not call annual backfill");

console.log("System2 bounded R2 physical smoke workflow guard tests passed");
