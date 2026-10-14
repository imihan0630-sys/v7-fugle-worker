// M07: classify 340 unreceipted D08 SOURCE R2 extras, anchored to ORIGINAL
// G3 private 498 keyhashes, four original 154 D08 writer receipts, and original
// complete 26,321 SOURCE R2 listing digest. 32 LIST max; no HEAD/body GET/writes.
// Raw R2 keys ephemeral in protected GitHub runner; aggregates only are persisted.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {parseR2Page,signedR2Page} from "./issue1236_m07_r2_multipage_metadata_only_v0_1.mjs";
import {parsePrivateExtraReceipt} from "./issue1236_m07_r2_original_private_498_namespace_classify_v0_1.mjs";
import {ORIGINAL_REPO_RECEIPTS,parseSourceReceiptText} from "./issue1236_m07_original_d08_writer_receipt_g3_498_offline_join_v0_1.mjs";
const BUCKET="system2-historical-research";
const ACCOUNT_SHA="3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b";
const LIST_SHA="3f0972357db3060004e65d6f3f5d829c3e4c19eeef7f59a46d2a264e9b5cca6d";
const EXPECTED={keys:26321,bytes:504007793,pages:27,extras:498,extraBytes:255515971,receipted:154,
 extraUnknownD08:340,smoke:4,sha:LIST_SHA};
const LIMIT=32,sha=b=>createHash("sha256").update(b).digest("hex");
const fail=s=>{throw Error("M07_340_FAMILY_"+s)};
const OUT="/tmp/s2-m07-original-340-family";
const SRC="/tmp/s2-m07-original-private-498";
export const FAMILY_CATEGORIES=Object.freeze([
 "RAW_V01_NO_ARCHIVED_RECEIPT__INVALIDATED_STUDY_VINTAGE",
 "RAW_V02_NO_ARCHIVED_RECEIPT__UNKNOWN_PROVENANCE",
 "RAW_V03_NO_ARCHIVED_RECEIPT__UNKNOWN_PROVENANCE",
 "RAW_VERSION_OTHER_OR_MALFORMED__UNKNOWN_PROVENANCE",
 "YEAR_PACK_V01_NO_ARCHIVED_RECEIPT__UNKNOWN_PROVENANCE",
 "YEAR_PACK_OTHER_VERSION__UNKNOWN_PROVENANCE",
 "D08_OTHER_NAMING_FAMILY__UNKNOWN_PROVENANCE"
]);
export function categorizeUnreceiptedRawKey(key){
 if(typeof key!=="string"||!key.startsWith("research/d08/"))fail("OUTSIDE_D08_FAMILY");
 const date="\\d{4}-\\d{2}-\\d{2}",suffix="[a-f0-9]{64}\\.json\\.gz";
 if(new RegExp("^research/d08/twse-raw-valuation-snapshot-v0\\.1/"+date+"/"+suffix+"$").test(key))
  return FAMILY_CATEGORIES[0];
 if(new RegExp("^research/d08/twse-raw-valuation-snapshot-v0\\.2/"+date+"/"+suffix+"$").test(key))
  return FAMILY_CATEGORIES[1];
 if(new RegExp("^research/d08/twse-raw-valuation-snapshot-v0\\.3/"+date+"/"+suffix+"$").test(key))
  return FAMILY_CATEGORIES[2];
 if(key.startsWith("research/d08/twse-raw-valuation-snapshot-"))
  return FAMILY_CATEGORIES[3];
 if(/^research\/d08\/twse-daily-valuation-year-pack-v0\.1\/\d{4}\/[a-f0-9]{64}\.json\.gz$/.test(key))
  return FAMILY_CATEGORIES[4];
 if(key.startsWith("research/d08/twse-daily-valuation-year-pack-"))
  return FAMILY_CATEGORIES[5];
 return FAMILY_CATEGORIES[6];
}
export function buildOriginalReceiptMap(groups){
 if(!Array.isArray(groups)||groups.length!==4)fail("MISSING_FOUR_ORIGINAL_RECEIPTS");
 const entries=new Map();
 for(const group of groups){
  if(!["RAW_V01","RAW_V02","RAW_V03","ANNUAL_V01"].includes(group.label)||
     !Array.isArray(group.rows))fail("INVALID_RECEIPT_GROUP");
  for(const r of group.rows){
   if(typeof r.id!=="string"||entries.has(r.id))fail("DUPLICATE_ARCHIVED_RECEIPT_IDENTITY");
   entries.set(r.id,{label:group.label,bytes:r.bytes});
  }
 }
 if(entries.size!==154)fail("ORIGINAL_WRITER_RECEIPT_COUNT_NOT_154");
 return entries;
}
const newCount=()=>({count:0,listedBytes:0});
export async function run340Inventory({extraMap,writerMap,loadPage,expected=EXPECTED}){
 if(!(extraMap instanceof Map)||extraMap.size!==expected.extras||
    !(writerMap instanceof Map)||writerMap.size!==expected.receipted||
    typeof loadPage!=="function")fail("INPUT_SCOPE");
 const categories=Object.create(null);
 for(const v of ["ORIGINAL_GITHUB_RAW_V01_INVALIDATED","ORIGINAL_GITHUB_RAW_V02","ORIGINAL_GITHUB_RAW_V03",
   "ORIGINAL_GITHUB_ANNUAL_V01","SMOKE__PRESERVE",...FAMILY_CATEGORIES])categories[v]=newCount();
 let total=0,totalBytes=0,extraMatched=0,withReceipt=0,smoke=0,unreceiptedD08=0;
 let pages=0,token=null,finished=false;
 const ids=new Set(),extraSeen=new Set(),receiptSeen=new Set(),tokens=new Set();
 const digest=createHash("sha256");
 for(let page=1;page<=LIMIT;page++){
  const p=parseR2Page(await loadPage(token));
  pages++;
  for(const item of p.entries){
   const id=sha(Buffer.from(item.key,"utf8"));
   if(ids.has(id))fail("DUPLICATE_ORIGINAL_R2_KEY");ids.add(id);
   total++;totalBytes+=item.bytes;
   if(total>32000||!Number.isSafeInteger(totalBytes))fail("TOTAL_LIST_QUOTA");
   digest.update(JSON.stringify([item.key,item.bytes,item.etag])+"\n");
   if(!extraMap.has(id))continue;
   if(extraMap.get(id)!==item.bytes||extraSeen.has(id))fail("G3_PRIVATE_KEY_OR_SIZE_CONFLICT");
   extraSeen.add(id);extraMatched++;
   let cat;
   const recorded=writerMap.get(id);
   if(recorded){
    if(receiptSeen.has(id))fail("DUPLICATE_RECORDED_WRITER");
    receiptSeen.add(id);withReceipt++;
    if(recorded.bytes!==null&&recorded.bytes!==item.bytes)
       fail("ARCHIVED_WRITER_RECEIPT_LIST_SIZE_CONFLICT");
    if(recorded.label==="RAW_V01")cat="ORIGINAL_GITHUB_RAW_V01_INVALIDATED";
    else if(recorded.label==="RAW_V02")cat="ORIGINAL_GITHUB_RAW_V02";
    else if(recorded.label==="RAW_V03")cat="ORIGINAL_GITHUB_RAW_V03";
    else if(recorded.label==="ANNUAL_V01")cat="ORIGINAL_GITHUB_ANNUAL_V01";
    else fail("ORIGINAL_RECEIPT_VERSION_DRIFT");
   }else if(item.key.startsWith("smoke/")){
    cat="SMOKE__PRESERVE";smoke++;
   }else{
    cat=categorizeUnreceiptedRawKey(item.key);unreceiptedD08++;
   }
   categories[cat].count++;categories[cat].listedBytes+=item.bytes;
  }
  if(!p.more){finished=true;break}
  if(!p.nextToken||tokens.has(p.nextToken))fail("REPEATED_CONTINUATION_TOKEN");
  tokens.add(p.nextToken);token=p.nextToken;
 }
 const fingerprint=digest.digest("hex");
 if(!finished||pages!==expected.pages||total!==expected.keys||
    totalBytes!==expected.bytes||fingerprint!==expected.sha||
    extraMatched!==expected.extras||withReceipt!==expected.receipted||
    unreceiptedD08!==expected.extraUnknownD08||smoke!==expected.smoke||
    Array.from(categories ? Object.values(categories):[]).reduce((n,v)=>n+v.listedBytes,0)!==expected.extraBytes)
   fail("SOURCE_R2_ORIGINAL_FULL_LIST_ORIGINAL_G3_IDENTITY_DRIFT");
 return Object.freeze({
  schemaVersion:"S2_M07_G3_EXTRA340_D08_SOURCE_KEY_FAMILY_RECONCILIATION_V0_1",
  status:"G3_498_EXTRAS_AND_154_SOURCE_RECEIPTS_ANCHORED__340_D08_UNRECEIPTED_FAMILIES_CLASSIFIED",
  sourceOriginalR2FullListSHA256:fingerprint,originalSourceR2SingleNonAtomicScan:true,
  sourceR2KeysListed:total,sourceR2ListBytes:totalBytes,sourceR2Pages:pages,
  g3PrivateExtrasReidentified:extraMatched,originalG3ExtraByteSum:expected.extraBytes,
  originalWriterReceiptsMatched:withReceipt,smokeKeysRetained:smoke,
  d08OriginalKeyFamilyOnlyUnreceiptedCount:unreceiptedD08,
  categories,rawObjectKeysOrIdentityHashesPersisted:false,
  sourceR2ListGetCalls:pages,sourceR2HeadCalls:0,sourceR2ObjectBodyGetCalls:0,
  sourceR2Writes:0,sourceD1RemoteQueries:0,destinationD1Writes:0,destinationR2Calls:0,
  historicalD08V01IdempotencyInvalidated:true,
  originalWriterReceiptIsNotIndependentOriginalByteSHA:true,
  sourceR2ObjectByteSHAQualifiedByThisRun:0,originalSourceD1ObjectByteSHAQualifiedPreviously:8,
  keyFamilyCannotProveOriginalWriterOrContent:true,
  sourceR2ExtraDeletionAuthorized:false,destinationR2EntitlementUnchanged:true,
  historicalPITOrFrozenCertified:false,independentAuditorApproved:false,paidResourcesEnabled:false
 });
}
export async function sourceProviderReadOnly({accountId,accessKeyId,secretAccessKey,bucketName,extraMap,writerMap,fetchImpl=fetch}){
 if(bucketName!==BUCKET||sha(String(accountId||"").toLowerCase())!==ACCOUNT_SHA)
  fail("ORIGINAL_SOURCE_ACCOUNT_OR_BUCKET_MISMATCH");
 return run340Inventory({extraMap,writerMap,loadPage:async continuation=>{
  const request=signedR2Page({accountId,accessKeyId,secretAccessKey,continuationToken:continuation});
  const response=await fetchImpl(request.url,{method:"GET",headers:request.headers,signal:AbortSignal.timeout(30000)});
  if(!response?.ok)fail("SOURCE_R2_LIST_HTTP_"+String(response?.status||0).replace(/\D/g,""));
  return response.text();
 }});
}
async function main(){
 let result={schemaVersion:"S2_M07_G3_EXTRA340_D08_SOURCE_KEY_FAMILY_RECONCILIATION_V0_1",
  status:"FAIL_CLOSED",sourceR2Writes:0,destinationD1Writes:0};
 try{
  const [list,summary]=await Promise.all([
   readFile(SRC+"/private-unmatched-r2-hashes.jsonl"),
   readFile(SRC+"/sanitized-unmatched-summary.json")]);
  const extraMap=parsePrivateExtraReceipt(list,summary);
  const groups=await Promise.all(ORIGINAL_REPO_RECEIPTS.map(async d=>({
   label:d.label,rows:parseSourceReceiptText(await readFile(d.path,"utf8"),d)
  })));
  const writerMap=buildOriginalReceiptMap(groups);
  result=await sourceProviderReadOnly({accountId:process.env.CLOUDFLARE_ACCOUNT_ID,
   accessKeyId:process.env.SYSTEM2_R2_ACCESS_KEY_ID,
   secretAccessKey:process.env.SYSTEM2_R2_SECRET_ACCESS_KEY,
   bucketName:process.env.SYSTEM2_R2_BUCKET,extraMap,writerMap});
  result={...result,checkedAtUtc:new Date().toISOString()};
 }catch(e){
  const msg=String(e?.message||"");
  result.error=/^M07_(340_FAMILY|EXTRA_NAMESPACE|D08_RECEIPT)_[A-Z0-9_]+$/.test(msg)?
    msg:"M07_340_FAMILY_UNEXPECTED_FAIL_CLOSED";
  result.partialReadOperationsMayHaveOccurred=true;process.exitCode=2;
 }finally{
  await mkdir(OUT,{recursive:true,mode:0o700});
  await writeFile(OUT+"/sanitized-340-d08-original-source-families.json",
    JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,
   extras:result.g3PrivateExtrasReidentified??null,
   originalWriterKeys:result.originalWriterReceiptsMatched??null,
   unreceiptedD08:result.d08OriginalKeyFamilyOnlyUnreceiptedCount??null,
   categories:result.categories??null,
   originalPagesRead:result.sourceR2ListGetCalls??null,error:result.error??null,writes:0}));
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url))await main();
