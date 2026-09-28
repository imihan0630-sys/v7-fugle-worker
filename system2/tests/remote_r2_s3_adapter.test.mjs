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
for(const call of calls){
  assert.match(call.headers.get("authorization")||"",/^AWS4-HMAC-SHA256 /);
  assert.equal(call.headers.get("x-amz-date"),"20260928T143000Z");
  assert.equal(call.headers.get("host"),"abc123.r2.cloudflarestorage.com");
}
assert.ok(calls.every((call)=>call.url.includes("system2-historical-research/a1/v0.1/test.json.gz")));

console.log("System2 remote R2 S3 adapter tests passed");
