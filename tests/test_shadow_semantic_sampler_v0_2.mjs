import assert from "node:assert/strict";
import {classifyShadowSemanticPopulation,sampleMembership,sampleMembershipV2} from "../research/shadow_semantic_classifier_v0_1.mjs";

function ranking(n){return {priorityScore:100-n,rewardPerRisk:2,marketConsensusScore:50,setupQuality:70,sectorFlow:60,relativeStrength:55};}
const states=[];
for(let i=1;i<=8;i++) states.push({symbol:String(1000+i),pool:"GENERAL",formalOk:true,selected:i===1,broadFrameEligible:true,ranking:ranking(i)});
for(let i=1;i<=5;i++) states.push({symbol:String(9000+i),pool:"THOUSAND",formalOk:true,selected:i===1,broadFrameEligible:true,ranking:ranking(i)});
for(const [symbol,pool,nearestChannel,checkPattern] of [
  ["3001","GENERAL","A","A:111110|B:000000"],
  ["3002","GENERAL","A","A:111110|B:000000"],
  ["3003","GENERAL","B","A:000000|B:111110"],
  ["3004","GENERAL","B","A:000000|B:111110"],
  ["9301","THOUSAND","A","A:111110|B:000000"],
  ["9302","THOUSAND","A","A:111110|B:000000"]
]){
  states.push({symbol,pool,formalOk:false,basePassed:true,firstFailure:"AB_SETUP",channelNearMiss:true,broadFrameEligible:true,nearestChannel,checkPattern});
}
const p=classifyShadowSemanticPopulation({scanDate:"2026-09-29",decisionStates:states});
const frozen=JSON.stringify(p.counts);

// Legacy sampler is retained only for backward compatibility; it is global lexicographic cap and can starve a pool.
const legacy=sampleMembership(p,"BROAD_MARKET_FRAME_ELIGIBLE",3);
assert.equal(legacy.length,3);
assert.equal(new Set(legacy.map(x=>x.pool)).size,1);

// v0.2 samples each pool independently and preserves denominators.
const broad=sampleMembershipV2(p,"BROAD_MARKET_FRAME_ELIGIBLE",{capPerStratum:2,stratumKeys:["pool"]});
assert.equal(broad.strata.length,2);
assert.equal(broad.rows.filter(x=>x.pool==="GENERAL").length,2);
assert.equal(broad.rows.filter(x=>x.pool==="THOUSAND").length,2);
assert.equal(broad.semanticPopulationCount,p.counts.byMembership.BROAD_MARKET_FRAME_ELIGIBLE);
assert.equal(JSON.stringify(p.counts),frozen);

// Input order does not change deterministic hash membership.
const p2=classifyShadowSemanticPopulation({scanDate:"2026-09-29",decisionStates:[...states].reverse()});
const broad2=sampleMembershipV2(p2,"BROAD_MARKET_FRAME_ELIGIBLE",{capPerStratum:2,stratumKeys:["pool"]});
assert.deepEqual(
  broad.rows.map(x=>x.symbol).sort(),
  broad2.rows.map(x=>x.symbol).sort()
);

// Near-miss refuses a weaker pool-only frame and requires pool x nearestChannel x checkPattern.
assert.throws(
  ()=>sampleMembershipV2(p,"CHANNEL_NEAR_MISS",{capPerStratum:1,stratumKeys:["pool"]}),
  /requires-pool-nearestChannel-checkPattern/
);
const near=sampleMembershipV2(p,"CHANNEL_NEAR_MISS",{
  capPerStratum:1,stratumKeys:["pool","nearestChannel","checkPattern"]
});
assert.equal(near.strata.length,3);
assert.equal(near.sampledCount,3);
assert.ok(near.strata.every(x=>x.sampledCount===1));
assert.equal(near.semanticPopulationCount,6);

// Outcome-like arbitrary strata are forbidden.
assert.throws(
  ()=>sampleMembershipV2(p,"BROAD_MARKET_FRAME_ELIGIBLE",{stratumKeys:["forwardReturn"]}),
  /unsafe-or-unregistered-stratum-key/
);

console.log(JSON.stringify({
  ok:true,
  legacyPoolStarvationWitness:true,
  stratifiedPoolCoverage:true,
  nearMissRequiredStrata:true,
  inputOrderInvariant:true,
  denominatorsFrozen:true,
  outcomeStrataRejected:true,
  formalCoreImpact:false
},null,2));
