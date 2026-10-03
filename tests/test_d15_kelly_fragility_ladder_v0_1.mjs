import assert from "node:assert/strict";
import {tailFragility,fragilityScore,degradationDecision,tailSurface} from "../research/d15_kelly_fragility_ladder_v0_1.mjs";

const native=[{p:.65,r:.20},{p:.35,r:-.10}];
const mild=tailFragility({nativeScenarios:native,tailProb:.005,tailReturn:-.20,maxFraction:1,step:.001});
const severe=tailFragility({nativeScenarios:native,tailProb:.05,tailReturn:-.80,maxFraction:1,step:.001});
assert.ok(severe.trueOpt.fraction<=mild.trueOpt.fraction);
assert.ok(severe.fractionContraction>=mild.fractionContraction);

const low=fragilityScore({tailContraction:.1,regimeSignFlipRate:.1,dependenceContraction:.1,costEdgeErosion:.1});
const high=fragilityScore({tailContraction:.8,regimeSignFlipRate:.8,dependenceContraction:.8,costEdgeErosion:.8});
assert.ok(high>low);

assert.equal(degradationDecision({eligibility:"INELIGIBLE",fragility:0,robustEdgePositive:true}).tier,"ABSTAIN");
assert.equal(degradationDecision({eligibility:"ELIGIBLE",fragility:.8,robustEdgePositive:true}).tier,"RISK_BUDGET");
assert.equal(degradationDecision({eligibility:"ELIGIBLE",fragility:.6,robustEdgePositive:true}).tier,"QUARTER_KELLY_OR_LOWER");
assert.equal(degradationDecision({eligibility:"ELIGIBLE",fragility:.3,robustEdgePositive:true}).tier,"HALF_KELLY_OR_LOWER");
assert.equal(degradationDecision({eligibility:"ELIGIBLE",fragility:.1,robustEdgePositive:true}).tier,"FULL_KELLY_RESEARCH_COMPARATOR");
assert.equal(degradationDecision({eligibility:"ELIGIBLE",fragility:.1,robustEdgePositive:false}).tier,"RISK_BUDGET");

const surface=tailSurface({nativeScenarios:native,maxFraction:1,step:.005});
assert.equal(surface.length,16);
console.log(JSON.stringify({mild,severe,low,high,surface},null,2));
console.log("D15-19 Kelly fragility ladder tests PASS");
