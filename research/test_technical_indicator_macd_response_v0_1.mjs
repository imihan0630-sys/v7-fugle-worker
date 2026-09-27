import assert from "node:assert/strict";
import { computeMACD } from "./technical_indicator_core_v0_1.mjs";

const bars = closes => closes.map(close => ({ open:close, high:close+0.5, low:close-0.5, close }));
const sign = x => Math.abs(Number(x)) < 1e-12 ? 0 : (Number(x) > 0 ? 1 : -1);
const first = (values, predicate, start=0) => {
  for (let i=start;i<values.length;i+=1) if (predicate(values[i],i)) return i;
  return null;
};
const flips = (values,key,start=0) => {
  let previous=0,count=0;
  for (let i=start;i<values.length;i+=1) {
    const s=sign(values[i][key]);
    if (!s) continue;
    if (previous && s!==previous) count+=1;
    previous=s;
  }
  return count;
};
const approx=(a,b,t=1e-10)=>assert.ok(Math.abs(Number(a)-Number(b))<=t,"expected "+b+" got "+a);

const constant=computeMACD(bars(Array(80).fill(100))).values;
assert.equal(flips(constant,"histogram",33),0);
approx(constant.at(-1).dif,0,1e-12);
approx(constant.at(-1).histogram,0,1e-12);

const stepUp=computeMACD(bars([...Array(40).fill(100),...Array(40).fill(110)])).values;
assert.equal(first(stepUp,x=>x.histogram>1e-12,40),40);
assert.equal(first(stepUp,x=>x.histogram<-1e-12,40),54);
assert.ok(stepUp[60].dif>0 && stepUp[60].histogram<0);

const stepDown=computeMACD(bars([...Array(40).fill(110),...Array(40).fill(100)])).values;
for(let i=0;i<stepUp.length;i+=1){
  approx(stepDown[i].dif,-stepUp[i].dif,1e-10);
  approx(stepDown[i].histogram,-stepUp[i].histogram,1e-10);
}

const rampUp=computeMACD(bars(Array.from({length:80},(_,i)=>100+0.5*i))).values;
assert.equal(flips(rampUp,"histogram",33),0);
approx(rampUp.at(-1).dif,3.4857028870135593,1e-10);
assert.ok(Math.abs(rampUp.at(-1).histogram)<0.01);

const rampDown=computeMACD(bars(Array.from({length:80},(_,i)=>140-0.5*i))).values;
for(let i=0;i<rampUp.length;i+=1){
  approx(rampDown[i].dif,-rampUp[i].dif,1e-10);
  approx(rampDown[i].histogram,-rampUp[i].histogram,1e-10);
}

const acceleration=computeMACD(bars(Array.from({length:80},(_,i)=>i<40?100+0.2*i:108+0.8*(i-39)))).values;
assert.ok(acceleration[50].histogram>acceleration[39].histogram);

const vreversal=computeMACD(bars([
  ...Array.from({length:40},(_,i)=>140-i),
  ...Array.from({length:40},(_,j)=>101+j),
])).values;
assert.equal(first(vreversal,x=>x.histogram>1e-12,40),42);
assert.equal(first(vreversal,x=>x.dif>1e-12,40),55);
assert.ok(vreversal[45].histogram>0 && vreversal[45].dif<0);

const choppy=computeMACD(bars(Array.from({length:80},(_,i)=>100+(i%2===0?1:-1)))).values;
assert.equal(flips(choppy,"histogram",33),46);

const noisyTrend=computeMACD(bars(Array.from({length:80},(_,i)=>100+0.5*i+1.5*Math.sin(i*1.3)))).values;
assert.ok(flips(noisyTrend,"histogram",33)>flips(rampUp,"histogram",33));

const shock=computeMACD(bars([...Array(40).fill(100),110,...Array(39).fill(100)])).values;
assert.equal(first(shock,x=>x.histogram<-1e-12,41),44);
assert.equal(first(shock,x=>x.dif<-1e-12,41),49);

const halfShock=computeMACD(bars([...Array(40).fill(100),105,...Array(39).fill(100)])).values;
approx(halfShock[40].dif,shock[40].dif/2,1e-10);
approx(halfShock[40].histogram,shock[40].histogram/2,1e-10);

const staircase=computeMACD(bars([
  ...Array(35).fill(100),110,110,121,121,133.1,133.1,146.41,146.41,161.051,161.051,
  ...Array(35).fill(161.051),
])).values;
assert.ok(staircase[60].dif>0 && staircase[60].histogram<0);

console.log(JSON.stringify({ok:true,profile:"MACD_F1_F12_PASS"}));
