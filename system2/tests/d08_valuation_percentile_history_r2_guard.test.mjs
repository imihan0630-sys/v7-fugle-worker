import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const year=await readFile(new URL("../scripts/d08_twse_valuation_history_year_r2_v0_1.mjs",import.meta.url),"utf8");
const pct=await readFile(new URL("../scripts/d08_twse_valuation_percentile_r2_build_v0_1.mjs",import.meta.url),"utf8");
const wf=await readFile(new URL("../../.github/workflows/d08-twse-valuation-percentile-history-r2.yml",import.meta.url),"utf8");

for(const s of [year,pct]){
  assert.match(s,/createRemoteR2S3Adapter/);
  assert.doesNotMatch(s,/createRemoteD1RestAdapter|INSERT\s+INTO|UPDATE\s+s2_|DELETE\s+FROM|Worker\.js/i);
}
assert.match(year,/fetchOfficialHistoricalA6ValuationDateV0_1/);
assert.match(year,/D08_VAL_HISTORY_YEAR_RECEIPT/);
assert.match(pct,/SOURCE_REVISION_CONFLICT/);
assert.match(pct,/LEFT_TRUNCATED_BEFORE_2017/);
assert.match(pct,/D08_PERCENTILE_R2_RECEIPT/);
assert.match(pct,/outcomeJoin:false/);
assert.match(wf,/matrix:/);
assert.match(wf,/2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026/);
assert.match(wf,/max-parallel: 1/);
assert.match(wf,/environment: system2-research/);
assert.match(wf,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.doesNotMatch(wf,/wrangler.*deploy|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/i);
console.log(JSON.stringify({ok:true,guard:"D08_VALUATION_PERCENTILE_HISTORY_R2",outcomes:false,formalCoreImpact:false}));
