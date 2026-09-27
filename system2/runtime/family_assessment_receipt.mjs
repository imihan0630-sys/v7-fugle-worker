import { deepFreeze } from "./factor_snapshot.mjs";

const FAMILIES = new Set([
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

const THESIS_STATES = new Set(["SUPPORTIVE", "NEUTRAL", "ADVERSE", "INDETERMINATE"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function factorRef(obs) {
  return `${obs.factorId}@${obs.factorVersion}`;
}

function indexFactors(observations) {
  if (!Array.isArray(observations)) throw new Error("factorObservations must be an array");
  const map = new Map();
  for (const obs of observations) {
    if (!obs || typeof obs !== "object") throw new Error("invalid factor observation");
    const ref = factorRef(obs);
    if (map.has(ref)) throw new Error(`duplicate factor observation: ${ref}`);
    map.set(ref, obs);
  }
  return map;
}

function deriveRequiredState(requiredRefs, byRef, decisionTimestamp) {
  let hasUnknown = false;
  let hasStale = false;
  let hasInvalid = false;
  let allNotApplicable = requiredRefs.length > 0;

  for (const ref of requiredRefs) {
    const obs = byRef.get(ref);
    if (!obs) {
      hasUnknown = true;
      allNotApplicable = false;
      continue;
    }

    if (obs.decisionTimestamp !== decisionTimestamp) {
      hasInvalid = true;
      allNotApplicable = false;
      continue;
    }

    if (obs.state !== "NOT_APPLICABLE") allNotApplicable = false;
    if (obs.state === "INVALID") hasInvalid = true;
    else if (obs.state === "STALE") hasStale = true;
    else if (obs.state === "UNKNOWN") hasUnknown = true;
    else if (
      obs.state === "KNOWN" &&
      obs.provenance?.pointInTimeEligible !== true
    ) {
      hasUnknown = true;
    }
  }

  if (hasInvalid) return "INVALID";
  if (hasStale) return "STALE";
  if (hasUnknown) return "UNKNOWN";
  if (allNotApplicable) return "NOT_APPLICABLE";
  return "KNOWN";
}

export function buildFamilyAssessmentReceipt(input) {
  if (!input || typeof input !== "object") throw new Error("family assessment input is required");

  const family = requiredText(input.family, "family");
  if (!FAMILIES.has(family)) throw new Error(`unsupported family: ${family}`);

  const strategyId = requiredText(input.strategyId, "strategyId");
  const strategyVersion = requiredText(input.strategyVersion, "strategyVersion");
  const decisionTimestamp = requiredText(input.decisionTimestamp, "decisionTimestamp");
  if (!Number.isFinite(Date.parse(decisionTimestamp))) {
    throw new Error("decisionTimestamp must be an ISO timestamp");
  }

  const byRef = indexFactors(input.factorObservations || []);
  const requiredFactorRefs = Object.freeze([...(input.requiredFactorRefs || [])].map(String));
  const optionalFactorRefs = Object.freeze([...(input.optionalFactorRefs || [])].map(String));

  for (const ref of optionalFactorRefs) {
    if (!byRef.has(ref)) throw new Error(`optional factor ref not found: ${ref}`);
  }

  const observationState = deriveRequiredState(requiredFactorRefs, byRef, decisionTimestamp);

  let thesisState = requiredText(input.thesisState || "INDETERMINATE", "thesisState");
  if (!THESIS_STATES.has(thesisState)) throw new Error(`unsupported thesisState: ${thesisState}`);
  if (observationState !== "KNOWN") thesisState = "INDETERMINATE";

  const requiredInputs = requiredFactorRefs.map((ref) => {
    const obs = byRef.get(ref);
    return {
      ref,
      present: Boolean(obs),
      state: obs?.state || "MISSING",
      pointInTimeEligible: obs?.provenance?.pointInTimeEligible ?? null,
    };
  });

  const optionalInputs = optionalFactorRefs.map((ref) => {
    const obs = byRef.get(ref);
    return {
      ref,
      state: obs.state,
      pointInTimeEligible: obs.provenance?.pointInTimeEligible ?? null,
    };
  });

  const reasons = [...(input.reasons || [])].map(String);
  if (observationState !== "KNOWN") reasons.push(`FAMILY_NOT_KNOWN:${observationState}`);

  return deepFreeze({
    assessmentId: requiredText(input.assessmentId, "assessmentId"),
    assessmentVersion: requiredText(input.assessmentVersion, "assessmentVersion"),
    marketDate: requiredText(input.marketDate, "marketDate"),
    decisionTimestamp,
    strategyId,
    strategyVersion,
    setupId: input.setupId ? requiredText(input.setupId, "setupId") : undefined,
    family,
    observationState,
    thesisState,
    requiredFactorRefs,
    optionalFactorRefs,
    requiredInputs,
    optionalInputs,
    reasons: Object.freeze(reasons),
    warnings: Object.freeze([...(input.warnings || [])].map(String)),
    assessedAt: requiredText(input.assessedAt, "assessedAt"),
  });
}

export { FAMILIES, THESIS_STATES };
