// Signal trigger provenance classifier v0.2 — research-only.
// Separates positive formal-signal evidence from complete-denominator and fill evidence.
// No runtime imports, no storage access, no decision impact.

function text(v){return String(v??"").trim()}
function finite(v){const x=Number(v);return Number.isFinite(x)?x:null}

export function classifySignalTriggerEvidence(raw={}){
  const source=text(raw.sourceType).toUpperCase();
  const signalType=text(raw.signalType).toUpperCase();
  const hasSignalId=Boolean(text(raw.signalId||raw.eventId));
  const hasTradeDate=Boolean(text(raw.tradeDate));
  const hasSymbol=Boolean(text(raw.symbol));
  const marketPrice=finite(raw.marketPrice??raw.currentPrice);
  const occurredAt=Date.parse(raw.occurredAt||raw.emittedAt||"");

  if(source==="V8_TRADE_JOURNAL_SIGNAL"){
    const positiveReady=hasSignalId&&hasTradeDate&&hasSymbol&&signalType==="BUY"&&marketPrice!==null&&Number.isFinite(occurredAt);
    return {
      status:positiveReady?"EXACT_POSITIVE_FORMAL_BUY_SIGNAL":"INCOMPLETE_FORMAL_SIGNAL_ROW",
      exactPositiveTriggerPrice:positiveReady,
      supportsNoBuyAbsence:false,
      proves:positiveReady?[
        "formal BUY signal occurrence",
        "event identity",
        "trade date/symbol",
        "persisted formal signal market_price",
        "signal occurrence timestamp"
      ]:[],
      caveats:[
        "row is written before push delivery; it does not prove phone/webhook acceptance",
        "signal_shares is the signal/plan shares field, not the live push suggestedShares recomputed at currentPrice",
        "writer failure is non-blocking, so missing row cannot prove no signal",
        "bulk /api/journal reader has LIMIT 6000 without truncation flag"
      ],
      doesNotProve:["broker fill","fill price","fill probability","slippage","complete NO-BUY denominator"]
    };
  }

  if(source==="V7_SIGNAL_DELIVERY_STATE"){
    const barTime=Date.parse(raw.entryBarTime||raw.lastEntrySignalBarTime||"");
    return {
      status:"EPISODE_STATE_ONLY",
      exactPositiveTriggerPrice:false,
      supportsNoBuyAbsence:false,
      proves:[
        ...(hasSignalId?["a reserved/pending signal identity may have existed"]:[]),
        ...(Number.isFinite(barTime)?["entry 15m bar time/state"]:[]),
        "dedupe/episode state"
      ],
      caveats:["successful pending payload is removed after accepted delivery"],
      doesNotProve:["exact historical BUY market_price","broker fill","complete NO-BUY denominator"]
    };
  }

  if(source==="V7_LIVE_STATE"||source==="LAST_MONITOR_KV"){
    return {
      status:"EPHEMERAL_CURRENT_SNAPSHOT",
      exactPositiveTriggerPrice:false,
      supportsNoBuyAbsence:false,
      proves:["only the currently retained monitor snapshot when still available"],
      doesNotProve:["complete historical BUY/NO-BUY coverage","broker fill"]
    };
  }

  if(source==="BAR_RECONSTRUCTION"){
    return {
      status:"APPROXIMATE_BAR_CONTEXT_ONLY",
      exactPositiveTriggerPrice:false,
      supportsNoBuyAbsence:false,
      proves:["historical bar context only"],
      doesNotProve:["exact quote market_price recorded at signal occurrence","broker fill"]
    };
  }

  return {status:"UNKNOWN",exactPositiveTriggerPrice:false,supportsNoBuyAbsence:false,proves:[],doesNotProve:[]};
}
