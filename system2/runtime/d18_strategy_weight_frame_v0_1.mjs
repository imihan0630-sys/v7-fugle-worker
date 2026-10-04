import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D18_STRATEGY_WEIGHT_FRAME_VERSION = "D18_STRATEGY_WEIGHT_FRAME_V0_1_RESEARCH";
const REGIME_VECTOR_VERSION = "D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH";
const POLICY_CLASS = "DISCRETE_REGIME_EXPOSURE_MULTIPLIER";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function iso(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be ISO timestamp`);
  return new Date(text).toISOString();
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function finite(value, field) {
  if (!Number.isFinite(value)) throw new Error(`${field} must be finite`);
  return Number(value);
}

function nonNegative(value, field) {
  const n = finite(value, field);
  if (n < 0) throw new Error(`${field} must be non-negative`);
  return n;
}

function stateCount(receipt, state) {
  const value = Number(receipt?.stateCounts?.[state] ?? 0);
  if (!Number.isInteger(value) || value < 0) throw new Error(`invalid shadow state count: ${state}`);
  return value;
}

function deriveBaselineState(shadowRunReceipt, runFingerprint) {
  const complete =
    shadowRunReceipt?.runState === "COMPLETE"
    && Number(shadowRunReceipt?.completionRate) === 1
    && runFingerprint?.runFingerprintState === "RUN_FINGERPRINT_COMPLETE"
    && runFingerprint?.outcomeJoinEligible === true;

  if (!complete) return "DATA_UNKNOWN";

  const knownOpportunityCount =
    stateCount(shadowRunReceipt, "SELECTED")
    + stateCount(shadowRunReceipt, "QUALIFIED_NOT_SELECTED");

  if (knownOpportunityCount > 0) return "BASELINE_OPPORTUNITY_PRESENT";

  const blockedCount =
    stateCount(shadowRunReceipt, "INCOMPLETE")
    + stateCount(shadowRunReceipt, "SOURCE_BLOCKED")
    + stateCount(shadowRunReceipt, "SESSION_INVALID")
    + stateCount(shadowRunReceipt, "ERROR");

  return blockedCount > 0 ? "DATA_UNKNOWN" : "NATURAL_ZERO_PICK";
}

function normalizeSessions(values) {
  if (!Array.isArray(values) || values.length < 1) {
    throw new Error("officialSessionDates must be non-empty array");
  }
  const xs = values.map(String);
  if (xs.some((x) => !validDate(x))) throw new Error("invalid official session date");
  if (new Set(xs).size !== xs.length) throw new Error("duplicate official session date");
  for (let i = 1; i < xs.length; i += 1) {
    if (xs[i] <= xs[i - 1]) throw new Error("officialSessionDates must be ascending");
  }
  return xs;
}

async function validateRegistration(registration, strategyId, strategyVersion, decisionTimestamp) {
  if (!registration || typeof registration !== "object") throw new Error("registration is required");
  if (registration.state !== "PREREGISTERED_SHADOW") {
    throw new Error("registration must be PREREGISTERED_SHADOW");
  }
  if (registration.policyClass !== POLICY_CLASS) throw new Error("unsupported weight policy class");
  if (requiredText(registration.strategyId, "registration.strategyId") !== strategyId) {
    throw new Error("registration strategyId mismatch");
  }
  if (requiredText(registration.strategyVersion, "registration.strategyVersion") !== strategyVersion) {
    throw new Error("registration strategyVersion mismatch");
  }

  const p = registration.parameters;
  if (!p || typeof p !== "object" || Array.isArray(p)) {
    throw new Error("registration.parameters is required");
  }

  const regimeDimension = requiredText(p.regimeDimension, "parameters.regimeDimension");
  if (!p.weightByValue || typeof p.weightByValue !== "object" || Array.isArray(p.weightByValue)) {
    throw new Error("parameters.weightByValue must be object");
  }
  const entries = Object.entries(p.weightByValue);
  if (entries.length < 2 || entries.length > 5) {
    throw new Error("weightByValue must remain a tiny discrete map");
  }

  const maxResearchWeight = nonNegative(p.maxResearchWeight, "parameters.maxResearchWeight");
  if (p.leverageAllowed !== false) throw new Error("leverageAllowed must be false");
  if (maxResearchWeight > 1) throw new Error("maxResearchWeight cannot exceed 1");
  const staticBaselineWeight = nonNegative(
    p.staticBaselineWeight,
    "parameters.staticBaselineWeight",
  );
  if (staticBaselineWeight !== 1) throw new Error("staticBaselineWeight must equal 1");

  const weightByValue = {};
  for (const [key, value] of entries) {
    const label = requiredText(key, "weightByValue key");
    const weight = nonNegative(value, `weightByValue.${label}`);
    if (weight > maxResearchWeight) throw new Error("research weight exceeds maxResearchWeight");
    weightByValue[label] = weight;
  }
  if (new Set(Object.values(weightByValue)).size < 2) {
    throw new Error("weightByValue must contain at least two distinct weights");
  }

  if (p.unknownAction !== "DATA_UNKNOWN") throw new Error("unknownAction must be DATA_UNKNOWN");

  const parameterHash = await sha256Hex(p);
  if (parameterHash !== requiredText(registration.parameterHash, "registration.parameterHash")) {
    throw new Error("registration parameterHash mismatch");
  }

  const registeredAt = iso(registration.registeredAt, "registration.registeredAt");
  const availableAt = iso(registration.availableAt, "registration.availableAt");
  const decisionMs = Date.parse(decisionTimestamp);
  if (Date.parse(registeredAt) > decisionMs || Date.parse(availableAt) > decisionMs) {
    throw new Error("weight registration is post-decision");
  }

  return deepFreeze({
    policyId: requiredText(registration.policyId, "registration.policyId"),
    policyVersion: requiredText(registration.policyVersion, "registration.policyVersion"),
    policyClass: POLICY_CLASS,
    strategyId,
    strategyVersion,
    parameters: deepFreeze({
      regimeDimension,
      weightByValue: deepFreeze(weightByValue),
      unknownAction: "DATA_UNKNOWN",
      staticBaselineWeight,
      maxResearchWeight,
      leverageAllowed: false,
    }),
    parameterHash,
    registeredAt,
    availableAt,
    registrationHash: await sha256Hex(registration),
  });
}

async function validateCost(costContract, decisionTimestamp) {
  if (!costContract || typeof costContract !== "object") throw new Error("turnoverCostContract is required");
  const availableAt = iso(costContract.availableAt, "turnoverCostContract.availableAt");
  if (Date.parse(availableAt) > Date.parse(decisionTimestamp)) {
    throw new Error("turnover cost contract is post-decision");
  }
  const normalized = {
    version: requiredText(costContract.version, "turnoverCostContract.version"),
    availableAt,
    oneWayTurnoverCostRate: nonNegative(
      costContract.oneWayTurnoverCostRate,
      "turnoverCostContract.oneWayTurnoverCostRate",
    ),
    note: costContract.note === null || costContract.note === undefined
      ? null
      : String(costContract.note),
  };
  return deepFreeze({ ...normalized, costHash: await sha256Hex(normalized) });
}

function validatePriorFrame(prior, {
  strategyId,
  strategyVersion,
  policyId,
  policyVersion,
  parameterHash,
  currentMarketDate,
  officialSessionDates,
}) {
  if (!prior) return { state: "WARMUP_NO_PRIOR_FRAME", priorWeight: null, priorFrameHash: null };
  if (prior.version !== D18_STRATEGY_WEIGHT_FRAME_VERSION) {
    throw new Error("prior weight frame version mismatch");
  }
  if (prior.strategyId !== strategyId || prior.strategyVersion !== strategyVersion) {
    throw new Error("prior weight frame strategy mismatch");
  }
  if (prior.registration?.policyId !== policyId || prior.registration?.policyVersion !== policyVersion) {
    throw new Error("prior weight frame policy mismatch");
  }
  if (prior.registration?.parameterHash !== parameterHash) {
    throw new Error("prior weight frame parameter mismatch");
  }
  requiredText(prior.frameHash, "priorWeightFrame.frameHash");

  const currentIndex = officialSessionDates.indexOf(currentMarketDate);
  if (currentIndex <= 0 || officialSessionDates[currentIndex - 1] !== prior.marketDate) {
    throw new Error("prior weight frame is not adjacent official session");
  }

  if (prior.challenger?.state !== "WEIGHT_ASSIGNED" || !Number.isFinite(prior.challenger?.researchWeight)) {
    return {
      state: "UNKNOWN_PRIOR_WEIGHT",
      priorWeight: null,
      priorFrameHash: prior.frameHash,
    };
  }

  return {
    state: "PRIOR_WEIGHT_KNOWN",
    priorWeight: Number(prior.challenger.researchWeight),
    priorFrameHash: prior.frameHash,
  };
}

export async function buildD18StrategyWeightFrameV0_1({
  frameId,
  shadowRunReceipt,
  runFingerprint,
  regimeVector,
  registration,
  turnoverCostContract,
  priorWeightFrame = null,
  officialSessionDates,
  createdAt,
} = {}) {
  const id = requiredText(frameId, "frameId");
  if (!shadowRunReceipt || typeof shadowRunReceipt !== "object") {
    throw new Error("shadowRunReceipt is required");
  }
  if (!runFingerprint || typeof runFingerprint !== "object") {
    throw new Error("runFingerprint is required");
  }
  if (!regimeVector || typeof regimeVector !== "object") {
    throw new Error("regimeVector is required");
  }

  const marketDate = requiredText(shadowRunReceipt.marketDate, "shadowRunReceipt.marketDate");
  if (!validDate(marketDate)) throw new Error("shadowRunReceipt.marketDate invalid");
  const decisionTimestamp = iso(
    shadowRunReceipt.decisionTimestamp,
    "shadowRunReceipt.decisionTimestamp",
  );
  const strategyId = requiredText(shadowRunReceipt.strategyId, "shadowRunReceipt.strategyId");
  const strategyVersion = requiredText(
    shadowRunReceipt.strategyVersion,
    "shadowRunReceipt.strategyVersion",
  );

  for (const [field, left, right] of [
    ["marketDate", runFingerprint.marketDate, marketDate],
    ["decisionTimestamp", iso(runFingerprint.decisionTimestamp, "runFingerprint.decisionTimestamp"), decisionTimestamp],
    ["strategyId", runFingerprint.strategyId, strategyId],
    ["strategyVersion", runFingerprint.strategyVersion, strategyVersion],
    ["shadowSpecId", runFingerprint.shadowSpecId, shadowRunReceipt.shadowSpecId],
    ["universeVersion", runFingerprint.universeVersion, shadowRunReceipt.universeVersion],
  ]) {
    if (left !== right) throw new Error(`run fingerprint ${field} mismatch`);
  }

  const accountingHash = await sha256Hex(shadowRunReceipt);
  if (accountingHash !== requiredText(runFingerprint.shadowAccountingHash, "runFingerprint.shadowAccountingHash")) {
    throw new Error("shadow accounting hash mismatch");
  }
  const runFingerprintHash = requiredText(runFingerprint.runFingerprintHash, "runFingerprint.runFingerprintHash");

  if (regimeVector.vectorVersion !== REGIME_VECTOR_VERSION) {
    throw new Error("unsupported regime vector version");
  }
  if (regimeVector.marketDate !== marketDate) throw new Error("regime marketDate mismatch");
  if (iso(regimeVector.decisionTimestamp, "regimeVector.decisionTimestamp") !== decisionTimestamp) {
    throw new Error("regime decisionTimestamp mismatch");
  }
  const regimeHash = requiredText(regimeVector.receiptHash, "regimeVector.receiptHash");

  const sessions = normalizeSessions(officialSessionDates);
  if (!sessions.includes(marketDate)) throw new Error("marketDate not present in official sessions");

  const reg = await validateRegistration(
    registration,
    strategyId,
    strategyVersion,
    decisionTimestamp,
  );
  const cost = await validateCost(turnoverCostContract, decisionTimestamp);

  const baselineState = deriveBaselineState(shadowRunReceipt, runFingerprint);
  const dimension = regimeVector.dimensions?.[reg.parameters.regimeDimension] || null;
  const regimeKnown =
    regimeVector.pointInTimeEligible === true
    && dimension?.state === "KNOWN"
    && dimension?.value !== null
    && dimension?.value !== undefined
    && Object.prototype.hasOwnProperty.call(
      reg.parameters.weightByValue,
      String(dimension.value),
    );

  let challengerState;
  let researchWeight = null;
  if (baselineState === "DATA_UNKNOWN") {
    challengerState = "DATA_UNKNOWN";
  } else if (baselineState === "NATURAL_ZERO_PICK") {
    challengerState = "NATURAL_ZERO_PICK";
  } else if (!regimeKnown) {
    challengerState = "DATA_UNKNOWN";
  } else {
    challengerState = "WEIGHT_ASSIGNED";
    researchWeight = Number(reg.parameters.weightByValue[String(dimension.value)]);
  }

  const prior = validatePriorFrame(priorWeightFrame, {
    strategyId,
    strategyVersion,
    policyId: reg.policyId,
    policyVersion: reg.policyVersion,
    parameterHash: reg.parameterHash,
    currentMarketDate: marketDate,
    officialSessionDates: sessions,
  });

  let turnoverState = "NOT_APPLICABLE";
  let policyTurnoverUnits = null;
  let incrementalTurnoverCostRate = null;
  if (challengerState === "WEIGHT_ASSIGNED") {
    if (prior.state === "WARMUP_NO_PRIOR_FRAME") {
      turnoverState = "WARMUP_NO_PRIOR_FRAME";
    } else if (prior.state === "UNKNOWN_PRIOR_WEIGHT") {
      turnoverState = "DATA_UNKNOWN";
    } else {
      turnoverState = "KNOWN";
      policyTurnoverUnits = Math.abs(researchWeight - prior.priorWeight);
      incrementalTurnoverCostRate =
        policyTurnoverUnits * cost.oneWayTurnoverCostRate;
    }
  }

  const selectedCount = stateCount(shadowRunReceipt, "SELECTED");
  const qualifiedNotSelectedCount = stateCount(shadowRunReceipt, "QUALIFIED_NOT_SELECTED");
  const staticWeight = reg.parameters.staticBaselineWeight;

  const base = {
    frameId: id,
    version: D18_STRATEGY_WEIGHT_FRAME_VERSION,
    marketDate,
    decisionTimestamp,
    strategyId,
    strategyVersion,
    runId: shadowRunReceipt.runId,
    runFingerprintHash,
    shadowAccountingHash: accountingHash,
    regimeVectorHash: regimeHash,
    regimeVectorVersion: regimeVector.vectorVersion,
    regimeDimension: reg.parameters.regimeDimension,
    regimeState: dimension?.state || "MISSING",
    regimeValue: regimeKnown ? String(dimension.value) : null,
    registration: reg,
    baseline: deepFreeze({
      state: baselineState,
      staticResearchWeight: staticWeight,
      selectedCount,
      qualifiedNotSelectedCount,
      knownOpportunityCount: selectedCount + qualifiedNotSelectedCount,
    }),
    challenger: deepFreeze({
      state: challengerState,
      researchWeight,
      exposureDeltaVsStatic:
        researchWeight === null ? null : researchWeight - staticWeight,
      leverageUsed: false,
      capitalAmountAssigned: null,
      positionSizeAssigned: null,
    }),
    turnover: deepFreeze({
      state: turnoverState,
      priorFrameHash: prior.priorFrameHash,
      priorResearchWeight: prior.priorWeight,
      currentResearchWeight: researchWeight,
      policyTurnoverUnits,
      oneWayTurnoverCostRate: cost.oneWayTurnoverCostRate,
      incrementalTurnoverCostRate,
      policyTurnoverOnly: true,
      underlyingStrategyTradingTurnoverIncluded: false,
    }),
    costContract: cost,
    missingReturnImputedAsZero: false,
    outcomeAttached: false,
    policyValueEstimated: false,
    weightOptimizedFromOutcome: false,
    continuousOptimizerUsed: false,
    thresholdSweepUsed: false,
    staticBaselinePreserved: true,
    finalSelectionEnabled: false,
    rankingImpact: false,
    selectionImpact: false,
    capitalImpact: false,
    monitoringImpact: false,
    notificationImpact: false,
    createdAt: iso(createdAt, "createdAt"),
    schemaVersion: D18_STRATEGY_WEIGHT_FRAME_VERSION,
  };

  if (Date.parse(base.createdAt) < Date.parse(decisionTimestamp)) {
    throw new Error("createdAt cannot precede decisionTimestamp");
  }

  return deepFreeze({ ...base, frameHash: await sha256Hex(base) });
}
