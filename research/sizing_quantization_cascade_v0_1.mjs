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
    secondShares:n(p?.secondShares??p?.second_shares)
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
      continuousToPreviewShortfallNTD:round(continuousAllocation-previewSuggestedNotional,4)
    });
  }

  if(details.some(x=>!x.trancheContractMatches)){
    return {status:"PLAN_TRANCHE_RECONSTRUCTION_MISMATCH",details};
  }

  const nominalDeployTarget=capital*deployRatio;
  const continuousCapped=details.reduce((s,x)=>s+x.continuousAllocationNTD,0);
  const planned=details.reduce((s,x)=>s+x.plannedAllocationNTD,0);
  const preview=details.reduce((s,x)=>s+x.previewSuggestedNotionalNTD,0);

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
