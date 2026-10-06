import assert from "node:assert/strict";
import {
  classifyObservation,
  classifyOpenIdentity,
  classifyZoneInteraction,
  classifyTimestampAlignment,
  validateDailyBarPath,
  buildStalePriceFrame
} from "./pattern_stale_price_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const zone={lower:100,upper:104};

t("SP01 pseudo bar cannot create structure event",()=>{
  const r=classifyObservation({observationType:"PSEUDO_BAR",timestamp:"2026-10-07T09:00:00+08:00",replaySafe:true});
  assert.equal(r.state,"NO_TRADE_STALE_OBSERVATION");
  assert.equal(r.structureEventEligible,false);
});

t("SP02 quote midpoint is not a trade",()=>{
  const r=classifyObservation({observationType:"QUOTE_MID",timestamp:"2026-10-07T09:00:00+08:00",replaySafe:true});
  assert.equal(r.state,"QUOTE_ONLY_OBSERVATION");
  assert.equal(r.tradeOccurred,false);
});

t("SP03 board/canonical trade is actual transaction evidence",()=>{
  const r=classifyObservation({observationType:"TRADE",timestamp:"2026-10-07T09:00:05+08:00",replaySafe:true,tradeSize:1000});
  assert.equal(r.state,"BOARD_OR_CANONICAL_TRADE_OBSERVED");
  assert.equal(r.tradeOccurred,true);
});

t("SP04 odd-lot trade stays distinct",()=>{
  const r=classifyObservation({observationType:"ODD_LOT_TRADE",timestamp:"2026-10-07T09:00:05+08:00",replaySafe:true});
  assert.equal(r.state,"ODD_LOT_TRADE_OBSERVED");
  assert.equal(r.structureEventEligible,false);
});

t("SP05 auction match stays distinct from continuous trade",()=>{
  const r=classifyObservation({observationType:"AUCTION_MATCH",timestamp:"2026-10-07T09:00:00+08:00",replaySafe:true,sessionPhase:"OPEN_CALL"});
  assert.equal(r.state,"AUCTION_TRADE_OBSERVED");
});

t("SP06 delayed first trade is measured, not thresholded",()=>{
  const r=classifyOpenIdentity({
    scheduledOpenAt:"2026-10-07T09:00:00+08:00",
    firstTradeAt:"2026-10-07T09:07:30+08:00",
    firstContinuousTradeAt:"2026-10-07T09:07:30+08:00",
    dailyOpenSource:"FIRST_CONTINUOUS_TRADE"
  });
  assert.equal(r.firstTradeDelaySeconds,450);
  assert.equal(r.staleThresholdDefined,false);
});

t("SP07 stale carried price inside zone is not executed interaction",()=>{
  const obs=classifyObservation({observationType:"CARRY_FORWARD_PRICE",timestamp:"2026-10-07T09:00:00+08:00",replaySafe:true});
  const r=classifyZoneInteraction({observationState:obs,price:102,zone});
  assert.equal(r.state,"PSEUDO_OR_STALE_PRICE_OVERLAPS_ZONE");
  assert.equal(r.executedInteraction,false);
});

t("SP08 quote-only zone touch is not execution",()=>{
  const obs=classifyObservation({observationType:"BEST_BID",timestamp:"2026-10-07T09:01:00+08:00",replaySafe:true});
  const r=classifyZoneInteraction({observationState:obs,price:102,zone,quoteOnly:true});
  assert.equal(r.state,"QUOTE_ONLY_ZONE_CONTACT");
  assert.equal(r.executedInteraction,false);
});

t("SP09 odd-lot-only touch does not become normal board-lot interaction",()=>{
  const obs=classifyObservation({observationType:"ODD_LOT_TRADE",timestamp:"2026-10-07T09:01:00+08:00",replaySafe:true});
  const r=classifyZoneInteraction({observationState:obs,price:102,zone,oddLotOnly:true});
  assert.equal(r.state,"ODD_LOT_ONLY_ZONE_INTERACTION");
  assert.equal(r.normalBoardLotCandidate,false);
});

t("SP10 one isolated trade is preserved as thin interaction",()=>{
  const obs=classifyObservation({observationType:"TRADE",timestamp:"2026-10-07T09:01:00+08:00",replaySafe:true});
  const r=classifyZoneInteraction({observationState:obs,price:102,zone,touchTradeCount:1,boardLotObserved:true});
  assert.equal(r.state,"ISOLATED_THIN_TRADE_ZONE_INTERACTION");
});

t("SP11 multiple actual trades can form contemporaneous interaction state",()=>{
  const obs=classifyObservation({observationType:"TRADE",timestamp:"2026-10-07T09:01:00+08:00",replaySafe:true});
  const r=classifyZoneInteraction({observationState:obs,price:102,zone,touchTradeCount:4,boardLotObserved:true});
  assert.equal(r.state,"EXECUTED_CONTEMPORANEOUS_ZONE_INTERACTION");
});

t("SP12 stale target with fresh benchmark is explicit",()=>{
  const r=classifyTimestampAlignment({
    targetPriceTimestamp:"2026-10-06T13:30:00+08:00",
    benchmarkPriceTimestamp:"2026-10-07T09:00:05+08:00",
    targetLastTradeAgeSeconds:70205,
    benchmarkLastTradeAgeSeconds:0,
    ownerSynchronous:false
  });
  assert.equal(r.state,"TARGET_PRICE_STALE_BENCHMARK_FRESH");
});

t("SP13 fresh target with stale benchmark is explicit",()=>{
  const r=classifyTimestampAlignment({
    targetPriceTimestamp:"2026-10-07T09:00:05+08:00",
    benchmarkPriceTimestamp:"2026-10-06T13:30:00+08:00",
    targetLastTradeAgeSeconds:0,
    benchmarkLastTradeAgeSeconds:70205,
    ownerSynchronous:false
  });
  assert.equal(r.state,"TARGET_FRESH_BENCHMARK_STALE");
});

t("SP14 owner-certified synchronous state can be accepted without D01 threshold",()=>{
  const r=classifyTimestampAlignment({
    targetPriceTimestamp:"2026-10-07T09:00:05+08:00",
    benchmarkPriceTimestamp:"2026-10-07T09:00:04+08:00",
    ownerSynchronous:true
  });
  assert.equal(r.state,"SYNCHRONOUS_ENOUGH_BY_OWNER_CONTRACT");
});

t("SP15 unverified daily bar provenance blocks path claims",()=>{
  const r=validateDailyBarPath({barProvenanceVerified:false});
  assert.equal(r.status,"DATA_BLOCKED");
});

t("SP16 possible pseudo bar blocks structural path claim",()=>{
  const r=validateDailyBarPath({barProvenanceVerified:true,noTradeOrPseudoPossible:true});
  assert.equal(r.reason,"NO_TRADE_OR_PSEUDO_BAR_POSSIBLE");
});

t("SP17 daily OHLC cannot prove exact intraday path without timestamps",()=>{
  const r=validateDailyBarPath({
    barProvenanceVerified:true,noTradeOrPseudoPossible:false,
    intradayTimestampsAvailable:false,claimExactIntradayPath:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"DAILY_OHLC_CANNOT_PROVE_EXACT_INTRADAY_PATH");
});

t("SP18 verified daily bar can remain broad geometry evidence",()=>{
  const r=validateDailyBarPath({
    barProvenanceVerified:true,noTradeOrPseudoPossible:false,
    intradayTimestampsAvailable:false,claimExactIntradayPath:false
  });
  assert.equal(r.status,"VALID_FOR_BROAD_GEOMETRY");
});

t("SP19 multiple microstructure descriptors remain one evidence family",()=>{
  const frame=buildStalePriceFrame({
    parentDecisionId:"P1",
    observation:{state:"BOARD_OR_CANONICAL_TRADE_OBSERVED"},
    interaction:{state:"ISOLATED_THIN_TRADE_ZONE_INTERACTION"},
    alignment:{state:"TARGET_PRICE_STALE_BENCHMARK_FRESH"},
    rawRepresentationCount:6
  });
  assert.equal(frame.effectiveIndependentEvidenceCount,1);
  assert.equal(frame.independentVoteAllowed,false);
});

t("SP20 outcome join remains closed",()=>{
  const frame=buildStalePriceFrame({parentDecisionId:"P2"});
  assert.equal(frame.outcomeJoinAllowed,false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
