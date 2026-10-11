import test from "node:test";
import assert from "node:assert/strict";
import {sourceCronPauseV0_1, APPROVED_CRON} from "../migration/source_system2_cron_pause_owner_approved_v0_1.mjs";

const ID="1".repeat(32), DB="2".repeat(32);
function twoScopedSourceCredentials(){
 const observed=[];
 const workerToken="FIXTURE_WORKERS_EXISTING_TOKEN";
 const d1Token="FIXTURE_D1_EXISTING_TOKEN";
 async function fetchImpl(url,options={}){
  const u=new URL(url),path=u.pathname;
  const auth=options.headers?.Authorization;
  observed.push({path,method:options.method,auth});
  const worker=path.includes("/workers/");
  if(worker?auth!=="Bearer "+workerToken:auth!=="Bearer "+d1Token)
   return new Response(JSON.stringify({success:false}),{status:403});
  if(options.method!=="GET")throw Error("NO_PUT_ALLOWED_IN_INSPECT_TEST");
  let result;
  if(path.endsWith("/workers/scripts"))result=[{id:"system2-shadow-research"},{id:"fugle-test"}];
  else if(path.endsWith("/d1/database"))result=[{name:"v7-live",uuid:"3".repeat(32)},{name:"system2-research",uuid:DB}];
  else if(path.endsWith("/workers/scripts/system2-shadow-research/settings"))result={bindings:[{type:"d1",name:"SYSTEM2_DB",database_id:DB}]};
  else if(path.endsWith("/workers/scripts/system2-shadow-research/schedules"))result={schedules:[{cron:APPROVED_CRON}]};
  else if(path.endsWith("/workers/scripts/fugle-test/schedules"))result={schedules:[{cron:"0 * * * *"},{cron:"5 * * * *"}]};
  else throw Error("UNEXPECTED_CLOUDFLARE_ENDPOINT");
  return new Response(JSON.stringify({success:true,result}),{status:200});
 }
 return {accountId:ID,token:d1Token,workersToken:workerToken,fetchImpl,observed};
}
test("old source Worker and D1 scopes use two preexisting tokens, GET only",async()=>{
 const args=twoScopedSourceCredentials();
 const result=await sourceCronPauseV0_1({...args,mode:"INSPECT"});
 assert.equal(result.state,"FRESH_SOURCE_READONLY_INSPECTED_NOT_PAUSED");
 assert.equal(result.cloudMutationsRequested,0);
 assert.equal(result.sourceCronBefore[0],APPROVED_CRON);
 assert.equal(result.nonTargetScheduleCount,2);
 assert.equal(args.observed.filter(x=>x.method!=="GET").length,0);
 assert.equal(args.observed.filter(x=>x.path.includes("/workers/")).every(x=>x.auth==="Bearer "+args.workersToken),true);
 assert.equal(args.observed.filter(x=>x.path.includes("/d1/")).every(x=>x.auth==="Bearer "+args.token),true);
});
test("incorrect Worker-scope token fails before any source mutation",async()=>{
 const args=twoScopedSourceCredentials();
 await assert.rejects(()=>sourceCronPauseV0_1({...args,workersToken:"WRONG_SCOPED_TOKEN",mode:"PAUSE"}),/CLOUDFLARE_GET_FAILED/);
 assert.equal(args.observed.filter(x=>x.method!=="GET").length,0);
});
