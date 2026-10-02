import {multiPoolStructuralRisk} from "../research/d15_multi_pool_structural_risk_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

const res=await fetch(origin+"/api/journal?days=365",{headers:{"x-admin-token":token,"accept":"application/json"}});
const data=await res.json();
if(!res.ok) throw new Error("journal HTTP "+res.status+": "+String(data?.error||"unknown"));

const days=Array.isArray(data?.days)?data.days:[];
const plans=Array.isArray(data?.planRows)?data.planRows:[];
const byDate=new Map();
for(const p of plans){
  const d=String(p?.scan_date||"");
  if(!byDate.has(d))byDate.set(d,[]);
  byDate.get(d).push({
    symbol:String(p?.symbol||""),
    formalClose:p?.formal_close,
    totalAllocation:p?.total_allocation,
    buyHigh:p?.buy_high,
    stop:p?.stop
  });
}
const rows=[];
for(const day of [...days].sort((a,b)=>String(a.scan_date).localeCompare(String(b.scan_date)))){
  const scanDate=String(day?.scan_date||"");
  const ps=byDate.get(scanDate)||[];
  rows.push({
    scanDate,
    selectedCount:Number(day?.selected_count),
    status:String(day?.status||""),
    audit:multiPoolStructuralRisk(ps,{selectedCount:Number(day?.selected_count)})
  });
}

const ready=rows.filter(x=>x.audit?.status==="READY");
const both=ready.filter(x=>x.audit?.bothPoolsRepresented);
console.log(JSON.stringify({
  ok:true,
  schemaVersion:"D15_MULTI_POOL_PRODUCTION_AUDIT_V0_1",
  readOnly:true,
  decisionImpact:false,
  endpoint:"/api/journal?days=365",
  recordedDates:rows.length,
  readySelectedDates:ready.length,
  bothPoolsRepresentedDates:both.length,
  singlePoolSelectedDates:ready.length-both.length,
  poolReconstruction:"formal_close uses the same scan-date close as the Formal 1000-NTD pool split",
  dates:rows,
  interpretation:"This audit can establish PIT pool identity and structural pool capital/risk shares. It cannot establish cross-pool statistical diversification without synchronized return/covariance data."
},null,2));
