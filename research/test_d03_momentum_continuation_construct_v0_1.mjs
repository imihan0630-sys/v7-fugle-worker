import assert from 'node:assert/strict';

const pre=Array.from({length:21},(_,i)=>100+i);
assert.equal(pre[0],100);
assert.equal(pre.at(-1),120);

const future=[119,118,117,116,115];
const series=[...pre,...future];
const t=20;

const ret=(a,b)=>a/b-1;
const currentRet20=ret(series[t],series[t-20]);
const forwardD5=ret(series[t+5],series[t]);
const rollingRet20AtD5=ret(series[t+5],series[t+5-20]);

assert.ok(Math.abs(currentRet20-0.20)<1e-12);
assert.ok(Math.abs(forwardD5-(-1/24))<1e-12);
assert.ok(Math.abs(rollingRet20AtD5-(115/105-1))<1e-12);
assert.ok(currentRet20>0);
assert.ok(forwardD5<0);
assert.ok(rollingRet20AtD5>0);

const parent={
  decisionAt:'2026-10-02T13:30:00+08:00',
  symbol:'TEST',
  ret20:currentRet20,
  ret60:null,
  futureOutcomes:undefined
};
assert.equal(Object.hasOwn(parent,'futureOutcomes'),true);
assert.equal(parent.futureOutcomes,undefined);

const rankRetention={
  nextRankState:'RETAINED_WINNER',
  economicForwardReturnD5:-0.02
};
assert.equal(rankRetention.nextRankState,'RETAINED_WINNER');
assert.ok(rankRetention.economicForwardReturnD5<0);

console.log(JSON.stringify({
 status:'PASS',
 witness:{
   currentRet20Pct:currentRet20*100,
   forwardD5Pct:forwardD5*100,
   rollingRet20AtD5Pct:rollingRet20AtD5*100
 },
 conclusion:'ROLLING_RET20_SIGN_RETENTION_DOES_NOT_IDENTIFY_POST_DECISION_CONTINUATION'
},null,2));
