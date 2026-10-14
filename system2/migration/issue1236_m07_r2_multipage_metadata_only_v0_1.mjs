// M07 #1236 source R2 S3 multi-page metadata-only snapshot attempt.
// HARD CAP 4 ListObjectsV2 GET requests x 1,000 keys. No auto retries.
// No original object GET/HEAD, no Cloudflare D1, destination R2 or mutations.
// Source R2 LIST metadata SHA is NEVER an independently verified content SHA.
import {createHash,createHmac} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
const BUCKET="system2-historical-research",PER_PAGE=1000,MAX_PAGES=4,MAX_XML=4000000;
const sha=x=>createHash("sha256").update(x).digest("hex");
const hmac=(key,s,format)=>createHmac("sha256",key).update(s).digest(format);
const fail=reason=>{throw Error("M07_PAGES_"+reason)};
function matchXml(body,tag){
 const re=new RegExp("<"+tag+">([\\s\\S]*?)</"+tag+">");
 return re.exec(body)?.[1]??null;
}
export function decodeS3Xml(s){
 if(typeof s!=="string")fail("BAD_XML_TEXT");
 const out=s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|amp|lt|gt|quot|apos);/g,(all,ref)=>{
  if(ref==="amp")return "&"; if(ref==="lt")return "<";if(ref==="gt")return ">";
  if(ref==="quot")return "\"";if(ref==="apos")return "'";
  const n=ref[1].toLowerCase()==="x"?parseInt(ref.slice(2),16):Number(ref.slice(1));
  if(!Number.isSafeInteger(n)||n<1||n>0x10ffff||(n>=0xd800&&n<=0xdfff))fail("INVALID_XML_ENTITY");
  return String.fromCodePoint(n);
 });
 if(/&(?!(?:amp|lt|gt|quot|apos);|#(?:x[0-9a-fA-F]+|[0-9]+);)/.test(out) &&
   /&[a-zA-Z#][a-zA-Z0-9#]*;/.test(out))fail("UNKNOWN_XML_ENTITY");
 return out;
}
export function parseR2Page(xmlText){
 if(typeof xmlText!=="string"||xmlText.length<25||xmlText.length>MAX_XML||
   !/<ListBucketResult(?:\s|>)/.test(xmlText)||
   /<!DOCTYPE|<!ENTITY|<script/i.test(xmlText))fail("XML_OUTSIDE_BOUND");
 const bucket=matchXml(xmlText,"Name"),flag=matchXml(xmlText,"IsTruncated");
 if(decodeS3Xml(bucket)!==BUCKET||!["true","false"].includes(flag))fail("BUCKET_OR_TRUNCATION_INVALID");
 const matches=[...xmlText.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)];
 if(matches.length>PER_PAGE)fail("PAGE_OVER_1000");
 const count=matchXml(xmlText,"KeyCount");
 if(count!==null&&(!/^\d+$/.test(count)||Number(count)!==matches.length))fail("REPORTED_KEYCOUNT_MISMATCH");
 const entries=[],unique=new Set();
 for(const match of matches){
  const rawKey=matchXml(match[1],"Key"),rawBytes=matchXml(match[1],"Size");
  const key=decodeS3Xml(rawKey),etag=matchXml(match[1],"ETag")??"";
  if(!key||key.length>2048||/[\x00-\x1f\x7f]/.test(key)||unique.has(key)||
    !/^(0|[1-9]\d*)$/.test(rawBytes||"")||!Number.isSafeInteger(Number(rawBytes))||
    Number(rawBytes)>1e12)fail("PAGE_OBJECT_INVALID");
  unique.add(key);
  entries.push({key,bytes:Number(rawBytes),etag});
 }
 const continuation=matchXml(xmlText,"NextContinuationToken");
 if(flag==="true"&&(!continuation||continuation.length>8192||!matches.length))fail("CONTINUATION_INVALID");
 if(flag==="false"&&continuation!==null)fail("FINISHED_WITH_CONTINUATION");
 return {entries,more:flag==="true",nextToken:flag==="true"?decodeS3Xml(continuation):null};
}
const encodeRFC3986=s=>encodeURIComponent(s).replace(/[!'()*]/g,c=>"%"+c.charCodeAt(0).toString(16).toUpperCase());
export function signedR2Page({accountId,accessKeyId,secretAccessKey,continuationToken=null,clock=new Date()}){
 if(!/^[a-f0-9]{32}$/i.test(accountId||"")||!accessKeyId||!secretAccessKey||
   !(clock instanceof Date)||!Number.isFinite(clock.getTime())||
   (continuationToken!==null&&(typeof continuationToken!=="string"||!continuationToken||continuationToken.length>8192)))fail("SIGN_SCOPE_INVALID");
 const host=accountId+".r2.cloudflarestorage.com",path="/"+BUCKET;
 const query=(continuationToken===null?"":"continuation-token="+encodeRFC3986(continuationToken)+"&")+
   "list-type=2&max-keys="+PER_PAGE;
 const instant=clock.toISOString().replace(/[:-]|\.\d{3}/g,""),short=instant.slice(0,8);
 const empty=sha("");
 const headerStr="host:"+host+"\n"+"x-amz-content-sha256:"+empty+"\n"+"x-amz-date:"+instant+"\n";
 const signed="host;x-amz-content-sha256;x-amz-date";
 const canonical=["GET",path,query,headerStr,signed,empty].join("\n");
 const scope=short+"/auto/s3/aws4_request";
 const stringToSign=["AWS4-HMAC-SHA256",instant,scope,sha(canonical)].join("\n");
 const k=hmac(hmac(hmac(hmac("AWS4"+secretAccessKey,short),"auto"),"s3"),"aws4_request");
 return {url:"https://"+host+path+"?"+query,method:"GET",
  headers:{host,"x-amz-content-sha256":empty,"x-amz-date":instant,
   authorization:"AWS4-HMAC-SHA256 Credential="+accessKeyId+"/"+scope+
     ", SignedHeaders="+signed+", Signature="+hmac(k,stringToSign,"hex")}};
}
export async function scanM07Pages({accountId,accessKeyId,secretAccessKey,bucketName,fetchImpl=fetch}){
 if(bucketName!==BUCKET)fail("SOURCE_BUCKET_NOT_APPROVED");
 let total=0,bytes=0,token=null,completed=false;
 const seenKeys=new Set(),seenTokens=new Set(),pages=[];
 const allDigest=createHash("sha256");
 for(let page=1;page<=MAX_PAGES;page++){
  const req=signedR2Page({accountId,accessKeyId,secretAccessKey,continuationToken:token});
  const res=await fetchImpl(req.url,{method:"GET",headers:req.headers,signal:AbortSignal.timeout(25000)});
  if(!res.ok)fail("SOURCE_R2_LIST_HTTP_"+String(res.status).replace(/\D/g,""));
  const raw=await res.text();
  const parsed=parseR2Page(raw);const digest=createHash("sha256"),pageCount=parsed.entries.length;
  let pageBytes=0;
  for(const obj of parsed.entries){
   if(seenKeys.has(obj.key))fail("DUPLICATE_ACROSS_PAGES");
   seenKeys.add(obj.key);pageBytes+=obj.bytes;
   const normalized=JSON.stringify([obj.key,obj.bytes,obj.etag])+"\n";
   digest.update(normalized);allDigest.update(normalized);
  }
  total+=pageCount;bytes+=pageBytes;
  if(!Number.isSafeInteger(bytes))fail("BYTES_TOTAL_OUT_OF_RANGE");
  pages.push({pageNumber:page,observedObjects:pageCount,listedBytes:pageBytes,
    listedMetadataSha256:digest.digest("hex"),truncated:parsed.more});
  if(!parsed.more){completed=true;break}
  const next=parsed.nextToken;
  if(seenTokens.has(next)||next===token)fail("REPEATED_CONTINUATION");
  seenTokens.add(next);token=next;
 }
 return Object.freeze({schemaVersion:"S2_M07_SOURCE_R2_MULTIPAGE_METADATA_ONLY_V0_1",
  status:completed?"SOURCE_R2_LIST_METADATA_COMPLETE__OBJECT_BYTES_UNVERIFIED":
   "SOURCE_R2_LIST_METADATA_PARTIAL__CONTINUATION_NOT_PERSISTED",
  observedAtUtc:new Date().toISOString(),sourceAccount:"SOURCE_SYSTEM2_RESEARCH",
  sourceBucket:BUCKET,observedObjects:total,listedObjectBytes:bytes,
  completeListingObserved:completed,listPages:pages.length,
  pageReceipts:pages,aggregateListedMetadataSha256:allDigest.digest("hex"),
  bucketTotalObjectCount:completed?total:null,bucketTotalBytes:completed?bytes:null,
  snapshotAtomicityProven:false,sourceR2ObjectBodyShaVerified:0,
  sourceR2ContentBytesRead:0,sourceR2ListGetCalls:pages.length,
  sourceR2GetObjectCalls:0,sourceR2Writes:0,sourceD1Queries:0,
  destinationR2Calls:0,destinationR2Provisioned:false,paidPlanChanged:false,
  rawObjectKeysPersisted:0,continuationTokenPersisted:false,
  referencedD1ManifestRows:25823,manifestToObjectJoinVerified:false,
  fullPhysicalR2Acceptance:false,independentAuditAccepted:false});
}
async function main(){
 let receipt={schemaVersion:"S2_M07_SOURCE_R2_MULTIPAGE_METADATA_ONLY_V0_1",
  status:"FAIL_CLOSED",sourceR2Writes:0,sourceD1Queries:0,destinationR2Calls:0};
 try{
  receipt=await scanM07Pages({
   accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
   secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
   bucketName:process.env.SYSTEM2_R2_BUCKET});
 }catch(e){
  const m=String(e?.message||"");
  receipt.error=/^M07_PAGES_[A-Z0-9_]+$/.test(m)?m:"M07_PAGES_UNEXPECTED_FAIL_CLOSED";
  process.exitCode=2;
 }finally{
  const out="/tmp/s2-m07-source-r2-multipage";await mkdir(out,{recursive:true,mode:0o700});
  await writeFile(out+"/sanitized-result.json",JSON.stringify(receipt,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:receipt.status,objects:receipt.observedObjects??null,
   bytes:receipt.listedObjectBytes??null,pages:receipt.listPages??null,
   complete:receipt.completeListingObserved??false,
   objectByteShaVerified:0,error:receipt.error||null,writes:0}));
 }
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href)await main();
