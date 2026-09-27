import assert from "node:assert/strict";
import { APPROVED_STRATEGY_CONTRACTS_V0_1 } from "../runtime/strategy_contracts_v0_1.mjs";
import { buildRegistrySourceReadinessReceipts } from "../runtime/strategy_source_readiness.mjs";

const receipts = buildRegistrySourceReadinessReceipts(APPROVED_STRATEGY_CONTRACTS_V0_1);
const byId = Object.fromEntries(receipts.map((x) => [x.strategyId, x]));

assert.equal(byId.SHORT_MOMENTUM.sourceReadiness, "SOURCE_LIMITED");
assert.equal(byId.SWING_GROWTH.sourceReadiness, "SOURCE_LIMITED");
assert.equal(byId.INDUSTRY_TREND.sourceReadiness, "SOURCE_BLOCKED");
assert.equal(byId.EVENT_DRIVEN.sourceReadiness, "SOURCE_BLOCKED");
assert.equal(byId.VALUE_REVERSION.sourceReadiness, "SOURCE_LIMITED");

assert.equal(byId.SHORT_MOMENTUM.limitedProspectiveShadowSourceEligible, true);
assert.equal(byId.INDUSTRY_TREND.limitedProspectiveShadowSourceEligible, false);
assert.ok(byId.EVENT_DRIVEN.blockingFamilies.some((x) => x.family === "EVENT_CATALYST"));

console.log("System2 strategy source-readiness tests passed");
