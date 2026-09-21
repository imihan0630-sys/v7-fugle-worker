import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const workerPath = process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js", import.meta.url).pathname;
const api = await import(pathToFileURL(workerPath).href + "?recover=" + Date.now());

class KV {
  constructor(seed={}) { this.map=new Map(Object.entries(seed).map(([k,v])=>[k,typeof v==="string"?v:JSON.stringify(v)])); }
  async get(key,type) {
    const value=this.map.get(key);
    if(value===undefined) return null;
    return type==="json" ? JSON.parse(value) : value;
  }
  async put(key,value) { this.map.set(key,String(value)); }
}

const TAIWAN_TODAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit"
}).format(new Date());
const TEST_HOLIDAYS_2026 = new Set([
  "2026-01-01","2026-02-12","2026-02-13","2026-02-15","2026-02-16","2026-02-17","2026-02-18","2026-02-19","2026-02-20",
  "2026-02-27","2026-02-28","2026-04-03","2026-04-04","2026-04-05","2026-04-06","2026-05-01","2026-06-19",
  "2026-09-25","2026-09-28","2026-10-09","2026-10-10","2026-10-25","2026-10-26","2026-12-25"
]);
function shiftDate(dateString,delta) {
  const d=new Date(dateString+"T12:00:00Z"); d.setUTCDate(d.getUTCDate()+delta); return d.toISOString().slice(0,10);
}
function isTestTradingDate(dateString) {
  const day=new Date(dateString+"T12:00:00Z").getUTCDay();
  return day!==0 && day!==6 && !TEST_HOLIDAYS_2026.has(dateString);
}
function recentTradingDate(dateString) {
  let d=dateString; while(!isTestTradingDate(d)) d=shiftDate(d,-1); return d;
}
function followingTradingDate(dateString) {
  let d=dateString; do d=shiftDate(d,1); while(!isTestTradingDate(d)); return d;
}
const TAIPEI_HOUR = Number(new Intl.DateTimeFormat("en-US", {
  timeZone:"Asia/Taipei", hour:"2-digit", hourCycle:"h23"
}).format(new Date()));
const TEST_SCAN_DATE=recentTradingDate(
  isTestTradingDate(TAIWAN_TODAY) && TAIPEI_HOUR < 14 ? shiftDate(TAIWAN_TODAY,-1) : TAIWAN_TODAY
);
const TEST_PLAN_DATE=followingTradingDate(TEST_SCAN_DATE);

const payload = {
  schemaVersion:"V7_PLAN_2",
  scanDate:TEST_SCAN_DATE,
  planDate:TEST_PLAN_DATE,
  totalCapital:200000,
  remainingCash:150000,
  stocks:[{
    symbol:"3105",name:"穩懋",mode:"MOMENTUM",sourcePool:"NON_THOUSAND",
    buyLow:489.54,buyHigh:496.92,breakout:492,maxChase:500,stop:472.06,profitCheck:573,
    capitalWeight:25,firstTrancheWeight:60,secondTrancheWeight:40,
    firstEntryCondition:"test",secondEntryCondition:"test",priorityScore:89.4,
    strategyChannel:"B",formalClose:492,closeDate:TEST_SCAN_DATE,planDate:TEST_PLAN_DATE,
    totalAllocation:50000,firstAmount:30000,secondAmount:20000,firstShares:60,secondShares:40,totalShares:100,
    rewardRisk:3.7,sectorFlow:90,relativeStrength:20,signalLevel:"A",selectedReason:"test",
    positionStage:"NONE",referencePrice:496.92,shareCalculation:"test"
  }]
};

const config = {version:7,updatedAt:TEST_SCAN_DATE+"T10:15:00.000Z",totalCapital:200000,stocks:[{symbol:"3105",name:"穩懋"}]};
const latest = {
  version:"8.0.3-3min-auth-check",
  generatedAt:TEST_SCAN_DATE.replaceAll("-","/")+" 18:15:52",
  scanDate:TEST_SCAN_DATE,
  dryRun:false,
  selectedCount:1,
  totalCapital:200000,
  stocks:[{symbol:"3105",name:"穩懋"}],
  config:{saved:true,verified:true,updatedAt:config.updatedAt},
  threeMin:{sent:false,verified:false,simulated:false,httpStatus:401,error:"3Min寫入HTTP失敗"},
  threeMinPayload:payload,
  dailyReport:{sent:true,simulated:false},
  diagnostics:{requirements30:{complete:false,incompleteRules:[17,18,19,26,27,28,29]}},
  pipeline:{configVerified:true,dailyReportAccepted:true,threeMinAccepted:false,threeMinVerified:false,complete:false}
};

function envFor(scan=latest) {
  return {
    ADMIN_TOKEN:"admin-test",
    TEST_MODE:"false",
    THREEMIN_API_URL:"https://example.invalid/data",
    THREEMIN_VERIFY_URL:"https://example.invalid/data",
    THREEMIN_API_TOKEN:"tm_live_test",
    STOCKS_KV:new KV({
      ["STOCK_CONFIG_V7"]:config,
      ["V7_LAST_AFTER_MARKET_SCAN"]:scan
    })
  };
}

function request(token="admin-test",method="POST") {
  return new Request("https://worker.invalid/api/three-min/recover-current",{
    method,headers:{"x-admin-token":token,"content-type":"application/json"},body:method==="POST"?"{}":undefined
  });
}

{
  const env=envFor();
  const methods=[];
  globalThis.fetch=async (url,options={})=>{
    assert.equal(url,env.THREEMIN_VERIFY_URL);
    assert.equal(options.headers.authorization,"Bearer "+env.THREEMIN_API_TOKEN);
    methods.push(options.method);
    if(methods.length===1) return new Response(JSON.stringify({success:true,data:[]}),{status:200,headers:{"content-type":"application/json"}});
    if(options.method==="POST") return new Response(JSON.stringify({success:true}),{status:202,headers:{"content-type":"application/json"}});
    return new Response(JSON.stringify({success:true,data:[{id:"rec_recovered",payload}]}),{status:200,headers:{"content-type":"application/json"}});
  };
  const response=await api.default.fetch(request(),env);
  assert.equal(response.status,200);
  const body=await response.json();
  assert.equal(body.recovered,true);
  assert.equal(body.externalPostPerformed,true);
  assert.equal(body.threeMinAccepted,true);
  assert.equal(body.threeMinVerified,true);
  assert.equal(body.requirement26Complete,true);
  assert.equal(body.noSelection,true);
  assert.equal(body.noPlanChanges,true);
  assert.equal(body.noPush,true);
  assert.deepEqual(methods,["GET","POST","GET"]);
  const saved=await env.STOCKS_KV.get("V7_LAST_AFTER_MARKET_SCAN","json");
  assert.equal(saved.diagnostics.requirements30.requirement26.complete,true);
  assert.equal(saved.diagnostics.requirements30.incompleteRules.includes(26),false);
  assert.deepEqual((await env.STOCKS_KV.get("STOCK_CONFIG_V7","json")),config,"Monitoring config must remain unchanged");

  let postCount=0;
  globalThis.fetch=async (url,options={})=>{
    if(options.method==="POST") postCount++;
    return new Response(JSON.stringify({success:true,data:[{id:"rec_existing",payload}]}),{status:200,headers:{"content-type":"application/json"}});
  };
  const second=await api.default.fetch(request(),env);
  assert.equal(second.status,200);
  assert.equal((await second.json()).externalPostPerformed,false);
  assert.equal(postCount,0,"Exact external record must prevent duplicate POST");
}

{
  const ambiguous={...latest,threeMin:{...latest.threeMin,httpStatus:500}};
  const env=envFor(ambiguous);
  let postCount=0;
  globalThis.fetch=async (_url,options={})=>{
    if(options.method==="POST") postCount++;
    return new Response(JSON.stringify({success:true,data:[]}),{status:200,headers:{"content-type":"application/json"}});
  };
  const response=await api.default.fetch(request(),env);
  assert.equal(response.status,409);
  assert.equal(postCount,0,"Ambiguous prior failure must never POST");
}

{
  const env=envFor();
  let calls=0;
  globalThis.fetch=async()=>{calls++;return new Response("{}");};
  assert.equal((await api.default.fetch(request("wrong"),env)).status,401);
  assert.equal(calls,0);
  assert.equal((await api.default.fetch(request("admin-test","GET"),env)).status,405);
}

console.log(JSON.stringify({
  ok:true,
  route:"/api/three-min/recover-current",
  guardedPrior401Recovery:true,
  exactReadbackPreventsDuplicatePost:true,
  ambiguousFailureBlocksPost:true,
  noSelection:true,
  noPlanChanges:true,
  noPush:true
}));