// Execution Alpha research-only diagnostics v0.1.
// Pure coverage/accounting helpers. No Worker import, network, storage, signal, or decision impact.

export const EXECUTION_ALPHA_RESEARCH_VERSION="EXECUTION_ALPHA_COVERAGE_V0_1";
export const RESEARCH_ONLY=true;
export const DECISION_IMPACT=false;

const STATES=new Set([
  "BUY_OBSERVED_COMPLETE_COVERAGE",
  "NO_BUY_OBSERVED_COMPLETE_COVERAGE",
  "UNKNOWN_RECORDER_INCOMPLETE",
  "UNKNOWN_MONITOR_GAP",
  "UNKNOWN_SIGNAL_PERSISTENCE",
  "UNKNOWN_SOURCE_STALE",
  "NOT_YET_MATURE"
]);

function finite(x){
  if(x===null||x===undefined||x==="") return null;
  const n=Number(x);
  return Number.isFinite(n)?n:null;
}

function mean(xs){
  const a=xs.map(finite).filter(x=>x!==null);
  return a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
}

export function classifyExecutionPlanState({
  recorderComplete,
  monitorComplete,
  signalPersistenceKnown,
  sourceFresh,
  mature=true,
  buyObserved
}={}){
  if(mature!==true) return "NOT_YET_MATURE";
  if(sourceFresh!==true) return sourceFresh===false?"UNKNOWN_SOURCE_STALE":"UNKNOWN_SOURCE_STALE";
  if(recorderComplete!==true) return "UNKNOWN_RECORDER_INCOMPLETE";
  if(monitorComplete!==true) return "UNKNOWN_MONITOR_GAP";
  if(signalPersistenceKnown!==true) return "UNKNOWN_SIGNAL_PERSISTENCE";
  if(buyObserved===true) return "BUY_OBSERVED_COMPLETE_COVERAGE";
  if(buyObserved===false) return "NO_BUY_OBSERVED_COMPLETE_COVERAGE";
  return "UNKNOWN_SIGNAL_PERSISTENCE";
}

export function buildExecutionAlphaAccounting(plans=[]){
  const rows=(Array.isArray(plans)?plans:[]).map(x=>{
    const state=STATES.has(String(x?.state||""))
      ?String(x.state)
      :classifyExecutionPlanState(x||{});
    return {...x,state};
  });
  const counts=Object.fromEntries([...STATES].map(s=>[s,0]));
  for(const x of rows) counts[x.state]=(counts[x.state]||0)+1;
  const selectedPlans=rows.length;
  const buyObservedPlans=counts.BUY_OBSERVED_COMPLETE_COVERAGE;
  const noBuyObservedPlans=counts.NO_BUY_OBSERVED_COMPLETE_COVERAGE;
  const completeCoveragePlans=buyObservedPlans+noBuyObservedPlans;
  const unknownPlans=selectedPlans-completeCoveragePlans-counts.NOT_YET_MATURE;
  return {
    selectedPlans,
    maturePlans:selectedPlans-counts.NOT_YET_MATURE,
    completeCoveragePlans,
    buyObservedPlans,
    noBuyObservedPlans,
    unknownPlans,
    notYetMaturePlans:counts.NOT_YET_MATURE,
    buyTriggerRateCompleteCoverageOnly:completeCoveragePlans?buyObservedPlans/completeCoveragePlans:null,
    unknownRateAmongMature:selectedPlans-counts.NOT_YET_MATURE
      ?unknownPlans/(selectedPlans-counts.NOT_YET_MATURE):null,
    counts,
    rows,
    researchOnly:true,
    decisionImpact:false
  };
}

export function buildExecutionAlphaComponents(plans=[]){
  const accounting=buildExecutionAlphaAccounting(plans);
  const buy=accounting.rows.filter(x=>x.state==="BUY_OBSERVED_COMPLETE_COVERAGE");
  const noBuy=accounting.rows.filter(x=>x.state==="NO_BUY_OBSERVED_COMPLETE_COVERAGE");

  const buyEntryImprovement=buy.map(x=>{
    const ref=finite(x.benchmarkPrice),entry=finite(x.firstBuyPrice);
    return ref!==null&&entry!==null&&ref>0?(ref-entry)/ref:null;
  });

  const buyPostEntryD5=buy.map(x=>finite(x.postEntryD5Return));
  const noBuyBenchmarkD5=noBuy.map(x=>finite(x.benchmarkD5Return));
  const noBuyMfe=noBuy.map(x=>finite(x.benchmarkMfe));
  const noBuyMae=noBuy.map(x=>finite(x.benchmarkMae));
  const idleSessions=accounting.rows.map(x=>finite(x.idleSessions));

  return {
    accounting,
    participation:{
      completeCoverageBuyTriggerRate:accounting.buyTriggerRateCompleteCoverageOnly,
      completeCoveragePlans:accounting.completeCoveragePlans
    },
    conditionalBuyEntry:{
      observedBuyCount:buy.length,
      meanEntryPriceImprovement:mean(buyEntryImprovement),
      meanPostEntryD5Return:mean(buyPostEntryD5)
    },
    completeNoBuyOpportunityCost:{
      observedNoBuyCount:noBuy.length,
      meanBenchmarkD5Return:mean(noBuyBenchmarkD5),
      meanBenchmarkMfe:mean(noBuyMfe),
      meanBenchmarkMae:mean(noBuyMae)
    },
    capitalIdle:{
      meanIdleSessions:mean(idleSessions)
    },
    interpretationGuard:"Do not combine these components into one optimized score. Missing/incomplete plans remain UNKNOWN and cannot be NO_BUY.",
    researchOnly:true,
    decisionImpact:false
  };
}

export function compareExecutionPolicyToBenchmark(plans=[]){
  const components=buildExecutionAlphaComponents(plans);
  const a=components.accounting;
  return {
    status:a.completeCoveragePlans>0?"DESCRIPTIVE_ONLY":"DATA_QUALITY_BLOCKED",
    components,
    unconditionalExecutionAlpha:null,
    reason:"No composite policy-value estimator is authorized in v0.1; participation, conditional entry improvement, BUY path, NO-BUY opportunity cost and idle capital remain separate.",
    researchOnly:true,
    decisionImpact:false
  };
}



// Taiwan cash-equity plan quantity can imply a different execution venue/mechanism.
// A non-1,000-share-multiple quantity is mixed unless the whole quantity is below 1,000.
export function inferTaiwanLotType(intendedShares){
  const q=finite(intendedShares);
  if(q===null||q<=0||!Number.isInteger(q)) return "UNKNOWN";
  if(q<1000) return "ODD_LOT";
  if(q%1000===0) return "REGULAR_LOT";
  return "MIXED_LOT";
}


export function splitTaiwanExecutionLegs(intendedShares){
  const q=finite(intendedShares);
  if(q===null||q<=0||!Number.isInteger(q)){
    return {status:"BLOCKED",reason:"INTENDED_SHARES_INVALID",researchOnly:true,decisionImpact:false};
  }
  const regularShares=Math.floor(q/1000)*1000;
  const oddLotShares=q-regularShares;
  return {
    status:"VALID",
    intendedShares:q,
    regularShares,
    oddLotShares,
    requiresRegularLeg:regularShares>0,
    requiresOddLotLeg:oddLotShares>0,
    lotType:inferTaiwanLotType(q),
    legCount:(regularShares>0?1:0)+(oddLotShares>0?1:0),
    researchOnly:true,
    decisionImpact:false
  };
}

// v0.2 benchmark semantics: benchmark feasibility must match the actual Taiwan market mechanism.
// This remains descriptive research accounting; it does not choose an order type or change BUY logic.
export function classifyExecutionBenchmarkEligibility({
  benchmarkType,
  lotType="UNKNOWN",
  benchmarkPrice,
  observedAt=null,
  quoteFresh=null,
  marketMechanism="UNKNOWN"
}={}){
  const type=String(benchmarkType||"");
  const lot=String(lotType||"UNKNOWN");
  const price=finite(benchmarkPrice);
  const mechanism=String(marketMechanism||"UNKNOWN");

  if(price===null||!(price>0)){
    return {eligible:false,status:"BLOCKED",reason:"BENCHMARK_PRICE_MISSING",researchOnly:true,decisionImpact:false};
  }
  if(type==="SELECTION_CLOSE_REFERENCE"){
    return {
      eligible:false,status:"REFERENCE_ONLY",
      reason:"SELECTION_CLOSE_IS_DECISION_REFERENCE_NOT_ASSUMED_EXECUTABLE",
      benchmarkPrice:price,researchOnly:true,decisionImpact:false
    };
  }
  if(type==="NEXT_SESSION_REGULAR_OPEN"){
    if(lot==="MIXED_LOT"){
      return {
        eligible:false,status:"MECHANISM_MISMATCH",
        reason:"MIXED_LOT_REQUIRES_SEPARATE_REGULAR_AND_ODD_LOT_LEGS",
        benchmarkPrice:price,researchOnly:true,decisionImpact:false
      };
    }
    if(lot==="ODD_LOT"){
      return {
        eligible:false,status:"MECHANISM_MISMATCH",
        reason:"REGULAR_OPEN_NOT_EXECUTABLE_ODD_LOT_BENCHMARK",
        benchmarkPrice:price,researchOnly:true,decisionImpact:false
      };
    }
    return {
      eligible:lot==="REGULAR_LOT",
      status:lot==="REGULAR_LOT"?"ELIGIBLE":"BLOCKED",
      reason:lot==="REGULAR_LOT"?null:"LOT_TYPE_UNKNOWN",
      benchmarkPrice:price,researchOnly:true,decisionImpact:false
    };
  }
  if(type==="FIRST_ELIGIBLE_OBSERVED_QUOTE"){
    if(lot==="MIXED_LOT"){
      return {eligible:false,status:"MECHANISM_MISMATCH",reason:"MIXED_LOT_REQUIRES_SEPARATE_REGULAR_AND_ODD_LOT_LEGS",benchmarkPrice:price,researchOnly:true,decisionImpact:false};
    }
    if(!observedAt){
      return {eligible:false,status:"BLOCKED",reason:"OBSERVED_AT_MISSING",benchmarkPrice:price,researchOnly:true,decisionImpact:false};
    }
    if(quoteFresh!==true){
      return {eligible:false,status:"BLOCKED",reason:"QUOTE_FRESHNESS_UNPROVEN",benchmarkPrice:price,researchOnly:true,decisionImpact:false};
    }
    if(lot==="ODD_LOT" && mechanism!=="ODD_LOT_INTRADAY"){
      return {eligible:false,status:"MECHANISM_MISMATCH",reason:"ODD_LOT_QUOTE_MECHANISM_MISMATCH",benchmarkPrice:price,researchOnly:true,decisionImpact:false};
    }
    if(lot==="REGULAR_LOT" && !["REGULAR_CONTINUOUS","REGULAR_OPEN_AUCTION"].includes(mechanism)){
      return {eligible:false,status:"MECHANISM_MISMATCH",reason:"REGULAR_LOT_QUOTE_MECHANISM_MISMATCH",benchmarkPrice:price,researchOnly:true,decisionImpact:false};
    }
    if(lot==="UNKNOWN"){
      return {eligible:false,status:"BLOCKED",reason:"LOT_TYPE_UNKNOWN",benchmarkPrice:price,researchOnly:true,decisionImpact:false};
    }
    return {eligible:true,status:"ELIGIBLE",reason:null,benchmarkPrice:price,observedAt,lotType:lot,marketMechanism:mechanism,researchOnly:true,decisionImpact:false};
  }
  return {eligible:false,status:"BLOCKED",reason:"BENCHMARK_TYPE_UNKNOWN",benchmarkPrice:price,researchOnly:true,decisionImpact:false};
}

// Full implementation-shortfall-style decomposition for a single intended BUY.
// It is emitted only when the intended denominator and complete fill/non-fill state are known.
// Positive cost means worse than immediate paper execution at the frozen decision benchmark.
export function decomposeBuyImplementationShortfall({
  intendedShares,
  decisionPrice,
  horizonPrice,
  fills=[],
  explicitCostNTD=0,
  coverageComplete=false,
  fillEvidenceQuality="UNKNOWN"
}={}){
  const q=finite(intendedShares),p0=finite(decisionPrice),ph=finite(horizonPrice),fees=finite(explicitCostNTD);
  const evidence=String(fillEvidenceQuality||"UNKNOWN");
  if(coverageComplete!==true){
    return {status:"DATA_QUALITY_BLOCKED",reason:"EXECUTION_COVERAGE_INCOMPLETE",researchOnly:true,decisionImpact:false};
  }
  if(!["ACTUAL","MODELED"].includes(evidence)){
    return {status:"DATA_QUALITY_BLOCKED",reason:"FILL_EVIDENCE_QUALITY_UNSUPPORTED",fillEvidenceQuality:evidence,researchOnly:true,decisionImpact:false};
  }
  if(!(q>0)||!(p0>0)||!(ph>0)||fees===null||fees<0){
    return {status:"DATA_QUALITY_BLOCKED",reason:"IMPLEMENTATION_SHORTFALL_INPUT_INVALID",researchOnly:true,decisionImpact:false};
  }
  const clean=(Array.isArray(fills)?fills:[]).map(x=>({
    shares:finite(x?.shares),price:finite(x?.price)
  }));
  if(clean.some(x=>!(x.shares>0)||!(x.price>0))){
    return {status:"DATA_QUALITY_BLOCKED",reason:"FILL_INPUT_INVALID",researchOnly:true,decisionImpact:false};
  }
  const filledShares=clean.reduce((s,x)=>s+x.shares,0);
  if(filledShares>q+1e-9){
    return {status:"DATA_QUALITY_BLOCKED",reason:"FILLED_SHARES_EXCEED_INTENDED",researchOnly:true,decisionImpact:false};
  }
  const unfilledShares=q-filledShares;
  const executionPriceCostNTD=clean.reduce((s,x)=>s+(x.price-p0)*x.shares,0);
  const missedOpportunityCostNTD=(ph-p0)*unfilledShares;
  const totalShortfallNTD=executionPriceCostNTD+missedOpportunityCostNTD+fees;
  const decisionNotionalNTD=p0*q;
  return {
    status:"VALID",
    intendedShares:q,
    filledShares,
    unfilledShares,
    fillRate:filledShares/q,
    decisionPrice:p0,
    horizonPrice:ph,
    decisionNotionalNTD,
    executionPriceCostNTD,
    missedOpportunityCostNTD,
    explicitCostNTD:fees,
    fillEvidenceQuality:evidence,
    totalShortfallNTD,
    totalShortfallBps:decisionNotionalNTD>0?totalShortfallNTD/decisionNotionalNTD*10000:null,
    interpretation:"Positive shortfall is cost versus the frozen paper benchmark. Unfilled shares remain in the denominator and can create positive or negative opportunity cost. FORMAL signal market price is not an ACTUAL fill.",
    researchOnly:true,
    decisionImpact:false
  };
}
