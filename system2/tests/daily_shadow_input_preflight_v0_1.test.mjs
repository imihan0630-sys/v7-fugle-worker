import assert from "node:assert/strict";
import { fetchDailyShadowA1SnapshotV0_1 } from "../runtime/daily_shadow_a1_source_v0_1.mjs";
import {
  loadPitPriorA1BarsV0_1,
  probePitHistoryCoverageV0_1,
} from "../runtime/daily_shadow_history_reader_v0_1.mjs";
import {
  assertDailyShadowAssessorAuthorizedV0_1,
  resolveDailyShadowAssessorReadinessV0_1,
} from "../runtime/daily_shadow_assessor_readiness_v0_1.mjs";
import { buildDailyShadowInputPreflightV0_1 } from "../runtime/daily_shadow_input_preflight_v0_1.mjs";

const marketDate = "2026-10-02";
const twseRows = [{
  Code: "2330", Name: "台積電", Date: "20261002",
  OpeningPrice: "1800", HighestPrice: "1830", LowestPrice: "1790", ClosingPrice: "1820",
  TradeVolume: "10000000", TradeValue: "18200000000", Transaction: "10000", Change: "20",
}];
const tpexRows = [{
  SecuritiesCompanyCode: "6488", CompanyName: "環球晶", Date: "20261002",
  Open: "500", High: "510", Low: "495", Close: "508",
  TradingShares: "1000000", TransactionAmount: "508000000", TransactionNumber: "2000", Change: "8",
}];

const fetchImpl = async (url) => ({
  ok: true,
  status: 200,
  async json() {
    return String(url).includes("twse") ? twseRows : tpexRows;
  },
});
const fixedNow = () => new Date("2026-10-02T07:20:00.000Z");

const source = await fetchDailyShadowA1SnapshotV0_1({
  marketDate,
  decisionTimestamp: "2026-10-02T07:30:00.000Z",
  fetchImpl,
  now: fixedNow,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(source.state, "READY");
assert.equal(source.snapshotBatch.ordinarySymbolCount, 2);
assert.equal(source.decisionClockMode, "FIXED_CALLER_CLOCK");
assert.equal(source.externalMutationPerformed, false);

const diagnosticClock = await fetchDailyShadowA1SnapshotV0_1({
  marketDate,
  fetchImpl,
  now: fixedNow,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(diagnosticClock.state, "READY");
assert.equal(diagnosticClock.decisionTimestamp, source.observedAt);
assert.equal(diagnosticClock.decisionClockMode, "DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK");

const late = await fetchDailyShadowA1SnapshotV0_1({
  marketDate,
  decisionTimestamp: "2026-10-02T07:00:00.000Z",
  fetchImpl,
  now: fixedNow,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(late.state, "INCOMPLETE");
assert.equal(late.snapshotBatch.blockerCodes.includes("OBSERVED_AFTER_DECISION_CLOCK"), true);

const sourceError = await fetchDailyShadowA1SnapshotV0_1({
  marketDate,
  fetchImpl: async () => ({ ok: false, status: 503 }),
  now: fixedNow,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(sourceError.state, "SOURCE_ERROR");
assert.equal(sourceError.snapshotBatch, null);

function barRow(symbol, market, date, index, continuity = "CLEAR_NO_ACTION") {
  return {
    bar_id: `B-${symbol}-${date}`,
    canonical_key: `${market}|${symbol}|${date}|RAW`,
    market_date: date,
    market,
    symbol,
    company_name: "fixture",
    price_space: "RAW",
    open_price: 100 + index,
    high_price: 102 + index,
    low_price: 99 + index,
    close_price: 101 + index,
    volume_shares: 1000000,
    trade_value: 101000000,
    transactions: 1000,
    change_value: 1,
    continuity_state: continuity,
    source_id: "FIXTURE",
    source_name: "fixture",
    source_url: null,
    source_row_hash: `SRC-${symbol}-${date}`,
    observed_at: "2026-10-02T06:00:00.000Z",
    available_at: date + "T05:30:00.000Z",
    pit_availability_class: "CONSERVATIVE_SESSION_FINALITY",
    pit_replay_eligible: 1,
    captured_at: "2026-10-02T06:00:00.000Z",
    bar_hash: `HASH-${symbol}-${date}`,
    schema_version: "S2_HISTORICAL_A1_BAR_V0_2",
  };
}

function fakeDb({ detailRows = [], coverageRows = [] } = {}) {
  return {
    prepare(sql) {
      return {
        bind(...params) {
          return {
            async all() {
              return { results: sql.includes("WITH eligible AS") ? coverageRows : detailRows };
            },
          };
        },
      };
    },
  };
}

const detail = [
  barRow("2330", "TWSE", "2026-09-29", 2),
  barRow("2330", "TWSE", "2026-09-30", 3),
].reverse();
const loaded = await loadPitPriorA1BarsV0_1({
  db: fakeDb({ detailRows: detail }),
  symbol: "2330",
  market: "TWSE",
  marketDate,
  decisionTimestamp: "2026-10-02T07:30:00.000Z",
  lookbackSessions: 2,
});
assert.deepEqual(loaded.map((x) => x.marketDate), ["2026-09-29", "2026-09-30"]);
assert.equal(loaded.every((x) => x.pitReplayEligible), true);

await assert.rejects(
  () => loadPitPriorA1BarsV0_1({
    db: fakeDb({ detailRows: [
      barRow("2330", "TWSE", "2026-09-30", 1),
      { ...barRow("2330", "TWSE", "2026-09-30", 2), bar_id: "REV", bar_hash: "DIFFERENT" },
    ] }),
    symbol: "2330",
    market: "TWSE",
    marketDate,
    decisionTimestamp: "2026-10-02T07:30:00.000Z",
    lookbackSessions: 2,
  }),
  /REVISION_AMBIGUITY/,
);

const exactDates60 = [];
for (let d = new Date("2026-08-02T00:00:00Z"); d < new Date("2026-10-01T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1)) {
  exactDates60.push(d.toISOString().slice(0, 10));
}
assert.equal(exactDates60.length, 60);
const coverageListingMetadata = {
  state: "READY",
  byMarketSymbol: {
    "TWSE|2330": { market: "TWSE", symbol: "2330", listingDate: "1994-09-05" },
    "TPEX|6488": { market: "TPEX", symbol: "6488", listingDate: "2015-09-25" },
  },
};

const coverage = await probePitHistoryCoverageV0_1({
  db: fakeDb({ coverageRows: [
    {
      symbol: "2330", market: "TWSE", selected_date_count: 60,
      ambiguous_date_count: 0, continuity_eligible_count: 60,
      first_selected_date: exactDates60[0], last_selected_date: exactDates60.at(-1),
      selected_dates_csv: exactDates60.join(","),
    },
    {
      symbol: "6488", market: "TPEX", selected_date_count: 60,
      ambiguous_date_count: 0, continuity_eligible_count: 59,
      first_selected_date: exactDates60[0], last_selected_date: exactDates60.at(-1),
      selected_dates_csv: exactDates60.join(","),
    },
  ] }),
  snapshotBatch: source.snapshotBatch,
  decisionTimestamp: source.decisionTimestamp,
  requiredPriorSessions: 60,
  listingMetadata: coverageListingMetadata,
  priorTradingDates: exactDates60,
});
assert.equal(coverage.state, "CONTINUITY_NOT_VERIFIED");
assert.equal(coverage.globalIntegrityState, "READY");
assert.equal(coverage.selectionDenominatorComplete, false);
assert.equal(coverage.symbolLocalIncompleteCount, 1);
assert.equal(coverage.historyReadyCount, 2);
assert.equal(coverage.continuityReadyCount, 1);
assert.equal(coverage.historyCoverage, 1);
assert.equal(coverage.continuityCoverage, 0.5);

const calendarDates = [];
for (let d = new Date("2026-07-20T00:00:00Z"); d < new Date("2026-10-02T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1)) {
  calendarDates.push(d.toISOString().slice(0, 10));
}
const newListingSnapshot = {
  marketDate,
  ordinarySymbolCount: 1,
  symbols: ["7777"],
  bySymbol: { "7777": { market: "TPEX" } },
};
const listingMetadata = {
  state: "READY",
  byMarketSymbol: {
    "TPEX|7777": { market: "TPEX", symbol: "7777", listingDate: "2026-09-29" },
  },
};
const ageAware = await probePitHistoryCoverageV0_1({
  db: fakeDb({ coverageRows: [{
    symbol: "7777", market: "TPEX", selected_date_count: 3,
    ambiguous_date_count: 0, continuity_eligible_count: 0,
    first_selected_date: "2026-09-29", last_selected_date: "2026-10-01",
    selected_dates_csv: "2026-09-29,2026-09-30,2026-10-01",
  }] }),
  snapshotBatch: newListingSnapshot,
  decisionTimestamp: source.decisionTimestamp,
  requiredPriorSessions: 60,
  listingMetadata,
  priorTradingDates: calendarDates,
});
assert.equal(ageAware.listingAgeAware, true);
assert.equal(ageAware.historyReadyCount, 1);
assert.equal(ageAware.continuityReadyCount, 0);
assert.equal(ageAware.diagnostics[0].requiredPriorSessionsForSymbol, 3);
assert.equal(ageAware.diagnostics[0].listingAgeLimited, true);
assert.equal(ageAware.diagnostics[0].listingAgeBasis, "OFFICIAL_CURRENT_LISTING_DATE_PLUS_OFFICIAL_TRADING_DATES");
assert.equal(ageAware.state, "CONTINUITY_NOT_VERIFIED");
assert.equal(ageAware.globalIntegrityState, "READY");
assert.equal(ageAware.selectionDenominatorComplete, false);

const ageAwareMissing = await probePitHistoryCoverageV0_1({
  db: fakeDb({ coverageRows: [{
    symbol: "7777", market: "TPEX", selected_date_count: 2,
    ambiguous_date_count: 0, continuity_eligible_count: 0,
    first_selected_date: "2026-09-30", last_selected_date: "2026-10-01",
    selected_dates_csv: "2026-09-30,2026-10-01",
  }] }),
  snapshotBatch: newListingSnapshot,
  decisionTimestamp: source.decisionTimestamp,
  requiredPriorSessions: 60,
  listingMetadata,
  priorTradingDates: calendarDates,
});
assert.equal(ageAwareMissing.historyReadyCount, 0);
assert.equal(ageAwareMissing.state, "HISTORY_COVERAGE_INCOMPLETE");
assert.equal(ageAwareMissing.globalIntegrityState, "READY");
assert.equal(ageAwareMissing.diagnostics[0].readinessState, "INCOMPLETE");

const sm = resolveDailyShadowAssessorReadinessV0_1("SHORT_MOMENTUM");
assert.equal(sm.state, "READY");
assert.equal(sm.permittedAction, "AUTHORIZED_SHADOW_EVALUATION_ONLY");
assert.equal(sm.system1RuntimeRequired, false);
assert.equal(sm.system1Top6Required, false);
assert.equal(sm.system1RankRequired, false);
assert.equal(assertDailyShadowAssessorAuthorizedV0_1("SHORT_MOMENTUM").state, "READY");

const preflight = buildDailyShadowInputPreflightV0_1({
  marketDate,
  decisionTimestamp: source.decisionTimestamp,
  a1Source: source,
  historyCoverage: {
    ...coverage,
    state: "READY",
    continuityReadyCount: 2,
    continuityCoverage: 1,
  },
});
assert.equal(preflight.state, "READY_FOR_AUTHORIZED_SHADOW_EVALUATION_WITH_SYMBOL_GAPS");
assert.equal(preflight.sourceAndHistoryReady, true);
assert.equal(preflight.assessorReady, true);
assert.equal(preflight.capacityWriteAuthorized, true);
assert.equal(preflight.zeroPickMayBeClaimed, false);
assert.equal(preflight.finalSelectionEnabled, false);
assert.equal(preflight.orderImpact, false);
assert.equal(preflight.system1RuntimeUsed, false);

const incompletePreflight = buildDailyShadowInputPreflightV0_1({
  marketDate,
  decisionTimestamp: source.decisionTimestamp,
  a1Source: source,
  historyCoverage: coverage,
});
assert.equal(incompletePreflight.state, "READY_FOR_AUTHORIZED_SHADOW_EVALUATION_WITH_SYMBOL_GAPS");
assert.equal(incompletePreflight.globalInputsReady, true);
assert.equal(incompletePreflight.assessorReady, true);
assert.equal(incompletePreflight.capacityWriteAuthorized, true);
assert.equal(incompletePreflight.sourceAndHistoryReady, true);
assert.equal(incompletePreflight.symbolLocalIncompleteCount, 1);
assert.equal(incompletePreflight.selectionDenominatorComplete, false);
assert.equal(incompletePreflight.zeroPickMayBeClaimed, false);
assert.equal(incompletePreflight.blockers.some((x) => x.layer === "PIT_HISTORY_GLOBAL"), false);
assert.equal(incompletePreflight.symbolLocalBlockers.length, 1);
assert.deepEqual(incompletePreflight.evaluationInputEligibleSymbols, ["2330"]);
assert.deepEqual(incompletePreflight.evaluationInputBlockedSymbols, ["6488"]);

const globalCorruption = buildDailyShadowInputPreflightV0_1({
  marketDate,
  decisionTimestamp: source.decisionTimestamp,
  a1Source: source,
  historyCoverage: {
    ...coverage,
    state: "SOURCE_WIDE_REVISION_AMBIGUITY",
    globalIntegrityState: "BLOCKED",
    globalBlockerCodes: ["SOURCE_WIDE_REVISION_AMBIGUITY"],
  },
});
assert.equal(globalCorruption.state, "INPUTS_NOT_READY");
assert.equal(globalCorruption.globalInputsReady, false);
assert.equal(globalCorruption.blockers.some((x) => x.layer === "PIT_HISTORY_GLOBAL"), true);
assert.equal(globalCorruption.zeroPickMayBeClaimed, false);

console.log("System2 daily Shadow input preflight v0.1 tests passed");
