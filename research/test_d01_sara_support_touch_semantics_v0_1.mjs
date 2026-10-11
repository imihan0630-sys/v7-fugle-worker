import assert from "node:assert/strict";
import {compareSupportTouch} from "./d01_sara_support_touch_semantics_v0_1.mjs";
const bar=(close,low=close-1,high=close+1)=>({open:close,high,low,close});
const flat=()=>Array.from({length:65},()=>bar(100));
const data=(special=100)=>{
 let bs=flat();bs[60]=bar(special,special-1,special+1);
 for(let i=61;i<65;i++)bs[i]=bar(150);
 return bs;
};
const call=(bars,extra={})=>compareSupportTouch({bars,cutoffIndex:64,sourceCertified:true,...extra});
const tests=[
["flat both agree true",()=>{let x=call(flat());assert.equal(x.currentSupportBandTouch,true);assert.equal(x.historicalDynamicSupportTouch,true)}],
["past actual MA60 touch, current-band misses it",()=>{let x=call(data(100));assert.equal(x.currentSupportBandTouch,false);assert.equal(x.historicalDynamicSupportTouch,true)}],
["current band touches but historical MA60 did not",()=>{let x=call(data(104));assert.equal(x.currentSupportBandTouch,true);assert.equal(x.historicalDynamicSupportTouch,false)}],
["first disagreement flagged",()=>assert.equal(call(data(100)).semanticDisagreement,true)],
["second disagreement flagged",()=>assert.equal(call(data(104)).semanticDisagreement,true)],
["same price-root not two votes",()=>assert.equal(call(flat()).effectiveIndependentEvidenceCount,1)],
["identity of earlier touch",()=>assert.deepEqual(call(data(100)).dynamicHitIndices,[60])],
["current-band false means empty legacy hits",()=>assert.deepEqual(call(data(100)).legacyHitIndices,[])],
["appending a future bar must not alter past cutoff",()=>{
 const base=data(100);const a=call(base),b=call([...base,bar(900)]);assert.deepEqual(a,b);
}],
["cannot include late bar by moving cutoff without enough data",()=>assert.equal(call(flat(),{cutoffIndex:65}).reason,"MA60_FIVE_BAR_LOOKBACK_INSUFFICIENT")],
["missing upstream certified source blocks",()=>assert.equal(call(flat(),{sourceCertified:false}).reason,"SOURCE_BAR_VINTAGE_UNCERTIFIED")],
["insufficient 64 physical rows blocked",()=>assert.equal(compareSupportTouch({bars:flat().slice(1),cutoffIndex:63,sourceCertified:true}).reason,"MA60_FIVE_BAR_LOOKBACK_INSUFFICIENT")],
["invalid high-low geometry blocks",()=>{let b=flat();b[61].high=99;assert.equal(call(b).reason,"OHLC_INVALID")}],
["negative tolerance blocks",()=>assert.equal(call(flat(),{tolerancePct:-0.01}).reason,"TOLERANCE_INVALID")],
["extreme threshold not silently tuned",()=>assert.equal(call(flat(),{tolerancePct:0.12}).reason,"TOLERANCE_INVALID")],
["last six months future prices do not enter MA at cutoff",()=>{
  let b=data(100),before=call(b).ma60AtCutoff;
  let aft=call([...b,...Array.from({length:100},()=>bar(1500))]).ma60AtCutoff;
  assert.equal(before,aft);
}]
];
let pass=0,fail=[];
for(const [name,f] of tests)try{f();pass++;console.log("PASS "+name)}catch(e){fail.push({name,error:e.message});console.error("FAIL "+name+": "+e.message)}
console.log(JSON.stringify({suite:"D01 Sara 60m MA60 support semantic disagreement",pass,total:tests.length,failed:fail}));
if(fail.length)process.exitCode=1;
