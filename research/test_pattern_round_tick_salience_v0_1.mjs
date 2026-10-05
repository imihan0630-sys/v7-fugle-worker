import assert from "node:assert/strict";
import {
  validateTickReceipt,
  validateRoundGridRegistry,
  nearestReferenceDistance,
  buildRoundTickContext,
  validateTickMigration,
  buildPriceFamilyDedup
} from "./pattern_round_tick_salience_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const freeze="2026-10-05T13:30:00+08:00";
const tick={
  tickSize:0.5,
  tickBandId:"100_500",
  tickRuleVersion:"TWSE-STOCK-V1",
  tickKnownAt:"2026-10-05T08:00:00+08:00"
};
const grid={
  roundGridFamilyId:"RG1",
  roundGridVersion:"V1",
  registryFrozenAt:"2026-10-01T00:00:00+08:00",
  referenceLevels:[90,100,110,120]
};

t("RT01 valid PIT tick receipt passes",()=>{
  assert.equal(validateTickReceipt({...tick,predictorFreezeAt:freeze}).status,"VALID");
});

t("RT02 future tick receipt is post hoc",()=>{
  const r=validateTickReceipt({...tick,tickKnownAt:"2026-10-06T08:00:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("RT03 missing tick rule provenance is unknown",()=>{
  const r=validateTickReceipt({...tick,tickRuleVersion:"",predictorFreezeAt:freeze});
  assert.equal(r.status,"UNKNOWN");
});

t("RT04 round-grid registry must predate predictor",()=>{
  const r=validateRoundGridRegistry({...grid,registryFrozenAt:"2026-10-06T00:00:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("RT05 outcome-mutated round grid is prohibited",()=>{
  const r=validateRoundGridRegistry({...grid,predictorFreezeAt:freeze,mutatedAfterOutcome:true});
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"OUTCOME_SELECTED_ROUND_GRID_MUTATION");
});

t("RT06 nearest round reference distance is continuous",()=>{
  const r=nearestReferenceDistance({price:103,referenceLevels:grid.referenceLevels,tickSize:0.5});
  assert.equal(r.nearestReferencePrice,100);
  assert.equal(r.distancePrice,3);
  assert.equal(r.distanceTicks,6);
});

t("RT07 exact round equality is descriptive only",()=>{
  const r=nearestReferenceDistance({price:100,referenceLevels:grid.referenceLevels,tickSize:0.5});
  assert.equal(r.exactReferenceEquality,true);
});

t("RT08 structural center at round price is S3, not extra vote",()=>{
  const r=buildRoundTickContext({
    boundary:{lower:99,upper:101},structuralRootId:"ROOT1",
    predictorFreezeAt:freeze,tickReceipt:tick,roundRegistry:grid,
    tickBandTransitionPrice:105
  });
  assert.equal(r.salienceCoincidenceState,"S3_STRUCTURE_ROUND_COINCIDENT");
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("RT09 nonstructural round reference is S1",()=>{
  const r=buildRoundTickContext({
    boundary:{lower:99,upper:101},structuralRootId:null,
    predictorFreezeAt:freeze,tickReceipt:tick,roundRegistry:grid,
    tickBandTransitionPrice:105
  });
  assert.equal(r.salienceCoincidenceState,"S1_ROUND_REFERENCE_ONLY");
});

t("RT10 structural tick transition is separate from roundness",()=>{
  const r=buildRoundTickContext({
    boundary:{lower:104,upper:106},structuralRootId:"ROOT1",
    predictorFreezeAt:freeze,tickReceipt:tick,roundRegistry:grid,
    tickBandTransitionPrice:105
  });
  assert.equal(r.salienceCoincidenceState,"S4_STRUCTURE_TICK_TRANSITION_COINCIDENT");
});

t("RT11 round and tick transition can co-exist without multiple votes",()=>{
  const r=buildRoundTickContext({
    boundary:{lower:99,upper:101},structuralRootId:"ROOT1",
    predictorFreezeAt:freeze,tickReceipt:tick,roundRegistry:grid,
    tickBandTransitionPrice:100
  });
  assert.equal(r.salienceCoincidenceState,"S5_MULTI_SALIENCE_COINCIDENT");
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("RT12 daily OHLC does not identify order clustering mechanism",()=>{
  const r=buildRoundTickContext({
    boundary:{lower:99,upper:101},structuralRootId:"ROOT1",
    predictorFreezeAt:freeze,tickReceipt:tick,roundRegistry:grid
  });
  assert.equal(r.orderClusteringMechanism,"PLAUSIBLE_NOT_OBSERVED");
});

t("RT13 roundness does not identify behavioral anchoring",()=>{
  const r=buildRoundTickContext({
    boundary:{lower:99,upper:101},structuralRootId:"ROOT1",
    predictorFreezeAt:freeze,tickReceipt:tick,roundRegistry:grid
  });
  assert.equal(r.behavioralAnchoring,"UNIDENTIFIED");
});

t("RT14 formation and current tick bands are separate PIT receipts",()=>{
  const r=validateTickMigration({
    formationTickReceipt:{...tick,tickSize:0.1,tickBandId:"50_100",tickKnownAt:"2026-09-01T08:00:00+08:00"},
    currentTickReceipt:tick,
    formationFreezeAt:"2026-09-01T13:30:00+08:00",
    currentFreezeAt:freeze
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.tickBandChanged,true);
  assert.equal(r.currentTickBackfilledToFormation,false);
});

t("RT15 current tick receipt cannot be silently backfilled",()=>{
  const r=validateTickMigration({
    formationTickReceipt:{...tick,tickKnownAt:"2026-10-05T08:00:00+08:00"},
    currentTickReceipt:tick,
    formationFreezeAt:"2026-09-01T13:30:00+08:00",
    currentFreezeAt:freeze
  });
  assert.equal(r.status,"UNKNOWN_OR_BLOCKED");
});

t("RT16 structural plus round plus prior-close representations remain one price family",()=>{
  const r=buildPriceFamilyDedup({
    parentDecisionId:"P1",
    representations:[
      {id:"structure"},
      {id:"round100"},
      {id:"priorClose"}
    ]
  });
  assert.equal(r.rawRepresentationCount,3);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("RT17 adding auction reference still does not create extra vote",()=>{
  const r=buildPriceFamilyDedup({
    parentDecisionId:"P1",
    representations:[
      {id:"structure"},
      {id:"round100"},
      {id:"priorClose"},
      {id:"auctionReference"}
    ]
  });
  assert.equal(r.rawRepresentationCount,4);
  assert.equal(r.independentVoteAllowed,false);
});

t("RT18 residual incrementality remains unvalidated",()=>{
  const r=buildPriceFamilyDedup({
    parentDecisionId:"P1",
    representations:[{id:"structure"},{id:"round100"}]
  });
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("RT19 missing registered round references is fail closed",()=>{
  const r=validateRoundGridRegistry({
    roundGridFamilyId:"RG1",roundGridVersion:"V1",
    registryFrozenAt:"2026-10-01",predictorFreezeAt:freeze,
    referenceLevels:[]
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"ROUND_REFERENCE_LEVELS_EMPTY");
});

t("RT20 no outcome join is exposed by context helper",()=>{
  const r=buildRoundTickContext({
    boundary:{lower:99,upper:101},structuralRootId:"ROOT1",
    predictorFreezeAt:freeze,tickReceipt:tick,roundRegistry:grid
  });
  assert.equal(r.outcomeJoinAllowed,false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
