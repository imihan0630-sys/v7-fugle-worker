import assert from "node:assert/strict";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";

const calls=[];
const payload=new TextEncoder().encode("packed-history");
const fetchImpl=async (url,options)=>{
  calls.push({url,options,headers:new Headers(options.headers)});
  const method=options.method;
  if(method==="HEAD"&&calls.length===1)return new Response(null,{status:404});
  const headers={
    "content-length":String(payload.byteLength),
    etag:'"etag-1"',
    "last-modified":"Sun, 28 Sep 2026 14:30:00 GMT",
    "x-amz-version-id":"version-1",
    "x-amz-storage-class":"STANDARD",
    "x-amz-meta-payload-hash":"payload-hash",
    "x-amz-meta-object-sha256":"object-sha",
  };
  if(method==="GET")return new Response(payload,{status:200,headers});
  return new Response(null,{status:200,headers});
};
const adapter=createRemoteR2S3Adapter({
  accountId:"abc123",accessKeyId:"access",secretAccessKey:"secret",
  bucketName:"system2-historical-research",fetchImpl,
  now:()=>new Date("2026-09-28T14:30:00Z"),
});
assert.equal(await adapter.head("a1/v0.1/test.json.gz"),null);
const put=await adapter.putIfAbsent("a1/v0.1/test.json.gz",payload,{
  customMetadata:{"payload-hash":"payload-hash","object-sha256":"object-sha"},
});
assert.equal(put.etag,"etag-1");
const loaded=await adapter.get("a1/v0.1/test.json.gz");
assert.deepEqual([...loaded.bytes],[...payload]);
assert.equal(calls[1].headers.get("if-none-match"),"*");
assert.equal(calls[1].headers.get("content-encoding"),null,"opaque object writes must not default Content-Encoding");
for(const call of calls){
  assert.match(call.headers.get("authorization")||"",/^AWS4-HMAC-SHA256 /);
  assert.equal(call.headers.get("x-amz-date"),"20260928T143000Z");
  assert.equal(call.headers.get("host"),"abc123.r2.cloudflarestorage.com");
}
assert.ok(calls.every((call)=>call.url.includes("system2-historical-research/a1/v0.1/test.json.gz")));

const retryHeaders={
  "content-length":"1",
  etag:'"retry-etag"',
  "last-modified":"Sun, 04 Oct 2026 08:00:00 GMT",
};
let retryHeadCalls=0;
const retryAdapter=createRemoteR2S3Adapter({
  accountId:"abc123",accessKeyId:"access",secretAccessKey:"secret",
  bucketName:"system2-historical-research",
  retryAttempts:3,retryDelayMs:0,
  now:()=>new Date("2026-10-04T08:00:00Z"),
  fetchImpl:async ()=>{
    retryHeadCalls+=1;
    if(retryHeadCalls===1)return new Response(null,{status:502});
    return new Response(null,{status:200,headers:retryHeaders});
  },
});
const retriedHead=await retryAdapter.head("a1/v0.1/retry.json.gz");
assert.equal(retryHeadCalls,2,"transient R2 5xx must be retried within the bounded budget");
assert.equal(retriedHead.etag,"retry-etag");

let transportCalls=0;
const transportAdapter=createRemoteR2S3Adapter({
  accountId:"abc123",accessKeyId:"access",secretAccessKey:"secret",
  bucketName:"system2-historical-research",
  retryAttempts:2,retryDelayMs:0,
  fetchImpl:async ()=>{
    transportCalls+=1;
    if(transportCalls===1)throw new TypeError("fetch failed");
    return new Response(null,{status:404});
  },
});
assert.equal(await transportAdapter.head("a1/v0.1/transport.json.gz"),null);
assert.equal(transportCalls,2,"transient transport errors must be retried");

let forbiddenCalls=0;
const forbiddenAdapter=createRemoteR2S3Adapter({
  accountId:"abc123",accessKeyId:"access",secretAccessKey:"secret",
  bucketName:"system2-historical-research",
  retryAttempts:4,retryDelayMs:0,
  fetchImpl:async ()=>{
    forbiddenCalls+=1;
    return new Response(null,{status:403});
  },
});
await assert.rejects(
  forbiddenAdapter.head("a1/v0.1/forbidden.json.gz"),
  /R2 HEAD failed: HTTP 403/,
);
assert.equal(forbiddenCalls,1,"non-retryable authorization errors must fail closed immediately");

console.log("System2 remote R2 S3 adapter tests passed");
