import assert from "node:assert/strict";
import {
  buildTaiwanVixReceipt,
  TAIWAN_VIX_RULES_REGIME
} from "./d12_05_taiwan_vix_receipt_v0_1.mjs";
import { verifySealedReceipt } from "./global_market_receipt_guard_v0_1.mjs";

const decision = "2026-09-30T18:10:00+08:00";

function clean(overrides = {}) {
  return {
    receiptId: "vix-clean-1",
    vixObservedAt: "2026-09-30T13:45:00+08:00",
    vixValue: 24.5,
    vixCapturedAt: "2026-09-30T13:46:00+08:00",
    vixKnownAtTaipei: "2026-09-30T13:46:00+08:00",
    vixQualityState: "VIX_VALID_OFFICIAL",
    quoteLiquidityQuality: "UNKNOWN_NOT_CAPTURED",
    ...overrides
  };
}

{
  const r = buildTaiwanVixReceipt(clean(), { decisionTimestamp: decision });
  assert.equal(r.validation.cleanCoverageEligible, true);
  assert.equal(r.rulesRegimeVersion, TAIWAN_VIX_RULES_REGIME);
  assert.equal(r.payload.directionalInterpretation, "PROHIBITED");
  assert.equal(verifySealedReceipt(r, { decisionTimestamp: decision }).valid, true);
}

{
  assert.throws(
    () =>
      buildTaiwanVixReceipt(
        clean({
          receiptId: "bad-session",
          vixObservedAt: "2026-09-30T13:45:15+08:00"
        }),
        { decisionTimestamp: decision }
      ),
    /09:00-13:45/
  );
}

{
  assert.throws(
    () =>
      buildTaiwanVixReceipt(
        clean({
          receiptId: "bad-grid",
          vixObservedAt: "2026-09-30T13:44:07+08:00"
        }),
        { decisionTimestamp: decision }
      ),
    /15-second/
  );
}

{
  assert.throws(
    () => buildTaiwanVixReceipt(clean({ receiptId: "neg", vixValue: -1 }), { decisionTimestamp: decision }),
    /finite positive/
  );
}

{
  assert.throws(
    () => buildTaiwanVixReceipt(clean({ receiptId: "nan", vixValue: Number.NaN }), { decisionTimestamp: decision }),
    /finite positive/
  );
}

{
  const halted = buildTaiwanVixReceipt(
    clean({
      receiptId: "halted",
      vixValue: null,
      vixQualityState: "VIX_STALE_OR_HALTED",
      staleReason: "TXO_HALTED"
    }),
    { decisionTimestamp: decision }
  );
  assert.equal(halted.validation.cleanCoverageEligible, false);
  assert.ok(halted.validation.qualityReasons.includes("STALE"));
  assert.ok(halted.validation.qualityReasons.includes("PIT_UNKNOWN"));
}

{
  const missing = buildTaiwanVixReceipt(
    clean({
      receiptId: "missing",
      vixValue: null,
      vixQualityState: "VIX_SOURCE_MISSING",
      missingReason: "SOURCE_NOT_CAPTURED"
    }),
    { decisionTimestamp: decision }
  );
  assert.equal(missing.validation.cleanCoverageEligible, false);
  assert.ok(missing.validation.qualityReasons.includes("MISSING"));
}

{
  assert.throws(
    () =>
      buildTaiwanVixReceipt(
        clean({
          receiptId: "captured-after-decision",
          vixCapturedAt: "2026-09-30T18:11:00+08:00",
          vixKnownAtTaipei: "2026-09-30T18:11:00+08:00",
          firstEligibleTaiwanDecision: "2026-10-01T18:10:00+08:00"
        }),
        { decisionTimestamp: decision }
      ),
    /future-information violation/
  );
}

{
  const r = buildTaiwanVixReceipt(clean({ receiptId: "tamper" }), { decisionTimestamp: decision });
  const changed = { ...r, payload: { ...r.payload, vixValue: 99 } };
  assert.throws(
    () => verifySealedReceipt(changed, { decisionTimestamp: decision }),
    /receipt hash mismatch/
  );
}

console.log("d12_05_taiwan_vix_receipt_v0_1: PASS");
