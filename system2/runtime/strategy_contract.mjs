import { deepFreeze } from "./factor_snapshot.mjs";

const EVIDENCE_FAMILIES = new Set([
  "MARKET_REGIME",
  "INDUSTRY_THESIS",
  "FUNDAMENTAL_QUALITY",
  "VALUATION",
  "EVENT_CATALYST",
  "TECHNICAL_STRUCTURE",
  "PRICE_VOLUME",
  "CHIP_OWNERSHIP",
  "CAPITAL_FLOW",
  "RISK_FRICTION",
]);

const EVIDENCE_ROLES = new Set([
  "PRIMARY",
  "REQUIRED",
  "SUPPORTIVE",
  "CONTEXT_ONLY",
  "HARD_INVALIDATION",
  "WARNING",
]);

const DATA_READINESS = new Set([
  "READY_CURRENT",
  "DERIVABLE_CURRENT",
  "PIT_AUDIT_REQUIRED",
  "SOURCE_EXTENSION_REQUIRED",
  "SEMANTIC_GAP",
  "NOT_APPLICABLE",
]);

const APPROVAL_STATES = new Set([
  "OWNER_APPROVED",
  "RESEARCH_ONLY_APPROVED",
  "OWNER_REVIEW_PENDING",
  "RESEARCH_LANE",
]);

const REGIME_LABELS = new Set([
  "RISK_ON",
  "RISK_OFF",
  "LARGE_CAP_LED",
  "SMALL_CAP_LED",
  "TREND",
  "RANGE",
  "HIGH_VOLATILITY",
  "LOW_VOLATILITY",
  "SECTOR_ROTATION",
  "PANIC",
  "RECOVERY",
  "UNKNOWN",
]);

const INTRADAY_ROLES = new Set(["HIGH", "MEDIUM", "LOW", "NONE"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function stringArray(value, field, { allowEmpty = true } = {}) {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const out = value.map((x, i) => requiredText(x, `${field}[${i}]`));
  if (!allowEmpty && out.length === 0) throw new Error(`${field} cannot be empty`);
  return Object.freeze(out);
}

function enumValue(value, allowed, field) {
  const text = requiredText(value, field);
  if (!allowed.has(text)) throw new Error(`${field} has unsupported value: ${text}`);
  return text;
}

function enumArray(value, allowed, field) {
  const out = stringArray(value, field);
  for (const x of out) {
    if (!allowed.has(x)) throw new Error(`${field} has unsupported value: ${x}`);
  }
  return out;
}

function horizonArray(value, field) {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`${field} cannot be empty`);
  const out = value.map((x) => {
    if (!Number.isInteger(x) || x <= 0) throw new Error(`${field} must contain positive integers`);
    return x;
  });
  return Object.freeze(out);
}

function assertNoNumericScoringFields(input, field) {
  const forbidden = [
    "weight",
    "score",
    "totalScore",
    "minimumNormalizedValue",
    "maximumNormalizedValue",
    "threshold",
    "floor",
    "cap",
  ];
  for (const key of forbidden) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      throw new Error(`${field} must not freeze numeric scoring field: ${key}`);
    }
  }
}

function buildEvidenceRequirement(input, index) {
  if (!input || typeof input !== "object") throw new Error(`evidenceFamilies[${index}] is required`);
  assertNoNumericScoringFields(input, `evidenceFamilies[${index}]`);
  return {
    family: enumValue(input.family, EVIDENCE_FAMILIES, `evidenceFamilies[${index}].family`),
    role: enumValue(input.role, EVIDENCE_ROLES, `evidenceFamilies[${index}].role`),
    factorIds: stringArray(input.factorIds || [], `evidenceFamilies[${index}].factorIds`),
    dataReadiness: enumValue(
      input.dataReadiness,
      DATA_READINESS,
      `evidenceFamilies[${index}].dataReadiness`,
    ),
    unknownBlocksEligibility: input.unknownBlocksEligibility === true,
    notes: input.notes ? requiredText(input.notes, `evidenceFamilies[${index}].notes`) : undefined,
  };
}

function buildSetup(input, index) {
  if (!input || typeof input !== "object") throw new Error(`setups[${index}] is required`);
  assertNoNumericScoringFields(input, `setups[${index}]`);
  return {
    setupId: requiredText(input.setupId, `setups[${index}].setupId`),
    setupVersion: requiredText(input.setupVersion, `setups[${index}].setupVersion`),
    thesisMechanism: requiredText(input.thesisMechanism, `setups[${index}].thesisMechanism`),
    requiredFamilies: enumArray(input.requiredFamilies || [], EVIDENCE_FAMILIES, `setups[${index}].requiredFamilies`),
    supportiveFamilies: enumArray(input.supportiveFamilies || [], EVIDENCE_FAMILIES, `setups[${index}].supportiveFamilies`),
    contextFamilies: enumArray(input.contextFamilies || [], EVIDENCE_FAMILIES, `setups[${index}].contextFamilies`),
    hardInvalidationIds: stringArray(input.hardInvalidationIds || [], `setups[${index}].hardInvalidationIds`),
    entryReadinessInputs: stringArray(input.entryReadinessInputs || [], `setups[${index}].entryReadinessInputs`),
    intradayRole: enumValue(input.intradayRole, INTRADAY_ROLES, `setups[${index}].intradayRole`),
    expectedHorizonSessions: horizonArray(input.expectedHorizonSessions, `setups[${index}].expectedHorizonSessions`),
    addActionFamilies: stringArray(input.addActionFamilies || [], `setups[${index}].addActionFamilies`),
    reduceActionFamilies: stringArray(input.reduceActionFamilies || [], `setups[${index}].reduceActionFamilies`),
    exitActionFamilies: stringArray(input.exitActionFamilies || [], `setups[${index}].exitActionFamilies`),
  };
}

export function buildStrategyContract(input) {
  if (!input || typeof input !== "object") throw new Error("strategy contract input is required");
  assertNoNumericScoringFields(input, "strategyContract");

  const approval = enumValue(input.ownerApprovalState, APPROVAL_STATES, "ownerApprovalState");
  const evidenceFamilies = (input.evidenceFamilies || []).map(buildEvidenceRequirement);
  if (!evidenceFamilies.some((x) => x.role === "PRIMARY")) {
    throw new Error("strategy contract requires at least one PRIMARY evidence family");
  }

  const familyRoleKeys = new Set();
  for (const item of evidenceFamilies) {
    const key = `${item.family}:${item.role}`;
    if (familyRoleKeys.has(key)) throw new Error(`duplicate evidence family role: ${key}`);
    familyRoleKeys.add(key);
  }

  const contract = {
    strategyId: requiredText(input.strategyId, "strategyId"),
    strategyVersion: requiredText(input.strategyVersion, "strategyVersion"),
    ownerApprovalState: approval,
    thesis: requiredText(input.thesis, "thesis"),
    primaryHorizonSessions: horizonArray(input.primaryHorizonSessions, "primaryHorizonSessions"),
    evidenceFamilies,
    setups: (input.setups || []).map(buildSetup),
    allowedRegimes: enumArray(input.allowedRegimes || [], REGIME_LABELS, "allowedRegimes"),
    blockedRegimes: enumArray(input.blockedRegimes || [], REGIME_LABELS, "blockedRegimes"),
    hardInvalidationIds: stringArray(input.hardInvalidationIds || [], "hardInvalidationIds"),
    interactionIds: stringArray(input.interactionIds || [], "interactionIds"),
    versionChangeTriggers: stringArray(input.versionChangeTriggers || [], "versionChangeTriggers", { allowEmpty: false }),
    notes: stringArray(input.notes || [], "notes"),
  };

  if (
    (approval === "OWNER_APPROVED" || approval === "RESEARCH_ONLY_APPROVED") &&
    contract.setups.length === 0
  ) {
    throw new Error("approved strategy contract requires at least one setup");
  }

  return deepFreeze(contract);
}

export {
  EVIDENCE_FAMILIES,
  EVIDENCE_ROLES,
  DATA_READINESS,
  APPROVAL_STATES,
  REGIME_LABELS,
  INTRADAY_ROLES,
};
