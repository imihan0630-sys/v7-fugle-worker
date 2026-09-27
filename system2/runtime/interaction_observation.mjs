import { deepFreeze } from "./factor_snapshot.mjs";

const OBSERVATION_STATES = new Set([
  "KNOWN",
  "UNKNOWN",
  "STALE",
  "INVALID",
  "NOT_APPLICABLE",
]);

const CONFLUENCE_STATES = new Set([
  "SUPPORTIVE",
  "NEUTRAL",
  "ADVERSE",
  "INDETERMINATE",
]);

const REDUNDANCY_STATES = new Set([
  "NOT_TESTED",
  "CONTROLLED_FOR_RESEARCH",
  "REDUNDANCY_WARNING",
  "REJECTED_REDUNDANT",
]);

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

function deriveState(componentFactorRefs, byRef, decisionTimestamp) {
  let hasUnknown = false;
  let hasStale = false;
  let hasInvalid = false;
  let allNotApplicable = componentFactorRefs.length > 0;

  for (const ref of componentFactorRefs) {
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
    else if (obs.state === "KNOWN" && obs.provenance?.pointInTimeEligible !== true) {
      hasUnknown = true;
    }
  }

  if (hasInvalid) return "INVALID";
  if (hasStale) return "STALE";
  if (hasUnknown) return "UNKNOWN";
  if (allNotApplicable) return "NOT_APPLICABLE";
  return "KNOWN";
}

export function buildInteractionObservationReceipt(input) {
  if (!input || typeof input !== "object") throw new Error("interaction input is required");

  const decisionTimestamp = requiredText(input.decisionTimestamp, "decisionTimestamp");
  if (!Number.isFinite(Date.parse(decisionTimestamp))) {
    throw new Error("decisionTimestamp must be an ISO timestamp");
  }

  const componentFactorRefs = Object.freeze(
    [...(input.componentFactorRefs || [])].map((x) => requiredText(String(x), "componentFactorRefs[]")),
  );
  if (!componentFactorRefs.length) throw new Error("componentFactorRefs cannot be empty");

  const byRef = indexFactors(input.factorObservations || []);
  const state = deriveState(componentFactorRefs, byRef, decisionTimestamp);
  if (!OBSERVATION_STATES.has(state)) throw new Error("unsupported derived interaction state");

  let confluenceState = requiredText(
    input.confluenceState || "INDETERMINATE",
    "confluenceState",
  );
  if (!CONFLUENCE_STATES.has(confluenceState)) {
    throw new Error(`unsupported confluenceState: ${confluenceState}`);
  }
  if (state !== "KNOWN") confluenceState = "INDETERMINATE";

  const redundancyState = requiredText(
    input.redundancyState || "NOT_TESTED",
    "redundancyState",
  );
  if (!REDUNDANCY_STATES.has(redundancyState)) {
    throw new Error(`unsupported redundancyState: ${redundancyState}`);
  }

  const componentInputs = componentFactorRefs.map((ref) => {
    const obs = byRef.get(ref);
    return {
      ref,
      present: Boolean(obs),
      state: obs?.state || "MISSING",
      decisionTimestamp: obs?.decisionTimestamp || null,
      pointInTimeEligible: obs?.provenance?.pointInTimeEligible ?? null,
    };
  });

  const rankingEligible =
    state === "KNOWN" &&
    confluenceState !== "INDETERMINATE" &&
    redundancyState === "CONTROLLED_FOR_RESEARCH";

  const reasons = [...(input.reasons || [])].map(String);
  if (state !== "KNOWN") reasons.push(`INTERACTION_NOT_KNOWN:${state}`);
  if (redundancyState !== "CONTROLLED_FOR_RESEARCH") {
    reasons.push(`INTERACTION_REDUNDANCY_GATE:${redundancyState}`);
  }

  return deepFreeze({
    interactionReceiptId: requiredText(
      input.interactionReceiptId,
      "interactionReceiptId",
    ),
    interactionId: requiredText(input.interactionId, "interactionId"),
    interactionVersion: requiredText(
      input.interactionVersion,
      "interactionVersion",
    ),
    strategyId: requiredText(input.strategyId, "strategyId"),
    strategyVersion: requiredText(input.strategyVersion, "strategyVersion"),
    symbol: requiredText(input.symbol, "symbol"),
    marketDate: requiredText(input.marketDate, "marketDate"),
    decisionTimestamp,
    componentFactorRefs,
    componentFamilyAssessmentIds: Object.freeze(
      [...(input.componentFamilyAssessmentIds || [])].map(String),
    ),
    componentInputs,
    state,
    confluenceState,
    redundancyState,
    rankingEligible,
    falsificationTag: input.falsificationTag
      ? requiredText(input.falsificationTag, "falsificationTag")
      : undefined,
    reasons: Object.freeze(reasons),
    warnings: Object.freeze([...(input.warnings || [])].map(String)),
    assessedAt: requiredText(input.assessedAt, "assessedAt"),
    schemaVersion: "S2_INTERACTION_OBSERVATION_V0_1",
  });
}

export {
  OBSERVATION_STATES,
  CONFLUENCE_STATES,
  REDUNDANCY_STATES,
};
