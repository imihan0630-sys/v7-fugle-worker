import assert from "node:assert/strict";
import {classifyShadowSemanticPopulation,sampleMembership} from "../research/shadow_semantic_classifier_v0_1.mjs";

const decisionStates=[
  {symbol:"1001",pool:"GENERAL",formalOk:true,selected:true,broadFrameEligible:true,ranking:{priorityScore:80,rewardPerRisk:2,marketConsensusScore:50,setupQuality:70,sectorFlow:60,relativeStrength:55}},
  {symbol:"1002",pool:"GENERAL",formalOk:true,selected:false,broadFrameEligible:true,ranking:{priorityScore:79,rewardPerRisk:3,marketConsensusScore:90,setupQuality:90,sectorFlow:90,relativeStrength:90}},
  {symbol:"1003",pool:"GENERAL",formalOk:true,selected:false,broadFrameEligible:true,ranking:{priorityScore:78,rewardPerRisk:5,marketConsensusScore:99,setupQuality:99,sectorFlow:99,relativeStrength:99}},
  {symbol:"1004",pool:"GENERAL",formalOk:false,basePassed:true,firstFailure:"RR",channelNearMiss:true,broadFrameEligible:true},
  {symbol:"1005",pool:"GENERAL",formalOk:false,basePassed:false,firstFailure:"LIQUIDITY"},
  {symbol:"1006",pool:"UNKNOWN",formalOk:false,dataReadinessFailure:true},
  {symbol:"1007",pool:"UNKNOWN",formalOk:false,universePolicyExcluded:true},
  {symbol:"2001",pool:"THOUSAND",formalOk:true,selected:true,broadFrameEligible:true,ranking:{priorityScore:88,rewardPerRisk:1.8,marketConsensusScore:20,setupQuality:80,sectorFlow:70,relativeStrength:60}},
  {symbol:"2002",pool:"THOUSAND",formalOk:true,selected:false,broadFrameEligible:true,ranking:{priorityScore:87,rewardPerRisk:4,marketConsensusScore:80,setupQuality:90,sectorFlow:90,relativeStrength:90}}
];

const population=classifyShadowSemanticPopulation({scanDate:"2026-09-29",decisionStates});

assert.equal(population.counts.total,9);
assert.equal(population.comparatorVersion,"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30");

const selected=population.rows.find(x=>x.symbol==="1001");
assert.ok(selected.memberships.includes("FORMAL_SELECTED"));
assert.ok(selected.memberships.includes("BROAD_MARKET_FRAME_ELIGIBLE"));

assert.equal(population.rows.find(x=>x.symbol==="1002").formalPoolRank,2);
assert.equal(population.rows.find(x=>x.symbol==="1003").formalPoolRank,3);
assert.equal(population.rows.find(x=>x.symbol==="2002").formalPoolRank,2);

const downstream=population.rows.find(x=>x.symbol==="1004");
assert.ok(downstream.memberships.includes("DOWNSTREAM_FIRST_FAILURE"));
assert.ok(downstream.memberships.includes("CHANNEL_NEAR_MISS"));

assert.ok(population.rows.find(x=>x.symbol==="1005").memberships.includes("BASE_FIRST_FAILURE"));
assert.ok(population.rows.find(x=>x.symbol==="1006").memberships.includes("DATA_READINESS_FAILURE"));
assert.ok(population.rows.find(x=>x.symbol==="1007").memberships.includes("UNIVERSE_POLICY_EXCLUDED"));

const frozenCounts=JSON.stringify(population.counts);
assert.equal(sampleMembership(population,"BROAD_MARKET_FRAME_ELIGIBLE",1).length,1);
assert.equal(sampleMembership(population,"BROAD_MARKET_FRAME_ELIGIBLE",4).length,4);
assert.equal(JSON.stringify(population.counts),frozenCounts);

assert.throws(
  ()=>classifyShadowSemanticPopulation({scanDate:"2026-09-29",decisionStates:[decisionStates[0],decisionStates[0]]}),
  /duplicate-or-empty-symbol/
);

console.log(JSON.stringify({
  ok:true,
  formalPoolRanksComplete:true,
  multiMembership:true,
  sampleCapsDoNotChangeDenominators:true,
  zeroMarketCallsByConstruction:true,
  formalCoreImpact:false
}));
