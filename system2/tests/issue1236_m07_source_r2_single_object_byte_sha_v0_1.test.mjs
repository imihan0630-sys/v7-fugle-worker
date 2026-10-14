import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {validateSampleObject} from "../migration/issue1236_m07_source_r2_single_object_byte_sha_v0_1.mjs";
const B="system2-historical-research",body=Buffer.from("test compressed original bytes","utf8");
const hash=createHash("sha256").update(body).digest("hex");
function list(key="a/2017-pack.json.gz",n=body.length){
 return "<ListBucketResult><Name>"+B+"</Name><KeyCount>1</KeyCount>"+
  "<IsTruncated>true</IsTruncated><NextContinuationToken>a-next</NextContinuationToken>"+
  "<Contents><Key>"+key+"</Key><Size>"+n+"</Size><ETag>etag-is-not-sha</ETag></Contents></ListBucketResult>";
}
const metadata={size:body.length,customMetadata:{"object-sha256":hash}};
let heads=0,gets=0;
const ok=await validateSampleObject({listBody:list(),
 head:async key=>{heads++;assert.equal(key,"a/2017-pack.json.gz");return metadata;},
 get:async key=>{gets++;assert.equal(key,"a/2017-pack.json.gz");return {bytes:body,metadata};}});
assert.equal(heads,1);assert.equal(gets,1);
assert.equal(ok.sourceObjectBytesShaVerified,1);
assert.equal(ok.originalObjectBodySha256,hash);
assert.equal(ok.independentSourceD1ManifestMatch,false);
assert.equal(ok.availableAtOrFirstKnownAtVerified,false);
assert.equal(JSON.stringify(ok).includes("a/2017-pack"),false);
heads=0;gets=0;
const missing=await validateSampleObject({listBody:list(),head:async()=>{heads++;return {size:body.length,customMetadata:{}}},get:async()=>{gets++;throw Error("no")}});
assert.equal(missing.sourceObjectBytesShaVerified,0);assert.equal(heads,1);assert.equal(gets,0);
const absent=await validateSampleObject({listBody:list("smoke/not-history.json.gz"),head:async()=>{throw Error("no")},get:async()=>{throw Error("no")}});
assert.equal(absent.status,"SAMPLE_NO_ELIGIBLE_SMALL_ARCHIVE_OBJECT");
for(const config of [
 {head:async()=>null,get:async()=>null,error:"HEAD_MISSING_OR_SIZE_CONFLICT"},
 {head:async()=>({size:body.length+1,customMetadata:{"object-sha256":hash}}),get:async()=>null,error:"HEAD_MISSING_OR_SIZE_CONFLICT"},
 {head:async()=>metadata,get:async()=>({bytes:Buffer.from("different contents"),metadata}),error:"BODY_SIZE_MISMATCH"},
 {head:async()=>metadata,get:async()=>({bytes:Buffer.alloc(body.length,0),metadata}),error:"ORIGINAL_CONTENT_SHA_CONFLICT"},
 {head:async()=>metadata,get:async()=>({bytes:body,metadata:{size:body.length,customMetadata:{"object-sha256":"a".repeat(64)}}}),error:"HEAD_GET_ORIGINAL_METADATA_DIVERGED"}
]){
 await assert.rejects(()=>validateSampleObject({listBody:list(),head:config.head,get:config.get}),
   new RegExp("M07_SAMPLE_"+config.error));
}
const code=readFileSync("system2/migration/issue1236_m07_source_r2_single_object_byte_sha_v0_1.mjs","utf8");
const wf=readFileSync(".github/workflows/system2-m07-source-r2-single-byte-proof.yml","utf8");
assert.match(code,/MAX_OBJECT=65536/);
assert.match(code,/retryAttempts:1,retryDelayMs:0/);
assert.match(code,/sourceD1ManifestMatch:false|independentSourceD1ManifestMatch:false/);
assert.match(code,/GET_CONTENT_LENGTH_OVER_LIMIT/);
assert.doesNotMatch(code,/putIfAbsent|INSERT INTO|UPDATE s2_|DELETE FROM|method:"PUT"|method:"DELETE"|method:"POST"/);
assert.match(wf,/environment: system2-research/);
assert.match(wf,/SYSTEM2_R2_SECRET_ACCESS_KEY/);
assert.doesNotMatch(wf,/system2-schema-only|historical_pack_year_backfill|SYSTEM2_CLOUDFLARE_API_TOKEN/);
console.log("M07 one archived object source HEAD/GET SHA positive and malicious/no-metadata tests PASS");
