import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D18_OBSERVABLE_REGIME_VECTOR_VERSION = "D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH";

const DIMENSIONS = Object.freeze([
  "trendContext",
  "breadthContext",
  "volatilityDirection",
  "activityDirection",
  "concentrationContext",
  "sizeLeadership",
  "institutionalContext",
  "globalTransmission",
  "sectorRotationContext",
]);

const HASH_RE = /^[a-f0-9]{64}$/;

function sourceIdentity(receipt) {
  return receipt?.sourceId
    || receipt?.featureId
    || receipt?.receiptId
    || receipt?.bundleId
    || receipt?.sourceBatchId
    || receipt?.contextVersion
    || receipt?.version
    || null;
}

function ownHash(receipt) {
  return receipt?.receiptHash
    || receipt?.featureHash
    || receipt?.bundleHash
    || null;
}

function normalizeAvailableAt(receipt) {
  return receipt?.availableAt
    || receipt?.sourceObservedAt
    || receipt?.observedAt
    || null;
}

function validateDimensionSource(receipt, {
  marketDate,
  decisionTimestamp,
  tag,
  allowState = "KNOWN",
} = {}) {
  const blockers = [];
  if (!receipt || typeof receipt !== "object") {
    blockers.push(tag + "_MISSING");
    return {
      ready: false,
      blockers,
      sourceIdentity: null,
      sourceRef: null,
      availableAt: null,
    };
  }

  if (receipt.state !== allowState) blockers.push(tag + "_STATE_NOT_" + allowState);
  if (receipt.marketDate !== marketDate) blockers.push(tag + "_MARKET_DATE_MISMATCH");
  if (!sameInstant(receipt.decisionTimestamp, decisionTimestamp)) {
    blockers.push(tag + "_DECISION_CLOCK_MISMATCH");
  }
  if (receipt.pointInTimeEligible !== true) blockers.push(tag + "_PIT_INELIGIBLE");

  const availableAt = normalizeAvailableAt(receipt);
  const availableMs = Date.parse(availableAt || "");
  if (!Number.isFinite(availableMs)) blockers.push(tag + "_AVAILABLE_AT_MISSING_OR_INVALID");
  else if (availableMs > Date.parse(decisionTimestamp)) blockers.push(tag + "_AVAILABLE_AFTER_DECISION");

  const identity = sourceIdentity(receipt);
  if (typeof identity !== "string" || !identity.trim()) blockers.push(tag + "_SOURCE_IDENTITY_MISSING");

  const hash = ownHash(receipt);
  if (!HASH_RE.test(String(hash || ""))) blockers.push(tag + "_SOURCE_HASH_MISSING_OR_INVALID");

  return {
    ready: blockers.length === 0,
    blockers,
    sourceIdentity: identity,
    sourceRef: hash,
    availableAt: Number.isFinite(availableMs) ? new Date(availableMs).toISOString() : null,
  };
}

async function dimensionPayload({
  state,
  value = null,
  reason = null,
  proof,
  extra = {},
} = {}) {
  const base = {
    state,
    value,
    reason,
    sourceRef: proof?.sourceRef || null,
    sourceIdentity: proof?.sourceIdentity || null,
    availableAt: proof?.availableAt || null,
    pointInTimeEligible: proof?.ready === true,
    blockerCodes: Object.freeze([...(proof?.blockers || [])]),
    ...extra,
  };
  const evidenceHash = await sha256Hex(base);
  return deepFreeze({ ...base, evidenceHash });
}

async function unknownDimension(reason, proof = null, extra = {}) {
  return dimensionPayload({
    state: "UNKNOWN",
    value: null,
    reason,
    proof,
    extra,
  });
}

async function knownDimension(value, proof, extra = {}) {
  return dimensionPayload({
    state: "KNOWN",
    value,
    reason: null,
    proof,
    extra,
  });
}

async function rawDimension(reason, proof, extra = {}) {
  return dimensionPayload({
    state: "CONTEXT_RAW",
    value: null,
    reason,
    proof,
    extra,
  });
}

function stripHash(value, field) {
  const out = { ...value };
  delete out[field];
  return out;
}

async function validateDimensionEvidenceRow(row) {
  if (!row || typeof row !== "object") {
    return { valid: false, blockers: ["DIMENSION_ROW_MISSING"] };
  }
  const claimed = String(row.evidenceHash || "");
  const recomputed = await sha256Hex(stripHash(row, "evidenceHash"));
  const blockers = [];
  if (!HASH_RE.test(claimed)) blockers.push("DIMENSION_EVIDENCE_HASH_INVALID");
  else if (recomputed !== claimed) blockers.push("DIMENSION_EVIDENCE_HASH_MISMATCH");

  if (row.state === "KNOWN" || row.state === "CONTEXT_RAW") {
    if (row.pointInTimeEligible !== true) blockers.push("DIMENSION_PIT_NOT_PROVEN");
    if (!row.availableAt || !Number.isFinite(Date.parse(row.availableAt))) {
      blockers.push("DIMENSION_AVAILABLE_AT_INVALID");
    }
    if (!row.sourceIdentity) blockers.push("DIMENSION_SOURCE_IDENTITY_MISSING");
    if (!HASH_RE.test(String(row.sourceRef || ""))) blockers.push("DIMENSION_SOURCE_HASH_INVALID");
  }
  return { valid: blockers.length === 0, blockers, recomputed };
}

export async function validateD18ObservableRegimeVectorV0_1(regimeVector) {
  const blockers = [];
  if (!regimeVector || typeof regimeVector !== "object") {
    return deepFreeze({ valid: false, blockers: Object.freeze(["REGIME_VECTOR_MISSING"]), dimensions: {} });
  }
  if (regimeVector.vectorVersion !== D18_OBSERVABLE_REGIME_VECTOR_VERSION) {
    blockers.push("REGIME_VECTOR_VERSION_MISMATCH");
  }

  const dimensionValidation = {};
  for (const key of DIMENSIONS) {
    const result = await validateDimensionEvidenceRow(regimeVector.dimensions?.[key]);
    dimensionValidation[key] = deepFreeze(result);
    blockers.push(...result.blockers.map((code) => key + ":" + code));
  }

  const claimedReceiptHash = String(regimeVector.receiptHash || "");
  const recomputedReceiptHash = await sha256Hex(stripHash(regimeVector, "receiptHash"));
  if (!HASH_RE.test(claimedReceiptHash)) blockers.push("REGIME_VECTOR_HASH_INVALID");
  else if (claimedReceiptHash !== recomputedReceiptHash) blockers.push("REGIME_VECTOR_HASH_MISMATCH");

  return deepFreeze({
    valid: blockers.length === 0,
    blockers: Object.freeze([...new Set(blockers)]),
    dimensions: deepFreeze(dimensionValidation),
    recomputedReceiptHash,
  });
}

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function validDate(value) {
  return typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
}

function iso(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be ISO timestamp`);
  return new Date(text).toISOString();
}

function sameInstant(a, b) {
  const x = Date.parse(a || "");
  const y = Date.parse(b || "");
  return Number.isFinite(x) && Number.isFinite(y) && x === y;
}

function validateReceiptClock(receipt, marketDate, decisionTimestamp, tag, reasons) {
  if (!receipt || typeof receipt !== "object") {
    reasons.push(tag + "_MISSING");
    return false;
  }
  if (receipt.marketDate !== marketDate) reasons.push(tag + "_MARKET_DATE_MISMATCH");
  const receiptClock = receipt.decisionTimestamp;
  if (!sameInstant(receiptClock, decisionTimestamp)) {
    reasons.push(tag + "_DECISION_CLOCK_MISMATCH");
  }
  return true;
}

function sourceHash(receipt) {
  return receipt?.receiptHash
    || receipt?.featureHash
    || receipt?.bundleHash
    || receipt?.sourceBatchHash
    || receipt?.batchHash
    || null;
}

export async function buildD18ObservableRegimeVectorV0_1({
  receiptId,
  marketDate,
  decisionTimestamp,
  taiexContext,
  directionBreadth,
  sectorRotation = null,
  activityContext = null,
  concentrationContext = null,
  institutionalContext = null,
  sizeLeadership = null,
  globalTransmission = null,
} = {}) {
  const id = requiredText(receiptId, "receiptId");
  const date = requiredText(marketDate, "marketDate");
  if (!validDate(date)) throw new Error("marketDate must be YYYY-MM-DD");
  const clock = iso(decisionTimestamp, "decisionTimestamp");
  const reasons = [];

  validateReceiptClock(taiexContext, date, clock, "TAIEX_CONTEXT", reasons);
  validateReceiptClock(directionBreadth, date, clock, "DIRECTION_BREADTH", reasons);

  if (sectorRotation) {
    validateReceiptClock(sectorRotation, date, clock, "SECTOR_ROTATION", reasons);
  }

  // Hard prerequisites use the same source/PIT/hash firewall as every optional dimension.
  const taiexProof = validateDimensionSource(taiexContext, {
    marketDate: date,
    decisionTimestamp: clock,
    tag: "TAIEX_CONTEXT",
  });
  if (
    typeof taiexContext?.historyWindowHash !== "string"
    || typeof taiexContext?.officialSessionWindowHash !== "string"
  ) {
    taiexProof.blockers.push("TAIEX_CONTEXT_WINDOW_HASH_MISSING");
    taiexProof.ready = false;
  }
  reasons.push(...taiexProof.blockers);

  const breadthProof = validateDimensionSource(directionBreadth, {
    marketDate: date,
    decisionTimestamp: clock,
    tag: "DIRECTION_BREADTH",
  });
  if (
    typeof directionBreadth?.sourceBatchHash !== "string"
    || !directionBreadth?.total
    || !Number.isFinite(directionBreadth.total.advanceShareKnown)
  ) {
    breadthProof.blockers.push("DIRECTION_BREADTH_CONTENT_INCOMPLETE");
    breadthProof.ready = false;
  }
  reasons.push(...breadthProof.blockers);

  if (reasons.length) {
    return deepFreeze({
      receiptId: id,
      vectorVersion: D18_OBSERVABLE_REGIME_VECTOR_VERSION,
      marketDate: date,
      decisionTimestamp: clock,
      state: "UNKNOWN",
      pointInTimeEligible: false,
      unknownReasons: Object.freeze([...new Set(reasons)]),
      dimensions: deepFreeze(Object.fromEntries(await Promise.all(
        DIMENSIONS.map(async (x) => [x, await unknownDimension("VECTOR_PREREQUISITE_NOT_READY")]),
      ))),
      scalarRiskScoreProduced: false,
      policyApplied: false,
      selectionImpact: false,
      schemaVersion: D18_OBSERVABLE_REGIME_VECTOR_VERSION,
    });
  }

  const dimensions = {};

  dimensions.trendContext = await knownDimension(
    taiexContext.trendContext,
    taiexProof,
    {
      metrics: deepFreeze({
        close: taiexContext.metrics?.close ?? null,
        ma20: taiexContext.metrics?.ma20 ?? null,
        ma20Slope5: taiexContext.metrics?.ma20Slope5 ?? null,
        return20: taiexContext.metrics?.return20 ?? null,
      }),
    },
  );

  dimensions.volatilityDirection = await knownDimension(
    taiexContext.volatilityDirection,
    taiexProof,
    {
      metrics: deepFreeze({
        realizedVol5: taiexContext.metrics?.realizedVol5 ?? null,
        realizedVol20: taiexContext.metrics?.realizedVol20 ?? null,
        volRatio5to20: taiexContext.metrics?.volRatio5to20 ?? null,
      }),
    },
  );

  // Direction breadth is executable and PIT-safe, but the canonical BROAD_POSITIVE /
  // BROAD_NEGATIVE rule also requires median return. U2B continuity-certified return
  // is not ready, so do not fabricate the label. Preserve the raw breadth context.
  dimensions.breadthContext = await rawDimension(
    "MEDIAN_RETURN_U2B_NOT_CONTINUITY_CERTIFIED",
    breadthProof,
    {
      raw: deepFreeze({
      advanceShareKnown: directionBreadth.total.advanceShareKnown,
      declineShareKnown: directionBreadth.total.declineShareKnown,
      flatShareKnown: directionBreadth.total.flatShareKnown,
      netBreadthShareKnown: directionBreadth.total.netBreadthShareKnown,
      comparableCoveragePct: directionBreadth.total.comparableCoveragePct,
      notComparablePct: directionBreadth.total.notComparablePct,
      unknownPct: directionBreadth.total.unknownPct,
      byMarket: directionBreadth.byMarket,
    }),
  });

  // Optional contexts must independently prove date/clock/PIT/availability/source/hash.
  const activityProof = validateDimensionSource(activityContext, {
    marketDate: date,
    decisionTimestamp: clock,
    tag: "ACTIVITY_CONTEXT",
  });
  if (activityProof.ready && Number.isFinite(activityContext?.totalTradeValueVs20D)) {
    const ratio = Number(activityContext.totalTradeValueVs20D);
    dimensions.activityDirection = await knownDimension(
      ratio > 1 ? "ACTIVITY_EXPANDING" : ratio < 1 ? "ACTIVITY_CONTRACTING" : "ACTIVITY_EQUAL",
      activityProof,
      { totalTradeValueVs20D: ratio },
    );
  } else {
    if (activityContext && !Number.isFinite(activityContext?.totalTradeValueVs20D)) {
      activityProof.blockers.push("ACTIVITY_CONTEXT_METRIC_INVALID");
      activityProof.ready = false;
    }
    dimensions.activityDirection = await unknownDimension(
      activityContext ? "PIT_ACTIVITY_CONTEXT_NOT_READY" : "FROZEN_20_SESSION_ACTIVITY_HISTORY_NOT_PROVEN",
      activityProof,
    );
  }

  const concentrationProof = validateDimensionSource(concentrationContext, {
    marketDate: date,
    decisionTimestamp: clock,
    tag: "CONCENTRATION_CONTEXT",
  });
  if (concentrationProof.ready) {
    dimensions.concentrationContext = await rawDimension(
      "NO_OUTCOME_INDEPENDENT_HIGH_LOW_THRESHOLD_FROZEN",
      concentrationProof,
      {
        raw: deepFreeze({
          top10TradeValueShare: concentrationContext.top10TradeValueShare ?? null,
          top20TradeValueShare: concentrationContext.top20TradeValueShare ?? null,
          returnDispersion: concentrationContext.returnDispersion ?? null,
        }),
      },
    );
  } else {
    dimensions.concentrationContext = await unknownDimension(
      "PIT_CONCENTRATION_CONTEXT_NOT_READY",
      concentrationProof,
    );
  }

  const institutionalProof = validateDimensionSource(institutionalContext, {
    marketDate: date,
    decisionTimestamp: clock,
    tag: "INSTITUTIONAL_CONTEXT",
  });
  if (institutionalProof.ready) {
    dimensions.institutionalContext = await rawDimension(
      "DESCRIPTIVE_FLOW_CONTEXT_NO_BULL_BEAR_VOTE",
      institutionalProof,
      {
        raw: deepFreeze({
          foreignNet: institutionalContext.foreignNet ?? null,
          trustNet: institutionalContext.trustNet ?? null,
          dealerNet: institutionalContext.dealerNet ?? null,
        }),
      },
    );
  } else {
    dimensions.institutionalContext = await unknownDimension(
      "PIT_INSTITUTIONAL_CONTEXT_NOT_READY",
      institutionalProof,
    );
  }

  const sizeProof = validateDimensionSource(sizeLeadership, {
    marketDate: date,
    decisionTimestamp: clock,
    tag: "SIZE_LEADERSHIP",
  });
  dimensions.sizeLeadership = sizeProof.ready
    ? await knownDimension(sizeLeadership.value, sizeProof)
    : await unknownDimension("PIT_MARKET_CAP_VINTAGE_NOT_READY", sizeProof);

  const globalProof = validateDimensionSource(globalTransmission, {
    marketDate: date,
    decisionTimestamp: clock,
    tag: "GLOBAL_TRANSMISSION",
  });
  dimensions.globalTransmission = globalProof.ready
    ? await knownDimension(globalTransmission.value, globalProof)
    : await unknownDimension("DURABLE_GLOBAL_DECISION_TIME_RECEIPTS_NOT_READY", globalProof);

  const sectorProof = validateDimensionSource(sectorRotation, {
    marketDate: date,
    decisionTimestamp: clock,
    tag: "SECTOR_ROTATION",
  });
  if (sectorProof.ready) {
    dimensions.sectorRotationContext = await rawDimension(
      "NO_ROTATION_POLICY_THRESHOLD_AUTHORIZED",
      sectorProof,
      {
        commonIndustryCount: sectorRotation.commonIndustryCount ?? null,
        industries: sectorRotation.industries ?? [],
      },
    );
  } else {
    dimensions.sectorRotationContext = await unknownDimension(
      "SECTOR_ROTATION_CONTEXT_NOT_READY",
      sectorProof,
    );
  }

  const values = Object.values(dimensions);
  const knownCount = values.filter((x) => x.state === "KNOWN").length;
  const rawCount = values.filter((x) => x.state === "CONTEXT_RAW").length;
  const unknownCount = values.filter((x) => x.state === "UNKNOWN").length;

  const base = {
    receiptId: id,
    vectorVersion: D18_OBSERVABLE_REGIME_VECTOR_VERSION,
    marketDate: date,
    decisionTimestamp: clock,
    state: "KNOWN_PARTIAL_VECTOR",
    pointInTimeEligible: true,
    dimensions: deepFreeze(dimensions),
    evidenceCompleteness: deepFreeze({
      dimensionCount: DIMENSIONS.length,
      knownCount,
      rawContextCount: rawCount,
      unknownCount,
      pitEligibleDimensionCount: values.filter((x) => x.pointInTimeEligible === true).length,
      allDimensionsReady: unknownCount === 0 && rawCount === 0,
    }),
    sourceLineage: deepFreeze({
      taiexContextHash: sourceHash(taiexContext),
      directionBreadthHash: sourceHash(directionBreadth),
      sectorRotationHash: sourceHash(sectorRotation),
      activityHash: sourceHash(activityContext),
      concentrationHash: sourceHash(concentrationContext),
      institutionalHash: sourceHash(institutionalContext),
      sizeLeadershipHash: sourceHash(sizeLeadership),
      globalTransmissionHash: sourceHash(globalTransmission),
    }),
    scalarRiskScoreProduced: false,
    compositeRiskOnOffAssigned: false,
    policyApplied: false,
    selectionImpact: false,
    strategyWeightImpact: false,
    capitalImpact: false,
    schemaVersion: D18_OBSERVABLE_REGIME_VECTOR_VERSION,
  };
  const receiptHash = await sha256Hex(base);
  return deepFreeze({ ...base, receiptHash });
}
