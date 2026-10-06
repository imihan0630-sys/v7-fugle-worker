import assert from "node:assert/strict";
import {publicSource} from "./official_source_fetch.mjs";

function timeoutError(){
  const e=new Error("The operation was aborted due to timeout");
  e.name="TimeoutError";
  return e;
}
function mockResponse({status=200,body="ok",bodyError=null}={}){
  return {
    status,
    ok:status>=200&&status<300,
    statusText:status===200?"OK":"ERR",
    headers:new Headers({"content-type":"text/plain"}),
    body:{cancel:async()=>{}},
    arrayBuffer:async()=>{
      if(bodyError) throw bodyError;
      return new TextEncoder().encode(body).buffer;
    }
  };
}
const noSleep=async()=>{};

let calls=0;
const bodyTimeoutThenSuccess=async()=>{
  calls++;
  return calls===1?mockResponse({bodyError:timeoutError()}):mockResponse({body:"recovered"});
};
const recovered=await publicSource("https://mopsov.twse.com.tw/mops/web/ajax_t163sb04",{},{
  fetchImpl:bodyTimeoutThenSuccess,attempts:3,timeoutMs:1000,sleep:noSleep
});
assert.equal(await recovered.text(),"recovered");
assert.equal(calls,2,"body-read timeout must be retried");

calls=0;
await assert.rejects(()=>publicSource("https://mopsov.twse.com.tw/mops/web/ajax_t163sb04",{},{
  fetchImpl:async()=>{calls++;return mockResponse({bodyError:timeoutError()});},
  attempts:3,timeoutMs:1000,sleep:noSleep
}),/Public source \/mops\/web\/ajax_t163sb04: .*timeout/i);
assert.equal(calls,3,"body-read timeout must honor bounded retry budget");

calls=0;
await assert.rejects(()=>publicSource("https://example.invalid/forbidden",{},{
  fetchImpl:async()=>{calls++;return mockResponse({status:403});},
  attempts:3,timeoutMs:1000,sleep:noSleep
}),/disallows access/);
assert.equal(calls,1,"401/403 must fail closed without retry or bypass");

calls=0;
const serverRetry=await publicSource("https://example.invalid/transient",{},{
  fetchImpl:async()=>{calls++;return calls<3?mockResponse({status:503}):mockResponse({body:"ok-after-503"});},
  attempts:3,timeoutMs:1000,sleep:noSleep
});
assert.equal(await serverRetry.text(),"ok-after-503");
assert.equal(calls,3,"429/5xx bounded retry semantics must remain");

calls=0;
await assert.rejects(()=>publicSource("https://example.invalid/bad-request",{},{
  fetchImpl:async()=>{calls++;return mockResponse({status:400});},
  attempts:3,timeoutMs:1000,sleep:noSleep
}),/Official source HTTP 400/);
assert.equal(calls,1,"non-retryable 4xx must fail once");

console.log(JSON.stringify({
  ok:true,
  bodyReadInsideRetry:true,
  boundedAttempts:3,
  authorizationFailClosed:true,
  retryable5xxPreserved:true,
  timeoutMsDefault:45000,
  formalCoreImpact:false
}));
