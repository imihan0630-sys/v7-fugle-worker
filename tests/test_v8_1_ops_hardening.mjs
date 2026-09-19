import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath = process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js", import.meta.url).pathname;
const source = await readFile(workerPath,"utf8");
const mod = await import("data:text/javascript;base64," + Buffer.from(
  source + "\nexport {buildDailySelectionPayload,buildPushPayload,buildExternalValidationComparison,buildSystemOverview};"
).toString("base64") + "#" + Date.now());

class KV {
  constructor(seed={}) {
    this.map=new Map(Object.entries(seed).map(([k,v])=>[k,typeof v==="string"?v:JSON.stringify(v)]));
  }
  async get(key,type) {
    const value=this.map.get(key);
    if(value===undefined) return null;
    return type==="json" ? JSON.parse(value) : value;
  }
  async put(key,value) { this.map.set(key,String(value)); }
  async list({prefix="",limit=1000}={}) {
    return {keys:[...this.map.keys()].filter(key=>key.startsWith(prefix)).sort().slice(0,limit).map(name=>({name}))};
  }
}

const daily=mod.buildDailySelectionPayload("2026-09-18",[{
  sourceRank:1,symbol:"3105",name:"穩懋",channel:"B",mode:"MOMENTUM",signalLevel:"A",
  priorityScore:89.4,rewardRisk:3.71,buyLow:489.54,buyHigh:496.92,breakout:492,maxChase:500,
  totalAllocation:64000,firstAmount:38400,secondAmount:25600,firstShares:77,secondShares:51,
  firstCondition:"第一筆條件",secondCondition:"第二筆條件",stop:472.06,profitCheck:573,selectedReason:"測試"
}],{});
assert.equal(daily.resultType,"SELECTED");
assert.equal(daily.selectedCount,1);
assert.equal(daily.stocks[0].strategy,"B突破後承接");
assert.equal(daily.stocks[0].signalLevel,"A");
assert.equal(daily.stocks[0].buyLow,489.54);

const zero=mod.buildDailySelectionPayload("2026-09-18",[],{});
assert.equal(zero.resultType,"ZERO_MATCH");
assert.equal(zero.selectedCount,0);
assert.match(zero.instruction,/維持現金/);

const push=mod.buildPushPayload({
  symbol:"3105",name:"穩懋",currentPrice:493,
  monitorStatus:{grade:"A",text:"立即處理"},
  plan:{
    positionStage:"NONE",channel:"B",mode:"MOMENTUM",signalLevel:"A",priorityScore:89.4,rewardRisk:3.71,
    actualShares:null,buyLow:489.54,buyHigh:496.92,breakout:492,maxChase:500,
    firstAmount:38400,secondAmount:25600,stop:472.06,profitCheck:573
  }
},{type:"BUY",label:"買進訊號",instruction:"第一筆條件成立",reason:"15分K確認",amount:38400,shares:77},"2026-09-21");
assert.equal(push.strategy,"B突破後承接");
assert.equal(push.monitorGrade,"A");
assert.equal(push.actualPositionKnown,false);
assert.equal(push.signalLevel,"A");
assert.equal(push.suggestedShares,Math.floor(38400/493));

const comparison=mod.buildExternalValidationComparison("2026-09-18",["3105","6133","2006"],{
  source:"動能選股",symbols:["3105","2449","2006"],provenance:"管理員提供"
});
assert.deepEqual(comparison.overlapSymbols,["3105","2006"]);
assert.deepEqual(comparison.v7OnlySymbols,["6133"]);
assert.deepEqual(comparison.externalOnlySymbols,["2449"]);
assert.equal(comparison.overlapCount,2);
assert.equal(comparison.unionCount,4);

const latest={
  version:"8.1.0-ops-hardening",scanDate:"2026-09-18",generatedAt:"2026/09/18 18:15:52",selectedCount:3,
  stocks:[{symbol:"3105",name:"穩懋"},{symbol:"6133",name:"金橋"},{symbol:"2006",name:"東和鋼鐵"}],
  pipeline:{selectionCompleted:true,configVerified:true,threeMinAccepted:true,threeMinVerified:true,dailyReportAccepted:true,complete:true},
  threeMin:{httpStatus:202},dailyReport:{httpStatus:200},
  diagnostics:{requirements30:{complete:false,incompleteRules:[17,18,19,27,28,29]}}
};
const kv=new KV({
  V7_LAST_AFTER_MARKET_SCAN:latest,
  STOCK_CONFIG_V7:{updatedAt:"2026-09-18T10:15:00.000Z",stocks:[]}
});
const env={ADMIN_TOKEN:"admin-test",TEST_MODE:"false",STOCKS_KV:kv,THREEMIN_API_URL:"x",THREEMIN_VERIFY_URL:"x",PUSH_WEBHOOK_URL:"x",FUGLE_API_KEY:"x"};
const overview=await mod.buildSystemOverview(env);
assert.equal(overview.requirements.completedCount,24);
assert.deepEqual(overview.requirements.incompleteRules,[17,18,19,27,28,29]);
assert.equal(overview.latestPlan.threeMin.verified,true);
assert.equal(overview.integrations.phonePushConfigured,true);

let response=await mod.default.fetch(new Request("https://worker.invalid/api/system-overview",{headers:{"x-admin-token":"admin-test"}}),env);
assert.equal(response.status,200);
assert.equal((await response.json()).requirements.completedCount,24);

response=await mod.default.fetch(new Request("https://worker.invalid/system"),env);
assert.equal(response.status,200);
assert.match(await response.text(),/30項完成度/);

response=await mod.default.fetch(new Request("https://worker.invalid/api/external-validation",{
  method:"POST",
  headers:{"x-admin-token":"admin-test","content-type":"application/json"},
  body:JSON.stringify({marketDate:"2026-09-18",source:"動能選股",symbols:["3105","2449","2006"]})
}),env);
assert.equal(response.status,200);
const externalResult=await response.json();
assert.equal(externalResult.comparison.overlapCount,2);
assert.equal(externalResult.noPlanChanges,true);
assert.equal(externalResult.noPush,true);
assert.equal(externalResult.noThreeMinWrite,true);
assert.ok(await kv.get("V7_EXTERNAL_COMPARISON:2026-09-18","json"));

for (const required of [
  "CREATE TABLE IF NOT EXISTS v7_push_outbox",
  'deliveryState=outcome.sent ? "ACCEPTED"',
  'url.pathname==="/api/push-outbox"',
  'url.pathname==="/api/system-overview"',
  'url.pathname==="/api/external-validation/stats"',
  "sendTrackedPush(dailyPayload",
  "實際持股：尚未回填"
]) assert.ok(source.includes(required),required);

console.log(JSON.stringify({
  ok:true,
  systemOverview:true,
  pushOutbox:true,
  dailyReportHardening:true,
  intradayPayloadHardening:true,
  externalValidationComparison:true,
  noPlanChanges:true
}));
