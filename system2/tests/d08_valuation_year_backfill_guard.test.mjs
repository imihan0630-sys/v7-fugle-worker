import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const script=await readFile(new URL("../scripts/d08_twse_valuation_year_backfill_v0_1.mjs",import.meta.url),"utf8");
const workflow=await readFile(new URL("../../.github/workflows/d08-twse-valuation-year-backfill.yml",import.meta.url),"utf8");
assert.match(script,/fetchOfficialHistoricalA6ValuationDateV0_1/);
assert.match(script,/buildOfficialTradingDatesV0_1/);
assert.match(script,/createRemoteR2S3Adapter/);
assert.match(script,/D08_VALUATION_YEAR_RECEIPT/);\nassert.match(script,/outcomeJoin:false/);
assert.doesNotMatch(script,/createRemoteD1RestAdapter|INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|outcome/i);
assert.match(workflow,/max-parallel:\s*2/);
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/D08_VALUATION_HISTORY_YEAR/);
assert.match(workflow,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.doesNotMatch(workflow,/wrangler.*deploy|Worker\.js|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/i);
console.log(JSON.stringify({ok:true,guard:"D08_YEARLY_VALUATION_BACKFILL",formalCoreImpact:false}));
