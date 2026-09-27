// Confirmed Fill Ledger v0.2.1 — bootstrap + PIT + plan provenance.
// Class-A research-only. No Production imports or decision effects.

function n(v){const x=Number(v);return Number.isFinite(x)?x:null;}
function i(v){const x=Number(v);return Number.isInteger(x)?x:null;}
function iso(v){const t=Date.parse(v);return Number.isFinite(t)?new Date(t).toISOString():null;}
function nonneg(v){const x=i(v);return x!==null&&x>=0?x:null;}
function positive(v){const x=n(v);return x!==null&&x>0?x:null;}
function date(v){const s=String(v||"").trim();return /^\d{4}-\d{2}-\d{2}$/.test(s)?s:null;}

export const EVENT_KINDS=["POSITION_BASELINE","FILL"];
export const FILL_ACTIONS=["BUY","ADD","REDUCE","SELL"];
export const SOURCES=["BROKER_IMPORT","MANUAL_CONFIRMED","VERIFIED_EXTERNAL"];

export function validateLedgerEvent(raw={}){
  const errors=[];
  const ledgerEventId=String(raw.ledgerEventId||"").trim();
  const ledgerEpochId=String(raw.ledgerEpochId||"").trim();
  const eventKind=String(raw.eventKind||"").toUpperCase().trim();
  const accountKey=String(raw.accountKey||"").trim();
  const symbol=String(raw.symbol||"").trim();
  const source=String(raw.source||"").toUpperCase().trim();
  const sourceRecordId=String(raw.sourceRecordId||"").trim();
  const effectiveAt=iso(raw.effectiveAt);
  const confirmedAt=iso(raw.confirmedAt);
  const status=String(raw.reconciliationStatus||"CONFIRMED").toUpperCase().trim();
  const correctsLedgerEventId=raw.correctsLedgerEventId==null?null:String(raw.correctsLedgerEventId).trim();
  const sharesAfter=nonneg(raw.sharesAfter);
  const averageCostAfter=raw.averageCostAfter==null?null:positive(raw.averageCostAfter);
  const planScanDate=raw.planScanDate==null||raw.planScanDate===""?null:date(raw.planScanDate);

  if(!ledgerEventId) errors.push("LEDGER_EVENT_ID_REQUIRED");
  if(!ledgerEpochId) errors.push("LEDGER_EPOCH_ID_REQUIRED");
  if(!EVENT_KINDS.includes(eventKind)) errors.push("INVALID_EVENT_KIND");
  if(!accountKey) errors.push("ACCOUNT_KEY_REQUIRED");
  if(!symbol) errors.push("SYMBOL_REQUIRED");
  if(!SOURCES.includes(source)) errors.push("INVALID_SOURCE");
  if(!sourceRecordId) errors.push("SOURCE_RECORD_ID_REQUIRED");
  if(!effectiveAt) errors.push("EFFECTIVE_AT_REQUIRED");
  if(!confirmedAt) errors.push("CONFIRMED_AT_REQUIRED");
  if(effectiveAt&&confirmedAt&&Date.parse(confirmedAt)<Date.parse(effectiveAt)) errors.push("CONFIRMED_BEFORE_EFFECTIVE");
  if(!["CONFIRMED","CORRECTED"].includes(status)) errors.push("INVALID_RECONCILIATION_STATUS");
  if(status==="CORRECTED"&&!correctsLedgerEventId) errors.push("CORRECTION_TARGET_REQUIRED");
  if(status==="CONFIRMED"&&correctsLedgerEventId) errors.push("CONFIRMED_EVENT_CANNOT_CORRECT");
  if(sharesAfter===null) errors.push("SHARES_AFTER_REQUIRED");
  if(sharesAfter!==null&&sharesAfter>0&&averageCostAfter===null) errors.push("AVERAGE_COST_AFTER_REQUIRED_FOR_OPEN_POSITION");
  if(sharesAfter===0&&raw.averageCostAfter!=null) errors.push("CLOSED_POSITION_AVERAGE_COST_MUST_BE_NULL");

  let action=null,filledShares=null,fillPrice=null,sharesBefore=null,signalEventId=null;
  if(eventKind==="POSITION_BASELINE"){
    if(raw.action!=null||raw.filledShares!=null||raw.fillPrice!=null||raw.sharesBefore!=null){
      errors.push("BASELINE_MUST_NOT_PRETEND_TO_BE_FILL");
    }
    if(raw.planScanDate!=null&&raw.planScanDate!==""&&!planScanDate) errors.push("INVALID_OPTIONAL_PLAN_SCAN_DATE");
  } else if(eventKind==="FILL"){
    action=String(raw.action||"").toUpperCase().trim();
    filledShares=positive(raw.filledShares);
    fillPrice=positive(raw.fillPrice);
    sharesBefore=nonneg(raw.sharesBefore);
    signalEventId=raw.signalEventId==null?null:String(raw.signalEventId).trim();
    if(!planScanDate) errors.push("PLAN_SCAN_DATE_REQUIRED_FOR_FILL");
    if(!FILL_ACTIONS.includes(action)) errors.push("INVALID_FILL_ACTION");
    if(!Number.isInteger(filledShares)||filledShares<=0) errors.push("FILLED_SHARES_REQUIRED");
    if(fillPrice===null) errors.push("FILL_PRICE_REQUIRED");
    if(sharesBefore===null) errors.push("SHARES_BEFORE_REQUIRED");
    if(signalEventId&&signalEventId===ledgerEventId) errors.push("SIGNAL_ID_MUST_NOT_BE_LEDGER_ID");
    if(sharesBefore!==null&&sharesAfter!==null&&Number.isInteger(filledShares)&&filledShares>0){
      if(action==="BUY"||action==="ADD"){
        if(sharesAfter!==sharesBefore+filledShares) errors.push("POSITION_TRANSITION_MISMATCH");
      } else if(action==="REDUCE"||action==="SELL"){
        if(sharesBefore<filledShares) errors.push("SELL_EXCEEDS_POSITION");
        if(sharesAfter!==sharesBefore-filledShares) errors.push("POSITION_TRANSITION_MISMATCH");
        if(action==="REDUCE"&&sharesAfter<=0) errors.push("REDUCE_MUST_LEAVE_POSITION");
        if(action==="SELL"&&sharesAfter!==0) errors.push("SELL_MUST_CLOSE_POSITION");
      }
    }
  }

  return {ok:errors.length===0,errors,normalized:{
    ledgerEventId,ledgerEpochId,eventKind,accountKey,symbol,source,sourceRecordId,effectiveAt,confirmedAt,
    reconciliationStatus:status,correctsLedgerEventId,sharesAfter,averageCostAfter,planScanDate,
    action,filledShares,fillPrice,sharesBefore,signalEventId,
    semantics:eventKind==="POSITION_BASELINE"?"OBSERVED_LEDGER_START_STATE_NOT_EXECUTION":"CONFIRMED_EXECUTION_EVIDENCE"
  }};
}

export function materializeAsKnown(events=[],asKnownAt="9999-12-31T23:59:59Z"){
  const cutoff=Date.parse(asKnownAt),errors=[];
  if(!Number.isFinite(cutoff)) return {ok:false,errors:["INVALID_AS_KNOWN_AT"],states:{}};
  const visible=[];
  for(const raw of events||[]){
    const r=validateLedgerEvent(raw);
    if(!r.ok){errors.push({ledgerEventId:raw?.ledgerEventId||null,errors:r.errors});continue;}
    if(Date.parse(r.normalized.confirmedAt)<=cutoff) visible.push(r.normalized);
  }
  visible.sort((a,b)=>a.confirmedAt.localeCompare(b.confirmedAt)||a.ledgerEventId.localeCompare(b.ledgerEventId));
  const ids=new Map(),sourceIds=new Set();
  for(const e of visible){
    if(ids.has(e.ledgerEventId)) errors.push({ledgerEventId:e.ledgerEventId,errors:["DUPLICATE_LEDGER_EVENT_ID"]});
    ids.set(e.ledgerEventId,e);
    const sk=e.source+":"+e.sourceRecordId;
    if(sourceIds.has(sk)) errors.push({ledgerEventId:e.ledgerEventId,errors:["DUPLICATE_SOURCE_RECORD"]});
    sourceIds.add(sk);
    if(e.reconciliationStatus==="CORRECTED"&&!ids.has(e.correctsLedgerEventId)){
      errors.push({ledgerEventId:e.ledgerEventId,errors:["CORRECTION_TARGET_NOT_PRIOR_AS_KNOWN"]});
    }
  }
  const superseded=new Set(visible.filter(e=>e.reconciliationStatus==="CORRECTED").map(e=>e.correctsLedgerEventId));
  const active=visible.filter(e=>!superseded.has(e.ledgerEventId));
  const byKey=new Map(),states={};
  for(const e of active){
    const key=[e.accountKey,e.symbol,e.ledgerEpochId].join("|");
    if(!byKey.has(key)) byKey.set(key,[]);
    byKey.get(key).push(e);
  }
  for(const [key,list] of byKey){
    list.sort((a,b)=>a.effectiveAt.localeCompare(b.effectiveAt)||a.confirmedAt.localeCompare(b.confirmedAt));
    let state=null,started=false;
    for(const e of list){
      if(e.eventKind==="POSITION_BASELINE"){
        if(started){errors.push({ledgerEventId:e.ledgerEventId,errors:["SECOND_BASELINE_REQUIRES_CORRECTION_OR_NEW_EPOCH"]});continue;}
        state={shares:e.sharesAfter,averageCost:e.averageCostAfter,lastEffectiveAt:e.effectiveAt,lastLedgerEventId:e.ledgerEventId,startedBy:"POSITION_BASELINE"};
        started=true;continue;
      }
      if(!started){
        if(e.action==="BUY"&&e.sharesBefore===0){
          state={shares:e.sharesAfter,averageCost:e.averageCostAfter,lastEffectiveAt:e.effectiveAt,lastLedgerEventId:e.ledgerEventId,startedBy:"ZERO_TO_BUY"};
          started=true;continue;
        }
        errors.push({ledgerEventId:e.ledgerEventId,errors:["MISSING_LEDGER_BASELINE"]});continue;
      }
      if(state.shares!==e.sharesBefore){errors.push({ledgerEventId:e.ledgerEventId,errors:["CROSS_EVENT_POSITION_CHAIN_BREAK"]});continue;}
      state={shares:e.sharesAfter,averageCost:e.averageCostAfter,lastEffectiveAt:e.effectiveAt,lastLedgerEventId:e.ledgerEventId,startedBy:state.startedBy};
    }
    if(state) states[key]=state;
  }
  return {ok:errors.length===0,errors,asKnownAt:new Date(cutoff).toISOString(),states,
    rule:"State is isolated by account+symbol+ledgerEpoch. FILL requires planScanDate; baseline may predate a plan. Pre-baseline history remains UNKNOWN."};
}
