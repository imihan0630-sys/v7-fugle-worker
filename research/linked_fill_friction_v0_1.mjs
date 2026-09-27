// Linked signal->fill friction metrics v0.1 — research-only.
// Requires prior attribution eligibility. Measures signal-to-fill price/time deltas only.
// Does NOT infer order submission, fill probability, or partial fill.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function ms(v){const t=Date.parse(v||"");return Number.isFinite(t)?t:null}
function text(v){return String(v??"").trim()}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function linkedFillFriction(fill={},signal={}){
  const action=text(fill.action).toUpperCase();
  const sigType=text(signal.signalType).toUpperCase();
  const fillPrice=n(fill.fillPrice);
  const signalPrice=n(signal.marketPrice);
  const fillTime=ms(fill.effectiveAt);
  const confirmTime=ms(fill.confirmedAt);
  const signalTime=ms(signal.occurredAt);

  if(!["BUY","ADD","REDUCE","SELL"].includes(action)) return {status:"UNKNOWN",reason:"INVALID_ACTION"};
  if(fillPrice===null||fillPrice<=0||signalPrice===null||signalPrice<=0||fillTime===null||signalTime===null) {
    return {status:"UNKNOWN",reason:"MISSING_PRICE_OR_EVENT_TIME"};
  }
  if(fillTime<signalTime) return {status:"UNKNOWN",reason:"FILL_PRECEDES_SIGNAL"};

  const buySide=action==="BUY"||action==="ADD";
  const compatible=buySide?["BUY","ADD"].includes(sigType):["REDUCE","SELL","STOP_LOSS"].includes(sigType);
  if(!compatible) return {status:"UNKNOWN",reason:"ACTION_SIGNAL_TYPE_INCOMPATIBLE"};

  const adverseBps=buySide
    ? (fillPrice-signalPrice)/signalPrice*10000
    : (signalPrice-fillPrice)/signalPrice*10000;

  return {
    status:"READY",
    researchOnly:true,
    signalToFillLatencyMs:fillTime-signalTime,
    confirmationLagMs:confirmTime!==null&&confirmTime>=fillTime?confirmTime-fillTime:null,
    signalPrice,
    fillPrice,
    adverseSlippageBps:round(adverseBps,4),
    favorableSlippageBps:round(-adverseBps,4),
    filledShares:n(fill.filledShares),
    orderSubmissionKnown:false,
    fillProbabilityKnown:false,
    partialFillKnown:false,
    interpretation:"Price/time delta between a positively linked Formal signal and confirmed fill. Positive adverseSlippageBps means worse than signal price for the trade direction. Without order-submission evidence, filledShares cannot establish fill probability or partial-fill status."
  };
}
