import assert from "node:assert/strict";
import { buildMopsRepeatedCaptureUnionV1_7 } from "../runtime/s2_07_mops_repeated_capture_union_stability_v1_7.mjs";

const H="a".repeat(64);
const K=(n)=>"S2-MOPS-V:"+String(n).repeat(64).slice(0,64);
const payload=(n)=>String(n).repeat(64).slice(0,64);
const obs=(key,hash,at,ref,stockCode="2330")=>({
  versionKey:key,
  versionPayloadHash:hash,
  stockCode,
  sourceReportedAt:"2026-01-01T09:00:00+08:00",
  seqNo:"1",
  sourceClockVersionKey:"2026-01-01|09:00:00|1",
  observedAt:at,
  firstObservedAt:at,
  sourceQueryRef:ref,
});

const captures=[
  {
    captureId:"C1",capturedAt:"2026-10-07T00:01:00Z",stableEventUniverseHash:H,
    observations:[
      obs(K(1),payload(1),"2026-10-07T00:00:10Z","2330|2026|01"),
      obs(K(2),payload(2),"2026-10-07T00:00:20Z","2330|2026|01"),
    ],
  },
  {
    captureId:"C2",capturedAt:"2026-10-07T00:02:00Z",stableEventUniverseHash:H,
    observations:[
      obs(K(2),payload(2),"2026-10-07T00:01:20Z","2330|2026|01"),
      obs(K(3),payload(3),"2026-10-07T00:01:30Z","2330|2026|01"),
    ],
  },
  {
    captureId:"C3",capturedAt:"2026-10-07T00:03:00Z",stableEventUniverseHash:H,
    observations:[
      obs(K(2),payload(2),"2026-10-07T00:02:20Z","2330|2026|01"),
      obs(K(3),payload(3),"2026-10-07T00:02:30Z","2330|2026|01"),
    ],
  },
  {
    captureId:"C4",capturedAt:"2026-10-07T00:04:00Z",stableEventUniverseHash:H,
    observations:[
      obs(K(2),payload(2),"2026-10-07T00:03:20Z","2330|2026|01"),
      obs(K(3),payload(3),"2026-10-07T00:03:30Z","2330|2026|01"),
    ],
  },
];

const receipt=await buildMopsRepeatedCaptureUnionV1_7({
  captures,
  requiredStableEventUniverseHash:H,
  minCaptureCount:4,
  trailingIdenticalTransitionRequirement:2,
});
assert.equal(receipt.state,"MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_CANDIDATE");
assert.equal(receipt.captureCount,4);
assert.equal(receipt.unionVersionKeyCount,3);
assert.equal(receipt.latestCaptureVersionKeyCount,2);
assert.equal(receipt.unionMissingFromLatestCount,1);
assert.equal(receipt.trailingIdenticalTransitions,2);
assert.equal(receipt.boundedStabilizationCandidate,true);
assert.equal(receipt.earliestObservedPreserved,true);
assert.equal(receipt.latestObservedPreserved,true);
assert.equal(receipt.appendOnlyUnion,true);
assert.equal(receipt.absenceMeansNonexistence,false);
assert.equal(receipt.expectedMopsKeysetComplete,false);
assert.equal(receipt.noRevisionGapThroughCut,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

const a=receipt.versions.find(x=>x.versionKey===K(1));
const b=receipt.versions.find(x=>x.versionKey===K(2));
const c=receipt.versions.find(x=>x.versionKey===K(3));
assert.deepEqual(a.observedCaptureIds,["C1"]);
assert.deepEqual(a.absentCaptureIds,["C2","C3","C4"]);
assert.equal(a.presentInLatestCapture,false);
assert.equal(a.absenceMeansNonexistence,false);
assert.equal(a.firstObservedAt,"2026-10-07T00:00:10.000Z");
assert.equal(b.firstObservedAt,"2026-10-07T00:00:20.000Z");
assert.equal(b.latestObservedAt,"2026-10-07T00:03:20.000Z");
assert.deepEqual(c.absentCaptureIds,["C1"],"later-discovered versions must retain earlier absence provenance");
assert.equal(receipt.monthOnlyDriftVersionCount,2);

const unstable=await buildMopsRepeatedCaptureUnionV1_7({
  captures:captures.slice(0,3),
  requiredStableEventUniverseHash:H,
  minCaptureCount:4,
  trailingIdenticalTransitionRequirement:2,
});
assert.equal(unstable.state,"MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_PENDING");
assert.equal(unstable.boundedStabilizationCandidate,false);
assert.equal(unstable.expectedMopsKeysetComplete,false);

const conflictCaptures=structuredClone(captures);
conflictCaptures[1].observations[0].versionPayloadHash="f".repeat(64);
const conflict=await buildMopsRepeatedCaptureUnionV1_7({
  captures:conflictCaptures,
  requiredStableEventUniverseHash:H,
});
assert.equal(conflict.state,"MOPS_APPEND_ONLY_UNION_BLOCKED");
assert.ok(conflict.blockers.includes("CROSS_CAPTURE_PAYLOAD_CONFLICT"));

const wrongUniverse=structuredClone(captures);
wrongUniverse[3].stableEventUniverseHash="b".repeat(64);
const wrong=await buildMopsRepeatedCaptureUnionV1_7({
  captures:wrongUniverse,
  requiredStableEventUniverseHash:H,
});
assert.equal(wrong.state,"MOPS_APPEND_ONLY_UNION_BLOCKED");
assert.ok(wrong.blockers.includes("STABLE_EVENT_UNIVERSE_HASH_MISMATCH"));

console.log("S2-07 MOPS repeated-capture union stability V1.7 tests PASS");
