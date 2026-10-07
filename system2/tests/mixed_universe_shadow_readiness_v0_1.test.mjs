import assert from "node:assert/strict";
import { probePitHistoryCoverageV0_1 } from "../runtime/daily_shadow_history_reader_v0_1.mjs";
import { buildDailyShadowInputPreflightV0_1 } from "../runtime/daily_shadow_input_preflight_v0_1.mjs";
import { buildStrategyStateAssessment } from "../runtime/strategy_evaluator.mjs";
import { buildDailyShadowCapacityOrchestrationV0_1 } from "../runtime/daily_shadow_capacity_orchestrator_v0_1.mjs";

const marketDate = "2026-10-02";
const decisionTimestamp = "2026-10-02T07:30:00.000Z";
const capturedAt = "2026-10-02T07:31:00.000Z";

function fakeDb(coverageRows) {
  return {
    prepare() {
      return {
        bind() {
          return {
            async all() {
              return { results: coverageRows };
            },
          };
        },
      };
    },
  };
}

const snapshotBatch = {
  marketDate,
  ordinarySymbolCount: 4,
  symbols: ["A", "B", "C", "D"],
  bySymbol: {
    A: { market: "TWSE" },
    B: { market: "TWSE" },
    C: { market: "TPEX" },
    D: { market: "TPEX" },
  },
};

const exactDates60 = [];
for (let d = new Date("2026-08-02T00:00:00Z"); d < new Date("2026-10-01T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1)) {
  exactDates60.push(d.toISOString().slice(0, 10));
}
assert.equal(exactDates60.length, 60);
const exactListingMetadata = {
  state: "READY",
  byMarketSymbol: Object.fromEntries([
    ["TWSE","A"],["TWSE","B"],["TPEX","C"],["TPEX","D"],
  ].map(([market,symbol]) => [`${market}|${symbol}`, { market, symbol, listingDate: "2000-01-01" }])),
};

const historyCoverage = await probePitHistoryCoverageV0_1({
  db: fakeDb([
    { symbol: "A", market: "TWSE", selected_date_count: 60, ambiguous_date_count: 0, continuity_eligible_count: 60, first_selected_date: exactDates60[0], last_selected_date: exactDates60.at(-1), selected_dates_csv: exactDates60.join(",") },
    { symbol: "B", market: "TWSE", selected_date_count: 5, ambiguous_date_count: 0, continuity_eligible_count: 5, first_selected_date: exactDates60.at(-5), last_selected_date: exactDates60.at(-1), selected_dates_csv: exactDates60.slice(-5).join(",") },
    { symbol: "C", market: "TPEX", selected_date_count: 60, ambiguous_date_count: 0, continuity_eligible_count: 59, first_selected_date: exactDates60[0], last_selected_date: exactDates60.at(-1), selected_dates_csv: exactDates60.join(",") },
    { symbol: "D", market: "TPEX", selected_date_count: 60, ambiguous_date_count: 0, continuity_eligible_count: 60, first_selected_date: exactDates60[0], last_selected_date: exactDates60.at(-1), selected_dates_csv: exactDates60.join(",") },
  ]),
  snapshotBatch,
  decisionTimestamp,
  requiredPriorSessions: 60,
  listingMetadata: exactListingMetadata,
  priorTradingDates: exactDates60,
});

assert.equal(historyCoverage.state, "HISTORY_COVERAGE_INCOMPLETE");
assert.equal(historyCoverage.globalIntegrityState, "READY");
assert.equal(historyCoverage.accountingComplete, true);
assert.equal(historyCoverage.accountedSymbolCount, 4);
assert.equal(historyCoverage.symbolLocalIncompleteCount, 2);
assert.equal(historyCoverage.selectionDenominatorComplete, false);
const historyBySymbol = Object.fromEntries(historyCoverage.diagnostics.map((row) => [row.symbol, row]));
assert.equal(historyBySymbol.A.readinessState, "READY");
assert.equal(historyBySymbol.B.readinessState, "INCOMPLETE");
assert.ok(historyBySymbol.B.blockerCodes.includes("INSUFFICIENT_PIT_HISTORY"));
assert.equal(historyBySymbol.C.readinessState, "INCOMPLETE");
assert.ok(historyBySymbol.C.blockerCodes.includes("SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED"));
assert.equal(historyBySymbol.D.readinessState, "READY");

const preflight = buildDailyShadowInputPreflightV0_1({
  marketDate,
  decisionTimestamp,
  a1Source: {
    state: "READY",
    snapshotBatch: { ordinarySymbolCount: 4, blockerCodes: [] },
    decisionClockMode: "FIXED_CALLER_CLOCK",
  },
  historyCoverage,
});
assert.equal(preflight.globalInputsReady, true);
assert.equal(preflight.sourceAndHistoryReady, true);
assert.equal(preflight.blockers.some((row) => row.layer === "PIT_HISTORY_GLOBAL"), false);
assert.deepEqual([...preflight.evaluationInputEligibleSymbols].sort(), ["A", "D"]);
assert.deepEqual([...preflight.evaluationInputBlockedSymbols].sort(), ["B", "C"]);
assert.equal(preflight.selectionDenominatorComplete, false);
assert.equal(preflight.zeroPickMayBeClaimed, false);

const contract = {
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "TEST-V0",
  evidenceFamilies: [
    { family: "TECHNICAL_STRUCTURE", role: "PRIMARY", unknownBlocksEligibility: true },
  ],
  hardInvalidationIds: [],
};

const knownAssessment = buildStrategyStateAssessment(contract, {
  familyAssessments: {
    TECHNICAL_STRUCTURE: {
      observationState: "KNOWN",
      thesisState: "SUPPORTIVE",
      reasons: ["fixture-ready"],
      warnings: [],
    },
  },
  entryReadiness: "BUY_ELIGIBLE",
});
assert.equal(knownAssessment.strategyValidity, "VALID");
assert.equal(knownAssessment.entryReadiness, "BUY_ELIGIBLE");

const unknownAssessment = buildStrategyStateAssessment(contract, {
  familyAssessments: {
    TECHNICAL_STRUCTURE: {
      observationState: "UNKNOWN",
      thesisState: "INDETERMINATE",
      reasons: ["required-evidence-unknown"],
      warnings: [],
    },
  },
  entryReadiness: "BUY_ELIGIBLE",
});
assert.equal(unknownAssessment.strategyValidity, "INCOMPLETE");
assert.equal(unknownAssessment.entryReadiness, "BLOCKED");

const knownFamily = {
  observationState: "KNOWN",
  thesisState: "SUPPORTIVE",
  reasons: ["fixture"],
  warnings: [],
};
function rankingInput(symbol, validity, readiness, warning) {
  return {
    symbol,
    companyName: symbol,
    decisionId: `DEC-${symbol}`,
    strategyId: "SHORT_MOMENTUM",
    strategyVersion: "V0.1-CONTRACT",
    strategyValidity: validity,
    entryReadiness: readiness,
    familyAssessments: {
      TECHNICAL_STRUCTURE: knownFamily,
      PRICE_VOLUME: knownFamily,
      RISK_FRICTION: { ...knownFamily, thesisState: "NEUTRAL" },
    },
    warnings: warning ? [warning] : [],
  };
}
function strategyRun(inputs) {
  return {
    marketDate,
    decisionTimestamp,
    finalSelectionEnabled: false,
    scheduledCaptureActivated: false,
    exclusions: {},
    rankingInputs: inputs,
    bundle: {
      strategyId: "SHORT_MOMENTUM",
      strategyVersion: "V0.1-CONTRACT",
      runReceipt: {
        runId: "RUN-SHORT_MOMENTUM-MIXED",
        marketDate,
        decisionTimestamp,
        strategyId: "SHORT_MOMENTUM",
        strategyVersion: "V0.1-CONTRACT",
        runState: "COMPLETE",
        accountedCount: 4,
        eligibleCount: 4,
        completionRate: 1,
        stateCounts: {
          INCOMPLETE: 3,
          SOURCE_BLOCKED: 0,
          SESSION_INVALID: 0,
          ERROR: 0,
        },
      },
    },
  };
}

const mixedCapacity = await buildDailyShadowCapacityOrchestrationV0_1({
  capacityRunId: "CAP-MIXED-ABCD",
  persistenceBatchId: "PB-MIXED-ABCD",
  marketDate,
  decisionTimestamp,
  capturedAt,
  strategyRuns: [strategyRun([
    rankingInput("A", "VALID", "BUY_ELIGIBLE"),
    rankingInput("B", "INCOMPLETE", "BLOCKED", "INSUFFICIENT_PIT_HISTORY"),
    rankingInput("C", "INCOMPLETE", "BLOCKED", "SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED"),
    rankingInput("D", unknownAssessment.strategyValidity, unknownAssessment.entryReadiness, "REQUIRED_EVIDENCE_UNKNOWN"),
  ])],
});

assert.equal(mixedCapacity.state, "CAPACITY_READY_PARTIAL_COVERAGE");
assert.equal(mixedCapacity.selectionDenominator.complete, false);
assert.equal(mixedCapacity.selectionDenominator.unresolvedByState.INCOMPLETE, 3);
assert.equal(mixedCapacity.capacityReceipt.selectionDenominator.denominatorState, "PARTIAL");
assert.equal(mixedCapacity.capacityReceipt.selectionDenominator.contributingShadowRuns[0].runId, "RUN-SHORT_MOMENTUM-MIXED");
assert.equal(mixedCapacity.zeroPickDay, false);
assert.deepEqual(mixedCapacity.capacityReceipt.globalPool.map((row) => row.symbol), ["A"]);
assert.deepEqual(mixedCapacity.capacityReceipt.activeAssignments.SHORT_MOMENTUM.map((row) => row.symbol), ["A"]);
assert.equal(mixedCapacity.newCandidateDiagnostics.length, 3);
for (const row of mixedCapacity.newCandidateDiagnostics) {
  assert.equal(["B", "C", "D"].includes(row.symbol), true);
  assert.equal(row.strategyValidity, "INCOMPLETE");
  assert.equal(row.entryReadiness, "BLOCKED");
}
assert.equal(
  mixedCapacity.capacityReceipt.globalPool.some((row) => ["B", "C", "D"].includes(row.symbol)),
  false,
);

const partialNoSelection = await buildDailyShadowCapacityOrchestrationV0_1({
  capacityRunId: "CAP-MIXED-ABCD-NONE",
  persistenceBatchId: "PB-MIXED-ABCD-NONE",
  marketDate,
  decisionTimestamp,
  capturedAt,
  strategyRuns: [strategyRun([
    rankingInput("A", "VALID", "WATCH"),
    rankingInput("B", "INCOMPLETE", "BLOCKED", "INSUFFICIENT_PIT_HISTORY"),
    rankingInput("C", "INCOMPLETE", "BLOCKED", "SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED"),
    rankingInput("D", "INCOMPLETE", "BLOCKED", "REQUIRED_EVIDENCE_UNKNOWN"),
  ])],
});
assert.equal(partialNoSelection.state, "CAPACITY_PARTIAL_COVERAGE_NO_SELECTION");
assert.equal(partialNoSelection.zeroPickDay, null);
assert.equal(partialNoSelection.zeroPickState, "PARTIAL_COVERAGE_NO_SELECTION");
assert.equal(partialNoSelection.capacityReceipt, null);
assert.equal(
  partialNoSelection.persistenceBatch.operations.some((op) => op.table === "s2_capacity_runs"),
  false,
);

const globalBlocked = buildDailyShadowInputPreflightV0_1({
  marketDate,
  decisionTimestamp,
  a1Source: {
    state: "READY",
    snapshotBatch: { ordinarySymbolCount: 4, blockerCodes: [] },
  },
  historyCoverage: {
    ...historyCoverage,
    state: "SOURCE_WIDE_REVISION_AMBIGUITY",
    globalIntegrityState: "BLOCKED",
    globalBlockerCodes: ["SOURCE_WIDE_REVISION_AMBIGUITY"],
  },
});
assert.equal(globalBlocked.state, "INPUTS_NOT_READY");
assert.equal(globalBlocked.globalInputsReady, false);
assert.equal(globalBlocked.capacityWriteAuthorized, false);
assert.equal(globalBlocked.zeroPickMayBeClaimed, false);

console.log("System2 mixed-universe Shadow readiness CORR-004 tests passed");
