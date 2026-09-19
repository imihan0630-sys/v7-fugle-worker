import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mod=await import("data:text/javascript;base64,"+Buffer.from(
  source+"\nexport {journalTradeStats};"
).toString("base64")+"#"+Date.now());

const plans=[
  {scan_date:"2026-09-21",symbol:"1111"},
  {scan_date:"2026-09-21",symbol:"2222"},
  {scan_date:"2026-09-21",symbol:"3333"},
  {scan_date:"2026-09-22",symbol:"4444"}
];
const signals=[
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"1111",name:"甲",signal_type:"BUY",market_price:100,occurred_at:"2026-09-22T01:30:00Z"},
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"1111",name:"甲",signal_type:"PROFIT_CHECK",market_price:110,occurred_at:"2026-09-22T03:00:00Z"},
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"1111",name:"甲",signal_type:"SELL",market_price:112,occurred_at:"2026-09-22T04:00:00Z"},
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"2222",name:"乙",signal_type:"BUY",market_price:50,occurred_at:"2026-09-22T01:35:00Z"},
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"2222",name:"乙",signal_type:"STOP_LOSS",market_price:45,occurred_at:"2026-09-22T02:30:00Z"},
  {plan_scan_date:"2026-09-21",trade_date:"2026-09-22",symbol:"3333",name:"丙",signal_type:"BUY",market_price:80,occurred_at:"2026-09-22T01:40:00Z"}
];

const stats=mod.journalTradeStats(plans,signals);
assert.equal(stats.selectedPlans,4);
assert.equal(stats.buyTriggeredPlans,3);
assert.equal(stats.buyTriggerRate,75);
assert.equal(stats.completedTrades,2);
assert.equal(stats.openTrades,1);
assert.equal(stats.wins,1);
assert.equal(stats.losses,1);
assert.equal(stats.flats,0);
assert.equal(stats.winRate,50);
assert.equal(stats.averageReturnPct,1);
assert.equal(stats.profitCheckTriggeredPlans,1);
assert.equal(stats.profitCheckRate,33.33);

for(const marker of [
  'const VERSION = "8.5.0-trade-journal";',
  'CREATE TABLE IF NOT EXISTS v8_trade_journal_days',
  'CREATE TABLE IF NOT EXISTS v8_trade_journal_plans',
  'CREATE TABLE IF NOT EXISTS v8_trade_journal_signals',
  'async function recordTradeJournalDay',
  'async function recordTradeJournalSignal',
  'url.pathname === "/api/journal"',
  'url.pathname === "/api/journal/health"',
  'url.pathname === "/api/journal/backfill-latest"',
  'url.pathname === "/journal"',
  'const journalEvent=await recordTradeJournalSignal'
]) assert.ok(source.includes(marker),marker);

console.log(JSON.stringify({
  ok:true,
  version:"8.5.0-trade-journal",
  planHistory:true,
  signalTimestampHistory:true,
  completedTradeWinRate:true,
  noOpenTradeInWinLossDenominator:true
}));
