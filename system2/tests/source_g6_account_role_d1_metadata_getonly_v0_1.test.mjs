import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {classifySourceD1AccountRoleV0_1 as classify} from "../migration/source_g6_account_role_d1_metadata_getonly_v0_1.mjs";
const aid="a".repeat(32), t="2026-10-14T08:53:00.000Z";
const db=(name,id)=>({name,uuid:id});
function fake(pages){
 const requests=[];
 return {requests,fetchImpl:async(url,opts)=>{
  requests.push({url,method:opts.method,auth:opts.headers.Authorization});
  const p=Number(new URL(url).searchParams.get("page"));
  const data=pages[p-1];
  return {ok:!!data,status:data?200:404,json:async()=>data??null};
 }};
}
test("source-like D1 metadata only, no false Worker or Cron proof",async()=>{
 const f=fake([{success:true,result:[db("system2-research","s2id"),db("v7-live","v8id")],result_info:{total_count:2}}]);
 const r=await classify({accountId:aid,token:"PRIVATE_SECRET",now:()=>t,fetchImpl:f.fetchImpl});
 assert.equal(r.accountRoleInference,"SOURCE_LIKE_D1_NAMES_METADATA_ONLY");
 assert.equal(r.expectedSourceS2D1PresentExactlyOnce,true);
 assert.equal(r.expectedSystem1V8D1PresentExactlyOnce,true);
 assert.equal(r.cloudMutations,0);assert.equal(r.d1SQLStatements,0);
 assert.equal(r.oldSourceCronCurrentConfigVerified,false);
 assert.equal(r.accountRoleIndependentlyAccepted,false);
 assert.equal(f.requests.length,1);assert.equal(f.requests[0].method,"GET");
 for(const secret of ["PRIVATE_SECRET",aid,"s2id","v8id"])assert.ok(!JSON.stringify(r).includes(secret));
});
test("destination-like account has no old V8 D1: fail role inference, not source deletion proof",async()=>{
 const f=fake([{success:true,result:[db("system2-research","only-d1")]}]);
 const r=await classify({accountId:aid,token:"T",now:()=>t,fetchImpl:f.fetchImpl});
 assert.equal(r.accountRoleInference,"SOURCE_ROLE_UNVERIFIED_D1_NAMES");
 assert.equal(r.expectedSourceS2D1PresentExactlyOnce,true);
 assert.equal(r.expectedSystem1V8D1PresentExactlyOnce,false);
});
test("missing both D1 names still does not prove deleted workers",async()=>{
 const f=fake([{success:true,result:[],result_info:{total_count:0}}]);
 const r=await classify({accountId:aid,token:"T",now:()=>t,fetchImpl:f.fetchImpl});
 assert.equal(r.visibleD1DatabaseCount,0);assert.equal(r.accountRoleIndependentlyAccepted,false);
});
test("bounded 100+1 D1 metadata pages recognized",async()=>{
 const many=Array.from({length:100},(_,i)=>db("other-"+i,"uid-"+i));
 const f=fake([{success:true,result:many,result_info:{total_count:101}},
  {success:true,result:[db("v7-live","v8-only")],result_info:{total_count:101}}]);
 const r=await classify({accountId:aid,token:"T",now:()=>t,fetchImpl:f.fetchImpl});
 assert.equal(r.providerPagesRead,2);assert.equal(r.visibleD1DatabaseCount,101);
 assert.equal(r.accountRoleInference,"SOURCE_ROLE_UNVERIFIED_D1_NAMES");
 assert.ok(f.requests.every(x=>x.method==="GET"));
});
const negatives=[
 ["duplicate UUID",()=>[{success:true,result:[db("a","u"),db("b","u")]}]],
 ["invalid payload",()=>[{success:true,result:{}}]],
 ["rejected provider",()=>[{success:false,result:[]}]],
 ["no name",()=>[{success:true,result:[db(null,"u")]}]],
 ["no UUID",()=>[{success:true,result:[db("v7-live",null)]}]],
 ["total overflow",()=>[{success:true,result:[db("a","u"),db("b","v")],result_info:{total_count:1}}]],
 ["total underflow",()=>[{success:true,result:[db("a","u")],result_info:{total_count:2}}]],
 ["inconsistent count",()=>[{success:true,result:Array.from({length:100},(_,i)=>db("d-"+i,"x"+i)),result_info:{total_count:101}}, {success:true,result:[db("v7-live","v8")],result_info:{total_count:102}}]]
];
for(const [n,c] of negatives)test(n+" refuses account role promotion",async()=>{
 const f=fake(c());
 await assert.rejects(()=>classify({accountId:aid,token:"T",now:()=>t,fetchImpl:f.fetchImpl}),/SOURCE_G6_ACCOUNT_ROLE_GETONLY_/);
});
test("missing existing source token or account denies before Cloudflare",async()=>{
 const f=fake([{success:true,result:[]}]);
 await assert.rejects(()=>classify({accountId:"bad",token:"T",fetchImpl:f.fetchImpl}),/CREDENTIALS_MISSING/);
 await assert.rejects(()=>classify({accountId:aid,token:"",fetchImpl:f.fetchImpl}),/CREDENTIALS_MISSING/);
 assert.equal(f.requests.length,0);
});
test("workflow strictly invokes read-only D1 role probe only after failed source GET",async()=>{
 const y=await readFile(new URL("../../.github/workflows/system2-g6-source-weekday-cron-readonly.yml",import.meta.url),"utf8");
 assert.match(y,/if: failure\(\) && steps\.source_get\.outcome == 'failure'/);
 assert.match(y,/node system2\/migration\/source_g6_account_role_d1_metadata_getonly_v0_1\.mjs/);
 assert.match(y,/environment: system2-research/);
 assert.doesNotMatch(y,/S2_SCHEMA_DEST_/);
});
