import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {decodeS3Xml,parseR2Page,signedR2Page,scanM07Pages} from "../migration/issue1236_m07_r2_multipage_metadata_only_v0_1.mjs";
const B="system2-historical-research";
function xml({start=0,n=2,more=true,token="next",size=20,bucket=B,duplicates=false}={}){
 const children=Array.from({length:n},(_,i)=>{
  const key=duplicates?"a":("archive/"+String(start+i).padStart(6,"0")+".gz");
  return "<Contents><Key>"+key+"</Key><Size>"+size+"</Size><ETag>abc</ETag></Contents>";
 }).join("");
 return '<?xml version="1.0"?><ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">'+
  "<Name>"+bucket+"</Name><KeyCount>"+n+"</KeyCount>"+
  "<IsTruncated>"+more+"</IsTruncated>"+
  (more?"<NextContinuationToken>"+token+"</NextContinuationToken>":"")+
  children+"</ListBucketResult>";
}
assert.equal(decodeS3Xml("a&amp;b&lt;c&gt;"),"a&b<c>");
assert.equal(decodeS3Xml("&#x4E2D;&#25991;"),"中文");
assert.deepEqual(parseR2Page(xml({more:false})).entries.length,2);
for(const [input,code] of [
 [xml({bucket:"public-other"}),"BUCKET_OR_TRUNCATION_INVALID"],
 [xml({duplicates:true}),"PAGE_OBJECT_INVALID"],
 [xml({more:true,token:""}),"CONTINUATION_INVALID"],
 [xml({n:1001}),"PAGE_OVER_1000"],
 [xml({size:-1}),"PAGE_OBJECT_INVALID"],
 [xml({more:false}).replace("<KeyCount>2</KeyCount>","<KeyCount>3</KeyCount>"),"REPORTED_KEYCOUNT_MISMATCH"],
 [xml({more:false}).replace("false</IsTruncated>","false</IsTruncated><NextContinuationToken>evil</NextContinuationToken>"),"FINISHED_WITH_CONTINUATION"],
 ["garbage","XML_OUTSIDE_BOUND"],
 ["<!DOCTYPE payload>"+xml({more:false}),"XML_OUTSIDE_BOUND"]
])assert.throws(()=>parseR2Page(input),new RegExp("M07_PAGES_"+code));
const req=signedR2Page({accountId:"a".repeat(32),accessKeyId:"access",secretAccessKey:"secret",
 continuationToken:"key+/=&",clock:new Date("2026-10-14T04:00:00Z")});
assert.equal(req.method,"GET");
assert.match(req.url,/\?continuation-token=key%2B%2F%3D%26&list-type=2&max-keys=1000$/);
assert.match(req.headers.authorization,/AWS4-HMAC-SHA256 Credential=access\/20261014\/auto\/s3\/aws4_request/);
await assert.rejects(async()=>signedR2Page({accountId:"not-a-hash",accessKeyId:"a",secretAccessKey:"b"}),/M07_PAGES_SIGN_SCOPE_INVALID/);
const base={accountId:"a".repeat(32),accessKeyId:"access",secretAccessKey:"secret",bucketName:B};
let calls=0;
const complete=await scanM07Pages({...base,fetchImpl:async(url,opts)=>{
 calls++;assert.equal(opts.method,"GET");assert.equal(opts.body,undefined);
 return {ok:true,text:async()=>calls===1?xml({n:1000,more:true,token:"opaque-2"}):
   xml({start:1000,n:2,more:false})};
}});
assert.equal(calls,2);
assert.equal(complete.observedObjects,1002);
assert.equal(complete.listedObjectBytes,20040);
assert.equal(complete.completeListingObserved,true);
assert.equal(complete.bucketTotalObjectCount,1002);
assert.equal(complete.sourceR2ObjectBodyShaVerified,0);
assert.equal(complete.independentAuditAccepted,false);
assert.equal(JSON.stringify(complete).includes("archive/"),false);
calls=0;
const truncated=await scanM07Pages({...base,fetchImpl:async()=>{
 calls++;return {ok:true,text:async()=>xml({start:1000*calls,n:1000,more:true,token:"next-"+calls})};
}});
assert.equal(calls,4);
assert.equal(truncated.observedObjects,4000);
assert.equal(truncated.completeListingObserved,false);
assert.equal(truncated.bucketTotalObjectCount,null);
assert.equal(truncated.sourceR2ListGetCalls,4);
assert.equal(truncated.sourceR2Writes,0);
assert.equal(truncated.sourceD1Queries,0);
calls=0;
await assert.rejects(()=>scanM07Pages({...base,fetchImpl:async()=>{
 calls++;return {ok:true,text:async()=>xml({start:0,n:2,more:true,token:"same"})};
}}),/M07_PAGES_DUPLICATE_ACROSS_PAGES/);
assert.equal(calls,2);
calls=0;
await assert.rejects(()=>scanM07Pages({...base,fetchImpl:async()=>{
 calls++;return {ok:false,status:403,text:async()=>""};
}}),/M07_PAGES_SOURCE_R2_LIST_HTTP_403/);
assert.equal(calls,1);
const file=readFileSync("system2/migration/issue1236_m07_r2_multipage_metadata_only_v0_1.mjs","utf8");
const wf=readFileSync(".github/workflows/system2-m07-source-r2-multipage-readonly.yml","utf8");
assert.match(file,/PER_PAGE=1000,MAX_PAGES=4/);
assert.match(file,/sourceR2GetObjectCalls:0/);
assert.match(file,/continuationTokenPersisted:false/);
assert.doesNotMatch(file,/putIfAbsent|INSERT INTO|DELETE FROM|UPDATE s2_|method:"PUT"|method:"DELETE"|method:"POST"/);
assert.match(wf,/environment: system2-research/);
assert.match(wf,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.doesNotMatch(wf,/environment: system2-schema-only|SYSTEM2_CLOUDFLARE_API_TOKEN|historical_pack_year_backfill/);
console.log("M07 MULTIPAGE LIST cap 4 GET and metadata-is-not-byte-SHA adversarial tests PASS");
