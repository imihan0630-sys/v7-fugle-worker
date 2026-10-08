import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { classifyCorporateActionSymbolWindowV0_1 } from "./corporate_action_continuity_archive_v0_1.mjs";

export const NCT01_CONTINUITY_REPLAY_BINDING_VERSION = "0.1-RESEARCH";

const HASH64 = /^[a-f0-9]{64}$/i;
const EXPECTED_TWSE_FAMILIES = Object.freeze([
  "CAPITAL_REDUCTION",
  "EX_RIGHT_DIVIDEND",
  "PAR_VALUE_CHANGE",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(Date.parse(text + "T00:00:00Z"))) {
    throw new Error(field + " must be YYYY-MM-DD");
  }
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return new Date(text).toISOString();
}

function hash64(value) {
  return typeof value === "string" && HASH64.test(value);
}

function uniqueSorted(values = []) {
  return [...new Set((values || []).map(String))].sort();
}

function sameArray(a, b) {
  return Array.isArray(a) && Array.isArray(b) && JSON.stringify(a) === JSON.stringify(b);
}

function normalizeReplayBar(bar, index, blockers) {
  const date = typeof bar?.date === "string" ? bar.date : null;
  const sourceId = typeof bar?.sourceId === "string" && bar.sourceId.trim() ? bar.sourceId.trim() : null;
  const sourceRowHash = typeof bar?.sourceRowHash === "string" && bar.sourceRowHash.trim() ? bar.sourceRowHash.trim() : null;
  const availableAt = typeof bar?.availableAt === "string" && Number.isFinite(Date.parse(bar.availableAt))
    ? new Date(bar.availableAt).toISOString()
    : null;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) blockers.push("RAW_REPLAY_BAR_DATE_INVALID");
  if (!sourceId) blockers.push("RAW_REPLAY_SOURCE_ID_MISSING");
  if (!sourceRowHash) blockers.push("RAW_REPLAY_SOURCE_ROW_IDENTITY_MISSING");
  if (!availableAt) blockers.push("RAW_REPLAY_AVAILABLE_AT_MISSING");
  const numeric = ["open", "high", "low", "close", "volumeShares"];
  for (const field of numeric) {
    if (!Number.isFinite(Number(bar?.[field]))) blockers.push("RAW_REPLAY_" + field.toUpperCase() + "_INVALID");
  }
  if (bar?.tradeValue !== null && bar?.tradeValue !== undefined && !Number.isFinite(Number(bar.tradeValue))) {
    blockers.push("RAW_REPLAY_TRADE_VALUE_INVALID");
  }
  return {
    ordinal: index,
    date,
    sourceId,
    sourceRowHash,
    availableAt,
    open: Number.isFinite(Number(bar?.open)) ? Number(bar.open) : null,
    high: Number.isFinite(Number(bar?.high)) ? Number(bar.high) : null,
    low: Number.isFinite(Number(bar?.low)) ? Number(bar.low) : null,
    close: Number.isFinite(Number(bar?.close)) ? Number(bar.close) : null,
    volumeShares: Number.isFinite(Number(bar?.volumeShares)) ? Number(bar.volumeShares) : null,
    tradeValue: bar?.tradeValue === null || bar?.tradeValue === undefined
      ? null
      : Number.isFinite(Number(bar.tradeValue)) ? Number(bar.tradeValue) : null,
  };
}

export async function buildNct01ReplaySourceIdentityV0_1({ replayWindow } = {}) {
  const blockers = [];
  if (!replayWindow || typeof replayWindow !== "object") {
    return deepFreeze({
      schemaVersion: "S2_NCT01_RAW_REPLAY_SOURCE_IDENTITY_V0_1",
      state: "INCOMPLETE",
      blockerCodes: Object.freeze(["PIT_REPLAY_WINDOW_MISSING"]),
      sourceHistoryHash: null,
    });
  }

  const bars = Array.isArray(replayWindow.bars) ? replayWindow.bars : [];
  const normalizedBars = bars.map((bar, index) => normalizeReplayBar(bar, index, blockers));
  const dates = normalizedBars.map((x) => x.date).filter(Boolean);
  if (dates.length !== bars.length) blockers.push("RAW_REPLAY_DATESET_INCOMPLETE");
  if (new Set(dates).size !== dates.length) blockers.push("RAW_REPLAY_DATESET_DUPLICATE");
  if (JSON.stringify(dates) !== JSON.stringify([...dates].sort())) blockers.push("RAW_REPLAY_DATESET_NOT_ORDERED");
  if (replayWindow.state !== "READY") blockers.push("PIT_REPLAY_NOT_READY");
  if (replayWindow.pointInTimeEligible !== true) blockers.push("PIT_REPLAY_NOT_POINT_IN_TIME_ELIGIBLE");
  if (replayWindow.targetBarPresent !== true) blockers.push("PIT_REPLAY_TARGET_BAR_MISSING");
  if (Number(replayWindow.selectedSessionCount) !== bars.length) blockers.push("PIT_REPLAY_SESSION_COUNT_MISMATCH");
  if (bars.length !== Number(replayWindow.lookbackSessions)) blockers.push("PIT_REPLAY_LOOKBACK_NOT_COMPLETE");
  if (replayWindow.priceSpace !== "RAW") blockers.push("PIT_REPLAY_NOT_RAW_PRICE_SPACE");

  const uniqueBlockers = uniqueSorted(blockers);
  const base = {
    schemaVersion: "S2_NCT01_RAW_REPLAY_SOURCE_IDENTITY_V0_1",
    version: NCT01_CONTINUITY_REPLAY_BINDING_VERSION,
    symbol: replayWindow.symbol || null,
    marketDate: replayWindow.marketDate || null,
    decisionTimestamp: replayWindow.decisionTimestamp || null,
    priceSpace: replayWindow.priceSpace || null,
    lookbackSessions: Number(replayWindow.lookbackSessions || 0),
    selectedSessionCount: bars.length,
    firstSelectedDate: dates[0] || null,
    lastSelectedDate: dates.at(-1) || null,
    selectedDates: Object.freeze(dates),
    bars: Object.freeze(normalizedBars),
  };
  const sourceHistoryHash = uniqueBlockers.length ? null : await sha256Hex(base);
  return deepFreeze({
    ...base,
    state: uniqueBlockers.length ? "INCOMPLETE" : "READY",
    blockerCodes: Object.freeze(uniqueBlockers),
    sourceHistoryHash,
    replayHash: replayWindow.replayHash || null,
  });
}

function normalizeSourceEvidenceRef(ref, index, decisionTimestamp, blockers) {
  const sourceId = typeof ref?.sourceId === "string" && ref.sourceId.trim() ? ref.sourceId.trim() : null;
  const digest = typeof ref?.digest === "string" ? ref.digest.toLowerCase() : null;
  const observedAt = typeof ref?.observedAt === "string" && Number.isFinite(Date.parse(ref.observedAt))
    ? new Date(ref.observedAt).toISOString()
    : null;
  const availableAt = typeof ref?.availableAt === "string" && Number.isFinite(Date.parse(ref.availableAt))
    ? new Date(ref.availableAt).toISOString()
    : null;
  const semantics = ref?.availabilitySemantics || "PROSPECTIVE_OBSERVED";
  if (!sourceId) blockers.push("SOURCE_EVIDENCE_SOURCE_ID_MISSING");
  if (!hash64(digest)) blockers.push("SOURCE_EVIDENCE_DIGEST_INVALID");
  if (!observedAt) blockers.push("SOURCE_EVIDENCE_OBSERVED_AT_INVALID");
  if (!["PROSPECTIVE_OBSERVED", "VERIFIED_SOURCE_TIMESTAMP"].includes(semantics)) {
    blockers.push("SOURCE_EVIDENCE_AVAILABILITY_SEMANTICS_INVALID");
  }
  if (semantics === "PROSPECTIVE_OBSERVED" && observedAt && Date.parse(observedAt) > Date.parse(decisionTimestamp)) {
    blockers.push("SOURCE_EVIDENCE_OBSERVED_AFTER_DECISION");
  }
  if (semantics === "VERIFIED_SOURCE_TIMESTAMP") {
    if (!availableAt) blockers.push("SOURCE_EVIDENCE_AVAILABLE_AT_REQUIRED");
    else if (Date.parse(availableAt) > Date.parse(decisionTimestamp)) blockers.push("SOURCE_EVIDENCE_AVAILABLE_AFTER_DECISION");
  }
  return {
    ordinal: index,
    sourceId,
    digest,
    observedAt,
    availableAt,
    availabilitySemantics: semantics,
  };
}

function expectedTwseSourceContractKeys() {
  return EXPECTED_TWSE_FAMILIES.map(
    (family) => "TWSE|" + family + "|HISTORICAL_ACTUAL_RESULT_RANGE",
  ).sort();
}

export async function buildNct01TwseClearNoActionPromotionReceiptV0_1({
  receiptId,
  replayWindow,
  archiveReceipt,
  universeState,
  symbolSessionEvidence,
  sourceEvidenceRefs = [],
  sourceFamilyVersion,
  rawHistoryAdmissionReceiptId,
  symbolSessionContractVersion,
  sessionCalendarVersion,
  continuityEngineVersion,
  corporateActionRegistryVersion,
  capturedAt,
  generatedAt = null,
} = {}) {
  const replayIdentity = await buildNct01ReplaySourceIdentityV0_1({ replayWindow });
  const blockers = [...(replayIdentity.blockerCodes || [])];
  const id = requiredText(receiptId, "receiptId");
  const symbol = replayWindow?.symbol ? requiredText(replayWindow.symbol, "replayWindow.symbol") : "";
  const marketDate = replayWindow?.marketDate ? isoDate(replayWindow.marketDate, "replayWindow.marketDate") : "";
  const decisionTimestamp = replayWindow?.decisionTimestamp
    ? isoTimestamp(replayWindow.decisionTimestamp, "replayWindow.decisionTimestamp")
    : "";
  const evidenceCapturedAt = isoTimestamp(capturedAt, "capturedAt");
  const emittedAt = isoTimestamp(generatedAt || capturedAt, "generatedAt");
  let verifiedArchiveReceiptHash = null;
  let twseSuspensionEvidence = null;

  if (replayIdentity.state !== "READY" || !hash64(replayIdentity.sourceHistoryHash)) {
    blockers.push("REPLAY_SOURCE_IDENTITY_NOT_READY");
  }
  if (replayWindow?.priceSpace !== "RAW") blockers.push("FIRST_WITNESS_REQUIRES_RAW_PRICE_SPACE");
  if (Date.parse(evidenceCapturedAt) > Date.parse(decisionTimestamp)) blockers.push("CONTINUITY_CAPTURE_AFTER_DECISION");

  if (!archiveReceipt || typeof archiveReceipt !== "object") {
    blockers.push("CORPORATE_ACTION_COMPLETENESS_RECEIPT_MISSING");
  }
  if (archiveReceipt) {
    if (archiveReceipt.schemaVersion !== "S2_CA_COMPLETENESS_RECEIPT_V0_2") {
      blockers.push("CORPORATE_ACTION_COMPLETENESS_RECEIPT_V0_2_REQUIRED");
    }
    if (archiveReceipt.evidenceBoundSuspensionCompleteness !== true) {
      blockers.push("SUSPENSION_EVIDENCE_BOUND_SEMANTICS_REQUIRED");
    }
    if (!hash64(archiveReceipt.receiptHash)) {
      blockers.push("ARCHIVE_RECEIPT_HASH_INVALID");
    } else {
      const { receiptHash, ...archiveHashBase } = archiveReceipt;
      const recomputedArchiveHash = await sha256Hex(archiveHashBase);
      if (recomputedArchiveHash !== receiptHash) {
        blockers.push("ARCHIVE_RECEIPT_HASH_MISMATCH");
      } else {
        verifiedArchiveReceiptHash = receiptHash;
      }
    }
    twseSuspensionEvidence = archiveReceipt.suspensionEvidenceByExchange?.TWSE || null;
    if (!twseSuspensionEvidence || typeof twseSuspensionEvidence !== "object") {
      blockers.push("TWSE_SUSPENSION_EVIDENCE_MISSING");
    } else {
      if (twseSuspensionEvidence.exchange !== "TWSE") blockers.push("TWSE_SUSPENSION_EVIDENCE_EXCHANGE_MISMATCH");
      if (twseSuspensionEvidence.coverageState !== "COMPLETE") blockers.push("TWSE_SUSPENSION_EVIDENCE_NOT_COMPLETE");
      if (twseSuspensionEvidence.evidenceReady !== true) blockers.push("TWSE_SUSPENSION_EVIDENCE_NOT_READY");
      if (!hash64(twseSuspensionEvidence.receiptDigest)) blockers.push("TWSE_SUSPENSION_EVIDENCE_DIGEST_INVALID");
      if (typeof twseSuspensionEvidence.sourceId !== "string" || !twseSuspensionEvidence.sourceId) {
        blockers.push("TWSE_SUSPENSION_EVIDENCE_SOURCE_ID_MISSING");
      }
      if (typeof twseSuspensionEvidence.sourceFamily !== "string" || !twseSuspensionEvidence.sourceFamily) {
        blockers.push("TWSE_SUSPENSION_EVIDENCE_SOURCE_FAMILY_MISSING");
      }
      if (
        typeof twseSuspensionEvidence.sourceContractVersion !== "string" ||
        !twseSuspensionEvidence.sourceContractVersion
      ) {
        blockers.push("TWSE_SUSPENSION_EVIDENCE_SOURCE_CONTRACT_VERSION_MISSING");
      }
      if (twseSuspensionEvidence.requestedStartDate !== replayIdentity.firstSelectedDate) {
        blockers.push("TWSE_SUSPENSION_EVIDENCE_WINDOW_START_MISMATCH");
      }
      if (twseSuspensionEvidence.requestedEndDate !== replayIdentity.lastSelectedDate) {
        blockers.push("TWSE_SUSPENSION_EVIDENCE_WINDOW_END_MISMATCH");
      }
      const suspensionObservedAt =
        typeof twseSuspensionEvidence.observedAt === "string" &&
        Number.isFinite(Date.parse(twseSuspensionEvidence.observedAt))
          ? new Date(twseSuspensionEvidence.observedAt).toISOString()
          : null;
      const suspensionAvailableAt =
        typeof twseSuspensionEvidence.availableAt === "string" &&
        Number.isFinite(Date.parse(twseSuspensionEvidence.availableAt))
          ? new Date(twseSuspensionEvidence.availableAt).toISOString()
          : null;
      if (!suspensionObservedAt) blockers.push("TWSE_SUSPENSION_EVIDENCE_OBSERVED_AT_INVALID");
      if (
        twseSuspensionEvidence.availabilitySemantics === "PROSPECTIVE_OBSERVED" &&
        suspensionObservedAt &&
        Date.parse(suspensionObservedAt) > Date.parse(decisionTimestamp)
      ) {
        blockers.push("TWSE_SUSPENSION_EVIDENCE_OBSERVED_AFTER_DECISION");
      }
      if (twseSuspensionEvidence.availabilitySemantics === "VERIFIED_SOURCE_TIMESTAMP") {
        if (!suspensionAvailableAt) blockers.push("TWSE_SUSPENSION_EVIDENCE_AVAILABLE_AT_REQUIRED");
        else if (Date.parse(suspensionAvailableAt) > Date.parse(decisionTimestamp)) {
          blockers.push("TWSE_SUSPENSION_EVIDENCE_AVAILABLE_AFTER_DECISION");
        }
      }
    }
    if (archiveReceipt.eventCoverageComplete !== true) blockers.push("EVENT_COVERAGE_NOT_COMPLETE");
    if (archiveReceipt.noEventMayBeClaimed !== true) blockers.push("NO_EVENT_NOT_CLAIMABLE");
    if (archiveReceipt.suspensionCoverageComplete !== true) blockers.push("SUSPENSION_COVERAGE_NOT_COMPLETE");
    if (archiveReceipt.symbolSessionCompletenessEvidenceReady !== true) blockers.push("SYMBOL_SESSION_EVIDENCE_NOT_READY");
    if (archiveReceipt.suspensionCoverageByExchange?.TWSE !== "COMPLETE") blockers.push("TWSE_SUSPENSION_COVERAGE_NOT_COMPLETE");
    if (archiveReceipt.interval?.startDate !== replayIdentity.firstSelectedDate) blockers.push("ARCHIVE_WINDOW_START_MISMATCH");
    if (archiveReceipt.interval?.endDate !== replayIdentity.lastSelectedDate) blockers.push("ARCHIVE_WINDOW_END_MISMATCH");
    if (
      typeof archiveReceipt.generatedAt !== "string" ||
      !Number.isFinite(Date.parse(archiveReceipt.generatedAt)) ||
      Date.parse(archiveReceipt.generatedAt) > Date.parse(decisionTimestamp)
    ) {
      blockers.push("ARCHIVE_RECEIPT_AFTER_DECISION_OR_INVALID");
    }
    const observedContractKeys = (archiveReceipt.requiredSourceContracts || []).map((x) =>
      [x.exchange, x.actionFamilyId, x.sourceClass].join("|"),
    ).sort();
    if (!sameArray(observedContractKeys, expectedTwseSourceContractKeys())) {
      blockers.push("TWSE_REQUIRED_SOURCE_CONTRACT_SET_MISMATCH");
    }
  }

  let classification = { state: "EVENT_COVERAGE_UNKNOWN", reason: "ARCHIVE_RECEIPT_MISSING", eventVersionIds: [] };
  if (archiveReceipt && symbol) {
    try {
      classification = classifyCorporateActionSymbolWindowV0_1({
        receipt: archiveReceipt,
        exchange: "TWSE",
        symbol,
        universeState,
        actionFamilyIds: EXPECTED_TWSE_FAMILIES,
      });
    } catch {
      blockers.push("CORPORATE_ACTION_SYMBOL_CLASSIFICATION_FAILED");
    }
  }
  if (universeState !== "IN_SCOPE") blockers.push("PIT_UNIVERSE_NOT_IN_SCOPE");
  if (classification.state === "EVENT_PRESENT") blockers.push("CORPORATE_ACTION_EVENT_PRESENT");
  else if (classification.state !== "NO_EVENT") blockers.push("CORPORATE_ACTION_NO_EVENT_NOT_PROVEN");

  const session = symbolSessionEvidence && typeof symbolSessionEvidence === "object"
    ? symbolSessionEvidence
    : {};
  const expectedDates = Array.isArray(session.expectedEligibleSymbolSessions)
    ? session.expectedEligibleSymbolSessions.map(String)
    : [];
  const expectedSessionHash = await sha256Hex({
    market: "TWSE",
    symbol,
    marketDate,
    dates: replayIdentity.selectedDates || [],
  });
  if (!sameArray(expectedDates, replayIdentity.selectedDates || [])) blockers.push("EXPECTED_SESSION_DATESET_MISMATCH");
  if (session.exactSessionReconciliationReady !== true) blockers.push("EXACT_SESSION_RECONCILIATION_NOT_READY");
  if (session.historyReady !== true) blockers.push("HISTORY_READY_FALSE");
  if (Number(session.missingExpectedSessionCount || 0) !== 0) blockers.push("UNRESOLVED_EXPECTED_SESSION_GAP");
  if (Number(session.unexpectedSessionCount || 0) !== 0) blockers.push("UNEXPECTED_SELECTED_SESSION");
  if (Number(session.expectedSessionCount || 0) !== (replayIdentity.selectedDates || []).length) blockers.push("EXPECTED_SESSION_COUNT_MISMATCH");
  if (Number(session.observedExpectedSessionCount || 0) !== (replayIdentity.selectedDates || []).length) blockers.push("OBSERVED_EXPECTED_SESSION_COUNT_MISMATCH");
  if (session.expectedSessionHash !== expectedSessionHash) blockers.push("EXPECTED_SESSION_HASH_MISMATCH");
  if (session.observedSessionHash !== expectedSessionHash) blockers.push("OBSERVED_SESSION_HASH_MISMATCH");

  const refBlockers = [];
  const refs = (sourceEvidenceRefs || []).map(
    (ref, index) => normalizeSourceEvidenceRef(ref, index, decisionTimestamp, refBlockers),
  );
  blockers.push(...refBlockers);
  if (!refs.length) blockers.push("SOURCE_EVIDENCE_REFS_MISSING");
  if (archiveReceipt) {
    const refIds = new Set(refs.map((x) => x.sourceId).filter(Boolean));
    for (const result of archiveReceipt.sourceContractResults || []) {
      if (result.satisfied !== true) blockers.push("ARCHIVE_SOURCE_CONTRACT_UNSATISFIED");
      const matched = (result.satisfyingSourceIds || []).some((sourceId) => refIds.has(sourceId));
      if (!matched) blockers.push("ARCHIVE_SOURCE_CONTRACT_NOT_BOUND_TO_SOURCE_REF");
    }

    if (twseSuspensionEvidence && typeof twseSuspensionEvidence === "object") {
      const expectedSourceId = twseSuspensionEvidence.sourceId || null;
      const expectedDigest = twseSuspensionEvidence.receiptDigest || null;
      const sourceIdMatched = refs.some((ref) => ref.sourceId === expectedSourceId);
      const digestMatched = refs.some((ref) => ref.digest === expectedDigest);
      const pairMatches = refs.filter(
        (ref) => ref.sourceId === expectedSourceId && ref.digest === expectedDigest,
      );
      if (!pairMatches.length) {
        if (sourceIdMatched && !digestMatched) blockers.push("TWSE_SUSPENSION_SOURCE_REF_DIGEST_MISMATCH");
        else if (digestMatched && !sourceIdMatched) blockers.push("TWSE_SUSPENSION_SOURCE_REF_SOURCE_ID_MISMATCH");
        else if (sourceIdMatched && digestMatched) blockers.push("TWSE_SUSPENSION_SOURCE_REF_PAIR_MISMATCH");
        else blockers.push("TWSE_SUSPENSION_SOURCE_REF_MISSING");
      } else {
        const timingMatched = pairMatches.some((ref) =>
          ref.observedAt === twseSuspensionEvidence.observedAt &&
          ref.availableAt === (twseSuspensionEvidence.availableAt || null) &&
          ref.availabilitySemantics === twseSuspensionEvidence.availabilitySemantics
        );
        if (!timingMatched) blockers.push("TWSE_SUSPENSION_SOURCE_REF_TIMING_MISMATCH");
      }
    }
  }

  const sourceFamily = requiredText(sourceFamilyVersion, "sourceFamilyVersion");
  const rawAdmission = requiredText(rawHistoryAdmissionReceiptId, "rawHistoryAdmissionReceiptId");
  const symbolSessionVersion = requiredText(symbolSessionContractVersion, "symbolSessionContractVersion");
  const calendarVersion = requiredText(sessionCalendarVersion, "sessionCalendarVersion");
  const engineVersion = requiredText(continuityEngineVersion, "continuityEngineVersion");
  const registryVersion = requiredText(corporateActionRegistryVersion, "corporateActionRegistryVersion");

  const archiveReceiptHash = verifiedArchiveReceiptHash;
  const sourceEvidenceHash = refs.length ? await sha256Hex(refs) : null;
  const continuityTransformHash = hash64(replayIdentity.sourceHistoryHash)
    ? await sha256Hex({
        transform: "RAW_NO_OP_CLEAR_NO_ACTION_V0_1",
        sourceHistoryHash: replayIdentity.sourceHistoryHash,
        selectedDates: replayIdentity.selectedDates,
        priceSpace: "RAW",
      })
    : null;

  const uniqueBlockers = uniqueSorted(blockers);
  const disposition = classification.state === "EVENT_PRESENT"
    ? "ADJUSTED_CONTINUITY_REQUIRED"
    : uniqueBlockers.length
      ? "CONTINUITY_UNKNOWN"
      : "CLEAR_NO_ACTION_ELIGIBLE";

  const base = {
    schemaVersion: "S2_NCT01_TWSE_CONTINUITY_PROMOTION_RECEIPT_V0_1",
    receiptVersion: NCT01_CONTINUITY_REPLAY_BINDING_VERSION,
    continuityReceiptId: id,
    symbol,
    market: "TWSE",
    asOf: marketDate,
    decisionTimestamp,
    capturedAt: evidenceCapturedAt,
    generatedAt: emittedAt,
    sourceFamilyVersion: sourceFamily,
    sourceHistoryHash: replayIdentity.sourceHistoryHash,
    rawHistoryAdmissionReceiptId: rawAdmission,
    symbolSessionContractVersion: symbolSessionVersion,
    sessionCalendarVersion: calendarVersion,
    continuityEngineVersion: engineVersion,
    corporateActionRegistryVersion: registryVersion,
    continuitySpace: "TECHNICAL_CONTINUITY",
    priceSpace: "RAW",
    continuityTransformPerformed: false,
    continuityTransformHash,
    replayHash: replayIdentity.replayHash,
    expectedEligibleSymbolSessions: Object.freeze([...(replayIdentity.selectedDates || [])]),
    expectedEligibleSymbolSessionCount: (replayIdentity.selectedDates || []).length,
    sourceBarsThrough: replayIdentity.lastSelectedDate,
    unresolvedMissingSessions: Number(session.missingExpectedSessionCount || 0),
    unresolvedRelevantEvents: classification.state === "NO_EVENT" ? 0 : classification.eventVersionIds?.length || 0,
    pseudoBarsRejected: 0,
    expectedSessionHash: session.expectedSessionHash || null,
    observedSessionHash: session.observedSessionHash || null,
    exactSessionReconciliationReady: session.exactSessionReconciliationReady === true,
    archiveReceiptHash,
    sourceEvidenceHash,
    sourceEvidenceRefs: Object.freeze(refs),
    sourceBarIdentities: Object.freeze([...(replayIdentity.bars || [])]),
    classification: deepFreeze({
      state: classification.state,
      reason: classification.reason || null,
      eventVersionIds: Object.freeze([...(classification.eventVersionIds || [])]),
    }),
    disposition,
    blockerCodes: Object.freeze(uniqueBlockers),
    technicalContinuityCertified: disposition === "CLEAR_NO_ACTION_ELIGIBLE",
    symbolSessionCompletenessCertified: disposition === "CLEAR_NO_ACTION_ELIGIBLE",
    historyMutationPerformed: false,
    strategyEvaluationPerformed: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  };
  const receiptHash = await sha256Hex(base);
  return deepFreeze({ ...base, receiptHash });
}

export async function bindNct01ContinuityReceiptToReplayV0_1({
  continuityReceipt,
  replayWindow,
  symbol,
  marketDate,
  decisionTimestamp,
} = {}) {
  const replayIdentity = await buildNct01ReplaySourceIdentityV0_1({ replayWindow });
  const blockers = [...(replayIdentity.blockerCodes || [])];
  const code = requiredText(symbol, "symbol");
  const date = isoDate(marketDate, "marketDate");
  const clock = isoTimestamp(decisionTimestamp, "decisionTimestamp");

  if (!continuityReceipt || typeof continuityReceipt !== "object") {
    blockers.push("CONTINUITY_RECEIPT_MISSING");
  } else {
    const { receiptHash, ...hashBase } = continuityReceipt;
    if (!hash64(receiptHash)) blockers.push("CONTINUITY_RECEIPT_HASH_INVALID");
    else if (await sha256Hex(hashBase) !== receiptHash) blockers.push("CONTINUITY_RECEIPT_HASH_MISMATCH");

    if (continuityReceipt.symbol !== code) blockers.push("CONTINUITY_RECEIPT_SYMBOL_MISMATCH");
    if (continuityReceipt.asOf !== date) blockers.push("CONTINUITY_RECEIPT_ASOF_MISMATCH");
    if (continuityReceipt.decisionTimestamp !== clock) blockers.push("CONTINUITY_RECEIPT_DECISION_TIMESTAMP_MISMATCH");
    if (
      typeof continuityReceipt.capturedAt !== "string" ||
      !Number.isFinite(Date.parse(continuityReceipt.capturedAt)) ||
      Date.parse(continuityReceipt.capturedAt) > Date.parse(clock)
    ) {
      blockers.push("CONTINUITY_RECEIPT_CAPTURE_AFTER_DECISION_OR_INVALID");
    }
    if (continuityReceipt.priceSpace !== "RAW") blockers.push("CONTINUITY_RECEIPT_PRICE_SPACE_NOT_RAW");
    if (continuityReceipt.continuityTransformPerformed !== false) blockers.push("RAW_CONTINUITY_TRANSFORM_MUST_BE_NO_OP");
    if (continuityReceipt.disposition === "ADJUSTED_CONTINUITY_REQUIRED") blockers.push("RAW_ADJUSTED_CONTINUITY_FORBIDDEN");
    else if (continuityReceipt.disposition !== "CLEAR_NO_ACTION_ELIGIBLE") blockers.push("CLEAR_NO_ACTION_NOT_CERTIFIED");
    if (continuityReceipt.technicalContinuityCertified !== true) blockers.push("TECHNICAL_CONTINUITY_NOT_CERTIFIED");
    if (continuityReceipt.symbolSessionCompletenessCertified !== true) blockers.push("SYMBOL_SESSION_COMPLETENESS_NOT_CERTIFIED");
    if (continuityReceipt.sourceHistoryHash !== replayIdentity.sourceHistoryHash) blockers.push("SOURCE_HISTORY_HASH_MISMATCH");
    if (continuityReceipt.replayHash !== replayIdentity.replayHash) blockers.push("PIT_REPLAY_HASH_MISMATCH");
    if (!sameArray(continuityReceipt.expectedEligibleSymbolSessions || [], replayIdentity.selectedDates || [])) {
      blockers.push("ELIGIBLE_DATE_SET_MISMATCH");
    }
    if (Number(continuityReceipt.unresolvedMissingSessions || 0) !== 0) blockers.push("UNRESOLVED_MISSING_SESSIONS");
    if (Number(continuityReceipt.unresolvedRelevantEvents || 0) !== 0) blockers.push("UNRESOLVED_RELEVANT_EVENTS");
    if (Number(continuityReceipt.pseudoBarsRejected || 0) !== 0) blockers.push("PSEUDO_BAR_REJECTION_NONZERO");

    const requiredIdentityFields = [
      "continuityReceiptId",
      "receiptVersion",
      "sourceFamilyVersion",
      "rawHistoryAdmissionReceiptId",
      "symbolSessionContractVersion",
      "sessionCalendarVersion",
      "continuityEngineVersion",
      "corporateActionRegistryVersion",
    ];
    for (const field of requiredIdentityFields) {
      if (typeof continuityReceipt[field] !== "string" || !continuityReceipt[field].trim()) {
        blockers.push(field.toUpperCase() + "_MISSING");
      }
    }
    if (!hash64(continuityReceipt.sourceHistoryHash)) blockers.push("SOURCE_HISTORY_HASH_INVALID");
    if (!hash64(continuityReceipt.continuityTransformHash)) blockers.push("CONTINUITY_TRANSFORM_HASH_INVALID");
  }

  const uniqueBlockers = uniqueSorted(blockers);
  const ready = uniqueBlockers.length === 0;
  const base = {
    schemaVersion: "S2_NCT01_CONTINUITY_REPLAY_BINDING_V0_1",
    version: NCT01_CONTINUITY_REPLAY_BINDING_VERSION,
    symbol: code,
    marketDate: date,
    decisionTimestamp: clock,
    state: ready ? "READY" : "INCOMPLETE",
    continuityState: ready ? "CLEAR_NO_ACTION" : "UNVERIFIED",
    blockerCodes: Object.freeze(uniqueBlockers),
    replayHash: replayIdentity.replayHash || null,
    sourceHistoryHash: replayIdentity.sourceHistoryHash || null,
    continuityReceiptId: continuityReceipt?.continuityReceiptId || null,
    continuityReceiptHash: continuityReceipt?.receiptHash || null,
    continuityTransformHash: continuityReceipt?.continuityTransformHash || null,
    selectedSessionCount: replayIdentity.selectedSessionCount || 0,
    selectedDates: Object.freeze([...(replayIdentity.selectedDates || [])]),
  };
  const bindingHash = await sha256Hex(base);
  return deepFreeze({ ...base, bindingHash });
}

export function nct01ContinuitySourceManifestRefsV0_1({ replayWindow, binding } = {}) {
  const refs = [];
  if (hash64(replayWindow?.replayHash)) {
    refs.push({
      refType: "PIT_REPLAY_SHA256",
      digest: replayWindow.replayHash,
    });
  }
  if (hash64(binding?.sourceHistoryHash)) {
    refs.push({
      refType: "SOURCE_HISTORY_SHA256",
      digest: binding.sourceHistoryHash,
    });
  }
  if (binding?.state === "READY" && hash64(binding?.continuityReceiptHash)) {
    refs.push({
      refType: "CONTINUITY_RECEIPT_SHA256",
      digest: binding.continuityReceiptHash,
      continuityReceiptId: binding.continuityReceiptId,
    });
  }
  if (binding?.state === "READY" && hash64(binding?.continuityTransformHash)) {
    refs.push({
      refType: "CONTINUITY_TRANSFORM_SHA256",
      digest: binding.continuityTransformHash,
    });
  }
  if (hash64(binding?.bindingHash)) {
    refs.push({
      refType: "CONTINUITY_BINDING_SHA256",
      digest: binding.bindingHash,
      state: binding.state,
    });
  }
  return Object.freeze(refs.map((x) => deepFreeze(x)));
}
