import assert from "node:assert/strict";
import {classifyMopsSourceClockV0_1} from "../research/d03_mops_source_clock_semantics_v0_1.mjs";

const parent="2026-10-05T10:10:00Z";

const after=classifyMopsSourceClockV0_1({
 sourceReportedAt:"2026-10-05T10:11:00Z",parentKnownAt:parent
});
assert.equal(after.status,"EXCLUDED");
assert.equal(after.pitAvailableByParent,false);

const historicalEarly=classifyMopsSourceClockV0_1({
 sourceReportedAt:"2026-10-05T09:30:00Z",parentKnownAt:parent
});
assert.equal(historicalEarly.status,"HISTORICAL_REPORTED_CLOCK_ONLY");
assert.equal(historicalEarly.pitAvailableByParent,false);
assert.equal(historicalEarly.safeUse,"NOT_BEFORE_EXCLUSION_BOUND_ONLY");

const observedEarly=classifyMopsSourceClockV0_1({
 sourceReportedAt:"2026-10-05T09:30:00Z",
 firstObservedAt:"2026-10-05T09:31:00Z",
 parentKnownAt:parent,
 prospectiveObserverCertified:true
});
assert.equal(observedEarly.status,"VALID_OBSERVED_BY_PARENT");
assert.equal(observedEarly.pitAvailableByParent,true);

const observedLate=classifyMopsSourceClockV0_1({
 sourceReportedAt:"2026-10-05T09:30:00Z",
 firstObservedAt:"2026-10-05T10:12:00Z",
 parentKnownAt:parent,
 prospectiveObserverCertified:true
});
assert.equal(observedLate.status,"OBSERVED_AFTER_PARENT");
assert.equal(observedLate.pitAvailableByParent,false);

console.log(JSON.stringify({status:"PASS",after,historicalEarly,observedEarly,observedLate},null,2));
