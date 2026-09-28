import {trancheStageOrderability} from "../research/tranche_stage_orderability_v0_1.mjs";
import {trancheRatioSensitivity} from "../research/tranche_ratio_sensitivity_v0_1.mjs";

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
const extremeRatios=Array.from({length:19},(_,i)=>(i+1)*0.05);
const dates=[];
for(const [scanDate,ps] of [...byDate.entries()].sort()){
  const day=dayMap.get(scanDate)||{};
  if(ps.length<2)continue;
  dates.push({
    scanDate,
    selectedCount:Number(day.selected_count),
    stageOrderability1PctGrid:trancheStageOrderability(ps),
    concentration5PctGrid:trancheRatioSensitivity(ps,Number(day.total_capital),{ratios:extremeRatios})
  });
}
console.log(JSON.stringify({
 ok:true,schemaVersion:"EXTREME_TRANCHE_RATIO_PRODUCTION_AUDIT_V0_1",
 readOnly:true,decisionImpact:false,multiNameDates:dates.length,dates,
 interpretation:"1%-99% ratio grid tests both-stage orderability; 5%-95% grid tests concentration with exhaustive allocation search. Both are plan-preview only."
},null,2));
