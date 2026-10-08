import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const CORPORATE_ACTION_CONTINUITY_ARCHIVE_VERSION = "0.1-RESEARCH";
export const CORPORATE_ACTION_COMPLETENESS_RECEIPT_V0_2_VERSION = "0.2-RESEARCH";

const EXCHANGES = new Set(["TWSE", "TPEX"]);
const KNOWLEDGE_TIME_MODES = new Set([
  "PROSPECTIVE_OBSERVED",
  "VERIFIED_SOURCE_TIMESTAMP",
  "HISTORICAL_UNKNOWN",
]);
const OUTCOME_STATES = new Set(["ACTIVE", "CANCELLED"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function optionalText(value) {
  return value === null || value === undefined || value === "" ? null : String(value).trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || !Number.isFinite(Date.parse(text + "T00:00:00Z"))) {
    throw new Error(`${field} must be YYYY-MM-DD`);
  }
  return text;
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return new Date(text).toISOString();
}

function nonNegativeInt(value, field) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${field} must be a non-negative integer`);
  return n;
}

function normalizeExchange(value) {
  const exchange = requiredText(value, "exchange").toUpperCase();
  if (!EXCHANGES.has(exchange)) throw new Error(`unsupported exchange: ${exchange}`);
  return exchange;
}

function sortedUnique(values = []) {
  return Object.freeze([...new Set((values || []).map((x) => String(x).trim()).filter(Boolean))].sort());
}

function timestampOrNull(value, field) {
  return value === null || value === undefined || value === "" ? null : isoTimestamp(value, field);
}

function dateOrNull(value, field) {
  return value === null || value === undefined || value === "" ? null : isoDate(value, field);
}

function normalizeKnowledgeTime({ mode, sourceCapture, firstKnownAt, availableAt }) {
  const knowledgeTimeMode = requiredText(mode, "knowledgeTimeMode");
  if (!KNOWLEDGE_TIME_MODES.has(knowledgeTimeMode)) {
    throw new Error(`unsupported knowledgeTimeMode: ${knowledgeTimeMode}`);
  }

  if (knowledgeTimeMode === "PROSPECTIVE_OBSERVED") {
    const observed = isoTimestamp(sourceCapture.fetchedAt, "sourceCapture.fetchedAt");
    return {
      knowledgeTimeMode,
      firstKnownAt: observed,
      availableAt: observed,
      knowledgeTimeClass: "OBSERVED_AVAILABLE_UPPER_BOUND",
      pitEventReplayEligible: true,
    };
  }

  if (knowledgeTimeMode === "VERIFIED_SOURCE_TIMESTAMP") {
    const first = isoTimestamp(firstKnownAt, "firstKnownAt");
    const available = isoTimestamp(availableAt ?? firstKnownAt, "availableAt");
    if (Date.parse(available) < Date.parse(first)) {
      throw new Error("availableAt cannot be earlier than firstKnownAt");
    }
    return {
      knowledgeTimeMode,
      firstKnownAt: first,
      availableAt: available,
      knowledgeTimeClass: "SOURCE_TIMESTAMP_VERIFIED",
      pitEventReplayEligible: true,
    };
  }

  if (firstKnownAt !== null && firstKnownAt !== undefined) {
    throw new Error("HISTORICAL_UNKNOWN must not fabricate firstKnownAt");
  }
  if (availableAt !== null && availableAt !== undefined) {
    throw new Error("HISTORICAL_UNKNOWN must not fabricate availableAt");
  }
  return {
    knowledgeTimeMode,
    firstKnownAt: null,
    availableAt: null,
    knowledgeTimeClass: "UNKNOWN_HISTORICAL_FIRST_KNOWN",
    pitEventReplayEligible: false,
  };
}

export async function buildCorporateActionSourceCaptureV0_1({
  sourceId,
  sourceUrl,
  exchange,
  actionFamilyId,
  sourceClass,
  fetchedAt,
  payloadHash,
  parserVersion,
  sourceStatus,
  recordCount,
  requestedStartDate = null,
  requestedEndDate = null,
  responseRangeVerified = false,
} = {}) {
  const ex = normalizeExchange(exchange);
  const start = dateOrNull(requestedStartDate, "requestedStartDate");
  const end = dateOrNull(requestedEndDate, "requestedEndDate");
  if ((start === null) !== (end === null)) {
    throw new Error("requestedStartDate and requestedEndDate must be provided together");
  }
  if (start && end < start) throw new Error("requestedEndDate cannot be earlier than requestedStartDate");
  const sourceClassText = requiredText(sourceClass, "sourceClass");
  if (sourceClassText === "HISTORICAL_ACTUAL_RESULT_RANGE" && !start) {
    throw new Error("historical range capture requires requested range");
  }

  const base = {
    schemaVersion: "S2_CA_SOURCE_CAPTURE_V0_1",
    version: CORPORATE_ACTION_CONTINUITY_ARCHIVE_VERSION,
    sourceId: requiredText(sourceId, "sourceId"),
    sourceUrl: requiredText(sourceUrl, "sourceUrl"),
    exchange: ex,
    actionFamilyId: requiredText(actionFamilyId, "actionFamilyId"),
    sourceClass: sourceClassText,
    fetchedAt: isoTimestamp(fetchedAt, "fetchedAt"),
    payloadHash: requiredText(payloadHash, "payloadHash"),
    parserVersion: requiredText(parserVersion, "parserVersion"),
    sourceStatus: requiredText(sourceStatus, "sourceStatus"),
    recordCount: nonNegativeInt(recordCount, "recordCount"),
    requestedStartDate: start,
    requestedEndDate: end,
    responseRangeVerified: responseRangeVerified === true,
    immutable: true,
  };
  const captureHash = await sha256Hex(base);
  return deepFreeze({
    ...base,
    captureId: `S2-CA-CAPTURE:${captureHash}`,
    captureHash,
  });
}

export async function buildCorporateActionEventVersionV0_1({
  sourceCapture,
  symbol,
  actionFamilyId,
  eventKey,
  eventStage,
  effectiveDate = null,
  outcomeState = "ACTIVE",
  continuityEffect = {},
  continuityEffectState = "UNKNOWN",
  knowledgeTimeMode,
  firstKnownAt = null,
  availableAt = null,
  sourceRowHash,
  supersedesVersionId = null,
  actualResultVerified = false,
  readinessReasons = [],
} = {}) {
  if (!sourceCapture || typeof sourceCapture !== "object") throw new Error("sourceCapture is required");
  const exchange = normalizeExchange(sourceCapture.exchange);
  const family = requiredText(actionFamilyId, "actionFamilyId");
  if (family !== sourceCapture.actionFamilyId) {
    throw new Error("event actionFamilyId must match source capture");
  }
  const state = requiredText(outcomeState, "outcomeState");
  if (!OUTCOME_STATES.has(state)) throw new Error(`unsupported outcomeState: ${state}`);
  const knowledge = normalizeKnowledgeTime({
    mode: knowledgeTimeMode,
    sourceCapture,
    firstKnownAt,
    availableAt,
  });

  const semanticState = {
    exchange,
    symbol: requiredText(symbol, "symbol"),
    actionFamilyId: family,
    eventKey: requiredText(eventKey, "eventKey"),
    eventStage: requiredText(eventStage, "eventStage"),
    effectiveDate: dateOrNull(effectiveDate, "effectiveDate"),
    outcomeState: state,
    continuityEffect: continuityEffect && typeof continuityEffect === "object" && !Array.isArray(continuityEffect)
      ? continuityEffect
      : {},
    continuityEffectState: requiredText(continuityEffectState, "continuityEffectState"),
  };
  const semanticHash = await sha256Hex(semanticState);

  const base = {
    schemaVersion: "S2_CA_EVENT_VERSION_V0_1",
    version: CORPORATE_ACTION_CONTINUITY_ARCHIVE_VERSION,
    ...semanticState,
    semanticHash,
    sourceCaptureId: requiredText(sourceCapture.captureId, "sourceCapture.captureId"),
    sourcePayloadHash: requiredText(sourceCapture.payloadHash, "sourceCapture.payloadHash"),
    sourceRowHash: requiredText(sourceRowHash, "sourceRowHash"),
    observedAt: isoTimestamp(sourceCapture.fetchedAt, "sourceCapture.fetchedAt"),
    ...knowledge,
    supersedesVersionId: optionalText(supersedesVersionId),
    actualResultVerified: actualResultVerified === true,
    technicalContinuityEvidenceEligible:
      actualResultVerified === true &&
      state === "ACTIVE" &&
      semanticState.effectiveDate !== null &&
      semanticState.continuityEffectState === "VERIFIED",
    readinessReasons: sortedUnique(readinessReasons),
    immutable: true,
  };
  const eventVersionHash = await sha256Hex(base);
  return deepFreeze({
    ...base,
    eventVersionId: `S2-CA-EVENT:${eventVersionHash}`,
    eventVersionHash,
  });
}

function compareVersions(a, b) {
  const ta = Date.parse(a.observedAt);
  const tb = Date.parse(b.observedAt);
  if (ta !== tb) return ta - tb;
  return String(a.eventVersionId).localeCompare(String(b.eventVersionId));
}

export function reconcileCorporateActionEventVersionsV0_1(eventVersions = []) {
  if (!Array.isArray(eventVersions)) throw new Error("eventVersions must be an array");
  const byId = new Map();
  const groups = new Map();

  for (const record of eventVersions) {
    if (!record || typeof record !== "object") throw new Error("event version must be an object");
    const id = requiredText(record.eventVersionId, "eventVersionId");
    if (byId.has(id)) {
      const prior = byId.get(id);
      if (prior.eventVersionHash !== record.eventVersionHash) {
        throw new Error(`IMMUTABLE_EVENT_VERSION_CONFLICT: ${id}`);
      }
      continue;
    }
    byId.set(id, record);
    const key = requiredText(record.eventKey, "eventKey");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }

  const summaries = [];
  for (const [eventKey, raw] of groups.entries()) {
    const records = [...raw].sort(compareVersions);
    const semanticFirst = new Map();
    const duplicateVersionIds = [];
    const supersededIds = new Set();
    const invalidSupersession = [];
    const distinct = [];

    for (const record of records) {
      if (semanticFirst.has(record.semanticHash)) {
        duplicateVersionIds.push(record.eventVersionId);
        continue;
      }
      semanticFirst.set(record.semanticHash, record.eventVersionId);
      distinct.push(record);
    }

    const groupIds = new Set(distinct.map((x) => x.eventVersionId));
    for (const record of distinct) {
      const supersedes = optionalText(record.supersedesVersionId);
      if (!supersedes) continue;
      const prior = byId.get(supersedes);
      if (!prior || prior.eventKey !== eventKey || !groupIds.has(supersedes)) {
        invalidSupersession.push(record.eventVersionId);
        continue;
      }
      if (Date.parse(prior.observedAt) > Date.parse(record.observedAt)) {
        invalidSupersession.push(record.eventVersionId);
        continue;
      }
      supersededIds.add(supersedes);
    }

    const terminal = distinct.filter((x) => !supersededIds.has(x.eventVersionId));
    let state = "READY";
    if (invalidSupersession.length) state = "INVALID_SUPERSESSION";
    else if (terminal.length !== 1) state = "AMBIGUOUS_MULTIPLE_TERMINAL_STATES";

    const current = state === "READY" ? terminal[0] : null;
    summaries.push(deepFreeze({
      eventKey,
      exchange: records[0]?.exchange || null,
      symbol: records[0]?.symbol || null,
      actionFamilyId: records[0]?.actionFamilyId || null,
      state: state === "READY"
        ? current?.outcomeState === "CANCELLED" ? "READY_CANCELLED" : "READY_ACTIVE"
        : state,
      versionCount: records.length,
      distinctSemanticVersionCount: distinct.length,
      duplicateObservationCount: duplicateVersionIds.length,
      duplicateVersionIds: Object.freeze(duplicateVersionIds),
      invalidSupersessionVersionIds: Object.freeze(invalidSupersession),
      currentVersionId: current?.eventVersionId || null,
      currentEvent: current || null,
      allVersionIds: Object.freeze(records.map((x) => x.eventVersionId)),
    }));
  }

  const ambiguityCount = summaries.filter((x) =>
    x.state === "INVALID_SUPERSESSION" ||
    x.state === "AMBIGUOUS_MULTIPLE_TERMINAL_STATES"
  ).length;

  return deepFreeze({
    schemaVersion: "S2_CA_EVENT_RECONCILIATION_V0_1",
    version: CORPORATE_ACTION_CONTINUITY_ARCHIVE_VERSION,
    eventKeyCount: summaries.length,
    eventVersionCount: byId.size,
    ambiguityCount,
    groups: Object.freeze(summaries.sort((a, b) => a.eventKey.localeCompare(b.eventKey))),
    historyRewritten: false,
  });
}

function sourceContractKey(row) {
  return [
    normalizeExchange(row.exchange),
    requiredText(row.actionFamilyId, "actionFamilyId"),
    requiredText(row.sourceClass, "sourceClass"),
  ].join("|");
}

function coverageRowSatisfied(row, startDate, endDate) {
  if (!row || typeof row !== "object") return false;
  const exactRange =
    row.requestedStartDate === startDate &&
    row.requestedEndDate === endDate &&
    row.responseRangeVerified === true;
  const emptyOkay =
    Number(row.observedRowCount || 0) > 0 ||
    row.emptyRangeSemanticsCertified === true;
  return (
    row.coverageState === "COMPLETE" &&
    row.sourceClass === "HISTORICAL_ACTUAL_RESULT_RANGE" &&
    row.parserComplete === true &&
    row.revisionCoverageComplete === true &&
    exactRange &&
    emptyOkay &&
    sortedUnique(row.missingSourceDates).length === 0
  );
}

const HASH64 = /^[a-f0-9]{64}$/;

function safeIsoDate(value) {
  try {
    return isoDate(value, "suspensionEvidence.date");
  } catch {
    return null;
  }
}

function safeIsoTimestamp(value) {
  try {
    return isoTimestamp(value, "suspensionEvidence.timestamp");
  } catch {
    return null;
  }
}

function normalizeSuspensionEvidenceV0_2({
  exchange,
  evidence,
  startDate,
  endDate,
} = {}) {
  const ex = normalizeExchange(exchange);
  const row = evidence && typeof evidence === "object" && !Array.isArray(evidence)
    ? evidence
    : {};
  const blockers = [];
  const coverageState = typeof row.coverageState === "string"
    ? row.coverageState.trim().toUpperCase()
    : "UNKNOWN";
  const requestedStartDate = safeIsoDate(row.requestedStartDate);
  const requestedEndDate = safeIsoDate(row.requestedEndDate);
  const sourceId = optionalText(row.sourceId);
  const sourceFamily = optionalText(row.sourceFamily);
  const sourceContractVersion = optionalText(row.sourceContractVersion);
  const receiptDigest = typeof row.receiptDigest === "string" &&
    HASH64.test(row.receiptDigest.trim().toLowerCase())
    ? row.receiptDigest.trim().toLowerCase()
    : null;
  const observedAt = safeIsoTimestamp(row.observedAt);
  const availableAt = row.availableAt === null || row.availableAt === undefined || row.availableAt === ""
    ? null
    : safeIsoTimestamp(row.availableAt);
  const availabilitySemantics = typeof row.availabilitySemantics === "string"
    ? row.availabilitySemantics.trim().toUpperCase()
    : null;

  if (coverageState !== "COMPLETE") blockers.push("SUSPENSION_EVIDENCE_COVERAGE_NOT_COMPLETE");
  if (requestedStartDate !== startDate || requestedEndDate !== endDate) {
    blockers.push("SUSPENSION_EVIDENCE_INTERVAL_MISMATCH");
  }
  if (!sourceId) blockers.push("SUSPENSION_EVIDENCE_SOURCE_ID_MISSING");
  if (!sourceFamily) blockers.push("SUSPENSION_EVIDENCE_SOURCE_FAMILY_MISSING");
  if (!sourceContractVersion) blockers.push("SUSPENSION_EVIDENCE_SOURCE_CONTRACT_VERSION_MISSING");
  if (!receiptDigest) blockers.push("SUSPENSION_EVIDENCE_RECEIPT_DIGEST_INVALID");
  if (!observedAt) blockers.push("SUSPENSION_EVIDENCE_OBSERVED_AT_INVALID");
  if (!["PROSPECTIVE_OBSERVED", "VERIFIED_SOURCE_TIMESTAMP"].includes(availabilitySemantics)) {
    blockers.push("SUSPENSION_EVIDENCE_AVAILABILITY_SEMANTICS_INVALID");
  }
  if (availabilitySemantics === "VERIFIED_SOURCE_TIMESTAMP" && !availableAt) {
    blockers.push("SUSPENSION_EVIDENCE_AVAILABLE_AT_REQUIRED");
  }

  return deepFreeze({
    exchange: ex,
    coverageState,
    requestedStartDate,
    requestedEndDate,
    sourceId,
    sourceFamily,
    sourceContractVersion,
    receiptDigest,
    observedAt,
    availableAt,
    availabilitySemantics,
    evidenceReady: blockers.length === 0,
    blockerCodes: sortedUnique(blockers),
    immutable: true,
  });
}

export function buildCorporateActionCompletenessReceiptV0_1({
  startDate,
  endDate,
  universeVersion,
  universeCoverageComplete,
  requiredSourceContracts = [],
  sourceCoverage = [],
  eventVersions = [],
  suspensionCoverageByExchange = {},
  generatedAt,
} = {}) {
  const start = isoDate(startDate, "startDate");
  const end = isoDate(endDate, "endDate");
  if (end < start) throw new Error("endDate cannot be earlier than startDate");
  requiredText(universeVersion, "universeVersion");
  isoTimestamp(generatedAt, "generatedAt");
  if (!Array.isArray(requiredSourceContracts) || !requiredSourceContracts.length) {
    throw new Error("requiredSourceContracts must be a non-empty array");
  }
  if (!Array.isArray(sourceCoverage)) throw new Error("sourceCoverage must be an array");

  const required = requiredSourceContracts.map((x) => ({
    exchange: normalizeExchange(x.exchange),
    actionFamilyId: requiredText(x.actionFamilyId, "requiredSourceContracts[].actionFamilyId"),
    sourceClass: requiredText(x.sourceClass, "requiredSourceContracts[].sourceClass"),
  }));
  const requiredKeys = sortedUnique(required.map(sourceContractKey));
  const coverageByKey = new Map();
  for (const row of sourceCoverage) {
    const key = sourceContractKey(row);
    if (!coverageByKey.has(key)) coverageByKey.set(key, []);
    coverageByKey.get(key).push(row);
  }

  const sourceContractResults = requiredKeys.map((key) => {
    const rows = coverageByKey.get(key) || [];
    const satisfyingRows = rows.filter((row) => coverageRowSatisfied(row, start, end));
    return deepFreeze({
      contractKey: key,
      observedCoverageRowCount: rows.length,
      satisfied: satisfyingRows.length > 0,
      satisfyingSourceIds: sortedUnique(satisfyingRows.map((x) => x.sourceId)),
    });
  });
  const sourceCoverageComplete = sourceContractResults.every((x) => x.satisfied);
  const reconciliation = reconcileCorporateActionEventVersionsV0_1(eventVersions);
  const revisionCoverageComplete =
    sourceCoverageComplete &&
    sourceCoverage
      .filter((row) => requiredKeys.includes(sourceContractKey(row)))
      .every((row) => row.revisionCoverageComplete === true);
  const archiveUnambiguous = reconciliation.ambiguityCount === 0;
  const eventCoverageComplete =
    universeCoverageComplete === true &&
    sourceCoverageComplete &&
    revisionCoverageComplete &&
    archiveUnambiguous;

  const requiredExchanges = sortedUnique(required.map((x) => x.exchange));
  const suspensionCoverageComplete = requiredExchanges.every(
    (exchange) => suspensionCoverageByExchange?.[exchange] === "COMPLETE",
  );
  const symbolSessionCompletenessEvidenceReady =
    eventCoverageComplete && suspensionCoverageComplete;

  return deepFreeze({
    schemaVersion: "S2_CA_COMPLETENESS_RECEIPT_V0_1",
    version: CORPORATE_ACTION_CONTINUITY_ARCHIVE_VERSION,
    interval: deepFreeze({ startDate: start, endDate: end }),
    universeVersion: requiredText(universeVersion, "universeVersion"),
    universeCoverageComplete: universeCoverageComplete === true,
    requiredSourceContracts: Object.freeze(required),
    sourceContractResults: Object.freeze(sourceContractResults),
    sourceCoverageComplete,
    revisionCoverageComplete,
    archiveUnambiguous,
    eventCoverageComplete,
    noEventMayBeClaimed: eventCoverageComplete,
    suspensionCoverageByExchange: deepFreeze({ ...suspensionCoverageByExchange }),
    suspensionCoverageComplete,
    symbolSessionCompletenessEvidenceReady,
    eventReconciliation: reconciliation,
    generatedAt: isoTimestamp(generatedAt, "generatedAt"),

    // Promotion firewalls. This core can establish evidence readiness only.
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    continuityTransformPerformed: false,
    historyMutationPerformed: false,
    strategyEvaluationPerformed: false,
    capacityRunProduced: false,
    zeroPickClaimed: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export async function buildCorporateActionCompletenessReceiptV0_2({
  startDate,
  endDate,
  universeVersion,
  universeCoverageComplete,
  requiredSourceContracts = [],
  sourceCoverage = [],
  eventVersions = [],
  suspensionCoverageByExchange = {},
  suspensionEvidenceByExchange = {},
  generatedAt,
} = {}) {
  const legacy = buildCorporateActionCompletenessReceiptV0_1({
    startDate,
    endDate,
    universeVersion,
    universeCoverageComplete,
    requiredSourceContracts,
    sourceCoverage,
    eventVersions,
    suspensionCoverageByExchange,
    generatedAt,
  });

  const requiredExchanges = sortedUnique(
    legacy.requiredSourceContracts.map((row) => row.exchange),
  );
  const normalizedSuspensionEvidence = {};
  for (const exchange of requiredExchanges) {
    normalizedSuspensionEvidence[exchange] = normalizeSuspensionEvidenceV0_2({
      exchange,
      evidence: suspensionEvidenceByExchange?.[exchange],
      startDate: legacy.interval.startDate,
      endDate: legacy.interval.endDate,
    });
  }

  const suspensionCoverageComplete = requiredExchanges.every((exchange) =>
    suspensionCoverageByExchange?.[exchange] === "COMPLETE" &&
    normalizedSuspensionEvidence[exchange]?.evidenceReady === true
  );
  const symbolSessionCompletenessEvidenceReady =
    legacy.eventCoverageComplete && suspensionCoverageComplete;

  const base = {
    schemaVersion: "S2_CA_COMPLETENESS_RECEIPT_V0_2",
    version: CORPORATE_ACTION_COMPLETENESS_RECEIPT_V0_2_VERSION,
    interval: legacy.interval,
    universeVersion: legacy.universeVersion,
    universeCoverageComplete: legacy.universeCoverageComplete,
    requiredSourceContracts: legacy.requiredSourceContracts,
    sourceContractResults: legacy.sourceContractResults,
    sourceCoverageComplete: legacy.sourceCoverageComplete,
    revisionCoverageComplete: legacy.revisionCoverageComplete,
    archiveUnambiguous: legacy.archiveUnambiguous,
    eventCoverageComplete: legacy.eventCoverageComplete,
    noEventMayBeClaimed: legacy.noEventMayBeClaimed,
    suspensionCoverageByExchange: deepFreeze({ ...suspensionCoverageByExchange }),
    suspensionEvidenceByExchange: deepFreeze(normalizedSuspensionEvidence),
    suspensionCoverageComplete,
    symbolSessionCompletenessEvidenceReady,
    eventReconciliation: legacy.eventReconciliation,
    generatedAt: legacy.generatedAt,
    evidenceBoundSuspensionCompleteness: true,
    legacyStatusOnlyCompletenessAccepted: false,

    // Promotion firewalls. This core can establish evidence readiness only.
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    continuityTransformPerformed: false,
    historyMutationPerformed: false,
    strategyEvaluationPerformed: false,
    capacityRunProduced: false,
    zeroPickClaimed: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  };
  const receiptHash = await sha256Hex(base);
  return deepFreeze({ ...base, receiptHash });
}

export function classifyCorporateActionSymbolWindowV0_1({
  receipt,
  exchange,
  symbol,
  universeState,
  actionFamilyIds = [],
} = {}) {
  if (!receipt || typeof receipt !== "object") throw new Error("receipt is required");
  const ex = normalizeExchange(exchange);
  const code = requiredText(symbol, "symbol");
  const membership = requiredText(universeState, "universeState");
  if (!["IN_SCOPE", "OUT_OF_SCOPE", "UNKNOWN"].includes(membership)) {
    throw new Error("universeState must be IN_SCOPE, OUT_OF_SCOPE or UNKNOWN");
  }
  const familyFilter = new Set((actionFamilyIds || []).map((x) => String(x).trim()).filter(Boolean));

  const matchingGroups = (receipt.eventReconciliation?.groups || []).filter((group) =>
    group.exchange === ex &&
    group.symbol === code &&
    (familyFilter.size === 0 || familyFilter.has(group.actionFamilyId))
  );
  const ambiguous = matchingGroups.some((group) =>
    group.state === "INVALID_SUPERSESSION" ||
    group.state === "AMBIGUOUS_MULTIPLE_TERMINAL_STATES"
  );
  if (ambiguous) {
    return deepFreeze({
      state: "EVENT_COVERAGE_UNKNOWN",
      reason: "EVENT_VERSION_AMBIGUITY",
      eventVersionIds: Object.freeze([]),
    });
  }

  const start = receipt.interval?.startDate;
  const end = receipt.interval?.endDate;
  const active = matchingGroups
    .filter((group) => group.state === "READY_ACTIVE")
    .map((group) => group.currentEvent)
    .filter((event) => event?.effectiveDate && event.effectiveDate >= start && event.effectiveDate <= end);

  if (active.length) {
    return deepFreeze({
      state: "EVENT_PRESENT",
      reason: "ACTIVE_EVENT_IN_VERIFIED_WINDOW",
      eventVersionIds: Object.freeze(active.map((x) => x.eventVersionId).sort()),
    });
  }

  if (membership === "OUT_OF_SCOPE") {
    return deepFreeze({
      state: "OUT_OF_SCOPE",
      reason: "SYMBOL_NOT_IN_PIT_UNIVERSE",
      eventVersionIds: Object.freeze([]),
    });
  }
  if (membership !== "IN_SCOPE") {
    return deepFreeze({
      state: "EVENT_COVERAGE_UNKNOWN",
      reason: "PIT_UNIVERSE_MEMBERSHIP_UNKNOWN",
      eventVersionIds: Object.freeze([]),
    });
  }
  if (receipt.noEventMayBeClaimed !== true) {
    return deepFreeze({
      state: "EVENT_COVERAGE_UNKNOWN",
      reason: "COMPLETENESS_NOT_CERTIFIED",
      eventVersionIds: Object.freeze([]),
    });
  }

  return deepFreeze({
    state: "NO_EVENT",
    reason: "COMPLETE_REQUIRED_SOURCES_AND_PIT_UNIVERSE_NO_ACTIVE_EVENT",
    eventVersionIds: Object.freeze([]),
  });
}
