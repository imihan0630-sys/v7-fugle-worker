import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec=JSON.parse(fs.readFileSync(new URL('./d03_adx_bollinger_same_parent_admission_matrix_20261006_v0_1.json',import.meta.url),'utf8'));

const allowed=new Set(spec.statuses);
assert.equal(spec.globalRules.availabilityRule,'AVAILABLE_IN_REPOSITORY_DOES_NOT_EQUAL_SAME_PARENT_ADMITTED');
assert.equal(spec.globalRules.zeroNewOrdinaryDailyProviderCallDefault,true);
assert.equal(spec.globalRules.unknownMustRemainUnknown,true);

for(const row of spec.fields){
  assert.ok(allowed.has(row.status),row.field);
  assert.ok(Array.isArray(row.modules)&&row.modules.length>0,row.field);
}

const byField=new Map(spec.fields.map(x=>[x.field,x]));
for(const f of ['atrPercent','ret20','maDistance20Pct','lateStage'])
  assert.equal(byField.get(f)?.status,'SAME_PARENT_PROJECTED',f);

for(const f of ['ret60','volatility20'])
  assert.equal(byField.get(f)?.status,'CONDITIONAL_PARENT_ONLY',f);

for(const f of ['rangeCompressionSlope','trueRangeDryUp','vcpPlatformCompressionGeometry','trendPersistence'])
  assert.notEqual(byField.get(f)?.status,'SAME_PARENT_PROJECTED',f);

assert.equal(byField.get('wilderHlcStateReplay')?.status,'REPLAY_CERTIFICATION_REQUIRED');
assert.equal(spec.moduleAdmission['D03-10'].firstPromotionTarget,true);
assert.equal(spec.moduleAdmission['D03-09'].firstPromotionTarget,false);

function admit(row,parent){
  if(row.status==='SAME_PARENT_PROJECTED'){
    return parent.generationId&&parent.decisionCutoffAt&&parent.sourceLineage&&parent.continuityState&&parent.commonSupportIdentity
      ? 'ADMIT_SAME_PARENT'
      : 'REJECT_PARENT_BINDING_INCOMPLETE';
  }
  if(row.status==='CONDITIONAL_PARENT_ONLY') return 'REJECT_NOT_COMPLETE_PARENT_POPULATION';
  if(row.status==='REPLAY_CERTIFICATION_REQUIRED') return 'REJECT_REPLAY_CERTIFICATION_REQUIRED';
  return 'REJECT_NOT_SAME_PARENT_ADMITTED';
}

const completeParent={generationId:'G1',decisionCutoffAt:'2026-10-07T05:30:00Z',sourceLineage:'S1',continuityState:'CERTIFIED',commonSupportIdentity:'CS1'};
const incompleteParent={...completeParent,decisionCutoffAt:null};

assert.equal(admit(byField.get('atrPercent'),completeParent),'ADMIT_SAME_PARENT');
assert.equal(admit(byField.get('atrPercent'),incompleteParent),'REJECT_PARENT_BINDING_INCOMPLETE');
assert.equal(admit(byField.get('ret60'),completeParent),'REJECT_NOT_COMPLETE_PARENT_POPULATION');
assert.equal(admit(byField.get('rangeCompressionSlope'),completeParent),'REJECT_NOT_SAME_PARENT_ADMITTED');
assert.equal(admit(byField.get('wilderHlcStateReplay'),completeParent),'REJECT_REPLAY_CERTIFICATION_REQUIRED');

assert.equal(spec.evidenceDecision.maturityPct,56.7);
assert.equal(spec.evidenceDecision['D03-09'],'L2_40');
assert.equal(spec.evidenceDecision['D03-10'],'L2_40');
assert.equal(spec.evidenceDecision.rawSourceVersionGate,'2_OF_3');
assert.equal(spec.evidenceDecision.technicalObserverR1,'BLOCKED');
assert.equal(spec.evidenceDecision.outcomes,'CLOSED');
assert.equal(spec.evidenceDecision.formalOptimizationCandidate,'NONE');

console.log(JSON.stringify({
  status:'PASS',
  fieldCount:spec.fields.length,
  sameParentProjected:spec.fields.filter(x=>x.status==='SAME_PARENT_PROJECTED').length,
  conditionalParentOnly:spec.fields.filter(x=>x.status==='CONDITIONAL_PARENT_ONLY').length,
  replayCertificationRequired:spec.fields.filter(x=>x.status==='REPLAY_CERTIFICATION_REQUIRED').length,
  zeroNewOrdinaryDailyProviderCallDefault:true,
  maturityPct:spec.evidenceDecision.maturityPct,
  formalCoreImpact:spec.formalCoreImpact
}));
