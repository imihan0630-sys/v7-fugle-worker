import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {auditTwse2026Oct09OneShotArtifactV0_1 as audit} from "../runtime/historical_current_year_segment_one_shot_artifact_acceptance_v0_1.mjs";

const baseline=JSON.parse(readFileSync(new URL("../evidence/S2_2026_TWSE_JAN_JUN_INDEPENDENT_R2_BYTE_VERIFICATION_20261008_V0_1.json",import.meta.url)));
const run={id:37871005381,head_sha:"687432470b8ec81126356edb03d993d8d69df82a",
  head_branch:"main",event:"push",run_attempt:1,status:"completed",conclusion:"success"};
function end(m){return new Date(Date.UTC(2026,m,0)).toISOString().slice(0,10);}
function fixture(){
  const months=Array.from({length:9},(_,i)=>{
    const m=i+1;
    const shared={month:m,fromDate:"2026-"+String(m).padStart(2,"0")+"-01",
      toDate:end(m),batchId:"S2-HIST-SEGMENT-MONTH|TWSE|2026|"+String(m).padStart(2,"0")};
    if(m<=6){
      const b=baseline.months.find(x=>x.month===m);
      return {...shared,state:"ALREADY_RECEIPTED",receiptId:b.receiptId,
        manifestRollingHash:b.manifestRollingHash,packCount:b.packCount,barCount:b.barCount,
        checkpointRepairPerformed:false,repairVerification:null};
    }
    const packCount=1050,barCount=21000,hash=String(m).repeat(64);
    return {...shared,state:"COMPLETE",receiptId:"S2HSR-"+hash,manifestRollingHash:hash,
      packCount,barCount,tradingDateCount:20,officialRowCount:barCount,
      headObjectCountVerified:packCount,byteGetObjectCountVerified:packCount,
      insertedObjectCount:packCount,identicalObjectCount:0,
      insertedManifestCount:packCount,identicalManifestCount:0};
  });
  return {schemaVersion:"S2_HISTORICAL_CURRENT_YEAR_SEGMENT_BACKFILL_V0_1",
    result:"PASS_CURRENT_YEAR_COMPLETED_MONTH_SEGMENTS",
    market:"TWSE",year:2026,currentTaipeiMonth:10,throughMonth:9,completedMonthCount:9,
    insertedMonthCount:3,existingMonthCount:6,months,system1RuntimeChanged:false,
    policy:{onlyCompletedCalendarMonths:true,currentIncompleteMonthWritten:false,annualPackMutated:false}};
}
const check=(payload,r=run,b=baseline)=>audit({run:r,payload,baseline:b});
const ok=check(fixture());
assert.equal(ok.result,"PASS_ARTIFACT_INTERNAL_RECEIPTS_ONLY");
assert.deepEqual(ok.errors,[]);
assert.equal(ok.independentR2D1ReadbackCertified,false);
assert.equal(ok.originalPITFirstKnownAtCertified,false);
assert.equal(ok.ncT01PromotionAuthorized,false);

{
  const x=fixture();x.months[0].receiptId="S2HSR-"+("a".repeat(64));
  assert.ok(check(x).errors.includes("JAN_JUN_FROZEN_MONTH_RECEIPT_DRIFT"));
}
{
  const x=fixture();x.months[5].repairVerification="VERIFIED";
  assert.ok(check(x).errors.includes("JAN_JUN_FROZEN_MONTH_RECEIPT_DRIFT"));
}
{
  const x=fixture();x.months[0].checkpointRepairPerformed=true;x.months[0].repairVerification="VERIFIED";
  assert.equal(check(x).result,"PASS_ARTIFACT_INTERNAL_RECEIPTS_ONLY");
}
{
  const x=fixture();x.months[7].byteGetObjectCountVerified=1049;
  assert.ok(check(x).errors.includes("JUL_SEP_INTERNAL_PHYSICAL_COUNTS_UNVERIFIED"));
}
{
  const x=fixture();x.months[6].state="ALREADY_RECEIPTED";
  assert.ok(check(x).errors.includes("JUL_SEP_INTERNAL_PHYSICAL_COUNTS_UNVERIFIED"));
}
{
  const x=fixture();x.months.splice(7,1);x.months[7].month=9;
  assert.equal(check(x).result,"BLOCKED_FAIL_CLOSED");
}
{
  const x=fixture();x.months[2].fromDate="2026-03-02";
  assert.ok(check(x).errors.includes("MONTH_IDENTITY_OR_RECEIPT_INVALID"));
}
{
  const x=fixture();x.currentTaipeiMonth=11;
  assert.ok(check(x).errors.includes("ONE_SHOT_OUTPUT_CONTRACT_INVALID"));
}
{
  const x=fixture();x.insertedMonthCount=2;
  assert.ok(check(x).errors.includes("MONTH_ACCOUNTING_INVALID"));
}
{
  const x=fixture();x.policy.currentIncompleteMonthWritten=true;
  assert.ok(check(x).errors.includes("ONE_SHOT_OUTPUT_CONTRACT_INVALID"));
}
{
  const x=fixture();
  assert.ok(check(x,{...run,run_attempt:2}).errors.includes("ORIGINAL_RUN_NOT_SUCCESSFUL_FIRST_ATTEMPT"));
  assert.ok(check(x,{...run,conclusion:"failure"}).errors.includes("ORIGINAL_RUN_NOT_SUCCESSFUL_FIRST_ATTEMPT"));
  assert.ok(check(x,{...run,head_sha:"a".repeat(40)}).errors.includes("ORIGINAL_RUN_NOT_SUCCESSFUL_FIRST_ATTEMPT"));
}
{
  const x=fixture();
  assert.ok(check(x,run,{...baseline,months:baseline.months.slice(0,5)}).errors.includes("FROZEN_JAN_JUN_BASELINE_INVALID"));
}
{
  const x=fixture();x.result="BLOCKED_FAIL_CLOSED_SEGMENT_BACKFILL";
  assert.ok(check(x).errors.includes("ONE_SHOT_OUTPUT_CONTRACT_INVALID"));
}
console.log("System2 2026 TWSE Oct09 one-shot artifact fail-closed audit: 14 scenarios PASS");
