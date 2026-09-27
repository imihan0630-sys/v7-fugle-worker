import assert from "node:assert/strict";
import { buildCandidateConcentrationReceipt } from "../runtime/candidate_concentration_receipt.mjs";

const pool = [
  {
    symbol: "A",
    industryClassification: { state: "KNOWN", industryKey: "SEMICONDUCTOR" },
    memberships: [{ strategyId: "SHORT_MOMENTUM" }],
  },
  {
    symbol: "B",
    industryClassification: { state: "KNOWN", industryKey: "SEMICONDUCTOR" },
    memberships: [
      { strategyId: "SHORT_MOMENTUM" },
      { strategyId: "SWING_GROWTH" },
    ],
  },
  {
    symbol: "C",
    industryClassification: { state: "KNOWN", industryKey: "FINANCIAL" },
    memberships: [{ strategyId: "SWING_GROWTH" }],
  },
  {
    symbol: "D",
    industryClassification: { state: "UNKNOWN" },
    memberships: [{ strategyId: "SWING_GROWTH" }],
  },
];

const receipt = await buildCandidateConcentrationReceipt({
  receiptId: "C1",
  marketDate: "2026-09-27",
  decisionTimestamp: "2026-09-27T07:30:00Z",
  globalPool: pool,
  classificationVersion: "INDUSTRY-V0-PROSPECTIVE",
  capturedAt: "2026-09-27T07:31:00Z",
});

assert.equal(receipt.globalCount, 4);
assert.equal(receipt.knownIndustryCount, 3);
assert.equal(receipt.unknownIndustryCount, 1);
assert.equal(receipt.knownIndustryCoverage, 0.75);
assert.equal(receipt.largestIndustry.industryKey, "SEMICONDUCTOR");
assert.equal(receipt.largestIndustry.count, 2);
assert.equal(receipt.multiStrategySymbolCount, 1);
assert.equal(receipt.strategyMembershipCounts.SHORT_MOMENTUM, 2);
assert.equal(receipt.strategyMembershipCounts.SWING_GROWTH, 3);
assert.equal(receipt.concentrationAdmissionEffectAuthorized, false);
assert.ok(receipt.warnings.includes("INDUSTRY_CLASSIFICATION_INCOMPLETE"));
assert.equal(
  receipt.industryRows.some((x) => x.industryKey === "UNKNOWN"),
  false,
);

console.log("System2 candidate concentration receipt tests passed");
