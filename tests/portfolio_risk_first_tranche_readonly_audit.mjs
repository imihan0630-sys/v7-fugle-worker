import {firstTrancheRiskConcentration} from "../research/first_tranche_risk_concentration_v0_1.mjs";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");
const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json(); if(!res.ok) throw new Error("journal HTTP "+res.status);
const days=Array.isArray(data?.days)?data.days:[],plans=Array.isArray(data?.planRows)?data.planRows:[];
const dm=new Map(days.map(d=>[String(d.scan_date||""),d])),bm=new Map();
for(const p of plans){const d=String(p.scan_date||"");if(!bm.has(d))bm.set(d,[]);bm.get(d).push({symbol:String(p.symbol||""),totalAllocation:p.total_allocation,buyHigh:p.buy_high,stop:p.stop})}
const dates=[];
for(const [scanDate,ps] of [...bm.entries()].sort()){if(ps.length<2)continue;const day=dm.get(scanDate)||{};dates.push({scanDate,selectedCount:Number(day.selected_count),result:firstTrancheRiskConcentration(ps,Number(day.total_capital))})}
console.log(JSON.stringify({ok:true,schemaVersion:"FIRST_TRANCHE_RISK_PRODUCTION_AUDIT_V0_1",readOnly:true,decisionImpact:false,multiNameDates:dates.length,dates,interpretation:"FIRST plan-preview risk only; useful because live paths may remain FIRST and never reach ADD. No fill is inferred."},null,2));
