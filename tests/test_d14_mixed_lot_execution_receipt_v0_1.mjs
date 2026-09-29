import assert from "node:assert/strict";
import {validateMixedLotExecutionReceipt} from "../research/d14_mixed_lot_execution_receipt_v0_1.mjs";

const ts=t=>`2026-09-30T${t}+08:00`;

function baseReceipt(){
  return {
    parentActionId:"act-1148",
    symbol:"TEST",
    action:"BUY",
    intendedQuantity:1148,
    decisionKnownAt:ts("09:03:00"),
    legs:[
      {
        lotType:"REGULAR_LOT",
        mechanism:"REGULAR_CONTINUOUS",
        eligibilityModel:"CONTINUOUS_WITH_BLOCK_INTERVALS",
        mechanismRule:{
          ruleVersion:"TWSE_REGULAR_INTRADAY_20260930",
          sourceRef:"TWSE_OPERATING_RULES",
          effectiveFrom:"2026-01-01T00:00:00+08:00",
          effectiveTo:null
        },
        intendedQty:1000,
        mechanismEligibleAt:ts("09:00:00"),
        mechanismEligibilityEvidence:{sourceRef:"TWSE:REGULAR_SESSION",observedAt:ts("08:59:59"),state:"NORMAL"},
        mechanismBlockedIntervals:[],
        benchmark:{lotType:"REGULAR_LOT",sourceRef:"REGULAR_L1",observedAt:ts("09:03:00"),price:100},
        orderAttempts:[{
          attemptId:"reg-1",
          requestedQty:1000,
          submitAt:ts("09:03:05"),
          submitEvidence:{sourceRef:"BROKER_ACK_REG_1"},
          terminalState:"FILLED",
          terminalAt:ts("09:03:07"),
          fills:[{
            fillId:"reg-fill-1",
            evidenceType:"BROKER_CONFIRMED_FILL",
            sourceRef:"BROKER_FILL_REG_1",
            fillAt:ts("09:03:06"),
            qty:1000,
            price:100.1
          }]
        }]
      },
      {
        lotType:"INTRADAY_ODD_LOT",
        mechanism:"INTRADAY_ODD_LOT_CALL_AUCTION",
        eligibilityModel:"DISCRETE_MATCH_OPPORTUNITIES",
        mechanismRule:{
          ruleVersion:"TWSE_ODD_LOT_0910_5SEC_PRE_20261207",
          sourceRef:"TWSE_ODD_LOT_ARTICLE_8",
          effectiveFrom:"2024-12-16T00:00:00+08:00",
          effectiveTo:"2026-12-07T00:00:00+08:00"
        },
        intendedQty:148,
        mechanismEligibleAt:ts("09:10:00"),
        mechanismEligibilityEvidence:{sourceRef:"TWSE:ODD_LOT_FIRST_AUCTION",observedAt:ts("09:00:00"),state:"NORMAL"},
        mechanismBlockedIntervals:[],
        matchingOpportunities:[{opportunityId:"odd-op-1",matchAt:ts("09:10:00"),sourceRef:"TWSE:ODD_MATCH:091000",computedExecutionPrice:100.2}],
        benchmark:{lotType:"INTRADAY_ODD_LOT",sourceRef:"ODD_LOT_L1",observedAt:ts("09:03:00"),price:100.2},
        orderAttempts:[{
          attemptId:"odd-1",
          requestedQty:148,
          orderType:"LIMIT",
          limitPrice:101,
          submitAt:ts("09:03:10"),
          submitEvidence:{sourceRef:"BROKER_ACK_ODD_1"},
          terminalState:"FILLED",
          terminalAt:ts("09:10:01"),
          fills:[{
            fillId:"odd-fill-1",
            evidenceType:"BROKER_CONFIRMED_FILL",
            sourceRef:"BROKER_FILL_ODD_1",
            fillAt:ts("09:10:00"),
            qty:148,
            price:100.2
          }]
        }]
      }
    ]
  };
}

let x=validateMixedLotExecutionReceipt(baseReceipt());
assert.equal(x.status,"VALID_MIXED_LOT_EXECUTION_RECEIPT");
assert.equal(x.valid,true);
assert.equal(x.filledQty,1148);
assert.equal(x.parentFillStatus,"FILLED");
const reg=x.legs.REGULAR_LOT.fillDiagnostics[0];
const odd=x.legs.INTRADAY_ODD_LOT.fillDiagnostics[0];
assert.equal(reg.rawLatencyMs,6000);
assert.equal(reg.preEligibilityWaitMs,0);
assert.equal(reg.decisionToSubmitLatencyMs,5000);
assert.equal(reg.submitToFillLatencyMs,1000);
assert.equal(odd.rawLatencyMs,420000);
assert.equal(odd.preEligibilityWaitMs,420000);
assert.equal(odd.scalarPostEligibilityLatencyMs,null);
assert.equal(odd.eligibleExposureToFillMs,null);
assert.equal(odd.matchingOpportunityCountFromDecisionToFill,1);
assert.equal(odd.matchingOpportunityCountAfterSubmitToFill,1);
assert.equal(odd.priorSubmittedOpportunitiesWithoutFill,0);
assert.equal(odd.priceCrossingOpportunitiesThroughFill,1);
assert.equal(odd.nonCrossingOpportunitiesThroughFill,0);
assert.equal(odd.unknownMarketabilityOpportunitiesThroughFill,0);
assert.equal(odd.marketabilityAttributionReady,true);
assert.equal(odd.submitToFillLatencyMs,410000);

// Intermittent eligibility falsifies scalar-post-eligibility as sufficient.
const interrupted=baseReceipt();
const oddLeg=interrupted.legs[1];
oddLeg.mechanismEligibilityEvidence.state="INTERRUPTED";
oddLeg.mechanismBlockedIntervals=[{
  startAt:ts("09:10:20"),
  endAt:ts("09:12:20"),
  reason:"VOLATILITY_INTERRUPTION",
  sourceRef:"TWSE:VI:TEST",
  observedAt:ts("09:10:19")
}];
oddLeg.matchingOpportunities=[
 {opportunityId:"odd-op-1",matchAt:ts("09:10:00"),sourceRef:"TWSE:ODD_MATCH:091000",computedExecutionPrice:100.2},
 {opportunityId:"odd-op-2",matchAt:ts("09:10:05"),sourceRef:"TWSE:ODD_MATCH:091005",computedExecutionPrice:100.2},
 {opportunityId:"odd-op-3",matchAt:ts("09:10:10"),sourceRef:"TWSE:ODD_MATCH:091010",computedExecutionPrice:100.2},
 {opportunityId:"odd-op-4",matchAt:ts("09:10:15"),sourceRef:"TWSE:ODD_MATCH:091015",computedExecutionPrice:100.2},
 {opportunityId:"odd-op-5",matchAt:ts("09:12:20"),sourceRef:"TWSE:ODD_MATCH:091220",computedExecutionPrice:100.2},
 {opportunityId:"odd-op-6",matchAt:ts("09:12:25"),sourceRef:"TWSE:ODD_MATCH:091225",computedExecutionPrice:100.2}
];
oddLeg.orderAttempts[0].terminalAt=ts("09:12:26");
oddLeg.orderAttempts[0].fills[0].fillAt=ts("09:12:25");
x=validateMixedLotExecutionReceipt(interrupted);
assert.equal(x.valid,true);
const io=x.legs.INTRADAY_ODD_LOT.fillDiagnostics[0];
assert.equal(io.rawLatencyMs,565000);
assert.equal(io.preEligibilityWaitMs,420000);
assert.equal(io.scalarPostEligibilityLatencyMs,null);
assert.equal(io.mechanismBlockedWaitAfterEligibilityMs,120000);
assert.equal(io.eligibleExposureToFillMs,null);
assert.equal(io.matchingOpportunityCountFromDecisionToFill,6);
assert.equal(io.matchingOpportunityCountAfterSubmitToFill,6);
assert.equal(io.priorSubmittedOpportunitiesWithoutFill,5);
assert.equal(io.priceCrossingOpportunitiesThroughFill,6);
assert.equal(io.nonCrossingOpportunitiesThroughFill,0);
assert.equal(io.marketabilityAttributionReady,true);



// An unfilled auction can be explained by a non-crossing limit price.
const nonCrossing=baseReceipt();
nonCrossing.legs[1].matchingOpportunities=[
  {opportunityId:"odd-op-1",matchAt:ts("09:10:00"),sourceRef:"TWSE:ODD_MATCH:091000",computedExecutionPrice:102},
  {opportunityId:"odd-op-2",matchAt:ts("09:10:05"),sourceRef:"TWSE:ODD_MATCH:091005",computedExecutionPrice:100.2}
];
nonCrossing.legs[1].orderAttempts[0].terminalAt=ts("09:10:06");
nonCrossing.legs[1].orderAttempts[0].fills[0].fillAt=ts("09:10:05");
x=validateMixedLotExecutionReceipt(nonCrossing);
assert.equal(x.valid,true);
const nc=x.legs.INTRADAY_ODD_LOT.fillDiagnostics[0];
assert.equal(nc.priorSubmittedOpportunitiesWithoutFill,1);
assert.equal(nc.nonCrossingOpportunitiesThroughFill,1);
assert.equal(nc.priceCrossingOpportunitiesThroughFill,1);
assert.equal(nc.opportunityMarketability[0].state,"PRICE_NOT_CROSSING");
assert.equal(nc.opportunityMarketability[1].state,"PRICE_CROSSING_QUEUE_OR_VOLUME_UNRESOLVED");

// A future rule version cannot be back-applied to a September decision.
const futureRule=baseReceipt();
futureRule.legs[1].mechanismRule={
  ruleVersion:"TWSE_ODD_LOT_0900_5SEC_FROM_20261207",
  sourceRef:"TWSE_ODD_LOT_20260820_AMENDMENT",
  effectiveFrom:"2026-12-07T00:00:00+08:00",
  effectiveTo:null
};
x=validateMixedLotExecutionReceipt(futureRule);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["MECHANISM_RULE_NOT_EFFECTIVE_AT_DECISION"]);

// Benchmark lot mismatch must fail closed.
const badBench=baseReceipt();
badBench.legs[1].benchmark.lotType="REGULAR_LOT";
x=validateMixedLotExecutionReceipt(badBench);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["BENCHMARK_LOT_MISMATCH"]);

// Simulated pre-first-auction disclosure is not fill evidence.
const simulated=baseReceipt();
simulated.legs[1].orderAttempts[0].fills[0].evidenceType="SIMULATED_DISCLOSURE";
x=validateMixedLotExecutionReceipt(simulated);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["NON_CONFIRMED_FILL_EVIDENCE"]);

// Parent/leg quantity mismatch must fail.
const qtyMismatch=baseReceipt();
qtyMismatch.legs[1].intendedQty=147;
x=validateMixedLotExecutionReceipt(qtyMismatch);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["PARENT_QUANTITY_MISMATCH"]);

// Fill inside an evidenced blocked interval is impossible.
const blockedFill=baseReceipt();
blockedFill.legs[1].mechanismEligibilityEvidence.state="INTERRUPTED";
blockedFill.legs[1].mechanismBlockedIntervals=[{
  startAt:ts("09:10:20"),endAt:ts("09:12:20"),reason:"VOLATILITY_INTERRUPTION",
  sourceRef:"TWSE:VI:TEST",observedAt:ts("09:10:19")
}];
blockedFill.legs[1].matchingOpportunities=[
 {opportunityId:"odd-op-1",matchAt:ts("09:10:00"),sourceRef:"TWSE:ODD_MATCH:091000",computedExecutionPrice:100.2},
 {opportunityId:"odd-op-bad",matchAt:ts("09:11:00"),sourceRef:"TWSE:ODD_MATCH:091100",computedExecutionPrice:100.2}
];
blockedFill.legs[1].orderAttempts[0].terminalAt=ts("09:11:01");
blockedFill.legs[1].orderAttempts[0].fills[0].fillAt=ts("09:11:00");
x=validateMixedLotExecutionReceipt(blockedFill);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["FILL_INSIDE_MECHANISM_BLOCK"]);

// Valid replacement chain counts fills once.
const repl=baseReceipt();
repl.legs[0].orderAttempts=[
  {
    attemptId:"reg-1",requestedQty:1000,submitAt:ts("09:03:05"),
    submitEvidence:{sourceRef:"BROKER_ACK_REG_1"},terminalState:"REPLACED",terminalAt:ts("09:03:06"),fills:[]
  },
  {
    attemptId:"reg-2",replacesAttemptId:"reg-1",requestedQty:1000,submitAt:ts("09:03:06"),
    submitEvidence:{sourceRef:"BROKER_ACK_REG_2"},terminalState:"FILLED",terminalAt:ts("09:03:08"),
    fills:[{fillId:"reg-fill-2",evidenceType:"BROKER_CONFIRMED_FILL",sourceRef:"BROKER_FILL_REG_2",fillAt:ts("09:03:07"),qty:1000,price:100.1}]
  }
];
x=validateMixedLotExecutionReceipt(repl);
assert.equal(x.valid,true);
assert.equal(x.legs.REGULAR_LOT.filledQty,1000);

// Overlapping replacement attempts fail closed.
const overlap=structuredClone(repl);
overlap.legs[0].orderAttempts[1].submitAt=ts("09:03:05");
x=validateMixedLotExecutionReceipt(overlap);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["OVERLAPPING_REPLACEMENT_ATTEMPTS"]);

// Duplicate fill ids across lot legs fail closed.
const dup=baseReceipt();
dup.legs[1].orderAttempts[0].fills[0].fillId="reg-fill-1";
x=validateMixedLotExecutionReceipt(dup);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["CROSS_LEG_DUPLICATE_FILL_ID"]);

// Interrupted state requires an explicit blocked interval.
const missingBlock=baseReceipt();
missingBlock.legs[1].mechanismEligibilityEvidence.state="INTERRUPTED";
x=validateMixedLotExecutionReceipt(missingBlock);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["INTERRUPTED_STATE_WITHOUT_BLOCK_INTERVAL"]);

// Benchmark created after submission is post-hoc and fails PIT.
const lateBench=baseReceipt();
lateBench.legs[1].benchmark.observedAt=ts("09:03:11");
x=validateMixedLotExecutionReceipt(lateBench);
assert.equal(x.valid,false);
assert.deepEqual(x.reasons,["BENCHMARK_AFTER_SUBMISSION"]);

console.log(JSON.stringify({
  ok:true,
  contract:"D14_MIXED_LOT_EXECUTION_RECEIPT_V0_1",
  keyFalsification:"four scalar clocks are insufficient under intermittent mechanism eligibility; evidenced blocked intervals are required",
  normalOddLot:{rawLatencyMs:odd.rawLatencyMs,preEligibilityWaitMs:odd.preEligibilityWaitMs,eligibleExposureToFillMs:odd.eligibleExposureToFillMs},
  interruptedOddLot:{rawLatencyMs:io.rawLatencyMs,matchingOpportunityCountFromDecisionToFill:io.matchingOpportunityCountFromDecisionToFill,mechanismBlockedWaitAfterEligibilityMs:io.mechanismBlockedWaitAfterEligibilityMs,priorSubmittedOpportunitiesWithoutFill:io.priorSubmittedOpportunitiesWithoutFill}
},null,2));
