// M07 #1236 original SOURCE R2: ONE object original byte SHA evidence, no D1.
// One LIST(max 1000), at most one HEAD and one GET (retryAttempts=1).
// Proves only source-object current bytes against source-object stored metadata,
// NOT independent original D1 manifest/PIT lineage or all-bucket completeness.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
import {parseR2Page,signedR2Page} from "./issue1236_m07_r2_multipage_metadata_only_v0_1.mjs";
import {createRemoteR2S3Adapter} from "../deploy/remote_r2_s3_adapter.mjs";
const BUCKET="system2-historical-research",MAX_OBJECT=65536;
const sha=buffer=>createHash("sha256").update(buffer).digest("hex");
const hex64=/^[a-f0-9]{64}$/i;
const fail=x=>{throw Error("M07_SAMPLE_"+x)};
export async function validateSampleObject({listBody,head,get}){
 const page=parseR2Page(listBody);
 const selection=page.entries.find(o=>
   o.bytes>=1&&o.bytes<=MAX_OBJECT&&o.key.endsWith(".json.gz")&&!o.key.startsWith("smoke/"));
 if(!selection)return Object.freeze({status:"SAMPLE_NO_ELIGIBLE_SMALL_ARCHIVE_OBJECT",
  observedListedObjects:page.entries.length,listingTruncated:page.more,
  r2HeadCalls:0,r2GetObjectCalls:0,sourceObjectBytesShaVerified:0,
  independentSourceD1ManifestMatch:false});
 const headResult=await head(selection.key);
 if(!headResult||!Number.isSafeInteger(headResult.size)||headResult.size!==selection.bytes)
   fail("HEAD_MISSING_OR_SIZE_CONFLICT");
 const expected=headResult.customMetadata?.["object-sha256"];
 if(typeof expected!=="string"||!hex64.test(expected)){
   return Object.freeze({status:"SAMPLE_OBJECT_SHA_METADATA_ABSENT_NO_BODY_GET",
    observedListedObjects:page.entries.length,r2HeadCalls:1,r2GetObjectCalls:0,
    sourceObjectBytesShaVerified:0,independentSourceD1ManifestMatch:false});
 }
 if(headResult.size<1||headResult.size>MAX_OBJECT)fail("MAX_SIZE_EXCEEDED");
 const result=await get(selection.key);
 if(!result||!(result.bytes instanceof Uint8Array||Buffer.isBuffer(result.bytes)))
   fail("BODY_READBACK_INVALID");
 const body=Buffer.from(result.bytes);
 if(body.length!==selection.bytes||result.metadata?.size!==selection.bytes)
   fail("BODY_SIZE_MISMATCH");
 const actual=sha(body);
 if(actual.toLowerCase()!==expected.toLowerCase())fail("ORIGINAL_CONTENT_SHA_CONFLICT");
 const returnedSha=result.metadata?.customMetadata?.["object-sha256"];
 if(returnedSha&&returnedSha.toLowerCase()!==expected.toLowerCase())
   fail("HEAD_GET_ORIGINAL_METADATA_DIVERGED");
 return Object.freeze({status:"SOURCE_R2_SINGLE_OBJECT_BODY_SHA_MATCHED_TO_SOURCE_OBJECT_METADATA_ONLY",
  observedListedObjects:page.entries.length,listingTruncated:page.more,
  privateObjectKeySha256:sha(Buffer.from(selection.key)),
  originalObjectSizeBytes:body.length,originalObjectBodySha256:actual,
  originalSourceHeadMetadataSha256:expected.toLowerCase(),
  r2HeadCalls:1,r2GetObjectCalls:1,sourceObjectBytesShaVerified:1,
  sourceObjectMetadataSelfConsistency:true,independentSourceD1ManifestMatch:false,
  completeR2BucketVerified:false,availableAtOrFirstKnownAtVerified:false});
}
export async function inspectM07SourceSample({
 accountId,accessKeyId,secretAccessKey,bucketName,
 fetchImpl=fetch}={}){
 if(bucketName!==BUCKET)fail("BUCKET_NOT_AUTHORIZED");
 const preflight=signedR2Page({accountId,accessKeyId,secretAccessKey});
 const list=await fetchImpl(preflight.url,{method:"GET",headers:preflight.headers,
  signal:AbortSignal.timeout(25000)});
 if(!list.ok)fail("SOURCE_LIST_HTTP_"+String(list.status).replace(/\D/g,""));
 const xml=await list.text();
 const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,
  bucketName:BUCKET,retryAttempts:1,retryDelayMs:0,
  fetchImpl:async(url,init)=>{
   if(!["HEAD","GET"].includes(init.method))fail("OBJECT_METHOD_NOT_READONLY");
   const response=await fetchImpl(url,init);
   if(init.method==="GET"&&response.ok){
     const n=Number(response.headers.get("content-length"));
     if(!Number.isSafeInteger(n)||n<1||n>MAX_OBJECT)fail("GET_CONTENT_LENGTH_OVER_LIMIT");
   }
   return response;
  }});
 const probe=await validateSampleObject({listBody:xml,head:key=>store.head(key),get:key=>store.get(key)});
 return Object.freeze({...probe,
  schemaVersion:"S2_M07_SINGLE_R2_OBJECT_RAW_BYTE_SELF_CONSISTENCY_V0_1",
  observedAtUtc:new Date().toISOString(),sourceR2ListCalls:1,
  totalSourceR2ReadCalls:1+probe.r2HeadCalls+probe.r2GetObjectCalls,
  originalByteBodyPublished:false,rawObjectKeyPublished:false,secretPublished:false,
  writes:0,sourceD1Calls:0,targetR2Calls:0,
  ownerBillingPermissionChanged:false,system1V8FormalChanged:false,
  formalAuditAccepted:false});
}
async function main(){
 let result={schemaVersion:"S2_M07_SINGLE_R2_OBJECT_RAW_BYTE_SELF_CONSISTENCY_V0_1",
  status:"FAIL_CLOSED",writes:0,targetR2Calls:0,sourceD1Calls:0};
 try{
  result=await inspectM07SourceSample({
    accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
    accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
    secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
    bucketName:process.env.SYSTEM2_R2_BUCKET});
 }catch(e){
  const s=String(e?.message||"");
  result.error=/^M07_SAMPLE_[A-Z0-9_]+$/.test(s)?s:"M07_SAMPLE_UNKNOWN_FAIL_CLOSED";
  result.r2ReadCallsMayHaveOccurred=true;
  process.exitCode=2;
 }finally{
  const out="/tmp/s2-m07-r2-object-sample";
  await mkdir(out,{recursive:true,mode:0o700});
  await writeFile(out+"/sample-sanitized.json",JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,verifiedObjects:result.sourceObjectBytesShaVerified||0,
   objectBytes:result.originalObjectSizeBytes??null,
   sourceManifestJoin:false,error:result.error||null,writes:0}));
 }
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href)await main();
