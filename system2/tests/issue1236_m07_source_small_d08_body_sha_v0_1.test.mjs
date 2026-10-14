import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {boundedOriginalSmallD08,runProtectedSourceReadOnly,TARGETS} from "../migration/issue1236_m07_source_d08_small_body_sha_readonly_v0_1.mjs";
const sha=x=>createHash("sha256").update(x).digest("hex");
const objects=[
 ["research/d08/twse-semantic-universe-v0.2/2026-01-01/"+"a".repeat(64)+".json.gz",10556],
 ["research/d08/twse-historical-valuation-percentile-snapshot-v0.1/2026-01-01/"+"b".repeat(64)+".json.gz",12000],
 ["smoke/preserved.json",100],
 ["research/d08/twse-raw-valuation-snapshot-v0.2/2023-01-31/"+"f".repeat(64)+".json.gz",10],
 ["other/a",15],["other/b",25]
];
const extra=new Map(objects.slice(0,4).map(([k,bytes])=>[sha(k),bytes]));
const writers=new Map([[sha(objects[3][0]),{label:"RAW_V02",bytes:10}]]);
const digest=createHash("sha256");
for(const [k,size] of objects)digest.update(JSON.stringify([k,size,'"fixture"'])+"\n");
const expected={keys:6,bytes:22706,pages:1,extras:4,extraBytes:22666,receipted:1,
 extraUnknownD08:2,smoke:1,sha:digest.digest("hex"),otherCount:2,otherBytes:22556};
const page='<ListBucketResult><Name>system2-historical-research</Name>'+
 '<IsTruncated>false</IsTruncated><KeyCount>6</KeyCount>'+
 objects.map(([k,size])=>'<Contents><Key>'+k+'</Key><Size>'+size+
 '</Size><ETag>"fixture"</ETag></Contents>').join("")+'</ListBucketResult>';
const blobs=new Map(objects.map(([k,n])=>[k,Buffer.alloc(n,k===objects[0][0]?4:5)]));
let heads=0,gets=0;
const metadata=k=>({size:blobs.get(k).length,customMetadata:{"object-sha256":sha(blobs.get(k))}});
const cfg={extraMap:extra,writerMap:writers,loadPage:async()=>page,expected,
 head:async k=>{heads++;return metadata(k)},
 get:async k=>{gets++;return {bytes:blobs.get(k),metadata:metadata(k)}}};
const result=await boundedOriginalSmallD08(cfg);
assert.equal(result.status,"TWO_SOURCE_D08_BODY_SELF_SHA_VERIFIED__ORIGINAL_WRITER_PIT_PENDING");
assert.equal(result.sourceR2ListCalls,1);
assert.equal(result.sourceR2ObjectBodyGetCalls,2);
assert.equal(result.sourceR2ObjectBodyDownloadedBytes,22556);
assert.equal(result.sourceR2BodyItems.length,2);
assert.deepEqual(result.sourceR2BodyItems.map(x=>x.technicalFamily),TARGETS);
assert.equal(result.originalD1CrosswalkForTheseItemsVerified,false);
assert.equal(result.firstKnownAtPITCertified,false);
assert.equal(JSON.stringify(result).includes("research/d08/"),false);
assert.deepEqual([heads,gets],[2,2]);
await assert.rejects(()=>boundedOriginalSmallD08({...cfg,head:async k=>({
 ...metadata(k),customMetadata:{"object-sha256":"f".repeat(64)}})}),
 /M07_D08_BODY_SOURCE_REAL_BODY_SHA_DIVERGED/);
await assert.rejects(()=>boundedOriginalSmallD08({...cfg,head:async k=>({
 ...metadata(k),size:1})}),/M07_D08_BODY_SOURCE_HEAD_SIZE_OR_SHA_METADATA_MISSING/);
await assert.rejects(()=>boundedOriginalSmallD08({...cfg,get:async k=>({
 bytes:Buffer.alloc(0),metadata:metadata(k)})}),/M07_D08_BODY_GET_BYTES_OR_LENGTH_CONFLICT/);
await assert.rejects(()=>boundedOriginalSmallD08({...cfg,expected:{...expected,sha:"0".repeat(64)}}),
 /M07_340_FAMILY_SOURCE_R2_ORIGINAL_FULL_LIST_ORIGINAL_G3_IDENTITY_DRIFT/);
await assert.rejects(()=>runProtectedSourceReadOnly({accountId:"0".repeat(32),
 accessKeyId:"abc",secretAccessKey:"def",bucketName:"wrong",extraMap:extra,writerMap:writers,
 fetchImpl:async()=>{throw Error("NOT_ALLOWED")}}),/M07_D08_BODY_SOURCE_ACCOUNT_OR_BUCKET_IDENTITY_DRIFT/);
const workflow=readFileSync(".github/workflows/system2-m07-source-two-small-d08-bodysha-readonly.yml","utf8");
const src=readFileSync("system2/migration/issue1236_m07_source_d08_small_body_sha_readonly_v0_1.mjs","utf8");
assert.match(src,/MAX_PER_ITEM=262144,MAX_BODY_TOTAL=524288,MAX_ITEMS=2/);
assert.match(src,/retryAttempts:1,retryDelayMs:0/);
assert.match(src,/originalD1ManifestCrosswalk:false/);
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/run-id: 38527825185/);
assert.doesNotMatch(workflow,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(src,/putIfAbsent|INSERT INTO|method:"PUT"|method:"POST"|method:"DELETE"/);
console.log("M07 small original source D08 R2 GET body SHA, fail-closed and 512KiB read caps PASS");
