import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {assessR2ListXml,signedR2ListRequest,inspectM07} from "../migration/issue1236_m07_source_r2_listing_readonly_v0_1.mjs";
const bucket="system2-historical-research";
const original='<?xml version="1.0"?><ListBucketResult><Name>'+bucket+'</Name>'+
  '<KeyCount>2</KeyCount><IsTruncated>true</IsTruncated><NextContinuationToken>opaque</NextContinuationToken>'+
  '<Contents><Key>cold/one&amp;two</Key><Size>12</Size><ETag>"etag-a"</ETag></Contents>'+
  '<Contents><Key>cold/three</Key><Size>4</Size><ETag>"etag-b"</ETag></Contents>'+
  '</ListBucketResult>';
const v=assessR2ListXml(original);
assert.equal(v.sampledObjects,2);
assert.equal(v.sampledObjectListedBytes,16);
assert.equal(v.listingTruncated,true);
assert.equal(v.totalBucketObjectCount,null);
assert.equal(v.byteSha256OfObjectsVerified,false);
assert.equal(v.referencedD1ManifestRowsAreNotObjectCount,25823);
assert.match(v.sampleMetadataSha256,/^[0-9a-f]{64}$/);
const closed=assessR2ListXml(original.replace("<IsTruncated>true</IsTruncated>",
 "<IsTruncated>false</IsTruncated>"));
assert.equal(closed.completeBucketListObserved,true);
assert.equal(closed.totalBucketObjectCount,2);
const empty=assessR2ListXml('<?xml version="1.0"?><ListBucketResult><Name>'+bucket+
 '</Name><KeyCount>0</KeyCount><IsTruncated>false</IsTruncated></ListBucketResult>');
assert.equal(empty.totalBucketObjectCount,0);
for(const bad of [
 original.replace(bucket,"wrong-bucket"),
 original.replace("<KeyCount>2</KeyCount>","<KeyCount>3</KeyCount>"),
 original.replace("<Size>4</Size>","<Size>-1</Size>"),
 original.replace("cold/three","cold/one&amp;two"),
 original.replace("<NextContinuationToken>opaque</NextContinuationToken>",""),
 "not xml",
 null
])assert.throws(()=>assessR2ListXml(bad),/^Error: M07_/);
const signed=signedR2ListRequest({accountId:"a".repeat(32),accessKeyId:"test-access",
 secretAccessKey:"test-secret",now:new Date("2026-10-14T04:00:00.000Z")});
assert.equal(signed.method,"GET");
assert.equal(signed.url,"https://"+"a".repeat(32)+".r2.cloudflarestorage.com/"+bucket+"?list-type=2&max-keys=200");
assert.match(signed.headers.authorization,/^AWS4-HMAC-SHA256 Credential=test-access\/20261014\/auto\/s3\/aws4_request/);
let hits=0;
const result=await inspectM07({accountId:"a".repeat(32),accessKeyId:"test-access",
 secretAccessKey:"test-secret",bucketName:bucket,request:async(url,init)=>{
  hits++;assert.equal(init.method,"GET");assert.match(url,/\?list-type=2&max-keys=200$/);
  assert.equal(init.body,undefined);
  return {ok:true,text:async()=>original};
 }});
assert.equal(hits,1);
assert.equal(result.status,"SOURCE_R2_LIST_PARTIAL_BOUNDED__TOTAL_AND_BYTE_SHA_UNKNOWN");
assert.equal(result.sourceR2Writes,0);
assert.equal(result.independentAuditAcceptance,false);
await assert.rejects(()=>inspectM07({accountId:"a".repeat(32),accessKeyId:"test-access",
 secretAccessKey:"test-secret",bucketName:"wrong",request:async()=>{throw Error("SHOULD_NOT_FETCH")}}),
 /^Error: M07_SOURCE_BUCKET_IDENTITY/);
const workflow=readFileSync(".github/workflows/system2-m07-source-r2-list-readonly.yml","utf8");
const script=readFileSync("system2/migration/issue1236_m07_source_r2_listing_readonly_v0_1.mjs","utf8");
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/SYSTEM2_R2_ACCESS_KEY_ID/);
assert.match(workflow,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.match(workflow,/issue1236_m07_source_r2_listing_readonly_v0_1\.mjs/);
assert.doesNotMatch(workflow,/system2-r2-physical-smoke|environment: system2-schema-only/);
assert.match(script,/MAX_KEYS=200/);
assert.match(script,/sourceR2GetObjectCalls:0/);
assert.doesNotMatch(script,/(method:"PUT"|method:"DELETE"|method:"POST"|putIfAbsent\()/);
console.log("S2 M07 single GET ListObjects 200-cap, no-byte-SHA overclaim and negative fixtures PASS");
