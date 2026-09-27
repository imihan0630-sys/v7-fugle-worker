import {gridConstrainedEqualRisk} from "../research/grid_constrained_equal_risk_v0_1.mjs";
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
  const day=dayMap.get(scanDate)||{};
  if(datePlans.length<2) continue;
  const capital=Number(day.total_capital);
  const current=sizingQuantizationCascade(datePlans,capital);
  const grid=gridConstrainedEqualRisk(datePlans,capital,{perNameCapPct:35,gridNTD:1000});
  const preview=grid?.status==="READY"
    ?quantizedComparatorPreview(datePlans,grid.allocations.map(x=>({symbol:x.symbol,allocation:x.gridAllocationNTD})))
    :null;
  dates.push({
    scanDate,
    selectedCount:datePlans.length,
    current:{
      plannedAllocationNTD:current?.plannedAllocationNTD??null,
      previewSuggestedNotionalNTD:current?.planPreviewSuggestedNotionalNTD??null,
      previewProjectedStopRiskNTD:current?.previewProjectedStopRiskNTD??null,
      previewProjectedStopRiskHHI:current?.previewProjectedStopRiskHHI??null
    },
    gridEqualRisk:grid,
    gridEqualRiskPreview:preview,
    deltas:(current?.status==="READY"&&preview?.status==="READY")?{
      currentMinusGridPreviewRiskNTD:Number((current.previewProjectedStopRiskNTD-preview.previewProjectedStopRiskNTD).toFixed(4)),
      currentMinusGridPreviewRiskHHI:Number((current.previewProjectedStopRiskHHI-preview.previewProjectedStopRiskHHI).toFixed(8)),
      currentMinusGridPreviewSuggestedNotionalNTD:Number((current.planPreviewSuggestedNotionalNTD-preview.previewSuggestedNotionalNTD).toFixed(4))
    }:null
  });
}

console.log(JSON.stringify({
 ok:true,
 schemaVersion:"GRID_EQUAL_RISK_PRODUCTION_AUDIT_V0_1",
 readOnly:true,
 decisionImpact:false,
 endpoint:"/api/journal?days=730",
 identifyingDates:dates.length,
 dates,
 interpretation:"Same selected names, same current planned deployment, same 35% cap, NT$1,000 allocation grid, then same 60/40 tranche and integer-share preview flooring. Structural only; no outcomes/fills."
},null,2));
