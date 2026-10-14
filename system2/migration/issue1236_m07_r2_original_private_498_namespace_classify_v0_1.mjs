// M07: classify EXACT G3-anchored 498 extra R2 source object identities by original
// ephemeral listing key namespace; original keys never logged, persisted or returned.
// Single capped non-atomic 32-page SOURCE R2 ListObjectsV2, no HEAD/GET object body,
// PUT, delete, Cloudflare D1, destination R2, new secret or paid entitlement.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {parseR2Page,signedR2Page} from "./issue1236_m07_r2_multipage_metadata_only_v0_1.mjs";
const BUCKET="system2-historical-research";
const ACCOUNT_SHA="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const EXPECTED_LIST_SHA="f5648ea5ffeb078d1d8b24b52743a9d712f879a304861f6f277283bdc3342a72";
const EXPECTED_SUMMARY_SHA="d365eaf8199ad1f6c0c2199243d3d0f420374320ca5a7f23062714da24f84532";
const ORIGINAL_SOURCE_META_SHA="3f0972357db3060004e65d6f3f5d829c3e4c19eeef7f59a46d2a264e9b5cca6d";
const ORIGINAL={keys:26321,bytes:504007793,extra:498,extraBytes:255515971,pages:27,
 metadataSha:ORIGINAL_SOURCE_META_SHA};
const MAXPAGES=32,MAXPERPAGE=1000,HEX=/^[0-9a-f]{64}$/;
const INPUT="/tmp/s2-m07-original-private-498";
const OUT="/tmp/s2-m07-original-extra-namespace-classification";
const sha=b=>createHash("sha256").update(b).digest("hex");
const deny=v=>{throw Error("M07_EXTRA_NAMESPACE_"+v)};
export function classifyRawNamespace(key){
 if(/^a1\/v0\.1\/market=(TWSE|TPEX)\/year=\d{4}\/symbol=[A-Za-z0-9._=-]+\/price_space=[A-Za-z0-9._=-]+\/[a-f0-9]{64}\.json\.gz$/.test(key))
  return "A1_CANONICAL_KEY_SHAPE__NO_OLD_D1_MANIFEST";
 if(key.startsWith("a1/"))return "A1_NONCANONICAL_KEY_SHAPE__REQUIRES_REVIEW";
 if(key.startsWith("smoke/"))return "SMOKE_NAMESPACE__NOT_AUTOMATICALLY_DISPOSABLE";
 return "OTHER_NAMESPACE__OWNERSHIP_UNVERIFIED";
}
export function parsePrivateExtraReceipt(bytes,metadataBytes,{
 expectedListSHA=EXPECTED_LIST_SHA,expectedSummarySHA=EXPECTED_SUMMARY_SHA}={}){
 if(sha(bytes)!==expectedListSHA||sha(metadataBytes)!==expectedSummarySHA)
   deny("ORIGINAL_498_ARTIFACT_BYTES_SHA_DRIFT");
 let meta;
 try{meta=JSON.parse(Buffer.from(metadataBytes).toString("utf8"))}catch{deny("ORIGINAL_498_META_INVALID")}
 if(meta.schemaVersion!=="S2_M07_PROTECTED_G3_SOURCE_498_R2_UNMATCHED_HASH_KEYS_V0_1"||
    meta.status!=="SOURCE_R2_498_UNMATCHED_PRIVATE_KEYHASHES_ANCHORED_TO_G3__OWNERSHIP_UNKNOWN"||
    meta.originalManifestIdentityAndSizeMatched!==25823||
    meta.extraKeyHashCount!==498||meta.extraListedBytes!==255515971||
    meta.extraPrivateKeyHashListSHA256!==expectedListSHA||
    meta.sourceR2OriginalPrivateInventoryKeys!==ORIGINAL.keys||
    meta.sourceR2NetworkCalls!==0||meta.destinationD1Writes!==0||
    meta.extraObjectsCanBeDeleted!==false)deny("ORIGINAL_498_SCOPE_DRIFT");
 const lines=Buffer.from(bytes).toString("utf8").trimEnd().split("\n"),items=new Map();
 for(const line of lines){
  let item;try{item=JSON.parse(line)}catch{deny("EXTRA_HASH_TUPLE_INVALID")}
  if(!Array.isArray(item)||item.length!==2||typeof item[0]!=="string"||
    !HEX.test(item[0])||!Number.isSafeInteger(item[1])||item[1]<0||
    item[1]>1e12||items.has(item[0]))deny("EXTRA_HASH_IDENTITY_DUP_OR_OUT_OF_RANGE");
  items.set(item[0],item[1]);
 }
 if(items.size!==498||Array.from(items.values()).reduce((a,b)=>a+b,0)!==255515971)
    deny("EXTRA_HASH_COUNT_AND_BYTES_DRIFT");
 return items;
}
export async function classifySourceFullList({loadPage,extraMap,expected=ORIGINAL}){
 if(typeof loadPage!=="function"||!(extraMap instanceof Map)||extraMap.size!==expected.extra)
  deny("ORIGINAL_EXTRAS_UNAVAILABLE");
 const seen=new Set(),hit=new Set(),digest=createHash("sha256");
 const categories=Object.create(null);
 for(const c of ["A1_CANONICAL_KEY_SHAPE__NO_OLD_D1_MANIFEST",
  "A1_NONCANONICAL_KEY_SHAPE__REQUIRES_REVIEW",
  "SMOKE_NAMESPACE__NOT_AUTOMATICALLY_DISPOSABLE",
  "OTHER_NAMESPACE__OWNERSHIP_UNVERIFIED"])categories[c]={count:0,listedBytes:0};
 let count=0,bytes=0,completed=false,pages=0,continuation=null;
 const seenTokens=new Set();
 for(let page=1;page<=MAXPAGES;page++){
  const p=parseR2Page(await loadPage(continuation));
  pages++;
  for(const o of p.entries){
   const id=sha(Buffer.from(o.key,"utf8"));
   if(seen.has(id))deny("DUPLICATE_SOURCE_KEY");
   seen.add(id);count++;bytes+=o.bytes;
   if(!Number.isSafeInteger(bytes)||count>32000)deny("SOURCE_LIMIT_EXCEEDED");
   digest.update(JSON.stringify([o.key,o.bytes,o.etag])+"\n");
   if(extraMap.has(id)){
    if(hit.has(id)||extraMap.get(id)!==o.bytes)deny("EXTRA_OBJECT_LIST_SIZE_OR_DUPLICATE");
    hit.add(id);
    const cat=classifyRawNamespace(o.key);
    categories[cat].count++;categories[cat].listedBytes+=o.bytes;
   }
  }
  if(!p.more){completed=true;break}
  if(!p.nextToken||seenTokens.has(p.nextToken))deny("LIST_TOKEN_REPEATED");
  seenTokens.add(p.nextToken);continuation=p.nextToken;
 }
 const hash=digest.digest("hex");
 if(!completed||count!==expected.keys||bytes!==expected.bytes||pages!==expected.pages||
    hit.size!==expected.extra||hash!==expected.metadataSha)
    deny("SOURCE_LIST_CHANGED_SINCE_G3_ORIGINAL_SNAPSHOT");
 const categoriesCount=Object.values(categories).reduce((n,x)=>n+x.count,0);
 const categoriesBytes=Object.values(categories).reduce((n,x)=>n+x.listedBytes,0);
 if(categoriesCount!==expected.extra||categoriesBytes!==expected.extraBytes)
    deny("CATEGORY_AGGREGATES_INVALID");
 return Object.freeze({
  schemaVersion:"S2_M07_G3_PRIVATE_498_SOURCE_R2_NAMESPACE_CLASSIFICATION_V0_1",
  status:"498_ORIGINAL_R2_EXTRA_KEYS_MATCHED_SAME_PHYSICAL_SOURCE_LIST__NAMESPACE_ONLY",
  checkedAtUtc:new Date().toISOString(),sourceOriginalBucket:BUCKET,
  originalG3ExtraHashCount:expected.extra,originalG3ExtraListedBytes:expected.extraBytes,
  physicallyRelistedSourceObjects:count,physicallyRelistedSourceBytes:bytes,
  physicalListPages:pages,sourceR2OriginalListMetadataDigestMatched:true,
  sourceR2OriginalListMetadataSHA256:hash,
  extraKeysReidentifiedInRescan:hit.size,namespaceCounts:categories,
  rawSourceObjectKeysSaved:0,sourceR2HeadCalls:0,sourceR2ObjectBodyGetCalls:0,
  sourceR2ListGetCalls:pages,sourceR2Writes:0,sourceD1NetworkCalls:0,destinationR2Calls:0,
  historicalManifestForExtraObjectsPresentInOriginalG3:false,
  sourceListAtomicSnapshotProven:false,realObjectContentByteSHAValidatedByThisJob:0,
  objectOwnershipOrSafeDeletionCertified:false,independentAuditAccepted:false,
  billingOrSecretChanges:false,system1FormalOrWorkerChanged:false
 });
}
export async function classifyPhysicalSource({accountId,accessKeyId,secretAccessKey,bucketName,extraMap,fetchImpl=fetch}){
 if(bucketName!==BUCKET||sha(String(accountId||"").toLowerCase())!==ACCOUNT_SHA)
  deny("PHYSICAL_SOURCE_ACCOUNT_OR_BUCKET_UNAUTHORIZED");
 return classifySourceFullList({extraMap,loadPage:async token=>{
  const req=signedR2Page({accountId,accessKeyId,secretAccessKey,continuationToken:token});
  const res=await fetchImpl(req.url,{method:"GET",headers:req.headers,signal:AbortSignal.timeout(30000)});
  if(!res?.ok)deny("SOURCE_R2_LIST_HTTP_"+String(res?.status||0).replace(/\D/g,""));
  return res.text();
 }});
}
async function main(){
 let summary={schemaVersion:"S2_M07_G3_PRIVATE_498_SOURCE_R2_NAMESPACE_CLASSIFICATION_V0_1",
  status:"FAIL_CLOSED",sourceR2Writes:0};
 try{
  const [file,meta]=await Promise.all([
   readFile(INPUT+"/private-unmatched-r2-hashes.jsonl"),
   readFile(INPUT+"/sanitized-unmatched-summary.json")]);
  const extraMap=parsePrivateExtraReceipt(file,meta);
  summary=await classifyPhysicalSource({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
   secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
   bucketName:process.env.SYSTEM2_R2_BUCKET,extraMap});
 }catch(e){
  const reason=String(e?.message||"");
  summary.error=/^M07_EXTRA_NAMESPACE_[A-Z0-9_]+$/.test(reason)?reason:
    "M07_EXTRA_NAMESPACE_UNEXPECTED_FAIL_CLOSED";
  summary.r2ListReadsMayHaveHappened=true;process.exitCode=2;
 }finally{
  await mkdir(OUT,{recursive:true,mode:0o700});
  await writeFile(OUT+"/sanitized-source-namespace-classification.json",
   JSON.stringify(summary,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:summary.status,
   matchedExtras:summary.extraKeysReidentifiedInRescan??null,
   categories:summary.namespaceCounts??null,
   sourceR2ListCalls:summary.sourceR2ListGetCalls??null,
   error:summary.error||null,writes:0}));
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url))await main();
