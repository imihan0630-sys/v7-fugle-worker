export const D16_25_PROBABILITY_VALIDATION_VERSION =
  "D16_25_PROBABILITY_VALIDATION_V0_1";

export const DEFAULT_CALIBRATION_BIN_EDGES_V0_1 = Object.freeze([
  0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
]);

function assertTimestamp(value, field) {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    throw new Error(`${field} must be a valid timestamp`);
  }
  return new Date(value).toISOString();
}

function assertProbability(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${field} must be in [0,1]`);
  }
  return value;
}

function assertFinite(value, field) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${field} must be finite`);
  }
  return value;
}

function assertNonEmpty(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function mean(values) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

function validateBinEdges(edges) {
  if (!Array.isArray(edges) || edges.length < 2 || edges[0] !== 0 || edges.at(-1) !== 1) {
    throw new Error("calibrationBinEdges must start at 0 and end at 1");
  }
  for (let i = 1; i < edges.length; i += 1) {
    if (!(edges[i] > edges[i - 1])) throw new Error("calibrationBinEdges must be strictly increasing");
  }
  return [...edges];
}

function binIndex(p, edges) {
  if (p === 1) return edges.length - 2;
  for (let i = 0; i < edges.length - 1; i += 1) {
    if (p >= edges[i] && p < edges[i + 1]) return i;
  }
  throw new Error("probability outside calibration bins");
}

function exactBinaryLogLoss(p, y) {
  if (y === 1) {
    if (p === 0) return Number.POSITIVE_INFINITY;
    return -Math.log(p);
  }
  if (p === 1) return Number.POSITIVE_INFINITY;
  return -Math.log(1 - p);
}

function normalizeRecord(raw, index) {
  if (!raw || typeof raw !== "object") throw new Error(`records[${index}] is required`);
  const predictionId = assertNonEmpty(raw.predictionId, `records[${index}].predictionId`);
  const scanDate = assertNonEmpty(raw.scanDate, `records[${index}].scanDate`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(scanDate)) throw new Error("scanDate must be YYYY-MM-DD");

  const decisionAt = assertTimestamp(raw.decisionAt, `records[${index}].decisionAt`);
  const outcomeMaturedAt = raw.outcomeMaturedAt == null
    ? null
    : assertTimestamp(raw.outcomeMaturedAt, `records[${index}].outcomeMaturedAt`);

  if (outcomeMaturedAt && Date.parse(outcomeMaturedAt) < Date.parse(decisionAt)) {
    throw new Error(`records[${index}] outcome matured before decision`);
  }

  const outcome = raw.outcome == null ? null : Number(raw.outcome);
  if (outcome !== null && outcome !== 0 && outcome !== 1) {
    throw new Error(`records[${index}].outcome must be 0, 1 or null`);
  }

  const uncertaintyScore = raw.uncertaintyScore == null
    ? null
    : assertProbability(raw.uncertaintyScore, `records[${index}].uncertaintyScore`);

  const predictedNetUtility = raw.predictedNetUtility == null
    ? null
    : assertFinite(raw.predictedNetUtility, `records[${index}].predictedNetUtility`);

  const realizedAfterCostValue = raw.realizedAfterCostValue == null
    ? null
    : assertFinite(raw.realizedAfterCostValue, `records[${index}].realizedAfterCostValue`);

  return Object.freeze({
    predictionId,
    scanDate,
    strategyId: assertNonEmpty(raw.strategyId, `records[${index}].strategyId`),
    strategyVersion: assertNonEmpty(raw.strategyVersion, `records[${index}].strategyVersion`),
    decisionStage: assertNonEmpty(raw.decisionStage, `records[${index}].decisionStage`),
    targetId: assertNonEmpty(raw.targetId, `records[${index}].targetId`),
    horizon: assertNonEmpty(raw.horizon, `records[${index}].horizon`),
    referenceBasis: assertNonEmpty(raw.referenceBasis, `records[${index}].referenceBasis`),
    costModelVersion: assertNonEmpty(raw.costModelVersion, `records[${index}].costModelVersion`),
    outcomeRuleVersion: assertNonEmpty(raw.outcomeRuleVersion, `records[${index}].outcomeRuleVersion`),
    baseRateCohortVersion: assertNonEmpty(raw.baseRateCohortVersion, `records[${index}].baseRateCohortVersion`),
    modelVersion: assertNonEmpty(raw.modelVersion, `records[${index}].modelVersion`),
    calibrationVersion: assertNonEmpty(raw.calibrationVersion, `records[${index}].calibrationVersion`),
    regimeId: raw.regimeId == null ? "UNSPECIFIED" : assertNonEmpty(raw.regimeId, `records[${index}].regimeId`),
    predictedProbability: assertProbability(
      raw.predictedProbability,
      `records[${index}].predictedProbability`,
    ),
    uncertaintyScore,
    predictedNetUtility,
    realizedAfterCostValue,
    outcome,
    decisionAt,
    outcomeMaturedAt,
  });
}

function assertHomogeneous(records) {
  const keys = [
    "strategyId",
    "strategyVersion",
    "decisionStage",
    "targetId",
    "horizon",
    "referenceBasis",
    "costModelVersion",
    "outcomeRuleVersion",
    "baseRateCohortVersion",
    "modelVersion",
    "calibrationVersion",
  ];
  for (const key of keys) {
    const values = new Set(records.map((x) => x[key]));
    if (values.size > 1) throw new Error(`MIXED_${key.toUpperCase()}_NOT_ALLOWED`);
  }
}

function buildCalibrationBins(records, edges, empiricalRate) {
  const bins = Array.from({ length: edges.length - 1 }, (_, i) => ({
    lower: edges[i],
    upper: edges[i + 1],
    upperInclusive: i === edges.length - 2,
    n: 0,
    meanPredictedProbability: null,
    observedRate: null,
    gap: null,
  }));
  const bucketPred = bins.map(() => []);
  const bucketY = bins.map(() => []);

  for (const row of records) {
    const i = binIndex(row.predictedProbability, edges);
    bucketPred[i].push(row.predictedProbability);
    bucketY[i].push(row.outcome);
  }

  let reliability = 0;
  let resolution = 0;
  let ece = 0;
  const total = records.length;

  for (let i = 0; i < bins.length; i += 1) {
    const n = bucketPred[i].length;
    bins[i].n = n;
    if (!n) continue;
    const p = mean(bucketPred[i]);
    const y = mean(bucketY[i]);
    const w = n / total;
    bins[i].meanPredictedProbability = p;
    bins[i].observedRate = y;
    bins[i].gap = p - y;
    reliability += w * (p - y) ** 2;
    resolution += w * (y - empiricalRate) ** 2;
    ece += w * Math.abs(p - y);
  }

  return {
    bins,
    binnedDecomposition: {
      reliability,
      resolution,
      uncertainty: empiricalRate * (1 - empiricalRate),
      approximateBrierFromBins:
        reliability - resolution + empiricalRate * (1 - empiricalRate),
      note:"Binned decomposition is diagnostic and depends on frozen grouping; exact Brier is primary.",
    },
    eceSecondaryOnly: ece,
  };
}

function selectiveDecision(row, {
  maxUncertaintyScore = null,
  minPredictedNetUtility = null,
} = {}) {
  const requiresUncertainty = maxUncertaintyScore !== null;
  const requiresUtility = minPredictedNetUtility !== null;

  if (requiresUncertainty && row.uncertaintyScore === null) {
    return { state: "DATA_BLOCKED", reason: "UNCERTAINTY_REQUIRED_BUT_MISSING" };
  }
  if (requiresUtility && row.predictedNetUtility === null) {
    return { state: "DATA_BLOCKED", reason: "PREDICTED_NET_UTILITY_REQUIRED_BUT_MISSING" };
  }
  if (requiresUncertainty && row.uncertaintyScore > maxUncertaintyScore) {
    return { state: "ABSTAIN", reason: "UNCERTAINTY_ABOVE_FROZEN_THRESHOLD" };
  }
  if (requiresUtility && row.predictedNetUtility <= minPredictedNetUtility) {
    return { state: "ABSTAIN", reason: "NET_UTILITY_NOT_ABOVE_FROZEN_THRESHOLD" };
  }
  return { state: "ACCEPT", reason: "FROZEN_SELECTIVE_POLICY_PASS" };
}

export function computeBinaryExpectedValueV01({
  pWin,
  averageWin,
  averageLossMagnitude,
  tradingCost = 0,
} = {}) {
  const p = assertProbability(pWin, "pWin");
  const win = assertFinite(averageWin, "averageWin");
  const loss = assertFinite(averageLossMagnitude, "averageLossMagnitude");
  const cost = assertFinite(tradingCost, "tradingCost");
  if (win < 0 || loss < 0 || cost < 0) throw new Error("win/loss magnitude/cost must be non-negative");
  return p * win - (1 - p) * loss - cost;
}

export function updateBetaBinomialPriorV01({
  priorId,
  alpha,
  beta,
  observations = [],
  asOf,
} = {}) {
  const id = assertNonEmpty(priorId, "priorId");
  const a0 = assertFinite(alpha, "alpha");
  const b0 = assertFinite(beta, "beta");
  if (!(a0 > 0) || !(b0 > 0)) throw new Error("alpha and beta must be > 0");
  const cutoff = assertTimestamp(asOf, "asOf");

  let successes = 0;
  let failures = 0;
  let immature = 0;
  let unknown = 0;

  const seen = new Set();
  for (let i = 0; i < observations.length; i += 1) {
    const row = observations[i];
    const observationId = assertNonEmpty(row?.observationId, `observations[${i}].observationId`);
    if (seen.has(observationId)) throw new Error("DUPLICATE_OBSERVATION_ID");
    seen.add(observationId);

    const maturedAt = row?.outcomeMaturedAt == null
      ? null
      : assertTimestamp(row.outcomeMaturedAt, `observations[${i}].outcomeMaturedAt`);
    const outcome = row?.outcome == null ? null : Number(row.outcome);
    if (outcome !== null && outcome !== 0 && outcome !== 1) {
      throw new Error(`observations[${i}].outcome must be 0, 1 or null`);
    }
    if (!maturedAt || outcome === null) {
      unknown += 1;
      continue;
    }
    if (Date.parse(maturedAt) > Date.parse(cutoff)) {
      immature += 1;
      continue;
    }
    if (outcome === 1) successes += 1;
    else failures += 1;
  }

  const posteriorAlpha = a0 + successes;
  const posteriorBeta = b0 + failures;
  const total = posteriorAlpha + posteriorBeta;
  const posteriorMean = posteriorAlpha / total;
  const posteriorVariance =
    (posteriorAlpha * posteriorBeta) / (total ** 2 * (total + 1));

  return Object.freeze({
    version: D16_25_PROBABILITY_VALIDATION_VERSION,
    priorId:id,
    asOf:cutoff,
    priorAlpha:a0,
    priorBeta:b0,
    successes,
    failures,
    eligibleObservationCount:successes + failures,
    immatureObservationCount:immature,
    unknownObservationCount:unknown,
    posteriorAlpha,
    posteriorBeta,
    posteriorMean,
    posteriorVariance,
    note:"Beta-Binomial is a binary base-rate baseline, not proof that equity payoffs are Bernoulli or independent.",
    formalCoreImpact:false,
  });
}

export function evaluateBinaryPredictionsV01({
  records,
  evaluationCutoff,
  referenceBaseRate = null,
  calibrationBinEdges = DEFAULT_CALIBRATION_BIN_EDGES_V0_1,
  selectivePolicy = null,
} = {}) {
  if (!Array.isArray(records) || records.length === 0) throw new Error("records are required");
  const cutoff = assertTimestamp(evaluationCutoff, "evaluationCutoff");
  const edges = validateBinEdges(calibrationBinEdges);
  const normalized = records.map(normalizeRecord);

  const ids = new Set();
  for (const row of normalized) {
    if (ids.has(row.predictionId)) throw new Error("DUPLICATE_PREDICTION_ID");
    ids.add(row.predictionId);
    if (Date.parse(row.decisionAt) > Date.parse(cutoff)) {
      throw new Error("PREDICTION_DECISION_AFTER_EVALUATION_CUTOFF");
    }
  }
  assertHomogeneous(normalized);

  const eligible = [];
  const immature = [];
  const unknownOutcome = [];
  for (const row of normalized) {
    if (row.outcome === null || row.outcomeMaturedAt === null) {
      unknownOutcome.push(row.predictionId);
    } else if (Date.parse(row.outcomeMaturedAt) > Date.parse(cutoff)) {
      immature.push(row.predictionId);
    } else {
      eligible.push(row);
    }
  }

  if (!eligible.length) {
    return Object.freeze({
      version:D16_25_PROBABILITY_VALIDATION_VERSION,
      evaluationCutoff:cutoff,
      totalPredictionCount:normalized.length,
      eligibleMaturedCount:0,
      immatureCount:immature.length,
      unknownOutcomeCount:unknownOutcome.length,
      status:"NO_MATURED_OUTCOMES",
      researchOnly:true,
      formalCoreImpact:false,
    });
  }

  const brier = mean(eligible.map((x) => (x.predictedProbability - x.outcome) ** 2));
  const logLossTerms = eligible.map((x) => exactBinaryLogLoss(x.predictedProbability, x.outcome));
  const logLoss = logLossTerms.some((x) => !Number.isFinite(x))
    ? Number.POSITIVE_INFINITY
    : mean(logLossTerms);
  const empiricalRate = mean(eligible.map((x) => x.outcome));

  let frozenBaseRate = null;
  let baseRateBrier = null;
  let brierSkillVsFrozenBaseRate = null;
  if (referenceBaseRate !== null) {
    frozenBaseRate = assertProbability(referenceBaseRate, "referenceBaseRate");
    baseRateBrier = mean(eligible.map((x) => (frozenBaseRate - x.outcome) ** 2));
    brierSkillVsFrozenBaseRate = baseRateBrier > 0 ? 1 - brier / baseRateBrier : null;
  }

  const calibration = buildCalibrationBins(eligible, edges, empiricalRate);
  const uniqueScanDates = [...new Set(eligible.map((x) => x.scanDate))].sort();

  const regimeGroups = new Map();
  for (const row of eligible) {
    if (!regimeGroups.has(row.regimeId)) regimeGroups.set(row.regimeId, []);
    regimeGroups.get(row.regimeId).push(row);
  }
  const regimeDiagnostics = Object.fromEntries(
    [...regimeGroups.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([regimeId, rows]) => {
      const ll = rows.map((x) => exactBinaryLogLoss(x.predictedProbability, x.outcome));
      return [regimeId, {
        n:rows.length,
        independentScanDateCount:new Set(rows.map((x) => x.scanDate)).size,
        empiricalOutcomeRate:mean(rows.map((x) => x.outcome)),
        brierScore:mean(rows.map((x) => (x.predictedProbability - x.outcome) ** 2)),
        logLoss:ll.some((x) => !Number.isFinite(x)) ? Number.POSITIVE_INFINITY : mean(ll),
        note:"Regime diagnostics are descriptive; low-N cells must not be interpreted as stable calibration."
      }];
    }),
  );

  let selective = null;
  if (selectivePolicy !== null) {
    const maxU = selectivePolicy.maxUncertaintyScore == null
      ? null
      : assertProbability(selectivePolicy.maxUncertaintyScore, "selectivePolicy.maxUncertaintyScore");
    const minUtility = selectivePolicy.minPredictedNetUtility == null
      ? null
      : assertFinite(selectivePolicy.minPredictedNetUtility, "selectivePolicy.minPredictedNetUtility");
    if (maxU === null && minUtility === null) throw new Error("selectivePolicy must freeze at least one gate");

    const rows = eligible.map((row) => ({
      row,
      decision:selectiveDecision(row, {
        maxUncertaintyScore:maxU,
        minPredictedNetUtility:minUtility,
      }),
    }));
    const accepted = rows.filter((x) => x.decision.state === "ACCEPT");
    const abstained = rows.filter((x) => x.decision.state === "ABSTAIN");
    const blocked = rows.filter((x) => x.decision.state === "DATA_BLOCKED");
    const realizedRows = rows.filter((x) => x.row.realizedAfterCostValue !== null);
    const acceptedRealized = accepted.filter((x) => x.row.realizedAfterCostValue !== null);
    const positiveRealized = realizedRows.filter((x) => x.row.realizedAfterCostValue > 0);
    const acceptedPositive = acceptedRealized.filter((x) => x.row.realizedAfterCostValue > 0);
    const acceptedNegative = acceptedRealized.filter((x) => x.row.realizedAfterCostValue < 0);

    selective = {
      policyVersion:assertNonEmpty(selectivePolicy.policyVersion, "selectivePolicy.policyVersion"),
      maxUncertaintyScore:maxU,
      minPredictedNetUtility:minUtility,
      acceptedCount:accepted.length,
      abstainedCount:abstained.length,
      dataBlockedCount:blocked.length,
      acceptedCoverage:accepted.length / eligible.length,
      abstentionRate:abstained.length / eligible.length,
      dataBlockedRate:blocked.length / eligible.length,
      acceptedBrier:accepted.length
        ? mean(accepted.map((x) => (x.row.predictedProbability - x.row.outcome) ** 2))
        : null,
      realizedValueCoverage:realizedRows.length / eligible.length,
      acceptedMeanRealizedAfterCostValue:acceptedRealized.length
        ? mean(acceptedRealized.map((x) => x.row.realizedAfterCostValue))
        : null,
      opportunityCapture:positiveRealized.length
        ? acceptedPositive.length / positiveRealized.length
        : null,
      missedPositiveOpportunityCount:positiveRealized.length - acceptedPositive.length,
      falseAcceptanceRate:acceptedRealized.length
        ? acceptedNegative.length / acceptedRealized.length
        : null,
      stateByPrediction:Object.fromEntries(rows.map((x) => [
        x.row.predictionId,
        x.decision,
      ])),
      note:"Selective thresholds are evaluated as frozen inputs; this function does not search or optimize them from outcomes.",
    };
  }

  return Object.freeze({
    version:D16_25_PROBABILITY_VALIDATION_VERSION,
    status:"MATURED_EVALUATION_AVAILABLE",
    evaluationCutoff:cutoff,
    identity:{
      strategyId:eligible[0].strategyId,
      strategyVersion:eligible[0].strategyVersion,
      decisionStage:eligible[0].decisionStage,
      targetId:eligible[0].targetId,
      horizon:eligible[0].horizon,
      referenceBasis:eligible[0].referenceBasis,
      costModelVersion:eligible[0].costModelVersion,
      outcomeRuleVersion:eligible[0].outcomeRuleVersion,
      baseRateCohortVersion:eligible[0].baseRateCohortVersion,
      modelVersion:eligible[0].modelVersion,
      calibrationVersion:eligible[0].calibrationVersion,
    },
    totalPredictionCount:normalized.length,
    eligibleMaturedCount:eligible.length,
    immatureCount:immature.length,
    immaturePredictionIds:immature,
    unknownOutcomeCount:unknownOutcome.length,
    unknownOutcomePredictionIds:unknownOutcome,
    independentScanDateCount:uniqueScanDates.length,
    scanDates:uniqueScanDates,
    empiricalOutcomeRate:empiricalRate,
    brierScore:brier,
    logLoss,
    referenceBaseRate:frozenBaseRate,
    referenceBaseRateBrier:baseRateBrier,
    brierSkillVsFrozenBaseRate,
    calibrationBinEdges:edges,
    calibrationBins:calibration.bins,
    binnedBrierDecomposition:calibration.binnedDecomposition,
    eceSecondaryOnly:calibration.eceSecondaryOnly,
    regimeDiagnostics,
    selectivePolicyEvaluation:selective,
    safeguards:{
      empiricalOutcomeRateUsedAsFrozenReferenceBaseRate:false,
      immatureOutcomeCoercedToLoss:false,
      probabilityClippingApplied:false,
      probabilityNearHalfUsedAsUncertaintyProxy:false,
      thresholdOptimizationPerformed:false,
    },
    researchOnly:true,
    formalCoreImpact:false,
  });
}


export function evaluateFrozenSelectivePolicySetV01({
  records,
  evaluationCutoff,
  referenceBaseRate = null,
  calibrationBinEdges = DEFAULT_CALIBRATION_BIN_EDGES_V0_1,
  policies,
} = {}) {
  if (!Array.isArray(policies) || policies.length < 2) {
    throw new Error("at least two preregistered policies are required");
  }
  const seen = new Set();
  const policyResults = [];
  for (const policy of policies) {
    const policyVersion = assertNonEmpty(policy?.policyVersion, "policy.policyVersion");
    if (seen.has(policyVersion)) throw new Error("DUPLICATE_POLICY_VERSION");
    seen.add(policyVersion);
    const result = evaluateBinaryPredictionsV01({
      records,
      evaluationCutoff,
      referenceBaseRate,
      calibrationBinEdges,
      selectivePolicy:policy,
    });
    policyResults.push({
      policyVersion,
      selectivePolicyEvaluation:result.selectivePolicyEvaluation,
    });
  }
  return Object.freeze({
    version:D16_25_PROBABILITY_VALIDATION_VERSION,
    evaluationCutoff:assertTimestamp(evaluationCutoff, "evaluationCutoff"),
    policyCount:policyResults.length,
    policyResults,
    bestPolicySelected:false,
    selectionRule:"NO_OUTCOME_TUNED_POLICY_SELECTION",
    note:"This function evaluates preregistered operating points only; it never selects an optimal threshold from outcomes.",
    researchOnly:true,
    formalCoreImpact:false,
  });
}
