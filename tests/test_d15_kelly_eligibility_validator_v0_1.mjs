import assert from "node:assert/strict";
import {validateKellyInput,binaryKellyFraction,expectedLogGrowth,gridScenarioKelly} from "../research/d15_kelly_eligibility_validator_v0_1.mjs";

const base={
 predictionId:"p1",generationId:"g1",symbol:"2330",
 decisionAt:"2026-10-03T10:00:00+08:00",
 targetDefinition:"frozen",outcomeHorizon:"D5",exitPolicy:"frozen-v1",
 predictionDistribution:{type:"scenario"},
 calibrationMethodId:"cal-v1",calibrationTrainingCutoff:"2026-10-02T23:59:59+08:00",
 commonSupportEligible:true,usesFutureLabel:false,decisionMutatedAfterOutcome:false
};

let x=validateKellyInput(base);
assert.equal(x.status,"ELIGIBLE");
assert.equal(x.enabledVariants.uncertaintyShrunkKelly,false);
assert.equal(x.enabledVariants.portfolioKelly,false);
assert.equal(x.enabledVariants.netOfCostKelly,false);

x=validateKellyInput({...base,calibrationTrainingCutoff:"2026-10-03T10:00:00+08:00"});
assert.equal(x.status,"INELIGIBLE");
assert.ok(x.reasons.includes("CALIBRATION_CUTOFF_NOT_BEFORE_DECISION"));

x=validateKellyInput({...base,usesFutureLabel:true});
assert.equal(x.status,"INELIGIBLE");
assert.ok(x.reasons.includes("LOOKAHEAD_LABEL"));

assert.equal(binaryKellyFraction({p:0.5,b:1}),0);
assert.equal(binaryKellyFraction({p:0.4,b:1}),0);
assert.ok(Math.abs(binaryKellyFraction({p:0.6,b:1})-0.2)<1e-12);

const fair=[{p:.5,r:1},{p:.5,r:-1}];
assert.equal(gridScenarioKelly({scenarios:fair,maxFraction:.9,step:.01}).fraction,0);

const edge=[{p:.6,r:1},{p:.4,r:-1}];
const k=gridScenarioKelly({scenarios:edge,maxFraction:.9,step:.001});
assert.ok(Math.abs(k.fraction-.2)<=.002);

assert.equal(expectedLogGrowth({fraction:1,scenarios:edge}),-Infinity);

console.log("D15-19 Kelly eligibility validator tests PASS");
