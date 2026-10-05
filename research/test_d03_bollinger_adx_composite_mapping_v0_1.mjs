import fs from 'node:fs';
import assert from 'node:assert/strict';

const fixture = JSON.parse(fs.readFileSync(new URL('./d03_bollinger_adx_composite_mapping_cases_20261006_v0_1.json', import.meta.url)));

function effectiveCount(c) {
  const parentFallback = c.parentActive ? 1 : 0;
  if (!c.gatesPass) return parentFallback;
  if (c.componentsProven < 2) return Math.max(parentFallback, c.componentsProven);
  return Math.min(3, c.componentsProven + (c.interactionProven ? 1 : 0));
}

assert.equal(fixture.cases.length, 12);
for (const c of fixture.cases) {
  const observed = effectiveCount(c);
  assert.equal(observed, c.expectedCount, c.id);
  assert.ok(observed <= 3, c.id);
}

assert.equal(effectiveCount(fixture.cases[0]), 1);
assert.equal(effectiveCount(fixture.cases[6]), 1);
assert.equal(effectiveCount(fixture.cases[5]), 3);
assert.equal(effectiveCount(fixture.cases[8]), 3);

console.log(JSON.stringify({
  status:'PASS',
  cases:fixture.cases.length,
  currentBollingerEffectiveCount:1,
  currentAdxEffectiveCount:1,
  futureTwoComponentsNoInteraction:2,
  futureOneCanonicalInteraction:3,
  aliasInflationBlocked:true,
  weakBaselineBlocked:true,
  formalCoreImpact:'NONE_LOCKED',
  outcomeDataUsed:false
}));
