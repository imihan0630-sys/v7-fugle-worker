import assert from "node:assert/strict";
import {classifyExpectedShortfallClaim} from "../research/expected_shortfall_semantic_firewall_v0_1.mjs";

for(const sourceType of ["PLANNED_STOP_RISK","STOP_DISTANCE","MFE","MAE","STOP_FIRST_RATE"]){
  const x=classifyExpectedShortfallClaim({sourceType,lossDistributionAvailable:false,pointInTimeEligible:true});
  assert.equal(x.status,"NOT_ES_ELIGIBLE");
  assert.ok(x.blockers.includes("SOURCE_IS_NOT_TAIL_LOSS_DISTRIBUTION"));
}
const ok=classifyExpectedShortfallClaim({
 sourceType:"RETURN_LOSS_DISTRIBUTION",
 lossDistributionAvailable:true,confidenceLevel:0.975,horizon:"D5",pointInTimeEligible:true,sufficientTailSample:true
});
assert.equal(ok.status,"ES_RESEARCH_ELIGIBLE");
const noH=classifyExpectedShortfallClaim({
 sourceType:"RETURN_LOSS_DISTRIBUTION",
 lossDistributionAvailable:true,confidenceLevel:0.975,pointInTimeEligible:true,sufficientTailSample:true
});
assert.equal(noH.status,"NOT_ES_ELIGIBLE");
console.log(JSON.stringify({ok:true,rule:"planned stop-risk, MFE/MAE and stop-first metrics cannot be labeled Expected Shortfall without an explicit tail loss distribution, confidence level and horizon"},null,2));
