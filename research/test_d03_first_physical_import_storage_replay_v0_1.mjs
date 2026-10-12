import fs from 'node:fs';
import assert from 'node:assert/strict';

const p=new URL('./d03_first_physical_import_storage_replay_cases_20261012_v0_1.json',import.meta.url);
const x=JSON.parse(fs.readFileSync(p,'utf8'));
const f=x.facts;
assert.equal(x.cases.length,20);
assert.equal(x.maturityPct,56.7);
assert.equal(x.formalCoreImpact,'NONE_LOCKED');
assert.equal(f.sourceA1Bars-f.copiedA1Bars,f.remainingA1Bars);
assert.equal(f.copiedA1Bars*f.barWriteMultiplier+f.copiedBatchRows*f.batchWriteMultiplier,f.meteredBilledWrites);
assert.ok(f.meteredBilledWrites<f.dailyOperationalCeiling);
assert.equal(f.remainingA1Bars*f.barWriteMultiplier,437418);
assert.equal(f.pitCertifiedBars,0);
assert.equal(new Set(x.cases.map(c=>c.id)).size,20);
const byId=Object.fromEntries(x.cases.map(c=>[c.id,c]));
for(const id of ['T01','T02','T05','T08','T16','T17']) assert.equal(byId[id].accept,true,id);
for(const id of ['T03','T04','T06','T07','T09','T10','T11','T12','T13','T14','T15','T18','T19','T20']) assert.equal(byId[id].accept,false,id);
console.log(JSON.stringify({status:'PASS',cases:x.cases.length,copiedA1Bars:f.copiedA1Bars,
 a1StoragePct:Number((100*f.copiedA1Bars/f.sourceA1Bars).toFixed(4)),
 meteredBilledWrites:f.meteredBilledWrites,remainingA1OptimisticWrites:f.remainingA1Bars*f.barWriteMultiplier,
 pitCertifiedBars:f.pitCertifiedBars,maturityPct:x.maturityPct,formalCoreImpact:x.formalCoreImpact}));
