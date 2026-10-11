import assert from "node:assert/strict";
import {collectSourceG5QuotaV0_1 as collect} from
  "../../research/system1_g5_source_quota_cloudflare_readonly_20261011.mjs";
const a="a".repeat(32),b="b".repeat(32);
const schedules=["0-24 5 * * MON-FRI","* 1-4 * * MON-FRI",
  "35,55 15 * * mon-fri","* 9 * * MON-FRI"];
let calls=[],sampleNumber=0;
const ok=x=>({ok:true,json:async()=>x});
const requester=async(url,options)=>{
  calls.push({url,method:options?.method});
  if(url.includes("/d1/database"))return ok({success:true,result:[
    {name:"v7-live",uuid:a},{name:"system2-research",uuid:b}]});
  if(url.includes("system2-shadow-research/schedules"))
    return ok({success:true,result:[]});
  if(url.includes("fugle-test/schedules"))
    return ok({success:true,result:schedules.map(cron=>({cron}))});
  if(url.includes("/workers/scripts?"))
    return ok({success:true,result:[{id:"fugle-test"},
      {id:"system2-shadow-research"}]});
  if(url.includes("/graphql")){
    assert.equal(options.method,"POST");
    assert.ok(options.body.includes("d1AnalyticsAdaptiveGroups"));
    assert.ok(!options.body.toUpperCase().includes("MUTATION"));
    sampleNumber++;
    return ok({data:{viewer:{accounts:[{d1AnalyticsAdaptiveGroups:[
      {dimensions:{date:"2026-10-11",databaseId:a},sum:{
        rowsRead:180000+sampleNumber,rowsWritten:0,
        readQueries:1000,writeQueries:0}},
      {dimensions:{date:"2026-10-11",databaseId:b},sum:{
        rowsRead:1,rowsWritten:0,readQueries:1,writeQueries:0}}
    ]}]}}});
  }
  throw Error("UNEXPECTED_REQUEST_"+url);
};
const args={accountId:"c".repeat(32),workerToken:"not-real",
  d1Token:"not-real",request:requester,
  observedAt:()=>"2026-10-11T14:11:00.000Z"};
const result=await collect(args);
assert.equal(result.sourceS2WorkerCronCount,0);
assert.equal(result.v8WorkerCronCount,4);
assert.equal(result.samples[1].account.rowsReadLowerBound,180003);
assert.equal(result.samples[1].account.rowsWrittenLowerBound,0);
assert.equal(result.cloudflareGraphQLCalls,2);
assert.equal(result.cloudflareGetCalls,4);
assert.equal(result.d1SqlCalls,0);
assert.equal(result.system1PrimaryPerRunRowsRead,null);
assert.equal(result.system1PrimaryPerRunRowsWritten,null);
assert.equal(result.remainingRowsReadVerified,null);
assert.equal(result.remainingRowsWrittenVerified,null);
assert.equal(result.system1ReadReserveAuthorized,false);
assert.equal(result.system1WriteReserveAuthorized,false);
assert.equal(result.sourceBackupSafeToStart,false);
assert.equal(result.independentAuditAcceptance,false);
assert.equal(calls.length,6);
for(const c of calls)assert.ok(c.method==="GET"||c.method==="POST");
for(const c of calls.filter(x=>x.method==="POST"))assert.ok(c.url.endsWith("/graphql"));
const mutated=async(url,opt)=>{
 if(url.includes("system2-shadow-research/schedules"))
   return ok({success:true,result:[{cron:"*/5 0-5,11 * * MON-FRI"}]});
 return requester(url,opt);
};
await assert.rejects(collect({...args,request:mutated}),
  /G5_SOURCE_OBSERVATION_OLD_SYSTEM2_CRON_REACTIVATED/);
const malformed=async(url,opt)=>{
 if(url.includes("/graphql"))return ok({data:{viewer:{accounts:[{
  d1AnalyticsAdaptiveGroups:[{dimensions:{date:"2026-10-11",databaseId:a},
    sum:{rowsRead:"180000",rowsWritten:0,readQueries:1,writeQueries:0}},
    {dimensions:{date:"2026-10-11",databaseId:b},
    sum:{rowsRead:1,rowsWritten:0,readQueries:1,writeQueries:0}}]
 }]}}});
 return requester(url,opt);
};
await assert.rejects(collect({...args,request:malformed}),
  /G5_SOURCE_OBSERVATION_D1_ANALYTICS_PARTIAL/);
const missing=async(url,opt)=>{
 if(url.includes("/graphql"))return ok({data:{viewer:{accounts:[{
  d1AnalyticsAdaptiveGroups:[]}]}}});
 return requester(url,opt);
};
await assert.rejects(collect({...args,request:missing}),
  /G5_SOURCE_OBSERVATION_D1_GROUP_CARDINALITY_UNVERIFIED/);
console.log("S1_G5_SOURCE_GRAPHQL_2_SAMPLE_REAL_GUARD_3_FAILCLOSED_TESTS_NO_D1_SQL_PASS");
