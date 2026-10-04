import assert from 'node:assert/strict';
import {buildSystem1AtrGateDecompositionAudit as audit} from '../research/system1_atr_gate_decomposition_audit_v0_1.mjs';

const base={sessionDate:'2026-10-05',generationId:'C1:g',decisionAt:'2026-10-05T08:00:00Z',researchOnly:true,decisionImpact:false,formalCoreImpact:false};
const mk=(symbol,{atr,channel='A',ab='PASS',target='PASS',rr='PASS',grade='PASS',close=100,mcap=200,selected=false}={})=>({
 raw:{symbol,feature:{atrPercent:atr,close,marketCapYi:mcap},derived:{
   setupState:{A:{pass:channel==='A'},B:{pass:channel==='B'}},rewardPerRisk:rr==='PASS'?2.5:1.5,setupQuality:grade==='PASS'?75:60}},
 obs:{symbol,pool:close>=1000?'THOUSAND':'GENERAL',firstFailureReason:null,formalResult:{ok:selected,selected},gates:{
   ATR_QUALITY:{status:atr===null?'UNKNOWN':atr>=1&&atr<=10?'PASS':'FAIL'},
   AB_SETUP:{status:ab},TARGET_AVAILABLE:{status:target},REWARD_RISK:{status:rr},FINAL_SIGNAL_GRADE:{status:grade}
 }}
});
const cases=[
 mk('LOW',{atr:.8,channel:'A',rr:'PASS'}),
 mk('LOW2',{atr:.5,channel:'B',target:'FAIL',rr:'NOT_EVALUABLE',grade:'NOT_EVALUABLE'}),
 mk('PASS',{atr:3,channel:'A',selected:true}),
 mk('HIGH',{atr:12,channel:'B',rr:'PASS'}),
 mk('HIGH2',{atr:15,channel:'A',rr:'FAIL',grade:'NOT_EVALUABLE'}),
 mk('UNK',{atr:null,channel:'A',ab:'UNKNOWN',target:'UNKNOWN',rr:'UNKNOWN',grade:'UNKNOWN'}),
 mk('TH',{atr:5,channel:'B',close:1200,mcap:50})
];
const adapted={...base,rows:cases.map(x=>x.raw)};
const diagnosis={...base,schemaVersion:'SYSTEM1_C1_ISOLATED_V0_1',observations:cases.map(x=>x.obs)};
const ff={perGate:{ATR_QUALITY:{firstFailureN:1,observedFailN:4,hiddenBehindOtherFirstFailureN:3}}};
const x=audit({adapted,diagnosis,firstFailureMasking:ff});
assert.equal(x.overall.n,7);
assert.equal(x.overall.states.LOW_ATR_FAIL,2);
assert.equal(x.overall.states.HIGH_ATR_FAIL,2);
assert.equal(x.overall.states.PASS,2);
assert.equal(x.overall.states.UNKNOWN,1);
assert.equal(x.downstreamAmongFails.atrFailN,4);
assert.equal(x.downstreamAmongFails.rrPassN,2);
assert.equal(x.downstreamAmongFails.rrPassBySide.LOW_ATR_FAIL,1);
assert.equal(x.downstreamAmongFails.rrPassBySide.HIGH_ATR_FAIL,1);
assert.equal(x.byChannel.A.states.LOW_ATR_FAIL,1);
assert.equal(x.byChannel.B.states.HIGH_ATR_FAIL,1);
assert.equal(x.byPool.THOUSAND.n,1);
assert.equal(x.byCapBand.CAP_30_100.n,1);
assert.equal(x.firstFailureMasking.hiddenBehindEarlierFirstFailureN,3);
assert.equal(x.observerParityMismatchN,0);
assert.equal(x.evidenceTrust,'ATR_PARITY_VERIFIED');
assert.equal(x.economicSuperiority,'UNKNOWN');
assert.equal(x.formalOptimizationCandidate,'NONE');

const bad=structuredClone(diagnosis);
bad.observations[0].gates.ATR_QUALITY.status='PASS';
const y=audit({adapted,diagnosis:bad});
assert.equal(y.observerParityMismatchN,1);
assert.equal(y.evidenceTrust,'DATA_QUALITY_BLOCKED');
assert.throws(()=>audit({adapted:{...adapted,researchOnly:false},diagnosis}),/ATR_GATE_C1_DIAGNOSIS_REQUIRED/);

console.log(JSON.stringify({ok:true,low:x.overall.states.LOW_ATR_FAIL,high:x.overall.states.HIGH_ATR_FAIL,
  rrPassAmongFails:x.downstreamAmongFails.rrPassN,hiddenAtr:x.firstFailureMasking.hiddenBehindEarlierFirstFailureN,
  formalCoreImpact:false}));
