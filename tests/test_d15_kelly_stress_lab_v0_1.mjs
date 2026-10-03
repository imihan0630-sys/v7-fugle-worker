import assert from "node:assert/strict";
import {gridScenarioKelly} from "../research/d15_kelly_eligibility_validator_v0_1.mjs";
import {fractionalKelly,estimationStress,worstCaseByLambda,drawdownConstrainedGrid,shrinkScenarioProbabilities} from "../research/d15_kelly_stress_lab_v0_1.mjs";

assert.equal(fractionalKelly({fullFraction:.4,lambda:.5}),.2);

const estimated=[{p:.60,r:1},{p:.40,r:-1}];
const full=gridScenarioKelly({scenarios:estimated,maxFraction:.9,step:.001});
assert.ok(Math.abs(full.fraction-.2)<=.002);

const stressed=[
 [{p:.60,r:1},{p:.40,r:-1}],
 [{p:.55,r:1},{p:.45,r:-1}],
 [{p:.50,r:1},{p:.50,r:-1}],
 [{p:.45,r:1},{p:.55,r:-1}]
];
const s=estimationStress({estimatedScenarios:estimated,trueScenarioSets:stressed,maxFraction:.9,step:.001,lambdas:[1,.75,.5,.25,0]});
const worst=worstCaseByLambda(s);
const fullWorst=worst.find(x=>x.lambda===1);
const halfWorst=worst.find(x=>x.lambda===.5);
assert.ok(halfWorst.expectedLogGrowth>fullWorst.expectedLogGrowth);

const loose=drawdownConstrainedGrid({scenarios:estimated,maxFraction:.9,step:.001,maxOnePeriodLoss:.3});
const tight=drawdownConstrainedGrid({scenarios:estimated,maxFraction:.9,step:.001,maxOnePeriodLoss:.1});
assert.ok(tight.fraction<=loose.fraction);

const shrunk=shrinkScenarioProbabilities({scenarios:estimated,lambda:0});
assert.ok(Math.abs(shrunk[0].p-.5)<1e-12 && Math.abs(shrunk[1].p-.5)<1e-12);
const shrunkKelly=gridScenarioKelly({scenarios:shrunk,maxFraction:.9,step:.001});
assert.equal(shrunkKelly.fraction,0);

console.log(JSON.stringify({full,stress:s,worst,drawdown:{loose,tight}},null,2));
console.log("D15-19 Kelly stress lab tests PASS");
