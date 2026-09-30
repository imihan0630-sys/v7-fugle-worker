import assert from 'node:assert/strict';
import {buildAboveMaBreadthReceipt} from './above_ma_breadth_receipt_v0_1.mjs';

const base={scanDate:'2026-09-30',classificationSchemeId:'TEST_V1'};
let tests=0;
const eq=(a,b)=>{tests++;assert.deepEqual(a,b)};

let r=buildAboveMaBreadthReceipt({...base,members:[
 {symbol:'A',industry:'X'},{symbol:'B',industry:'X'},{symbol:'C',industry:'X'},{symbol:'D',industry:'X'}],features:[
 {symbol:'A',close:110,ma20:100,ma60:90,historyDays:60,historyAdmissionUsable:true},
 {symbol:'B',close:90,ma20:100,ma60:95,historyDays:60,historyAdmissionUsable:true},
 {symbol:'C',close:105,ma20:100,ma60:110,historyDays:60,historyAdmissionUsable:true},
 {symbol:'D',close:80,ma20:100,ma60:100,historyDays:60,historyAdmissionUsable:true}]});
eq(r.sectors.X.windows['20'].aboveMaPct,50); eq(r.sectors.X.windows['20'].coveragePct,100);
eq(r.sectors.X.windows['60'].aboveMaPct,25);

r=buildAboveMaBreadthReceipt({...base,members:[{symbol:'A',industry:'X'},{symbol:'B',industry:'X'},{symbol:'C',industry:'X'},{symbol:'D',industry:'X'}],features:[
 {symbol:'A',close:110,ma20:100,historyDays:20,historyAdmissionUsable:true},
 {symbol:'B',close:105,ma20:100,historyDays:20,historyAdmissionUsable:true},
 {symbol:'C',close:90,ma20:100,historyDays:20,historyAdmissionUsable:true},
 {symbol:'D',close:200,ma20:100,historyDays:20,historyAdmissionUsable:false}]});
let x=r.sectors.X.windows['20'];
eq(x.aboveMaPct,66.67); eq(x.coveragePct,75); eq(x.lowerBoundPct,50); eq(x.upperBoundPct,75); eq(x.state,'PARTIAL_COVERAGE');

r=buildAboveMaBreadthReceipt({...base,candidateSymbol:'A',members:[{symbol:'A',industry:'X'},{symbol:'B',industry:'X'}],features:[
 {symbol:'A',close:110,ma20:100,historyDays:20,historyAdmissionUsable:true},
 {symbol:'B',close:90,ma20:100,historyDays:20,historyAdmissionUsable:true}]});
x=r.sectors.X.windows['20'];
eq(x.aboveMaPct,50); eq(x.leaveOneOut.aboveMaPct,0); eq(x.leaveOneOut.state,'KNOWN');

r=buildAboveMaBreadthReceipt({...base,candidateSymbol:'A',members:[{symbol:'A',industry:'X'},{symbol:'B',industry:'X'}],features:[
 {symbol:'A',close:110,ma20:100,historyDays:20,historyAdmissionUsable:true},
 {symbol:'B',close:90,ma20:100,historyDays:20,historyAdmissionUsable:false}]});
x=r.sectors.X.windows['20'];
eq(x.aboveMaPct,100); eq(x.coveragePct,50); eq(x.lowerBoundPct,50); eq(x.upperBoundPct,100);
eq(x.leaveOneOut.aboveMaPct,null); eq(x.leaveOneOut.state,'UNKNOWN_NO_HISTORY_READY');

r=buildAboveMaBreadthReceipt({...base,members:[{symbol:'A',industry:'X'}],features:[
 {symbol:'A',close:110,ma20:100,historyDays:10,historyAdmissionUsable:true}]});
x=r.sectors.X.windows['20'];
eq(x.aboveMaPct,null); eq(x.coveragePct,0); eq(x.lowerBoundPct,0); eq(x.upperBoundPct,100);
eq(x.state,'UNKNOWN_NO_HISTORY_READY');

r=buildAboveMaBreadthReceipt({...base,members:[{symbol:'A',industry:'X'}],features:[
 {symbol:'A',close:110,ma20:100,ma60:100,historyDays:30,historyAdmissionUsable:true}]});
eq(r.sectors.X.windows['20'].aboveMaPct,100); eq(r.sectors.X.windows['60'].aboveMaPct,null);

assert.throws(()=>buildAboveMaBreadthReceipt({...base,members:[{symbol:'A',industry:'X'},{symbol:'A',industry:'X'}],features:[]}),/DUPLICATE_MEMBER_SYMBOL/);tests++;
assert.throws(()=>buildAboveMaBreadthReceipt({scanDate:'2026-09-30',classificationSchemeId:'',members:[],features:[]}),/CLASSIFICATION_SCHEME_REQUIRED/);tests++;

r=buildAboveMaBreadthReceipt({...base,members:[{symbol:'A',industry:'X'},{symbol:'B',industry:'Y'}],features:[
 {symbol:'A',close:110,ma20:100,historyDays:20,historyAdmissionUsable:true},
 {symbol:'B',close:90,ma20:100,historyDays:20,historyAdmissionUsable:true}]});
eq(r.sectors.X.windows['20'].aboveMaPct,100); eq(r.sectors.Y.windows['20'].aboveMaPct,0);

console.log(JSON.stringify({ok:true,assertions:tests,schema:r.schemaVersion}));
