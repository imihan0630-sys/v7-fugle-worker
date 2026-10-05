import assert from "node:assert/strict";
import {
  validateMarketBetaReceipt,
  classifyCandidateSelfInclusion,
  validateBetaPolicyFreeze,
  buildReplicationDiagnostics,
  classifyBetaCommonSupport,
  classifyClaimScope
} from "./pattern_market_common_shock_beta_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const freeze="2026-10-01T13:30:00+08:00";
const receipt={
  benchmarkId:"TAIEX",
  benchmarkVersion:"V1",
  benchmarkKnownAt:"2026-09-30T18:00:00+08:00",
  betaModelId:"D19-BETA",
  betaModelVersion:"V1",
  betaEstimate:1.2,
  betaEstimateKnownAt:"2026-09-30T18:00:00+08:00",
  betaObservationCount:120,
  betaState:"KNOWN",
  candidateIncludedInBenchmark:true,
  candidateWeightInBenchmark:0.08,
  exCandidateBenchmarkState:"AVAILABLE"
};

t("MB01 PIT-safe beta receipt is known context",()=>{
  const r=validateMarketBetaReceipt({receipt,predictorFreezeAt:freeze});
  assert.equal(r.status,"MARKET_CONTEXT_KNOWN");
  assert.equal(r.betaEstimate,1.2);
});

t("MB02 current beta cannot backfill history",()=>{
  const r=validateMarketBetaReceipt({
    receipt:{...receipt,betaEstimateKnownAt:"2026-10-02T18:00:00+08:00"},
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
  assert.equal(r.reason,"BETA_NOT_KNOWN_AT_FREEZE");
});

t("MB03 future benchmark version cannot backfill history",()=>{
  const r=validateMarketBetaReceipt({
    receipt:{...receipt,benchmarkKnownAt:"2026-10-02T18:00:00+08:00"},
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("MB04 unknown beta remains unknown, not zero or one",()=>{
  const r=validateMarketBetaReceipt({
    receipt:{...receipt,betaState:"UNKNOWN",betaEstimate:null},
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"BETA_CONTEXT_UNKNOWN");
});

t("MB05 invalid observation count blocks beta context",()=>{
  const r=validateMarketBetaReceipt({
    receipt:{...receipt,betaObservationCount:0},
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"BETA_CONTEXT_UNKNOWN");
});

t("MB06 included-candidate benchmark with ex-candidate context is still context only",()=>{
  const r=classifyCandidateSelfInclusion({
    candidateIncludedInBenchmark:true,
    exCandidateBenchmarkState:"AVAILABLE"
  });
  assert.equal(r.status,"SELF_INCLUSION_RESOLVED_BY_EX_CANDIDATE_CONTEXT");
  assert.equal(r.independentConfirmationAllowed,false);
});

t("MB07 included candidate without ex-candidate context is unresolved",()=>{
  const r=classifyCandidateSelfInclusion({
    candidateIncludedInBenchmark:true,
    exCandidateBenchmarkState:"UNAVAILABLE"
  });
  assert.equal(r.status,"SELF_INCLUSION_UNRESOLVED");
});

t("MB08 no direct self inclusion still does not create alpha vote",()=>{
  const r=classifyCandidateSelfInclusion({
    candidateIncludedInBenchmark:false,
    exCandidateBenchmarkState:"NOT_NEEDED"
  });
  assert.equal(r.status,"NO_DIRECT_CANDIDATE_SELF_INCLUSION");
  assert.equal(r.independentConfirmationAllowed,false);
});

t("MB09 outcome-selected beta model is prohibited",()=>{
  const r=validateBetaPolicyFreeze({
    betaPolicyFrozenBeforeOutcome:true,
    benchmarkPolicyFrozenBeforeOutcome:true,
    selectedModelAfterOutcome:true
  });
  assert.equal(r.reason,"OUTCOME_SELECTED_BETA_MODEL");
});

t("MB10 outcome-selected beta window is prohibited",()=>{
  const r=validateBetaPolicyFreeze({
    betaPolicyFrozenBeforeOutcome:true,
    benchmarkPolicyFrozenBeforeOutcome:true,
    selectedWindowAfterOutcome:true
  });
  assert.equal(r.reason,"OUTCOME_SELECTED_BETA_WINDOW");
});

t("MB11 outcome-selected benchmark is prohibited",()=>{
  const r=validateBetaPolicyFreeze({
    betaPolicyFrozenBeforeOutcome:true,
    benchmarkPolicyFrozenBeforeOutcome:true,
    selectedBenchmarkAfterOutcome:true
  });
  assert.equal(r.reason,"OUTCOME_SELECTED_BENCHMARK");
});

t("MB12 frozen beta and benchmark policies are valid",()=>{
  const r=validateBetaPolicyFreeze({
    betaPolicyFrozenBeforeOutcome:true,
    benchmarkPolicyFrozenBeforeOutcome:true
  });
  assert.equal(r.status,"VALID");
});

t("MB13 many sectors on one date remain one market-date cluster",()=>{
  const r=buildReplicationDiagnostics([
    {marketDate:"2026-09-01",symbol:"A",sectorId:"S1",structuralRootId:"R1"},
    {marketDate:"2026-09-01",symbol:"B",sectorId:"S2",structuralRootId:"R2"},
    {marketDate:"2026-09-01",symbol:"C",sectorId:"S3",structuralRootId:"R3"}
  ]);
  assert.equal(r.uniqueSectorN,3);
  assert.equal(r.marketDateClusterN,1);
  assert.equal(r.manySectorsOneDateIsIndependentReplication,false);
});

t("MB14 repeated stocks across dates expand market-date replication only by date",()=>{
  const r=buildReplicationDiagnostics([
    {marketDate:"2026-09-01",symbol:"A",sectorId:"S1",structuralRootId:"R1"},
    {marketDate:"2026-09-02",symbol:"A",sectorId:"S1",structuralRootId:"R1"},
    {marketDate:"2026-09-02",symbol:"B",sectorId:"S2",structuralRootId:"R2"}
  ]);
  assert.equal(r.stockObservationN,3);
  assert.equal(r.uniqueSymbolN,2);
  assert.equal(r.marketDateClusterN,2);
});

t("MB15 common shock ids are counted separately from rows",()=>{
  const r=buildReplicationDiagnostics([
    {marketDate:"2026-09-01",symbol:"A",sectorId:"S1",structuralRootId:"R1",commonShockId:"CPI-X"},
    {marketDate:"2026-09-01",symbol:"B",sectorId:"S2",structuralRootId:"R2",commonShockId:"CPI-X"},
    {marketDate:"2026-09-02",symbol:"C",sectorId:"S3",structuralRootId:"R3",commonShockId:"NONE-Y"}
  ]);
  assert.equal(r.commonShockClusterN,2);
});

t("MB16 beta common-support failure prohibits extrapolation",()=>{
  const r=classifyBetaCommonSupport({
    betaOverlap:false,
    marketRegimeOverlap:true,
    sectorContextOverlap:true,
    sizeLiquidityOverlap:true,
    opportunityGeometryOverlap:true
  });
  assert.equal(r.status,"MARKET_BETA_EXTRAPOLATION_PROHIBITED");
});

t("MB17 incomplete market-regime support is unknown",()=>{
  const r=classifyBetaCommonSupport({
    betaOverlap:true,
    marketRegimeOverlap:null,
    sectorContextOverlap:true,
    sizeLiquidityOverlap:true,
    opportunityGeometryOverlap:true
  });
  assert.equal(r.status,"UNKNOWN");
});

t("MB18 full common support is valid",()=>{
  const r=classifyBetaCommonSupport({
    betaOverlap:true,
    marketRegimeOverlap:true,
    sectorContextOverlap:true,
    sizeLiquidityOverlap:true,
    opportunityGeometryOverlap:true
  });
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

t("MB19 raw effect explained by market is scoped as market explained",()=>{
  const r=classifyClaimScope({
    marketContextKnown:true,
    marketExplainsRaw:true,
    residualPatternRemains:false
  });
  assert.equal(r.status,"MARKET_EXPLAINED_PATTERN");
});

t("MB20 residual pattern on one date is not cross-date replication",()=>{
  const r=classifyClaimScope({
    marketContextKnown:true,
    residualPatternRemains:true,
    independentMarketDates:1
  });
  assert.equal(r.status,"MARKET_RESIDUAL_PATTERN");
});

t("MB21 residual pattern across independent market dates upgrades claim scope only",()=>{
  const r=classifyClaimScope({
    marketContextKnown:true,
    residualPatternRemains:true,
    independentMarketDates:4
  });
  assert.equal(r.status,"CROSS_MARKET_DATE_PATTERN_CANDIDATE");
});

t("MB22 unknown market context cannot support residual claim",()=>{
  const r=classifyClaimScope({
    marketContextKnown:false,
    residualPatternRemains:true,
    independentMarketDates:5
  });
  assert.equal(r.status,"MARKET_CONTEXT_UNRESOLVED");
});

console.log(`SUMMARY ${pass}/22 PASS`);
