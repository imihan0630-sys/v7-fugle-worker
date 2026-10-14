// M07 SOURCE R2 physical ListObjectsV2 identity census, bounded 32x1000 keys.
// Metadata ONLY. R2 LIST costs provider requests; no PUT/DELETE/HEAD/GET object body.
// Private Artifact only contains salted-free SHA256(key)+listedBytes for protected
// offline original G3 D1 manifest presence/size join. Never disclose raw keys.
import {createHash} from "node:crypto";
import {createWriteStream} from "node:fs";
import {mkdir,writeFile,rm} from "node:fs/promises";
import {once} from "node:events";
import {parseR2Page,signedR2Page} from "./issue1236_m07_r2_multipage_metadata_only_v0_1.mjs";
const BUCKET="system2-historical-research";
const SOURCE_ACCOUNT_SHA="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const PAGE_MAX=32,KEYS_PER_PAGE=1000, MAX_OBJECT_ENTRIES=32000;
const OUT="/tmp/s2-m07-source-full-inventory-bounded";
const sha=b=>createHash("sha256").update(b).digest("hex");
const fail=s=>{throw Error("M07_INVENTORY_"+s)};
export async function censusSourceR2({accountId,accessKeyId,secretAccessKey,bucketName,
 fetchImpl=fetch,sink}={}){
 if(bucketName!==BUCKET||typeof accountId!=="string"||
   sha(accountId.toLowerCase())!==SOURCE_ACCOUNT_SHA)fail("ORIGINAL_ACCOUNT_OR_BUCKET_IDENTITY");
 if(typeof sink!=="function")fail("NO_PRIVATE_RECEIPT_SINK");
 let continuation=null,count=0,bytes=0,complete=false;
 const ids=new Set(),tokens=new Set(),pages=[],digest=createHash("sha256");
 for(let pg=1;pg<=PAGE_MAX;pg++){
  const req=signedR2Page({accountId,accessKeyId,secretAccessKey,continuationToken:continuation});
  const res=await fetchImpl(req.url,{method:"GET",headers:req.headers,signal:AbortSignal.timeout(30000)});
  if(!res||!res.ok)fail("SOURCE_R2_LIST_HTTP_"+String(res?.status||0).replace(/\D/g,""));
  const parsed=parseR2Page(await res.text());
  let pageBytes=0;const pageHash=createHash("sha256");
  for(const object of parsed.entries){
   const id=sha(Buffer.from(object.key,"utf8"));
   if(ids.has(id))fail("DUPLICATE_SOURCE_R2_KEY_ACROSS_PAGES");
   ids.add(id);
   if(!Number.isSafeInteger(object.bytes)||object.bytes<0||object.bytes>1e12)
      fail("SOURCE_SIZE_INVALID");
   pageBytes+=object.bytes;
   if(!Number.isSafeInteger(pageBytes)||count>=MAX_OBJECT_ENTRIES)
      fail("SOURCE_PAGE_LIMIT");
   const record=JSON.stringify([id,object.bytes])+"\n";
   await sink(record);
   const fingerprint=JSON.stringify([object.key,object.bytes,object.etag])+"\n";
   pageHash.update(fingerprint);digest.update(fingerprint);
   count++;
  }
  bytes+=pageBytes;
  if(!Number.isSafeInteger(bytes))fail("SOURCE_BYTES_SUM_OVERFLOW");
  pages.push({page:pg,observed:parsed.entries.length,
   listedBytes:pageBytes,listedMetadataSha256:pageHash.digest("hex"),
   more:parsed.more});
  if(!parsed.more){complete=true;break}
  if(!parsed.nextToken||tokens.has(parsed.nextToken)||
    parsed.nextToken===continuation)fail("REPEATED_OR_MISSING_CONTINUATION");
  tokens.add(parsed.nextToken);
  continuation=parsed.nextToken;
 }
 return Object.freeze({
  schemaVersion:"S2_M07_SOURCE_R2_32PAGE_LIST_HASHED_INVENTORY_V0_1",
  status:complete?"SOURCE_R2_LIST_COMPLETE_SINGLE_NONATOMIC_SCAN__CONTENT_SHA_UNVERIFIED":
   "SOURCE_R2_LIST_PARTIAL_32PAGE_CAP__BUCKET_TOTAL_UNKNOWN",
  capturedAtUtc:new Date().toISOString(),sourceBucket:BUCKET,
  observedEntries:count,listedBytesObserved:bytes,
  pageLimit:PAGE_MAX,pageSize:KEYS_PER_PAGE,pagesRead:pages.length,
  completeSingleScan:complete,observedUniqueKeySha256Count:ids.size,
  listedBucketTotalObjects:complete?count:null,
  listedBucketTotalBytes:complete?bytes:null,
  firstKnownAtQualified:false,
  allObjectBodySHA256Verified:false,bodyGetOperations:0,
  sourceR2ListGetOperations:pages.length,
  sourceR2ObjectGetOperations:0,sourceR2HeadOperations:0,
  sourceR2Writes:0,destinationR2Calls:0,sourceD1Queries:0,destinationD1Queries:0,
  sourceR2SnapshotAtomicityVerified:false,sourceD1ManifestMatches:0,
  originalHashedKeySizeReceiptConfidential:true,
  privateObjectKeysLoggedOrSaved:false,
  metadataSHA256IsNotObjectByteSHA256:true,
  aggregateListMetadataSha256:digest.digest("hex"),
  pageReceipts:pages,
  independentlyAudited:false,formalM07Accepted:false
 });
}
async function main(){
 await mkdir(OUT,{recursive:true,mode:0o700});
 const stream=createWriteStream(OUT+"/private-hashed-object-list.jsonl",
   {flags:"wx",mode:0o600});
 let result={schemaVersion:"S2_M07_SOURCE_R2_32PAGE_LIST_HASHED_INVENTORY_V0_1",
   status:"FAIL_CLOSED",sourceR2Writes:0,sourceD1Queries:0,destinationD1Queries:0};
 try{
  result=await censusSourceR2({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
   secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
   bucketName:process.env.SYSTEM2_R2_BUCKET,
   sink:async value=>{
    if(!stream.write(value))await once(stream,"drain");
   }});
 }catch(e){
  const name=String(e?.message||"");
  result.error=/^M07_INVENTORY_[A-Z0-9_]+$/.test(name)?name:
    "M07_INVENTORY_UNEXPECTED_FAIL_CLOSED";
  result.partialR2ListCallsMayHaveHappened=true;
  process.exitCode=2;
 }finally{
  await new Promise(resolve=>stream.end(resolve));
  if(result.status==="FAIL_CLOSED")
    await rm(OUT+"/private-hashed-object-list.jsonl",{force:true});
  await writeFile(OUT+"/sanitized-list-summary.json",JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,
   seen:result.observedEntries??0,listCalls:result.sourceR2ListGetOperations??null,
   complete:result.completeSingleScan??false,listedBytes:result.listedBytesObserved??null,
   objectBodyShaChecked:0,error:result.error||null,writes:0}));
 }
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href)await main();
