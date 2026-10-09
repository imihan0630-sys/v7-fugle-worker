// Offline CLI: consumes a prior full read-only D1 census artifact, never Cloudflare.
import assert from "node:assert/strict";
import {readFile,writeFile} from "node:fs/promises";
import {buildOct08MissingKeyRepairPlanOfflineV0_1}
 from "../runtime/oct08_missing_key_repair_dryrun_planner_v0_1.mjs";

const censusInput=String(process.env.S2_OCT08_FULL_CENSUS_ARTIFACT_PATH||"").trim();
const output=String(process.env.S2_OCT08_REPAIR_DRYRUN_OUTPUT||
 "/tmp/s2-oct08-hot-history-repair-dryrun.json");
const officialPath=new URL(
 "../evidence/S2_OCT08_TWSE_TPEX_OFFICIAL_12_DATE_PHYSICAL_SOURCE_ACCEPTANCE_20261009_V0_1.json",
 import.meta.url);
let result=null;
try{
 assert.ok(censusInput,"exact independently obtained full physical census artifact path is required");
 assert.ok(censusInput!==output,"cannot overwrite supplied source census artifact");
 const census=JSON.parse(await readFile(censusInput,"utf8"));
 const official=JSON.parse(await readFile(officialPath,"utf8"));
 const observedAt=new Date().toISOString();
 result=buildOct08MissingKeyRepairPlanOfflineV0_1({census,official,observedAt});
 console.log("S2_OCT08_MISSING_KEY_PLAN_SUMMARY "+JSON.stringify({
  result:result.result,planDigest:result.planDigest,
  officialStockDateKeys:result.officialStockDateKeys,
  matched:result.matchedAtRetrospectiveCut,
  missingCandidates:result.missingKeyCandidateCount,
  quarantinedExistingConflicts:result.quarantineExistingConflictsCount,
  batchCount:result.proposedBatches.length,
  permissionToWrite:false,
  allHistoricalPITCertified:false,
 }));
}catch(error){
 result={
  schemaVersion:"S2_OCT08_MISSING_KEY_REPAIR_DRYRUN_BLOCKED_V0_1",
  result:"BLOCKED_INCOMPLETE_OR_UNTRUSTED_PHYSICAL_CENSUS_NO_REPAIR_PLAN",
  cutoff:"2026-10-08",observedAt:new Date().toISOString(),
  errorName:String(error?.name||"Error"),
  errorMessage:String(error?.message||error).slice(0,600),
  missingPhysicalCensusCannotBeInvented:true,
  permissionToWrite:false,originalHistoricalPITCertified:false,
  d1ReadRequests:0,d1Writes:0,r2Calls:0,system1RuntimeUsed:false,
 };
 process.exitCode=1;
}
await writeFile(output,JSON.stringify(result,null,2)+"\n","utf8");
console.log("S2_OCT08_MISSING_KEY_DRYRUN_RESULT "+JSON.stringify(result));
