import assert from "node:assert/strict";
import {classifyShadowSemanticPopulation,sampleMembershipV2} from "../research/shadow_semantic_classifier_v0_1.mjs";

const R={priorityScore:80,rewardPerRisk:3,marketConsensusScore:60,setupQuality:70,sectorFlow:55,relativeStrength:4};
const states=[
  {symbol:"1001",pool:"GENERAL",formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,broadFrameEligible:true,nearestChannel:"A",checkPattern:"A:111110|B:000000"},
  {symbol:"1002",pool:"GENERAL",formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,broadFrameEligible:true,nearestChannel:null,checkPattern:"A:111110|B:000000"},
  {symbol:"1003",pool:"GENERAL",formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,broadFrameEligible:true,nearestChannel:"B",checkPattern:null},
  {symbol:"9001",pool:"THOUSAND",formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,broadFrameEligible:true,nearestChannel:"TIE",checkPattern:"A:111110|B:111110"},
  {symbol:"9999",pool:"UNKNOWN",formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,broadFrameEligible:true,nearestChannel:"A",checkPattern:"A:111110|B:000000"},
  {symbol:"2001",pool:"GENERAL",formalOk:true,selected:false,broadFrameEligible:true,ranking:R}
];
const p=classifyShadowSemanticPopulation({scanDate:"2026-09-29",decisionStates:states});

// Near-miss denominator remains all five semantic members, but only two have a valid preregistered frame.
const near=sampleMembershipV2(p,"CHANNEL_NEAR_MISS",{
  capPerStratum:1,
  stratumKeys:["pool","nearestChannel","checkPattern"]
});
assert.equal(near.semanticPopulationCount,5);
assert.equal(near.validStratumPopulationCount,2);
assert.equal(near.invalidStratumCount,3);
assert.equal(near.samplingFrameComplete,false);
assert.equal(near.sampledCount,2);
assert.deepEqual(near.rows.map(x=>x.symbol).sort(),["1001","9001"]);
assert.ok(near.invalidStratumRows.some(x=>x.symbol==="1002"&&x.issues.some(i=>i.key==="nearestChannel"&&i.reason==="MISSING")));
assert.ok(near.invalidStratumRows.some(x=>x.symbol==="1003"&&x.issues.some(i=>i.key==="checkPattern"&&i.reason==="MISSING")));
assert.ok(near.invalidStratumRows.some(x=>x.symbol==="9999"&&x.issues.some(i=>i.key==="pool"&&i.reason==="INVALID_POOL")));

// An invalid pattern shape is not quietly converted into an UNKNOWN bucket.
const p2=classifyShadowSemanticPopulation({scanDate:"2026-09-29",decisionStates:[
  {symbol:"3001",pool:"GENERAL",formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,nearestChannel:"A",checkPattern:"A:11111|B:000000"}
]});
const bad=sampleMembershipV2(p2,"CHANNEL_NEAR_MISS",{capPerStratum:1,stratumKeys:["pool","nearestChannel","checkPattern"]});
assert.equal(bad.sampledCount,0);
assert.equal(bad.invalidStratumCount,1);
assert.equal(bad.invalidStratumRows[0].issues[0].reason,"INVALID_CHECK_PATTERN");

// Broad frame with pool stratification also fails closed on UNKNOWN pool while preserving denominator.
const broad=sampleMembershipV2(p,"BROAD_MARKET_FRAME_ELIGIBLE",{capPerStratum:10,stratumKeys:["pool"]});
assert.equal(broad.semanticPopulationCount,6);
assert.equal(broad.invalidStratumCount,1);
assert.equal(broad.samplingFrameComplete,false);
assert.equal(broad.rows.some(x=>x.symbol==="9999"),false);

// Fully valid frame remains complete.
const validP=classifyShadowSemanticPopulation({scanDate:"2026-09-29",decisionStates:[
  {symbol:"4001",pool:"GENERAL",formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,nearestChannel:"A",checkPattern:"A:111110|B:000000"},
  {symbol:"9401",pool:"THOUSAND",formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,nearestChannel:"B",checkPattern:"A:000000|B:111110"}
]});
const valid=sampleMembershipV2(validP,"CHANNEL_NEAR_MISS",{capPerStratum:2,stratumKeys:["pool","nearestChannel","checkPattern"]});
assert.equal(valid.samplingFrameComplete,true);
assert.equal(valid.invalidStratumCount,0);
assert.equal(valid.sampledCount,2);

console.log(JSON.stringify({
  ok:true,
  denominatorPreserved:true,
  invalidStrataExcluded:true,
  samplingFrameCompletenessExplicit:true,
  unknownNotSampled:true,
  formalCoreImpact:false
},null,2));
