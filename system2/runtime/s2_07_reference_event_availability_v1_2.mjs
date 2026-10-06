import { deepFreeze } from "./factor_snapshot.mjs";
import {
  mopsovSourceReportedAtV0_1,
} from "./mopsov_source_reported_clock_v0_1.mjs";
import {
  buildMopsovAvailabilityObservationV0_1,
} from "./mopsov_prospective_availability_observer_v0_1.mjs";
import {
  capitalReductionSemanticV0_5,
  disclosureStageV0_5,
  familyMatchV0_5,
  issuerScopeEligibleV0_5,
  officialSubtypeSemanticV0_5,
  versionKeyV0_5,
} from "./s2_07_event_specific_linkage_v0_5.mjs";

export const S2_07_REFERENCE_EVENT_AVAILABILITY_VERSION = "1.2-RESEARCH";

function text(value) {
  return value == null ? "" : String(value).trim();
}

function iso(value) {
  if (!value || !Number.isFinite(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function evidenceCandidate(row, replayCutoffAt, {officialEventVersionId, officialSourceRowHash}) {
  if (!row || typeof row !== "object") return null;
  const evidenceClass = text(row.evidenceClass);
  const availableAt = iso(row.availableAt ?? row.firstObservedAt);
  const exactVersionIdentity =
    row.exactVersionIdentity === true
    && text(row.referenceEventVersionId) === officialEventVersionId
    && text(row.referenceSourceRowHash) === officialSourceRowHash;
  const publicAvailabilityObserved = row.publicAvailabilityObserved === true;
  const publicationSemanticsCertified = row.publicationSemanticsCertified === true;
  const authorizedClass =
    evidenceClass === "PROSPECTIVE_EXACT_VERSION_OBSERVER"
    || evidenceClass === "AUTHORITATIVE_PUBLICATION_TIME_CONTRACT";
  const temporalPass =
    Boolean(availableAt)
    && Date.parse(availableAt) <= Date.parse(replayCutoffAt);

  return deepFreeze({
    evidenceClass: evidenceClass || null,
    availableAt,
    exactVersionIdentity,
    publicAvailabilityObserved,
    publicationSemanticsCertified,
    authorizedClass,
    temporalPass,
    ready:
      authorizedClass
      && exactVersionIdentity
      && temporalPass
      && (
        publicAvailabilityObserved
        || publicationSemanticsCertified
      ),
    sourceId: text(row.sourceId) || null,
    versionKey: text(row.versionKey) || null,
    evidenceId: text(row.evidenceId) || null,
    referenceEventVersionId: text(row.referenceEventVersionId) || null,
    referenceSourceRowHash: text(row.referenceSourceRowHash) || null,
  });
}

export function evaluateReferenceEventHistoricalAvailabilityV1_2({
  officialEvent,
  mopsRows = [],
  replayCutoffAt,
  independentAvailabilityEvidence = [],
} = {}) {
  if (!officialEvent || typeof officialEvent !== "object") {
    throw new Error("officialEvent is required");
  }
  if (!Array.isArray(mopsRows)) throw new Error("mopsRows must be an array");
  if (!Array.isArray(independentAvailabilityEvidence)) {
    throw new Error("independentAvailabilityEvidence must be an array");
  }

  const replayCutoff = iso(replayCutoffAt);
  if (!replayCutoff) throw new Error("replayCutoffAt must be an ISO timestamp");

  const market = text(officialEvent.exchange).toUpperCase();
  const symbol = text(officialEvent.symbol);
  const family = text(officialEvent.actionFamilyId);
  const effectiveDate = text(officialEvent.effectiveDate);
  const blockers = [];

  if (
    market !== "TPEX"
    || symbol !== "4806"
    || family !== "CAPITAL_REDUCTION"
    || effectiveDate !== "2026-10-02"
  ) {
    blockers.push("REFERENCE_EVENT_IDENTITY_OUT_OF_SCOPE");
  }

  if (
    officialEvent.actualResultVerified !== true
    || officialEvent.technicalContinuityEvidenceEligible !== true
    || text(officialEvent.continuityEffectState) !== "VERIFIED"
  ) {
    blockers.push("REFERENCE_EVENT_NOT_PHYSICALLY_VERIFIED");
  }

  const familyRows = mopsRows
    .filter((row) =>
      row
      && row.date
      && row.date <= effectiveDate
      && issuerScopeEligibleV0_5(row.rowText)
      && familyMatchV0_5(row.rowText, family)
    )
    .sort((a, b) => versionKeyV0_5(a).localeCompare(versionKeyV0_5(b)));

  const subtypeSemantic = officialSubtypeSemanticV0_5(
    officialEvent.continuityEffect?.subtype,
  );
  let semanticSeed = null;
  let relevantRows = familyRows;

  if (family === "CAPITAL_REDUCTION" && subtypeSemantic) {
    const semanticSeeds = familyRows.filter((row) =>
      capitalReductionSemanticV0_5(row.rowText) === subtypeSemantic
      && disclosureStageV0_5(row.rowText) === "CORPORATE_DECISION"
    );
    semanticSeed = semanticSeeds.at(-1) ?? null;
    if (!semanticSeed) {
      relevantRows = [];
      blockers.push("MOPS_SEMANTIC_EPISODE_NOT_ALIGNED");
    } else {
      relevantRows = familyRows
        .filter((row) => row.date >= semanticSeed.date)
        .filter((row) =>
          !["OTHER_CAPITAL_CHANGE", "BOND_CONVERSION"].includes(
            disclosureStageV0_5(row.rowText),
          )
        )
        .filter((row) => {
          const semantic = capitalReductionSemanticV0_5(row.rowText);
          return semantic === "GENERIC_CAPITAL_REDUCTION" || semantic === subtypeSemantic;
        });
    }
  }

  const retrospectiveObservations = relevantRows.map((row) => {
    const clock = mopsovSourceReportedAtV0_1(row);
    const observation = buildMopsovAvailabilityObservationV0_1({
      controlId: "S2-07-4806-" + versionKeyV0_5(row),
      row,
      observedAt: replayCutoff,
      observationMode: "RETROSPECTIVE_READBACK",
      sourceFetchId: "S2-07-V1.2-RETROSPECTIVE",
    });
    return deepFreeze({
      versionKey: versionKeyV0_5(row),
      rowText: text(row.rowText) || null,
      sourceReportedClockEligible: clock.eligible === true,
      sourceReportedAt: clock.sourceReportedAt ?? null,
      observationState: observation.state,
      firstObservedAvailableAt: observation.firstObservedAvailableAt,
      pitReplayUseAsAvailableAtAuthorized:
        observation.pitReplayUseAsAvailableAtAuthorized === true,
    });
  });

  const officialEventVersionId = text(officialEvent.eventVersionId);
  const officialSourceRowHash = text(officialEvent.sourceRowHash);
  if (!officialEventVersionId || !officialSourceRowHash) {
    blockers.push("REFERENCE_EVENT_PROVENANCE_IDENTITY_MISSING");
  }

  const independent = independentAvailabilityEvidence
    .map((row) => evidenceCandidate(row, replayCutoff, {
      officialEventVersionId,
      officialSourceRowHash,
    }))
    .filter(Boolean);
  const readyEvidence = independent
    .filter((row) => row.ready)
    .sort((a, b) => Date.parse(a.availableAt) - Date.parse(b.availableAt));
  const winningEvidence = readyEvidence[0] ?? null;

  const sourceReportedClockEligibleCount = retrospectiveObservations
    .filter((row) => row.sourceReportedClockEligible).length;
  const retrospectiveOnlyCount = retrospectiveObservations
    .filter((row) => row.observationState === "RETROSPECTIVE_SOURCE_CLOCK_ONLY").length;

  const historicalAvailabilityProven =
    blockers.length === 0
    && Boolean(winningEvidence);

  if (!historicalAvailabilityProven) {
    blockers.push("INDEPENDENT_HISTORICAL_PUBLIC_AVAILABILITY_NOT_PROVEN");
  }

  const uniqueBlockers = [...new Set(blockers)];

  return deepFreeze({
    schemaVersion: "S2_S2_07_REFERENCE_EVENT_AVAILABILITY_V1_2",
    version: S2_07_REFERENCE_EVENT_AVAILABILITY_VERSION,
    market,
    symbol,
    family,
    effectiveDate,
    replayCutoffAt: replayCutoff,
    officialEventVersionId: officialEventVersionId || null,
    officialSourceRowHash: officialSourceRowHash || null,
    officialKnowledgeTimeMode: text(officialEvent.knowledgeTimeMode) || null,
    officialFirstKnownAt: officialEvent.firstKnownAt ?? null,
    officialAvailableAt: officialEvent.availableAt ?? null,

    mopsFamilyRowCount: familyRows.length,
    mopsSemanticSeedVersionKey: semanticSeed ? versionKeyV0_5(semanticSeed) : null,
    mopsSemanticSeedDate: semanticSeed?.date ?? null,
    mopsRelevantRowCount: relevantRows.length,
    mopsSourceReportedClockEligibleCount: sourceReportedClockEligibleCount,
    mopsRetrospectiveOnlyCount: retrospectiveOnlyCount,
    mopsRows: deepFreeze(retrospectiveObservations),

    independentEvidenceCount: independent.length,
    independentlyReadyEvidenceCount: readyEvidence.length,
    winningEvidence,

    state: historicalAvailabilityProven
      ? "REFERENCE_EVENT_HISTORICAL_AVAILABILITY_PROVEN"
      : "REFERENCE_EVENT_HISTORICAL_AVAILABILITY_NOT_PROVEN",
    blockers: deepFreeze(uniqueBlockers),
    historicalAvailabilityProven,
    sourceReportedClockPromotedToAvailableAt: false,
    retrospectiveReadbackPromotedToFirstObservedAt: false,
    firstKnownAt: historicalAvailabilityProven ? winningEvidence.availableAt : null,
    availableAt: historicalAvailabilityProven ? winningEvidence.availableAt : null,
    pitEventReplayEligible: historicalAvailabilityProven,
    pitReplayBlocker: historicalAvailabilityProven
      ? null
      : "OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN",

    knownAtVersionClockCertified: false,
    publicAvailabilityLatencyCertified: false,
    revisionCoverageComplete: false,
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
