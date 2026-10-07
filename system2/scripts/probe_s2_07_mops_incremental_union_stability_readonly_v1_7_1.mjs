import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { extendMopsAppendOnlyUnionV1_7_1 } from "../runtime/s2_07_mops_incremental_union_stability_v1_7_1.mjs";

const REQUIRED_HASH="b7941323ed1969a17697bc58be3d549b7e244f4dfc45b81a0bc6d5645fc305b0";
const seedArtifact=JSON.parse(await readFile(process.env.S2_V17_SEED_PATH||"/tmp/v171/seed/S2_07_MOPS_REPEATED_CAPTURE_UNION_STABILITY_V1_7_PHYSICAL_20261007.json","utf8"));
const freshArtifact=JSON.parse(await readFile(process.env.S2_V16_FRESH_PATH||"/tmp/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json","utf8"));
assert.ok(seedArtifact?.receipt,"V1.7 seed receipt missing");
assert.ok(freshArtifact?.receipt,"fresh V1.6 receipt missing");
assert.equal(seedArtifact.receipt.unionVersionKeyCount,168,"accepted seed union drift");
assert.equal(seedArtifact.receipt.stableEventUniverseHash,REQUIRED_HASH,"seed event universe drift");
assert.equal(freshArtifact.receipt.stableEventUniverseHash,REQUIRED_HASH,"fresh event universe drift");
assert.equal(freshArtifact.receipt.prospectiveExactVersionCaptureReady,true,"fresh V1.6 capture not ready");

const runId=process.env.GITHUB_RUN_ID||"NA";
const receipt=await extendMopsAppendOnlyUnionV1_7_1({
  seedReceipt:seedArtifact.receipt,
  freshCapture:{
    captureId:"RUN:"+runId+":FRESH_V16",
    workflowRunId:runId,
    artifactId:null,
    receipt:freshArtifact.receipt,
  },
  requiredStableEventUniverseHash:REQUIRED_HASH,
  minCaptureCount:4,
  trailingIdenticalTransitionRequirement:2,
});

assert.equal(receipt.captureCount,4);
assert.equal(receipt.earliestObservedPreserved,true);
assert.equal(receipt.latestObservedPreserved,true);
assert.equal(receipt.payloadConflictCount,0,JSON.stringify(receipt.blockers));
assert.equal(receipt.expectedMopsKeysetComplete,false);
assert.equal(receipt.noRevisionGapThroughCut,false);
assert.equal(receipt.preParentEvidenceCutReady,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.scheduleAdded,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

const artifact={
  schemaVersion:"S2_S2_07_MOPS_INCREMENTAL_UNION_STABILITY_V1_7_1_PHYSICAL",
  recordedDate:"2026-10-07",
  seedArtifactId:11464480276,
  seedUnionHash:seedArtifact.receipt.unionHash,
  freshCapture:{
    capturedAt:freshArtifact.receipt.capturedAt,
    prospectivePopulationHash:freshArtifact.receipt.prospectivePopulationHash,
    uniqueGlobalVersionKeyCount:freshArtifact.receipt.uniqueGlobalVersionKeyCount,
    queryKeysetExactEventCount:freshArtifact.receipt.queryKeysetExactEventCount,
    monthOnlyVersionCount:freshArtifact.receipt.monthOnlyVersionCount,
    yearOnlyVersionCount:freshArtifact.receipt.yearOnlyVersionCount,
  },
  receipt,
  interpretation:{
    durableSeedExtended:true,
    historicalArtifactsRecomputed:false,
    earliestObservedPreserved:receipt.earliestObservedPreserved,
    absenceMeansNonexistence:false,
    boundedStabilizationCandidate:receipt.boundedStabilizationCandidate,
    expectedKeysetStillLocked:true,
    sourceSemanticsStillPending:true,
  },
};
await writeFile("/tmp/S2_07_MOPS_INCREMENTAL_UNION_STABILITY_V1_7_1_PHYSICAL_20261007.json",JSON.stringify(artifact,null,2)+"\n","utf8");
console.log(JSON.stringify({
  result:"S2_07_MOPS_INCREMENTAL_UNION_STABILITY_V1_7_1_COMPLETE",
  state:receipt.state,
  captureCount:receipt.captureCount,
  unionVersionKeyCount:receipt.unionVersionKeyCount,
  latestCaptureVersionKeyCount:receipt.latestCaptureVersionKeyCount,
  unionMissingFromLatestCount:receipt.unionMissingFromLatestCount,
  trailingIdenticalTransitions:receipt.trailingIdenticalTransitions,
  boundedStabilizationCandidate:receipt.boundedStabilizationCandidate,
  payloadConflictCount:receipt.payloadConflictCount,
  monthOnlyDriftVersionCount:receipt.monthOnlyDriftVersionCount,
  unionHash:receipt.unionHash,
  nextGate:receipt.boundedStabilizationCandidate
    ?"SOURCE_SEMANTICS_REVIEW_BEFORE_EXPECTED_KEYSET_FREEZE"
    :"CONTINUE_INCREMENTAL_CAPTURE_STABILIZATION",
},null,2));
