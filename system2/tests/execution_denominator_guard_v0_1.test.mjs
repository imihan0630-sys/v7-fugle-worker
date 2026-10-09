import assert from "node:assert/strict";
import { classifyS2ExecutionDenominatorV0_1 } from "../runtime/execution_denominator_guard_v0_1.mjs";
import { simulateTaiwanLongDailyPlanV0_1 } from "../runtime/execution_simulator_v0_1.mjs";

const inputs=[
  null,
  {state:"NO_FILL",proofCompleteNoFill:false,noFillDenominatorEligible:false},
  {state:"NO_FILL",proofCompleteNoFill:true,noFillDenominatorEligible:true,
    calendarProof:"VERIFIED",sourceReceiptVerified:true},
  {state:"CLOSED",realizedReturnAfterCost:0.35,performanceEligible:true,blockedObservations:[]},
  {state:"CLOSED",realizedReturnAfterCost:-0.3,performanceEligible:true,
    blockedObservations:[{reason:"UNKNOWN_BAR"}]},
  {state:"DATA_INCOMPLETE",fillsSuppressedDueToUnknown:true,
    blockedObservations:[{reason:"UNKNOWN_BAR"}]},
  {state:"ENTRY_PENDING"},
  {state:"AMBIGUOUS"},
];
for(const simulation of inputs){
  const classified=classifyS2ExecutionDenominatorV0_1(simulation);
  assert.equal(classified.denominatorEligible,false);
  assert.equal(classified.noFillDenominatorEligible,false);
  assert.equal(classified.executionReturnEligible,false);
  assert.equal(classified.confirmedTriggeredCount,null);
  assert.equal(classified.confirmedNoFillCount,null);
  assert.equal(classified.confirmedProfitableCount,null);
  assert.equal(classified.certifiedTradeReturn,null);
  assert.ok(classified.reasons.length>0);
  assert.equal(Object.isFrozen(classified),true);
}
assert.equal(classifyS2ExecutionDenominatorV0_1(inputs[1]).classification,"NO_FILL_NOT_CERTIFIED");
assert.equal(classifyS2ExecutionDenominatorV0_1(inputs[2]).classification,"NO_FILL_NOT_CERTIFIED");
assert.ok(classifyS2ExecutionDenominatorV0_1(inputs[2]).reasons.includes("CALLER_NO_FILL_CLAIM_NOT_INDEPENDENT_PROOF"));
assert.equal(classifyS2ExecutionDenominatorV0_1(inputs[3]).classification,"MODELED_CLOSED_NOT_CERTIFIED");
assert.equal(classifyS2ExecutionDenominatorV0_1(inputs[5]).classification,"UNKNOWN_OR_UNRESOLVED_INTERVAL");
assert.ok(classifyS2ExecutionDenominatorV0_1(inputs[5]).reasons.includes("TENTATIVE_FILLS_SUPPRESSED"));
assert.throws(()=>classifyS2ExecutionDenominatorV0_1({state:""}),/state is required/);
assert.throws(()=>classifyS2ExecutionDenominatorV0_1("CLOSED"),/object or null/);

const p={
  simOrderId:"CORR013-D18",entryFillObservationId:"CORR013-D18-E",
  exitFillObservationId:"CORR013-D18-X",decisionId:"CORR013-D18-D",
  strategyId:"SHORT_MOMENTUM",strategyVersion:"SHADOW_ONLY",symbol:"2330",
  decisionMarketDate:"2026-09-29",decisionTimestamp:"2026-09-29T07:30:00Z",
  earliestEligibleMarketDate:"2026-09-30",orderType:"BUY_STOP",triggerPrice:100,
  requestedShares:1000,stopPrice:95,targetPrice:108,maxHoldingSessions:5,
  entryValiditySessions:2,priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
  costModel:{costModelVersion:"TEST",taxRuleId:"TEST",commissionRate:0.001,
    minimumCommission:1,transactionTaxRate:0.003,entrySlippageRate:0.001,
    exitSlippageRate:0.001},simulatedAt:"2026-10-09T09:00:00Z",
};
const session=(sessionNumber,marketDate,extra={})=>({
  sessionNumber,marketDate,availableAt:"2026-10-09T08:00:00Z",
  priceSpace:"ADJUSTED",tradingState:"NORMAL",executableLiquidity:"AVAILABLE",
  limitState:"NONE",volumeShares:100000,sourceId:"TEST_ONLY",
  open:90,high:92,low:89,close:91,...extra,
});
const modeledNoFill=await simulateTaiwanLongDailyPlanV0_1({
  ...p,sessions:[session(1,"2026-09-30"),session(2,"2026-10-01")],
});
assert.equal(modeledNoFill.state,"NO_FILL");
const noFillGate=classifyS2ExecutionDenominatorV0_1(modeledNoFill);
assert.equal(noFillGate.noFillDenominatorEligible,false);
const incomplete=await simulateTaiwanLongDailyPlanV0_1({...p,
  sessions:[session(1,"2026-09-30"),
    session(2,"2026-10-01",{open:null,high:null,low:null,close:null})],
});
assert.equal(incomplete.state,"DATA_INCOMPLETE");
assert.equal(classifyS2ExecutionDenominatorV0_1(incomplete).denominatorEligible,false);

console.log("System2 CORR-013 execution denominator firewall rejects all unproven NO_FILL / PnL credit");
