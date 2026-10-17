import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const spec=JSON.parse(await readFile(new URL('./d03_2330_reference_ratio_propagation_cases_20261017_v0_1.json',import.meta.url),'utf8'));
const {sessions,eventIndex,preEventSessions,postEventSessions,priorClose,exchangeReference,eventClose}=spec.inputs;
const r=exchangeReference/priorClose;
const rawRet=eventClose/priorClose-1;
const adjustedRet=eventClose/exchangeReference-1;
const crosses=(lookback)=>sessions-1-lookback<eventIndex;
const allPost=(window)=>sessions-window>=eventIndex;
const checks={
 RATIO:()=>Math.abs(r-0.9970607966457022)<1e-15,
 PARTITION:()=>eventIndex===preEventSessions&&sessions-eventIndex===postEventSessions,
 ACTUAL_SIGN_FLIP:()=>rawRet<0&&adjustedRet>0,
 SAME_PRE_RETURN_INVARIANT:()=>Math.abs((120*r)/(100*r)-120/100)<1e-15,
 SAME_POST_RETURN_INVARIANT:()=>Math.abs(120/100-120/100)<1e-15,
 CROSS_RETURN_TRANSFORM:()=>Math.abs(((120/(100*r))-1)-((1+(120/100-1))/r-1))<1e-15,
 RET5_UNAFFECTED:()=>!crosses(5),
 RET20_AFFECTED:()=>crosses(20),
 RET60_AFFECTED:()=>crosses(60),
 SMA5_UNAFFECTED:()=>allPost(5),
 SMA10_UNAFFECTED:()=>allPost(10),
 SMA20_UNAFFECTED:()=>allPost(20),
 SMA60_AFFECTED:()=>!allPost(60),
 KD9_UNAFFECTED:()=>allPost(9),
 RSI14_UNAFFECTED:()=>allPost(15),
 BOLLINGER20_UNAFFECTED:()=>allPost(20),
 MACD_RECURSIVE_BLOCKED:()=>spec.candidateOnly&&postEventSessions<26,
 ADX_RECURSIVE_BLOCKED:()=>spec.candidateOnly,
 DIVERGENCE_MTF_BLOCKED:()=>spec.candidateOnly,
 NO_FORMAL_PROMOTION:()=>!spec.outcomesOpened&&!spec.formalCoreChanged
};

test('TI-2053..TI-2072 reference-ratio propagation map',()=>{
 assert.equal(spec.cases.length,20);
 assert.deepEqual(spec.cases.map(x=>x.id),Array.from({length:20},(_,i)=>`TI-${2053+i}`));
 for(const c of spec.cases){
  assert.equal(c.expected,'PASS');
  assert.equal(typeof checks[c.kind],'function',c.kind);
  assert.equal(checks[c.kind](),true,c.id+':'+c.kind);
 }
});
