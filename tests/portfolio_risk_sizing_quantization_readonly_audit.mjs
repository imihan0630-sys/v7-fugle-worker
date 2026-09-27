import {sizingQuantizationCascade} from "../research/sizing_quantization_cascade_v0_1.mjs";

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
    symbol:String(p.symbol||""),
    priorityScore:p.priority_score,
    totalAllocation:p.total_allocation,
    buyHigh:p.buy_high,
    firstShares:p.first_shares,
    secondShares:p.second_shares,
    stop:p.stop
  });
}

const rows=[];
for(const [scanDate,datePlans] of [...byDate.entries()].sort()){
  const day=dayMap.get(scanDate)||{};
  const totalCapital=Number(day.total_capital);
  const out=sizingQuantizationCascade(datePlans,totalCapital);
  rows.push({scanDate,selectedCount:Number(day.selected_count),status:String(day.status||""),quantization:out});
}

const ready=rows.filter(x=>x.quantization?.status==="READY");
const summary=ready.map(x=>({
  scanDate:x.scanDate,
  selectedCount:x.selectedCount,
  nominalDeployTargetNTD:x.quantization.nominalDeployTargetNTD,
  continuousCappedAllocationNTD:x.quantization.continuousCappedAllocationNTD,
  plannedAllocationNTD:x.quantization.plannedAllocationNTD,
  planPreviewSuggestedNotionalNTD:x.quantization.planPreviewSuggestedNotionalNTD,
  capInducedReserveNTD:x.quantization.capInducedReserveNTD,
  thousandFloorShortfallNTD:x.quantization.thousandFloorShortfallNTD,
  shareFloorResidualNTD:x.quantization.shareFloorResidualNTD,
  totalNominalToPreviewShortfallNTD:x.quantization.totalNominalToPreviewShortfallNTD,
  previewUtilizationPctOfPlanned:x.quantization.previewUtilizationPctOfPlanned,
  previewUtilizationPctOfNominalTarget:x.quantization.previewUtilizationPctOfNominalTarget,
  plannedProjectedStopRiskHHI:x.quantization.plannedProjectedStopRiskHHI,
  previewProjectedStopRiskHHI:x.quantization.previewProjectedStopRiskHHI,
  previewMinusPlannedRiskHHI:x.quantization.previewMinusPlannedRiskHHI,
  plannedProjectedStopRiskNTD:x.quantization.plannedProjectedStopRiskNTD,
  previewProjectedStopRiskNTD:x.quantization.previewProjectedStopRiskNTD,
  details:x.quantization.details
}));

console.log(JSON.stringify({
  ok:true,
  schemaVersion:"SIZING_QUANTIZATION_PRODUCTION_AUDIT_V0_1",
  readOnly:true,
  decisionImpact:false,
  endpoint:"/api/journal?days=730",
  readyDates:ready.length,
  unknownDates:rows.filter(x=>x.quantization?.status!=="READY").map(x=>({scanDate:x.scanDate,status:x.quantization?.status,reason:x.quantization?.reason||null})),
  dates:summary,
  interpretation:"Plan-time sizing quantization only. Continuous score allocation is compared with NT$1000 allocation floor and plan-preview share-floor notional at buyHigh. Preview suggested notional is not actual order/fill/deployed capital."
},null,2));
