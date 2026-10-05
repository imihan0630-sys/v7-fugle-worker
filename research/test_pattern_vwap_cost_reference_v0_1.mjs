import assert from "node:assert/strict";
import {
  validateSessionAverageReceipt,
  validateAnchoredReferenceReceipt,
  validateCostReferenceReceipt,
  validateLiveLiquidityReceipt,
  referenceDistanceToZone,
  classifyReferenceCoincidence,
  buildReferenceLineage,
  validateAnchorFamilyFreeze
} from "./pattern_vwap_cost_reference_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const freeze="2026-10-06T10:00:00+08:00";

t("VR01 uncertified provider average stays proxy, not exchange VWAP",()=>{
  const r=validateSessionAverageReceipt({
    sourceId:"FUGLE",sourceVersion:"V1",sourceFieldName:"avgPrice",formulaCertified:false,
    sessionStart:"2026-10-06T09:00:00+08:00",asOf:"2026-10-06T09:59:00+08:00",
    sourceFetchedAt:"2026-10-06T09:59:30+08:00",predictorFreezeAt:freeze,
    marketType:"COMMON_STOCK",sessionPhase:"CONTINUOUS",
    coverageState:"COMPLETE_TO_ASOF",replaySafe:true
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.label,"SESSION_AVERAGE_PRICE_PROXY");
});

t("VR02 certified exact formula may be labeled session VWAP",()=>{
  const r=validateSessionAverageReceipt({
    sourceId:"OWNER",sourceVersion:"V1",sourceFieldName:"vwap",formulaCertified:true,
    sessionStart:"2026-10-06T09:00:00+08:00",asOf:"2026-10-06T09:59:00+08:00",
    sourceFetchedAt:"2026-10-06T09:59:30+08:00",predictorFreezeAt:freeze,
    marketType:"COMMON_STOCK",sessionPhase:"CONTINUOUS",
    coverageState:"COMPLETE_TO_ASOF",replaySafe:true
  });
  assert.equal(r.label,"CERTIFIED_SESSION_VWAP");
});

t("VR03 late session reference is post hoc",()=>{
  const r=validateSessionAverageReceipt({
    sourceId:"FUGLE",sourceVersion:"V1",sourceFieldName:"avgPrice",formulaCertified:false,
    sessionStart:"2026-10-06T09:00:00+08:00",asOf:"2026-10-06T10:01:00+08:00",
    sourceFetchedAt:"2026-10-06T10:01:30+08:00",predictorFreezeAt:freeze,
    marketType:"COMMON_STOCK",sessionPhase:"CONTINUOUS",
    coverageState:"COMPLETE_TO_ASOF",replaySafe:true
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("VR04 causal anchored reference is valid when fully pre-freeze",()=>{
  const r=validateAnchoredReferenceReceipt({
    anchorClass:"BREAKOUT_CONFIRMED",anchorRuleId:"AR1",
    anchorRuleFrozenAt:"2026-09-01T00:00:00+08:00",
    outcomeInspectionAt:"2026-11-01T00:00:00+08:00",
    anchorAt:"2026-10-06T09:15:00+08:00",anchorKnownAt:"2026-10-06T09:15:00+08:00",
    anchorSource:"D01-05",anchorVersion:"V1",
    priceVolumeWindowStart:"2026-10-06T09:15:00+08:00",
    priceVolumeWindowEnd:"2026-10-06T09:59:00+08:00",
    referenceAsOf:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,
    sourceFetchedAt:"2026-10-06T09:59:30+08:00",replaySafe:true,
    futureBarRequired:false,outcomeSelectedAnchor:false
  });
  assert.equal(r.status,"VALID");
});

t("VR05 outcome-selected anchor is prohibited",()=>{
  const r=validateAnchoredReferenceReceipt({
    anchorClass:"SWING_LOW",anchorRuleId:"AR1",
    anchorRuleFrozenAt:"2026-09-01",outcomeSelectedAnchor:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"OUTCOME_SELECTED_ANCHOR");
});

t("VR06 future pivot anchor is post hoc",()=>{
  const r=validateAnchoredReferenceReceipt({
    anchorClass:"PIVOT",anchorRuleId:"AR1",
    anchorRuleFrozenAt:"2026-09-01",anchorSource:"D01",anchorVersion:"V1",
    replaySafe:true,futureBarRequired:true
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("VR07 anchor confirmation after freeze is post hoc",()=>{
  const r=validateAnchoredReferenceReceipt({
    anchorClass:"EVENT",anchorRuleId:"AR1",
    anchorRuleFrozenAt:"2026-09-01T00:00:00+08:00",
    anchorAt:"2026-10-06T09:00:00+08:00",anchorKnownAt:"2026-10-06T10:01:00+08:00",
    anchorSource:"D11",anchorVersion:"V1",
    priceVolumeWindowStart:"2026-10-06T09:00:00+08:00",
    priceVolumeWindowEnd:"2026-10-06T09:59:00+08:00",
    referenceAsOf:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,
    sourceFetchedAt:"2026-10-06T09:59:30+08:00",replaySafe:true
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("VR08 D20-owned aggregate cost proxy is valid but remains proxy",()=>{
  const r=validateCostReferenceReceipt({
    owner:"D20",referencePrice:100,referenceMethod:"TURNOVER_WEIGHTED_REFERENCE",
    asOf:"2026-10-05T13:30:00+08:00",predictorFreezeAt:freeze,
    sourceKnownAt:"2026-10-05T18:00:00+08:00",sourceLineage:"D20-R1",
    ruleVintage:"V1",proxyType:"AGGREGATE_REFERENCE",coverageState:"COMPLETE",
    replaySafe:true,directHoldingsEvidence:false
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.label,"AGGREGATE_COST_REFERENCE_PROXY");
  assert.equal(r.trueAllInvestorCostBasisObserved,false);
});

t("VR09 non-D20 cost proxy owner is rejected",()=>{
  const r=validateCostReferenceReceipt({
    owner:"D01",referencePrice:100,referenceMethod:"X",asOf:"2026-10-05",
    predictorFreezeAt:freeze,sourceKnownAt:"2026-10-05",
    sourceLineage:"X",ruleVintage:"V1",proxyType:"X",coverageState:"COMPLETE",replaySafe:true
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"COST_REFERENCE_OWNER_INVALID");
});

t("VR10 cost proxy is never mislabeled institutional cost",()=>{
  const r=validateCostReferenceReceipt({
    owner:"D20",referencePrice:100,referenceMethod:"TURNOVER_WEIGHTED_REFERENCE",
    asOf:"2026-10-05",predictorFreezeAt:freeze,sourceKnownAt:"2026-10-05",
    sourceLineage:"D20-R1",ruleVintage:"V1",proxyType:"AGGREGATE_REFERENCE",
    coverageState:"COMPLETE",replaySafe:true,directHoldingsEvidence:false
  });
  assert.equal(r.institutionalCostObserved,false);
});

t("VR11 D05 live-liquidity receipt is a separate valid object",()=>{
  const r=validateLiveLiquidityReceipt({
    owner:"D05",asOf:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,
    sourceFetchedAt:"2026-10-06T09:59:30+08:00",
    spreadKnown:true,depthKnown:true,replaySafe:true
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.label,"LIVE_ORDER_BOOK_LIQUIDITY");
});

t("VR12 non-D05 source cannot claim live liquidity",()=>{
  const r=validateLiveLiquidityReceipt({
    owner:"D01",asOf:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,
    sourceFetchedAt:"2026-10-06T09:59:30+08:00",
    spreadKnown:true,depthKnown:true,replaySafe:true
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"LIVE_LIQUIDITY_OWNER_INVALID");
});

t("VR13 reference inside structural zone has zero edge distance",()=>{
  const r=referenceDistanceToZone({
    boundary:{lower:99,upper:101},referencePrice:100,tickSize:0.5,atr:2
  });
  assert.equal(r.referenceInsideZone,true);
  assert.equal(r.referenceDistancePrice,0);
});

t("VR14 outside reference distance is normalized without moving zone",()=>{
  const r=referenceDistanceToZone({
    boundary:{lower:99,upper:101},referencePrice:105,tickSize:0.5,atr:2
  });
  assert.equal(r.referenceDistancePrice,4);
  assert.equal(r.referenceDistanceTicks,8);
  assert.equal(r.referenceDistanceAtr,2);
  assert.equal(r.sideRelativeToZone,"ABOVE_ZONE");
});

t("VR15 one session coincidence is C1",()=>{
  const r=classifyReferenceCoincidence({
    structuralCertified:true,sessionReferenceCoincident:true,
    anchoredReferenceCoincident:false,costProxyCoincident:false,
    liveLiquidityCoincident:false,allRequiredReceiptsEvaluable:true
  });
  assert.equal(r.status,"C1_SESSION_REFERENCE_COINCIDENT");
});

t("VR16 multiple reference coincidences collapse to C5 context",()=>{
  const r=classifyReferenceCoincidence({
    structuralCertified:true,sessionReferenceCoincident:true,
    anchoredReferenceCoincident:true,costProxyCoincident:true,
    liveLiquidityCoincident:false,allRequiredReceiptsEvaluable:true
  });
  assert.equal(r.status,"C5_MULTI_REFERENCE_COINCIDENT");
});

t("VR17 unevaluable receipt is C6 rather than no coincidence",()=>{
  const r=classifyReferenceCoincidence({
    structuralCertified:true,allRequiredReceiptsEvaluable:false
  });
  assert.equal(r.status,"C6_REFERENCE_NOT_EVALUABLE");
});

t("VR18 multi-reference lineage still defaults to one effective vote",()=>{
  const r=buildReferenceLineage({
    parentDecisionId:"P1",hasPriceStructure:true,hasSessionReference:true,
    hasAnchoredReference:true,hasCostProxy:true,hasLiveLiquidity:true
  });
  assert.equal(r.rawRepresentationCount,5);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("VR19 distinct primitive roots do not auto-authorize another vote",()=>{
  const r=buildReferenceLineage({
    parentDecisionId:"P1",hasPriceStructure:true,hasCostProxy:true,hasLiveLiquidity:true
  });
  assert.ok(r.informationRoots.includes("BEHAVIORAL_REFERENCE_RECEIPT"));
  assert.ok(r.informationRoots.includes("LIVE_ORDER_BOOK_RECEIPT"));
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("VR20 post-outcome anchor family mutation is prohibited",()=>{
  const r=validateAnchorFamilyFreeze({
    anchorFamilyId:"AF1",registryFrozenAt:"2026-09-01T00:00:00+08:00",
    outcomeInspectionAt:"2026-10-01T00:00:00+08:00",familyChangedAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"POST_OUTCOME_ANCHOR_FAMILY_MUTATION");
});

t("VR21 deleting losing anchor variants after outcomes is prohibited",()=>{
  const r=validateAnchorFamilyFreeze({
    anchorFamilyId:"AF1",registryFrozenAt:"2026-09-01T00:00:00+08:00",
    outcomeInspectionAt:"2026-10-01T00:00:00+08:00",anchorVariantsRemovedAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"POST_OUTCOME_ANCHOR_VARIANT_REMOVAL");
});

t("VR22 anchor family registry must predate outcome inspection",()=>{
  const r=validateAnchorFamilyFreeze({
    anchorFamilyId:"AF1",registryFrozenAt:"2026-10-02T00:00:00+08:00",
    outcomeInspectionAt:"2026-10-01T00:00:00+08:00"
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"ANCHOR_FAMILY_NOT_FROZEN_BEFORE_OUTCOME");
});

console.log(`SUMMARY ${pass}/22 PASS`);
