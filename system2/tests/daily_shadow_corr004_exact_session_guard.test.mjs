import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const reader=await readFile("system2/runtime/daily_shadow_history_reader_v0_1.mjs","utf8");
const orchestrator=await readFile("system2/runtime/daily_shadow_diagnostic_orchestrator_v0_1.mjs","utf8");
const readonly=await readFile("system2/scripts/run_daily_shadow_input_preflight_readonly.mjs","utf8");

assert.match(reader,/DAILY_SHADOW_HISTORY_READER_VERSION = "0\.4-RESEARCH"/);
assert.match(reader,/GROUP_CONCAT\(market_date, ','\) AS selected_dates_csv/);
assert.match(reader,/SYMBOL_LOCAL_EXPECTED_SESSION_MISSING/);
assert.match(reader,/SYMBOL_LOCAL_UNEXPECTED_SESSION_PRESENT/);
assert.match(reader,/expectedSessionHash/);
assert.match(reader,/observedSessionHash/);
assert.match(reader,/exactSessionReconciliationReady/);
assert.match(reader,/EXPECTED_SESSION_HASH_MISMATCH/);
assert.match(reader,/minimumMarketDate/);
assert.match(reader,/certifiedNoTradingIntervals/);
assert.ok(!reader.includes("const ageBoundaryMatches = !ageLimited"),"old long-listed boundary shortcut must be removed");

assert.match(orchestrator,/fetchTwseRegulatoryLifecycleForSymbolsV0_1/);
assert.match(orchestrator,/HISTORY_LIFECYCLE_EVIDENCE/);
assert.match(orchestrator,/missingExpectedSessionCount/);
assert.match(orchestrator,/certifiedNoTradingIntervals: lifecycle\.intervals/);
assert.match(orchestrator,/absenceCertifiesNoEvent: false/);

assert.match(readonly,/buildOfficialTradingDatesV0_1/);
assert.match(readonly,/fetchTwseRegulatoryLifecycleForSymbolsV0_1/);
assert.match(readonly,/exactSessionEvidence/);
assert.match(readonly,/certifiedNoTradingIntervals: evidence\.intervals/);

console.log("System2 CORR-004 exact-session implementation guard passed");
