import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { buildMopsRepeatedCaptureUnionV1_7 } from "../runtime/s2_07_mops_repeated_capture_union_stability_v1_7.mjs";

const REQUIRED_HASH="b7941323ed1969a17697bc58be3d549b7e244f4dfc45b81a0bc6d5645fc305b0";
const CAPTURE4={
  workflowRunId:37724622463,
  jobId:113139857588,
  artifactId:11527407836,
  artifactDigest:"sha256:266ae446de47034403f0846e62819d7417ade6be471fcd1f26ae3f39a605be24",
  artifactJsonSha256:"ee2f1558102504ddb2776f8e745ef10df7552f2d588dad04d41cc88d8b7d8f44",
  capturedAt:"2026-10-08T04:07:37.290Z",
  prospectivePopulationHash:"1eff5b0d700a8b23ffe8a0644c0523c30bcb5b6db89241dc4c5c96e9c8cfab27",
  uniqueGlobalVersionKeyCount:168,
};

const SPECS=[
  {captureId:"RUN:37547303476:ART:11451296954",workflowRunId:37547303476,artifactId:11451296954,path:"/tmp/v18/run1/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json",acceptedPrior:true},
  {captureId:"RUN:37548011614:ART:11451716945",workflowRunId:37548011614,artifactId:11451716945,path:"/tmp/v18/run2/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json",acceptedPrior:true},
  {captureId:"RUN:37549352244:ART:11451992365",workflowRunId:37549352244,artifactId:11451992365,path:"/tmp/v18/run3/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json",acceptedPrior:true},
  {
    captureId:"RUN:37724622463:ART:11527407836",
    workflowRunId:CAPTURE4.workflowRunId,
    jobId:CAPTURE4.jobId,
    artifactId:CAPTURE4.artifactId,
    artifactDigest:CAPTURE4.artifactDigest,
    artifactJsonSha256:CAPTURE4.artifactJsonSha256,
    path:"/tmp/v18/run4/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json",
    genuineNewCapture:true,
  },
];

const captures=[];
for(const [index,spec] of SPECS.entries()){
  const raw=JSON.parse(await readFile(spec.path,"utf8"));
  assert.ok(raw?.receipt,"missing V1.6 receipt: "+spec.path);
  assert.equal(raw.receipt.stableEventUniverseHash,REQUIRED_HASH,"stable event universe drift");
  assert.equal(raw.receipt.prospectiveExactVersionCaptureReady,true,"V1.6 capture not ready");
  assert.equal(raw.receipt.expectedMopsKeysetComplete,false,"V1.6 capture cannot pre-certify expected keyset");
  assert.equal(raw.receipt.noRevisionGapThroughCut,false,"V1.6 capture cannot pre-certify revision closure");
  if(index===3){
    assert.equal(raw.receipt.capturedAt,CAPTURE4.capturedAt,"capture4 capturedAt mismatch");
    assert.equal(raw.receipt.prospectivePopulationHash,CAPTURE4.prospectivePopulationHash,"capture4 population hash mismatch");
    assert.equal(raw.receipt.uniqueGlobalVersionKeyCount,CAPTURE4.uniqueGlobalVersionKeyCount,"capture4 version count mismatch");
    assert.equal(raw.receipt.coveredSymbolCount,23,"capture4 symbol coverage mismatch");
    assert.equal(raw.receipt.queryKeysetExactEventCount,23,"capture4 annual/month keyset parity drift");
    assert.equal(raw.receipt.monthOnlyVersionCount,0,"capture4 month-only drift");
    assert.equal(raw.receipt.yearOnlyVersionCount,0,"capture4 year-only drift");
    assert.equal(raw.receipt.sourceClockVersionKeyCollisionCount,0,"capture4 source-clock collision");
    assert.deepEqual(raw.receipt.blockers,[],"capture4 blockers must remain empty");
  }
  captures.push({
    captureId:spec.captureId,
    workflowRunId:spec.workflowRunId,
    artifactId:spec.artifactId,
    capturedAt:raw.receipt.capturedAt,
    stableEventUniverseHash:raw.receipt.stableEventUniverseHash,
    observations:raw.receipt.observations,
  });
}

const receipt=await buildMopsRepeatedCaptureUnionV1_7({
  captures,
  requiredStableEventUniverseHash:REQUIRED_HASH,
  minCaptureCount:4,
  trailingIdenticalTransitionRequirement:2,
});

assert.equal(receipt.captureCount,4);
assert.equal(receipt.earliestObservedPreserved,true);
assert.equal(receipt.latestObservedPreserved,true);
assert.equal(receipt.appendOnlyUnion,true);
assert.equal(receipt.absenceMeansNonexistence,false);
assert.equal(receipt.payloadConflictCount,0,JSON.stringify(receipt.blockers));
assert.equal(receipt.expectedMopsKeysetComplete,false);
assert.equal(receipt.noRevisionGapThroughCut,false);
assert.equal(receipt.preParentEvidenceCutReady,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.sourceSemanticsCertified,false);
assert.equal(receipt.monthShardCoverageComplete,false);
assert.equal(receipt.scheduleAdded,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.finalSelectionEnabled,false);
assert.equal(receipt.livePushEnabled,false);
assert.equal(receipt.capitalImpact,false);
assert.equal(receipt.orderImpact,false);
assert.equal(receipt.system1RuntimeUsed,false);

const artifact={
  schemaVersion:"S2_S2_07_MOPS_FRESH_CAPTURE_STABILITY_V1_8_PHYSICAL",
  recordedDate:"2026-10-08",
  acceptanceMode:"FOUR_IMMUTABLE_V1_6_ARTIFACTS",
  sourceArtifacts:SPECS.map((s,i)=>({
    captureId:s.captureId,
    workflowRunId:s.workflowRunId,
    jobId:s.jobId||null,
    artifactId:s.artifactId,
    artifactDigest:s.artifactDigest||null,
    artifactJsonSha256:s.artifactJsonSha256||null,
    acceptedPrior:s.acceptedPrior===true,
    genuineNewCapture:s.genuineNewCapture===true,
    capturedAt:captures[i].capturedAt,
    versionCount:captures[i].observations.length,
  })),
  receipt,
  interpretation:{
    genuineFourthCaptureBound:true,
    earliestObservedPreserved:receipt.earliestObservedPreserved,
    latestObservedPreserved:receipt.latestObservedPreserved,
    absenceIsNotNonexistence:receipt.absenceMeansNonexistence===false,
    boundedStabilizationCandidate:receipt.boundedStabilizationCandidate,
    sourceSemanticsStillPending:receipt.sourceSemanticsCertified===false,
    expectedKeysetStillLocked:receipt.expectedMopsKeysetComplete===false,
    noRevisionGapStillLocked:receipt.noRevisionGapThroughCut===false,
  },
};

await writeFile(
  "/tmp/S2_07_MOPS_FRESH_CAPTURE_STABILITY_V1_8_PHYSICAL_20261008.json",
  JSON.stringify(artifact,null,2)+"\n",
  "utf8",
);

console.log(JSON.stringify({
  result:"S2_07_MOPS_FRESH_CAPTURE_STABILITY_V1_8_COMPLETE",
  state:receipt.state,
  captureCount:receipt.captureCount,
  unionVersionKeyCount:receipt.unionVersionKeyCount,
  latestCaptureVersionKeyCount:receipt.latestCaptureVersionKeyCount,
  unionMissingFromLatestCount:receipt.unionMissingFromLatestCount,
  pairwiseTransitions:receipt.pairwiseTransitions.map(x=>({
    fromCaptureId:x.fromCaptureId,
    toCaptureId:x.toCaptureId,
    addedCount:x.addedCount,
    lostCount:x.lostCount,
    identical:x.identical,
    jaccard:x.jaccard,
  })),
  earliestObservedPreserved:receipt.earliestObservedPreserved,
  latestObservedPreserved:receipt.latestObservedPreserved,
  payloadConflictCount:receipt.payloadConflictCount,
  monthOnlyDriftVersionCount:receipt.monthOnlyDriftVersionCount,
  trailingIdenticalTransitions:receipt.trailingIdenticalTransitions,
  boundedStabilizationCandidate:receipt.boundedStabilizationCandidate,
  unionHash:receipt.unionHash,
  expectedMopsKeysetComplete:receipt.expectedMopsKeysetComplete,
  noRevisionGapThroughCut:receipt.noRevisionGapThroughCut,
  nextGate:receipt.boundedStabilizationCandidate
    ?"SOURCE_SEMANTICS_REVIEW_BEFORE_EXPECTED_KEYSET_FREEZE"
    :"CONTINUE_BOUNDED_REPEATED_CAPTURE_STABILIZATION",
},null,2));
