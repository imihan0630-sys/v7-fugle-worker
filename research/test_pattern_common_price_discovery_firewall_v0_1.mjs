import assert from "node:assert/strict";
import {
  validateLeadReceipt,
  classifyDiscoveryContext,
  classifySynchronizationEvidence,
  classifyNonsynchronousRisk,
  classifyInformationIndependence,
  buildDiscoveryDenominator
} from "./pattern_common_price_discovery_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const validClock={
  relationFrozenAt:"2026-09-01T00:00:00+08:00",
  leaderSignalFirstObservableAt:"2026-10-01T09:20:00+08:00",
  leaderSignalKnownAt:"2026-10-01T09:25:00+08:00",
  followerPredictorFreezeAt:"2026-10-01T09:30:00+08:00",
  followerEndpointWindowStart:"2026-10-01T09:31:00+08:00",
  replaySafe:true
};

t("PD01 valid earlier leader receipt is baseline eligible",()=>{
  assert.equal(validateLeadReceipt(validClock).status,"PRE_FREEZE_LEAD_CONTEXT_ELIGIBLE");
});

t("PD02 outcome-selected leader is prohibited",()=>{
  assert.equal(validateLeadReceipt({...validClock,outcomeSelectedLeader:true}).status,"POST_HOC_RELATION_NOT_ELIGIBLE");
});

t("PD03 late known leader is post hoc",()=>{
  const r=validateLeadReceipt({...validClock,leaderSignalKnownAt:"2026-10-01T09:35:00+08:00"});
  assert.equal(r.status,"POST_HOC_LEADER_NOT_ELIGIBLE");
});

t("PD04 replay unsafe relation is blocked",()=>{
  assert.equal(validateLeadReceipt({...validClock,replaySafe:false}).status,"DATA_BLOCKED");
});

t("PD05 one sector channel is explicit",()=>{
  assert.equal(classifyDiscoveryContext({sectorPrior:true}).state,"SECTOR_PRIOR_MOVE_PRESENT");
});

t("PD06 multiple channels are not silently collapsed",()=>{
  const r=classifyDiscoveryContext({marketPrior:true,sectorPrior:true,verifiedLeaderPrior:true});
  assert.equal(r.state,"MULTIPLE_COMMON_DISCOVERY_CHANNELS");
  assert.equal(r.channels.length,3);
});

t("PD07 contemporaneous only is not a prior leader state",()=>{
  assert.equal(classifyDiscoveryContext({contemporaneousOnly:true}).state,"CONTEMPORANEOUS_SYNCHRONIZATION_ONLY");
});

t("PD08 same bar synchronization is not predictive evidence",()=>{
  const r=classifySynchronizationEvidence({
    leaderKnownAt:"2026-10-01T09:30:00+08:00",
    followerKnownAt:"2026-10-01T09:30:00+08:00",
    sameBarOnly:true,
    directionResolved:true
  });
  assert.equal(r.predictiveEvidence,false);
});

t("PD09 true earlier known leader can be timing-consistent",()=>{
  const r=classifySynchronizationEvidence({
    leaderKnownAt:"2026-10-01T09:20:00+08:00",
    followerKnownAt:"2026-10-01T09:30:00+08:00",
    sameBarOnly:false,
    directionResolved:true
  });
  assert.equal(r.state,"LEADER_PRECEDES_FOLLOWER");
  assert.equal(r.predictiveEvidence,true);
});

t("PD10 unresolved direction stays unknown",()=>{
  assert.equal(classifySynchronizationEvidence({directionResolved:false}).state,"LEAD_LAG_DIRECTION_UNKNOWN");
});

t("PD11 stale prices create nonsynchronous risk",()=>{
  assert.equal(classifyNonsynchronousRisk({stalePrice:true,lastTradeFresh:false,liquidityAdequate:false}).state,"NONSYNCHRONOUS_TRADING_RISK");
});

t("PD12 normal fresh liquid state controls nonsynchronous risk",()=>{
  const r=classifyNonsynchronousRisk({stalePrice:false,lastTradeFresh:true,liquidityAdequate:true,sessionConstraint:"NORMAL"});
  assert.equal(r.leadLagClean,true);
});

t("PD13 auction or constrained session is explicit",()=>{
  assert.equal(classifyNonsynchronousRisk({sessionConstraint:"AUCTION"}).state,"SESSION_CONSTRAINT_PRESENT");
});

t("PD14 different symbols sharing PRICE_OHLC do not automatically create independent evidence",()=>{
  const r=classifyInformationIndependence({
    leaderInformationRoot:"PRICE_OHLC",
    followerStructuralInformationRoot:"PRICE_OHLC"
  });
  assert.equal(r.status,"CORRELATED_PRICE_INFORMATION_ROOT");
  assert.equal(r.independentEvidenceAllowed,false);
});

t("PD15 distinct root remains candidate until residual validation",()=>{
  const r=classifyInformationIndependence({
    leaderInformationRoot:"OFFICIAL_EVENT",
    followerStructuralInformationRoot:"PRICE_OHLC"
  });
  assert.equal(r.status,"DISTINCT_INFORMATION_ROOT_CANDIDATE");
  assert.equal(r.independentEvidenceAllowed,false);
});

t("PD16 denominator preserves unknown direction and contemporaneous cases",()=>{
  const r=buildDiscoveryDenominator([
    {state:"LEAD_LAG_DIRECTION_UNKNOWN"},
    {state:"CONTEMPORANEOUS_SYNCHRONIZATION_ONLY"},
    {state:"SECTOR_PRIOR_MOVE_PRESENT"}
  ]);
  assert.equal(r.total,3);
  assert.equal(r.counts.LEAD_LAG_DIRECTION_UNKNOWN,1);
});

t("PD17 successful-follower-only filtering is prohibited",()=>{
  const r=buildDiscoveryDenominator([{state:"VERIFIED_LEADER_PRIOR_MOVE_PRESENT"}]);
  assert.equal(r.successfulFollowerFilteringAllowed,false);
});

t("PD18 multiple price discovery channels remain one default evidence family",()=>{
  const r=buildDiscoveryDenominator([
    {state:"MARKET_INDEX_PRIOR_MOVE_PRESENT"},
    {state:"SECTOR_PRIOR_MOVE_PRESENT"}
  ]);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("PD19 data blocked stays visible",()=>{
  const r=classifyDiscoveryContext({dataBlocked:true});
  assert.equal(r.state,"PRICE_DISCOVERY_DATA_BLOCKED");
});

t("PD20 absence of prior channel receipt remains self-context, not proof of no common influence",()=>{
  const r=classifyDiscoveryContext({});
  assert.equal(r.state,"SELF_STRUCTURE_CONTEXT_ONLY");
});

console.log(`SUMMARY ${pass}/20 PASS`);
