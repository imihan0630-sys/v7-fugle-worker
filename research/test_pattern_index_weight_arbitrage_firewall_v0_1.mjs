import assert from "node:assert/strict";
import {
  classifyBenchmarkControl,
  classifyPassiveEvent,
  classifyEtfArbitrageContext,
  validateModeledVsActualExecution,
  buildMechanicalAttributionFrame
} from "./pattern_index_weight_arbitrage_firewall_v0_1.mjs";

let pass=0;
const t=(name,fn)=>{fn();pass++;console.log("PASS",name);};

const freeze="2026-10-07T13:30:00+08:00";

t("IW01 target not in benchmark can use benchmark without self-exclusion",()=>{
  const r=classifyBenchmarkControl({
    targetIncluded:false,
    predictorFreezeAt:freeze,
    methodologyVerified:true
  });
  assert.equal(r.state,"TARGET_NOT_IN_BENCHMARK");
  assert.equal(r.eligible,true);
});

t("IW02 included target with unknown historical weight fails closed",()=>{
  const r=classifyBenchmarkControl({
    targetIncluded:true,
    predictorFreezeAt:freeze,
    methodologyVerified:true
  });
  assert.equal(r.state,"TARGET_INCLUDED_WEIGHT_UNKNOWN");
  assert.equal(r.eligible,false);
});

t("IW03 current/future weight cannot backfill predictor date",()=>{
  const r=classifyBenchmarkControl({
    targetIncluded:true,
    targetWeightAsOf:0.25,
    weightKnownAt:"2026-10-08T09:00:00+08:00",
    predictorFreezeAt:freeze,
    methodologyVerified:true
  });
  assert.equal(r.state,"TARGET_INCLUDED_WEIGHT_UNKNOWN");
});

t("IW04 self-included raw index alone is not exogenous control",()=>{
  const r=classifyBenchmarkControl({
    targetIncluded:true,
    targetWeightAsOf:0.25,
    weightKnownAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:freeze,
    methodologyVerified:true
  });
  assert.equal(r.state,"SELF_INCLUDED_BENCHMARK_ONLY");
  assert.equal(r.eligible,false);
});

t("IW05 verified self-excluded benchmark clears circularity gate",()=>{
  const r=classifyBenchmarkControl({
    targetIncluded:true,
    targetWeightAsOf:0.25,
    weightKnownAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:freeze,
    methodologyVerified:true,
    selfExcludedReceipt:{verified:true,knownAt:"2026-10-07T12:00:00+08:00"}
  });
  assert.equal(r.state,"SELF_EXCLUDED_BENCHMARK_VERIFIED");
  assert.equal(r.eligible,true);
});

t("IW06 unverified benchmark methodology is unknown",()=>{
  const r=classifyBenchmarkControl({
    targetIncluded:false,
    predictorFreezeAt:freeze,
    methodologyVerified:false
  });
  assert.equal(r.state,"INDEX_METHODOLOGY_OR_VINTAGE_UNKNOWN");
});

t("IW07 passive announcement before freeze is baseline context",()=>{
  const r=classifyPassiveEvent({
    receipt:{knownAt:"2026-10-07T10:00:00+08:00",announcementKnown:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"INDEX_ANNOUNCEMENT_KNOWN");
  assert.equal(r.baselineEligible,true);
});

t("IW08 passive event known after freeze is post-opportunity",()=>{
  const r=classifyPassiveEvent({
    receipt:{knownAt:"2026-10-07T14:00:00+08:00",effectiveSessionKnown:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"POST_OPPORTUNITY_MECHANICAL_CONTEXT");
  assert.equal(r.baselineEligible,false);
});

t("IW09 modeled passive flow stays modeled",()=>{
  const r=classifyPassiveEvent({
    receipt:{knownAt:"2026-10-07T10:00:00+08:00",modeledFlow:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"PASSIVE_FLOW_MODELED_ONLY");
});

t("IW10 verified actual passive execution is distinct",()=>{
  const r=classifyPassiveEvent({
    receipt:{knownAt:"2026-10-07T10:00:00+08:00",actualExecutionVerified:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"ACTUAL_PASSIVE_EXECUTION_VERIFIED");
});

t("IW11 ETF modeled basket cannot claim actual execution",()=>{
  const r=validateModeledVsActualExecution({
    modeledBasketExposure:true,
    actualExecutionVerified:false,
    claim:"ACTUAL_EXECUTION"
  });
  assert.equal(r.status,"PROHIBITED");
});

t("IW12 modeled basket exposure remains explicitly modeled",()=>{
  const r=validateModeledVsActualExecution({
    modeledBasketExposure:true,
    actualExecutionVerified:false,
    claim:"MODELED_EXPOSURE"
  });
  assert.equal(r.status,"MODELED_PRIMARY_BASKET_EXPOSURE_ONLY");
});

t("IW13 ETF prior price discovery is a mechanical context state",()=>{
  const r=classifyEtfArbitrageContext({
    receipt:{
      knownAt:"2026-10-07T12:00:00+08:00",
      etfPriorMove:true,
      directionKnown:true
    },
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"ETF_PRICE_DISCOVERY_PRIOR_MOVE");
});

t("IW14 futures and ETF together create multi-channel state, not two votes",()=>{
  const r=classifyEtfArbitrageContext({
    receipt:{
      knownAt:"2026-10-07T12:00:00+08:00",
      etfPriorMove:true,
      futuresPriorMove:true,
      directionKnown:true
    },
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"MULTIPLE_ARBITRAGE_CHANNELS");
  assert.equal(r.channels.length,2);
});

t("IW15 unknown arbitrage direction remains unknown direction",()=>{
  const r=classifyEtfArbitrageContext({
    receipt:{
      knownAt:"2026-10-07T12:00:00+08:00",
      etfPriorMove:true,
      directionKnown:false
    },
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"ARBITRAGE_DIRECTION_UNKNOWN");
});

t("IW16 later ETF/futures context cannot explain earlier predictor",()=>{
  const r=classifyEtfArbitrageContext({
    receipt:{
      knownAt:"2026-10-07T14:00:00+08:00",
      futuresPriorMove:true,
      directionKnown:true
    },
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"POST_OPPORTUNITY_MECHANICAL_CONTEXT");
});

t("IW17 self-included index use is flagged circular when no ex-self receipt",()=>{
  const benchmark=classifyBenchmarkControl({
    targetIncluded:true,
    targetWeightAsOf:0.3,
    weightKnownAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:freeze,
    methodologyVerified:true
  });
  const frame=buildMechanicalAttributionFrame({
    parentDecisionId:"P1",
    benchmarkControl:benchmark,
    selfIncludedIndexUsed:true,
    targetIndexWeight:0.3,
    representationCount:3
  });
  assert.equal(frame.selfInclusionCircularity,true);
  assert.equal(frame.effectiveIndependentEvidenceCount,1);
});

t("IW18 verified self-excluded control clears self-inclusion circularity",()=>{
  const benchmark=classifyBenchmarkControl({
    targetIncluded:true,
    targetWeightAsOf:0.3,
    weightKnownAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:freeze,
    methodologyVerified:true,
    selfExcludedReceipt:{verified:true,knownAt:"2026-10-07T12:00:00+08:00"}
  });
  const frame=buildMechanicalAttributionFrame({
    parentDecisionId:"P1",
    benchmarkControl:benchmark,
    selfIncludedIndexUsed:false,
    targetIndexWeight:0.3
  });
  assert.equal(frame.selfInclusionCircularity,false);
});

t("IW19 multiple instruments still default to one effective evidence family",()=>{
  const frame=buildMechanicalAttributionFrame({
    parentDecisionId:"P2",
    benchmarkControl:{state:"SELF_EXCLUDED_BENCHMARK_VERIFIED"},
    passiveEvent:{state:"ACTUAL_PASSIVE_EXECUTION_VERIFIED"},
    arbitrageContext:{state:"MULTIPLE_ARBITRAGE_CHANNELS"},
    representationCount:5
  });
  assert.equal(frame.rawRepresentationCount,5);
  assert.equal(frame.effectiveIndependentEvidenceCount,1);
  assert.equal(frame.independentVoteAllowed,false);
});

t("IW20 outcome join remains closed",()=>{
  const frame=buildMechanicalAttributionFrame({
    parentDecisionId:"P3",
    representationCount:1
  });
  assert.equal(frame.outcomeJoinAllowed,false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
