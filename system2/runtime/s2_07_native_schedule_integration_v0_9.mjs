import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_NATIVE_SCHEDULE_INTEGRATION_VERSION="0.9-RESEARCH";

function text(v){return v==null?"":String(v).trim();}
function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(text(v));}
function rocDate(value){
  const raw=text(value).replace(/&nbsp;?/gi,"").trim();
  const m=raw.match(/^(\d{3})[\/.\-](\d{1,2})[\/.\-](\d{1,2})$/);
  if(!m)return null;
  const y=Number(m[1])+1911;
  const iso=String(y).padStart(4,"0")+"-"+String(Number(m[2])).padStart(2,"0")+"-"+String(Number(m[3])).padStart(2,"0");
  return validDate(iso)?iso:null;
}
function htmlField(detail,label){
  const source=text(detail);
  if(!source)return null;
  const re=new RegExp("<th[^>]*>\\s*"+label+"\\s*:?\\s*</th>\\s*<td[^>]*>([\\s\\S]*?)</td>","i");
  const m=source.match(re);
  if(!m)return null;
  return m[1].replace(/<[^>]*>/g,"").replace(/&nbsp;?/gi,"").trim()||null;
}
function promotionReady(promotion){
  return promotion?.state==="PROMOTION_EVIDENCE_READY_BOUNDED"
    || promotion?.promotionEvidenceReady===true
    || promotion?.promotionLinkageEstablished===true;
}

export function parseCorporateActionNativeScheduleV0_9({
  sourceId,
  market,
  rawDetail,
  effectiveDate,
  eventVersionId,
  sourceRowHash,
}={}){
  const source=text(sourceId);
  const ex=text(market).toUpperCase();
  const effective=text(effectiveDate);
  if(!source)throw new Error("sourceId is required");
  if(!["TWSE","TPEX"].includes(ex))throw new Error("market must be TWSE or TPEX");
  if(!validDate(effective))throw new Error("effectiveDate must be YYYY-MM-DD");

  const blockers=[];
  let stopTradingStart=null;
  let resumeTradingDate=null;
  let scheduleSourceSemantics="UNKNOWN";

  if(ex==="TPEX"){
    scheduleSourceSemantics="TPEX_DETAIL_EXPLICIT_LABELS";
    const rawStop=htmlField(rawDetail,"停止買賣日期");
    const rawResume=htmlField(rawDetail,"恢復買賣日期");
    stopTradingStart=rocDate(rawStop);
    resumeTradingDate=rocDate(rawResume);
    if(!stopTradingStart)blockers.push("NATIVE_STOP_DATE_NOT_OBSERVED");
    if(!resumeTradingDate)blockers.push("NATIVE_RESUME_DATE_NOT_OBSERVED");
  }else{
    scheduleSourceSemantics="TWSE_COMPACT_DETAIL_NOT_SELF_DESCRIBING";
    blockers.push("NATIVE_SCHEDULE_DETAIL_NOT_SELF_DESCRIBING");
  }

  if(resumeTradingDate&&resumeTradingDate!==effective)blockers.push("NATIVE_RESUME_DATE_EVENT_MISMATCH");
  if(stopTradingStart&&resumeTradingDate&&stopTradingStart>=resumeTradingDate)blockers.push("NATIVE_SCHEDULE_DATE_ORDER_INVALID");
  if(!text(eventVersionId)||!text(sourceRowHash))blockers.push("NATIVE_SCHEDULE_SOURCE_PROVENANCE_MISSING");

  const nativeScheduleIntervalCertified=blockers.length===0;
  return deepFreeze({
    schemaVersion:"S2_S2_07_NATIVE_SCHEDULE_PARSE_V0_9",
    version:S2_07_NATIVE_SCHEDULE_INTEGRATION_VERSION,
    sourceId:source,
    market:ex,
    effectiveDate:effective,
    eventVersionId:text(eventVersionId)||null,
    sourceRowHash:text(sourceRowHash)||null,
    scheduleSourceSemantics,
    stopTradingStart,
    resumeTradingDate,
    nativeStopTradingStartCertified:nativeScheduleIntervalCertified,
    nativeResumeTradingDateCertified:nativeScheduleIntervalCertified,
    nativeScheduleIntervalCertified,
    blockers:Object.freeze(blockers),
    nearestPriorDateInferenceUsed:false,
    noSuspensionMayBeClaimed:false,
    suspensionCoverageComplete:false,
    technicalContinuityCertified:false,
    selectionAuthority:false,
    tradingAuthority:false,
  });
}

export function evaluateNativeScheduleIntegrationV0_9({
  event,
  promotion,
  marketSessions=[],
  schedule,
}={}){
  if(!event||typeof event!=="object")throw new Error("event is required");
  const market=text(event.market).toUpperCase();
  const symbol=text(event.symbol);
  const family=text(event.family);
  const effectiveDate=text(event.effectiveDate);
  if(!["TWSE","TPEX"].includes(market))throw new Error("event.market must be TWSE or TPEX");
  if(!/^[1-9][0-9]{3}$/.test(symbol))throw new Error("event.symbol must be four digits");
  if(!validDate(effectiveDate))throw new Error("event.effectiveDate must be YYYY-MM-DD");
  const sessions=[...new Set((Array.isArray(marketSessions)?marketSessions:[]).map(String))].sort();
  if(!sessions.every(validDate))throw new Error("marketSessions must contain YYYY-MM-DD dates");
  if(!schedule||typeof schedule!=="object")throw new Error("schedule is required");

  const pReady=promotionReady(promotion);
  const blockers=[];
  if(!pReady)blockers.push("EVENT_LINKAGE_PROMOTION_NOT_READY");
  for(const blocker of schedule.blockers||[])blockers.push(blocker);
  if(schedule.market!==market||schedule.effectiveDate!==effectiveDate)blockers.push("NATIVE_SCHEDULE_EVENT_IDENTITY_MISMATCH");
  const effectiveDateIsMarketSession=sessions.includes(effectiveDate);
  if(schedule.nativeScheduleIntervalCertified&&!effectiveDateIsMarketSession)blockers.push("RESUME_MARKET_SESSION_NOT_VERIFIED");

  const boundedNativeSymbolSessionEvidenceReady=blockers.length===0;
  return deepFreeze({
    schemaVersion:"S2_S2_07_NATIVE_SCHEDULE_INTEGRATION_V0_9",
    version:S2_07_NATIVE_SCHEDULE_INTEGRATION_VERSION,
    market,symbol,family:family||null,effectiveDate,
    promotionState:promotion?.state||null,
    promotionEvidenceReady:pReady,
    scheduleSourceSemantics:schedule.scheduleSourceSemantics,
    stopTradingStart:schedule.stopTradingStart,
    resumeTradingDate:schedule.resumeTradingDate,
    nativeScheduleIntervalCertified:schedule.nativeScheduleIntervalCertified===true,
    effectiveDateIsMarketSession,
    state:boundedNativeSymbolSessionEvidenceReady
      ?"BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY"
      :"NATIVE_SYMBOL_SESSION_EVIDENCE_BLOCKED",
    blockers:Object.freeze([...new Set(blockers)]),
    boundedNativeSymbolSessionEvidenceReady,
    sourceId:schedule.sourceId,
    eventVersionId:schedule.eventVersionId,
    sourceRowHash:schedule.sourceRowHash,
    noSuspensionMayBeClaimed:false,
    suspensionCoverageComplete:false,
    symbolSessionCompletenessCertified:false,
    rawA1LineageBound:false,
    technicalContinuityCertified:false,
    continuityTransformPerformed:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}

export function summarizeNativeScheduleIntegrationV0_9(rows=[]){
  if(!Array.isArray(rows))throw new Error("rows must be array");
  const blockerCounts={};
  for(const row of rows)for(const b of row?.blockers||[])blockerCounts[b]=(blockerCounts[b]||0)+1;
  return deepFreeze({
    schemaVersion:"S2_S2_07_NATIVE_SCHEDULE_INTEGRATION_SUMMARY_V0_9",
    eventCount:rows.length,
    promotionReadyCount:rows.filter(x=>x?.promotionEvidenceReady===true).length,
    nativeScheduleCertifiedCount:rows.filter(x=>x?.nativeScheduleIntervalCertified===true).length,
    boundedNativeSymbolSessionEvidenceReadyCount:rows.filter(x=>x?.boundedNativeSymbolSessionEvidenceReady===true).length,
    blockedCount:rows.filter(x=>x?.boundedNativeSymbolSessionEvidenceReady!==true).length,
    blockerCounts:deepFreeze(blockerCounts),
    noSuspensionCertifiedCount:0,
    suspensionCoverageComplete:false,
    symbolSessionCompletenessCertified:false,
    rawA1LineageBound:false,
    technicalContinuityCertified:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
