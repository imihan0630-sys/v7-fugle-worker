import {portfolioHeatFrontier} from "../research/portfolio_heat_frontier_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

async function get(path){
  const r=await fetch(origin+path,{headers:{"x-admin-token":token,"accept":"application/json"}});
  const d=await r.json();
  if(!r.ok) throw new Error(path+" HTTP "+r.status+": "+String(d?.error||"unknown"));
  return d;
}

const [version,scan,health]=await Promise.all([
  get("/api/version"),
  get("/api/scan/status"),
  get("/api/journal/health?date=2026-09-29")
]);

const scanDate=String(scan?.scanDate||"");
const stocks=Array.isArray(scan?.stocks)?scan.stocks:[];
const totalCapital=Number(scan?.totalCapital);
const frozen=stocks.map(x=>({
  symbol:String(x?.symbol||x?.code||""),
  name:String(x?.name||""),
  priorityScore:Number(x?.priorityScore),
  rewardRisk:Number(x?.rewardRisk),
  totalAllocation:Number(x?.totalAllocation),
  allocationRatio:Number(x?.allocationRatio),
  buyLow:Number(x?.buyLow),
  buyHigh:Number(x?.buyHigh),
  stop:Number(x?.stop),
  firstAmount:Number(x?.firstAmount),
  secondAmount:Number(x?.secondAmount),
  firstShares:Number(x?.firstShares),
  secondShares:Number(x?.secondShares),
  closeDate:x?.closeDate||null,
  planDate:x?.planDate||null
}));

const geometryReady=scanDate==="2026-09-29" &&
  frozen.length>=2 &&
  Number.isFinite(totalCapital) &&
  frozen.every(x=>x.symbol&&Number.isFinite(x.totalAllocation)&&Number.isFinite(x.buyHigh)&&Number.isFinite(x.stop));

const metrics={};
if(geometryReady){
  const plans=frozen.map(x=>({
    symbol:x.symbol,
    totalAllocation:x.totalAllocation,
    buyHigh:x.buyHigh,
    stop:x.stop
  }));
  for(const metric of ["hhi","gini","cv","maxRiskShare","maxMin"]){
    metrics[metric]=portfolioHeatFrontier(plans,totalCapital,{concentrationMetric:metric});
  }
}

console.log(JSON.stringify({
  ok:true,
  schemaVersion:"D15_KV_LAST_SCAN_CORROBORATION_PRODUCTION_AUDIT_V0_1",
  readOnly:true,
  decisionImpact:false,
  observedProductionVersion:version?.version||null,
  scan:{
    scanDate,
    generatedAt:scan?.generatedAt||null,
    selectedCount:Number(scan?.selectedCount??frozen.length),
    totalCapital,
    status:scan?.status||null,
    config:scan?.config||null,
    stocks:frozen
  },
  d1JournalHealth:health,
  geometryReady,
  metrics,
  interpretation:"KV LAST_SCAN is mutable lower-tier provenance. Same-direction Portfolio Heat evidence is corroborative only; it cannot replace D1 generation certification or justify maturity promotion."
},null,2));
