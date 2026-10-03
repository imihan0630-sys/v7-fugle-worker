import assert from "node:assert/strict";
import {leftTailStress,evaluateEstimatedVsTrue,regimeStress,correlationWitness,kellyKillSwitch} from "../research/d15_kelly_model_risk_firewall_v0_1.mjs";

const base=[{p:.6,r:.20},{p:.4,r:-.10}];
const tail=leftTailStress({scenarios:base,tailReturn:-.80,tailProb:.02});
const x=evaluateEstimatedVsTrue({estimatedScenarios:base,trueScenarios:tail,maxFraction:1,step:.001});
assert.ok(x.trueOpt.fraction<=x.estimatedOpt.fraction);
assert.ok(x.logGrowthRegret>=-1e-12);

const regimes=[
 [{p:.6,r:.20},{p:.4,r:-.10}],
 [{p:.5,r:.20},{p:.5,r:-.10}],
 [{p:.35,r:.20},{p:.65,r:-.10}]
];
const rs=regimeStress({estimatedScenarios:base,regimes,maxFraction:1,step:.001});
assert.ok(rs.regimes[2].trueOpt.fraction<=rs.estimatedOpt.fraction);

const c=correlationWitness({weight:.2});
assert.ok(c.correlatedGrowth<c.independentGrowth);

let k=kellyKillSwitch({
 calibrationEligible:false,distributionEligible:true,tailEvidenceStatus:"KNOWN",
 regimeEvidenceStatus:"KNOWN",dependenceRequired:false,costEvidenceStatus:"KNOWN",executionEvidenceStatus:"KNOWN"
});
assert.equal(k.activeKellyAllowed,false);

k=kellyKillSwitch({
 calibrationEligible:true,distributionEligible:true,tailEvidenceStatus:"UNKNOWN",
 regimeEvidenceStatus:"UNKNOWN",dependenceRequired:true,dependenceEvidenceStatus:"UNKNOWN",
 costEvidenceStatus:"UNKNOWN",executionEvidenceStatus:"UNKNOWN"
});
assert.equal(k.activeKellyAllowed,false);
assert.equal(k.formalCandidateAllowed,false);

k=kellyKillSwitch({
 calibrationEligible:true,distributionEligible:true,tailEvidenceStatus:"KNOWN",
 regimeEvidenceStatus:"KNOWN",dependenceRequired:false,costEvidenceStatus:"UNKNOWN",executionEvidenceStatus:"UNKNOWN"
});
assert.equal(k.activeKellyAllowed,true);
assert.equal(k.formalCandidateAllowed,false);

console.log(JSON.stringify({leftTail:x,regime:rs,correlation:c},null,2));
console.log("D15-19 Kelly model-risk firewall tests PASS");
