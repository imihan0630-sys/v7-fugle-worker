// M07 bounded original SOURCE R2 ListObjectsV2 preflight, exactly one GET.
// NOT byte-SHA, not complete if truncated; no GET Object, PUT, DELETE, D1 or Worker.
// Uses pre-existing System2 SOURCE R2 credentials only, prints metadata aggregates.
import {createHash,createHmac} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";
const BUCKET="system2-historical-research", MAX_KEYS=200;
const sha=x=>createHash("sha256").update(x).digest("hex");
const hmac=(k,m,fmt)=>createHmac("sha256",k).update(m).digest(fmt);
const reject=x=>{throw Error("M07_"+x)};
const xml=(s,tag)=>{
 const m=String(s).match(new RegExp("<"+tag+">([\\s\\S]*?)</"+tag+">"));
 return m?m[1]:null;
};
export function assessR2ListXml(body){
 if(typeof body!=="string"||body.length>3000000||!body.includes("<ListBucketResult"))reject("INVALID_XML");
 const bucket=xml(body,"Name"),truncated=xml(body,"IsTruncated");
 if(bucket!==BUCKET||!["true","false"].includes(truncated))reject("LIST_IDENTITY_OR_COMPLETENESS");
 const nodes=[...body.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)];
 if(nodes.length>MAX_KEYS)reject("LIST_LIMIT_EXCEEDED");
 const seen=new Set();let bytes=0;const tuples=[];
 for(const [,part] of nodes){
   const key=xml(part,"Key"),rawSize=xml(part,"Size"),etag=xml(part,"ETag");
   if(!key||key.length>2048||!rawSize||!/^(0|[1-9]\d*)$/.test(rawSize)||
      !Number.isSafeInteger(Number(rawSize))||seen.has(key))reject("OBJECT_METADATA_INVALID");
   seen.add(key);const n=Number(rawSize);bytes+=n;
   if(!Number.isSafeInteger(bytes))reject("OBJECT_TOTAL_BYTES_OVERFLOW");
   tuples.push([key,n,etag??null]);
 }
 const count=xml(body,"KeyCount");
 if(count!==null&&(!/^\d+$/.test(count)||Number(count)!==nodes.length))reject("KEYCOUNT_MISMATCH");
 if(truncated==="true"&&!xml(body,"NextContinuationToken"))reject("TRUNCATED_TOKEN_MISSING");
 // Hash of returned LIST metadata, NOT of original object bytes. Object keys stay private.
 const metadataDigest=sha(JSON.stringify(tuples));
 return Object.freeze({sampledObjects:nodes.length,sampledObjectListedBytes:bytes,
   sampleMetadataSha256:metadataDigest,listingTruncated:truncated==="true",
   totalBucketObjectCount:nodes.length===0&&truncated==="false"?0:
      truncated==="false"?nodes.length:null,
   completeBucketListObserved:truncated==="false",
   byteSha256OfObjectsVerified:false,etagIsNotByteSha256:true,
   sourceR2ContentsRestored:false,r2ObjectWriteRequested:false,sourceD1Writes:0,
   referencedD1ManifestRowsAreNotObjectCount:25823});
}
export function signedR2ListRequest({accountId,accessKeyId,secretAccessKey,now=new Date()}){
 if(!/^[0-9a-f]{32}$/i.test(accountId||"")||!accessKeyId||!secretAccessKey||
    !(now instanceof Date)||Number.isNaN(now.valueOf()))reject("CREDENTIAL_SCOPE_INVALID");
 const date=now.toISOString().replace(/[:-]|\.\d{3}/g,""),short=date.slice(0,8);
 const host=accountId+".r2.cloudflarestorage.com";
 const path="/"+BUCKET,query="list-type=2&max-keys="+MAX_KEYS;
 const empty=sha(""),headers="host:"+host+"\n"+"x-amz-content-sha256:"+empty+"\n"+"x-amz-date:"+date+"\n";
 const signed="host;x-amz-content-sha256;x-amz-date";
 const canonical=["GET",path,query,headers,signed,empty].join("\n");
 const scope=short+"/auto/s3/aws4_request";
 const payload=["AWS4-HMAC-SHA256",date,scope,sha(canonical)].join("\n");
 const key=hmac(hmac(hmac(hmac("AWS4"+secretAccessKey,short),"auto"),"s3"),"aws4_request");
 const sig=hmac(key,payload,"hex");
 return {url:"https://"+host+path+"?"+query,method:"GET",headers:{
   host,"x-amz-content-sha256":empty,"x-amz-date":date,
   authorization:"AWS4-HMAC-SHA256 Credential="+accessKeyId+"/"+scope+
     ", SignedHeaders="+signed+", Signature="+sig}};
}
export async function inspectM07({accountId,accessKeyId,secretAccessKey,bucketName,request=fetch}){
 if(bucketName!==BUCKET)reject("SOURCE_BUCKET_IDENTITY");
 const init=signedR2ListRequest({accountId,accessKeyId,secretAccessKey});
 // EXACTLY one ListObjectsV2 GET; no retries/continuation downloads.
 const response=await request(init.url,{method:init.method,headers:init.headers,
   signal:AbortSignal.timeout(25000)});
 if(!response.ok)reject("SOURCE_LIST_HTTP_"+String(response.status).replace(/\D/g,""));
 const result=assessR2ListXml(await response.text());
 return Object.freeze({schemaVersion:"S2_M07_SOURCE_R2_LIST_ONCE_READONLY_V0_1",
   status:result.completeBucketListObserved?
     "SOURCE_R2_LIST_COMPLETE_METADATA_ONLY__BYTE_SHA_NOT_CERTIFIED":
     "SOURCE_R2_LIST_PARTIAL_BOUNDED__TOTAL_AND_BYTE_SHA_UNKNOWN",
   observedAtUtc:new Date().toISOString(),sourceEnvironment:"system2-research",
   sourceBucketName:BUCKET,sourceR2ApiCalls:1,sourceR2GetObjectCalls:0,
   sourceD1Queries:0,sourceD1Writes:0,destR2ProvisionedByThisRun:false,
   sourceR2Writes:0,paidServiceChanges:0,newSecrets:0,system1RuntimeTouched:false,
   r2EntitlementAtDestinationConfirmedByThisRun:false,independentAuditAcceptance:false,...result});
}
async function main(){
 let result={schemaVersion:"S2_M07_SOURCE_R2_LIST_ONCE_READONLY_V0_1",status:"FAIL_CLOSED",
    sourceR2Writes:0,sourceD1Writes:0};
 try{
   result=await inspectM07({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
     accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
     secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
     bucketName:process.env.SYSTEM2_R2_BUCKET});
 }catch(e){
   const m=String(e?.message||"");
   result.error=/^M07_[A-Z0-9_]+$/.test(m)?m:"M07_UNKNOWN_FAIL_CLOSED";
   process.exitCode=2;
 }finally{
   const dir="/tmp/s2-m07-r2-list-once";await mkdir(dir,{recursive:true,mode:0o700});
   await writeFile(dir+"/sanitized-list.json",JSON.stringify(result,null,2)+"\n",{mode:0o600});
   console.log(JSON.stringify({status:result.status,objects:result.sampledObjects??null,
     listedBytes:result.sampledObjectListedBytes??null,truncated:result.listingTruncated??null,
     byteShaCertified:false,error:result.error||null,writeCount:0}));
 }
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href)await main();
