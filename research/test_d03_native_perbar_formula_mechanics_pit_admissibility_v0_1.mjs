import fs from 'node:fs';
import assert from 'node:assert/strict';

const fixture = JSON.parse(fs.readFileSync(new URL('./d03_native_perbar_formula_mechanics_pit_admissibility_cases_20261016_v0_1.json', import.meta.url), 'utf8'));

function classify(c) {
  if (c.pairs !== 122) return 'SOURCE_PAIR_BLOCKED';
  if (c.sessions !== 61) return 'SESSION_WINDOW_BLOCKED';
  if (c.windows !== 1935 || c.bars !== c.windows * c.sessions) return 'BAR_DENOMINATOR_BLOCKED';
  if (!c.rowHash) return 'ROW_INTEGRITY_BLOCKED';
  if (!c.researchCut) return 'SOURCE_CUT_BLOCKED';
  if (c.formalCut) return 'FALSE_FORMAL_PROMOTION_BLOCKED';
  if (c.cfiRows != null) {
    if (!c.cfiSameDate) return 'IDENTITY_VINTAGE_BLOCKED';
    if (c.cfiRows !== c.windows) return 'IDENTITY_COVERAGE_BLOCKED';
    if (!c.cfiEffective) return 'IDENTITY_EFFECTIVE_PERIOD_BLOCKED';
    if (!c.caComplete) return 'CONTINUITY_REVISION_BLOCKED';
    if (c.unknownAsNoEvent) return 'NEGATIVE_EVENT_LAUNDERING_BLOCKED';
  }
  if (c.lookback != null) {
    if (c.exactParentSessions !== c.lookback) return 'EXACT_PARENT_WINDOW_BLOCKED';
    return 'FINITE_WINDOW_MECHANICS_ONLY';
  }
  if (c.indicator === 'ADX14' && !c.adxReplay) return 'ADX_STATE_BLOCKED';
  if (c.historicalAvailability) {
    if (!c.frozen) return 'HISTORICAL_INPUT_NO_FROZEN';
    if (!c.outcomes || !c.costs || !c.oos || !c.redundancy) return 'REDUNDANCY_BLOCKED';
    return 'RESEARCH_CANDIDATE_ONLY';
  }
  if (c.cfiRows != null) return 'CURRENT_RESEARCH_INPUT_ONLY';
  return 'RAW_MECHANICS_ONLY';
}

assert.equal(fixture.outcomesClosed, true);
assert.equal(fixture.formalCore, 'LOCKED');
assert.equal(fixture.cases.length, 20);
for (const c of fixture.cases) assert.equal(classify(c), c.expected, c.id);
console.log(`PASS ${fixture.cases.length}/${fixture.cases.length}`);
