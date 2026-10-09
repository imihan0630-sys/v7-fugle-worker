import assert from "node:assert/strict";
import { simulateTaiwanLongDailyPlanV0_1,
  toOutcomeSimulatedExecutionV0_1 } from "../runtime/execution_simulator_v0_1.mjs";
import { buildDecisionOutcomeSnapshotV0_1,toS2OutcomeRowV0_1,
  validateMonotonicOutcomeUpdateV0_1 } from "../runtime/outcome_tracker_v0_1.mjs";
const base={
 simOrderId:"S2-012-LINEAGE",entryFillObservationId:"S2-012-LINEAGE-E",
 exitFillObservationId:"S2-012-LINEAGE-X",decisionId:"S2-012-D",
 strategyId:"SWING_GROWTH",strategyVersion:"V1.0-SHADOW",
 symbol:"2330",decisionMarketDate:"2026-09-29",
 decisionTimestamp:"2026-09-29T07:30:00Z",
 earliestEligibleMarketDate:"2026-09-30",orderType:"BUY_STOP",triggerPrice:100,
 requestedShares:1000,stopPrice:95,targetPrice:108,
 maxHoldingSessions:5,entryValiditySessions:2,
 priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
 costModel:{costModelVersion:"COST-001",taxRuleId:"TW-TAX-001",
 commissionRate:0.001,minimumCommission:1,transactionTaxRate:0.003,
 entrySlippageRate:0.001,exitSlippageRate:0.001},
 simulatedAt:"2026-10-09T09:00:00Z",
};
const session=(n,date,ohlc={})=>({
 sessionNumber:n,marketDate:date,availableAt:"2026-10-09T08:00:00Z",
 priceSpace:"ADJUSTED",open:99,high:103,low:97,close:101,
 tradingState:"NORMAL",executableLiquidity:"AVAILABLE",limitState:"NONE",
 volumeShares:3000000,sourceId:"SYNTHETIC-NOT_PIT",...ohlc,
});
const sim=await simulateTaiwanLongDailyPlanV0_1({
 ...base,sessions:[session(1,"2026-09-30"),session(2,"2026-10-01",
 {open:102,high:109,low:99,close:108})],
});
assert.match(sim.executionHash,/^[a-f0-9]{64}$/);
const projection=toOutcomeSimulatedExecutionV0_1(sim);
assert.equal(projection.executionHash,sim.executionHash);
assert.equal(projection.costModelVersion,"COST-001");
assert.equal(projection.taxRuleId,"TW-TAX-001");
assert.equal(projection.costModel.transactionTaxRate,0.003);
assert.equal(Object.isFrozen(projection.costModel),true);
assert.match(projection.lineageStatus,/NOT_INDEPENDENT_SOURCE_PROOF/);
const outcomeBase={
 decisionId:base.decisionId,symbol:base.symbol,decisionMarketDate:base.decisionMarketDate,
 decisionTimestamp:base.decisionTimestamp,referencePrice:100,
 entryPlan:{stopPrice:95,targets:[108]},
 priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
 simulatedExecution:projection,
};
const early=await buildDecisionOutcomeSnapshotV0_1({
 ...outcomeBase,sessions:[session(1,"2026-09-30")],
 updatedAt:"2026-10-09T08:30:00Z",
});
const matured=await buildDecisionOutcomeSnapshotV0_1({
 ...outcomeBase,sessions:[session(1,"2026-09-30"),
 session(2,"2026-10-01",{open:102,high:109,low:99,close:108})],
 updatedAt:"2026-10-09T09:00:00Z",
});
assert.equal(matured.simulatedExecution.executionHash,sim.executionHash);
assert.equal(matured.simulatedExecution.costModel.costModelVersion,"COST-001");
assert.equal(matured.simulatedExecution.taxRuleId,"TW-TAX-001");
assert.equal(validateMonotonicOutcomeUpdateV0_1(
 toS2OutcomeRowV0_1(early),toS2OutcomeRowV0_1(matured)).updateAllowed,true);
const mutatedCost=JSON.parse(JSON.stringify(matured));
mutatedCost.simulatedExecution.costModel.transactionTaxRate=0.05;
const costViolation=validateMonotonicOutcomeUpdateV0_1(
 toS2OutcomeRowV0_1(early),{
 ...toS2OutcomeRowV0_1(matured),outcome_json:JSON.stringify(mutatedCost),
});
assert.ok(costViolation.blockers.includes("SIMULATED_EXECUTION_ASSUMPTION_REVISION"));
const mutatedExecution=JSON.parse(JSON.stringify(matured));
mutatedExecution.simulatedExecution.executionHash="f".repeat(64);
const hashViolation=validateMonotonicOutcomeUpdateV0_1(
 toS2OutcomeRowV0_1(early),{
 ...toS2OutcomeRowV0_1(matured),outcome_json:JSON.stringify(mutatedExecution),
});
assert.ok(hashViolation.blockers.includes("SIMULATED_EXECUTION_ASSUMPTION_REVISION"));
await assert.rejects(()=>buildDecisionOutcomeSnapshotV0_1({
 ...outcomeBase,
 simulatedExecution:{...projection,costModelVersion:"COST-FAKE"},
 sessions:[],updatedAt:"2026-10-09T09:00:00Z",
}),/SIMULATED_COST_LINEAGE_MISMATCH/);
await assert.rejects(()=>buildDecisionOutcomeSnapshotV0_1({
 ...outcomeBase,
 simulatedExecution:{...projection,executionHash:"bad"},
 sessions:[],updatedAt:"2026-10-09T09:00:00Z",
}),/executionHash must be SHA256 hex/);
assert.throws(()=>toOutcomeSimulatedExecutionV0_1({
 ...sim,executionHash:"bad",
}),/executionHash must be SHA256 hex/);
console.log("System2 CORR-012 execution/cost immutable lineage projection tests passed");
