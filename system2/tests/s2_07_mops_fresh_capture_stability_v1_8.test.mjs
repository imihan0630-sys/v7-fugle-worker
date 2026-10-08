import assert from "node:assert/strict";
import { buildMopsRepeatedCaptureUnionV1_7 } from "../runtime/s2_07_mops_repeated_capture_union_stability_v1_7.mjs";

const H="a".repeat(64);
const key=n=>"S2-MOPS-V:"+String(n).repeat(64).slice(0,64);
const hash=n=>String(n).repeat(64).slice(0,64);
const obs=(n,at)=>({
  versionKey:key(n),
  versionPayloadHash:hash(n),
  stockCode:"2330",
  sourceReportedAt:"2026-01-01T09:00:00+08:00",
  seqNo:String(n),
  sourceClockVersionKey:"2026-01-01|09:00:00|"+n,
  observedAt:at,
  sourceQueryRef:"2330|2026|01",
});
const cap=(id,at,nums)=>({
  captureId:id,
  capturedAt:at,
  stableEventUniverseHash:H,
  observations:nums.map((n,i)=>obs(n,new Date(Date.parse(at)-1000-i).toISOString())),
});

const drift=await buildMopsRepeatedCaptureUnionV1_7({
  captures:[
    cap("C1","2026-10-07T00:01:00Z",[1,2]),
    cap("C2","2026-10-07T00:02:00Z",[2,3]),
    cap("C3","2026-10-07T00:03:00Z",[2,3]),
    cap("C4","2026-10-08T04:07:37Z",[2,3,4]),
  ],
  requiredStableEventUniverseHash:H,
  minCaptureCount:4,
  trailingIdenticalTransitionRequirement:2,
});
assert.equal(drift.captureCount,4);
assert.equal(drift.appendOnlyUnion,true);
assert.equal(drift.earliestObservedPreserved,true);
assert.equal(drift.latestObservedPreserved,true);
assert.equal(drift.payloadConflictCount,0);
assert.equal(drift.trailingIdenticalTransitions,0);
assert.equal(drift.boundedStabilizationCandidate,false);
assert.equal(drift.expectedMopsKeysetComplete,false);
assert.equal(drift.noRevisionGapThroughCut,false);

const oneStable=await buildMopsRepeatedCaptureUnionV1_7({
  captures:[
    cap("C1","2026-10-07T00:01:00Z",[1,2]),
    cap("C2","2026-10-07T00:02:00Z",[2,3]),
    cap("C3","2026-10-07T00:03:00Z",[2,3]),
    cap("C4","2026-10-08T04:07:37Z",[2,3]),
  ],
  requiredStableEventUniverseHash:H,
  minCaptureCount:4,
  trailingIdenticalTransitionRequirement:2,
});
assert.equal(oneStable.trailingIdenticalTransitions,2);
assert.equal(oneStable.boundedStabilizationCandidate,true);
assert.equal(oneStable.expectedMopsKeysetComplete,false);
assert.equal(oneStable.noRevisionGapThroughCut,false);
assert.equal(oneStable.sourceSemanticsCertified,false);
assert.equal(oneStable.monthShardCoverageComplete,false);

const conflict=await buildMopsRepeatedCaptureUnionV1_7({
  captures:[
    cap("C1","2026-10-07T00:01:00Z",[1,2]),
    cap("C2","2026-10-07T00:02:00Z",[1,2]),
    cap("C3","2026-10-07T00:03:00Z",[1,2]),
    {
      ...cap("C4","2026-10-08T04:07:37Z",[1,2]),
      observations:[
        {...obs(1,"2026-10-08T04:07:36Z"),versionPayloadHash:"f".repeat(64)},
        obs(2,"2026-10-08T04:07:35Z"),
      ],
    },
  ],
  requiredStableEventUniverseHash:H,
  minCaptureCount:4,
  trailingIdenticalTransitionRequirement:2,
});
assert.equal(conflict.payloadConflictCount,1);
assert.equal(conflict.boundedStabilizationCandidate,false);
assert.ok(conflict.blockers.includes("CROSS_CAPTURE_PAYLOAD_CONFLICT"));

assert.equal(drift.selectionAuthority,false);
assert.equal(drift.system1RuntimeUsed,false);
assert.equal(drift.finalSelectionEnabled,false);
assert.equal(drift.livePushEnabled,false);
assert.equal(drift.capitalImpact,false);
assert.equal(drift.orderImpact,false);

console.log("S2-07 MOPS four-capture stability V1.8 tests PASS");
