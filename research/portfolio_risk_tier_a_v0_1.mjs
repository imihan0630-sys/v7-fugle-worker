// Portfolio Risk Tier-A research prototype v0.1
// Class A / research-only / decisionImpact=false.
// No Production/Formal behavior is imported or mutated.

function num(value) {
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}
function positive(value) {
  const n=num(value);
  return n!==null && n>0 ? n : null;
}
function round(value,d=4) {
  if(!Number.isFinite(value)) return null;
  const p=10**d;
  return Math.round(value*p)/p;
}
function symbolOf(plan) {
  return String(plan?.symbol ?? plan?.code ?? "").trim();
}
function plannedEntryBounds(plan) {
  const low=positive(plan?.buyLow);
  const high=positive(plan?.buyHigh);
  const fallback=positive(plan?.formalClose);
  const a=low ?? high ?? fallback;
  const b=high ?? low ?? fallback;
  if(!(a>0) || !(b>0)) return {ok:false,reason:"ENTRY_RANGE_UNKNOWN"};
  return {ok:true,low:Math.min(a,b),high:Math.max(a,b),source:low!==null&&high!==null?"BUY_RANGE":"FALLBACK_SINGLE_PRICE"};
}
export function projectedStopRisk(plan) {
  const symbol=symbolOf(plan);
  const allocation=positive(plan?.totalAllocation);
  const stop=positive(plan?.stop);
  const entry=plannedEntryBounds(plan);
  if(!allocation) return {symbol,ok:false,reason:"TOTAL_ALLOCATION_UNKNOWN"};
  if(!stop) return {symbol,ok:false,reason:"STOP_UNKNOWN"};
  if(!entry.ok) return {symbol,ok:false,reason:entry.reason};
  if(stop>=entry.low) return {symbol,ok:false,reason:"STOP_NOT_BELOW_ENTRY_RANGE",stop,entryLow:entry.low,entryHigh:entry.high};
  const riskPctAtLow=(entry.low-stop)/entry.low;
  const riskPctAtHigh=(entry.high-stop)/entry.high;
  return {
    symbol,ok:true,allocation,stop,
    entryLow:entry.low,entryHigh:entry.high,entrySource:entry.source,
    riskPctLow:round(riskPctAtLow*100,4),
    riskPctHigh:round(riskPctAtHigh*100,4),
    riskNTDLow:round(allocation*riskPctAtLow,2),
    riskNTDHigh:round(allocation*riskPctAtHigh,2),
    semantics:"PROJECTED_PLAN_RISK_RANGE_NOT_EXECUTED_LOSS"
  };
}

export function effectiveCapitalNames(plans=[]) {
  const allocations=(plans||[]).map(p=>positive(p?.totalAllocation)).filter(Number.isFinite);
  const deployed=allocations.reduce((a,b)=>a+b,0);
  if(!(deployed>0)) return null;
  const weights=allocations.map(v=>v/deployed);
  const hhi=weights.reduce((s,w)=>s+w*w,0);
  return hhi>0?round(1/hhi,4):null;
}

export function sectorCapitalShares(plans=[],sectorBySymbol={}) {
  const rows=(plans||[]).map(plan=>({
    symbol:symbolOf(plan),
    allocation:positive(plan?.totalAllocation),
    sector:sectorBySymbol?.[symbolOf(plan)] ?? plan?.sector ?? null
  })).filter(r=>r.allocation!==null);
  const total=rows.reduce((s,r)=>s+r.allocation,0);
  if(!(total>0)) return {status:"UNKNOWN",reason:"NO_PLANNED_CAPITAL",shares:[]};
  const grouped=new Map();
  let unknown=0;
  for(const row of rows){
    const key=row.sector?String(row.sector):"UNKNOWN";
    grouped.set(key,(grouped.get(key)||0)+row.allocation);
    if(key==="UNKNOWN") unknown+=row.allocation;
  }
  const shares=[...grouped.entries()].map(([sector,allocation])=>({
    sector,allocation:round(allocation,2),sharePct:round(allocation/total*100,2)
  })).sort((a,b)=>b.sharePct-a.sharePct);
  return {
    status:unknown>0?"PARTIAL":"COMPLETE",
    totalPlannedCapital:round(total,2),
    unknownSectorCapital:round(unknown,2),
    shares
  };
}

export function classifyProjectedCashState({selectedCount,totalCapital,totalPlannedAllocation,dataStatus="COMPLETE"}={}) {
  const total=positive(totalCapital);
  const planned=Math.max(0,num(totalPlannedAllocation)||0);
  if(String(dataStatus).toUpperCase()!=="COMPLETE") {
    return {state:"DATA_OR_SIGNAL_BLOCKED",reason:"SCAN_OR_DATA_NOT_COMPLETE"};
  }
  if(!(total>0)) return {state:"UNKNOWN",reason:"TOTAL_CAPITAL_UNKNOWN"};
  if(Number(selectedCount||0)<=0) {
    return {state:"NO_ELIGIBLE_OPPORTUNITY",structuralReserveNTD:round(total,2),plannedDeploymentNTD:0};
  }
  const reserve=Math.max(0,total-planned);
  return {
    state:"PENDING_ENTRY",
    plannedDeploymentNTD:round(planned,2),
    structuralReserveNTD:round(reserve,2),
    note:"Selected plans exist, but after-market plan is not an executed position."
  };
}

function normalizeToTotal(rawWeights,total) {
  const sum=rawWeights.reduce((a,b)=>a+b,0);
  if(!(sum>0) || !(total>=0)) return rawWeights.map(()=>0);
  return rawWeights.map(w=>total*w/sum);
}
export function equalCapitalCounterfactual(plans=[],totalCapital) {
  const valid=(plans||[]).filter(p=>positive(p?.totalAllocation)!==null);
  const current=valid.reduce((s,p)=>s+positive(p.totalAllocation),0);
  const capital=positive(totalCapital);
  if(!valid.length || !(current>0) || !(capital>0)) return {status:"UNKNOWN",reason:"INSUFFICIENT_PLAN_CAPITAL"};
  const each=current/valid.length;
  return {
    status:"READY",
    samePlannedDeployment:true,
    allocations:valid.map(p=>({symbol:symbolOf(p),allocation:round(each,2)})),
    totalAllocation:round(current,2),
    note:"Research counterfactual only; ignores live fill constraints and does not change Formal capital."
  };
}

export function equalPlannedStopRiskCounterfactual(plans=[],totalCapital) {
  const valid=[];
  for(const plan of plans||[]) {
    const r=projectedStopRisk(plan);
    if(!r.ok) continue;
    const riskFrac=r.riskPctHigh/100;
    if(riskFrac>0) valid.push({plan,riskFrac});
  }
  const current=(plans||[]).reduce((s,p)=>s+(positive(p?.totalAllocation)||0),0);
  const capital=positive(totalCapital);
  if(!valid.length || !(current>0) || !(capital>0)) return {status:"UNKNOWN",reason:"INSUFFICIENT_RISK_INPUTS"};
  const inverse=valid.map(x=>1/x.riskFrac);
  const allocations=normalizeToTotal(inverse,current);
  return {
    status:valid.length===(plans||[]).length?"READY":"PARTIAL",
    samePlannedDeployment:true,
    allocations:valid.map((x,i)=>({
      symbol:symbolOf(x.plan),
      allocation:round(allocations[i],2),
      stopRiskPctHigh:round(x.riskFrac*100,4)
    })),
    totalAllocation:round(allocations.reduce((a,b)=>a+b,0),2),
    note:"Equalizes projected stop-risk approximately using buyHigh risk; no 35% cap applied because this is a diagnostic unconstrained counterfactual."
  };
}


export function cappedEqualPlannedStopRiskCounterfactual(plans=[],totalCapital,{perNameCapPct=35}={}) {
  const capital=positive(totalCapital);
  const current=(plans||[]).reduce((s,p)=>s+(positive(p?.totalAllocation)||0),0);
  const capPct=num(perNameCapPct);
  if(!(capital>0) || !(current>0) || !(capPct>0)) {
    return {status:"UNKNOWN",reason:"INSUFFICIENT_CAPITAL_OR_CAP"};
  }
  const valid=[];
  for(const plan of plans||[]) {
    const r=projectedStopRisk(plan);
    if(!r.ok) return {status:"UNKNOWN",reason:"INCOMPLETE_RISK_INPUTS",symbol:r.symbol,riskReason:r.reason};
    const riskFrac=r.riskPctHigh/100;
    if(!(riskFrac>0)) return {status:"UNKNOWN",reason:"INVALID_RISK_FRACTION",symbol:r.symbol};
    valid.push({plan,riskFrac});
  }
  if(!valid.length) return {status:"UNKNOWN",reason:"NO_VALID_PLANS"};
  const capNTD=capital*capPct/100;
  const capacity=capNTD*valid.length;
  if(current>capacity+1e-6) {
    return {status:"INFEASIBLE",reason:"CURRENT_DEPLOYMENT_EXCEEDS_CAPACITY",currentDeploymentNTD:round(current,2),capacityNTD:round(capacity,2)};
  }

  // Water-filling in projected-risk space:
  // allocation_i = min(capNTD, commonRiskBudget / riskFrac_i)
  // Choose commonRiskBudget so total allocation equals current planned deployment.
  let lo=0;
  let hi=Math.max(...valid.map(x=>x.riskFrac*capNTD),1);
  const sumAt=budget=>valid.reduce((s,x)=>s+Math.min(capNTD,budget/x.riskFrac),0);
  while(sumAt(hi)<current) hi*=2;
  for(let i=0;i<100;i++){
    const mid=(lo+hi)/2;
    if(sumAt(mid)<current) lo=mid;
    else hi=mid;
  }
  const allocations=valid.map(x=>Math.min(capNTD,hi/x.riskFrac));
  const scale=current/allocations.reduce((a,b)=>a+b,0);
  const normalized=allocations.map(v=>Math.min(capNTD,v*scale));
  // Numerical correction is only used if floating-point residue remains and spare cap exists.
  let residue=current-normalized.reduce((a,b)=>a+b,0);
  if(Math.abs(residue)>1e-6){
    for(let i=0;i<normalized.length && residue>1e-6;i++){
      const room=capNTD-normalized[i];
      const add=Math.min(room,residue);
      normalized[i]+=add;
      residue-=add;
    }
  }
  const rows=valid.map((x,i)=>({
    symbol:symbolOf(x.plan),
    allocation:round(normalized[i],2),
    stopRiskPctHigh:round(x.riskFrac*100,4),
    projectedRiskNTD:round(normalized[i]*x.riskFrac,2),
    capBinding:Math.abs(normalized[i]-capNTD)<0.01
  }));
  return {
    status:"READY",
    samePlannedDeployment:true,
    perNameCapPct:round(capPct,4),
    perNameCapNTD:round(capNTD,2),
    continuousDiagnostic:true,
    formalRoundingApplied:false,
    allocations:rows,
    totalAllocation:round(rows.reduce((s,x)=>s+x.allocation,0),2),
    capBindingSymbols:rows.filter(x=>x.capBinding).map(x=>x.symbol),
    note:"Research-only continuous cap-constrained equal planned-stop-risk comparator. Preserves current total planned deployment and current per-name capital cap; does not apply Formal NT$1,000 flooring or change live allocation."
  };
}

export function portfolioTierA(plans=[],totalCapital,{sectorBySymbol={},dataStatus="COMPLETE"}={}) {
  const total=positive(totalCapital);
  const riskRows=(plans||[]).map(projectedStopRisk);
  const known=riskRows.filter(r=>r.ok);
  const unknown=riskRows.filter(r=>!r.ok);
  const planned=(plans||[]).reduce((s,p)=>s+(positive(p?.totalAllocation)||0),0);
  const riskLow=known.reduce((s,r)=>s+r.riskNTDLow,0);
  const riskHigh=known.reduce((s,r)=>s+r.riskNTDHigh,0);
  const nameShares=(plans||[]).map(p=>({
    symbol:symbolOf(p),allocation:positive(p?.totalAllocation)||0
  })).filter(x=>x.allocation>0).map(x=>({
    ...x,shareOfTotalCapitalPct:total?round(x.allocation/total*100,2):null,
    shareOfPlannedCapitalPct:planned?round(x.allocation/planned*100,2):null
  })).sort((a,b)=>b.allocation-a.allocation);
  return {
    schemaVersion:"PORTFOLIO_RISK_TIER_A_V0_1",
    researchOnly:true,decisionImpact:false,
    totalCapital:total,plannedDeploymentNTD:round(planned,2),
    deploymentRatioPct:total?round(planned/total*100,2):null,
    projectedPortfolioRiskNTDLow:round(riskLow,2),
    projectedPortfolioRiskNTDHigh:round(riskHigh,2),
    projectedHeatPctLow:total?round(riskLow/total*100,4):null,
    projectedHeatPctHigh:total?round(riskHigh/total*100,4):null,
    knownRiskSymbols:known.length,unknownRiskSymbols:unknown.map(x=>({symbol:x.symbol,reason:x.reason})),
    effectiveCapitalNames:effectiveCapitalNames(plans),
    nameConcentration:nameShares,
    sectorConcentration:sectorCapitalShares(plans,sectorBySymbol),
    cashState:classifyProjectedCashState({selectedCount:(plans||[]).length,totalCapital:total,totalPlannedAllocation:planned,dataStatus}),
    counterfactuals:{
      equalCapital:equalCapitalCounterfactual(plans,total),
      equalPlannedStopRisk:equalPlannedStopRiskCounterfactual(plans,total),
      cappedEqualPlannedStopRisk:cappedEqualPlannedStopRiskCounterfactual(plans,total)
    },
    correlation20Status:"PIT_HISTORY_REQUIRED",
    correlation60Status:"PIT_HISTORY_REQUIRED",
    empiricalClusterStatus:"PIT_HISTORY_REQUIRED",
    rule:"Do not reconstruct old correlation/cluster state from current mutable history. Missing PIT synchronized history remains UNKNOWN."
  };
}
