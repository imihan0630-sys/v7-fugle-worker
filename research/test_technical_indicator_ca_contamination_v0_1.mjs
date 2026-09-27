import assert from "node:assert/strict";
import { computeKD, computeRSI, computeMACD, computeADX, computeBollingerBands } from "./technical_indicator_core_v0_1.mjs";

const mk = close => ({ open:close, high:close*1.01, low:close*0.99, close });
const eventIndex=50;
const raw=Array.from({length:100},(_,i)=>mk(i<eventIndex?100:50));
const continuity=Array.from({length:100},()=>mk(50));

const rawKD=computeKD(raw).values;
const rawRSI=computeRSI(raw).values;
const rawMACD=computeMACD(raw).values;
const rawADX=computeADX(raw).values;
const rawBB=computeBollingerBands(raw).values;

const conKD=computeKD(continuity).values;
const conRSI=computeRSI(continuity).values;
const conMACD=computeMACD(continuity).values;
const conADX=computeADX(continuity).values;
const conBB=computeBollingerBands(continuity).values;

const approx=(a,b,t=1e-10)=>assert.ok(Math.abs(Number(a)-Number(b))<=t,"expected "+b+" got "+a);

for(let i=eventIndex;i<100;i+=1){
  approx(conKD[i].k,50,1e-10);
  approx(conKD[i].d,50,1e-10);
  approx(conRSI[i].rsi,50,1e-10);
  approx(conMACD[i].dif,0,1e-10);
  approx(conMACD[i].histogram,0,1e-10);
  approx(conADX[i].adx,0,1e-10);
  approx(conBB[i].bandWidthPct,0,1e-10);
  assert.equal(conBB[i].percentB,null);
}

assert.equal(rawRSI[eventIndex].rsi,0);
assert.equal(rawRSI[99].rsi,0);
assert.ok(rawADX[90].adx>95);
assert.ok(rawMACD[90].dif<0 && rawMACD[90].histogram>0);
approx(rawBB[69].bandWidthPct,0,1e-10);
assert.ok(rawKD[55].k<10);
assert.ok(Math.abs(rawKD[99].k-50)<1e-5);

console.log(JSON.stringify({ok:true,fixture:"MECHANICAL_RESET_2_TO_1_PASS"}));
