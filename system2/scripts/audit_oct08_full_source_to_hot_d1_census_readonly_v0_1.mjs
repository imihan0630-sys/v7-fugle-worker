import assert from "node:assert/strict";
import {readFile,writeFile} from "node:fs/promises";
import {createRemoteD1RestAdapter} from "../deploy/remote_d1_rest_adapter.mjs";
import {auditOct08FullSourceKeysHotD1ReadonlyV0_1}
 from "../runtime/oct08_full_source_to_hot_d1_census_readonly_v0_1.mjs";

const output=process.env.S2_OCT08_FULL_D1_CENSUS_RESULT
 ||"/tmp/s2-oct08-full-source-hot-d1-census.json";
const sourceEvidence=new URL("../evidence/S2_OCT08_TWSE_TPEX_OFFICIAL_12_DATE_PHYSICAL_SOURCE_ACCEPTANCE_20261009_V0_1.json",import.meta.url);
let db=null,stage={stage:"START"},partialD1Checks=0;
let outcome=null;
try{
 assert.equal(process.env.S2_D1_CENSUS_BUDGET_CONFIRMED,"true",
  "REMEDIATION_LANE_CROSS_SYSTEM_D1_READ_QUOTA_NOT_CONFIRMED");
 assert.equal(process.env.S2_D1_NO_COMPETING_WRITER_CONFIRMED,"true",
  "NO_COMPETING_D1_WRITER_CONFIRMATION_REQUIRED");
 const id=process.env.CLOUDFLARE_ACCOUNT_ID;
 const token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
 assert.ok(id&&token,"isolated D1 research credentials required");
 const evidence=JSON.parse(await readFile(sourceEvidence,"utf8"));
 db=await createRemoteD1RestAdapter({accountId:id,apiToken:token,
  databaseName:"system2-research"});
 const result=await auditOct08FullSourceKeysHotD1ReadonlyV0_1({
  db,evidence,onStage:x=>{
   stage=x;
   if(x.stage==="D1_CHUNK_CHECKED"){
    partialD1Checks++;
    console.log("S2_OCT08_CENSUS_CHUNK "+JSON.stringify(x));
   }else if(x.stage==="FROZEN_SOURCE_VERIFIED"){
    console.log("S2_OCT08_CENSUS_SOURCE "+JSON.stringify(x));
   }
  },
 });
 outcome={...result,observedAt:new Date().toISOString(),
  stageReached:stage,completedD1Chunks:partialD1Checks};
 if(!result.result.startsWith("PASS_"))process.exitCode=1;
}catch(error){
 outcome={
  schemaVersion:"S2_OCT08_FULL_SOURCE_HOT_D1_CENSUS_FAIL_CLOSED_V0_1",
  result:"BLOCKED_FAIL_CLOSED_FULL_SOURCE_TO_D1_READ_ONLY",
  marketDateCutoff:"2026-10-08",lastCompletedStage:stage,
  completedD1Chunks:partialD1Checks,
  reason:String(error?.message||error).slice(0,650),
  errorName:String(error?.name||"Error"),
  observedD1:db?{requests:db.metrics.requestCount,
   rowsRead:db.metrics.rowsRead,rowsWritten:db.metrics.rowsWritten}:null,
  officialSourceNoDataNotInferred:true,noPITBackdating:true,
  d1WritesRequested:false,r2WritesRequested:false,
  fullOctoberDataNotCertified:true,system1RuntimeUsed:false,
 };
 process.exitCode=1;
}
await writeFile(output,JSON.stringify(outcome,null,2)+"\n","utf8");
console.log("S2_OCT08_FULL_SOURCE_TO_D1_CENSUS_RESULT "+JSON.stringify(outcome));
