import assert from "node:assert/strict";
import {evaluatePve286Clock as gate} from "../research/d02_pve286_system1_first_eligible_acceptance_clock_v0_1.mjs";
const deploy="2026-10-08T03:48:42Z"; // 11:48:42 Asia/Taipei merge to main
let r=gate({mainAvailableAt:deploy,scheduledRunAt:"2026-10-07T16:10:00Z",eventName:"schedule",schedule:"10 16 * * 1-5",scanDate:"2026-10-07"});
assert.equal(r.pass,false);assert.ok(r.reasons.includes("RUN_NOT_POST_DEPLOY"));
r=gate({mainAvailableAt:deploy,scheduledRunAt:"2026-10-08T16:10:00Z",eventName:"schedule",schedule:"10 16 * * 1-5",scanDate:"2026-10-08"});
assert.equal(r.pass,true);assert.equal(r.scheduledTaipeiDate,"2026-10-09");assert.equal(r.scanDate,"2026-10-08");
assert.equal(r.mayBecomeGenuineProspective,true);assert.equal(r.cleanProspectiveDateIncrementAuthorized,false);assert.equal(r.requiresPhysicalOperationalReceipt,true);
assert.equal(gate({mainAvailableAt:deploy,scheduledRunAt:"2026-10-08T16:10:00Z",eventName:"workflow_dispatch",schedule:"10 16 * * 1-5",scanDate:"2026-10-08"}).pass,false);
assert.equal(gate({mainAvailableAt:deploy,scheduledRunAt:"2026-10-08T16:10:00Z",eventName:"schedule",schedule:"OTHER",scanDate:"2026-10-08"}).pass,false);
assert.equal(gate({mainAvailableAt:deploy,scheduledRunAt:"2026-10-08T16:10:00Z",eventName:"schedule",schedule:"10 16 * * 1-5",scanDate:"2026-10-07"}).pass,false);
assert.equal(gate({mainAvailableAt:deploy,scheduledRunAt:"2026-10-08T16:11:00Z",eventName:"schedule",schedule:"10 16 * * 1-5",scanDate:"2026-10-08"}).pass,false);
assert.equal(r.maturityPromotionAuthorized,false);assert.equal(r.formalCoreChangeAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:14,firstEligibleScheduledTaipei:"2026-10-09T00:10:00+08:00",candidateScanDate:"2026-10-08"}));
