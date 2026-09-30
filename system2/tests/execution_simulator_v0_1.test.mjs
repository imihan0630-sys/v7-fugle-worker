import assert from "node:assert/strict";
import {
  EXECUTION_SIMULATOR_VERSION_V0_1,
  simulateTaiwanLongDailyPlanV0_1,
  toOutcomeSimulatedExecutionV0_1,
  toS2SimulationFillRowsV0_1,
  toS2SimulationOrderRowV0_1,
} from "../runtime/execution_simulator_v0_1.mjs";
import {
  buildDecisionOutcomeSnapshotV0_1,
  toS2OutcomeRowV0_1,
} from "../runtime/outcome_tracker_v0_1.mjs";

const costModel = {
  costModelVersion: "TW-STOCK-FIXTURE-V1",
  taxRuleId: "TW-STOCK-SELL-0.3-FIXTURE",
  commissionRate: 0.001,
  minimumCommission: 1,
  transactionTaxRate: 0.003,
  entrySlippageRate: 0.001,
  exitSlippageRate: 0.001,
};

function session(sessionNumber, marketDate, prices, extra = {}) {
  return {
    sessionNumber,
    marketDate,
    availableAt: `${marketDate}T08:30:00Z`,
    priceSpace: "ADJUSTED",
    tradingState: "NORMAL",
    executableLiquidity: "AVAILABLE",
    limitState: "NONE",
    volumeShares: 5_000_000,
    sourceId: "OFFICIAL-FIXTURE",
    ...prices,
    ...extra,
  };
}

const base = {
  simOrderId: "SO-2330-20260929",
  entryFillObservationId: "SF-2330-ENTRY",
  exitFillObservationId: "SF-2330-EXIT",
  decisionId: "D-2330-20260929",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  symbol: "2330",
  decisionMarketDate: "2026-09-29",
  decisionTimestamp: "2026-09-29T07:30:00Z",
  earliestEligibleMarketDate: "2026-09-30",
  orderType: "BUY_STOP",
  triggerPrice: 100,
  requestedShares: 1000,
  stopPrice: 95,
  targetPrice: 108,
  maxHoldingSessions: 5,
  entryValiditySessions: 5,
  priceSpace: "ADJUSTED",
  corporateActionState: "ADJUSTED",
  costModel,
  simulatedAt: "2026-10-02T09:00:00Z",
};

const normal = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  sessions: [
    session(1, "2026-09-30", { open: 98, high: 103, low: 97, close: 102 }),
    session(2, "2026-10-01", { open: 103, high: 109, low: 101, close: 108 }),
  ],
});

assert.equal(normal.state, "CLOSED");
assert.equal(normal.entryFill.rawFillPrice, 100);
assert.equal(normal.entryFill.modeledFillPrice, 100.1);
assert.equal(normal.entryFill.fillQuality, "FILLED_WITH_SLIPPAGE");
assert.equal(normal.exitFill.reason, "TARGET");
assert.equal(normal.exitFill.rawFillPrice, 108);
assert.equal(normal.exitFill.modeledFillPrice, 107.892);
assert.equal(normal.holdingSessions, 2);
assert.equal(normal.performanceEligible, true);
assert.ok(normal.realizedReturnAfterCost < normal.grossReturn);
assert.match(normal.executionHash, /^[0-9a-f]{64}$/);

const replay = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  sessions: [
    session(1, "2026-09-30", { open: 98, high: 103, low: 97, close: 102 }),
    session(2, "2026-10-01", { open: 103, high: 109, low: 101, close: 108 }),
  ],
});
assert.equal(normal.executionHash, replay.executionHash);

const orderRow = toS2SimulationOrderRowV0_1(normal);
const fillRows = toS2SimulationFillRowsV0_1(normal);
assert.equal(orderRow.sim_order_id, "SO-2330-20260929");
assert.equal(orderRow.status, "SIMULATION_ORDER_FROZEN");
assert.equal(fillRows.length, 2);
assert.equal(fillRows[0].transaction_tax, 0);
assert.ok(fillRows[1].transaction_tax > 0);

const stillOpen = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  sessions: [
    session(1, "2026-09-30", { open: 98, high: 103, low: 97, close: 102 }),
  ],
});
assert.equal(stillOpen.state, "ENTRY_FILLED_OPEN");
assert.deepEqual(toS2SimulationOrderRowV0_1(stillOpen), orderRow);
assert.deepEqual(toS2SimulationFillRowsV0_1(stillOpen)[0], fillRows[0]);

const outcome = await buildDecisionOutcomeSnapshotV0_1({
  decisionId: base.decisionId,
  symbol: base.symbol,
  decisionMarketDate: base.decisionMarketDate,
  decisionTimestamp: base.decisionTimestamp,
  referencePrice: 99,
  entryPlan: { stopPrice: 95, targets: [108] },
  sessions: [
    session(1, "2026-09-30", { open: 98, high: 103, low: 97, close: 102 }),
    session(2, "2026-10-01", { open: 103, high: 109, low: 101, close: 108 }),
  ],
  costScenarios: [],
  priceSpace: "ADJUSTED",
  corporateActionState: "ADJUSTED",
  updatedAt: "2026-10-02T09:00:00Z",
  simulatedExecution: toOutcomeSimulatedExecutionV0_1(normal),
});
const outcomeRow = toS2OutcomeRowV0_1(outcome);
assert.equal(outcome.simulatedExecution.executionVersion, EXECUTION_SIMULATOR_VERSION_V0_1);
assert.equal(outcomeRow.realized_return_after_cost, normal.realizedReturnAfterCost);
assert.equal(outcomeRow.holding_sessions, 2);

const gapStop = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  simOrderId: "SO-GAP",
  entryFillObservationId: "SF-GAP-E",
  exitFillObservationId: "SF-GAP-X",
  sessions: [
    session(1, "2026-09-30", { open: 102, high: 104, low: 99, close: 101 }),
    session(2, "2026-10-01", { open: 92, high: 94, low: 90, close: 91 }),
  ],
});
assert.equal(gapStop.entryFill.fillQuality, "FILLED_GAP");
assert.equal(gapStop.exitFill.reason, "STOP_GAP");
assert.equal(gapStop.exitFill.rawFillPrice, 92);
assert.equal(gapStop.exitFill.fillQuality, "FILLED_GAP");

const ambiguous = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  simOrderId: "SO-AMB",
  entryFillObservationId: "SF-AMB-E",
  exitFillObservationId: "SF-AMB-X",
  sessions: [
    session(1, "2026-09-30", { open: 102, high: 110, low: 94, close: 103 }),
  ],
});
assert.equal(ambiguous.state, "AMBIGUOUS");
assert.equal(ambiguous.fillQuality, "AMBIGUOUS_SAME_BAR");
assert.equal(ambiguous.realizedReturnAfterCost, null);
assert.equal(ambiguous.possibleOutcomes.length, 2);
assert.deepEqual(ambiguous.possibleOutcomes.map((x) => x.path), ["STOP_FIRST", "TARGET_FIRST"]);

const intradaySequenceUnknown = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  simOrderId: "SO-INTRADAY-AMB",
  entryFillObservationId: "SF-INTRADAY-E",
  exitFillObservationId: "SF-INTRADAY-X",
  sessions: [
    session(1, "2026-09-30", { open: 98, high: 109, low: 97, close: 108 }),
  ],
});
assert.equal(intradaySequenceUnknown.state, "AMBIGUOUS");
assert.equal(
  intradaySequenceUnknown.ambiguityReason,
  "ENTRY_AND_EXIT_LEVEL_OBSERVED_ON_SAME_DAILY_BAR",
);

const limitBlockedThenFilled = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  simOrderId: "SO-LIMIT-BLOCK",
  entryFillObservationId: "SF-LIMIT-E",
  exitFillObservationId: "SF-LIMIT-X",
  sessions: [
    session(
      1,
      "2026-09-30",
      { open: 101, high: 105, low: 101, close: 105 },
      { limitState: "LOCKED_UP", executableLiquidity: "UNAVAILABLE", officialLimitUp: 105 },
    ),
    session(2, "2026-10-01", { open: 99, high: 103, low: 98, close: 102 }),
  ],
});
assert.equal(limitBlockedThenFilled.entryFill.sessionNumber, 2);
assert.equal(limitBlockedThenFilled.blockedObservations[0].fillQuality, "LIMIT_BLOCKED");

const noFill = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  simOrderId: "SO-NO-FILL",
  entryFillObservationId: "SF-NO-FILL-E",
  exitFillObservationId: "SF-NO-FILL-X",
  entryValiditySessions: 1,
  sessions: [
    session(1, "2026-09-30", { open: 98, high: 99, low: 96, close: 97 }),
  ],
});
assert.equal(noFill.state, "NO_FILL");
assert.equal(noFill.fillQuality, "NO_FILL");
assert.equal(toS2SimulationFillRowsV0_1(noFill)[0].raw_fill_price, null);

const caUnknown = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  simOrderId: "SO-CA-UNKNOWN",
  entryFillObservationId: "SF-CA-E",
  exitFillObservationId: "SF-CA-X",
  corporateActionState: "UNKNOWN",
  sessions: [],
});
assert.equal(caUnknown.state, "DATA_BLOCKED");
assert.equal(caUnknown.fillQuality, "DATA_UNKNOWN");
assert.equal(caUnknown.performanceEligible, false);
assert.equal(caUnknown.fills.length, 0);

const pending = await simulateTaiwanLongDailyPlanV0_1({
  ...base,
  simOrderId: "SO-PENDING",
  entryFillObservationId: "SF-PENDING-E",
  exitFillObservationId: "SF-PENDING-X",
  sessions: [
    session(1, "2026-09-30", { open: 98, high: 99, low: 96, close: 97 }),
  ],
});
assert.equal(pending.state, "ENTRY_PENDING");
assert.equal(pending.fills.length, 0);
assert.equal(toS2SimulationFillRowsV0_1(pending).length, 0);

await assert.rejects(
  () => simulateTaiwanLongDailyPlanV0_1({
    ...base,
    simOrderId: "SO-SAME-DAY",
    entryFillObservationId: "SF-SAME-E",
    exitFillObservationId: "SF-SAME-X",
    earliestEligibleMarketDate: "2026-09-29",
    sessions: [],
  }),
  /must be after decisionMarketDate/,
);

await assert.rejects(
  () => simulateTaiwanLongDailyPlanV0_1({
    ...base,
    simOrderId: "SO-FUTURE",
    entryFillObservationId: "SF-FUTURE-E",
    exitFillObservationId: "SF-FUTURE-X",
    sessions: [session(1, "2026-09-30", {
      open: 100,
      high: 102,
      low: 99,
      close: 101,
    }, { availableAt: "2026-10-03T09:00:00Z" })],
  }),
  /not available by simulatedAt/,
);

console.log("System2 execution simulator V0.1 tests passed");
