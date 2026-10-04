export const WITNESS_20260918=Object.freeze({
 decisionDate:"2026-09-18",
 symbols:["2006","3105","6133"],
 currentAllocation:{2006:50000,3105:64000,6133:54000},
 equalCapitalAllocation:{2006:56000,3105:56000,6133:56000}
});
export function grossSizingAttribution({returns,currentAllocation,comparatorAllocation}){
 const symbols=Object.keys(currentAllocation||{});
 if(!symbols.length) return {status:"UNKNOWN",reason:"EMPTY_SUPPORT"};
 let currentPnl=0,comparatorPnl=0;
 for(const s of symbols){
  if(!Number.isFinite(returns?.[s])||!Number.isFinite(comparatorAllocation?.[s]))
   return {status:"UNKNOWN",reason:"INCOMPLETE_COMMON_SUPPORT",symbol:s};
  currentPnl+=currentAllocation[s]*returns[s];
  comparatorPnl+=comparatorAllocation[s]*returns[s];
 }
 const currentDeployment=symbols.reduce((x,s)=>x+currentAllocation[s],0);
 const comparatorDeployment=symbols.reduce((x,s)=>x+comparatorAllocation[s],0);
 if(Math.abs(currentDeployment-comparatorDeployment)>1e-9)
  return {status:"INELIGIBLE",reason:"DEPLOYMENT_MISMATCH"};
 return {status:"READY",currentPnl,comparatorPnl,grossSizingAlpha:currentPnl-comparatorPnl,currentDeployment};
}
export function outcomeReceiptEligibility(r={}){
 const reasons=[];
 if(r.matured!==true) reasons.push("OUTCOME_NOT_MATURED");
 if(!r.horizon) reasons.push("HORIZON_UNKNOWN");
 if(!r.outcomeReceiptId) reasons.push("OUTCOME_RECEIPT_MISSING");
 if(!r.firstKnownAt) reasons.push("FIRST_KNOWN_TIME_UNKNOWN");
 if(r.firstKnownAt&&r.decisionAt&&Date.parse(r.firstKnownAt)<=Date.parse(r.decisionAt)) reasons.push("OUTCOME_TIME_INVALID");
 if(r.usesFutureInformation===true) reasons.push("FUTURE_INFORMATION_USED");
 return {eligible:reasons.length===0,reasons};
}
