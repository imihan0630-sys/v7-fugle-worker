// Counterfactual initial-BUY orderability v0.1 — research-only.
// Uses the shared observed initial BUY trigger price, but recomputes amount/shares under an alternative allocator.
// No fill probability or fill price is inferred.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=2){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function counterfactualInitialBuyOrderability(comparatorAllocations=[],buyTriggers=[],{firstTrancheRatio=0.6}={}){
  const ratio=n(firstTrancheRatio);
  if(ratio===null||ratio<=0||ratio>1) return {status:"UNKNOWN",reason:"INVALID_FIRST_TRANCHE_RATIO"};
  const alloc=new Map((comparatorAllocations||[]).map(x=>[sym(x?.symbol??x?.code),n(x?.allocation??x?.totalAllocation)]));
  const rows=[];
  for(const t of buyTriggers||[]){
    const symbol=sym(t?.symbol??t?.code);
    const price=n(t?.triggerPrice??t?.currentPrice??t?.marketPrice);
    const allocation=n(alloc.get(symbol));
    if(!symbol||price===null||price<=0||allocation===null||allocation<0){
      return {status:"UNKNOWN",reason:"MISSING_TRIGGER_PRICE_OR_COMPARATOR_ALLOCATION",symbol:symbol||null};
    }
    const firstAmount=Math.round(allocation*ratio);
    const shares=Math.floor(firstAmount/price);
    rows.push({
      symbol,
      triggerPrice:round(price,4),
      comparatorAllocationNTD:round(allocation,2),
      firstTrancheRatio:ratio,
      counterfactualFirstAmountNTD:firstAmount,
      counterfactualSuggestedShares:shares,
      orderable:shares>=1
    });
  }
  if(!rows.length) return {status:"NO_BUY_TRIGGERS",rows:[]};
  const zero=rows.filter(x=>!x.orderable).map(x=>x.symbol);
  return {
    status:zero.length?"COUNTERFACTUAL_ZERO_SHARES":"ORDERABLE",
    researchOnly:true,decisionImpact:false,
    triggerTimingAssumption:"Uses the same initial BUY trigger timestamp only under PR-045 allocation-invariance contract.",
    zeroShareSymbols:zero,
    rows,
    interpretation:"Orderability only. Recomputed shares at the observed BUY trigger price do not imply a fill, fill price, slippage, or execution probability."
  };
}
