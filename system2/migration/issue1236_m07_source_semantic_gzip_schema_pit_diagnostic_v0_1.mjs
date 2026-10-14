// M07 original SOURCE single semantic-universe compressed body STRUCTURE / PIT diagnostic.
// Exact ORIGINAL 498 protected G3 extras, 154 archived writer receipts and original 27-page
// metadata digest MUST match before one HEAD+GET. <=16 KiB compressed/8 MiB inflated.
// Does NOT prove independent original writer, publication time, firstKnownAt, PIT or D1 SHA.
import {createHash} from "node:crypto";
import {gunzipSync} from "node:zlib";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {parseR2Page,signedR2Page} from "./issue1236_m07_r2_multipage_metadata_only_v0_1.mjs";
import {parsePrivateExtraReceipt} from "./issue1236_m07_r2_original_private_498_namespace_classify_v0_1.mjs";
import {ORIGINAL_REPO_RECEIPTS,parseSourceReceiptText} from "./issue1236_m07_original_d08_writer_receipt_g3_498_offline_join_v0_1.mjs";
import {run340Inventory,buildOriginalReceiptMap,safeTechnicalFamily}
 from "./issue1236_m07_g3_76_other_d08_technical_families_v0_1.mjs";
import {createRemoteR2S3Adapter} from "../deploy/remote_r2_s3_adapter.mjs";
const BUCKET="system2-historical-research";
const ACCOUNT_SHA="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const SEMANTIC_FAMILY="D08_TECHNICAL_FAMILY__TWSE_SEMANTIC_UNIVERSE_V0_2";
const COMPRESSED_BYTES=10556, MAX_COMPRESSED_BYTES=16384, MAX_INFLATED_BYTES=8388608;
const KNOWN_BYTE_SHA256="b1758c1deb3097a6b16356ee61708f2b002a8ed23a9797cb43a54e5828bf537e";
const SOURCE_SEMANTIC_RECEIPT_BLOB="63191e7e1d07116c20edb31894e05e593d9fe310";
const OUT="/tmp/s2-m07-semantic-body-schema";
const G3="/tmp/s2-m07-original-private-498";
const sha=v=>createHash("sha256").update(v).digest("hex");
const gitBlob=b=>createHash("sha1").update(Buffer.from("blob "+b.length+"\0")).update(b).digest("hex");
const fail=x=>{throw Error("M07_SEMANTIC_PIT_"+x)};
const isObject=v=>v!==null&&typeof v==="object"&&!Array.isArray(v);
const timestamp=v=>typeof v==="string"&&v.length<=48&&
 /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v));
const FIELDS=Object.freeze(["schemaVersion","registryId","datasetStartDate","memberships",
 "memberCount","semanticRegistryHash","semanticSnapshotBundleHash","firstKnownAt",
 "availableAt","publishedAt","observedAt","generatedAt","capturedAt","sourceUrl",
 "sourceId","sourceHash"]);
export function inspectCompressedSemanticBody(data,{sourceReceipt}={}){
 if(!Buffer.isBuffer(data)&&!(data instanceof Uint8Array))fail("NOT_BYTES");
 if(data.byteLength<1||data.byteLength>MAX_COMPRESSED_BYTES)fail("COMPRESSED_CAP");
 if(!isObject(sourceReceipt)||sourceReceipt.schemaVersion!=="D08_TWSE_OFFICIAL_UNIVERSE_SOURCE_RECEIPT_V0_2"||
    sourceReceipt.result!=="PASS"||sourceReceipt.registry?.membershipCount!==1101||
    !/^[a-f0-9]{64}$/.test(sourceReceipt.registry?.semanticRegistryHash||""))
   fail("PINNED_RESEARCH_RECEIPT_INVALID");
 let inflated;
 try{inflated=gunzipSync(data,{maxOutputLength:MAX_INFLATED_BYTES})}
 catch{fail("INVALID_GZIP_OR_INFLATE_LIMIT")}
 if(inflated.length<1||inflated.length>MAX_INFLATED_BYTES)fail("INFLATED_LIMIT");
 let obj;
 try{obj=JSON.parse(inflated.toString("utf8"))}catch{fail("GZIP_BODY_JSON_INVALID")}
 if(!isObject(obj))fail("SEMANTIC_ROOT_NOT_OBJECT");
 // Only predeclared non-personal schema fields may enter the original receipt.
 const levels=[obj,isObject(obj.data)?obj.data:null,isObject(obj.registry)?obj.registry:null]
  .filter(isObject);
 const fieldsPresent=FIELDS.filter(k=>levels.some(o=>Object.prototype.hasOwnProperty.call(o,k)));
 const members=levels.find(o=>Array.isArray(o.memberships))?.memberships??null;
 const observedMemberCount=members?.length??null;
 const explicitMemberCount=levels.map(o=>o.memberCount)
  .find(v=>Number.isSafeInteger(v)&&v>=0)??null;
 const semanticHash=levels.map(o=>o.semanticRegistryHash).find(v=>typeof v==="string")??null;
 const expectedSemanticHash=sourceReceipt.registry.semanticRegistryHash;
 const semanticHashMatchesReceipt=semanticHash===null?null:semanticHash===expectedSemanticHash;
 const clocks={};
 for(const f of ["firstKnownAt","availableAt","publishedAt","observedAt","generatedAt","capturedAt"]){
  const present=levels.some(o=>Object.prototype.hasOwnProperty.call(o,f));
  const valid=levels.some(o=>timestamp(o[f]));
  clocks[f]={present,isoTimestampShapeValid:valid};
 }
 const sourceProvenanceFieldPresent=levels.some(o=>typeof o.sourceUrl==="string"||
    typeof o.sourceId==="string"||typeof o.sourceHash==="string");
 return Object.freeze({
  bodyGzipInflatedBytes:inflated.length,
  gzipPayloadJsonRootKind:"object",
  payloadRecognizedTopLevelOrNestedFields:fieldsPresent,
  membershipArrayPresent:members!==null,
  membershipEntriesObserved:observedMemberCount,
  explicitMembershipCount:explicitMemberCount,
  independentArchivedRegistryMemberCount:sourceReceipt.registry.membershipCount,
  membershipCountEqualsOriginalSourceReceipt:observedMemberCount===null?null:
    observedMemberCount===sourceReceipt.registry.membershipCount,
  payloadSemanticRegistryHashFieldPresent:semanticHash!==null,
  payloadSemanticRegistryHashEqualsOriginalSourceReceipt:semanticHashMatchesReceipt,
  sourceProvenanceFieldPresent,
  sourceClockFieldShapeEvidence:clocks,
  independentPublicationClockEstablished:false,
  actualOfficialFirstKnownAtIndependentlyCertified:false,
  schemaOrClockNotAutomaticallyProofOfPIT:true,
  originalBodyContentStoredInReceipt:false,
  securitiesOrMembersExposedInReceipt:false
 });
}
export async function boundedOriginalSemanticPIT({extraMap,writerMap,loadPage,head,get,
 sourceReceipt,expected}={}){
 let chosen=null,chosenCount=0;
 const wrapped=async token=>{
  const xml=await loadPage(token);
  for(const ob of parseR2Page(xml).entries){
   const keyIdentity=sha(Buffer.from(ob.key,"utf8"));
   if(!extraMap?.has(keyIdentity)||extraMap.get(keyIdentity)!==ob.bytes||
      writerMap?.has(keyIdentity)||!ob.key.startsWith("research/d08/"))continue;
   if(safeTechnicalFamily(ob.key)!==SEMANTIC_FAMILY)continue;
   chosenCount++;
   if(chosenCount>1)fail("MULTIPLE_ORIGINAL_SEMANTIC_OBJECTS");
   chosen={key:ob.key,id:keyIdentity,listedBytes:ob.bytes};
  }
  return xml;
 };
 const originals=await run340Inventory({extraMap,writerMap,loadPage:wrapped,...(expected?{expected}:{})});
 if(chosenCount!==1||chosen?.listedBytes!==COMPRESSED_BYTES)
   fail("ORIGINAL_SEMANTIC_IDENTITY_OR_LISTED_BYTES_DRIFT");
 const before=await head(chosen.key);
 const expectedSHA=before?.customMetadata?.["object-sha256"];
 if(before?.size!==COMPRESSED_BYTES||expectedSHA?.toLowerCase()!==KNOWN_BYTE_SHA256)
   fail("ORIGINAL_SOURCE_HEAD_BYTE_SHA_IDENTITY_CHANGED");
 const out=await get(chosen.key);
 if(!(out?.bytes instanceof Uint8Array)||out.bytes.byteLength!==COMPRESSED_BYTES||
    out?.metadata?.size!==COMPRESSED_BYTES||
    out?.metadata?.customMetadata?.["object-sha256"]?.toLowerCase()!==KNOWN_BYTE_SHA256)
   fail("ORIGINAL_SOURCE_GET_METADATA_OR_BYTES_CHANGED");
 const body=Buffer.from(out.bytes);
 if(sha(body)!==KNOWN_BYTE_SHA256)fail("ORIGINAL_SOURCE_REHASH_MISMATCH");
 const structure=inspectCompressedSemanticBody(body,{sourceReceipt});
 return Object.freeze({
  schemaVersion:"S2_M07_SOURCE_SEMANTIC_ORIGINAL_GZIP_PAYLOAD_PIT_DIAGNOSTIC_V0_1",
  status:"SOURCE_R2_SEMANTIC_BODY_REHASH_AND_STRUCTURAL_PARSE__PIT_NOT_CERTIFIED",
  originalProtectedG3ExtraKeysRevalidated:originals.g3PrivateExtrasReidentified,
  originalD08WriterReceiptKeysRevalidated:originals.originalWriterReceiptsMatched,
  originalSourceFullListDigestRevalidated:true,
  sourceR2OriginalListPages:originals.sourceR2Pages,
  semanticTechnicalFamily:SEMANTIC_FAMILY,
  semanticOriginalPrivateKeySHA256:chosen.id,
  originalR2BodyByteSHA256:KNOWN_BYTE_SHA256,
  originalR2BodySizeBytes:COMPRESSED_BYTES,
  originalBodyShaHEADGETAndBytesMatched:true,
  ...structure,
  originalSourceR2ListCalls:originals.sourceR2ListCalls,
  sourceR2HEADCalls:1,sourceR2GETBodyCalls:1,sourceR2BodyBytesDownloaded:COMPRESSED_BYTES,
  sourceR2Writes:0,sourceD1Queries:0,destinationD1Writes:0,destinationR2Calls:0,
  sourceOriginalWriterIdentityStillUnknown:true,
  archivedSourceD1ManifestByteShaJoinForSemantic:false,
  historicalResearchPITAdmitted:false,independentAuditorApproved:false,
  System1V8FormalChanged:false,paidResourcesEnabled:false
 });
}
export async function protectedRealSource({accountId,accessKeyId,secretAccessKey,bucketName,
 extraMap,writerMap,sourceReceipt,fetchImpl=fetch}={}){
 if(bucketName!==BUCKET||sha(String(accountId||"").toLowerCase())!==ACCOUNT_SHA)
   fail("SOURCE_ACCOUNT_BUCKET_MISMATCH");
 const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName:BUCKET,
  retryAttempts:1,retryDelayMs:0,
  fetchImpl:async(url,init)=>{
   if(!["HEAD","GET"].includes(init.method))fail("MUTATING_METHOD_BLOCK");
   const response=await fetchImpl(url,init);
   if(init.method==="GET"&&response?.ok){
    const length=Number(response.headers.get("content-length"));
    if(!Number.isSafeInteger(length)||length!==COMPRESSED_BYTES)
      fail("BODY_DOWNLOAD_CONTENT_LENGTH_CAP");
   }
   return response;
  }});
 return boundedOriginalSemanticPIT({extraMap,writerMap,sourceReceipt,
  head:k=>store.head(k),get:k=>store.get(k),
  loadPage:async continuation=>{
   const req=signedR2Page({accountId,accessKeyId,secretAccessKey,continuationToken:continuation});
   const response=await fetchImpl(req.url,{method:"GET",headers:req.headers,
    signal:AbortSignal.timeout(30000)});
   if(!response?.ok)fail("LIST_HTTP_FAIL_CLOSED");
   return response.text();
  }});
}
async function main(){
 let result={schemaVersion:"S2_M07_SOURCE_SEMANTIC_ORIGINAL_GZIP_PAYLOAD_PIT_DIAGNOSTIC_V0_1",
  status:"FAIL_CLOSED",sourceR2Writes:0,destinationD1Writes:0};
 try{
  const [raw,meta,src]=await Promise.all([
   readFile("/tmp/s2-m07-original-private-498/private-unmatched-r2-hashes.jsonl"),
   readFile("/tmp/s2-m07-original-private-498/sanitized-unmatched-summary.json"),
   readFile("research/d08_twse_official_universe_source_receipt_20261007_v0_2.json")]);
  if(gitBlob(src)!==SOURCE_SEMANTIC_RECEIPT_BLOB)fail("PINNED_RECEIPT_GIT_BLOB_DRIFT");
  const original=parsePrivateExtraReceipt(raw,meta);
  const groups=await Promise.all(ORIGINAL_REPO_RECEIPTS.map(async def=>({
   label:def.label,rows:parseSourceReceiptText(await readFile(def.path,"utf8"),def)
  })));
  result=await protectedRealSource({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
   secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
   bucketName:process.env.SYSTEM2_R2_BUCKET,extraMap:original,
   writerMap:buildOriginalReceiptMap(groups),sourceReceipt:JSON.parse(src)});
  result={...result,observedAtUtc:new Date().toISOString()};
 }catch(e){
  const reason=String(e?.message||"");
  result.error=/^M07_(SEMANTIC_PIT|EXTRA_NAMESPACE|D08_RECEIPT|340_FAMILY)_[A-Z0-9_]+$/.test(reason)?
    reason:"M07_SEMANTIC_PIT_UNEXPECTED_FAIL_CLOSED";
  result.partialReadMayHaveOccurred=true;process.exitCode=2;
 }finally{
  await mkdir(OUT,{recursive:true,mode:0o700});
  await writeFile(OUT+"/sanitized-original-semantic-body-structure.json",JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,
   gzipBodyBytes:result.originalR2BodySizeBytes??null,
   inflatedBytes:result.bodyGzipInflatedBytes??null,
   members:result.membershipEntriesObserved??null,
   sourceClockShapes:result.sourceClockFieldShapeEvidence??null,
   bodyGet:result.sourceR2GETBodyCalls??null,
   error:result.error??null,writes:0,PIT_QUALIFIED:false}));
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url))await main();
