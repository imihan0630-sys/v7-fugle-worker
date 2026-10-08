import assert from "node:assert/strict";
import fs from "node:fs";
import {evaluatePve289Snapshot} from "../research/d02_pve289_external_receipt_convergence_guard_v0_1.mjs";
const x=JSON.parse(fs.readFileSync(new URL("../research/d02_pve289_external_receipt_convergence_snapshot_v0_1.json",import.meta.url),"utf8"));
let r=evaluatePve289Snapshot(x);
assert.equal(r.pass,true);
assert.equal(r.state,"WAITING_EXTERNAL_RECEIPTS");
assert.equal(r.safeToSkipClosedResearch,true);
assert.equal(r.cleanProspectiveDateIncrementAuthorized,false);

const cases=[
 y=>y.lanes.d16PredictiveMethods.validFrozenReceiptCount=1,
 y=>y.lanes.d14D0211CostQuality.receiptObserved=true,
 y=>y.lanes.system1OperationalAcceptance.operationalReceiptObserved=true,
 y=>y.lanes.pve261BaselineRemediation.physicalPassObserved=true,
 y=>y.lanes.corr003QuotaRemediation.state="VERIFIED_CLOSED",
 y=>y.lanes.numericalTargetSource.legalSourceCount=1,
 y=>y.cleanProspectiveDates=1,
 y=>y.gate7="OPEN",
 y=>y.formalCore="UNLOCKED",
 y=>y.forbiddenTransitions=[]
];
for(const mutate of cases){
 const y=structuredClone(x);mutate(y);assert.equal(evaluatePve289Snapshot(y).pass,false);
}
assert.equal(r.maturityPromotionAuthorized,false);
assert.equal(r.formalCoreChangeAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:16,state:r.state}));
