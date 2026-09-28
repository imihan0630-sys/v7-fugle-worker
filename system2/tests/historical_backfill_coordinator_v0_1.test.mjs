import assert from "node:assert/strict";
import {
  buildHistoricalBackfillPlanV0_1,
  runHistoricalBackfillV0_1,
} from "../runtime/historical_backfill_coordinator_v0_1.mjs";

const sourceContractByMarket = {
  TWSE: {
    sourceId: "TWSE_HIST_FIXTURE",
    sourceName: "TWSE historical fixture",
    sourceUrl: "https://www.twse.com.tw/",
  },
  TPEX: {
    sourceId: "TPEX_HIST_FIXTURE",
    sourceName: "TPEx historical fixture",
    sourceUrl: "https://www.tpex.org.tw/",
  },
};

const incrementalPlan = await buildHistoricalBackfillPlanV0_1({
  planId: "S2-HIST-INCR-TEST",
  startDate: "2017-01-01",
  endDate: "2026-09-30",
  lastStoredDateByMarket: {
    TWSE: "2026-09-24",
    TPEX: "2026-09-24",
  },
  chunkCalendarDays: 31,
  createdAt: "2026-09-28T11:30:00Z",
});

assert.equal(incrementalPlan.effectiveStartByMarket.TWSE, "2026-09-25");
assert.equal(incrementalPlan.effectiveStartByMarket.TPEX, "2026-09-25");
assert.equal(incrementalPlan.workUnitCount, 2);
assert.deepEqual(
  incrementalPlan.workUnits.map((x) => [x.market, x.fromDate, x.toDate]),
  [
    ["TWSE", "2026-09-25", "2026-09-30"],
    ["TPEX", "2026-09-25", "2026-09-30"],
  ],
);

const caughtUp = await buildHistoricalBackfillPlanV0_1({
  planId: "S2-HIST-CAUGHT-UP",
  startDate: "2017-01-01",
  endDate: "2026-09-24",
  lastStoredDateByMarket: {
    TWSE: "2026-09-24",
    TPEX: "2026-09-24",
  },
  createdAt: "2026-09-28T11:30:00Z",
});
assert.equal(caughtUp.workUnitCount, 0);
assert.equal(caughtUp.noFullReloadWhenCaughtUp, true);

const rowsByMarket = {
  TWSE: [{
    marketDate: "2026-09-29",
    symbol: "2330",
    companyName: "台積電",
    priceSpace: "RAW",
    open: 1500,
    high: 1530,
    low: 1490,
    close: 1520,
    volumeShares: 12000000,
    tradeValue: 18240000000,
    transactions: 12000,
    change: 20,
    continuityState: "CLEAR_NO_ACTION",
    observedAt: "2026-09-29T05:40:00Z",
    availableAt: "2026-09-29T05:30:00Z",
    availabilityBasis: "SESSION_CLOSE_FINALITY",
  }],
  TPEX: [{
    marketDate: "2026-09-29",
    symbol: "6488",
    companyName: "環球晶",
    priceSpace: "RAW",
    open: 500,
    high: 512,
    low: 498,
    close: 510,
    volumeShares: 1500000,
    tradeValue: 765000000,
    transactions: 2100,
    change: 10,
    continuityState: "CLEAR_NO_ACTION",
    observedAt: "2026-09-29T05:40:00Z",
    availableAt: "2026-09-29T05:30:00Z",
    availabilityBasis: "SESSION_CLOSE_FINALITY",
  }],
};

let firstCheckpoint = null;
const persisted = [];
await assert.rejects(
  () => runHistoricalBackfillV0_1({
    plan: incrementalPlan,
    sourceContractByMarket,
    fetchRows: async ({ market }) => rowsByMarket[market],
    persistRecords: async ({ records }) => persisted.push(...records),
    onCheckpoint: async (checkpoint) => {
      firstCheckpoint = checkpoint;
      throw new Error("INTENTIONAL_STOP");
    },
    capturedAt: "2026-09-30T10:00:00Z",
  }),
  /INTENTIONAL_STOP/,
);

assert.equal(firstCheckpoint.completedWorkUnitCount, 1);
assert.equal(firstCheckpoint.rowsPersisted, 1);

const resumed = await runHistoricalBackfillV0_1({
  plan: incrementalPlan,
  sourceContractByMarket,
  fetchRows: async ({ market }) => rowsByMarket[market],
  persistRecords: async ({ records }) => persisted.push(...records),
  resumeCheckpoint: firstCheckpoint,
  capturedAt: "2026-09-30T10:00:00Z",
});

assert.equal(resumed.allWorkUnitsComplete, true);
assert.equal(resumed.completedWorkUnitCount, 2);
assert.equal(resumed.rowsPersisted, 2);
assert.equal(resumed.incremental, true);
assert.equal(resumed.fullReloadPerformed, false);
assert.equal(persisted.filter((x) => x.table === "s2_historical_a1_bars").length, 2);

const initialPlan = await buildHistoricalBackfillPlanV0_1({
  planId: "S2-HIST-INITIAL-TEST",
  startDate: "2017-01-01",
  endDate: "2017-03-05",
  chunkCalendarDays: 31,
  createdAt: "2026-09-28T11:30:00Z",
});
assert.equal(initialPlan.effectiveStartByMarket.TWSE, "2017-01-01");
assert.equal(initialPlan.workUnitCount, 6);
assert.equal(initialPlan.workUnits[0].fromDate, "2017-01-01");
assert.equal(initialPlan.workUnits[0].toDate, "2017-01-31");

console.log("System2 incremental historical backfill coordinator v0.1 tests passed");
