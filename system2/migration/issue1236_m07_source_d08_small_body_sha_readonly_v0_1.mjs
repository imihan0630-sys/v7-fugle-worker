// M07: SOURCE R2 original D08 small-body SHA. Only 1-2 original objects,
// <=256 KiB/object and <=512 KiB total. One 32-page (expected 27) SOURCE
// LIST revalidation, <=2 HEAD + <=2 GET, zero retries/mutations.
// Original G3 keyhashes and original GitHub writer receipt exclusions verified.
// This proves original object bytes vs own HEAD/GET source metadata only:
// NOT original D1 manifest, writer attribution, PIT, Frozen or migration.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {parseR2Page,signedR2Page} from "./issue1236_m07_r2_multipage_metadata_only_v0_1.mjs";
import {parsePrivateExtraReceipt} from "./issue1236_m07_r2_original_private_498_namespace_classify_v0_1.mjs";
import {ORIGINAL_REPO_RECEIPTS,parseSourceReceiptText} from "./issue1236_m07_original_d08_writer_receipt_g3_498_offline_join_v0_1.mjs";
import {run340Inventory,buildOriginalReceiptMap,safeTechnicalFamily} from "./issue1236_m07_g3_76_other_d08_technical_families_v0_1.mjs";
import {createRemoteR2S3Adapter} from "../deploy/remote_r2_s3_adapter.mjs";
const BUCKET="system2-historical-research";
const ACCOUNT_SHA="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const MAX_PER_ITEM=262144,MAX_BODY_TOTAL=524288,MAX_ITEMS=2;
const OUT="/tmp/s2-m07-source-original-small-d08-bodysha";
const G3="/tmp/s2-m07-original-private-498";
const hash=b=>createHash("sha256").update(b).digest("hex");
const goodSha=s=>typeof s==="string"&&/^[a-f0-9]{64}$/i.test(s);
const stop=x=>{throw Error("M07_D08_BODY_"+x)};
export const TARGETS=Object.freeze([
 "D08_TECHNICAL_FAMILY__TWSE_SEMANTIC_UNIVERSE_V0_2",
 "D08_TECHNICAL_FAMILY__TWSE_HISTORICAL_VALUATION_PERCENTILE_SNAPSHOT_V0_1"
]);
export async function boundedOriginalSmallD08({extraMap,writerMap,loadPage,head,get,expected}={}){
 const candidates=new Map();let originalPages=0;
 const wrapped=async(token)=>{
  const xml=await loadPage(token);originalPages++;
  for(const object of parseR2Page(xml).entries){
   const id=hash(Buffer.from(object.key,"utf8"));
   if(!extraMap?.has(id)||extraMap.get(id)!==object.bytes||writerMap?.has(id)||
      !object.key.startsWith("research/d08/"))continue;
   const family=safeTechnicalFamily(object.key);
   if(!TARGETS.includes(family))continue;
   if(object.bytes<=0||object.bytes>MAX_PER_ITEM)continue;
   const current=candidates.get(family);
   if(!current||object.bytes<current.bytes||
      (object.bytes===current.bytes&&id<current.id))
     candidates.set(family,{key:object.key,id,bytes:object.bytes,family});
  }
  return xml;
 };
 const original=await run340Inventory({extraMap,writerMap,loadPage:wrapped,...(expected?{expected}:{})});
 // For SOURCE original, semantic universe is exactly one 10,556-byte listed
 // object. If absent/oversize now, do not silently substitute another family.
 const semantic=candidates.get(TARGETS[0]);
 if(!semantic||semantic.bytes!==10556)stop("EXPECTED_SOURCE_SEMANTIC_UNIVERSE_MISSING_OR_SIZE_DRIFT");
 const selected=[semantic];
 const percentile=candidates.get(TARGETS[1]);
 if(percentile)selected.push(percentile);
 if(selected.length>MAX_ITEMS||
    selected.reduce((n,x)=>n+x.bytes,0)>MAX_BODY_TOTAL)
    stop("BODY_TOTAL_BUDGET_EXCEEDED");
 const items=[];let bytes=0;
 for(const candidate of selected){
  const before=await head(candidate.key);
  const expectedBodySha=before?.customMetadata?.["object-sha256"];
  if(!before||before.size!==candidate.bytes||!goodSha(expectedBodySha))
    stop("SOURCE_HEAD_SIZE_OR_SHA_METADATA_MISSING");
  const content=await get(candidate.key);
  if(!content?.bytes||!(content.bytes instanceof Uint8Array)||
     content.bytes.byteLength!==candidate.bytes||
     content.metadata?.size!==candidate.bytes)
     stop("GET_BYTES_OR_LENGTH_CONFLICT");
  const getSha=content.metadata?.customMetadata?.["object-sha256"];
  const digest=hash(Buffer.from(content.bytes));
  bytes+=content.bytes.byteLength;
  if(bytes>MAX_BODY_TOTAL||!goodSha(getSha)||
     getSha.toLowerCase()!==expectedBodySha.toLowerCase()||
     digest!==expectedBodySha.toLowerCase())
     stop("SOURCE_REAL_BODY_SHA_DIVERGED");
  items.push(Object.freeze({
   privateObjectKeySHA256:candidate.id,
   technicalFamily:candidate.family,
   originalSourceListedBytes:candidate.bytes,
   originalByteSHA256:digest,
   headAndGetOriginalMetadataSHA256Match:true,
   originalD1ManifestCrosswalk:false,
   independentOriginalWriterAttribution:false,
   historicalPITCertified:false
  }));
 }
 return Object.freeze({
  schemaVersion:"S2_M07_D08_ORIGINAL_SMALL_BODY_SHA_LIMITED_REAL_SOURCE_V0_1",
  status:items.length===2?
   "TWO_SOURCE_D08_BODY_SELF_SHA_VERIFIED__ORIGINAL_WRITER_PIT_PENDING":
   "ONE_SOURCE_D08_BODY_SELF_SHA_VERIFIED__PERCENTILE_SIZE_CAP_EXCLUDED",
  sourceOriginalLISTMetadataDigestRevalidated:true,
  sourceOriginalG3ExtrasRevalidated:original.g3PrivateExtrasReidentified,
  originalD08WriterReceiptsRevalidated:original.originalWriterReceiptsMatched,
  originalSourceListPages:originalPages,sourceR2ListCalls:originalPages,
  sourceR2HeadCalls:items.length,sourceR2ObjectBodyGetCalls:items.length,
  sourceR2ObjectBodyDownloadedBytes:bytes,
  perObjectByteCap:MAX_PER_ITEM,totalBodyByteCap:MAX_BODY_TOTAL,
  sourceR2BodyItems:items,
  percentileObjectEligibleWithinCap:!!percentile,
  allRemaining76BodySHAValidated:false,
  originalD1CrosswalkForTheseItemsVerified:false,
  independentD08SourceWriterIdentified:false,firstKnownAtPITCertified:false,
  originalR2ListIsNotAtomicSnapshot:true,
  sourceR2Writes:0,sourceD1Calls:0,destinationD1Calls:0,destinationR2Calls:0,
  newSecretsOrPaidServices:false,system1FormalOrWorkerCronModified:false,
  independentAuditorAccepted:false
 });
}
export async function runProtectedSourceReadOnly({accountId,accessKeyId,secretAccessKey,bucketName,extraMap,writerMap,fetchImpl=fetch}={}){
 if(bucketName!==BUCKET||hash(String(accountId||"").toLowerCase())!==ACCOUNT_SHA)
   stop("SOURCE_ACCOUNT_OR_BUCKET_IDENTITY_DRIFT");
 const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,
  bucketName:BUCKET,retryAttempts:1,retryDelayMs:0,
  fetchImpl:async(url,init)=>{
   if(!["HEAD","GET"].includes(init.method))stop("PROVIDER_MUTATION_METHOD");
   const response=await fetchImpl(url,init);
   if(init.method==="GET"&&response.ok){
    const size=Number(response.headers.get("content-length"));
    if(!Number.isSafeInteger(size)||size<1||size>MAX_PER_ITEM)
      stop("HTTP_BODY_BYTES_OUTSIDE_CAP");
   }
   return response;
  }});
 return boundedOriginalSmallD08({extraMap,writerMap,head:k=>store.head(k),get:k=>store.get(k),
  loadPage:async continuation=>{
   const req=signedR2Page({accountId,accessKeyId,secretAccessKey,continuationToken:continuation});
   const response=await fetchImpl(req.url,{method:"GET",headers:req.headers,signal:AbortSignal.timeout(30000)});
   if(!response?.ok)stop("SOURCE_LIST_HTTP_FAILED");
   return response.text();
  }});
}
async function main(){
 let result={schemaVersion:"S2_M07_D08_ORIGINAL_SMALL_BODY_SHA_LIMITED_REAL_SOURCE_V0_1",
  status:"FAIL_CLOSED",sourceR2Writes:0,destinationD1Calls:0};
 try{
  const [l,m]=await Promise.all([
   readFile(G3+"/private-unmatched-r2-hashes.jsonl"),
   readFile(G3+"/sanitized-unmatched-summary.json")]);
  const extraMap=parsePrivateExtraReceipt(l,m);
  const groups=await Promise.all(ORIGINAL_REPO_RECEIPTS.map(async d=>({
   label:d.label,rows:parseSourceReceiptText(await readFile(d.path,"utf8"),d)
  })));
  const writerMap=buildOriginalReceiptMap(groups);
  result=await runProtectedSourceReadOnly({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
   secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
   bucketName:process.env.SYSTEM2_R2_BUCKET,extraMap,writerMap});
  result={...result,observedAtUtc:new Date().toISOString()};
 }catch(err){
  const reason=String(err?.message||"");
  result.error=/^M07_(D08_BODY|D08_RECEIPT|340_FAMILY|EXTRA_NAMESPACE)_[A-Z0-9_]+$/.test(reason)?
    reason:"M07_D08_BODY_UNEXPECTED_FAIL_CLOSED";
  result.partialSourceReadCallsMayHaveHappened=true;
  process.exitCode=2;
 }finally{
  await mkdir(OUT,{recursive:true,mode:0o700});
  await writeFile(OUT+"/sanitized-source-d08-small-body-sha.json",
    JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,
   originalSourceBodyItemsVerified:result.sourceR2BodyItems?.length??0,
   downloadedBytes:result.sourceR2ObjectBodyDownloadedBytes??0,
   listCalls:result.sourceR2ListCalls??null,headCalls:result.sourceR2HeadCalls??null,
   bodyGETCalls:result.sourceR2ObjectBodyGetCalls??null,
   error:result.error??null,writes:0}));
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url))await main();
