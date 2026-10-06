import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_OFFICIAL_REFERENCE_AVAILABILITY_OBSERVER_VERSION = "1.3-RESEARCH";

const MODES = new Set(["PROSPECTIVE_POLL", "RETROSPECTIVE_READBACK"]);
const PRIOR_STATES = new Set(["NOT_OBSERVED", "OBSERVED"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(field + " is required");
  }
  return value.trim();
}

function optionalText(value) {
  return value === null || value === undefined || value === ""
    ? null
    : String(value).trim();
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) {
    throw new Error(field + " must be an ISO timestamp");
  }
  return new Date(text).toISOString();
}

function stableIdentity(event) {
  if (!event || typeof event !== "object" || Array.isArray(event)) {
    throw new Error("event is required");
  }
  return {
    exchange: requiredText(event.exchange, "event.exchange").toUpperCase(),
    symbol: requiredText(event.symbol, "event.symbol"),
    actionFamilyId: requiredText(event.actionFamilyId, "event.actionFamilyId"),
    effectiveDate: requiredText(event.effectiveDate, "event.effectiveDate"),
    semanticHash: requiredText(event.semanticHash, "event.semanticHash"),
    sourceRowHash: requiredText(event.sourceRowHash, "event.sourceRowHash"),
  };
}

function sameStableIdentity(a, b) {
  return (
    a.exchange === b.exchange
    && a.symbol === b.symbol
    && a.actionFamilyId === b.actionFamilyId
    && a.effectiveDate === b.effectiveDate
    && a.semanticHash === b.semanticHash
    && a.sourceRowHash === b.sourceRowHash
  );
}

function nonNegativeSeconds(ms) {
  if (!Number.isFinite(ms) || ms < 0) return null;
  return Math.round(ms / 1000);
}

export async function buildOfficialReferenceAvailabilityObservationV1_3({
  event,
  observedAt,
  observationMode,
  priorObservation = null,
  sourceId = null,
  sourceUrl = null,
  payloadHash = null,
  sourceFetchId = null,
} = {}) {
  const mode = requiredText(observationMode, "observationMode");
  if (!MODES.has(mode)) throw new Error("unsupported observationMode: " + mode);
  const observed = isoTimestamp(observedAt, "observedAt");
  const identity = stableIdentity(event);
  const stableReferenceKey = await sha256Hex(identity);
  const observationVersionId = optionalText(event.eventVersionId);

  const common = {
    schemaVersion: "S2_S2_07_OFFICIAL_REFERENCE_AVAILABILITY_OBSERVATION_V1_3",
    version: S2_07_OFFICIAL_REFERENCE_AVAILABILITY_OBSERVER_VERSION,
    observationMode: mode,
    observedAt: observed,
    sourceId: optionalText(sourceId),
    sourceUrl: optionalText(sourceUrl),
    payloadHash: optionalText(payloadHash),
    sourceFetchId: optionalText(sourceFetchId),
    stableReferenceKey,
    referenceExchange: identity.exchange,
    referenceSymbol: identity.symbol,
    referenceActionFamilyId: identity.actionFamilyId,
    referenceEffectiveDate: identity.effectiveDate,
    referenceSemanticHash: identity.semanticHash,
    referenceSourceRowHash: identity.sourceRowHash,
    referenceObservationVersionId: observationVersionId,
    observationVersionIdUsedAsStableIdentity: false,
    exactVersionIdentity: true,
    knownAtVersionClockCertified: false,
    publicAvailabilityLatencyCertified: false,
    revisionCoverageComplete: false,
    technicalContinuityCertified: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  };

  if (mode === "RETROSPECTIVE_READBACK") {
    return deepFreeze({
      ...common,
      state: "RETROSPECTIVE_REFERENCE_ROW_ONLY",
      evidenceClass: "RETROSPECTIVE_REFERENCE_ROW_ONLY",
      publicAvailabilityObserved: false,
      priorObservationState: null,
      priorObservedAt: null,
      observationIntervalSeconds: null,
      firstObservedAt: null,
      availableAt: null,
      precisionEligible: false,
      availabilityByCutoffEvidenceEligible: false,
      evidenceId: null,
    });
  }

  let priorState = null;
  let priorAt = null;
  let firstObservedAt = observed;
  let intervalSeconds = null;
  let precisionEligible = false;

  if (priorObservation !== null && priorObservation !== undefined) {
    if (!priorObservation || typeof priorObservation !== "object" || Array.isArray(priorObservation)) {
      throw new Error("priorObservation must be an object or null");
    }
    priorState = requiredText(priorObservation.state, "priorObservation.state");
    if (!PRIOR_STATES.has(priorState)) {
      throw new Error("unsupported priorObservation.state: " + priorState);
    }
    priorAt = isoTimestamp(priorObservation.observedAt, "priorObservation.observedAt");
    const priorMs = Date.parse(priorAt);
    const observedMs = Date.parse(observed);
    if (priorMs > observedMs) {
      throw new Error("priorObservation cannot be later than observedAt");
    }
    intervalSeconds = nonNegativeSeconds(observedMs - priorMs);

    if (priorState === "NOT_OBSERVED") {
      precisionEligible = intervalSeconds !== null && intervalSeconds <= 300;
    } else {
      const priorIdentity = {
        exchange: requiredText(priorObservation.referenceExchange, "priorObservation.referenceExchange"),
        symbol: requiredText(priorObservation.referenceSymbol, "priorObservation.referenceSymbol"),
        actionFamilyId: requiredText(priorObservation.referenceActionFamilyId, "priorObservation.referenceActionFamilyId"),
        effectiveDate: requiredText(priorObservation.referenceEffectiveDate, "priorObservation.referenceEffectiveDate"),
        semanticHash: requiredText(priorObservation.referenceSemanticHash, "priorObservation.referenceSemanticHash"),
        sourceRowHash: requiredText(priorObservation.referenceSourceRowHash, "priorObservation.referenceSourceRowHash"),
      };
      if (!sameStableIdentity(identity, priorIdentity)) {
        throw new Error("priorObservation stable reference identity mismatch");
      }
      firstObservedAt = isoTimestamp(
        priorObservation.firstObservedAt ?? priorObservation.availableAt,
        "priorObservation.firstObservedAt",
      );
      if (Date.parse(firstObservedAt) > Date.parse(observed)) {
        throw new Error("priorObservation firstObservedAt cannot be later than observedAt");
      }
    }
  }

  const evidenceId = await sha256Hex({
    evidenceClass: "PROSPECTIVE_EXACT_VERSION_OBSERVER",
    stableReferenceKey,
    firstObservedAt,
    sourceId: optionalText(sourceId),
  });

  return deepFreeze({
    ...common,
    state: precisionEligible
      ? "PROSPECTIVE_REFERENCE_FIRST_OBSERVED_WITH_BOUNDED_WINDOW"
      : priorState === "OBSERVED"
        ? "PROSPECTIVE_REFERENCE_ALREADY_OBSERVED"
        : "PROSPECTIVE_REFERENCE_FIRST_OBSERVED_UPPER_BOUND",
    evidenceClass: "PROSPECTIVE_EXACT_VERSION_OBSERVER",
    publicAvailabilityObserved: true,
    priorObservationState: priorState,
    priorObservedAt: priorAt,
    observationIntervalSeconds: intervalSeconds,
    firstObservedAt,
    availableAt: firstObservedAt,
    precisionEligible,
    availabilityByCutoffEvidenceEligible: true,
    evidenceId,
  });
}

export function evaluateOfficialReferenceAvailabilityByCutoffV1_3({
  observation,
  cutoffAt,
} = {}) {
  if (!observation || typeof observation !== "object" || Array.isArray(observation)) {
    throw new Error("observation is required");
  }
  const cutoff = isoTimestamp(cutoffAt, "cutoffAt");
  const availableAt = observation.availableAt
    ? isoTimestamp(observation.availableAt, "observation.availableAt")
    : null;
  const eligible =
    observation.observationMode === "PROSPECTIVE_POLL"
    && observation.evidenceClass === "PROSPECTIVE_EXACT_VERSION_OBSERVER"
    && observation.exactVersionIdentity === true
    && observation.publicAvailabilityObserved === true
    && availableAt !== null
    && Date.parse(availableAt) <= Date.parse(cutoff);

  return deepFreeze({
    schemaVersion: "S2_S2_07_OFFICIAL_REFERENCE_AVAILABILITY_CUTOFF_V1_3",
    version: S2_07_OFFICIAL_REFERENCE_AVAILABILITY_OBSERVER_VERSION,
    cutoffAt: cutoff,
    availableAt,
    stableReferenceKey: optionalText(observation.stableReferenceKey),
    availabilityByCutoffProven: eligible,
    state: eligible
      ? "REFERENCE_PUBLICLY_OBSERVED_BY_CUTOFF"
      : "REFERENCE_PUBLIC_AVAILABILITY_NOT_PROVEN_BY_CUTOFF",
    blocker: eligible
      ? null
      : "EXACT_REFERENCE_FIRST_OBSERVED_AFTER_OR_UNKNOWN_AT_CUTOFF",
    precisionRequiredForEligibility: false,
    knownAtVersionClockCertified: false,
    technicalContinuityCertified: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export function summarizeOfficialReferenceAvailabilityObservationsV1_3(observations = []) {
  if (!Array.isArray(observations)) throw new Error("observations must be an array");
  const rows = observations.filter((row) => row && typeof row === "object");
  const prospective = rows.filter((row) => row.observationMode === "PROSPECTIVE_POLL");
  const retrospective = rows.filter((row) => row.observationMode === "RETROSPECTIVE_READBACK");
  const usable = prospective.filter((row) =>
    row.evidenceClass === "PROSPECTIVE_EXACT_VERSION_OBSERVER"
    && row.publicAvailabilityObserved === true
    && Boolean(row.availableAt)
  );
  return deepFreeze({
    schemaVersion: "S2_S2_07_OFFICIAL_REFERENCE_AVAILABILITY_SUMMARY_V1_3",
    version: S2_07_OFFICIAL_REFERENCE_AVAILABILITY_OBSERVER_VERSION,
    observationCount: rows.length,
    prospectiveObservationCount: prospective.length,
    retrospectiveObservationCount: retrospective.length,
    usableProspectiveObservationCount: usable.length,
    uniqueStableReferenceCount: new Set(usable.map((row) => row.stableReferenceKey)).size,
    precisionEligibleCount: usable.filter((row) => row.precisionEligible === true).length,
    measurementContractImplemented: true,
    highFrequencyPollingIntrinsicallyRequired: false,
    selectedOnlyCaptureAuthorized: false,
    scheduleAdded: false,
    knownAtVersionClockCertified: false,
    revisionCoverageComplete: false,
    technicalContinuityCertified: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
