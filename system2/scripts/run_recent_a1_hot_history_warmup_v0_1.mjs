import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import {
  officialTwseCalendarUrl,
  parseTwseTradingCalendar,
} from "../runtime/twse_trading_calendar_readonly.mjs";
import {
  buildPriorTradingDatesV0_1,
  readRecentA1DateCoverageV0_1,
  planRecentA1HotHistoryWarmupV0_1,
  loadExistingA1SymbolsForDateMarketV0_1,
} from "../runtime/recent_a1_hot_history_warmup_v0_1.mjs";
import {
  fetchOfficialHistoricalA1DateV0_1,
} from "../runtime/official_historical_a1_source_v0_1.mjs";
import { buildHistoricalStoreIngestBatch } from "../runtime/historical_store_v0_1.mjs";
import { executeHistoricalIngestBatchBulkV0_1 } from "../runtime/historical_bulk_persistence_v0_1.mjs";

const CONFIRM = "WRITE_SYSTEM2_RECENT_A1_HOT_HISTORY_ONLY";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const confirm = process.env.SYSTEM2_CONFIRM;
const maxDatesPerRun = Number(process.env.SYSTEM2_HOT_HISTORY_MAX_DATES || 5);
const requiredSessions = Number(process.env.SYSTEM2_HOT_HISTORY_REQUIRED_SESSIONS || 60);
const runId = String(process.env.GITHUB_RUN_ID || "LOCAL");
const runAttempt = String(process.env.GITHUB_RUN_ATTEMPT || "1");

assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.equal(confirm, CONFIRM, "explicit System2 hot-history confirmation is required");
assert.ok(Number.isInteger(maxDatesPerRun) && maxDatesPerRun >= 1 && maxDatesPerRun <= 5,
  "SYSTEM2_HOT_HISTORY_MAX_DATES must be 1..5");
assert.ok(Number.isInteger(requiredSessions) && requiredSessions >= 20 && requiredSessions <= 120,
  "SYSTEM2_HOT_HISTORY_REQUIRED_SESSIONS must be 20..120");

function taipeiDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(value);
}

async function fetchCalendar(year) {
  const response = await fetch(officialTwseCalendarUrl(year), {
    method: "GET",
    headers: { accept: "application/json", "user-agent": "System2-Hot-History-Warmup/0.1" },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`TWSE calendar HTTP ${response.status} for ${year}`);
  return parseTwseTradingCalendar(await response.json(), year);
}

const anchorMarketDate = process.env.SYSTEM2_HOT_HISTORY_ANCHOR_DATE || taipeiDate();
assert.match(anchorMarketDate, /^\d{4}-\d{2}-\d{2}$/);

const anchorYear = Number(anchorMarketDate.slice(0, 4));
// The current TWSE holiday endpoint is reliable for the current schedule but
// may answer the current year even when an older queryYear is requested.
// Fetch only the anchor year here. If the requested prior-session window
// crosses a year boundary, the planner fails closed rather than consuming a
// falsely labeled prior-year calendar.
const calendars = new Map([[anchorYear, await fetchCalendar(anchorYear)]]);
let tradingDates;
try {
  tradingDates = buildPriorTradingDatesV0_1({
    anchorMarketDate,
    calendars,
    requiredSessions,
  });
} catch (error) {
  if (String(error?.message || "").includes("official trading calendar missing")) {
    throw new Error(
      "CROSS_YEAR_OFFICIAL_CALENDAR_SOURCE_REQUIRED:" + String(error.message),
      { cause: error },
    );
  }
  throw error;
}

const db = await createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName: "system2-research",
});

const schema = await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1",
);
assert.equal(schema[0]?.schema_value, "1.1", "isolated D1 must remain schema 1.1");

const minima = { TWSE: 500, TPEX: 450 };
const beforeCoverage = await readRecentA1DateCoverageV0_1({ db, tradingDates, minima });
const plan = planRecentA1HotHistoryWarmupV0_1({
  tradingDates,
  coverage: beforeCoverage,
  maxDatesPerRun,
});

const sourceContracts = {
  TWSE: {
    sourceId: "A1_TWSE_MI_INDEX_RECENT_HOT_WARMUP_PROSPECTIVE",
    sourceName: "TWSE MI_INDEX exact-date recent hot-history prospective observation",
  },
  TPEX: {
    sourceId: "A1_TPEX_DAILY_QUOTES_RECENT_HOT_WARMUP_PROSPECTIVE",
    sourceName: "TPEx dailyQuotes exact-date recent hot-history prospective observation",
  },
};

const writes = [];
for (const item of plan.planned) {
  for (const market of item.markets) {
    const fetched = await fetchOfficialHistoricalA1DateV0_1({
      market,
      marketDate: item.marketDate,
      observedAt: new Date().toISOString(),
    });
    assert.equal(fetched.state, "READY", `${market} ${item.marketDate} exact-date source not READY`);
    assert.equal(fetched.sourceDateEvidence, item.marketDate,
      `${market} ${item.marketDate} source date mismatch`);
    assert.ok(fetched.ordinarySymbolCount >= minima[market],
      `${market} ${item.marketDate} ordinary coverage too low: ${fetched.ordinarySymbolCount}`);

    const existing = await loadExistingA1SymbolsForDateMarketV0_1({
      db, marketDate: item.marketDate, market,
    });
    const existingSymbols = new Set(existing.map((row) => row.symbol));
    const ambiguousExisting = existing.filter((row) => row.revisionCount > 1);
    if (ambiguousExisting.length) {
      throw new Error(
        `existing revision ambiguity appeared after planning for ${market} ${item.marketDate}`,
      );
    }

    // This lane may only fill canonical keys that do not yet exist.  It never
    // inserts a second row for an existing symbol/date merely to improve PIT eligibility.
    const missingSourceRows = fetched.rows.filter((row) => !existingSymbols.has(row.symbol));
    if (!missingSourceRows.length) {
      writes.push({
        marketDate: item.marketDate,
        market,
        state: "NO_ABSENT_CANONICAL_KEYS_TO_FILL",
        fetchedOrdinarySymbolCount: fetched.ordinarySymbolCount,
        existingSymbolCount: existing.length,
        insertedBarCount: 0,
        identicalBarCount: 0,
      });
      continue;
    }

    const observedAt = new Date().toISOString();
    const rows = missingSourceRows.map((row) => ({
      ...row,
      continuityState: "UNVERIFIED",
      observedAt,
      availableAt: observedAt,
      availabilityBasis: "PROSPECTIVE_OBSERVATION",
    }));
    const batchId =
      `S2-HOT-A1-V0.1|${market}|${item.marketDate}|${runId}:${runAttempt}`;
    const ingestBatch = await buildHistoricalStoreIngestBatch({
      batchId,
      datasetLane: "CORE_2017_PLUS",
      sourceId: sourceContracts[market].sourceId,
      sourceName: sourceContracts[market].sourceName,
      sourceUrl: fetched.sourceUrl,
      capturedAt: observedAt,
      rows,
    });
    assert.equal(ingestBatch.pitEligibleCount, ingestBatch.rowCount);
    assert.ok(ingestBatch.rows.every((row) =>
      row.availabilityBasis === "PROSPECTIVE_OBSERVATION"
      && row.pitAvailabilityClass === "OBSERVED_AVAILABLE_UPPER_BOUND"
      && row.continuityState === "UNVERIFIED"
      && row.availableAt === observedAt
    ), "hot-history PIT/continuity semantics mismatch");

    const persisted = await executeHistoricalIngestBatchBulkV0_1({
      db,
      ingestBatch,
      lookupChunkSize: 80,
      insertChunkSize: 80,
    });
    writes.push({
      marketDate: item.marketDate,
      market,
      state: persisted.state,
      batchId,
      fetchedOrdinarySymbolCount: fetched.ordinarySymbolCount,
      existingSymbolCount: existing.length,
      attemptedMissingSymbolCount: rows.length,
      insertedBarCount: persisted.insertedBarCount,
      identicalBarCount: persisted.identicalBarCount,
      allBarsAccounted: persisted.allBarsAccounted,
      completionReceiptWrittenLast: persisted.completionReceiptWrittenLast,
    });
  }
}

const afterCoverage = await readRecentA1DateCoverageV0_1({ db, tradingDates, minima });
const afterPlan = planRecentA1HotHistoryWarmupV0_1({
  tradingDates,
  coverage: afterCoverage,
  maxDatesPerRun,
});
const readyDateCount = tradingDates.filter((marketDate) =>
  ["TWSE", "TPEX"].every((market) =>
    afterCoverage.find((row) => row.marketDate === marketDate && row.market === market)
      ?.historyCoverageReady === true
  )
).length;

const receipt = {
  result: "PASS",
  schemaVersion: "SYSTEM2_RECENT_A1_HOT_HISTORY_WARMUP_V0_1",
  databaseName: "system2-research",
  anchorMarketDate,
  requiredSessions,
  targetTradingDateFirst: tradingDates.at(-1),
  targetTradingDateLast: tradingDates[0],
  maxDatesPerRun,
  plannedDateCount: plan.plannedDateCount,
  planned: plan.planned,
  blocked: plan.blocked,
  writes,
  readyDateCountAfter: readyDateCount,
  remainingPlannedDateCountNextRun: afterPlan.plannedDateCount,
  remainingBlocked: afterPlan.blocked,
  historyCoverageOnly: true,
  continuityPromotionPerformed: false,
  continuityStateForNewRows: "UNVERIFIED",
  strategyEvaluationPerformed: false,
  capacityRunProduced: false,
  zeroPickClaimed: false,
  selectionAuthority: false,
  livePushEnabled: false,
  orderImpact: false,
  system1RuntimeUsed: false,
  d1UsageObservedThisRun: {
    requestCount: db.metrics.requestCount,
    rowsRead: db.metrics.rowsRead,
    rowsWritten: db.metrics.rowsWritten,
    latestSizeAfterBytes: db.metrics.latestSizeAfter,
  },
};

console.log(JSON.stringify(receipt, null, 2));
