import assert from "node:assert/strict";
import {
  validateClassificationReceipt,
  buildLeaveOneOutSectorContext,
  summarizeSectorComposition,
  classifySelfInclusion,
  classifySectorCommonSupport,
  summarizeSectorReplication,
  classifyPatternClaim
} from "./pattern_sector_composition_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const freeze="2026-10-01T13:30:00+08:00";
const receipt={
  verified:true,
  knownAt:"2026-09-30T18:00:00+08:00",
  sectorTaxonomyId:"D09-TAX",
  classificationLevel:"INDUSTRY",
  classificationVersion:"V1",
  sectorId:"SEMICONDUCTOR",
  classificationState:"CLASSIFIED"
};

t("SC01 verified point-in-time classification is valid",()=>{
  assert.equal(validateClassificationReceipt({receipt,predictorFreezeAt:freeze}).status,"VALID");
});

t("SC02 future-known classification is post hoc",()=>{
  const r=validateClassificationReceipt({
    receipt:{...receipt,knownAt:"2026-10-02T18:00:00+08:00"},
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("SC03 current classification historical backfill is prohibited",()=>{
  const r=validateClassificationReceipt({
    receipt:{...receipt,currentClassificationBackfilled:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.reason,"CURRENT_CLASSIFICATION_BACKFILL");
});

t("SC04 outcome-selected taxonomy is prohibited",()=>{
  const r=validateClassificationReceipt({
    receipt:{...receipt,outcomeSelectedTaxonomy:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.reason,"OUTCOME_SELECTED_TAXONOMY");
});

t("SC05 unclassified remains explicit",()=>{
  const r=validateClassificationReceipt({
    receipt:{...receipt,sectorId:null,classificationState:"UNCLASSIFIED_UNKNOWN"},
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.classificationState,"UNCLASSIFIED_UNKNOWN");
});

t("SC06 leave-one-out removes candidate from sector return",()=>{
  const r=buildLeaveOneOutSectorContext({
    candidateSymbol:"A",
    members:[
      {symbol:"A",returnValue:0.10},
      {symbol:"B",returnValue:0.02},
      {symbol:"C",returnValue:-0.01}
    ]
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.candidateExcluded,true);
  assert.equal(r.sectorReturnExCandidate,0.005);
});

t("SC07 leave-one-out breadth excludes candidate",()=>{
  const r=buildLeaveOneOutSectorContext({
    candidateSymbol:"A",
    members:[
      {symbol:"A",returnValue:0.10},
      {symbol:"B",returnValue:0.02},
      {symbol:"C",returnValue:-0.01}
    ]
  });
  assert.equal(r.sectorBreadthExCandidate,0.5);
});

t("SC08 single-member sector becomes LOO unavailable",()=>{
  const r=buildLeaveOneOutSectorContext({
    candidateSymbol:"A",
    members:[{symbol:"A",returnValue:0.10}]
  });
  assert.equal(r.status,"LOO_SECTOR_CONTEXT_UNAVAILABLE");
});

t("SC09 unclassified names remain in target denominator",()=>{
  const s=summarizeSectorComposition([
    {targetUniverseEligible:true,classificationState:"CLASSIFIED",sectorId:"S1",opportunityReady:true},
    {targetUniverseEligible:true,classificationState:"UNCLASSIFIED_UNKNOWN",sectorId:null,opportunityReady:false}
  ]);
  assert.equal(s.targetEligibleCount,2);
  assert.equal(s.unclassifiedCount,1);
  assert.equal(s.classificationUnknownRate,0.5);
});

t("SC10 sector concentration is descriptive only",()=>{
  const s=summarizeSectorComposition([
    {targetUniverseEligible:true,classificationState:"CLASSIFIED",sectorId:"S1",opportunityReady:true},
    {targetUniverseEligible:true,classificationState:"CLASSIFIED",sectorId:"S1",opportunityReady:true},
    {targetUniverseEligible:true,classificationState:"CLASSIFIED",sectorId:"S2",opportunityReady:true}
  ]);
  assert.equal(s.top1SectorOpportunityShare,2/3);
  assert.equal(s.genericPatternClaimAssigned,false);
});

t("SC11 many stock rows can still be one sector",()=>{
  const s=summarizeSectorComposition([
    {targetUniverseEligible:true,classificationState:"CLASSIFIED",sectorId:"S1",opportunityReady:true},
    {targetUniverseEligible:true,classificationState:"CLASSIFIED",sectorId:"S1",opportunityReady:true},
    {targetUniverseEligible:true,classificationState:"CLASSIFIED",sectorId:"S1",opportunityReady:true}
  ]);
  assert.equal(s.uniqueSectorCount,1);
});

t("SC12 candidate-included sector context is not independent confirmation",()=>{
  const r=classifySelfInclusion({
    candidateIncludedInSectorReturn:true,
    candidateIncludedInSectorBreadth:true,
    leaveOneOutVerified:false
  });
  assert.equal(r.status,"SELF_INCLUSION_UNRESOLVED");
  assert.equal(r.independentConfirmationAllowed,false);
});

t("SC13 even LOO sector context is a control, not automatic extra vote",()=>{
  const r=classifySelfInclusion({
    candidateIncludedInSectorReturn:false,
    candidateIncludedInSectorBreadth:false,
    leaveOneOutVerified:true
  });
  assert.equal(r.status,"SELF_INCLUSION_CONTROLLED");
  assert.equal(r.independentConfirmationAllowed,false);
});

t("SC14 sector-context nonoverlap prohibits extrapolation",()=>{
  const r=classifySectorCommonSupport({
    sizeLiquidityOverlap:true,listingAgeOverlap:true,priceTickOverlap:true,
    marketOverlap:true,regimeOverlap:true,sectorContextOverlap:false
  });
  assert.equal(r.status,"CROSS_SECTOR_EXTRAPOLATION_PROHIBITED");
});

t("SC15 complete cross-sector support is valid",()=>{
  const r=classifySectorCommonSupport({
    sizeLiquidityOverlap:true,listingAgeOverlap:true,priceTickOverlap:true,
    marketOverlap:true,regimeOverlap:true,sectorContextOverlap:true
  });
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

t("SC16 ten stocks in one sector-date are not ten independent sector replications",()=>{
  const rows=Array.from({length:10},(_,i)=>({
    marketDate:"2026-10-01",sectorId:"S1",symbol:"X"+i,structuralRootId:"R"+i
  }));
  const r=summarizeSectorReplication(rows);
  assert.equal(r.stockObservationCount,10);
  assert.equal(r.independentSectorDateClusterCount,1);
  assert.equal(r.stockRowsEqualIndependentSectorReplications,false);
});

t("SC17 same sector across two dates creates two sector-date clusters but two market dates",()=>{
  const r=summarizeSectorReplication([
    {marketDate:"2026-10-01",sectorId:"S1",symbol:"A",structuralRootId:"R1"},
    {marketDate:"2026-10-02",sectorId:"S1",symbol:"B",structuralRootId:"R2"}
  ]);
  assert.equal(r.independentSectorDateClusterCount,2);
  assert.equal(r.marketDateClusterCount,2);
});

t("SC18 one-sector surviving effect is sector-specific, not generic",()=>{
  const r=classifyPatternClaim({
    classificationReady:true,leaveOneOutReady:true,withinSectorIncrement:true,
    crossSectorReplicated:false,onlyOneSectorSupported:true
  });
  assert.equal(r.status,"C4_SECTOR_SPECIFIC_PATTERN");
  assert.equal(r.claimScope,"SECTOR_SPECIFIC");
});

t("SC19 within-sector increment without cross-sector replication stays limited",()=>{
  const r=classifyPatternClaim({
    classificationReady:true,leaveOneOutReady:true,withinSectorIncrement:true,
    crossSectorReplicated:false,onlyOneSectorSupported:false
  });
  assert.equal(r.status,"C3_WITHIN_SECTOR_PATTERN_INCREMENT");
  assert.equal(r.claimScope,"WITHIN_SECTOR_ONLY");
});

t("SC20 cross-sector candidate requires LOO-ready within-sector increment",()=>{
  const r=classifyPatternClaim({
    classificationReady:true,leaveOneOutReady:true,withinSectorIncrement:true,
    crossSectorReplicated:true,onlyOneSectorSupported:false
  });
  assert.equal(r.status,"C5_CROSS_SECTOR_PATTERN_CANDIDATE");
});

console.log(`SUMMARY ${pass}/20 PASS`);
