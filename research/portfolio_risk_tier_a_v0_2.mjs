// Portfolio Risk Tier-A research prototype v0.2
// Class A / research-only / decisionImpact=false.
// Extends v0.1 by separating deployment from within-deployed concentration.
// No Production/Formal behavior is imported or mutated.

import {portfolioTierA} from "./portfolio_risk_tier_a_v0_1.mjs";

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

export function portfolioTierAV02(plans=[],totalCapital,options={}){
  const base=portfolioTierA(plans,totalCapital,options);
  const within=deployedCapitalHHI(plans);
  const totalFootprint=riskyNameHHIOnTotalCapital(plans,totalCapital);
  const heatIntensity=heatIntensityOnDeployedCapital(base);
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
    decisionImpact:false,
    researchOnly:true
  };
}
