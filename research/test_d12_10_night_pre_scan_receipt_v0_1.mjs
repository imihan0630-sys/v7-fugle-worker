import assert from "node:assert/strict";
import { buildNightPreScanReceipt } from "./d12_10_night_pre_scan_receipt_v0_1.mjs";
import { verifySealedReceipt } from "./global_market_receipt_guard_v0_1.mjs";

const decision = "2026-09-30T18:10:00+08:00";

function clean(overrides = {}) {
  return {
    receiptId: "night-clean",
    windowStart: "2026-09-30T15:00:00+08:00",
    observedAt: "2026-09-30T18:09:45+08:00",
    capturedAt: "2026-09-30T18:09:50+08:00",
    knownAtTaipei: "2026-09-30T18:09:50+08:00",
    decisionTimestamp: decision,
    sourceSessionDate: "2026-10-01",
    contractCode: "TX",
    contractMonth: "202610",
    daysToExpiry: 21,
    rollFlag: false,
    lastTradingDayFlag: false,
    qualityState: "COMPLETE_TO_CAPTURE",
    transactionCompleteness: "ALL_SOURCE_TRADES_THROUGH_OBSERVED_AT",
    open: 30000,
    high: 30200,
    low: 29900,
    last: 30150,
    volume: 12345,
    tradeCount: 6789,
    ...overrides
  };
}

{
  const r = buildNightPreScanReceipt(clean(), { decisionTimestamp: decision });
  assert.equal(r.validation.cleanCoverageEligible, true);
  assert.equal(r.payload.fullNightUseAt1810, "PROHIBITED");
  assert.equal(verifySealedReceipt(r, { decisionTimestamp: decision }).valid, true);
}

{
  assert.throws(
    () => buildNightPreScanReceipt(clean({ observedAt: "2026-09-30T18:10:01+08:00" }), { decisionTimestamp: decision }),
    /cannot be later than 18:10/
  );
}

{
  assert.throws(
    () => buildNightPreScanReceipt(clean({ windowStart: "2026-09-30T15:01:00+08:00" }), { decisionTimestamp: decision }),
    /exactly 15:00:00/
  );
}

{
  assert.throws(
    () => buildNightPreScanReceipt(clean({ lastTradingDayFlag: true }), { decisionTimestamp: decision }),
    /no after-hours session/
  );
}

{
  assert.throws(
    () => buildNightPreScanReceipt(clean({ high: 29800, low: 29900 }), { decisionTimestamp: decision }),
    /high cannot be below low/
  );
}

{
  assert.throws(
    () => buildNightPreScanReceipt(clean({ last: 30500 }), { decisionTimestamp: decision }),
    /last must lie within low\/high/
  );
}

{
  const partial = buildNightPreScanReceipt(
    clean({
      receiptId: "partial",
      qualityState: "PARTIAL_WINDOW",
      open: undefined, high: undefined, low: undefined, last: undefined,
      volume: undefined, tradeCount: undefined,
      missingReason: "TRANSACTION_COVERAGE_INCOMPLETE"
    }),
    { decisionTimestamp: decision }
  );
  assert.equal(partial.validation.cleanCoverageEligible, false);
  assert.ok(partial.validation.qualityReasons.includes("PIT_UNKNOWN"));
  assert.ok(partial.validation.qualityReasons.includes("MISSING"));
}

{
  assert.throws(
    () =>
      buildNightPreScanReceipt(
        clean({
          receiptId: "captured-after-decision",
          observedAt: "2026-09-30T18:09:45+08:00",
          capturedAt: "2026-09-30T18:11:00+08:00",
          knownAtTaipei: "2026-09-30T18:11:00+08:00",
          firstEligibleTaiwanDecision: "2026-10-01T18:10:00+08:00"
        }),
        { decisionTimestamp: decision }
      ),
    /future-information violation/
  );
}

{
  const r = buildNightPreScanReceipt(clean({ receiptId: "tamper" }), { decisionTimestamp: decision });
  const changed = { ...r, payload: { ...r.payload, last: 29999 } };
  assert.throws(
    () => verifySealedReceipt(changed, { decisionTimestamp: decision }),
    /receipt hash mismatch/
  );
}

console.log("d12_10_night_pre_scan_receipt_v0_1: PASS");
