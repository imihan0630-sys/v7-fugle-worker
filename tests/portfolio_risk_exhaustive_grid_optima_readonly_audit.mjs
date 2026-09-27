import {exhaustiveGridRiskOptima} from "../research/exhaustive_grid_risk_optima_v0_1.mjs";
import {sizingQuantizationCascade,quantizedComparatorPreview} from "../research/sizing_quantization_cascade_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));

const days=Array.isArray(data?.days)?data.days:[];
const plans=Array.isArray(data?.planRows)?data.planRows:[];
const dayMap=new Map(days.map(x=>[String(x.scan_date||""),x]));
const byDate=new Map();
for(const p of plans){
  const d=String(p.scan_date||"");
  if(!byDate.has(d)) byDate.set(d,[]);
  byDate.get(d).push({
    code:String(p.symbol||""),
    symbol:String(p.symbol||""),
    buyLow:p.buy_low,
    buyHigh:p.buy_high,
    stop:p.stop,
    totalAllocation:p.total_allocation,
    priorityScore:p.priority_score,
    firstShares:p.first_shares,
    secondShares:p.second_shares
  });
}

const dates=[];
for(const [scanDate,datePlans] of [...byDate.entries()].sort()){
  if(datePlans.length<2) continue;
  const day=dayMap.get(scanDate)||{};
  const capital=Number(day.total_capital);
  const current=sizingQuantizationCascade(datePlans,capital);
  const exhaustive=exhaustiveGridRiskOptima(datePlans,capital,{gridNTD:1000,perNameCapPct:35,minUnitsPerName:1,maxStates:2000000});
  const pre=exhaustive?.preShare?.hhiOptima?.[0]||null;
  const post=exhaustive?.postShare?.hhiOptima?.[0]||null;
  const prePreview=pre?quantizedComparatorPreview(datePlans,pre.allocations.map(x=>({symbol:x.symbol,allocation:x.allocationNTD}))):null;
  const postPreview=post?quantizedComparatorPreview(datePlans,post.allocations.map(x=>({symbol:x.symbol,allocation:x.allocationNTD}))):null;
  dates.push({
    scanDate,
    selectedCount:datePlans.length,
    current:{
      allocations:datePlans.map(p=>({symbol:p.symbol,allocationNTD:Number(p.totalAllocation)})),
      previewSuggestedNotionalNTD:current?.planPreviewSuggestedNotionalNTD??null,
      previewProjectedStopRiskNTD:current?.previewProjectedStopRiskNTD??null,
      previewProjectedStopRiskHHI:current?.previewProjectedStopRiskHHI??null
    },
    exhaustive:{
      status:exhaustive?.status||"UNKNOWN",
      stateCount:exhaustive?.stateCount??null,
      preShareMinHHI:exhaustive?.preShare?.minHHI??null,
      preShareHHIOptimumCount:exhaustive?.preShare?.hhiOptimumCount??null,
      preShareMinMaxToMin:exhaustive?.preShare?.minMaxToMin??null,
      preShareMaxMinOptimumCount:exhaustive?.preShare?.maxMinOptimumCount??null,
      preShareHHIOptimum:pre,
      postShareMinHHI:exhaustive?.postShare?.minHHI??null,
      postShareHHIOptimumCount:exhaustive?.postShare?.hhiOptimumCount??null,
      postShareMinMaxToMin:exhaustive?.postShare?.minMaxToMin??null,
      postShareMaxMinOptimumCount:exhaustive?.postShare?.maxMinOptimumCount??null,
      postShareHHIOptimum:post,
      optimumAllocationChangedAfterShareFloor:pre&&post
        ?JSON.stringify(pre.allocations)!==JSON.stringify(post.allocations)
        :null
    },
    postShareGlobalComparator:postPreview,
    deltas:(current?.status==="READY"&&postPreview?.status==="READY")?{
      currentMinusGlobalPostShareRiskNTD:Number((current.previewProjectedStopRiskNTD-postPreview.previewProjectedStopRiskNTD).toFixed(4)),
      currentMinusGlobalPostShareRiskHHI:Number((current.previewProjectedStopRiskHHI-postPreview.previewProjectedStopRiskHHI).toFixed(10)),
      globalPostShareMinusCurrentPreviewNotionalNTD:Number((postPreview.previewSuggestedNotionalNTD-current.planPreviewSuggestedNotionalNTD).toFixed(4))
    }:null
  });
}

console.log(JSON.stringify({
 ok:true,
 schemaVersion:"EXHAUSTIVE_GRID_RISK_OPTIMA_PRODUCTION_AUDIT_V0_1",
 readOnly:true,
 decisionImpact:false,
 endpoint:"/api/journal?days=730",
 identifyingDates:dates.length,
 dates,
 interpretation:"Exhaustive same-deployment, same-name, 35%-cap NT$1,000-grid structural search. PRE_SHARE and POST_SHARE objectives are intentionally separate; exact optimum may move after integer-share flooring. No outcomes/fills."
},null,2));
