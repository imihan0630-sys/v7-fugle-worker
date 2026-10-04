import assert from "node:assert/strict";
import {assessD03PreParentClockV0_1,auditCurrentD03ClockEnvelopeV0_1} from "../research/d03_pre_parent_continuity_clock_v0_1.mjs";

const parent={scanDate:"2026-10-05",knownAt:"2026-10-05T10:10:30Z"};

const good=assessD03PreParentClockV0_1({parent,sourceCapture:{
 marketDate:"2026-10-05",capturedAt:"2026-10-05T10:09:30Z",continuityState:"CERTIFIED",
 exactVersionObserved:true,firstObservedAtCertified:true,noRevisionGapThroughParent:true,symbolSessionCoverageComplete:true
}});
assert.equal(good.status,"VALID");assert.equal(good.clockLeadMs,60000);

const rawWarmup=assessD03PreParentClockV0_1({parent,sourceCapture:{
 marketDate:"2026-10-05",capturedAt:"2026-10-05T08:30:00Z",continuityState:"UNVERIFIED",
 exactVersionObserved:true,firstObservedAtCertified:true,noRevisionGapThroughParent:false,symbolSessionCoverageComplete:false
}});
assert.equal(rawWarmup.status,"DATA_BLOCKED");assert.ok(rawWarmup.reasons.includes("CONTINUITY_NOT_CERTIFIED"));

const after=assessD03PreParentClockV0_1({parent,sourceCapture:{
 marketDate:"2026-10-05",capturedAt:"2026-10-05T10:35:00Z",continuityState:"CERTIFIED",
 exactVersionObserved:true,firstObservedAtCertified:true,noRevisionGapThroughParent:true,symbolSessionCoverageComplete:true
}});
assert.equal(after.status,"DATA_BLOCKED");assert.ok(after.reasons.includes("SOURCE_CAPTURE_AFTER_PARENT"));

const historicalOnly=assessD03PreParentClockV0_1({parent,sourceCapture:{
 marketDate:"2026-10-05",capturedAt:"2026-10-05T10:09:00Z",continuityState:"CERTIFIED",
 exactVersionObserved:true,firstObservedAtCertified:false,noRevisionGapThroughParent:true,symbolSessionCoverageComplete:true
}});
assert.equal(historicalOnly.status,"DATA_BLOCKED");assert.ok(historicalOnly.reasons.includes("FIRST_OBSERVED_CLOCK_NOT_CERTIFIED"));

const envelope=auditCurrentD03ClockEnvelopeV0_1();
assert.equal(envelope.conclusion,"PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE_NOT_PRESENT");
assert.equal(envelope.bollingerFirstParentReady,false);
assert.equal(envelope.adxFirstParentReady,false);
assert.equal(envelope.continuityCapabilityWorkflows.automaticPreParentScheduleObserved,false);

console.log(JSON.stringify({status:"PASS",good,rawWarmup,after,historicalOnly,envelope},null,2));
