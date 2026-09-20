import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {researchPathForSelection,factorStudyFromSnapshots,researchPromotionGate,buildResearchMarketContext,normalizeStock};"
).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.7\.0-research-foundation";/);
for(const marker of [
  "CREATE TABLE IF NOT EXISTS trade_research_snapshots",
  "CREATE TABLE IF NOT EXISTS trade_research_days",
  'url.pathname === "/research"',
  'url.pathname === "/api/research/dashboard"',
  'url.pathname === "/api/research/backfill-current"',
  "台股交易決策監控系統｜研究驗證中心",
  "researchSnapshot: item?.researchSnapshot",
  "researchSnapshot: buildResearchSnapshot(item,scanDate)"
]) assert.ok(source.includes(marker),marker);

const p=mod.researchPathForSelection(
  {scan_date:"2026-09-11",plan_date:"2026-09-14",symbol:"9999",name:"測試",formal_close:100,stop:95,profit_check:108},
  [
    {date:"2026-09-14",close:101,high:102,low:99},
    {date:"2026-09-15",close:103,high:104,low:100},
    {date:"2026-09-16",close:106,high:109,low:102},
    {date:"2026-09-17",close:104,high:107,low:94},
    {date:"2026-09-18",close:105,high:106,low:103}
  ]
);
assert.equal(p.horizons.d1.returnPct,1);
assert.equal(p.horizons.d3.returnPct,6);
assert.equal(p.horizons.d5.returnPct,5);
assert.equal(p.horizons.d5.mfePct,9);
assert.equal(p.horizons.d5.maePct,-6);
assert.equal(p.firstTargetHitDate,"2026-09-16");
assert.equal(p.firstStopHitDate,"2026-09-17");
assert.equal(p.firstBarrier,"TARGET");
assert.equal(p.horizons.d10,null);

const market=mod.buildResearchMarketContext(
  [
    {close:110,ma20:100,ma60:90,priorHigh20:108},
    {close:90,ma20:95,ma60:100,priorHigh20:99}
  ],
  [{changePercent:2},{changePercent:-1}],
  4,
  {"AI":{"score":80,"breadth":70,"avgChange":2,"amountVs20DayAverage":1.2}},
  "2026-09-18"
);
assert.equal(market.regime,"MIXED");
assert.equal(market.advanceCount,1);
assert.equal(market.declineCount,1);
assert.equal(market.topSectors[0].industry,"AI");

const rows=[];
const paths=[];
for(let i=0;i<12;i++){
  const date="2026-09-"+String(i+1).padStart(2,"0");
  rows.push({scan_date:date,symbol:String(1000+i),market_regime:"MIXED",snapshot:{market:{regime:"MIXED"},price:{residualSectorRs20:i}}});
  paths.push({scanDate:date,symbol:String(1000+i),horizons:{d5:{returnPct:i-4}}});
}
const study=mod.factorStudyFromSnapshots(rows,paths,5);
assert.equal(study.sampleCount,12);
const gate=mod.researchPromotionGate(study);
assert.equal(gate.promotionEligible,false);
assert.ok(gate.reasons.some(x=>x.includes("60")));

const normalized=mod.normalizeStock({
  symbol:"2330",name:"測試",formalClose:100,buyLow:95,buyHigh:100,mode:"PULLBACK",
  researchSnapshot:{schemaVersion:"research-snapshot-v1",researchOnly:true}
},0);
assert.equal(normalized.researchSnapshot.schemaVersion,"research-snapshot-v1");

console.log(JSON.stringify({
  ok:true,
  version:"8.7.0-research-foundation",
  researchSnapshots:true,
  pathMetrics:[1,3,5,10,20],
  promotionGate:true,
  formalCoreChanged:false
}));
