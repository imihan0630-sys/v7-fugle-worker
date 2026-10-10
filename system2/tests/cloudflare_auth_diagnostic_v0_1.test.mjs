import assert from "node:assert/strict";
import {diagnoseCloudflareReadAccess as diag, confirmTwoAccountAuthDiagnostic as gate} from "../migration/cloudflare_auth_diagnostic_v0_1.mjs";

const accountId="a".repeat(32),token="DO_NOT_EXPOSE_EXAMPLE_TOKEN_SECRET";
function replies({verify=200,verifyActive=true,d1=200,d1Success=true}={}){
  const calls=[];
  const fetchImpl=async (url,options)=>{
    calls.push({url, method:options.method, headers:options.headers});
    if(url.endsWith("/user/tokens/verify")) return {ok:verify===200,status:verify,json:async()=>({success:verify===200,result:{status:verifyActive?"active":"expired",id:"DO_NOT_PRINT_TOKEN_ID"}})};
    if(url.includes("/d1/database")) return {ok:d1===200,status:d1,json:async()=>({success:d1Success,result:[{name:"PROTECTED_DO_NOT_LOG"}]})};
    throw new Error("unexpected endpoint");
  };
  return {calls,fetchImpl};
}
const good = replies();
const first=await diag({role:"SOURCE",accountId,apiToken:token,fetchImpl:good.fetchImpl});
assert.equal(first.status,"D1_READ_GRANTED");
assert.equal(first.tokenVerifyHttp,200);
assert.equal(first.d1Http,200);
assert.deepEqual(good.calls.map(x=>x.method),["GET","GET"]);
assert(good.calls.every(x=>x.headers.Authorization === "Bearer " + token));
const printed=JSON.stringify(first);
assert(!printed.includes(accountId) && !printed.includes(token) && !printed.includes("DO_NOT_PRINT_TOKEN_ID"));
assert.equal(gate({source:first,destination:{...first,role:"DESTINATION"}}),"D1_READ_PREFLIGHT_PASS");
for(const [args,expected] of [
  [{verify:401,d1:401},"D1_AUTH_DENIED_TOKEN_OR_ACCOUNT_NOT_CONFIRMED"],
  [{verify:200,d1:401},"TOKEN_ACTIVE_D1_ACCOUNT_SCOPE_OR_PERMISSION_DENIED"],
  [{verify:200,d1:403},"TOKEN_ACTIVE_D1_ACCOUNT_SCOPE_OR_PERMISSION_DENIED"],
  [{verify:200,d1:403,verifyActive:false},"TOKEN_INACTIVE"],
  [{verify:200,d1:200,verifyActive:false},"D1_READ_GRANTED_TOKEN_VERIFY_UNCONFIRMED"],
  [{verify:500,d1:200},"D1_READ_GRANTED_TOKEN_VERIFY_UNCONFIRMED"],
  [{verify:200,d1:429},"D1_RATE_LIMITED"],
  [{verify:500,d1:500},"READ_ACCESS_UNVERIFIED"],
  [{verify:200,d1:200,d1Success:false},"READ_ACCESS_UNVERIFIED"],
]){
 const m=replies(args),x=await diag({role:"DESTINATION",accountId,apiToken:token,fetchImpl:m.fetchImpl});
 assert.equal(x.status,expected,JSON.stringify({args,x}));
 assert.equal(m.calls.length,2);
}
const missing=await diag({role:"SOURCE",accountId,apiToken:"",fetchImpl:good.fetchImpl});
assert.equal(missing.status,"TOKEN_SECRET_EMPTY");
const invalid=await diag({role:"SOURCE",accountId:"WRONG",apiToken:token,fetchImpl:good.fetchImpl});
assert.equal(invalid.status,"ACCOUNT_ID_INVALID");
assert.equal(gate({source:first,destination:missing}),"BLOCKED_INVALID_REPORT");
assert.equal(gate({source:first,destination:{...missing,role:"DESTINATION"}}),"BLOCKED_READ_ACCOUNT_AUTH");
const thrown=await diag({role:"SOURCE",accountId,apiToken:token,fetchImpl:async()=>{throw Error("SECRET_"+token)}});
assert.equal(thrown.status,"READ_ACCESS_UNVERIFIED");
assert(!JSON.stringify(thrown).includes(token));
await assert.rejects(diag({role:"OTHER",accountId,apiToken:token,fetchImpl:good.fetchImpl}),/ROLE_NOT_ALLOWED/);
console.log("System2 Cloudflare auth diagnostic: 16 offline tests PASS");
