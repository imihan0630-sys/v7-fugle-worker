import assert from "node:assert/strict";
import {buildC3DepthSemanticsAudit} from "../research/system1_c3_depth_semantics_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

const baseAudit={
  schemaVersion:"SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_4",
  generationId:"g-depth-1",sessionDate:"2026-10-02",
  rows:[{
    symbol:"AAA",status:"READY",barCount:2,selectionDepthVerified:true,
    liveDepthCompleteBars:2,liveDepthCoveragePct:100,
    depthGuardSource:"SELECTION_TIME_DEPTH_SCORE",depthGuardUsesLiveOrderBook:false
  }],
  readyReceipts:[{
    symbol:"AAA",bars:[
      {depthScoreSemantics:"SELECTION_TIME_CONTEXT_REUSED_NOT_LIVE_ORDER_BOOK",liveDepthRawComplete:true,liveDepthScore:null,liveDepthScoreDerived:false},
      {depthScoreSemantics:"SELECTION_TIME_CONTEXT_REUSED_NOT_LIVE_ORDER_BOOK",liveDepthRawComplete:true,liveDepthScore:null,liveDepthScoreDerived:false}
    ]
  }],
  researchOnly:true,formalCoreImpact:false
};

const a=buildC3DepthSemanticsAudit(baseAudit);
eq(a.schemaVersion,"SYSTEM1_C3_DEPTH_SEMANTICS_AUDIT_V0_1");
eq(a.status,"RAW_LIVE_DEPTH_CAPTURE_READY_MAPPING_PREREGISTERED");
eq(a.totalBars,2);
eq(a.liveDepthCompleteBars,2);
eq(a.liveDepthCoveragePct,100);
eq(a.triggerUsesLiveOrderBook,false);
eq(a.selectionDepthStillUsedByTrigger,true);
eq(a.rawLiveDepthUsedForTrigger,false);
eq(a.liveDepthScoreMappingStatus,"PREREGISTERED_RESEARCH_ONLY_BASELINE_REQUIRED");
eq(a.liveDepthScoreDerived,false);
eq(a.liveDepthNormalizationContract.schemaVersion,"SYSTEM1_C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1");
eq(a.liveDepthNormalizationContract.outcomeBlind,true);
eq(a.liveDepthNormalizationContract.triggerAuthorized,false);
eq(a.liveDepthNormalizationContract.existingDepthThresholdsReusable,false);
eq(a.noRetestLiveDepthValidationReady,false);
eq(a.allReadyRawDepthComplete,true);
eq(a.allReadySemanticsValid,true);
eq(a.mustNotClaimPoorLiveDepthFilter,true);
eq(a.noTriggerMutation,true);
eq(a.economicSuperiority,"UNKNOWN");

const incomplete=buildC3DepthSemanticsAudit({
  ...baseAudit,
  rows:[{...baseAudit.rows[0],liveDepthCompleteBars:1,liveDepthCoveragePct:50}],
  readyReceipts:[{symbol:"AAA",bars:[
    baseAudit.readyReceipts[0].bars[0],
    {...baseAudit.readyReceipts[0].bars[1],liveDepthRawComplete:false}
  ]}]
});
eq(incomplete.status,"RAW_LIVE_DEPTH_INCOMPLETE");
eq(incomplete.liveDepthCoveragePct,50);
eq(incomplete.noRetestLiveDepthValidationReady,false);

assert.throws(()=>buildC3DepthSemanticsAudit({...baseAudit,schemaVersion:"SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_3"}),/C3_DEPTH_SEMANTICS_V0_4_AUDIT_REQUIRED/);n++;
assert.throws(()=>buildC3DepthSemanticsAudit({...baseAudit,researchOnly:false}),/C3_DEPTH_SEMANTICS_V0_4_AUDIT_REQUIRED/);n++;

ok(a.rows.every(x=>x.triggerUsesLiveOrderBook===false));

console.log(JSON.stringify({
  ok:true,assertions:n,rawDepthCaptured:true,rawDepthScored:false,
  liveDepthUsedByTrigger:false,noRetestLiveDepthValidationReady:false,
  triggerMutated:false,formalCoreImpact:false,system2Touched:false
}));
