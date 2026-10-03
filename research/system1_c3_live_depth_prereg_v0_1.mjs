const DATE=/^\d{4}-\d{2}-\d{2}$/;
const SLOT=/^(?:0\d|1\d|2[0-3]):[0-5]\d$/;
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=6)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;

export const C3_LIVE_DEPTH_PREREG_V0_1=Object.freeze({
  schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_PREREGISTRY_V0_1",
  method:"SAME_SYMBOL_SAME_15M_SLOT_PRIOR_SESSION_ECDF_MIDRANK_V0_1",
  maxPriorSessions:20,
  minPriorSessions:10,
  totalDepth:"bidDepth5 + askDepth5",
  totalDepthNormalization:"ECDF_MIDRANK_PERCENTILE",
  spreadNormalization:"100 - ECDF_MIDRANK_PERCENTILE",
  imbalance:"RAW_SIGNED_DEPTH_IMBALANCE",
  compositeDepthScore:"NOT_AUTHORIZED_V0_1",
  triggerUse:"NOT_AUTHORIZED_V0_1",
  outcomeLabelsAllowed:false
});

function validateRaw(row,label){
  const symbol=String(row?.symbol||"").trim();
  const tradeDate=String(row?.tradeDate||"");
  const slot=String(row?.slot||"");
  const bidDepth5=finite(row?.bidDepth5),askDepth5=finite(row?.askDepth5);
  const depthImbalance=finite(row?.depthImbalance),spreadPct=finite(row?.spreadPct);
  const quoteTimestamp=String(row?.quoteTimestamp||"");
  if(!symbol||!DATE.test(tradeDate)||!SLOT.test(slot)||!Number.isFinite(Date.parse(quoteTimestamp)))
    throw new Error(label+"_IDENTITY_OR_TIME_INVALID");
  if(bidDepth5===null||bidDepth5<0||askDepth5===null||askDepth5<0||bidDepth5+askDepth5<=0)
    throw new Error(label+"_DEPTH_INVALID");
  if(depthImbalance===null||depthImbalance<-1||depthImbalance>1)
    throw new Error(label+"_IMBALANCE_INVALID");
  if(spreadPct===null||spreadPct<0) throw new Error(label+"_SPREAD_INVALID");
  return {symbol,tradeDate,slot,bidDepth5,askDepth5,depthImbalance,spreadPct,quoteTimestamp,totalDepth:bidDepth5+askDepth5};
}

function midrankPercentile(x,values){
  const less=values.filter(v=>v<x).length;
  const equal=values.filter(v=>v===x).length;
  return round((less+0.5*equal)/values.length*100,6);
}

export function buildC3LiveDepthNormalizedVector(observation,history,{minPriorSessions,maxPriorSessions}={}){
  const cfg={
    minPriorSessions:Number.isInteger(minPriorSessions)?minPriorSessions:C3_LIVE_DEPTH_PREREG_V0_1.minPriorSessions,
    maxPriorSessions:Number.isInteger(maxPriorSessions)?maxPriorSessions:C3_LIVE_DEPTH_PREREG_V0_1.maxPriorSessions
  };
  if(cfg.minPriorSessions<1||cfg.maxPriorSessions<cfg.minPriorSessions)
    throw new Error("C3_LIVE_DEPTH_BASELINE_WINDOW_INVALID");

  const obs=validateRaw(observation,"C3_LIVE_DEPTH_OBSERVATION");
  if(!Array.isArray(history)) throw new Error("C3_LIVE_DEPTH_HISTORY_REQUIRED");

  const same=[];
  const dates=new Set();
  for(const raw of history){
    const symbol=String(raw?.symbol||"").trim(),slot=String(raw?.slot||"");
    if(symbol!==obs.symbol||slot!==obs.slot) continue;
    const row=validateRaw(raw,"C3_LIVE_DEPTH_HISTORY");
    if(row.tradeDate>=obs.tradeDate) throw new Error("C3_LIVE_DEPTH_LOOKAHEAD_ROW");
    if(dates.has(row.tradeDate)) throw new Error("C3_LIVE_DEPTH_DUPLICATE_SESSION");
    dates.add(row.tradeDate);
    same.push(row);
  }
  same.sort((a,b)=>a.tradeDate.localeCompare(b.tradeDate));
  const baseline=same.slice(-cfg.maxPriorSessions);
  const rawVector={
    bidDepth5:obs.bidDepth5,askDepth5:obs.askDepth5,totalDepth:obs.totalDepth,
    depthImbalance:obs.depthImbalance,spreadPct:obs.spreadPct
  };

  if(baseline.length<cfg.minPriorSessions){
    return {
      schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_VECTOR_V0_1",
      status:"UNKNOWN_INSUFFICIENT_BASELINE",
      symbol:obs.symbol,tradeDate:obs.tradeDate,slot:obs.slot,
      method:C3_LIVE_DEPTH_PREREG_V0_1.method,
      baselineN:baseline.length,minPriorSessions:cfg.minPriorSessions,maxPriorSessions:cfg.maxPriorSessions,
      raw:rawVector,normalized:{totalDepthPercentile:null,spreadQualityPercentile:null,depthImbalance:obs.depthImbalance,bidSharePct:round(obs.bidDepth5/obs.totalDepth*100,6)},
      compositeDepthScore:null,triggerEligible:false,
      lookaheadRowsUsed:0,sameDayRowsUsed:0,outcomeLabelsUsed:false,
      economicSuperiority:"UNKNOWN",researchOnly:true,decisionImpact:false,formalCoreImpact:false
    };
  }

  const totalDepthValues=baseline.map(x=>x.totalDepth);
  const spreadValues=baseline.map(x=>x.spreadPct);
  return {
    schemaVersion:"SYSTEM1_C3_LIVE_DEPTH_VECTOR_V0_1",
    status:"NORMALIZED_VECTOR_READY",
    symbol:obs.symbol,tradeDate:obs.tradeDate,slot:obs.slot,
    method:C3_LIVE_DEPTH_PREREG_V0_1.method,
    baselineN:baseline.length,baselineStart:baseline[0].tradeDate,baselineEnd:baseline.at(-1).tradeDate,
    minPriorSessions:cfg.minPriorSessions,maxPriorSessions:cfg.maxPriorSessions,
    raw:rawVector,
    normalized:{
      totalDepthPercentile:midrankPercentile(obs.totalDepth,totalDepthValues),
      spreadQualityPercentile:round(100-midrankPercentile(obs.spreadPct,spreadValues),6),
      depthImbalance:obs.depthImbalance,
      bidSharePct:round(obs.bidDepth5/obs.totalDepth*100,6)
    },
    compositeDepthScore:null,triggerEligible:false,
    lookaheadRowsUsed:0,sameDayRowsUsed:0,outcomeLabelsUsed:false,
    baselineUsesSameSymbol:true,baselineUsesSameSlot:true,latestPriorSessionsOnly:true,
    economicSuperiority:"UNKNOWN",researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
