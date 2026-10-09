import { deepFreeze } from "./factor_snapshot.mjs";

// CORR-013 downstream-denominator firewall. Neither a simulator return object
// nor a caller-supplied "verified" boolean authenticates exchange calendar,
// source bytes, PIT availability or feasible fills. No positive execution
// performance/NO_FILL denominator can be certified by this V0.1 guard.
export const S2_EXECUTION_DENOMINATOR_GUARD_VERSION_V0_1 =
  "S2_EXECUTION_DENOMINATOR_GUARD_V0_1_RESEARCH";

const UNCERTAIN_STATES = new Set([
  "DATA_INCOMPLETE","DATA_BLOCKED","UNKNOWN","INCOMPLETE","AMBIGUOUS",
  "ENTRY_PENDING","ENTRY_FILLED_OPEN",
]);

export function classifyS2ExecutionDenominatorV0_1(simulation) {
  if (simulation === null || simulation === undefined) {
    return deepFreeze({
      guardVersion: S2_EXECUTION_DENOMINATOR_GUARD_VERSION_V0_1,
      modelState: null,
      classification: "NO_SIMULATION_OBSERVED",
      confirmedNoFillCount: null,
      confirmedTriggeredCount: null,
      confirmedProfitableCount: null,
      certifiedTradeReturn: null,
      denominatorEligible: false,
      noFillDenominatorEligible: false,
      executionReturnEligible: false,
      reasons: ["NO_SIMULATION_EVIDENCE"],
    });
  }
  if (!simulation || typeof simulation !== "object" || Array.isArray(simulation)) {
    throw new Error("simulation must be an object or null");
  }
  const state = simulation.state;
  if (typeof state !== "string" || !state.trim()) {
    throw new Error("simulation.state is required");
  }

  const reasons = [
    "INDEPENDENT_EXCHANGE_SESSION_CALENDAR_NOT_VERIFIED",
    "SOURCE_PIT_AND_PHYSICAL_FILL_NOT_VERIFIED",
  ];
  let classification = "MODEL_UNCERTIFIED";
  if (state === "NO_FILL") {
    classification = "NO_FILL_NOT_CERTIFIED";
    if (simulation.proofCompleteNoFill !== true
        || simulation.noFillDenominatorEligible !== true) {
      reasons.push("NO_FILL_WINDOW_INCOMPLETE_OR_UNPROVEN");
    } else {
      // Even a caller-supplied true is not an independent signed receipt.
      reasons.push("CALLER_NO_FILL_CLAIM_NOT_INDEPENDENT_PROOF");
    }
  } else if (state === "CLOSED") {
    classification = "MODELED_CLOSED_NOT_CERTIFIED";
    if (simulation.performanceEligible !== true) {
      reasons.push("MODEL_ITSELF_NOT_PERFORMANCE_ELIGIBLE");
    }
    if ((simulation.blockedObservations || []).length) {
      reasons.push("UNRESOLVED_ENTRY_EXIT_OBSERVATIONS");
    }
  } else if (UNCERTAIN_STATES.has(state)) {
    classification = "UNKNOWN_OR_UNRESOLVED_INTERVAL";
    reasons.push("MODEL_STATE_NOT_TERMINALLY_PROVEN");
  } else {
    reasons.push("MODEL_STATE_NO_CERTIFIED_DENOMINATOR");
  }
  if (simulation.fillsSuppressedDueToUnknown === true) {
    reasons.push("TENTATIVE_FILLS_SUPPRESSED");
  }

  return deepFreeze({
    guardVersion: S2_EXECUTION_DENOMINATOR_GUARD_VERSION_V0_1,
    modelState: state,
    classification,
    confirmedNoFillCount: null,
    confirmedTriggeredCount: null,
    confirmedProfitableCount: null,
    certifiedTradeReturn: null,
    denominatorEligible: false,
    noFillDenominatorEligible: false,
    executionReturnEligible: false,
    reasons: Object.freeze([...new Set(reasons)]),
  });
}
