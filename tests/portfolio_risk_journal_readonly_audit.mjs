import {portfolioTierA} from "../research/portfolio_risk_tier_a_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));

const days=Array.isArray(data?.days)?data.days:[];
const plans=Array.isArray(data?.planRows)?data.planRows:[];
const recovered=Array.isArray(data?.recoveredRows)?data.recoveredRows:[];

const byDate=new Map();
for(const row of plans){
  const date=String(row?.scan_date||"");
  if(!byDate.has(date)) byDate.set(date,[]);
  byDate.get(date).push({
    code:String(row?.symbol||""),
    buyLow:row?.buy_low,
    buyHigh:row?.buy_high,
    stop:row?.stop,
    totalAllocation:row?.total_allocation,
    allocationRatio:row?.allocation_ratio,
    priorityScore:row?.priority_score,
    rewardRisk:row?.reward_risk
  });
}
const dayMap=new Map(days.map(x=>[String(x.scan_date||""),x]));
const rows=[];
for(const [scanDate,datePlans] of [...byDate.entries()].sort()){
  const day=dayMap.get(scanDate)||{};
  const totalCapital=Number(day?.total_capital);
  const selectedCount=Number(day?.selected_count);
  const selectedCountMatches=Number.isFinite(selectedCount) && selectedCount===datePlans.length;
  const out=portfolioTierA(datePlans,totalCapital,{dataStatus:"COMPLETE"});
  rows.push({
    scanDate,
    totalCapital:Number.isFinite(totalCapital)?totalCapital:null,
    selectedCount:Number.isFinite(selectedCount)?selectedCount:null,
    selectedCountMatches,
    planRows:datePlans.length,
    knownRiskSymbols:out.knownRiskSymbols,
    unknownRiskSymbols:out.unknownRiskSymbols,
    plannedDeploymentNTD:out.plannedDeploymentNTD,
    deploymentRatioPct:out.deploymentRatioPct,
    projectedHeatPctLow:out.projectedHeatPctLow,
    projectedHeatPctHigh:out.projectedHeatPctHigh,
    effectiveCapitalNames:out.effectiveCapitalNames,
    status:String(day?.status||"")
  });
}
const fullyReconstructable=rows.filter(r=>r.selectedCountMatches && r.planRows>0 && r.knownRiskSymbols===r.planRows && Number.isFinite(r.totalCapital));
const incomplete=rows.filter(r=>!fullyReconstructable.includes(r));
const zeroSelected=days.filter(d=>Number(d?.selected_count)===0).map(d=>({scanDate:d.scan_date,status:d.status,totalCapital:d.total_capital}));

console.log(JSON.stringify({
  ok:true,
  readOnly:true,
  outcomeFieldsRead:false,
  endpoint:"/api/journal?days=730",
  recordedDays:days.length,
  formalPlanRows:plans.length,
  recoveredRowsExcluded:recovered.length,
  planDatesWithRows:rows.length,
  fullyReconstructablePlanDates:fullyReconstructable.length,
  incompletePlanDates:incomplete.length,
  zeroSelectedDays:zeroSelected.length,
  fullyReconstructable,
  incomplete:incomplete.map(x=>({scanDate:x.scanDate,selectedCountMatches:x.selectedCountMatches,unknownRiskSymbols:x.unknownRiskSymbols,totalCapital:x.totalCapital})),
  zeroSelected
},null,2));
