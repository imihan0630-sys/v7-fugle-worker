import assert from "node:assert/strict";
import { buildRank04RegimeReadinessReceipt } from "../runtime/rank04_regime_readiness.mjs";

const full = {
  regimeSnapshotId: "R1",
  taiwanIndexState: "KNOWN",
  breadthState: "KNOWN",
  sectorRotationState: "KNOWN",
  volatilityState: "KNOWN",
};

const sm = buildRank04RegimeReadinessReceipt({
  receiptId: "RR1",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  regimeSnapshot: full,
  marketSegment: "TWSE",
  assessedAt: "2026-09-27T07:31:00Z",
});
assert.equal(sm.state, "REGIME_READY");
assert.equal(sm.rankingChallengerEligible, true);

const smMissingBreadth = buildRank04RegimeReadinessReceipt({
  receiptId: "RR2",
  strategyId: "SHORT_MOMENTUM",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  regimeSnapshot: { ...full, breadthState: "UNKNOWN" },
  marketSegment: "TWSE",
  assessedAt: "2026-09-27T07:31:00Z",
});
assert.equal(smMissingBreadth.state, "REGIME_INCOMPLETE");
assert.equal(smMissingBreadth.rankingChallengerEligible, false);
assert.ok(smMissingBreadth.missingFields.includes("breadthState"));

const sg = buildRank04RegimeReadinessReceipt({
  receiptId: "RR3",
  strategyId: "SWING_GROWTH",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  regimeSnapshot: { ...full, breadthState: "UNKNOWN" },
  marketSegment: "TWSE",
  assessedAt: "2026-09-27T07:31:00Z",
});
assert.equal(sg.state, "REGIME_READY");

const tpexBlocked = buildRank04RegimeReadinessReceipt({
  receiptId: "RR4",
  strategyId: "SWING_GROWTH",
  strategyVersion: "V0.1-CONTRACT",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  regimeSnapshot: full,
  marketSegment: "TPEX",
  tpexState: "UNKNOWN",
  assessedAt: "2026-09-27T07:31:00Z",
});
assert.equal(tpexBlocked.state, "REGIME_INCOMPLETE");
assert.ok(tpexBlocked.missingFields.includes("tpexState"));

console.log("System2 RANK-04 regime readiness tests passed");
