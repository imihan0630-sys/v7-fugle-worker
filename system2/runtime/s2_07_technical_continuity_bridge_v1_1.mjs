import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_TECHNICAL_CONTINUITY_BRIDGE_VERSION = "1.1-RESEARCH";

function text(value) {
  return value == null ? "" : String(value).trim();
}

function positiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function nearlyEqual(a, b) {
  const x = Number(a), y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  return Math.abs(x - y) <= Math.max(1e-8, Math.max(Math.abs(x), Math.abs(y)) * 1e-8);
}

function rawBoundaryBar(row) {
  if (!row || typeof row !== "object") return null;
  return deepFreeze({
    market: text(row.market).toUpperCase() || null,
    symbol: text(row.symbol) || null,
    marketDate: text(row.marketDate ?? row.market_date) || null,
    canonicalKey: text(row.canonicalKey ?? row.canonical_key) || null,
    priceSpace: text(row.priceSpace ?? row.price_space).toUpperCase() || null,
    open: positiveNumber(row.open),
    high: positiveNumber(row.high),
    low: positiveNumber(row.low),
    close: positiveNumber(row.close),
    sourceId: text(row.sourceId ?? row.source_id) || null,
    sourceRowHash: text(row.sourceRowHash ?? row.source_row_hash) || null,
    barHash: text(row.barHash ?? row.bar_hash) || null,
    observedAt: text(row.observedAt ?? row.observed_at) || null,
    availableAt: text(row.availableAt ?? row.available_at) || null,
    pitReplayEligible: row.pitReplayEligible === true
      || row.pit_replay_eligible === true
      || row.pit_replay_eligible === 1
      || row.pit_replay_eligible === "1",
    continuityState: text(row.continuityState ?? row.continuity_state) || null,
  });
}

export function evaluateBoundedTechnicalContinuityBridgeV1_1({
  rawA1LineageCase,
  officialEvent,
  preSuspensionRawBar,
  resumeRawBar,
} = {}) {
  if (!rawA1LineageCase || typeof rawA1LineageCase !== "object") {
    throw new Error("rawA1LineageCase is required");
  }
  if (!officialEvent || typeof officialEvent !== "object") {
    throw new Error("officialEvent is required");
  }

  const market = text(rawA1LineageCase.market).toUpperCase();
  const symbol = text(rawA1LineageCase.symbol);
  const family = text(rawA1LineageCase.family);
  const previousOfficialSession = text(rawA1LineageCase.previousOfficialSession);
  const resumeTradingDate = text(rawA1LineageCase.resumeTradingDate);
  const blockers = [];

  const lineageStateReady = rawA1LineageCase.state === "BOUNDED_RAW_A1_LINEAGE_READY";
  const lineageFlagContradiction =
    typeof rawA1LineageCase.rawA1LineageBound === "boolean"
    && rawA1LineageCase.rawA1LineageBound !== true;
  if (!lineageStateReady || lineageFlagContradiction) {
    blockers.push("RAW_A1_LINEAGE_NOT_READY");
  }

  if (text(officialEvent.exchange).toUpperCase() !== market
      || text(officialEvent.symbol) !== symbol
      || text(officialEvent.actionFamilyId) !== family) {
    blockers.push("OFFICIAL_EVENT_IDENTITY_MISMATCH");
  }
  if (text(officialEvent.effectiveDate) !== resumeTradingDate) {
    blockers.push("OFFICIAL_EVENT_EFFECTIVE_DATE_MISMATCH");
  }
  if (officialEvent.actualResultVerified !== true
      || officialEvent.technicalContinuityEvidenceEligible !== true
      || text(officialEvent.continuityEffectState) !== "VERIFIED") {
    blockers.push("OFFICIAL_REFERENCE_PAIR_NOT_VERIFIED");
  }

  const effect = officialEvent.continuityEffect || {};
  const officialPreActionClose = positiveNumber(effect.preActionClose);
  const officialReferencePrice = positiveNumber(effect.officialReferencePrice);
  const officialRatio = positiveNumber(effect.referencePriceRatio);
  if (!officialPreActionClose || !officialReferencePrice || !officialRatio) {
    blockers.push("OFFICIAL_REFERENCE_PAIR_INCOMPLETE");
  } else if (!nearlyEqual(officialReferencePrice / officialPreActionClose, officialRatio)) {
    blockers.push("OFFICIAL_REFERENCE_RATIO_INCONSISTENT");
  }

  const pre = rawBoundaryBar(preSuspensionRawBar);
  const resume = rawBoundaryBar(resumeRawBar);
  if (!pre) blockers.push("PRE_SUSPENSION_RAW_BAR_MISSING");
  if (!resume) blockers.push("RESUME_RAW_BAR_MISSING");

  for (const [label, row, expectedDate] of [
    ["PRE", pre, previousOfficialSession],
    ["RESUME", resume, resumeTradingDate],
  ]) {
    if (!row) continue;
    if (row.market !== market || row.symbol !== symbol || row.marketDate !== expectedDate) {
      blockers.push(label + "_RAW_BAR_IDENTITY_MISMATCH");
    }
    if (row.priceSpace !== "RAW") blockers.push(label + "_RAW_BAR_PRICE_SPACE_NOT_RAW");
    if (!row.sourceId || !row.sourceRowHash || !row.barHash) {
      blockers.push(label + "_RAW_BAR_PROVENANCE_MISSING");
    }
    if (![row.open,row.high,row.low,row.close].every((v) => Number.isFinite(v) && v > 0)) {
      blockers.push(label + "_RAW_OHLC_INCOMPLETE");
    }
  }

  if (pre && officialPreActionClose && !nearlyEqual(pre.close, officialPreActionClose)) {
    blockers.push("PRE_SUSPENSION_CLOSE_OFFICIAL_MISMATCH");
  }

  const transformedPreClose = pre?.close && officialRatio
    ? pre.close * officialRatio
    : null;
  if (transformedPreClose && officialReferencePrice
      && !nearlyEqual(transformedPreClose, officialReferencePrice)) {
    blockers.push("MECHANICAL_RESET_BRIDGE_MISMATCH");
  }

  const historicalKnowledgeUnknown =
    officialEvent.knowledgeTimeMode === "HISTORICAL_UNKNOWN"
    || officialEvent.firstKnownAt == null
    || officialEvent.availableAt == null
    || officialEvent.pitEventReplayEligible !== true;

  const uniqueBlockers = [...new Set(blockers)];
  const bridgeReady = uniqueBlockers.length === 0;
  const residualOpenGapRate = bridgeReady && resume?.open && officialReferencePrice
    ? resume.open / officialReferencePrice - 1
    : null;
  const residualCloseMoveRate = bridgeReady && resume?.close && officialReferencePrice
    ? resume.close / officialReferencePrice - 1
    : null;

  return deepFreeze({
    schemaVersion: "S2_S2_07_TECHNICAL_CONTINUITY_BRIDGE_V1_1",
    version: S2_07_TECHNICAL_CONTINUITY_BRIDGE_VERSION,
    market,
    symbol,
    family,
    previousOfficialSession,
    resumeTradingDate,
    officialEventVersionId: text(officialEvent.eventVersionId) || null,
    officialSourceCaptureId: text(officialEvent.sourceCaptureId) || null,
    officialSourceRowHash: text(officialEvent.sourceRowHash) || null,
    officialKnowledgeTimeMode: text(officialEvent.knowledgeTimeMode) || null,
    officialPreActionClose,
    officialReferencePrice,
    officialReferencePriceRatio: officialRatio,
    rawPreSuspensionClose: pre?.close ?? null,
    transformedPreSuspensionCloseInReferenceSpace: transformedPreClose,
    resumeRawOpen: resume?.open ?? null,
    resumeRawClose: resume?.close ?? null,
    residualOpenGapRate,
    residualCloseMoveRate,
    preSuspensionRawBar: pre,
    resumeRawBar: resume,
    state: bridgeReady
      ? historicalKnowledgeUnknown
        ? "BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED"
        : "BOUNDED_CONTINUITY_BRIDGE_READY"
      : "BOUNDED_CONTINUITY_BRIDGE_BLOCKED",
    blockers: deepFreeze(uniqueBlockers),
    boundedTechnicalContinuityBridgeReady: bridgeReady,
    mechanicalResetNeutralizedForBoundaryResearch: bridgeReady,
    residualMoveSeparatedFromMechanicalReset: bridgeReady,
    pitTechnicalContinuityReplayEligible: bridgeReady && !historicalKnowledgeUnknown,
    pitReplayBlocker: bridgeReady && historicalKnowledgeUnknown
      ? "OFFICIAL_EVENT_KNOWLEDGE_CLOCK_HISTORICAL_UNKNOWN"
      : null,
    technicalContinuityScope: bridgeReady ? "EVENT_BOUNDARY_ONLY" : "NONE",
    technicalContinuityCertified: false,
    allHistoryContinuityCertified: false,
    continuityTransformPerformed: false,
    historyMutationPerformed: false,
    adjustedHistoryPersisted: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
