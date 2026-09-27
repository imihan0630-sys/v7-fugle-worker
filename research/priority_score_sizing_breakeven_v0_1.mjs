// Research-only allocation-tilt break-even algebra.
// Measures whether a current sizing rule adds realized P&L versus a same-deployment comparator.
// It does not choose an allocator, estimate expected return, or change Formal behavior.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}

export function allocationTiltBreakEven(currentPlans=[],comparatorAllocations=[],outcomes=[],{
  incrementalCostNTD=null,
  deploymentToleranceNTD=1
}={}){
  const comp=new Map((comparatorAllocations||[]).map(x=>[sym(x?.symbol??x?.code),n(x?.allocation??x?.totalAllocation)]));
  const out=new Map((outcomes||[]).map(x=>[sym(x?.symbol??x?.code),n(x?.returnPct)]));
  const rows=[];
  for(const p of currentPlans||[]){
    const symbol=sym(p?.symbol??p?.code);
    const current=n(p?.totalAllocation??p?.total_allocation);
    const comparator=comp.get(symbol);
    const ret=out.get(symbol);
    if(!symbol||current===null||comparator===null||ret===null) {
      return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_COMPARATOR_OR_OUTCOME",symbol:symbol||null};
    }
    const stopRiskPct=n(p?.conservativeStopRiskPct??p?.stopRiskPctHigh);
    rows.push({symbol,currentAllocationNTD:current,comparatorAllocationNTD:comparator,returnPct:ret,tiltNTD:current-comparator,stopRiskPct});
  }
  if(rows.length<2) return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE",rows:[]};

  const currentTotal=rows.reduce((s,x)=>s+x.currentAllocationNTD,0);
  const comparatorTotal=rows.reduce((s,x)=>s+x.comparatorAllocationNTD,0);
  const deploymentDelta=currentTotal-comparatorTotal;
  if(Math.abs(deploymentDelta)>Math.max(0,n(deploymentToleranceNTD)??1)) {
    return {status:"UNBALANCED_DEPLOYMENT",currentTotalNTD:round(currentTotal,2),comparatorTotalNTD:round(comparatorTotal,2),deploymentDeltaNTD:round(deploymentDelta,2)};
  }

  const pos=rows.filter(x=>x.tiltNTD>0);
  const neg=rows.filter(x=>x.tiltNTD<0);
  const transferredPos=pos.reduce((s,x)=>s+x.tiltNTD,0);
  const transferredNeg=neg.reduce((s,x)=>s+Math.abs(x.tiltNTD),0);
  const transfer=(transferredPos+transferredNeg)/2;
  if(!(transfer>0)) return {status:"NO_SIZING_DIFFERENCE",rows};

  const posReturn=pos.reduce((s,x)=>s+x.tiltNTD*x.returnPct,0)/transferredPos;
  const negReturn=neg.reduce((s,x)=>s+Math.abs(x.tiltNTD)*x.returnPct,0)/transferredNeg;
  const grossSpread=posReturn-negReturn;
  const grossIncrementalPnl=rows.reduce((s,x)=>s+x.tiltNTD*x.returnPct/100,0);
  const allRiskKnown=rows.every(x=>x.stopRiskPct!==null&&x.stopRiskPct>=0);
  const currentProjectedRisk=allRiskKnown?rows.reduce((s,x)=>s+x.currentAllocationNTD*x.stopRiskPct/100,0):null;
  const comparatorProjectedRisk=allRiskKnown?rows.reduce((s,x)=>s+x.comparatorAllocationNTD*x.stopRiskPct/100,0):null;
  const incrementalProjectedRisk=allRiskKnown?currentProjectedRisk-comparatorProjectedRisk:null;

  const cost=n(incrementalCostNTD);
  const costKnown=cost!==null&&cost>=0;
  const costBreakEvenSpread=costKnown?cost/transfer*100:null;
  const netIncrementalPnl=costKnown?grossIncrementalPnl-cost:null;
  const realizedSpreadAfterCostBurden=costKnown?grossSpread-costBreakEvenSpread:null;

  return {
    status:"READY",
    researchOnly:true,
    decisionImpact:false,
    sameDeploymentWithinTolerance:true,
    currentTotalNTD:round(currentTotal,2),
    comparatorTotalNTD:round(comparatorTotal,2),
    transferredCapitalNTD:round(transfer,2),
    positiveTiltSymbols:pos.map(x=>x.symbol),
    negativeTiltSymbols:neg.map(x=>x.symbol),
    positiveTiltWeightedReturnPct:round(posReturn,6),
    negativeTiltWeightedReturnPct:round(negReturn,6),
    realizedTiltSpreadPct:round(grossSpread,6),
    grossBreakEvenSpreadPct:0,
    grossIncrementalPnlNTD:round(grossIncrementalPnl,2),
    currentProjectedRiskNTD:allRiskKnown?round(currentProjectedRisk,2):null,
    comparatorProjectedRiskNTD:allRiskKnown?round(comparatorProjectedRisk,2):null,
    incrementalProjectedRiskNTD:allRiskKnown?round(incrementalProjectedRisk,2):null,
    grossIncrementalPnlPerExtraProjectedRisk:(allRiskKnown&&incrementalProjectedRisk>0)?round(grossIncrementalPnl/incrementalProjectedRisk,6):null,
    projectedRiskStatus:allRiskKnown?"KNOWN":"UNKNOWN",
    incrementalCostNTD:costKnown?round(cost,2):null,
    costAdjustedBreakEvenSpreadPct:costKnown?round(costBreakEvenSpread,6):null,
    netIncrementalPnlNTD:costKnown?round(netIncrementalPnl,2):null,
    netRealizedSpreadAfterCostBurdenPct:costKnown?round(realizedSpreadAfterCostBurden,6):null,
    costStatus:costKnown?"KNOWN":"UNKNOWN",
    rows:rows.map(x=>({...x,tiltNTD:round(x.tiltNTD,2)})),
    identity:"grossIncrementalPnl = transferredCapital * (positiveTiltWeightedReturn - negativeTiltWeightedReturn)",
    interpretation:"Current sizing beats the comparator gross only when capital tilted upward earns a higher realized return than capital tilted downward. If stop-risk inputs are complete, incremental realized P&L per extra projected plan-risk is reported descriptively without imposing an arbitrary minimum ratio. Cost-adjusted dominance is UNKNOWN unless incremental cost difference is explicitly supplied."
  };
}
