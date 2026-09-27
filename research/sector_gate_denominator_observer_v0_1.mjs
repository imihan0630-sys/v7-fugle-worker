function num(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function average(values){
  const valid=values.filter(Number.isFinite);
  return valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:0;
}
function exactSectorStat(rows=[],features=[]){
  const featureMap=new Map(features.map(x=>[String(x.symbol),x]));
  const items=Array.isArray(rows)?rows:[];
  const amount=items.reduce((s,row)=>s+(row.tradeValue||0),0);
  const breadth=items.length?items.filter(row=>(row.changePercent||0)>0).length/items.length*100:0;
  const avgChange=average(items.map(row=>row.changePercent).filter(Number.isFinite));
  const ready=items.map(item=>({item,feature:featureMap.get(String(item.symbol))}))
    .filter(pair=>pair.feature?.historyDays>=20);
  const avgAmount20=ready.reduce((s,p)=>s+(p.feature.avgAmount20||0),0);
  const coveredAmount=ready.reduce((s,p)=>s+(p.item.tradeValue||0),0);
  return {
    stockCount:items.length,
    amount,
    breadth,
    avgChange,
    historicalCoverage:ready.length,
    avgAmount20,
    coveredAmount,
    amountVs20DayAverage:avgAmount20>0?coveredAmount/avgAmount20:null,
    diagnostics:{
      changeObservedCount:items.filter(row=>Number.isFinite(row.changePercent)).length,
      changeMissingCount:items.filter(row=>!Number.isFinite(row.changePercent)).length,
      advanceCountDeployed:items.filter(row=>(row.changePercent||0)>0).length,
      avgChangeDenominator:items.filter(row=>Number.isFinite(row.changePercent)).length,
      breadthDenominator:items.length,
      activityReadyCount:ready.length,
      activityAvgAmountObservedCount:ready.filter(p=>num(p.feature?.avgAmount20)!==null).length,
      activityAvgAmountPositiveCount:ready.filter(p=>(num(p.feature?.avgAmount20)??0)>0).length,
      activityTradeValueObservedCount:ready.filter(p=>num(p.item?.tradeValue)!==null).length
    }
  };
}
function gateFromStat(stat){
  const avg=stat?.avgChange,breadth=stat?.breadth,amount=stat?.amountVs20DayAverage;
  const pass=Number.isFinite(avg)&&Number.isFinite(breadth)&&
    breadth>=40&&avg>=-1&&(amount>=0.5);
  return {
    pass,
    checks:{
      breadthGte40:Number.isFinite(breadth)?breadth>=40:null,
      avgChangeGteMinus1:Number.isFinite(avg)?avg>=-1:null,
      amountVs20Gte0_5:amount===null||amount===undefined?null:amount>=0.5
    }
  };
}
export function observeSectorGateDenominators({
  industryRows=[],
  industryFeatures=[],
  candidateSymbol=null
}={}){
  const deployed=exactSectorStat(industryRows,industryFeatures);
  const deployedGate=gateFromStat(deployed);
  let leaveOneOut=null;
  const symbol=String(candidateSymbol??"").trim();
  if(symbol){
    const rows=industryRows.filter(r=>String(r.symbol)!==symbol);
    const features=industryFeatures.filter(r=>String(r.symbol)!==symbol);
    const stat=exactSectorStat(rows,features);
    leaveOneOut={...stat,gate:gateFromStat(stat),researchCounterfactualOnly:true};
  }
  const observedChangeRows=industryRows.filter(r=>Number.isFinite(r.changePercent));
  const observedOnlyBreadth=observedChangeRows.length
    ?observedChangeRows.filter(r=>r.changePercent>0).length/observedChangeRows.length*100:null;
  return {
    schemaVersion:"sector-gate-denominator-observer-v0.1",
    deployed:{...deployed,gate:deployedGate},
    evidence:{
      observedOnlyBreadth,
      breadthMissingChangeTreatedAsNonAdvance:deployed.diagnostics.changeMissingCount>0,
      breadthAndAvgChangeUseDifferentDenominators:
        deployed.diagnostics.breadthDenominator!==deployed.diagnostics.avgChangeDenominator,
      activityHistoryReadyCanIncludeMissingAvgAmount:
        deployed.diagnostics.activityReadyCount>deployed.diagnostics.activityAvgAmountObservedCount
    },
    leaveOneOut,
    guards:{
      deployedSectorStateIsInclusiveOfCandidate:true,
      leaveOneOutIsNotFormalTruth:true,
      breadthUsesAllIndustryTodayRows:true,
      avgChangeUsesFiniteChangeRowsOnly:true,
      amountUsesHistoryReadySubsetOnly:true,
      noOutcomeUse:true,
      formalCoreChanged:false
    }
  };
}
