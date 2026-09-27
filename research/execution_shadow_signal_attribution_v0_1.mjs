// V8.8 execution-shadow FORMAL_SIGNAL_OBSERVED attribution classifier.
// Research-only fail-closed parser; does not alter runtime or Formal decisions.

function txt(v){return String(v??"").trim()}

export function classifyExecutionShadowSignalAttribution(row={}){
  const eventType=txt(row.event_type??row.eventType);
  const eventKey=txt(row.event_key??row.eventKey);
  const symbol=txt(row.symbol);
  if(eventType!=="FORMAL_SIGNAL_OBSERVED"){
    return {status:"NOT_FORMAL_SIGNAL_CONTEXT",positiveSymbolSignal:false,signalTypes:[]};
  }
  if(!eventKey||eventKey==="SIGNAL"){
    return {
      status:"GENERIC_CROSS_SYMBOL_CONTEXT_ONLY",
      positiveSymbolSignal:false,
      signalTypes:[],
      reason:"V8.8 globally emits FORMAL_SIGNAL_OBSERVED when any notification exists; generic SIGNAL does not identify a signal for this symbol."
    };
  }
  const ids=eventKey.split("|").map(txt).filter(Boolean);
  const parsed=[];
  for(const id of ids){
    const p=id.split(":");
    if(p.length<5) return {status:"UNPARSABLE_SIGNAL_EVENT_KEY",positiveSymbolSignal:false,signalTypes:[]};
    parsed.push({id,tradeDate:p[0],symbol:p[1],positionStage:p[2],signalType:p[3],episode:p.slice(4).join(":")});
  }
  if(!symbol||parsed.some(x=>x.symbol!==symbol)){
    return {status:"SYMBOL_SIGNAL_ID_MISMATCH",positiveSymbolSignal:false,signalTypes:[],parsed};
  }
  return {
    status:"SYMBOL_SPECIFIC_SIGNAL_CONTEXT",
    positiveSymbolSignal:true,
    signalTypes:[...new Set(parsed.map(x=>x.signalType))],
    signalIds:ids,
    parsed,
    caveat:"Context row is not a broker fill and does not replace V8 trade-journal signal provenance."
  };
}
