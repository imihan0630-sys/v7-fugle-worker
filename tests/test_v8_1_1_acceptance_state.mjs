import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const api=await import(pathToFileURL(workerPath).href+"?v811="+Date.now());

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
  selectedCount:3,
  stocks:[{symbol:"3105",name:"穩懋"}],
  pipeline:{selectionCompleted:true,configVerified:true,threeMinAccepted:true,threeMinVerified:true,dailyReportAccepted:true,complete:true},
  threeMin:{httpStatus:202},
  config:{updatedAt:"2026-09-18T10:15:00.000Z"},
  diagnostics:{
    requirements30:{
      incompleteRules:[11,17,18,19,27,28,29],
      requirement26:{complete:true}
    }
  }
};
const env={
  TEST_MODE:"false",
  STOCKS_KV:new KV({
    V7_LAST_AFTER_MARKET_SCAN:latest,
    STOCK_CONFIG_V7:{updatedAt:"2026-09-18T10:15:00.000Z",stocks:latest.stocks}
  })
};

let response=await api.default.fetch(new Request("https://worker.invalid/system"),env);
assert.equal(response.status,200);
const page=await response.text();
assert.match(page,/24\/30/);
assert.match(page,/待驗收：17、18、19、27、28、29/);
assert.doesNotMatch(page,/待驗收：11/);

const health=await readFile(new URL("./scheduled_health.mjs",import.meta.url),"utf8");
assert.equal(health.includes("'8.0.2-requirement26-acceptance'"),false);
assert.match(health,/\/api\/push-outbox\?limit=(20|50)/);
assert.match(health,/staleUnresolved/);
assert.match(health,/Watchlist runtime version differs from deployed Worker/);

console.log(JSON.stringify({
  ok:true,
  version:"8.1.1-acceptance-state-health",
  completedCount:24,
  incompleteRules:[17,18,19,27,28,29],
  staleHistoricalRule11Removed:true,
  scheduledHealthUsesRuntimeVersion:true,
  pushOutboxHealthAudit:true
}));
