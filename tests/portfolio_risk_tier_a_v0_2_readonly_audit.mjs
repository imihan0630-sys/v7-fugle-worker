import {portfolioTierAV02} from "../research/portfolio_risk_tier_a_v0_2.mjs";
import {projectedStopRisk,cappedEqualPlannedStopRiskCounterfactual} from "../research/portfolio_risk_tier_a_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));

const days=Array.isArray(data?.days)?data.days:[];
const plans=Array.isArray(data?.planRows)?data.planRows:[];
const recovered=Array.isArray(data?.recoveredRows)?data.recoveredRows:[];

function n(v){
  const x=Number(v);
  return Number.isFinite(x)?x:null;
}
function round(v,d=4){
  if(!Number.isFinite(v)) return null;
  const p=10**d;
  return Math.round(v*p)/p;
}
function hhi(values=[]){
  const xs=values.map(Number).filter(Number.isFinite).filter(x=>x>=0);
  const total=xs.reduce((a,b)=>a+b,0);
  if(!(total>0)) return null;
  return round(xs.reduce((s,x)=>s+(x/total)**2,0),6);
}
function mapAllocations(cf){
  const m=new Map();
  for(const row of cf?.allocations||[]) m.set(String(row?.symbol||""),n(row?.allocation));
  return m;
}

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
    rewardRisk:row?.reward_risk,
    strategy:row?.strategy
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

  const currentDeployment=n(out.plannedDeploymentNTD)||0;
  const equalCapitalMap=mapAllocations(out?.counterfactuals?.equalCapital);
  const equalRiskMap=mapAllocations(out?.counterfactuals?.equalPlannedStopRisk);
  const cappedRiskCf=cappedEqualPlannedStopRiskCounterfactual(datePlans,totalCapital,{perNameCapPct:35});
  const cappedRiskMap=mapAllocations(cappedRiskCf);

  const planDetails=datePlans.map(plan=>{
    const risk=projectedStopRisk(plan);
    const symbol=String(plan?.code||"");
    const currentAllocation=n(plan?.totalAllocation);
    const equalCapitalAllocation=equalCapitalMap.get(symbol)??null;
    const equalRiskAllocation=equalRiskMap.get(symbol)??null;
    const cappedRiskAllocation=cappedRiskMap.get(symbol)??null;
    const riskFracHigh=risk?.ok?n(risk.riskPctHigh)/100:null;
    const currentRiskNTD=(riskFracHigh!==null && currentAllocation!==null)?currentAllocation*riskFracHigh:null;
    const equalCapitalRiskNTD=(riskFracHigh!==null && equalCapitalAllocation!==null)?equalCapitalAllocation*riskFracHigh:null;
    const equalRiskRiskNTD=(riskFracHigh!==null && equalRiskAllocation!==null)?equalRiskAllocation*riskFracHigh:null;
    const cappedRiskRiskNTD=(riskFracHigh!==null && cappedRiskAllocation!==null)?cappedRiskAllocation*riskFracHigh:null;
    return {
      symbol,
      strategy:String(plan?.strategy||""),
      priorityScore:n(plan?.priorityScore),
      rewardRisk:n(plan?.rewardRisk),
      buyLow:n(plan?.buyLow),
      buyHigh:n(plan?.buyHigh),
      stop:n(plan?.stop),
      conservativeStopRiskPct:risk?.ok?n(risk.riskPctHigh):null,
      currentAllocationNTD:currentAllocation,
      currentShareOfDeploymentPct:(currentAllocation!==null&&currentDeployment>0)?round(currentAllocation/currentDeployment*100,4):null,
      currentProjectedRiskNTD:currentRiskNTD!==null?round(currentRiskNTD,2):null,
      currentPlannedRewardProxyNTD:(currentRiskNTD!==null&&n(plan?.rewardRisk)!==null)?round(currentRiskNTD*n(plan.rewardRisk),2):null,
      equalCapitalAllocationNTD:equalCapitalAllocation,
      equalCapitalProjectedRiskNTD:equalCapitalRiskNTD!==null?round(equalCapitalRiskNTD,2):null,
      equalCapitalPlannedRewardProxyNTD:(equalCapitalRiskNTD!==null&&n(plan?.rewardRisk)!==null)?round(equalCapitalRiskNTD*n(plan.rewardRisk),2):null,
      equalPlannedStopRiskAllocationNTD:equalRiskAllocation,
      equalPlannedStopRiskProjectedRiskNTD:equalRiskRiskNTD!==null?round(equalRiskRiskNTD,2):null,
      cappedEqualPlannedStopRiskAllocationNTD:cappedRiskAllocation,
      cappedEqualPlannedStopRiskProjectedRiskNTD:cappedRiskRiskNTD!==null?round(cappedRiskRiskNTD,2):null,
      cappedEqualPlannedStopRiskRewardProxyNTD:(cappedRiskRiskNTD!==null&&n(plan?.rewardRisk)!==null)?round(cappedRiskRiskNTD*n(plan.rewardRisk),2):null,
      cappedEqualPlannedStopRiskCapBinding:(cappedRiskCf?.allocations||[]).find(x=>String(x.symbol)===symbol)?.capBinding??null,
      shiftCurrentToEqualCapitalNTD:(currentAllocation!==null&&equalCapitalAllocation!==null)?round(equalCapitalAllocation-currentAllocation,2):null,
      shiftCurrentToEqualRiskNTD:(currentAllocation!==null&&equalRiskAllocation!==null)?round(equalRiskAllocation-currentAllocation,2):null,
      shiftCurrentToCappedEqualRiskNTD:(currentAllocation!==null&&cappedRiskAllocation!==null)?round(cappedRiskAllocation-currentAllocation,2):null
    };
  });

  const currentRisk=planDetails.map(x=>x.currentProjectedRiskNTD).filter(Number.isFinite);
  const equalCapitalRisk=planDetails.map(x=>x.equalCapitalProjectedRiskNTD).filter(Number.isFinite);
  const equalRiskRisk=planDetails.map(x=>x.equalPlannedStopRiskProjectedRiskNTD).filter(Number.isFinite);
  const cappedRiskRisk=planDetails.map(x=>x.cappedEqualPlannedStopRiskProjectedRiskNTD).filter(Number.isFinite);
  const sumField=key=>round(planDetails.map(x=>n(x[key])).filter(Number.isFinite).reduce((a,b)=>a+b,0),2);
  const currentRiskTotal=sumField("currentProjectedRiskNTD");
  const equalCapitalRiskTotal=sumField("equalCapitalProjectedRiskNTD");
  const cappedRiskTotal=sumField("cappedEqualPlannedStopRiskProjectedRiskNTD");
  const currentRewardProxy=sumField("currentPlannedRewardProxyNTD");
  const equalCapitalRewardProxy=sumField("equalCapitalPlannedRewardProxyNTD");
  const cappedRewardProxy=sumField("cappedEqualPlannedStopRiskRewardProxyNTD");
  const maxMinRatio=xs=>{
    const v=xs.filter(Number.isFinite).filter(x=>x>0);
    if(v.length<2) return null;
    return round(Math.max(...v)/Math.min(...v),4);
  };

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
    strategyRiskDecomposition:out.strategyRiskDecomposition,
    nominalDeployTargetPct:out.reserveDecomposition.nominalDeployTargetPct,
    nominalStructuralReservePct:out.reserveDecomposition.nominalStructuralReservePct,
    allocationImplementationShortfallPct:out.reserveDecomposition.allocationImplementationShortfallPct,
    allocationImplementationShortfallNTD:out.reserveDecomposition.allocationImplementationShortfallNTD,
    cashState:out.cashState.state,
    counterfactualStatus:{
      equalCapital:out?.counterfactuals?.equalCapital?.status||"UNKNOWN",
      equalPlannedStopRisk:out?.counterfactuals?.equalPlannedStopRisk?.status||"UNKNOWN",
      cappedEqualPlannedStopRisk:cappedRiskCf?.status||"UNKNOWN"
    },
    exAnteRewardRiskProxy:{
      semantics:"PLAN_TIME_RR_MULTIPLIED_BY_CONSERVATIVE_BUYHIGH_PROJECTED_STOP_RISK; NOT REALIZED_RETURN OR EXPECTED_RETURN",
      current:{projectedRiskNTD:currentRiskTotal,plannedRewardProxyNTD:currentRewardProxy,proxyRewardPerProjectedRisk:(currentRiskTotal>0)?round(currentRewardProxy/currentRiskTotal,4):null},
      equalCapital:{projectedRiskNTD:equalCapitalRiskTotal,plannedRewardProxyNTD:equalCapitalRewardProxy,proxyRewardPerProjectedRisk:(equalCapitalRiskTotal>0)?round(equalCapitalRewardProxy/equalCapitalRiskTotal,4):null},
      cappedEqualPlannedStopRisk:{projectedRiskNTD:cappedRiskTotal,plannedRewardProxyNTD:cappedRewardProxy,proxyRewardPerProjectedRisk:(cappedRiskTotal>0)?round(cappedRewardProxy/cappedRiskTotal,4):null},
      currentMinusEqualCapital:{projectedRiskNTD:round(currentRiskTotal-equalCapitalRiskTotal,2),plannedRewardProxyNTD:round(currentRewardProxy-equalCapitalRewardProxy,2),marginalProxyRewardPerRisk:(currentRiskTotal-equalCapitalRiskTotal)>0?round((currentRewardProxy-equalCapitalRewardProxy)/(currentRiskTotal-equalCapitalRiskTotal),4):null},
      currentMinusCappedEqualRisk:{projectedRiskNTD:round(currentRiskTotal-cappedRiskTotal,2),plannedRewardProxyNTD:round(currentRewardProxy-cappedRewardProxy,2),marginalProxyRewardPerRisk:(currentRiskTotal-cappedRiskTotal)>0?round((currentRewardProxy-cappedRewardProxy)/(currentRiskTotal-cappedRiskTotal),4):null}
    },
    structuralRiskDispersion:{
      currentProjectedRiskHHI:hhi(currentRisk),
      equalCapitalProjectedRiskHHI:hhi(equalCapitalRisk),
      equalPlannedStopRiskProjectedRiskHHI:hhi(equalRiskRisk),
      cappedEqualPlannedStopRiskProjectedRiskHHI:hhi(cappedRiskRisk),
      currentMaxToMinProjectedRiskRatio:maxMinRatio(currentRisk),
      equalCapitalMaxToMinProjectedRiskRatio:maxMinRatio(equalCapitalRisk),
      equalPlannedStopRiskMaxToMinProjectedRiskRatio:maxMinRatio(equalRiskRisk),
      cappedEqualPlannedStopRiskMaxToMinProjectedRiskRatio:maxMinRatio(cappedRiskRisk),
      cappedEqualRiskCapBindingSymbols:cappedRiskCf?.capBindingSymbols||[],
      semantics:"OUTCOME_INDEPENDENT_CONSERVATIVE_BUYHIGH_PROJECTED_STOP_RISK_DISTRIBUTION"
    },
    planDetails,
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
  schemaVersion:"PORTFOLIO_RISK_TIER_A_HISTORY_V0_3_STRUCTURAL_COUNTERFACTUAL",
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
  interpretation:"Outcome-independent plan-time structural counterfactual. Compares current allocation with equal-capital, unconstrained equal-planned-stop-risk, and a 35%-cap-constrained continuous equal-risk comparator using the same planned deployment. No returns are read; RR-based reward proxy is plan-time geometry only and must not be interpreted as expected or realized return; no allocator is promoted."
},null,2));
