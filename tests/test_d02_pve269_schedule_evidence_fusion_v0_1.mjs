import assert from "node:assert/strict";
import {deriveAfterMarketScheduleEvidenceV0_1 as derive} from "../research/d02_pve269_schedule_evidence_fusion_v0_1.mjs";

const ok=derive({familyConfigured:true,cronRows:[
 {taipeiClock:"23:35",status:"SUCCESS",skipped:0},
 {taipeiClock:"23:55",status:"SKIPPED",skipped:1}
]});
assert.equal(ok.state,"BUSINESS_EXECUTION_SUCCESS");
assert.equal(ok.scheduleFamilyPass,true);
assert.equal(ok.successfulBusinessExecutionCount,1);

const duplicate=derive({familyConfigured:true,cronRows:[
 {taipeiClock:"23:35",status:"SUCCESS",skipped:0},
 {taipeiClock:"23:55",status:"SUCCESS",skipped:0}
]});
assert.equal(duplicate.state,"DUPLICATE_BUSINESS_EXECUTION");
assert.equal(duplicate.scheduleFamilyPass,false);

const physical=derive({
 familyConfigured:true,cronRows:[],
 lastScanAttempt:{status:"FAILED",generatedAtTaipei:"2026/10/07 23:36:10",error:"D1_ERROR: Your account has exceeded D1's free tier daily row write limit."},
 leaseReceipts:[{updatedAtTaipei:"2026/10/07 23:55:03"}]
});
assert.equal(physical.state,"INVOKED_EXECUTION_FAILED_D1_QUOTA");
assert.equal(physical.invocationProven,true);
assert.equal(physical.primaryAttemptSeen,true);
assert.equal(physical.recoveryLeaseSeen,true);
assert.equal(physical.scheduleFamilyPass,false);

const leaseOnly=derive({familyConfigured:true,cronRows:[],leaseReceipts:[{updatedAtTaipei:"2026/10/07 23:55:03"}]});
assert.equal(leaseOnly.state,"INVOKED_AUDIT_ROW_UNAVAILABLE");
assert.equal(leaseOnly.invocationProven,true);

const missing=derive({familyConfigured:true,cronRows:[]});
assert.equal(missing.state,"UNOBSERVED");
assert.equal(missing.invocationProven,false);

assert.equal(derive({familyConfigured:false,cronRows:[]}).state,"FAMILY_NOT_CONFIGURED");
assert.equal(derive({familyConfigured:true,cronRows:[{taipeiClock:"23:35",status:"FAILED"}]}).state,"INVOKED_EXECUTION_FAILED");
assert.equal(physical.cleanH001DateAuthorized,false);
assert.equal(physical.formalCoreChangeAuthorized,false);

console.log(JSON.stringify({status:"PASS",assertions:17,physical},null,2));
