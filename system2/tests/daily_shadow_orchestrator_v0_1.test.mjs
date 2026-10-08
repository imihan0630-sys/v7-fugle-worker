import assert from "node:assert/strict";
import { buildA1SymbolSnapshotBatch } from "../runtime/a1_symbol_snapshot_adapter.mjs";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import { buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { SHORT_MOMENTUM_CONTRACT_V0_1 } from "../runtime/strategy_contracts_v0_1.mjs";
import { findLimitedShadowSpec } from "../runtime/limited_shadow_v0_1.mjs";
import { runDailyLimitedShadowOrchestratorV0_1 } from "../runtime/daily_shadow_orchestrator_v0_1.mjs";

const marketDate = "2026-09-29";
const decisionTimestamp = "2026-09-29T07:30:00Z";
const observedAt = "2026-09-29T07:20:00Z";
const capturedAt = "2026-09-29T07:31:00Z";

const twseRows = [
  {
    Code: "2330",
    Name: "台積電",
    Date: "20260929",
    OpeningPrice: "1500",
    HighestPrice: "1530",
    LowestPrice: "1490",
    ClosingPrice: "1520",
    TradeVolume: "12000000",
    TradeValue: "18240000000",
    Transaction: "12000",
    Change: "20",
  },
  {
    Code: "2317",
    Name: "鴻海",
    Date: "20260929",
    OpeningPrice: "220",
    HighestPrice: "224",
    LowestPrice: "217",
    ClosingPrice: "219",
    TradeVolume: "18000000",
    TradeValue: "3942000000",
    Transaction: "9000",
    Change: "-1",
  },
];

const tpexRows = [
  {
    SecuritiesCompanyCode: "6488",
    CompanyName: "環球晶",
    Date: "20260929",
    Open: "500",
    High: "512",
    Low: "498",
    Close: "510",
    TradingShares: "1500000",
    TransactionAmount: "765000000",
    TransactionNumber: "2100",
    Change: "10",
  },
];

const a1 = await buildA1SymbolSnapshotBatch({
  batchId: "A1-DAILY-ORCH-TEST",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows,
  tpexRows,
  minimumByMarket: { TWSE: 2, TPEX: 1 },
});
assert.equal(a1.state, "READY");
assert.equal(a1.ordinarySymbolCount, 3);

const sourceSessionReceipt = await buildShadowSourceSessionReceipt({
  receiptId: "SRC-DAILY-ORCH-TEST",
  marketDate,
  decisionTimestamp,
  expectedSources: [
    { sourceId: "A1_TW_DAILY_OHLCV_DERIVED", role: "REQUIRED" },
  ],
  observedSources: [
    {
      sourceId: "A1_TW_DAILY_OHLCV_DERIVED",
      state: "KNOWN",
      sourceDate: marketDate,
      availableAt: observedAt,
      capturedAt: observedAt,
      pointInTimeEligible: true,
      payloadHash: a1.batchHash,
      semanticVersion: a1.contractVersion,
    },
  ],
  capturedAt: observedAt,
});
assert.equal(sourceSessionReceipt.sourceSessionState, "SOURCE_SESSION_READY");

const regime = buildMarketRegimeSnapshot({
  regimeSnapshotId: "REG-DAILY-ORCH-TEST",
  marketDate,
  decisionTimestamp,
  labels: ["UNKNOWN"],
  taiwanIndexState: "KNOWN",
  breadthState: "UNKNOWN",
  liquidityState: "KNOWN",
  volatilityState: "KNOWN",
  leadershipState: "UNKNOWN",
  sectorRotationState: "UNKNOWN",
  globalMacroState: "UNKNOWN",
  factorRefs: [],
  warnings: ["fixture"],
});

function addDays(start, days) {
  const d = new Date(start + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function priorBars(symbol, market, priceOffset) {
  return Array.from({ length: 60 }, (_, i) => {
    const date = addDays("2026-07-31", i);
    const close = 100 + priceOffset + i;
    const base = {
      canonicalKey: [market, symbol, date, "RAW"].join("|"),
      marketDate: date,
      market,
      symbol,
      companyName: "fixture-" + symbol,
      priceSpace: "RAW",
      open: close - 1,
      high: close + 2,
      low: close - 2,
      close,
      volumeShares: 1_000_000 + i * 1000,
      tradeValue: (1_000_000 + i * 1000) * close,
      transactions: 1000 + i,
      change: 1,
      continuityState: "CLEAR_NO_ACTION",
      sourceId: market === "TWSE" ? "A1_TWSE_HISTORY_FIXTURE" : "A1_TPEX_HISTORY_FIXTURE",
      sourceName: "fixture",
      sourceRowHash: "SRC-" + symbol + "-" + date,
      observedAt: "2026-10-01T00:00:00Z",
      availableAt: date + "T05:30:00Z",
      pitAvailabilityClass: "CONSERVATIVE_SESSION_FINALITY",
      pitReplayEligible: true,
    };
    return {
      ...base,
      barId: "BAR-" + symbol + "-" + date,
      barHash: "HASH-" + symbol + "-" + date,
      schemaVersion: "S2_HISTORICAL_A1_BAR_V0_1",
    };
  });
}

const history = {
  "2330": priorBars("2330", "TWSE", 1300),
  "2317": priorBars("2317", "TWSE", 60),
  "6488": priorBars("6488", "TPEX", 340),
};

const stage1Families = Object.fromEntries(
  SHORT_MOMENTUM_CONTRACT_V0_1.evidenceFamilies.map((x) => {
    const required = ["TECHNICAL_STRUCTURE", "PRICE_VOLUME", "RISK_FRICTION"].includes(x.family);
    return [
      x.family,
      required
        ? {
            observationState: "KNOWN",
            thesisState: x.family === "RISK_FRICTION" ? "NEUTRAL" : "SUPPORTIVE",
            reasons: ["fixture-known-from-a1-factor-lineage"],
            warnings: [],
          }
        : {
            observationState: "UNKNOWN",
            thesisState: "INDETERMINATE",
            reasons: ["fixture-nonblocking-family-not-wired"],
            warnings: [],
          },
    ];
  }),
);

const result = await runDailyLimitedShadowOrchestratorV0_1({
  runId: "DAILY-SM-20260929",
  fingerprintId: "FP-DAILY-SM-20260929",
  predictionSnapshotId: "PS-DAILY-SM-20260929",
  persistenceBatchId: "PB-DAILY-SM-20260929",
  marketDate,
  decisionTimestamp,
  capturedAt,
  universeVersion: "A1-ORDINARY-EQUITY-V0.1",
  contract: SHORT_MOMENTUM_CONTRACT_V0_1,
  shadowSpec: findLimitedShadowSpec("SHORT_MOMENTUM"),
  sourceSessionReceipt,
  regime,
  a1SymbolSnapshotBatch: a1,
  loadPriorHistoricalBars: async ({ symbol }) => history[symbol],
  resolveContinuityState: async () => "CLEAR_NO_ACTION",
  classifyUniverseSymbol: async ({ symbol }) =>
    symbol === "6488"
      ? { excluded: true, reasons: ["FIXTURE_EXCLUSION_ONLY"] }
      : { excluded: false, reasons: [] },
  assessSymbol: async ({ symbol, factorBundle, replayWindow }) => {
    assert.equal(replayWindow.targetBarPresent, true);
    assert.equal(factorBundle.pointInTimeEligible, true);
    assert.equal(factorBundle.factorObservations.length, 7);

    if (symbol === "2317") {
      return {
        familyAssessments: stage1Families,
        entryReadiness: "WAIT",
        activeHardInvalidationIds: ["FAILED_BREAKOUT"],
        importantRejected: true,
        reasons: ["fixture invalidation"],
      };
    }

    return {
      familyAssessments: stage1Families,
      entryReadiness: "BUY_ELIGIBLE",
      entryPlan: {
        entryZoneLow: 1500,
        entryZoneHigh: 1520,
        triggerPrice: 1520,
        stopPrice: 1450,
        targets: [1600],
        maxHoldingSessions: 10,
      },
      reasons: ["fixture qualified"],
    };
  },
});

assert.equal(result.schemaVersion, "S2_DAILY_SHADOW_ORCHESTRATION_V0_1");
assert.equal(result.finalSelectionEnabled, false);
assert.equal(result.scheduledCaptureActivated, false);
assert.equal(result.baseUniverseCount, 3);
assert.equal(result.excludedCount, 1);
assert.equal(result.eligibleCount, 2);
assert.equal(result.accountedCount, 2);
assert.equal(result.bundle.runReceipt.runState, "COMPLETE");
assert.equal(result.bundle.runReceipt.stateCounts.SELECTED, 0);
assert.equal(result.bundle.runReceipt.stateCounts.QUALIFIED_NOT_SELECTED, 1);
assert.equal(result.bundle.runReceipt.stateCounts.REJECTED, 1);
assert.equal(result.bundle.predictionSnapshot.cohortCounts.NEAR_MISS, 1);
assert.equal(result.bundle.predictionSnapshot.cohortCounts.IMPORTANT_REJECTED, 1);
assert.equal(result.bundle.predictionSnapshot.cohortCounts.SELECTED, 0);
assert.equal(result.bundle.predictionSnapshot.zeroPickDay, true);
assert.equal(result.bundle.decisionSnapshots.length, 2);
assert.equal(result.bundle.factorRows.length, 2);
assert.equal(result.rankingInputs.length, 2);
assert.equal(result.rankingInputs[0].strategyId, "SHORT_MOMENTUM");
assert.equal(result.rankingInputs[0].strategyVersion, "V0.1-CONTRACT");
assert.equal(Object.isFrozen(result.rankingInputs), true);
assert.equal(Object.isFrozen(result.rankingInputs[0]), true);
assert.equal(result.bundle.persistenceBatch.operationCount, 8);
assert.equal(result.bundle.persistenceBatch.operations.at(-1).table, "s2_shadow_run_fingerprints");
assert.equal(result.exclusions["6488"].excluded, true);
assert.match(result.orchestrationHash, /^[0-9a-f]{64}$/);

const bySymbol = Object.fromEntries(
  result.bundle.decisionSnapshots.map((x) => [x.evaluation.symbol, x.evaluation]),
);
assert.equal(bySymbol["2330"].state, "QUALIFIED_NOT_SELECTED");
assert.equal(bySymbol["2330"].rank, null);
assert.equal(bySymbol["2330"].totalScore, null);
assert.equal(bySymbol["2317"].state, "REJECTED");

const incompleteA1 = await buildA1SymbolSnapshotBatch({
  batchId: "A1-INCOMPLETE-ORCH-TEST",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows,
  tpexRows,
  minimumByMarket: { TWSE: 99, TPEX: 99 },
});
assert.equal(incompleteA1.state, "INCOMPLETE");

await assert.rejects(
  () => runDailyLimitedShadowOrchestratorV0_1({
    runId: "DAILY-BAD-A1",
    fingerprintId: "FP-BAD-A1",
    predictionSnapshotId: "PS-BAD-A1",
    persistenceBatchId: "PB-BAD-A1",
    marketDate,
    decisionTimestamp,
    capturedAt,
    universeVersion: "fixture",
    contract: SHORT_MOMENTUM_CONTRACT_V0_1,
    shadowSpec: findLimitedShadowSpec("SHORT_MOMENTUM"),
    sourceSessionReceipt,
    regime,
    a1SymbolSnapshotBatch: incompleteA1,
    loadPriorHistoricalBars: async ({ symbol }) => history[symbol] || [],
    resolveContinuityState: async () => "CLEAR_NO_ACTION",
    assessSymbol: async () => ({ familyAssessments: stage1Families, entryReadiness: "WATCH" }),
  }),
  /A1_SYMBOL_BATCH_NOT_READY/,
);

await assert.rejects(
  () => runDailyLimitedShadowOrchestratorV0_1({
    runId: "DAILY-SELECTION-ENABLED",
    fingerprintId: "FP-SELECTION-ENABLED",
    predictionSnapshotId: "PS-SELECTION-ENABLED",
    persistenceBatchId: "PB-SELECTION-ENABLED",
    marketDate,
    decisionTimestamp,
    capturedAt,
    universeVersion: "fixture",
    contract: SHORT_MOMENTUM_CONTRACT_V0_1,
    shadowSpec: { ...findLimitedShadowSpec("SHORT_MOMENTUM"), selectionLayerEnabled: true },
    sourceSessionReceipt,
    regime,
    a1SymbolSnapshotBatch: a1,
    loadPriorHistoricalBars: async ({ symbol }) => history[symbol],
    assessSymbol: async () => ({ familyAssessments: stage1Families, entryReadiness: "WATCH" }),
  }),
  /cannot enable final selection/,
);

console.log("System2 daily limited Shadow orchestrator v0.1 tests passed");
