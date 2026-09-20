import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {journalPerformanceStats,recoveredJournalStats,buildTradeJournalCsv};"
).toString("base64")+"#"+Date.now());

const plans=[
  {scan_date:"2026-09-21",symbol:"1111",strategy:"A拉回承接",signal_level:"A",formal_close:1200,reward_risk:2.5},
  {scan_date:"2026-09-21",symbol:"2222",strategy:"B突破後承接",signal_level:"B",formal_close:100,reward_risk:2},
  {scan_date:"2026-09-22",symbol:"3333",strategy:"A拉回承接",signal_level:"A",formal_close:800,reward_risk:3}
];
const signals=[
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"1111",name:"甲",signal_type:"BUY",market_price:100,occurred_at:"2026-09-22T01:30:00Z"},
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-23",symbol:"1111",name:"甲",signal_type:"SELL",market_price:110,occurred_at:"2026-09-23T01:30:00Z"},
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"2222",name:"乙",signal_type:"BUY",market_price:100,occurred_at:"2026-09-22T01:30:00Z"},
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"2222",name:"乙",signal_type:"STOP_LOSS",market_price:95,occurred_at:"2026-09-22T02:30:00Z"},
  {plan_scan_date:"2026-09-22",trade_date:"2026-09-23",symbol:"3333",name:"丙",signal_type:"BUY",market_price:80,occurred_at:"2026-09-23T01:30:00Z"}
];

const p=mod.journalPerformanceStats(plans,signals);
assert.equal(p.completedTrades,2);
assert.equal(p.openTrades,1);
assert.equal(p.winRate,50);
assert.equal(p.stopLossCount,1);
assert.equal(p.stopLossRate,50);
assert.equal(p.byStrategy.find(x=>x.key==="A拉回承接").total,2);
assert.equal(p.bySignalLevel.find(x=>x.key==="A").total,2);
assert.equal(p.byPriceClass.find(x=>x.key==="千元股").total,1);
assert.equal(p.byPriceClass.find(x=>x.key==="非千元股").total,2);

const r=mod.recoveredJournalStats([
  {record_status:"FORMAL_SELECTION",strategy:"策略一"},
  {record_status:"SUPERSEDED",strategy:"策略一"},
  {record_status:"FORMAL_SELECTION",strategy:"策略二"}
]);
assert.equal(r.total,3);
assert.equal(r.byStatus.find(x=>x.key==="FORMAL_SELECTION").count,2);

const csv=mod.buildTradeJournalCsv({
  planRows:[{scan_date:"2026-09-21",symbol:"1111",name:"甲,測試",strategy:"A拉回承接"}],
  signalRows:[],recoveredRows:[]
});
assert.ok(csv.startsWith("\ufeff"));
assert.ok(csv.includes('"甲,測試"'));

for(const marker of [
  'function performanceCenterPage()',
  'url.pathname === "/performance"',
  'url.pathname === "/api/journal/export"',
  'externalValidation:await readExternalValidationStats(env,30)',
  '匯出 Excel 相容 CSV'
]) assert.ok(source.includes(marker),marker);

console.log(JSON.stringify({
  ok:true,
  version:"8.6.0-or-later",
  breakdowns:["strategy","signalLevel","priceClass","month"],
  csvExport:true,
  externalValidationIntegrated:true
}));
