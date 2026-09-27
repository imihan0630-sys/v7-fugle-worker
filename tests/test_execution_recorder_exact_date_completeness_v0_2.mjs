import assert from "node:assert/strict";
import {classifyPlanDayNoBuyCoverage} from "../research/execution_recorder_exact_date_completeness_v0_2.mjs";

const date="2026-09-29",symbol="3105";
const schedule=Array.from({length:265},(_,i)=>i);
function receipt(t,extra={}){
  return {
    tradeDate:date,scheduledTime:t,runId:"run-"+t,recordedAt:"2026-09-29T05:00:00Z",
    expectedSymbols:[symbol],symbolStatuses:{[symbol]:{ok:true}},
    expectedEventKeys:[],attemptedCount:0,newlyStoredCount:0,alreadyPresentVerifiedCount:0,
    failedCount:0,skippedByReason:{},failOpen:false,errorClass:null,...extra
  };
}
function rows(keys=[]){
  return {
    requestedTradeDate:date,totalMatchingRows:keys.length,returnedRows:keys.length,
    hasMore:false,truncated:false,paginationComplete:true,eventKeys:keys,
    perEventCounts:{},perSymbolCounts:{[symbol]:keys.length}
  };
}
const openKey=date+"|"+symbol+"|OPEN_BASELINE|OPEN_BASELINE";
const completeReceipts=schedule.map(t=>receipt(t));
completeReceipts[0]=receipt(0,{expectedEventKeys:[openKey],attemptedCount:1,newlyStoredCount:1});

let x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:completeReceipts,exactDateRows:rows([openKey]),positiveBuySignals:[]
});
assert.equal(x.status,"COMPLETE_NO_BUY");
assert.equal(x.noBuyEligible,true);
assert.equal(x.coveredRuns,265);

// One missing scheduled receipt => cannot call NO-BUY.
x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:completeReceipts.slice(1),exactDateRows:rows([openKey]),positiveBuySignals:[]
});
assert.equal(x.noBuyEligible,false);
assert.ok(x.reasons.includes("MISSING_SCHEDULED_RUN_RECEIPT"));

// A per-symbol monitor failure fails closed.
const failed=completeReceipts.map(r=>structuredClone(r));
failed[50]={...failed[50],symbolStatuses:{[symbol]:{ok:false}},failedCount:1,attemptedCount:1,expectedEventKeys:["ERR|50"]};
x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:failed,exactDateRows:rows([openKey]),positiveBuySignals:[]
});
assert.equal(x.noBuyEligible,false);
assert.equal(x.status,"INCOMPLETE");

// Bounded/truncated exact-date response is UNKNOWN even with run receipts.
x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:completeReceipts,
 exactDateRows:{...rows([openKey]),paginationComplete:false,hasMore:true,truncated:true},
 positiveBuySignals:[]
});
assert.equal(x.noBuyEligible,false);
assert.ok(x.reasons.includes("EXACT_DATE_ROWS_NOT_COMPLETE"));

// Positive V8 BUY signal wins over NO-BUY classification.
x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:completeReceipts,exactDateRows:rows([openKey]),
 positiveBuySignals:[{tradeDate:date,symbol,signalType:"BUY",marketPrice:1000}]
});
assert.equal(x.status,"BUY_OBSERVED_OR_EXPECTED");
assert.equal(x.noBuyEligible,false);

// Expected BUY event key is positive signal-context evidence even if separate signal journal input is omitted.
const buyKey=date+"|"+symbol+"|FORMAL_SIGNAL_OBSERVED|"+date+":"+symbol+":NONE:BUY:episode-1";
const withBuy=completeReceipts.map(r=>structuredClone(r));
withBuy[100]=receipt(100,{expectedEventKeys:[buyKey],attemptedCount:1,newlyStoredCount:1});
x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:withBuy,exactDateRows:rows([openKey,buyKey]),positiveBuySignals:[]
});
assert.equal(x.status,"BUY_OBSERVED_OR_EXPECTED");
assert.equal(x.complete,true);

// INSERT OR IGNORE replay is acceptable only as verified already-present, not generic skipped.
const replay=completeReceipts.map(r=>structuredClone(r));
replay[0]=receipt(0,{expectedEventKeys:[openKey],attemptedCount:1,newlyStoredCount:0,alreadyPresentVerifiedCount:1});
x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:replay,exactDateRows:rows([openKey]),positiveBuySignals:[]
});
assert.equal(x.status,"COMPLETE_NO_BUY");

// Generic skipped work is not accepted as complete.
const skipped=completeReceipts.map(r=>structuredClone(r));
skipped[20]=receipt(20,{expectedEventKeys:["K20"],attemptedCount:1,skippedByReason:{RESULT_NOT_OK:1}});
x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:skipped,exactDateRows:rows([openKey]),positiveBuySignals:[]
});
assert.equal(x.noBuyEligible,false);
assert.ok(x.reasons.includes("RUN_SKIPPED_RESULT_NOT_OK"));

// Zero rows without complete run receipts remains UNKNOWN.
x=classifyPlanDayNoBuyCoverage({
 tradeDate:date,planSymbol:symbol,expectedScheduledTimes:schedule,
 runReceipts:[],exactDateRows:rows([]),positiveBuySignals:[]
});
assert.equal(x.noBuyEligible,false);
assert.notEqual(x.status,"COMPLETE_NO_BUY");

console.log(JSON.stringify({
 ok:true,
 version:"EXECUTION_RECORDER_EXACT_DATE_COMPLETENESS_PROPOSAL_V0_2",
 cases:9,
 invariant:"missing BUY is NO-BUY only after exact-date row completeness + all 265 run receipts + per-symbol success + expected-event-key reconciliation"
},null,2));
