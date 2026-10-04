import assert from "node:assert/strict";
import {evaluateD03PreParentSourceCutV0_1} from "../research/d03_pre_parent_source_cut_v0_1.mjs";
const H=n=>String(n).padStart(64,"0").slice(-64);
const parent={scanDate:"2026-10-05",knownAt:"2026-10-05T10:10:00.000Z",captureGeneration:"C1:2026-10-05:001",parentSnapshotHash:H(1)};
const lane=(i,range=true)=>({sourceId:"L"+i,state:"READY",payloadHash:H(10+i),observedAt:"2026-10-05T10:00:00.000Z",requiresRangeIdentity:range,responseRangeVerified:true,parserComplete:true});
const lanes=Array.from({length:8},(_,i)=>lane(i+1,i<6));
const version=(key,at,precision=false)=>({versionKey:key,observationMode:"PROSPECTIVE_POLL",firstObservedAt:at,payloadHash:H(30+Number(key.slice(-1))),precisionEligible:precision});
const base={
  sourceCutId:"CUT-1",scanDate:"2026-10-05",scope:"MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE",
  cutCompletedAt:"2026-10-05T10:01:00.000Z",requiredMarketWideLanes:lanes,
  expectedMopsVersionKeys:["V1","V2"],
  mopsExactVersionObservations:[version("V1","2026-10-05T09:58:00.000Z",false),version("V2","2026-10-05T10:00:30.000Z",false)],
  mopsCoverageComplete:true,queryTruncated:false,budgetExceeded:false,unknownRequiredLaneCount:0,noRevisionGapThroughCut:true,
};
const ok=evaluateD03PreParentSourceCutV0_1({cut:base,parent});
assert.equal(ok.status,"VALID_SOURCE_CUT_FOR_PARENT");
assert.equal(ok.eligible,true);
assert.equal(ok.precisionEligibleCount,0);
assert.equal(ok.highFrequencyPollingRequiredForParentEligibility,false);

const late=evaluateD03PreParentSourceCutV0_1({cut:{...base,cutCompletedAt:"2026-10-05T10:11:00.000Z"},parent});
assert.equal(late.eligible,false);assert.ok(late.reasons.includes("SOURCE_CUT_AFTER_PARENT"));

const selected=evaluateD03PreParentSourceCutV0_1({cut:{...base,scope:"SELECTED_ONLY"},parent});
assert.equal(selected.eligible,false);assert.ok(selected.reasons.includes("SELECTED_ONLY_SOURCE_CUT_FORBIDDEN"));

const lateVersion=evaluateD03PreParentSourceCutV0_1({cut:{...base,mopsExactVersionObservations:[version("V1","2026-10-05T09:58:00.000Z"),version("V2","2026-10-05T10:11:00.000Z")]},parent});
assert.equal(lateVersion.eligible,false);assert.ok(lateVersion.reasons.includes("MOPS_FIRST_OBSERVED_AFTER_PARENT"));

const retrospective=evaluateD03PreParentSourceCutV0_1({cut:{...base,mopsExactVersionObservations:[{...version("V1","2026-10-05T09:58:00.000Z"),observationMode:"RETROSPECTIVE_READBACK"},version("V2","2026-10-05T10:00:30.000Z")]},parent});
assert.equal(retrospective.eligible,false);assert.ok(retrospective.reasons.includes("MOPS_NOT_PROSPECTIVE"));

const incomplete=evaluateD03PreParentSourceCutV0_1({cut:{...base,mopsExactVersionObservations:[version("V1","2026-10-05T09:58:00.000Z")]},parent});
assert.equal(incomplete.eligible,false);assert.ok(incomplete.reasons.includes("MOPS_EXPECTED_OBSERVED_KEYSET_MISMATCH"));

const truncated=evaluateD03PreParentSourceCutV0_1({cut:{...base,queryTruncated:true},parent});
assert.equal(truncated.eligible,false);assert.ok(truncated.reasons.includes("SOURCE_QUERY_TRUNCATED"));

console.log(JSON.stringify({status:"PASS",ok,blockedCases:["late cut","selected-only","late version","retrospective version","incomplete keyset","truncated query"]},null,2));
