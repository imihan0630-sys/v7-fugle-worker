import {classifyPlannedPortfolioHeat} from "../research/portfolio_heat_semantics_v0_1.mjs";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim(),origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token)throw new Error("V7_ADMIN_TOKEN missing");
const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});const data=await res.json();if(!res.ok)throw new Error("journal HTTP "+res.status);
const days=Array.isArray(data?.days)?data.days:[],plans=Array.isArray(data?.planRows)?data.planRows:[],by=new Map();
for(const p of plans){const d=String(p.scan_date||"");if(!by.has(d))by.set(d,[]);by.get(d).push(p)}
const rows=days.sort((a,b)=>String(a.scan_date).localeCompare(String(b.scan_date))).map(d=>({
 scanDate:d.scan_date,selectedCount:Number(d.selected_count),classification:classifyPlannedPortfolioHeat(by.get(String(d.scan_date))||[],Number(d.total_capital))
}));
console.log(JSON.stringify({ok:true,schemaVersion:"PORTFOLIO_HEAT_SEMANTICS_PRODUCTION_AUDIT_V0_1",readOnly:true,decisionImpact:false,rows,
 interpretation:"Cross-date plan-time heat taxonomy only. Actual live holdings heat remains UNKNOWN without confirmed holdings/fills."},null,2));
