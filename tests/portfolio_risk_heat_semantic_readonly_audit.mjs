import {plannedSelectionHeat,actualPortfolioHeatEligibility} from "../research/portfolio_heat_semantic_firewall_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

async function getJson(path){
  const r=await fetch(origin+path,{headers:{"x-admin-token":token,"accept":"application/json"}});
  const text=await r.text();
  if(!r.ok) throw new Error(path+" HTTP "+r.status+" "+text.slice(0,300));
  return JSON.parse(text);
}
const [journal,positions]=await Promise.all([
  getJson("/api/journal?days=730"),
  getJson("/api/positions")
]);
const days=Array.isArray(journal?.days)?journal.days:[];
const plans=Array.isArray(journal?.planRows)?journal.planRows:[];
const byDate=new Map();
for(const p of plans){
  const d=String(p.scan_date||"");
  if(!byDate.has(d))byDate.set(d,[]);
  byDate.get(d).push({
    symbol:String(p.symbol||""),
    totalAllocation:p.total_allocation,
    buyLow:p.buy_low,
    buyHigh:p.buy_high,
    formalClose:p.formal_close,
    stop:p.stop
  });
}
const rows=[];
for(const day of [...days].sort((a,b)=>String(a.scan_date).localeCompare(String(b.scan_date)))){
  const scanDate=String(day.scan_date||"");
  const selectedCount=Number(day.selected_count);
  const datePlans=byDate.get(scanDate)||[];
  const scanComplete=datePlans.length===selectedCount;
  const planned=plannedSelectionHeat(datePlans,Number(day.total_capital),{scanComplete});
  rows.push({scanDate,selectedCount,planRows:datePlans.length,scanComplete,planned});
}

const positionRows=Array.isArray(positions?.positions)?positions.positions:[];
const actual=actualPortfolioHeatEligibility({
  asOfTimestamp:new Date().toISOString(),
  totalEquityKnown:false,
  appendOnlyFillLedger:false,
  allCarryoverPositionsKnown:false,
  actualSharesKnown:positionRows.length>0&&positionRows.every(x=>Number.isInteger(Number(x?.actualShares))&&Number(x.actualShares)>=0),
  stopForEveryOpenPositionKnown:positionRows.length>0&&positionRows.every(x=>Number.isFinite(Number(x?.stop))&&Number(x.stop)>0),
  priceReferenceForEveryOpenPositionKnown:false
});

console.log(JSON.stringify({
  ok:true,
  schemaVersion:"D15_PORTFOLIO_HEAT_PRODUCTION_AUDIT_V0_1",
  readOnly:true,
  productionWrites:false,
  endpoint:["/api/journal?days=730","/api/positions"],
  recordedDays:days.length,
  planRows:plans.length,
  readyPlannedHeatDates:rows.filter(x=>x.planned?.status==="READY").length,
  zeroSelectedDates:rows.filter(x=>x.selectedCount===0).map(x=>({
    scanDate:x.scanDate,
    projectedNewPlanHeatPctHigh:x.planned?.projectedNewPlanHeatPctHigh,
    actualPortfolioHeatKnown:x.planned?.actualPortfolioHeatKnown
  })),
  dates:rows,
  currentMutablePositionRows:positionRows.length,
  historicalActualHeatEligibility:actual,
  interpretation:"Immutable plan rows support projected NEW-plan heat. They do not reconstruct account-wide historical heat; zero selected never implies zero carryover/actual heat."
},null,2));
