// D01 DL-041 market common-shock / beta firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function uniq(xs=[]){return [...new Set((xs||[]).map(String).filter(Boolean))].sort();}

export function validateMarketContext({
  receipt,
  predictorFreezeAt
}={}){
  if(!receipt||receipt.verified!==true)
    return {status:"UNKNOWN",reason:"MARKET_CONTEXT_UNVERIFIED"};
  const known=str(receipt.knownAt);
  const freeze=str(predictorFreezeAt);
  if(!known||!freeze)
    return {status:"UNKNOWN",reason:"MARKET_CONTEXT_CLOCK_INCOMPLETE"};
  if(known>freeze)
    return {status:"POST_HOC_MARKET_CONTEXT",eligible:false};
  if(receipt.patternPerformanceUsedToDefine===true)
    return {status:"PROHIBITED",reason:"PATTERN_DEFINED_MARKET_STATE"};
  return {status:"VALID",eligible:true,independentConfirmationAllowed:false};
}

export function validateFactorReceipt({
  receipt,
  predictorFreezeAt
}={}){
  if(!receipt||receipt.verified!==true)
    return {status:"MARKET_FACTOR_CONTEXT_UNKNOWN",reason:"FACTOR_RECEIPT_UNVERIFIED"};

  const freeze=str(predictorFreezeAt);
  const known=str(receipt.knownAt);
  const asOf=str(receipt.asOf);

  if(!freeze||!known||!asOf)
    return {status:"MARKET_FACTOR_CONTEXT_UNKNOWN",reason:"FACTOR_CLOCK_INCOMPLETE"};

  if(known>freeze||asOf>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"FACTOR_OR_BETA_KNOWN_AFTER_FREEZE"};

  if(receipt.usesFutureReturns===true)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"FUTURE_WINDOW_BETA"};

  if(receipt.outcomeSelectedBenchmark===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_BENCHMARK"};

  if(receipt.outcomeSelectedFactorModel===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_FACTOR_MODEL"};

  return {status:"VALID",eligible:true};
}

export function validateRegimeReceipt({
  receipt,
  predictorFreezeAt
}={}){
  if(!receipt||receipt.verified!==true)
    return {status:"UNKNOWN",reason:"REGIME_RECEIPT_UNVERIFIED"};

  if(receipt.performanceUsedToDefine===true)
    return {status:"PROHIBITED",reason:"POST_HOC_REGIME_MINING"};

  const known=str(receipt.knownAt);
  const freeze=str(predictorFreezeAt);
  if(!known||!freeze)
    return {status:"UNKNOWN",reason:"REGIME_CLOCK_INCOMPLETE"};
  if(known>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"REGIME_KNOWN_AFTER_FREEZE"};

  return {status:"VALID",exAnte:true};
}

export function summarizeMarketReplication(rows=[]){
  const valid=(rows||[]).filter(r=>r&&r.symbol&&r.marketDate);
  const sectors=uniq(valid.map(r=>r.sectorId));
  const marketDates=uniq(valid.map(r=>r.marketDate));
  const sectorDates=uniq(valid.map(r=>`${r.marketDate}|${r.sectorId||"UNKNOWN"}`));
  const episodes=uniq(valid.map(r=>r.independentMarketEpisodeId));
  return {
    status:"VALID",
    stockObservationCount:valid.length,
    uniqueSymbolCount:uniq(valid.map(r=>r.symbol)).length,
    uniqueStructuralRootCount:uniq(valid.map(r=>r.structuralRootId)).length,
    uniqueSectorCount:sectors.length,
    sectorDateClusterCount:sectorDates.length,
    marketDateClusterCount:marketDates.length,
    independentMarketEpisodeCount:episodes.length,
    manySectorsEqualIndependentReplication:false
  };
}

export function classifyCrossSectorReplication({
  summary,
  marketContextMatched,
  factorContextReady,
  sectorContextReady,
  independentDatesReady
}={}){
  if(!summary||summary.status!=="VALID")
    return {status:"Q6_NOT_EVALUABLE"};

  if(summary.marketDateClusterCount===1&&summary.uniqueSectorCount>1)
    return {
      status:"CROSS_SECTOR_SINGLE_MARKET_SHOCK",
      readinessStage:"M1_MARKET_DATE_CLUSTERED",
      genericCrossSectorClaimAllowed:false
    };

  if(marketContextMatched!==true)
    return {status:"Q6_NOT_EVALUABLE",readinessStage:"M1_MARKET_DATE_CLUSTERED"};

  if(factorContextReady!==true)
    return {status:"Q6_NOT_EVALUABLE",readinessStage:"M2_PRE_SIGNAL_MARKET_CONTEXT_MATCHED"};

  if(sectorContextReady!==true)
    return {status:"Q6_NOT_EVALUABLE",readinessStage:"M3_D19_BETA_FACTOR_CONTEXT_READY"};

  if(independentDatesReady!==true)
    return {status:"Q4_PATTERN_WITHIN_MARKET_DATE_INCREMENT",readinessStage:"M4_MARKET_AND_SECTOR_RESIDUAL_DESIGN_FROZEN"};

  return {status:"Q5_MULTI_DATE_CROSS_SECTOR_PATTERN_CANDIDATE",readinessStage:"M5_INDEPENDENT_MARKET_DATE_REPLICATION_READY"};
}

export function classifyMarketSelfInclusion({
  candidateIncludedInMarketReturn,
  candidateIncludedInMarketBreadth,
  leaveOneOutMarketVerified
}={}){
  if((candidateIncludedInMarketReturn===true||candidateIncludedInMarketBreadth===true)&&leaveOneOutMarketVerified!==true){
    return {
      status:"MARKET_SELF_INCLUSION_UNRESOLVED",
      independentConfirmationAllowed:false
    };
  }
  return {status:"MARKET_SELF_INCLUSION_CONTROLLED",independentConfirmationAllowed:false};
}

export function classifyMarketFactorSupport({
  sizeLiquidityOverlap,
  sectorContextOverlap,
  betaExposureOverlap,
  marketContextOverlap,
  regimeOverlap,
  opportunityGeometryOverlap
}={}){
  const checks={sizeLiquidityOverlap,sectorContextOverlap,betaExposureOverlap,marketContextOverlap,regimeOverlap,opportunityGeometryOverlap};
  if(Object.values(checks).some(v=>v===false))
    return {status:"MARKET_FACTOR_EXTRAPOLATION_PROHIBITED",checks};
  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};
  return {status:"COMMON_SUPPORT_VALID",checks};
}

export function buildPredictorManifest({
  marketBenchmarkId,
  factorModelId,
  betaEstimateId,
  predictorFreezeAt,
  futureBenchmarkReturn,
  futureFactorReturn,
  futureResidualReturn
}={}){
  if(!str(marketBenchmarkId)||!str(factorModelId)||!str(betaEstimateId)||!str(predictorFreezeAt))
    return {status:"UNKNOWN",reason:"MANIFEST_IDENTITY_INCOMPLETE"};

  const futureSupplied=[futureBenchmarkReturn,futureFactorReturn,futureResidualReturn].some(x=>x!==undefined);
  return {
    status:"VALID",
    marketBenchmarkId:str(marketBenchmarkId),
    factorModelId:str(factorModelId),
    betaEstimateId:str(betaEstimateId),
    predictorFreezeAt:str(predictorFreezeAt),
    outcomeJoinAllowed:false,
    futureOutcomeStored:false,
    suppliedFutureOutcomeIgnored:futureSupplied
  };
}
