import assert from "node:assert/strict";
import {
  HOT_HISTORY_MAX_SESSIONS_PER_RUN,
  planDailyShadowHotHistoryBootstrapV0_1,
} from "../runtime/daily_shadow_hot_history_bootstrap_v0_1.mjs";

const dates = Array.from({ length: 65 }, (_, i) => {
  const d = new Date("2026-07-30T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + i);
  return d.toISOString().slice(0, 10);
});

function fakeDb(rows) {
  return {
    prepare(sql) {
      assert.match(sql, /FROM s2_historical_a1_bars/);
      return {
        bind(...boundDates) {
          return {
            all: async () => ({
              results: rows.filter((row) => boundDates.includes(row.market_date)),
            }),
          };
        },
      };
    },
  };
}

const completeRows = [];
for (const date of dates) {
  for (const market of ["TWSE", "TPEX"]) {
    completeRows.push({
      market_date: date,
      market,
      row_count: market === "TWSE" ? 800 : 650,
      symbol_count: market === "TWSE" ? 800 : 650,
      pit_eligible_count: market === "TWSE" ? 800 : 650,
    });
  }
}

const missingDates = dates.slice(-5);
const partialRows = completeRows.filter((row) =>
  !missingDates.includes(row.market_date) || row.market === "TWSE");
const plan = await planDailyShadowHotHistoryBootstrapV0_1({
  db: fakeDb(partialRows),
  asOf: "2026-10-03T03:00:00.000Z",
  sessionCount: 3,
  tradingDateResolver: async () => ({
    tradingDates: dates,
    tradingDateCount: dates.length,
  }),
});
assert.equal(plan.targetDates.length, 3);
assert.deepEqual(plan.targetDates, missingDates.slice(-3));
assert.equal(plan.selectionAuthority, false);
assert.equal(plan.orderImpact, false);
assert.equal(plan.requestedSessionCount, 3);

const complete = await planDailyShadowHotHistoryBootstrapV0_1({
  db: fakeDb(completeRows),
  asOf: "2026-10-03T03:00:00.000Z",
  sessionCount: 3,
  tradingDateResolver: async () => ({
    tradingDates: dates,
    tradingDateCount: dates.length,
  }),
});
assert.deepEqual(complete.targetDates, []);

await assert.rejects(
  planDailyShadowHotHistoryBootstrapV0_1({
    db: fakeDb([]),
    asOf: "2026-10-03T03:00:00.000Z",
    sessionCount: HOT_HISTORY_MAX_SESSIONS_PER_RUN + 1,
    tradingDateResolver: async () => ({ tradingDates: dates }),
  }),
  /sessionCount/,
);

const ambiguousRows = [{
  market_date: dates.at(-1),
  market: "TWSE",
  row_count: 801,
  symbol_count: 800,
  pit_eligible_count: 801,
}];
await assert.rejects(
  planDailyShadowHotHistoryBootstrapV0_1({
    db: fakeDb(ambiguousRows),
    asOf: "2026-10-03T03:00:00.000Z",
    sessionCount: 1,
    tradingDateResolver: async () => ({ tradingDates: dates }),
  }),
  /HOT_HISTORY_EXISTING_CANONICAL_AMBIGUITY/,
);

console.log("System2 bounded hot-history bootstrap planner tests passed");
