import assert from "node:assert/strict";
import {
  SHORT_MOMENTUM_CONTRACT_V0_1,
  SWING_GROWTH_CONTRACT_V0_1,
  INDUSTRY_TREND_CONTRACT_V0_1,
} from "../runtime/strategy_contracts_v0_1.mjs";
import { buildStrategyOverlapReceipt } from "../runtime/strategy_overlap_receipt.mjs";

const smSg = await buildStrategyOverlapReceipt({
  receiptId: "O1",
  strategyAContract: SHORT_MOMENTUM_CONTRACT_V0_1,
  strategyBContract: SWING_GROWTH_CONTRACT_V0_1,
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyAValid: true,
  strategyBValid: true,
  sameDecisionClock: true,
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.equal(smSg.independentSameClockValidity, true);
assert.equal(smSg.naiveStrategyCountBonusAllowed, false);
assert.equal(smSg.overlapPriorityEffectAuthorized, false);
assert.equal(smSg.researchState, "OVERLAP_MEASURED_NOT_VALIDATED");

const sgIt = await buildStrategyOverlapReceipt({
  receiptId: "O2",
  strategyAContract: SWING_GROWTH_CONTRACT_V0_1,
  strategyBContract: INDUSTRY_TREND_CONTRACT_V0_1,
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  strategyAValid: true,
  strategyBValid: true,
  sameDecisionClock: true,
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.ok(sgIt.sharedCoreFamilies.includes("INDUSTRY_THESIS"));
assert.ok(sgIt.distinctCoreFamiliesA.includes("FUNDAMENTAL_QUALITY"));
assert.equal(sgIt.naiveStrategyCountBonusAllowed, false);
assert.ok(sgIt.diagnostics.coreJaccard > 0);

console.log("System2 strategy overlap receipt tests passed");
