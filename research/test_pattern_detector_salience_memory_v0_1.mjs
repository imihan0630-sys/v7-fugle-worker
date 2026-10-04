import assert from "node:assert/strict";
import {buildDetectorSalienceRiskSet} from "./pattern_detector_salience_memory_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const trueZone={
  candidateId:"T1",
  symbol:"2330",
  semanticSpace:"TECHNICAL_CONTINUITY",
  detectorVersion:"zone-v1",
  confirmedAt:"2026-09-20",
  lower:100,
  upper:104
};

const c=(overrides={})=>({
  candidateId:"C1",
  symbol:"2330",
  semanticSpace:"TECHNICAL_CONTINUITY",
  detectorVersion:"zone-v1",
  candidateAt:"2026-09-10",
  stateAsOf:"2026-09-20",
  statusAtLandmark:"UNCONFIRMED_ACTIVE",
  candidateStateProvenanceVerified:true,
  eligibleSymbolSession:true,
  technicalContinuityVerified:true,
  lower:80,
  upper:84,
  salienceSnapshot:{anchorProminenceAtr:2.1},
  opportunityReceipt:{observableSessions:7},
  ...overrides
});

t("SM01 same-detector active candidate enters risk set",()=>{
  const r=buildDetectorSalienceRiskSet({trueZone,candidateAnchors:[c()]});
  assert.equal(r.status,"VALID");
  assert.equal(r.eligible.length,1);
  assert.equal(r.eligible[0].candidateClass,"DETECTOR_SALIENCE_CONTROL");
});

t("SM02 future-created candidate is excluded",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[c({candidateAt:"2026-09-21"})]
  });
  assert.equal(r.eligible.length,0);
  assert.equal(r.excluded[0].reason,"FUTURE_OR_INVALID_CANDIDATE_AT");
});

t("SM03 already-confirmed candidate is excluded from M1",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[c({statusAtLandmark:"CONFIRMED"})]
  });
  assert.equal(r.excluded[0].reason,"NOT_UNCONFIRMED_ACTIVE_AT_LANDMARK");
});

t("SM04 later eventual confirmation cannot retroactively remove control",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[c({eventualConfirmedAt:"2026-09-28"})]
  });
  assert.equal(r.eligible.length,1);
  assert.equal(r.futureStateBackfillAllowed,false);
});

t("SM05 invalidated candidate is excluded",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[c({statusAtLandmark:"INVALIDATED"})]
  });
  assert.equal(r.excluded[0].reason,"NOT_UNCONFIRMED_ACTIVE_AT_LANDMARK");
});

t("SM06 detector-version mismatch is excluded",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[c({detectorVersion:"zone-v2"})]
  });
  assert.equal(r.excluded[0].reason,"DETECTOR_VERSION_MISMATCH");
});

t("SM07 different semantic space is excluded",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[c({semanticSpace:"RAW_EXECUTION"})]
  });
  assert.equal(r.excluded[0].reason,"SEMANTIC_SPACE_MISMATCH");
});

t("SM08 candidate overlapping true zone is excluded",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[c({lower:102,upper:106})]
  });
  assert.equal(r.excluded[0].reason,"OVERLAPS_TRUE_ZONE");
});

t("SM09 incomplete provenance is fail-closed",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[c({technicalContinuityVerified:false})]
  });
  assert.equal(r.excluded[0].reason,"PROVENANCE_INCOMPLETE");
});

t("SM10 all eligible controls are retained without D01 matching",()=>{
  const r=buildDetectorSalienceRiskSet({
    trueZone,
    candidateAnchors:[
      c({candidateId:"C2",candidateAt:"2026-09-11",lower:70,upper:74}),
      c({candidateId:"C1",candidateAt:"2026-09-10",lower:80,upper:84})
    ]
  });
  assert.deepEqual(r.eligible.map(x=>x.candidateId),["C1","C2"]);
  assert.equal(r.retainAllEligibleControls,true);
  assert.equal(r.matchingAllowedInD01,false);
  assert.equal(r.outcomeSelectionAllowed,false);
  assert.equal(r.salienceScoreDefined,false);
  assert.equal(r.eligible.every(x=>x.independentVoteEligible===false),true);
});

console.log(`SUMMARY ${pass}/10 PASS`);
