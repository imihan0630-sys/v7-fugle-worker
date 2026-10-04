import assert from "node:assert/strict";
import {evaluateD03PreParentSourceCutV0_2} from "../research/d03_pre_parent_source_cut_v0_2.mjs";
const H=n=>String(n).padStart(64,"0").slice(-64);
const lane=i=>({sourceId:"L"+i,state:"READY",payloadHash:H(10+i),observedAt:"2026-10-05T10:08:00.000Z",requiresRangeIdentity:i<=6,responseRangeVerified:true,parserComplete:true});
const lanes=Array.from({length:8},(_,i)=>lane(i+1));
const parent={
 scanDate:"2026-10-05",captureGeneration:"C1:2026-10-05:001",parentSnapshotHash:H(1),
 decisionCutoffAt:"2026-10-05T10:09:00.000Z",
 decisionAt:"2026-10-05T10:10:05.000Z",
 knownAt:"2026-10-05T10:10:05.000Z"
};
const version={versionKey:"V1",observationMode:"PROSPECTIVE_POLL",firstObservedAt:"2026-10-05T10:08:30.000Z",payloadHash:H(30),precisionEligible:false};
const cut={
 sourceCutId:"CUT-1",scanDate:"2026-10-05",scope:"MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE",
 cutCompletedAt:"2026-10-05T10:08:50.000Z",requiredMarketWideLanes:lanes,
 expectedMopsVersionKeys:["V1"],mopsExactVersionObservations:[version],
 mopsCoverageComplete:true,queryTruncated:false,budgetExceeded:false,unknownRequiredLaneCount:0,noRevisionGapThroughCut:true
};
const ok=evaluateD03PreParentSourceCutV0_2({cut,parent});
assert.equal(ok.eligible,true);assert.equal(ok.strictEligibilityClock,"DECISION_CUTOFF_AT");

const missing=evaluateD03PreParentSourceCutV0_2({cut,parent:{...parent,decisionCutoffAt:null}});
assert.equal(missing.eligible,false);assert.ok(missing.reasons.includes("PARENT_DECISION_CUTOFF_NOT_PERSISTED"));

const receiptGapCut={...cut,cutCompletedAt:"2026-10-05T10:09:30.000Z",requiredMarketWideLanes:lanes.map(x=>({...x,observedAt:"2026-10-05T10:09:20.000Z"})),mopsExactVersionObservations:[{...version,firstObservedAt:"2026-10-05T10:09:25.000Z"}]};
const blocked=evaluateD03PreParentSourceCutV0_2({cut:receiptGapCut,parent});
assert.equal(blocked.eligible,false);
assert.ok(blocked.reasons.includes("SOURCE_CUT_AFTER_PARENT")||blocked.reasons.includes("SOURCE_LANE_AFTER_PARENT")||blocked.reasons.includes("MOPS_FIRST_OBSERVED_AFTER_PARENT"));

const badOrder=evaluateD03PreParentSourceCutV0_2({cut,parent:{...parent,decisionCutoffAt:"2026-10-05T10:11:00.000Z"}});
assert.equal(badOrder.eligible,false);assert.ok(badOrder.reasons.includes("DECISION_CUTOFF_AFTER_DECISION_AT"));

console.log(JSON.stringify({
 status:"PASS",
 strictClock:ok.strictEligibilityClock,
 decisionAtMaySubstituteForCutoff:ok.decisionAtMaySubstituteForCutoff,
 blockedCases:["missing decisionCutoffAt","source visible after cutoff but before receipt stamp","cutoff after decisionAt"]
},null,2));
