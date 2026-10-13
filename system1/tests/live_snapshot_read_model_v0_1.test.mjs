import assert from "node:assert/strict";
import {reconcileDisplaySnapshotsV0_1 as pick} from "../runtime/live_snapshot_read_model_v0_1.mjs";
const today="2026-10-13",nowMs=Date.parse("2026-10-13T02:46:45Z");
const planned=[{symbol:"6226"},{symbol:"8046"}];
const snapshot=(time,results=planned,more={})=>({
  generatedAtIso:time,tradeDate:today,monitoredCount:results.length,
  results:results.map(x=>({symbol:x.symbol})),...more
});
const d1=snapshot("2026-10-13T02:40:00Z");
const kv=snapshot("2026-10-13T02:46:21Z",planned,{liveStoreResult:{stored:false}});
const opts={d1,kv,planned,tradeDate:today,intraday:true,nowMs};
let count=0;
const test=(name,fn)=>{fn();count++;};
test("stale D1 does not hide newer matching KV",()=>{
 const s=pick(opts);
 assert.equal(s.source,"KV_DEGRADED");
 assert.equal(s.snapshot.generatedAtIso,kv.generatedAtIso);
 assert.equal(s.liveFresh,true);
 assert.equal(s.d1PersistenceUnverified,true);
});
test("newer D1 stays authoritative",()=>{
 const s=pick({...opts,d1:snapshot("2026-10-13T02:46:30Z")});
 assert.equal(s.source,"D1_PRIMARY");
});
test("fresh D1 is not overridden with KV",()=>{
 const s=pick({...opts,d1:snapshot("2026-10-13T02:46:15Z")});
 assert.equal(s.source,"D1_PRIMARY");
});
test("unmatched KV symbol cannot override old D1",()=>{
 const s=pick({...opts,kv:snapshot("2026-10-13T02:46:21Z",[{symbol:"2454"},{symbol:"8046"}])});
 assert.equal(s.source,"D1_PRIMARY");
 assert.equal(s.liveFresh,false);
});
test("missing KV symbol cannot override old D1",()=>{
 const s=pick({...opts,kv:snapshot("2026-10-13T02:46:21Z",[{symbol:"6226"}])});
 assert.equal(s.source,"D1_PRIMARY");
});
test("duplicate KV symbol blocked",()=>{
 const s=pick({...opts,kv:snapshot("2026-10-13T02:46:21Z",[{symbol:"6226"},{symbol:"6226"}])});
 assert.equal(s.source,"D1_PRIMARY");
});
test("other trading date KV cannot override",()=>{
 const s=pick({...opts,kv:{...kv,tradeDate:"2026-10-12"}});
 assert.equal(s.source,"D1_PRIMARY");
});
test("stale KV cannot pretend to repair current session",()=>{
 const s=pick({...opts,kv:snapshot("2026-10-13T02:43:00Z")});
 assert.equal(s.source,"D1_PRIMARY");
 assert.equal(s.liveFresh,false);
});
test("future timestamps cannot pretend to repair current session",()=>{
 const s=pick({...opts,kv:snapshot("2026-10-13T02:50:00Z")});
 assert.equal(s.source,"D1_PRIMARY");
});
test("no D1, valid KV is explicit degraded",()=>{
 const s=pick({...opts,d1:null});
 assert.equal(s.source,"KV_DEGRADED");
 assert.equal(s.liveFresh,true);
});
test("missing both reports no live evidence",()=>{
 const s=pick({...opts,d1:null,kv:null});
 assert.equal(s.source,"NONE");
 assert.equal(s.liveFresh,false);
});
test("afterclose shows final valid session without fake live PASS",()=>{
 const s=pick({...opts,intraday:false,nowMs:Date.parse("2026-10-13T07:00:00Z")});
 assert.equal(s.source,"KV_DEGRADED");
 assert.equal(s.liveFresh,null);
});
test("KV checkedAt cannot launder old generatedAtIso",()=>{
 const s=pick({...opts,kv:{...snapshot("2026-10-13T02:40:00Z"),checkedAt:"2026-10-13T02:46:43Z"}});
 assert.equal(s.source,"D1_PRIMARY");
});
console.log(JSON.stringify({ok:true,testCases:count,safeReadOnly:true,noTradeOrPushChanges:true}));
