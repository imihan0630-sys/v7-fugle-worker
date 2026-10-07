import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec=JSON.parse(fs.readFileSync(new URL('./d03_technical_continuity_history_maturity_map_20261007_v0_1.json',import.meta.url),'utf8'));

assert.equal(spec.maturityDecision.d03MaturityPct,56.7);
assert.equal(spec.maturityDecision.d03_09,'L2_40');
assert.equal(spec.maturityDecision.d03_10,'L2_40');
assert.equal(spec.maturityDecision.rawSourceVersionGate,'2_OF_3');
assert.equal(spec.maturityDecision.technicalObserverR1,'BLOCKED');
assert.equal(spec.maturityDecision.outcomes,'CLOSED');

const allowed=new Set(['ACCEPT','PARTIAL','NOT_PROVEN','PENDING_FRESH_PHYSICAL_REVERIFY','NOT_REVIEWABLE']);
for(const row of spec.marketYearEvidence){
  assert.ok(allowed.has(row.layerA) || allowed.has(row.layerB) || allowed.has(row.layerC));
  if(row.layerA==='ACCEPT' && row.layerB!=='ACCEPT'){
    assert.notEqual(row.d03Credit,'PROMOTION_CONTINUITY');
  }
  if(row.layerC!=='ACCEPT'){
    assert.notEqual(row.d03Credit,'PROMOTION_CONTINUITY');
  }
}
const b=spec.indicatorImplications.bollinger;
const a=spec.indicatorImplications.adx;
assert.equal(b.current,'L2_40');
assert.equal(a.current,'L2_40');
assert.match(b.antiShortcut,/20-session/);
assert.match(a.antiShortcut,/recursive ADX chain/);
assert.match(spec.governingRule,/DOES_NOT_IMPLY_SYMBOL_SESSION_COMPLETENESS/);
assert.match(spec.governingRule,/DOES_NOT_IMPLY_REVISION_KNOWN_AT_COMPLETENESS/);
assert.match(spec.transportResilienceInterpretation.rejected,/Legacy non-equivalent endpoint fallback/);

console.log(JSON.stringify({
  status:'PASS',
  evidenceRows:spec.marketYearEvidence.length,
  d03MaturityPct:spec.maturityDecision.d03MaturityPct,
  d03_09:spec.maturityDecision.d03_09,
  d03_10:spec.maturityDecision.d03_10,
  rawSourceVersionGate:spec.maturityDecision.rawSourceVersionGate
}));
