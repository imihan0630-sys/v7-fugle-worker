const finite=x=>Number.isFinite(x);
export function activeShare({portfolioWeights,benchmarkWeights,cashPolicy="EXPLICIT"}){
 const keys=new Set([...Object.keys(portfolioWeights||{}),...Object.keys(benchmarkWeights||{})]);
 if(cashPolicy!=="EXPLICIT") return {status:"UNKNOWN",reason:"CASH_POLICY_NOT_EXPLICIT"};
 let sum=0;
 for(const k of keys){
  const p=portfolioWeights?.[k],b=benchmarkWeights?.[k];
  if(!finite(p)||!finite(b)) return {status:"UNKNOWN",reason:"INCOMPLETE_WEIGHT_VECTOR",security:k};
  sum+=Math.abs(p-b);
 }
 return {status:"READY",activeShare:.5*sum};
}
export function trackingError({portfolioReturns,benchmarkReturns,annualizationFactor=252}){
 if(!Array.isArray(portfolioReturns)||!Array.isArray(benchmarkReturns)||portfolioReturns.length!==benchmarkReturns.length||portfolioReturns.length<2)
  return {status:"UNKNOWN",reason:"INSUFFICIENT_SYNCHRONIZED_SERIES"};
 const a=portfolioReturns.map((x,i)=>x-benchmarkReturns[i]);
 if(a.some(x=>!finite(x))) return {status:"UNKNOWN",reason:"NONFINITE_RETURN"};
 const mean=a.reduce((s,x)=>s+x,0)/a.length;
 const variance=a.reduce((s,x)=>s+(x-mean)**2,0)/(a.length-1);
 return {status:"READY",n:a.length,meanActiveReturn:mean,trackingError:Math.sqrt(variance),annualizedTrackingError:Math.sqrt(variance*annualizationFactor)};
}
export function sameSupportSizingAttribution({returns,currentWeights,comparatorWeights}){
 const keys=Object.keys(returns||{});
 if(!keys.length) return {status:"UNKNOWN",reason:"EMPTY_SUPPORT"};
 for(const k of keys) if(!finite(returns[k])||!finite(currentWeights?.[k])||!finite(comparatorWeights?.[k]))
  return {status:"UNKNOWN",reason:"SUPPORT_MISMATCH",security:k};
 const cur=keys.reduce((s,k)=>s+currentWeights[k]*returns[k],0);
 const cmp=keys.reduce((s,k)=>s+comparatorWeights[k]*returns[k],0);
 return {status:"READY",currentReturn:cur,comparatorReturn:cmp,sizingContribution:cur-cmp};
}
export function attributionEligibility(r={}){
 const reasons=[];
 if(!r.decisionAt) reasons.push("DECISION_TIME_UNKNOWN");
 if(!r.benchmarkId) reasons.push("BENCHMARK_UNKNOWN");
 if(!r.benchmarkKnownAt) reasons.push("BENCHMARK_KNOWN_TIME_UNKNOWN");
 if(r.benchmarkKnownAt&&r.decisionAt&&Date.parse(r.benchmarkKnownAt)>Date.parse(r.decisionAt)) reasons.push("BENCHMARK_NOT_PIT");
 if(!r.commonSupportId) reasons.push("COMMON_SUPPORT_UNKNOWN");
 return {eligible:reasons.length===0,reasons};
}
