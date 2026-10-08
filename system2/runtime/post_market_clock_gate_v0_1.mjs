import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

// Offline evidence eligibility only. Not a final selection, persistence, push or Cron API.
export const POST_MARKET_CLOCK_GATE_VERSION = "S2_POST_MARKET_CLOCK_GATE_V0_1";
export const POST_MARKET_CLOCK_PHASES = Object.freeze({
  PRELIMINARY_SOURCE_REVIEW: "19:00",
  FINAL_FREEZE_ATTEMPT: "23:45",
  CONDITIONAL_RECOVERY_CHECK: "00:15",
});
const HASH = /^[a-f0-9]{64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function validDate(x) {
  return typeof x === "string" && DATE.test(x)
    && new Date(x + "T00:00:00.000Z").toISOString().slice(0, 10) === x;
}
function parseClock(x) {
  if (typeof x !== "string" || !ISO_WITH_OFFSET.test(x)) return null;
  const ms = Date.parse(x);
  return Number.isFinite(ms) ? ms : null;
}
function twLocal(ms) {
  // Taiwan is UTC+08:00 and has no seasonal DST.
  const s = new Date(ms + 8 * 60 * 60 * 1000).toISOString();
  return { date: s.slice(0, 10), minute: s.slice(11, 16) };
}
function nextCalendarDate(date) {
  const ms = Date.parse(date + "T00:00:00.000Z");
  return new Date(ms + 86400000).toISOString().slice(0, 10);
}
function isHash(x) { return typeof x === "string" && HASH.test(x); }
function stringsUnique(xs, field) {
  if (!Array.isArray(xs) || xs.length === 0 || xs.some(x => typeof x !== "string" || !x.trim())
    || new Set(xs).size !== xs.length) {
    throw new Error(field + " must contain unique nonempty strings");
  }
  return xs;
}
const unique = xs => Object.freeze([...new Set(xs)]);
function sourceProblems(source, targetDate, now) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return ["SOURCE_INVALID"];
  const reasons = [];
  if (source.state !== "READY") reasons.push("SOURCE_NOT_READY");
  if (source.reportedMarketDate !== targetDate) reasons.push("SOURCE_MARKET_DATE_MISMATCH");
  if (source.entitlement !== "AUTHORIZED") reasons.push("SOURCE_ACCESS_NOT_AUTHORIZED");
  if (source.pointInTimeEligible !== true) reasons.push("SOURCE_PIT_UNVERIFIED");
  if (source.coverageState !== "COMPLETE") reasons.push("SOURCE_COVERAGE_INCOMPLETE");
  if (!isHash(source.sourceHash)) reasons.push("SOURCE_HASH_MISSING");
  if (!isHash(source.sourceReceiptHash) || source.sourceReceiptVerified !== true) {
    reasons.push("SOURCE_RECEIPT_ATTESTATION_MISSING");
  }
  const first = parseClock(source.firstObservedAt);
  const response = parseClock(source.responseCompletedAt);
  if (first === null || response === null) reasons.push("SOURCE_OBSERVATION_PROOF_MISSING");
  else {
    if (first > now || response > now) reasons.push("SOURCE_FUTURE_OBSERVATION");
    if (first > response) reasons.push("SOURCE_CLOCK_ORDER_INVALID");
  }
  if (source.availableAt !== null && source.availableAt !== undefined) {
    const available = parseClock(source.availableAt);
    if (available === null || available > now) reasons.push("SOURCE_AVAILABILITY_NOT_PROVEN");
  }
  return unique(reasons);
}

/**
 * Preflight for a proposed System2 bounded watch pool. Everything here is read-only.
 * The output never alone authorizes s2_capacity_runs writes, frozen decisions or push.
 * Required source IDs and strategy mappings must already be registered upstream.
 */
export async function evaluatePostMarketClockGateV0_1({
  targetMarketDate, candidateForSessionDate, phase, observedAt,
  calendarReceipt, requiredUniverseSources = [], sources = [],
  strategies = [], priorFinalAttempt = null,
} = {}) {
  if (!validDate(targetMarketDate)) throw new Error("INVALID_TARGET_MARKET_DATE");
  if (!validDate(candidateForSessionDate) || candidateForSessionDate <= targetMarketDate) {
    throw new Error("INVALID_NEXT_ELIGIBLE_SESSION");
  }
  if (!Object.hasOwn(POST_MARKET_CLOCK_PHASES, phase)) throw new Error("INVALID_CLOCK_PHASE");
  const now = parseClock(observedAt);
  if (now === null) throw new Error("INVALID_OBSERVATION_TIMESTAMP");
  if (!Array.isArray(sources) || !Array.isArray(strategies) || !strategies.length) {
    throw new Error("SOURCE_OR_STRATEGY_ARRAY_INVALID");
  }
  stringsUnique(requiredUniverseSources, "requiredUniverseSources");
  const clock = twLocal(now);
  const expectedDate = phase === "CONDITIONAL_RECOVERY_CHECK"
    ? nextCalendarDate(targetMarketDate) : targetMarketDate;
  const blockers = [];
  if (clock.date !== expectedDate) blockers.push("OBSERVATION_SESSION_DATE_MISMATCH");
  const scheduledMinute = POST_MARKET_CLOCK_PHASES[phase];
  if (clock.minute !== scheduledMinute) blockers.push("SCHEDULE_DELAY_REQUIRES_NEW_ACTUAL_CLOCK_AUTHORIZATION");
  if (phase === "CONDITIONAL_RECOVERY_CHECK") {
    const p = priorFinalAttempt;
    if (!p || p.targetMarketDate !== targetMarketDate || p.phase !== "FINAL_FREEZE_ATTEMPT"
        || !["BLOCKED_REQUIRED_SOURCE", "NOT_READY"].includes(p.status)
        || !isHash(p.receiptHash) || parseClock(p.observedAt) === null
        || parseClock(p.observedAt) > now) {
      blockers.push("CONDITIONAL_RECOVERY_PARENT_NOT_VERIFIED");
    }
  }
  const c = calendarReceipt;
  if (!c || c.state !== "VERIFIED_TRADING_DAY" || c.marketDate !== targetMarketDate
      || c.nextEligibleMarketDate !== candidateForSessionDate
      || c.pointInTimeEligible !== true || !isHash(c.sourceHash)
      || parseClock(c.firstObservedAt) === null
      || parseClock(c.firstObservedAt) > now) {
    blockers.push("OFFICIAL_TRADING_CALENDAR_NOT_VERIFIED");
  }

  const sourceMap = new Map();
  for (const s of sources) {
    if (typeof s?.sourceId !== "string" || !s.sourceId.trim()) {
      blockers.push("UNIDENTIFIED_SOURCE_RECEIPT");
      continue;
    }
    if (sourceMap.has(s.sourceId)) blockers.push("DUPLICATE_SOURCE_ID:" + s.sourceId);
    sourceMap.set(s.sourceId, s);
  }
  const sourceLedger = Object.freeze([...sourceMap.entries()].map(([sourceId, s]) => {
    const reasons = sourceProblems(s, targetMarketDate, now);
    return deepFreeze({
      sourceId, ready: reasons.length === 0, blockers: reasons,
      sourceHash: isHash(s.sourceHash) ? s.sourceHash : null,
      sourceReceiptHash: isHash(s.sourceReceiptHash) ? s.sourceReceiptHash : null,
      firstObservedAt: s.firstObservedAt || null,
      observedUpperBoundOnly: s.availableAt === null || s.availableAt === undefined,
    });
  }));
  const ledgerMap = new Map(sourceLedger.map(x => [x.sourceId, x]));
  const checkIds = (ids, codePrefix) => ids.flatMap(id => {
    const source = ledgerMap.get(id);
    return !source ? [codePrefix + "_MISSING:" + id]
      : source.blockers.map(code => codePrefix + ":" + id + ":" + code);
  });
  blockers.push(...checkIds(requiredUniverseSources, "UNIVERSE"));
  const seenStrategies = new Set();
  const strategyLedger = Object.freeze(strategies.map(s => {
    if (!s || typeof s.strategyId !== "string" || !s.strategyId.trim()
        || typeof s.strategyVersion !== "string" || !s.strategyVersion.trim()) {
      throw new Error("STRATEGY_IDENTITY_NOT_FROZEN");
    }
    const identity = s.strategyId + "@" + s.strategyVersion;
    if (seenStrategies.has(identity)) blockers.push("DUPLICATE_STRATEGY:" + identity);
    seenStrategies.add(identity);
    const required = stringsUnique(s.requiredSourceIds, "requiredSourceIds");
    const optional = s.optionalSourceIds || [];
    if (!Array.isArray(optional) || optional.some(x => typeof x !== "string")
        || new Set(optional).size !== optional.length) throw new Error("INVALID_OPTIONAL_SOURCE_IDS");
    const reasonCodes = [
      ...checkIds(required, "STRATEGY_REQUIRED"),
      ...(s.assessorReady !== true || s.preregistered !== true
        ? ["STRATEGY_ASSESSOR_OR_REGISTRATION_NOT_READY"] : []),
    ];
    return deepFreeze({
      strategyId: s.strategyId, strategyVersion: s.strategyVersion,
      eligibleForDownstreamReview: reasonCodes.length === 0,
      blockerCodes: unique(reasonCodes),
      unknownOptionalSources: unique(optional.filter(id => ledgerMap.get(id)?.ready !== true)),
    });
  }));
  const finalPhase = phase !== "PRELIMINARY_SOURCE_REVIEW";
  const someReady = strategyLedger.some(s => s.eligibleForDownstreamReview);
  const phaseReady = blockers.length === 0 && someReady && finalPhase;
  const state = !finalPhase ? "PRELIMINARY_ONLY"
    : phaseReady ? "READY_FOR_DOWNSTREAM_REVALIDATION" : "BLOCKED_REQUIRED_SOURCE";
  if (finalPhase && !someReady) blockers.push("NO_ELIGIBLE_STRATEGY");
  const receipt = {
    schemaVersion: POST_MARKET_CLOCK_GATE_VERSION,
    targetMarketDate, candidateForSessionDate, phase, scheduledMinute,
    observedAt, decisionTimestamp: observedAt, state,
    blockers: unique(blockers), sourceLedger, strategyLedger,
    eligibleForDownstreamReview: phaseReady,
    eligibleStrategyIds: Object.freeze(
      phaseReady ? strategyLedger.filter(s => s.eligibleForDownstreamReview).map(s => s.strategyId) : [],
    ),
    finalFrozen: false, capacityWriteEnabled: false, selectionEnabled: false,
    livePushEnabled: false, capitalImpact: false, orderImpact: false,
    system1FormalCoreImpact: false, actualSourceVerified: false,
    admissionSemantics: "PRELIMINARY_PIT_SOURCE_GATE_NOT_FINAL_CAPACITY_AUTHORIZATION",
  };
  return deepFreeze({ ...receipt, receiptHash: await sha256Hex(receipt) });
}
