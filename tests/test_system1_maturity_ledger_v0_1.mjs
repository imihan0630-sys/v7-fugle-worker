import assert from "node:assert/strict";
import {buildSystem1FormalMaturityLedger} from "../research/system1_maturity_ledger_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

function packet(scanDate,targetDate,generationId,{cohortN=3,complete=true,auditVersion="SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_4"}={}){
  const symbols=Array.from({length:cohortN},(_,i)=>"S"+String(i+1));
  return {
    schemaVersion:"SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1",
    sourceSessionDate:scanDate,targetTradeDate:targetDate,generationId,
    cohort:{n:cohortN,symbols},
    capture:{
      barRows:complete?cohortN*17:Math.max(0,cohortN*17-1),
      quoteRows:cohortN*17,
      audit:{
        schemaVersion:auditVersion,
        eligibleN:cohortN,readyN:complete?cohortN:Math.max(0,cohortN-1),blockedN:complete?0:1
      }
    },
    c5:{denominatorN:100},
    researchOnly:true,formalCoreLocked:true
  };
}
function d5(scanDate,symbol,generationId){
  return {schemaVersion:"SYSTEM1_D5_MATURITY_RECEIPT_V0_1",scanDate,symbol,parentGenerationId:generationId,mature:true,
    afterCostReturnPct:1,mfePct:2,maePct:-1,observedAt:scanDate+"T13:35:00+08:00"};
}
function regime(scanDate,value){
  return {schemaVersion:"SYSTEM1_MARKET_REGIME_RECEIPT_V0_1",scanDate,regime:value,verified:true,knownAt:scanDate+"T15:00:00+08:00"};
}
const validation={
  dateClusterDirectionAgreementPct:70,sourceCoveragePass:true,purgedHoldoutPass:true,multipleTestingPass:true,
  redundancyPass:true,costStressPass:true,afterCostReturnAvailable:true,drawdownTailAvailable:true,mfeMaeAvailable:true,
  triggerFillFunnelAvailable:true,turnoverConcentrationAvailable:true,deploymentReserveAvailable:true,brokerFillsCashComplete:true
};

const one=buildSystem1FormalMaturityLedger({packets:[packet("2026-10-02","2026-10-05","g1",{cohortN:3})]});
eq(one.observed.completeProspectiveSnapshots,1);
eq(one.observed.independentScanDates,1);
eq(one.observed.matureD5Rows,0);
eq(one.countingRules.prospectiveSnapshot,"ONE_COMPLETE_TARGET_SESSION_PACKET_COUNTS_AT_MOST_ONE");
eq(one.interpretation.threeSymbolsInOneC3CohortDoNotCountAsThreeSnapshots,true);
eq(one.gate.eligibleForClassCReview,false);
eq(one.autoSwitchAuthorized,false);

const legacyV03=buildSystem1FormalMaturityLedger({
  packets:[packet("2026-09-30","2026-10-01","legacy-g",{cohortN:1,auditVersion:"SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_3"})]
});
eq(legacyV03.observed.completeProspectiveSnapshots,1);
eq(legacyV03.exclusions.invalidPacketN,0);

const incomplete=buildSystem1FormalMaturityLedger({
  packets:[packet("2026-10-02","2026-10-05","g1",{complete:false})],
  d5Receipts:[d5("2026-10-02","AAA","g1")]
});
eq(incomplete.observed.completeProspectiveSnapshots,0);
eq(incomplete.observed.independentScanDates,0);
eq(incomplete.observed.matureD5Rows,0);
eq(incomplete.exclusions.incompletePacketN,1);
eq(incomplete.exclusions.d5OutsideCompleteScanDates,["2026-10-02|AAA"]);
eq(incomplete.interpretation.incompletePacketDoesNotCountAsZeroOrNegativeDay,true);

const dates=[
  ...Array.from({length:15},(_,i)=>"2025-09-"+String(i+1).padStart(2,"0")),
  ...Array.from({length:15},(_,i)=>"2026-09-"+String(i+1).padStart(2,"0"))
];
const packets=dates.map((d,i)=>packet(d,d,"g"+i,{cohortN:3,complete:true}));
const d5Rows=dates.flatMap((d,i)=>[d5(d,"AAA","g"+i),d5(d,"BBB","g"+i)]);
const regimes=dates.map((d,i)=>regime(d,i<15?"TREND":"RANGE"));
const mature=buildSystem1FormalMaturityLedger({packets,d5Receipts:d5Rows,regimeReceipts:regimes,validation});
eq(mature.observed.completeProspectiveSnapshots,30);
eq(mature.observed.independentScanDates,30);
eq(mature.observed.matureD5Rows,60);
eq(mature.observed.calendarYears,2);
eq(mature.observed.marketRegimes,2);
eq(mature.progressPct.matureD5Rows,100);
eq(mature.progressPct.completeProspectiveSnapshots,100);
eq(mature.progressPct.independentScanDates,100);
eq(mature.gate.eligibleForClassCReview,true);
eq(mature.formalOptimizationCandidate,"EVIDENCE_GATE_PASSED_REVIEW_REQUIRED");
eq(mature.autoSwitchAuthorized,false);
eq(mature.interpretation.passingThresholdsStillRequiresClassCReview,true);

assert.throws(()=>buildSystem1FormalMaturityLedger({
  packets:[packet("2026-10-02","2026-10-05","g1"),packet("2026-10-02","2026-10-06","g1")]
}),/DUPLICATE_PACKET/);n++;
assert.throws(()=>buildSystem1FormalMaturityLedger({
  packets:[packet("2026-10-02","2026-10-05","g1")],
  d5Receipts:[d5("2026-10-02","AAA","g1"),d5("2026-10-02","AAA","g1")]
}),/DUPLICATE_D5_ROW/);n++;
assert.throws(()=>buildSystem1FormalMaturityLedger({
  packets:[packet("2026-10-02","2026-10-05","g1")],
  regimeReceipts:[regime("2026-10-02","TREND"),regime("2026-10-02","RANGE")]
}),/DUPLICATE_REGIME_DATE/);n++;

ok(mature.exclusions.invalidPacketN===0&&mature.exclusions.invalidD5N===0);

console.log(JSON.stringify({
  ok:true,assertions:n,oneSessionOneSnapshot:true,d5RequiresCompleteScan:true,twoYearGate:true,twoRegimeGate:true,
  classCReviewStillRequired:true,autoFormalSwitch:false,formalCoreImpact:false
}));
