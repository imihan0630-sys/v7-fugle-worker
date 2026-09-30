import {portfolioHeatFrontier} from "../research/portfolio_heat_frontier_v0_1.mjs";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");
const res=await fetch(origin+"/api/journal?days=730",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json(); if(!res.ok)throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));
const days=Array.isArray(data?.days)?data.days:[],plans=Array.isArray(data?.planRows)?data.planRows:[];
const dayMap=new Map(days.map(d=>[String(d.scan_date||""),d])),byDate=new Map();
for(const p of plans){const d=String(p.scan_date||"");if(!byDate.has(d))byDate.set(d,[]);byDate.get(d).push({symbol:String(p.symbol||""),totalAllocation:p.total_allocation,buyHigh:p.buy_high,stop:p.stop})}
const dates=[];
for(const [scanDate,ps] of [...byDate.entries()].sort()){
 const day=dayMap.get(scanDate)||{};if(ps.length<2)continue;
 const out={};
 for(const metric of ["hhi","gini","cv","maxRiskShare","maxMin"])out[metric]=portfolioHeatFrontier(ps,Number(day.total_capital),{concentrationMetric:metric});
 dates.push({scanDate,selectedCount:Number(day.selected_count),metrics:out});
}
console.log(JSON.stringify({ok:true,schemaVersion:"PORTFOLIO_HEAT_FRONTIER_PRODUCTION_AUDIT_V0_1",readOnly:true,decisionImpact:false,multiNameDates:dates.length,dates,
 interpretation:"Pure plan-time risk geometry only. Dominance means lower/equal total projected stop-risk heat and lower/equal concentration with one strict improvement; expected return is intentionally absent."},null,2));
