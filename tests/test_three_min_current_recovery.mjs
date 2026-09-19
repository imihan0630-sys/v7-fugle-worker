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

const payload = {
  schemaVersion:"V7_PLAN_2",
  scanDate:"2026-09-18",
  planDate:"2026-09-21",
  totalCapital:200000,
  remainingCash:150000,
  stocks:[{
    symbol:"3105",name:"穩懋",mode:"MOMENTUM",sourcePool:"NON_THOUSAND",
    buyLow:489.54,buyHigh:496.92,breakout:492,maxChase:500,stop:472.06,profitCheck:573,
    capitalWeight:25,firstTrancheWeight:60,secondTrancheWeight:40,
    firstEntryCondition:"test",secondEntryCondition:"test",priorityScore:89.4,
    strategyChannel:"B",formalClose:492,closeDate:"2026-09-18",planDate:"2026-09-21",
    totalAllocation:50000,firstAmount:30000,secondAmount:20000,firstShares:60,secondShares:40,totalShares:100,
    rewardRisk:3.7,sectorFlow:90,relativeStrength:20,signalLevel:"A",selectedReason:"test",
    positionStage:"NONE",referencePrice:496.92,shareCalculation:"test"
  }]
};

const config = {version:7,updatedAt:"2026-09-18T10:15:00.000Z",totalCapital:200000,stocks:[{symbol:"3105",name:"穩懋"}]};
const latest = {
  version:"8.0.3-3min-auth-check",
  generatedAt:"2026/09/18 18:15:52",
  scanDate:"2026-09-18",
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
      [api.KV_KEY]:config,
      [api.LAST_SCAN_KEY]:scan
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
  const saved=await env.STOCKS_KV.get(api.LAST_SCAN_KEY,"json");
  assert.equal(saved.diagnostics.requirements30.requirement26.complete,true);
  assert.equal(saved.diagnostics.requirements30.incompleteRules.includes(26),false);
  assert.deepEqual((await env.STOCKS_KV.get(api.KV_KEY,"json")),config,"Monitoring config must remain unchanged");

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
