import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { validateD18ObservableRegimeVectorV0_1 } from "./d18_observable_regime_vector_v0_1.mjs";

export const D18_STRATEGY_ACTIVATION_FRAME_VERSION = "D18_STRATEGY_ACTIVATION_FRAME_V0_1_RESEARCH";
const REGIME_VECTOR_VERSION = "D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH";
const POLICY_CLASS = "BINARY_ACTIVATION_DEACTIVATION";

const BASELINE_STATES = new Set([
  "BASELINE_OPPORTUNITY_PRESENT",
  "NATURAL_ZERO_PICK",
  "DATA_UNKNOWN",
]);

const POLICY_STATES = new Set([
  "POLICY_ENABLED",
  "POLICY_DISABLED",
  "NATURAL_ZERO_PICK",
  "DATA_UNKNOWN",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function iso(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be ISO timestamp`);
  return new Date(text).toISOString();
}

function nonNegativeNumber(value, field) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${field} must be non-negative finite`);
  return Number(value);
}

function stateCount(receipt, state) {
  const value = Number(receipt?.stateCounts?.[state] ?? 0);
  if (!Number.isInteger(value) || value < 0) throw new Error(`invalid shadow state count: ${state}`);
  return value;
}

function baselineState(shadowRunReceipt, runFingerprint) {
  const accountingComplete =
    shadowRunReceipt?.runState === "COMPLETE"
    && Number(shadowRunReceipt?.completionRate) === 1
    && runFingerprint?.runFingerprintState === "RUN_FINGERPRINT_COMPLETE"
    && runFingerprint?.outcomeJoinEligible === true;

  if (!accountingComplete) return "DATA_UNKNOWN";

  const actionable =
    stateCount(shadowRunReceipt, "SELECTED")
    + stateCount(shadowRunReceipt, "QUALIFIED_NOT_SELECTED");

  if (actionable > 0) return "BASELINE_OPPORTUNITY_PRESENT";

  const blocked =
    stateCount(shadowRunReceipt, "INCOMPLETE")
    + stateCount(shadowRunReceipt, "SOURCE_BLOCKED")
    + stateCount(shadowRunReceipt, "SESSION_INVALID")
    + stateCount(shadowRunReceipt, "ERROR");

  if (blocked > 0) return "DATA_UNKNOWN";
  return "NATURAL_ZERO_PICK";
}

async function validateRegistration(registration, {
  strategyId,
  strategyVersion,
  decisionTimestamp,
}) {
  if (!registration || typeof registration !== "object") {
    throw new Error("registration is required");
  }
  if (registration.state !== "PREREGISTERED_SHADOW") {
    throw new Error("registration must be PREREGISTERED_SHADOW");
  }
  if (registration.policyClass !== POLICY_CLASS) {
    throw new Error("unsupported activation policy class");
  }
  if (requiredText(registration.strategyId, "registration.strategyId") !== strategyId) {
    throw new Error("registration strategyId mismatch");
  }
  if (requiredText(registration.strategyVersion, "registration.strategyVersion") !== strategyVersion) {
    throw new Error("registration strategyVersion mismatch");
  }

  const parameters = registration.parameters;
  if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) {
    throw new Error("registration.parameters is required");
  }
  const regimeDimension = requiredText(parameters.regimeDimension, "parameters.regimeDimension");
  if (!Array.isArray(parameters.disabledValues) || parameters.disabledValues.length === 0) {
    throw new Error("parameters.disabledValues must be non-empty array");
  }
  const disabledValues = parameters.disabledValues.map((x, i) =>
    requiredText(String(x), `parameters.disabledValues[${i}]`)
  );
  if (new Set(disabledValues).size !== disabledValues.length) {
    throw new Error("parameters.disabledValues contains duplicates");
  }
  if (parameters.unknownAction !== "DATA_UNKNOWN") {
    throw new Error("unknownAction must be DATA_UNKNOWN");
  }
  if (parameters.nonDisabledAction !== "KEEP_STATIC_BASELINE") {
    throw new Error("nonDisabledAction must be KEEP_STATIC_BASELINE");
  }

  const parameterHash = await sha256Hex(parameters);
  if (parameterHash !== requiredText(registration.parameterHash, "registration.parameterHash")) {
    throw new Error("registration parameterHash mismatch");
  }

  const registeredAt = iso(registration.registeredAt, "registration.registeredAt");
  const availableAt = iso(registration.availableAt, "registration.availableAt");
  const decisionMs = Date.parse(decisionTimestamp);
  if (Date.parse(registeredAt) > decisionMs || Date.parse(availableAt) > decisionMs) {
    throw new Error("activation registration is post-decision");
  }

  return deepFreeze({
    policyId: requiredText(registration.policyId, "registration.policyId"),
    policyVersion: requiredText(registration.policyVersion, "registration.policyVersion"),
    policyClass: POLICY_CLASS,
    strategyId,
    strategyVersion,
    parameters: deepFreeze({
      regimeDimension,
      disabledValues: Object.freeze([...disabledValues]),
      unknownAction: "DATA_UNKNOWN",
      nonDisabledAction: "KEEP_STATIC_BASELINE",
    }),
    parameterHash,
    registeredAt,
    availableAt,
    registrationHash: await sha256Hex(registration),
  });
}

async function validateCost(costContract, decisionTimestamp) {
  if (!costContract || typeof costContract !== "object") {
    throw new Error("costContract is required");
  }
  const availableAt = iso(costContract.availableAt, "costContract.availableAt");
  if (Date.parse(availableAt) > Date.parse(decisionTimestamp)) {
    throw new Error("costContract is post-decision");
  }
  const normalized = {
    version: requiredText(costContract.version, "costContract.version"),
    availableAt,
    roundTripCostRate: nonNegativeNumber(
      costContract.roundTripCostRate,
      "costContract.roundTripCostRate",
    ),
    note: costContract.note === null || costContract.note === undefined
      ? null
      : String(costContract.note),
  };
  return deepFreeze({ ...normalized, costHash: await sha256Hex(normalized) });
}

export async function buildD18StrategyActivationFrameV0_1({
  frameId,
  shadowRunReceipt,
  runFingerprint,
  regimeVector,
  registration,
  costContract,
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
  const runFingerprintHash = requiredText(
    runFingerprint.runFingerprintHash,
    "runFingerprint.runFingerprintHash",
  );

  if (regimeVector.vectorVersion !== REGIME_VECTOR_VERSION) {
    throw new Error("unsupported regime vector version");
  }
  if (regimeVector.marketDate !== marketDate) throw new Error("regime marketDate mismatch");
  if (iso(regimeVector.decisionTimestamp, "regimeVector.decisionTimestamp") !== decisionTimestamp) {
    throw new Error("regime decisionTimestamp mismatch");
  }
  const regimeHash = typeof regimeVector.receiptHash === "string"
    ? regimeVector.receiptHash
    : null;
  const regimeValidation = await validateD18ObservableRegimeVectorV0_1(regimeVector);

  const reg = await validateRegistration(registration, {
    strategyId,
    strategyVersion,
    decisionTimestamp,
  });
  const cost = await validateCost(costContract, decisionTimestamp);

  const baseline = baselineState(shadowRunReceipt, runFingerprint);
  if (!BASELINE_STATES.has(baseline)) throw new Error("unsupported baseline state");

  const dimension = regimeVector.dimensions?.[reg.parameters.regimeDimension] || null;
  const dimensionValidation = regimeValidation.dimensions?.[reg.parameters.regimeDimension] || null;
  const regimeKnown =
    regimeValidation.valid === true
    && dimensionValidation?.valid === true
    && dimension?.pointInTimeEligible === true
    && dimension?.state === "KNOWN"
    && dimension?.value !== null
    && dimension?.value !== undefined;

  let policyState;
  if (baseline === "DATA_UNKNOWN") {
    policyState = "DATA_UNKNOWN";
  } else if (baseline === "NATURAL_ZERO_PICK") {
    policyState = "NATURAL_ZERO_PICK";
  } else if (!regimeKnown) {
    policyState = "DATA_UNKNOWN";
  } else if (reg.parameters.disabledValues.includes(String(dimension.value))) {
    policyState = "POLICY_DISABLED";
  } else {
    policyState = "POLICY_ENABLED";
  }
  if (!POLICY_STATES.has(policyState)) throw new Error("unsupported policy state");

  const selectedCount = stateCount(shadowRunReceipt, "SELECTED");
  const qualifiedNotSelectedCount = stateCount(shadowRunReceipt, "QUALIFIED_NOT_SELECTED");

  const staticBaselineAction =
    baseline === "BASELINE_OPPORTUNITY_PRESENT"
      ? "KEEP_STATIC_STRATEGY"
      : baseline === "NATURAL_ZERO_PICK"
        ? "NO_BASELINE_ACTION"
        : "DATA_UNKNOWN";

  const challengerAction =
    policyState === "POLICY_DISABLED"
      ? "SUPPRESS_STRATEGY_FOR_DATE"
      : policyState === "POLICY_ENABLED"
        ? "KEEP_STATIC_STRATEGY"
        : policyState === "NATURAL_ZERO_PICK"
          ? "NO_ACTION_NOT_POLICY_EFFECT"
          : "ABSTAIN_DATA_UNKNOWN";

  const base = {
    frameId: id,
    version: D18_STRATEGY_ACTIVATION_FRAME_VERSION,
    marketDate,
    decisionTimestamp,
    strategyId,
    strategyVersion,
    shadowSpecId: shadowRunReceipt.shadowSpecId,
    universeVersion: shadowRunReceipt.universeVersion,
    runId: shadowRunReceipt.runId,
    runFingerprintHash,
    shadowAccountingHash: accountingHash,
    runFingerprintState: runFingerprint.runFingerprintState,
    outcomeJoinEligible: runFingerprint.outcomeJoinEligible === true,
    regimeVectorHash: regimeHash,
    regimeVectorVersion: regimeVector.vectorVersion,
    regimeEvidenceValid: regimeValidation.valid === true,
    regimeEvidenceBlockers: Object.freeze([...regimeValidation.blockers]),
    regimeDimension: reg.parameters.regimeDimension,
    regimeDimensionEvidenceValid: dimensionValidation?.valid === true,
    regimeState: dimension?.state || "MISSING",
    regimeValue: regimeKnown ? String(dimension.value) : null,
    registration: reg,
    baseline: deepFreeze({
      state: baseline,
      staticAction: staticBaselineAction,
      selectedCount,
      qualifiedNotSelectedCount,
      knownOpportunityCount: selectedCount + qualifiedNotSelectedCount,
      zeroPickIsPolicyEffect: false,
    }),
    challenger: deepFreeze({
      state: policyState,
      action: challengerAction,
      policyDisabledCounterfactualEligible: policyState === "POLICY_DISABLED",
      opportunityCostOutcomeRequired: policyState === "POLICY_DISABLED",
      policyEffectClaimed: false,
    }),
    costParity: deepFreeze({
      staticBaselineCostHash: cost.costHash,
      challengerCostHash: cost.costHash,
      identicalCostContract: true,
      costContract: cost,
    }),
    naturalZeroSeparated: true,
    dataUnknownSeparated: true,
    policyDisabledSeparated: true,
    outcomeAttached: false,
    policyValueEstimated: false,
    causalClaimMade: false,
    finalSelectionEnabled: false,
    rankingImpact: false,
    selectionImpact: false,
    capitalImpact: false,
    monitoringImpact: false,
    notificationImpact: false,
    createdAt: iso(createdAt, "createdAt"),
    schemaVersion: D18_STRATEGY_ACTIVATION_FRAME_VERSION,
  };

  if (Date.parse(base.createdAt) < Date.parse(decisionTimestamp)) {
    throw new Error("createdAt cannot precede decisionTimestamp");
  }

  return deepFreeze({ ...base, frameHash: await sha256Hex(base) });
}
