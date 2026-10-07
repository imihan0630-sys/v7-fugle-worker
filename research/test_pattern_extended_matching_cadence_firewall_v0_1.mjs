import assert from "node:assert/strict";
import {
  classifyMatchingCadence,
  classifyObservedMarketState,
  classifyBarIntegrity,
  classifyPeriodicGap,
  classifyStructuralOpportunity,
  validateDispositionReceipt,
  buildCadenceLineage
} from "./pattern_extended_matching_cadence_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("MC01 unverified receipt leaves matching cadence unknown",()=>{
  assert.equal(
    classifyMatchingCadence({receiptVerified:false,intervalMinutes:45}).state,
    "MATCHING_CADENCE_UNKNOWN"
  );
});

t("MC02 2-minute disposition cadence is recognized",()=>{
  assert.equal(
    classifyMatchingCadence({receiptVerified:true,intervalMinutes:2}).state,
    "EXTENDED_MATCHING_APPROX_2M"
  );
});

t("MC03 altered-method 10-minute cadence is distinct",()=>{
  assert.equal(
    classifyMatchingCadence({
      receiptVerified:true,intervalMinutes:10,alteredTradingMethod:true
    }).state,
    "ALTERED_METHOD_APPROX_10M"
  );
});

t("MC04 altered-method 25-minute cadence is distinct",()=>{
  assert.equal(
    classifyMatchingCadence({
      receiptVerified:true,intervalMinutes:25,alteredTradingMethod:true
    }).state,
    "ALTERED_METHOD_APPROX_25M"
  );
});

t("MC05 periodic 45-minute cadence is distinct",()=>{
  assert.equal(
    classifyMatchingCadence({
      receiptVerified:true,intervalMinutes:45,alteredTradingMethod:true,periodicCallAuction:true
    }).state,
    "PERIODIC_CALL_APPROX_45M"
  );
});

t("MC06 periodic 60-minute cadence is distinct",()=>{
  assert.equal(
    classifyMatchingCadence({
      receiptVerified:true,intervalMinutes:60,alteredTradingMethod:true,periodicCallAuction:true
    }).state,
    "PERIODIC_CALL_APPROX_60M"
  );
});

t("MC07 quote-only state is not executed trade",()=>{
  const r=classifyObservedMarketState({
    scheduledMatchOpportunity:true,
    quoteObserved:true,
    indicativeComputedPrice:101,
    actualTradeObserved:false
  });
  assert.equal(r.state,"QUOTE_ONLY_ZONE_RELATION");
  assert.equal(r.executed,false);
});

t("MC08 no scheduled match opportunity is explicit",()=>{
  const r=classifyObservedMarketState({
    scheduledMatchOpportunity:false,
    quoteObserved:true,
    indicativeComputedPrice:101
  });
  assert.equal(r.state,"NO_EXECUTABLE_MATCH_OPPORTUNITY");
  assert.equal(r.executed,false);
});

t("MC09 scheduled match with no execution is not price acceptance",()=>{
  const r=classifyObservedMarketState({
    scheduledMatchOpportunity:true,
    quoteObserved:false,
    actualTradeObserved:false
  });
  assert.equal(r.state,"SCHEDULED_MATCH_NO_EXECUTION");
  assert.equal(r.executed,false);
});

t("MC10 actual matched price is the executable observation",()=>{
  const r=classifyObservedMarketState({
    scheduledMatchOpportunity:true,
    actualTradeObserved:true,
    actualTradePrice:102
  });
  assert.equal(r.state,"EXECUTED_MATCH");
  assert.equal(r.executed,true);
  assert.equal(r.actualTradePrice,102);
});

t("MC11 stale carry-forward pseudo-bar is prohibited",()=>{
  const r=classifyBarIntegrity({
    actualTradeCount:0,
    scheduledMatchOpportunityCount:0,
    executedMatchCount:0,
    staleCarryForwardUsed:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"STALE_CARRY_FORWARD_PSEUDO_BAR");
});

t("MC12 valid sparse bar keeps counts without calling no-trade acceptance",()=>{
  const r=classifyBarIntegrity({
    actualTradeCount:1,
    scheduledMatchOpportunityCount:1,
    executedMatchCount:1,
    staleCarryForwardUsed:false
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.noExecutionEqualsPriceAcceptance,false);
});

t("MC13 periodic gap across zone is not continuous breakout",()=>{
  const r=classifyPeriodicGap({
    previousExecutedPrice:98,
    currentExecutedPrice:106,
    boundary:{lower:100,upper:104},
    continuousPathObserved:false
  });
  assert.equal(r.status,"PERIODIC_MATCH_GAP_CROSSING");
  assert.equal(r.continuousBreakout,false);
});

t("MC14 observed continuous path is distinguished from periodic gap",()=>{
  const r=classifyPeriodicGap({
    previousExecutedPrice:98,
    currentExecutedPrice:106,
    boundary:{lower:100,upper:104},
    continuousPathObserved:true
  });
  assert.equal(r.status,"EXECUTED_ZONE_RELATION");
  assert.equal(r.continuousBreakout,true);
});

t("MC15 stabilization postponement overrides ordinary match interpretation",()=>{
  const r=classifyStructuralOpportunity({
    scheduledMatchOpportunity:true,
    actualTradeObserved:true,
    actualTradePrice:103,
    boundary:{lower:100,upper:104},
    matchPostponedByStabilization:true
  });
  assert.equal(r.state,"MATCH_POSTPONED_BY_STABILIZATION");
  assert.equal(r.executed,false);
});

t("MC16 actual execution inside zone is explicit",()=>{
  const r=classifyStructuralOpportunity({
    scheduledMatchOpportunity:true,
    actualTradeObserved:true,
    actualTradePrice:102,
    boundary:{lower:100,upper:104},
    matchPostponedByStabilization:false
  });
  assert.equal(r.state,"EXECUTED_MATCH_INSIDE_ZONE");
  assert.equal(r.executed,true);
});

t("MC17 replay-unsafe disposition receipt is data blocked",()=>{
  const r=validateDispositionReceipt({
    firstObservableAt:"2026-10-07T08:00:00+08:00",
    knownAt:"2026-10-07T08:00:00+08:00",
    effectiveFrom:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:"2026-10-07T09:30:00+08:00",
    matchingIntervalSeconds:120,
    measureVersion:"V1",
    replaySafe:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("MC18 post-freeze disposition knowledge cannot backfill",()=>{
  const r=validateDispositionReceipt({
    firstObservableAt:"2026-10-07T10:00:00+08:00",
    knownAt:"2026-10-07T10:00:00+08:00",
    effectiveFrom:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:"2026-10-07T09:30:00+08:00",
    matchingIntervalSeconds:120,
    measureVersion:"V1",
    replaySafe:true
  });
  assert.equal(r.status,"POST_FREEZE_DISPOSITION_RECEIPT_NOT_ELIGIBLE");
});

t("MC19 matching-regime change does not create a second price vote",()=>{
  const r=buildCadenceLineage({
    priceRepresentations:4,
    matchingRegimeReceiptPresent:true,
    orderRestrictionReceiptPresent:true
  });
  assert.equal(r.regulatoryContextCreatesAutomaticVote,false);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("MC20 custom official interval remains canonical context rather than inferred class",()=>{
  const r=classifyMatchingCadence({
    receiptVerified:true,
    intervalMinutes:7,
    canonicalCustomClass:"SURVEILLANCE_COMMITTEE_CUSTOM"
  });
  assert.equal(r.state,"CANONICAL_CUSTOM_MATCHING_INTERVAL");
  assert.equal(r.intervalMinutes,7);
});

console.log(`SUMMARY ${pass}/20 PASS`);
