import assert from "node:assert/strict";
import { reconcileRepeatedMopsCapturesV1_7 } from "../runtime/s2_07_mops_repeated_capture_stability_v1_7.mjs";

const H=(c)=>c.repeat(64);
const U=H("a");
function obs(key,stock,payload,firstObservedAt,sourceReportedAt="2026-10-01T01:00:00.000Z"){
  return {
    eligible:true,
    versionKey:"S2-MOPS-V:"+H(key),
    stockCode:stock,
    sourceReportedAt,
    seqNo:"1",
    versionPayloadHash:H(payload),
    firstObservedAt,
  };
}
function capture(label,capturedAt,observations,universe=U){
  return {
    captureLabel:label,
    receipt:{
      capturedAt,
      stableEventUniverseHash:universe,
      prospectiveExactVersionCaptureReady:true,
      coveredSymbolCount:23,
      uniqueGlobalVersionKeyCount:observations.length,
      observations,
    },
  };
}

const A1=obs("1","2330","1","2026-10-07T00:00:01.000Z");
const B1=obs("2","2317","2","2026-10-07T00:00:02.000Z");
const C2=obs("3","2454","3","2026-10-07T00:05:01.000Z");

const result=await reconcileRepeatedMopsCapturesV1_7({
  captures:[
    capture("R1","2026-10-07T00:01:00.000Z",[A1,B1]),
    capture("R2","2026-10-07T00:06:00.000Z",[
      {...A1,firstObservedAt:"2026-10-07T00:05:02.000Z"},
      {...B1,firstObservedAt:"2026-10-07T00:05:03.000Z"},
      C2,
    ]),
    capture("R3","2026-10-07T00:11:00.000Z",[
      {...A1,firstObservedAt:"2026-10-07T00:10:01.000Z"},
      {...C2,firstObservedAt:"2026-10-07T00:10:02.000Z"},
    ]),
    capture("R4","2026-10-07T00:16:00.000Z",[
      {...A1,firstObservedAt:"2026-10-07T00:15:01.000Z"},
      {...B1,firstObservedAt:"2026-10-07T00:15:02.000Z"},
      {...C2,firstObservedAt:"2026-10-07T00:15:03.000Z"},
    ]),
  ],
  minimumCaptureCount:4,
  requiredTrailingZeroUnionGrowthCaptures:2,
});

assert.equal(result.state,"REPEATED_CAPTURE_UNION_STABILIZED_SOURCE_SEMANTICS_PENDING");
assert.equal(result.boundedRepeatedCaptureUnionStabilized,true);
assert.equal(result.unionVersionCount,3);
assert.equal(result.trailingZeroUnionGrowthCaptureCount,2);
assert.equal(result.latestPairMembershipStable,false);
assert.equal(result.allMembershipIdentical,false);
assert.equal(result.payloadMutationCount,0);
assert.equal(result.earliestObservedAtPreserved,true);
assert.equal(result.expectedMopsKeysetComplete,false);
assert.equal(result.noRevisionGapThroughCut,false);
assert.equal(result.preParentEvidenceCutReady,false);
assert.equal(result.technicalContinuityCertified,false);
assert.equal(result.scheduleAdded,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

const byKey=new Map(result.unionVersions.map(v=>[v.versionKey,v]));
assert.equal(byKey.get(A1.versionKey).earliestObservedAt,"2026-10-07T00:00:01.000Z");
assert.equal(byKey.get(B1.versionKey).membershipPattern,"INTERMITTENT_MEMBERSHIP");
assert.equal(byKey.get(C2.versionKey).membershipPattern,"LATE_DISCOVERED_PREEXISTING");
assert.equal(byKey.get(C2.versionKey).missingEarlierWhileSourceExisted,1);
assert.ok(result.intermittentMembershipVersionKeys.includes(B1.versionKey));
assert.ok(result.lateDiscoveredPreexistingVersionKeys.includes(C2.versionKey));

const growing=await reconcileRepeatedMopsCapturesV1_7({
  captures:[
    capture("R1","2026-10-07T00:01:00.000Z",[A1]),
    capture("R2","2026-10-07T00:06:00.000Z",[A1,B1]),
    capture("R3","2026-10-07T00:11:00.000Z",[A1,B1,C2]),
    capture("R4","2026-10-07T00:16:00.000Z",[A1,B1,C2]),
  ],
});
assert.equal(growing.boundedRepeatedCaptureUnionStabilized,false);
assert.equal(growing.trailingZeroUnionGrowthCaptureCount,1);
assert.equal(growing.state,"REPEATED_CAPTURE_UNION_GROWTH_NOT_YET_STABILIZED");

const mutation=await reconcileRepeatedMopsCapturesV1_7({
  captures:[
    capture("R1","2026-10-07T00:01:00.000Z",[A1]),
    capture("R2","2026-10-07T00:06:00.000Z",[{...A1,versionPayloadHash:H("9"),firstObservedAt:"2026-10-07T00:05:00.000Z"}]),
  ],
  minimumCaptureCount:2,
  requiredTrailingZeroUnionGrowthCaptures:1,
});
assert.equal(mutation.state,"REPEATED_CAPTURE_RECONCILIATION_BLOCKED");
assert.ok(mutation.blockers.includes("MOPS_VERSION_PAYLOAD_MUTATION_ACROSS_CAPTURES"));
assert.equal(mutation.payloadMutationCount,1);

const mismatch=await reconcileRepeatedMopsCapturesV1_7({
  captures:[
    capture("R1","2026-10-07T00:01:00.000Z",[A1]),
    capture("R2","2026-10-07T00:06:00.000Z",[A1],H("b")),
  ],
  minimumCaptureCount:2,
  requiredTrailingZeroUnionGrowthCaptures:1,
});
assert.ok(mismatch.blockers.includes("STABLE_EVENT_UNIVERSE_HASH_MISMATCH"));

console.log("S2-07 repeated MOPS capture stability V1.7 tests PASS");
