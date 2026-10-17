import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {classifyOriginalFormalReadback as classify}
 from "../ops/system1_p0_20261016_original_formal_getonly_once.mjs";
const d="2026-10-16",base={
 version:{version:"8.20.2-idempotent-d1-snapshots",testMode:false},
 recommendations:{attempt:{requestedDate:d,status:"INCOMPLETE"},isCurrent:false,
  selectedCount:0,resultType:"NOT_SCANNED"},
 scan:{scanDate:null,selectedCount:0,pipeline:{selectionCompleted:false,complete:false}},
 cron:{recent:[]},config:{source:"KV",stocks:[]},
 quality:{marketDate:d,status:"READY"}};
function make(o={}){return {...base,...o};}
let n=0;
async function test(label,fn){await fn();n++;console.log("PASS "+label)}
await test("incomplete default-zero is not real zero selection",()=>{
 const x=classify(make(),{});
 assert.equal(x.verifiedZeroSelection,false);assert.equal(x.verifiableSelectedCount,null);
 assert.equal(x.classification,"FORMAL_UNSAVED_OR_INCOMPLETE");
});
await test("missing authorized private GETs fail closed",()=>{
 const x=classify(make(),{scan:"AUTHORIZATION_BLOCKED"});
 assert.equal(x.classification,"SOURCE_OR_AUTH_READ_INCOMPLETE");
 assert.equal(x.verifiedSameDayFormal,false);
});
await test("qualified real 0 must have complete same-date Formal and consistent KV",()=>{
 const v=make({recommendations:{attempt:{requestedDate:d,status:"COMPLETE"}},
  scan:{scanDate:d,dryRun:false,selectedCount:0,stocks:[],config:{verified:true,updatedAt:"T1"},
    pipeline:{selectionCompleted:true,complete:true}},
  config:{source:"KV",stocks:[],updatedAt:"T1"}});
 const x=classify(v,{});assert.equal(x.verifiedZeroSelection,true);
 assert.equal(x.verifiableSelectedCount,0);
});
await test("authored real 1 must have exact KV symbols and date",()=>{
 const v=make({scan:{scanDate:d,dryRun:false,selectedCount:1,
  stocks:[{symbol:"3236"}],config:{verified:true,updatedAt:"T1"},
  pipeline:{selectionCompleted:true}},config:{source:"KV",stocks:[{symbol:"3236"}],updatedAt:"T1"}});
 const x=classify(v,{});
 assert.equal(x.verifiedZeroSelection,false);assert.equal(x.verifiableSelectedCount,1);
});
await test("date mismatch cannot validate zero",()=>{
 const v=make({scan:{scanDate:"2026-10-15",dryRun:false,selectedCount:0,stocks:[],
  config:{verified:true,updatedAt:"T1"},pipeline:{selectionCompleted:true}},
  config:{source:"KV",stocks:[],updatedAt:"T1"}});
 assert.equal(classify(v,{}).verifiedZeroSelection,false);
});
await test("KV exact stock mismatch rejects false positives",()=>{
 const v=make({scan:{scanDate:d,dryRun:false,selectedCount:1,stocks:[{symbol:"3236"}],
  config:{verified:true,updatedAt:"T1"},pipeline:{selectionCompleted:true}},
  config:{source:"KV",stocks:[{symbol:"5340"}],updatedAt:"T1"}});
 assert.equal(classify(v,{}).verifiableSelectedCount,null);
});
await test("truncated cron and no matching rows cannot imply job absence",()=>{
 const v=make({cron:{recent:Array.from({length:20},(_,i)=>({
  scheduled_at:"2026-10-17T00:00:00Z",job_type:"INTRADAY_MONITOR",status:"OK",id:i}))}});
 const x=classify(v,{});
 assert.equal(x.cronRecentTruncated,true);
 assert.equal(x.cronMissingDoesNotProveNoInvocation,true);
});
await test("classify existing original cron CPU without outputting provider raw error",()=>{
 const v=make({cron:{recent:[{scheduled_at:"2026-10-16T15:35:00Z",
  job_type:"AFTER_MARKET_SCAN",status:"FAILED",error:"exceededResources Secret do not log"}]}});
 const x=classify(v,{});
 assert.equal(x.cronRowsForDate[0].errorClass,"CPU_OR_RESOURCE");
 assert.equal(JSON.stringify(x).includes("Secret do not log"),false);
});
await test("actual official quality snapshot counts do not prove exact five EPS symbols",()=>{
 const x=classify(make({quality:{marketDate:d,index:{ready:true,count:55,asOfDate:d},
 tdcc:{ready:true,count:2900,asOfDate:d},datasets:{
 FINANCIAL:{ready:true,count:1882,asOfDate:d},
 VALUATION:{ready:true,count:1965,asOfDate:d},
 ANNOUNCEMENTS:{ready:true,count:150,asOfDate:d},
 QUARTER_EPS:{ready:true,count:4,asOfDate:d}}}}),{});
 assert.equal(x.quarterEpsSnapshotPresent,true);
 assert.equal(x.quarterEpsSnapshotCount,4);
 assert.equal(x.qualitySnapshotReadback.INDEX.count,55);
 assert.equal(x.qualitySnapshotReadback.QUARTER_EPS.count,4);
 assert.equal(x.verifiedSameDayFormal,false);
});
await test("missing EPS source remains UNKNOWN, not zero or eligible",()=>{
 const x=classify(make({quality:{marketDate:d,datasets:{
 QUARTER_EPS:{ready:false,count:0}}}}),{});
 assert.equal(x.quarterEpsSnapshotPresent,false);
 assert.equal(x.quarterEpsSnapshotCount,0);
 assert.equal(x.verifiableSelectedCount,null);
});
await test("script is hardcoded GET only, excludes Worker POST and GitHub writes",async()=>{
 const src=await readFile(new URL("../ops/system1_p0_20261016_original_formal_getonly_once.mjs",import.meta.url),"utf8");
 assert.doesNotMatch(src,/method:"POST"|\/api\/scan"[,)]/);
 assert.match(src,/method:"GET"/);
 assert.match(src,/new URL\(path,BASE\)/);
});
console.log(JSON.stringify({suite:"S1 original Oct16 GET-only readiness",tests:n,
 success:true,noWorkerWrites:true,noFalseZero:true}));
