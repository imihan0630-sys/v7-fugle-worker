import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const spec=JSON.parse(readFileSync(new URL('./d03_external_machine_delta_readback_20261006_v0_1.json',import.meta.url)));
const s2=JSON.parse(readFileSync(new URL('../system2/evidence/s2_corr_20261006_004_independent_verification.json',import.meta.url)));
const s1=JSON.parse(readFileSync(new URL('../shared-knowledge/sda022_system1_fingerprint_acceptance_20261006_v0_1.json',import.meta.url)));
const d16=JSON.parse(readFileSync(new URL('./d03_primary_queue_d16_method_handoff_v0_1.json',import.meta.url)));
const s2Runtime=readFileSync(new URL('../system2/runtime/daily_resonance_monitor_v0_1.mjs',import.meta.url),'utf8');
const s1Runtime=readFileSync(new URL('./system1_sda_shadow_v0_1.mjs',import.meta.url),'utf8');

assert.equal(s2.result,'VERIFIED_CLOSED');
for(const [k,v] of Object.entries(spec.system2FreshnessAcceptance)){
  if(k==='requiredResult'||k==='requiredCiPassCount') continue;
  assert.equal(s2.acceptance[k],v,'System2 freshness acceptance drift: '+k);
}
assert.equal(s2.ci.length>=spec.system2FreshnessAcceptance.requiredCiPassCount,true);
for(const run of s2.ci.slice(0,spec.system2FreshnessAcceptance.requiredCiPassCount)){
  assert.equal(run.result,'PASS');
}

for(const f of spec.stillMissingSystem2D03Diagnostics){
  assert.equal(s2Runtime.includes(f),false,'Unexpected System2 D03 diagnostic now present; re-audit required: '+f);
}
for(const f of spec.stillMissingSystem1D03Diagnostics){
  assert.equal(s1Runtime.includes(f),false,'Unexpected System1 D03 diagnostic now present; re-audit required: '+f);
}

assert.equal(s1.scope,'SYSTEM1_POLICY_FINGERPRINT_ONLY');
assert.equal(s1.status,'S22_T01_T05_PASS');
assert.equal(s1.safety.formalCoreImpact,'NONE');
assert.equal(s1.safety.workerRuntimeChanged,false);

for(const [k,v] of Object.entries(spec.expectedD16Current)){
  assert.equal(d16.current[k],v,'D16 D03 gate drift: '+k);
}

assert.equal(spec.maturityImpact,'NONE_56_7_PERCENT');
assert.equal(spec.outcomeDataUsed,false);

console.log(JSON.stringify({
  status:'PASS',
  system2FreshnessPhysicalVerificationAccepted:true,
  system2FreshnessCiPassCount:s2.ci.filter(x=>x.result==='PASS').length,
  system2D03DedupDiagnosticsStillMissing:spec.stillMissingSystem2D03Diagnostics.length,
  system1D03RedundancyDiagnosticsStillMissing:spec.stillMissingSystem1D03Diagnostics.length,
  system1Sda022NotCreditedToD03:true,
  d16Sda022NotCreditedToD03:true,
  rawSourceGate:d16.current.rawSourceVersionGate,
  technicalObserverR1:d16.current.technicalObserverR1,
  outcomes:d16.current.outcomes,
  maturityPct:56.7,
  formalCoreImpact:'NONE_LOCKED'
}));
