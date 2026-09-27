import {scoreCapReserve} from "../research/score_cap_reserve_v0_1.mjs";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");
const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status);
const days=Array.isArray(data?.days)?data.days:[],plans=Array.isArray(data?.planRows)?data.planRows:[];
const dayMap=new Map(days.map(d=>[String(d.scan_date||""),d])),byDate=new Map();
for(const p of plans){const d=String(p.scan_date||"");if(!byDate.has(d))byDate.set(d,[]);byDate.get(d).push({symbol:String(p.symbol||""),priorityScore:p.priority_score});}
const dates=[];
for(const [scanDate,ps] of [...byDate.entries()].sort()){
 const day=dayMap.get(scanDate)||{};
 dates.push({scanDate,selectedCount:Number(day.selected_count),result:scoreCapReserve(ps,Number(day.total_capital))});
}
console.log(JSON.stringify({
 ok:true,schemaVersion:"SCORE_CAP_RESERVE_PRODUCTION_AUDIT_V0_1",readOnly:true,decisionImpact:false,
 planDates:dates.length,dates,
 interpretation:"Separates cap-induced reserve from NT$1,000 flooring. Historical absence of cap binding does not prove future absence. No redistribution policy is recommended."
},null,2));
