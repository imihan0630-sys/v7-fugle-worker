import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { validateD18ObservableRegimeVectorV0_1 } from "./d18_observable_regime_vector_v0_1.mjs";
import { classifyS2ExecutionDenominatorV0_1 } from "./execution_denominator_guard_v0_1.mjs";

export const D18_REGIME_ATTRIBUTION_VERSION = "D18_REGIME_ATTRIBUTION_V0_2_RESEARCH_EXECUTION_DENOMINATOR_FENCED";
const VECTOR_VERSION = "D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH";
const HORIZONS = new Set([1, 3, 5, 10, 20]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function iso(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be ISO timestamp`);
  return new Date(text).toISOString();
}

function finiteOrNull(value) {
  return Number.isFinite(value) ? Number(value) : null;
}

function vectorSnapshot(regimeVector) {
  const out = {};
  for (const key of Object.keys(regimeVector.dimensions || {}).sort()) {
    const row = regimeVector.dimensions[key] || {};
    out[key] = {
      state: row.state || "UNKNOWN",
      value: row.value ?? null,
      reason: row.reason ?? null,
      sourceRef: row.sourceRef ?? null,
      sourceIdentity: row.sourceIdentity ?? null,
      availableAt: row.availableAt ?? null,
      pointInTimeEligible: row.pointInTimeEligible === true,
      evidenceHash: row.evidenceHash ?? null,
    };
  }
  return deepFreeze(out);
}

function discreteLabels(dimensions) {
  return deepFreeze(Object.fromEntries(
    Object.entries(dimensions)
      .filter(([, row]) =>
        row.state === "KNOWN"
        && row.value !== null
        && row.pointInTimeEligible === true
      )
      .map(([key, row]) => [key, row.value]),
  ));
}

function rawContexts(dimensions) {
  return deepFreeze(Object.fromEntries(
    Object.entries(dimensions)
      .filter(([, row]) => row.state === "CONTEXT_RAW")
      .map(([key, row]) => [key, { reason: row.reason, sourceRef: row.sourceRef }]),
  ));
}

function unknownDimensions(dimensions) {
  return Object.freeze(
    Object.entries(dimensions)
      .filter(([, row]) => row.state === "UNKNOWN")
      .map(([key]) => key)
      .sort(),
  );
}

export async function buildD18RegimeAttributionReceiptV0_1({
  receiptId,
  decisionSnapshot,
  regimeVector,
  outcomeSnapshot,
  horizon,
  costScenarioId = null,
  observedAt,
} = {}) {
  const id = requiredText(receiptId, "receiptId");
  if (!decisionSnapshot || typeof decisionSnapshot !== "object") {
    throw new Error("decisionSnapshot is required");
  }
  if (!regimeVector || typeof regimeVector !== "object") {
    throw new Error("regimeVector is required");
  }
  if (!outcomeSnapshot || typeof outcomeSnapshot !== "object") {
    throw new Error("outcomeSnapshot is required");
  }

  const h = Number(horizon);
  if (!HORIZONS.has(h)) throw new Error("horizon must be one of D1/D3/D5/D10/D20");

  const e = decisionSnapshot.evaluation || {};
  const decisionId = requiredText(e.decisionId, "decisionSnapshot.evaluation.decisionId");
  const decisionHash = requiredText(e.decisionHash, "decisionSnapshot.evaluation.decisionHash");
  const symbol = requiredText(e.symbol, "decisionSnapshot.evaluation.symbol");
  const marketDate = requiredText(e.marketDate, "decisionSnapshot.evaluation.marketDate");
  const decisionTimestamp = iso(
    e.decisionTimestamp,
    "decisionSnapshot.evaluation.decisionTimestamp",
  );
  const strategyId = requiredText(e.strategyId, "decisionSnapshot.evaluation.strategyId");
  const strategyVersion = requiredText(
    e.strategyVersion,
    "decisionSnapshot.evaluation.strategyVersion",
  );

  if (regimeVector.vectorVersion !== VECTOR_VERSION) {
    throw new Error("unsupported regimeVector version");
  }
  const regimeHash = typeof regimeVector.receiptHash === "string"
    ? regimeVector.receiptHash
    : null;
  const regimeValidation = await validateD18ObservableRegimeVectorV0_1(regimeVector);
  if (regimeVector.marketDate !== marketDate) throw new Error("regime marketDate mismatch");
  if (iso(regimeVector.decisionTimestamp, "regimeVector.decisionTimestamp") !== decisionTimestamp) {
    throw new Error("regime decisionTimestamp mismatch");
  }

  if (outcomeSnapshot.decisionId !== decisionId) throw new Error("outcome decisionId mismatch");
  if (outcomeSnapshot.symbol !== symbol) throw new Error("outcome symbol mismatch");
  if (outcomeSnapshot.decisionMarketDate !== marketDate) throw new Error("outcome marketDate mismatch");
  if (iso(outcomeSnapshot.decisionTimestamp, "outcomeSnapshot.decisionTimestamp") !== decisionTimestamp) {
    throw new Error("outcome decisionTimestamp mismatch");
  }
  const outcomeHash = requiredText(outcomeSnapshot.outcomeHash, "outcomeSnapshot.outcomeHash");
  const outcomeUpdatedAt = iso(outcomeSnapshot.updatedAt, "outcomeSnapshot.updatedAt");
  const at = iso(observedAt, "observedAt");
  if (Date.parse(outcomeUpdatedAt) < Date.parse(decisionTimestamp)) {
    throw new Error("outcome updatedAt cannot precede decision");
  }
  if (Date.parse(at) < Date.parse(outcomeUpdatedAt)) {
    throw new Error("observedAt cannot precede outcome updatedAt");
  }

  const dimensions = vectorSnapshot(regimeVector);
  const labels = regimeValidation.valid ? discreteLabels(dimensions) : deepFreeze({});
  const raws = regimeValidation.valid ? rawContexts(dimensions) : deepFreeze({});
  const unknowns = regimeValidation.valid
    ? unknownDimensions(dimensions)
    : Object.freeze(Object.keys(dimensions).sort());

  const key = `D${h}`;
  const matured = (outcomeSnapshot.maturedHorizons || []).includes(h)
    && Number.isFinite(outcomeSnapshot.horizonReturns?.[key]);

  let state = "MATURED";
  const reasons = [];
  if (regimeValidation.valid !== true) {
    state = "UNKNOWN";
    reasons.push("REGIME_VECTOR_EVIDENCE_INVALID");
    reasons.push(...regimeValidation.blockers.map((code) => "REGIME:" + code));
  } else if (outcomeSnapshot.performanceEligible !== true) {
    state = "UNKNOWN";
    reasons.push("OUTCOME_NOT_PERFORMANCE_ELIGIBLE");
  } else if (!matured) {
    state = "IMMATURE";
    reasons.push("REQUESTED_HORIZON_NOT_MATURED");
  }

  let selectedCostScenario = null;
  if (costScenarioId !== null) {
    const scenario = outcomeSnapshot.costScenarios?.[costScenarioId];
    if (!scenario) {
      state = state === "UNKNOWN" ? state : "UNKNOWN";
      reasons.push("REQUESTED_COST_SCENARIO_MISSING");
    } else {
      selectedCostScenario = {
        scenarioId: String(costScenarioId),
        roundTripCostRate: finiteOrNull(scenario.roundTripCostRate),
        horizonReturn: finiteOrNull(scenario.horizonReturns?.[key]),
        semantics: scenario.semantics || null,
      };
      if (matured && selectedCostScenario.horizonReturn === null) {
        state = state === "UNKNOWN" ? state : "UNKNOWN";
        reasons.push("COST_SCENARIO_HORIZON_RETURN_MISSING");
      }
    }
  }

  const executionGate = classifyS2ExecutionDenominatorV0_1(
    outcomeSnapshot.simulatedExecution ?? null,
  );

  // Signal-horizon returns and simulated fill/net returns are distinct.
  // A modeled fill cannot acquire real execution authority through attribution.
  const metrics = state === "MATURED"
    ? deepFreeze({
        horizon: h,
        stockReturn: finiteOrNull(outcomeSnapshot.horizonReturns?.[key]),
        benchmarkReturn: finiteOrNull(outcomeSnapshot.benchmarkReturns?.[key]),
        industryReturn: finiteOrNull(outcomeSnapshot.industryReturns?.[key]),
        relativeBenchmarkReturn: finiteOrNull(outcomeSnapshot.relativeBenchmarkReturns?.[key]),
        relativeIndustryReturn: finiteOrNull(outcomeSnapshot.relativeIndustryReturns?.[key]),
        mfe: finiteOrNull(outcomeSnapshot.mfe),
        mae: finiteOrNull(outcomeSnapshot.mae),
        costScenario: selectedCostScenario ? deepFreeze(selectedCostScenario) : null,
        simulatedExecution: outcomeSnapshot.simulatedExecution
          ? deepFreeze({
              state: outcomeSnapshot.simulatedExecution.state,
              realizedReturnAfterCost: null,
              modeledReturnIsNotCertified: true,
              executionDenominatorEligible: false,
              executionEvidenceClassification: executionGate.classification,
              holdingSessions: outcomeSnapshot.simulatedExecution.holdingSessions ?? null,
              fillQuality: outcomeSnapshot.simulatedExecution.fillQuality ?? null,
              executionVersion: outcomeSnapshot.simulatedExecution.executionVersion ?? null,
            })
          : null,
      })
    : null;

  const base = {
    receiptId: id,
    attributionVersion: D18_REGIME_ATTRIBUTION_VERSION,
    decisionId,
    decisionHash,
    symbol,
    marketDate,
    decisionTimestamp,
    strategyId,
    strategyVersion,
    candidateState: requiredText(e.state, "decisionSnapshot.evaluation.state"),
    regimeVectorHash: regimeHash,
    regimeVectorVersion: regimeVector.vectorVersion,
    regimeEvidenceValid: regimeValidation.valid === true,
    regimeEvidenceBlockers: Object.freeze([...regimeValidation.blockers]),
    regimeDimensions: dimensions,
    discreteRegimeLabels: labels,
    rawRegimeContexts: raws,
    unknownRegimeDimensions: unknowns,
    outcomeHash,
    outcomeUpdatedAt,
    executionEvidenceGate: executionGate,
    signalHorizonObservationOnly: true,
    certifiedExecutionReturn: null,
    certifiedSelectedToTriggeredDenominator: null,
    certifiedNoFillDenominator: null,
    outcomePriceSpace: outcomeSnapshot.priceSpace || null,
    corporateActionState: outcomeSnapshot.corporateActionState || null,
    requestedHorizon: h,
    requestedCostScenarioId: costScenarioId,
    maturedHorizons: Object.freeze([...(outcomeSnapshot.maturedHorizons || [])]),
    state,
    reasons: Object.freeze([...new Set(reasons)]),
    metrics,
    attributionOnly: true,
    policyValueEvaluated: false,
    switchingRuleApplied: false,
    dynamicWeightApplied: false,
    rankingImpact: false,
    selectionImpact: false,
    capitalImpact: false,
    observedAt: at,
    schemaVersion: D18_REGIME_ATTRIBUTION_VERSION,
  };

  return deepFreeze({ ...base, receiptHash: await sha256Hex(base) });
}
