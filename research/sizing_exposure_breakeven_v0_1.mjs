// Exposure-layer break-even algebra v0.1 — research-only.
// Derives the return equation at a declared exposure layer without reading outcomes.
// Cash residual is explicit; no hidden zero-deployment assumption.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=8){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function deriveExposureBreakEven(current=[],comparator=[],budgetNTD,{layer="UNSPECIFIED"}={}){
  const budget=n(budgetNTD);
  if(!(budget>0)) return {status:"UNKNOWN",reason:"INVALID_BUDGET"};
  const cur=new Map(),cmp=new Map();
  for(const r of current||[]){
    const s=sym(r?.symbol??r?.code),e=n(r?.exposureNTD??r?.allocationNTD??r?.notionalNTD);
    if(!s||e===null||e<0) return {status:"UNKNOWN",reason:"INVALID_CURRENT_EXPOSURE",symbol:s||null};
    if(cur.has(s)) return {status:"UNKNOWN",reason:"DUPLICATE_CURRENT_SYMBOL",symbol:s};
    cur.set(s,e);
  }
  for(const r of comparator||[]){
    const s=sym(r?.symbol??r?.code),e=n(r?.exposureNTD??r?.allocationNTD??r?.notionalNTD);
    if(!s||e===null||e<0) return {status:"UNKNOWN",reason:"INVALID_COMPARATOR_EXPOSURE",symbol:s||null};
    if(cmp.has(s)) return {status:"UNKNOWN",reason:"DUPLICATE_COMPARATOR_SYMBOL",symbol:s};
    cmp.set(s,e);
  }
  const symbols=[...new Set([...cur.keys(),...cmp.keys()])].sort();
  if(symbols.length<2||symbols.some(s=>!cur.has(s)||!cmp.has(s))) return {status:"UNKNOWN",reason:"SYMBOL_SET_MISMATCH"};
  const curTotal=[...cur.values()].reduce((a,b)=>a+b,0),cmpTotal=[...cmp.values()].reduce((a,b)=>a+b,0);
  if(curTotal>budget+1e-6||cmpTotal>budget+1e-6) return {status:"UNKNOWN",reason:"EXPOSURE_EXCEEDS_BUDGET"};
  const cashCurrent=budget-curTotal,cashComparator=budget-cmpTotal,cashDelta=cashCurrent-cashComparator;
  const terms=symbols.map(s=>({symbol:s,currentExposureNTD:cur.get(s),comparatorExposureNTD:cmp.get(s),deltaExposureNTD:cur.get(s)-cmp.get(s)}));
  const positive=terms.filter(x=>x.deltaExposureNTD>1e-8),negative=terms.filter(x=>x.deltaExposureNTD<-1e-8),flat=terms.filter(x=>Math.abs(x.deltaExposureNTD)<=1e-8);
  const output={
    status:"READY",researchOnly:true,decisionImpact:false,layer:String(layer),
    budgetNTD:round(budget,4),currentExposureTotalNTD:round(curTotal,4),comparatorExposureTotalNTD:round(cmpTotal,4),
    currentCashNTD:round(cashCurrent,4),comparatorCashNTD:round(cashComparator,4),cashDeltaNTD:round(cashDelta,4),
    terms:terms.map(x=>({...x,deltaExposureNTD:round(x.deltaExposureNTD,4)})),
    positiveTiltSymbols:positive.map(x=>x.symbol),negativeTiltSymbols:negative.map(x=>x.symbol),flatSymbols:flat.map(x=>x.symbol),
    identity:"incrementalPaperPnL = sum(deltaExposure_i * R_i) + cashDelta * R_cash",
    semantics:"Break-even algebra only. R_i are future fixed-cohort path returns at the declared exposure layer; no outcome, fill, fee, tax or slippage is inferred."
  };
  if(positive.length===1){
    const d=positive[0].deltaExposureNTD;
    output.singlePositiveThreshold={
      symbol:positive[0].symbol,
      negativeReturnCoefficients:negative.map(x=>({symbol:x.symbol,coefficient:round(Math.abs(x.deltaExposureNTD)/d,10)})),
      cashReturnCoefficient:round(-cashDelta/d,10),
      coefficientSumExcludingCash:round(negative.reduce((s,x)=>s+Math.abs(x.deltaExposureNTD)/d,0),10),
      formula:"R_"+positive[0].symbol+" > sum(coef_i * R_i) + cashCoef * R_cash",
      note:"cashCoef uses the same formula sign: positive means the positive-tilt symbol must additionally beat positive cash return; negative means current has more cash and the threshold is lower."
    };
  }
  return output;
}
