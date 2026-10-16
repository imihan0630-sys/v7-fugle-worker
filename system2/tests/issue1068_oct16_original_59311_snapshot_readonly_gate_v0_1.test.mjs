import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {
 EXPECTED,EXPECTED_OCT16,resolveOriginalDayScope,
 auditDestinationIdentityDigest,PAGE_SQL,SELECT_COUNT
} from "../migration/issue1068_dest_a1_identity_digest_readonly_20261015_v0_1.mjs";

const original=JSON.parse(readFileSync(
 "system2/migration/evidence/S2_DATA_ISSUE1068_ORIGINAL_DEST_WRITER_ZIP_INDEPENDENT_REHASH_20261016_V0_1.json","utf8"));
const clone=()=>structuredClone(original);
test("new Oct16 original GitHub ZIP/inner receipt binds 59311 bars, 149 pages, 129 manifests and exact original source-linked digest",()=>{
 const x=resolveOriginalDayScope("2026-10-16",original);
 assert.equal(x.importedBars,59311);
 assert.equal(x.originalWriterRunId,38848657672);
 assert.equal(x.originalWriterArtifactId,12023953469);
 assert.equal(x.originalBatches,129);
 assert.equal(x.frozenDecisions,0);
 assert.equal(x.sourceLinkedProducerIdentitySha256,"a4a5f3057f3b4ef9f7a0a636c90ccca6d1b9282f4c53f74b6fabd2a88153f234");
 assert.equal(Math.ceil(x.importedBars/400),149);
 assert.equal(x.originalBilledRowsWritten,71346);
 assert.equal(x.originalOwnerCap,80000);
 assert.equal(EXPECTED.importedBars,47420);
 assert.equal(resolveOriginalDayScope("2026-10-15").importedBars,47420);
});
test("unregistered future/current provider day refuses stale writer snapshots",()=>{
 for(const day of ["2026-10-14","2026-10-17","2026-11-01","","2026-10-16T00:00:00Z"]){
   assert.throws(()=>resolveOriginalDayScope(day,original),/UNREGISTERED_UTC_DAY/,day);
 }
});
test("missing original provider verification must fail before any future provider query",()=>{
 assert.throws(()=>resolveOriginalDayScope("2026-10-16"),/NATIVE_EVIDENCE_MISMATCH/);
 assert.throws(()=>resolveOriginalDayScope("2026-10-16",{}),/NATIVE_EVIDENCE_MISMATCH/);
});
const forged=[
 ["wrong actual writer ID",x=>x.source.originalImportRunId=1],
 ["cross-job artifact",x=>x.source.originalProviderArtifactId=1],
 ["changed native provider ZIP SHA",x=>x.source.originalProviderPublishedZipSha256="0".repeat(64)],
 ["changed independently rehashed ZIP SHA",x=>x.source.independentlyDownloadedAndRehashedZipSha256="0".repeat(64)],
 ["claimed ZIP never unpacked",x=>x.source.originalZipIndependentlyUnpacked=false],
 ["hidden additional original inner receipt",x=>x.source.originalZipFileCount=3],
 ["changed inner copy SHA",x=>x.innerOriginalSanitized.independentlyRecomputedJsonSha256="0".repeat(64)],
 ["forged inner parse",x=>x.innerOriginalSanitized.jsonIndependentlyParsed=false],
 ["false full copied state",x=>x.innerOriginalSanitized.status="A1_RAW_HISTORY_COPY_COMPLETE_PIT_UNVERIFIED"],
 ["wrong actual UTC date",x=>x.innerOriginalSanitized.originalDateUtc="2026-10-15"],
 ["wrong original source scope",x=>x.innerOriginalSanitized.sourceExpectedA1Bars=85000],
 ["wrong original 47420 before",x=>x.innerOriginalSanitized.previousPhysicalDestA1Bars=1],
 ["forged 11892 imported bars",x=>x.innerOriginalSanitized.addedRowsReportedByWriter=11892],
 ["wrong actual 59311 count",x=>x.innerOriginalSanitized.newPhysicalDestA1BarsFromWriterSelfSelect=59312],
 ["fake complete checked rows",x=>x.innerOriginalSanitized.postcopySourceLinkedBarsChecked=84688],
 ["wrong actual original SHA",x=>x.innerOriginalSanitized.postcopySourceLinkedDigest="0".repeat(64)],
 ["wrong manifest count",x=>x.innerOriginalSanitized.batchManifestAfter=128],
 ["unbounded writer charge",x=>x.innerOriginalSanitized.billedRowsWrittenThisRun=100000],
 ["changed owner 80k cap",x=>x.innerOriginalSanitized.ownerOperationalBilledWriteCap=100000],
 ["falsified complete day",x=>x.innerOriginalSanitized.completed=true],
 ["false PIT-ready",x=>x.innerOriginalSanitized.canPromotePIT=true],
 ["wrong original guard SHA",x=>x.innerOriginalInterlock.independentlyRecomputedJsonSha256="0".repeat(64)],
 ["guard wrong writer RUN",x=>x.innerOriginalInterlock.runId=2],
 ["guard UTC clock mismatch",x=>x.innerOriginalInterlock.quotaDayUtc="2026-10-15"],
 ["other worker class",x=>x.innerOriginalInterlock.writerId="DAILY_DIAGNOSTIC"],
 ["guard disallow",x=>x.innerOriginalInterlock.allowed=false],
 ["duplicate prior writer",x=>x.innerOriginalInterlock.sameDayOtherRunCount=1],
 ["late previous day",x=>x.innerOriginalInterlock.priorBoundaryOtherRunCount=1],
 ["false global atomic ledger",x=>x.innerOriginalInterlock.atomicCloudflareLedgerProven=true],
 ["fabricated independent native SELECT",x=>x.acceptance.standalonePostCopyCloudflareD1CountSelectActuallyExecuted=true],
 ["fabricated formal PIT",x=>x.acceptance.formalPITPassed=true],
 ["fabricated Frozen",x=>x.acceptance.frozenSnapshotPassed=true],
 ["unauthorized same UTC day repeat",x=>x.acceptance.repeatSameUtcDayDestWriterAuthorized=true]
];
test("original native scope gate denies every tampered post-copy SHA, count, safety and formal promotion",()=>{
 for(const [label,change] of forged){
   const x=clone();change(x);
   assert.throws(()=>resolveOriginalDayScope("2026-10-16",x),/NATIVE_EVIDENCE_MISMATCH/,label);
 }
});
test("actual 59311 row-page workload stays inside strict READ-ONLY SELECT bounds; no 123-query false cap",async()=>{
 const n=59311;
 // Synthetic identities are only for algorithmic pagination. They must NOT
 // be misrepresented as the actual source/provider-produced native digest.
 const rows=Array.from({length:n},(_,i)=>({
  bar_id:"symbol-"+String(i).padStart(6,"0"),
  bar_hash:"bar-"+i,source_row_hash:"src-"+i,batch_id:"B"+Math.floor(i/400)
 }));
 const hash=createHash("sha256");
 for(const r of rows)for(const key of ["bar_id","bar_hash","source_row_hash","batch_id"]){
   const b=Buffer.from(r[key],"utf8");hash.update(Buffer.from(String(b.length)+":"));hash.update(b);
 }
 const syntheticDigest=hash.digest("hex");
 let pages=0;
 const q=async(sql,params)=>{
   assert.equal(sql,PAGE_SQL);
   const start=params[0]?Number(params[0].slice(-6))+1:0;
   pages++;
   const result=rows.slice(start,start+400);
   return {results:result,meta:{rows_read:result.length,rows_written:0}};
 };
 const r=await auditDestinationIdentityDigest({
  query:q,expectedCount:n,expectedDigest:syntheticDigest,
  pageSize:400,maxPages:151
 });
 assert.equal(r.status,"DEST_ORIGINAL_SOURCE_LINKED_BAR_IDENTITY_DIGEST_REPLAY_PASS");
 assert.equal(r.observedRows,n);
 assert.equal(r.pages,149);
 assert.equal(pages,149);
 assert.equal(r.rowsRead,n);
 assert.equal(r.cloudflareWrites,0);
 assert.equal(r.historicalFirstKnownAtPITCertified,false);
 assert.equal(r.formalAuditLaneAccepted,false);
});
test("registered read-only runner stays in original scope, dynamically adjusts 149-page request budget, no DML",()=>{
 const script=readFileSync("system2/migration/issue1068_dest_a1_identity_digest_readonly_20261015_v0_1.mjs","utf8");
 assert.match(script,/Math\.ceil\(scope\.importedBars\/400\)\+4/);
 assert.match(script,/expectedCount:scope\.importedBars,expectedDigest:scope\.sourceLinkedProducerIdentitySha256/);
 assert.match(script,/r\.results\[0\]\.a1_bars!==scope\.importedBars/);
 assert.match(script,/scope\.utcDay/);
 assert.match(script,/ORIGINAL_OCT16_NATIVE_EVIDENCE_MISMATCH/);
 assert.match(script,/rows_written===0/);
 assert.match(script,/providerRowsWrittenTotal:0/);
 assert.match(script,/independentAuditLaneSignoff:false/);
 assert.match(SELECT_COUNT,/s2_decisions/);
 assert.doesNotMatch(script,/\bINSERT INTO\b|\bDELETE FROM\b|\bUPDATE s2_|\bDROP TABLE\b|\bALTER TABLE\b/i);
});
