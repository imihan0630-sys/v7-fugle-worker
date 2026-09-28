// D15 Portfolio Heat semantic firewall v0.1 — research-only.
// Separates selected-plan projected heat from actual-live portfolio heat.

import {projectedStopRisk} from "./portfolio_risk_tier_a_v0_1.mjs";

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function plannedSelectionHeat(plans=[],totalCapital,{scanComplete=true}={}){
  const total=n(totalCapital);
  if(!scanComplete) return {status:"UNKNOWN",reason:"SCAN_INCOMPLETE"};
  if(!(total>0)) return {status:"UNKNOWN",reason:"TOTAL_CAPITAL_UNKNOWN"};
  const rows=(plans||[]).map(projectedStopRisk);
  if(rows.length===0){
    return {
      status:"READY",
      selectedCount:0,
      plannedDeploymentNTD:0,
      projectedNewPlanRiskNTDLow:0,
      projectedNewPlanRiskNTDHigh:0,
      projectedNewPlanHeatPctLow:0,
      projectedNewPlanHeatPctHigh:0,
      semantics:"NEW_PLAN_PROJECTED_HEAT_ONLY",
      actualPortfolioHeatKnown:false,
      zeroSelectionRule:"Zero selected means zero NEW planned heat, not zero account-wide portfolio heat."
    };
  }
  const bad=rows.filter(x=>!x.ok);
  if(bad.length) return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_RISK",unknown:bad.map(x=>({symbol:x.symbol,reason:x.reason}))};
  const deploy=rows.reduce((s,x)=>s+x.allocation,0);
  const low=rows.reduce((s,x)=>s+x.riskNTDLow,0);
  const high=rows.reduce((s,x)=>s+x.riskNTDHigh,0);
  return {
    status:"READY",
    selectedCount:rows.length,
    plannedDeploymentNTD:round(deploy,2),
    projectedNewPlanRiskNTDLow:round(low,2),
    projectedNewPlanRiskNTDHigh:round(high,2),
    projectedNewPlanHeatPctLow:round(low/total*100,6),
    projectedNewPlanHeatPctHigh:round(high/total*100,6),
    projectedRiskPctOfPlannedDeploymentLow:deploy>0?round(low/deploy*100,6):null,
    projectedRiskPctOfPlannedDeploymentHigh:deploy>0?round(high/deploy*100,6):null,
    semantics:"NEW_PLAN_PROJECTED_HEAT_ONLY",
    actualPortfolioHeatKnown:false
  };
}

export function actualPortfolioHeatEligibility({
  asOfTimestamp,
  totalEquityKnown=false,
  appendOnlyFillLedger=false,
  allCarryoverPositionsKnown=false,
  actualSharesKnown=false,
  stopForEveryOpenPositionKnown=false,
  priceReferenceForEveryOpenPositionKnown=false
}={}){
  const timeOk=Number.isFinite(Date.parse(asOfTimestamp||""));
  const checks={
    pointInTimeTimestamp:timeOk,
    totalEquityKnown:totalEquityKnown===true,
    appendOnlyFillLedger:appendOnlyFillLedger===true,
    allCarryoverPositionsKnown:allCarryoverPositionsKnown===true,
    actualSharesKnown:actualSharesKnown===true,
    stopForEveryOpenPositionKnown:stopForEveryOpenPositionKnown===true,
    priceReferenceForEveryOpenPositionKnown:priceReferenceForEveryOpenPositionKnown===true
  };
  const missing=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
  return {
    status:missing.length?"NOT_ELIGIBLE":"ELIGIBLE",
    actualPortfolioHeatClaimAllowed:missing.length===0,
    missing,
    rule:"Actual portfolio heat requires a point-in-time complete open-position state and explicit stop/price/equity semantics. New-plan rows alone are insufficient."
  };
}

export function heatEvidenceLayer(input={}){
  return {
    planned:plannedSelectionHeat(input.plans||[],input.totalCapital,{scanComplete:input.scanComplete!==false}),
    actualEligibility:actualPortfolioHeatEligibility(input.actualEvidence||{}),
    labels:{
      allowed:"PROJECTED_NEW_PLAN_HEAT",
      forbiddenWithoutEligibility:"ACTUAL_PORTFOLIO_HEAT"
    }
  };
}
