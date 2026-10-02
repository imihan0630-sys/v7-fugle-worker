import assert from 'node:assert/strict';

function roc(cur, lag) {
  assert.ok(cur > 0 && lag > 0);
  return 100 * (cur / lag - 1);
}
function simpleReturn(cur, lag) {
  assert.ok(cur > 0 && lag > 0);
  return cur / lag - 1;
}
function momentumIndex(cur, lag) {
  assert.ok(cur > 0 && lag > 0);
  return 100 * cur / lag;
}
function logReturn(cur, lag) {
  assert.ok(cur > 0 && lag > 0);
  return Math.log(cur / lag);
}
function rank(values) {
  const sorted=[...values].sort((a,b)=>a.value-b.value);
  return new Map(sorted.map((x,i)=>[x.id,i]));
}

const pairs = [
  [100, 110],
  [1000, 1100],
  [20, 23],
  [55.5, 51.2],
  [88, 88],
  [7.2, 9.9],
  [420, 378],
];

for (const [lag,cur] of pairs) {
  const r=roc(cur,lag);
  const s=simpleReturn(cur,lag);
  const m=momentumIndex(cur,lag);
  const l=logReturn(cur,lag);
  assert.ok(Math.abs(r - 100*s) < 1e-12);
  assert.ok(Math.abs(m - (r+100)) < 1e-12);
  assert.ok(Math.abs(l - Math.log1p(r/100)) < 1e-12);
  assert.equal(Math.sign(r), Math.sign(s));
}

const xs=[
  {id:'A', lag:100, cur:110},
  {id:'B', lag:1000, cur:1100},
  {id:'C', lag:20, cur:23},
  {id:'D', lag:80, cur:72},
];
const rocRank=rank(xs.map(x=>({id:x.id,value:roc(x.cur,x.lag)})));
const retRank=rank(xs.map(x=>({id:x.id,value:simpleReturn(x.cur,x.lag)})));
const logRank=rank(xs.map(x=>({id:x.id,value:logReturn(x.cur,x.lag)})));
for(const x of xs){
  assert.equal(rocRank.get(x.id),retRank.get(x.id));
  assert.equal(rocRank.get(x.id),logRank.get(x.id));
}

const priceDiffRank=rank(xs.map(x=>({id:x.id,value:x.cur-x.lag})));
assert.notEqual(priceDiffRank.get('B'),rocRank.get('B'));
assert.ok(roc(23,20) > roc(1100,1000));
assert.ok((1100-1000) > (23-20));

const rawSplitRoc=roc(50,100);
const continuityAdjustedRoc=roc(100,100);
assert.equal(rawSplitRoc,-50);
assert.equal(continuityAdjustedRoc,0);

console.log(JSON.stringify({
  status:'PASS',
  exactIdentities:{
    percentROC_vs_simpleReturn:'ROC=100*retN',
    momentumIndex_vs_ROC:'MOM=ROC+100',
    logReturn_vs_ROC:'logReturn=log1p(ROC/100)'
  },
  priceScaleWitness:{
    A:{lag:100,cur:110,roc:roc(110,100),priceDifference:10},
    B:{lag:1000,cur:1100,roc:roc(1100,1000),priceDifference:100},
    C:{lag:20,cur:23,roc:roc(23,20),priceDifference:3}
  },
  splitWitness:{rawSplitRoc,continuityAdjustedRoc}
},null,2));
