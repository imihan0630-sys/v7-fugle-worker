import assert from "node:assert/strict";
import {
  validateProspectiveProfileReceipt,
  computeZoneVolumeDescriptors,
  classifyStructureVolumeContext,
  buildPriceVolumeLineage,
  validateBinFamilyFreeze,
  classifyMechanismClaim
} from "./pattern_volume_at_price_context_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const freeze="2026-10-06T10:00:00+08:00";
const bins=[
  {price:100,volume:10},
  {price:101,volume:30},
  {price:102,volume:50},
  {price:103,volume:30},
  {price:104,volume:10}
];
const receiptBase={
  sourceFetchedAt:"2026-10-06T09:59:00+08:00",
  profileAsOf:"2026-10-06T09:59:00+08:00",
  predictorFreezeAt:freeze,
  profileWindowStart:"2026-10-06T09:00:00+08:00",
  profileWindowEnd:"2026-10-06T09:59:00+08:00",
  sourceId:"FUGLE_CURRENT_INTRADAY_VOLUMES",
  sourceVersion:"V1",
  owner:"D02-12_PRICE_BY_VOLUME_PROFILE",
  sessionPhase:"CONTINUOUS",
  marketType:"COMMON_STOCK",
  priceBins:bins,
  binConstructionRuleId:"EXACT_PROVIDER_PRICE_LEVELS",
  tickReceipt:{verified:true,version:"TWSE_TICK_V1"},
  profileCoverageState:"COMPLETE_TO_ASOF",
  replaySafe:true,
  syntheticFromOHLCV:false,
  includesTradesAfterFreeze:false
};

t("VP01 valid prospective profile receipt is eligible",()=>{
  const r=validateProspectiveProfileReceipt(receiptBase);
  assert.equal(r.status,"VALID");
  assert.equal(r.prospectiveOnly,true);
  assert.equal(r.historicalReplayCertified,false);
});

t("VP02 OHLCV synthetic historical profile is prohibited",()=>{
  const r=validateProspectiveProfileReceipt({...receiptBase,syntheticFromOHLCV:true});
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"HISTORICAL_PROFILE_FROM_OHLCV_PROHIBITED");
});

t("VP03 profile fetched after predictor freeze is post hoc",()=>{
  const r=validateProspectiveProfileReceipt({
    ...receiptBase,
    sourceFetchedAt:"2026-10-06T10:01:00+08:00"
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("VP04 profile containing trades after freeze is post hoc",()=>{
  const r=validateProspectiveProfileReceipt({...receiptBase,includesTradesAfterFreeze:true});
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("VP05 unknown tick provenance fails closed",()=>{
  const r=validateProspectiveProfileReceipt({...receiptBase,tickReceipt:{verified:false}});
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"PROFILE_TICK_CONTEXT_UNKNOWN");
});

t("VP06 missing bin construction rule is not eligible",()=>{
  const r=validateProspectiveProfileReceipt({...receiptBase,binConstructionRuleId:""});
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"BIN_RULE_MISSING");
});

t("VP07 zone-volume descriptors preserve continuous share",()=>{
  const r=computeZoneVolumeDescriptors({
    boundary:{lower:101,upper:103},
    priceBins:bins,
    tickSize:1,
    atr:2
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.zoneExecutedVolume,110);
  assert.equal(r.totalExecutedVolume,130);
  assert.equal(r.zoneVolumeShare,110/130);
});

t("VP08 max-volume node inside zone is descriptive only",()=>{
  const r=computeZoneVolumeDescriptors({
    boundary:{lower:101,upper:103},
    priceBins:bins,
    tickSize:1,
    atr:2
  });
  assert.equal(r.structuralZoneContainsAnyMaxNode,true);
  assert.equal(r.highVolumeNodeThresholdDefined,false);
});

t("VP09 tied max nodes are all retained",()=>{
  const r=computeZoneVolumeDescriptors({
    boundary:{lower:100,upper:104},
    priceBins:[
      {price:100,volume:50},
      {price:101,volume:10},
      {price:104,volume:50}
    ],
    tickSize:1,
    atr:2
  });
  assert.deepEqual(r.maxVolumePrices,[100,104]);
  assert.equal(r.maxNodeTieCount,2);
});

t("VP10 descriptors do not infer current liquidity",()=>{
  const r=computeZoneVolumeDescriptors({
    boundary:{lower:101,upper:103},priceBins:bins
  });
  assert.equal(r.currentLiquidityObserved,false);
});

t("VP11 descriptors do not infer remaining investor cost basis",()=>{
  const r=computeZoneVolumeDescriptors({
    boundary:{lower:101,upper:103},priceBins:bins
  });
  assert.equal(r.remainingInvestorCostBasisObserved,false);
});

t("VP12 structural-volume coincidence requires frozen node rule",()=>{
  const r=classifyStructureVolumeContext({
    structuralCertified:true,
    profileEvaluable:true,
    volumeNodeEligible:true,
    volumeNodeEligibilityRuleFrozenBeforeOutcome:false,
    structuralZoneContainsEligibleNode:true
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"VOLUME_NODE_RULE_UNFROZEN");
});

t("VP13 structural plus eligible coincident volume node is V2, not extra vote",()=>{
  const r=classifyStructureVolumeContext({
    structuralCertified:true,
    profileEvaluable:true,
    volumeNodeEligible:true,
    volumeNodeEligibilityRuleFrozenBeforeOutcome:true,
    structuralZoneContainsEligibleNode:true,
    roundOrReferenceCoincident:false
  });
  assert.equal(r.status,"V2_STRUCTURE_VOLUME_COINCIDENT");
});

t("VP14 round/reference coincidence remains explicit V3 context",()=>{
  const r=classifyStructureVolumeContext({
    structuralCertified:true,
    profileEvaluable:true,
    volumeNodeEligible:true,
    volumeNodeEligibilityRuleFrozenBeforeOutcome:true,
    structuralZoneContainsEligibleNode:true,
    roundOrReferenceCoincident:true
  });
  assert.equal(r.status,"V3_ROUND_REFERENCE_VOLUME_NODE");
});

t("VP15 price-plus-volume lineage still defaults to one effective vote",()=>{
  const r=buildPriceVolumeLineage({parentDecisionId:"P1",rawRepresentationCount:3});
  assert.deepEqual(r.informationRoots,["PRICE_OHLC","TRADED_VOLUME"]);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("VP16 residual incrementality remains unvalidated",()=>{
  const r=buildPriceVolumeLineage({parentDecisionId:"P1"});
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("VP17 post-outcome bin-rule mutation is prohibited",()=>{
  const r=validateBinFamilyFreeze({
    binConstructionRuleId:"B1",
    ruleFrozenAt:"2026-10-01T00:00:00+08:00",
    outcomeInspectionAt:"2026-10-05T00:00:00+08:00",
    ruleChangedAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"POST_OUTCOME_BIN_RULE_MUTATION");
});

t("VP18 deleting losing bins after outcome is prohibited",()=>{
  const r=validateBinFamilyFreeze({
    binConstructionRuleId:"B1",
    ruleFrozenAt:"2026-10-01T00:00:00+08:00",
    outcomeInspectionAt:"2026-10-05T00:00:00+08:00",
    losingBinsRemovedAfterOutcome:true
  });
  assert.equal(r.reason,"POST_OUTCOME_BIN_PRUNING");
});

t("VP19 executed volume cannot claim current liquidity without D05 receipt",()=>{
  const r=classifyMechanismClaim({
    claim:"CURRENT_LIQUIDITY_WALL",
    hasD05OrderBookReceipt:false
  });
  assert.equal(r.status,"UNIDENTIFIED");
});

t("VP20 historical executed volume cannot claim remaining inventory",()=>{
  const r=classifyMechanismClaim({
    claim:"REMAINING_INVESTOR_COST_BASIS",
    hasInventoryObservable:false
  });
  assert.equal(r.status,"UNIDENTIFIED");
});

t("VP21 volume-density conviction is only partially identified without time-at-price",()=>{
  const r=classifyMechanismClaim({
    claim:"VOLUME_DENSITY_CONVICTION",
    hasTimeAtPriceControl:false
  });
  assert.equal(r.status,"PARTIALLY_IDENTIFIED");
});

t("VP22 incomplete profile is V4 not zero-volume evidence",()=>{
  const r=classifyStructureVolumeContext({
    structuralCertified:true,
    profileEvaluable:false
  });
  assert.equal(r.status,"V4_PROFILE_NOT_EVALUABLE");
});

console.log(`SUMMARY ${pass}/22 PASS`);
