import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { simulateTaiwanLongDailyPlanV0_1 } from "../runtime/execution_simulator_v0_1.mjs";
import { classifyS2ExecutionDenominatorV0_1 } from "../runtime/execution_denominator_guard_v0_1.mjs";

// H05-C3: deterministic ADVERSARIAL execution/denominator regression only.
// Synthetic daily bars cannot certify TWSE/TPEx session calendars, real PIT,
// broker liquidity or actual trades. CORR-013 stays OPEN after this suite.
const models={
  costModelVersion:"H05-EXTREME-FIXTURE-V1",taxRuleId:"TW-STOCK-TEST-SELL",
  commissionRate:0.001,minimumCommission:1,
  transactionTaxRate:0.003,entrySlippageRate:0.01,exitSlippageRate:0.01,
};
const base={
  simOrderId:"H05-ORDER",entryFillObservationId:"H05-ENTRY",
  exitFillObservationId:"H05-EXIT",decisionId:"H05-DECISION",
  strategyId:"SHORT_MOMENTUM",strategyVersion:"H05-NEGATIVE-V1",
  symbol:"2330",decisionMarketDate:"2026-09-29",
  decisionTimestamp:"2026-09-29T07:30:00Z",
  earliestEligibleMarketDate:"2026-09-30",orderType:"BUY_STOP",
  triggerPrice:100,requestedShares:1000,stopPrice:95,targetPrice:108,
  maxHoldingSessions:5,entryValiditySessions:2,
  priceSpace:"ADJUSTED",corporateActionState:"ADJUSTED",
  costModel:models,simulatedAt:"2026-10-09T09:00:00Z",
};
const bar=(num,date,ohlc,flags={})=>({
  sessionNumber:num,marketDate:date,availableAt:date+"T08:30:00Z",
  priceSpace:"ADJUSTED",tradingState:"NORMAL",
  executableLiquidity:"AVAILABLE",limitState:"NONE",
  volumeShares:5_000_000,sourceId:"H05-SYNTHETIC-NOT-PIT",...ohlc,...flags,
});
const day1=(ohlc={open:98,high:102,low:97,close:101},flags={})=>
  bar(1,"2026-09-30",ohlc,flags);
const day2=(ohlc,flags={})=>bar(2,"2026-10-01",ohlc,flags);
let tested=0;
async function simulate(id,sessions,options={}) {
  const simulation=await simulateTaiwanLongDailyPlanV0_1({
    ...base,simOrderId:"H05-"+id,entryFillObservationId:"E-"+id,
    exitFillObservationId:"X-"+id,sessions,...options,
  });
  const denominator=classifyS2ExecutionDenominatorV0_1(simulation);
  // Stronger than checking just simulator.performanceEligible; a synthetic
  // CLOSED return is never an independently PIT-certified trade.
  assert.equal(denominator.denominatorEligible,false,id);
  assert.equal(denominator.noFillDenominatorEligible,false,id);
  assert.equal(denominator.executionReturnEligible,false,id);
  assert.equal(denominator.certifiedTradeReturn,null,id);
  assert.equal(denominator.confirmedProfitableCount,null,id);
  assert.equal(denominator.confirmedNoFillCount,null,id);
  assert.equal(simulation.proofCompleteNoFill,false,id);
  assert.equal(simulation.noFillDenominatorEligible,false,id);
  assert.equal(simulation.calendarProof,"NO_INDEPENDENT_OFFICIAL_CALENDAR_RECEIPT",id);
  const {executionHash,...body}=simulation;
  assert.equal(executionHash,await sha256Hex(body),id+": execution source hash");
  tested++;
  return simulation;
}
// 1. Same daily bar touches entry, stop and target. Unknown intraday
// sequencing must stay ambiguous even with attractive target-first branch.
const sameBar=await simulate("ENTRY_STOP_TARGET_SAME_BAR",[
  day1({open:102,high:110,low:94,close:103}),
]);
assert.equal(sameBar.state,"AMBIGUOUS");
assert.equal(sameBar.ambiguityReason,"ENTRY_AND_EXIT_LEVEL_OBSERVED_ON_SAME_DAILY_BAR");
assert.deepEqual(sameBar.possibleOutcomes.map(x=>x.path),["STOP_FIRST","TARGET_FIRST"]);
assert.equal(sameBar.realizedReturnAfterCost,null);
assert.equal(sameBar.performanceEligible,false);

// 2. Post-entry daily bar touches BOTH stop and target: no favorable ordering.
const laterSameBar=await simulate("LATER_STOP_TARGET_SAME_BAR",[
  day1(),day2({open:100,high:112,low:93,close:103}),
]);
assert.equal(laterSameBar.state,"AMBIGUOUS");
assert.equal(laterSameBar.ambiguityReason,"STOP_AND_TARGET_TOUCHED_SAME_DAILY_BAR");
assert.equal(laterSameBar.realizedReturnAfterCost,null);
assert.equal(laterSameBar.performanceEligible,false);

// 3. Even stop-only contact on ENTRY daily bar is not timed proof of
// entry-before-exit; conservative ambiguity is mandatory.
const sameBarStop=await simulate("ENTRY_SAME_BAR_STOP",[
  day1({open:98,high:103,low:93,close:101}),
]);
assert.equal(sameBarStop.state,"AMBIGUOUS");
assert.equal(sameBarStop.performanceEligible,false);

// 4. Gap through stop must NOT be awarded ideal stop price.
const gapStop=await simulate("GAP_THROUGH_STOP",[
  day1(),day2({open:89,high:94,low:88,close:92}),
]);
assert.equal(gapStop.state,"CLOSED");
assert.equal(gapStop.exitFill.reason,"STOP_GAP");
assert.equal(gapStop.exitFill.rawFillPrice,89);
assert.ok(gapStop.exitFill.rawFillPrice<base.stopPrice);
assert.ok(gapStop.realizedReturnAfterCost<0);
assert.ok(gapStop.exitFill.transactionTax>0);

// 5. Gap above target: model open price but still not certified return.
const gapTarget=await simulate("GAP_TARGET",[
  day1(),day2({open:111,high:114,low:109,close:112}),
]);
assert.equal(gapTarget.state,"CLOSED");
assert.equal(gapTarget.exitFill.reason,"TARGET_GAP");
assert.equal(gapTarget.exitFill.rawFillPrice,111);
assert.equal(gapTarget.exitFill.fillQuality,"FILLED_GAP");

// 6. Buy trigger touched on LOCKED_UP day without executable liquidity;
// unfilled later bar cannot retroactively certify a clean NO_FILL.
const lockedBuy=await simulate("LIMIT_UP_ENTRY_BLOCK",[
  day1({open:105,high:105,low:105,close:105},{
    officialLimitUp:105,limitState:"LOCKED_UP",executableLiquidity:"UNAVAILABLE",
  }),day2({open:98,high:99,low:96,close:97}),
]);
assert.equal(lockedBuy.state,"DATA_INCOMPLETE");
assert.equal(lockedBuy.fillQuality,"DATA_UNKNOWN");
assert.ok(lockedBuy.blockedObservations.some(x=>x.fillQuality==="LIMIT_BLOCKED"));
assert.equal(lockedBuy.fills.length,0);

// 7. Halt on touched-entry bar must not convert into a non-touch fill.
const haltedBuy=await simulate("HALTED_ENTRY_BLOCK",[
  day1({open:101,high:104,low:98,close:102},{tradingState:"HALTED"}),
  day2({open:98,high:99,low:96,close:97}),
]);
assert.equal(haltedBuy.state,"DATA_INCOMPLETE");
assert.ok(haltedBuy.blockedObservations.some(x=>x.fillQuality==="HALT_BLOCKED"));
assert.equal(haltedBuy.fills.length,0);

// 8. SELL side LOCKED_DOWN: stop touch alone cannot prove executable exit.
const lockedSell=await simulate("LIMIT_DOWN_EXIT_BLOCK",[
  day1(),day2({open:94,high:94,low:94,close:94},{
    officialLimitDown:94,executableLiquidity:"UNAVAILABLE",limitState:"LOCKED_DOWN",
  }),
]);
assert.equal(lockedSell.state,"ENTRY_FILLED_OPEN");
assert.equal(lockedSell.exitFill,null);
assert.ok(lockedSell.blockedObservations.some(x=>x.fillQuality==="LIMIT_BLOCKED" && x.phase==="EXIT"));

// 9. Suspended SELL day must not become a closed winning or losing fill.
const suspendedSell=await simulate("SUSPENDED_EXIT_BLOCK",[
  day1(),day2({open:93,high:96,low:92,close:94},{tradingState:"SUSPENDED"}),
]);
assert.equal(suspendedSell.state,"ENTRY_FILLED_OPEN");
assert.equal(suspendedSell.exitFill,null);
assert.ok(suspendedSell.blockedObservations.some(x=>x.fillQuality==="HALT_BLOCKED"));

// 10. Unknown entry OHLC before expiry cannot become a real no-fill denominator.
const unknownEntry=await simulate("ENTRY_UNKNOWN_OHLC",[
  day1({open:98,high:null,low:96,close:97}),
  day2({open:98,high:99,low:96,close:97}),
]);
assert.equal(unknownEntry.state,"DATA_INCOMPLETE");
assert.equal(unknownEntry.realizedReturnAfterCost,null);

// 11. Synthetic no-touch is NO_FILL at model-level but NOT verified no-fill.
const modelNoFill=await simulate("SYNTHETIC_NO_TOUCH",[
  day1({open:98,high:99,low:96,close:97}),
  day2({open:98,high:99,low:96,close:97}),
]);
assert.equal(modelNoFill.state,"NO_FILL");
assert.equal(classifyS2ExecutionDenominatorV0_1(modelNoFill).classification,"NO_FILL_NOT_CERTIFIED");
assert.equal(modelNoFill.performanceEligible,false);

// 12. Slippage cannot exceed the official upper limit on buy fill.
const buyLimitClamp=await simulate("BUY_SLIPPAGE_CLAMP_LIMIT_UP",[
  day1({open:105,high:105,low:103,close:104},{officialLimitUp:105}),
]);
assert.equal(buyLimitClamp.entryFill.modeledFillPrice,105);
assert.ok(buyLimitClamp.entryFill.feasibilityFlags.includes("SLIPPAGE_CLAMPED_TO_OFFICIAL_LIMIT_UP"));
assert.equal(buyLimitClamp.state,"ENTRY_FILLED_OPEN");

// 13. Modeled sell-side slippage cannot break official lower bound, and
// securities transaction tax is sell-side only.
const sellClamp=await simulate("SELL_SLIPPAGE_CLAMP_LIMIT_DOWN",[
  day1(),day2({open:94,high:96,low:94,close:95},{officialLimitDown:94}),
]);
assert.equal(sellClamp.state,"CLOSED");
assert.equal(sellClamp.exitFill.modeledFillPrice,94);
assert.ok(sellClamp.exitFill.feasibilityFlags.includes("SLIPPAGE_CLAMPED_TO_OFFICIAL_LIMIT_DOWN"));
assert.equal(sellClamp.entryFill.transactionTax,0);
assert.ok(sellClamp.exitFill.transactionTax>0);

// 14. Corporate-action unknown prohibits all simulation results.
const caUnknown=await simulate("CORPORATE_ACTION_UNKNOWN",[
  day1(),day2({open:100,high:112,low:93,close:103}),
],{corporateActionState:"UNKNOWN"});
assert.equal(caUnknown.state,"DATA_BLOCKED");
assert.equal(caUnknown.realizedReturnAfterCost,null);
assert.equal(caUnknown.fills.length,0);

// 15-16. Physically impossible official price bounds must be rejected early.
for(const [id,row,reason] of [
  ["PRICE_ABOVE_OFFICIAL_UP",{open:100,high:111,low:99,close:100},/price exceeds officialLimitUp/],
  ["PRICE_BELOW_OFFICIAL_DOWN",{open:94,high:103,low:89,close:100},/price is below officialLimitDown/],
]) {
  await assert.rejects(()=>simulateTaiwanLongDailyPlanV0_1({
    ...base,simOrderId:"H05-INVALID-"+id,
    sessions:[day1(row,id.includes("UP")?{officialLimitUp:110}:{officialLimitDown:90})],
  }),reason);
  tested++;
}

// 17. Historical official session availability must never be post-simulation.
await assert.rejects(()=>simulateTaiwanLongDailyPlanV0_1({
  ...base,simOrderId:"H05-FUTURE-SOURCE",
  sessions:[day1(undefined,{availableAt:"2026-10-10T08:30:00Z"})],
}),/execution session is not available by simulatedAt/);
tested++;
assert.equal(tested,17);
console.log("H05_C3_EXTREME_EXECUTION_MATRIX_PASS "+JSON.stringify({
  scenarios:tested,ambiguous:3,blockedByLimitOrHalt:4,
  gapRisk:2,syntheticNoFillNotCertified:true,
  limitsAndSlippage:4,corporateActionUnknown:true,
  futureDataBlocked:true,realPITProven:false,actualTrades:0,cloudflareOperations:0,
}));
