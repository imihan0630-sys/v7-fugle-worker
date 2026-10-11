import fs from 'node:fs';
import assert from 'node:assert/strict';

const p=new URL('./d03_migration_batch_indicator_window_atomicity_cases_20261012_v0_1.json',import.meta.url);
const x=JSON.parse(fs.readFileSync(p,'utf8'));
assert.equal(x.cases.length,20);
assert.equal(x.maturityPct,56.7);
assert.equal(x.formalCoreImpact,'NONE_LOCKED');
assert.equal(x.gates.sourceBackupEngineerVerified,true);
assert.equal(x.gates.sourceBackupIndependentAuditAccepted,false);
assert.equal(x.gates.destinationTransferPhysicalVerified,true);
assert.equal(x.gates.destinationImportParityVerified,false);
assert.equal(x.gates.indicatorWindowPitReady,false);
assert.equal(x.facts.fourFifthsLogicalRows,Math.round(x.facts.sourceLogicalRows*0.8));
assert.ok(x.facts.minimumBilledWrites>x.facts.dailyFreeBilledWriteCap);
assert.equal(x.facts.destinationHistoricalRowsImported,0);
const byId=Object.fromEntries(x.cases.map(c=>[c.id,c]));
for(const id of ['T01','T04','T09','T15','T17']) assert.equal(byId[id].accept,true,id);
for(const id of ['T02','T03','T05','T06','T07','T08','T10','T11','T12','T13','T14','T16','T18','T19','T20']) assert.equal(byId[id].accept,false,id);
assert.equal(new Set(x.cases.map(c=>c.id)).size,20);
console.log(JSON.stringify({status:'PASS',cases:x.cases.length,gates:x.gates,
 minimumBilledWrites:x.facts.minimumBilledWrites,dailyCap:x.facts.dailyFreeBilledWriteCap,
 maturityPct:x.maturityPct,formalCoreImpact:x.formalCoreImpact}));
