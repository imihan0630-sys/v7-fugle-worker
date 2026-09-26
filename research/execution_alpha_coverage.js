// Research-only Execution Alpha diagnostics. No Worker/runtime import.
export function classifyExecutionPlan(row={}) {
  if(row.mature===false) return "NOT_YET_MATURE";
  if(row.sourceFresh===false) return "UNKNOWN_SOURCE_STALE";
  if(row.signalPersistenceComplete===false) return "UNKNOWN_SIGNAL_PERSISTENCE";
  if(row.monitorComplete===false) return "UNKNOWN_MONITOR_GAP";
  if(row.recorderComplete!==true) return "UNKNOWN_RECORDER_INCOMPLETE";
  if(row.buyObserved===true) return "BUY_OBSERVED_COMPLETE_COVERAGE";
  return "NO_BUY_OBSERVED_COMPLETE_COVERAGE";
}
const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
const finite=x=>Number.isFinite(Number(x));
export function executionAlphaDiagnostics(rows=[],costBps=0) {
  const classified=rows.map(r=>({...r,state:classifyExecutionPlan(r)}));
  const counts={};
  for(const r of classified) counts[r.state]=(counts[r.state]||0)+1;
  const complete=classified.filter(r=>["BUY_OBSERVED_COMPLETE_COVERAGE","NO_BUY_OBSERVED_COMPLETE_COVERAGE"].includes(r.state));
  const buys=complete.filter(r=>r.state==="BUY_OBSERVED_COMPLETE_COVERAGE");
  const noBuys=complete.filter(r=>r.state==="NO_BUY_OBSERVED_COMPLETE_COVERAGE");
  const improvements=buys.filter(r=>finite(r.formalClose)&&finite(r.buyPrice)&&Number(r.formalClose)>0)
    .map(r=>(Number(r.formalClose)-Number(r.buyPrice))/Number(r.formalClose)*100-costBps/100);
  const noBuyPaths=noBuys.filter(r=>finite(r.benchmarkReturnPct)).map(r=>Number(r.benchmarkReturnPct));
  const missed=noBuyPaths.filter(x=>x>costBps/100), avoided=noBuyPaths.filter(x=>x<-(costBps/100));
  const unknown=classified.length-complete.length;
  return {
    selectedPlans:classified.length,
    completeCoveragePlans:complete.length,
    buyObservedPlans:buys.length,
    noBuyObservedPlans:noBuys.length,
    unknownPlans:unknown,
    unknownRatePct:classified.length?unknown/classified.length*100:null,
    buyTriggerRateCompleteCoverageOnlyPct:complete.length?buys.length/complete.length*100:null,
    conditionalEntryPriceImprovementPct:mean(improvements),
    noBuyMissedUpsideCount:missed.length,
    noBuyAvoidanceBenefitCount:avoided.length,
    noBuyBenchmarkReturnPct:mean(noBuyPaths),
    stateCounts:counts,
    governance:"Research-only; missing recorder/signal evidence never becomes NO_BUY."
  };
}
export function stratifyExecution(rows=[],field="strategy",costBps=0) {
  const groups=new Map();
  for(const r of rows){ const k=String(r?.[field]??"UNKNOWN"); if(!groups.has(k))groups.set(k,[]); groups.get(k).push(r); }
  return Object.fromEntries([...groups].map(([k,v])=>[k,executionAlphaDiagnostics(v,costBps)]));
}
