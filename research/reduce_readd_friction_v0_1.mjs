// D14 REDUCE -> RE-ADD friction accounting v0.1 — research-only.
// Current Formal runtime has REDUCE but no RE-ADD lifecycle state/signal.
// This module defines evidence boundaries and a simple completed same-quantity cycle identity only.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}
function text(v){return String(v??"").trim()}

export function classifyReduceReaddEvidence(input={}){
  const reduceSignalId=text(input.reduceSignalId);
  const readdSignalId=text(input.readdSignalId);
  const reduceFillId=text(input.reduceFillId);
  const readdFillId=text(input.readdFillId);
  const reduceLinked=input.reduceFillLinkedToSignal===true;
  const readdLinked=input.readdFillLinkedToSignal===true;
  const sameSymbol=text(input.reduceSymbol)&&text(input.reduceSymbol)===text(input.readdSymbol);
  const qSell=n(input.reduceShares),qBuy=n(input.readdShares);
  const sameQty=qSell!==null&&qBuy!==null&&qSell>0&&qSell===qBuy;
  const pSell=n(input.reduceFillPrice),pBuy=n(input.readdFillPrice);
  const actualPrices=pSell!==null&&pSell>0&&pBuy!==null&&pBuy>0;
  const costs=[input.reduceCommission,input.reduceTax,input.readdCommission].map(n);
  const costsComplete=costs.every(x=>x!==null&&x>=0);

  if(!reduceSignalId||!reduceFillId||!reduceLinked){
    return {status:"NOT_ATTRIBUTION_ELIGIBLE",reason:"REDUCE_SIGNAL_FILL_LINK_MISSING"};
  }
  if(!readdSignalId||!readdFillId||!readdLinked){
    return {status:"NOT_ATTRIBUTION_ELIGIBLE",reason:"READD_SIGNAL_FILL_LINK_MISSING"};
  }
  if(!sameSymbol) return {status:"NOT_ATTRIBUTION_ELIGIBLE",reason:"SYMBOL_MISMATCH"};
  if(!sameQty) return {status:"INVENTORY_ACCOUNTING_REQUIRED",reason:"REDUCE_READD_QUANTITY_MISMATCH"};
  if(!actualPrices) return {status:"MISSING_FILL_PRICE"};
  if(!costsComplete) return {status:"GROSS_ONLY_COST_EVIDENCE_INCOMPLETE"};

  const q=qSell;
  const grossTimingCapture=q*(pSell-pBuy);
  const explicitCosts=costs.reduce((a,b)=>a+b,0);
  const netTimingCapture=grossTimingCapture-explicitCosts;
  return {
    status:"ACTUAL_SAME_QUANTITY_CYCLE_READY",
    evidenceQuality:"ACTUAL_FILL_LINKED",
    shares:q,
    reduceFillPrice:pSell,
    readdFillPrice:pBuy,
    grossTimingCaptureNTD:round(grossTimingCapture,2),
    explicitCostsNTD:round(explicitCosts,2),
    netTimingCaptureNTD:round(netTimingCapture,2),
    breakEvenReaddPriceBeforeNewCosts:round(pSell-explicitCosts/q,6),
    rule:"Actual fill prices already embody realized execution price; do not subtract a second generic slippage charge. Signal-to-fill slippage may be reported separately as attribution diagnostics.",
    caveat:"This identity applies only to a completed same-symbol, same-quantity REDUCE->RE-ADD cycle. Quantity changes require inventory-aware accounting."
  };
}

export function modeledReduceReaddCycle({
  shares,reduceReferencePrice,readdReferencePrice,
  reduceCommission,readdCommission,reduceTax,
  reduceSlippageNTD,readdSlippageNTD,
  evidenceLabel="MODELED"
}={}){
  const q=n(shares),ps=n(reduceReferencePrice),pb=n(readdReferencePrice);
  const parts=[reduceCommission,readdCommission,reduceTax,reduceSlippageNTD,readdSlippageNTD].map(n);
  if(!(q>0)||!(ps>0)||!(pb>0)||parts.some(x=>x===null||x<0)) return {status:"UNKNOWN"};
  const gross=q*(ps-pb);
  const friction=parts.reduce((a,b)=>a+b,0);
  return {
    status:"MODELED_CYCLE_READY",
    evidenceQuality:String(evidenceLabel||"MODELED").toUpperCase(),
    grossTimingCaptureNTD:round(gross,2),
    modeledFrictionNTD:round(friction,2),
    modeledNetTimingCaptureNTD:round(gross-friction,2),
    semantics:"MODEL_ONLY_NOT_REALIZED_PNL"
  };
}
