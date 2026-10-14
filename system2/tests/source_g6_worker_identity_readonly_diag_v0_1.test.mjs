import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {inspectSourceWorkerIdentitiesV0_1 as inspect} from "../migration/source_g6_worker_identity_readonly_diag_v0_1.mjs";
const id="a".repeat(32),at="2026-10-14T08:45:00.000Z";
function fake(pages){
 const requests=[];
 return {
  requests,
  fetchImpl:async (url,opts)=>{
   requests.push({url,method:opts.method,token:opts.headers.authorization});
   const p=Number(new URL(url).searchParams.get("page")),data=pages[p-1];
   if(!data)return {ok:false,status:404,json:async()=>null};
   return {ok:true,status:200,json:async()=>data};
  }
 };
}
const item=id=>({id});
test("native one-page normal source/V8 worker list, no private names/secret leaked",async()=>{
 const f=fake([{success:true,result:[item("fugle-test"),item("other-worker"),item("system2-shadow-research")],result_info:{total_count:3}}]);
 const r=await inspect({accountId:id,token:"TEST_SECRET_123",fetchImpl:f.fetchImpl,now:()=>at});
 assert.equal(r.state,"TWO_SOURCE_WORKERS_LISTED_BUT_CRON_NOT_PROVEN");
 assert.equal(r.sourceExpectedWorkerPresent,true);assert.equal(r.system1ExpectedWorkerPresent,true);
 assert.equal(r.pagesRead,1);assert.equal(r.totalWorkersObserved,3);
 assert.equal(r.cloudMutations,0);assert.equal(r.sourceCronConfigurationVerified,false);
 assert.equal(r.sourceNoNewScheduledEventsVerified,false);
 assert.equal(f.requests.length,1);assert.equal(f.requests[0].method,"GET");
 assert.ok(!JSON.stringify(r).includes("TEST_SECRET_123"));
 assert.ok(!JSON.stringify(r).includes(id));
 assert.ok(!JSON.stringify(r).includes("other-worker"));
});
test("worker-list source script missing is reported, not misreported as Cron restored",async()=>{
 const f=fake([{success:true,result:[item("fugle-test")],result_info:{total_count:1}}]);
 const r=await inspect({accountId:id,token:"T",fetchImpl:f.fetchImpl,now:()=>at});
 assert.equal(r.state,"SOURCE_WORKER_IDENTITY_LIST_MISMATCH");
 assert.equal(r.sourceExpectedWorkerPresent,false);assert.equal(r.system1ExpectedWorkerPresent,true);
 assert.equal(r.sourceCronConfigurationVerified,false);
});
test("both source role names missing is incomplete G6, no false PASS",async()=>{
 const f=fake([{success:true,result:[item("some-other-script")]}]);
 const r=await inspect({accountId:id,token:"T",fetchImpl:f.fetchImpl,now:()=>at});
 assert.equal(r.sourceExpectedWorkerPresent,false);assert.equal(r.system1ExpectedWorkerPresent,false);
 assert.equal(r.originalCloudflareWorkerListCompleted,true);
 assert.equal(r.state,"SOURCE_WORKER_IDENTITY_LIST_MISMATCH");
});
test("full pagination 100 + 2, bounded GET list all pages",async()=>{
 const many=Array.from({length:100},(_,i)=>item("dummy-"+i));
 const f=fake([{success:true,result:many,result_info:{total_count:102}},
 {success:true,result:[item("fugle-test"),item("system2-shadow-research")],result_info:{total_count:102}}]);
 const r=await inspect({accountId:id,token:"T",fetchImpl:f.fetchImpl,now:()=>at});
 assert.equal(r.pagesRead,2);assert.equal(r.totalWorkersObserved,102);
 assert.equal(r.sourceExpectedWorkerPresent,true);
 assert.equal(f.requests.length,2);assert.ok(f.requests.every(x=>x.method==="GET"));
});
const badCases=[
 ["duplicate script names",()=>[{success:true,result:[item("foo"),item("foo")]}]],
 ["invalid worker result",()=>[{success:true,result:{}}]],
 ["native API unsuccessful",()=>[{success:false,result:[]}]],
 ["inconsistent total across pages",()=>[{success:true,result:Array.from({length:100},(_,i)=>item("a"+i)),result_info:{total_count:102}},{success:true,result:[item("fugle-test"),item("system2-shadow-research")],result_info:{total_count:103}}]],
 ["total count lower than listed",()=>[{success:true,result:[item("a"),item("b")],result_info:{total_count:1}}]],
 ["total underflow",()=>[{success:true,result:[item("a")],result_info:{total_count:2}}]],
 ["invalid worker id",()=>[{success:true,result:[{id:null}]}]]
];
for(const [name,mk] of badCases)test(name+" denies",async()=>{
 const f=fake(mk());
 await assert.rejects(()=>inspect({accountId:id,token:"T",fetchImpl:f.fetchImpl,now:()=>at}),/SOURCE_G6_WORKER_IDENTITY_DIAG_/);
});
test("missing account/credential denies before Cloudflare",async()=>{
 const f=fake([{success:true,result:[]}]);
 await assert.rejects(()=>inspect({accountId:"bad",token:"T",fetchImpl:f.fetchImpl,now:()=>at}),/SOURCE_G6_/);
 await assert.rejects(()=>inspect({accountId:id,token:"",fetchImpl:f.fetchImpl,now:()=>at}),/SOURCE_G6_/);
 assert.equal(f.requests.length,0);
});
test("source G6 workflow executes diagnostic ONLY after main GET step fails",async()=>{
 const yaml=await readFile(new URL("../../.github/workflows/system2-g6-source-weekday-cron-readonly.yml",import.meta.url),"utf8");
 assert.match(yaml,/id: source_get/);
 assert.match(yaml,/if: failure\(\) && steps\.source_get\.outcome == 'failure'/);
 assert.match(yaml,/environment: system2-research/);
 assert.match(yaml,/github\.event\.comment\.body == '\/s2 g6 source-readonly'/);
 assert.match(yaml,/node system2\/migration\/source_g6_worker_identity_readonly_diag_v0_1\.mjs/);
 assert.doesNotMatch(yaml,/S2_SCHEMA_DEST_|wrangler (deploy|publish)/);
});
