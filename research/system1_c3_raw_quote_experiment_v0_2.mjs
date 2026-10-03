import {C3_CAPTURE_SLOTS} from "./system1_c3_capture_contract_v0_1.mjs";

const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=6)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;
const ts=x=>typeof x==="string"&&/(?:Z|[+-]\d\d:\d\d)$/.test(x)?Date.parse(x):NaN;

export const C3_RAW_QUOTE_CONTRACT_V0_2=Object.freeze({
  schemaVersion:"SYSTEM1_C3_RAW_QUOTE_ENTRY_CONTRACT_V0_2",
  relationToV01:"PARALLEL_PREREGISTERED_ARM_NOT_REPLACEMENT",
  supportTolerancePct:1.0,
  supportMinVolumeRatio:0.8,
  supportMinSelectionDepthScore:50,
  breakoutAcceptanceBufferPct:0.2,
  breakoutMinVolumeRatio:1.2,
  breakoutMinSelectionDepthScore:60,
  breakoutRetestTolerancePct:0.2,
  maxChasePct:2.0,
  maxGapPct:3.0,
  minRemainingRR:2.0,
  requiredExecutionMarketState:"CONTINUOUS",
  fillRule:"NEXT_COMPLETED_BAR_OPEN",
  ambiguousSameBarExit:"STOP_FIRST",
  maxBars:17,
  genericLimitUpStateRequired:false,
  rawDepthConvertedToDepthScore:false
});

function verifyC2(c2){
  if(c2?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||
     c2?.completeMatchedCohort!==true||c2?.researchOnly!==true||
     c2?.formalCoreLocked!==true||!c2?.generationId||!c2?.sessionDate||
     !Number.isFinite(ts(c2?.decisionAt))||!Array.isArray(c2?.pairs)||
     c2.pairs.length!==c2?.tally?.populationN) throw new Error("C3_V02_VERIFIED_C2_REQUIRED");
  return c2;
}
function tpSlot(iso){
  const ms=Date.parse(iso);if(!Number.isFinite(ms)) return null;
  const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(ms));
  const get=t=>p.find(x=>x.type===t)?.value;
  return get("hour")+":"+get("minute");
}
function pairContext(pair,c2){
  const x=pair?.selectionContext,p=x?.provenance;
  if(p?.authenticated!==true||p?.parentId!==c2.generationId||p?.sessionDate!==c2.sessionDate||
     !Number.isFinite(ts(p?.knownAt))||ts(p.knownAt)>ts(c2.decisionAt)) return null;
  const g=x?.entryGeometry;
  return {
    close:finite(x?.close),depthScore:finite(x?.depthScore),
    lateStage:typeof x?.lateStage==="boolean"?x.lateStage:null,
    channel:["A","B"].includes(x?.channel)?x.channel:null,
    geometry:g&&typeof g==="object"?{
      entry:finite(g.entry),stop:finite(g.stop),target:finite(g.target),
      support:g.support==null?null:finite(g.support),breakout:g.breakout==null?null:finite(g.breakout)
    }:null
  };
}
function parseBar(row,c2){
  if(row?.generation_id!==c2.generationId||(row?.completed_bar!==1&&row?.completed_bar!==true))
    throw new Error("C3_V02_BAR_PROVENANCE_INVALID");
  let b;try{b=typeof row.bar_json==="string"?JSON.parse(row.bar_json):row.bar_json;}catch(_){throw new Error("C3_V02_BAR_JSON_INVALID");}
  const start=String(row?.bar_start||b?.time||""),end=String(row?.bar_end||"");
  const out={start,end,slot:tpSlot(start),open:finite(b?.open),high:finite(b?.high),low:finite(b?.low),close:finite(b?.close),
    volume:finite(b?.volume),volumeRatio:finite(b?.volumeRatio)};
  if(!C3_CAPTURE_SLOTS.includes(out.slot)||!Number.isFinite(ts(start))||!Number.isFinite(ts(end))||ts(end)<=ts(start)||
     [out.open,out.high,out.low,out.close].some(x=>!(x>0))||out.volume===null||out.volume<0||
     out.high<Math.max(out.open,out.close)||out.low>Math.min(out.open,out.close)) throw new Error("C3_V02_BAR_INVALID");
  return out;
}
function parseQuote(row,c2){
  if(row?.generation_id!==c2.generationId) throw new Error("C3_V02_QUOTE_GENERATION_MISMATCH");
  let q;try{q=typeof row?.quote_json==="string"?JSON.parse(row.quote_json):row?.quote_json;}catch(_){throw new Error("C3_V02_QUOTE_JSON_INVALID");}
  const barStart=String(row?.bar_start||""),slot=tpSlot(barStart);
  if(!C3_CAPTURE_SLOTS.includes(slot)||String(q?.symbol||"")!==String(row?.symbol||"")||
     q?.date!==row?.target_trade_date||!Number.isFinite(ts(q?.quoteTimestamp))||
     !["CONTINUOUS","HALTED","TRIAL","NON_CONTINUOUS_FLAGGED","UNKNOWN"].includes(q?.executionMarketState))
    throw new Error("C3_V02_QUOTE_PROVENANCE_INVALID");
  return {barStart,slot,quoteTimestamp:q.quoteTimestamp,executionMarketState:q.executionMarketState,
    bestBid:finite(q.bestBid),bestAsk:finite(q.bestAsk),spreadPct:finite(q.spreadPct),
    bidDepth5:finite(q.bidDepth5),askDepth5:finite(q.askDepth5),depthImbalance:finite(q.depthImbalance),
    isLimitUpHalt:typeof q.isLimitUpHalt==="boolean"?q.isLimitUpHalt:null,
    semanticLimit:String(q.semanticLimit||"")};
}
function verifiedFormalBaseline(row,c2){
  return row?.verified===true&&row?.parentId===c2.generationId&&row?.sessionDate===c2.sessionDate&&
    Number.isFinite(ts(row?.knownAt))&&ts(row.knownAt)>ts(c2.decisionAt)&&["TRIGGERED","NO_TRIGGER"].includes(row?.status)
    ? {status:row.status,reason:row.reason||null,verified:true,parentId:c2.generationId,sessionDate:c2.sessionDate,knownAt:row.knownAt}
    : null;
}
function rr(entry,stop,target){return entry>stop&&target>entry?(target-entry)/(entry-stop):null;}
function validMarket(bar,minVolume,minDepth,maxGap){
  return bar.volumeRatio!==null&&bar.volumeRatio>=minVolume&&bar.selectionDepthScore!==null&&bar.selectionDepthScore>=minDepth&&
    bar.gapPct!==null&&Math.abs(bar.gapPct)<=maxGap&&
    bar.executionMarketState===C3_RAW_QUOTE_CONTRACT_V0_2.requiredExecutionMarketState&&bar.selectionLateStage===false;
}
function supportTrigger(bars,g){
  if(!(finite(g?.support)>0)) return {status:"NOT_APPLICABLE",reason:"SUPPORT_NOT_CAPTURED"};
  for(let i=0;i<bars.length-1;i++){
    const b=bars[i],revisit=b.low<=g.support*(1+C3_RAW_QUOTE_CONTRACT_V0_2.supportTolerancePct/100),
      reclaimed=b.close>=g.support,chase=(b.close/g.support-1)*100;
    if(revisit&&reclaimed&&chase<=C3_RAW_QUOTE_CONTRACT_V0_2.maxChasePct&&
       validMarket(b,C3_RAW_QUOTE_CONTRACT_V0_2.supportMinVolumeRatio,C3_RAW_QUOTE_CONTRACT_V0_2.supportMinSelectionDepthScore,C3_RAW_QUOTE_CONTRACT_V0_2.maxGapPct)&&
       rr(b.close,g.stop,g.target)>=C3_RAW_QUOTE_CONTRACT_V0_2.minRemainingRR)
      return {status:"TRIGGERED",triggerIndex:i,triggerAt:b.endAt,triggerPrice:b.close};
  }
  return {status:"NO_TRIGGER",reason:"SUPPORT_RECLAIM_NOT_CONFIRMED"};
}
function continuationTrigger(bars,g){
  if(!(finite(g?.breakout)>0)) return {status:"NOT_APPLICABLE",reason:"BREAKOUT_LEVEL_NOT_CAPTURED"};
  let retested=false;
  for(let i=0;i<bars.length-1;i++){
    const b=bars[i];
    if(b.low<=g.breakout*(1+C3_RAW_QUOTE_CONTRACT_V0_2.breakoutRetestTolerancePct/100)) retested=true;
    const acceptance=b.close>=g.breakout*(1+C3_RAW_QUOTE_CONTRACT_V0_2.breakoutAcceptanceBufferPct/100),
      chase=(b.close/g.breakout-1)*100;
    if(!retested&&acceptance&&chase<=C3_RAW_QUOTE_CONTRACT_V0_2.maxChasePct&&
       validMarket(b,C3_RAW_QUOTE_CONTRACT_V0_2.breakoutMinVolumeRatio,C3_RAW_QUOTE_CONTRACT_V0_2.breakoutMinSelectionDepthScore,C3_RAW_QUOTE_CONTRACT_V0_2.maxGapPct)&&
       rr(b.close,g.stop,g.target)>=C3_RAW_QUOTE_CONTRACT_V0_2.minRemainingRR)
      return {status:"TRIGGERED",triggerIndex:i,triggerAt:b.endAt,triggerPrice:b.close};
  }
  return {status:"NO_TRIGGER",reason:retested?"RETEST_OCCURRED_BASELINE_ROUTE":"CONTINUATION_NOT_CONFIRMED"};
}
function simulate(trigger,bars,g,costs){
  if(trigger.status!=="TRIGGERED") return {...trigger,fillStatus:"NO_FILL",outcome:"NOT_APPLICABLE",simulatedNetReturnPct:null};
  const fill=bars[trigger.triggerIndex+1];if(!fill) return {...trigger,fillStatus:"NO_NEXT_BAR",outcome:"UNKNOWN",simulatedNetReturnPct:null};
  const slip=costs.slippageBpsPerSide/10000,fee=costs.brokerFeeBpsPerSide/10000,tax=costs.sellTaxBps/10000;
  const entry=fill.open*(1+slip),remainingRR=rr(entry,g.stop,g.target);
  if(!(remainingRR>=C3_RAW_QUOTE_CONTRACT_V0_2.minRemainingRR))
    return {...trigger,fillStatus:"INVALIDATED_AT_FILL",entry:round(entry),remainingRR:round(remainingRR),outcome:"NO_TRADE",simulatedNetReturnPct:null};
  let rawExit=bars.at(-1).close,outcome="MARK_TO_LAST_BAR",exitAt=bars.at(-1).endAt;
  for(let i=trigger.triggerIndex+1;i<bars.length;i++){
    const b=bars[i],stop=b.low<=g.stop,target=b.high>=g.target;
    if(stop&&target){rawExit=g.stop;outcome="STOP_FIRST_AMBIGUOUS";exitAt=b.endAt;break;}
    if(stop){rawExit=g.stop;outcome="STOP";exitAt=b.endAt;break;}
    if(target){rawExit=g.target;outcome="TARGET";exitAt=b.endAt;break;}
  }
  const exit=rawExit*(1-slip),buy=entry*(1+fee),sell=exit*(1-fee-tax);
  return {...trigger,fillStatus:"SIM_FILL",entry:round(entry),remainingRR:round(remainingRR),exit:round(exit),exitAt,outcome,
    simulatedNetReturnPct:round((sell/buy-1)*100)};
}
function costs(c){
  const x={brokerFeeBpsPerSide:finite(c?.brokerFeeBpsPerSide),sellTaxBps:finite(c?.sellTaxBps),slippageBpsPerSide:finite(c?.slippageBpsPerSide)};
  if(Object.values(x).some(v=>v===null||v<0)) throw new Error("C3_V02_FROZEN_COSTS_REQUIRED");
  return x;
}

export function buildC3RawQuoteEvidence(c2Ledger,{
  captureRows=[],quoteRows=[],formalBaselineReceipts=[]
}={}){
  const c2=verifyC2(c2Ledger),formalMap=new Map((formalBaselineReceipts||[]).map(x=>[String(x.symbol),x]));
  const eligible=c2.pairs.filter(p=>p?.short?.gateStatus==="PASS"&&Array.isArray(p?.short?.missingSafety)&&p.short.missingSafety.length===0);
  const barsBy=new Map(),quotesBy=new Map();
  for(const r of captureRows||[]){
    const symbol=String(r?.symbol||"");if(!eligible.some(p=>String(p.symbol)===symbol)) continue;
    const bar=parseBar(r,c2);if(!barsBy.has(symbol)) barsBy.set(symbol,new Map());
    if(barsBy.get(symbol).has(bar.slot)) throw new Error("C3_V02_DUPLICATE_BAR_SLOT");
    barsBy.get(symbol).set(bar.slot,bar);
  }
  for(const r of quoteRows||[]){
    const symbol=String(r?.symbol||"");if(!eligible.some(p=>String(p.symbol)===symbol)) continue;
    const q=parseQuote(r,c2);if(!quotesBy.has(symbol)) quotesBy.set(symbol,new Map());
    if(quotesBy.get(symbol).has(q.slot)) throw new Error("C3_V02_DUPLICATE_QUOTE_SLOT");
    quotesBy.get(symbol).set(q.slot,q);
  }
  const rows=[],readyReceipts=[];
  for(const pair of eligible){
    const symbol=String(pair.symbol),ctx=pairContext(pair,c2),bm=barsBy.get(symbol)||new Map(),qm=quotesBy.get(symbol)||new Map();
    const blockers=[],missingBarSlots=C3_CAPTURE_SLOTS.filter(x=>!bm.has(x)),missingQuoteSlots=C3_CAPTURE_SLOTS.filter(x=>!qm.has(x));
    if(missingBarSlots.length) blockers.push("INCOMPLETE_15M_SESSION");
    if(missingQuoteSlots.length) blockers.push("INCOMPLETE_QUOTE_SESSION");
    if(!(ctx?.close>0)) blockers.push("SELECTION_CLOSE_UNVERIFIED");
    if(ctx?.depthScore===null||ctx?.depthScore===undefined||ctx.depthScore<0) blockers.push("SELECTION_DEPTH_UNVERIFIED");
    if(typeof ctx?.lateStage!=="boolean") blockers.push("SELECTION_LATE_STAGE_UNVERIFIED");
    if(!ctx?.channel) blockers.push("BASE_SETUP_UNVERIFIED");
    if(!(ctx?.geometry?.stop>0&&ctx?.geometry?.target>0)) blockers.push("GEOMETRY_UNVERIFIED");
    if(ctx?.channel==="A"&&!(ctx?.geometry?.support>0)) blockers.push("SUPPORT_UNVERIFIED");
    if(ctx?.channel==="B"&&!(ctx?.geometry?.breakout>0)) blockers.push("BREAKOUT_UNVERIFIED");
    const fb=verifiedFormalBaseline(formalMap.get(symbol),c2);if(!fb) blockers.push("FORMAL_BASELINE_RECEIPT_UNVERIFIED");

    const adapted=[];
    for(const slot of C3_CAPTURE_SLOTS){
      const b=bm.get(slot),q=qm.get(slot);if(!b||!q) continue;
      if(b.volumeRatio===null) blockers.push("VOLUME_RATIO_UNVERIFIED");
      if(q.executionMarketState!=="CONTINUOUS") blockers.push("MARKET_MECHANISM_NOT_CONTINUOUS");
      const lag=ts(q.quoteTimestamp)-ts(b.end);
      if(!Number.isFinite(lag)||lag<0) blockers.push("QUOTE_TIME_PRECEDES_BAR_END");
      adapted.push({...b,selectionDepthScore:ctx?.depthScore??null,selectionLateStage:ctx?.lateStage??null,
        gapPct:ctx?.close>0?round((bm.get(C3_CAPTURE_SLOTS[0])?.open/ctx.close-1)*100):null,
        executionMarketState:q.executionMarketState,quoteTimestamp:q.quoteTimestamp,
        rawQuote:{bestBid:q.bestBid,bestAsk:q.bestAsk,spreadPct:q.spreadPct,bidDepth5:q.bidDepth5,askDepth5:q.askDepth5,
          depthImbalance:q.depthImbalance,isLimitUpHalt:q.isLimitUpHalt,semanticLimit:q.semanticLimit}});
    }
    const unique=[...new Set(blockers)],status=unique.length?"INPUT_BLOCKED":"READY";
    if(status==="READY") readyReceipts.push({symbol,parentId:c2.generationId,sessionDate:c2.sessionDate,baseSetup:ctx.channel,
      geometry:{authenticated:true,parentId:c2.generationId,sessionDate:c2.sessionDate,knownAt:c2.decisionAt,...ctx.geometry},
      formalBaseline:fb,bars:adapted});
    rows.push({symbol,status,missingBarSlots,missingQuoteSlots,blockers:unique,
      rawDepthCoverageN:adapted.filter(x=>x.rawQuote?.bidDepth5!==null&&x.rawQuote?.askDepth5!==null).length,
      continuousMarketStateN:adapted.filter(x=>x.executionMarketState==="CONTINUOUS").length,
      genericLimitUpState:"UNKNOWN",rawDepthConvertedToDepthScore:false,researchOnly:true,decisionImpact:false});
  }
  const readyN=rows.filter(x=>x.status==="READY").length;
  return {schemaVersion:"SYSTEM1_C3_RAW_QUOTE_EVIDENCE_V0_2",generationId:c2.generationId,sessionDate:c2.sessionDate,
    eligibleN:rows.length,readyN,blockedN:rows.length-readyN,rows,readyReceipts,
    genericLimitUpStateNeverInferred:true,rawDepthConvertedToDepthScore:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true};
}

export function buildC3RawQuoteEntryExperiment(c2Ledger,evidence,{costs:costInput}={}){
  const c2=verifyC2(c2Ledger),c=costs(costInput);
  if(evidence?.schemaVersion!=="SYSTEM1_C3_RAW_QUOTE_EVIDENCE_V0_2"||evidence?.generationId!==c2.generationId)
    throw new Error("C3_V02_MATCHED_EVIDENCE_REQUIRED");
  const rows=[];
  for(const r of evidence.readyReceipts||[]){
    const pair=c2.pairs.find(x=>String(x.symbol)===String(r.symbol));
    if(!pair||pair.short?.gateStatus!=="PASS") throw new Error("C3_V02_READY_RECEIPT_NOT_ADMISSIBLE");
    const trigger=r.baseSetup==="A"?supportTrigger(r.bars,r.geometry):r.baseSetup==="B"?continuationTrigger(r.bars,r.geometry):
      {status:"NOT_APPLICABLE",reason:"BASE_SETUP_UNVERIFIED"};
    rows.push({symbol:r.symbol,baseSetup:r.baseSetup,formalBaseline:r.formalBaseline,
      challenger:simulate(trigger,r.bars,r.geometry,c),researchOnly:true,decisionImpact:false,formalSelected:false,buyAuthorized:false,allocation:0,signal:null});
  }
  return {schemaVersion:"SYSTEM1_C3_RAW_QUOTE_ENTRY_EXPERIMENT_V0_2",generationId:c2.generationId,sessionDate:c2.sessionDate,
    contract:C3_RAW_QUOTE_CONTRACT_V0_2,costs:c,rows,
    tally:{readyN:rows.length,triggeredN:rows.filter(x=>x.challenger.status==="TRIGGERED").length,
      simFillN:rows.filter(x=>x.challenger.fillStatus==="SIM_FILL").length,
      formalNoTriggerChallengerSimFillN:rows.filter(x=>x.formalBaseline?.status==="NO_TRIGGER"&&x.challenger.fillStatus==="SIM_FILL").length},
    comparisonToV01:"UNKNOWN",economicSuperiority:"UNKNOWN",prospectiveEvidenceMature:false,
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}
