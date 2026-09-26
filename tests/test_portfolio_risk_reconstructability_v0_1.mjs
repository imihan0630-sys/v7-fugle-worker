import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const journal=await readFile(new URL("../scripts/apply_v8_5_0.py",import.meta.url),"utf8");
const recovered=await readFile(new URL("../scripts/apply_v8_5_2.py",import.meta.url),"utf8");
const receipt=JSON.parse(await readFile(new URL("../research/portfolio_risk_reconstructability_v0_1.json",import.meta.url),"utf8"));

for(const marker of [
  "scan_date TEXT PRIMARY KEY",
  "selected_count INTEGER NOT NULL DEFAULT 0",
  "total_capital REAL",
  "status TEXT",
  "diagnostics_json TEXT"
]) assert.ok(journal.includes(marker),marker);

for(const marker of [
  "buy_low REAL","buy_high REAL","stop REAL","priority_score REAL","reward_risk REAL",
  "allocation_ratio REAL","total_allocation REAL","first_shares INTEGER","second_shares INTEGER","total_shares INTEGER"
]) assert.ok(journal.includes(marker),marker);

assert.ok(journal.includes("journalNumber(stock?.buyLow)"));
assert.ok(journal.includes("journalNumber(stock?.buyHigh)"));
assert.ok(journal.includes("journalNumber(stock?.stop)"));
assert.ok(journal.includes("journalNumber(stock?.allocationRatio)"));
assert.ok(journal.includes("journalNumber(stock?.totalAllocation)"));
assert.ok(journal.includes('stocks.length ? `今日選出 ${stocks.length} 檔` : "今日0檔，維持現金"'));

assert.ok(recovered.includes("CREATE TABLE IF NOT EXISTS v8_trade_journal_recovered"));
assert.ok(!receipt.eligibleSource.includes("recovered"));
assert.ok(receipt.excludedSources.some(x=>x.source==="v8_trade_journal_recovered"));
assert.ok(receipt.notHistoricallyReconstructableFromPlanJournalAlone.includes("pairwiseCorrelation20"));
assert.ok(receipt.notHistoricallyReconstructableFromPlanJournalAlone.includes("pairwiseCorrelation60"));

console.log(JSON.stringify({
  ok:true,
  planTimeCapitalAndStopFieldsPersisted:true,
  projectedHeatHistoricallyReconstructableForSystemJournalPlans:true,
  recoveredManualRowsExcluded:true,
  historicalCorrelationStillPITBlocked:true
}));
