import fs from 'node:fs';
import assert from 'node:assert/strict';

const fixtureUrl = new URL('./d03_preopen_source_observation_historical_indicator_pit_cases_20261016_v0_1.json', import.meta.url);
const doc = JSON.parse(fs.readFileSync(fixtureUrl, 'utf8'));

function classify(c) {
  const cut = Date.parse(c.cut);
  const receipt = Date.parse(c.latestReceipt);
  if (c.postOpen) return 'POSTOPEN_NOT_PREOPEN_AUTHORITY';
  if (!(receipt <= cut)) return 'SOURCE_CUT_BLOCKED';
  if (c.pairs !== 122) return 'SOURCE_COMPLETENESS_BLOCKED';
  if (c.rehash !== 122) return 'SOURCE_INTEGRITY_BLOCKED';
  if (c.sessions < 61 && c.lookback == null) return 'SESSION_COVERAGE_BLOCKED';
  if (c.lookback != null && c.sessions < c.lookback) return 'WINDOW_LENGTH_BLOCKED';
  if (c.lookback != null || c.indicator) {
    if (!c.identity) return 'IDENTITY_BLOCKED';
    if (!c.caComplete) return 'CONTINUITY_BLOCKED';
    if (c.indicator === 'ADX14' && !c.adxReplayFrozen) return 'ADX_STATE_BLOCKED';
  }
  if (c.historicalAvailability) {
    if (!c.frozen) return 'HISTORICAL_INPUT_ONLY';
    if (!c.outcomes) return 'FROZEN_NO_OUTCOMES';
    if (!c.costs) return 'OUTCOMES_COST_BLOCKED';
    if (!c.oos) return 'OOS_BLOCKED';
    if (!c.redundancy) return 'REDUNDANCY_BLOCKED';
    return 'RESEARCH_CANDIDATE_ONLY';
  }
  if (c.lookback != null || c.indicator) return 'CURRENT_FORMULA_ONLY';
  return 'CURRENT_SOURCE_OBSERVABLE';
}

assert.equal(doc.outcomesClosed, true);
assert.equal(doc.formalCore, 'LOCKED');
assert.equal(doc.cases.length, 20);
for (const c of doc.cases) assert.equal(classify(c), c.expected, c.id);
console.log(`PASS ${doc.cases.length}/${doc.cases.length}`);
