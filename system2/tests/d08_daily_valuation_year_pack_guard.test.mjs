import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const s=await readFile(new URL("../scripts/d08_twse_daily_valuation_year_pack_capture_v0_1.mjs",import.meta.url),"utf8");
const w=await readFile(new URL("../../.github/workflows/d08-twse-daily-valuation-year-pack.yml",import.meta.url),"utf8");

assert.match(s,/fetchHistoricalTwseMonthlyTradingDatesV0_1/);
assert.match(s,/TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL/);
assert.match(s,/fetchOfficialHistoricalA6ValuationDateV0_1/);
assert.match(s,/createRemoteR2S3Adapter/);
assert.match(s,/D08_YEAR_PACK_RECEIPT/);
assert.match(s,/retryAttempts:7/);
assert.match(s,/retryDelayMs:1000/);
assert.doesNotMatch(s,/Promise\.all\(batch\.map/);
assert.match(s,/outcomeJoin:false/);
assert.doesNotMatch(s,/createRemoteD1RestAdapter|s2_outcome|Worker\.js|return outcome/i);

assert.match(w,/environment: system2-research/);
assert.match(w,/D08_YEAR: "2026"/);
assert.match(w,/2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026/);
assert.match(w,/max-parallel: 1/);
assert.match(w,/D08_YEAR: "\$\{\{ matrix\.year \}\}"/);
assert.match(w,/d08_historical_valuation_percentile_engine\.test\.mjs/);
assert.match(w,/d08_historical_valuation_percentile_snapshot\.test\.mjs/);
assert.match(w,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.doesNotMatch(w,/wrangler.*deploy|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/i);

console.log(JSON.stringify({
  ok:true,guard:"D08_DAILY_VALUATION_YEAR_PACK_CAPTURE",
  prSmokeYear:2026,fullArchiveYears:"2005-2026",maxParallel:1,outcomeAccess:false,formalCoreImpact:false
}));
