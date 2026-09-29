// Research-only, detector-free Three-Gaps precondition validation.
// This module never measures a gap, counts gaps, assigns direction, or changes Formal behavior.

const MODES=Object.freeze([
  "OBSERVED_TRADE_ADJACENCY",
  "ELIGIBLE_SYMBOL_SESSION_ADJACENCY",
]);

function text(value,field){
  const out=String(value??"").trim();
  if(!out) throw new Error(`MISSING_${field}`);
  return out;
}

function date(value,field){
  const out=text(value,field);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(out)) throw new Error(`INVALID_${field}`);
  return out;
}

function instant(value,field){
  const out=text(value,field);
  if(!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(out)) throw new Error(`INVALID_${field}`);
  const millis=Date.parse(out);
  if(!Number.isFinite(millis)) throw new Error(`INVALID_${field}`);
  return Object.freeze({value:out,millis});
}

function finitePositive(value,field){
  const out=Number(value);
  if(!Number.isFinite(out)||out<=0) throw new Error(`INVALID_${field}`);
  return out;
}

function uniq(values){
  return [...new Set(values)].sort();
}

function issue(type,reason,dateValue=null,detail=null){
  return Object.freeze({type,reason,date:dateValue,detail});
}

function validateOhlc(raw,label){
  if(raw==null||typeof raw!=="object") throw new Error(`MISSING_${label}`);
  const open=finitePositive(raw.open,`${label}.open`);
  const high=finitePositive(raw.high,`${label}.high`);
  const low=finitePositive(raw.low,`${label}.low`);
  const close=finitePositive(raw.close,`${label}.close`);
  if(high<low||open>high||open<low||close>high||close<low){
    throw new Error(`INVALID_${label}.ohlc`);
  }
  return Object.freeze({open,high,low,close});
}

function normalizeBar(raw,label){
  const barDate=date(raw?.date,`${label}.date`);
  const rawBar=Object.freeze({
    barId:text(raw?.raw?.barId,`${label}.raw.barId`),
    sourceHistoryHash:text(raw?.raw?.sourceHistoryHash,`${label}.raw.sourceHistoryHash`),
    rawReceiptId:text(raw?.raw?.rawReceiptId,`${label}.raw.rawReceiptId`),
    availableAt:instant(raw?.raw?.availableAt,`${label}.raw.availableAt`),
    ...validateOhlc(raw?.raw,`${label}.raw`),
  });
  const technical=Object.freeze({
    barId:text(raw?.technical?.barId,`${label}.technical.barId`),
    sourceRawBarId:text(raw?.technical?.sourceRawBarId,`${label}.technical.sourceRawBarId`),
    continuityReceiptId:text(raw?.technical?.continuityReceiptId,`${label}.technical.continuityReceiptId`),
    continuityVersion:text(raw?.technical?.continuityVersion,`${label}.technical.continuityVersion`),
    ...validateOhlc(raw?.technical,`${label}.technical`),
  });
  return Object.freeze({date:barDate,raw:rawBar,technical});
}

export function classifyHistoryPresenceReceipt({receipt,symbol,market,marketDate,asOfDate,asOfTimestamp}){
  const d=date(marketDate,"marketDate");
  date(asOfDate,"asOfDate");
  const cutoff=instant(asOfTimestamp,"asOfTimestamp").millis;
  if(!receipt||receipt.schemaVersion!=="HISTORY_PRESENCE_V1"||receipt.complete!==true){
    return Object.freeze({state:"UNKNOWN",reason:"HISTORY_PRESENCE_RECEIPT_MISSING_OR_INCOMPLETE"});
  }
  if(receipt.market!==market||receipt.marketDate!==d){
    return Object.freeze({state:"UNKNOWN",reason:"HISTORY_PRESENCE_RECEIPT_IDENTITY_MISMATCH"});
  }
  if(receipt.semantics!=="RAW_OFFICIAL_BAR_PRESENCE_BEFORE_FORMAL_FILTERS"){
    return Object.freeze({state:"UNKNOWN",reason:"HISTORY_PRESENCE_SEMANTICS_MISMATCH"});
  }
  if(instant(receipt.collectedAt,"historyPresence.collectedAt").millis>cutoff){
    return Object.freeze({state:"UNKNOWN",reason:"HISTORY_PRESENCE_NOT_AVAILABLE_AS_OF"});
  }
  const minimum=market==="TWSE"?600:market==="TPEx"?450:null;
  if(
    minimum==null||!String(receipt.sourceUrl||"").trim()||
    !Array.isArray(receipt.tradedSymbols)||
    new Set(receipt.tradedSymbols).size!==receipt.tradedSymbols.length||
    !Number.isInteger(receipt.symbolCount)||receipt.symbolCount<minimum||
    receipt.symbolCount<receipt.tradedSymbols.length
  ){
    return Object.freeze({state:"UNKNOWN",reason:"HISTORY_PRESENCE_RECEIPT_MALFORMED"});
  }
  if(receipt.tradedSymbols.includes(symbol)){
    return Object.freeze({state:"OFFICIAL_TRADED_BAR_PRESENT",reason:null});
  }
  return Object.freeze({
    state:"NO_OFFICIAL_TRADED_BAR_REASON_UNKNOWN",
    reason:"ABSENCE_IS_NOT_A_SUSPENSION_CLASSIFICATION",
  });
}

function explicitSessionState(evidence,dateValue,asOfMillis){
  const row=(evidence||[]).find(x=>x?.date===dateValue);
  if(!row) return null;
  if(row.state!=="VERIFIED_SYMBOL_NOT_ELIGIBLE") return null;
  if(row.complete!==true||row.evidenceKind!=="OFFICIAL_SYMBOL_SESSION_STATUS") return null;
  if(instant(row.knownAt,"sessionEvidence.knownAt").millis>asOfMillis) return null;
  text(row.receiptId,"sessionEvidence.receiptId");
  return "VERIFIED_SYMBOL_NOT_ELIGIBLE";
}

function outcome({asOfDate,asOfTimestamp,symbol,market,adjacencyMode,issues,sessionStates,usableCorporateActionIds}){
  const conflicts=issues.filter(x=>x.type==="PROVENANCE_CONFLICT");
  const blocks=issues.filter(x=>x.type==="DATA_BLOCKED");
  const unknownNoTrade=sessionStates.some(x=>x.state==="NO_OFFICIAL_TRADED_BAR_REASON_UNKNOWN");
  const status=conflicts.length?"PROVENANCE_CONFLICT":blocks.length?"DATA_BLOCKED":
    unknownNoTrade?"READY_WITH_UNKNOWN_NO_TRADE_REASON":"READY";
  return Object.freeze({
    schemaVersion:"PATTERN_THREE_GAPS_PRECONDITION_V0_1",
    asOfDate,asOfTimestamp,symbol,market,adjacencyMode,status,
    reasons:Object.freeze(uniq(issues.map(x=>x.reason))),
    issues:Object.freeze(issues),
    sessionStates:Object.freeze(sessionStates),
    usableCorporateActionIds:Object.freeze(usableCorporateActionIds),
    measurementAuthorized:status.startsWith("READY"),
    detectorExecuted:false,
    detectorOutput:null,
    gapCount:null,
    directionalEffect:"UNKNOWN",
    formalCoreImpact:"NONE",
  });
}

export function validateThreeGapsPrecondition(input){
  const asOfDate=date(input?.asOfDate,"asOfDate");
  const asOfTimestamp=instant(input?.asOfTimestamp,"asOfTimestamp");
  const symbol=text(input?.symbol,"symbol");
  const market=text(input?.market,"market");
  const adjacencyMode=text(input?.adjacencyMode,"adjacencyMode");
  if(!MODES.includes(adjacencyMode)) throw new Error("INVALID_adjacencyMode");
  const previous=normalizeBar(input?.previousBar,"previousBar");
  const current=normalizeBar(input?.currentBar,"currentBar");
  if(current.date<=previous.date) throw new Error("BAR_DATES_NOT_STRICTLY_ASCENDING");

  const issues=[];
  const add=(type,reason,dateValue=null,detail=null)=>issues.push(issue(type,reason,dateValue,detail));
  const raw=input?.rawSourceReceipt||{};
  const rawId=text(raw.id,"rawSourceReceipt.id");
  const rawHash=text(raw.sourceHistoryHash,"rawSourceReceipt.sourceHistoryHash");
  if(raw.complete!==true) add("DATA_BLOCKED","RAW_SOURCE_RECEIPT_INCOMPLETE");
  if(raw.requestedAdjusted!==false||raw.responseAdjusted!==false||raw.responseModeVerified!==true){
    add("PROVENANCE_CONFLICT","RAW_RESPONSE_MODE_NOT_IMMUTABLY_VERIFIED");
  }
  if(instant(raw.availableAt,"rawSourceReceipt.availableAt").millis>asOfTimestamp.millis) add("DATA_BLOCKED","RAW_SOURCE_NOT_AVAILABLE_AS_OF");
  for(const bar of [previous,current]){
    if(bar.raw.rawReceiptId!==rawId||bar.raw.sourceHistoryHash!==rawHash){
      add("PROVENANCE_CONFLICT","RAW_BAR_RECEIPT_OR_HASH_MISMATCH",bar.date);
    }
    if(bar.raw.availableAt.millis>asOfTimestamp.millis) add("DATA_BLOCKED","RAW_BAR_NOT_AVAILABLE_AS_OF",bar.date);
  }

  const continuity=input?.continuityReceipt||{};
  const continuityId=text(continuity.id,"continuityReceipt.id");
  const continuityVersion=text(continuity.version,"continuityReceipt.version");
  if(continuity.complete!==true) add("DATA_BLOCKED","TECHNICAL_CONTINUITY_RECEIPT_INCOMPLETE");
  if(continuity.semanticSpace!=="TECHNICAL_CONTINUITY") add("PROVENANCE_CONFLICT","TECHNICAL_CONTINUITY_SEMANTIC_SPACE_MISMATCH");
  if(continuity.sourceRawReceiptId!==rawId||continuity.sourceHistoryHash!==rawHash){
    add("PROVENANCE_CONFLICT","TECHNICAL_CONTINUITY_RAW_PARENT_MISMATCH");
  }
  if(instant(continuity.availableAt,"continuityReceipt.availableAt").millis>asOfTimestamp.millis) add("DATA_BLOCKED","TECHNICAL_CONTINUITY_NOT_AVAILABLE_AS_OF");
  const sourceBarsThrough=date(continuity.sourceBarsThrough,"continuityReceipt.sourceBarsThrough");
  if(sourceBarsThrough<current.date) add("DATA_BLOCKED","TECHNICAL_CONTINUITY_COVERAGE_INCOMPLETE");
  if(sourceBarsThrough>asOfDate) add("PROVENANCE_CONFLICT","TECHNICAL_CONTINUITY_USES_FUTURE_BAR");
  for(const bar of [previous,current]){
    if(
      bar.technical.sourceRawBarId!==bar.raw.barId||
      bar.technical.continuityReceiptId!==continuityId||
      bar.technical.continuityVersion!==continuityVersion
    ) add("PROVENANCE_CONFLICT","TECHNICAL_BAR_LINEAGE_MISMATCH",bar.date);
  }

  const action=input?.corporateActionReceipt||{};
  const actionId=text(action.id,"corporateActionReceipt.id");
  if(continuity.corporateActionReceiptId!==actionId) add("PROVENANCE_CONFLICT","CORPORATE_ACTION_PARENT_MISMATCH");
  if(action.complete!==true||action.registryCoverageComplete!==true) add("DATA_BLOCKED","CORPORATE_ACTION_REGISTRY_COVERAGE_INCOMPLETE");
  if(instant(action.availableAt,"corporateActionReceipt.availableAt").millis>asOfTimestamp.millis) add("DATA_BLOCKED","CORPORATE_ACTION_RECEIPT_NOT_AVAILABLE_AS_OF");
  if(date(action.coverageStart,"corporateActionReceipt.coverageStart")>previous.date||date(action.coverageEnd,"corporateActionReceipt.coverageEnd")<current.date){
    add("DATA_BLOCKED","CORPORATE_ACTION_WINDOW_NOT_COVERED");
  }
  const usableCorporateActionIds=[];
  for(const event of action.events||[]){
    const eventId=text(event?.eventId,"corporateAction.eventId");
    const effectiveDate=date(event?.effectiveDate,"corporateAction.effectiveDate");
    const knownAt=instant(event?.knownAt,"corporateAction.knownAt");
    if(knownAt.millis>asOfTimestamp.millis){
      if(event.appliedToContinuity===true) add("PROVENANCE_CONFLICT","FUTURE_KNOWN_CORPORATE_ACTION_APPLIED",effectiveDate,eventId);
      continue;
    }
    if(effectiveDate<=previous.date||effectiveDate>current.date) continue;
    usableCorporateActionIds.push(eventId);
    if(event.factorVerified!==true||event.appliedToContinuity!==true||event.residualGapPreserved!==true){
      add("DATA_BLOCKED","CORPORATE_ACTION_CONTINUITY_UNRESOLVED",effectiveDate,eventId);
    }
  }

  const calendar=input?.marketCalendarReceipt||{};
  if(calendar.complete!==true||calendar.market!==market||calendar.version!=="OFFICIAL_MARKET_CALENDAR_V1"){
    add("DATA_BLOCKED","MARKET_CALENDAR_RECEIPT_INVALID");
  }
  if(instant(calendar.availableAt,"marketCalendarReceipt.availableAt").millis>asOfTimestamp.millis) add("DATA_BLOCKED","MARKET_CALENDAR_NOT_AVAILABLE_AS_OF");
  if(date(calendar.coverageStart,"marketCalendarReceipt.coverageStart")>previous.date||date(calendar.coverageEnd,"marketCalendarReceipt.coverageEnd")<current.date){
    add("DATA_BLOCKED","MARKET_CALENDAR_WINDOW_NOT_COVERED");
  }
  const openDates=uniq((calendar.openMarketDates||[]).map((x,i)=>date(x,`marketCalendarReceipt.openMarketDates@${i}`)))
    .filter(x=>x>=previous.date&&x<=current.date);
  if(!openDates.includes(previous.date)||!openDates.includes(current.date)) add("PROVENANCE_CONFLICT","OBSERVED_BAR_ON_NON_OPEN_MARKET_DATE");

  const presenceByDate=new Map((input?.historyPresenceReceipts||[]).map(row=>[row?.marketDate,row]));
  const sessionStates=[];
  for(const d of openDates){
    const classified=classifyHistoryPresenceReceipt({receipt:presenceByDate.get(d),symbol,market,marketDate:d,asOfDate,asOfTimestamp:asOfTimestamp.value});
    const explicit=explicitSessionState(input?.symbolSessionEvidence,d,asOfTimestamp.millis);
    if(classified.state==="UNKNOWN") add("DATA_BLOCKED","HISTORY_PRESENCE_EVIDENCE_UNKNOWN",d,classified.reason);
    if(classified.state==="OFFICIAL_TRADED_BAR_PRESENT"&&explicit){
      add("PROVENANCE_CONFLICT","TRADED_BAR_CONTRADICTS_VERIFIED_NON_ELIGIBLE_SESSION",d);
    }
    const state=explicit||classified.state;
    sessionStates.push(Object.freeze({date:d,state,presenceReason:classified.reason}));
    const endpoint=d===previous.date||d===current.date;
    if(endpoint&&state!=="OFFICIAL_TRADED_BAR_PRESENT") add("DATA_BLOCKED","OBSERVED_BAR_LACKS_OFFICIAL_PRESENCE",d);
    if(!endpoint&&state==="OFFICIAL_TRADED_BAR_PRESENT") add("DATA_BLOCKED","MISSING_OFFICIAL_TRADED_BAR",d);
    if(!endpoint&&state==="UNKNOWN") add("DATA_BLOCKED","INTERMEDIATE_SYMBOL_SESSION_UNKNOWN",d);
    if(!endpoint&&state==="NO_OFFICIAL_TRADED_BAR_REASON_UNKNOWN"&&adjacencyMode==="ELIGIBLE_SYMBOL_SESSION_ADJACENCY"){
      add("DATA_BLOCKED","NO_TRADE_RECEIPT_CANNOT_PROVE_SYMBOL_SESSION_INELIGIBILITY",d);
    }
  }

  return outcome({
    asOfDate,asOfTimestamp:asOfTimestamp.value,symbol,market,adjacencyMode,issues,sessionStates,
    usableCorporateActionIds:uniq(usableCorporateActionIds),
  });
}
