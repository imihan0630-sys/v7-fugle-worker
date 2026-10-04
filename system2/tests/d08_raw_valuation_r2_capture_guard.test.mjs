import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const script=await readFile(new URL("../scripts/d08_twse_raw_valuation_r2_capture_v0_1.mjs",import.meta.url),"utf8");
const workflow=await readFile(new URL("../../.github/workflows/d08-twse-raw-valuation-r2-capture.yml",import.meta.url),"utf8");

assert.match(script,/createRemoteR2S3Adapter/);
assert.match(script,/fetchOfficialHistoricalA6ValuationDateV0_1/);
assert.match(script,/buildD08TwseHistoricalUniverseSourceV0_1/);
assert.match(script,/D08_RAW_VALUATION_R2_RECEIPT/);
assert.match(script,/outcomeJoin:false/);
assert.match(script,/noD1Writes:true/);
assert.doesNotMatch(script,/createRemoteD1RestAdapter|s2_outcome|D1_RETURN|outcome tracker|Worker\.js/i);
assert.doesNotMatch(script,/INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM/i);

assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.match(workflow,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.match(workflow,/SYSTEM2_R2_BUCKET/);
assert.match(workflow,/d08_twse_raw_valuation_r2_capture_v0_1\.mjs/);
assert.doesNotMatch(workflow,/wrangler.*deploy|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/i);

console.log(JSON.stringify({ok:true,guard:"D08_RAW_VALUATION_R2_CAPTURE",outcomeAccess:false,formalCoreImpact:false}));
