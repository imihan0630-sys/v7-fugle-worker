function num(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function averageFinite(values){
  const valid=values.filter(Number.isFinite);
  return valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:0;
}
function deployedRawRange(item,prevClose){
  // Mirrors current buildMarketFeatures exactly: raw item.high/item.low are used here.
  return Math.max(
    item.high-item.low,
    Math.abs(item.high-prevClose),
    Math.abs(item.low-prevClose)
  );
}
function evidenceRange(item,prevClose){
  const high=num(item?.high),low=num(item?.low),close=num(item?.close);
  const highState=high!==null?"OBSERVED_NUMERIC":item?.high===null?"NULL":"MISSING_OR_INVALID";
  const lowState=low!==null?"OBSERVED_NUMERIC":item?.low===null?"NULL":"MISSING_OR_INVALID";
  const observed=high!==null&&low!==null&&Number.isFinite(prevClose);
  return {
    observed,
    highState,lowState,
    observedRange:observed?Math.max(high-low,Math.abs(high-prevClose),Math.abs(low-prevClose)):null,
    close
  };
}

export function observeAtrQualityFromHistory(history=[]){
  const filtered=Array.isArray(history)
    ?history.filter(item=>num(item?.close)!==null)
    :[];
  if(!filtered.length) return {
    schemaVersion:"atr-quality-source-observer-v0.1",
    state:"NO_CLOSE_VALID_HISTORY",historyDays:0,researchOnly:true
  };
  const closes=filtered.map(item=>Number(item.close));
  const close=closes.at(-1);
  const slice=filtered.slice(-20);
  const offset=filtered.length-slice.length;
  const rows=slice.map((item,idx)=>{
    const globalIndex=offset+idx;
    const prev=closes[Math.max(0,globalIndex-1)]||item.close;
    const deployed=deployedRawRange(item,prev);
    const evidence=evidenceRange(item,Number(prev));
    return {
      date:String(item?.date||""),
      deployedRange:Number.isFinite(deployed)?deployed:null,
      deployedFinite:Number.isFinite(deployed),
      ...evidence
    };
  });
  const deployedRanges=rows.map(x=>x.deployedRange===null?NaN:x.deployedRange);
  const atr20=averageFinite(deployedRanges);
  const atrPercent=atr20&&close?atr20/close*100:null;
  const formalCoerced=atrPercent||0;
  const formalFail=formalCoerced<1||formalCoerced>10;
  const observedRanges=rows.map(x=>x.observedRange).filter(Number.isFinite);
  const observedOnlyAtr=observedRanges.length?observedRanges.reduce((a,b)=>a+b,0)/observedRanges.length:null;
  const observedOnlyAtrPercent=observedOnlyAtr!==null&&close?observedOnlyAtr/close*100:null;
  return {
    schemaVersion:"atr-quality-source-observer-v0.1",
    state:"OBSERVED",
    historyDays:filtered.length,
    last20Requested:slice.length,
    close,
    deployed:{
      finiteRangeCount:rows.filter(x=>x.deployedFinite).length,
      atr20,
      atrPercent,
      formalCoercedAtrPercent:formalCoerced,
      lowerFail:formalCoerced<1,
      upperFail:formalCoerced>10,
      pass:!formalFail
    },
    sourceQuality:{
      fullyObservedRangeCount:rows.filter(x=>x.observed).length,
      highNullCount:rows.filter(x=>x.highState==="NULL").length,
      lowNullCount:rows.filter(x=>x.lowState==="NULL").length,
      highMissingOrInvalidCount:rows.filter(x=>x.highState==="MISSING_OR_INVALID").length,
      lowMissingOrInvalidCount:rows.filter(x=>x.lowState==="MISSING_OR_INVALID").length,
      observedOnlyAtr,
      observedOnlyAtrPercent,
      completeObserved20:rows.length===20&&rows.every(x=>x.observed)
    },
    rows,
    guards:{
      historyFreshnessDateAdmissionDoesNotProveOhlcNumericCompleteness:true,
      nullHighLowCanBeJavascriptZeroCoercedInsideDeployedRange:true,
      nonfiniteRangeCanBeDroppedByAverageFinite:true,
      atrAffectsBothAdmissionAndDownstreamStopRr:true,
      noOutcomeUse:true,
      formalCoreChanged:false
    }
  };
}

export function compareAtrToCloseFallback(history=[]){
  const filtered=Array.isArray(history)?history.filter(item=>num(item?.close)!==null):[];
  if(!filtered.length) return null;
  const closes=filtered.map(item=>Number(item.close));
  const close=closes.at(-1);
  const slice=filtered.slice(-20),offset=filtered.length-slice.length;
  const ranges=slice.map((item,idx)=>{
    const globalIndex=offset+idx;
    const prev=closes[Math.max(0,globalIndex-1)]||item.close;
    const high=num(item.high)??Number(item.close);
    const low=num(item.low)??Number(item.close);
    return Math.max(high-low,Math.abs(high-prev),Math.abs(low-prev));
  });
  const atr=averageFinite(ranges);
  const pct=atr&&close?atr/close*100:null;
  const coerced=pct||0;
  return {
    comparator:"EXPLICIT_CLOSE_FALLBACK_RESEARCH_ONLY",
    atr20:atr,atrPercent:pct,
    pass:coerced>=1&&coerced<=10,
    notDeployedTruth:true
  };
}
