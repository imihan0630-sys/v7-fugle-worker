import assert from "node:assert/strict";
import {
  validateTargetPopulation,
  classifyHistoryStage,
  classifyDetectorStage,
  classifyOpportunityStage,
  validatePointInTimeContextReceipt,
  summarizeAttrition,
  classifyCrossSectionSupport,
  summarizeSymbolConcentration,
  classifyEvaluationExit
} from "./pattern_crosssection_liquidity_survivorship_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const universe={
  pointInTimeVerified:true,
  currentOnly:false,
  futureDelistingInfoExposed:false
};

t("CS01 current-survivor-only universe is prohibited",()=>{
  const r=validateTargetPopulation({
    targetPopulationType:"POINT_IN_TIME_MARKET_UNIVERSE",
    universeReceipt:{...universe,currentOnly:true}
  });
  assert.equal(r.status,"PROHIBITED");
});

t("CS02 future delisting leakage is prohibited",()=>{
  const r=validateTargetPopulation({
    targetPopulationType:"POINT_IN_TIME_MARKET_UNIVERSE",
    universeReceipt:{...universe,futureDelistingInfoExposed:true}
  });
  assert.equal(r.reason,"FUTURE_DELISTING_LEAKAGE");
});

t("CS03 Formal-eligible target has limited claim scope",()=>{
  const r=validateTargetPopulation({
    targetPopulationType:"FORMAL_ELIGIBLE_UNIVERSE",
    universeReceipt:universe,
    formalEligibilityReceipt:{verified:true}
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.marketWideClaimAllowed,false);
});

t("CS04 point-in-time market target permits market-wide scope only when verified",()=>{
  const r=validateTargetPopulation({
    targetPopulationType:"POINT_IN_TIME_MARKET_UNIVERSE",
    universeReceipt:universe
  });
  assert.equal(r.claimScope,"POINT_IN_TIME_MARKET_UNIVERSE");
});

t("CS05 new listing with complete age-aware history is too-short by design, not missing",()=>{
  const r=classifyHistoryStage({
    targetUniverseEligible:true,
    listingAgeEligibleSessions:20,
    detectorMinimumHistorySessions:60,
    expectedHistoryComplete:true,
    sourceHistoryComplete:true
  });
  assert.equal(r.stage,"HISTORY_TOO_SHORT_BY_DESIGN");
  assert.equal(r.dataMissing,false);
});

t("CS06 missing expected mature history is data blocked",()=>{
  const r=classifyHistoryStage({
    targetUniverseEligible:true,
    listingAgeEligibleSessions:100,
    detectorMinimumHistorySessions:60,
    expectedHistoryComplete:false,
    sourceHistoryComplete:false
  });
  assert.equal(r.stage,"HISTORY_DATA_BLOCKED");
});

t("CS07 insufficient history cannot become no-structure",()=>{
  const d=classifyDetectorStage({
    historyStage:"HISTORY_TOO_SHORT_BY_DESIGN",
    detectorExecuted:true,
    structureEmitted:false
  });
  assert.equal(d.stage,"DETECTOR_NOT_EVALUABLE");
});

t("CS08 evaluable detector with no emission remains explicit denominator",()=>{
  const d=classifyDetectorStage({
    historyStage:"HISTORY_READY",
    detectorExecuted:true,
    dataBlocked:false,
    structureEmitted:false
  });
  assert.equal(d.stage,"DETECTOR_NO_STRUCTURE");
});

t("CS09 no retest opportunity is not failed pattern",()=>{
  const r=classifyOpportunityStage({
    detectorStage:"STRUCTURE_EMITTED",
    opportunityValid:false,
    opportunityDataBlocked:false
  });
  assert.equal(r.stage,"NO_VALID_OPPORTUNITY");
  assert.equal(r.failedPattern,false);
});

t("CS10 future liquidity context is post hoc",()=>{
  const r=validatePointInTimeContextReceipt({
    receipt:{verified:true,calculatedAt:"2026-10-02T13:30:00+08:00"},
    predictorFreezeAt:"2026-10-01T13:30:00+08:00"
  });
  assert.equal(r.status,"POST_HOC_FILTER_NOT_ELIGIBLE");
});

t("CS11 current market-cap backfill into history is prohibited",()=>{
  const r=validatePointInTimeContextReceipt({
    receipt:{
      verified:true,
      calculatedAt:"2026-09-30T13:30:00+08:00",
      usesCurrentValueForHistoricalDate:true
    },
    predictorFreezeAt:"2026-10-01T13:30:00+08:00"
  });
  assert.equal(r.status,"PROHIBITED");
});

t("CS12 attrition summary retains too-short, blocked and no-structure states",()=>{
  const s=summarizeAttrition([
    {targetUniverseEligible:true,formalEligible:true,historyStage:"HISTORY_READY",detectorStage:"STRUCTURE_EMITTED",opportunityStage:"OPPORTUNITY_READY",economicEvaluable:true,tradabilityEvaluable:true},
    {targetUniverseEligible:true,formalEligible:false,historyStage:"HISTORY_TOO_SHORT_BY_DESIGN",detectorStage:"DETECTOR_NOT_EVALUABLE",opportunityStage:"OPPORTUNITY_NOT_APPLICABLE"},
    {targetUniverseEligible:true,formalEligible:true,historyStage:"HISTORY_DATA_BLOCKED",detectorStage:"DETECTOR_NOT_EVALUABLE",opportunityStage:"OPPORTUNITY_NOT_APPLICABLE"},
    {targetUniverseEligible:true,formalEligible:true,historyStage:"HISTORY_READY",detectorStage:"DETECTOR_NO_STRUCTURE",opportunityStage:"OPPORTUNITY_NOT_APPLICABLE"}
  ]);
  assert.equal(s.targetEligibleCount,4);
  assert.equal(s.historyTooShortCount,1);
  assert.equal(s.historyBlockedCount,1);
  assert.equal(s.noStructureCount,1);
  assert.equal(s.silentDroppingAllowed,false);
});

t("CS13 detector emission rate denominator is detector-evaluable, not successful-only",()=>{
  const s=summarizeAttrition([
    {targetUniverseEligible:true,historyStage:"HISTORY_READY",detectorStage:"STRUCTURE_EMITTED",opportunityStage:"NO_VALID_OPPORTUNITY"},
    {targetUniverseEligible:true,historyStage:"HISTORY_READY",detectorStage:"DETECTOR_NO_STRUCTURE",opportunityStage:"OPPORTUNITY_NOT_APPLICABLE"}
  ]);
  assert.equal(s.detectorEvaluableCount,2);
  assert.equal(s.detectorEmissionRate,0.5);
});

t("CS14 lack of liquidity support prohibits cross-sectional extrapolation",()=>{
  const r=classifyCrossSectionSupport({
    sizeOverlap:true,liquidityOverlap:false,listingAgeOverlap:true,
    priceTickOverlap:true,marketOverlap:true,regimeOverlap:true
  });
  assert.equal(r.status,"CROSS_SECTIONAL_EXTRAPOLATION_PROHIBITED");
});

t("CS15 complete support is valid without assigning economics",()=>{
  const r=classifyCrossSectionSupport({
    sizeOverlap:true,liquidityOverlap:true,listingAgeOverlap:true,
    priceTickOverlap:true,marketOverlap:true,regimeOverlap:true
  });
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

t("CS16 symbol concentration stays descriptive",()=>{
  const r=summarizeSymbolConcentration([
    {symbol:"2330",opportunityReady:true},
    {symbol:"2330",opportunityReady:true},
    {symbol:"2317",opportunityReady:true}
  ]);
  assert.equal(r.uniqueSymbolCount,2);
  assert.equal(r.top1SymbolShare,2/3);
  assert.equal(r.broadGeneralizationAssigned,false);
});

t("CS17 later delisting is retained, not silently dropped",()=>{
  const r=classifyEvaluationExit({delistedDuringEvaluation:true});
  assert.equal(r.state,"DELISTED_DURING_EVALUATION");
  assert.equal(r.silentDropAllowed,false);
});

t("CS18 suspension is distinct from delisting and normal trading",()=>{
  const r=classifyEvaluationExit({suspended:true});
  assert.equal(r.state,"SUSPENDED");
});

t("CS19 price-limit constraint is retained as its own state",()=>{
  const r=classifyEvaluationExit({priceLimitConstrained:true});
  assert.equal(r.state,"PRICE_LIMIT_CONSTRAINED");
});

t("CS20 unknown execution context does not erase signal-evaluable case",()=>{
  const r=classifyEvaluationExit({executionContextKnown:false});
  assert.equal(r.state,"EXECUTION_CONTEXT_UNKNOWN");
  assert.equal(r.silentDropAllowed,false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
