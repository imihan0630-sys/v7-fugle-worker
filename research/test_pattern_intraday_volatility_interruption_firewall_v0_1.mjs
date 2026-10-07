import assert from "node:assert/strict";
import {
  classifyReferenceRegime,
  classifyInterruptionTrigger,
  classifyInterruptionPhase,
  classifyInterruptionOrderSet,
  classifyInterruptionCross,
  validateInterruptionReceipt,
  classifyInterruptionComparator,
  buildInterruptionLineage
} from "./pattern_intraday_volatility_interruption_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("IV01 opening reference phase uses opening call or auction reference",()=>{
  assert.equal(
    classifyReferenceRegime({
      phase:"OPENING_0900_0905",
      openingPriceAvailable:true
    }).source,
    "OPENING_CALL_PRICE"
  );
});

t("IV02 post-0905 uses rolling five-minute reference when trades exist",()=>{
  const r=classifyReferenceRegime({
    phase:"AFTER_0905",
    recentContinuousTradesAvailable:true
  });
  assert.equal(r.state,"ROLLING_FIVE_MINUTE_REFERENCE");
  assert.equal(r.source,"FIVE_MINUTE_WEIGHTED_AVERAGE");
});

t("IV03 post-interruption window uses call-price reference when available",()=>{
  const r=classifyReferenceRegime({
    phase:"POST_INTERRUPTION_FIRST_5M",
    postInterruptionCallPriceAvailable:true
  });
  assert.equal(r.state,"POST_INTERRUPTION_RESET_REFERENCE");
  assert.equal(r.source,"INTERRUPTION_CALL_PRICE");
});

t("IV04 potential price beyond 3.5 percent triggers candidate but is not executed",()=>{
  const r=classifyInterruptionTrigger({
    potentialExecutionPrice:104,
    referencePrice:100
  });
  assert.equal(r.status,"INTERRUPTION_TRIGGER_CANDIDATE");
  assert.equal(r.executedPrice,false);
});

t("IV05 exactly 3.5 percent does not exceed trigger band",()=>{
  const r=classifyInterruptionTrigger({
    potentialExecutionPrice:103.5,
    referencePrice:100
  });
  assert.equal(r.status,"NO_INTERRUPTION_TRIGGER");
});

t("IV06 two-minute matching delay is not price acceptance",()=>{
  const r=classifyInterruptionPhase({
    triggered:true,
    delayActive:true
  });
  assert.equal(r.state,"MATCHING_POSTPONED");
  assert.equal(r.priceAcceptance,false);
});

t("IV07 restart call auction before print has no executed price",()=>{
  const r=classifyInterruptionPhase({
    triggered:true,
    callAuctionActive:true,
    callPrintObserved:false
  });
  assert.equal(r.state,"RESTART_CALL_AUCTION");
  assert.equal(r.executedPrice,false);
});

t("IV08 restart call print is not confirmed breakout",()=>{
  const r=classifyInterruptionPhase({
    triggered:true,
    callPrintObserved:true
  });
  assert.equal(r.state,"RESTART_CALL_PRINT");
  assert.equal(r.confirmedBreakout,false);
});

t("IV09 market IOC FOK are rejected during interruption",()=>{
  const r=classifyInterruptionOrderSet({
    marketOrder:true,
    ioc:true,
    fok:true
  });
  assert.equal(r.newMarketOrderAccepted,false);
  assert.equal(r.newIocAccepted,false);
  assert.equal(r.newFokAccepted,false);
});

t("IV10 limit ROD may be accepted during interruption",()=>{
  const r=classifyInterruptionOrderSet({limitRod:true});
  assert.equal(r.newLimitRodAccepted,true);
});

t("IV11 pre-existing market order can be deleted and queue is not unchanged",()=>{
  const r=classifyInterruptionOrderSet({preExistingMarketOrder:true});
  assert.equal(r.preExistingMarketOrderDeleted,true);
  assert.equal(r.preTriggerQueuePersistsUnchanged,false);
});

t("IV12 trigger potential crossing does not create executed breakout",()=>{
  const r=classifyInterruptionCross({
    triggerPotentialExecutionPrice:106,
    restartCallPrice:103,
    firstContinuousPrice:102,
    boundary:{lower:100,upper:104}
  });
  assert.equal(r.triggerPotentialZoneRelation,"ABOVE");
  assert.equal(r.triggerPotentialIsExecutedBreakout,false);
});

t("IV13 restart call crossing remains distinct from continuous confirmation",()=>{
  const r=classifyInterruptionCross({
    triggerPotentialExecutionPrice:106,
    restartCallPrice:106,
    firstContinuousPrice:103,
    boundary:{lower:100,upper:104}
  });
  assert.equal(r.restartCallZoneRelation,"ABOVE");
  assert.equal(r.postContinuousZoneRelation,"INSIDE");
  assert.equal(r.restartCallIsConfirmedBreakout,false);
});

t("IV14 no continuous path is invented through the delayed interval",()=>{
  const r=classifyInterruptionCross({
    triggerPotentialExecutionPrice:106,
    restartCallPrice:107,
    firstContinuousPrice:107,
    boundary:{lower:100,upper:104}
  });
  assert.equal(r.continuousPathInvented,false);
});

t("IV15 replay-unsafe interruption receipt is data blocked",()=>{
  const r=validateInterruptionReceipt({
    firstObservableAt:"2026-10-07T10:00:00+08:00",
    knownAt:"2026-10-07T10:00:00+08:00",
    triggerAt:"2026-10-07T10:00:00+08:00",
    predictorFreezeAt:"2026-10-07T10:00:01+08:00",
    referenceRegimeKnownAt:"2026-10-07T10:00:00+08:00",
    replaySafe:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("IV16 post-freeze reference knowledge cannot backfill",()=>{
  const r=validateInterruptionReceipt({
    firstObservableAt:"2026-10-07T10:00:00+08:00",
    knownAt:"2026-10-07T10:00:00+08:00",
    triggerAt:"2026-10-07T10:00:00+08:00",
    predictorFreezeAt:"2026-10-07T10:00:01+08:00",
    referenceRegimeKnownAt:"2026-10-07T10:00:02+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"POST_FREEZE_RECEIPT_NOT_ELIGIBLE");
});

t("IV17 interruption at old structural zone gets H1 comparator",()=>{
  const r=classifyInterruptionComparator({
    interruptionTriggered:true,
    atStructuralZone:true,
    highVolatilityContextVerified:true
  });
  assert.equal(r.status,"H1_VOLATILITY_INTERRUPTION_AT_STRUCTURAL_ZONE");
});

t("IV18 interruption away from zone gets H0 comparator",()=>{
  const r=classifyInterruptionComparator({
    interruptionTriggered:true,
    atStructuralZone:false,
    highVolatilityContextVerified:true
  });
  assert.equal(r.status,"H0_VOLATILITY_INTERRUPTION_AWAY_FROM_STRUCTURAL_ZONE");
});

t("IV19 high-volatility non-interruption at zone remains generic comparator",()=>{
  const r=classifyInterruptionComparator({
    interruptionTriggered:false,
    atStructuralZone:true,
    highVolatilityContextVerified:true
  });
  assert.equal(r.status,"G0_HIGH_VOLATILITY_MOVE_WITHOUT_INTERRUPTION_AT_STRUCTURAL_ZONE");
});

t("IV20 microstructure receipts do not create automatic independent votes",()=>{
  const r=buildInterruptionLineage({
    priceRepresentations:4,
    orderBookReceiptPresent:true,
    auctionReceiptPresent:true
  });
  assert.equal(r.externalMicrostructureCreatesAutomaticVote,false);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

console.log(`SUMMARY ${pass}/20 PASS`);
