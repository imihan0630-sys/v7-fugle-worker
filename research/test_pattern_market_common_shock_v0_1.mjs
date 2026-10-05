import assert from "node:assert/strict";
import {
  validateMarketContext,
  validateFactorReceipt,
  validateRegimeReceipt,
  summarizeMarketReplication,
  classifyCrossSectorReplication,
  classifyMarketSelfInclusion,
  classifyMarketFactorSupport,
  buildPredictorManifest
} from "./pattern_market_common_shock_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const freeze="2026-10-01T13:30:00+08:00";

t("MC01 pre-signal market context is valid but not independent vote",()=>{
  const r=validateMarketContext({receipt:{verified:true,knownAt:"2026-10-01T13:00:00+08:00"},predictorFreezeAt:freeze});
  assert.equal(r.status,"VALID"); assert.equal(r.independentConfirmationAllowed,false);
});

t("MC02 market context known after freeze is post hoc",()=>{
  const r=validateMarketContext({receipt:{verified:true,knownAt:"2026-10-01T14:00:00+08:00"},predictorFreezeAt:freeze});
  assert.equal(r.status,"POST_HOC_MARKET_CONTEXT");
});

t("MC03 Pattern-defined market state is prohibited",()=>{
  const r=validateMarketContext({receipt:{verified:true,knownAt:"2026-10-01T13:00:00+08:00",patternPerformanceUsedToDefine:true},predictorFreezeAt:freeze});
  assert.equal(r.status,"PROHIBITED");
});

t("MC04 point-in-time beta receipt is valid",()=>{
  const r=validateFactorReceipt({receipt:{verified:true,knownAt:"2026-10-01T12:00:00+08:00",asOf:"2026-10-01T12:00:00+08:00"},predictorFreezeAt:freeze});
  assert.equal(r.status,"VALID");
});

t("MC05 future-window beta is prohibited",()=>{
  const r=validateFactorReceipt({receipt:{verified:true,knownAt:"2026-10-01T12:00:00+08:00",asOf:"2026-10-01T12:00:00+08:00",usesFutureReturns:true},predictorFreezeAt:freeze});
  assert.equal(r.reason,"FUTURE_WINDOW_BETA");
});

t("MC06 outcome-selected benchmark is prohibited",()=>{
  const r=validateFactorReceipt({receipt:{verified:true,knownAt:"2026-10-01T12:00:00+08:00",asOf:"2026-10-01T12:00:00+08:00",outcomeSelectedBenchmark:true},predictorFreezeAt:freeze});
  assert.equal(r.reason,"OUTCOME_SELECTED_BENCHMARK");
});

t("MC07 outcome-selected factor model is prohibited",()=>{
  const r=validateFactorReceipt({receipt:{verified:true,knownAt:"2026-10-01T12:00:00+08:00",asOf:"2026-10-01T12:00:00+08:00",outcomeSelectedFactorModel:true},predictorFreezeAt:freeze});
  assert.equal(r.reason,"OUTCOME_SELECTED_FACTOR_MODEL");
});

t("MC08 post-hoc regime mining is prohibited",()=>{
  const r=validateRegimeReceipt({receipt:{verified:true,knownAt:"2026-10-01T12:00:00+08:00",performanceUsedToDefine:true},predictorFreezeAt:freeze});
  assert.equal(r.reason,"POST_HOC_REGIME_MINING");
});

t("MC09 five sectors on one date still have one market-date cluster",()=>{
  const rows=["S1","S2","S3","S4","S5"].map((s,i)=>({marketDate:"2026-10-01",sectorId:s,symbol:"X"+i,structuralRootId:"R"+i,independentMarketEpisodeId:"E1"}));
  const r=summarizeMarketReplication(rows);
  assert.equal(r.uniqueSectorCount,5); assert.equal(r.marketDateClusterCount,1); assert.equal(r.independentMarketEpisodeCount,1);
});

t("MC10 stock rows are not market replications",()=>{
  const rows=Array.from({length:20},(_,i)=>({marketDate:"2026-10-01",sectorId:"S"+(i%5),symbol:"X"+i,structuralRootId:"R"+i,independentMarketEpisodeId:"E1"}));
  const r=summarizeMarketReplication(rows);
  assert.equal(r.stockObservationCount,20); assert.equal(r.marketDateClusterCount,1); assert.equal(r.manySectorsEqualIndependentReplication,false);
});

t("MC11 sector-date and market-date counts remain separate",()=>{
  const r=summarizeMarketReplication([
    {marketDate:"2026-10-01",sectorId:"S1",symbol:"A",structuralRootId:"R1",independentMarketEpisodeId:"E1"},
    {marketDate:"2026-10-01",sectorId:"S2",symbol:"B",structuralRootId:"R2",independentMarketEpisodeId:"E1"}
  ]);
  assert.equal(r.sectorDateClusterCount,2); assert.equal(r.marketDateClusterCount,1);
});

t("MC12 one-date cross-sector sample is single market shock",()=>{
  const s=summarizeMarketReplication([
    {marketDate:"2026-10-01",sectorId:"S1",symbol:"A",structuralRootId:"R1",independentMarketEpisodeId:"E1"},
    {marketDate:"2026-10-01",sectorId:"S2",symbol:"B",structuralRootId:"R2",independentMarketEpisodeId:"E1"}
  ]);
  const r=classifyCrossSectorReplication({summary:s,marketContextMatched:true,factorContextReady:true,sectorContextReady:true,independentDatesReady:false});
  assert.equal(r.status,"CROSS_SECTOR_SINGLE_MARKET_SHOCK");
});

t("MC13 multiple dates can reach market-date replication readiness",()=>{
  const s=summarizeMarketReplication([
    {marketDate:"2026-10-01",sectorId:"S1",symbol:"A",structuralRootId:"R1",independentMarketEpisodeId:"E1"},
    {marketDate:"2026-10-02",sectorId:"S2",symbol:"B",structuralRootId:"R2",independentMarketEpisodeId:"E2"}
  ]);
  const r=classifyCrossSectorReplication({summary:s,marketContextMatched:true,factorContextReady:true,sectorContextReady:true,independentDatesReady:true});
  assert.equal(r.status,"Q5_MULTI_DATE_CROSS_SECTOR_PATTERN_CANDIDATE");
});

t("MC14 candidate-included market context is not independent confirmation",()=>{
  const r=classifyMarketSelfInclusion({candidateIncludedInMarketReturn:true,candidateIncludedInMarketBreadth:true,leaveOneOutMarketVerified:false});
  assert.equal(r.status,"MARKET_SELF_INCLUSION_UNRESOLVED"); assert.equal(r.independentConfirmationAllowed,false);
});

t("MC15 even leave-one-out market context is still a control",()=>{
  const r=classifyMarketSelfInclusion({candidateIncludedInMarketReturn:false,candidateIncludedInMarketBreadth:false,leaveOneOutMarketVerified:true});
  assert.equal(r.independentConfirmationAllowed,false);
});

t("MC16 beta support failure prohibits extrapolation",()=>{
  const r=classifyMarketFactorSupport({sizeLiquidityOverlap:true,sectorContextOverlap:true,betaExposureOverlap:false,marketContextOverlap:true,regimeOverlap:true,opportunityGeometryOverlap:true});
  assert.equal(r.status,"MARKET_FACTOR_EXTRAPOLATION_PROHIBITED");
});

t("MC17 complete market/factor common support is valid",()=>{
  const r=classifyMarketFactorSupport({sizeLiquidityOverlap:true,sectorContextOverlap:true,betaExposureOverlap:true,marketContextOverlap:true,regimeOverlap:true,opportunityGeometryOverlap:true});
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

t("MC18 future benchmark outcome cannot enter predictor manifest",()=>{
  const r=buildPredictorManifest({marketBenchmarkId:"TAIEX",factorModelId:"D19-MKT",betaEstimateId:"B1",predictorFreezeAt:freeze,futureBenchmarkReturn:0.03});
  assert.equal(r.outcomeJoinAllowed,false); assert.equal(r.futureOutcomeStored,false); assert.equal(r.suppliedFutureOutcomeIgnored,true);
});

t("MC19 missing factor receipt remains unknown rather than zero beta",()=>{
  const r=validateFactorReceipt({receipt:null,predictorFreezeAt:freeze});
  assert.equal(r.status,"MARKET_FACTOR_CONTEXT_UNKNOWN");
});

t("MC20 multiple sectors on one market date cannot claim generic cross-sector replication",()=>{
  const s=summarizeMarketReplication([
    {marketDate:"2026-10-01",sectorId:"S1",symbol:"A",structuralRootId:"R1",independentMarketEpisodeId:"E1"},
    {marketDate:"2026-10-01",sectorId:"S2",symbol:"B",structuralRootId:"R2",independentMarketEpisodeId:"E1"},
    {marketDate:"2026-10-01",sectorId:"S3",symbol:"C",structuralRootId:"R3",independentMarketEpisodeId:"E1"}
  ]);
  const r=classifyCrossSectorReplication({summary:s,marketContextMatched:true,factorContextReady:true,sectorContextReady:true,independentDatesReady:true});
  assert.equal(r.genericCrossSectorClaimAllowed,false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
