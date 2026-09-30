import assert from "node:assert/strict";
import {
  buildResonanceWatchPoolFromCapacityRowV0_1,
  normalizeFugleAdjustedDailyHistoryV0_1,
  resolveAdjustedHistoryContinuityV0_1,
  classifyResonanceScheduleTimeV0_1,
  historyQueryRangeV0_1,
} from "../runtime/daily_resonance_integration_v0_1.mjs";
import { resolveResonancePriorLifecycleStateV0_1 } from "../runtime/daily_resonance_persistence_v0_1.mjs";

const pool = await buildResonanceWatchPoolFromCapacityRowV0_1({
  capacityRow: {
    capacity_run_id: "CAP-2026-09-29",
    capacity_hash: "capacity-hash",
    market_date: "2026-09-29",
    decision_timestamp: "2026-09-29T10:00:00.000Z",
    active_assignments_json: JSON.stringify({
      SHORT_MOMENTUM: [
        { symbol: "2330", strategyVersion: "V0.1", entryReadiness: "NEAR_ENTRY" },
        { symbol: "2454", strategyVersion: "V0.1", entryReadiness: "BUY_ELIGIBLE" },
      ],
      SWING_GROWTH: [
        { symbol: "2330", strategyVersion: "V0.1", entryReadiness: "ACTIVE_ENTRY_MONITOR" },
      ],
    }),
  },
  activatedAt: "2026-09-29T11:00:00.000Z",
});
assert.equal(pool.symbolCount, 2);
assert.equal(pool.fullMarketScan, false);
assert.equal(pool.symbols.find((row) => row.symbol === "2330").strategyMemberships.length, 2);

await assert.rejects(
  buildResonanceWatchPoolFromCapacityRowV0_1({
    capacityRow: {
      capacity_run_id: "CAP-OVER",
      capacity_hash: "over-hash",
      market_date: "2026-09-29",
      decision_timestamp: "2026-09-29T10:00:00.000Z",
      active_assignments_json: Object.fromEntries(
        ["A", "B", "C", "D"].map((strategy, offset) => [strategy, [1, 2, 3].map((n) => ({ symbol: String(1000 + offset * 3 + n) }))]),
      ),
    },
    activatedAt: "2026-09-29T11:00:00.000Z",
  }),
  /cannot exceed 9/,
);

const historyRows = [];
const cursor = new Date("2026-05-01T00:00:00.000Z");
for (let i = 0; i < 90; i += 1) {
  const date = new Date(cursor);
  date.setUTCDate(date.getUTCDate() + i);
  const close = 900 + i;
  historyRows.push({
    date: date.toISOString().slice(0, 10),
    open: close - 2,
    high: close + 3,
    low: close - 4,
    close,
    volume: 1_000_000 + i,
  });
}
const history = await normalizeFugleAdjustedDailyHistoryV0_1({
  symbol: "2330",
  marketDate: "2026-09-29",
  fetchedAt: "2026-09-29T01:00:00.000Z",
  rawHistory: {
    symbol: "2330",
    exchange: "TWSE",
    timeframe: "D",
    adjusted: true,
    data: historyRows.reverse(),
  },
});
assert.equal(history.barCount, 90);
assert.equal(history.bars[0].date < history.bars.at(-1).date, true);
const continuity = resolveAdjustedHistoryContinuityV0_1({
  history,
  rawTicker: { referencePrice: history.bars.at(-1).close },
});
assert.equal(continuity.state, "ADJUSTED_CONTINUITY");
assert.equal(resolveAdjustedHistoryContinuityV0_1({ history, rawTicker: { referencePrice: 1 } }).state, "UNVERIFIED");

const intraday = classifyResonanceScheduleTimeV0_1("2026-09-29T05:30:00.000Z");
assert.equal(intraday.intradayMonitor, true);
assert.equal(intraday.officialCloseConfirmedByClock, true);
const afterMarket = classifyResonanceScheduleTimeV0_1("2026-09-29T11:00:00.000Z");
assert.equal(afterMarket.afterMarketPoolRefresh, true);
assert.equal(afterMarket.intradayMonitor, false);
assert.deepEqual(historyQueryRangeV0_1("2026-09-29"), { from: "2025-12-02", to: "2026-09-28" });

function lifecycleDb(position) {
  return {
    prepare(sql) {
      assert.match(sql, /FROM s2_positions/);
      return {
        bind(symbol) {
          assert.equal(symbol, "2330");
          return { first: async () => position };
        },
      };
    },
  };
}
assert.equal(await resolveResonancePriorLifecycleStateV0_1(lifecycleDb(null), "2330"), "WATCH");
assert.equal(
  await resolveResonancePriorLifecycleStateV0_1(lifecycleDb({ position_id: "SIM-POS-1" }), "2330"),
  "HOLD",
);

console.log("System2 daily resonance integration tests passed");
