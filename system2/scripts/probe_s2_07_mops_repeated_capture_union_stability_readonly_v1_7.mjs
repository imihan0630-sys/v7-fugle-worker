import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { buildMopsRepeatedCaptureUnionV1_7 } from "../runtime/s2_07_mops_repeated_capture_union_stability_v1_7.mjs";

const REQUIRED_HASH="b7941323ed1969a17697bc58be3d549b7e244f4dfc45b81a0bc6d5645fc305b0";

const SPECS=[
  {captureId:"RUN:37547303476:ART:11451296954",workflowRunId:37547303476,artifactId:11451296954,path:"/tmp/v17/run1/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json"},
  {captureId:"RUN:37548011614:ART:11451716945",workflowRunId:37548011614,artifactId:11451716945,path:"/tmp/v17/run2/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json"},
  {captureId:"RUN:37549352244:ART:11451992365",workflowRunId:37549352244,artifactId:11451992365,path:"/tmp/v17/run3/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json"},
];

const captures=[];
for(const spec of SPECS){
  const raw=JSON.parse(await readFile(spec.path,"utf8"));
  assert.ok(raw?.receipt,"missing V1.6 receipt: "+spec.path);
  assert.equal(raw.receipt.stableEventUniverseHash,REQUIRED_HASH,"stable event universe drift");
  assert.equal(raw.receipt.prospectiveExactVersionCaptureReady,true,"V1.6 capture not ready");
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

assert.equal(receipt.captureCount,3);
assert.equal(receipt.earliestObservedPreserved,true);
assert.equal(receipt.latestObservedPreserved,true);
assert.equal(receipt.appendOnlyUnion,true);
assert.equal(receipt.absenceMeansNonexistence,false);
assert.equal(receipt.payloadConflictCount,0);
assert.equal(receipt.unionVersionKeyCount,168,"three accepted captures must reconcile to the known 168-version union");
assert.equal(receipt.expectedMopsKeysetComplete,false);
assert.equal(receipt.noRevisionGapThroughCut,false);
assert.equal(receipt.preParentEvidenceCutReady,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.scheduleAdded,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

const firstCaptureAt=captures[0].capturedAt;
const commonAll=receipt.versions.filter(v=>v.observedCaptureIds.length===3);
assert.ok(commonAll.length>0);
assert.ok(commonAll.some(v=>Date.parse(v.firstObservedAt)<Date.parse(captures.at(-1).capturedAt)));
assert.ok(receipt.versions.every(v=>Date.parse(v.firstObservedAt)<=Date.parse(v.latestObservedAt)));

const artifact={
  schemaVersion:"S2_S2_07_MOPS_REPEATED_CAPTURE_UNION_STABILITY_V1_7_PHYSICAL",
  recordedDate:"2026-10-07",
  sourceArtifacts:SPECS.map((s,i)=>({
    captureId:s.captureId,
    workflowRunId:s.workflowRunId,
    artifactId:s.artifactId,
    capturedAt:captures[i].capturedAt,
    versionCount:captures[i].observations.length,
  })),
  receipt,
  interpretation:{
    earliestObservedDefectRepaired:receipt.earliestObservedPreserved,
    appendOnlyUnionRetainsMissingLatestVersions:receipt.unionMissingFromLatestCount>0,
    absenceIsNotNonexistence:receipt.absenceMeansNonexistence===false,
    sourceSemanticsStillPending:receipt.sourceSemanticsCertified===false,
    expectedKeysetStillLocked:receipt.expectedMopsKeysetComplete===false,
  },
};

await writeFile(
  "/tmp/S2_07_MOPS_REPEATED_CAPTURE_UNION_STABILITY_V1_7_PHYSICAL_20261007.json",
  JSON.stringify(artifact,null,2)+"\n",
  "utf8"
);

console.log(JSON.stringify({
  result:"S2_07_MOPS_REPEATED_CAPTURE_UNION_STABILITY_V1_7_COMPLETE",
  state:receipt.state,
  captureCount:receipt.captureCount,
  unionVersionKeyCount:receipt.unionVersionKeyCount,
  latestCaptureVersionKeyCount:receipt.latestCaptureVersionKeyCount,
  unionMissingFromLatestCount:receipt.unionMissingFromLatestCount,
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
