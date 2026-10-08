import assert from "node:assert/strict";
import {
  evaluatePostMarketClockGateV0_1 as evaluate,
  POST_MARKET_CLOCK_GATE_VERSION,
} from "../runtime/post_market_clock_gate_v0_1.mjs";

const H = "a".repeat(64);
const T = "2026-10-09"; // Friday; next official session in fixture = Monday
const session = "2026-10-12";
const source = (sourceId, changes = {}) => ({
  sourceId, state: "READY", reportedMarketDate: T, entitlement: "AUTHORIZED",
  pointInTimeEligible: true, coverageState: "COMPLETE",
  sourceHash: H, sourceReceiptHash: H, sourceReceiptVerified: true,
  firstObservedAt: "2026-10-09T18:50:00+08:00",
  responseCompletedAt: "2026-10-09T18:50:00+08:00", availableAt: null, ...changes,
});
const calendar = {
  marketDate: T, nextEligibleMarketDate: session, state: "VERIFIED_TRADING_DAY",
  pointInTimeEligible: true, sourceHash: H,
  firstObservedAt: "2026-10-09T18:00:00+08:00",
};
const strategy = (strategyId, requiredSourceIds, changes = {}) => ({
  strategyId, strategyVersion: "V0.1", preregistered: true, assessorReady: true,
  requiredSourceIds, optionalSourceIds: ["OPTIONAL_BORROW"], ...changes,
});
const base = {
  targetMarketDate: T, candidateForSessionDate: session,
  phase: "FINAL_FREEZE_ATTEMPT", observedAt: "2026-10-09T23:45:00+08:00",
  calendarReceipt: calendar, requiredUniverseSources: ["TWSE_A1", "TPEX_A1"],
  sources: [source("TWSE_A1"), source("TPEX_A1")],
  strategies: [strategy("SHORT_MOMENTUM", ["TWSE_A1", "TPEX_A1"])],
};
const run = (changes = {}) => evaluate({ ...base, ...changes });
const has = (receipt, code) => receipt.blockers.some(x => x.includes(code));
const good = await run();
assert.equal(good.schemaVersion, POST_MARKET_CLOCK_GATE_VERSION);
assert.equal(good.state, "READY_FOR_DOWNSTREAM_REVALIDATION");
assert.equal(good.eligibleForDownstreamReview, true);
assert.deepEqual(good.eligibleStrategyIds, ["SHORT_MOMENTUM"]);
assert.deepEqual(good.strategyLedger[0].unknownOptionalSources, ["OPTIONAL_BORROW"]);
assert.equal(good.capacityWriteEnabled, false); // NEVER grants capacity authority
assert.equal(good.selectionEnabled, false);
assert.equal(good.livePushEnabled, false);
assert.equal(good.actualSourceVerified, false);
assert.match(good.receiptHash, /^[0-9a-f]{64}$/);
assert.equal((await run()).receiptHash, good.receiptHash); // deterministic

// An 19:00 observation does not become FINAL merely because its inputs are complete.
const early = await run({
  phase: "PRELIMINARY_SOURCE_REVIEW",
  observedAt: "2026-10-09T19:00:00+08:00",
});
assert.equal(early.state, "PRELIMINARY_ONLY");
assert.equal(early.eligibleForDownstreamReview, false);
assert.equal(early.capacityWriteEnabled, false);

// HTTP 200 / nonempty latest-source responses can still be stale.
const stale = await run({ sources: [
  source("TWSE_A1", { reportedMarketDate: "2026-10-08", httpStatus: 200 }),
  source("TPEX_A1"),
] });
assert.equal(stale.eligibleForDownstreamReview, false);
assert.ok(has(stale, "SOURCE_MARKET_DATE_MISMATCH"));

// Exact-date source after the decision clock cannot be backdated.
const future = await run({ sources: [
  source("TWSE_A1", { firstObservedAt: "2026-10-09T23:50:00+08:00",
    responseCompletedAt: "2026-10-09T23:50:00+08:00" }),
  source("TPEX_A1"),
] });
assert.ok(has(future, "SOURCE_FUTURE_OBSERVATION"));

const unavailable = await run({ sources: [
  source("TWSE_A1", { entitlement: "PAID_PRODUCT_NOT_AUTHORIZED" }), source("TPEX_A1"),
] });
assert.ok(has(unavailable, "SOURCE_ACCESS_NOT_AUTHORIZED"));
const noHash = await run({ sources: [
  source("TWSE_A1", { sourceHash: null }), source("TPEX_A1"),
] });
assert.ok(has(noHash, "SOURCE_HASH_MISSING"));
const noAttestation = await run({ sources: [
  source("TWSE_A1", { sourceReceiptVerified: false }), source("TPEX_A1"),
] });
assert.ok(has(noAttestation, "SOURCE_RECEIPT_ATTESTATION_MISSING"));
const noClock = await run({ sources: [
  source("TWSE_A1", { firstObservedAt: null }), source("TPEX_A1"),
] });
assert.ok(has(noClock, "SOURCE_OBSERVATION_PROOF_MISSING"));
const incomplete = await run({ sources: [
  source("TWSE_A1"), source("TPEX_A1", { coverageState: "PARTIAL" }),
] });
assert.ok(has(incomplete, "SOURCE_COVERAGE_INCOMPLETE"));
const dupe = await run({ sources: [source("TWSE_A1"),source("TWSE_A1"),source("TPEX_A1")] });
assert.ok(has(dupe,"DUPLICATE_SOURCE_ID"));

// Required source missing is strategy-local; it must not contaminate valid peers.
const split = await run({ strategies: [
  strategy("SHORT_MOMENTUM", ["TWSE_A1","TPEX_A1"]),
  strategy("SWING_GROWTH", ["TWSE_A1","TPEX_A1","FUNDAMENTAL_PIT"]),
]});
assert.deepEqual(split.eligibleStrategyIds, ["SHORT_MOMENTUM"]);
assert.equal(split.strategyLedger[1].eligibleForDownstreamReview,false);
assert.ok(split.strategyLedger[1].blockerCodes.includes("STRATEGY_REQUIRED_MISSING:FUNDAMENTAL_PIT"));
const noValid = await run({ strategies: [strategy("SWING_GROWTH", ["FUNDAMENTAL_PIT"])] });
assert.equal(noValid.state, "BLOCKED_REQUIRED_SOURCE");
assert.ok(has(noValid, "NO_ELIGIBLE_STRATEGY"));

// Delay is never labeled as meeting the original fixed cutoff.
const late = await run({ observedAt:"2026-10-09T23:46:00+08:00" });
assert.ok(has(late, "SCHEDULE_DELAY_REQUIRES_NEW_ACTUAL_CLOCK_AUTHORIZATION"));
assert.equal(late.eligibleForDownstreamReview, false);

// T+1's 00:15 must retain T and refer to a previously blocked immutable 23:45 attempt.
const blocked = await run({ sources: [source("TWSE_A1"),source("TPEX_A1",{coverageState:"UNKNOWN"})] });
const recoveryBase = {
  phase: "CONDITIONAL_RECOVERY_CHECK",
  observedAt: "2026-10-10T00:15:00+08:00",
};
const orphan = await run(recoveryBase);
assert.ok(has(orphan, "CONDITIONAL_RECOVERY_PARENT_NOT_VERIFIED"));
const recovered = await run({
  ...recoveryBase,
  priorFinalAttempt: {
    targetMarketDate:T, phase:"FINAL_FREEZE_ATTEMPT",
    observedAt:blocked.observedAt, status:blocked.state, receiptHash:blocked.receiptHash,
  },
});
assert.equal(recovered.state, "READY_FOR_DOWNSTREAM_REVALIDATION");
assert.equal(recovered.targetMarketDate, T);
assert.equal(recovered.candidateForSessionDate,session);
assert.equal(recovered.decisionTimestamp,"2026-10-10T00:15:00+08:00");
assert.notEqual(recovered.receiptHash,blocked.receiptHash);
assert.equal(recovered.finalFrozen,false);
const improperRecovery = await run({
  ...recoveryBase,
  priorFinalAttempt: {
    targetMarketDate:T, phase:"FINAL_FREEZE_ATTEMPT",
    observedAt:good.observedAt,status:good.state,receiptHash:good.receiptHash,
  },
});
assert.ok(has(improperRecovery,"CONDITIONAL_RECOVERY_PARENT_NOT_VERIFIED"));

const midnightDrift = await run({
  ...recoveryBase, targetMarketDate:session, candidateForSessionDate:"2026-10-13",
});
assert.ok(has(midnightDrift,"OBSERVATION_SESSION_DATE_MISMATCH"));
const badCalendar = await run({ calendarReceipt:{...calendar,nextEligibleMarketDate:"2026-10-13"} });
assert.ok(has(badCalendar,"OFFICIAL_TRADING_CALENDAR_NOT_VERIFIED"));
const nonPIT = await run({ sources: [
  source("TWSE_A1",{pointInTimeEligible:false}),source("TPEX_A1"),
]});
assert.ok(has(nonPIT,"SOURCE_PIT_UNVERIFIED"));

await assert.rejects(() => run({targetMarketDate:"2026-02-30"}),/INVALID_TARGET_MARKET_DATE/);
await assert.rejects(() => run({observedAt:"2026-10-09T23:45:00"}),/INVALID_OBSERVATION_TIMESTAMP/);
await assert.rejects(() => run({phase:"FINALIZED"}),/INVALID_CLOCK_PHASE/);
await assert.rejects(() => run({strategies:[strategy("M",[])]}),/requiredSourceIds/);
console.log("System2 post-market clock gate V0.1 21+ readiness assertions passed (read-only, no authority)");
