import {scoreCapReserve} from "./score_cap_reserve_v0_1.mjs";

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function planReserveLadder(plans=[],totalCapital){
  const capital=n(totalCapital);
  if(!(capital>0)) return {status:"UNKNOWN",reason:"INVALID_TOTAL_CAPITAL"};
  const cap=scoreCapReserve(plans,capital);
  if(!["READY","NO_SELECTED"].includes(cap?.status)) return {status:"UNKNOWN",reason:"CAP_RESERVE_UNAVAILABLE",capStatus:cap?.status};

  if(cap.status==="NO_SELECTED"){
    return {
      status:"READY",selectedCount:0,totalCapitalNTD:capital,
      designedStrategicReserveNTD:capital,capInducedReserveNTD:0,thousandFloorReserveNTD:0,
      plannedAllocationNTD:0,planPreviewShareResidualNTD:0,planPreviewSuggestedNotionalNTD:0,
      totalPlanPreviewReserveNTD:capital,previewUtilizationPctOfCapital:0,
      actualBrokerCash:"UNKNOWN_WITHOUT_ACCOUNT_EXECUTION_EVIDENCE",
      semantics:"Zero-selected plan: all modeled capital remains strategic reserve at plan level. This is not a broker cash balance."
    };
  }

  const rows=(plans||[]).map(p=>({
    symbol:sym(p?.symbol??p?.code),
    allocation:n(p?.totalAllocation??p?.total_allocation),
    buyHigh:n(p?.buyHigh??p?.buy_high),
    firstShares:n(p?.firstShares??p?.first_shares),
    secondShares:n(p?.secondShares??p?.second_shares),
    firstAmount:n(p?.firstAmount??p?.first_amount),
    secondAmount:n(p?.secondAmount??p?.second_amount)
  }));
  const previewComplete=rows.every(x=>x.symbol&&x.allocation!==null&&x.allocation>=0&&x.buyHigh>0&&Number.isInteger(x.firstShares)&&x.firstShares>=0&&Number.isInteger(x.secondShares)&&x.secondShares>=0);
  const preview=previewComplete?rows.reduce((s,x)=>s+(x.firstShares+x.secondShares)*x.buyHigh,0):null;
  const shareResidual=previewComplete?cap.plannedAllocationNTD-preview:null;
  const designed=capital-cap.nominalDeployTargetNTD;
  const totalPreviewReserve=previewComplete?capital-preview:null;

  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    selectedCount:cap.selectedCount,totalCapitalNTD:capital,
    nominalDeployTargetNTD:cap.nominalDeployTargetNTD,
    designedStrategicReserveNTD:round(designed,4),
    designedStrategicReservePctOfCapital:round(designed/capital*100,6),
    capInducedReserveNTD:cap.capInducedReserveNTD,
    thousandFloorReserveNTD:cap.thousandFloorReserveNTD,
    plannedAllocationNTD:cap.plannedAllocationNTD,
    planPreviewSuggestedNotionalNTD:previewComplete?round(preview,4):null,
    planPreviewShareResidualNTD:previewComplete?round(shareResidual,4):null,
    totalPlanPreviewReserveNTD:previewComplete?round(totalPreviewReserve,4):null,
    previewUtilizationPctOfCapital:previewComplete?round(preview/capital*100,6):null,
    reserveIdentityResidualNTD:previewComplete?round(totalPreviewReserve-designed-cap.capInducedReserveNTD-cap.thousandFloorReserveNTD-shareResidual,8):null,
    capBindingSymbols:cap.capBindingSymbols,
    previewStatus:previewComplete?"KNOWN":"UNKNOWN",
    actualBrokerCash:"UNKNOWN_WITHOUT_ACCOUNT_EXECUTION_EVIDENCE",
    rows,
    semantics:"Plan-level reserve ladder only: designed strategic reserve + cap clipping reserve + NT$1,000 floor reserve + plan-preview integer-share residual. None is an actual broker cash balance or fill."
  };
}

export function initialBuySignalBudgetSnapshot(plan={},signal={}){
  const symbol=sym(plan?.symbol??plan?.code),sigSymbol=sym(signal?.symbol);
  const type=String(signal?.signalType??signal?.signal_type??"").toUpperCase().trim();
  const allocation=n(plan?.totalAllocation??plan?.total_allocation);
  const firstAmount=n(plan?.firstAmount??plan?.first_amount);
  const secondAmount=n(plan?.secondAmount??plan?.second_amount);
  const signalAmount=n(signal?.signalAmount??signal?.signal_amount);
  const price=n(signal?.marketPrice??signal?.market_price);
  if(!symbol||symbol!==sigSymbol||type!=="BUY"||allocation===null||firstAmount===null||secondAmount===null||signalAmount===null||!(price>0)){
    return {status:"UNKNOWN",reason:"INCOMPLETE_OR_MISMATCHED_INITIAL_BUY"};
  }
  const shares=Math.floor(signalAmount/price);
  const suggestedNotional=shares*price;
  return {
    status:"READY",researchOnly:true,decisionImpact:false,symbol,
    plannedAllocationNTD:allocation,
    firstTrancheBudgetNTD:firstAmount,
    secondTrancheBudgetNTD:secondAmount,
    signalAmountNTD:signalAmount,
    signalAmountMatchesFirstTranche:Math.abs(signalAmount-firstAmount)<1e-8,
    liveSuggestedShares:shares,
    liveSuggestedNotionalNTD:round(suggestedNotional,4),
    liveSignalShareResidualNTD:round(signalAmount-suggestedNotional,4),
    plannedBudgetNotInInitialBuySignalNTD:round(allocation-signalAmount,4),
    plannedBudgetNotInInitialBuySignalPctOfPlan:allocation>0?round((allocation-signalAmount)/allocation*100,6):null,
    semantics:"Signal-side budget snapshot only. The second-tranche budget is staged for a possible later ADD; the BUY signal does not prove order submission or cash deployment."
  };
}

export function theoreticalFirstStageCapitalCeiling(selectedCount,{firstTrancheRatio=0.6}={}){
  const k=Number(selectedCount),r=n(firstTrancheRatio);
  if(!Number.isInteger(k)||k<0||r===null||r<0||r>1) return null;
  const deploy=k<=0?0:k===1?0.35:k===2?0.60:0.85;
  return {
    selectedCount:k,
    nominalFullPlanDeployPct:round(deploy*100,6),
    nominalInitialStagePct:round(deploy*r*100,6),
    nominalFutureAddStagePct:round(deploy*(1-r)*100,6),
    designedStrategicReservePct:round((1-deploy)*100,6),
    caveat:"Ceiling before cap clipping, NT$1,000 flooring, share flooring, trigger failure and fill uncertainty."
  };
}
