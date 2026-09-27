// Sizing quantization cascade v0.1 — research-only.
// Traces Formal continuous score-weighted capital through NT$1,000 allocation flooring,
// default 60/40 tranche split, and plan-preview integer-share flooring at buyHigh.
// No fills or realized deployment are inferred.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=4){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function sym(v){return String(v??"").trim()}

export function sizingQuantizationCascade(plans=[],totalCapital,opts={}){
  const capital=n(totalCapital);
  if(capital===null||capital<=0) return {status:"UNKNOWN",reason:"INVALID_TOTAL_CAPITAL"};
  const rows=(plans||[]).map(p=>({
    symbol:sym(p?.symbol??p?.code),
    priorityScore:n(p?.priorityScore??p?.priority_score),
    totalAllocation:n(p?.totalAllocation??p?.total_allocation),
    buyHigh:n(p?.buyHigh??p?.buy_high),
    firstShares:n(p?.firstShares??p?.first_shares),
    secondShares:n(p?.secondShares??p?.second_shares),
    stop:n(p?.stop)
  }));
  if(!rows.length||rows.some(x=>!x.symbol||x.priorityScore===null||x.priorityScore<=0||x.totalAllocation===null||x.totalAllocation<0||x.buyHigh===null||x.buyHigh<=0||!Number.isInteger(x.firstShares)||x.firstShares<0||!Number.isInteger(x.secondShares)||x.secondShares<0)){
    return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  }

  const selectedCount=rows.length;
  const deployRatio=opts.deployRatio??(selectedCount===1?0.35:selectedCount===2?0.60:0.85);
  const perNameCapRatio=opts.perNameCapRatio??0.35;
  const scoreSum=rows.reduce((s,x)=>s+x.priorityScore,0);
  if(!(scoreSum>0)) return {status:"UNKNOWN",reason:"INVALID_SCORE_SUM"};

  const details=[];
  for(const x of rows){
    const rawRatio=deployRatio*x.priorityScore/scoreSum;
    const cappedRatio=Math.min(perNameCapRatio,rawRatio);
    const continuousAllocation=capital*cappedRatio;
    const firstAmount=Math.round(x.totalAllocation*0.6);
    const secondAmount=x.totalAllocation-firstAmount;
    const expectedFirstShares=Math.floor(firstAmount/x.buyHigh);
    const expectedSecondShares=Math.floor(secondAmount/x.buyHigh);
    const trancheContractMatches=expectedFirstShares===x.firstShares&&expectedSecondShares===x.secondShares;
    const previewSuggestedNotional=(x.firstShares+x.secondShares)*x.buyHigh;
    const thousandFloorShortfall=continuousAllocation-x.totalAllocation;
    const shareFloorResidual=x.totalAllocation-previewSuggestedNotional;
    details.push({
      symbol:x.symbol,
      priorityScore:x.priorityScore,
      rawRatioPct:round(rawRatio*100,6),
      cappedRatioPct:round(cappedRatio*100,6),
      capBinding:rawRatio>perNameCapRatio+1e-12,
      continuousAllocationNTD:round(continuousAllocation,4),
      plannedAllocationNTD:x.totalAllocation,
      thousandFloorShortfallNTD:round(thousandFloorShortfall,4),
      buyHigh:x.buyHigh,
      firstAmountNTD:firstAmount,
      secondAmountNTD:secondAmount,
      storedFirstShares:x.firstShares,
      storedSecondShares:x.secondShares,
      expectedFirstShares,
      expectedSecondShares,
      trancheContractMatches,
      previewSuggestedNotionalNTD:round(previewSuggestedNotional,4),
      shareFloorResidualNTD:round(shareFloorResidual,4),
      shareFloorResidualPctOfPlanned:x.totalAllocation>0?round(shareFloorResidual/x.totalAllocation*100,6):null,
      continuousToPreviewShortfallNTD:round(continuousAllocation-previewSuggestedNotional,4),
      conservativeStopRiskPct:(x.stop!==null&&x.stop>0&&x.stop<x.buyHigh)?round((x.buyHigh-x.stop)/x.buyHigh*100,6):null,
      plannedProjectedStopRiskNTD:(x.stop!==null&&x.stop>0&&x.stop<x.buyHigh)?round(x.totalAllocation*((x.buyHigh-x.stop)/x.buyHigh),4):null,
      previewProjectedStopRiskNTD:(x.stop!==null&&x.stop>0&&x.stop<x.buyHigh)?round(previewSuggestedNotional*((x.buyHigh-x.stop)/x.buyHigh),4):null
    });
  }

  if(details.some(x=>!x.trancheContractMatches)){
    return {status:"PLAN_TRANCHE_RECONSTRUCTION_MISMATCH",details};
  }

  const nominalDeployTarget=capital*deployRatio;
  const continuousCapped=details.reduce((s,x)=>s+x.continuousAllocationNTD,0);
  const planned=details.reduce((s,x)=>s+x.plannedAllocationNTD,0);
  const preview=details.reduce((s,x)=>s+x.previewSuggestedNotionalNTD,0);
  const plannedRisk=details.map(x=>x.plannedProjectedStopRiskNTD).filter(Number.isFinite);
  const previewRisk=details.map(x=>x.previewProjectedStopRiskNTD).filter(Number.isFinite);
  const hhi=xs=>{const total=xs.reduce((a,b)=>a+b,0);return total>0?round(xs.reduce((s,x)=>s+(x/total)**2,0),8):null;};

  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    selectedCount,totalCapitalNTD:capital,deployRatioPct:round(deployRatio*100,4),perNameCapPct:round(perNameCapRatio*100,4),
    nominalDeployTargetNTD:round(nominalDeployTarget,4),
    continuousCappedAllocationNTD:round(continuousCapped,4),
    plannedAllocationNTD:round(planned,4),
    planPreviewSuggestedNotionalNTD:round(preview,4),
    capInducedReserveNTD:round(nominalDeployTarget-continuousCapped,4),
    thousandFloorShortfallNTD:round(continuousCapped-planned,4),
    shareFloorResidualNTD:round(planned-preview,4),
    totalNominalToPreviewShortfallNTD:round(nominalDeployTarget-preview,4),
    previewUtilizationPctOfPlanned:planned>0?round(preview/planned*100,6):null,
    previewUtilizationPctOfNominalTarget:nominalDeployTarget>0?round(preview/nominalDeployTarget*100,6):null,
    plannedProjectedStopRiskHHI:plannedRisk.length===details.length?hhi(plannedRisk):null,
    previewProjectedStopRiskHHI:previewRisk.length===details.length?hhi(previewRisk):null,
    previewMinusPlannedRiskHHI:(plannedRisk.length===details.length&&previewRisk.length===details.length)?round(hhi(previewRisk)-hhi(plannedRisk),8):null,
    plannedProjectedStopRiskNTD:plannedRisk.length===details.length?round(plannedRisk.reduce((a,b)=>a+b,0),4):null,
    previewProjectedStopRiskNTD:previewRisk.length===details.length?round(previewRisk.reduce((a,b)=>a+b,0),4):null,
    details,
    semantics:"PLAN_PREVIEW_GEOMETRY_ONLY. buyHigh share-floor notional is not actual order/fill/deployed capital."
  };
}

export function signalSideShareResidual({amount,price,suggestedShares}={}){
  const a=n(amount),p=n(price),q=n(suggestedShares);
  if(a===null||a<0||p===null||p<=0||!Number.isInteger(q)||q<0) return {status:"UNKNOWN"};
  const expected=Math.floor(a/p);
  if(expected!==q) return {status:"SHARE_RECONSTRUCTION_MISMATCH",expectedShares:expected,observedShares:q};
  const notional=q*p,residual=a-notional;
  return {
    status:"READY",amountNTD:a,price:p,suggestedShares:q,
    suggestedShareNotionalNTD:round(notional,4),
    residualCashNTD:round(residual,4),
    utilizationPct:a>0?round(notional/a*100,6):null,
    semantics:"SIGNAL_SIDE_SUGGESTED_NOTIONAL_ONLY; NOT BROKER EXECUTED NOTIONAL"
  };
}


export function quantizedComparatorPreview(plans=[],allocations=[]){
  const allocMap=new Map((allocations||[]).map(x=>[sym(x?.symbol??x?.code),n(x?.allocation??x?.totalAllocation)]));
  const rows=[];
  for(const p of plans||[]){
    const symbol=sym(p?.symbol??p?.code);
    const allocation=n(allocMap.get(symbol));
    const buyHigh=n(p?.buyHigh??p?.buy_high);
    const stop=n(p?.stop);
    if(!symbol||allocation===null||allocation<0||buyHigh===null||buyHigh<=0){
      return {status:"UNKNOWN",reason:"INCOMPLETE_COMPARATOR_GEOMETRY",symbol:symbol||null};
    }
    const firstAmount=Math.round(allocation*0.6);
    const secondAmount=allocation-firstAmount;
    const firstShares=Math.floor(firstAmount/buyHigh);
    const secondShares=Math.floor(secondAmount/buyHigh);
    const previewNotional=(firstShares+secondShares)*buyHigh;
    const residual=allocation-previewNotional;
    const riskPct=(stop!==null&&stop>0&&stop<buyHigh)?(buyHigh-stop)/buyHigh:null;
    rows.push({
      symbol,
      comparatorAllocationNTD:round(allocation,4),
      firstAmountNTD:firstAmount,
      secondAmountNTD:secondAmount,
      firstShares,
      secondShares,
      previewSuggestedNotionalNTD:round(previewNotional,4),
      shareFloorResidualNTD:round(residual,4),
      shareFloorResidualPctOfAllocation:allocation>0?round(residual/allocation*100,6):null,
      conservativeStopRiskPct:riskPct!==null?round(riskPct*100,6):null,
      previewProjectedStopRiskNTD:riskPct!==null?round(previewNotional*riskPct,4):null
    });
  }
  const risks=rows.map(x=>x.previewProjectedStopRiskNTD).filter(Number.isFinite);
  const hhi=xs=>{const total=xs.reduce((a,b)=>a+b,0);return total>0?round(xs.reduce((s,x)=>s+(x/total)**2,0),8):null;};
  return {
    status:"READY",
    researchOnly:true,
    decisionImpact:false,
    allocationTotalNTD:round(rows.reduce((s,x)=>s+x.comparatorAllocationNTD,0),4),
    previewSuggestedNotionalNTD:round(rows.reduce((s,x)=>s+x.previewSuggestedNotionalNTD,0),4),
    shareFloorResidualNTD:round(rows.reduce((s,x)=>s+x.shareFloorResidualNTD,0),4),
    previewProjectedStopRiskNTD:risks.length===rows.length?round(risks.reduce((a,b)=>a+b,0),4):null,
    previewProjectedStopRiskHHI:risks.length===rows.length?hhi(risks):null,
    rows,
    semantics:"COMPARATOR_PLAN_PREVIEW_GEOMETRY_ONLY; same 60/40 tranche and integer-share floor applied to comparator allocation. Not fills."
  };
}
