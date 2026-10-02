import {classifyD15PlanDate,summarizeIndependentDates} from "../research/d15_independent_date_extension_v0_1.mjs";
import {portfolioHeatFrontier} from "../research/portfolio_heat_frontier_v0_1.mjs";
import {classifyPlanTimeCash} from "../research/cash_attribution_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));

const days=Array.isArray(data?.days)?data.days:[];
const plans=Array.isArray(data?.planRows)?data.planRows:[];
const byDate=new Map();
for(const p of plans){
  const d=String(p.scan_date||"");
  if(!byDate.has(d)) byDate.set(d,[]);
  byDate.get(d).push(p);
}

const classifications=[];
const dates=[];
for(const day of [...days].sort((a,b)=>String(a.scan_date||"").localeCompare(String(b.scan_date||"")))){
  const scanDate=String(day.scan_date||"");
  const datePlans=byDate.get(scanDate)||[];
  const classification=classifyD15PlanDate({
    scanDate,
    selectedCount:Number(day.selected_count),
    planRows:datePlans,
    dayStatus:String(day.status||"")
  });
  classifications.push(classification);

  const row={
    scanDate,
    selectedCount:Number(day.selected_count),
    planRows:datePlans.length,
    dayStatus:String(day.status||""),
    classification,
    cashAttribution:classifyPlanTimeCash({
      scanDate,
      selectedCount:Number(day.selected_count),
      totalCapital:Number(day.total_capital),
      plans:datePlans.map(p=>({
        symbol:String(p.symbol||""),
        totalAllocation:p.total_allocation,
        priorityScore:p.priority_score
      })),
      executionEvidence:"UNKNOWN"
    }),
    frontier:null
  };

  if(classification.status==="MULTI_NAME_IDENTIFYING"){
    const ps=datePlans.map(p=>({
      symbol:String(p.symbol||""),
      totalAllocation:p.total_allocation,
      buyHigh:p.buy_high,
      stop:p.stop
    }));
    const metrics={};
    for(const metric of ["hhi","gini","cv","maxRiskShare","maxMin"]){
      metrics[metric]=portfolioHeatFrontier(ps,Number(day.total_capital),{concentrationMetric:metric});
    }
    row.frontier=metrics;
  }
  dates.push(row);
}

const summary=summarizeIndependentDates(classifications,{baselineDate:"2026-09-18"});
const multi=dates.filter(x=>x.classification.status==="MULTI_NAME_IDENTIFYING");
const direction={
  multiNameDates:multi.length,
  currentParetoDominatedByMetric:Object.fromEntries(
    ["hhi","gini","cv","maxRiskShare","maxMin"].map(metric=>[
      metric,
      multi.map(x=>({
        scanDate:x.scanDate,
        ready:x.frontier?.[metric]?.status==="READY",
        currentParetoDominated:x.frontier?.[metric]?.currentParetoDominated??null,
        currentLocallyParetoDominated:x.frontier?.[metric]?.currentLocallyParetoDominated??null,
        currentHeatPct:x.frontier?.[metric]?.current?.heatPctOfCapital??null,
        currentConcentration:x.frontier?.[metric]?.current?.[metric]??null,
        paretoDominatingStates:x.frontier?.[metric]?.paretoDominatingStates??null,
        oneGridDominatingStates:x.frontier?.[metric]?.oneGridDominatingStates??null
      }))
    ])
  )
};

console.log(JSON.stringify({
  ok:true,
  schemaVersion:"D15_INDEPENDENT_DATE_EXTENSION_PRODUCTION_AUDIT_V0_1",
  readOnly:true,
  decisionImpact:false,
  endpoint:"/api/journal?days=730",
  summary,
  direction,
  dates,
  interpretation:"Prospective plan-time extension only. Zero/single-name dates are preserved as non-identifying rather than discarded. Any new multi-name date is analyzed with the already-frozen heat/concentration frontier; no actual-live holdings or realized-return claim is made."
},null,2));
