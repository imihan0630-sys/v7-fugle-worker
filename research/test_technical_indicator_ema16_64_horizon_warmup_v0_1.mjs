import assert from 'node:assert/strict';

function ema(values,n){
  const out=Array(values.length).fill(null);
  if(values.length<n) return out;
  const alpha=2/(n+1);
  out[n-1]=values.slice(0,n).reduce((a,b)=>a+b,0)/n;
  for(let i=n;i<values.length;i++) out[i]=alpha*values[i]+(1-alpha)*out[i-1];
  return out;
}
function horizon(n){
  const a=2/(n+1);
  return {
    alpha:a,
    meanAge:(1-a)/a,
    halfLife:Math.log(0.5)/Math.log(1-a),
    residual10:Math.log(0.1)/Math.log(1-a),
  };
}
const h16=horizon(16), h64=horizon(64);
assert.ok(Math.abs(h16.meanAge-7.5)<1e-12);
assert.ok(Math.abs(h64.meanAge-31.5)<1e-12);
assert.ok(Math.abs(h16.halfLife-5.5379496247921605)<1e-12);
assert.ok(Math.abs(h64.halfLife-22.17890458960288)<1e-12);

const M=220;
const x=Array.from({length:M},(_,i)=>100+0.08*i+2.0*Math.sin(i*0.17)+0.7*Math.sin(i*0.041));
function final(n,L=null){
  const v=L==null?x:x.slice(-L);
  return ema(v,n).at(-1);
}
const full16=final(16), full64=final(64);
const e16_65=final(16,65);
const e64_65=final(64,65);
const e64_80=final(64,80);
const e64_100=final(64,100);
const e64_150=final(64,150);

assert.ok(Math.abs(e16_65-full16)<0.01);
assert.ok(Math.abs(e64_65-full64)>0.30);
assert.ok(Math.abs(e64_80-full64)>0.10);
assert.ok(Math.abs(e64_100-full64)<0.01);
assert.ok(Math.abs(e64_150-full64)<0.001);

console.log(JSON.stringify({
  status:'PASS',
  horizon:{EMA16:h16,EMA64:h64},
  warmupWitness:{
    EMA16:{full:full16,last65:e16_65,delta65:e16_65-full16},
    EMA64:{
      full:full64,
      last65:e64_65,delta65:e64_65-full64,
      last80:e64_80,delta80:e64_80-full64,
      last100:e64_100,delta100:e64_100-full64,
      last150:e64_150,delta150:e64_150-full64
    }
  }
},null,2));
