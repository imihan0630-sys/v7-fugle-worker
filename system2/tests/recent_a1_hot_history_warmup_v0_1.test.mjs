import assert from "node:assert/strict";
import {
  buildPriorTradingDatesV0_1,
  readRecentA1DateCoverageV0_1,
  planRecentA1HotHistoryWarmupV0_1,
  loadExistingA1SymbolsForDateMarketV0_1,
} from "../runtime/recent_a1_hot_history_warmup_v0_1.mjs";

const calendars = new Map([
  [2026, { year: 2026, holidays: ["2026-01-01"] }],
  [2025, { year: 2025, holidays: ["2025-12-31"] }],
]);
const prior = buildPriorTradingDatesV0_1({
  anchorMarketDate: "2026-01-06",
  calendars,
  requiredSessions: 4,
});
assert.deepEqual(prior, [
  "2026-01-05",
  "2026-01-02",
  "2025-12-30",
  "2025-12-29",
]);
assert.throws(() => buildPriorTradingDatesV0_1({
  anchorMarketDate: "2026-01-06",
  calendars: new Map([[2026, calendars.get(2026)]]),
  requiredSessions: 4,
}), /official trading calendar missing for 2025/);

function coverageRow(marketDate, market, {
  symbolCount = 0,
  pitEligibleSymbolCount = 0,
  continuityEligibleSymbolCount = 0,
  ambiguousKeyCount = 0,
} = {}) {
  const minimum = market === "TWSE" ? 500 : 450;
  return {
    marketDate,
    market,
    minimum,
    symbolCount,
    pitEligibleSymbolCount,
    continuityEligibleSymbolCount,
    ambiguousKeyCount,
    historyCoverageReady: pitEligibleSymbolCount >= minimum && ambiguousKeyCount === 0,
    continuityCoverageReady:
      pitEligibleSymbolCount >= minimum
      && continuityEligibleSymbolCount >= minimum
      && ambiguousKeyCount === 0,
  };
}

const dates = ["2026-01-05", "2026-01-02", "2025-12-30", "2025-12-29"];
const coverage = [
  coverageRow(dates[0], "TWSE", { symbolCount: 800, pitEligibleSymbolCount: 800 }),
  coverageRow(dates[0], "TPEX", { symbolCount: 700, pitEligibleSymbolCount: 700 }),
  coverageRow(dates[1], "TWSE", { symbolCount: 0 }),
  coverageRow(dates[1], "TPEX", { symbolCount: 700, pitEligibleSymbolCount: 700 }),
  coverageRow(dates[2], "TWSE", {
    symbolCount: 800, pitEligibleSymbolCount: 0,
  }),
  coverageRow(dates[2], "TPEX", { symbolCount: 700, pitEligibleSymbolCount: 700 }),
  coverageRow(dates[3], "TWSE", {
    symbolCount: 800, pitEligibleSymbolCount: 800, ambiguousKeyCount: 1,
  }),
  coverageRow(dates[3], "TPEX", { symbolCount: 700, pitEligibleSymbolCount: 700 }),
];

const plan = planRecentA1HotHistoryWarmupV0_1({
  tradingDates: dates,
  coverage,
  maxDatesPerRun: 5,
});
assert.equal(plan.completeDateCount, 1);
assert.deepEqual(plan.completeDates, ["2026-01-05"]);
assert.deepEqual(plan.planned, [{
  marketDate: "2026-01-02",
  markets: ["TWSE"],
}]);
assert.ok(plan.blocked.some((x) =>
  x.marketDate === "2025-12-30"
  && x.market === "TWSE"
  && x.state === "EXISTING_NON_PIT_HISTORY_BLOCKS_COVERAGE"
));
assert.ok(plan.blocked.some((x) =>
  x.marketDate === "2025-12-29"
  && x.market === "TWSE"
  && x.state === "AMBIGUOUS_EXISTING_HISTORY"
));
assert.equal(plan.continuityPromotionPerformed, false);
assert.equal(plan.continuityStateForNewRows, "UNVERIFIED");
assert.equal(plan.selectionAuthority, false);

const cappedDates = Array.from({ length: 8 }, (_, i) =>
  `2026-09-${String(30 - i).padStart(2, "0")}`);
const cappedCoverage = cappedDates.flatMap((date) => [
  coverageRow(date, "TWSE"),
  coverageRow(date, "TPEX"),
]);
const capped = planRecentA1HotHistoryWarmupV0_1({
  tradingDates: cappedDates,
  coverage: cappedCoverage,
  maxDatesPerRun: 5,
});
assert.equal(capped.plannedDateCount, 5);
assert.deepEqual(capped.planned.map((x) => x.marketDate), cappedDates.slice(0, 5));

class MockStatement {
  constructor(db, sql) { this.db = db; this.sql = sql; this.params = []; }
  bind(...params) { this.params = params; return this; }
  async all() {
    if (this.sql.includes("COUNT(DISTINCT CASE")) {
      return { results: this.db.coverageRows };
    }
    if (this.sql.includes("ambiguous_key_count")) {
      return { results: this.db.ambiguityRows };
    }
    if (this.sql.includes("revision_count")) {
      return { results: this.db.existingRows };
    }
    throw new Error("unexpected SQL: " + this.sql);
  }
}
const mockDb = {
  coverageRows: [
    {
      market_date: "2026-09-30", market: "TWSE",
      symbol_count: 810, pit_eligible_symbol_count: 805,
      continuity_eligible_symbol_count: 0,
    },
  ],
  ambiguityRows: [],
  existingRows: [
    { symbol: "2330", revision_count: 1, any_pit_eligible: 1 },
    { symbol: "2317", revision_count: 2, any_pit_eligible: 1 },
  ],
  prepare(sql) { return new MockStatement(this, sql); },
};
const read = await readRecentA1DateCoverageV0_1({
  db: mockDb,
  tradingDates: ["2026-09-30"],
  minima: { TWSE: 500, TPEX: 450 },
});
assert.equal(read.length, 2);
assert.equal(read.find((x) => x.market === "TWSE").historyCoverageReady, true);
assert.equal(read.find((x) => x.market === "TWSE").continuityCoverageReady, false);
assert.equal(read.find((x) => x.market === "TPEX").state, "MISSING_HISTORY");

const existing = await loadExistingA1SymbolsForDateMarketV0_1({
  db: mockDb, marketDate: "2026-09-30", market: "TWSE",
});
assert.deepEqual(existing, [
  { symbol: "2330", revisionCount: 1, anyPitEligible: true },
  { symbol: "2317", revisionCount: 2, anyPitEligible: true },
]);

assert.throws(() => planRecentA1HotHistoryWarmupV0_1({
  tradingDates: cappedDates,
  coverage: cappedCoverage,
  maxDatesPerRun: 6,
}), /1 to 5/);

console.log("System2 recent A1 hot-history warmup planner tests passed");
