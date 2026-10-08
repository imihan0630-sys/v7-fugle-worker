import assert from "node:assert/strict";
import {
  buildRows, splitDates, bindHistoricalMembership, fitAr1, nestedFeatureSelection, calibration, blockBootstrap, guardedDb
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

test("NB-T06B D+1 labels cannot cross train-validation or validation-test boundary",()=>{
 const sp=splitDates(panel);
 const assigned=panel.map(r=>({...r,partition:sp.split(r)}));
 const kept=assigned.filter(r=>["TRAIN","VALIDATION","TEST"].includes(r.partition));
 assert.ok(assigned.some(r=>r.partition==="PURGED_TRAIN_BOUNDARY"));
 assert.ok(assigned.some(r=>r.partition==="PURGED_VALIDATION_BOUNDARY"));
 assert.equal(kept.some(r=>r.partition==="TRAIN" && r.outcomeDate>=sp.firstValidationDate),false);
 assert.equal(kept.some(r=>r.partition==="VALIDATION" && r.outcomeDate>=sp.firstTestDate),false);
});

const fakeExpected={
 registryId:"REGISTRY-TWSE-2025-TEST",
 registryHash:"a".repeat(64),
 membershipCount:2,replayEligibleCount:2,unknownStartCount:0,currentCount:1,delistedCount:1,
};
const fakeReceipt={
 registry_id:fakeExpected.registryId,registry_hash:fakeExpected.registryHash,
 membership_count:2,replay_eligible_count:2,unknown_start_count:0,current_count:1,delisted_count:1,
};
const fakeMemberships=[
 {
  registry_id:fakeExpected.registryId,symbol:"1101",membership_id:"M1101",membership_hash:"1".repeat(64),
  effective_from:"2025-01-01",effective_to:null,end_basis:"OPEN_ENDED_CURRENT",replay_eligible:1,
 },
 {
  registry_id:fakeExpected.registryId,symbol:"1102",membership_id:"M1102",membership_hash:"2".repeat(64),
  effective_from:"2025-01-01",effective_to:"2025-03-01",end_basis:"OFFICIAL_DELISTING_DATE",replay_eligible:1,
 },
];
test("NB-T06C membership binding requires active same security on decision and outcome",()=>{
 const rows=[
  {...panel[0],symbol:"1101",decisionDate:"2025-02-27",outcomeDate:"2025-02-28"},
  {...panel[1],symbol:"1102",decisionDate:"2025-02-28",outcomeDate:"2025-03-01"},
 ];
 const x=bindHistoricalMembership(rows,fakeMemberships,fakeReceipt,fakeExpected);
 assert.equal(x.admittedCount,1);
 assert.equal(x.blockedCount,1);
 assert.equal(x.rows[0].symbol,"1101");
 assert.equal(x.rows[0].membershipHash,"1".repeat(64));
});
test("NB-T06D official delisting date is exclusive membership boundary",()=>{
 const row={...panel[0],symbol:"1102",decisionDate:"2025-03-01",outcomeDate:"2025-03-02"};
 const x=bindHistoricalMembership([row],fakeMemberships,fakeReceipt,fakeExpected);
 assert.equal(x.admittedCount,0);
 assert.equal(x.blockedCount,1);
});
throws("NB-T06E registry hash mismatch fails closed",()=>{
 bindHistoricalMembership([panel[0]],fakeMemberships,{...fakeReceipt,registry_hash:"b".repeat(64)},fakeExpected);
},/REGISTRY_HASH_MISMATCH/);
throws("NB-T06F registry denominator count mismatch fails closed",()=>{
 bindHistoricalMembership([panel[0]],fakeMemberships,{...fakeReceipt,membership_count:3},fakeExpected);
},/REGISTRY_COUNT_MISMATCH_membershipCount/);
throws("NB-T06G membership row from another registry fails closed",()=>{
 bindHistoricalMembership([panel[0]],[{...fakeMemberships[0],registry_id:"OTHER"}],fakeReceipt,fakeExpected);
},/MEMBERSHIP_REGISTRY_MISMATCH/);

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
