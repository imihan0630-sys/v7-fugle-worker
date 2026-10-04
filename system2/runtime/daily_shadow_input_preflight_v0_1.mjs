import { deepFreeze } from "./factor_snapshot.mjs";
import { resolveDailyShadowAssessorReadinessV0_1 } from "./daily_shadow_assessor_readiness_v0_1.mjs";

export const DAILY_SHADOW_INPUT_PREFLIGHT_VERSION = "0.2-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

export function buildDailyShadowInputPreflightV0_1({
  marketDate,
  decisionTimestamp,
  a1Source,
  historyCoverage,
  strategyIds = ["SHORT_MOMENTUM", "SWING_GROWTH"],
} = {}) {
  const date = requiredText(marketDate, "marketDate");
  const clock = requiredText(decisionTimestamp, "decisionTimestamp");
  if (!Number.isFinite(Date.parse(clock))) throw new Error("decisionTimestamp must be ISO");
  if (!a1Source || typeof a1Source !== "object") throw new Error("a1Source is required");
  if (!historyCoverage || typeof historyCoverage !== "object") {
    throw new Error("historyCoverage is required");
  }
  if (!Array.isArray(strategyIds) || !strategyIds.length) {
    throw new Error("strategyIds must be a non-empty array");
  }

  const assessorReadiness = Object.freeze(
    strategyIds.map((strategyId) =>
      resolveDailyShadowAssessorReadinessV0_1(strategyId),
    ),
  );
  const blockers = [];
  const historyDiagnostics = Array.isArray(historyCoverage.diagnostics)
    ? historyCoverage.diagnostics
    : [];
  const globalHistoryReady = historyCoverage.globalIntegrityState
    ? historyCoverage.globalIntegrityState === "READY"
    : historyCoverage.state === "READY";
  const symbolAccounts = Object.freeze(historyDiagnostics.map((row) => Object.freeze({
    symbol: row.symbol,
    market: row.market || null,
    state: row.evaluationInputReady === true ? "EVALUATION_INPUT_READY" : "INCOMPLETE",
    entryReadiness: row.evaluationInputReady === true ? "ELIGIBLE_FOR_ASSESSOR" : "BLOCKED",
    historyReady: row.historyReady === true,
    continuityReady: row.continuityReady === true,
    blockerCodes: Object.freeze([...(row.blockerCodes || [])].map(String)),
    denominatorAccounted: row.denominatorAccounted !== false,
  })));
  const symbolLocalBlockers = Object.freeze(
    symbolAccounts
      .filter((row) => row.state === "INCOMPLETE")
      .map((row) => Object.freeze({
        layer: "SYMBOL_LOCAL_READINESS",
        symbol: row.symbol,
        market: row.market,
        code: "SYMBOL_INPUT_INCOMPLETE",
        reasonCodes: row.blockerCodes,
      })),
  );
  const currentUniverseCount = Number(historyCoverage.currentUniverseCount || 0);
  const symbolLocalIncompleteCount = Number.isInteger(historyCoverage.symbolLocalIncompleteCount)
    ? historyCoverage.symbolLocalIncompleteCount
    : symbolAccounts.filter((row) => row.state === "INCOMPLETE").length;
  const accountingComplete = historyCoverage.accountingComplete === true
    || (currentUniverseCount > 0 && symbolAccounts.length === currentUniverseCount);
  const selectionDenominatorComplete =
    historyCoverage.selectionDenominatorComplete === true
    || (
      globalHistoryReady
      && accountingComplete
      && symbolLocalIncompleteCount === 0
      && Number(historyCoverage.ambiguousSymbolCount || 0) === 0
    );

  if (a1Source.state !== "READY") {
    blockers.push({
      layer: "CURRENT_A1_SOURCE",
      code: `A1_SOURCE_${a1Source.state}`,
    });
  }
  if (!globalHistoryReady) {
    blockers.push({
      layer: "PIT_HISTORY_GLOBAL",
      code: `PIT_HISTORY_GLOBAL_${historyCoverage.globalIntegrityState || historyCoverage.state || "UNKNOWN"}`,
      aggregateState: historyCoverage.state || null,
      globalBlockerCodes: Object.freeze([
        ...(historyCoverage.globalBlockerCodes || []),
      ]),
      historyCoverage: historyCoverage.historyCoverage,
      continuityCoverage: historyCoverage.continuityCoverage,
    });
  }
  for (const policy of assessorReadiness) {
    if (policy.state !== "READY") {
      blockers.push({
        layer: "STRATEGY_ASSESSOR",
        strategyId: policy.strategyId,
        code: policy.state,
        reasonCodes: policy.reasonCodes,
      });
    }
  }

  const sourceAndHistoryReady =
    a1Source.state === "READY" &&
    globalHistoryReady;
  const globalInputsReady = sourceAndHistoryReady;
  const assessorReady = assessorReadiness.every((x) => x.state === "READY");
  const state = !globalInputsReady
    ? "INPUTS_NOT_READY"
    : !assessorReady
      ? "ASSESSOR_POLICY_BLOCKED"
      : symbolLocalIncompleteCount > 0
        ? "READY_FOR_AUTHORIZED_SHADOW_EVALUATION_WITH_SYMBOL_GAPS"
        : "READY_FOR_AUTHORIZED_SHADOW_EVALUATION";

  return deepFreeze({
    version: DAILY_SHADOW_INPUT_PREFLIGHT_VERSION,
    marketDate: date,
    decisionTimestamp: clock,
    state,
    sourceAndHistoryReady,
    globalInputsReady,
    assessorReady,
    accountingComplete,
    selectionDenominatorComplete,
    symbolLocalIncompleteCount,
    blockers: Object.freeze(blockers),
    symbolLocalBlockers,
    symbolAccounts,
    evaluationInputEligibleSymbols: Object.freeze(
      symbolAccounts.filter((row) => row.state === "EVALUATION_INPUT_READY").map((row) => row.symbol),
    ),
    evaluationInputBlockedSymbols: Object.freeze(
      symbolAccounts.filter((row) => row.state === "INCOMPLETE").map((row) => row.symbol),
    ),
    a1: {
      state: a1Source.state,
      ordinarySymbolCount: a1Source.snapshotBatch?.ordinarySymbolCount || 0,
      blockerCodes: Object.freeze([
        ...(a1Source.snapshotBatch?.blockerCodes || []),
      ]),
      decisionClockMode: a1Source.decisionClockMode || null,
    },
    history: {
      state: historyCoverage.state,
      globalIntegrityState: historyCoverage.globalIntegrityState || null,
      globalBlockerCodes: Object.freeze([
        ...(historyCoverage.globalBlockerCodes || []),
      ]),
      currentUniverseCount: historyCoverage.currentUniverseCount,
      accountedSymbolCount: historyCoverage.accountedSymbolCount ?? symbolAccounts.length,
      accountingComplete,
      historyReadyCount: historyCoverage.historyReadyCount,
      continuityReadyCount: historyCoverage.continuityReadyCount,
      symbolLocalIncompleteCount,
      ambiguousSymbolCount: historyCoverage.ambiguousSymbolCount,
      historyCoverage: historyCoverage.historyCoverage,
      continuityCoverage: historyCoverage.continuityCoverage,
      selectionDenominatorComplete,
    },
    assessors: assessorReadiness,
    capacityWriteAuthorized: globalInputsReady && assessorReady,
    zeroPickMayBeClaimed: globalInputsReady && assessorReady && selectionDenominatorComplete,
    captureArmRequested: false,
    scheduledCaptureAuthorized: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
    externalMutationPerformed: false,
  });
}
