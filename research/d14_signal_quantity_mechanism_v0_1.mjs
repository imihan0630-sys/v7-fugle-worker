// D14 signal-side quantity/quantization mechanism classifier v0.1 — research-only.
// Classifies suggested quantity geometry only. It does not assert an order submission or broker fill.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function classifySignalQuantityMechanism({amount,price,suggestedShares}={}){
  const a=n(amount),p=n(price),q=n(suggestedShares);
  if(a===null||a<0||p===null||p<=0||!Number.isInteger(q)||q<0){
    return {status:"UNKNOWN",benchmarkEligible:false};
  }
  const expected=Math.floor(a/p);
  if(expected!==q){
    return {status:"SHARE_RECONSTRUCTION_MISMATCH",benchmarkEligible:false,expectedShares:expected,observedShares:q};
  }
  const notional=q*p;
  const residual=a-notional;
  let quantityClass;
  if(q===0) quantityClass="ZERO_SHARE_NONORDERABLE";
  else if(q<1000) quantityClass="ODD_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED";
  else if(q%1000===0) quantityClass="REGULAR_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED";
  else quantityClass="MIXED_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED";

  const needsOdd=quantityClass==="ODD_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED" ||
    quantityClass==="MIXED_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED";
  return {
    status:q===0?"NONORDERABLE":"READY",
    researchOnly:true,
    decisionImpact:false,
    amountNTD:a,
    signalPrice:p,
    suggestedShares:q,
    suggestedShareNotionalNTD:round(notional,4),
    quantizationResidualCashNTD:round(residual,4),
    quantizationResidualPctOfAmount:a>0?round(residual/a*100,6):null,
    utilizationPct:a>0?round(notional/a*100,6):null,
    theoreticalResidualUpperBoundExclusiveNTD:p,
    theoreticalResidualUpperBoundPctOfAmount:a>0?round(p/a*100,6):null,
    quantityClass,
    oddLotBenchmarkRequiredIfSubmittedUnchanged:needsOdd,
    defaultRegularLotQuoteMechanismCompatible:!needsOdd && q>0,
    benchmarkEligible:false,
    benchmarkReason:q===0
      ?"NO_POSITIVE_SUGGESTED_QUANTITY"
      :(needsOdd
        ?"ODD_OR_MIXED_QUANTITY_REQUIRES_MECHANISM_MATCHED_ODD_LOT_QUOTE_AND_ORDER_EVIDENCE"
        :"REGULAR_QUANTITY_STILL_REQUIRES_ORDER_AND_FILL_PROVENANCE"),
    semantics:"Suggested quantity geometry only. quantityClass is conditional on submitting the suggestion unchanged; it is not evidence of actual order channel, submission, fill, slippage or commission."
  };
}
