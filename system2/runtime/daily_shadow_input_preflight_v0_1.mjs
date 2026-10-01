import { deepFreeze } from "./factor_snapshot.mjs";
import { resolveDailyShadowAssessorReadinessV0_1 } from "./daily_shadow_assessor_readiness_v0_1.mjs";

export const DAILY_SHADOW_INPUT_PREFLIGHT_VERSION = "0.1-RESEARCH";

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

  if (a1Source.state !== "READY") {
    blockers.push({
      layer: "CURRENT_A1_SOURCE",
      code: `A1_SOURCE_${a1Source.state}`,
    });
  }
  if (historyCoverage.state !== "READY") {
    blockers.push({
      layer: "PIT_HISTORY",
      code: `PIT_HISTORY_${historyCoverage.state}`,
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
    historyCoverage.state === "READY";
  const assessorReady = assessorReadiness.every((x) => x.state === "READY");
  const state = !sourceAndHistoryReady
    ? "INPUTS_NOT_READY"
    : !assessorReady
      ? "ASSESSOR_POLICY_BLOCKED"
      : "READY_FOR_AUTHORIZED_SHADOW_EVALUATION";

  return deepFreeze({
    version: DAILY_SHADOW_INPUT_PREFLIGHT_VERSION,
    marketDate: date,
    decisionTimestamp: clock,
    state,
    sourceAndHistoryReady,
    assessorReady,
    blockers: Object.freeze(blockers),
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
      currentUniverseCount: historyCoverage.currentUniverseCount,
      historyReadyCount: historyCoverage.historyReadyCount,
      continuityReadyCount: historyCoverage.continuityReadyCount,
      ambiguousSymbolCount: historyCoverage.ambiguousSymbolCount,
      historyCoverage: historyCoverage.historyCoverage,
      continuityCoverage: historyCoverage.continuityCoverage,
    },
    assessors: assessorReadiness,
    capacityWriteAuthorized: sourceAndHistoryReady && assessorReady,
    zeroPickMayBeClaimed: sourceAndHistoryReady && assessorReady,
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
