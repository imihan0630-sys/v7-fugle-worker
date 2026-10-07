import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { reconcileRepeatedMopsCapturesV1_7 } from "../runtime/s2_07_mops_repeated_capture_stability_v1_7.mjs";

const paths=process.argv.slice(2);
if(paths.length<2) throw new Error("at least two capture artifact paths are required");

const captures=[];
const inputSummaries=[];
for(let i=0;i<paths.length;i++){
  const path=paths[i];
  const parsed=JSON.parse(await readFile(path,"utf8"));
  const receipt=parsed?.receipt;
  if(!receipt||typeof receipt!=="object") throw new Error("missing receipt in "+path);
  captures.push({...parsed,captureLabel:"R"+String(i+1)});
  inputSummaries.push({
    captureIndex:i,
    captureLabel:"R"+String(i+1),
    file:basename(path),
    capturedAt:receipt.capturedAt,
    stableEventUniverseHash:receipt.stableEventUniverseHash,
    uniqueGlobalVersionKeyCount:receipt.uniqueGlobalVersionKeyCount,
    coveredSymbolCount:receipt.coveredSymbolCount,
    queryKeysetExactEventCount:receipt.queryKeysetExactEventCount,
    monthOnlyVersionCount:receipt.monthOnlyVersionCount,
    yearOnlyVersionCount:receipt.yearOnlyVersionCount,
    prospectiveExactVersionCaptureReady:receipt.prospectiveExactVersionCaptureReady===true,
  });
}

const reconciliation=await reconcileRepeatedMopsCapturesV1_7({
  captures,
  minimumCaptureCount:4,
  requiredTrailingZeroUnionGrowthCaptures:2,
});

assert.equal(reconciliation.blockers.length,0,JSON.stringify(reconciliation.blockers));
assert.equal(reconciliation.captureCount,paths.length);
assert.equal(reconciliation.payloadMutationCount,0);
assert.equal(reconciliation.identityConflictCount,0);
assert.equal(reconciliation.earliestObservedAtPreserved,true);
assert.equal(reconciliation.sourceSemanticsCertified,false);
assert.equal(reconciliation.expectedMopsKeysetComplete,false);
assert.equal(reconciliation.noRevisionGapThroughCut,false);
assert.equal(reconciliation.preParentEvidenceCutReady,false);
assert.equal(reconciliation.symbolSessionCompletenessCertified,false);
assert.equal(reconciliation.technicalContinuityCertified,false);
assert.equal(reconciliation.scheduleAdded,false);
assert.equal(reconciliation.historyMutationPerformed,false);
assert.equal(reconciliation.selectionAuthority,false);
assert.equal(reconciliation.finalSelectionEnabled,false);
assert.equal(reconciliation.livePushEnabled,false);
assert.equal(reconciliation.capitalImpact,false);
assert.equal(reconciliation.orderImpact,false);
assert.equal(reconciliation.system1RuntimeUsed,false);

const artifact={
  schemaVersion:"S2_S2_07_MOPS_REPEATED_CAPTURE_STABILITY_V1_7_PHYSICAL",
  recordedDate:"2026-10-07",
  inputSummaries,
  reconciliation,
};
const out="/tmp/S2_07_MOPS_REPEATED_CAPTURE_STABILITY_V1_7_PHYSICAL_20261007.json";
await writeFile(out,JSON.stringify(artifact,null,2)+"\n","utf8");

console.log(JSON.stringify({
  result:"S2_07_MOPS_REPEATED_CAPTURE_STABILITY_V1_7_COMPLETE",
  captureCount:reconciliation.captureCount,
  state:reconciliation.state,
  stableEventUniverseHash:reconciliation.stableEventUniverseHash,
  immutableUnionHash:reconciliation.immutableUnionHash,
  unionVersionCount:reconciliation.unionVersionCount,
  trailingZeroUnionGrowthCaptureCount:reconciliation.trailingZeroUnionGrowthCaptureCount,
  boundedRepeatedCaptureUnionStabilized:reconciliation.boundedRepeatedCaptureUnionStabilized,
  latestPairMembershipStable:reconciliation.latestPairMembershipStable,
  allMembershipIdentical:reconciliation.allMembershipIdentical,
  payloadMutationCount:reconciliation.payloadMutationCount,
  lateDiscoveredPreexistingVersionCount:reconciliation.lateDiscoveredPreexistingVersionCount,
  disappearedAfterObservationVersionCount:reconciliation.disappearedAfterObservationVersionCount,
  intermittentMembershipVersionCount:reconciliation.intermittentMembershipVersionCount,
  membershipPatternCounts:reconciliation.membershipPatternCounts,
  expectedMopsKeysetComplete:reconciliation.expectedMopsKeysetComplete,
  nextGate:reconciliation.boundedRepeatedCaptureUnionStabilized
    ?"SOURCE_SEMANTICS_CERTIFICATION_BEFORE_EXPECTED_KEYSET_FREEZE"
    :"MORE_REPEATED_CAPTURE_UNION_STABILITY_EVIDENCE",
},null,2));
