import assert from "node:assert/strict";
import {parseCsv,parseTdccPresence,parseTwseCurrent,buildAudit} from "../research/d16_21_tdcc_twse_selection_audit_l3_v0_1.mjs";

let passed=0;
function test(name,fn){try{fn();passed++;console.log("PASS",name);}catch(e){console.error("FAIL",name,e?.stack||e);process.exitCode=1;}}
function throws(name,fn,re){test(name,()=>assert.throws(fn,re));}

const twse=[
 {"公司代號":"1101","公司名稱":"台泥","產業別":"01","上市日期":"1962/02/09"},
 {"公司代號":"2330","公司名稱":"台積電","產業別":"24","上市日期":"1994/09/05"},
 {"公司代號":"2454","公司名稱":"聯發科","產業別":"24","上市日期":"2001/07/23"},
 {"公司代號":"006208","公司名稱":"ETF","產業別":"00","上市日期":"2012/07/17"}
];
const tdcc=[
 "資料日期,證券代號,持股分級,人數,股數,占集保庫存數比例%",
 "20261008,1101,1,10,100,1",
 "20261008,1101,17,10,10000,100",
 "20261008,2330,1,10,100,1",
 "20261008,2330,17,10,10000,100",
 "20261008,9999,17,10,10000,100",
 "20261008,006208,17,10,10000,100"
].join("\n")+"\n";
const paddedTdcc=tdcc+Array.from({length:1100},(_,i)=>"20261008,"+String(300000+i)+",17,1,1,100").join("\n")+"\n";

test("AD-T01 CSV quoted fields parse deterministically",()=>{
 const r=parseCsv('a,b\n"1,2","x""y"\n');
 assert.deepEqual(r,[["a","b"],["1,2",'x"y']]);
});
test("AD-T02 TWSE target keeps only four-digit ordinary company codes",()=>{
 const r=parseTwseCurrent([...twse,...Array.from({length:600},(_,i)=>({"公司代號":String(3000+i).padStart(4,"0"),"公司名稱":"X"+i,"產業別":"99","上市日期":"2020/01/01"}))]);
 assert.ok(r.some(x=>x.symbol==="1101"));
 assert.ok(!r.some(x=>x.symbol==="006208"));
});
throws("AD-T03 duplicate target symbol rejected",()=>{
 const p=[...Array.from({length:600},(_,i)=>({"公司代號":String(3000+i).padStart(4,"0"),"公司名稱":"X"+i,"產業別":"99","上市日期":"2020/01/01"})),{"公司代號":"3000","公司名稱":"dup","產業別":"99","上市日期":"2020/01/01"}];
 parseTwseCurrent(p);
},/TWSE_DUPLICATE_SYMBOL/);
test("AD-T04 TDCC source date and grade17 presence extracted",()=>{
 const x=parseTdccPresence(paddedTdcc);
 assert.equal(x.sourceDate,"20261008");
 assert.ok(x.completeGrade17.includes("1101"));
 assert.ok(x.completeGrade17.includes("2330"));
 assert.ok(!x.completeGrade17.includes("2454"));
});
throws("AD-T05 multiple TDCC source dates rejected",()=>{
 parseTdccPresence(paddedTdcc.replace("20261008,2330,1","20261007,2330,1"));
},/TDCC_MULTIPLE_SOURCE_DATES/);

function fullTwse(){
 return [...twse,...Array.from({length:600},(_,i)=>({"公司代號":String(3000+i).padStart(4,"0"),"公司名稱":"X"+i,"產業別":i%2?"A":"B","上市日期":"2020/01/01"}))];
}
test("AD-T06 every target row is KNOWN or MISSING, never silently dropped",()=>{
 const x=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
 assert.equal(x.entityLink.targetRows.length,x.targetUniverse.targetN);
 assert.equal(x.coverage.knownN+x.coverage.missingN,x.targetUniverse.targetN);
 assert.equal(x.coverage.silentDrop,false);
 assert.equal(x.coverage.missingImputed,false);
});
test("AD-T07 exact code join preserves a missing target",()=>{
 const x=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
 const r=x.entityLink.targetRows.find(r=>r.symbol==="2454");
 assert.equal(r.tdccState,"MISSING");
 assert.ok(x.coverage.missingSymbols.includes("2454"));
});
test("AD-T08 TDCC non-target ordinary securities remain visible extras",()=>{
 const x=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
 assert.ok(x.coverage.extraTdccOrdinarySymbols.includes("9999"));
});
test("AD-T09 industry coverage reconciles to target population",()=>{
 const x=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
 assert.equal(x.coverage.industryCoverage.reduce((a,r)=>a+r.targetN,0),x.targetUniverse.targetN);
 assert.equal(x.coverage.industryCoverage.reduce((a,r)=>a+r.knownN,0),x.coverage.knownN);
});
throws("AD-T10 future TDCC source date rejected",()=>{
 buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc.replaceAll("20261008","20261010"),capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
},/TDCC_SOURCE_DATE_AFTER_CAPTURE/);
test("AD-T11 receipt deterministic for identical inputs",()=>{
 const a=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
 const b=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
 assert.equal(a.receiptHash,b.receiptHash);
});
test("AD-T12 source hash mutation changes receipt identity",()=>{
 const a=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
 const b=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"c".repeat(64),tdccRawHash:"b".repeat(64)});
 assert.notEqual(a.receiptHash,b.receiptHash);
});
test("AD-T13 scope and inference firewalls explicit",()=>{
 const x=buildAudit({twsePayload:fullTwse(),tdccText:paddedTdcc,capturedAt:"2026-10-09T05:00:00Z",twseRawHash:"a".repeat(64),tdccRawHash:"b".repeat(64)});
 assert.equal(x.scope,"TWSE_CURRENT_ORDINARY_COMMON_EQUITY_ONLY");
 assert.equal(x.tpexScope,"OUT_OF_SCOPE_NOT_INHERITED");
 assert.equal(x.alternativeData.holderIdentity,"UNKNOWN");
 assert.equal(x.alternativeData.passiveShare,"UNKNOWN");
 assert.equal(x.biasDiagnostics.historicalBackfillPerformed,false);
 assert.equal(x.outcomeAccessed,false);
 assert.equal(x.alphaClaimMade,false);
 assert.equal(x.formalCoreChanged,false);
});
if(process.exitCode)process.exit(process.exitCode);
console.log("D16-21 TDCC/TWSE selection-audit L3 falsification suite PASS: "+passed+" tests");
