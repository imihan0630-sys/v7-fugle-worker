// Execution attribution linkage v0.1 — research-only.
// Separates ledger-valid execution evidence from execution that is attributable to a durable Formal signal.

function text(v){return String(v??"").trim()}
function isoMs(v){const t=Date.parse(v||"");return Number.isFinite(t)?t:null}

export function classifyExecutionAttribution(fill={},signal={}){
  const eventKind=text(fill.eventKind).toUpperCase();
  const action=text(fill.action).toUpperCase();
  const signalEventId=text(fill.signalEventId);
  const fillSymbol=text(fill.symbol);
  const fillPlanDate=text(fill.planScanDate);
  const fillEffective=isoMs(fill.effectiveAt);

  if(eventKind!=="FILL") return {status:"NOT_FILL",ledgerUsable:true,attributionEligible:false};
  if(!["BUY","ADD","REDUCE","SELL"].includes(action)) return {status:"INVALID_FILL_ACTION",ledgerUsable:false,attributionEligible:false};

  if(!signalEventId){
    return {
      status:"UNATTRIBUTED_EXECUTION",
      ledgerUsable:true,
      attributionEligible:false,
      reason:"signalEventId absent; valid for holdings ledger if other ledger checks pass, but not for Formal-signal execution attribution"
    };
  }

  const sigId=text(signal.eventId||signal.signalId);
  const sigType=text(signal.signalType).toUpperCase();
  const sigSymbol=text(signal.symbol);
  const sigPlanDate=text(signal.planScanDate);
  const sigTime=isoMs(signal.occurredAt);
  const compatible=(action==="BUY"&&sigType==="BUY")||(action==="ADD"&&sigType==="ADD")||
    (action==="REDUCE"&&sigType==="REDUCE")||(action==="SELL"&&["SELL","STOP_LOSS"].includes(sigType));

  const reasons=[];
  if(signalEventId!==sigId) reasons.push("SIGNAL_EVENT_ID_MISMATCH");
  if(!compatible) reasons.push("ACTION_SIGNAL_TYPE_MISMATCH");
  if(!fillSymbol||fillSymbol!==sigSymbol) reasons.push("SYMBOL_MISMATCH");
  if(!fillPlanDate||fillPlanDate!==sigPlanDate) reasons.push("PLAN_SCAN_DATE_MISMATCH");
  if(fillEffective===null||sigTime===null) reasons.push("INVALID_EVENT_TIME");
  else if(fillEffective<sigTime) reasons.push("FILL_PRECEDES_SIGNAL");

  return {
    status:reasons.length?"ATTRIBUTION_REJECTED":"ATTRIBUTION_ELIGIBLE",
    ledgerUsable:true,
    attributionEligible:reasons.length===0,
    reasons,
    signalEventId,
    action,
    signalType:sigType
  };
}
