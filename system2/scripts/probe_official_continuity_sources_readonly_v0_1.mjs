import assert from "node:assert/strict";
import { probeOfficialContinuitySourceCapabilityV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";

function taipeiDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function shiftDate(date, days) {
  const d = new Date(date + "T00:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const anchor = process.env.SYSTEM2_OFFICIAL_CONTINUITY_ANCHOR_DATE || taipeiDate();
assert.match(anchor, /^\d{4}-\d{2}-\d{2}$/);
const endDate = process.env.SYSTEM2_OFFICIAL_CONTINUITY_END_DATE || shiftDate(anchor, -1);
const startDate = process.env.SYSTEM2_OFFICIAL_CONTINUITY_START_DATE || shiftDate(endDate, -180);
const observedAt = new Date().toISOString();

const capability = await probeOfficialContinuitySourceCapabilityV0_1({
  startDate,
  endDate,
  observedAt,
});

assert.equal(capability.sourceCoverageComplete, false);
assert.equal(capability.noEventMayBeClaimed, false);
assert.equal(capability.symbolSessionCompletenessCertified, false);
assert.equal(capability.technicalContinuityCertified, false);
assert.equal(capability.continuityTransformPerformed, false);
assert.equal(capability.historyMutationPerformed, false);
assert.equal(capability.strategyEvaluationPerformed, false);
assert.equal(capability.capacityRunProduced, false);
assert.equal(capability.zeroPickClaimed, false);
assert.equal(capability.selectionAuthority, false);
assert.equal(capability.finalSelectionEnabled, false);
assert.equal(capability.livePushEnabled, false);
assert.equal(capability.capitalImpact, false);
assert.equal(capability.orderImpact, false);
assert.equal(capability.system1RuntimeUsed, false);

console.log(JSON.stringify({
  result: "PASS",
  probe: "SYSTEM2_OFFICIAL_CONTINUITY_SOURCE_CAPABILITY_V0_1",
  readOnly: true,
  ...capability,
}, null, 2));
