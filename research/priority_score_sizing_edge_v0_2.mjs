// PriorityScore sizing edge v0.2 — research-only.
// Corrects v0.1 terminology: fixed-horizon returns from the formal selection close create a PAPER PATH EDGE,
// not realized/executable P&L because no fill is implied at the formal close.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}

export function allocationTiltPaperPathEdge(currentPlans=[],comparatorAllocations=[],pathReturns=[],{deploymentToleranceNTD=1}={}){
  const comp=new Map((comparatorAllocations||[]).map(x=>[sym(x?.symbol??x?.code),n(x?.allocation??x?.totalAllocation)]));
  const out=new Map((pathReturns||[]).map(x=>[sym(x?.symbol??x?.code),n(x?.returnPct)]));
  const rows=[];
  for(const p of currentPlans||[]){
    const symbol=sym(p?.symbol??p?.code);
    const current=n(p?.totalAllocation??p?.total_allocation);
    const comparator=n(comp.get(symbol));
    const ret=n(out.get(symbol));
    if(!symbol||current===null||comparator===null||ret===null){
      return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_COMPARATOR_OR_PATH_RETURN",symbol:symbol||null};
    }
    const stopRiskPct=n(p?.conservativeStopRiskPct??p?.stopRiskPctHigh);
    rows.push({symbol,currentAllocationNTD:current,comparatorAllocationNTD:comparator,pathReturnPct:ret,tiltNTD:current-comparator,stopRiskPct});
  }
  if(rows.length<2) return {status:"INSUFFICIENT_CROSS_NAME_SAMPLE",rows:[]};

  const currentTotal=rows.reduce((s,x)=>s+x.currentAllocationNTD,0);
  const comparatorTotal=rows.reduce((s,x)=>s+x.comparatorAllocationNTD,0);
  const deploymentDelta=currentTotal-comparatorTotal;
  if(Math.abs(deploymentDelta)>Math.max(0,n(deploymentToleranceNTD)??1)){
    return {status:"UNBALANCED_DEPLOYMENT",currentTotalNTD:round(currentTotal,2),comparatorTotalNTD:round(comparatorTotal,2),deploymentDeltaNTD:round(deploymentDelta,2)};
  }

  const pos=rows.filter(x=>x.tiltNTD>0),neg=rows.filter(x=>x.tiltNTD<0);
  const posCapital=pos.reduce((s,x)=>s+x.tiltNTD,0),negCapital=neg.reduce((s,x)=>s+Math.abs(x.tiltNTD),0);
  const transferred=(posCapital+negCapital)/2;
  if(!(transferred>0)) return {status:"NO_SIZING_DIFFERENCE",rows};

  const posReturn=pos.reduce((s,x)=>s+x.tiltNTD*x.pathReturnPct,0)/posCapital;
  const negReturn=neg.reduce((s,x)=>s+Math.abs(x.tiltNTD)*x.pathReturnPct,0)/negCapital;
  const spread=posReturn-negReturn;
  const paperEdge=rows.reduce((s,x)=>s+x.tiltNTD*x.pathReturnPct/100,0);

  const allRiskKnown=rows.every(x=>x.stopRiskPct!==null&&x.stopRiskPct>=0);
  const currentRisk=allRiskKnown?rows.reduce((s,x)=>s+x.currentAllocationNTD*x.stopRiskPct/100,0):null;
  const comparatorRisk=allRiskKnown?rows.reduce((s,x)=>s+x.comparatorAllocationNTD*x.stopRiskPct/100,0):null;
  const riskDelta=allRiskKnown?currentRisk-comparatorRisk:null;

  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    estimand:"FORMAL_CLOSE_FIXED_COHORT_PAPER_PATH_EDGE",
    executablePnl:false,realizedPnl:false,
    currentTotalNTD:round(currentTotal,2),comparatorTotalNTD:round(comparatorTotal,2),
    transferredCapitalNTD:round(transferred,2),
    positiveTiltSymbols:pos.map(x=>x.symbol),negativeTiltSymbols:neg.map(x=>x.symbol),
    positiveTiltWeightedPathReturnPct:round(posReturn,6),
    negativeTiltWeightedPathReturnPct:round(negReturn,6),
    paperTiltSpreadPct:round(spread,6),
    grossPaperPathEdgeNTD:round(paperEdge,2),
    grossPaperBreakEvenSpreadPct:0,
    currentProjectedPlanRiskNTD:allRiskKnown?round(currentRisk,2):null,
    comparatorProjectedPlanRiskNTD:allRiskKnown?round(comparatorRisk,2):null,
    incrementalProjectedPlanRiskNTD:allRiskKnown?round(riskDelta,2):null,
    paperEdgePerExtraProjectedPlanRisk:(allRiskKnown&&riskDelta>0)?round(paperEdge/riskDelta,6):null,
    projectedRiskStatus:allRiskKnown?"KNOWN":"UNKNOWN",
    rows:rows.map(x=>({...x,tiltNTD:round(x.tiltNTD,2)})),
    identity:"grossPaperPathEdge = transferredCapital * (positiveTiltWeightedPathReturn - negativeTiltWeightedPathReturn)",
    interpretation:"Tests whether PriorityScore capital tilt points toward names with better subsequent fixed-horizon paths. It is not executable or realized P&L because no fill at the formal selection close is assumed."
  };
}
