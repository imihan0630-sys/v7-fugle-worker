import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {buildOct08MissingKeyRepairPlanOfflineV0_1 as plan}
 from "../runtime/oct08_missing_key_repair_dryrun_planner_v0_1.mjs";

const official=JSON.parse(await readFile(
 new URL("../evidence/S2_OCT08_TWSE_TPEX_OFFICIAL_12_DATE_PHYSICAL_SOURCE_ACCEPTANCE_20261009_V0_1.json",
 import.meta.url),"utf8"));
const dateList=official.officialWindow.dates;
const counts=official.officialWindow.samples;
assert.equal(counts.length,12);
assert.equal(counts.reduce((n,x)=>n+x.ordinarySymbolCount,0),11843);
const fieldType=[
 ["HOT_D1_KEY_ABSENT","missing",0],
 ["HOT_D1_SOURCE_VALUES_MISMATCH","mismatched",1],
 ["HOT_D1_RAW_MULTIVERSION","multi",2],
];
function fullCensus(problems=[]){
 const key=market=>market.market+"|"+market.marketDate;
 const issues=problems.map(({market="TWSE",marketDate="2026-10-01",
  symbol,state,seenRawVersions})=>({
   market,marketDate,symbol,state,seenRawVersions,
   originalPITAvailabilityUnproven:true,
 }));
 const days=counts.map(entry=>{
  const forDate=issues.filter(x=>key(x)===key(entry));
  const c={matched:entry.ordinarySymbolCount,
   missing:0,mismatched:0,multi:0};
  for(const i of forDate){
   const f=fieldType.find(x=>x[0]===i.state);
   if(!f)throw Error("invalid test fixture");
   c[f[1]]++;
   c.matched--;
  }
  return {stage:"DATE_TOTALS",market:entry.market,marketDate:entry.marketDate,
   sourceCount:entry.ordinarySymbolCount,...c,
   d1ReadRequests:Math.ceil(entry.ordinarySymbolCount/50)};
 });
 const agg={matched:0,missing:0,mismatched:0,multi:0};
 for(const d of days)for(const field of Object.keys(agg))agg[field]+=d[field];
 return {
  schemaVersion:"S2_OCT08_FULL_FROZEN_SOURCE_TO_HOT_D1_KEYS_READONLY_V0_1",
  result:problems.length?
   "BLOCKED_OCT08_MISSING_MISMATCHED_OR_MULTIVERSION_D1_KEYS":
   "PASS_ALL_11843_SOURCE_KEYS_MATCH_D1_VALUES_ONLY",
  marketDateCutoff:"2026-10-08",sourceReceiptsMatched:12,
  exactTradingDates:dateList,sourceSymbolDayKeys:11843,
  actualD1Queries:days.reduce((n,x)=>n+x.d1ReadRequests,0),
  counts:agg,discrepancies:[...issues,...days],
  observedD1:{rowsWritten:0,rowsRead:11843,requests:240},
  d1MissingUnrequestedExtraRecordsNotProvenAbsent:true,
  historicOriginalFirstKnownAtCertified:false,
  historicPITReplayAuthorized:false,d1Writes:0,r2Writes:0,
  system1RuntimeUsed:false,
 };
}
const clock="2026-10-09T05:00:00Z";
const fail=(census,source=official)=>plan({census,official:source,observedAt:clock});
const base=fullCensus();
assert.equal(base.actualD1Queries,240);
const pass=fail(base);
assert.equal(pass.result,"NO_MISSING_KEYS_FOUND_IN_SOURCE_TO_D1_DIRECTION_ONLY");
assert.equal(pass.planDigest.length,64);
assert.equal(pass.officialStockDateKeys,11843);
assert.equal(pass.proposedBatches.length,0);
assert.equal(pass.permissionToWrite,false);
const problem=fullCensus([
 {market:"TWSE",marketDate:"2026-10-01",symbol:"1000",
  state:"HOT_D1_KEY_ABSENT",seenRawVersions:0},
 {market:"TWSE",marketDate:"2026-10-01",symbol:"1001",
  state:"HOT_D1_SOURCE_VALUES_MISMATCH",seenRawVersions:1},
 {market:"TWSE",marketDate:"2026-10-01",symbol:"1002",
  state:"HOT_D1_RAW_MULTIVERSION",seenRawVersions:2},
]);
const first=fail(problem);
assert.equal(first.result,"REVIEW_ONLY_MISSING_KEY_CANDIDATES_AND_QUARANTINE_NO_WRITES");
assert.equal(first.missingKeyCandidateCount,1);
assert.equal(first.quarantineExistingConflictsCount,2);
assert.equal(first.proposedBatches.length,1);
assert.deepEqual(first.proposedBatches[0].symbols,["1000"]);
assert.equal(first.proposedBatches[0].authorityToExecute,false);
assert.equal(first.proposedBatches[0].firstKnownAtMayBeBackdated,false);
assert.equal(first.originalPITReplayCertified,false);
assert.equal(first.estimatedFutureInsertionsUpperBoundNotCloudflareQuotaReservation,1);
assert.equal(fail(problem).planDigest,first.planDigest);
assert.equal(first.d1ReadRequestsPerformedByPlanner,0);
assert.equal(first.d1RowsWrittenByPlanner,0);
assert.equal(first.r2ObjectsTouchedByPlanner,0);
assert.equal(first.system1RuntimeUsed,false);

const changes=[
 [()=>({...problem,result:"PASS_ALL_11843_SOURCE_KEYS_MATCH_D1_VALUES_ONLY"}),"contradicts counts"],
 [()=>({...problem,counts:{...problem.counts,missing:2}}),"global denominator"],
 [()=>({...problem,discrepancies:problem.discrepancies.filter(x=>
  !(x.stage==="DATE_TOTALS"&&x.market==="TPEX"&&x.marketDate==="2026-10-08"))}),"all 12"],
 [()=>({...problem,discrepancies:[...problem.discrepancies,problem.discrepancies[0]]}),"duplicate discrepancy"],
 [()=>({...problem,discrepancies:problem.discrepancies.map(x=>x.symbol==="1000"?
  {...x,seenRawVersions:1}:x)}),"Expected values"],
 [()=>({...problem,discrepancies:problem.discrepancies.map(x=>x.symbol==="1001"?
  {...x,originalPITAvailabilityUnproven:false}:x)}),"Expected values"],
 [()=>({...problem,discrepancies:problem.discrepancies.map(x=>x.symbol==="1002"?
  {...x,state:"UNKNOWN_CONFLICT"}:x)}),"unrecognized"],
 [()=>({...problem,sourceReceiptsMatched:11}),"Expected values"],
 [()=>({...problem,observedD1:{...problem.observedD1,rowsWritten:1}}),"read-only"],
 [()=>({...problem,historicPITReplayAuthorized:true}),"Expected values"],
 [()=>({...problem,result:"BLOCKED_FAIL_CLOSED_FULL_SOURCE_TO_D1_READ_ONLY"}),"full terminal"],
 [()=>({...problem,discrepancies:problem.discrepancies.map(x=>x.stage==="DATE_TOTALS"
  &&x.market==="TWSE"&&x.marketDate==="2026-10-01"?{...x,missing:0,matched:x.matched+1}:x)}),"detail/summary"],
 [()=>({...problem,actualD1Queries:239}),"day query provenance"],
];
for(const [build,message] of changes){
 await assert.rejects(async()=>fail(build()),new RegExp(message));
}
await assert.rejects(async()=>fail(problem,{...official,cutoff:"2026-10-07"}),/Expected values/);
await assert.rejects(async()=>plan({census:problem,official,
 observedAt:"2026-10-08T00:00:00Z"}),/may not predate/);
await assert.rejects(async()=>plan({census:problem,official,observedAt:clock,
 maxKeysPerProposedBatch:51}),/invalid/);
const runner=await readFile(new URL(
 "../scripts/build_oct08_missing_key_repair_dryrun_offline_v0_1.mjs",import.meta.url),"utf8");
assert.match(runner,/S2_OCT08_FULL_CENSUS_ARTIFACT_PATH/);
assert.match(runner,/missingPhysicalCensusCannotBeInvented/);
assert.doesNotMatch(runner,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|remote_d1_rest_adapter|\.batch\s*\(|\.run\s*\(/);
console.log("System2 2026-10-08 offline repair planner positive/no-missing + 15 fail-closed/PIT/denominator conflict guards PASS");
