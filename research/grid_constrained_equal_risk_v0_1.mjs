import {cappedEqualPlannedStopRiskCounterfactual,projectedStopRisk} from "./portfolio_risk_tier_a_v0_1.mjs";

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function symbolOf(p){return String(p?.symbol??p?.code??"").trim()}

export function gridConstrainedEqualRisk(plans=[],totalCapital,{perNameCapPct=35,gridNTD=1000}={}){
  const capital=n(totalCapital),grid=n(gridNTD),capPct=n(perNameCapPct);
  if(!(capital>0)||!(grid>0)||!(capPct>0)) return {status:"UNKNOWN",reason:"INVALID_CAPITAL_GRID_OR_CAP"};

  const currentDeployment=(plans||[]).reduce((s,p)=>s+(n(p?.totalAllocation??p?.total_allocation)||0),0);
  if(!(currentDeployment>0)) return {status:"UNKNOWN",reason:"NO_CURRENT_DEPLOYMENT"};
  const unitsExact=currentDeployment/grid;
  if(Math.abs(unitsExact-Math.round(unitsExact))>1e-8) return {status:"CURRENT_DEPLOYMENT_NOT_ON_GRID",currentDeploymentNTD:currentDeployment,gridNTD:grid};

  const continuous=cappedEqualPlannedStopRiskCounterfactual(plans,capital,{perNameCapPct:capPct});
  if(continuous?.status!=="READY") return {status:"UNKNOWN",reason:"CONTINUOUS_TARGET_UNAVAILABLE",continuousStatus:continuous?.status||"UNKNOWN"};

  const capNTD=capital*capPct/100;
  const gridCap=Math.floor(capNTD/grid)*grid;
  if(!(gridCap>0)) return {status:"UNKNOWN",reason:"GRID_CAP_ZERO"};

  const riskBySymbol=new Map();
  for(const p of plans||[]){
    const r=projectedStopRisk(p);
    if(!r?.ok) return {status:"UNKNOWN",reason:"INCOMPLETE_RISK_INPUTS",symbol:r?.symbol||symbolOf(p)};
    riskBySymbol.set(symbolOf(p),r.riskPctHigh/100);
  }

  const targets=(continuous.allocations||[]).map(x=>{
    const symbol=String(x.symbol||"");
    const allocation=n(x.allocation);
    const riskFrac=riskBySymbol.get(symbol);
    if(!symbol||allocation===null||!(riskFrac>0)) return null;
    return {symbol,targetAllocationNTD:allocation,riskFrac,targetRiskNTD:allocation*riskFrac};
  });
  if(targets.some(x=>!x)||targets.length!==(plans||[]).length) return {status:"UNKNOWN",reason:"TARGET_ALIGNMENT_FAILED"};

  const allocations=new Map();
  for(const x of targets){
    allocations.set(x.symbol,Math.min(gridCap,Math.floor(x.targetAllocationNTD/grid)*grid));
  }

  let residue=currentDeployment-[...allocations.values()].reduce((a,b)=>a+b,0);
  const residueUnitsExact=residue/grid;
  if(residue<-1e-6||Math.abs(residueUnitsExact-Math.round(residueUnitsExact))>1e-8){
    return {status:"GRID_RECONCILIATION_FAILED",residueNTD:round(residue,6)};
  }
  let units=Math.round(residueUnitsExact);

  const objective=allocMap=>targets.reduce((sum,x)=>{
    const risk=(allocMap.get(x.symbol)||0)*x.riskFrac;
    return sum+(risk-x.targetRiskNTD)**2;
  },0);

  const allocationOrder=[];
  while(units>0){
    const candidates=targets
      .filter(x=>(allocations.get(x.symbol)||0)+grid<=gridCap+1e-8)
      .map(x=>{
        const test=new Map(allocations);
        test.set(x.symbol,(test.get(x.symbol)||0)+grid);
        return {symbol:x.symbol,loss:objective(test)};
      })
      .sort((a,b)=>a.loss-b.loss||a.symbol.localeCompare(b.symbol));
    if(!candidates.length) return {status:"GRID_CAPACITY_EXHAUSTED",remainingUnits:units};
    const chosen=candidates[0];
    allocations.set(chosen.symbol,(allocations.get(chosen.symbol)||0)+grid);
    allocationOrder.push({unit:grid,symbol:chosen.symbol,postAssignmentRiskSpaceLoss:round(chosen.loss,6)});
    units-=1;
  }

  const rows=targets.map(x=>{
    const allocation=allocations.get(x.symbol)||0;
    return {
      symbol:x.symbol,
      continuousTargetAllocationNTD:round(x.targetAllocationNTD,2),
      gridAllocationNTD:round(allocation,2),
      allocationDeltaFromContinuousNTD:round(allocation-x.targetAllocationNTD,2),
      stopRiskPctHigh:round(x.riskFrac*100,6),
      continuousTargetRiskNTD:round(x.targetRiskNTD,4),
      gridProjectedRiskNTD:round(allocation*x.riskFrac,4),
      capBinding:Math.abs(allocation-gridCap)<1e-8
    };
  });

  const risks=rows.map(x=>x.gridProjectedRiskNTD);
  const totalRisk=risks.reduce((a,b)=>a+b,0);
  const hhi=totalRisk>0?risks.reduce((s,x)=>s+(x/totalRisk)**2,0):null;
  const positiveRisks=risks.filter(x=>x>0);
  return {
    status:"READY",
    researchOnly:true,
    decisionImpact:false,
    gridNTD:grid,
    perNameCapPct:capPct,
    gridCapNTD:gridCap,
    samePlannedDeployment:true,
    currentDeploymentNTD:round(currentDeployment,2),
    allocationTotalNTD:round(rows.reduce((s,x)=>s+x.gridAllocationNTD,0),2),
    projectedRiskNTD:round(totalRisk,4),
    projectedRiskHHI:hhi===null?null:round(hhi,8),
    maxToMinProjectedRiskRatio:positiveRisks.length>=2?round(Math.max(...positiveRisks)/Math.min(...positiveRisks),6):null,
    continuousTarget:continuous,
    allocationOrder,
    allocations:rows,
    semantics:"NT$1,000-grid research comparator nearest to the continuous 35%-cap equal-risk target in projected-risk space. Same current planned deployment; no live allocation change."
  };
}
