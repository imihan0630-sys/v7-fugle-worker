import { deepFreeze } from "./factor_snapshot.mjs";
import { mopsovSourceReportedAtV0_1 } from "./mopsov_source_reported_clock_v0_1.mjs";

export const MOPSOV_PROSPECTIVE_AVAILABILITY_OBSERVER_VERSION = "0.1-RESEARCH";

const MODES = new Set(["PROSPECTIVE_POLL", "RETROSPECTIVE_READBACK"]);
const PRIOR_STATES = new Set(["NOT_OBSERVED", "OBSERVED"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function optionalText(value) {
  return value === null || value === undefined || value === "" ? null : String(value).trim();
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return new Date(text).toISOString();
}

function nonNegativeSeconds(ms) {
  if (!Number.isFinite(ms) || ms < 0) return null;
  return Math.round(ms / 1000);
}

export function buildMopsovAvailabilityObservationV0_1({
  controlId,
  row,
  observedAt,
  observationMode,
  priorObservation = null,
  sourceUrl = "https://mopsov.twse.com.tw/mops/web/ajax_t05st01",
  payloadHash = null,
  sourceFetchId = null,
} = {}) {
  const mode = requiredText(observationMode, "observationMode");
  if (!MODES.has(mode)) throw new Error("unsupported observationMode: " + mode);
  const observed = isoTimestamp(observedAt, "observedAt");
  const clock = mopsovSourceReportedAtV0_1(row || {});

  if (!clock.eligible) {
    return deepFreeze({
      schemaVersion: "S2_MOPSOV_AVAILABILITY_OBSERVATION_V0_1",
      version: MOPSOV_PROSPECTIVE_AVAILABILITY_OBSERVER_VERSION,
      controlId: optionalText(controlId),
      observationMode: mode,
      state: "SOURCE_REPORTED_CLOCK_INVALID",
      sourceReportedClockEligible: false,
      sourceReportedAt: null,
      observedAt: observed,
      sourceUrl: requiredText(sourceUrl, "sourceUrl"),
      payloadHash: optionalText(payloadHash),
      sourceFetchId: optionalText(sourceFetchId),
      priorObservationState: null,
      priorObservedAt: null,
      observationIntervalSeconds: null,
      latencyUpperBoundFromSourceReportedSeconds: null,
      firstObservedAvailableAt: null,
      availabilityEvidenceClass: "UNUSABLE_SOURCE_CLOCK",
      precisionEligible: false,
      publicAvailabilityLatencyCertified: false,
      knownAtVersionClockCertified: false,
      pitReplayUseAsAvailableAtAuthorized: false,
    });
  }

  const sourceReportedAt = clock.sourceReportedAt;
  const observedMs = Date.parse(observed);
  const sourceMs = Date.parse(sourceReportedAt);

  if (mode === "RETROSPECTIVE_READBACK") {
    return deepFreeze({
      schemaVersion: "S2_MOPSOV_AVAILABILITY_OBSERVATION_V0_1",
      version: MOPSOV_PROSPECTIVE_AVAILABILITY_OBSERVER_VERSION,
      controlId: optionalText(controlId),
      observationMode: mode,
      state: "RETROSPECTIVE_SOURCE_CLOCK_ONLY",
      sourceReportedClockEligible: true,
      sourceReportedAt,
      versionKey: clock.versionKey,
      observedAt: observed,
      sourceUrl: requiredText(sourceUrl, "sourceUrl"),
      payloadHash: optionalText(payloadHash),
      sourceFetchId: optionalText(sourceFetchId),
      priorObservationState: null,
      priorObservedAt: null,
      observationIntervalSeconds: null,
      latencyUpperBoundFromSourceReportedSeconds: null,
      firstObservedAvailableAt: null,
      availabilityEvidenceClass: "RETROSPECTIVE_SOURCE_CLOCK_ONLY",
      precisionEligible: false,
      publicAvailabilityLatencyCertified: false,
      knownAtVersionClockCertified: false,
      pitReplayUseAsAvailableAtAuthorized: false,
    });
  }

  if (observedMs < sourceMs) {
    return deepFreeze({
      schemaVersion: "S2_MOPSOV_AVAILABILITY_OBSERVATION_V0_1",
      version: MOPSOV_PROSPECTIVE_AVAILABILITY_OBSERVER_VERSION,
      controlId: optionalText(controlId),
      observationMode: mode,
      state: "OBSERVATION_PRECEDES_SOURCE_REPORTED_CLOCK",
      sourceReportedClockEligible: true,
      sourceReportedAt,
      versionKey: clock.versionKey,
      observedAt: observed,
      sourceUrl: requiredText(sourceUrl, "sourceUrl"),
      payloadHash: optionalText(payloadHash),
      sourceFetchId: optionalText(sourceFetchId),
      priorObservationState: null,
      priorObservedAt: null,
      observationIntervalSeconds: null,
      latencyUpperBoundFromSourceReportedSeconds: null,
      firstObservedAvailableAt: null,
      availabilityEvidenceClass: "INVALID_TEMPORAL_ORDER",
      precisionEligible: false,
      publicAvailabilityLatencyCertified: false,
      knownAtVersionClockCertified: false,
      pitReplayUseAsAvailableAtAuthorized: false,
    });
  }

  let priorState = null;
  let priorAt = null;
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
    if (priorMs > observedMs) throw new Error("priorObservation cannot be later than observedAt");
    intervalSeconds = nonNegativeSeconds(observedMs - priorMs);
    precisionEligible = priorState === "NOT_OBSERVED" && intervalSeconds !== null && intervalSeconds <= 300;
  }

  const latencyUpperBound = nonNegativeSeconds(observedMs - sourceMs);

  return deepFreeze({
    schemaVersion: "S2_MOPSOV_AVAILABILITY_OBSERVATION_V0_1",
    version: MOPSOV_PROSPECTIVE_AVAILABILITY_OBSERVER_VERSION,
    controlId: optionalText(controlId),
    observationMode: mode,
    state: precisionEligible
      ? "PROSPECTIVE_FIRST_OBSERVED_WITH_BOUNDED_WINDOW"
      : "PROSPECTIVE_FIRST_OBSERVED_UPPER_BOUND",
    sourceReportedClockEligible: true,
    sourceReportedAt,
    versionKey: clock.versionKey,
    observedAt: observed,
    sourceUrl: requiredText(sourceUrl, "sourceUrl"),
    payloadHash: optionalText(payloadHash),
    sourceFetchId: optionalText(sourceFetchId),
    priorObservationState: priorState,
    priorObservedAt: priorAt,
    observationIntervalSeconds: intervalSeconds,
    latencyUpperBoundFromSourceReportedSeconds: latencyUpperBound,
    firstObservedAvailableAt: observed,
    availabilityEvidenceClass: precisionEligible
      ? "FIRST_OBSERVED_WITH_PRIOR_NOT_OBSERVED_WINDOW"
      : "FIRST_OBSERVED_AVAILABLE_UPPER_BOUND",
    precisionEligible,

    // Engineering can preserve a prospective observation upper bound.
    // It may not promote that bound into exact historical availability.
    publicAvailabilityLatencyCertified: false,
    knownAtVersionClockCertified: false,
    pitReplayUseAsAvailableAtAuthorized: false,
  });
}

export function summarizeMopsovAvailabilityObservationsV0_1(observations = []) {
  if (!Array.isArray(observations)) throw new Error("observations must be an array");
  const rows = observations.filter((x) => x && typeof x === "object");
  const prospective = rows.filter((x) => x.observationMode === "PROSPECTIVE_POLL");
  const retrospective = rows.filter((x) => x.observationMode === "RETROSPECTIVE_READBACK");
  const usableProspective = prospective.filter((x) =>
    x.state === "PROSPECTIVE_FIRST_OBSERVED_WITH_BOUNDED_WINDOW" ||
    x.state === "PROSPECTIVE_FIRST_OBSERVED_UPPER_BOUND"
  );
  const precise = usableProspective.filter((x) => x.precisionEligible === true);
  const latencyUpperBounds = usableProspective
    .map((x) => Number(x.latencyUpperBoundFromSourceReportedSeconds))
    .filter((x) => Number.isFinite(x) && x >= 0)
    .sort((a, b) => a - b);

  return deepFreeze({
    schemaVersion: "S2_MOPSOV_AVAILABILITY_OBSERVATION_SUMMARY_V0_1",
    version: MOPSOV_PROSPECTIVE_AVAILABILITY_OBSERVER_VERSION,
    observationCount: rows.length,
    prospectiveObservationCount: prospective.length,
    retrospectiveObservationCount: retrospective.length,
    usableProspectiveObservationCount: usableProspective.length,
    precisionEligibleCount: precise.length,
    uniqueVersionKeyCount: new Set(
      usableProspective.map((x) => x.versionKey).filter(Boolean)
    ).size,
    latencyUpperBoundSeconds: Object.freeze(latencyUpperBounds),
    maxLatencyUpperBoundSeconds: latencyUpperBounds.length ? latencyUpperBounds.at(-1) : null,
    measurementContractImplemented: true,

    // These remain evidence gates, not engineering-completeness flags.
    publicAvailabilityLatencyCertified: false,
    knownAtVersionClockCertified: false,
    pitReplayUseAsAvailableAtAuthorized: false,
    revisionCoverageComplete: false,
    noEventMayBeClaimed: false,
    technicalContinuityCertified: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
