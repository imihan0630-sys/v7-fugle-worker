import assert from 'node:assert/strict';
import {replayCandidateLoo} from './sda009_c1_atomic_replay_prototype_v0_3.mjs';

const row=(symbol,industry,ch,amt,h=60,a20=100)=>({
  symbol,industry,currentChangePercent:ch,currentTradeValue:amt,
  feature:{historyDays:h,avgAmount20:a20}
});

const base=[row('A','X',10,90),row('B','X',-2,110),row('C','Y',1,150)];
let r=replayCandidateLoo(base,'A');
assert.equal(r.state,'PASS');
assert.equal(r.inclusive.breadth,50);
assert.equal(r.leaveOneOut.breadth,0);
assert.equal(r.inclusive.components.hardGateState,'PASS');
assert.equal(r.leaveOneOut.components.hardGateState,'FAIL');
assert.equal(r.supportState,'SMALL_N_SENSITIVE');
assert.ok(r.attribution.localSelfContribution>0);
assert.ok(r.attribution.maxNormalizerExternality!==0);
assert.equal(r.crossCandidateRankComparability,'UNKNOWN_UNTIL_POLICY_FROZEN');

r=replayCandidateLoo([row('A','X',-2,10),row('B','X',1,10),row('C','X',-2,10),row('D','Y',1,30)],'A');
assert.ok(Math.abs(r.inclusive.breadth-100/3)<1e-9);
assert.equal(r.leaveOneOut.breadth,50);
assert.equal(r.inclusive.components.hardGateState,'FAIL');

r=replayCandidateLoo([row('A','X',-5,10),row('B','X',0,10),row('C','Y',1,20)],'A');
assert.equal(r.inclusive.components.avgChange,'FAIL');
assert.equal(r.leaveOneOut.components.avgChange,'PASS');

r=replayCandidateLoo([row('A','X',1,90,60,100),row('B','X',1,10,60,100),row('C','Y',1,100,60,100)],'A');
assert.equal(r.inclusive.amountVs20DayAverage,0.5);
assert.equal(r.leaveOneOut.amountVs20DayAverage,0.1);

r=replayCandidateLoo([row('A','X',1,10)],'A');
assert.equal(r.state,'UNKNOWN');
assert.equal(r.supportState,'ZERO_PEERS');

r=replayCandidateLoo([{symbol:'A',industry:'X',currentChangePercent:1,feature:{historyDays:60,avgAmount20:100}},row('B','X',1,10)],'A');
assert.equal(r.state,'BLOCKED');
assert.ok(r.blockers.some(x=>x.includes('TRADE_VALUE')));

r=replayCandidateLoo(base,'A',{storedInclusive:{breadth:99,avgChange:4,amountVs20DayAverage:0.5,sectorScore:85}});
assert.equal(r.state,'BLOCKED');
assert.ok(r.blockers.includes('BLOCKED_PARITY_MISMATCH'));

console.log(JSON.stringify({result:'PASS',assertions:18},null,2));
