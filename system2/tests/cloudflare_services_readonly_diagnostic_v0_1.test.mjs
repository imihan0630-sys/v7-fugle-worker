import assert from "node:assert/strict";
import { diagnoseCloudflareServicesReadOnly as diag, assessTwoAccountServiceReads as gate}
  from "../migration/cloudflare_services_readonly_diagnostic_v0_1.mjs";
const accountId="a".repeat(32), apiToken="DONT_PRINT_PROTECTED_SECRET";
const done=[];
function mock({status={},codes={},malicious=false}={}){
 const calls=[];
 const fetchImpl=async (url,options)=>{
   calls.push({url,options});
   const service=url.includes("/d1/database")?"D1":url.includes("/workers/scripts")?"WORKERS":
     url.includes("/storage/kv/namespaces")?"KV":url.includes("/r2/buckets")?"R2":"UNKNOWN";
   assert.notEqual(service,"UNKNOWN");
   const st=status[service]??200,code=codes[service]??null;
   return {status:st,ok:st===200,json:async()=>({
     success:st===200,
     errors:code===null?[]:[{code,message:malicious?"SECRET:"+apiToken:"do not print"}],
     result:st===200?{buckets:[],token:"DO_NOT_PRINT_RESULT"}:null,
   })};
 };
 return {calls,fetchImpl};
}
const m=mock();
const good=await diag({role:"SOURCE",accountId,apiToken,fetchImpl:m.fetchImpl});
assert.equal(good.status,"ALL_SERVICE_READS_GRANTED");
assert.equal(good.services.length,4);
assert(good.services.every(x=>x.classification==="READ_GRANTED"));
assert(m.calls.every(x=>x.options.method==="GET"));
assert(m.calls.every(x=>x.options.headers.Authorization==="Bearer "+apiToken));
assert.equal(gate({source:good,destination:{...good,role:"DESTINATION"}}),"SERVICES_READ_PREFLIGHT_PASS");
const redacted=JSON.stringify(good);
assert(!redacted.includes(accountId)&&!redacted.includes(apiToken)&&!redacted.includes("DO_NOT_PRINT_RESULT"));
function check(options,expected){
 return diag({role:"DESTINATION",accountId,apiToken,fetchImpl:mock(options).fetchImpl}).then(v=>{
   assert.equal(v.status,"INCOMPLETE_SERVICE_READS");
   const r2=v.services.find(s=>s.service==="R2");
   assert.equal(r2.classification,expected);
   assert(!JSON.stringify(v).includes(apiToken));
   return v;
 });
}
const notEntitled=await check({status:{R2:403},codes:{R2:10042},malicious:true},"R2_ACCOUNT_NOT_ENTITLED");
const noScope=await check({status:{R2:403},codes:{R2:10003}},"R2_READ_PERMISSION_DENIED");
await check({status:{R2:403}},"R2_403_REASON_NOT_VERIFIED");
await check({status:{R2:401}},"READ_PERMISSION_OR_ACCOUNT_DENIED");
await check({status:{R2:429}},"RATE_LIMITED");
await check({status:{R2:500}},"SERVICE_UNVERIFIED");
assert.equal(gate({source:good,destination:notEntitled}),"BLOCKED_SERVICE_READS");
assert.equal(gate({source:good,destination:noScope}),"BLOCKED_SERVICE_READS");
assert.equal(gate({source:good,destination:good}),"BLOCKED_SERVICE_DIAGNOSTIC_INVALID");
assert.equal(gate({source:good,destination:{...good,role:"DESTINATION"},accountCollision:true}),"BLOCKED_ACCOUNT_ID_COLLISION");
let bothDenied=mock({status:{D1:403,WORKERS:403,KV:403,R2:403}});
const x=await diag({role:"SOURCE",accountId,apiToken,fetchImpl:bothDenied.fetchImpl});
assert.equal(bothDenied.calls.length,4); assert.equal(x.services.length,4);
const bad=await diag({role:"SOURCE",accountId:"BAD",apiToken,fetchImpl:m.fetchImpl});
assert.equal(bad.status,"INPUT_INVALID");
const thrown=await diag({role:"SOURCE",accountId,apiToken,fetchImpl:async()=>{throw Error(apiToken)}});
assert(thrown.services.every(s=>s.classification==="TRANSPORT_OR_RESPONSE_UNVERIFIED"));
assert(!JSON.stringify(thrown).includes(apiToken));
await assert.rejects(diag({role:"BAD",accountId,apiToken,fetchImpl:m.fetchImpl}),/ROLE_INVALID/);
console.log("System2 Cloudflare service READ diagnosis: 16 cases PASS, independent four-service probes, no credential leaks");
