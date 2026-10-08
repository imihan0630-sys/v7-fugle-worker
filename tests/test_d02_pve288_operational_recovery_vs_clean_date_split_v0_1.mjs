import assert from "node:assert/strict";
import {evaluatePve288 as gate} from "../research/d02_pve288_operational_recovery_vs_clean_date_split_v0_1.mjs";
const base={
 system1OperationalStatus:"OPERATIONAL_RECOVERY_PASS",system1GenuineProspective:true,
 baselineRemediationPhysicalPass:true,baselineRemediationDeployedAt:"2026-10-08T08:00:00+08:00",
 featureCapturedAt:"2026-10-08T10:30:00+08:00",baselineFreshnessIdentityPass:true,
 quotaRemediationPhysicalPass:true,noRetroactiveCredit:true
};
let r=gate(base);assert.equal(r.system1OperationalRecoveryPass,true);assert.equal(r.d02CleanDateEligible,true);
r=gate({...base,baselineRemediationPhysicalPass:false,baselineRemediationDeployedAt:null});assert.equal(r.system1OperationalRecoveryPass,true);assert.equal(r.d02CleanDateEligible,false);assert.ok(r.reasons.includes("BASELINE_REMEDIATION_PHYSICAL_PASS_MISSING"));
r=gate({...base,baselineRemediationDeployedAt:"2026-10-08T14:00:00+08:00"});assert.equal(r.d02CleanDateEligible,false);assert.ok(r.reasons.includes("BASELINE_REMEDIATION_NOT_PRE_FEATURE"));
r=gate({...base,quotaRemediationPhysicalPass:false});assert.equal(r.d02CleanDateEligible,false);assert.ok(r.reasons.includes("QUOTA_REMEDIATION_PHYSICAL_PASS_MISSING"));
r=gate({...base,baselineFreshnessIdentityPass:false});assert.equal(r.d02CleanDateEligible,false);
r=gate({...base,system1OperationalStatus:"BLOCKED",system1GenuineProspective:false});assert.equal(r.d02CleanDateEligible,false);
r=gate({...base,noRetroactiveCredit:false});assert.equal(r.d02CleanDateEligible,false);
assert.equal(gate(base).operationalPassCanSubstituteForCleanDate,false);
assert.equal(gate(base).lateRemediationCanRetroactivelyCleanDate,false);
assert.equal(gate(base).maturityPromotionAuthorized,false);assert.equal(gate(base).formalCoreChangeAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:18}));
