import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { buildPitReplayWindow } from "./pit_replay_v0_1.mjs";
import { buildA1HistoryPrimitiveBundle } from "./a1_history_primitives_v0_1.mjs";
import { buildStrategyStateAssessment } from "./strategy_evaluator.mjs";
import { buildLimitedShadowRunBundleV0_1 } from "./limited_shadow_run_assembler_v0_1.mjs";

export const DAILY_SHADOW_ORCHESTRATOR_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function assertSame(value, expected, field) {
  if (value !== expected) throw new Error(`${field} does not match orchestrator clock`);
}

function defaultUnknownFamilies(contract, reason) {
  return Object.fromEntries(
    (contract.evidenceFamilies || []).map((item) => [
      item.family,
      {
        observationState: "UNKNOWN",
        thesisState: "INDETERMINATE",
        reasons: [reason],
        warnings: [],
      },
    ]),
  );
}

async function currentSnapshotReplayRow(snapshot, continuityState) {
  const base = {
    canonicalKey: [snapshot.market, snapshot.symbol, snapshot.marketDate, "RAW"].join("|"),
    marketDate: snapshot.marketDate,
    market: snapshot.market,
    symbol: snapshot.symbol,
    companyName: snapshot.companyName || null,
    priceSpace: "RAW",
    open: snapshot.open,
    high: snapshot.high,
    low: snapshot.low,
    close: snapshot.close,
    volumeShares: snapshot.volumeShares,
    tradeValue: snapshot.tradeValue,
    transactions: snapshot.transactions,
    change: snapshot.change,
    continuityState,
    sourceId: snapshot.provenance?.sourceId || "A1_DAILY_CLOSE",
    sourceName: snapshot.provenance?.sourceName || "A1 daily close",
    sourceRowHash: snapshot.sourceRowHash,
    observedAt: snapshot.provenance?.observedAt,
    availableAt: snapshot.provenance?.availableAt,
    pitAvailabilityClass: snapshot.provenance?.pointInTimeEligible === true
      ? "PROSPECTIVE_OBSERVED"
      : "UNKNOWN",
    pitReplayEligible: snapshot.provenance?.pointInTimeEligible === true,
  };
  const barHash = await sha256Hex(base);
  return deepFreeze({
    ...base,
    barId: "S2-DAILY-A1-" + barHash,
    barHash,
    schemaVersion: "S2_DAILY_A1_REPLAY_ROW_V0_1",
  });
}

function normalizeExclusion(result) {
  if (result === null || result === undefined) {
    return { excluded: false, reasons: [] };
  }
  if (typeof result !== "object" || Array.isArray(result)) {
    throw new Error("classifyUniverseSymbol must return an object");
  }
  return {
    excluded: result.excluded === true,
    reasons: Object.freeze([...(result.reasons || [])].map(String)),
  };
}

export async function runDailyLimitedShadowOrchestratorV0_1({
  runId,
  fingerprintId,
  predictionSnapshotId,
  persistenceBatchId,
  marketDate,
  decisionTimestamp,
  capturedAt,
  universeVersion,
  contract,
  shadowSpec,
  sourceSessionReceipt,
  regime,
  regimeVersion = "S2_MARKET_REGIME_V0",
  regimeFactorObservations = [],
  regimeSourceReceipts = [],
  a1SymbolSnapshotBatch,
  factorBundleVersion = "S2-A1-HIST-0.1-RESEARCH",
  lookbackSessions = 61,
  loadPriorHistoricalBars,
  resolveContinuityState = null,
  classifyUniverseSymbol = null,
  assessSymbol,
  runWarnings = [],
} = {}) {
  const date = requiredText(marketDate, "marketDate");
  const clock = assertTimestamp(decisionTimestamp, "decisionTimestamp");
  const captured = assertTimestamp(capturedAt, "capturedAt");
  if (Date.parse(captured) < Date.parse(clock)) {
    throw new Error("capturedAt cannot be earlier than decisionTimestamp");
  }
  if (!contract || typeof contract !== "object") throw new Error("contract is required");
  if (!shadowSpec || typeof shadowSpec !== "object") throw new Error("shadowSpec is required");
  if (shadowSpec.selectionLayerEnabled === true) {
    throw new Error("daily limited Shadow orchestrator cannot enable final selection");
  }
  if (contract.strategyId !== shadowSpec.strategyId || contract.strategyVersion !== shadowSpec.strategyVersion) {
    throw new Error("contract/shadowSpec identity mismatch");
  }
  if (!a1SymbolSnapshotBatch || typeof a1SymbolSnapshotBatch !== "object") {
    throw new Error("a1SymbolSnapshotBatch is required");
  }
  assertSame(a1SymbolSnapshotBatch.marketDate, date, "a1SymbolSnapshotBatch.marketDate");
  assertSame(a1SymbolSnapshotBatch.decisionTimestamp, clock, "a1SymbolSnapshotBatch.decisionTimestamp");
  if (a1SymbolSnapshotBatch.state !== "READY" || a1SymbolSnapshotBatch.pointInTimeEligible !== true) {
    throw new Error(
      "A1_SYMBOL_BATCH_NOT_READY:" +
      [...(a1SymbolSnapshotBatch.blockerCodes || [])].join(","),
    );
  }
  if (typeof loadPriorHistoricalBars !== "function") {
    throw new Error("loadPriorHistoricalBars callback is required");
  }
  if (resolveContinuityState !== null && typeof resolveContinuityState !== "function") {
    throw new Error("resolveContinuityState must be a function");
  }
  if (classifyUniverseSymbol !== null && typeof classifyUniverseSymbol !== "function") {
    throw new Error("classifyUniverseSymbol must be a function");
  }
  if (typeof assessSymbol !== "function") throw new Error("assessSymbol callback is required");

  if (!sourceSessionReceipt || typeof sourceSessionReceipt !== "object") {
    throw new Error("sourceSessionReceipt is required");
  }
  assertSame(sourceSessionReceipt.marketDate, date, "sourceSessionReceipt.marketDate");
  assertSame(sourceSessionReceipt.decisionTimestamp, clock, "sourceSessionReceipt.decisionTimestamp");

  if (!regime || typeof regime !== "object") throw new Error("regime is required");
  assertSame(regime.marketDate, date, "regime.marketDate");
  assertSame(regime.decisionTimestamp, clock, "regime.decisionTimestamp");

  const baseUniverseSymbols = [...a1SymbolSnapshotBatch.symbols].sort();
  const excludedSymbols = [];
  const exclusions = {};
  const candidates = [];
  const importantRejectedDecisionIds = [];
  const perSymbolDiagnostics = [];

  for (const symbol of baseUniverseSymbols) {
    const snapshot = a1SymbolSnapshotBatch.bySymbol[symbol];
    const exclusion = normalizeExclusion(
      classifyUniverseSymbol
        ? await classifyUniverseSymbol({ symbol, snapshot, marketDate: date, decisionTimestamp: clock, contract, shadowSpec })
        : null,
    );
    exclusions[symbol] = exclusion;

    if (exclusion.excluded) {
      excludedSymbols.push(symbol);
      perSymbolDiagnostics.push(deepFreeze({
        symbol,
        state: "EXCLUDED",
        reasons: exclusion.reasons,
      }));
      continue;
    }

    const continuityState = resolveContinuityState
      ? requiredText(
          await resolveContinuityState({
            symbol,
            snapshot,
            marketDate: date,
            decisionTimestamp: clock,
          }),
          "continuityState",
        )
      : "UNVERIFIED";

    const priorBarsRaw = await loadPriorHistoricalBars({
      symbol,
      market: snapshot.market,
      marketDate: date,
      decisionTimestamp: clock,
      lookbackSessions: Math.max(1, Number(lookbackSessions) - 1),
      priceSpace: "RAW",
    });
    if (!Array.isArray(priorBarsRaw)) {
      throw new Error(`loadPriorHistoricalBars must return an array: ${symbol}`);
    }

    const currentBar = await currentSnapshotReplayRow(snapshot, continuityState);
    const priorBars = priorBarsRaw.filter((row) => row.marketDate < date);
    const replayWindow = await buildPitReplayWindow({
      replayId: `${runId}|DAILY|${date}|${symbol}`,
      symbol,
      marketDate: date,
      decisionTimestamp: clock,
      priceSpace: "RAW",
      lookbackSessions,
      historicalBars: [...priorBars, currentBar],
    });

    const factorBundle = await buildA1HistoryPrimitiveBundle({
      bundleId: `${runId}|A1|${date}|${symbol}`,
      symbol,
      marketDate: date,
      decisionTimestamp: clock,
      observedAt: snapshot.provenance?.observedAt || captured,
      availableAt: snapshot.provenance?.availableAt || null,
      bars: replayWindow.bars,
      sourceId: snapshot.provenance?.sourceId || "A1_DAILY_CLOSE",
      sourceName: snapshot.provenance?.sourceName || "A1 daily close",
      sourceUrl: snapshot.provenance?.sourceUrl || null,
      priceSpace: "RAW",
      volumeUnit: "SHARES",
      continuityState,
    });

    let assessmentInput;
    let entryPlan = null;
    let reasons = [];
    let warnings = [];
    let interactionObservations = [];
    let importantRejected = false;

    if (replayWindow.targetBarPresent !== true) {
      assessmentInput = {
        familyAssessments: defaultUnknownFamilies(contract, "PIT_REPLAY_TARGET_BAR_UNAVAILABLE"),
        entryReadiness: "BLOCKED",
        warnings: ["PIT_REPLAY_TARGET_BAR_UNAVAILABLE"],
      };
      warnings = ["PIT_REPLAY_TARGET_BAR_UNAVAILABLE"];
    } else {
      const assessmentResult = await assessSymbol({
        symbol,
        companyName: snapshot.companyName,
        market: snapshot.market,
        marketDate: date,
        decisionTimestamp: clock,
        contract,
        shadowSpec,
        snapshot,
        replayWindow,
        factorBundle,
        regime,
      });
      if (!assessmentResult || typeof assessmentResult !== "object") {
        throw new Error(`assessSymbol must return an object: ${symbol}`);
      }
      assessmentInput = {
        familyAssessments:
          assessmentResult.familyAssessments ||
          defaultUnknownFamilies(contract, "ASSESSOR_DID_NOT_PROVIDE_FAMILY_ASSESSMENTS"),
        entryReadiness: assessmentResult.entryReadiness || "WATCH",
        activeHardInvalidationIds: assessmentResult.activeHardInvalidationIds || [],
        conflicts: assessmentResult.conflicts || [],
        warnings: assessmentResult.assessmentWarnings || [],
      };
      entryPlan = assessmentResult.entryPlan || null;
      reasons = [...(assessmentResult.reasons || [])].map(String);
      warnings = [...(assessmentResult.warnings || [])].map(String);
      interactionObservations = [...(assessmentResult.interactionObservations || [])];
      importantRejected = assessmentResult.importantRejected === true;
    }

    const assessment = buildStrategyStateAssessment(contract, assessmentInput);
    const decisionId = `${runId}|DECISION|${symbol}`;
    if (importantRejected && assessment.strategyValidity === "INVALIDATED") {
      importantRejectedDecisionIds.push(decisionId);
    }

    candidates.push({
      symbol,
      companyName: snapshot.companyName,
      decisionId,
      factorSnapshotId: `${runId}|FACTOR|${symbol}`,
      coreMetrics: factorBundle.coreMetrics,
      factorObservations: factorBundle.factorObservations,
      interactionObservations,
      sourceManifest: [{
        sourceId: snapshot.provenance?.sourceId || "A1_DAILY_CLOSE",
        sourceRowHash: snapshot.sourceRowHash,
        batchHash: a1SymbolSnapshotBatch.batchHash,
        availableAt: snapshot.provenance?.availableAt || null,
      }],
      assessment,
      entryPlan,
      reasons,
      warnings: [
        ...warnings,
        ...(replayWindow.state === "READY" ? [] : replayWindow.blockerCodes),
        ...factorBundle.qualityFlags,
      ],
    });

    perSymbolDiagnostics.push(deepFreeze({
      symbol,
      state: "ACCOUNTED",
      replayState: replayWindow.state,
      replayHash: replayWindow.replayHash,
      factorBundleHash: factorBundle.bundleHash,
      strategyValidity: assessment.strategyValidity,
      entryReadiness: assessment.entryReadiness,
    }));
  }

  const bundle = await buildLimitedShadowRunBundleV0_1({
    runId: requiredText(runId, "runId"),
    fingerprintId: requiredText(fingerprintId, "fingerprintId"),
    predictionSnapshotId: requiredText(predictionSnapshotId, "predictionSnapshotId"),
    persistenceBatchId: requiredText(persistenceBatchId, "persistenceBatchId"),
    marketDate: date,
    decisionTimestamp: clock,
    capturedAt: captured,
    universeVersion: requiredText(universeVersion, "universeVersion"),
    baseUniverseSymbols,
    excludedSymbols,
    contract,
    shadowSpec,
    sourceSessionReceipt,
    regime,
    regimeVersion,
    regimeFactorObservations,
    regimeSourceReceipts,
    factorBundleVersion,
    candidates,
    importantRejectedDecisionIds,
    runWarnings: [
      ...runWarnings,
      "DAILY_SHADOW_ORCHESTRATOR_V0_1_RESEARCH_ONLY",
      "FINAL_SELECTION_DISABLED",
    ],
  });

  if (bundle.runReceipt.runState !== "COMPLETE") {
    throw new Error("daily Shadow orchestrator produced incomplete eligible-universe accounting");
  }
  if (bundle.runReceipt.stateCounts.SELECTED !== 0) {
    throw new Error("daily limited Shadow orchestrator must not emit SELECTED");
  }

  const orchestrationBase = {
    runId: bundle.runReceipt.runId,
    marketDate: date,
    decisionTimestamp: clock,
    strategyId: contract.strategyId,
    strategyVersion: contract.strategyVersion,
    shadowSpecId: shadowSpec.shadowSpecId,
    a1BatchHash: a1SymbolSnapshotBatch.batchHash,
    sourceSessionHash: sourceSessionReceipt.sourceSessionHash,
    regimeSnapshotId: regime.regimeSnapshotId,
    baseUniverseCount: baseUniverseSymbols.length,
    excludedCount: excludedSymbols.length,
    eligibleCount: candidates.length,
    accountedCount: bundle.runReceipt.accountedCount,
    decisionCount: bundle.decisionSnapshots.length,
    predictionSnapshotHash: bundle.predictionSnapshot.predictionSnapshotHash,
    persistenceBatchHash: bundle.persistenceBatch.batchHash,
    finalSelectionEnabled: false,
    scheduledCaptureActivated: false,
    perSymbolDiagnostics: Object.freeze(perSymbolDiagnostics),
    exclusions: deepFreeze(exclusions),
    capturedAt: captured,
    schemaVersion: "S2_DAILY_SHADOW_ORCHESTRATION_V0_1",
  };
  const orchestrationHash = await sha256Hex(orchestrationBase);

  return deepFreeze({
    ...orchestrationBase,
    orchestrationHash,
    bundle,
  });
}
