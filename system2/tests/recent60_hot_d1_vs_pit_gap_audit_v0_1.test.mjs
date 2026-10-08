import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  RECENT60_D1_VS_PIT_AUDIT_VERSION,
  selectRecent60MissingSamplesV0_1,
  auditRecent60HotD1VsPitSamplesV0_1,
} from "../runtime/recent60_hot_d1_vs_pit_gap_audit_v0_1.mjs";

const date="2026-10-08";
const decisionTimestamp="2026-10-09T00:55:00.000Z";
const history={
  marketDate:date,accountingComplete:true,globalIntegrityState:"READY",
  exactSessionReconciliationEnabled:true,currentUniverseCount:3,
  diagnostics:[
    {market:"TWSE",symbol:"1101",selectedDateCount:58,
      missingExpectedSessionCount:2,
      sessionReconciliationState:"EXACT_EXPECTED_SESSION_SET_AVAILABLE",
      requiredPriorSessionsForSymbol:60,
      missingExpectedSessionSample:["2026-09-23","2026-09-24"],
      blockerCodes:["SYMBOL_LOCAL_EXPECTED_SESSION_MISSING"]},
    {market:"TPEX",symbol:"6488",selectedDateCount:58,
      missingExpectedSessionCount:2,
      sessionReconciliationState:"EXACT_EXPECTED_SESSION_SET_AVAILABLE",
      requiredPriorSessionsForSymbol:60,
      missingExpectedSessionSample:["2026-09-23","2026-09-24"],
      blockerCodes:["SYMBOL_LOCAL_EXPECTED_SESSION_MISSING"]},
    {market:"TWSE",symbol:"2330",selectedDateCount:60,
      missingExpectedSessionCount:0,
      sessionReconciliationState:"EXACT_EXPECTED_SESSION_SET_AVAILABLE",
      requiredPriorSessionsForSymbol:60,
      missingExpectedSessionSample:[]},
  ],
};
const samples=selectRecent60MissingSamplesV0_1({
  history,marketDate:date,maxPerMarket:1,
});
assert.equal(samples.length,2);
assert.deepEqual(samples.map(x=>x.market+"|"+x.symbol),["TWSE|1101","TPEX|6488"]);
assert.deepEqual(samples[0].missingDateSample,["2026-09-23","2026-09-24"]);
assert.equal(samples[0].selectedDateCount,58);

const rows=[
  {market:"TWSE",symbol:"1101",market_date:"2026-09-23",
    price_space:"RAW",pit_replay_eligible:0,
    available_at:"2026-09-24T03:00:00.000Z",
    bar_hash:"noneligible",source_id:"TWSE_SOURCE"},
  {market:"TWSE",symbol:"1101",market_date:"2026-09-24",
    price_space:"RAW",pit_replay_eligible:1,
    available_at:"2026-10-09T03:00:00.000Z",
    bar_hash:"late",source_id:"TWSE_SOURCE"},
  {market:"TPEX",symbol:"6488",market_date:"2026-09-24",
    price_space:"ADJUSTED",pit_replay_eligible:1,
    available_at:"2026-09-24T09:00:00.000Z",
    bar_hash:"adjusted",source_id:"TPEX_SOURCE"},
];
const statements=[];
function fakeDb(override=rows){
  return {
    database:{name:"system2-research"},
    metrics:{rowsWritten:0,rowsRead:0},
    prepare(sql){
      statements.push(sql);
      assert.match(sql,/^SELECT\b/);
      assert.match(sql,/FROM s2_historical_a1_bars/);
      return {
        bind(market,symbol,...marketDates){
          assert.ok(marketDates.length>=1 && marketDates.length<=8);
          return {
            async all(){
              return {results:override.filter(row=>row.market===market
                && row.symbol===symbol && marketDates.includes(row.market_date))};
            },
          };
        },
      };
    },
  };
}
const db=fakeDb();
const got=await auditRecent60HotD1VsPitSamplesV0_1({
  db,samples,marketDate:date,decisionTimestamp,
});
assert.equal(got.schemaVersion,RECENT60_D1_VS_PIT_AUDIT_VERSION);
assert.equal(got.sampleSymbolCount,2);
assert.equal(got.sampleDateCount,4);
assert.equal(got.categoryCounts.HOT_D1_ROW_ABSENT,1);
assert.equal(got.categoryCounts.REQUESTED_RAW_PRICE_SPACE_ABSENT,1);
assert.equal(got.categoryCounts.PIT_REPLAY_ELIGIBILITY_NOT_GRANTED,1);
assert.equal(got.categoryCounts.AVAILABLE_AFTER_DIAGNOSTIC_CUTOFF,1);
assert.equal(got.d1RowsWritten,0);
assert.equal(got.retrospectivePITPromotionAllowed,false);
assert.equal(got.missingHistoricalPITBarImpliesPhysicalD1Absence,false);
assert.equal(got.missingD1HotRowImpliesAbsentFromColdR2,false);
assert.equal(got.continuityNoEventCertified,false);
assert.equal(statements.length,2);

const versionConflict=await auditRecent60HotD1VsPitSamplesV0_1({
  db:fakeDb([{market:"TWSE",symbol:"1101",market_date:"2026-09-23",
    price_space:"RAW",pit_replay_eligible:1,
    available_at:"2026-09-23T04:00:00Z",bar_hash:"eligible"}]),
  samples:[{...samples[0],missingDateSample:["2026-09-23"]}],
  marketDate:date,decisionTimestamp,
});
assert.equal(versionConflict.samples[0].checks[0].primaryObservation,
  "PIT_ELIGIBLE_ROW_PRESENT_READER_DIAGNOSTIC_DISAGREEMENT");

const missingTimestamp=await auditRecent60HotD1VsPitSamplesV0_1({
  db:fakeDb([{market:"TWSE",symbol:"1101",market_date:"2026-09-23",
    price_space:"RAW",pit_replay_eligible:1,
    available_at:null,bar_hash:"timestamp-missing"}]),
  samples:[{...samples[0],missingDateSample:["2026-09-23"]}],
  marketDate:date,decisionTimestamp,
});
assert.equal(missingTimestamp.samples[0].checks[0].primaryObservation,
  "AVAILABLE_AT_MISSING_OR_INVALID");

for(const invalid of [
  {...history,globalIntegrityState:"BLOCKED"},
  {...history,currentUniverseCount:2},
  {...history,accountingComplete:false},
  {...history,exactSessionReconciliationEnabled:false},
  {...history,diagnostics:[history.diagnostics[0],history.diagnostics[0],
    history.diagnostics[2]]},
  {...history,diagnostics:history.diagnostics.map((x,i)=>i===0?{
    ...x,missingExpectedSessionSample:["2026-10-08"]}:x)},
]){
  assert.throws(()=>selectRecent60MissingSamplesV0_1({
    history:invalid,marketDate:date,
  }));
}
await assert.rejects(()=>auditRecent60HotD1VsPitSamplesV0_1({
  db:{...fakeDb(),database:{name:"system1-production"}},
  samples,marketDate:date,decisionTimestamp,
}));
await assert.rejects(()=>auditRecent60HotD1VsPitSamplesV0_1({
  db:{...fakeDb(),metrics:{rowsWritten:1}},
  samples,marketDate:date,decisionTimestamp,
}));

const workflow=await readFile(
  new URL("../../.github/workflows/system2-recent60-hot-d1-vs-pit-readonly.yml",import.meta.url),"utf8",
);
const runner=await readFile(
  new URL("../scripts/audit_recent60_hot_d1_vs_pit_gap_readonly_v0_1.mjs",import.meta.url),"utf8",
);
assert.match(workflow,/audit_recent60_hot_d1_vs_pit_gap_readonly_v0_1\.mjs/);
assert.match(workflow,/permissions:\s*\n\s+contents: read/);
assert.match(workflow,/github.ref == 'refs\/heads\/main'/);
assert.match(workflow,/SYSTEM2_RECENT60_AUDIT_MARKET_DATE:/);
assert.doesNotMatch(workflow,/wrangler.*deploy|provision_system2_d1|SYSTEM2_CAPTURE_ENABLED:\s*true/);
assert.doesNotMatch(runner,/\.batch\s*\(|\.run\s*\(/);
assert.match(runner,/RETROSPECTIVE_DIAGNOSTIC_POST_FACTO/);
assert.match(runner,/rowsWritten,0/);
console.log("System2 sampled hot D1 versus PIT-eligible gap read-only tests PASS");
