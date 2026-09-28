// Extreme tranche-ratio feasibility stress v0.1 — research-only.
// Separates concentration robustness from two-stage share orderability.

function n(v){if(v===null||v===undefined||String(v).trim()==="")return null;const x=Number(v);return Number.isFinite(x)?x:null}
function sym(v){return String(v??"").trim()}
function round(v,d=6){if(!Number.isFinite(v))return null;const p=10**d;return Math.round(v*p)/p}

export function trancheStageOrderability(plans=[],{
  ratios=Array.from({length:99},(_,i)=>(i+1)/100)
}={}){
  const rs=(ratios||[]).map(n);
  if(!rs.length||rs.some(r=>!(r>0&&r<1))) return {status:"UNKNOWN",reason:"INVALID_RATIOS"};
  const rows=(plans||[]).map(p=>({
    symbol:sym(p?.symbol??p?.code),
    allocation:n(p?.totalAllocation??p?.total_allocation),
    buyHigh:n(p?.buyHigh??p?.buy_high)
  }));
  if(!rows.length||rows.some(x=>!x.symbol||x.allocation===null||x.allocation<0||!(x.buyHigh>0))){
    return {status:"UNKNOWN",reason:"INCOMPLETE_PLAN_GEOMETRY"};
  }

  const results=[];
  for(const ratio of rs){
    const details=rows.map(x=>{
      const firstAmount=Math.round(x.allocation*ratio);
      const addAmount=x.allocation-firstAmount;
      const firstShares=Math.floor(firstAmount/x.buyHigh);
      const addShares=Math.floor(addAmount/x.buyHigh);
      return {
        symbol:x.symbol,allocationNTD:x.allocation,buyHigh:x.buyHigh,
        firstRatio:ratio,addRatio:1-ratio,
        firstAmountNTD:firstAmount,addAmountNTD:addAmount,
        firstShares,addShares,
        firstOrderable:firstShares>=1,
        addOrderable:addShares>=1,
        bothStagesOrderable:firstShares>=1&&addShares>=1
      };
    });
    results.push({
      firstRatio:ratio,
      allNamesBothStagesOrderable:details.every(x=>x.bothStagesOrderable),
      zeroFirstSymbols:details.filter(x=>!x.firstOrderable).map(x=>x.symbol),
      zeroAddSymbols:details.filter(x=>!x.addOrderable).map(x=>x.symbol),
      details
    });
  }

  const feasible=results.filter(x=>x.allNamesBothStagesOrderable);
  return {
    status:"READY",researchOnly:true,decisionImpact:false,
    testedRatios:results.length,
    allStagesFeasibleCount:feasible.length,
    minFeasibleFirstRatio:feasible.length?round(Math.min(...feasible.map(x=>x.firstRatio)),4):null,
    maxFeasibleFirstRatio:feasible.length?round(Math.max(...feasible.map(x=>x.firstRatio)),4):null,
    infeasibleRatios:results.filter(x=>!x.allNamesBothStagesOrderable),
    results,
    semantics:"Plan-preview orderability at buyHigh only. Does not imply BUY/ADD trigger or fill. A ratio can be concentration-valid yet execution-infeasible if either tranche rounds to zero shares."
  };
}
