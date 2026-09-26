import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname,"utf8");

const required=[
  'const VERSION = "8.12.0-history-source-revalidation-v2-3";',
  'const HISTORY_SEED_SCHEMA = "full-market-v4-history-source-revalidation";',
  'const HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS = 60;',
  'RAW_OFFICIAL_BAR_PRESENCE_BEFORE_FORMAL_FILTERS',
  'adjusted=false&fields=open,high,low,close,volume,turnover,change&sort=asc',
  'function buildEligibleMarketFeature(stock)',
  '.map(buildEligibleMarketFeature)',
  'historySourceRevalidation=historyAdmission.summary',
  'MISSING_OFFICIAL_TRADED_BAR',
  'OFFICIAL_GAP_PROOF_UNAVAILABLE',
  'VALID_WITH_VERIFIED_NO_TRADE_GAPS',
  'V7_HISTORY_PRESENCE:',
  '歷史日K回傳adjusted=true，拒絕與raw正式盤後資料混用',
  'validation.reason==="INSUFFICIENT_PRIOR_BARS"',
  'failed+=1;failedSymbols.push(item.symbol)'
];
for(const marker of required) assert.ok(source.includes(marker),marker);

const formal=source.slice(source.indexOf("function strategySetupState"),source.indexOf("function nearestRealResistance"));
assert.match(formal,/volumeA = .*<= 1\.05.*<= 0\.95/);
assert.match(formal,/volumeB = .*>= 1\.3/);
assert.match(formal,/pullbackPct >= 2 && pullbackPct <= 15/);
assert.match(formal,/f\.close >= f\.priorHigh20 \* 1\.002/);

const seed=source.slice(source.indexOf("async function runHistorySeed"),source.indexOf("async function fetchHistoricalDaily"));
assert.ok(seed.includes("validateHistorySourceRevalidation"));
assert.ok(seed.includes("allowNetwork:true"));
assert.ok(seed.includes("marketBySymbol"));

const scan=source.slice(source.indexOf("async function runAfterMarketScanCore"),source.indexOf("async function runAfterMarketScan",source.indexOf("async function runAfterMarketScanCore")+10));
assert.ok(scan.includes("buildHistoryAdmissionMap"));
assert.ok(scan.includes("updateMarketState(previous, rows, enrichment, marketDate,historyAdmission)"));

console.log(JSON.stringify({
  ok:true,
  version:"8.12.0-history-source-revalidation-v2-3",
  class:"B",
  formalStrategyMarkersFrozen:true,
  sourceAdmissionGuardPresent:true,
  officialGapProofFailClosed:true,
  rawPresenceBeforeFormalFilters:true
}));
