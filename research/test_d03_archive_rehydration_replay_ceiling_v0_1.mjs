import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec = JSON.parse(fs.readFileSync(new URL('./d03_archive_rehydration_replay_ceiling_cases_20261010_v0_1.json', import.meta.url), 'utf8'));

function decide(t) {
  const x = t.input ?? t;
  if (t.kind === 'archive') {
    if (x.zipHash === false || x.jsonHash === false || x.duplicateKeys) return 'REJECT_ARCHIVE';
    if (x.inferOriginalPIT) return 'REJECT_CLOCK_LAUNDERING';
    if (x.inferHotD1Presence) return 'REJECT_STORAGE_LAUNDERING';
    if (x.inferOOS) return 'REJECT_SAMPLE_OVERPROMOTION';
    if (x.independentValidator && x.sameObservationRoot) return 'VALIDATOR_INDEPENDENT_SOURCE_NOT_INDEPENDENT';
    if (x.zipHash && x.jsonHash && x.identityHash && x.valueHash) return 'REHYDRATION_REPRODUCIBLE';
  }
  if (t.kind === 'depth') {
    const required = spec.minimumDepth[t.indicator];
    if (t.available < required) return 'INSUFFICIENT_HISTORY';
    if (!t.lineageReady) return 'ARITHMETIC_POSSIBLE_LINEAGE_BLOCKED';
    if (t.indicator === 'RET5') return 'MECHANISM_REPLAY_ONLY';
    return 'INDICATOR_INPUT_READY_NOT_OUTCOME_EVIDENCE';
  }
  if (t.kind === 'timeframe' && (!t.intradayLineage || !t.weeklyFinality)) return 'MULTITIMEFRAME_UNAVAILABLE';
  if (t.kind === 'divergence' && (!t.confirmedPivots || !t.clockBound)) return 'DIVERGENCE_UNAVAILABLE';
  return 'UNKNOWN';
}

assert.equal(spec.archive.marketDateReceipts, 12);
assert.equal(spec.archive.uniqueStockDateKeys, 11843);
assert.equal(spec.archive.completedDates, 6);
assert.equal(spec.archive.qualifiedOriginalFirstKnownKeys, 0);
assert.equal(spec.cases.length, 20);
for (const t of spec.cases) assert.equal(decide(t), t.expected, t.id);
assert.equal(spec.maturityPct, 56.7);
assert.equal(spec.formalCoreImpact, 'NONE_LOCKED');

console.log(JSON.stringify({
  status: 'PASS',
  cases: spec.cases.length,
  archiveKeys: spec.archive.uniqueStockDateKeys,
  completedDates: spec.archive.completedDates,
  originalPitQualifiedKeys: spec.archive.qualifiedOriginalFirstKnownKeys,
  hotD1Scout: spec.archive.hotD1Scout,
  hotD1Census: spec.archive.hotD1Census,
  maturityPct: spec.maturityPct,
  formalCoreImpact: spec.formalCoreImpact
}));
