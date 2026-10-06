import assert from "node:assert/strict";
import {
  classifyQueueEvidence,
  classifyLatencyState,
  classifyHiddenLiquidity,
  classifyExecutionTiming,
  hypotheticalFillGuard,
  buildExecutionComparator,
  informationLineage
} from "./pattern_queue_latency_hidden_liquidity_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("QL01 exact queue requires exact sequence plus own lifecycle",()=>{
  const r=classifyQueueEvidence({exactOrderSequence:true,ownOrderLifecycle:true});
  assert.equal(r.state,"EXACT_QUEUE_POSITION_KNOWN");
  assert.equal(r.exactQueuePositionKnown,true);
});

t("QL02 public top5 alone cannot identify exact queue",()=>{
  const r=classifyQueueEvidence({publicTop5Only:true});
  assert.equal(r.state,"QUEUE_POSITION_UNKNOWN");
  assert.equal(r.exactQueuePositionKnown,false);
});

t("QL03 verified proxy remains proxy only",()=>{
  const r=classifyQueueEvidence({queueAheadProxyVerified:true});
  assert.equal(r.state,"QUEUE_AHEAD_PROXY_ONLY");
  assert.equal(r.exactQueuePositionKnown,false);
});

t("QL04 queue state is never directional alpha",()=>{
  const r=classifyQueueEvidence({exactOrderSequence:true,ownOrderLifecycle:true});
  assert.equal(r.directionalAlphaAllowed,false);
});

t("QL05 no real order means no own-order latency",()=>{
  const r=classifyLatencyState({realOrderSubmitted:false});
  assert.equal(r.state,"NO_OWN_ORDER_LIFECYCLE");
});

t("QL06 submit timestamp without ack leaves ack latency unknown",()=>{
  const r=classifyLatencyState({
    realOrderSubmitted:true,
    decisionTimestamp:"2026-10-06T10:00:00+08:00",
    orderSubmitTimestamp:"2026-10-06T10:00:01+08:00"
  });
  assert.equal(r.state,"ACK_LATENCY_UNKNOWN");
});

t("QL07 complete ordered clocks can certify known latency",()=>{
  const r=classifyLatencyState({
    realOrderSubmitted:true,
    decisionTimestamp:"2026-10-06T10:00:00+08:00",
    orderSubmitTimestamp:"2026-10-06T10:00:01+08:00",
    exchangeAckTimestamp:"2026-10-06T10:00:02+08:00"
  });
  assert.equal(r.state,"LATENCY_KNOWN");
  assert.equal(r.exactLatencyKnown,true);
});

t("QL08 impossible latency clock fails closed",()=>{
  const r=classifyLatencyState({
    realOrderSubmitted:true,
    decisionTimestamp:"2026-10-06T10:00:02+08:00",
    orderSubmitTimestamp:"2026-10-06T10:00:01+08:00",
    exchangeAckTimestamp:"2026-10-06T10:00:03+08:00"
  });
  assert.equal(r.state,"UNKNOWN");
  assert.equal(r.reason,"LATENCY_CLOCK_INVALID");
});

t("QL09 hidden-liquidity candidate is not confirmed iceberg",()=>{
  const r=classifyHiddenLiquidity({candidateEvidence:true,eventClockValid:true});
  assert.equal(r.state,"HIDDEN_LIQUIDITY_CANDIDATE");
});

t("QL10 owner confirmation requires owner receipt and event clock",()=>{
  const r=classifyHiddenLiquidity({
    ownerConfirmed:true,ownerReceiptVerified:false,eventClockValid:true
  });
  assert.equal(r.state,"HIDDEN_LIQUIDITY_UNKNOWN");
});

t("QL11 verified owner receipt can certify hidden-liquidity state",()=>{
  const r=classifyHiddenLiquidity({
    ownerConfirmed:true,ownerReceiptVerified:true,eventClockValid:true
  });
  assert.equal(r.state,"OWNER_CONFIRMED_HIDDEN_LIQUIDITY");
});

t("QL12 candidate without adequate event clock remains unknown",()=>{
  const r=classifyHiddenLiquidity({candidateEvidence:true,eventClockValid:false});
  assert.equal(r.state,"HIDDEN_LIQUIDITY_UNKNOWN");
});

t("QL13 post-freeze hidden state is post-treatment",()=>{
  const r=classifyExecutionTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    knownAt:"2026-10-06T10:00:05+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"POST_TREATMENT");
  assert.equal(r.baselineEligible,false);
});

t("QL14 pre-freeze replay-safe execution state may be baseline",()=>{
  const r=classifyExecutionTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    knownAt:"2026-10-06T09:59:59+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"BASELINE_AVAILABLE");
});

t("QL15 hypothetical touch is not fill",()=>{
  const r=hypotheticalFillGuard({
    realOrderSubmitted:false,touchedLimit:true,fillReceiptVerified:false
  });
  assert.equal(r.status,"HYPOTHETICAL_TOUCH_NOT_FILL");
  assert.equal(r.fillClaimAllowed,false);
});

t("QL16 actual fill claim needs submitted order and verified receipt",()=>{
  const r=hypotheticalFillGuard({
    realOrderSubmitted:true,touchedLimit:true,fillReceiptVerified:true
  });
  assert.equal(r.status,"REAL_FILL_VERIFIED");
  assert.equal(r.fillClaimAllowed,true);
});

t("QL17 generic and zone execution comparators are non-independent",()=>{
  const g0=buildExecutionComparator({
    nearFrozenZone:false,contextMatched:true,d05ReceiptVerified:true
  });
  const g1=buildExecutionComparator({
    nearFrozenZone:true,contextMatched:true,d05ReceiptVerified:true
  });
  assert.equal(g0.independentVote,false);
  assert.equal(g1.independentVote,false);
});

t("QL18 many execution receipts remain one causal evidence family",()=>{
  const r=informationLineage({
    parentDecisionId:"P1",
    receipts:["zone","queue","latency","hidden","fill"]
  });
  assert.equal(r.rawReceiptCount,5);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

console.log(`SUMMARY ${pass}/18 PASS`);
