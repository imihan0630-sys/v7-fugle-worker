import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assessSameUtcDayPriorWriterRuns,verifyOneWriterPerUtcDay} from "../migration/issue1068_d1_single_utc_day_run_guard_v0_1.mjs";
const day="2026-10-14",base={id:100,created_at:day+"T02:50:00Z",event:"push",status:"in_progress",head_commit:{message:"S2_OWNER_OVERRIDE_RAW_COPY_20261012 Oct14 now"}};
const current={...base};
let answer=assessSameUtcDayPriorWriterRuns({runs:[current],runId:100,quotaDayUtc:day});
assert.equal(answer.canProceed,true);
for(const prior of [
 {id:90,created_at:day+"T00:55:00Z",event:"schedule",status:"completed",conclusion:"failure"},
 {id:91,created_at:day+"T00:56:00Z",event:"workflow_dispatch",status:"in_progress"},
 {id:92,created_at:day+"T00:59:00Z",event:"push",head_commit:{message:"S2_OWNER_OVERRIDE_RAW_COPY_20261012"},status:"completed",conclusion:"success"}
]){
 answer=assessSameUtcDayPriorWriterRuns({runs:[current,prior],runId:100,quotaDayUtc:day});
 assert.equal(answer.canProceed,false);
 assert.equal(answer.blockerCount,1);
}
answer=assessSameUtcDayPriorWriterRuns({runs:[current,{...base,id:80,
  created_at:"2026-10-13T02:55:00Z",event:"schedule"}],runId:100,quotaDayUtc:day});
assert.equal(answer.canProceed,true);
answer=assessSameUtcDayPriorWriterRuns({runs:[current,{...base,id:60,created_at:day+"T02:20:00Z",
  head_commit:{message:"Ordinary main push without owner migration"}}],runId:100,quotaDayUtc:day});
assert.equal(answer.canProceed,true);
assert.throws(()=>assessSameUtcDayPriorWriterRuns({runs:[{id:12}],runId:100,quotaDayUtc:day}),/MALFORMED/);
function mockReq(runs,{ok=true,total_count=runs.length}={}){
 return async(url,init)=>{assert.match(url,/actions\/workflows\/system2-owner-override-raw-d1-copy-20261012\.yml\/runs\?per_page=100/);
 assert.equal(init.method,"GET");
 assert.match(init.headers.Authorization,/^Bearer token$/);
 return {ok,json:async()=>({total_count,workflow_runs:runs})}};
}
const result=await verifyOneWriterPerUtcDay({request:mockReq([current]),runId:100,ownerRepo:"imihan0630-sys/v7-fugle-worker",token:"token",quotaDayUtc:day});
assert.equal(result.status,"S2_GUARD_UNIQUE_RAW_COPY_WRITER_FOR_UTC_DAY");
assert.equal(result.cloudflareQueries,0);
await assert.rejects(()=>verifyOneWriterPerUtcDay({request:mockReq([current,{id:91,created_at:day+"T01:00:00Z",event:"schedule",status:"completed",conclusion:"success"}]),
 runId:100,ownerRepo:"imihan0630-sys/v7-fugle-worker",token:"token",quotaDayUtc:day}),/SAME_DAY_WRITER_ALREADY_STARTED/);
await assert.rejects(()=>verifyOneWriterPerUtcDay({request:mockReq([current],{total_count:100}),
 runId:100,ownerRepo:"imihan0630-sys/v7-fugle-worker",token:"token",quotaDayUtc:day}),/PAGINATION_UNTRUSTED/);
await assert.rejects(()=>verifyOneWriterPerUtcDay({request:mockReq([]),runId:100,
 ownerRepo:"imihan0630-sys/v7-fugle-worker",token:"token",quotaDayUtc:day}),/CURRENT_RUN_NOT_RETURNED/);
const wf=readFileSync(".github/workflows/system2-owner-override-raw-d1-copy-20261012.yml","utf8");
assert(wf.indexOf("Fail closed if ANY owner copy already started in current UTC day")<
       wf.indexOf("Do owner-authorized target-only RAW_A1 transport"));
assert.match(wf,/cron: "30 0 \* \* \*"/);
assert.match(wf,/S2_OWNER_OVERRIDE_RAW_COPY_20261012/);
assert.match(wf,/permissions:\n  contents: read\n  actions: read/);
assert(!wf.includes("cancel-in-progress: true"));
console.log("S2_OCT14_SINGLE_WRITER_GITHUB_NATIVE_GUARD_NEGATIVE_TESTS_PASS");
