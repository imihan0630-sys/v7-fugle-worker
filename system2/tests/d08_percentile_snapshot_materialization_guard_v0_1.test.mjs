import assert from "node:assert/strict";
import fs from "node:fs";

const script=fs.readFileSync("system2/scripts/d08_twse_percentile_snapshot_materialize_v0_1.mjs","utf8");
const workflow=fs.readFileSync(".github/workflows/d08-twse-percentile-snapshot-materialize-v0-1.yml","utf8");
const contract=JSON.parse(fs.readFileSync("research/d08_historical_valuation_percentile_snapshot_contract_v0_2.json","utf8"));

assert.equal(contract.outcomeGate,"CLOSED");
assert.equal(contract.formalCoreChanged,false);
assert.equal(contract.scanDates.count,44);
assert.equal(contract.sourcePins.dailyArchivePackBundleHash,"540617710149de3713d2c8e574f90dc39c6800d87b19c0d95763eac78f0bae31");
assert.equal(contract.sourcePins.semanticRegistryHash,"41d6d24a93be846fb324204129ef106cf3ff6e95eee2695af4976a467e4d29c7");
assert.equal(contract.sourcePins.rawValuationObjectBundleHash,"7031b42608194c798f68f27852997618961c173883767df91b472652777a7240");

assert.match(script,/d08_twse_daily_valuation_archive_manifest_20261007_v0_1\.json/);
assert.match(script,/d08_twse_official_universe_source_receipt_20261007_v0_2\.json/);
assert.match(script,/d08_twse_raw_valuation_r2_capture_receipt_20261007_v0_3\.json/);
assert.match(script,/buildD08HistoricalValuationPercentileSnapshotV0_1/);
assert.match(script,/validateD08ValuationYearPackV0_1/);
assert.match(script,/historicalUniverseMembershipActiveOnDateV0_1/);
assert.match(script,/putIfAbsent/);
assert.match(script,/readbackVerified:true/);
assert.match(script,/D08_PERCENTILE_MATERIALIZATION_RECEIPT/);
assert.match(script,/noReturns:true/);
assert.match(script,/noOutcomeJoin:true/);
assert.match(script,/noD1Writes:true/);
assert.match(script,/noSystem1Runtime:true/);
assert.match(script,/noFormalCoreImpact:true/);
assert.doesNotMatch(script,/Worker\.js|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY|wrangler.*deploy/i);

assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.match(workflow,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.match(workflow,/d08_historical_valuation_percentile_engine\.test\.mjs/);
assert.match(workflow,/d08_historical_valuation_percentile_snapshot\.test\.mjs/);
assert.match(workflow,/d08_percentile_snapshot_materialization_guard_v0_1\.test\.mjs/);
assert.match(workflow,/d08_twse_percentile_snapshot_materialize_v0_1\.mjs/);
assert.doesNotMatch(workflow,/wrangler.*deploy|V7_DB|STOCKS_KV|PUSH_WEBHOOK_URL|FUGLE_API_KEY/i);

console.log(JSON.stringify({
  ok:true,
  guard:"D08_PERCENTILE_SNAPSHOT_MATERIALIZATION_V0_1",
  outcomeGate:"CLOSED",
  isolatedResearchStorage:true,
  formalCoreImpact:false,
}));
