import {requireOct08ReadonlyBudgetQualificationV0_1} from "./qualify_oct08_readonly_d1_account_budget_v0_1.mjs";
import assert from "node:assert/strict";
import {readFile,writeFile} from "node:fs/promises";
import {createRemoteD1RestAdapter} from "../deploy/remote_d1_rest_adapter.mjs";
import {auditOct08HotD1BoundedSourceMatchedReadV0_1}
 from "../runtime/oct08_hot_d1_source_matched_sample_readonly_v0_1.mjs";

const out=process.env.S2_OCT08_BOUNDED_D1_RESULT
 ||"/tmp/s2-oct08-hot-d1-source-matched-sample.json";
const evidencePath=new URL("../evidence/S2_OCT08_TWSE_TPEX_OFFICIAL_12_DATE_PHYSICAL_SOURCE_ACCEPTANCE_20261009_V0_1.json",import.meta.url);
let db=null,stage={stage:"GUARDS"},observed=0;
let result=null;
try{
 assert.equal(process.env.S2_D1_READ_BUDGET_CONFIRMED,"true","REMEDIATION_D1_READ_BUDGET_NOT_CONFIRMED");
 assert.equal(process.env.S2_NO_COMPETING_D1_WRITER_CONFIRMED,"true","NO_COMPETING_D1_WRITER_NOT_CONFIRMED");
 const qualifiedReadBudget=await requireOct08ReadonlyBudgetQualificationV0_1("SAMPLE_36");
 console.log("S2_OCT08_D1_READ_BUDGET_EVIDENCE "+JSON.stringify(qualifiedReadBudget));
 const a=process.env.CLOUDFLARE_ACCOUNT_ID;
 const token=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
 assert.ok(a&&token,"isolated System2 remote read credentials missing");
 const evidence=JSON.parse(await readFile(evidencePath,"utf8"));
 // If this run's zero-cost public source preflight has new revisions,
 // the verifier fails BEFORE its first physical D1 query.
 db=await createRemoteD1RestAdapter({accountId:a,apiToken:token,databaseName:"system2-research"});
 result=await auditOct08HotD1BoundedSourceMatchedReadV0_1({
  db,evidence,onStage:s=>{
   stage=s;
   if(s.stage==="SAMPLE_OBSERVED"){
    observed++;
    console.log("S2_OCT08_D1_SAMPLE "+JSON.stringify(s));
   }
  },
 });
 result={...result,runAt:new Date().toISOString(),observedSamples:observed};
 if(!result.result.startsWith("PASS_"))process.exitCode=1;
}catch(error){
 result={
  result:"BLOCKED_FAIL_CLOSED_OCT08_HOT_D1_READ_ONLY",
  schemaVersion:"S2_OCT08_HOT_D1_READONLY_FAILURE_V0_1",
  errorName:String(error?.name||"Error"),reason:String(error?.message||error).slice(0,650),
  lastStage:stage,observedSamples:observed,asOf:"2026-10-08",
  d1Metrics:db?{
   requestCount:db.metrics.requestCount,
   rowsRead:db.metrics.rowsRead,rowsWritten:db.metrics.rowsWritten,
  }:null,
  noFullHotD1Proof:true,noBackdatedFirstKnownAt:true,
  noSourceNoEventInference:true,d1WritesRequested:false,
  system1RuntimeUsed:false,
 };
 process.exitCode=1;
}
await writeFile(out,JSON.stringify(result,null,2)+"\n","utf8");
console.log("S2_OCT08_BOUNDED_D1_SOURCE_MATCH_RESULT "+JSON.stringify(result));
