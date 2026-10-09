import assert from "node:assert/strict";
import { simulateTaiwanLongDailyPlanV0_1, toS2SimulationFillRowsV0_1 } from "../runtime/execution_simulator_v0_1.mjs";
import { buildDecisionOutcomeSnapshotV0_1 } from "../runtime/outcome_tracker_v0_1.mjs";

const plan={
 simOrderId:"CORR013",entryFillObservationId:"CORR013-E",exitFillObservationId:"CORR013-X",
 decisionId:"CORR013-D",strategyId:"SHORT_MOMENTUM",strategyVersion:"SHADOW-CORR013",
 symbol:"2330",decisionMarketDate:"2026-09-29",
 decisionTimestamp:"2026-09-29T07:30:00Z",earliestEligibleMarketDate:"2026-09-30",
 orderType:"BUY_STOP",triggerPrice:100,requestedShares:1000,stopPrice:95,targetPrice:108,
 maxHoldingSessions:5,entryValiditySessions:2,priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
 costModel:{costModelVersion:"TEST",taxRuleId:"TEST",commissionRate:0.001,minimumCommission:1,
 transactionTaxRate:0.003,entrySlippageRate:0.001,exitSlippageRate:0.001},
 simulatedAt:"2026-10-09T09:00:00Z",
};
const bar=(sessionNumber,marketDate,extra={})=>({
 sessionNumber,marketDate,availableAt:"2026-10-09T08:00:00Z",
 priceSpace:"ADJUSTED",tradingState:"NORMAL",executableLiquidity:"AVAILABLE",limitState:"NONE",
 volumeShares:100000,sourceId:"CORR013-SYNTHETIC",open:90,high:92,low:89,close:91,...extra,
});
for(const [id,rows] of [
 ["IMPOSSIBLE_DATE",[bar(1,"2026-09-31")]],
 ["NON_PADDED_DATE",[bar(1,"2026-9-30")]],
 ["SATURDAY_NO_PROOF",[bar(1,"2026-10-03")]],
 ["DUPLICATE",[bar(1,"2026-09-30"),bar(2,"2026-09-30")]],
 ["REVERSED",[bar(1,"2026-10-01"),bar(2,"2026-09-30")]],
 ["UNKNOWN_GAP",[bar(1,"2026-09-30"),bar(2,"2026-10-08")]],
 ]) {
 await assert.rejects(()=>simulateTaiwanLongDailyPlanV0_1({
  ...plan,simOrderId:"CORR013-"+id,sessions:rows,
 }),/market date|market dates|YYYY-MM-DD|Gregorian|session proof|SESSION_GAP_UNPROVEN|OFFICIAL_SESSION_GAP_UNPROVEN|weekend/i,id);
}
for(const [id,part] of [
 ["ALL_UNKNOWN",{open:null,high:null,low:null,close:null}],
 ["HIGH_UNKNOWN",{high:null}],
 ["LOW_UNKNOWN",{low:null}],
 ]) {
 const receipt=await simulateTaiwanLongDailyPlanV0_1({
  ...plan,simOrderId:id,sessions:[bar(1,"2026-09-30"),bar(2,"2026-10-01",part)],
 });
 assert.equal(receipt.state,"DATA_INCOMPLETE",id);
 assert.equal(receipt.performanceEligible,false,id);
 assert.equal(receipt.realizedReturnAfterCost,null,id);
 assert.equal(receipt.proofCompleteNoFill,false,id);
}
const knownNonTouch=await simulateTaiwanLongDailyPlanV0_1({
 ...plan,simOrderId:"KNOWN-NO-TOUCH",sessions:[bar(1,"2026-09-30"),bar(2,"2026-10-01")],
});
assert.equal(knownNonTouch.state,"NO_FILL");
assert.equal(knownNonTouch.performanceEligible,false);
assert.equal(knownNonTouch.proofCompleteNoFill,false);
assert.equal(knownNonTouch.noFillDenominatorEligible,false);

const entered=bar(1,"2026-09-30",{open:99,high:103,low:97,close:101});
const unknownOhlc=bar(2,"2026-10-01",{open:null,high:null,low:null,close:null});
const unknownLiquidity=bar(2,"2026-10-01",{open:101,high:110,low:99,close:108,executableLiquidity:"UNKNOWN"});
const target=bar(3,"2026-10-02",{open:101,high:110,low:99,close:108});
const stop=bar(3,"2026-10-02",{open:100,high:101,low:94,close:96});
for(const [id,rows] of [
 ["UNKNOWN_BEFORE_TARGET",[entered,unknownOhlc,target]],
 ["UNKNOWN_BEFORE_STOP",[entered,unknownOhlc,stop]],
 ["UNKNOWN_LIQUIDITY_BEFORE_STOP",[entered,unknownLiquidity,stop]],
 ["UNKNOWN_ENTRY_BEFORE_LATE_FILL",[bar(1,"2026-09-30",{open:null,high:null,low:null,close:null}),
   bar(2,"2026-10-01",{open:99,high:103,low:97,close:101}),target]],
 ]) {
 const receipt=await simulateTaiwanLongDailyPlanV0_1({...plan,simOrderId:id,sessions:rows});
 assert.equal(receipt.state,"DATA_INCOMPLETE",id);
 assert.equal(receipt.performanceEligible,false,id);
 assert.equal(receipt.realizedReturnAfterCost,null,id);
 assert.ok(receipt.blockedObservations.length>0,id);
 assert.equal(receipt.fillsSuppressedDueToUnknown,true,id);
 assert.equal(receipt.fills.length,0,id);
 assert.equal(toS2SimulationFillRowsV0_1(receipt).length,0,id);
}
const clean=await simulateTaiwanLongDailyPlanV0_1({
 ...plan,simOrderId:"CLEAN-CLOSED",
 sessions:[entered,bar(2,"2026-10-01",{open:101,high:110,low:99,close:108})],
});
assert.equal(clean.state,"CLOSED");
assert.equal(clean.performanceEligible,true);
assert.equal(clean.blockedObservations.length,0);

const outcomeBase={
 decisionId:"CORR013-OUTCOME",symbol:"2330",decisionMarketDate:"2026-09-29",
 decisionTimestamp:"2026-09-29T07:30:00Z",referencePrice:100,
 entryPlan:{stopPrice:95,targets:[108]},priceSpace:"ADJUSTED",
 corporateActionState:"ADJUSTED",updatedAt:"2026-10-09T09:00:00Z",
};
const result=await buildDecisionOutcomeSnapshotV0_1({
 ...outcomeBase,sessions:[bar(1,"2026-09-30"),bar(2,"2026-10-01",{high:null})],
});
assert.equal(result.performanceEligible,false);
assert.ok(result.warnings.includes("OUTCOME_PRICE_WINDOW_INCOMPLETE"));
assert.equal(result.sessionCalendarProof,"INDEPENDENT_EXCHANGE_SESSION_CALENDAR_NOT_VERIFIED");
for(const [id,rows] of [
 ["INVALID_DATE",[bar(1,"2026-09-31")]],
 ["REVERSED",[bar(1,"2026-10-01"),bar(2,"2026-09-30")]],
 ["DUPLICATE",[bar(1,"2026-09-30"),bar(2,"2026-09-30")]],
 ["GAP",[bar(1,"2026-09-30"),bar(2,"2026-10-08")]],
]) {
 await assert.rejects(()=>buildDecisionOutcomeSnapshotV0_1({...outcomeBase,sessions:rows}),
 /Gregorian|duplicate or reversed|OFFICIAL_SESSION_GAP_UNPROVEN/,id);
}
console.log("System2 CORR-013 build negative chronology and incomplete price windows passed (partial code guard, NOT official calendar proof)");
