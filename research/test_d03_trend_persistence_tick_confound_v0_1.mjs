import assert from 'node:assert/strict';

function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function avg(a){return a.reduce((s,x)=>s+x,0)/a.length}
function persistence(closes){
  const close=closes.at(-1);
  const ret=n=>closes.length>=n+1?(close/closes.at(-(n+1))-1)*100:null;
  const ret5=ret(5),ret10=ret(10),ret20=ret(20),ret60=ret(60);
  const ma20=avg(closes.slice(-20)),ma60=avg(closes.slice(-60));
  const r20=closes.slice(-21).map((v,i,a)=>i?(v/a[i-1]-1)*100:null).filter(Number.isFinite);
  const positiveDayRatio20=r20.filter(v=>v>0).length/r20.length*100;
  let peak=-Infinity,maxDrawdown20Pct=null;
  for(const v of closes.slice(-20)){
    peak=Math.max(peak,v);
    const dd=(v/peak-1)*100;
    maxDrawdown20Pct=maxDrawdown20Pct===null?dd:Math.min(maxDrawdown20Pct,dd);
  }
  const positiveHorizonPct=[ret5,ret10,ret20,ret60].filter(v=>v>0).length/4*100;
  const ddQuality=clamp(100+maxDrawdown20Pct*5,0,100);
  const maQuality=((close>ma20?1:0)+(close>ma60?1:0))/2*100;
  const score=positiveDayRatio20*.35+positiveHorizonPct*.25+ddQuality*.2+maQuality*.2;
  return {ret5,ret10,ret20,ret60,positiveDayRatio20,maxDrawdown20Pct,positiveHorizonPct,ddQuality,maQuality,score};
}
function segmented(stair=false){
  const endpoints=[{i:0,v:100},{i:40,v:108},{i:50,v:112},{i:55,v:115},{i:60,v:120}];
  const x=Array(61).fill(null);
  for(let s=0;s<endpoints.length-1;s++){
    const a=endpoints[s],b=endpoints[s+1],len=b.i-a.i;
    if(!stair){
      const g=Math.pow(b.v/a.v,1/len);
      for(let j=0;j<=len;j++)x[a.i+j]=a.v*Math.pow(g,j);
    }else{
      const steps=Math.ceil(len/2),g=Math.pow(b.v/a.v,1/steps);
      for(let j=0;j<=len;j++)x[a.i+j]=a.v*Math.pow(g,Math.ceil(j/2));
    }
  }
  return x;
}
const a=persistence(segmented(false)),b=persistence(segmented(true));
for(const k of ['ret5','ret10','ret20','ret60']) assert.ok(Math.abs(a[k]-b[k])<1e-10);
assert.equal(a.positiveHorizonPct,100);
assert.equal(b.positiveHorizonPct,100);
assert.equal(a.maQuality,100);
assert.equal(b.maQuality,100);
assert.ok(Math.abs(a.score-100)<1e-10);
assert.ok(Math.abs(b.score-84.25)<1e-10);

function tick(p){
  if(p<10)return .01;
  if(p<50)return .05;
  if(p<100)return .1;
  if(p<500)return .5;
  if(p<1000)return 1;
  return 5;
}
function qprice(p){const t=tick(p);return Math.round(p/t)*t}
function quantizedTrend(start,dailyPct=.0008,days=60){
  return Array.from({length:days+1},(_,i)=>qprice(start*Math.pow(1+dailyPct,i)));
}
const expected=[
  [9.5,80,93],
  [20,35,77.25],
  [75,65,87.75],
  [200,35,77.25],
  [750,65,87.75],
  [1200,20,72],
];
for(const [start,pdr,score] of expected){
  const x=persistence(quantizedTrend(start));
  assert.ok(Math.abs(x.positiveDayRatio20-pdr)<1e-10);
  assert.ok(Math.abs(x.score-score)<1e-10);
}

assert.equal(5*.35,1.75);
assert.equal(25*.25,6.25);
assert.equal(50*.20,10);
assert.equal(5*.20,1);

console.log(JSON.stringify({
  status:'PASS',
  sameHorizonWitness:{smooth:a,stair:b},
  tickWitness:expected.map(([start])=>({start,...persistence(quantizedTrend(start))})),
  scoreStepPoints:{onePositiveDay:1.75,oneHorizonSignFlip:6.25,oneMAStateFlip:10,onePctDrawdown:1}
},null,2));
