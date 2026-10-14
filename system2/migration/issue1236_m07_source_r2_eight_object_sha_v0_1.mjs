// M07 SOURCE account: bounded 8-object R2 body SHA witness, independent of D1.
// Exactly <= 1 LIST + 8 HEAD + 8 GET; each body <= 64KiB, total <=512KiB.
// No retries, writes, additional permissions, paid endpoint, raw private keys/body output.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
import {parseR2Page,signedR2Page} from "./issue1236_m07_r2_multipage_metadata_only_v0_1.mjs";
import {createRemoteR2S3Adapter} from "../deploy/remote_r2_s3_adapter.mjs";
const BUCKET="system2-historical-research",MAX_ITEMS=8,MAX_ITEM_BYTES=65536;
const MAX_TOTAL_BYTES=MAX_ITEMS*MAX_ITEM_BYTES, HEX=/^[0-9a-f]{64}$/i;
const hash=b=>createHash("sha256").update(b).digest("hex");
const deny=x=>{throw Error("M07_BATCH_"+x)};
export async function witnessBatch({listXml,head,get}){
 const list=parseR2Page(listXml);
 const eligible=list.entries.filter(e=>e.bytes>0&&e.bytes<=MAX_ITEM_BYTES&&
   e.key.endsWith(".json.gz")&&!e.key.startsWith("smoke/")).slice(0,MAX_ITEMS);
 const seen=new Set(),items=[];let bytes=0;
 for(const candidate of eligible){
  const identity=hash(Buffer.from(candidate.key));
  if(seen.has(identity))deny("DUPLICATE_KEY_IDENTITY");
  seen.add(identity);
  const before=await head(candidate.key);
  if(!before||before.size!==candidate.bytes||before.size<1||
    before.size>MAX_ITEM_BYTES)deny("HEAD_SIZE_CONFLICT");
  const expected=before.customMetadata?.["object-sha256"];
  if(typeof expected!=="string"||!HEX.test(expected))deny("SOURCE_OBJECT_SHA_METADATA_INVALID");
  const content=await get(candidate.key);
  if(!content||!(content.bytes instanceof Uint8Array||
    Buffer.isBuffer(content.bytes)))deny("ORIGINAL_BYTES_UNAVAILABLE");
  const data=Buffer.from(content.bytes);
  bytes+=data.length;
  if(bytes>MAX_TOTAL_BYTES||data.length!==candidate.bytes||
    content.metadata?.size!==candidate.bytes)deny("GET_BYTE_SIZE_OR_TOTAL_CONFLICT");
  const bodySha=hash(data);
  if(bodySha!==expected.toLowerCase())deny("ORIGINAL_BODY_SHA_CONFLICT");
  const echoed=content.metadata?.customMetadata?.["object-sha256"];
  if(!echoed||typeof echoed!=="string"||echoed.toLowerCase()!==expected.toLowerCase())
    deny("HEAD_GET_SHA_METADATA_DIVERGED");
  items.push(Object.freeze({privateObjectKeySha256:identity,objectBytes:data.length,
    originalBodySha256:bodySha,originalHeadMetadataSha256:expected.toLowerCase(),
    sourceD1ManifestJoinVerified:false}));
 }
 return Object.freeze({
  schemaVersion:"S2_M07_SOURCE_R2_EIGHT_OBJECT_BOUND_BYTE_SHA_V0_1",
  status:items.length===MAX_ITEMS?
    "SOURCE_R2_EIGHT_OBJECTS_SELF_SHA_MATCHED__MANIFEST_JOIN_PENDING":
    "SOURCE_R2_FEWER_ELIGIBLE_OBJECTS__MANIFEST_JOIN_PENDING",
  observedAtUtc:new Date().toISOString(),
  sourceAccount:"SOURCE_SYSTEM2_RESEARCH",sourceBucket:BUCKET,
  firstListObjectsObserved:list.entries.length,firstListTruncated:list.more,
  itemCap:MAX_ITEMS,perItemByteCap:MAX_ITEM_BYTES,totalBodyByteCap:MAX_TOTAL_BYTES,
  candidateCount:eligible.length,sourceObjectBytesVerified:items.length,
  originalSourceBytesDownloaded:bytes,
  sourceR2ListCalls:1,sourceR2HeadCalls:items.length,sourceR2GetObjectCalls:items.length,
  originalByteSelfShaVerifiedItems:items,originalSourceD1CrosswalkCount:0,
  originalSourceD1ManifestJoinVerified:false,
  completeBucketList:false,wholeBucketObjectBodiesVerified:false,
  sourceD1NetworkCalls:0,destinationD1NetworkCalls:0,sourceR2Writes:0,
  destinationR2Calls:0,newSecrets:0,paidChanges:0,
  noRawKeysOrBytesPublished:true,independentAuditAccepted:false
 });
}
export async function executeSourceBatch({accountId,accessKeyId,secretAccessKey,
 bucketName,fetchImpl=fetch}){
 if(bucketName!==BUCKET)deny("SOURCE_BUCKET_IDENTITY");
 const req=signedR2Page({accountId,accessKeyId,secretAccessKey});
 const res=await fetchImpl(req.url,{method:"GET",headers:req.headers,
   signal:AbortSignal.timeout(25000)});
 if(!res.ok)deny("LIST_HTTP_"+String(res.status).replace(/\D/g,""));
 const listXml=await res.text();
 const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,
  bucketName:BUCKET,retryAttempts:1,retryDelayMs:0,
  fetchImpl:async(url,init)=>{
   if(!["HEAD","GET"].includes(init.method))deny("MUTATING_METHOD");
   const resp=await fetchImpl(url,init);
   if(init.method==="GET"&&resp.ok){
    const n=Number(resp.headers.get("content-length"));
    if(!Number.isSafeInteger(n)||n<1||n>MAX_ITEM_BYTES)deny("HTTP_CONTENT_LENGTH_OVER_LIMIT");
   }
   return resp;
  }});
 return witnessBatch({listXml,head:k=>store.head(k),get:k=>store.get(k)});
}
async function main(){
 let result={schemaVersion:"S2_M07_SOURCE_R2_EIGHT_OBJECT_BOUND_BYTE_SHA_V0_1",
   status:"FAIL_CLOSED",sourceR2Writes:0,destinationD1NetworkCalls:0};
 try{
  result=await executeSourceBatch({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
   secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
   bucketName:process.env.SYSTEM2_R2_BUCKET});
 }catch(e){
  const reason=String(e?.message||"");
  result.error=/^M07_BATCH_[A-Z0-9_]+$/.test(reason)?reason:"M07_BATCH_UNKNOWN_FAIL_CLOSED";
  result.partialReadOperationsMayHaveOccurred=true;
  process.exitCode=2;
 }finally{
  const dir="/tmp/s2-m07-source-eight-objects";
  await mkdir(dir,{recursive:true,mode:0o700});
  await writeFile(dir+"/sanitized-original-source-bodies.json",
    JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,
   bodiesVerified:result.sourceObjectBytesVerified??0,
   bodyBytes:result.originalSourceBytesDownloaded??0,
   r2ListCalls:result.sourceR2ListCalls??null,
   error:result.error||null,writes:0}));
 }
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href)await main();
