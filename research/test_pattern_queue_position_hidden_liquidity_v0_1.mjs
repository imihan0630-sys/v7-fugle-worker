import assert from "node:assert/strict";
import {
  classifyConservativeFill,
  validateQueueProxy,
  validateLatencyContext,
  classifyHiddenLiquidity,
  validateTiming,
  classifyExecutionMechanism,
  evidenceIdentity
} from "./pattern_queue_position_hidden_liquidity_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("QH01 low touch alone is not verified fill",()=>{
  const r=classifyConservativeFill({lowTouchedLimit:true});
  assert.equal(r.state,"TOUCHED_NOT_ENOUGH_EVIDENCE");
  assert.equal(r.verifiedFill,false);
});

t("QH02 trades at price still leave hypothetical queue unresolved",()=>{
  const r=classifyConservativeFill({lowTouchedLimit:true,tradesAtLimit:true,tradedVolumeAtLimit:1000,queueAheadProxy:500});
  assert.equal(r.state,"TRADED_AT_PRICE_QUEUE_UNRESOLVED");
  assert.equal(r.verifiedFill,false);
});

t("QH03 moving through price can create only conservative fill candidate",()=>{
  const r=classifyConservativeFill({lowTouchedLimit:true,priceMovedThroughLimit:true,tradedVolumeAtLimit:1000});
  assert.equal(r.state,"TRADED_THROUGH_CONSERVATIVE_FILL_CANDIDATE");
  assert.equal(r.verifiedFill,false);
});

t("QH04 only own-order lifecycle can verify fill",()=>{
  const r=classifyConservativeFill({ownOrderFillVerified:true});
  assert.equal(r.state,"OWN_ORDER_FILL_VERIFIED");
  assert.equal(r.verifiedFill,true);
});

t("QH05 queue proxy captured after freeze is post hoc",()=>{
  const r=validateQueueProxy({
    sourceCoverageValid:true,
    capturedAt:"2026-10-06T10:00:01+08:00",
    predictorFreezeAt:"2026-10-06T10:00:00+08:00"
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("QH06 aggregate book without order IDs remains queue proxy",()=>{
  const r=validateQueueProxy({
    sourceCoverageValid:true,
    capturedAt:"2026-10-06T09:59:59+08:00",
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    exactOrderIdsAvailable:false,
    completePerOrderSequence:false
  });
  assert.equal(r.label,"QUEUE_AHEAD_PROXY");
  assert.equal(r.exactQueueRankAllowed,false);
});

t("QH07 exact queue state requires IDs plus complete per-order sequence",()=>{
  const r=validateQueueProxy({
    sourceCoverageValid:true,
    capturedAt:"2026-10-06T09:59:59+08:00",
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    exactOrderIdsAvailable:true,
    completePerOrderSequence:true
  });
  assert.equal(r.exactQueueRankAllowed,true);
});

t("QH08 missing latency provenance stays unknown",()=>{
  const r=validateLatencyContext({
    quoteCapturedAt:"2026-10-06T09:59:59+08:00",
    decisionAt:"2026-10-06T10:00:00+08:00",
    quoteAgeKnown:false,
    latencyKnown:false
  });
  assert.equal(r.status,"LATENCY_CONTEXT_UNKNOWN");
});

t("QH09 future quote cannot enter latency baseline",()=>{
  const r=validateLatencyContext({
    quoteCapturedAt:"2026-10-06T10:00:01+08:00",
    decisionAt:"2026-10-06T10:00:00+08:00"
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("QH10 authoritative hidden-order evidence is distinct",()=>{
  const r=classifyHiddenLiquidity({authoritativeHiddenOrderEvidence:true});
  assert.equal(r.state,"OWNER_VERIFIED_HIDDEN_LIQUIDITY");
});

t("QH11 hidden-liquidity candidate needs valid sequence and multiple clues",()=>{
  const r=classifyHiddenLiquidity({
    eventSequenceValid:true,
    publicDepthSufficient:false,
    executedVolumeExceedsDisplayed:true,
    repeatedReplenishmentAfterExecution:true,
    weakPriceProgressUnderAggressiveFlow:true
  });
  assert.equal(r.state,"HIDDEN_LIQUIDITY_COMPATIBLE");
  assert.equal(r.confirmedIceberg,false);
});

t("QH12 public depth sufficient means hidden explanation unnecessary",()=>{
  const r=classifyHiddenLiquidity({eventSequenceValid:true,publicDepthSufficient:true});
  assert.equal(r.state,"PUBLIC_DEPTH_SUFFICIENT");
});

t("QH13 invalid event sequence blocks hidden-liquidity inference",()=>{
  const r=classifyHiddenLiquidity({
    eventSequenceValid:false,
    executedVolumeExceedsDisplayed:true,
    repeatedReplenishmentAfterExecution:true,
    weakPriceProgressUnderAggressiveFlow:true
  });
  assert.equal(r.state,"NOT_IDENTIFIABLE");
});

t("QH14 later fill pattern is post-treatment execution evidence",()=>{
  const r=validateTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    conservativeFillKnownAt:"2026-10-06T10:00:30+08:00",
    hiddenLiquidityPatternKnownAt:"2026-10-06T10:01:00+08:00"
  });
  assert.equal(r.roles.conservativeFillKnownAt,"POST_TREATMENT_EXECUTION");
  assert.equal(r.roles.hiddenLiquidityPatternKnownAt,"POST_TREATMENT_EXECUTION");
});

t("QH15 generic execution comparator is mandatory",()=>{
  const r=classifyExecutionMechanism({
    genericComparatorVerified:false,
    queueLatencyControlled:true,
    hiddenLiquidityControlled:true
  });
  assert.equal(r.state,"NOT_EVALUABLE");
});

t("QH16 multiple execution receipts remain one causal parent",()=>{
  const r=evidenceIdentity({parentDecisionId:"P1",receiptCount:6});
  assert.equal(r.rawReceiptCount,6);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

console.log(`SUMMARY ${pass}/16 PASS`);