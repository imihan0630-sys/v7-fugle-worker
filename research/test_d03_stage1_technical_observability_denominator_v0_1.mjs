import fs from 'node:fs';
import assert from 'node:assert/strict';

const path = new URL('./d03_stage1_technical_observability_denominator_cases_20261018_v0_1.json', import.meta.url);
const spec = JSON.parse(fs.readFileSync(path, 'utf8'));

const counts = { source: 1972, currentClose: 1946, pairedClose: 1935 };

function evaluate(c) {
  if (c.kind === 'count') return counts[c.input];
  if (c.kind === 'sum') return c.input.reduce((a, b) => a + b, 0);
  if (c.kind === 'missing') return c.input.total - c.input.known;
  if (c.kind === 'nullable') return c.input === null ? 'UNKNOWN_NOT_ZERO' : c.input;
  if (c.kind === 'dateCluster') return c.input.dates;
  if (c.kind === 'outcomeGate') return c.input.outcomeJoined ? 'OPEN' : 'CLOSED';
  if (c.kind === 'formalGate') return Object.values(c.input).every(Boolean) ? 'REVIEWABLE' : 'NO_CANDIDATE';
  if (c.kind === 'status') {
    if (c.input === 'INCOMPLETE') return 'NOT_TECHNICAL_FAILURE';
    if (c.input === 'REJECTED') return 'NOT_NEGATIVE_ALPHA';
    return 'NOT_SELECTED';
  }
  if (c.kind === 'eligibility') {
    const x = c.input;
    if (x.source && x.ordinaryEquity === false) return 'SOURCE_ONLY';
    if (x.pairedClose && x.caComparable === false) return 'CONTINUITY_BLOCKED';
    if (x.exactWindow && x.recursiveState === false) return 'FINITE_ONLY';
    if (x.exactWindow && x.recursiveState && x.pit === false) return 'TECHNICAL_ONLY';
  }
  throw new Error(`Unhandled case ${c.id}`);
}

assert.equal(spec.cases.length, spec.expectedCaseCount);
for (const c of spec.cases) assert.deepEqual(evaluate(c), c.expected, c.id);
assert.equal(spec.outcomesOpen, false);
assert.equal(spec.formalCore, 'LOCKED');
console.log(`PASS ${spec.cases.length}/${spec.expectedCaseCount} ${spec.range}`);
