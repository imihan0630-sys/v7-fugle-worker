import assert from 'node:assert/strict';
import {buildSystem1SetupChannelScaleAudit as audit} from '../research/system1_setup_channel_scale_audit_v0_1.mjs';
const base={sessionDate:'2026-10-05',generationId:'C1:g',decisionAt:'2026-10-05T08:00:00Z',
  researchOnly:true,decisionImpact:false,formalCoreImpact:false};
const d=(channel,score,{selected=false,qualified=false,unknown=false}={})=>({
  derivationVersion:'FORMAL_V8_15_OBSERVED_INPUTS_NO_DECISION_IMPACT',
  setupState:{A:{pass:channel==='A'},B:{pass:channel==='B'}},channel,setupQuality:unknown?null:score
});
const row=(symbol,derived,selected=false,qualified=false,close=100)=>({symbol,feature:{close},derived,formalResult:{selected,ok:qualified}});
const good=audit({...base,rows:[
  row('A1',d('A',64),false,false),
  row('A2',d('A',75,{selected:true,qualified:true}),true,true),
  row('A3',d('A',null,{unknown:true}),false,false),
  row('B1',d('B',69.65,{qualified:true}),false,true),
  row('B2',d('B',90,{selected:true,qualified:true}),true,true,1200),
  row('N1',{setupState:{A:{pass:false},B:{pass:false}},channel:null,setupQuality:null},false,false)
]});
assert.equal(good.status,'VERIFIED');
assert.equal(good.byChannel.A.channelFormedN,3);
assert.equal(good.byChannel.A.setupQualityUnknownN,1);
assert.equal(good.byChannel.A.gradeFailN,1);
assert.equal(good.byChannel.B.gradeFailN,0);
assert.equal(good.byChannel.B.beyondATheoreticalMaxN,1);
assert.equal(good.byChannel.B.selectedBeyondATheoreticalMaxN,1);
assert.equal(good.structuralContract.bSetupPassImpliesGradePassUnderCurrentFormula,true);
assert.equal(good.structuralContract.aSetupPassDoesNotImplyGradePassUnderCurrentFormula,true);
assert.equal(good.interpretation.structuralAsymmetryIsNotProofOfEconomicHarm,true);
assert.equal(good.economicSuperiority,'UNKNOWN');
assert.equal(good.formalOptimizationCandidate,'NONE');

const both=structuredClone(base);both.rows=[row('X',{...d('B',80),setupState:{A:{pass:true},B:{pass:true}}})];
assert.ok(audit(both).violations.some(x=>x.code==='A_B_MUTUAL_EXCLUSIVITY_VIOLATION'));
const mismatch=structuredClone(base);mismatch.rows=[row('X',{...d('A',70),channel:'B'})];
assert.ok(audit(mismatch).violations.some(x=>x.code==='CHANNEL_SETUP_STATE_MISMATCH'));
const badA=structuredClone(base);badA.rows=[row('X',d('A',83))];
assert.ok(audit(badA).violations.some(x=>x.code==='A_SETUP_QUALITY_OUTSIDE_THEORETICAL_PASS_RANGE'));
const badB=structuredClone(base);badB.rows=[row('X',d('B',69.64))];
assert.ok(audit(badB).violations.some(x=>x.code==='B_SETUP_QUALITY_OUTSIDE_THEORETICAL_PASS_RANGE'));
assert.throws(()=>audit({...base,researchOnly:false,rows:[]}),/RESEARCH_FIREWALL/);
console.log(JSON.stringify({ok:true,status:good.status,aGradeFailN:good.byChannel.A.gradeFailN,
  bGradeFailN:good.byChannel.B.gradeFailN,bBeyondAReachN:good.byChannel.B.beyondATheoreticalMaxN,
  formalCoreImpact:false}));
