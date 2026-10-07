import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const s=await readFile(new URL("../scripts/d08_twse_raw_valuation_r2_capture_v0_3.mjs",import.meta.url),"utf8");
const w=await readFile(new URL("../../.github/workflows/d08-twse-raw-valuation-r2-capture-v0-3.yml",import.meta.url),"utf8");

assert.match(s,/buildD08TwseHistoricalUniverseSourceV0_2/);
assert.match(s,/d08_twse_official_universe_source_receipt_20261007_v0_2\.json/);
assert.match(s,/D08_TWSE_RAW_VALUATION_SNAPSHOT_V0_3/);
assert.match(s,/twse-raw-valuation-snapshot-v0\.3/);
assert.match(s,/D08_TWSE_RAW_VALUATION_R2_CAPTURE_RECEIPT_V0_3/);
assert.match(s,/universeSemanticSnapshotBundleHash/);
assert.match(s,/V0\.2 semantic registry drift/);
assert.match(s,/createRemoteR2S3Adapter/);
assert.match(s,/readbackVerified:true/);
assert.match(s,/outcomeJoin:false/);
assert.doesNotMatch(s,/createRemoteD1RestAdapter|s2_outcome|return outcome|Worker\.js/i);

assert.match(w,/environment: system2-research/);
assert.match(w,/d08_twse_raw_valuation_r2_capture_v0_3\.mjs/);
assert.match(w,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.doesNotMatch(w,/wrangler.*deploy|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/i);

console.log(JSON.stringify({ok:true,guard:"D08_RAW_VALUATION_R2_CAPTURE_V0_3",formalCoreImpact:false}));
