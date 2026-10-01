import assert from "node:assert/strict";
import { fetchDailyShadowA1SnapshotV0_2 } from "../runtime/daily_shadow_a1_source_v0_2.mjs";
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

const twsePayload = {
  stat: "OK",
  date: "20261002",
  tables: [{
    title: "115年10月02日 每日收盤行情",
    fields: [
      "證券代號", "證券名稱", "成交股數", "成交筆數", "成交金額",
      "開盤價", "最高價", "最低價", "收盤價", "漲跌(+/-)", "漲跌價差",
    ],
    data: [[
      "2330", "台積電", "10,000,000", "10,000", "18,200,000,000",
      "1800", "1830", "1790", "1820", "+", "20",
    ]],
  }],
};

const tpexPayload = {
  stat: "ok",
  date: "20261002",
  tables: [{
    title: "上櫃股票行情",
    date: "115/10/02",
    fields: [
      "代號", "名稱", "收盤", "漲跌", "開盤", "最高", "最低", "均價",
      "成交股數", "成交金額(元)", "成交筆數", "最後買價", "最後賣價",
      "發行股數", "次日 參考價", "次日 漲停價", "次日 跌停價",
    ],
    data: [[
      "6488", "環球晶", "508", "+8", "500", "510", "495", "505",
      "1,000,000", "508,000,000", "2,000", "507", "508",
      "100,000,000", "508", "558", "458",
    ]],
  }],
};

const fetchImpl = async (url) => ({
  ok: true,
  status: 200,
  async json() {
    return String(url).includes("twse.com.tw") ? twsePayload : tpexPayload;
  },
});
const fixedNow = () => new Date("2026-10-02T07:20:00.000Z");

const source = await fetchDailyShadowA1SnapshotV0_2({
  marketDate,
  decisionTimestamp: "2026-10-02T07:30:00.000Z",
  fetchImpl,
  now: fixedNow,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(source.version, "0.2-RESEARCH");
assert.equal(source.sourcePolicy, "DATE_SCOPED_AFTER_TRADING_SOURCE_DATE_VERIFIED");
assert.equal(source.sourceDateVerified, true);
assert.equal(source.state, "READY");
assert.equal(source.snapshotBatch.ordinarySymbolCount, 2);
assert.equal(source.decisionClockMode, "FIXED_CALLER_CLOCK");
assert.equal(source.transports.TWSE.sourceDateVerified, true);
assert.equal(source.transports.TPEX.sourceDateVerified, true);
assert.equal(source.snapshotBatch.bySymbol["2330"].change, null, "unsigned TWSE delta must not be promoted");
assert.equal(source.snapshotBatch.bySymbol["6488"].change, 8);
assert.equal(source.externalMutationPerformed, false);

const diagnosticClock = await fetchDailyShadowA1SnapshotV0_2({
  marketDate,
  fetchImpl,
  now: fixedNow,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(diagnosticClock.state, "READY");
assert.equal(diagnosticClock.decisionTimestamp, diagnosticClock.observedAt);
assert.equal(diagnosticClock.decisionClockMode, "DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK");

const late = await fetchDailyShadowA1SnapshotV0_2({
  marketDate,
  decisionTimestamp: "2026-10-02T07:00:00.000Z",
  fetchImpl,
  now: fixedNow,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(late.state, "INCOMPLETE");
assert.equal(late.snapshotBatch.blockerCodes.includes("OBSERVED_AFTER_DECISION_CLOCK"), true);

const staleTpexFetch = async (url) => ({
  ok: true,
  status: 200,
  async json() {
    if (String(url).includes("twse.com.tw")) return twsePayload;
    return {
      ...tpexPayload,
      date: "20261001",
      tables: [{ ...tpexPayload.tables[0], date: "115/10/01" }],
    };
  },
});
const staleSource = await fetchDailyShadowA1SnapshotV0_2({
  marketDate,
  fetchImpl: staleTpexFetch,
  now: fixedNow,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(staleSource.state, "SOURCE_ERROR");
assert.equal(staleSource.transports.TPEX.errorCode, "SOURCE_DATE_MISMATCH");
assert.equal(staleSource.snapshotBatch, null);

const sourceError = await fetchDailyShadowA1SnapshotV0_2({
  marketDate,
  fetchImpl: async () => ({ ok: false, status: 404, json: async () => ({}) }),
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
