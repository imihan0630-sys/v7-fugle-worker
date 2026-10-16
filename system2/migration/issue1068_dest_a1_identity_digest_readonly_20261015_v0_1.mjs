// Issue #1068 DATA_LANE: independent original-source-anchored DEST identity digest.
// No SOURCE D1 API, no original plaintext transfer, no D1 DML, no new credentials.
// Proof is ONLY bar_id/bar_hash/source_row_hash/batch_id equality against an earlier
// producer's ORIGINAL SOURCE-linked hash, NOT a new historical PIT/Frozen certificate.
import {createHash} from "node:crypto";
import {mkdir,writeFile,readFile} from "node:fs/promises";
const sha=x=>createHash("sha256").update(x).digest("hex");
const acctSHA="27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55";
const dbSHA="95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9";
export const EXPECTED={
  utcDay:"2026-10-15",sourceOriginalBars:84688,
  importedBars:47420,originalBatches:129,frozenDecisions:0,
  sourceLinkedProducerIdentitySha256:"d56b47494a8bc36b58e610ec12b58adde9ddfb5de5e95b616f716f41da1fb21d",
  originalWriterRunId:38683991222,originalWriterArtifactId:11949362399
};
// Exact date-scoped source-linked identities are immutable; previous 10/15
// acceptance stays separately pinned for retrospective tests, not reused for
// 10/16. A future day needs a NEW verified provider-native original writer
// artifact. No count-only fallback, no default to the previous market day.
export const EXPECTED_OCT16=Object.freeze({
  utcDay:"2026-10-16",sourceOriginalBars:84688,
  importedBars:59311,originalBatches:129,frozenDecisions:0,
  sourceLinkedProducerIdentitySha256:"a4a5f3057f3b4ef9f7a0a636c90ccca6d1b9282f4c53f74b6fabd2a88153f234",
  originalWriterRunId:38848657672,originalWriterArtifactId:12023953469,
  originalProviderZipSha256:"0ada1172a32c4de038b216102040abb26dc7246c554d9de9cbb6662ac1c6a0ee",
  originalInnerCopyJsonSha256:"4473bee28a7db4a80fc933e476ee74c3e4b74bd575743d3f1afd89ef67efb6a8",
  originalInnerInterlockJsonSha256:"a83a567569c9e0045262b8fdebe3c5c3075c502c22718017a7932d943ada685e",
  originalBilledRowsWritten:71346,originalOwnerCap:80000
});
export function resolveOriginalDayScope(day,nativeEvidence){
  if(day===EXPECTED.utcDay)return Object.freeze({...EXPECTED});
  if(day!==EXPECTED_OCT16.utcDay)throw Error("S2_ISSUE1068_DEST_IDENTITY_UNREGISTERED_UTC_DAY");
  const a=EXPECTED_OCT16,e=nativeEvidence;
  // Check the actual provider ZIP + both independently SHA-tested originals
  // before any Cloudflare API request, rather than trusting a stale count.
  if(e?.status!=="INDEPENDENT_ORIGINAL_NATIVE_ZIP_AND_BOTH_INNER_JSON_SHA_MATCH__WRITER_SELF_PARITY_ONLY__SEPARATE_DEST_D1_SELECT_PENDING"||
     e?.source?.originalImportRunId!==a.originalWriterRunId||
     e?.source?.originalProviderArtifactId!==a.originalWriterArtifactId||
     e?.source?.originalProviderPublishedZipSha256!==a.originalProviderZipSha256||
     e?.source?.independentlyDownloadedAndRehashedZipSha256!==a.originalProviderZipSha256||
     e?.source?.originalZipIndependentlyUnpacked!==true||
     e?.source?.originalZipFileCount!==2||
     e?.innerOriginalSanitized?.independentlyRecomputedJsonSha256!==a.originalInnerCopyJsonSha256||
     e?.innerOriginalSanitized?.jsonIndependentlyParsed!==true||
     e?.innerOriginalSanitized?.status!=="A1_RAW_HISTORY_PARTIAL__RESUME_NEXT_UTC_DAY"||
     e?.innerOriginalSanitized?.originalDateUtc!==a.utcDay||
     e?.innerOriginalSanitized?.sourceExpectedA1Bars!==a.sourceOriginalBars||
     e?.innerOriginalSanitized?.previousPhysicalDestA1Bars!==EXPECTED.importedBars||
     e?.innerOriginalSanitized?.addedRowsReportedByWriter!==a.importedBars-EXPECTED.importedBars||
     e?.innerOriginalSanitized?.newPhysicalDestA1BarsFromWriterSelfSelect!==a.importedBars||
     e?.innerOriginalSanitized?.postcopySourceLinkedBarsChecked!==a.importedBars||
     e?.innerOriginalSanitized?.postcopySourceLinkedDigest!==a.sourceLinkedProducerIdentitySha256||
     e?.innerOriginalSanitized?.batchManifestAfter!==a.originalBatches||
     e?.innerOriginalSanitized?.billedRowsWrittenThisRun!==a.originalBilledRowsWritten||
     e?.innerOriginalSanitized?.ownerOperationalBilledWriteCap!==a.originalOwnerCap||
     e?.innerOriginalSanitized?.completed!==false||
     e?.innerOriginalSanitized?.canPromotePIT!==false||
     e?.innerOriginalInterlock?.independentlyRecomputedJsonSha256!==a.originalInnerInterlockJsonSha256||
     e?.innerOriginalInterlock?.runId!==a.originalWriterRunId||
     e?.innerOriginalInterlock?.quotaDayUtc!==a.utcDay||
     e?.innerOriginalInterlock?.writerId!=="RAW_COPY"||
     e?.innerOriginalInterlock?.allowed!==true||
     e?.innerOriginalInterlock?.sameDayOtherRunCount!==0||
     e?.innerOriginalInterlock?.priorBoundaryOtherRunCount!==0||
     e?.innerOriginalInterlock?.atomicCloudflareLedgerProven!==false||
     e?.acceptance?.standalonePostCopyCloudflareD1CountSelectActuallyExecuted!==false||
     e?.acceptance?.formalPITPassed!==false||
     e?.acceptance?.frozenSnapshotPassed!==false||
     e?.acceptance?.repeatSameUtcDayDestWriterAuthorized!==false)
       throw Error("S2_ISSUE1068_DEST_IDENTITY_ORIGINAL_OCT16_NATIVE_EVIDENCE_MISMATCH");
  return a;
}
export const SELECT_COUNT="SELECT (SELECT COUNT(*) FROM s2_historical_a1_bars) AS a1_bars, (SELECT COUNT(*) FROM s2_historical_ingest_batches) AS batches, (SELECT COUNT(*) FROM s2_decisions) AS frozen_decisions";
export const PAGE_SQL="SELECT bar_id,bar_hash,source_row_hash,batch_id FROM s2_historical_a1_bars WHERE bar_id > ? ORDER BY bar_id LIMIT 400";
const fail=code=>{throw Error("S2_ISSUE1068_DEST_IDENTITY_"+code)};
const utf8cmp=(a,b)=>Buffer.compare(Buffer.from(a,"utf8"),Buffer.from(b,"utf8"));
const validText=s=>typeof s==="string"&&s.length>0;
const signedMeta=m=>Number.isSafeInteger(m?.rows_read)&&m.rows_read>=0&&m.rows_read<=125000&&m.rows_written===0;
export async function auditDestinationIdentityDigest({
  query,expectedCount=EXPECTED.importedBars,
  expectedDigest=EXPECTED.sourceLinkedProducerIdentitySha256,
  pageSize=400,maxPages=Math.ceil(expectedCount/pageSize)+1
}={}){
  if(typeof query!=="function"||!Number.isSafeInteger(expectedCount)||expectedCount<1||
    !Number.isSafeInteger(pageSize)||pageSize<1||pageSize>400||
    !Number.isSafeInteger(maxPages)||maxPages<Math.ceil(expectedCount/pageSize)||
    !/^[0-9a-f]{64}$/.test(expectedDigest))fail("ARGUMENTS");
  const hash=createHash("sha256");let cursor="",count=0,pages=0,rowsRead=0;
  while(true){
    if(pages>=maxPages)fail("PAGES_EXCEEDED");
    const result=await query(PAGE_SQL,[cursor]);
    pages++;
    if(!Array.isArray(result?.results)||result.results.length>pageSize||!signedMeta(result.meta))
      fail("PROVIDER_NON_READONLY_RESPONSE");
    rowsRead+=result.meta.rows_read;
    if(rowsRead>125000)fail("METERED_ROWS_READ_LIMIT");
    if(result.results.length===0)break;
    for(const r of result.results){
      const v=[r?.bar_id,r?.bar_hash,r?.source_row_hash,r?.batch_id];
      if(!v.every(validText))fail("ROW_SHAPE");
      if(cursor!==""&&utf8cmp(v[0],cursor)<=0)fail("DUPLICATE_OR_UNSORTED_BAR_ID");
      for(const part of v){const buf=Buffer.from(part,"utf8");hash.update(Buffer.from(String(buf.length)+":"));hash.update(buf)}
      cursor=v[0];count++;
      if(count>expectedCount)fail("ROW_OVERFLOW");
    }
    if(result.results.length<pageSize)break;
  }
  if(count!==expectedCount)fail("DEST_COUNT_MISMATCH");
  const digest=hash.digest("hex");
  if(digest!==expectedDigest)fail("SOURCE_LINKED_SHA256_MISMATCH");
  return Object.freeze({status:"DEST_ORIGINAL_SOURCE_LINKED_BAR_IDENTITY_DIGEST_REPLAY_PASS",
    expectedRows:expectedCount,observedRows:count,pages,rowsRead,computedSha256:digest,
    matchedOriginalProducerSourceLinkedDigest:true,cloudflareWrites:0,
    historicalFirstKnownAtPITCertified:false,rawPayloadByteSHAIndependentlyReplayed:false,
    fullMigrationCertified:false,formalAuditLaneAccepted:false});
}
const OUT="/tmp/s2-issue1068-20261015-dest-identity-proof";
async function live(){
  const account=process.env.S2_SCHEMA_DEST_ACCOUNT_ID,token=process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN;
  const now=()=>new Date().toISOString().slice(0,10);
  const quotaDay=now();
  // A verified original artifact is mandatory for each actual observation UTC
  // date; refuses stale replay after any new writer/billing day.
  const witness=quotaDay===EXPECTED_OCT16.utcDay?
    JSON.parse(await readFile(new URL("./evidence/S2_DATA_ISSUE1068_ORIGINAL_DEST_WRITER_ZIP_INDEPENDENT_REHASH_20261016_V0_1.json",import.meta.url),"utf8")):null;
  const scope=resolveOriginalDayScope(quotaDay,witness);
  if(!account||!token||sha(account.toLowerCase())!==acctSHA)fail("ACCOUNT_IDENTITY");
  if(now()!==scope.utcDay)fail("ORIGINAL_QUOTA_DAY_DRIFT");
  const get=async(path,method="GET",body)=>{
    if(now()!==scope.utcDay)fail("UTC_DAY_ROLLOVER");
    if(method!=="GET"&&!(method==="POST"&&path.endsWith("/query")&&
      (body?.sql===SELECT_COUNT||body?.sql===PAGE_SQL)))fail("ONLY_PINNED_SELECT_ALLOWED");
    const res=await fetch("https://api.cloudflare.com/client/v4/accounts/"+account+path,{
      method,headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
      ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(40000)});
    const json=await res.json().catch(()=>null);
    if(!res.ok||json?.success!==true)fail("PROVIDER_FAILED");
    return json.result;
  };
  const list=await get("/d1/database?per_page=100");
  if(!Array.isArray(list)||list.length!==1||list[0]?.name!=="system2-research")fail("DEST_DB_UNIVERSE");
  const db=list[0],id=db.uuid||db.id;
  if(!id||sha(id.toLowerCase())!==dbSHA||!Number.isSafeInteger(db.file_size)||
      db.file_size<0||db.file_size>450000000)fail("DEST_DB_IDENTITY");
  let totalRead=0,queries=0;
  const query=async(sql,params)=>{
    if(sql!==SELECT_COUNT&&sql!==PAGE_SQL)fail("SQL_NOT_WHITELISTED");
    const body={sql,...(sql===PAGE_SQL?{params}: {})};
    if(sql===PAGE_SQL&&(!Array.isArray(params)||params.length!==1||
        typeof params[0]!=="string"))fail("CURSOR_INVALID");
    // 59,311 imported rows need 149 identity pages plus two count reads.
    // Bound to the *registered* row count; never relax the global row-read
    // meter or accept an unregistered future snapshot.
    if(++queries>Math.ceil(scope.importedBars/400)+4)fail("MAX_QUERY_CALLS");
    const result=await get("/d1/database/"+id+"/query","POST",body);
    if(!Array.isArray(result)||result.length!==1||result[0]?.success!==true||
       !signedMeta(result[0].meta)||!Array.isArray(result[0].results))fail("QUERY_NOT_READONLY");
    totalRead+=result[0].meta.rows_read;
    if(totalRead>225000)fail("TOTAL_READ_QUOTA_CAP");
    return result[0];
  };
  const counts=async()=>{
    const r=await query(SELECT_COUNT);
    if(r.results.length!==1||r.results[0].a1_bars!==scope.importedBars||
       r.results[0].batches!==scope.originalBatches||
       r.results[0].frozen_decisions!==scope.frozenDecisions)fail("PHYSICAL_COUNT_DRIFT");
    return r.results[0];
  };
  await counts();
  const replay=await auditDestinationIdentityDigest({query,expectedCount:scope.importedBars,expectedDigest:scope.sourceLinkedProducerIdentitySha256});
  await counts();
  if(now()!==scope.utcDay)fail("DAY_CHANGED_DURING_READ");
  return {schemaVersion:"S2_ISSUE1068_ORIGINAL_DAY_SCOPED_PRODUCER_LINKED_DEST_IDENTITY_V0_2",
    observedQuotaDayUtc:scope.utcDay,
    classification:"DATA_LANE_SEPARATE_TARGET_ONLY_SQL_IDENTITY_DIGEST_NOT_FORMAL_AUDIT",
    status:"REAL_PROVIDER_DEST_IDENTITY_DIGEST_MATCHED_PRODUCER_SOURCE_LINKED_RECEIPT",
    originalSourceAnchor:{...scope},
    observedAtUtc:new Date().toISOString(),destinationDbFileBytes:db.file_size,
    targetAccountFingerprintMatched:true,targetDbFingerprintMatched:true,
    countBeforeAndAfterExactlyMatch:true,providerSelectQueries:queries,
    originalProducerIdentityDigestUnaltered:true,
    providerRowsReadTotal:totalRead,providerRowsWrittenTotal:0,
    importedBarIdentityDigestReplay:replay,
    sourceD1Queries:0,sourceD1Writes:0,destinationD1Writes:0,rawBarPayloadsLogged:0,
    auditedOriginalEntireBarPayloadSHA:false,
    certifiedHistoricalPIT:false,certifiedFrozen:false,certifiedR2:false,
    independentAuditLaneSignoff:false,historicalBacktestAuthorized:false,
    sameUtcDayAdditionalWriterAuthorized:false,system1FormalChanged:false};
}
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href){
  let record={schemaVersion:"S2_ISSUE1068_ORIGINAL_DAY_SCOPED_PRODUCER_LINKED_DEST_IDENTITY_V0_2",
    status:"FAIL_CLOSED",destinationD1Writes:0,sourceD1Queries:0,
    independentAuditLaneSignoff:false,certifiedHistoricalPIT:false};
  try{record=await live()}
  catch(e){const msg=String(e?.message||"");record.error=/^S2_ISSUE1068_DEST_IDENTITY_[A-Z_]+$/.test(msg)?msg:"S2_ISSUE1068_DEST_IDENTITY_FAIL_CLOSED";process.exitCode=2}
  finally{
    await mkdir(OUT,{recursive:true,mode:0o700});
    await writeFile(OUT+"/sanitized-digest-receipt.json",JSON.stringify(record,null,2)+"\n",{mode:0o600});
    console.log(JSON.stringify({status:record.status,observedRows:record.importedBarIdentityDigestReplay?.observedRows??null,
      digestMatch:record.importedBarIdentityDigestReplay?.matchedOriginalProducerSourceLinkedDigest??false,
      providerRowsWrittenTotal:record.providerRowsWrittenTotal??0,error:record.error??null}));
  }
}
