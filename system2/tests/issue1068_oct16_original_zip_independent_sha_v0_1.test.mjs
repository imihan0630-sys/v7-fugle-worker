import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const p="system2/migration/evidence/S2_DATA_ISSUE1068_ORIGINAL_DEST_WRITER_ZIP_INDEPENDENT_REHASH_20261016_V0_1.json";
const original=JSON.parse(readFileSync(p,"utf8"));
const sha=x=>typeof x==="string"&&/^[0-9a-f]{64}$/.test(x);
function check(r){
 const s=r?.source,a=r?.innerOriginalSanitized,g=r?.innerOriginalInterlock,v=r?.acceptance,b=r?.independentReadbackBlockingReference;
 assert.equal(r?.schemaVersion,"S2_DATA_ISSUE1068_OCT16_ORIGINAL_NATIVE_PROVIDER_ZIP_INDEPENDENT_SHA_V0_1");
 assert.equal(r?.status,"INDEPENDENT_ORIGINAL_NATIVE_ZIP_AND_BOTH_INNER_JSON_SHA_MATCH__WRITER_SELF_PARITY_ONLY__SEPARATE_DEST_D1_SELECT_PENDING");
 assert.equal(r?.classification,"SOURCE_ARCHIVE_MIGRATION_SCOPED_EVIDENCE_ONLY_NO_PIT_NO_FROZEN_NO_SHADOW");
 assert.equal(s?.originalImportRunId,38848657672);
 assert.equal(s?.originalImportJobId,116804771061);
 assert.equal(s?.originalProviderArtifactId,12023953469);
 assert.equal(s?.originalProviderArtifactName,"s2-owner-waiver-original-d1-raw-copy-38848657672-1");
 assert.equal(s?.originalProviderZipBytes,1887);
 const expectedZip="0ada1172a32c4de038b216102040abb26dc7246c554d9de9cbb6662ac1c6a0ee";
 assert.equal(s?.originalProviderPublishedZipSha256,expectedZip);
 assert.equal(s?.independentlyDownloadedAndRehashedZipSha256,expectedZip);
 assert.equal(s?.originalZipIndependentlyUnpacked,true);
 assert.equal(s?.originalZipFileCount,2);
 assert.equal(s?.originalZipContainsEncryptedHistoricalRows,false);
 assert.equal(a?.relativeFilename,"s2-owner-override-raw-copy/sanitized-copy-receipt.json");
 assert.equal(a?.jsonBytes,2453);
 assert.equal(a?.independentlyRecomputedJsonSha256,"4473bee28a7db4a80fc933e476ee74c3e4b74bd575743d3f1afd89ef67efb6a8");
 assert.equal(a?.jsonIndependentlyParsed,true);
 assert.equal(a?.schemaVersion,"S2_OWNER_OVERRIDE_DEST_RAW_COPY_V0_1");
 assert.equal(a?.status,"A1_RAW_HISTORY_PARTIAL__RESUME_NEXT_UTC_DAY");
 assert.equal(a?.phase,"DEST_RAW_A1_COPY_VERIFIED");
 assert.equal(a?.originalDateUtc,"2026-10-16");
 for(const [k,val] of Object.entries({
 previousPhysicalDestA1Bars:47420,newPhysicalDestA1BarsFromWriterSelfSelect:59311,
 addedRowsReportedByWriter:11891,sourceExpectedA1Bars:84688,remainingA1Bars:25377,
 batchManifestBefore:129,batchManifestAfter:129,billedRowsWrittenThisRun:71346,
 ownerOperationalBilledWriteCap:80000,originalCloudflareAccountFreeTierDailyCapReported:100000,
 precopySourceLinkedBarsChecked:47420,precopyBoundedReadPages:119,
 postcopySourceLinkedBarsChecked:59311,postcopyBoundedReadPages:149,
 manifestRowsPostcopyChecked:129,sourceDecisionsPriorValue:0
 })) assert.equal(a?.[k],val,k);
 assert.equal(a?.precopySourceLinkedDigest,"d56b47494a8bc36b58e610ec12b58adde9ddfb5de5e95b616f716f41da1fb21d");
 assert.equal(a?.postcopySourceLinkedDigest,"a4a5f3057f3b4ef9f7a0a636c90ccca6d1b9282f4c53f74b6fabd2a88153f234");
 assert.ok(sha(a.precopySourceLinkedDigest)&&sha(a.postcopySourceLinkedDigest));
 assert.equal(a?.newPhysicalDestA1BarsFromWriterSelfSelect-a?.previousPhysicalDestA1Bars,a?.addedRowsReportedByWriter);
 assert.equal(a?.sourceExpectedA1Bars-a?.newPhysicalDestA1BarsFromWriterSelfSelect,a?.remainingA1Bars);
 assert.equal(a?.postcopySourceLinkedBarsChecked,a?.newPhysicalDestA1BarsFromWriterSelfSelect);
 assert.ok(a?.billedRowsWrittenThisRun<=a?.ownerOperationalBilledWriteCap);
 assert.equal(a?.completed,false);
 assert.equal(a?.canPromotePIT,false);
 for(const k of ["sourceDataMutations","v8Mutations","workerOrCronActivations","paidResources"])assert.equal(a?.[k],0,k);
 assert.equal(a?.completedAtUtc,"2026-10-16T04:08:53.196Z");
 assert.equal(g?.relativeFilename,"s2-dest-d1-writer-day-interlock/receipt.json");
 assert.equal(g?.jsonBytes,1090);
 assert.equal(g?.independentlyRecomputedJsonSha256,"a83a567569c9e0045262b8fdebe3c5c3075c502c22718017a7932d943ada685e");
 assert.equal(g?.jsonIndependentlyParsed,true);
 assert.equal(g?.contract,"S2_DEST_D1_CROSS_WORKFLOW_UTC_DAY_FAIL_CLOSED_V0_1");
 assert.equal(g?.writerId,"RAW_COPY");
 assert.equal(g?.quotaDayUtc,"2026-10-16");
 assert.equal(g?.runId,s?.originalImportRunId);
 assert.equal(g?.inspectedGithubOriginal,true);
 assert.equal(g?.providerQueried,true);
 assert.equal(g?.allowListedWriterCount,4);
 assert.equal(g?.sameDayOtherRunCount,0);
 assert.equal(g?.priorBoundaryOtherRunCount,0);
 assert.equal(g?.allowed,true);
 assert.deepEqual(g?.reasons,[]);
 assert.equal(g?.atomicCloudflareLedgerProven,false);
 assert.equal(g?.otherUnregisteredDestinationWritersNotCovered,true);
 assert.equal(g?.checkedAtUtc,"2026-10-16T04:04:05.113Z");
 assert.equal(g?.cloudflareCallsBeforeWriter,0);
 for(const k of [
 "nativeOriginalProviderZipDigestMatchesIndependentlyDownloadedBytes",
 "bothOriginalInnerJsonDigestsIndependentlyComputed",
 "bothOriginalInnerJsonSuccessfullyParsed",
 "crossArtifactSourceRunIdAndUtcDayMatched",
 "allImportedBarsReportedSourceLinkedIdentityParityInWriterReceipt"
 ])assert.equal(v?.[k],true,k);
 for(const k of [
 "standalonePostCopyCloudflareD1CountSelectActuallyExecuted",
 "standalonePostCopyCloudflareD1FullSourceHashDigestActuallyExecuted",
 "historicalFirstKnownAtOrAvailableAtPassed",
 "effectiveDatedOrdinaryEquityHistoricalCFIPassed",
 "corporateActionCompleteHistoricRevisionAndNoEventNegativePassed",
 "formalPITPassed","frozenSnapshotPassed","shadowTradingAuthorized",
 "repeatSameUtcDayDestWriterAuthorized","system1FormalOrProductionRuntimeModified"
 ])assert.equal(v?.[k],false,k);
 assert.equal(b?.prNumber,1383);
 assert.equal(b?.status,"OPEN_AT_ARTIFACT_VERIFICATION");
 return true;
}
test("Oct16 original 1887-byte GH ZIP and both original inner JSONs independently rehashed; source-linked 59311 source-bar receipt, scoped only",()=>assert.equal(check(original),true));
test("independent real-artifact SHA and no false formal/independent promotion: mutation negatives",()=>{
 const cases=[
  ["ZIP official SHA",r=>r.source.originalProviderPublishedZipSha256="a".repeat(64)],
  ["ZIP independent SHA",r=>r.source.independentlyDownloadedAndRehashedZipSha256="b".repeat(64)],
  ["ZIP bytes",r=>r.source.originalProviderZipBytes=1888],
  ["ZIP files",r=>r.source.originalZipFileCount=3],
  ["false original raw export",r=>r.source.originalZipContainsEncryptedHistoricalRows=true],
  ["copy inner SHA",r=>r.innerOriginalSanitized.independentlyRecomputedJsonSha256="0".repeat(64)],
  ["copy inner bytes",r=>r.innerOriginalSanitized.jsonBytes=2452],
  ["interlock SHA",r=>r.innerOriginalInterlock.independentlyRecomputedJsonSha256="0".repeat(64)],
  ["interlock JSON bytes",r=>r.innerOriginalInterlock.jsonBytes=1091],
  ["wrong original run",r=>r.source.originalImportRunId=38848657673],
  ["wrong original job",r=>r.source.originalImportJobId=116804771060],
  ["wrong original Artifact",r=>r.source.originalProviderArtifactId=12023953468],
  ["claim complete",r=>r.innerOriginalSanitized.completed=true],
  ["fake new bars",r=>r.innerOriginalSanitized.newPhysicalDestA1BarsFromWriterSelfSelect=84688],
  ["fake import count",r=>r.innerOriginalSanitized.addedRowsReportedByWriter=25377],
  ["fake remaining",r=>r.innerOriginalSanitized.remainingA1Bars=0],
  ["fake postcopy hash",r=>r.innerOriginalSanitized.postcopySourceLinkedDigest="1".repeat(64)],
  ["fake before hash",r=>r.innerOriginalSanitized.precopySourceLinkedDigest="1".repeat(64)],
  ["excess quota",r=>r.innerOriginalSanitized.billedRowsWrittenThisRun=100000],
  ["wrong owner operational cap",r=>r.innerOriginalSanitized.ownerOperationalBilledWriteCap=100000],
  ["wrong market quota day",r=>r.innerOriginalInterlock.quotaDayUtc="2026-10-15"],
  ["false interlock",r=>r.innerOriginalInterlock.allowed=false],
  ["false atomic guarantee",r=>r.innerOriginalInterlock.atomicCloudflareLedgerProven=true],
  ["false registered exclusive coverage",r=>r.innerOriginalInterlock.otherUnregisteredDestinationWritersNotCovered=false],
  ["false standalone count readback",r=>r.acceptance.standalonePostCopyCloudflareD1CountSelectActuallyExecuted=true],
  ["false standalone digest readback",r=>r.acceptance.standalonePostCopyCloudflareD1FullSourceHashDigestActuallyExecuted=true],
  ["false formal PIT",r=>r.acceptance.formalPITPassed=true],
  ["false CFI historical",r=>r.acceptance.effectiveDatedOrdinaryEquityHistoricalCFIPassed=true],
  ["false CA complete",r=>r.acceptance.corporateActionCompleteHistoricRevisionAndNoEventNegativePassed=true],
  ["false Frozen",r=>r.acceptance.frozenSnapshotPassed=true],
  ["false Shadow",r=>r.acceptance.shadowTradingAuthorized=true],
  ["false extra same-day writer",r=>r.acceptance.repeatSameUtcDayDestWriterAuthorized=true],
  ["false V8 permission",r=>r.acceptance.system1FormalOrProductionRuntimeModified=true]
 ];
 for(const [label,mutate] of cases){
   const r=structuredClone(original);mutate(r);
   assert.throws(()=>check(r),undefined,label);
 }
});
