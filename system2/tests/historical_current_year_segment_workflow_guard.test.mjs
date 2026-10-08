import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workflow=await readFile(new URL("../../.github/workflows/system2-historical-current-year-segment-backfill.yml",import.meta.url),"utf8");
const script=await readFile(new URL("../scripts/historical_current_year_segment_backfill_v0_1.mjs",import.meta.url),"utf8");
const migration=await readFile(new URL("../sql/0010_current_year_segmented_cold_store.sql",import.meta.url),"utf8");

assert.match(workflow,/name:\s+System2 Historical Current-Year Segmented Backfill/);
assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/market:/);
assert.match(workflow,/- TWSE/);
assert.match(workflow,/- TPEX/);
assert.match(workflow,/group: system2-isolated-d1-writer/);
assert.match(workflow,/SYSTEM2_HISTORY_SEGMENT_MARKET: \$\{\{ inputs\.market \}\}/);
assert.match(workflow,/historical_current_year_segment_backfill_v0_1\.mjs/);
assert.doesNotMatch(workflow,/^\s+push:/m,"current-year segment backfill must never auto-run on push");
assert.doesNotMatch(workflow,/matrix:\s*[\s\S]*market:/,"current-year segment backfill must run one market at a time");

assert.match(script,/throughMonth=currentMonth-1/);
assert.match(script,/fetchHistoricalTwseMonthlyTradingDatesV0_1/,"current-year sessions must be proved by exact official FMTQIK month");
assert.match(script,/calendarsByYear/,"exact monthly sessions must reach A1 reader");
assert.match(script,/onDateReceipt:/,"daily accepted source receipts must be logged");
assert.match(script,/observedAtFactory:\(\)=>new Date\(\)\.toISOString\(\)/,"official daily observations must get retrieval-time provenance");
assert.match(script,/capturedAt:new Date\(\)\.toISOString\(\)/,"segment pack/persist times must be fresh per-month");
assert.match(script,/BLOCKED_FAIL_CLOSED_SEGMENT_BACKFILL/,"failed run must preserve prior completed months and explicit error");
assert.match(script,/lastRequestedOfficialDate/,"failed run must preserve failed daily source identity");
assert.match(script,/S2_SEGMENT_MONTH_COMPLETE/,"each completed month must be logged");
assert.match(script,/pauseMs:750/,"paced source access must avoid 25ms request bursts");
assert.match(script,/PASS_CURRENT_YEAR_COMPLETED_MONTH_SEGMENTS/);
assert.match(script,/onlyCompletedCalendarMonths:true/);
assert.match(script,/currentIncompleteMonthWritten:false/);
assert.match(script,/annualPackMutated:false/);
assert.match(script,/executeHistoricalSegmentPackSetV0_1/);
assert.match(script,/finalizeHistoricalSegmentCheckpointFromReceiptV0_1/,"receipted months must finalize an interrupted checkpoint before being skipped");
assert.doesNotMatch(script,/executeHistoricalColdPackSetV0_1/,"current-year path must not mutate annual pack manifests");

assert.match(migration,/s2_historical_a1_segment_manifests/);
assert.match(migration,/s2_historical_segment_backfill_checkpoints/);
assert.match(migration,/s2_historical_segment_ingest_receipts/);
assert.match(migration,/UNIQUE \(market, symbol, year, month, price_space\)/);
assert.doesNotMatch(migration,/gzip_base64/,"segmented cold manifests must not store payload bytes in D1");

console.log("System2 current-year segmented cold workflow guard tests passed");
