/**
 * Sara Wang "金包銀" *research proxy* — causal input/denominator guard only.
 * This is not the author's source code, full proprietary indicator or strategy.
 * Class A isolated research. No outcomes, scoring, scans, D1, Worker, trading.
 */
const validTime = value => {
  const t=Date.parse(value);
  return Number.isFinite(t) ? t : NaN;
};
const finitePositive=x=>Number.isFinite(x)&&x>0;
const UNKNOWN=(reason,detail={})=>({state:"UNKNOWN_BLOCKED",reason,...detail});
export const smaAt=(data,lookback,endIndex=data.length-1)=>{
  if(!Number.isInteger(lookback)||lookback<1||endIndex-lookback+1<0)return null;
  let sum=0;
  for(let i=endIndex-lookback+1;i<=endIndex;i++){
    let v=data[i]?.close;
    if(!finitePositive(v))return null;
    sum+=v;
  }
  return sum/lookback;
};
export function gateCompletedBars({bars,asOf,barBucketContractVerified,historyCoverageComplete,
   lifecycleEligible,priceSpace,adjustmentVintageCertified}){
  const cutoff=validTime(asOf);
  if(!Number.isFinite(cutoff))return UNKNOWN("CUTOFF_INVALID");
  if(barBucketContractVerified!==true)return UNKNOWN("60M_BUCKET_CONTRACT_UNKNOWN");
  if(historyCoverageComplete!==true)return UNKNOWN("SOURCE_COVERAGE_UNKNOWN");
  if(lifecycleEligible!==true)return UNKNOWN("LIFECYCLE_UNKNOWN_OR_INELIGIBLE");
  if(!["RAW_EXECUTION","TECHNICAL_CONTINUITY"].includes(priceSpace))return UNKNOWN("PRICE_SPACE_UNKNOWN");
  if(priceSpace==="TECHNICAL_CONTINUITY"&&adjustmentVintageCertified!==true)return UNKNOWN("ADJUSTMENT_VINTAGE_UNKNOWN");
  if(!Array.isArray(bars))return UNKNOWN("BARS_NOT_ARRAY");
  const prefix=bars.filter(b=>validTime(b?.endAt)<=cutoff);
  if(prefix.length<245)return UNKNOWN("WARMUP_240_AND_SLOPE_INSUFFICIENT",{count:prefix.length});
  let previous=-Infinity;
  for(const b of prefix){
    const end=validTime(b.endAt),available=validTime(b.availableAt);
    if(!Number.isFinite(end)||end<=previous)return UNKNOWN("BAR_ORDER_OR_DUPLICATE");
    if(!Number.isFinite(available)||available>cutoff||available<end)return UNKNOWN("BAR_NOT_CAUSALLY_AVAILABLE");
    if(b.complete!==true)return UNKNOWN("PARTIAL_BAR_AT_CUTOFF");
    if(![b.open,b.high,b.low,b.close].every(finitePositive)||b.high<b.low||
       b.high<Math.max(b.open,b.close)||b.low>Math.min(b.open,b.close))
      return UNKNOWN("OHLC_INVALID");
    previous=end;
  }
  return {state:"INPUT_CERTIFIED",prefix};
}
export function computeGeometry(prefix){
  if(!Array.isArray(prefix)||prefix.length<245)return UNKNOWN("MA_WARMUP_INSUFFICIENT");
  const i=prefix.length-1,ma={};
  for(const n of [5,10,20,60,120,240]){
    ma[n]=smaAt(prefix,n,i);
    if(ma[n]===null)return UNKNOWN("MA_INPUT_INVALID");
  }
  const ma60Prev=smaAt(prefix,60,i-5);
  const ma120Prev=smaAt(prefix,120,i-5);
  const ma240Prev=smaAt(prefix,240,i-5);
  if([ma60Prev,ma120Prev,ma240Prev].some(x=>x===null))return UNKNOWN("MA_SLOPE_INPUT_INVALID");
  const lower=ma[60],upper=Math.min(ma[120],ma[240]);
  const lowerRising=lower>ma60Prev;
  const longOverhead=ma[120]>lower&&ma[240]>lower;
  const longNotRising=ma[120]<=ma120Prev&&ma[240]<=ma240Prev;
  const nestedShort=ma[5]>ma[10]&&ma[10]>ma[20]&&ma[20]>=lower&&ma[5]<upper;
  const current=prefix[i].close;
  const lastFive=prefix.slice(-5);
  const nearSupport=lastFive.some(b=>b.low<=lower*1.02&&b.high>=lower*0.98);
  const withinZone=current>lower&&current<upper;
  return {state:"GEOMETRY_EVALUATED",proxyVersion:"JBY_RESEARCH_STRICT_A_V0_1",
     ready:lowerRising&&longOverhead&&longNotRising&&nestedShort&&nearSupport&&withinZone,
     flags:{lowerRising,longOverhead,longNotRising,nestedShort,nearSupport,withinZone},ma};
}
export function derivePriorStockTrend({dailyBars,pullbackStart,asOf,dailyCoverageComplete}){
  const start=validTime(pullbackStart),cut=validTime(asOf);
  if(!Number.isFinite(start)||!Number.isFinite(cut)||start>cut)return UNKNOWN("PULLBACK_START_INVALID");
  if(dailyCoverageComplete!==true)return UNKNOWN("DAILY_COVERAGE_UNKNOWN");
  if(!Array.isArray(dailyBars))return UNKNOWN("DAILY_BARS_MISSING");
  const prior=dailyBars.filter(b=>validTime(b?.endAt)<start);
  if(prior.length<65)return UNKNOWN("DAILY_TREND_WARMUP_INSUFFICIENT",{count:prior.length});
  let prev=-Infinity;
  for(const b of prior){
    const end=validTime(b.endAt),known=validTime(b.availableAt);
    if(!Number.isFinite(end)||end<=prev)return UNKNOWN("DAILY_ORDER_DUPLICATE");
    if(!Number.isFinite(known)||known>start||known<end||b.complete!==true)return UNKNOWN("DAILY_BAR_NOT_KNOWN_AT_PULLBACK");
    if(!finitePositive(b.close))return UNKNOWN("DAILY_PRICE_INVALID");
    prev=end;
  }
  const i=prior.length-1,m20=smaAt(prior,20),m60=smaAt(prior,60);
  const m20Prev=smaAt(prior,20,i-5);
  const ret20=prior[i].close/prior[i-20].close-1;
  const bullish=m20>m60&&m20>m20Prev&&ret20>0;
  const bearish=m20<m60&&m20<m20Prev&&ret20<0;
  return {state:"PRIOR_TREND_FROZEN",category:bullish?"PRIOR_UPTREND":bearish?"PRIOR_DOWNTREND":"MIXED",
     freezeAt:pullbackStart,ma20:m20,ma60:m60,return20:ret20,
     // Price ancestry is identical to other trend constructs; no new Alpha vote.
     informationRoot:"PRICE_OHLC"};
}
export function classifyOpportunity({geometry,priorTrend,marketBullKnown,marketBull,
      pullbackWitnessAvailable,securityIdentity,pullbackStart,structuralRootId}){
  if(geometry?.state!=="GEOMETRY_EVALUATED"||priorTrend?.state!=="PRIOR_TREND_FROZEN")
    return UNKNOWN("GEOMETRY_OR_TREND_UNVERIFIED");
  if(geometry.ready!==true)return {state:"NOT_GOLD_WRAPPED_SILVER_PROXY",cohort:null};
  if(!securityIdentity||!structuralRootId||!Number.isFinite(validTime(pullbackStart)))
    return UNKNOWN("EPISODE_IDENTITY_UNKNOWN");
  const episodeId=[securityIdentity,structuralRootId,pullbackStart].join("|");
  if(priorTrend.category==="PRIOR_UPTREND"){
    if(pullbackWitnessAvailable!==true)return UNKNOWN("PULLBACK_WITNESS_UNKNOWN",{episodeId});
    return {state:"COHORT_ASSIGNED",cohort:"T_TREND_PULLBACK",episodeId};
  }
  if(priorTrend.category==="PRIOR_DOWNTREND")
    return {state:"COHORT_ASSIGNED",cohort:"B_BOTTOM_REVERSAL",episodeId};
  if(priorTrend.category==="MIXED"&&marketBullKnown===true&&marketBull===true)
    return {state:"COHORT_ASSIGNED",cohort:"M_MARKET_BULL_ONLY",episodeId};
  return UNKNOWN("TREND_OR_MARKET_CONTEXT_AMBIGUOUS",{episodeId});
}
export function denominatorSummary(rows){
  if(!Array.isArray(rows))return UNKNOWN("DENOMINATOR_MISSING");
  const seen=new Set();const out={total:rows.length,uniqueEpisodes:0,
    cohorts:{T_TREND_PULLBACK:0,B_BOTTOM_REVERSAL:0,M_MARKET_BULL_ONLY:0},
    unknown:0,nonSignals:0,duplicates:0};
  for(const r of rows){
    if(r?.state==="COHORT_ASSIGNED"){
      if(!r.episodeId){out.unknown++;continue;}
      if(seen.has(r.episodeId)){out.duplicates++;continue;}
      seen.add(r.episodeId);
      if(Object.hasOwn(out.cohorts,r.cohort)){out.cohorts[r.cohort]++;out.uniqueEpisodes++;}
      else out.unknown++;
    }else if(r?.state==="NOT_GOLD_WRAPPED_SILVER_PROXY")out.nonSignals++;
    else out.unknown++;
  }
  return {state:"DENOMINATOR_ONLY_NO_OUTCOMES",...out};
}
