import crypto from "node:crypto";

function stable(v) {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, stable(v[k])]));
  }
  return v;
}

export function stableJson(v) {
  return JSON.stringify(stable(v));
}

export function sha256(v) {
  return crypto.createHash("sha256").update(typeof v === "string" ? v : stableJson(v)).digest("hex");
}

function must(cond, msg) {
  if (!cond) throw new Error(msg);
}

function finiteNonNegative(x, name) {
  must(Number.isFinite(x) && x >= 0, `${name}_INVALID`);
}

function ts(x, name) {
  const n = Date.parse(x);
  must(Number.isFinite(n), `${name}_INVALID`);
  return n;
}

function validateCost(cost, decisionTimestamp) {
  must(cost && cost.version && cost.costHash, "COST_CONTRACT_INCOMPLETE");
  finiteNonNegative(cost.roundTripCostRate, "ROUND_TRIP_COST");
  must(ts(cost.availableAt, "COST_AVAILABLE_AT") <= ts(decisionTimestamp, "DECISION_TIMESTAMP"), "COST_AFTER_DECISION");
}

function validateRegistration(reg, decisionTimestamp, policyClass) {
  must(reg && reg.state === "PREREGISTERED_SHADOW", "REGISTRATION_NOT_PREREGISTERED");
  must(reg.policyClass === policyClass, "POLICY_CLASS_MISMATCH");
  must(reg.parameterHash && reg.registeredAt && reg.availableAt, "REGISTRATION_INCOMPLETE");
  must(ts(reg.registeredAt, "REGISTERED_AT") <= ts(decisionTimestamp, "DECISION_TIMESTAMP"), "REGISTRATION_AFTER_DECISION");
  must(ts(reg.availableAt, "REG_AVAILABLE_AT") <= ts(decisionTimestamp, "DECISION_TIMESTAMP"), "REGISTRATION_NOT_AVAILABLE");
  must(reg.outcomeSelected !== true, "OUTCOME_SELECTED_POLICY_FORBIDDEN");
}

function validateWeights(weights, expectedStrategies) {
  must(weights && typeof weights === "object" && !Array.isArray(weights), "WEIGHTS_INVALID");
  const ids = Object.keys(weights).sort();
  const exp = [...expectedStrategies].sort();
  must(stableJson(ids) === stableJson(exp), "WEIGHT_STRATEGY_SET_MISMATCH");
  let sum = 0;
  for (const id of ids) {
    const w = weights[id];
    must(Number.isFinite(w) && w >= 0 && w <= 1, "WEIGHT_VALUE_INVALID");
    sum += w;
  }
  must(Math.abs(sum - 1) <= 1e-12, "WEIGHTS_MUST_SUM_TO_ONE");
}

function regimeState(regimeVector, dimension) {
  const d = regimeVector?.dimensions?.[dimension];
  if (!d || d.state !== "KNOWN" || d.value == null) return { known: false, value: null };
  return { known: true, value: d.value };
}

export function buildDynamicWeightFrame(input) {
  const {
    strategyDay,
    regimeVector,
    registration,
    costContract,
    expectedStrategies,
    staticWeights,
    discreteWeightMap,
    regimeDimension,
  } = input;

  must(strategyDay?.marketDate && strategyDay?.decisionTimestamp && strategyDay?.frameHash, "STRATEGY_DAY_INCOMPLETE");
  must(regimeVector?.marketDate === strategyDay.marketDate, "REGIME_MARKET_DATE_MISMATCH");
  must(regimeVector?.decisionTimestamp === strategyDay.decisionTimestamp, "REGIME_DECISION_TIME_MISMATCH");
  must(regimeVector?.pointInTimeEligible === true && regimeVector?.vectorHash, "REGIME_NOT_PIT_ELIGIBLE");
  must(Array.isArray(expectedStrategies) && expectedStrategies.length >= 2, "EXPECTED_STRATEGIES_INVALID");
  validateWeights(staticWeights, expectedStrategies);
  must(discreteWeightMap && typeof discreteWeightMap === "object", "DISCRETE_WEIGHT_MAP_MISSING");

  validateRegistration(registration, strategyDay.decisionTimestamp, "DISCRETE_DYNAMIC_WEIGHTING");
  validateCost(costContract, strategyDay.decisionTimestamp);

  const expectedParameterHash = sha256({
    policyClass: registration.policyClass,
    regimeDimension,
    expectedStrategies: [...expectedStrategies].sort(),
    staticWeights,
    discreteWeightMap,
  });
  must(registration.parameterHash === expectedParameterHash, "PARAMETER_HASH_MISMATCH");

  const rs = regimeState(regimeVector, regimeDimension);
  const base = {
    schemaVersion: "D18_DYNAMIC_WEIGHT_FRAME_V0_1",
    marketDate: strategyDay.marketDate,
    decisionTimestamp: strategyDay.decisionTimestamp,
    strategyDayHash: strategyDay.frameHash,
    regimeVectorHash: regimeVector.vectorHash,
    regimeVectorVersion: regimeVector.vectorVersion,
    regimeDimension,
    registrationHash: registration.registrationHash || sha256(registration),
    parameterHash: registration.parameterHash,
    costHash: costContract.costHash,
    staticWeights,
    outcomeAccessed: false,
    policyValueEvaluated: false,
    selectionImpact: false,
    rankingImpact: false,
    capitalImpact: false,
  };

  if (!rs.known || !Object.prototype.hasOwnProperty.call(discreteWeightMap, rs.value)) {
    const out = {
      ...base,
      regimeState: rs.known ? rs.value : null,
      disposition: "DATA_UNKNOWN",
      dynamicWeights: null,
      weightChangeL1: null,
    };
    return { ...out, frameHash: sha256(out) };
  }

  const dynamicWeights = discreteWeightMap[rs.value];
  validateWeights(dynamicWeights, expectedStrategies);
  const weightChangeL1 = expectedStrategies.reduce((a, id) => a + Math.abs(dynamicWeights[id] - staticWeights[id]), 0);
  const out = {
    ...base,
    regimeState: rs.value,
    disposition: "POLICY_WEIGHT_DEFINED",
    dynamicWeights,
    weightChangeL1,
  };
  return { ...out, frameHash: sha256(out) };
}

function validatePriorReturn(r, decisionTimestamp) {
  must(r?.decisionId && r?.marketDate && r?.outcomeUpdatedAt && r?.attributionReceiptHash, "PRIOR_RETURN_IDENTITY_INCOMPLETE");
  must(r.state === "MATURED", "PRIOR_RETURN_NOT_MATURED");
  must(Number.isFinite(r.netReturn), "PRIOR_RETURN_VALUE_INVALID");
  must(ts(r.outcomeUpdatedAt, "OUTCOME_UPDATED_AT") <= ts(decisionTimestamp, "DECISION_TIMESTAMP"), "PRIOR_RETURN_AFTER_DECISION");
}

function drawdownFromReturns(rows) {
  let wealth = 1;
  let peak = 1;
  let maxDrawdown = 0;
  let currentDrawdown = 0;
  for (const r of rows) {
    wealth *= 1 + r.netReturn;
    must(Number.isFinite(wealth) && wealth > 0, "WEALTH_PATH_INVALID");
    peak = Math.max(peak, wealth);
    currentDrawdown = wealth / peak - 1;
    maxDrawdown = Math.min(maxDrawdown, currentDrawdown);
  }
  return { wealth, peak, currentDrawdown, maxDrawdown };
}

function chooseExposure(rules, fallbackExposure, dd) {
  must(Array.isArray(rules) && rules.length >= 1, "DRAWDOWN_RULES_MISSING");
  must(Number.isFinite(fallbackExposure) && fallbackExposure >= 0 && fallbackExposure <= 1, "FALLBACK_EXPOSURE_INVALID");
  const sorted = rules.map((r) => {
    must(Number.isFinite(r.drawdownLte) && r.drawdownLte < 0, "DRAWDOWN_THRESHOLD_INVALID");
    must(Number.isFinite(r.exposure) && r.exposure >= 0 && r.exposure <= 1, "DRAWDOWN_EXPOSURE_INVALID");
    return { drawdownLte: r.drawdownLte, exposure: r.exposure };
  }).sort((a,b)=>a.drawdownLte-b.drawdownLte);
  for (const r of sorted) if (dd <= r.drawdownLte) return r.exposure;
  return fallbackExposure;
}

export function buildDrawdownDeriskFrame(input) {
  const {
    marketDate,
    decisionTimestamp,
    strategyId,
    strategyVersion,
    historyCoverageState,
    unresolvedPriorDecisionCount,
    priorReturns,
    registration,
    costContract,
  } = input;

  must(marketDate && decisionTimestamp && strategyId && strategyVersion, "CURRENT_IDENTITY_INCOMPLETE");
  validateRegistration(registration, decisionTimestamp, "DRAWDOWN_DERISKING");
  validateCost(costContract, decisionTimestamp);

  const expectedParameterHash = sha256({
    policyClass: registration.policyClass,
    strategyId,
    strategyVersion,
    rules: registration.rules,
    fallbackExposure: registration.fallbackExposure,
  });
  must(registration.parameterHash === expectedParameterHash, "PARAMETER_HASH_MISMATCH");

  const base = {
    schemaVersion: "D18_DRAWDOWN_DERISK_FRAME_V0_1",
    marketDate,
    decisionTimestamp,
    strategyId,
    strategyVersion,
    registrationHash: registration.registrationHash || sha256(registration),
    parameterHash: registration.parameterHash,
    costHash: costContract.costHash,
    historyCoverageState,
    unresolvedPriorDecisionCount,
    baselineExposure: 1,
    priorMaturedOutcomeHistoryConsumed: historyCoverageState === "COMPLETE" && unresolvedPriorDecisionCount === 0,
    currentOrFutureOutcomeAccessed: false,
    policyValueEvaluated: false,
    selectionImpact: false,
    rankingImpact: false,
    capitalImpact: false,
  };

  if (historyCoverageState !== "COMPLETE" || unresolvedPriorDecisionCount !== 0) {
    const out = {
      ...base,
      disposition: "DATA_UNKNOWN",
      priorDecisionCount: Array.isArray(priorReturns) ? priorReturns.length : 0,
      currentDrawdown: null,
      maxDrawdown: null,
      challengerExposure: null,
      priorEvidenceHash: null,
    };
    return { ...out, frameHash: sha256(out) };
  }

  must(Array.isArray(priorReturns) && priorReturns.length >= 1, "PRIOR_RETURNS_REQUIRED");
  const rows = [...priorReturns].sort((a,b)=>a.marketDate.localeCompare(b.marketDate)||a.decisionId.localeCompare(b.decisionId));
  const seen = new Set();
  for (const r of rows) {
    validatePriorReturn(r, decisionTimestamp);
    must(r.marketDate < marketDate, "PRIOR_RETURN_NOT_PRIOR_DATE");
    must(!seen.has(r.decisionId), "DUPLICATE_PRIOR_DECISION");
    seen.add(r.decisionId);
  }

  const path = drawdownFromReturns(rows);
  const challengerExposure = chooseExposure(registration.rules, registration.fallbackExposure, path.currentDrawdown);
  const priorEvidenceHash = sha256(rows.map((r)=>({
    decisionId:r.decisionId,
    marketDate:r.marketDate,
    outcomeUpdatedAt:r.outcomeUpdatedAt,
    attributionReceiptHash:r.attributionReceiptHash,
    netReturn:r.netReturn,
  })));

  const out = {
    ...base,
    disposition: "POLICY_EXPOSURE_DEFINED",
    priorDecisionCount: rows.length,
    currentDrawdown: path.currentDrawdown,
    maxDrawdown: path.maxDrawdown,
    endingWealthIndex: path.wealth,
    challengerExposure,
    priorEvidenceHash,
  };
  return { ...out, frameHash: sha256(out) };
}
