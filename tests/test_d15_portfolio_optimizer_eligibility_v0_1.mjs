import assert from "node:assert/strict";
import {optimizerEligibility,eligibleMethods} from "../research/d15_portfolio_optimizer_eligibility_v0_1.mjs";
const common={decisionAt:"2026-10-01T13:30:00+08:00",opportunitySetId:"O1",constraintsId:"C1",capitalPolicyId:"CAP1"};
let x=optimizerEligibility(common);
assert.equal(x.methods.M0_BASELINE.eligible,true);
assert.equal(x.methods.M2_MEAN_VARIANCE.eligible,false);
assert.equal(x.methods.M3_RISK_PARITY.eligible,false);
assert.equal(x.methods.M5_KELLY.eligible,false);
assert.equal(x.implementation.costStatus,"UNKNOWN");

x=optimizerEligibility({...common,covarianceReceiptId:"CV1"});
assert.equal(x.methods.M3_RISK_PARITY.eligible,true);
assert.equal(x.methods.M2_MEAN_VARIANCE.eligible,false);

x=optimizerEligibility({...common,covarianceReceiptId:"CV1",expectedReturnReceiptId:"ER1",riskBudgetId:"RB1",equilibriumPriorReceiptId:"EQ1",viewReceiptId:"V1",viewConfidenceReceiptId:"VC1",calibratedDistributionReceiptId:"PD1"});
assert.deepEqual(eligibleMethods({...common,covarianceReceiptId:"CV1",expectedReturnReceiptId:"ER1",riskBudgetId:"RB1",equilibriumPriorReceiptId:"EQ1",viewReceiptId:"V1",viewConfidenceReceiptId:"VC1",calibratedDistributionReceiptId:"PD1"}),["M0_BASELINE","M1_RISK_BUDGET","M2_MEAN_VARIANCE","M3_RISK_PARITY","M4_BLACK_LITTERMAN","M5_KELLY"]);
console.log(JSON.stringify(x,null,2));
console.log("D15-16 optimizer eligibility tests PASS");
