import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { buildOfficialTradingDatesV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import {
  evaluateRawA1LineageV1_0,
  summarizeRawA1LineageV1_0,
} from "../runtime/s2_07_raw_a1_lineage_v1_0.mjs";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");

const receiptUrl = new URL(
  "../evidence/S2_07_NATIVE_SCHEDULE_INTEGRATION_V0_9_PHYSICAL_20261007.json",
  import.meta.url,
);
const nativeReceipt = JSON.parse(await readFile(receiptUrl, "utf8"));
assert.equal(
  nativeReceipt.schemaVersion,
  "S2_S2_07_NATIVE_SCHEDULE_INTEGRATION_PHYSICAL_RECEIPT_V0_9",
);
assert.equal(nativeReceipt.summary.boundedNativeSymbolSessionEvidenceReadyCount, 4);
assert.deepEqual(
  nativeReceipt.readyCases.map((row) => row.symbol).sort(),
  ["3086", "4806", "5381", "6241"],
);

function shiftDate(date, days) {
  const value = new Date(date + "T12:00:00Z");
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

const earliestStop = [...nativeReceipt.readyCases]
  .map((row) => row.stopTradingStart)
  .sort()[0];
const latestResume = [...nativeReceipt.readyCases]
  .map((row) => row.resumeTradingDate)
  .sort()
  .at(-1);
const calendarStart = shiftDate(earliestStop, -20);
const calendar = await buildOfficialTradingDatesV0_1({
  fromDate: calendarStart,
  toDate: latestResume,
});
assert.ok(calendar.tradingDateCount > 0);

const db = await createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName: "system2-research",
});
const schema = await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1",
);
assert.equal(schema[0]?.schema_value, "1.1");

const rows = [];
const queryDiagnostics = [];
for (const readyCase of nativeReceipt.readyCases) {
  const previousOfficialSession = calendar.tradingDates
    .filter((date) => date < readyCase.stopTradingStart)
    .at(-1);
  assert.ok(previousOfficialSession, "previous official session missing for " + readyCase.symbol);

  const rawRows = await db.rawQuery(
    `SELECT bar_id, canonical_key, market_date, market, symbol, price_space,
            continuity_state, source_id, source_name, source_url, source_row_hash,
            observed_at, available_at, pit_availability_class, pit_replay_eligible,
            captured_at, bar_hash, schema_version
       FROM s2_historical_a1_bars
      WHERE market = ? AND symbol = ?
        AND market_date BETWEEN ? AND ?
        AND price_space = 'RAW'
      ORDER BY market_date, observed_at, bar_hash`,
    [
      readyCase.market,
      readyCase.symbol,
      previousOfficialSession,
      readyCase.resumeTradingDate,
    ],
  );

  const evaluated = evaluateRawA1LineageV1_0({
    nativeSessionEvidence: {
      ...readyCase,
      state: "BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY",
    },
    marketSessions: calendar.tradingDates,
    rawA1Rows: rawRows,
  });
  rows.push(evaluated);
  queryDiagnostics.push({
    symbol: readyCase.symbol,
    market: readyCase.market,
    previousOfficialSession,
    stopTradingStart: readyCase.stopTradingStart,
    resumeTradingDate: readyCase.resumeTradingDate,
    d1RawRowCount: rawRows.length,
    rawA1LineageBound: evaluated.rawA1LineageBound,
    state: evaluated.state,
    blockers: evaluated.blockers,
  });
}

const summary = summarizeRawA1LineageV1_0(rows);
assert.equal(summary.caseCount, 4);
assert.equal(summary.technicalContinuityCertified, false);
assert.equal(summary.rawBarsMutated, false);
assert.equal(summary.adjustedPriceGenerated, false);
assert.equal(summary.system1RuntimeUsed, false);
assert.equal(db.metrics.rowsWritten, 0, "RAW A1 lineage probe must remain read-only");

console.log(JSON.stringify({
  result: "S2_07_RAW_A1_LINEAGE_V1_0_COMPLETE",
  version: "1.0-RESEARCH",
  sourceNativeReceipt: {
    schemaVersion: nativeReceipt.schemaVersion,
    runId: nativeReceipt.authoritativeRun?.runId || null,
    mergeCommit: nativeReceipt.authoritativeRun?.mergeCommit || null,
    readyCaseCount: nativeReceipt.readyCases.length,
  },
  calendar: {
    source: calendar.source,
    fromDate: calendarStart,
    toDate: latestResume,
    tradingDateCount: calendar.tradingDateCount,
  },
  summary,
  cases: rows,
  queryDiagnostics,
  d1: {
    databaseName: "system2-research",
    schemaVersion: schema[0]?.schema_value || null,
    requestCount: db.metrics.requestCount,
    rowsRead: db.metrics.rowsRead,
    rowsWritten: db.metrics.rowsWritten,
    mutationPerformed: false,
  },
  boundaries: {
    boundedFourCaseOnly: true,
    rawBarsMutated: false,
    adjustedPriceGenerated: false,
    continuityTransformPerformed: false,
    technicalContinuityCertified: false,
    symbolSessionCompletenessCertified: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  },
}, null, 2));
