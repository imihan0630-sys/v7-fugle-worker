import {createHash} from "node:crypto";
import {C3_CAPTURE_SLOTS} from "./system1_c3_capture_contract_v0_1.mjs";

const DATE=/^\d{4}-\d{2}-\d{2}$/;
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=8)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");

export const C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1=Object.freeze({
  schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1",
  metric:"HARMONIC_TWO_SIDED_DEPTH_TO_COMPLETED_15M_VOLUME",
  baselineScope:"SAME_SYMBOL_SAME_TAIPEI_SLOT_PRIOR_TARGET_TRADE_DATES_ONLY",
  minDistinctSessions:20,
  maxLookbackSessions:60,
  scoreMethod:"EMPIRICAL_MIDRANK_PERCENTILE_0_100",
  spreadRole:"COMPANION_DIAGNOSTIC_NOT_INCLUDED_IN_DEPTH_SCORE",
  imbalanceRole:"COMPANION_DIAGNOSTIC_NOT_INCLUDED_IN_DEPTH_SCORE",
  outcomeBlind:true,
  currentSessionExcluded:true,
  futureSessionsExcluded:true,
  fallbackAcrossSymbols:false,
  fallbackAcrossSlots:false,
  fallbackAcrossCurrentDay:false,
  triggerAuthorized:false,
  existingDepthThresholdsReusable:false,
  economicSuperiority:"UNKNOWN",
  formalCoreImpact:false
});

function validateDate(value,label){
  const s=String(value||"");
  if(!DATE.test(s)||!Number.isFinite(Date.parse(s+"T00:00:00Z"))) throw new Error(label);
  return s;
}
function validateSlot(value){
  const slot=String(value||"");
  if(!C3_CAPTURE_SLOTS.includes(slot)) throw new Error("C3_LIVE_DEPTH_SLOT_INVALID");
  return slot;
}

export function buildC3LiveDepthFeature({
  symbol,targetTradeDate,slot,barVolume,bidDepth5,askDepth5,depthImbalance,spreadPct,
  quoteTimestamp=null,sourceFamily="FUGLE_INTRADAY_QUOTE_RAW_CONTEXT"
}={}){
  const sym=String(symbol||"").trim();
  if(!sym) throw new Error("C3_LIVE_DEPTH_SYMBOL_REQUIRED");
  const date=validateDate(targetTradeDate,"C3_LIVE_DEPTH_DATE_INVALID");
  const normalizedSlot=validateSlot(slot);
  const volume=finite(barVolume),bid=finite(bidDepth5),ask=finite(askDepth5);
  const imbalance=finite(depthImbalance),spread=finite(spreadPct);
  const blockers=[];
  if(!(volume>0)) blockers.push("BAR_VOLUME_UNAVAILABLE");
  if(bid===null||bid<0) blockers.push("BID_DEPTH5_UNAVAILABLE");
  if(ask===null||ask<0) blockers.push("ASK_DEPTH5_UNAVAILABLE");
  if(imbalance===null||imbalance < -1||imbalance > 1) blockers.push("DEPTH_IMBALANCE_INVALID");
  if(spread===null||spread<0) blockers.push("SPREAD_INVALID");
  if(sourceFamily!=="FUGLE_INTRADAY_QUOTE_RAW_CONTEXT") blockers.push("QUOTE_SOURCE_FAMILY_UNVERIFIED");
  if(quoteTimestamp!==null&&!Number.isFinite(Date.parse(String(quoteTimestamp)))) blockers.push("QUOTE_TIMESTAMP_INVALID");

  let harmonicDepth5=null,depthToBarVolume=null;
  if(bid!==null&&bid>=0&&ask!==null&&ask>=0){
    harmonicDepth5=(bid+ask)>0?2*bid*ask/(bid+ask):0;
    if(volume>0) depthToBarVolume=harmonicDepth5/volume;
  }
  return {
    schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_FEATURE_V0_1",
    symbol:sym,targetTradeDate:date,slot:normalizedSlot,
    status:blockers.length?"INPUT_BLOCKED":"READY",blockers,
    barVolume:volume,bidDepth5:bid,askDepth5:ask,
    harmonicDepth5:round(harmonicDepth5),depthToBarVolume:round(depthToBarVolume),
    depthImbalance:imbalance,absDepthImbalance:imbalance===null?null:round(Math.abs(imbalance)),
    spreadPct:spread,quoteTimestamp:quoteTimestamp===null?null:String(quoteTimestamp),
    sourceFamily,
    outcomeFieldsUsed:[],
    rawOutcomeBlind:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

function verifyReadyFeature(row){
  if(row?.schemaVersion!=="SYSTEM1_C3_LIVE_DEPTH_FEATURE_V0_1"||row?.status!=="READY"||
     !row?.symbol||!DATE.test(String(row?.targetTradeDate||""))||
     !C3_CAPTURE_SLOTS.includes(String(row?.slot||""))||
     finite(row?.depthToBarVolume)===null||row.depthToBarVolume<0)
    throw new Error("C3_LIVE_DEPTH_READY_FEATURE_REQUIRED");
  return row;
}

export function scoreC3LiveDepthFeature(targetFeature,historyFeatures,{
  minDistinctSessions=C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1.minDistinctSessions,
  maxLookbackSessions=C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1.maxLookbackSessions
}={}){
  const target=verifyReadyFeature(targetFeature);
  if(!Array.isArray(historyFeatures)) throw new Error("C3_LIVE_DEPTH_HISTORY_ARRAY_REQUIRED");
  if(!Number.isInteger(minDistinctSessions)||minDistinctSessions<5||
     !Number.isInteger(maxLookbackSessions)||maxLookbackSessions<minDistinctSessions)
    throw new Error("C3_LIVE_DEPTH_BASELINE_LIMITS_INVALID");

  const candidates=[];
  const seenDates=new Set();
  for(const raw of historyFeatures){
    const row=verifyReadyFeature(raw);
    if(row.symbol!==target.symbol||row.slot!==target.slot) continue;
    if(row.targetTradeDate>=target.targetTradeDate)
      throw new Error("C3_LIVE_DEPTH_LOOKAHEAD_REJECTED");
    if(seenDates.has(row.targetTradeDate)) throw new Error("C3_LIVE_DEPTH_DUPLICATE_BASELINE_SESSION");
    seenDates.add(row.targetTradeDate);
    candidates.push(row);
  }
  candidates.sort((a,b)=>b.targetTradeDate.localeCompare(a.targetTradeDate));
  const baseline=candidates.slice(0,maxLookbackSessions);
  const baselineN=baseline.length;
  const baselineFingerprint=hash(baseline.map(x=>({
    date:x.targetTradeDate,symbol:x.symbol,slot:x.slot,depthToBarVolume:x.depthToBarVolume,
    sourceFamily:x.sourceFamily
  })));

  if(baselineN<minDistinctSessions){
    return {
      schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_SCORE_V0_1",
      symbol:target.symbol,targetTradeDate:target.targetTradeDate,slot:target.slot,
      status:"BASELINE_INSUFFICIENT",liveDepthScore:null,
      targetDepthToBarVolume:target.depthToBarVolume,
      baselineN,minDistinctSessions,maxLookbackSessions,baselineFingerprint,
      oldestBaselineDate:baseline.at(-1)?.targetTradeDate??null,
      newestBaselineDate:baseline[0]?.targetTradeDate??null,
      mappingPreregistered:true,outcomeBlind:true,triggerAuthorized:false,
      existingDepthThresholdsReusable:false,economicSuperiority:"UNKNOWN",
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }

  const targetValue=target.depthToBarVolume;
  let less=0,equal=0;
  for(const row of baseline){
    if(row.depthToBarVolume<targetValue) less++;
    else if(row.depthToBarVolume===targetValue) equal++;
  }
  const score=100*(less+0.5*equal)/baselineN;
  return {
    schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_SCORE_V0_1",
    symbol:target.symbol,targetTradeDate:target.targetTradeDate,slot:target.slot,
    status:"SCORED",liveDepthScore:round(score,4),
    targetDepthToBarVolume:targetValue,
    baselineN,minDistinctSessions,maxLookbackSessions,baselineFingerprint,
    oldestBaselineDate:baseline.at(-1)?.targetTradeDate??null,
    newestBaselineDate:baseline[0]?.targetTradeDate??null,
    lessN:less,equalN:equal,
    mappingPreregistered:true,outcomeBlind:true,triggerAuthorized:false,
    existingDepthThresholdsReusable:false,economicSuperiority:"UNKNOWN",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

export function buildC3LiveDepthNormalizationAudit(targetFeatures,historyFeatures,options={}){
  if(!Array.isArray(targetFeatures)||!Array.isArray(historyFeatures))
    throw new Error("C3_LIVE_DEPTH_NORMALIZATION_ARRAYS_REQUIRED");
  const rows=targetFeatures.map(feature=>{
    if(feature?.status!=="READY"){
      return {
        symbol:String(feature?.symbol||""),targetTradeDate:feature?.targetTradeDate??null,slot:feature?.slot??null,
        status:"INPUT_BLOCKED",liveDepthScore:null,blockers:[...(feature?.blockers||[])],
        triggerAuthorized:false,researchOnly:true,decisionImpact:false
      };
    }
    return scoreC3LiveDepthFeature(feature,historyFeatures,options);
  });
  const scoredN=rows.filter(x=>x.status==="SCORED").length;
  const baselineInsufficientN=rows.filter(x=>x.status==="BASELINE_INSUFFICIENT").length;
  const inputBlockedN=rows.filter(x=>x.status==="INPUT_BLOCKED").length;
  return {
    schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_NORMALIZATION_AUDIT_V0_1",
    contract:C3_LIVE_DEPTH_NORMALIZATION_CONTRACT_V0_1,
    targetN:rows.length,scoredN,baselineInsufficientN,inputBlockedN,rows,
    status:rows.length===0?"NO_TARGETS":
      scoredN===rows.length?"SCORED_RESEARCH_ONLY":
      inputBlockedN>0?"INPUT_BLOCKED":
      "BASELINE_INSUFFICIENT",
    triggerAuthorized:false,existingDepthThresholdsReusable:false,
    outcomeBlind:true,economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true
  };
}
