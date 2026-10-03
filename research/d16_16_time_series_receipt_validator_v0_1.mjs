// D16-16 research-only chronological prediction receipt validator.
// No runtime/Formal Core integration.

export const EPOCH_ONE = Object.freeze({
  targetId: "D03_D5_RAW_NON_OVERLAP_RETURN",
  horizon: "D5_SYMBOL_SESSIONS",
  baselineId: "EXPANDING_MEAN_D5",
  challengerId: "AR1_DATE_BALANCED_D5",
  allowedLag: 1,
  regimeRole: "ATTRIBUTION_ONLY",
});

function fail(code, detail) {
  const e = new Error(code + (detail ? ": " + detail : ""));
  e.code = code;
  throw e;
}

function ms(x, field) {
  const v = Date.parse(x);
  if (!Number.isFinite(v)) fail("INVALID_TIMESTAMP", field);
  return v;
}

export function validateEpochOneSpec(spec) {
  if (spec.targetId !== EPOCH_ONE.targetId) fail("TARGET_FAMILY_DRIFT");
  if (spec.horizon !== EPOCH_ONE.horizon) fail("HORIZON_FAMILY_DRIFT");
  if (spec.baselineId !== EPOCH_ONE.baselineId) fail("BASELINE_FAMILY_DRIFT");
  if (spec.challengerId !== EPOCH_ONE.challengerId) fail("CHALLENGER_FAMILY_DRIFT");
  if (spec.lag !== 1) fail("LAG_SEARCH_FORBIDDEN");
  if (spec.regimeRole !== "ATTRIBUTION_ONLY") fail("REGIME_MODEL_SELECTION_FORBIDDEN");
  if (spec.openedAlternativeHorizons?.length) fail("POST_OUTCOME_HORIZON_SEARCH_FORBIDDEN");
  return true;
}

export function validateForecastReceipt(r) {
  validateEpochOneSpec(r.spec);
  const decision = ms(r.decisionTimestamp, "decisionTimestamp");
  const written = ms(r.predictionWrittenAt, "predictionWrittenAt");
  const eligible = ms(r.outcomeEligibleAfter, "outcomeEligibleAfter");

  if (written < decision) fail("PREDICTION_BEFORE_DECISION");
  if (written >= eligible) fail("PREDICTION_NOT_PROSPECTIVE");

  if (r.preprocessorFitThrough && ms(r.preprocessorFitThrough, "preprocessorFitThrough") >= decision)
    fail("OUTER_TEST_PREPROCESSING_LEAKAGE");

  for (const p of r.trainingParents || []) {
    if (ms(p.labelMaturedAt, "trainingParents.labelMaturedAt") > decision)
      fail("UNMATURED_LABEL_IN_TRAINING", p.parentId);
    if (p.status === "UNKNOWN" || p.status === "BLOCKED")
      fail("UNKNOWN_PARENT_IN_TRAINING", p.parentId);
    if (p.outcome === 0 && p.originalOutcomeStatus && p.originalOutcomeStatus !== "KNOWN")
      fail("MISSING_OUTCOME_COERCED_TO_ZERO", p.parentId);
  }

  if (r.regime?.observedAt && ms(r.regime.observedAt, "regime.observedAt") > decision)
    fail("HINDSIGHT_REGIME_LEAKAGE");
  if (r.regime?.source === "HINDSIGHT")
    fail("HINDSIGHT_REGIME_LEAKAGE");

  const uniqueDates = new Set((r.trainingParents || []).map(x => x.decisionDate));
  if (r.eligibleTrainingDateCount !== uniqueDates.size)
    fail("SAME_DATE_PSEUDOREPLICATION");

  if (!r.parentGenerationId || !r.parentGenerationHash)
    fail("PARENT_GENERATION_PROVENANCE_MISSING");
  if (!["COMPLETE","KNOWN"].includes(r.sourceContinuityStatus))
    fail("SOURCE_CONTINUITY_NOT_READY");

  return true;
}

export function validateImmutablePair(beforeOutcome, afterOutcome) {
  const frozen = [
    "experimentId","forecastOriginDate","decisionTimestamp","targetId",
    "modelVersion","baselineVersion","featureVersion","preprocessingVersion",
    "parentGenerationId","parentGenerationHash","prediction","predictionWrittenAt"
  ];
  for (const k of frozen) {
    if (JSON.stringify(beforeOutcome[k]) !== JSON.stringify(afterOutcome[k]))
      fail("PREDICTION_RECEIPT_MUTATED_AFTER_OUTCOME", k);
  }
  return true;
}
