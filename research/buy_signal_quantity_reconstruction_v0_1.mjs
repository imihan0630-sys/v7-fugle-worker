// Positive BUY signal quantity reconstruction v0.1 — research-only.
// Reconstructs the live push suggestedShares from durable V8.5 signal evidence.
// This is signal-side quantity, not broker execution evidence.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function text(v){return String(v??"").trim()}

export function reconstructBuySuggestedShares(raw={}){
  const source=text(raw.sourceType).toUpperCase();
  const signalType=text(raw.signalType).toUpperCase();
  const eventId=text(raw.eventId||raw.signalId);
  const symbol=text(raw.symbol);
  const occurredAt=Date.parse(raw.occurredAt||"");
  const amount=n(raw.signalAmount??raw.amount);
  const price=n(raw.marketPrice??raw.currentPrice);

  if(source!=="V8_TRADE_JOURNAL_SIGNAL"){
    return {status:"UNKNOWN_SOURCE",reconstructable:false};
  }
  if(signalType!=="BUY"){
    return {status:"NOT_INITIAL_BUY",reconstructable:false};
  }
  if(!eventId||!symbol||!Number.isFinite(occurredAt)||amount===null||amount<0||price===null||price<=0){
    return {status:"INCOMPLETE_POSITIVE_BUY_ROW",reconstructable:false};
  }

  const suggestedShares=Math.floor(amount/price);
  return {
    status:"RECONSTRUCTED_SIGNAL_SUGGESTED_SHARES",
    reconstructable:true,
    eventId,symbol,
    signalAmountNTD:amount,
    marketPrice:price,
    suggestedShares,
    orderable:suggestedShares>=1,
    semantics:"Exact reconstruction of buildPushPayload BUY suggestedShares = sharesFor(signal.amount,currentPrice) from the same persisted positive signal event. Not a broker order/fill."
  };
}
