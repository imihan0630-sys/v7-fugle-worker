// Portfolio Heat semantics v0.1 — research-only.
// Separates total-capital planned heat from deployed-capital risk intensity.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
export function classifyPlannedPortfolioHeat(plans=[],totalCapital){
 const capital=n(totalCapital);
 if(!(capital>0))return {status:"UNKNOWN",reason:"INVALID_TOTAL_CAPITAL"};
 const rows=(plans||[]).map(p=>{
  const a=n(p?.totalAllocation??p?.total_allocation),bh=n(p?.buyHigh??p?.buy_high),stop=n(p?.stop);
  return {allocation:a,riskFrac:(bh>0&&stop>0&&stop<bh)?(bh-stop)/bh:null};
 });
 if(rows.some(x=>x.allocation===null||x.allocation<0||x.riskFrac===null))return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
 if(rows.length===0){
  return {
   status:"READY",selectedCount:0,plannedDeploymentNTD:0,plannedProjectedStopRiskNTD:0,
   totalCapitalHeatPct:0,deployedCapitalRiskIntensityPct:null,
   deployedIntensityStatus:"NOT_APPLICABLE_NO_DEPLOYMENT",
   concentrationStatus:"NOT_APPLICABLE_NO_SELECTED_NAMES",
   semantics:"No selected plan means zero planned stop-risk exposure. It does not imply realized broker cash or zero realized market risk from external holdings."
  };
 }
 const deployment=rows.reduce((s,x)=>s+x.allocation,0);
 const risk=rows.reduce((s,x)=>s+x.allocation*x.riskFrac,0);
 return {
  status:"READY",selectedCount:rows.length,
  plannedDeploymentNTD:round(deployment,2),
  plannedProjectedStopRiskNTD:round(risk,4),
  totalCapitalHeatPct:round(risk/capital*100,6),
  deployedCapitalRiskIntensityPct:deployment>0?round(risk/deployment*100,6):null,
  deployedIntensityStatus:deployment>0?"READY":"NOT_APPLICABLE_NO_DEPLOYMENT",
  concentrationStatus:rows.length===1?"DEGENERATE_SINGLE_NAME":"MULTI_NAME_IDENTIFYING",
  semantics:"Plan-time only. totalCapitalHeat includes strategic reserve in the denominator; deployedCapitalRiskIntensity conditions on planned deployment. Neither is actual live holdings heat without fill/holdings evidence."
 };
}
