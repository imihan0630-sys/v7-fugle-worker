import {C3_LIVE_DEPTH_PREREG_V0_1,buildC3LiveDepthNormalizedVector} from "./system1_c3_live_depth_prereg_v0_1.mjs";

const DATE=/^\d{4}-\d{2}-\d{2}$/;
const SLOT=/^(?:0\d|1\d|2[0-3]):[0-5]\d$/;
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=4)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;

function taipeiDate(iso){
  const ms=Date.parse(String(iso||""));
  if(!Number.isFinite(ms)) return null;
  const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(ms));
  const g=t=>p.find(x=>x.type===t)?.value;
  return `${g("year")}-${g("month")}-${g("day")}`;
}
function validPacket(packet,label){
  if(packet?.schemaVersion!=="SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1"||
     !DATE.test(String(packet?.targetTradeDate||""))||
     packet?.researchOnly!==true||packet?.formalCoreLocked!==true||
     !Array.isArray(packet?.capture?.audit?.readyReceipts))
    throw new Error(label+"_INVALID_PACKET");
  return packet;
}
function rawFromPacket(packet,{requireAllRaw=false}={}){
  validPacket(packet,"C3_DEPTH_READINESS");
  const rows=[],incomplete=[];
  const seen=new Set();
  for(const receipt of packet.capture.audit.readyReceipts){
    const symbol=String(receipt?.symbol||"").trim();
    if(!symbol||!Array.isArray(receipt?.bars)) throw new Error("C3_DEPTH_READINESS_RECEIPT_INVALID");
    for(const bar of receipt.bars){
      const slot=String(bar?.slot||""),startAt=String(bar?.startAt||""),quoteTimestamp=String(bar?.liveQuoteTimestamp||"");
      if(!SLOT.test(slot)||!Number.isFinite(Date.parse(startAt))||taipeiDate(startAt)!==packet.targetTradeDate)
        throw new Error("C3_DEPTH_READINESS_BAR_TIME_INVALID");
      const key=symbol+"|"+packet.targetTradeDate+"|"+slot;
      if(seen.has(key)) throw new Error("C3_DEPTH_READINESS_DUPLICATE_SYMBOL_DATE_SLOT");
      seen.add(key);
      const bidDepth5=finite(bar?.liveBidDepth5),askDepth5=finite(bar?.liveAskDepth5);
      const depthImbalance=finite(bar?.liveDepthImbalance),spreadPct=finite(bar?.liveSpreadPct);
      const complete=bar?.liveDepthRawComplete===true&&bidDepth5!==null&&bidDepth5>=0&&askDepth5!==null&&askDepth5>=0&&
        bidDepth5+askDepth5>0&&depthImbalance!==null&&depthImbalance>=-1&&depthImbalance<=1&&spreadPct!==null&&spreadPct>=0&&
        Number.isFinite(Date.parse(quoteTimestamp))&&taipeiDate(quoteTimestamp)===packet.targetTradeDate;
      if(!complete){
        incomplete.push({symbol,tradeDate:packet.targetTradeDate,slot,reason:"RAW_LIVE_DEPTH_INCOMPLETE"});
        if(requireAllRaw) throw new Error("C3_DEPTH_READINESS_RAW_INCOMPLETE");
        continue;
      }
      rows.push({symbol,tradeDate:packet.targetTradeDate,slot,bidDepth5,askDepth5,depthImbalance,spreadPct,quoteTimestamp});
    }
  }
  return {rows,incomplete};
}

export function buildC3LiveDepthBaselineReadiness(currentPacket,priorPackets=[]){
  const current=validPacket(currentPacket,"C3_DEPTH_READINESS_CURRENT");
  if(!Array.isArray(priorPackets)) throw new Error("C3_DEPTH_READINESS_PRIOR_PACKETS_REQUIRED");
  const currentDate=current.targetTradeDate,history=[],historyIncomplete=[];
  const packetDates=new Set();
  for(const packet of priorPackets){
    validPacket(packet,"C3_DEPTH_READINESS_PRIOR");
    if(packet.targetTradeDate>=currentDate) throw new Error("C3_DEPTH_READINESS_LOOKAHEAD_PACKET");
    if(packetDates.has(packet.targetTradeDate)) throw new Error("C3_DEPTH_READINESS_DUPLICATE_PRIOR_DATE");
    packetDates.add(packet.targetTradeDate);
    const extracted=rawFromPacket(packet);
    history.push(...extracted.rows);historyIncomplete.push(...extracted.incomplete);
  }

  const currentExtracted=rawFromPacket(current),rows=[];
  for(const raw of currentExtracted.rows){
    const v=buildC3LiveDepthNormalizedVector(raw,history);
    rows.push({
      symbol:raw.symbol,tradeDate:raw.tradeDate,slot:raw.slot,status:v.status,
      baselineN:v.baselineN,
      minPriorSessions:v.minPriorSessions??C3_LIVE_DEPTH_PREREG_V0_1.minPriorSessions,
      maxPriorSessions:v.maxPriorSessions??C3_LIVE_DEPTH_PREREG_V0_1.maxPriorSessions,
      missingPriorSessionsToMin:Math.max(0,(v.minPriorSessions??C3_LIVE_DEPTH_PREREG_V0_1.minPriorSessions)-v.baselineN),
      baselineStart:v.baselineStart??null,baselineEnd:v.baselineEnd??null,
      normalized:v.normalized,compositeDepthScore:v.compositeDepthScore,
      triggerEligible:v.triggerEligible,outcomeLabelsUsed:v.outcomeLabelsUsed,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    });
  }
  for(const x of currentExtracted.incomplete){
    rows.push({
      ...x,status:"RAW_LIVE_DEPTH_INCOMPLETE",baselineN:null,
      minPriorSessions:C3_LIVE_DEPTH_PREREG_V0_1.minPriorSessions,
      maxPriorSessions:C3_LIVE_DEPTH_PREREG_V0_1.maxPriorSessions,
      missingPriorSessionsToMin:null,baselineStart:null,baselineEnd:null,normalized:null,
      compositeDepthScore:null,triggerEligible:false,outcomeLabelsUsed:false,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    });
  }
  rows.sort((a,b)=>a.symbol.localeCompare(b.symbol)||a.slot.localeCompare(b.slot));
  const normalizedReadyN=rows.filter(x=>x.status==="NORMALIZED_VECTOR_READY").length;
  const insufficientBaselineN=rows.filter(x=>x.status==="UNKNOWN_INSUFFICIENT_BASELINE").length;
  const rawIncompleteN=rows.filter(x=>x.status==="RAW_LIVE_DEPTH_INCOMPLETE").length;
  const baselineValues=rows.map(x=>x.baselineN).filter(Number.isFinite);
  const symbols={};
  for(const row of rows){
    const x=symbols[row.symbol]??={slotN:0,normalizedReadySlotN:0,insufficientSlotN:0,rawIncompleteSlotN:0,baselineNs:[]};
    x.slotN++;
    if(row.status==="NORMALIZED_VECTOR_READY") x.normalizedReadySlotN++;
    if(row.status==="UNKNOWN_INSUFFICIENT_BASELINE") x.insufficientSlotN++;
    if(row.status==="RAW_LIVE_DEPTH_INCOMPLETE") x.rawIncompleteSlotN++;
    if(Number.isFinite(row.baselineN)) x.baselineNs.push(row.baselineN);
  }
  const symbolSummary=Object.entries(symbols).sort().map(([symbol,x])=>({
    symbol,slotN:x.slotN,normalizedReadySlotN:x.normalizedReadySlotN,insufficientSlotN:x.insufficientSlotN,
    rawIncompleteSlotN:x.rawIncompleteSlotN,
    minBaselineN:x.baselineNs.length?Math.min(...x.baselineNs):null,
    maxBaselineN:x.baselineNs.length?Math.max(...x.baselineNs):null
  }));

  return {
    schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_BASELINE_READINESS_V0_1",
    currentTradeDate:currentDate,
    preregistry:C3_LIVE_DEPTH_PREREG_V0_1.schemaVersion,
    method:C3_LIVE_DEPTH_PREREG_V0_1.method,
    currentObservationN:rows.length,rawCompleteCurrentN:currentExtracted.rows.length,
    normalizedReadyN,insufficientBaselineN,rawIncompleteN,
    normalizedReadyPct:rows.length?round(normalizedReadyN/rows.length*100,4):null,
    priorPacketN:priorPackets.length,priorCompleteRawRowN:history.length,priorIncompleteRawRowN:historyIncomplete.length,
    minObservedBaselineN:baselineValues.length?Math.min(...baselineValues):null,
    maxObservedBaselineN:baselineValues.length?Math.max(...baselineValues):null,
    rows,symbolSummary,
    readiness:normalizedReadyN===rows.length&&rows.length>0?"ALL_CURRENT_SLOTS_READY":
      normalizedReadyN>0?"PARTIAL_CURRENT_SLOTS_READY":"NO_CURRENT_SLOT_READY",
    noReadinessDateForecast:true,noMissingDataImputation:true,sameSymbolSameSlotPriorSessionsOnly:true,
    compositeDepthScoreAuthorized:false,triggerUseAuthorized:false,outcomeLabelsUsed:false,
    economicSuperiority:"UNKNOWN",formalCoreLocked:true,researchOnly:true,decisionImpact:false,
    formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
}
