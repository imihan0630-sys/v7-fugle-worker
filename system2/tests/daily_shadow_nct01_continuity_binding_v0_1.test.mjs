import assert from "node:assert/strict";
import { buildA1SymbolSnapshotBatch } from "../runtime/a1_symbol_snapshot_adapter.mjs";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import { buildMarketRegimeSnapshot } from "../runtime/factor_snapshot.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { SHORT_MOMENTUM_CONTRACT_V0_1 } from "../runtime/strategy_contracts_v0_1.mjs";
import { findLimitedShadowSpec } from "../runtime/limited_shadow_v0_1.mjs";
import { runDailyLimitedShadowOrchestratorV0_1 } from "../runtime/daily_shadow_orchestrator_v0_1.mjs";
import { buildCorporateActionCompletenessReceiptV0_1 } from "../runtime/corporate_action_continuity_archive_v0_1.mjs";
import { buildNct01TwseClearNoActionPromotionReceiptV0_1 } from "../runtime/nct01_continuity_replay_binding_v0_1.mjs";

const marketDate = "2026-09-29";
const decisionTimestamp = "2026-09-29T07:30:00Z";
const observedAt = "2026-09-29T07:20:00Z";
const capturedAt = "2026-09-29T07:31:00Z";

const twseRows = [
  {
    Code: "2330", Name: "台積電", Date: "20260929",
    OpeningPrice: "1500", HighestPrice: "1530", LowestPrice: "1490", ClosingPrice: "1520",
    TradeVolume: "12000000", TradeValue: "18240000000", Transaction: "12000", Change: "20",
  },
  {
    Code: "2317", Name: "鴻海", Date: "20260929",
    OpeningPrice: "220", HighestPrice: "224", LowestPrice: "217", ClosingPrice: "219",
    TradeVolume: "18000000", TradeValue: "3942000000", Transaction: "9000", Change: "-1",
  },
];

const a1 = await buildA1SymbolSnapshotBatch({
  batchId: "A1-NCT01-ORCH-TEST",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows,
  tpexRows: [],
  minimumByMarket: { TWSE: 2, TPEX: 0 },
});
assert.equal(a1.state, "READY");
assert.equal(a1.ordinarySymbolCount, 2);

const sourceSessionReceipt = await buildShadowSourceSessionReceipt({
  receiptId: "SRC-NCT01-ORCH-TEST",
  marketDate,
  decisionTimestamp,
  expectedSources: [{ sourceId: "A1_TW_DAILY_OHLCV_DERIVED", role: "REQUIRED" }],
  observedSources: [{
    sourceId: "A1_TW_DAILY_OHLCV_DERIVED",
    state: "KNOWN",
    sourceDate: marketDate,
    availableAt: observedAt,
    capturedAt: observedAt,
    pointInTimeEligible: true,
    payloadHash: a1.batchHash,
    semanticVersion: a1.contractVersion,
  }],
  capturedAt: observedAt,
});

const regime = buildMarketRegimeSnapshot({
  regimeSnapshotId: "REG-NCT01-ORCH-TEST",
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

async function priorBars(symbol, priceOffset) {
  const rows = [];
  for (let i = 0; i < 60; i += 1) {
    const date = addDays("2026-07-31", i);
    const close = 100 + priceOffset + i;
    const base = {
      canonicalKey: ["TWSE", symbol, date, "RAW"].join("|"),
      marketDate: date,
      market: "TWSE",
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
      continuityState: symbol === "2330" ? "CLEAR_NO_ACTION" : "ADJUSTED_CONTINUITY",
      sourceId: "A1_TWSE_HISTORY_FIXTURE",
      sourceName: "fixture",
      sourceRowHash: await sha256Hex({ symbol, date, revision: "A" }),
      observedAt: date + "T05:30:00Z",
      availableAt: date + "T05:30:00Z",
      pitAvailabilityClass: "PROSPECTIVE_OBSERVED",
      pitReplayEligible: true,
    };
    rows.push({
      ...base,
      barId: "BAR-" + symbol + "-" + date,
      barHash: await sha256Hex(base),
      schemaVersion: "S2_HISTORICAL_A1_BAR_V0_1",
    });
  }
  return rows;
}

const history = {
  "2330": await priorBars("2330", 1300),
  "2317": await priorBars("2317", 60),
};

const requiredSourceContracts = [
  { exchange: "TWSE", actionFamilyId: "EX_RIGHT_DIVIDEND", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TWSE", actionFamilyId: "CAPITAL_REDUCTION", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TWSE", actionFamilyId: "PAR_VALUE_CHANGE", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
];

function archiveForWindow(startDate) {
  return buildCorporateActionCompletenessReceiptV0_1({
    startDate,
    endDate: marketDate,
    universeVersion: "TWSE-NCT01-ORCH-FIXTURE",
    universeCoverageComplete: true,
    requiredSourceContracts,
    sourceCoverage: requiredSourceContracts.map((contract, i) => ({
      ...contract,
      sourceId: "SRC-" + i,
      coverageState: "COMPLETE",
      parserComplete: true,
      revisionCoverageComplete: true,
      requestedStartDate: startDate,
      requestedEndDate: marketDate,
      responseRangeVerified: true,
      observedRowCount: 0,
      emptyRangeSemanticsCertified: true,
      missingSourceDates: [],
    })),
    eventVersions: [],
    suspensionCoverageByExchange: { TWSE: "COMPLETE" },
    generatedAt: "2026-09-29T07:00:00Z",
  });
}

async function certifiedReceipt(replayWindow, receiptId) {
  const dates = replayWindow.bars.map((x) => x.date);
  const sessionHash = await sha256Hex({ market: "TWSE", symbol: "2330", marketDate, dates });
  return buildNct01TwseClearNoActionPromotionReceiptV0_1({
    receiptId,
    replayWindow,
    archiveReceipt: archiveForWindow(dates[0]),
    universeState: "IN_SCOPE",
    symbolSessionEvidence: {
      expectedEligibleSymbolSessions: dates,
      exactSessionReconciliationReady: true,
      historyReady: true,
      missingExpectedSessionCount: 0,
      unexpectedSessionCount: 0,
      expectedSessionCount: dates.length,
      observedExpectedSessionCount: dates.length,
      expectedSessionHash: sessionHash,
      observedSessionHash: sessionHash,
    },
    sourceEvidenceRefs: [0, 1, 2].map((i) => ({
      sourceId: "SRC-" + i,
      digest: String(i + 1).repeat(64),
      observedAt: "2026-09-29T07:00:00Z",
      availabilitySemantics: "PROSPECTIVE_OBSERVED",
    })),
    sourceFamilyVersion: "TWSE-CA-EXACT-WINDOW-V0_1",
    rawHistoryAdmissionReceiptId: "RAW-HISTORY-2330-20260929",
    symbolSessionContractVersion: "S2-EXACT-SESSION-V0_4",
    sessionCalendarVersion: "TWSE-OFFICIAL-CALENDAR-V0_1",
    continuityEngineVersion: "SHARED-TECHNICAL-CONTINUITY-V0_1",
    corporateActionRegistryVersion: "S2-CA-ARCHIVE-V0_1",
    capturedAt: "2026-09-29T07:10:00Z",
    generatedAt: "2026-09-29T07:10:00Z",
  });
}

const allKnown = Object.fromEntries(
  SHORT_MOMENTUM_CONTRACT_V0_1.evidenceFamilies.map((x) => [
    x.family,
    { observationState: "KNOWN", thesisState: "SUPPORTIVE", reasons: ["fixture-known"], warnings: [] },
  ]),
);

async function run(receiptId) {
  let assessCalls = 0;
  const result = await runDailyLimitedShadowOrchestratorV0_1({
    runId: "DAILY-SM-NCT01-20260929",
    fingerprintId: "FP-DAILY-SM-NCT01-20260929",
    predictionSnapshotId: "PS-DAILY-SM-NCT01-20260929",
    persistenceBatchId: "PB-DAILY-SM-NCT01-20260929",
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
    resolveContinuityEvidence: async ({ symbol, replayWindow }) => {
      assert.ok(replayWindow.bars.every((bar) => bar.continuityState === "UNVERIFIED"));
      return symbol === "2330" ? certifiedReceipt(replayWindow, receiptId) : null;
    },
    assessSymbol: async ({ symbol, factorBundle, continuityBinding }) => {
      assessCalls += 1;
      assert.equal(symbol, "2330");
      assert.equal(continuityBinding.state, "READY");
      assert.equal(continuityBinding.continuityState, "CLEAR_NO_ACTION");
      assert.equal(factorBundle.continuityEligible, true);
      return {
        familyAssessments: allKnown,
        entryReadiness: "BUY_ELIGIBLE",
        reasons: ["fixture qualified"],
      };
    },
  });
  return { result, assessCalls };
}

const first = await run("NCT01-CONT-2330-A");
assert.equal(first.assessCalls, 1, JSON.stringify(first.result.perSymbolDiagnostics));
assert.equal(first.result.baseUniverseCount, 2);
assert.equal(first.result.eligibleCount, 2);
assert.equal(first.result.accountedCount, 2);

const diagBySymbol = Object.fromEntries(first.result.perSymbolDiagnostics.map((x) => [x.symbol, x]));
assert.equal(diagBySymbol["2330"].continuityBindingState, "READY");
assert.equal(diagBySymbol["2317"].continuityBindingState, "INCOMPLETE");
assert.ok(diagBySymbol["2317"].continuityBlockerCodes.includes("CONTINUITY_RECEIPT_MISSING"));

const decisions = Object.fromEntries(
  first.result.bundle.decisionSnapshots.map((x) => [x.evaluation.symbol, x]),
);
assert.equal(decisions["2330"].evaluation.state, "QUALIFIED_NOT_SELECTED");
assert.equal(decisions["2317"].evaluation.state, "INCOMPLETE");

const factorBySymbol = Object.fromEntries(first.result.bundle.factorRows.map((x) => [x.symbol, x]));
const manifest2330 = JSON.parse(factorBySymbol["2330"].source_manifest_json);
const manifest2317 = JSON.parse(factorBySymbol["2317"].source_manifest_json);
assert.ok(manifest2330.some((x) => x.refType === "CONTINUITY_RECEIPT_SHA256"));
assert.ok(manifest2330.some((x) => x.refType === "SOURCE_HISTORY_SHA256"));
assert.ok(manifest2317.some((x) => x.refType === "PIT_REPLAY_SHA256"));
assert.ok(!manifest2317.some((x) => x.refType === "CONTINUITY_RECEIPT_SHA256"));

const second = await run("NCT01-CONT-2330-B");
const secondDecisions = Object.fromEntries(
  second.result.bundle.decisionSnapshots.map((x) => [x.evaluation.symbol, x]),
);
const secondFactors = Object.fromEntries(second.result.bundle.factorRows.map((x) => [x.symbol, x]));

assert.equal(
  decisions["2330"].evaluation.decisionHash,
  secondDecisions["2330"].evaluation.decisionHash,
);
assert.notEqual(
  factorBySymbol["2330"].snapshot_hash,
  secondFactors["2330"].snapshot_hash,
);
assert.notEqual(
  first.result.bundle.persistenceBatch.batchHash,
  second.result.bundle.persistenceBatch.batchHash,
);
assert.notEqual(first.result.orchestrationHash, second.result.orchestrationHash);

await assert.rejects(
  () => runDailyLimitedShadowOrchestratorV0_1({
    runId: "BAD-DUAL-CONTINUITY",
    fingerprintId: "BAD-DUAL-CONTINUITY-FP",
    predictionSnapshotId: "BAD-DUAL-CONTINUITY-PS",
    persistenceBatchId: "BAD-DUAL-CONTINUITY-PB",
    marketDate,
    decisionTimestamp,
    capturedAt,
    universeVersion: "fixture",
    contract: SHORT_MOMENTUM_CONTRACT_V0_1,
    shadowSpec: findLimitedShadowSpec("SHORT_MOMENTUM"),
    sourceSessionReceipt,
    regime,
    a1SymbolSnapshotBatch: a1,
    loadPriorHistoricalBars: async ({ symbol }) => history[symbol],
    resolveContinuityState: async () => "CLEAR_NO_ACTION",
    resolveContinuityEvidence: async () => null,
    assessSymbol: async () => ({ familyAssessments: allKnown, entryReadiness: "WATCH" }),
  }),
  /mutually exclusive/,
);

console.log("System2 Daily Shadow NC-T01 continuity binding integration tests passed");
