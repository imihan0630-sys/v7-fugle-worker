import assert from "node:assert/strict";
import {
  buildRows, splitDates, fitAr1, nestedFeatureSelection, calibration, blockBootstrap, guardedDb
} from "../research/room11_numeric_l3_batch_v0_1.mjs";

let passed=0;
function test(name,fn){try{fn();passed++;console.log("PASS",name);}catch(e){console.error("FAIL",name,e?.stack||e);process.exitCode=1;}}
function throws(name,fn,re){test(name,()=>assert.throws(fn,re));}
function isoDay(n){
 const d=new Date(Date.UTC(2025,0,2+n,12));
 return d.toISOString().slice(0,10);
}
const dates=Array.from({length:140},(_,i)=>isoDay(i)); // synthetic exact-session labels for pure tests

function bar(symbol,date,k){
 return {
  marketDate:date,market:"TWSE",symbol,pitReplayEligible:true,
  tradeValue:1_000_000 + k*12345 + Number(symbol)*7,
  transactions:100+k%17,
  volumeShares:200000+k*101,
  continuityState:"UNVERIFIED",
  availableAt:date+"T05:30:00.000Z",
  sourceRowHash:(symbol+date).padEnd(64,"0").slice(0,64),
 };
}

test("NB-T01 exact session builder emits only consecutive four-date windows",()=>{
 const bs=dates.slice(0,20).map((d,i)=>bar("1101",d,i));
 const rows=buildRows([["1101",bs]],dates);
 assert.ok(rows.length>=15);
 assert.equal(rows[0].market,"TWSE");
 assert.equal(rows[0].outcomeDate,dates[3]);
 assert.equal(rows[0].decisionDate,dates[2]);
});
test("NB-T02 missing official session breaks local window instead of stale substitution",()=>{
 const bs=dates.slice(0,20).filter((_,i)=>i!==8).map((d,i)=>bar("1101",d,i));
 const rows=buildRows([["1101",bs]],dates);
 assert.ok(rows.every(r=>r.decisionDate!==dates[8] && r.outcomeDate!==dates[8]));
 const around=rows.filter(r=>[dates[7],dates[9]].includes(r.decisionDate));
 assert.equal(around.length,0);
});
test("NB-T03 late current evidence excluded",()=>{
 const bs=dates.slice(0,20).map((d,i)=>bar("1101",d,i));
 bs[10]={...bs[10],availableAt:bs[10].marketDate+"T06:30:00.000Z"};
 const rows=buildRows([["1101",bs]],dates);
 assert.ok(rows.every(r=>r.decisionDate!==dates[10]));
});
throws("NB-T04 readonly guard blocks mutation before adapter",()=>{
 let touched=0;
 const raw={prepare(sql){touched++;return {bind(){return this;},all:async()=>({results:[]})};},rawQuery(){touched++;},batch(){touched++;},metrics:{rowsWritten:0}};
 const db=guardedDb(raw);db.prepare("UPDATE x SET y=1");
},/READONLY_SQL_REQUIRED|MUTATING_SQL_FORBIDDEN/);
test("NB-T05 readonly guard allows SELECT",()=>{
 let touched=0;
 const raw={prepare(sql){touched++;return {bind(){return this;},all:async()=>({results:[]})};},rawQuery(){touched++;return[];},batch(){touched++;return[];},metrics:{rowsWritten:0}};
 const db=guardedDb(raw);db.prepare("SELECT * FROM x");assert.equal(touched,1);
});

function syntheticPanel(){
 const out=[];
 for(let di=0;di<120;di++){
  for(let si=0;si<8;si++){
   const x0=10+0.01*di+0.03*si+0.08*Math.sin((di+si)/7);
   const x1=9.9+0.009*di+0.02*si+0.05*Math.cos((di-si)/9);
   const x2=4+0.02*(di%11)+0.01*si;
   const x3=11+0.015*(di%13)+0.02*si;
   const y=0.62*x0+0.16*x2+0.04*Math.sin(di/5)+0.01*si;
   out.push({
    market:"TWSE",symbol:String(1101+si),decisionDate:dates[di],decisionTimestamp:dates[di]+"T06:00:00.000Z",
    outcomeDate:dates[di+1]||dates[di],x:[x0,x1,x2,x3],y,
    binaryY:y>x0?1:0,delta:y-x0,
    sourceRowHash:String(si).repeat(64).slice(0,64),nextSourceRowHash:String(si+1).repeat(64).slice(0,64),
    currentContinuityState:"UNVERIFIED",nextContinuityState:"UNVERIFIED",
   });
  }
 }
 const sp=splitDates(out);
 return out.map(r=>({...r,partition:sp.split(r)}));
}
const panel=syntheticPanel();

test("NB-T06 chronological split keeps disjoint dates",()=>{
 const sp=splitDates(panel);
 const a=new Set(sp.trainDates),b=new Set(sp.validationDates),c=new Set(sp.testDates);
 assert.equal([...a].some(x=>b.has(x)||c.has(x)),false);
 assert.equal([...b].some(x=>c.has(x)),false);
});
test("NB-T07 AR1 baseline executable on multiple issuers",()=>{
 const r=fitAr1(panel);
 assert.ok(r.length>=5);
 assert.ok(r.every(x=>Number.isFinite(x.testMae)&&Number.isFinite(x.naiveMae)));
});
test("NB-T08 nested selection freezes outer test away from selection",()=>{
 const r=nestedFeatureSelection(panel);
 assert.equal(r.outerTestUsedForSelection,false);
 assert.equal(r.preprocessingFitOnOuterTest,false);
 assert.equal(r.candidateCount,9);
 assert.ok(r.trainN>0&&r.validationN>0&&r.testN>0&&Number.isFinite(r.testMse));
});
test("NB-T09 calibration produces bounded probabilities diagnostic Brier",()=>{
 const r=calibration(panel);
 assert.match(r.target,/DIAGNOSTIC_NOT_RETURN_ALPHA/);
 assert.ok(r.brier>=0&&r.brier<=1);
 assert.equal(r.identityCalibration,true);
 assert.equal(r.outerTestUsedForModelSelection,false);
 assert.equal(r.bins.reduce((a,b)=>a+b.n,0),r.testN);
});
test("NB-T10 dependence-preserving bootstrap is deterministic",()=>{
 const a=blockBootstrap(panel),b=blockBootstrap(panel);
 assert.deepEqual(a,b);
 assert.equal(a.blockLength,5);
 assert.equal(a.syntheticPathCountIsEmpiricalN,false);
 assert.ok(a.inputIndependentDateN>=50);
});
test("NB-T11 panel row order does not affect model split outcome after canonical date partition",()=>{
 const rev=[...panel].reverse();
 const a=nestedFeatureSelection(panel),b=nestedFeatureSelection(rev);
 assert.equal(a.selected.familyId,b.selected.familyId);
 assert.equal(a.selected.lambda,b.selected.lambda);
 assert.ok(Math.abs(a.testMse-b.testMse)<1e-10);
});

if(process.exitCode)process.exit(process.exitCode);
console.log(`Room11 numeric L3 pure falsification suite PASS: ${passed} tests`);
