import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(new URL("../../.github/workflows/system2-historical-pack-2017-backfill.yml",import.meta.url),"utf8");
const script=await readFile(new URL("../scripts/historical_pack_year_backfill_v0_1.mjs",import.meta.url),"utf8");
const migration=await readFile(new URL("../sql/0006_historical_cold_store.sql",import.meta.url),"utf8");

assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/market:/);
assert.match(workflow,/type: choice/);
assert.match(workflow,/- TWSE/);
assert.match(workflow,/- TPEX/);
assert.match(workflow,/SYSTEM2_HISTORY_YEAR_MARKET: \$\{\{ inputs\.market \}\}/);
assert.doesNotMatch(workflow,/matrix:\s*[\s\S]*market:\s*\[TWSE, TPEX\]/,"2017 backfill must run one market at a time");
assert.doesNotMatch(workflow,/^\s+push:/m,"cold backfill must not auto-run on repository push");
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.match(workflow,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.match(workflow,/SYSTEM2_R2_BUCKET/);
assert.match(script,/createRemoteR2S3Adapter/);
assert.match(script,/executeHistoricalColdPackSetV0_1/);
assert.doesNotMatch(script,/executeHistoricalPackSetBulkV0_1/);
assert.match(migration,/s2_historical_a1_pack_manifests/);
assert.match(migration,/s2_historical_cold_backfill_checkpoints/);
assert.match(migration,/s2_historical_cold_ingest_receipts/);
assert.doesNotMatch(migration,/gzip_base64/,"D1 cold manifest migration must not store payload bytes");

console.log("System2 historical cold backfill workflow guard tests passed");
