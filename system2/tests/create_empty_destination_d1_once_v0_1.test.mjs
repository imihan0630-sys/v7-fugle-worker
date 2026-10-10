// NO actual Cloudflare connections: explicit fake fetch only. Job is owner-gated DRAFT.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createOneEmptyDestinationD1V0_1 as create, S2_EMPTY_D1_CONFIRM as CONFIRM,
  S2_FREE_ACK as FREE_ACK} from "../migration/create_empty_destination_d1_once_v0_1.mjs";
const SOURCE="a".repeat(32),DESTINATION="b".repeat(32),DB="c".repeat(32);
const TOKEN="test_only_fake_token_no_real_secret_12345";
const fake=(opts={})=>{
  const calls=[];
  let listCount=0;
  const fetchImpl=async (url,request={})=>{
    const method=request.method||"GET";
    const suffix=String(url).split("/accounts/"+DESTINATION)[1];
    calls.push({method,suffix,body:request.body});
    if(opts.throwPost&&method==="POST")throw Error("NETWORK_ERROR");
    if(opts.denyGet&&method==="GET")return new Response(JSON.stringify({success:false}),{status:403});
    if(suffix==="/tokens/verify"&&method==="GET")
      return Response.json({success:true,result:{status:"active"}});
    if(suffix==="/d1/database?page=1&per_page=100"&&method==="GET"){
      listCount+=1;
      const first={success:true,result:[],result_info:{total_count:0,count:0,page:1,per_page:100}};
      const after={success:true,result:[{name:"system2-research",uuid:DB}],
        result_info:{total_count:1,count:1,page:1,per_page:100}};
      const v=listCount===1?Object.assign(first,opts.before||{}):Object.assign(after,opts.after||{});
      return Response.json(v);
    }
    if(suffix==="/d1/database"&&method==="POST") {
      assert.deepEqual(JSON.parse(request.body),{name:"system2-research"});
      assert.equal(request.headers.authorization,"Bearer "+TOKEN);
      if(opts.postHttpError)return new Response(JSON.stringify({success:false}),{status:500});
      return Response.json({success:true,result:{name:"system2-research",uuid:DB}});
    }
    throw Error("UNEXPECTED_METHOD_OR_PATH");
  };
  return {fetchImpl,calls};
};
function input(f){return {sourceAccountId:SOURCE,destinationAccountId:DESTINATION,
  apiToken:TOKEN,confirm:CONFIRM,freeAck:FREE_ACK,fetchImpl:f};}
const success=fake();
const v=await create(input(success.fetchImpl));
assert.equal(v.status,"ONE_EMPTY_D1_RESOURCE_CREATED_AND_LISTED");
assert.equal(v.databaseCount,1);
assert.equal(v.schemaSqlStatementsExecuted,0);
assert.equal(v.databaseRowsCopied,0);
assert.equal(v.sourceDatabaseMutated,false);
assert.equal(v.workerRequests,0);
assert.equal(v.r2Requests,0);
assert.equal(v.cronUpdates,0);
assert.equal(v.workerDeployed,false);
assert.equal(v.physicalMigrationAccepted,false);
assert.deepEqual(success.calls.map(c=>[c.method,c.suffix]),[
  ["GET","/tokens/verify"],
  ["GET","/d1/database?page=1&per_page=100"],
  ["POST","/d1/database"],
  ["GET","/d1/database?page=1&per_page=100"],
]);
assert(!JSON.stringify(v).includes(DESTINATION));
assert(!JSON.stringify(v).includes(TOKEN));
assert(!JSON.stringify(v).includes(DB));
async function blocked(patch,code,{maxPost=0}={}){
  const f=fake();const a=input(f.fetchImpl);patch(a);
  await assert.rejects(()=>create(a),e=>e.message===code);
  assert(f.calls.filter(c=>c.method==="POST").length<=maxPost);
}
await blocked(a=>a.confirm="WRONG","DESTINATION_D1_CREATION_OWNER_GATE_MISSING");
await blocked(a=>a.freeAck="NO","DESTINATION_D1_CREATION_OWNER_GATE_MISSING");
await blocked(a=>a.sourceAccountId=DESTINATION,"DESTINATION_ACCOUNT_IDENTITY_MISMATCH_OR_SOURCE_COLLISION");
await blocked(a=>a.sourceAccountId="INVALID","DESTINATION_ACCOUNT_IDENTITY_MISMATCH_OR_SOURCE_COLLISION");
await blocked(a=>a.destinationAccountId="WRONG","DESTINATION_ACCOUNT_IDENTITY_MISMATCH_OR_SOURCE_COLLISION");
await blocked(a=>a.apiToken="short","DESTINATION_WRITE_TOKEN_REQUIRED");
await blocked(a=>a.fetchImpl=undefined,"FETCH_INJECTION_REQUIRED");
const notEmpty=fake({before:{result:[{name:"system2-research",uuid:DB}],result_info:{total_count:1,count:1,page:1,per_page:100}}});
await assert.rejects(()=>create(input(notEmpty.fetchImpl)),/DESTINATION_DATABASE_SCOPE_NOT_EMPTY/);
assert.equal(notEmpty.calls.some(c=>c.method==="POST"),false);
const truncated=fake({before:{result_info:{total_count:0,count:0,page:2,per_page:100}}});
await assert.rejects(()=>create(input(truncated.fetchImpl)),/DESTINATION_DATABASE_SCOPE_NOT_EMPTY/);
const unknownList=fake({before:{result_info:{}}});
await assert.rejects(()=>create(input(unknownList.fetchImpl)),/DESTINATION_DATABASE_SCOPE_NOT_EMPTY/);
const denied=fake({denyGet:true});
await assert.rejects(()=>create(input(denied.fetchImpl)),/DESTINATION_READ_HTTP_UNVERIFIED/);
const timeout=fake({throwPost:true});
await assert.rejects(()=>create(input(timeout.fetchImpl)),/D1_CREATE_OUTCOME_UNKNOWN_MANUAL_READBACK_NO_RETRY/);
assert.equal(timeout.calls.filter(c=>c.method==="POST").length,1);
const errorPost=fake({postHttpError:true});
await assert.rejects(()=>create(input(errorPost.fetchImpl)),/D1_CREATE_OUTCOME_UNKNOWN_MANUAL_READBACK_NO_RETRY/);
assert.equal(errorPost.calls.filter(c=>c.method==="POST").length,1);
const badAfter=fake({after:{result:[],result_info:{total_count:0,count:0,page:1,per_page:100}}});
await assert.rejects(()=>create(input(badAfter.fetchImpl)),/D1_CREATE_READBACK_UNVERIFIED_MANUAL_REVIEW_NO_RETRY/);
assert.equal(badAfter.calls.filter(c=>c.method==="POST").length,1);
// Extra guard: static inspection of manually triggered workflow and runner.
const workflow=readFileSync(".github/workflows/system2-destination-empty-d1-owner-gated.yml","utf8");
const runner=readFileSync("system2/migration/run_create_empty_destination_d1_once_v0_1.mjs","utf8");
assert.match(workflow,/^\s+workflow_dispatch:/m);
assert.doesNotMatch(workflow,/^\s+(?:push|schedule|pull_request):/m);
assert.match(workflow,/environment: system2-destination-provision/);
assert.doesNotMatch(workflow,/environment: system2-research/);
assert.match(workflow,/GITHUB_REF/);
assert.match(workflow,/FREE_TIER_NO_BILLING_CHANGE_ACKNOWLEDGED/);
assert.match(workflow,/S2_SOURCE_ACCOUNT_ID_DENY/);
assert.doesNotMatch(workflow,/wrangler\s+deploy|npm\s+run\s+deploy|terraform\s+apply/i);
assert.doesNotMatch(runner,/provision_system2_d1\.mjs|worker\.mjs|\/query|\/r2\/|\/workers\/scripts/);
assert.match(runner,/GITHUB_EVENT_NAME/);
console.log("System2 new destination D1 create-only OWNER-GATED draft: 27+ mocked/static checks PASS; no actual Cloudflare requests");
