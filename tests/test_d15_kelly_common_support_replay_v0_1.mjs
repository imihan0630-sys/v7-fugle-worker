import assert from "node:assert/strict";
import {validateReplayReceipt,replayKellyReceipt,FROZEN_KELLY_LAMBDAS} from "../research/d15_kelly_common_support_replay_v0_1.mjs";
const base={
 decisionReceiptId:"D1",opportunitySetId:"O1",predictionId:"P1",generationId:"G1",symbol:"2330",
 decisionAt:"2026-01-02T09:00:00+08:00",targetDefinition:"EXIT_POLICY_RETURN",outcomeHorizon:"5D",exitPolicy:"FROZEN",
 predictionDistribution:[{p:.6,r:.1},{p:.4,r:-.05}],calibrationMethodId:"C1",calibrationTrainingCutoff:"2026-01-01T00:00:00+08:00",
 usesFutureLabel:false,decisionMutatedAfterOutcome:false,commonSupportEligible:true,outcomeMatured:true,outcomeFirstKnownAt:"2026-01-09T13:30:00+08:00",
 frozenDecisionUniverseCount:100,maturedEvaluationCount:80
};
assert.equal(validateReplayReceipt(base).eligible,true);
const r=replayKellyReceipt(base,{maxFraction:1,step:.005});
assert.equal(r.status,"READY");
assert.deepEqual(r.challengers.map(x=>x.lambda),FROZEN_KELLY_LAMBDAS);
assert.equal(r.frozenDecisionUniverseCount,100);
assert.equal(r.maturedEvaluationCount,80);
assert.equal(validateReplayReceipt({...base,maturedEvaluationCount:101}).eligible,false);
assert.equal(validateReplayReceipt({...base,outcomeMatured:false}).eligible,false);
assert.equal(replayKellyReceipt({...base,commonSupportEligible:false}).status,"INELIGIBLE");
console.log(JSON.stringify(r,null,2));
console.log("D15-19 common-support replay harness tests PASS");
