// Class-A research-only counterfactual. No trade signal, outcomes or runtime integration.
const BLOCK=(reason)=>({state:"UNKNOWN_BLOCKED",reason});
export function compareSupportTouch({bars,cutoffIndex,tolerancePct=0.02,sourceCertified=false}){
 if(sourceCertified!==true)return BLOCK("SOURCE_BAR_VINTAGE_UNCERTIFIED");
 if(!Array.isArray(bars)||!Number.isInteger(cutoffIndex)||cutoffIndex<64||
   cutoffIndex>=bars.length)return BLOCK("MA60_FIVE_BAR_LOOKBACK_INSUFFICIENT");
 if(!Number.isFinite(tolerancePct)||tolerancePct<0||tolerancePct>0.1)
   return BLOCK("TOLERANCE_INVALID");
 let sum=0;
 const ma=[];
 for(let i=0;i<=cutoffIndex;i++){
   const b=bars[i];
   if(!b||![b.open,b.high,b.low,b.close].every(v=>Number.isFinite(v)&&v>0)||
      b.high<Math.max(b.open,b.close)||b.low>Math.min(b.open,b.close))
      return BLOCK("OHLC_INVALID");
   sum+=b.close;
   if(i>=60)sum-=bars[i-60].close;
   ma.push(i>=59?sum/60:null);
 }
 const current=ma[cutoffIndex],legacyHits=[],dynamicHits=[];
 for(let i=cutoffIndex-4;i<=cutoffIndex;i++){
   const b=bars[i],historical=ma[i];
   if(b.low<=current*(1+tolerancePct)&&b.high>=current*(1-tolerancePct))
     legacyHits.push(i);
   if(b.low<=historical*(1+tolerancePct)&&b.high>=historical*(1-tolerancePct))
     dynamicHits.push(i);
 }
 return {state:"COMPARATOR_EVALUATED",currentSupportBandTouch:legacyHits.length>0,
   historicalDynamicSupportTouch:dynamicHits.length>0,
   semanticDisagreement:(legacyHits.length>0)!==(dynamicHits.length>0),
   legacyHitIndices:legacyHits,dynamicHitIndices:dynamicHits,
   sourceRoot:"PRICE_OHLC",effectiveIndependentEvidenceCount:1,
   cutoffIndex,ma60AtCutoff:current,
   note:"Research comparator only; original author exact parameter definition not verified"};
}
