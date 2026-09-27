// PriorityScore cap-induced reserve v0.1 — research-only.
// Reproduces current allocation geometry through per-name 35% cap and NT$1,000 floor.
// No redistribution policy is proposed.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}
export function deployRatioForCount(count){
  const k=Number(count);
  return k<=0?0:k===1?0.35:k===2?0.60:0.85;
}
export function capBindingScoreShareThreshold(count,{perNameCapRatio=0.35}={}){
  const deploy=deployRatioForCount(count);
  if(!(deploy>0)) return null;
  return perNameCapRatio/deploy;
}
export function scoreCapReserve(plans=[],totalCapital,{perNameCapRatio=0.35,gridNTD=1000}={}){
  const capital=n(totalCapital),cap=n(perNameCapRatio),grid=n(gridNTD);
  if(!(capital>0)||!(cap>0)||!(grid>0)) return {status:"UNKNOWN",reason:"INVALID_PARAMETERS"};
  const rows=(plans||[]).map(p=>({symbol:sym(p?.symbol??p?.code),score:n(p?.priorityScore??p?.priority_score)}));
  if(!rows.length) return {status:"NO_SELECTED",selectedCount:0,nominalDeployTargetNTD:0,plannedAllocationNTD:0,remainingCashNTD:capital};
  if(rows.some(x=>!x.symbol||x.score===null)) return {status:"UNKNOWN",reason:"MISSING_SCORE"};
  const weights=rows.map(x=>Math.max(1,x.score));
  const scoreTotal=weights.reduce((a,b)=>a+b,0)||1;
  const deployRatio=deployRatioForCount(rows.length);
  const details=rows.map((x,i)=>{
    const scoreShare=weights[i]/scoreTotal;
    const rawRatio=deployRatio*scoreShare;
    const cappedRatio=Math.min(cap,rawRatio);
    const continuousAllocation=capital*cappedRatio;
    const plannedAllocation=Math.floor(continuousAllocation/grid)*grid;
    return {
      symbol:x.symbol,priorityScore:x.score,
      scoreSharePct:round(scoreShare*100,6),
      rawCapitalRatioPct:round(rawRatio*100,6),
      capBinding:rawRatio>cap+1e-12,
      cappedCapitalRatioPct:round(cappedRatio*100,6),
      clippedRatioPct:round(Math.max(0,rawRatio-cap)*100,6),
      continuousAllocationNTD:round(continuousAllocation,4),
      plannedAllocationNTD:round(plannedAllocation,2),
      thousandFloorShortfallNTD:round(continuousAllocation-plannedAllocation,4)
    };
  });
  const nominal=capital*deployRatio;
  const continuous=details.reduce((s,x)=>s+x.continuousAllocationNTD,0);
  const planned=details.reduce((s,x)=>s+x.plannedAllocationNTD,0);
  const capReserve=nominal-continuous;
  const floorReserve=continuous-planned;
  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    selectedCount:rows.length,totalCapitalNTD:capital,
    deployRatioPct:round(deployRatio*100,6),
    perNameCapPct:round(cap*100,6),
    capBindingScoreShareThresholdPct:round(capBindingScoreShareThreshold(rows.length,{perNameCapRatio:cap})*100,6),
    nominalDeployTargetNTD:round(nominal,4),
    continuousAfterCapNTD:round(continuous,4),
    plannedAllocationNTD:round(planned,4),
    capInducedReserveNTD:round(capReserve,4),
    capInducedReservePctOfCapital:round(capReserve/capital*100,6),
    thousandFloorReserveNTD:round(floorReserve,4),
    totalNominalToPlannedReserveNTD:round(nominal-planned,4),
    remainingCashAfterPlanNTD:round(capital-planned,4),
    capBindingSymbols:details.filter(x=>x.capBinding).map(x=>x.symbol),
    details,
    semantics:"Current allocator clips each raw score-proportional ratio independently at the per-name cap and does not redistribute clipped ratio inside allocateAndBuildPlans. Cap-induced reserve and NT$1,000-floor reserve are reported separately. This is structural accounting, not a recommendation to redistribute."
  };
}
