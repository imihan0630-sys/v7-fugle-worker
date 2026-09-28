import {classifyPlanTimeCash,summarizePlanTimeCash} from "../research/cash_attribution_v0_1.mjs";

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
  if(!byDate.has(d))byDate.set(d,[]);
  byDate.get(d).push({
    symbol:String(p.symbol||""),
    totalAllocation:p.total_allocation,
    priorityScore:p.priority_score
  });
}

const rows=[];
for(const day of [...days].sort((a,b)=>String(a.scan_date).localeCompare(String(b.scan_date)))){
  const scanDate=String(day.scan_date||"");
  const selectedCount=Number(day.selected_count);
  const totalCapital=Number(day.total_capital);
  const datePlans=byDate.get(scanDate)||[];
  const out=classifyPlanTimeCash({
    scanDate,selectedCount,totalCapital,plans:datePlans,executionEvidence:"UNKNOWN"
  });
  rows.push({
    scanDate,
    dayStatus:String(day.status||""),
    selectedCount,
    planRows:datePlans.length,
    totalCapitalNTD:Number.isFinite(totalCapital)?totalCapital:null,
    classification:out
  });
}

const summary=summarizePlanTimeCash(rows.map(x=>x.classification));
console.log(JSON.stringify({
  ok:true,
  schemaVersion:"D15_CASH_ATTRIBUTION_PRODUCTION_AUDIT_V0_1",
  readOnly:true,
  decisionImpact:false,
  endpoint:"/api/journal?days=730",
  recordedDays:days.length,
  formalPlanRows:plans.length,
  readyDates:rows.filter(x=>x.classification?.status==="READY").length,
  nonReadyDates:rows.filter(x=>x.classification?.status!=="READY").map(x=>({
    scanDate:x.scanDate,status:x.classification?.status,reason:x.classification?.reason||null
  })),
  summary,
  dates:rows,
  interpretation:"PIT plan-time reserve accounting only. plannedCash is not broker cash. Execution-state cash remains UNKNOWN without actual fills/holdings/broker balance evidence."
},null,2));
