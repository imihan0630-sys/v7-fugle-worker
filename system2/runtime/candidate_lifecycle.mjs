import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

const CANDIDATE_STATES = new Set([
  "DISCOVERED",
  "WATCH",
  "CANDIDATE",
  "ACTIVE_INTRADAY_MONITOR",
  "ENTRY_ZONE",
  "TRIGGER_READY",
  "SIM_FILLED",
  "POSITION_MONITOR",
  "THESIS_WEAKENING",
  "INVALIDATED",
  "EXPIRED",
  "REMOVED",
]);

const TERMINAL_CANDIDATE_STATES = new Set(["INVALIDATED", "EXPIRED", "REMOVED"]);
const POOL_STATES = new Set([
  "WATCH",
  "CANDIDATE",
  "ACTIVE_INTRADAY_MONITOR",
  "ENTRY_ZONE",
  "TRIGGER_READY",
  "THESIS_WEAKENING",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertState(value, field) {
  const state = requiredText(value, field);
  if (!CANDIDATE_STATES.has(state)) throw new Error(`${field} has unsupported state: ${state}`);
  return state;
}

function normalizeMemberships(rows, field) {
  if (!Array.isArray(rows)) throw new Error(`${field} must be an array`);
  const seen = new Set();

  return rows.map((row, i) => {
    if (!row || typeof row !== "object") throw new Error(`${field}[${i}] is required`);
    const strategyId = requiredText(row.strategyId, `${field}[${i}].strategyId`);
    if (seen.has(strategyId)) throw new Error(`duplicate strategy membership: ${strategyId}`);
    seen.add(strategyId);

    return {
      strategyId,
      strategyVersion: requiredText(
        row.strategyVersion,
        `${field}[${i}].strategyVersion`,
      ),
      strategyValidity: requiredText(
        row.strategyValidity,
        `${field}[${i}].strategyValidity`,
      ),
      observationValue: row.observationValue === true,
      entryReadiness: row.entryReadiness
        ? requiredText(row.entryReadiness, `${field}[${i}].entryReadiness`)
        : undefined,
      decisionId: row.decisionId
        ? requiredText(row.decisionId, `${field}[${i}].decisionId`)
        : undefined,
      reasonCodes: Object.freeze([...(row.reasonCodes || [])].map(String)),
      evidenceRefs: Object.freeze([...(row.evidenceRefs || [])].map(String)),
    };
  });
}

function hasObservationValue(memberships) {
  return memberships.some(
    (x) =>
      x.observationValue === true &&
      x.strategyValidity !== "INVALIDATED",
  );
}

function validateTransition(fromState, toState, memberships) {
  if (TERMINAL_CANDIDATE_STATES.has(fromState)) {
    throw new Error("terminal candidate episode cannot transition; create a new episode");
  }

  if (fromState === "SIM_FILLED" && toState !== "POSITION_MONITOR") {
    throw new Error("SIM_FILLED must transition to POSITION_MONITOR");
  }

  if (fromState === "POSITION_MONITOR" && toState !== "POSITION_MONITOR") {
    throw new Error("POSITION_MONITOR lifecycle is managed outside candidate capacity");
  }

  if (POOL_STATES.has(toState) && !hasObservationValue(memberships)) {
    throw new Error("pool state requires at least one membership with observation value");
  }
}

export async function buildCandidateLifecycleTransitionReceipt(input) {
  if (!input || typeof input !== "object") throw new Error("lifecycle transition input is required");

  const fromState = assertState(input.fromState, "fromState");
  const toState = assertState(input.toState, "toState");
  const memberships = normalizeMemberships(input.memberships || [], "memberships");

  validateTransition(fromState, toState, memberships);

  const base = {
    lifecycleReceiptId: requiredText(input.lifecycleReceiptId, "lifecycleReceiptId"),
    candidateEpisodeId: requiredText(input.candidateEpisodeId, "candidateEpisodeId"),
    symbol: requiredText(input.symbol, "symbol"),
    marketDate: requiredText(input.marketDate, "marketDate"),
    transitionTimestamp: requiredText(
      input.transitionTimestamp,
      "transitionTimestamp",
    ),
    fromState,
    toState,
    memberships,
    reasonCodes: Object.freeze([...(input.reasonCodes || [])].map(String)),
    evidenceRefs: Object.freeze([...(input.evidenceRefs || [])].map(String)),
    capacityEligible: POOL_STATES.has(toState),
    positionMonitor: toState === "POSITION_MONITOR",
    schemaVersion: "S2_CANDIDATE_LIFECYCLE_V0_1",
  };

  const lifecycleHash = await sha256Hex(base);
  return deepFreeze({ ...base, lifecycleHash });
}

export async function buildReentryCandidateEpisodeReceipt(input) {
  if (!input || typeof input !== "object") throw new Error("reentry input is required");

  const previousEpisodeId = requiredText(input.previousEpisodeId, "previousEpisodeId");
  const newEpisodeId = requiredText(input.newEpisodeId, "newEpisodeId");
  if (previousEpisodeId === newEpisodeId) {
    throw new Error("re-entry requires a new candidateEpisodeId");
  }

  const base = {
    reentryReceiptId: requiredText(input.reentryReceiptId, "reentryReceiptId"),
    symbol: requiredText(input.symbol, "symbol"),
    previousEpisodeId,
    newEpisodeId,
    requalifiedDecisionId: requiredText(
      input.requalifiedDecisionId,
      "requalifiedDecisionId",
    ),
    reentryTimestamp: requiredText(input.reentryTimestamp, "reentryTimestamp"),
    reasonCodes: Object.freeze([...(input.reasonCodes || [])].map(String)),
    schemaVersion: "S2_CANDIDATE_REENTRY_V0_1",
  };

  const reentryHash = await sha256Hex(base);
  return deepFreeze({ ...base, reentryHash });
}

export { CANDIDATE_STATES, TERMINAL_CANDIDATE_STATES, POOL_STATES };
