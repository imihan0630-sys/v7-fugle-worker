import {stageFeasibleGridSensitivity} from "../research/stage_feasible_grid_sensitivity_v0_1.mjs";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");
const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));
const days=Array.isArray(data?.days)?data.days:[];
const plans=Array.isArray(data?.planRows)?data.planRows:[];
const dayMap=new Map(days.map(d=>[String(d.scan_date||""),d]));
const byDate=new Map();
for(const p of plans){
  const d=String(p.scan_date||"");
  if(!byDate.has(d))byDate.set(d,[]);
  byDate.get(d).push({symbol:String(p.symbol||""),totalAllocation:p.total_allocation,buyHigh:p.buy_high,stop:p.stop});
}
const dates=[];
for(const [scanDate,ps] of [...byDate.entries()].sort()){
  const day=dayMap.get(scanDate)||{};
  if(ps.length<2)continue;
  dates.push({scanDate,selectedCount:Number(day.selected_count),result:stageFeasibleGridSensitivity(ps,Number(day.total_capital))});
}
console.log(JSON.stringify({
 ok:true,schemaVersion:"STAGE_FEASIBLE_GRID_PRODUCTION_AUDIT_V0_1",
 readOnly:true,decisionImpact:false,multiNameDates:dates.length,dates,
 interpretation:"Structural grid minima are compared before/after requiring every name to have >=1 FIRST and >=1 ADD share at buyHigh. No triggers/fills are assumed."
},null,2));
