import assert from "node:assert/strict";
import {
  appendReceiptDigest,
  computeReceiptHash,
  sealGlobalMarketReceipt,
  validateGlobalMarketReceipt,
  verifySealedReceipt
} from "./global_market_receipt_guard_v0_1.mjs";

const decision = "2026-09-30T18:10:00+08:00";

function base(overrides = {}) {
  return {
    receiptId: "pilot-ust-20260929",
    domainModule: "D13-06",
    instrumentFamily: "UST_RATE",
    instrumentId: "UST_CMT",
    sourceMarket: "US_TREASURY",
    sourceTimezone: "America/New_York",
    sourceSessionDate: "2026-09-29",
    observedAt: "2026-09-30T03:30:00+08:00",
    capturedAt: "2026-09-30T05:20:18+08:00",
    knownAtTaipei: "2026-09-30T05:20:18+08:00",
    firstEligibleTaiwanDecision: "2026-09-30T18:10:00+08:00",
    sourceId: "UST_DAILY_PAR_YIELD_CURVE",
    sourceUrlOrContract: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/",
    provider: "U.S. Department of the Treasury",
    providerEntitlement: "PUBLIC_OFFICIAL",
    dataLatencyClass: "OFFICIAL_RELEASE",
    revisionStatus: "FIRST_CAPTURE_CURRENT_OFFICIAL_TABLE",
    staleFlag: false,
    staleReason: null,
    pointInTimeEligible: true,
    missingReason: null,
    rulesRegimeVersion: "UST_CMT_MONOTONE_CONVEX_POST_20211206",
    payloadVersion: "0.1",
    payload: { twoYear: 4.89, tenYear: 5.26, thirtyYear: 5.59 },
    ...overrides
  };
}

{
  const result = validateGlobalMarketReceipt(base(), { decisionTimestamp: decision });
  assert.equal(result.cleanCoverageEligible, true);
}

{
  const sealed = sealGlobalMarketReceipt(base(), { decisionTimestamp: decision });
  assert.equal(verifySealedReceipt(sealed, { decisionTimestamp: decision }).valid, true);
  assert.equal(sealed.receiptHash, computeReceiptHash(sealed));
}

{
  const futureTreasury = base({
    receiptId: "future-ust",
    sourceSessionDate: "2026-09-30",
    observedAt: "2026-10-01T03:30:00+08:00",
    capturedAt: "2026-10-01T04:00:00+08:00",
    knownAtTaipei: "2026-10-01T04:00:00+08:00",
    firstEligibleTaiwanDecision: "2026-10-01T18:10:00+08:00"
  });
  assert.throws(
    () => validateGlobalMarketReceipt(futureTreasury, { decisionTimestamp: decision }),
    /future-information violation/
  );
}

{
  const macroRealization = base({
    receiptId: "future-nfp-release",
    domainModule: "D13-09",
    instrumentFamily: "MACRO_RELEASE",
    instrumentId: "BLS_EMPLOYMENT_SITUATION_202609",
    sourceMarket: "US_MACRO",
    sourceSessionDate: "2026-10-02",
    observedAt: "2026-10-02T20:30:00+08:00",
    capturedAt: "2026-10-02T20:31:00+08:00",
    knownAtTaipei: "2026-10-02T20:31:00+08:00",
    firstEligibleTaiwanDecision: "2026-10-05T18:10:00+08:00"
  });
  assert.throws(
    () =>
      validateGlobalMarketReceipt(macroRealization, {
        decisionTimestamp: "2026-10-02T18:10:00+08:00"
      }),
    /future-information violation/
  );
}

{
  const schedule = base({
    receiptId: "bls-schedule-known",
    domainModule: "D13-11",
    instrumentFamily: "MACRO_SCHEDULE",
    instrumentId: "BLS_EMPLOYMENT_SITUATION_202609_SCHEDULE",
    sourceMarket: "US_MACRO",
    sourceTimezone: "America/New_York",
    sourceSessionDate: "2026-10-02",
    observedAt: "2026-09-30T05:20:18+08:00",
    capturedAt: "2026-09-30T05:20:18+08:00",
    knownAtTaipei: "2026-09-30T05:20:18+08:00",
    firstEligibleTaiwanDecision: "2026-09-30T18:10:00+08:00",
    sourceId: "BLS_RELEASE_CALENDAR",
    sourceUrlOrContract: "https://www.bls.gov/schedule/2026/10_sched_list.htm",
    provider: "U.S. Bureau of Labor Statistics",
    providerEntitlement: "PUBLIC_OFFICIAL",
    dataLatencyClass: "EVENT_PUBLICATION",
    payload: { scheduledAtTaipei: "2026-10-02T20:30:00+08:00" }
  });
  assert.equal(
    validateGlobalMarketReceipt(schedule, { decisionTimestamp: decision }).cleanCoverageEligible,
    true
  );
}

{
  assert.throws(
    () =>
      validateGlobalMarketReceipt(
        base({
          receiptId: "unknown-latency",
          dataLatencyClass: "UNKNOWN",
          providerEntitlement: "PUBLIC_OFFICIAL"
        }),
        { decisionTimestamp: decision }
      ),
    /PIT-eligible receipt requires known latency/
  );
}

{
  const stale = base({
    receiptId: "stale-but-valid",
    staleFlag: true,
    staleReason: "NO_NEW_SOURCE_SESSION"
  });
  const result = validateGlobalMarketReceipt(stale, { decisionTimestamp: decision });
  assert.equal(result.valid, true);
  assert.equal(result.cleanCoverageEligible, false);
  assert.ok(result.qualityReasons.includes("STALE"));
}

{
  const unknown = base({
    receiptId: "missing-unknown",
    pointInTimeEligible: null,
    dataLatencyClass: "UNKNOWN",
    providerEntitlement: "NOT_FROZEN",
    missingReason: "SOURCE_CONTRACT_NOT_AVAILABLE"
  });
  const result = validateGlobalMarketReceipt(unknown, { decisionTimestamp: decision });
  assert.equal(result.valid, true);
  assert.equal(result.cleanCoverageEligible, false);
  assert.ok(result.qualityReasons.includes("PIT_UNKNOWN"));
}

{
  const sealed = sealGlobalMarketReceipt(base(), { decisionTimestamp: decision });
  const tampered = { ...sealed, payload: { ...sealed.payload, tenYear: 99 } };
  assert.throws(
    () => verifySealedReceipt(tampered, { decisionTimestamp: decision }),
    /receipt hash mismatch/
  );
}

{
  const a = sealGlobalMarketReceipt(base({ receiptId: "a" }), { decisionTimestamp: decision });
  const b = sealGlobalMarketReceipt(base({ receiptId: "b" }), { decisionTimestamp: decision });
  const digest1 = appendReceiptDigest(null, a);
  const digest2 = appendReceiptDigest(digest1, b);
  const digest2Reversed = appendReceiptDigest(appendReceiptDigest(null, b), a);
  assert.notEqual(digest2, digest2Reversed);
}

console.log("global_market_receipt_guard_v0_1: PASS");
