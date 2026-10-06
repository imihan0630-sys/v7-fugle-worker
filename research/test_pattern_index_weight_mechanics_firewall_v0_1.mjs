import assert from "node:assert/strict";
import {
  classifyParticipationContext,
  validateHistoricalWeight,
  classifySelfInclusion,
  validatePassiveEventTiming,
  buildIndexContextDenominator
} from "./pattern_index_weight_mechanics_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("IW01 broad confirmation requires broad participation",()=>{
  const r=classifyParticipationContext({capWeightedReturn:1,equalWeightedReturn:0.8,medianMemberReturn:0.4,advanceShare:0.7,top1ContributionShare:0.2,top3ContributionShare:0.4});
  assert.equal(r.state,"BROAD_MARKET_CONFIRMATION");
});

t("IW02 cap weighted up with weak breadth is not broad confirmation",()=>{
  const r=classifyParticipationContext({capWeightedReturn:1,equalWeightedReturn:-0.2,medianMemberReturn:-0.1,advanceShare:0.4,top1ContributionShare:0.2,top3ContributionShare:0.4});
  assert.equal(r.state,"CAP_WEIGHTED_UP_EQUAL_WEIGHT_WEAK");
});

t("IW03 concentrated mega-cap move is explicit",()=>{
  const r=classifyParticipationContext({capWeightedReturn:1,equalWeightedReturn:-0.2,medianMemberReturn:-0.1,advanceShare:0.4,top1ContributionShare:0.6,top3ContributionShare:0.8});
  assert.equal(r.state,"NARROW_MEGA_CAP_LED_CONFIRMATION");
});

t("IW04 missing breadth stays unknown",()=>{
  const r=classifyParticipationContext({capWeightedReturn:1});
  assert.equal(r.state,"MARKET_CONFIRMATION_BREADTH_UNKNOWN");
});

t("IW05 historical weight must exist",()=>{
  assert.equal(validateHistoricalWeight({replaySafe:true,predictorFreezeAt:"2026-10-01"}).status,"INDEX_WEIGHT_UNKNOWN");
});

t("IW06 future-known weight is post hoc",()=>{
  const r=validateHistoricalWeight({historicalWeight:0.1,historicalWeightKnownAt:"2026-10-02",predictorFreezeAt:"2026-10-01",replaySafe:true});
  assert.equal(r.status,"POST_HOC_WEIGHT_NOT_ELIGIBLE");
});

t("IW07 valid PIT historical weight is eligible",()=>{
  const r=validateHistoricalWeight({historicalWeight:0.1,historicalWeightKnownAt:"2026-09-30",predictorFreezeAt:"2026-10-01",replaySafe:true});
  assert.equal(r.status,"HISTORICAL_WEIGHT_ELIGIBLE");
});

t("IW08 replay unsafe weight is blocked",()=>{
  assert.equal(validateHistoricalWeight({historicalWeight:0.1,replaySafe:false}).status,"DATA_BLOCKED");
});

t("IW09 candidate self inclusion is explicit",()=>{
  const r=classifySelfInclusion({candidateSymbol:"2330",constituentSymbols:["2330","2317"]});
  assert.equal(r.state,"CANDIDATE_SELF_INCLUDED_IN_INDEX_CONTEXT");
  assert.equal(r.independentConfirmationAllowed,false);
});

t("IW10 nonmember context still is not automatic independent confirmation",()=>{
  const r=classifySelfInclusion({candidateSymbol:"3008",constituentSymbols:["2330","2317"]});
  assert.equal(r.state,"CANDIDATE_NOT_INCLUDED");
  assert.equal(r.independentConfirmationAllowed,false);
});

t("IW11 ex-candidate availability is preserved",()=>{
  const r=classifySelfInclusion({candidateSymbol:"2330",constituentSymbols:["2330"],exCandidateContextAvailable:true});
  assert.equal(r.exCandidateContextAvailable,true);
});

t("IW12 known index event before freeze is eligible context",()=>{
  const r=validatePassiveEventTiming({announcedAt:"2026-09-20",firstKnownAt:"2026-09-20",effectiveAt:"2026-10-05",predictorFreezeAt:"2026-10-01",replaySafe:true});
  assert.equal(r.status,"INDEX_EVENT_CONTEXT_ELIGIBLE");
});

t("IW13 event announced after freeze is post hoc",()=>{
  const r=validatePassiveEventTiming({announcedAt:"2026-10-02",firstKnownAt:"2026-10-02",predictorFreezeAt:"2026-10-01",replaySafe:true});
  assert.equal(r.status,"POST_HOC_INDEX_EVENT_NOT_ELIGIBLE");
});

t("IW14 replay unsafe passive event is blocked",()=>{
  assert.equal(validatePassiveEventTiming({replaySafe:false}).status,"DATA_BLOCKED");
});

t("IW15 denominator preserves broad and narrow states",()=>{
  const r=buildIndexContextDenominator([{state:"BROAD_MARKET_CONFIRMATION"},{state:"NARROW_MEGA_CAP_LED_CONFIRMATION"}]);
  assert.equal(r.total,2);
  assert.equal(r.counts.BROAD_MARKET_CONFIRMATION,1);
});

t("IW16 broad-only filtering is prohibited",()=>{
  assert.equal(buildIndexContextDenominator([{state:"BROAD_MARKET_CONFIRMATION"}]).broadOnlyFilteringAllowed,false);
});

t("IW17 multiple index diagnostics remain one default evidence family",()=>{
  assert.equal(buildIndexContextDenominator([{state:"BROAD_MARKET_CONFIRMATION"},{state:"MIXED_PARTICIPATION"}]).effectiveIndependentEvidenceCount,1);
});

t("IW18 cap weighted return missing does not force neutral",()=>{
  const r=classifyParticipationContext({});
  assert.equal(r.state,"INDEX_CONTRIBUTION_UNKNOWN");
});

t("IW19 concentration without broad data cannot invent broad confirmation",()=>{
  const r=classifyParticipationContext({capWeightedReturn:1,top1ContributionShare:0.8});
  assert.equal(r.state,"MARKET_CONFIRMATION_BREADTH_UNKNOWN");
});

t("IW20 current-weight backfill cannot pass without historical knownAt",()=>{
  const r=validateHistoricalWeight({historicalWeight:0.2,historicalWeightKnownAt:"",predictorFreezeAt:"2026-10-01",replaySafe:true});
  assert.equal(r.status,"UNKNOWN");
});

console.log(`SUMMARY ${pass}/20 PASS`);
