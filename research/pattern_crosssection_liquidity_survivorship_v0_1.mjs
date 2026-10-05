// D01 DL-039 cross-sectional liquidity/size/survivorship firewall v0.1
// Research-only / outcome-blind.

function str(x){return String(x??"");}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function bool(x){return x===true;}

export function validateTargetPopulation({
  targetPopulationType,
  universeReceipt,
  formalEligibilityReceipt
}={}){
  const t=str(targetPopulationType);
  if(!["POINT_IN_TIME_MARKET_UNIVERSE","FORMAL_ELIGIBLE_UNIVERSE"].includes(t))
    return {status:"UNKNOWN",reason:"TARGET_POPULATION_UNFROZEN"};

  if(!universeReceipt||universeReceipt.pointInTimeVerified!==true)
    return {status:"DATA_BLOCKED",reason:"POINT_IN_TIME_UNIVERSE_UNVERIFIED"};

  if(universeReceipt.currentOnly===true)
    return {status:"PROHIBITED",reason:"CURRENT_SURVIVORS_USED_FOR_HISTORY"};

  if(universeReceipt.futureDelistingInfoExposed===true)
    return {status:"PROHIBITED",reason:"FUTURE_DELISTING_LEAKAGE"};

  if(t==="FORMAL_ELIGIBLE_UNIVERSE"){
    if(!formalEligibilityReceipt||formalEligibilityReceipt.verified!==true)
      return {status:"DATA_BLOCKED",reason:"FORMAL_ELIGIBILITY_RECEIPT_UNVERIFIED"};
    return {
      status:"VALID",
      claimScope:"FORMAL_ELIGIBLE_UNIVERSE_ONLY",
      marketWideClaimAllowed:false
    };
  }

  return {
    status:"VALID",
    claimScope:"POINT_IN_TIME_MARKET_UNIVERSE",
    marketWideClaimAllowed:true
  };
}

export function classifyHistoryStage({
  targetUniverseEligible,
  listingAgeEligibleSessions,
  detectorMinimumHistorySessions,
  expectedHistoryComplete,
  sourceHistoryComplete
}={}){
  if(targetUniverseEligible!==true)
    return {stage:"NOT_IN_TARGET_UNIVERSE"};

  if(!Number.isInteger(listingAgeEligibleSessions)||listingAgeEligibleSessions<0||
     !Number.isInteger(detectorMinimumHistorySessions)||detectorMinimumHistorySessions<0)
    return {stage:"HISTORY_UNKNOWN",reason:"HISTORY_CLOCK_INVALID"};

  if(listingAgeEligibleSessions<detectorMinimumHistorySessions){
    if(expectedHistoryComplete!==true)
      return {stage:"HISTORY_DATA_BLOCKED",reason:"AGE_AWARE_EXPECTED_HISTORY_INCOMPLETE"};
    return {
      stage:"HISTORY_TOO_SHORT_BY_DESIGN",
      dataMissing:false,
      negativePattern:false
    };
  }

  if(expectedHistoryComplete!==true||sourceHistoryComplete!==true)
    return {stage:"HISTORY_DATA_BLOCKED",reason:"EXPECTED_HISTORY_MISSING"};

  return {stage:"HISTORY_READY"};
}

export function classifyDetectorStage({
  historyStage,
  detectorExecuted,
  dataBlocked,
  structureEmitted
}={}){
  if(historyStage!=="HISTORY_READY")
    return {stage:"DETECTOR_NOT_EVALUABLE",reason:historyStage};

  if(dataBlocked===true)
    return {stage:"DETECTOR_DATA_BLOCKED"};

  if(detectorExecuted!==true)
    return {stage:"DETECTOR_DATA_BLOCKED",reason:"DETECTOR_NOT_EXECUTED"};

  if(structureEmitted===true)
    return {stage:"STRUCTURE_EMITTED"};

  return {stage:"DETECTOR_NO_STRUCTURE"};
}

export function classifyOpportunityStage({
  detectorStage,
  opportunityValid,
  opportunityDataBlocked
}={}){
  if(detectorStage!=="STRUCTURE_EMITTED")
    return {stage:"OPPORTUNITY_NOT_APPLICABLE",reason:detectorStage};

  if(opportunityDataBlocked===true)
    return {stage:"OPPORTUNITY_DATA_BLOCKED"};

  if(opportunityValid===true)
    return {stage:"OPPORTUNITY_READY"};

  return {
    stage:"NO_VALID_OPPORTUNITY",
    failedPattern:false
  };
}

export function validatePointInTimeContextReceipt({
  receipt,
  predictorFreezeAt
}={}){
  if(!receipt||receipt.verified!==true)
    return {status:"UNKNOWN",reason:"CONTEXT_RECEIPT_UNVERIFIED"};

  const calc=str(receipt.calculatedAt);
  const freeze=str(predictorFreezeAt);
  if(!calc||!freeze)
    return {status:"UNKNOWN",reason:"CONTEXT_CLOCK_INCOMPLETE"};

  if(calc>freeze)
    return {status:"POST_HOC_FILTER_NOT_ELIGIBLE",reason:"CONTEXT_KNOWN_AFTER_FREEZE"};

  if(receipt.usesCurrentValueForHistoricalDate===true)
    return {status:"PROHIBITED",reason:"CURRENT_VALUE_BACKFILLED_HISTORICALLY"};

  return {status:"VALID"};
}

export function summarizeAttrition(rows=[]){
  if(!Array.isArray(rows)||!rows.length)
    return {status:"UNKNOWN",reason:"ROWS_EMPTY"};

  const target=rows.filter(r=>r?.targetUniverseEligible===true);
  const count=(pred)=>target.filter(pred).length;

  const out={
    status:"VALID",
    targetEligibleCount:target.length,
    formalEligibleCount:count(r=>r.formalEligible===true),
    historyReadyCount:count(r=>r.historyStage==="HISTORY_READY"),
    historyTooShortCount:count(r=>r.historyStage==="HISTORY_TOO_SHORT_BY_DESIGN"),
    historyBlockedCount:count(r=>r.historyStage==="HISTORY_DATA_BLOCKED"),
    detectorEvaluableCount:count(r=>["DETECTOR_NO_STRUCTURE","STRUCTURE_EMITTED"].includes(r.detectorStage)),
    noStructureCount:count(r=>r.detectorStage==="DETECTOR_NO_STRUCTURE"),
    structureEmittedCount:count(r=>r.detectorStage==="STRUCTURE_EMITTED"),
    opportunityReadyCount:count(r=>r.opportunityStage==="OPPORTUNITY_READY"),
    noOpportunityCount:count(r=>r.opportunityStage==="NO_VALID_OPPORTUNITY"),
    opportunityBlockedCount:count(r=>r.opportunityStage==="OPPORTUNITY_DATA_BLOCKED"),
    economicEvaluableCount:count(r=>r.economicEvaluable===true),
    tradabilityEvaluableCount:count(r=>r.tradabilityEvaluable===true),
    silentDroppingAllowed:false
  };

  out.historyReadyRate=out.targetEligibleCount?out.historyReadyCount/out.targetEligibleCount:null;
  out.detectorEmissionRate=out.detectorEvaluableCount?out.structureEmittedCount/out.detectorEvaluableCount:null;
  out.opportunityRate=out.structureEmittedCount?out.opportunityReadyCount/out.structureEmittedCount:null;
  out.tradabilityRate=out.opportunityReadyCount?out.tradabilityEvaluableCount/out.opportunityReadyCount:null;
  return out;
}

export function classifyCrossSectionSupport({
  sizeOverlap,
  liquidityOverlap,
  listingAgeOverlap,
  priceTickOverlap,
  marketOverlap,
  regimeOverlap
}={}){
  const checks={sizeOverlap,liquidityOverlap,listingAgeOverlap,priceTickOverlap,marketOverlap,regimeOverlap};
  if(Object.values(checks).some(v=>v===false))
    return {status:"CROSS_SECTIONAL_EXTRAPOLATION_PROHIBITED",checks};
  if(Object.values(checks).some(v=>v!==true))
    return {status:"UNKNOWN",checks};
  return {status:"COMMON_SUPPORT_VALID",checks};
}

export function summarizeSymbolConcentration(rows=[]){
  const eligible=(rows||[]).filter(r=>r&&r.symbol&&r.opportunityReady===true);
  if(!eligible.length)
    return {status:"UNKNOWN",reason:"NO_OPPORTUNITIES"};

  const counts=new Map();
  for(const r of eligible) counts.set(String(r.symbol),(counts.get(String(r.symbol))||0)+1);
  const vals=[...counts.values()].sort((a,b)=>b-a);
  const total=vals.reduce((a,b)=>a+b,0);
  const top1=vals[0]/total;
  const top5=vals.slice(0,5).reduce((a,b)=>a+b,0)/total;
  const hhi=vals.reduce((s,n)=>s+(n/total)**2,0);

  return {
    status:"VALID",
    uniqueSymbolCount:counts.size,
    opportunityCount:total,
    top1SymbolShare:top1,
    top5SymbolShare:top5,
    symbolHHI:hhi,
    broadGeneralizationAssigned:false
  };
}

export function classifyEvaluationExit({
  delistedDuringEvaluation,
  suspended,
  priceLimitConstrained,
  executionContextKnown
}={}){
  if(delistedDuringEvaluation===true)
    return {state:"DELISTED_DURING_EVALUATION",silentDropAllowed:false};
  if(suspended===true)
    return {state:"SUSPENDED",silentDropAllowed:false};
  if(priceLimitConstrained===true)
    return {state:"PRICE_LIMIT_CONSTRAINED",silentDropAllowed:false};
  if(executionContextKnown!==true)
    return {state:"EXECUTION_CONTEXT_UNKNOWN",silentDropAllowed:false};
  return {state:"NORMAL_TRADING",silentDropAllowed:false};
}
