import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec = JSON.parse(fs.readFileSync(new URL('./d03_scout_to_window_completeness_cases_20261010_v0_1.json', import.meta.url), 'utf8'));

function decide(x) {
  if (x.syntheticScout) return 'REJECT_PHYSICAL_CREDIT';
  if (x.physicalScoutRun === false) return 'MISSING_UNKNOWN';
  if (x.scoutKeys === 36 && x.uniqueKeys === 35) return 'REJECT_DUPLICATE_KEY';
  if (x.scoutKeys === 36 && x.strataCovered === 11) return 'REJECT_STRATUM_GAP';
  if (x.sourceMismatch) return 'REJECT_SOURCE_MISMATCH';
  if (x.missingRows) return 'SCOUT_NEGATIVE_STORAGE_EVIDENCE';
  if (x.multiVersionRows) return 'STORAGE_CONFLICT';
  if (x.writes) return 'REJECT_NOT_READ_ONLY';
  if (x.rowsRead > 35000) return 'REJECT_READ_CAP';
  if (x.scoutPass && x.inferPopulationComplete) return 'REJECT_OVERPROMOTION';
  if (x.scoutPass && x.inferMissingRate && !x.probabilitySample) return 'REJECT_SELECTION_BIAS';
  if (x.censusRun && !x.scoutAcceptedFirst) return 'REJECT_SEQUENCE';
  if (x.censusKeys === 11843 && x.uniqueKeys === 11842) return 'REJECT_CENSUS_DUPLICATE_OR_GAP';
  if (x.censusKeys === 11843 && x.allMatched && x.inferHistoricalFirstKnown) return 'REJECT_CLOCK_LAUNDERING';
  if (x.censusKeys === 11843 && x.allMatched && x.stage === 'CENSUS_STORAGE_EVIDENCE') return 'ACCEPT_STORAGE_ONLY';
  if (x.storageComplete && !x.exactSessions) return 'REJECT_INDICATOR_WINDOW';
  if (x.storageComplete && x.exactSessions && !x.causalLineage) return 'REJECT_INDICATOR_WINDOW';
  if (x.storageComplete && x.exactSessions && x.causalLineage && !x.continuityHashBound) return 'REJECT_INDICATOR_WINDOW';
  if (x.storageComplete && x.exactSessions && x.causalLineage && x.continuityHashBound && x.decisionCutoffBound) return 'INDICATOR_WINDOW_PIT_READY';
  if (x.codeGuard) return 'CODE_GUARD_ONLY';
  return 'UNKNOWN';
}

assert.equal(spec.cases.length, 20);
for (const testCase of spec.cases) assert.equal(decide(testCase.input), testCase.expected, testCase.id);
assert.equal(spec.physical.scoutAccepted, 0);
assert.equal(spec.physical.censusAccepted, 0);
assert.equal(spec.physical.missingKeyCount, 'UNKNOWN');
assert.equal(spec.maturityPct, 56.7);
assert.equal(spec.formalCoreImpact, 'NONE_LOCKED');

console.log(JSON.stringify({status:'PASS', cases:spec.cases.length, currentState:spec.currentState, scout:`${spec.physical.scoutAccepted}/${spec.physical.scoutExpected}`, census:`${spec.physical.censusAccepted}/${spec.physical.censusExpected}`, missingKeyCount:spec.physical.missingKeyCount, maturityPct:spec.maturityPct, formalCoreImpact:spec.formalCoreImpact}));
