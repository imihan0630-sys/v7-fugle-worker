import {portfolioTierAV02} from "../research/portfolio_risk_tier_a_v0_2.mjs";

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
  const out=portfolioTierAV02(datePlans,totalCapital,{dataStatus:"COMPLETE"});
  rows.push({
    scanDate,
    totalCapital:Number.isFinite(totalCapital)?totalCapital:null,
    selectedCount:Number.isFinite(selectedCount)?selectedCount:null,
    selectedCountMatches,
    planRows:datePlans.length,
    knownRiskSymbols:out.knownRiskSymbols,
    plannedDeploymentNTD:out.plannedDeploymentNTD,
    deploymentRatioPct:out.deploymentRatioPct,
    structuralReservePct:out.concentrationDecomposition.structuralReservePct,
    deployedCapitalHHI:out.concentrationDecomposition.deployedCapitalHHI,
    effectiveCapitalNames:out.concentrationDecomposition.effectiveCapitalNames,
    riskyNameHHIOnTotalCapital:out.concentrationDecomposition.riskyNameHHIOnTotalCapital,
    projectedHeatPctLow:out.projectedHeatPctLow,
    projectedHeatPctHigh:out.projectedHeatPctHigh,
    projectedStopRiskPctOfDeployedCapitalLow:out.heatIntensityOnDeployedCapital.projectedStopRiskPctOfDeployedCapitalLow,
    projectedStopRiskPctOfDeployedCapitalHigh:out.heatIntensityOnDeployedCapital.projectedStopRiskPctOfDeployedCapitalHigh,
    cashState:out.cashState.state,
    status:String(day?.status||"")
  });
}
const fullyReconstructable=rows.filter(r=>r.selectedCountMatches && r.planRows>0 && r.knownRiskSymbols===r.planRows && Number.isFinite(r.totalCapital));
const zeroSelected=days.filter(d=>Number(d?.selected_count)===0).map(d=>({
  scanDate:d.scan_date,
  totalCapital:d.total_capital,
  selectedCount:0,
  deploymentRatioPct:0,
  structuralReservePct:100,
  riskyNameHHIOnTotalCapital:0,
  cashState:"NO_ELIGIBLE_OPPORTUNITY",
  status:d.status
}));

console.log(JSON.stringify({
  ok:true,
  schemaVersion:"PORTFOLIO_RISK_TIER_A_HISTORY_V0_2",
  readOnly:true,
  outcomeFieldsRead:false,
  decisionImpact:false,
  endpoint:"/api/journal?days=730",
  recordedDays:days.length,
  formalPlanRows:plans.length,
  recoveredRowsExcluded:recovered.length,
  fullyReconstructablePlanDates:fullyReconstructable.length,
  planDates:fullyReconstructable,
  zeroSelected,
  interpretation:"Descriptive plan-time risk geometry only. No return/outcome fields were read. Do not infer safe heat/concentration thresholds."
},null,2));
