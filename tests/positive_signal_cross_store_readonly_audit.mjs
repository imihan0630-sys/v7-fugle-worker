import {classifyPositiveSignalPlanLinkage} from "../research/positive_signal_plan_linkage_v0_1.mjs";

const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
const origin=String(process.env.V7_WORKER_ORIGIN||"https://fugle-test.imihan0630.workers.dev").replace(/\/$/,"");
if(!token) throw new Error("V7_ADMIN_TOKEN missing");

async function get(path){
  const r=await fetch(origin+path,{headers:{"x-admin-token":token,"accept":"application/json"}});
  const d=await r.json();
  if(!r.ok) throw new Error(path+" HTTP "+r.status+": "+String(d?.error||"unknown"));
  return d;
}

const [journal,config,scanStatus,health1001]=await Promise.all([
  get("/api/journal?days=365"),
  get("/api/config"),
  get("/api/scan/status"),
  get("/api/journal/health?date=2026-10-01")
]);

const signals=Array.isArray(journal?.signalRows)?journal.signalRows:[];
const days=Array.isArray(journal?.days)?journal.days:[];
const plans=Array.isArray(journal?.planRows)?journal.planRows:[];
const configStocks=Array.isArray(config?.stocks)?config.stocks:[];

const positiveBuys=signals
  .filter(s=>String(s?.signal_type||"").toUpperCase()==="BUY")
  .map(signal=>{
    const d=String(signal?.plan_scan_date||"");
    const day=days.find(x=>String(x?.scan_date||"")===d)||null;
    const result=classifyPositiveSignalPlanLinkage({
      signal,
      journalDay:day,
      journalPlans:plans,
      scanStatus,
      configStocks
    });
    return {
      eventId:signal.event_id,
      symbol:signal.symbol,
      tradeDate:signal.trade_date,
      planScanDate:signal.plan_scan_date,
      occurredAt:signal.occurred_at,
      result
    };
  });

const target=positiveBuys.find(x=>x.eventId==="2026-10-02:2454:NONE:BUY:episode-1")||null;

console.log(JSON.stringify({
  ok:true,
  schemaVersion:"POSITIVE_SIGNAL_CROSS_STORE_PRODUCTION_AUDIT_V0_1",
  readOnly:true,
  decisionImpact:false,
  endpoints:[
    "/api/journal?days=365",
    "/api/config",
    "/api/scan/status",
    "/api/journal/health?date=2026-10-01"
  ],
  journalCounts:{
    recordedDays:Number(journal?.recordedDays||0),
    plans:Number(journal?.plans||0),
    signals:Number(journal?.signals||0)
  },
  latestScan:{
    scanDate:scanStatus?.scanDate||null,
    selectedCount:Number(scanStatus?.selectedCount??(Array.isArray(scanStatus?.stocks)?scanStatus.stocks.length:0)),
    symbols:Array.isArray(scanStatus?.stocks)?scanStatus.stocks.map(x=>String(x?.symbol||x?.code||"")):[],
    generatedAt:scanStatus?.generatedAt||null,
    configSaved:scanStatus?.config?.saved??null,
    configVerified:scanStatus?.config?.verified??null,
    journal:scanStatus?.journal??null
  },
  currentConfig:{
    updatedAt:config?.updatedAt||null,
    source:config?.source||null,
    symbols:configStocks.map(x=>({symbol:String(x?.symbol||x?.code||""),closeDate:x?.closeDate||null,planDate:x?.planDate||null}))
  },
  journalHealth20261001:health1001,
  positiveBuys,
  target2454:target,
  interpretation:"Cross-store provenance audit only. Exact latest-scan evidence can prove the plan existed outside D1 journal; it does not repair immutable D1 journal linkage or prove fills."
},null,2));
