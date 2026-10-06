import assert from "node:assert/strict";
import {
  classifySessionPhase,
  classifyAuctionReceipt,
  classifyMixedBar,
  classifyStructuralInteraction,
  classifyMechanicalContext,
  classifyAuctionComparator,
  validateEndpointClock
} from "./pattern_auction_close_liquidity_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("AC01 preopen state is indicative",()=>{
  assert.equal(classifySessionPhase({localTime:"08:45:00"}).state,"PREOPEN_INDICATIVE_ONLY");
});
t("AC02 opening print is separate from preopen indicative",()=>{
  assert.equal(classifySessionPhase({localTime:"08:59:59",isFinalPrint:true}).state,"OPENING_CALL_FINAL_PRINT");
});
t("AC03 continuous session is separate",()=>{
  assert.equal(classifySessionPhase({localTime:"10:30:00"}).state,"CONTINUOUS_TRADING_UNCONSTRAINED");
});
t("AC04 close call indicative is separate",()=>{
  assert.equal(classifySessionPhase({localTime:"13:27:00"}).state,"CLOSING_CALL_INDICATIVE_ONLY");
});
t("AC05 close final print is separate",()=>{
  assert.equal(classifySessionPhase({localTime:"13:30:00",isFinalPrint:true}).state,"CLOSING_CALL_FINAL_PRINT");
});
t("AC06 delayed close has explicit state",()=>{
  assert.equal(classifySessionPhase({localTime:"13:31:00",closeDelayed:true}).state,"CLOSING_CALL_DELAYED");
});
t("AC07 indicative price is not executed price",()=>{
  const r=classifyAuctionReceipt({
    receiptType:"INDICATIVE",
    firstObservableAt:"2026-10-07T13:26:00+08:00",
    knownAt:"2026-10-07T13:26:00+08:00",
    predictorFreezeAt:"2026-10-07T13:27:00+08:00",
    replaySafe:true
  });
  assert.equal(r.executedPrice,false);
});
t("AC08 final print after freeze cannot be backfilled",()=>{
  const r=classifyAuctionReceipt({
    receiptType:"FINAL_PRINT",
    firstObservableAt:"2026-10-07T13:30:00+08:00",
    knownAt:"2026-10-07T13:30:00+08:00",
    predictorFreezeAt:"2026-10-07T13:29:30+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"POST_FREEZE_NOT_ELIGIBLE");
});
t("AC09 mixed continuous-close bar is explicit",()=>{
  const r=classifyMixedBar({
    barStartLocalTime:"13:15:00",
    barEndLocalTime:"13:30:00",
    phaseSeparated:false
  });
  assert.equal(r.status,"AUCTION_MIXED_BAR");
  assert.equal(r.pureContinuous,false);
});
t("AC10 phase-separated mixed interval is not forced mixed",()=>{
  const r=classifyMixedBar({
    barStartLocalTime:"13:15:00",
    barEndLocalTime:"13:30:00",
    phaseSeparated:true
  });
  assert.equal(r.pureContinuous,true);
});
t("AC11 opening gap through zone is not continuous crossing",()=>{
  const r=classifyStructuralInteraction({
    priorClose:98,finalPrice:106,boundary:{lower:100,upper:104},
    sessionPhase:"OPENING_CALL_FINAL_PRINT",
    continuousTradeThroughZone:false
  });
  assert.equal(r.status,"OPENING_GAP_CROSSING");
  assert.equal(r.continuousCrossing,false);
});
t("AC12 closing-only interaction is explicit",()=>{
  const r=classifyStructuralInteraction({
    priorClose:106,finalPrice:103,boundary:{lower:100,upper:104},
    sessionPhase:"CLOSING_CALL_FINAL_PRINT",
    continuousTradeThroughZone:false
  });
  assert.equal(r.status,"CLOSING_AUCTION_ONLY_INTERACTION");
});
t("AC13 delayed closing print is not backdated",()=>{
  const r=classifyStructuralInteraction({
    finalPrice:103,boundary:{lower:100,upper:104},
    sessionPhase:"CLOSING_CALL_FINAL_PRINT",
    auctionDelayed:true
  });
  assert.equal(r.status,"CLOSING_AUCTION_DELAYED");
});
t("AC14 high close volume alone does not prove passive flow",()=>{
  const r=classifyMechanicalContext({closeLiquidityReceiptVerified:true});
  assert.equal(r.passiveFlowInferredFromVolumeOnly,false);
  assert.deepEqual(r.active,["CLOSE_LIQUIDITY_CONCENTRATION"]);
});
t("AC15 verified passive/rebalance contexts remain separate",()=>{
  const r=classifyMechanicalContext({
    rebalanceEventVerified:true,passiveFlowVerified:true
  });
  assert.ok(r.active.includes("INDEX_REBALANCE"));
  assert.ok(r.active.includes("PASSIVE_FLOW"));
});
t("AC16 multiple close mechanisms still count one default evidence family",()=>{
  const r=classifyMechanicalContext({
    monthEnd:true,passiveFlowVerified:true,etfReceiptVerified:true,closeLiquidityReceiptVerified:true
  });
  assert.equal(r.independentEvidenceCount,1);
});
t("AC17 opening comparator remains distinct from closing comparator",()=>{
  assert.equal(
    classifyAuctionComparator({atZone:true,mechanicalContextVerified:true,opening:true}).status,
    "O1_OPENING_CALL_EVENT_AT_ZONE"
  );
});
t("AC18 close mechanical comparator at zone is explicit",()=>{
  assert.equal(
    classifyAuctionComparator({atZone:true,mechanicalContextVerified:true,opening:false}).status,
    "G1_AUCTION_OR_CLOSE_MECHANICAL_EVENT_AT_ZONE"
  );
});
t("AC19 endpoint receipt must be known by predictor freeze",()=>{
  assert.equal(validateEndpointClock({
    receiptKnownAt:"2026-10-07T13:30:00+08:00",
    predictorFreezeAt:"2026-10-07T13:29:00+08:00",
    endpointWindowStart:"2026-10-07T13:31:00+08:00"
  }).status,"POST_FREEZE_NOT_ELIGIBLE");
});
t("AC20 valid clock requires freeze before endpoint window",()=>{
  assert.equal(validateEndpointClock({
    receiptKnownAt:"2026-10-07T13:28:00+08:00",
    predictorFreezeAt:"2026-10-07T13:29:00+08:00",
    endpointWindowStart:"2026-10-07T13:31:00+08:00"
  }).status,"VALID");
});

console.log(`SUMMARY ${pass}/20 PASS`);
