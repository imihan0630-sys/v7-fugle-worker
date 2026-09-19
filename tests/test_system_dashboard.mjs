import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const workerPath = process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js", import.meta.url).pathname;
const api = await import(pathToFileURL(workerPath).href + "?system=" + Date.now());

class KV {
  constructor(seed={}) { this.seed=seed; }
  async get(key,type) {
    const value=this.seed[key] ?? null;
    if(value===null) return null;
    return type==="json" ? (typeof value==="string"?JSON.parse(value):value) : (typeof value==="string"?value:JSON.stringify(value));
  }
}

const latest={
  scanDate:"2026-09-18",
  generatedAt:"2026/09/18 18:15:52",
  stocks:[{symbol:"3105",name:"穩懋",signalLevel:"A",channel:"B"}],
  pipeline:{configAccepted:true,configVerified:true,threeMinAccepted:true,threeMinVerified:true,dailyReportAccepted:true,complete:true},
  diagnostics:{requirements30:{incompleteRules:[17,18,19,27,28,29]}},
  config:{updatedAt:"2026-09-18T10:15:00.000Z"}
};
const env={
  TEST_MODE:"false",
  ADMIN_TOKEN:"SECRET_ADMIN",
  FUGLE_API_KEY:"SECRET_FUGLE",
  PUSH_WEBHOOK_URL:"https://secret.example/webhook",
  THREEMIN_API_URL:"https://secret.example/write",
  THREEMIN_VERIFY_URL:"https://secret.example/read",
  STOCKS_KV:new KV({
    V7_LAST_AFTER_MARKET_SCAN:latest,
    V7_LAST_SCAN_ATTEMPT:{status:"SUCCESS",requestedDate:"2026-09-18"},
    STOCK_CONFIG_V7:{updatedAt:"2026-09-18T10:15:00.000Z",stocks:latest.stocks}
  })
};

let response=await api.default.fetch(new Request("https://worker.invalid/api/system-status"),env);
assert.equal(response.status,200);
const body=await response.json();
assert.equal(body.version,"8.0.5-system-dashboard");
assert.equal(body.overall.requirementsComplete,24);
assert.equal(body.overall.pendingCount,6);
assert.deepEqual(body.overall.incompleteRules,[17,18,19,27,28,29]);
assert.equal(body.afterMarket.pipelineComplete,true);
assert.equal(body.afterMarket.threeMinAccepted,true);
assert.equal(body.afterMarket.threeMinVerified,true);
assert.equal(body.safety.secretsExposed,false);
assert.equal(body.safety.readOnly,true);
const serialized=JSON.stringify(body);
for(const secret of ["SECRET_ADMIN","SECRET_FUGLE","secret.example"]) assert.equal(serialized.includes(secret),false);

response=await api.default.fetch(new Request("https://worker.invalid/system"),env);
assert.equal(response.status,200);
const page=await response.text();
assert.match(page,/30項總控/);
assert.match(page,/24\/30/);
assert.match(page,/3105/);
assert.equal(page.includes("SECRET_ADMIN"),false);
assert.equal(page.includes("secret.example"),false);

console.log(JSON.stringify({ok:true,systemDashboard:true,requirementsComplete:24,pending:[17,18,19,27,28,29],secretsExposed:false,readOnly:true}));
