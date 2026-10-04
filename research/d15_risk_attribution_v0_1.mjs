const finite=x=>Number.isFinite(x);
export function plannedStopRiskAttribution({allocations,stopRiskFractions}){
 const symbols=Object.keys(allocations||{});
 if(!symbols.length)return{status:"UNKNOWN",reason:"EMPTY_PORTFOLIO"};
 const rows=[];let total=0;
 for(const s of symbols){
  const a=allocations[s],q=stopRiskFractions?.[s];
  if(!finite(a)||!finite(q)||a<0||q<0)return{status:"UNKNOWN",reason:"INVALID_INPUT",symbol:s};
  const risk=a*q;total+=risk;rows.push({symbol:s,allocation:a,stopRiskFraction:q,plannedStopRisk:risk});
 }
 if(total===0)return{status:"READY",totalPlannedStopRisk:0,rows:rows.map(x=>({...x,riskShare:null}))};
 return{status:"READY",totalPlannedStopRisk:total,rows:rows.map(x=>({...x,riskShare:x.plannedStopRisk/total}))};
}
export function sizingRiskDelta({currentAllocation,comparatorAllocation,stopRiskFractions}){
 const syms=Object.keys(currentAllocation||{});let delta=0;
 for(const s of syms){
  if(!finite(comparatorAllocation?.[s])||!finite(stopRiskFractions?.[s]))return{status:"UNKNOWN",reason:"COMMON_SUPPORT_MISMATCH",symbol:s};
  delta+=(currentAllocation[s]-comparatorAllocation[s])*stopRiskFractions[s];
 }
 return{status:"READY",sizingRiskDelta:delta};
}
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const matVec=(A,x)=>A.map(r=>dot(r,x));
export function covarianceRiskAttribution({weights,covariance}){
 if(!Array.isArray(weights)||!Array.isArray(covariance)||weights.length===0||covariance.length!==weights.length)return{status:"UNKNOWN",reason:"DIMENSION_MISMATCH"};
 if(covariance.some(r=>!Array.isArray(r)||r.length!==weights.length))return{status:"UNKNOWN",reason:"DIMENSION_MISMATCH"};
 const sw=matVec(covariance,weights),variance=dot(weights,sw);
 if(!finite(variance)||variance<0)return{status:"UNKNOWN",reason:"INVALID_VARIANCE"};
 const volatility=Math.sqrt(variance);
 return{status:"READY",variance,volatility,marginalVariance:sw,componentVariance:weights.map((w,i)=>w*sw[i]),componentVolatility:volatility>0?weights.map((w,i)=>w*sw[i]/volatility):weights.map(()=>null)};
}
export function informationRatio({portfolioReturns,benchmarkReturns,periodsPerYear=252}){
 if(!Array.isArray(portfolioReturns)||portfolioReturns.length<2||portfolioReturns.length!==benchmarkReturns?.length)return{status:"UNKNOWN",reason:"INSUFFICIENT_SYNCHRONIZED_SERIES"};
 const a=portfolioReturns.map((x,i)=>x-benchmarkReturns[i]);if(a.some(x=>!finite(x)))return{status:"UNKNOWN",reason:"NONFINITE_RETURN"};
 const mean=a.reduce((s,x)=>s+x,0)/a.length,variance=a.reduce((s,x)=>s+(x-mean)**2,0)/(a.length-1),te=Math.sqrt(variance);
 if(te===0)return{status:"UNKNOWN",reason:"ZERO_TRACKING_ERROR",meanActiveReturn:mean};
 return{status:"READY",n:a.length,annualizedActiveReturn:mean*periodsPerYear,annualizedTrackingError:te*Math.sqrt(periodsPerYear),informationRatio:mean*Math.sqrt(periodsPerYear)/te};
}
