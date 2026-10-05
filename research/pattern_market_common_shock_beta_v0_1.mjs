// D01 DL-041 market common-shock / beta firewall v0.1
// Research-only / outcome-blind / owner-consumer only.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function uniq(xs=[]){return [...new Set((xs||[]).map(String).filter(Boolean))].sort();}

export function validateMarketBetaReceipt({receipt,predictorFreezeAt}={}){
  const freeze=str(predictorFreezeAt);
  if(!receipt) return {status:"MARKET_CONTEXT_UNKNOWN",reason:"RECEIPT_MISSING"};

  const benchmarkId=str(receipt.benchmarkId);
  const benchmarkVersion=str(receipt.benchmarkVersion);
  const benchmarkKnownAt=str(receipt.benchmarkKnownAt);
  const betaModelId=str(receipt.betaModelId);
  const betaModelVersion=str(receipt.betaModelVersion);
  const betaKnownAt=str(receipt.betaEstimateKnownAt);

  if(!freeze||!benchmarkId||!benchmarkVersion||!benchmarkKnownAt||!betaModelId||!betaModelVersion||!betaKnownAt)
    return {status:"MARKET_CONTEXT_UNKNOWN",reason:"RECEIPT_IDENTITY_INCOMPLETE"};

  if(benchmarkKnownAt>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"BENCHMARK_NOT_KNOWN_AT_FREEZE"};

  if(betaKnownAt>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"BETA_NOT_KNOWN_AT_FREEZE"};

  if(receipt.betaState==="UNKNOWN"||!finite(receipt.betaEstimate))
    return {status:"BETA_CONTEXT_UNKNOWN",reason:"BETA_ESTIMATE_UNKNOWN"};

  if(!finite(receipt.betaObservationCount)||receipt.betaObservationCount<=0)
    return {status:"BETA_CONTEXT_UNKNOWN",reason:"BETA_OBSERVATION_COUNT_INVALID"};

  return {
    status:"MARKET_CONTEXT_KNOWN",
    benchmarkId,
    benchmarkVersion,
    betaModelId,
    betaModelVersion,
    betaEstimate:receipt.betaEstimate,
    betaObservationCount:receipt.betaObservationCount,
    candidateIncludedInBenchmark:receipt.candidateIncludedInBenchmark===true,
    candidateWeightInBenchmark:finite(receipt.candidateWeightInBenchmark)?receipt.candidateWeightInBenchmark:null,
    exCandidateBenchmarkState:str(receipt.exCandidateBenchmarkState)||"UNKNOWN",
    independentConfirmationAllowed:false
  };
}

export function classifyCandidateSelfInclusion({
  candidateIncludedInBenchmark,
  exCandidateBenchmarkState
}={}){
  if(candidateIncludedInBenchmark===true){
    if(exCandidateBenchmarkState==="AVAILABLE")
      return {
        status:"SELF_INCLUSION_RESOLVED_BY_EX_CANDIDATE_CONTEXT",
        independentConfirmationAllowed:false,
        contextOnly:true
      };
    return {
      status:"SELF_INCLUSION_UNRESOLVED",
      independentConfirmationAllowed:false,
      contextOnly:true
    };
  }
  return {
    status:"NO_DIRECT_CANDIDATE_SELF_INCLUSION",
    independentConfirmationAllowed:false,
    contextOnly:true
  };
}

export function validateBetaPolicyFreeze({
  betaPolicyFrozenBeforeOutcome,
  benchmarkPolicyFrozenBeforeOutcome,
  selectedModelAfterOutcome,
  selectedWindowAfterOutcome,
  selectedBenchmarkAfterOutcome
}={}){
  if(selectedModelAfterOutcome===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_BETA_MODEL"};
  if(selectedWindowAfterOutcome===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_BETA_WINDOW"};
  if(selectedBenchmarkAfterOutcome===true)
    return {status:"PROHIBITED",reason:"OUTCOME_SELECTED_BENCHMARK"};
  if(betaPolicyFrozenBeforeOutcome!==true)
    return {status:"UNKNOWN",reason:"BETA_POLICY_UNFROZEN"};
  if(benchmarkPolicyFrozenBeforeOutcome!==true)
    return {status:"UNKNOWN",reason:"BENCHMARK_POLICY_UNFROZEN"};
  return {status:"VALID"};
}

export function buildReplicationDiagnostics(rows=[]){
  const valid=(rows||[]).filter(Boolean);
  const pair=(a,b)=>`${str(a)}::${str(b)}`;
  const commonShockIds=uniq(valid.map(x=>x.commonShockId).filter(Boolean));

  const stockObservationN=valid.length;
  const uniqueSymbolN=uniq(valid.map(x=>x.symbol)).length;
  const structuralRootN=uniq(valid.map(x=>x.structuralRootId)).length;
  const uniqueSectorN=uniq(valid.map(x=>x.sectorId)).length;
  const sectorDateClusterN=uniq(valid.map(x=>pair(x.sectorId,x.marketDate))).length;
  const marketDateClusterN=uniq(valid.map(x=>x.marketDate)).length;

  return {
    status:valid.length?"VALID":"UNKNOWN",
    stockObservationN,
    uniqueSymbolN,
    structuralRootN,
    uniqueSectorN,
    sectorDateClusterN,
    marketDateClusterN,
    commonShockClusterN:commonShockIds.length||null,
    crossSectorEqualsCrossMarketDate:false,
    manySectorsOneDateIsIndependentReplication:false,
    independentReplicationProxy:"MARKET_DATE_CLUSTER_N_MINIMUM_VIEW"
  };
}

export function classifyBetaCommonSupport({
  betaOverlap,
  marketRegimeOverlap,
  sectorContextOverlap,
  sizeLiquidityOverlap,
  opportunityGeometryOverlap
}={}){
  const checks={betaOverlap,marketRegimeOverlap,sectorContextOverlap,sizeLiquidityOverlap,opportunityGeometryOverlap};
  if(Object.values(checks).some(v=>v===false))
    return {status:"MARKET_BETA_EXTRAPOLATION_PROHIBITED",checks};
  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};
  return {status:"COMMON_SUPPORT_VALID",checks};
}

export function classifyClaimScope({
  marketContextKnown,
  marketExplainsRaw,
  betaExplainsRaw,
  regimeSpecific,
  residualPatternRemains,
  independentMarketDates
}={}){
  if(marketContextKnown!==true)
    return {status:"MARKET_CONTEXT_UNRESOLVED"};

  if(marketExplainsRaw===true)
    return {status:"MARKET_EXPLAINED_PATTERN"};

  if(betaExplainsRaw===true)
    return {status:"MARKET_EXPLAINED_PATTERN",reason:"BETA_EXPOSURE_EXPLANATION"};

  if(regimeSpecific===true&&residualPatternRemains===true)
    return {status:"MARKET_CONDITIONAL_PATTERN"};

  if(residualPatternRemains===true&&finite(independentMarketDates)&&independentMarketDates>=2)
    return {status:"CROSS_MARKET_DATE_PATTERN_CANDIDATE"};

  if(residualPatternRemains===true)
    return {status:"MARKET_RESIDUAL_PATTERN"};

  return {status:"NOT_EVALUABLE"};
}
