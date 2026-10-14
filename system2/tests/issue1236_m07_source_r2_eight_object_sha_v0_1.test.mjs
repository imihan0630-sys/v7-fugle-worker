import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {witnessBatch,executeSourceBatch} from "../migration/issue1236_m07_source_r2_eight_object_sha_v0_1.mjs";
const BUCKET="system2-historical-research";
const sha=b=>createHash("sha256").update(b).digest("hex");
function listing(n=10,{bytes=13,keyStart=0,more=true}={}){
 const items=Array.from({length:n},(_,i)=>{
  const key="historical/"+String(i+keyStart).padStart(5,"0")+".json.gz";
  return "<Contents><Key>"+key+"</Key><Size>"+bytes+"</Size><ETag>not-a-sha</ETag></Contents>";
 }).join("");
 return "<ListBucketResult><Name>"+BUCKET+"</Name><KeyCount>"+n+"</KeyCount>"+
  "<IsTruncated>"+more+"</IsTruncated>"+
  (more?"<NextContinuationToken>opaque</NextContinuationToken>":"")+items+"</ListBucketResult>";
}
const body=Buffer.from("123456789abcd"),digest=sha(body);
const meta={size:body.length,customMetadata:{"object-sha256":digest}};
let calls={head:0,get:0};
const ok=await witnessBatch({listXml:listing(10),
 head:async()=>{calls.head++;return meta},
 get:async()=>{calls.get++;return {bytes:body,metadata:meta}}});
assert.equal(ok.sourceObjectBytesVerified,8);
assert.equal(ok.originalSourceBytesDownloaded,104);
assert.equal(ok.sourceR2HeadCalls,8);
assert.equal(ok.sourceR2GetObjectCalls,8);
assert.deepEqual(calls,{head:8,get:8});
assert.equal(ok.originalSourceD1CrosswalkCount,0);
assert.equal(ok.independentAuditAccepted,false);
assert.equal(ok.originalByteSelfShaVerifiedItems.length,8);
assert.equal(new Set(ok.originalByteSelfShaVerifiedItems.map(x=>x.privateObjectKeySha256)).size,8);
assert.equal(JSON.stringify(ok).includes("historical/"),false);
const sparse=await witnessBatch({listXml:listing(2),head:async()=>meta,
 get:async()=>({bytes:body,metadata:meta})});
assert.equal(sparse.sourceObjectBytesVerified,2);
assert.match(sparse.status,/FEWER_ELIGIBLE/);
async function denied(head,get,xml=listing(2)){
 await assert.rejects(()=>witnessBatch({listXml:xml,head,get}),/M07_BATCH_/);
}
await denied(async()=>({...meta,size:12}),async()=>({bytes:body,metadata:meta}));
await denied(async()=>({size:13,customMetadata:{}}),async()=>({bytes:body,metadata:meta}));
await denied(async()=>meta,async()=>({bytes:Buffer.alloc(13),metadata:meta}));
await denied(async()=>meta,async()=>({bytes:body,metadata:{size:13,customMetadata:{"object-sha256":"a".repeat(64)}}}));
await denied(async()=>meta,async()=>({bytes:Buffer.alloc(0),metadata:meta}));
const noEligible=await witnessBatch({listXml:listing(2,{bytes:65537}),head:async()=>{throw Error("SHOULD NOT HEAD")},
 get:async()=>{throw Error("SHOULD NOT GET")}});
assert.equal(noEligible.sourceObjectBytesVerified,0);
await assert.rejects(()=>executeSourceBatch({accountId:"a".repeat(32),accessKeyId:"a",
 secretAccessKey:"b",bucketName:"wrong",fetchImpl:async()=>{throw Error("NETWORK")}}),
 /M07_BATCH_SOURCE_BUCKET_IDENTITY/);
const source=readFileSync("system2/migration/issue1236_m07_source_r2_eight_object_sha_v0_1.mjs","utf8");
const workflow=readFileSync(".github/workflows/system2-m07-source-r2-eight-object-readonly.yml","utf8");
assert.match(source,/MAX_ITEMS=8,MAX_ITEM_BYTES=65536/);
assert.match(source,/retryAttempts:1,retryDelayMs:0/);
assert.match(source,/sourceR2Writes:0/);
assert.doesNotMatch(source,/putIfAbsent|INSERT INTO|UPDATE s2_|DELETE FROM|method:"PUT"|method:"POST"|method:"DELETE"/);
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.doesNotMatch(workflow,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|SYSTEM2_CLOUDFLARE_API_TOKEN|environment: system2-schema-only/);
console.log("M07 eight-object bounded SOURCE original SHA body and adversarial guards PASS");
