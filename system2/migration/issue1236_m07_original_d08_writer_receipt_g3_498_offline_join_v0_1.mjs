// M07 original G3 private 498 R2 extra keyhashes vs SOURCE D08 immutable GitHub receipts.
// Offline ONLY: 0 Cloudflare/R2 network calls, 0 origin body GET, 0 D1 queries.
// Verifies key identity + listed size (where archived receipts contain it).
// A pre-existing writer receipt's readbackVerified is NOT original byte SHA proof.
import {createHash} from "node:crypto";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {parsePrivateExtraReceipt} from "./issue1236_m07_r2_original_private_498_namespace_classify_v0_1.mjs";
const ROOT="/tmp/s2-m07-g3-d08-receipt-crosswalk";
const SHA=b=>createHash("sha256").update(b).digest("hex");
const GITBLOB=b=>createHash("sha1").update(Buffer.from("blob "+b.length+"\0")).update(b).digest("hex");
const fail=v=>{throw Error("M07_D08_RECEIPT_"+v)};
const HEX=/^[a-f0-9]{64}$/;
export const ORIGINAL_REPO_RECEIPTS=Object.freeze([
 {version:"V01_RAW_LEGACY",label:"RAW_V01",path:"research/d08_twse_raw_valuation_r2_capture_receipt_20261004_v0_1.json",gitBlob:"a5a6a5fc969baa008c0d53a4a5bc00b36e6d3adb",field:"receipts",expected:44,
  keyPattern:/^research\/d08\/twse-raw-valuation-snapshot-v0\.1\/\d{4}-\d{2}-\d{2}\/[a-f0-9]{64}\.json\.gz$/},
 {version:"V02_RAW",label:"RAW_V02",path:"research/d08_twse_raw_valuation_r2_capture_receipt_20261004_v0_2.json",gitBlob:"994f0bfe06f124de6de77c1da6f4b3296e915101",field:"receipts",expected:44,
  keyPattern:/^research\/d08\/twse-raw-valuation-snapshot-v0\.2\/\d{4}-\d{2}-\d{2}\/[a-f0-9]{64}\.json\.gz$/},
 {version:"V03_RAW",label:"RAW_V03",path:"research/d08_twse_raw_valuation_r2_capture_receipt_20261007_v0_3.json",gitBlob:"808cbcd5d97ad48befbdbc868762b6aa103f599d",field:"receipts",expected:44,
  keyPattern:/^research\/d08\/twse-raw-valuation-snapshot-v0\.3\/\d{4}-\d{2}-\d{2}\/[a-f0-9]{64}\.json\.gz$/},
 {version:"V01_ANNUAL",label:"ANNUAL_V01",path:"research/d08_twse_daily_valuation_archive_manifest_20261007_v0_1.json",gitBlob:"55fd69d7c07367f10ff5ba9f2717bcac2285034f",field:"years",expected:22,
  keyPattern:/^research\/d08\/twse-daily-valuation-year-pack-v0\.1\/\d{4}\/[a-f0-9]{64}\.json\.gz$/}
]);
export function parseSourceReceiptText(text,def,{checkBlob=true}={}){
 const bytes=Buffer.from(text,"utf8");
 if(checkBlob&&GITBLOB(bytes)!==def.gitBlob)fail("GITHUB_ORIGINAL_SOURCE_RECEIPT_BLOB_DRIFT");
 let input;try{input=JSON.parse(text)}catch{fail("SOURCE_WRITER_RECEIPT_BAD_JSON")}
 if(input.result!=="PASS"||input.outcomeJoin!==false||input.bucketName!=="system2-historical-research"){
  // The yearly archive has different schema, carries no bucketName/result? result PASS but bucket may missing.
  if(def.version!=="V01_ANNUAL"||input.result!=="PASS"||input.outcomeJoin!==false)
    fail("SOURCE_WRITER_RECEIPT_SCOPE_INVALID");
 }
 const rows=input[def.field];
 if(!Array.isArray(rows)||rows.length!==def.expected)fail("SOURCE_WRITER_RECEIPT_ROWCOUNT_DRIFT");
 const seen=new Set();
 return rows.map(row=>{
  const key=row.objectKey;
  const objectSha=row.objectSha256;
  if(row.readbackVerified!==true||typeof key!=="string"||!def.keyPattern.test(key)||
    typeof objectSha!=="string"||!HEX.test(objectSha)||seen.has(key))
    fail("SOURCE_RECEIPT_PROVENANCE_INVALID");
  seen.add(key);
  const archiveSize=row.gzipBytes;
  if(archiveSize!==undefined&&(!Number.isSafeInteger(archiveSize)||archiveSize<=0))
    fail("SOURCE_WRITER_RECEIPT_SIZE_INVALID");
  return {id:SHA(Buffer.from(key)),bytes:archiveSize??null,shaMetadata:objectSha};
 });
}
export function joinOriginalReceipts(privateExtraMap,groups){
 if(!(privateExtraMap instanceof Map)||privateExtraMap.size!==498||!Array.isArray(groups)||groups.length!==4)
  fail("PRIVATE_G3_SCOPE_INVALID");
 let observedExtraBytes=0;
 for(const size of privateExtraMap.values()){
  if(!Number.isSafeInteger(size)||size<0)fail("INVALID_PRIVATE_SIZE");
  observedExtraBytes+=size;
 }
 if(observedExtraBytes!==255515971)fail("ORIGINAL_498_SIZE_SUM_DRIFT");
 const allIds=new Set(),results={};
 let matches=0,presentSizeParities=0,missing=0,sizeConflicts=0;
 for(const entry of groups){
  const {label,rows}=entry;
  if(typeof label!=="string"||!Array.isArray(rows)||results[label])fail("GROUP_FORMAT_INVALID");
  let matched=0,missingInR2=0,parity=0,noSize=0;
  let bytes=0;
  for(const row of rows){
   if(allIds.has(row.id)||typeof row.id!=="string"||!HEX.test(row.id))
     fail("DUPLICATE_OBJECT_IDENTITIES_ACROSS_SOURCE_RECEIPTS");
   allIds.add(row.id);
   const actual=privateExtraMap.get(row.id);
   if(actual===undefined){missing++;missingInR2++;continue}
   matches++;matched++;bytes+=actual;
   if(row.bytes===null)noSize++;
   else if(actual===row.bytes){parity++;presentSizeParities++}
   else sizeConflicts++;
  }
  results[label]={archivedWriterReceiptEntries:rows.length,sourceR2ExtraKeyHashMatches:matched,
   sourceR2ExtraKeyHashMissing:missingInR2,matchedR2ListedBytes:bytes,
   archivedReceiptListedSizeParity:parity,writerReceiptMissingSizeField:noSize};
 }
 const totalRecordCount=groups.reduce((sum,x)=>sum+x.rows.length,0);
 const passed=matches===totalRecordCount&&missing===0&&sizeConflicts===0;
 return Object.freeze({
  schemaVersion:"S2_M07_ORIGINAL_G3_498_EXTRA_SOURCE_D08_FOUR_WRITER_RECEIPTS_OFFLINE_V0_1",
  status:passed?"SOURCE_D08_WRITER_RECEIPTS_154_KEY_IDENTITIES_MATCH_G3_498_EXTRA__AUDIT_PENDING":
   "SOURCE_D08_WRITER_RECEIPTS_PARTIAL_OR_LIST_SIZE_CONFLICT__NOT_ACCEPTED",
  sourceWriterReceipts:4,sourceD08WriterReceiptsRows:totalRecordCount,
  sourceR2OriginalExtraCount:498,sourceR2OriginalExtraListedBytes:observedExtraBytes,
  sourceD08WriterReceiptKeyHashMatched:matches,
  writerReceiptKeyNotInOriginalR2Extra:missing,
  writerReceiptGzipSizeParity:presentSizeParities,writerReceiptGzipSizeConflict:sizeConflicts,
  uniqueWriterReceiptKeyHashes:allIds.size,
  writerSelfReportedReadbackIsNotIndependentR2BodySha256:true,
  independentSourceObjectByteSha256VerifiedByThisJob:0,
  originalCrosswalkBodyShaPreviouslyVerifiedCount:8,
  originalExtraKeyCountStillWithoutTheseFourGitHubReceiptMatches:498-matches,
  byWriterReceipt:results,
  sourceD1NetworkCalls:0,sourceR2NetworkCalls:0,destinationD1Writes:0,
  destinationR2Calls:0,rawObjectKeysOrPrivateHashesPublished:false,
  originalR2SingleListingSnapshotAtomic:false,extraObjectsSafeToDelete:false,
  historicalPITOrFrozenCertified:false,independentAuditLaneAccepted:false,
  entireR2MigrationCompleted:false,system1FormalChanged:false,paidResourcesEnabled:false
 });
}
async function main(){
 let result={schemaVersion:"S2_M07_ORIGINAL_G3_498_EXTRA_SOURCE_D08_FOUR_WRITER_RECEIPTS_OFFLINE_V0_1",
  status:"FAIL_CLOSED",sourceD1NetworkCalls:0,sourceR2NetworkCalls:0,destinationD1Writes:0};
 try{
  const [privateList,privateMeta]=await Promise.all([
   readFile("/tmp/s2-m07-original-private-498/private-unmatched-r2-hashes.jsonl"),
   readFile("/tmp/s2-m07-original-private-498/sanitized-unmatched-summary.json")]);
  const original=parsePrivateExtraReceipt(privateList,privateMeta);
  const groups=await Promise.all(ORIGINAL_REPO_RECEIPTS.map(async def=>{
   const receipt=await readFile(def.path,"utf8");
   return {label:def.label,rows:parseSourceReceiptText(receipt,def)};
  }));
  result=joinOriginalReceipts(original,groups);
  result={...result,sourceGithubReceiptGitBlobs:ORIGINAL_REPO_RECEIPTS.map(({label,gitBlob})=>({label,gitBlob})),
   originalG3ExtraHashArtifactRun:38527825185,originalG3ExtraHashArtifactId:11876901312,
   observedAtUtc:new Date().toISOString()};
 }catch(e){
  const reason=String(e?.message||"");
  result.error=/^M07_(D08_RECEIPT|EXTRA_NAMESPACE)_[A-Z0-9_]+$/.test(reason)?
    reason:"M07_D08_RECEIPT_UNEXPECTED_FAIL_CLOSED";
  process.exitCode=2;
 }finally{
  await mkdir(ROOT,{recursive:true,mode:0o700});
  await writeFile(ROOT+"/sanitized-d08-original-writer-receipt-crosswalk.json",JSON.stringify(result,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:result.status,
   archivedWriterEntries:result.sourceD08WriterReceiptsRows??null,
   matched:result.sourceD08WriterReceiptKeyHashMatched??null,
   originalExtraRemaining:result.originalExtraKeyCountStillWithoutTheseFourGitHubReceiptMatches??null,
   actualRemoteCloudflareCalls:0,error:result.error??null}));
 }
}
if(process.argv[1]===fileURLToPath(import.meta.url))await main();
