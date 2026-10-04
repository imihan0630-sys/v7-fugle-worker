import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const D19_FACTOR_RECEIPT_VERSION_V0_1 = "S2_D19_FACTOR_RECEIPT_V0_1";

const OBSERVATION_STATES = new Set(["KNOWN", "UNKNOWN", "STALE", "INVALID", "NOT_APPLICABLE"]);
const RECEIPT_STATES = new Set(["READY", "INCOMPLETE", "BLOCKED", "MODELED"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function optionalText(value) {
  if (value === null || value === undefined || value === "") return null;
  return String(value).trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function assertDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function finiteOrNull(value, field) {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value)) throw new Error(field + " must be finite or null");
  return Number(value);
}

function nonNegativeOrNull(value, field) {
  const n = finiteOrNull(value, field);
  if (n !== null && n < 0) throw new Error(field + " must be non-negative");
  return n;
}

function normalizeState(value, field, allowed) {
  const text = requiredText(value, field);
  if (!allowed.has(text)) throw new Error("unsupported " + field + ": " + text);
  return text;
}

function stableSortObjects(rows, keyFn) {
  return [...rows].sort((a, b) => keyFn(a).localeCompare(keyFn(b)));
}

async function finalizeReceipt(base, capturedAt) {
  const receiptHash = await sha256Hex(base);
  return deepFreeze({
    ...base,
    capturedAt: assertTimestamp(capturedAt, "capturedAt"),
    receiptHash,
  });
}

function validateClockAtOrBeforeDecision(clock, decisionTimestamp, field) {
  if (!clock) return null;
  const value = assertTimestamp(clock, field);
  if (Date.parse(value) > Date.parse(decisionTimestamp)) {
    throw new Error(field + " is after decisionTimestamp");
  }
  return value;
}

function normalizeMember(row, index) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("members[" + index + "] must be an object");
  }
  return {
    market: requiredText(row.market, "members[" + index + "].market"),
    symbol: requiredText(row.symbol, "members[" + index + "].symbol"),
    membershipId: requiredText(row.membershipId, "members[" + index + "].membershipId"),
    membershipHash: requiredText(row.membershipHash, "members[" + index + "].membershipHash"),
    replayEligible: row.replayEligible === true,
    industry: optionalText(row.industry),
  };
}

export async function buildD19UniverseReceiptV0_1({
  runId,
  marketDate,
  decisionTimestamp,
  registryId,
  members = [],
  exclusions = [],
  universeKind = "HISTORICAL_REGISTRY",
  capturedAt,
} = {}) {
  const date = assertDate(marketDate, "marketDate");
  const decision = assertTimestamp(decisionTimestamp, "decisionTimestamp");
  if (!Array.isArray(members)) throw new Error("members must be an array");
  if (!Array.isArray(exclusions)) throw new Error("exclusions must be an array");

  const normalized = stableSortObjects(
    members.map(normalizeMember),
    (x) => x.market + "|" + x.symbol,
  );
  const seen = new Set();
  for (const member of normalized) {
    const key = member.market + "|" + member.symbol;
    if (seen.has(key)) throw new Error("duplicate universe member: " + key);
    seen.add(key);
  }

  const excluded = stableSortObjects(exclusions.map((row, index) => ({
    market: requiredText(row.market, "exclusions[" + index + "].market"),
    symbol: requiredText(row.symbol, "exclusions[" + index + "].symbol"),
    reason: requiredText(row.reason, "exclusions[" + index + "].reason"),
    state: normalizeState(
      row.state || "UNKNOWN",
      "exclusions[" + index + "].state",
      OBSERVATION_STATES,
    ),
  })), (x) => x.market + "|" + x.symbol + "|" + x.reason);

  const eligible = normalized.filter((x) => x.replayEligible);
  const blocked = normalized.filter((x) => !x.replayEligible);
  const state = blocked.length ? "INCOMPLETE" : "READY";

  const base = {
    receiptType: "universeReceipt",
    receiptVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
    runId: requiredText(runId, "runId"),
    marketDate: date,
    decisionTimestamp: decision,
    registryId: requiredText(registryId, "registryId"),
    universeKind: requiredText(universeKind, "universeKind"),
    memberCount: normalized.length,
    eligibleMemberCount: eligible.length,
    members: Object.freeze(normalized),
    exclusions: Object.freeze(excluded),
    state,
    blockerCodes: Object.freeze(blocked.length ? ["UNIVERSE_MEMBER_NOT_REPLAY_ELIGIBLE"] : []),
    formalSelectionAuthorized: false,
    schemaVersion: "S2_D19_UNIVERSE_RECEIPT_V0_1",
  };
  return finalizeReceipt(base, capturedAt);
}

export async function buildD19ReturnReceiptV0_1({
  runId,
  factorId,
  symbol,
  market,
  marketDate,
  decisionTimestamp,
  priceSpace = "RAW",
  inputBarHashes = [],
  continuityPolicyVersion,
  corporateActionPolicyVersion,
  returnDefinition,
  returnValue,
  state = "KNOWN",
  unknownReason = null,
  capturedAt,
} = {}) {
  const observationState = normalizeState(state, "state", OBSERVATION_STATES);
  if (!Array.isArray(inputBarHashes)) throw new Error("inputBarHashes must be an array");
  const hashes = [...new Set(inputBarHashes.map((x) => requiredText(x, "inputBarHash")))].sort();
  if (observationState === "KNOWN" && !hashes.length) {
    throw new Error("KNOWN return receipt requires inputBarHashes");
  }
  const value = finiteOrNull(returnValue, "returnValue");
  if (observationState === "KNOWN" && value === null) {
    throw new Error("KNOWN return receipt requires returnValue");
  }
  if (observationState !== "KNOWN" && value !== null) {
    throw new Error("non-KNOWN return receipt must not carry returnValue");
  }
  if (observationState !== "KNOWN" && !optionalText(unknownReason)) {
    throw new Error("non-KNOWN return receipt requires unknownReason");
  }

  const base = {
    receiptType: "returnReceipt",
    receiptVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
    runId: requiredText(runId, "runId"),
    factorId: requiredText(factorId, "factorId"),
    symbol: requiredText(symbol, "symbol"),
    market: requiredText(market, "market"),
    marketDate: assertDate(marketDate, "marketDate"),
    decisionTimestamp: assertTimestamp(decisionTimestamp, "decisionTimestamp"),
    priceSpace: requiredText(priceSpace, "priceSpace"),
    inputBarHashes: Object.freeze(hashes),
    continuityPolicyVersion: requiredText(continuityPolicyVersion, "continuityPolicyVersion"),
    corporateActionPolicyVersion: requiredText(
      corporateActionPolicyVersion,
      "corporateActionPolicyVersion",
    ),
    returnDefinition: requiredText(returnDefinition, "returnDefinition"),
    returnValue: value,
    observationState,
    unknownReason: optionalText(unknownReason),
    schemaVersion: "S2_D19_RETURN_RECEIPT_V0_1",
  };
  return finalizeReceipt(base, capturedAt);
}

function normalizeFactorInput(row, index, decisionTimestamp) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("inputs[" + index + "] must be an object");
  }
  const state = normalizeState(row.state, "inputs[" + index + "].state", OBSERVATION_STATES);
  const required = row.required !== false;
  const availableAt = validateClockAtOrBeforeDecision(
    row.availableAt,
    decisionTimestamp,
    "inputs[" + index + "].availableAt",
  );
  const observedAt = row.observedAt
    ? assertTimestamp(row.observedAt, "inputs[" + index + "].observedAt")
    : null;
  const firstKnownAt = validateClockAtOrBeforeDecision(
    row.firstKnownAt,
    decisionTimestamp,
    "inputs[" + index + "].firstKnownAt",
  );
  if (state === "KNOWN" && !availableAt) {
    throw new Error("KNOWN factor input requires availableAt");
  }
  const unknownReason = optionalText(row.unknownReason);
  if (required && state !== "KNOWN" && !unknownReason) {
    throw new Error("required non-KNOWN factor input requires unknownReason");
  }
  return {
    inputId: requiredText(row.inputId, "inputs[" + index + "].inputId"),
    inputVersion: requiredText(row.inputVersion, "inputs[" + index + "].inputVersion"),
    required,
    state,
    valueHash: optionalText(row.valueHash),
    sourceId: requiredText(row.sourceId, "inputs[" + index + "].sourceId"),
    payloadHash: optionalText(row.payloadHash),
    observedAt,
    availableAt,
    firstKnownAt,
    unknownReason,
  };
}

export async function buildD19FactorInputReceiptV0_1({
  runId,
  factorId,
  factorVersion,
  scope,
  scopeKey,
  marketDate,
  decisionTimestamp,
  inputs = [],
  capturedAt,
} = {}) {
  const decision = assertTimestamp(decisionTimestamp, "decisionTimestamp");
  if (!Array.isArray(inputs) || !inputs.length) throw new Error("inputs must be a non-empty array");
  const normalized = stableSortObjects(
    inputs.map((row, index) => normalizeFactorInput(row, index, decision)),
    (x) => x.inputId + "|" + x.inputVersion,
  );
  const blocked = normalized.filter((x) => x.required && x.state !== "KNOWN");
  const base = {
    receiptType: "factorInputReceipt",
    receiptVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
    runId: requiredText(runId, "runId"),
    factorId: requiredText(factorId, "factorId"),
    factorVersion: requiredText(factorVersion, "factorVersion"),
    scope: requiredText(scope, "scope"),
    scopeKey: requiredText(scopeKey, "scopeKey"),
    marketDate: assertDate(marketDate, "marketDate"),
    decisionTimestamp: decision,
    inputs: Object.freeze(normalized),
    state: blocked.length ? "INCOMPLETE" : "READY",
    blockerCodes: Object.freeze(blocked.map((x) => "REQUIRED_INPUT_" + x.inputId + "_" + x.state)),
    schemaVersion: "S2_D19_FACTOR_INPUT_RECEIPT_V0_1",
  };
  return finalizeReceipt(base, capturedAt);
}

export async function buildD19NeutralizationReceiptV0_1({
  runId,
  factorId,
  factorVersion,
  marketDate,
  decisionTimestamp,
  factorSetId,
  factorSetVersion,
  method,
  benchmarkVintageHash = null,
  industryVintageHash = null,
  estimationWindow,
  validSampleCount,
  coefficients = null,
  transformMetadata = null,
  residualHash,
  warnings = [],
  state = "READY",
  capturedAt,
} = {}) {
  const receiptState = normalizeState(state, "state", RECEIPT_STATES);
  if (!Number.isInteger(validSampleCount) || validSampleCount < 1) {
    throw new Error("validSampleCount must be a positive integer");
  }
  if (!Array.isArray(warnings)) throw new Error("warnings must be an array");
  const base = {
    receiptType: "neutralizationReceipt",
    receiptVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
    runId: requiredText(runId, "runId"),
    factorId: requiredText(factorId, "factorId"),
    factorVersion: requiredText(factorVersion, "factorVersion"),
    marketDate: assertDate(marketDate, "marketDate"),
    decisionTimestamp: assertTimestamp(decisionTimestamp, "decisionTimestamp"),
    factorSetId: requiredText(factorSetId, "factorSetId"),
    factorSetVersion: requiredText(factorSetVersion, "factorSetVersion"),
    method: requiredText(method, "method"),
    benchmarkVintageHash: optionalText(benchmarkVintageHash),
    industryVintageHash: optionalText(industryVintageHash),
    estimationWindow: requiredText(estimationWindow, "estimationWindow"),
    validSampleCount,
    coefficients: coefficients === null ? null : deepFreeze(coefficients),
    transformMetadata: transformMetadata === null ? null : deepFreeze(transformMetadata),
    residualHash: requiredText(residualHash, "residualHash"),
    warnings: Object.freeze(warnings.map(String).sort()),
    state: receiptState,
    modelSensitive: warnings.map(String).includes("MODEL_SENSITIVE"),
    schemaVersion: "S2_D19_NEUTRALIZATION_RECEIPT_V0_1",
  };
  return finalizeReceipt(base, capturedAt);
}

function normalizeCostComponent(row, index) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("components[" + index + "] must be an object");
  }
  const quality = requiredText(row.quality, "components[" + index + "].quality");
  if (!["ACTUAL", "PARTIAL_ACTUAL", "MODELED", "UNKNOWN", "NOT_APPLICABLE"].includes(quality)) {
    throw new Error("unsupported cost quality: " + quality);
  }
  const amountRate = nonNegativeOrNull(row.rate, "components[" + index + "].rate");
  const unknownReason = optionalText(row.unknownReason);
  if (quality === "UNKNOWN" && !unknownReason) {
    throw new Error("UNKNOWN cost component requires unknownReason");
  }
  return {
    componentId: requiredText(row.componentId, "components[" + index + "].componentId"),
    componentVersion: requiredText(row.componentVersion, "components[" + index + "].componentVersion"),
    quality,
    rate: amountRate,
    currency: optionalText(row.currency),
    sourceId: requiredText(row.sourceId, "components[" + index + "].sourceId"),
    sourceVersion: requiredText(row.sourceVersion, "components[" + index + "].sourceVersion"),
    sourceHash: optionalText(row.sourceHash),
    unknownReason,
  };
}

export async function buildD19CostReceiptV0_1({
  runId,
  marketDate,
  decisionTimestamp,
  scenarioId,
  scenarioVersion,
  components = [],
  turnoverDefinition,
  shortLegRequired = false,
  borrowabilityState = "NOT_APPLICABLE",
  borrowabilitySourceHash = null,
  capturedAt,
} = {}) {
  if (!Array.isArray(components) || !components.length) {
    throw new Error("components must be a non-empty array");
  }
  const normalized = stableSortObjects(
    components.map(normalizeCostComponent),
    (x) => x.componentId + "|" + x.componentVersion,
  );
  const unknown = normalized.filter((x) => x.quality === "UNKNOWN");
  const borrowState = normalizeState(
    borrowabilityState,
    "borrowabilityState",
    OBSERVATION_STATES,
  );
  const borrowBlocked = shortLegRequired && borrowState !== "KNOWN";
  const state = unknown.length || borrowBlocked ? "INCOMPLETE" : "READY";
  const blockerCodes = [
    ...unknown.map((x) => "COST_" + x.componentId + "_UNKNOWN"),
    ...(borrowBlocked ? ["SHORT_BORROWABILITY_NOT_KNOWN"] : []),
  ];

  const base = {
    receiptType: "costReceipt",
    receiptVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
    runId: requiredText(runId, "runId"),
    marketDate: assertDate(marketDate, "marketDate"),
    decisionTimestamp: assertTimestamp(decisionTimestamp, "decisionTimestamp"),
    scenarioId: requiredText(scenarioId, "scenarioId"),
    scenarioVersion: requiredText(scenarioVersion, "scenarioVersion"),
    components: Object.freeze(normalized),
    turnoverDefinition: requiredText(turnoverDefinition, "turnoverDefinition"),
    shortLegRequired: shortLegRequired === true,
    borrowabilityState: borrowState,
    borrowabilitySourceHash: optionalText(borrowabilitySourceHash),
    state,
    blockerCodes: Object.freeze(blockerCodes),
    schemaVersion: "S2_D19_COST_RECEIPT_V0_1",
  };
  return finalizeReceipt(base, capturedAt);
}

export async function buildD19ReplayReceiptV0_1({
  runId,
  marketDate,
  decisionTimestamp,
  factorId,
  factorVersion,
  universeReceipt,
  returnReceipts = [],
  factorInputReceipts = [],
  neutralizationReceipt,
  costReceipt,
  outputHash,
  codeVersion,
  capturedAt,
} = {}) {
  if (!universeReceipt?.receiptHash) throw new Error("universeReceipt is required");
  if (!Array.isArray(returnReceipts) || !returnReceipts.length) {
    throw new Error("returnReceipts must be non-empty");
  }
  if (!Array.isArray(factorInputReceipts) || !factorInputReceipts.length) {
    throw new Error("factorInputReceipts must be non-empty");
  }
  if (!neutralizationReceipt?.receiptHash) throw new Error("neutralizationReceipt is required");
  if (!costReceipt?.receiptHash) throw new Error("costReceipt is required");

  const returnHashes = returnReceipts.map((x) => requiredText(x.receiptHash, "returnReceipt.receiptHash")).sort();
  const factorInputHashes = factorInputReceipts
    .map((x) => requiredText(x.receiptHash, "factorInputReceipt.receiptHash"))
    .sort();

  const upstreamStates = [
    universeReceipt.state,
    ...factorInputReceipts.map((x) => x.state),
    neutralizationReceipt.state,
    costReceipt.state,
  ];
  const state = upstreamStates.every((x) => x === "READY") ? "READY" : "INCOMPLETE";

  const base = {
    receiptType: "replayReceipt",
    receiptVersion: D19_FACTOR_RECEIPT_VERSION_V0_1,
    runId: requiredText(runId, "runId"),
    marketDate: assertDate(marketDate, "marketDate"),
    decisionTimestamp: assertTimestamp(decisionTimestamp, "decisionTimestamp"),
    factorId: requiredText(factorId, "factorId"),
    factorVersion: requiredText(factorVersion, "factorVersion"),
    universeReceiptHash: universeReceipt.receiptHash,
    returnReceiptHashes: Object.freeze(returnHashes),
    factorInputReceiptHashes: Object.freeze(factorInputHashes),
    neutralizationReceiptHash: neutralizationReceipt.receiptHash,
    costReceiptHash: costReceipt.receiptHash,
    outputHash: requiredText(outputHash, "outputHash"),
    codeVersion: requiredText(codeVersion, "codeVersion"),
    state,
    l3DataFeasibilityEligible: state === "READY",
    formalSelectionAuthorized: false,
    productionImpact: false,
    schemaVersion: "S2_D19_REPLAY_RECEIPT_V0_1",
  };
  return finalizeReceipt(base, capturedAt);
}
