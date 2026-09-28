import assert from "node:assert/strict";
import fs from "node:fs";
import {inverseHhiEffectiveNames,effectiveBetsEligibility,classifyDiversificationEvidence} from "../research/effective_bets_semantic_firewall_v0_1.mjs";

let x=inverseHhiEffectiveNames(0.377238);
assert.equal(x.status,"READY");
assert.equal(x.independentBets,false);
assert.ok(x.concentrationEffectiveNames>2&&x.concentrationEffectiveNames<3);

x=effectiveBetsEligibility({
 covarianceEvidence:"READY",alignedReturnHistory:"READY",riskFactorDefinition:"READY",factorRiskContribution:"READY"
});
assert.equal(x.independentBetsClaimAllowed,true);

x=effectiveBetsEligibility({
 covarianceEvidence:"UNKNOWN",alignedReturnHistory:"READY",riskFactorDefinition:"READY",factorRiskContribution:"READY"
});
assert.equal(x.independentBetsClaimAllowed,false);
assert.deepEqual(x.missing,["covarianceEvidence"]);

const receipt=JSON.parse(fs.readFileSync("research/portfolio_risk_tier_a_history_v0_3_receipt_20260927.json","utf8"));
const out=classifyDiversificationEvidence({
 capitalHhi:null,
 riskHhi:receipt.keyFinding.currentProjectedRiskHHI,
 covarianceEvidence:"UNKNOWN",
 alignedReturnHistory:"UNKNOWN",
 riskFactorDefinition:"UNKNOWN",
 factorRiskContribution:"UNKNOWN"
});
assert.equal(out.projectedRisk.status,"READY");
assert.equal(out.effectiveBetsEligibility.independentBetsClaimAllowed,false);

const src=fs.readFileSync("research/portfolio_risk_tier_a_v0_2.mjs","utf8");
assert.ok(src.includes("effectiveCapitalNames"));
assert.ok(src.includes("CONCENTRATION_WITHIN_DEPLOYED_RISKY_CAPITAL"));

console.log(JSON.stringify({
 ok:true,
 productionWitness:{
   scanDate:receipt.keyFinding.scanDate,
   projectedRiskHHI:receipt.keyFinding.currentProjectedRiskHHI,
   concentrationEffectiveNames:out.projectedRisk.concentrationEffectiveNames
 },
 conclusion:"1/HHI is a concentration-equivalent count only; Effective Bets remains unavailable without PIT covariance/factor decomposition."
},null,2));
