import assert from "node:assert/strict";
import { reconcileMopsRepeatedCapturesV1_6_1 } from "../runtime/s2_07_mops_repeated_capture_stability_v1_6_1.mjs";

const H=c=>c.repeat(64);
const key=c=>"S2-MOPS-V:"+H(c);
const scope=H("a");
const obs=(k,p="b",at="2026-10-07T00:00:00Z",stockCode="2330")=>({
  versionKey:key(k),
  versionPayloadHash:H(p),
  firstObservedAt:at,
  stockCode,
  sourceReportedAt:"2026-10-06T23:59:00+08:00",
});
const capture=(capturedAt,observations)=>({
  capturedAt,
  stableEventUniverseHash:scope,
  prospectiveExactVersionCaptureReady:true,
  observations,
});

const drift=await reconcileMopsRepeatedCapturesV1_6_1({
  captures:[
    capture("2026-10-07T00:10:00Z",[obs("1","b","2026-10-07T00:05:00Z"),obs("2","c","2026-10-07T00:06:00Z")]),
    capture("2026-10-07T00:20:00Z",[obs("2","c","2026-10-07T00:07:00Z"),obs("3","d","2026-10-07T00:18:00Z")]),
  ],
});
assert.equal(drift.state,"REPEATED_CAPTURE_MEMBERSHIP_DRIFT_OBSERVED");
assert.equal(drift.membershipDriftObserved,true);
assert.equal(drift.unionVersionCount,3);
assert.equal(drift.intersectionVersionCount,1);
assert.equal(drift.transitions[0].addedVersionCount,1);
assert.equal(drift.transitions[0].removedVersionCount,1);
assert.equal(drift.expectedMopsKeysetComplete,false);
assert.equal(drift.noRevisionGapThroughCut,false);
assert.equal(drift.technicalContinuityCertified,false);
assert.equal(drift.selectionAuthority,false);
assert.equal(drift.system1RuntimeUsed,false);

const version2=drift.unionObservations.find(x=>x.versionKey===key("2"));
assert.equal(version2.earliestObservedAt,"2026-10-07T00:06:00.000Z");
assert.equal(version2.latestObservedAt,"2026-10-07T00:07:00.000Z");
assert.equal(version2.seenCaptureCount,2);
assert.equal(drift.earliestObservedPreservedByMin,true);
assert.equal(drift.laterCaptureMayNotOverwriteEarlierObservation,true);

const stable=await reconcileMopsRepeatedCapturesV1_6_1({
  captures:[
    capture("2026-10-07T00:10:00Z",[obs("1"),obs("2")]),
    capture("2026-10-07T00:20:00Z",[obs("1"),obs("2")]),
    capture("2026-10-07T00:30:00Z",[obs("1"),obs("2")]),
  ],
  requiredStableTailCount:3,
});
assert.equal(stable.state,"REPEATED_CAPTURE_TAIL_STABLE_COMPLETENESS_NOT_CERTIFIED");
assert.equal(stable.membershipDriftObserved,false);
assert.equal(stable.stableTailCount,3);
assert.equal(stable.requiredTailObserved,true);
assert.equal(stable.expectedMopsKeysetComplete,false);

const pairStable=await reconcileMopsRepeatedCapturesV1_6_1({
  captures:[
    capture("2026-10-07T00:10:00Z",[obs("1")]),
    capture("2026-10-07T00:20:00Z",[obs("1")]),
  ],
  requiredStableTailCount:3,
});
assert.equal(pairStable.state,"REPEATED_CAPTURE_PAIR_STABLE_MORE_CAPTURES_REQUIRED");
assert.equal(pairStable.stableTailCount,2);
assert.equal(pairStable.requiredTailObserved,false);

const conflict=await reconcileMopsRepeatedCapturesV1_6_1({
  captures:[
    capture("2026-10-07T00:10:00Z",[obs("1","b")]),
    capture("2026-10-07T00:20:00Z",[obs("1","f")]),
  ],
});
assert.equal(conflict.state,"REPEATED_CAPTURE_RECONCILIATION_BLOCKED");
assert.ok(conflict.blockers.includes("EXACT_VERSION_PAYLOAD_CONFLICT"));
assert.equal(conflict.payloadConflictCount,1);

const scopeMismatch=await reconcileMopsRepeatedCapturesV1_6_1({
  captures:[
    capture("2026-10-07T00:10:00Z",[obs("1")]),
    {...capture("2026-10-07T00:20:00Z",[obs("1")]),stableEventUniverseHash:H("e")},
  ],
});
assert.ok(scopeMismatch.blockers.includes("STABLE_EVENT_UNIVERSE_HASH_MISMATCH"));
assert.equal(scopeMismatch.reconciliationReady,false);

console.log("S2-07 MOPS repeated-capture stability V1.6.1 tests PASS");
