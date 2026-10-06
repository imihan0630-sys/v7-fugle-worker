import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const S2_07_PRE_PARENT_EVIDENCE_CUT_VERSION = "1.4-RESEARCH";

const ALLOWED_SCOPES = new Set(["MARKET_WIDE", "EXCHANGE_WIDE", "FULL_ELIGIBLE_UNIVERSE"]);

function text(value) {
  return value == null ? "" : String(value).trim();
}

function isoTimestamp(value, field) {
  const raw = text(value);
  if (!raw || !Number.isFinite(Date.parse(raw))) throw new Error(field + " must be an ISO timestamp");
  return new Date(raw).toISOString();
}

function isoDate(value, field) {
  const raw = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || !Number.isFinite(Date.parse(raw + "T00:00:00Z"))) {
    throw new Error(field + " must be YYYY-MM-DD");
  }
  return raw;
}

function hash64(value) {
  return /^[0-9a-f]{64}$/i.test(text(value));
}

function uniqSorted(values) {
  return [...new Set(values.map((x) => text(x)).filter(Boolean))].sort();
}

function sameArray(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function observationRow(observation, cutoffAt) {
  if (!observation || typeof observation !== "object" || Array.isArray(observation)) return null;
  const availableAt = text(observation.availableAt);
  const versionKey = text(observation.stableReferenceKey);
  const payloadHash = text(observation.referenceSourceRowHash);
  const eligible =
    observation.observationMode === "PROSPECTIVE_POLL"
    && observation.evidenceClass === "PROSPECTIVE_EXACT_VERSION_OBSERVER"
    && observation.exactVersionIdentity === true
    && observation.publicAvailabilityObserved === true
    && hash64(versionKey)
    && hash64(payloadHash)
    && text(observation.evidenceId)
    && hash64(text(observation.evidenceId))
    && availableAt
    && Number.isFinite(Date.parse(availableAt))
    && Date.parse(availableAt) <= Date.parse(cutoffAt);
  return deepFreeze({
    versionKey: versionKey || null,
    payloadHash: payloadHash || null,
    availableAt: availableAt ? new Date(availableAt).toISOString() : null,
    evidenceId: text(observation.evidenceId) || null,
    sourceId: text(observation.sourceId) || null,
    eligible,
  });
}

function normalizeLane(lane) {
  if (!lane || typeof lane !== "object" || Array.isArray(lane)) return null;
  return deepFreeze({
    laneId: text(lane.laneId) || null,
    state: text(lane.state) || null,
    payloadHash: text(lane.payloadHash) || null,
    queryComplete: lane.queryComplete === true,
    queryTruncated: lane.queryTruncated === true,
  });
}

export async function buildPreParentEvidenceCutManifestV1_4({
  scanDate,
  evidenceCutoffAt,
  scopeClass,
  requiredMarkets = [],
  coveredMarkets = [],
  expectedVersionKeys = [],
  expectedKeysetComplete = false,
  observations = [],
  requiredLanes = [],
  queryTruncated = false,
  budgetExceeded = false,
  selectedOnly = false,
} = {}) {
  const date = isoDate(scanDate, "scanDate");
  const cutoff = isoTimestamp(evidenceCutoffAt, "evidenceCutoffAt");
  const scope = text(scopeClass).toUpperCase();
  const required = uniqSorted(requiredMarkets.map((x) => text(x).toUpperCase()));
  const covered = uniqSorted(coveredMarkets.map((x) => text(x).toUpperCase()));
  const blockers = [];

  if (!ALLOWED_SCOPES.has(scope)) blockers.push("EVIDENCE_CUT_SCOPE_INVALID");
  if (selectedOnly === true) blockers.push("SELECTED_ONLY_CAPTURE_FORBIDDEN");
  if (required.length === 0) blockers.push("REQUIRED_MARKET_SCOPE_EMPTY");
  if (!sameArray(required, covered)) blockers.push("MARKET_SCOPE_COVERAGE_MISMATCH");
  if (queryTruncated === true) blockers.push("EVIDENCE_CUT_QUERY_TRUNCATED");
  if (budgetExceeded === true) blockers.push("EVIDENCE_CUT_BUDGET_EXCEEDED");
  if (expectedKeysetComplete !== true) blockers.push("EXPECTED_VERSION_KEYSET_NOT_CERTIFIED_COMPLETE");

  const lanes = requiredLanes.map(normalizeLane).filter(Boolean);
  if (lanes.length === 0) blockers.push("REQUIRED_SOURCE_LANES_MISSING");
  const unknownRequiredLaneCount = lanes.filter((lane) =>
    !lane.laneId
    || lane.state !== "READY"
    || !hash64(lane.payloadHash)
    || lane.queryComplete !== true
    || lane.queryTruncated === true
  ).length;
  if (unknownRequiredLaneCount !== 0) blockers.push("EVIDENCE_CUT_UNKNOWN_REQUIRED_LANES");

  const normalizedObservations = observations
    .map((observation) => observationRow(observation, cutoff))
    .filter(Boolean);
  const ineligibleObservationCount = normalizedObservations.filter((row) => row.eligible !== true).length;
  if (ineligibleObservationCount !== 0) blockers.push("PROSPECTIVE_OBSERVATION_INELIGIBLE_AT_CUTOFF");

  const expected = expectedVersionKeys.map((x) => text(x)).filter(Boolean).sort();
  const observed = normalizedObservations.map((row) => row.versionKey).filter(Boolean).sort();
  if (expected.length !== new Set(expected).size) blockers.push("EXPECTED_VERSION_KEY_DUPLICATE");
  if (observed.length !== new Set(observed).size) blockers.push("OBSERVED_VERSION_KEY_DUPLICATE");
  if (!sameArray(expected, observed)) blockers.push("VERSION_KEYSET_MISMATCH");

  const uniqueBlockers = [...new Set(blockers)];
  const manifestIdentity = {
    version: S2_07_PRE_PARENT_EVIDENCE_CUT_VERSION,
    scanDate: date,
    evidenceCutoffAt: cutoff,
    scopeClass: scope || null,
    requiredMarkets: required,
    coveredMarkets: covered,
    expectedVersionKeys: expected,
    observedVersions: normalizedObservations.map((row) => ({
      versionKey: row.versionKey,
      payloadHash: row.payloadHash,
      availableAt: row.availableAt,
      evidenceId: row.evidenceId,
      sourceId: row.sourceId,
    })).sort((a, b) => String(a.versionKey).localeCompare(String(b.versionKey))),
    requiredLanes: lanes.map((lane) => ({
      laneId: lane.laneId,
      state: lane.state,
      payloadHash: lane.payloadHash,
      queryComplete: lane.queryComplete,
      queryTruncated: lane.queryTruncated,
    })).sort((a, b) => String(a.laneId).localeCompare(String(b.laneId))),
  };
  const sourceCutManifestHash = await sha256Hex(manifestIdentity);
  const evidenceCutId = "S2-ECUT:" + await sha256Hex({ sourceCutManifestHash, evidenceCutoffAt: cutoff });
  const preCutManifestReady = uniqueBlockers.length === 0;

  return deepFreeze({
    schemaVersion: "S2_S2_07_PRE_PARENT_EVIDENCE_CUT_MANIFEST_V1_4",
    version: S2_07_PRE_PARENT_EVIDENCE_CUT_VERSION,
    state: preCutManifestReady
      ? "PRE_PARENT_EVIDENCE_CUT_CAPTURED_RECONCILIATION_PENDING"
      : "PRE_PARENT_EVIDENCE_CUT_BLOCKED",
    blockers: uniqueBlockers,
    scanDate: date,
    evidenceCutId,
    evidenceCutoffAt: cutoff,
    scopeClass: scope || null,
    scope: preCutManifestReady ? "MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE" : "UNVERIFIED",
    requiredMarkets: required,
    coveredMarkets: covered,
    expectedKeysetComplete: expectedKeysetComplete === true,
    expectedVersionKeys: expected,
    observedVersionKeys: observed,
    observedVersions: manifestIdentity.observedVersions,
    requiredLanes: manifestIdentity.requiredLanes,
    unknownRequiredLaneCount,
    ineligibleObservationCount,
    queryTruncated: queryTruncated === true,
    budgetExceeded: budgetExceeded === true,
    selectedOnlyCaptureAuthorized: false,
    sourceCutManifestHash,
    preCutManifestReady,
    appendOnlyExactVersionIdentity: true,
    noRevisionGapThroughCut: false,
    noRevisionGapThroughCutCertified: false,
    lateDiscoveredPreCutVersionCount: 0,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    historyMutationPerformed: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export async function reconcileNoRevisionGapThroughCutV1_4({
  preCutManifest,
  postReconciliation,
} = {}) {
  if (!preCutManifest || typeof preCutManifest !== "object" || Array.isArray(preCutManifest)) {
    throw new Error("preCutManifest is required");
  }
  if (!postReconciliation || typeof postReconciliation !== "object" || Array.isArray(postReconciliation)) {
    throw new Error("postReconciliation is required");
  }
  const blockers = [];
  if (preCutManifest.preCutManifestReady !== true) blockers.push("PRE_CUT_MANIFEST_NOT_READY");
  if (!hash64(preCutManifest.sourceCutManifestHash)) blockers.push("PRE_CUT_MANIFEST_HASH_INVALID");
  const cutoff = isoTimestamp(preCutManifest.evidenceCutoffAt, "preCutManifest.evidenceCutoffAt");
  const reconciledAt = isoTimestamp(postReconciliation.reconciledAt, "postReconciliation.reconciledAt");
  if (Date.parse(reconciledAt) <= Date.parse(cutoff)) blockers.push("POST_RECONCILIATION_NOT_AFTER_CUT");
  if (postReconciliation.boundedPopulationComplete !== true) blockers.push("POST_BOUNDED_POPULATION_INCOMPLETE");
  if (postReconciliation.populationIdentityStable !== true) blockers.push("POST_POPULATION_IDENTITY_UNSTABLE");
  if (postReconciliation.queryTruncated === true) blockers.push("POST_QUERY_TRUNCATED");

  const pre = Array.isArray(preCutManifest.observedVersions) ? preCutManifest.observedVersions : [];
  const post = Array.isArray(postReconciliation.versions) ? postReconciliation.versions : [];
  const preKeys = pre.map((row) => text(row.versionKey));
  const postKeys = post.map((row) => text(row.versionKey));
  if (preKeys.some((key) => !key)) blockers.push("PRE_VERSION_KEY_MISSING");
  if (postKeys.some((key) => !key)) blockers.push("POST_VERSION_KEY_MISSING");
  if (new Set(preKeys).size !== preKeys.length) blockers.push("PRE_VERSION_KEY_DUPLICATE");
  if (new Set(postKeys).size !== postKeys.length) blockers.push("POST_VERSION_KEY_DUPLICATE");

  const preMap = new Map(pre.map((row) => [text(row.versionKey), row]));
  const postMap = new Map(post.map((row) => [text(row.versionKey), row]));
  const missingPreKeys = preKeys.filter((key) => !postMap.has(key));
  if (missingPreKeys.length) blockers.push("PRE_VERSION_MISSING_FROM_POST");

  const mutatedKeys = [];
  for (const [key, before] of preMap) {
    const after = postMap.get(key);
    if (!after) continue;
    if (!hash64(before.payloadHash) || !hash64(after.payloadHash)) {
      blockers.push("VERSION_PAYLOAD_HASH_INVALID");
    } else if (before.payloadHash !== after.payloadHash) {
      mutatedKeys.push(key);
    }
  }
  if (mutatedKeys.length) blockers.push("VERSION_PAYLOAD_MUTATION");

  const lateDiscoveredPreCutVersionKeys = [];
  const laterVersionKeys = [];
  for (const row of post) {
    const key = text(row.versionKey);
    if (!key || preMap.has(key)) continue;
    const sourceReportedAt = text(row.sourceReportedAt);
    if (!sourceReportedAt || !Number.isFinite(Date.parse(sourceReportedAt))) {
      blockers.push("POST_NEW_VERSION_SOURCE_REPORTED_AT_INVALID");
      continue;
    }
    if (Date.parse(sourceReportedAt) <= Date.parse(cutoff)) {
      lateDiscoveredPreCutVersionKeys.push(key);
    } else {
      laterVersionKeys.push(key);
    }
  }
  if (lateDiscoveredPreCutVersionKeys.length) blockers.push("LATE_DISCOVERED_PRE_CUT_VERSION");

  const uniqueBlockers = [...new Set(blockers)];
  const noRevisionGapThroughCut = uniqueBlockers.length === 0;
  const reconciliationIdentity = {
    evidenceCutId: text(preCutManifest.evidenceCutId) || null,
    sourceCutManifestHash: text(preCutManifest.sourceCutManifestHash) || null,
    evidenceCutoffAt: cutoff,
    reconciledAt,
    preVersionKeys: [...preKeys].sort(),
    postVersionKeys: [...postKeys].sort(),
    missingPreKeys: [...missingPreKeys].sort(),
    mutatedKeys: [...mutatedKeys].sort(),
    lateDiscoveredPreCutVersionKeys: [...lateDiscoveredPreCutVersionKeys].sort(),
    laterVersionKeys: [...laterVersionKeys].sort(),
  };
  const reconciliationId = "S2-NRG:" + await sha256Hex(reconciliationIdentity);

  return deepFreeze({
    schemaVersion: "S2_S2_07_NO_REVISION_GAP_THROUGH_CUT_V1_4",
    version: S2_07_PRE_PARENT_EVIDENCE_CUT_VERSION,
    state: noRevisionGapThroughCut
      ? "BOUNDED_NO_REVISION_GAP_THROUGH_CUT_READY"
      : "NO_REVISION_GAP_THROUGH_CUT_BLOCKED",
    blockers: uniqueBlockers,
    reconciliationId,
    ...reconciliationIdentity,
    lateDiscoveredPreCutVersionCount: lateDiscoveredPreCutVersionKeys.length,
    noRevisionGapThroughCut,
    noRevisionGapThroughCutCertified: noRevisionGapThroughCut,
    certificationScope: noRevisionGapThroughCut ? "EXACT_EVIDENCE_CUT_ONLY" : "NONE",
    historicalSourceReportedAtUsedForPositiveAdmission: false,
    historicalSourceReportedAtUsedForFalsificationOnly: true,
    symbolSessionCompletenessCertified: false,
    technicalContinuityCertified: false,
    historyMutationPerformed: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
