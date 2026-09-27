import assert from "node:assert/strict";
import {classifyCommissionEvidence} from "../research/commission_evidence_classifier_v0_1.mjs";

let x=classifyCommissionEvidence({actualCommissionNTD:20,actualSource:"BROKER_STATEMENT"});
assert.equal(x.status,"ACTUAL");
assert.equal(x.commissionNTD,20);

x=classifyCommissionEvidence({
 brokerCommissionRate:0.001425,brokerMinimumCommissionNTD:20,
 scheduleSource:"BROKER_CONTRACT",executedNotionalNTD:10000
});
assert.equal(x.status,"MODELED");
assert.equal(x.commissionNTD,20);

x=classifyCommissionEvidence({
 brokerCommissionRate:0.001425,brokerMinimumCommissionNTD:20,
 scheduleSource:"BROKER_CONTRACT",executedNotionalNTD:100000
});
assert.equal(x.status,"MODELED");
assert.equal(x.commissionNTD,142.5);

x=classifyCommissionEvidence({
 brokerCommissionRate:0.001425,brokerMinimumCommissionNTD:20,
 executedNotionalNTD:100000
});
assert.equal(x.status,"UNKNOWN");

x=classifyCommissionEvidence({
 brokerCommissionRate:0.001425,scheduleSource:"BROKER_CONTRACT",executedNotionalNTD:100000
});
assert.equal(x.status,"UNKNOWN");

x=classifyCommissionEvidence({executedNotionalNTD:100000});
assert.equal(x.status,"UNKNOWN");

console.log(JSON.stringify({ok:true,cases:6,rule:"actual charged fee outranks broker-specific modeled schedule; missing schedule/minimum stays UNKNOWN"},null,2));
