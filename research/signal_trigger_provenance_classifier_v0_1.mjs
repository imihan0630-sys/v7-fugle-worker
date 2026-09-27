// Signal trigger provenance classifier v0.1 — research-only.
// Separates exact historical trigger evidence from current-state / dedupe evidence.
// No runtime imports, no storage access, no decision impact.

function text(v){return String(v??"").trim()}
function finite(v){const x=Number(v);return Number.isFinite(x)?x:null}

export function classifySignalTriggerEvidence(raw={}){
  const source=text(raw.sourceType).toUpperCase();
  const signalType=text(raw.signalType).toUpperCase();
  const hasSignalId=Boolean(text(raw.signalId));
  const hasTradeDate=Boolean(text(raw.tradeDate));
  const hasSymbol=Boolean(text(raw.symbol));
  const currentPrice=finite(raw.currentPrice);
  const suggestedAmount=finite(raw.suggestedAmount);
  const suggestedShares=finite(raw.suggestedShares);
  const emittedAt=Date.parse(raw.emittedAt||raw.reservedAt||"");
  const barTime=Date.parse(raw.entryBarTime||raw.lastEntrySignalBarTime||"");
  const appendOnly=raw.appendOnly===true;
  const historicalStable=raw.historicalStable===true;
  const payloadComplete=hasSignalId&&hasTradeDate&&hasSymbol&&signalType==="BUY"&&currentPrice!==null&&suggestedAmount!==null&&suggestedShares!==null&&Number.isFinite(emittedAt);

  if(appendOnly&&historicalStable&&payloadComplete){
    return {
      status:"EXACT_BUY_TRIGGER_PAYLOAD",
      promotionGradeForTriggerPrice:true,
      proves:["BUY signal identity","trade date/symbol","exact persisted signal currentPrice","suggested amount/shares","emission/reservation timestamp"],
      doesNotProve:["broker fill","fill price","fill probability","slippage"]
    };
  }

  if(source==="V7_SIGNAL_DELIVERY_STATE"){
    return {
      status:"EPISODE_STATE_ONLY",
      promotionGradeForTriggerPrice:false,
      proves:[
        ...(hasSignalId?["a reserved/pending signal identity may have existed"]:[]),
        ...(Number.isFinite(barTime)?["entry 15m bar time/state"]:[]),
        "dedupe/episode state"
      ],
      missing:["durable successful BUY payload","exact historical currentPrice","historical append-only signal event"],
      doesNotProve:["exact BUY trigger quote","broker fill","fill price"]
    };
  }

  if(source==="V7_LIVE_STATE"||source==="LAST_MONITOR_KV"){
    return {
      status:"EPHEMERAL_CURRENT_SNAPSHOT",
      promotionGradeForTriggerPrice:false,
      proves:["only the currently retained monitor snapshot when still available"],
      missing:["append-only historical coverage"],
      doesNotProve:["complete historical BUY trigger coverage","broker fill"]
    };
  }

  if(source==="BAR_RECONSTRUCTION"){
    return {
      status:"APPROXIMATE_BAR_CONTEXT_ONLY",
      promotionGradeForTriggerPrice:false,
      proves:Number.isFinite(barTime)?["historical bar context"]:[],
      missing:["quote observed at signal emission"],
      doesNotProve:["exact BUY payload currentPrice","broker fill"]
    };
  }

  return {status:"UNKNOWN",promotionGradeForTriggerPrice:false,proves:[],missing:["recognized evidence contract"]};
}
