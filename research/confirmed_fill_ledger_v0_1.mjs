// Confirmed Fill Ledger v0.1
// Class-A research-only contract validator.
// No Worker/Production/Formal behavior is imported or mutated.

function num(v){
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function int(v){
  const n=Number(v);
  return Number.isInteger(n)?n:null;
}
function iso(v){
  const t=Date.parse(v);
  return Number.isFinite(t)?new Date(t).toISOString():null;
}
function positive(v){
  const n=num(v);
  return n!==null&&n>0?n:null;
}
function nonNegativeInt(v){
  const n=int(v);
  return n!==null&&n>=0?n:null;
}

export const CONFIRMED_FILL_ACTIONS=["BUY","ADD","REDUCE","SELL"];
export const CONFIRMED_FILL_SOURCES=["BROKER_IMPORT","MANUAL_CONFIRMED","VERIFIED_EXTERNAL"];
export const RECONCILIATION_STATUSES=["CONFIRMED","CORRECTED"];

export function validateConfirmedFillEvent(event={}){
  const errors=[];
  const executionEventId=String(event.executionEventId||"").trim();
  const symbol=String(event.symbol||"").trim();
  const action=String(event.action||"").toUpperCase().trim();
  const source=String(event.source||"").toUpperCase().trim();
  const reconciliationStatus=String(event.reconciliationStatus||"CONFIRMED").toUpperCase().trim();
  const occurredAt=iso(event.occurredAt);
  const confirmedAt=iso(event.confirmedAt);
  const fillPrice=positive(event.fillPrice);
  const filledShares=positive(event.filledShares);
  const sharesBefore=nonNegativeInt(event.sharesBefore);
  const sharesAfter=nonNegativeInt(event.sharesAfter);
  const planScanDate=String(event.planScanDate||"").trim();
  const signalEventId=event.signalEventId==null?null:String(event.signalEventId).trim();
  const sourceRecordId=String(event.sourceRecordId||"").trim();
  const correctsExecutionEventId=event.correctsExecutionEventId==null?null:String(event.correctsExecutionEventId).trim();

  if(!executionEventId) errors.push("EXECUTION_EVENT_ID_REQUIRED");
  if(!/^[0-9A-Za-z._:-]+$/.test(symbol)) errors.push("SYMBOL_REQUIRED");
  if(!CONFIRMED_FILL_ACTIONS.includes(action)) errors.push("INVALID_ACTION");
  if(!CONFIRMED_FILL_SOURCES.includes(source)) errors.push("INVALID_SOURCE");
  if(!RECONCILIATION_STATUSES.includes(reconciliationStatus)) errors.push("INVALID_RECONCILIATION_STATUS");
  if(!occurredAt) errors.push("OCCURRED_AT_REQUIRED");
  if(!confirmedAt) errors.push("CONFIRMED_AT_REQUIRED");
  if(occurredAt&&confirmedAt&&Date.parse(confirmedAt)<Date.parse(occurredAt)) errors.push("CONFIRMED_BEFORE_OCCURRENCE");
  if(fillPrice===null) errors.push("FILL_PRICE_REQUIRED");
  if(!Number.isInteger(filledShares)||filledShares<=0) errors.push("FILLED_SHARES_REQUIRED");
  if(sharesBefore===null) errors.push("SHARES_BEFORE_REQUIRED");
  if(sharesAfter===null) errors.push("SHARES_AFTER_REQUIRED");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(planScanDate)) errors.push("PLAN_SCAN_DATE_REQUIRED");
  if(!sourceRecordId) errors.push("SOURCE_RECORD_ID_REQUIRED");

  if(sharesBefore!==null&&sharesAfter!==null&&Number.isInteger(filledShares)&&filledShares>0){
    if(action==="BUY"||action==="ADD"){
      if(sharesAfter!==sharesBefore+filledShares) errors.push("POSITION_TRANSITION_MISMATCH");
    } else if(action==="REDUCE"||action==="SELL"){
      if(sharesBefore<filledShares) errors.push("SELL_EXCEEDS_POSITION");
      if(sharesAfter!==sharesBefore-filledShares) errors.push("POSITION_TRANSITION_MISMATCH");
      if(action==="SELL"&&sharesAfter!==0) errors.push("SELL_MUST_CLOSE_POSITION");
      if(action==="REDUCE"&&sharesAfter<=0) errors.push("REDUCE_MUST_LEAVE_POSITION");
    }
  }

  if(reconciliationStatus==="CORRECTED"&&!correctsExecutionEventId) errors.push("CORRECTION_TARGET_REQUIRED");
  if(reconciliationStatus==="CONFIRMED"&&correctsExecutionEventId) errors.push("CONFIRMED_EVENT_CANNOT_CORRECT");
  if(signalEventId&&signalEventId===executionEventId) errors.push("SIGNAL_ID_MUST_NOT_BE_EXECUTION_ID");

  const averageCostAfter=event.averageCostAfter==null?null:positive(event.averageCostAfter);
  if(sharesAfter!==null){
    if(sharesAfter>0&&averageCostAfter===null) errors.push("AVERAGE_COST_AFTER_REQUIRED_FOR_OPEN_POSITION");
    if(sharesAfter===0&&event.averageCostAfter!=null) errors.push("CLOSED_POSITION_AVERAGE_COST_MUST_BE_NULL");
  }

  return {
    ok:errors.length===0,
    errors,
    normalized:{
      executionEventId,symbol,action,source,reconciliationStatus,
      occurredAt,confirmedAt,fillPrice,filledShares:Number.isInteger(filledShares)?filledShares:null,
      sharesBefore,sharesAfter,planScanDate,signalEventId,sourceRecordId,
      correctsExecutionEventId,averageCostAfter,
      semantics:"APPEND_ONLY_CONFIRMED_EXECUTION_EVIDENCE_NOT_SIGNAL_EVENT"
    }
  };
}

export function validateAppendOnlySequence(events=[]){
  const ids=new Set(),sourceIds=new Set(),errors=[];
  const confirmedById=new Map();
  const ordered=[...(events||[])].sort((a,b)=>String(a?.confirmedAt||"").localeCompare(String(b?.confirmedAt||"")));

  for(const raw of ordered){
    const r=validateConfirmedFillEvent(raw);
    if(!r.ok){
      errors.push({executionEventId:raw?.executionEventId||null,errors:r.errors});
      continue;
    }
    const e=r.normalized;
    if(ids.has(e.executionEventId)) errors.push({executionEventId:e.executionEventId,errors:["DUPLICATE_EXECUTION_EVENT_ID"]});
    ids.add(e.executionEventId);
    const sourceKey=e.source+":"+e.sourceRecordId;
    if(sourceIds.has(sourceKey)) errors.push({executionEventId:e.executionEventId,errors:["DUPLICATE_SOURCE_RECORD"]});
    sourceIds.add(sourceKey);

    if(e.reconciliationStatus==="CORRECTED"){
      const target=confirmedById.get(e.correctsExecutionEventId);
      if(!target) errors.push({executionEventId:e.executionEventId,errors:["CORRECTION_TARGET_NOT_PRIOR_EVENT"]});
      if(target&&target.symbol!==e.symbol) errors.push({executionEventId:e.executionEventId,errors:["CORRECTION_SYMBOL_MISMATCH"]});
    }
    confirmedById.set(e.executionEventId,e);
  }

  const bySymbol=new Map();
  for(const raw of ordered){
    const r=validateConfirmedFillEvent(raw);
    if(!r.ok) continue;
    const e=r.normalized;
    if(e.reconciliationStatus==="CORRECTED") continue;
    const prior=bySymbol.get(e.symbol);
    if(prior&&prior.sharesAfter!==e.sharesBefore){
      errors.push({executionEventId:e.executionEventId,errors:["CROSS_EVENT_POSITION_CHAIN_BREAK"]});
    }
    bySymbol.set(e.symbol,e);
  }

  return {
    ok:errors.length===0,
    errors,
    appendOnly:true,
    decisionImpact:false,
    rule:"Corrections append new evidence and reference prior events; never mutate or delete prior execution evidence."
  };
}
