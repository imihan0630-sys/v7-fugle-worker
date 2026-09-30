import assert from 'node:assert/strict';

function sma(values, n) {
  return values.map((_, i) => i + 1 < n ? null : values.slice(i-n+1, i+1).reduce((a,b)=>a+b,0)/n);
}
function ema(values, n) {
  const out = Array(values.length).fill(null);
  if (values.length < n) return out;
  out[n-1] = values.slice(0,n).reduce((a,b)=>a+b,0)/n;
  const a = 2/(n+1);
  for (let i=n;i<values.length;i++) out[i]=a*values[i]+(1-a)*out[i-1];
  return out;
}
function wilderSum(values,n){
  const out=Array(values.length).fill(null);
  if(values.length<n) return out;
  out[n-1]=values.slice(0,n).reduce((a,b)=>a+b,0);
  for(let i=n;i<values.length;i++) out[i]=out[i-1]-out[i-1]/n+values[i];
  return out;
}
function adx(high,low,close,n=14){
  const tr=[],pdm=[],mdm=[];
  for(let i=1;i<close.length;i++){
    const up=high[i]-high[i-1], down=low[i-1]-low[i];
    pdm.push(up>down && up>0 ? up : 0);
    mdm.push(down>up && down>0 ? down : 0);
    tr.push(Math.max(high[i]-low[i],Math.abs(high[i]-close[i-1]),Math.abs(low[i]-close[i-1])));
  }
  const trs=wilderSum(tr,n), ps=wilderSum(pdm,n), ms=wilderSum(mdm,n);
  const pdi=trs.map((v,i)=>v==null?null:100*ps[i]/v);
  const mdi=trs.map((v,i)=>v==null?null:100*ms[i]/v);
  const dx=trs.map((v,i)=>{
    if(v==null) return null;
    const den=pdi[i]+mdi[i];
    return den===0?0:100*Math.abs(pdi[i]-mdi[i])/den;
  });
  const out=Array(dx.length).fill(null);
  const first=dx.findIndex(v=>v!=null);
  if(first>=0 && first+n<=dx.length){
    const start=first+n-1;
    out[start]=dx.slice(first,start+1).reduce((a,b)=>a+b,0)/n;
    for(let i=start+1;i<dx.length;i++) out[i]=(out[i-1]*(n-1)+dx[i])/n;
  }
  return {adx:[null,...out], plusDI:[null,...pdi], minusDI:[null,...mdi]};
}
function ohlc(close,spread=0.8){return {high:close.map(x=>x+spread/2),low:close.map(x=>x-spread/2),close};}
function lin(a,b,n){return Array.from({length:n},(_,i)=>a+(b-a)*i/(n-1));}

const prices=Array.from({length:80},(_,i)=>100+0.21*i+1.8*Math.sin(i*0.37));
for(const n of [5,10,20,60]){
  const m=sma(prices,n);
  for(let t=n;t<prices.length;t++){
    const lhs=m[t]-m[t-1];
    const rhs=(prices[t]-prices[t-n])/n;
    assert.ok(Math.abs(lhs-rhs)<1e-10, `SMA identity failed n=${n} t=${t}`);
  }
}
for(const n of [16,64]){
  const e=ema(prices,n), a=2/(n+1);
  for(let t=n;t<prices.length;t++){
    if(e[t-1]==null) continue;
    assert.ok(Math.abs((e[t]-e[t-1])-a*(prices[t]-e[t-1]))<1e-10, `EMA identity failed n=${n} t=${t}`);
  }
}

const N=90;
const smooth=lin(100,120,N);
const choppy=lin(100,120,N).map((x,i)=>x+3*Math.sin(i*(18*Math.PI/(N-1))));
const down=lin(120,100,N);
const flat=Array.from({length:N},(_,i)=>110+3*Math.sin(i*(18*Math.PI/(N-1))));
function lastAdx(c){const q=ohlc(c); return adx(q.high,q.low,q.close,14).adx.at(-1);}
const A={smooth:lastAdx(smooth),choppy:lastAdx(choppy),down:lastAdx(down),flat:lastAdx(flat)};
assert.ok(A.smooth>90 && A.down>90);
assert.ok(A.choppy<30 && A.flat<20);
assert.ok(Math.abs((smooth.at(-1)/smooth[0]-1)-(choppy.at(-1)/choppy[0]-1))<1e-12);

const qUp=ohlc(smooth), qDn=ohlc(down);
const up=adx(qUp.high,qUp.low,qUp.close,14), dn=adx(qDn.high,qDn.low,qDn.close,14);
assert.ok(up.plusDI.at(-1)>up.minusDI.at(-1));
assert.ok(dn.minusDI.at(-1)>dn.plusDI.at(-1));
assert.ok(Math.abs(up.adx.at(-1)-dn.adx.at(-1))<1e-9);

const M=220;
let mixed=Array.from({length:M},(_,i)=>100+0.06*i+1.7*Math.sin(i*0.29)+0.8*Math.sin(i*0.071));
for(let i=150;i<M;i++) mixed[i]=mixed[149]+Array.from({length:i-149},(_,j)=>-0.04+0.55*Math.sin(j*0.43)).reduce((a,b)=>a+b,0);
const high=mixed.map((x,i)=>x+0.6+0.15*Math.sin(i*0.17));
const low=mixed.map((x,i)=>x-0.6-0.12*Math.cos(i*0.13));
const full=adx(high,low,mixed,14).adx.at(-1);
function tailAdx(L){return adx(high.slice(-L),low.slice(-L),mixed.slice(-L),14).adx.at(-1);}
const a65=tailAdx(65), a150=tailAdx(150);
assert.ok(Math.abs(a65-full)>0.5);
assert.ok(Math.abs(a150-full)<0.01);

console.log(JSON.stringify({
  status:'PASS',
  smaIdentity:'EXACT',
  emaSlopeIdentity:'EXACT',
  adxScenario:A,
  warmup:{full,a65,a150,delta65:a65-full,delta150:a150-full}
},null,2));
