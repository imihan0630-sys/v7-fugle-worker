import fs from 'node:fs';
import assert from 'node:assert/strict';

const p=new URL('./d03_observed_zero_vs_missing_semantics_cases_20261012_v0_1.json',import.meta.url);
const x=JSON.parse(fs.readFileSync(p,'utf8'));
assert.equal(x.cases.length,20);
assert.equal(x.inputStates.length,9);
assert.equal(x.maturityPct,56.7);
assert.equal(x.formalCoreImpact,'NONE_LOCKED');
assert.equal(new Set(x.inputStates).size,9);
assert.equal(new Set(x.cases.map(c=>c.id)).size,20);
const byId=Object.fromEntries(x.cases.map(c=>[c.id,c]));
for(const id of ['T02','T03','T05','T08','T10','T13','T15']) assert.equal(byId[id].accept,true,id);
for(const id of ['T01','T04','T06','T07','T09','T11','T12','T14','T16','T17','T18','T19','T20']) assert.equal(byId[id].accept,false,id);
assert.ok(x.inputStates.includes('MISSING_EXPECTED_SESSION'));
assert.ok(x.inputStates.includes('OBSERVED_ZERO'));
assert.ok(x.inputStates.includes('NOT_YET_PUBLISHED'));
console.log(JSON.stringify({status:'PASS',cases:x.cases.length,inputStates:x.inputStates.length,
 maturityPct:x.maturityPct,formalCoreImpact:x.formalCoreImpact}));
