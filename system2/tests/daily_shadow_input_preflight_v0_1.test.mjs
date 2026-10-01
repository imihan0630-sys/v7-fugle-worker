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

const coverage = await probePitHistoryCoverageV0_1({
  db: fakeDb({ coverageRows: [
    {
      symbol: "2330", market: "TWSE", selected_date_count: 60,
      ambiguous_date_count: 0, continuity_eligible_count: 60,
      first_selected_date: "2026-07-10", last_selected_date: "2026-09-30",
    },
    {
      symbol: "6488", market: "TPEX", selected_date_count: 60,
      ambiguous_date_count: 0, continuity_eligible_count: 59,
      first_selected_date: "2026-07-10", last_selected_date: "2026-09-30",
    },
  ] }),
  snapshotBatch: source.snapshotBatch,
  decisionTimestamp: source.decisionTimestamp,
  requiredPriorSessions: 60,
});
assert.equal(coverage.state, "CONTINUITY_NOT_VERIFIED");
assert.equal(coverage.historyReadyCount, 2);
assert.equal(coverage.continuityReadyCount, 1);
assert.equal(coverage.historyCoverage, 1);
assert.equal(coverage.continuityCoverage, 0.5);

const sm = resolveDailyShadowAssessorReadinessV0_1("SHORT_MOMENTUM");
assert.equal(sm.state, "ASSESSOR_POLICY_NOT_FROZEN");
assert.equal(sm.permittedAction, "OBSERVE_INPUT_READINESS_ONLY");
assert.throws(
  () => assertDailyShadowAssessorAuthorizedV0_1("SHORT_MOMENTUM"),
  /DAILY_SHADOW_ASSESSOR_NOT_AUTHORIZED/,
);

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
assert.equal(preflight.state, "ASSESSOR_POLICY_BLOCKED");
assert.equal(preflight.sourceAndHistoryReady, true);
assert.equal(preflight.assessorReady, false);
assert.equal(preflight.capacityWriteAuthorized, false);
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
assert.equal(incompletePreflight.state, "INPUTS_NOT_READY");
assert.equal(incompletePreflight.blockers.some((x) => x.layer === "PIT_HISTORY"), true);

console.log("System2 daily Shadow input preflight v0.1 tests passed");
