import { deepFreeze } from "./factor_snapshot.mjs";

const OBSERVATION_STATES = new Set(["KNOWN", "UNKNOWN", "STALE", "INVALID", "NOT_APPLICABLE"]);
const THESIS_STATES = new Set(["SUPPORTIVE", "NEUTRAL", "ADVERSE", "INDETERMINATE"]);
const VALIDITY_STATES = new Set(["VALID", "WEAKENING", "INVALIDATED", "INCOMPLETE"]);
const READINESS_STATES = new Set([
  "WATCH",
  "NEAR_ENTRY",
  "ACTIVE_ENTRY_MONITOR",
  "BUY_ELIGIBLE",
  "WAIT",
  "TOO_EXTENDED",
  "CONFLICT",
  "BLOCKED",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function enumValue(value, allowed, field) {
  const text = requiredText(value, field);
  if (!allowed.has(text)) throw new Error(`${field} has unsupported value: ${text}`);
  return text;
}

function asStringArray(value, field) {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  return Object.freeze(value.map((x, i) => requiredText(x, `${field}[${i}]`)));
}

function normalizeFamilyAssessments(contract, input) {
  const source = input.familyAssessments || {};
  const out = {};

  for (const req of contract.evidenceFamilies || []) {
    if (out[req.family]) continue;
    const raw = source[req.family];

    if (!raw) {
      out[req.family] = {
        family: req.family,
        observationState: "UNKNOWN",
        thesisState: "INDETERMINATE",
        reasons: Object.freeze(["NO_FAMILY_ASSESSMENT"]),
        warnings: Object.freeze([]),
      };
      continue;
    }

    out[req.family] = {
      family: req.family,
      observationState: enumValue(
        raw.observationState,
        OBSERVATION_STATES,
        `familyAssessments.${req.family}.observationState`,
      ),
      thesisState: enumValue(
        raw.thesisState,
        THESIS_STATES,
        `familyAssessments.${req.family}.thesisState`,
      ),
      reasons: asStringArray(raw.reasons || [], `familyAssessments.${req.family}.reasons`),
      warnings: asStringArray(raw.warnings || [], `familyAssessments.${req.family}.warnings`),
    };
  }

  return out;
}

function requiredEvidenceGaps(contract, familyAssessments) {
  const gaps = [];
  for (const req of contract.evidenceFamilies || []) {
    if (!req.unknownBlocksEligibility) continue;
    const a = familyAssessments[req.family];
    if (!a || a.observationState !== "KNOWN") {
      gaps.push({
        family: req.family,
        observationState: a?.observationState || "UNKNOWN",
        role: req.role,
      });
    }
  }
  return gaps;
}

function primaryAdverseFamilies(contract, familyAssessments) {
  const bad = [];
  for (const req of contract.evidenceFamilies || []) {
    if (req.role !== "PRIMARY") continue;
    const a = familyAssessments[req.family];
    if (a?.observationState === "KNOWN" && a.thesisState === "ADVERSE") bad.push(req.family);
  }
  return bad;
}

function chooseRequestedReadiness(input) {
  if (input.entryReadiness === undefined || input.entryReadiness === null) return "WATCH";
  return enumValue(input.entryReadiness, READINESS_STATES, "entryReadiness");
}

export function buildStrategyStateAssessment(contract, input = {}) {
  if (!contract || typeof contract !== "object") throw new Error("strategy contract is required");

  const familyAssessments = normalizeFamilyAssessments(contract, input);
  const activeHardInvalidationIds = asStringArray(
    input.activeHardInvalidationIds || [],
    "activeHardInvalidationIds",
  );
  const contractInvalidations = new Set(contract.hardInvalidationIds || []);
  const matchedHardInvalidations = activeHardInvalidationIds.filter((id) => contractInvalidations.has(id));
  const missingRequiredEvidence = requiredEvidenceGaps(contract, familyAssessments);
  const adversePrimaryFamilies = primaryAdverseFamilies(contract, familyAssessments);

  let strategyValidity;
  if (matchedHardInvalidations.length) strategyValidity = "INVALIDATED";
  else if (missingRequiredEvidence.length) strategyValidity = "INCOMPLETE";
  else if (adversePrimaryFamilies.length) strategyValidity = "WEAKENING";
  else strategyValidity = "VALID";

  let entryReadiness = chooseRequestedReadiness(input);

  if (strategyValidity === "INVALIDATED" || strategyValidity === "INCOMPLETE") {
    entryReadiness = "BLOCKED";
  } else if (strategyValidity === "WEAKENING" && entryReadiness === "BUY_ELIGIBLE") {
    entryReadiness = "WAIT";
  }

  if (entryReadiness === "BUY_ELIGIBLE" && strategyValidity !== "VALID") {
    throw new Error("BUY_ELIGIBLE requires VALID strategy validity");
  }

  const conflicts = asStringArray(input.conflicts || [], "conflicts");
  if (conflicts.length && entryReadiness === "BUY_ELIGIBLE") entryReadiness = "CONFLICT";

  const reasons = [];
  if (matchedHardInvalidations.length) reasons.push("HARD_INVALIDATION_ACTIVE");
  if (missingRequiredEvidence.length) reasons.push("MISSING_REQUIRED_EVIDENCE");
  if (adversePrimaryFamilies.length) reasons.push("PRIMARY_EVIDENCE_ADVERSE");
  if (!reasons.length) reasons.push("NO_GENERIC_BLOCKER");

  return deepFreeze({
    strategyId: requiredText(contract.strategyId, "contract.strategyId"),
    strategyVersion: requiredText(contract.strategyVersion, "contract.strategyVersion"),
    strategyValidity: enumValue(strategyValidity, VALIDITY_STATES, "strategyValidity"),
    entryReadiness: enumValue(entryReadiness, READINESS_STATES, "entryReadiness"),
    familyAssessments,
    missingRequiredEvidence,
    adversePrimaryFamilies: Object.freeze(adversePrimaryFamilies),
    activeHardInvalidationIds,
    matchedHardInvalidations: Object.freeze(matchedHardInvalidations),
    conflicts,
    reasons: Object.freeze(reasons),
    warnings: asStringArray(input.warnings || [], "warnings"),
  });
}

export { OBSERVATION_STATES, THESIS_STATES, VALIDITY_STATES, READINESS_STATES };
