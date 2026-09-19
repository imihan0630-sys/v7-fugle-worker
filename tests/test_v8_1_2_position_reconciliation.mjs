import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const api=await import(pathToFileURL(workerPath).href+"?positions="+Date.now());

class KV {
  constructor(seed={}) { this.map=new Map(Object.entries(seed).map(([k,v])=>[k,typeof v==="string"?v:JSON.stringify(v)])); }
  async get(key,type) {
    const v=this.map.get(key);
    if(v===undefined) return null;
    return type==="json" ? JSON.parse(v) : v;
  }
  async put(key,value) { this.map.set(key,String(value)); }
}

const plan={
  version:7,
  updatedAt:"2026-09-18T10:15:00.000Z",
  source:"After-market Scan",
  totalCapital:200000,
  stocks:[
    {
      symbol:"3105",name:"穩懋",formalClose:492,closeDate:"2026-09-18",planDate:"2026-09-21",
      mode:"MOMENTUM",channel:"B",signalLevel:"A",priorityScore:89.4,rewardRisk:3.71,
      buyLow:489.54,buyHigh:496.92,breakout:492,maxChase:501,stop:472.06,profitCheck:573,
      allocationRatio:32.4,totalAllocation:64000,firstAmount:38400,secondAmount:25600,
      firstShares:77,secondShares:51,totalShares:128,firstCondition:"15m",secondCondition:"confirm",
      selectedReason:"test",positionStage:"NONE",actualShares:null,averageCost:null,firstEntryConfirmedAt:null
    },
    {
      symbol:"6133",name:"金橋",formalClose:25.2,closeDate:"2026-09-18",planDate:"2026-09-21",
      mode:"MOMENTUM",channel:"B",signalLevel:"A",priorityScore:74.9,rewardRisk:3.89,
      buyLow:25.07,buyHigh:25.45,breakout:25.2,maxChase:25.8,stop:24.52,profitCheck:28.2,
      allocationRatio:27.2,totalAllocation:54000,firstAmount:32400,secondAmount:21600,
      firstShares:1273,secondShares:848,totalShares:2121,firstCondition:"15m",secondCondition:"confirm",
      selectedReason:"test",positionStage:"NONE",actualShares:null,averageCost:null,firstEntryConfirmedAt:null
    }
  ]
};

const kv=new KV({STOCK_CONFIG_V7:plan});
const env={ADMIN_TOKEN:"admin-test",TEST_MODE:"false",STOCKS_KV:kv};
let fetchCalls=0;
globalThis.fetch=async()=>{fetchCalls++;throw new Error("No external fetch expected");};

const headers={"x-admin-token":"admin-test","content-type":"application/json"};
let response=await api.default.fetch(new Request("https://worker.invalid/api/positions",{headers}),env);
assert.equal(response.status,200);
let body=await response.json();
assert.equal(body.positions.length,2);
assert.equal(body.positions[0].actualPositionKnown,false);

const before=await kv.get("STOCK_CONFIG_V7","json");
response=await api.default.fetch(new Request("https://worker.invalid/api/positions",{
  method:"POST",headers,body:JSON.stringify({positions:[{
    symbol:"3105",positionStage:"FIRST",actualShares:50,averageCost:495.5,firstEntryConfirmedAt:"2026-09-18T01:30:00Z"
  }]})
}),env);
assert.equal(response.status,200);
body=await response.json();
assert.equal(body.ok,true);
assert.equal(body.verified,true);
assert.equal(body.noPlanChanges,true);
assert.equal(body.noPush,true);
assert.equal(body.noThreeMinWrite,true);

const after=await kv.get("STOCK_CONFIG_V7","json");
assert.equal(after.totalCapital,before.totalCapital);
assert.equal(after.stocks[0].positionStage,"FIRST");
assert.equal(after.stocks[0].actualShares,50);
assert.equal(after.stocks[0].averageCost,495.5);
assert.equal(after.stocks[0].firstEntryConfirmedAt,"2026-09-18T01:30:00.000Z");
assert.equal(after.stocks[1].positionStage,"NONE");
for(const key of ["buyLow","buyHigh","breakout","maxChase","stop","profitCheck","allocationRatio","totalAllocation","firstAmount","secondAmount","firstShares","secondShares","totalShares","selectedReason"]) {
  assert.deepEqual(after.stocks[0][key],before.stocks[0][key],key+" must remain unchanged");
}

response=await api.default.fetch(new Request("https://worker.invalid/api/positions",{
  method:"POST",headers,body:JSON.stringify({positions:[{symbol:"9999",positionStage:"NONE",actualShares:0}]})
}),env);
assert.equal(response.status,400);
assert.equal(fetchCalls,0,"Position reconciliation must never call external services");

const snapshot=await kv.get("STOCK_CONFIG_V7","json");
assert.equal(snapshot.stocks[0].actualShares,50,"Rejected request must preserve prior reconciliation");

response=await api.default.fetch(new Request("https://worker.invalid/api/positions",{
  method:"POST",headers,body:JSON.stringify({positions:[{
    symbol:"3105",positionStage:"NONE",actualShares:0,averageCost:null,firstEntryConfirmedAt:null
  }]})
}),env);
assert.equal(response.status,200);
const cleared=await kv.get("STOCK_CONFIG_V7","json");
assert.equal(cleared.stocks[0].positionStage,"NONE");
assert.equal(cleared.stocks[0].actualShares,null);
assert.equal(cleared.stocks[0].averageCost,null);
assert.equal(cleared.stocks[0].firstEntryConfirmedAt,null);

console.log(JSON.stringify({
  ok:true,
  route:"/api/positions",
  existingSymbolsOnly:true,
  immutablePlanFieldsPreserved:true,
  executionFieldsOnly:true,
  noPush:true,
  noThreeMinWrite:true,
  noExternalFetch:true
}));
