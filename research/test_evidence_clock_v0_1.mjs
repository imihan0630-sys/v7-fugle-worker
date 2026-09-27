import assert from "node:assert/strict";
import {
  normalizeEvidenceAsOf,
  normalizeAvailableAt,
  assessPointInTimeAvailability,
} from "./evidence_clock_v0_1.mjs";

assert.deepEqual(
  normalizeEvidenceAsOf("SESSION_DATE","2026-09-29"),
  {asOfKind:"SESSION_DATE",asOfKey:"2026-09-29"}
);
assert.deepEqual(
  normalizeEvidenceAsOf("INSTANT","2026-09-29T16:00:00+08:00"),
  {asOfKind:"INSTANT",asOfKey:"2026-09-29T08:00:00.000Z"}
);
assert.deepEqual(
  normalizeEvidenceAsOf("CALENDAR_MONTH","2026-08"),
  {asOfKind:"CALENDAR_MONTH",asOfKey:"2026-08"}
);
assert.deepEqual(
  normalizeEvidenceAsOf("CALENDAR_QUARTER","2026-Q3"),
  {asOfKind:"CALENDAR_QUARTER",asOfKey:"2026-Q3"}
);

assert.deepEqual(
  normalizeAvailableAt("UNKNOWN",null),
  {availableAtPrecision:"UNKNOWN",availableAt:null}
);
assert.throws(()=>normalizeAvailableAt("UNKNOWN","2026-09-10"),/UNKNOWN_PRECISION_REQUIRES_NULL/);

const cutoff="2026-09-10T16:00:00+08:00";
assert.equal(assessPointInTimeAvailability({
  decisionCutoffAt:cutoff,availableAtPrecision:"INSTANT",availableAt:"2026-09-10T15:00:00+08:00"
}).state,"VALID");
assert.equal(assessPointInTimeAvailability({
  decisionCutoffAt:cutoff,availableAtPrecision:"INSTANT",availableAt:"2026-09-10T17:00:00+08:00"
}).state,"BLOCKED");
assert.equal(assessPointInTimeAvailability({
  decisionCutoffAt:cutoff,availableAtPrecision:"DATE_ONLY",availableAt:"2026-09-09"
}).state,"VALID");
assert.equal(assessPointInTimeAvailability({
  decisionCutoffAt:cutoff,availableAtPrecision:"DATE_ONLY",availableAt:"2026-09-10"
}).state,"UNKNOWN");
assert.equal(assessPointInTimeAvailability({
  decisionCutoffAt:cutoff,availableAtPrecision:"DATE_ONLY",availableAt:"2026-09-11"
}).state,"BLOCKED");
assert.equal(assessPointInTimeAvailability({
  decisionCutoffAt:cutoff,availableAtPrecision:"UNKNOWN",availableAt:null
}).state,"UNKNOWN");

console.log(JSON.stringify({ok:true,clock:"EVIDENCE_CLOCK_PASS"}));
