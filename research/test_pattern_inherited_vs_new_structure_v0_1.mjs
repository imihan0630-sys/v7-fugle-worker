import assert from "node:assert/strict";
import {
  intervalOverlapDescriptors,
  classifyPretestAvailability,
  classifyStructuralLineage,
  buildInformationLineageDiagnostics,
  buildReplaySafeCandidateReceipt
} from "./pattern_inherited_vs_new_structure_v0_1.mjs";

let pass=0;
const t=(name,fn)=>{fn();pass++;console.log("PASS",name);};

const oldRoot={
  rootId:"OLD",
  anchorIds:["A1","A2"],
  boundary:{lower:100,upper:104},
  breakoutConfirmedAt:"2026-09-10T13:30:00+08:00"
};
const baseNew={
  rootId:"NEW",
  confirmed:true,
  firstObservableAt:"2026-09-11T13:30:00+08:00",
  confirmedAt:"2026-09-12T13:30:00+08:00",
  latestAnchorAt:"2026-09-12T13:30:00+08:00",
  anchorIds:["N1","N2"],
  boundary:{lower:101,upper:105},
  replaySafe:true,
  futureBarRequired:false
};
const freeze="2026-09-14T13:30:00+08:00";
const retest="2026-09-15T10:00:00+08:00";

t("NS01 spatial overlap is descriptive and cannot decide identity",()=>{
  const r=intervalOverlapDescriptors(oldRoot.boundary,baseNew.boundary,2);
  assert.equal(r.status,"VALID");
  assert.ok(r.intervalOverlapRatio>0);
  assert.equal(r.identityDecisionAllowed,false);
});

t("NS02 unconfirmed candidate leaves inherited-role-only state",()=>{
  const r=classifyStructuralLineage({
    oldRoot,
    newCandidate:{...baseNew,confirmed:false},
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.lineageClass,"INHERITED_ROLE_ONLY");
  assert.equal(r.divergenceState,"NEW_CANDIDATE_NOT_CONFIRMED");
});

t("NS03 independently confirmed overlapping root is dual lineage",()=>{
  const r=classifyStructuralLineage({
    oldRoot,newCandidate:baseNew,predictorFreezeAt:freeze,firstRetestOpportunityAt:retest,atr:2
  });
  assert.equal(r.lineageClass,"COLOCATED_DUAL_LINEAGE_PRETEST");
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("NS04 dual lineage does not create two independent votes",()=>{
  const r=classifyStructuralLineage({
    oldRoot,newCandidate:baseNew,predictorFreezeAt:freeze,firstRetestOpportunityAt:retest
  });
  assert.equal(r.independentVoteAllowed,false);
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("NS05 distinct nonoverlapping post-break root is not polarity evidence",()=>{
  const r=classifyStructuralLineage({
    oldRoot,
    newCandidate:{...baseNew,boundary:{lower:120,upper:124}},
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.lineageClass,"NEW_POST_BREAK_ROOT_NONOVERLAP");
});

t("NS06 legal causal anchor superset is same-root extension",()=>{
  const r=classifyStructuralLineage({
    oldRoot,
    newCandidate:{
      ...baseNew,
      rootId:"OLD",
      anchorIds:["A1","A2","A3"],
      anchorOccurredAt:{A3:"2026-09-12T13:30:00+08:00"},
      breakoutConfirmedAt:"2026-09-10T13:30:00+08:00"
    },
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.lineageClass,"SAME_ROOT_CAUSAL_EXTENSION");
  assert.deepEqual(r.addedAnchorIds,["A3"]);
});

t("NS07 same root with anchor replacement is unresolved rather than new root",()=>{
  const r=classifyStructuralLineage({
    oldRoot,
    newCandidate:{...baseNew,rootId:"OLD",anchorIds:["A2","A3"]},
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.lineageClass,"SPATIAL_OVERLAP_WITHOUT_LINEAGE");
  assert.equal(r.divergenceState,"SAME_ROOT_NON_EXTENSION_CONFLICT");
});

t("NS08 candidate confirmed after predictor freeze is post hoc",()=>{
  const r=classifyPretestAvailability({
    candidate:{...baseNew,confirmedAt:"2026-09-16T13:30:00+08:00"},
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
  assert.equal(r.eligible,false);
});

t("NS09 candidate confirmed at retest is not eligible for same retest",()=>{
  const r=classifyPretestAvailability({
    candidate:{...baseNew,confirmedAt:retest,latestAnchorAt:"2026-09-14T13:30:00+08:00"},
    predictorFreezeAt:"2026-09-15T10:00:00+08:00",
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.status,"NEW_STRUCTURE_CONFIRMED_AFTER_TEST");
});

t("NS10 future-bar pivot requirement fails the hindsight firewall",()=>{
  const r=classifyPretestAvailability({
    candidate:{...baseNew,futureBarRequired:true},
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
  assert.equal(r.reason,"FUTURE_BAR_REQUIRED");
});

t("NS11 replay-unsafe candidate is data blocked",()=>{
  const r=classifyPretestAvailability({
    candidate:{...baseNew,replaySafe:false},
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("NS12 missing lineage cannot be forced from spatial overlap",()=>{
  const r=classifyStructuralLineage({
    oldRoot,
    newCandidate:{...baseNew,rootId:"",anchorIds:[]},
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.lineageClass,"SPATIAL_OVERLAP_WITHOUT_LINEAGE");
  assert.equal(r.divergenceState,"IDENTITY_UNRESOLVED");
});

t("NS13 two price-derived structural roots remain one effective evidence family",()=>{
  const r=buildInformationLineageDiagnostics({
    parentDecisionId:"P1",
    representations:[
      {id:"OLD",structuralRootId:"OLD",informationRoot:"PRICE_OHLC"},
      {id:"NEW",structuralRootId:"NEW",informationRoot:"PRICE_OHLC"}
    ]
  });
  assert.equal(r.rawRepresentationCount,2);
  assert.equal(r.distinctStructuralRootCount,2);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("NS14 one root plus many named pattern representations remains one price vote",()=>{
  const r=buildInformationLineageDiagnostics({
    parentDecisionId:"P1",
    representations:[
      {id:"breakout",structuralRootId:"OLD"},
      {id:"higher_low",structuralRootId:"OLD"},
      {id:"role_flip",structuralRootId:"OLD"}
    ]
  });
  assert.equal(r.rawRepresentationCount,3);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("NS15 residual incrementality is not validated by having multiple roots",()=>{
  const r=buildInformationLineageDiagnostics({
    parentDecisionId:"P1",
    representations:[
      {id:"a",structuralRootId:"OLD"},
      {id:"b",structuralRootId:"NEW"}
    ]
  });
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("NS16 replay-safe receipt rejects candidate whose latest anchor is after freeze",()=>{
  const r=buildReplaySafeCandidateReceipt({
    candidateId:"N1",
    firstObservableAt:"2026-09-11T13:30:00+08:00",
    confirmedAt:"2026-09-12T13:30:00+08:00",
    latestAnchorAt:"2026-09-15T13:30:00+08:00",
    predictorFreezeAt:freeze,
    futureBarRequired:false,
    replaySafe:true,
    divergenceState:"ACTIVE"
  });
  assert.equal(r.eligibleAtFreeze,false);
  assert.equal(r.eligibilityStatus,"POST_HOC_NOT_ELIGIBLE");
});

t("NS17 replay-safe receipt preserves negative/divergent state",()=>{
  const r=buildReplaySafeCandidateReceipt({
    candidateId:"N2",
    firstObservableAt:"2026-09-11T13:30:00+08:00",
    confirmedAt:"2026-09-12T13:30:00+08:00",
    latestAnchorAt:"2026-09-12T13:30:00+08:00",
    predictorFreezeAt:freeze,
    futureBarRequired:false,
    replaySafe:true,
    divergenceState:"FAILED_TO_PERSIST"
  });
  assert.equal(r.divergenceState,"FAILED_TO_PERSIST");
  assert.equal(r.eligibleAtFreeze,true);
});

t("NS18 exact boundary equality still cannot create independent vote",()=>{
  const r=classifyStructuralLineage({
    oldRoot,
    newCandidate:{...baseNew,boundary:{...oldRoot.boundary}},
    predictorFreezeAt:freeze,
    firstRetestOpportunityAt:retest
  });
  assert.equal(r.lineageClass,"COLOCATED_DUAL_LINEAGE_PRETEST");
  assert.equal(r.overlap.exactBoundaryEquality,true);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

console.log(`SUMMARY ${pass}/18 PASS`);
