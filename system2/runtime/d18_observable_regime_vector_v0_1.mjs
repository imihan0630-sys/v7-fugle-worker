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

function unknown(reason, sourceRef = null) {
  return deepFreeze({
    state: "UNKNOWN",
    value: null,
    reason,
    sourceRef,
  });
}

function known(value, sourceRef, extra = {}) {
  return deepFreeze({
    state: "KNOWN",
    value,
    reason: null,
    sourceRef,
    ...extra,
  });
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

  // Hard prerequisites for the vector itself:
  // trend/volatility source and market-direction breadth receipt must be the same decision state.
  const taiexReady =
    taiexContext?.state === "KNOWN"
    && taiexContext?.pointInTimeEligible === true
    && typeof taiexContext?.historyWindowHash === "string"
    && typeof taiexContext?.officialSessionWindowHash === "string";

  if (!taiexReady) reasons.push("TAIEX_CONTEXT_NOT_PIT_READY");

  const breadthReady =
    directionBreadth?.state === "KNOWN"
    && typeof directionBreadth?.sourceBatchHash === "string"
    && directionBreadth?.total
    && Number.isFinite(directionBreadth.total.advanceShareKnown);

  if (!breadthReady) reasons.push("DIRECTION_BREADTH_NOT_PIT_READY");

  if (reasons.length) {
    return deepFreeze({
      receiptId: id,
      vectorVersion: D18_OBSERVABLE_REGIME_VECTOR_VERSION,
      marketDate: date,
      decisionTimestamp: clock,
      state: "UNKNOWN",
      pointInTimeEligible: false,
      unknownReasons: Object.freeze([...new Set(reasons)]),
      dimensions: deepFreeze(Object.fromEntries(DIMENSIONS.map((x) => [x, unknown("VECTOR_PREREQUISITE_NOT_READY")]))),
      scalarRiskScoreProduced: false,
      policyApplied: false,
      selectionImpact: false,
      schemaVersion: D18_OBSERVABLE_REGIME_VECTOR_VERSION,
    });
  }

  const dimensions = {};

  dimensions.trendContext = known(
    taiexContext.trendContext,
    sourceHash(taiexContext),
    {
      metrics: deepFreeze({
        close: taiexContext.metrics?.close ?? null,
        ma20: taiexContext.metrics?.ma20 ?? null,
        ma20Slope5: taiexContext.metrics?.ma20Slope5 ?? null,
        return20: taiexContext.metrics?.return20 ?? null,
      }),
    },
  );

  dimensions.volatilityDirection = known(
    taiexContext.volatilityDirection,
    sourceHash(taiexContext),
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
  dimensions.breadthContext = deepFreeze({
    state: "CONTEXT_RAW",
    value: null,
    reason: "MEDIAN_RETURN_U2B_NOT_CONTINUITY_CERTIFIED",
    sourceRef: sourceHash(directionBreadth),
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

  // Activity is intentionally UNKNOWN until a 20-session frozen market-activity series exists.
  if (
    activityContext?.state === "KNOWN"
    && activityContext?.marketDate === date
    && sameInstant(activityContext?.decisionTimestamp, clock)
    && Number.isFinite(activityContext?.totalTradeValueVs20D)
  ) {
    const ratio = Number(activityContext.totalTradeValueVs20D);
    dimensions.activityDirection = known(
      ratio > 1 ? "ACTIVITY_EXPANDING" : ratio < 1 ? "ACTIVITY_CONTRACTING" : "ACTIVITY_EQUAL",
      sourceHash(activityContext),
      { totalTradeValueVs20D: ratio },
    );
  } else {
    dimensions.activityDirection = unknown(
      "FROZEN_20_SESSION_ACTIVITY_HISTORY_NOT_PROVEN",
      sourceHash(activityContext),
    );
  }

  // Concentration remains raw by contract; no HIGH/LOW threshold is authorized.
  if (
    concentrationContext?.state === "KNOWN"
    && concentrationContext?.marketDate === date
    && sameInstant(concentrationContext?.decisionTimestamp, clock)
  ) {
    dimensions.concentrationContext = deepFreeze({
      state: "CONTEXT_RAW",
      value: null,
      reason: "NO_OUTCOME_INDEPENDENT_HIGH_LOW_THRESHOLD_FROZEN",
      sourceRef: sourceHash(concentrationContext),
      raw: deepFreeze({
        top10TradeValueShare: concentrationContext.top10TradeValueShare ?? null,
        top20TradeValueShare: concentrationContext.top20TradeValueShare ?? null,
        returnDispersion: concentrationContext.returnDispersion ?? null,
      }),
    });
  } else {
    dimensions.concentrationContext = unknown(
      "PIT_CONCENTRATION_CONTEXT_NOT_READY",
      sourceHash(concentrationContext),
    );
  }

  // Institutional flow is descriptive context only; never a majority-vote market state.
  if (
    institutionalContext?.state === "KNOWN"
    && institutionalContext?.marketDate === date
    && sameInstant(institutionalContext?.decisionTimestamp, clock)
  ) {
    dimensions.institutionalContext = deepFreeze({
      state: "CONTEXT_RAW",
      value: null,
      reason: "DESCRIPTIVE_FLOW_CONTEXT_NO_BULL_BEAR_VOTE",
      sourceRef: sourceHash(institutionalContext),
      raw: deepFreeze({
        foreignNet: institutionalContext.foreignNet ?? null,
        trustNet: institutionalContext.trustNet ?? null,
        dealerNet: institutionalContext.dealerNet ?? null,
      }),
    });
  } else {
    dimensions.institutionalContext = unknown(
      "PIT_INSTITUTIONAL_CONTEXT_NOT_READY",
      sourceHash(institutionalContext),
    );
  }

  // D18-06 / D18-07 remain blocked; explicit UNKNOWN is the correct executable state.
  dimensions.sizeLeadership =
    sizeLeadership?.state === "KNOWN"
      ? known(sizeLeadership.value, sourceHash(sizeLeadership))
      : unknown("PIT_MARKET_CAP_VINTAGE_NOT_READY", sourceHash(sizeLeadership));

  dimensions.globalTransmission =
    globalTransmission?.state === "KNOWN"
      ? known(globalTransmission.value, sourceHash(globalTransmission))
      : unknown("DURABLE_GLOBAL_DECISION_TIME_RECEIPTS_NOT_READY", sourceHash(globalTransmission));

  if (
    sectorRotation?.state === "KNOWN"
    && sectorRotation?.marketDate === date
    && sameInstant(sectorRotation?.decisionTimestamp, clock)
  ) {
    dimensions.sectorRotationContext = deepFreeze({
      state: "CONTEXT_RAW",
      value: null,
      reason: "NO_ROTATION_POLICY_THRESHOLD_AUTHORIZED",
      sourceRef: sourceHash(sectorRotation),
      commonIndustryCount: sectorRotation.commonIndustryCount ?? null,
      industries: sectorRotation.industries ?? [],
    });
  } else {
    dimensions.sectorRotationContext = unknown(
      "SECTOR_ROTATION_CONTEXT_NOT_READY",
      sourceHash(sectorRotation),
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
