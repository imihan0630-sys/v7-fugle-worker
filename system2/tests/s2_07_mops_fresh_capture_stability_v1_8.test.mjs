import assert from "node:assert/strict";
import { buildMopsRepeatedCaptureUnionV1_7 } from "../runtime/s2_07_mops_repeated_capture_union_stability_v1_7.mjs";

const H="a".repeat(64);
const key=n=>"S2-MOPS-V:"+String(n).repeat(64).slice(0,64);
const hash=n=>String(n).repeat(64).slice(0,64);
const obs=(n,at)=>({
  versionKey:key(n),versionPayloadHash:hash(n),stockCode:"2330",
  sourceReportedAt:"2026-01-01T09:00:00+08:00",seqNo:String(n),
  sourceClockVersionKey:"2026-01-01|09:00:00|"+n,
  observedAt:at,sourceQueryRef:"2330|2026|01"
});
const cap=(id,at,nums)=>({captureId:id,capturedAt:at,stableEventUniverseHash:H,observations:nums.map((n,i)=>obs(n,new Date(Date.parse(at)-1000-i).toISOString()))});

const receipt=await buildMopsRepeatedCaptureUnionV1_7({
  captures:[
    cap("C1","2026-10-07T00:01:00Z",[1,2]),
    cap("C2","2026-10-07T00:02:00Z",[2,3]),
    cap("C3","2026-10-07T00:03:00Z",[2,3]),
    cap("C4","2026-10-07T00:04:00Z",[2,3,4]),
  ],
  requiredStableEventUniverseHash:H,
  minCaptureCount:4,
  trailingIdenticalTransitionRequirement:2,
});
assert.equal(receipt.captureCount,4);
assert.equal(receipt.appendOnlyUnion,true);
assert.equal(receipt.earliestObservedPreserved,true);
assert.equal(receipt.latestObservedPreserved,true);
assert.equal(receipt.payloadConflictCount,0);
assert.equal(receipt.boundedStabilizationCandidate,false,"fresh membership change must reset trailing stability");
assert.equal(receipt.trailingIdenticalTransitions,0);
assert.equal(receipt.expectedMopsKeysetComplete,false);
assert.equal(receipt.noRevisionGapThroughCut,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);
console.log("S2-07 MOPS fresh-capture stability V1.8 tests PASS");
