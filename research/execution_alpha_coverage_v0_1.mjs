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
