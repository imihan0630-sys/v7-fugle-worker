import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec = JSON.parse(fs.readFileSync(new URL('./d03_c1_official_session_parent_expectation_cases_20261010_v0_1.json', import.meta.url), 'utf8'));

function decide(x) {
  if (x.validDate === false) return 'REJECT_INVALID_DATE';
  if (x.future || x.sameDayUnclosed) return 'REJECT_FUTURE_OR_UNCLOSED';
  if (x.validDate === true && (x.calendarMatch === false || (x.calendarMatch === true && typeof x.trading !== 'boolean')))
    return 'REJECT_CALENDAR_UNVERIFIED';
  if (x.state === 'PARENT_NOT_EXPECTED_NONTRADING' && x.inferZeroPick) return 'REJECT_ZERO_PICK';
  if (x.state === 'PARENT_NOT_EXPECTED_NONTRADING' && x.includeCoverageDenominator) return 'REJECT_DENOMINATOR';
  if (x.state === 'PARENT_EXPECTED_UNVERIFIED' && x.inferFormalScan) return 'REJECT_ELIGIBILITY_AS_EXECUTION';
  if (x.state === 'PARENT_EXPECTED_UNVERIFIED' && x.inferC1) return 'REJECT_ELIGIBILITY_AS_PARENT';
  if (x.publicHttp200 && x.inferC1) return 'REJECT_PUBLIC_RUNTIME_AS_PARENT';
  if (x.historicalManualRead && x.inferProspective) return 'REJECT_BACKFILL_AS_PROSPECTIVE';
  if (x.laterParent && x.backfillEarlierParent) return 'REJECT_PARENT_BACKFILL';
  if (x.state === 'PARENT_VERIFIED') {
    if (!x.immutableC1) return 'REJECT_PARENT_RECEIPT';
    if (!x.v820Binding) return 'REJECT_PARENT_BINDING';
    if (!x.physicalReadback) return 'REJECT_PHYSICAL_READBACK';
    return 'PARENT_ADMISSIBLE';
  }
  if (x.state === 'PARENT_ADMISSIBLE' && x.indicator === 'BOLLINGER20') {
    if (!x.w0) return 'REJECT_INDICATOR_INPUT';
    if (x.exactSessions === 20) return 'INDICATOR_PARENT_READY_NOT_OUTCOME_EVIDENCE';
  }
  if (x.validDate && x.calendarMatch && x.trading === false) return 'PARENT_NOT_EXPECTED_NONTRADING';
  if (x.validDate && x.calendarMatch && x.trading === true) return 'PARENT_EXPECTED_UNVERIFIED';
  return 'UNKNOWN';
}

assert.equal(spec.cases.length, 20);
for (const t of spec.cases) assert.equal(decide(t.input), t.expected, t.id);
assert.equal(spec.maturityPct, 56.7);
assert.equal(spec.formalCoreImpact, 'NONE_LOCKED');

console.log(JSON.stringify({
  status: 'PASS',
  cases: spec.cases.length,
  nonTradingZeroPickAllowed: false,
  eligibleMeansParentVerified: false,
  maturityPct: spec.maturityPct,
  formalCoreImpact: spec.formalCoreImpact
}));
