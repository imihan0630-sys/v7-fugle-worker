// Portfolio Risk Tier-A research prototype v0.2
// Class A / research-only / decisionImpact=false.
// Extends v0.1 by separating deployment from within-deployed concentration.
// No Production/Formal behavior is imported or mutated.

import {portfolioTierA,projectedStopRisk} from "./portfolio_risk_tier_a_v0_1.mjs";

function num(value){
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}
function round(value,d=4){
  if(!Number.isFinite(value)) return null;
  const p=10**d;
  return Math.round(value*p)/p;
}
function allocationOf(plan){
  const n=num(plan?.totalAllocation);
  return n!==null && n>0 ? n : null;
}

export function deployedCapitalHHI(plans=[]){
  const allocations=(plans||[]).map(allocationOf).filter(Number.isFinite);
  const deployed=allocations.reduce((a,b)=>a+b,0);
  if(!(deployed>0)) return {status:"UNKNOWN",reason:"NO_PLANNED_CAPITAL"};
  const weights=allocations.map(v=>v/deployed);
  const hhi=weights.reduce((s,w)=>s+w*w,0);
  return {
    status:"READY",
    deployedCapitalNTD:round(deployed,2),
    deployedCapitalHHI:round(hhi,6),
    effectiveCapitalNames:hhi>0?round(1/hhi,4):null,
    semantics:"CONCENTRATION_WITHIN_DEPLOYED_RISKY_CAPITAL"
  };
}

export function riskyNameHHIOnTotalCapital(plans=[],totalCapital){
  const total=num(totalCapital);
  if(!(total>0)) return {status:"UNKNOWN",reason:"TOTAL_CAPITAL_UNKNOWN"};
  const allocations=(plans||[]).map(allocationOf).filter(Number.isFinite);
  const deployed=allocations.reduce((a,b)=>a+b,0);
  if(!(deployed>0)) return {
    status:"READY",
    riskyNameHHIOnTotalCapital:0,
    deploymentRatioPct:0,
    semantics:"SUM_OF_SQUARED_RISKY_NAME_WEIGHTS_ON_TOTAL_CAPITAL_CASH_EXCLUDED"
  };
  const hhi=allocations.reduce((s,v)=>s+(v/total)**2,0);
  return {
    status:"READY",
    riskyNameHHIOnTotalCapital:round(hhi,6),
    deploymentRatioPct:round(deployed/total*100,4),
    structuralReservePct:round(Math.max(0,1-deployed/total)*100,4),
    semantics:"SUM_OF_SQUARED_RISKY_NAME_WEIGHTS_ON_TOTAL_CAPITAL_CASH_EXCLUDED"
  };
}

export function heatIntensityOnDeployedCapital(tierA={}){
  const deploymentPct=num(tierA?.deploymentRatioPct);
  const low=num(tierA?.projectedHeatPctLow);
  const high=num(tierA?.projectedHeatPctHigh);
  if(!(deploymentPct>0)) return {
    status:"UNKNOWN",reason:"NO_DEPLOYED_CAPITAL",
    projectedStopRiskPctOfDeployedCapitalLow:null,
    projectedStopRiskPctOfDeployedCapitalHigh:null
  };
  const deployedFraction=deploymentPct/100;
  return {
    status:"READY",
    projectedStopRiskPctOfDeployedCapitalLow:low!==null?round(low/deployedFraction,4):null,
    projectedStopRiskPctOfDeployedCapitalHigh:high!==null?round(high/deployedFraction,4):null,
    semantics:"PROJECTED_STOP_RISK_DIVIDED_BY_PLANNED_DEPLOYED_CAPITAL"
  };
}

export function nominalDeployTargetPct(selectedCount){
  const n=Math.max(0,Math.floor(Number(selectedCount)||0));
  return n<=0?0:n===1?35:n===2?60:85;
}

export function decomposePlannedReserve({selectedCount,totalCapital,plannedDeploymentNTD}={}){
  const total=num(totalCapital);
  const planned=Math.max(0,num(plannedDeploymentNTD)||0);
  if(!(total>0)) return {status:"UNKNOWN",reason:"TOTAL_CAPITAL_UNKNOWN"};
  const targetPct=nominalDeployTargetPct(selectedCount);
  const targetNTD=total*targetPct/100;
  const actualDeploymentPct=round(planned/total*100,4);
  const actualReserveNTD=Math.max(0,total-planned);
  const nominalStructuralReserveNTD=Math.max(0,total-targetNTD);
  const implementationShortfallNTD=Math.max(0,targetNTD-planned);
  const aboveTargetNTD=Math.max(0,planned-targetNTD);
  return {
    status:aboveTargetNTD>0?"ABOVE_NOMINAL_TARGET":"READY",
    nominalDeployTargetPct:round(targetPct,4),
    nominalDeployTargetNTD:round(targetNTD,2),
    actualDeploymentPct,
    actualDeploymentNTD:round(planned,2),
    nominalStructuralReservePct:round(100-targetPct,4),
    nominalStructuralReserveNTD:round(nominalStructuralReserveNTD,2),
    allocationImplementationShortfallPct:round(implementationShortfallNTD/total*100,4),
    allocationImplementationShortfallNTD:round(implementationShortfallNTD,2),
    actualReservePct:round(actualReserveNTD/total*100,4),
    actualReserveNTD:round(actualReserveNTD,2),
    aboveNominalTargetNTD:round(aboveTargetNTD,2),
    semantics:"SEPARATE_INTENTIONAL_DEPLOYMENT_RESERVE_FROM_CAP_ROUNDING_ALLOCATION_SHORTFALL"
  };
}

export function strategyRiskDecomposition(plans=[]){
  const groups=new Map();
  for(const plan of plans||[]){
    const raw=String(plan?.strategy||plan?.channel||plan?.mode||"UNKNOWN");
    const strategy=/^A|拉回|PULLBACK/i.test(raw)?"A":(/^B|突破|MOMENTUM/i.test(raw)?"B":"UNKNOWN");
    const allocation=allocationOf(plan)||0;
    const risk=projectedStopRisk(plan);
    const row=groups.get(strategy)||{strategy,planCount:0,plannedDeploymentNTD:0,knownRiskPlans:0,riskNTDLow:0,riskNTDHigh:0};
    row.planCount+=1;
    row.plannedDeploymentNTD+=allocation;
    if(risk.ok){
      row.knownRiskPlans+=1;
      row.riskNTDLow+=risk.riskNTDLow;
      row.riskNTDHigh+=risk.riskNTDHigh;
    }
    groups.set(strategy,row);
  }
  return [...groups.values()].map(row=>({
    strategy:row.strategy,
    planCount:row.planCount,
    knownRiskPlans:row.knownRiskPlans,
    plannedDeploymentNTD:round(row.plannedDeploymentNTD,2),
    projectedStopRiskPctOfStrategyDeploymentLow:row.plannedDeploymentNTD>0?round(row.riskNTDLow/row.plannedDeploymentNTD*100,4):null,
    projectedStopRiskPctOfStrategyDeploymentHigh:row.plannedDeploymentNTD>0?round(row.riskNTDHigh/row.plannedDeploymentNTD*100,4):null
  })).sort((a,b)=>a.strategy.localeCompare(b.strategy));
}

export function portfolioTierAV02(plans=[],totalCapital,options={}){
  const base=portfolioTierA(plans,totalCapital,options);
  const within=deployedCapitalHHI(plans);
  const totalFootprint=riskyNameHHIOnTotalCapital(plans,totalCapital);
  const heatIntensity=heatIntensityOnDeployedCapital(base);
  const reserveDecomposition=decomposePlannedReserve({
    selectedCount:(plans||[]).length,totalCapital,plannedDeploymentNTD:base.plannedDeploymentNTD
  });
  return {
    ...base,
    schemaVersion:"PORTFOLIO_RISK_TIER_A_V0_2",
    concentrationDecomposition:{
      deployedCapitalHHI:within.status==="READY"?within.deployedCapitalHHI:null,
      effectiveCapitalNames:within.status==="READY"?within.effectiveCapitalNames:base.effectiveCapitalNames,
      riskyNameHHIOnTotalCapital:totalFootprint.status==="READY"?totalFootprint.riskyNameHHIOnTotalCapital:null,
      deploymentRatioPct:base.deploymentRatioPct,
      structuralReservePct:totalFootprint.status==="READY"?totalFootprint.structuralReservePct:null,
      rule:"Do not interpret effectiveCapitalNames without deployment ratio. One fully concentrated deployed sleeve can still be a smaller total-account risky footprint when most capital remains cash."
    },
    heatIntensityOnDeployedCapital:heatIntensity,
    strategyRiskDecomposition:strategyRiskDecomposition(plans),
    reserveDecomposition,
    decisionImpact:false,
    researchOnly:true
  };
}
