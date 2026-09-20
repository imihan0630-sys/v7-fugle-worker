import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {researchTickSize,researchLimitState,researchPriceFeaturesFromBars,buildHistoricalResearchSnapshot,researchSnapshotCompletenessAudit,researchPromotionGate};"
).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.7\.1-history-research-v2";/);
for(const marker of [
  'url.pathname === "/api/research/reconstruct-history"',
  "RECONSTRUCTED_PRICE_ONLY",
  "noCurrentDataBackfill:true",
  "前瞻正式完整快照的5日成熟樣本少於30筆",
  "趨勢持續性研究分數",
  "突破距離Tick數",
  "<title>\n台股交易決策監控系統\n</title>",
  "<h1>\n台股交易決策監控系統\n</h1>"
]) assert.ok(source.includes(marker),marker);

assert.equal(mod.researchTickSize(9.99),0.01);
assert.equal(mod.researchTickSize(10),0.05);
assert.equal(mod.researchTickSize(50),0.1);
assert.equal(mod.researchTickSize(100),0.5);
assert.equal(mod.researchTickSize(500),1);
assert.equal(mod.researchTickSize(1000),5);

const limit=mod.researchLimitState({close:110,high:110,low:104},100);
assert.equal(limit.state,"CLOSED_NEAR_LIMIT_UP");

const scanDate="2026-03-10";
const end=new Date(scanDate+"T00:00:00Z");
const bars=[];
for(let i=69;i>=0;i--){
  const d=new Date(end);d.setUTCDate(d.getUTCDate()-i);
  const base=80+(69-i)*0.3;
  bars.push({
    date:d.toISOString().slice(0,10),
    open:base-0.2,high:base+0.6,low:base-0.7,close:base,
    volumeShares:1000000+(69-i)*1000,tradeValue:base*1000000
  });
}
bars.push({date:"2026-03-11",open:999,high:1001,low:998,close:1000,volumeShares:9999999,tradeValue:999999999});
const price=mod.researchPriceFeaturesFromBars(bars,scanDate);
assert.equal(price.ok,true);
assert.equal(price.maxSourceDate,scanDate);
assert.notEqual(price.features.close,1000);
assert.ok(Number.isFinite(price.features.persistenceScoreResearch));
assert.ok(Number.isFinite(price.features.tickSizeResearch));
assert.ok(price.features.limitStateResearch);

const hist=mod.buildHistoricalResearchSnapshot({
  scan_date:scanDate,plan_date:"2026-03-11",symbol:"2330",name:"測試",
  strategy:"A拉回承接",signal_level:"B",reward_risk:2.5
},price);
assert.equal(hist.sourceCompleteness,"RECONSTRUCTED_PRICE_ONLY");
assert.equal(hist.provenance.noForwardFill,true);
assert.equal(hist.provenance.marketContextBackfilled,false);
assert.equal(hist.fundamental.score,null);
assert.equal(hist.institution.score,null);
assert.equal(hist.price.close,price.features.close);

const audit=mod.researchSnapshotCompletenessAudit([
  {snapshot:hist},
  {snapshot:{sourceCompleteness:"FULL_FORMAL_SCAN",provenance:{noForwardFill:true}}}
]);
assert.equal(audit.total,2);
assert.equal(audit.sourceCounts.RECONSTRUCTED_PRICE_ONLY,1);
assert.equal(audit.reconstructionForwardFillViolations,0);

const gate=mod.researchPromotionGate({
  sampleCount:100,fullMatureCount:0,distinctScanDates:30,distinctYears:2,regimes:["BULL_BROAD","MIXED"],holdoutDates:10,
  factors:[{direction:"HIGH",train:{n:30,spreadPct:1},holdout:{n:20,spreadPct:1},key:"x",label:"x"}]
});
assert.equal(gate.promotionEligible,false);
assert.ok(gate.reasons.some(x=>x.includes("前瞻正式完整快照")));

console.log(JSON.stringify({
  ok:true,
  version:"8.7.1-history-research-v2",
  noLookAheadReconstruction:true,
  pathHistoryRefresh:true,
  factorV2:["persistence","tickDistance","limitState"],
  formalCoreLocked:true
}));
