// Immutable 2026-10-16 ORIGINAL Cloudflare DEST importer receipt; this is not an
// independent post-writer Cloudflare SELECT or historical PIT/Frozen admission.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source="system2/migration/evidence/S2_DATA_ISSUE1068_DEST_A1_PHYSICAL_COPY_PARTIAL_20261016_V0_1.json";
const raw=JSON.parse(readFileSync(source,"utf8"));
const equal=(got,want,label)=>{if(got!==want)throw Error("ORIGINAL_OCT16_"+label)};
function verify(e){
 const a=e?.originalAuthority,g=e?.originalGuardEvidence,x=e?.originalImporterStdout,s=e?.scopeAssessment,p=e?.pendingIndependentReadback;
 equal(e?.schemaVersion,"S2_DATA_ISSUE1068_20261016_ORIGINAL_DEST_RAW_COPY_PARTIAL_V0_1","SCHEMA");
 equal(e?.status,"ORIGINAL_DEST_D1_PROVIDER_WRITER_POSTCOPY_PARITY_SCOPED_PASS__INDEPENDENT_SEPARATE_READBACK_PENDING","STATUS");
 equal(e?.classification,"DATA_LANE_RAW_ARCHIVE_ONLY_NO_PIT_NO_FROZEN_NO_SHADOW","CLASS");
 equal(a?.prNumber,1381,"PR");
 equal(a?.mergedMainCommit,"7d89110c9cde7954a70b360992e9fc59b68c1388","MAIN");
 equal(a?.ownerInstructionDateTaipei,"2026-10-16","OWNER_DAY");
 equal(a?.runId,38848657672,"RUN");
 equal(a?.jobId,116804771061,"JOB");
 equal(a?.runUrl,"https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38848657672","URL");
 equal(a?.runConclusion,"success","RUN_CONCLUSION");
 equal(a?.runEvent,"push","EVENT");
 equal(a?.runCreatedUtc,"2026-10-16T04:03:53Z","START");
 equal(a?.runCompletedUtc,"2026-10-16T04:08:57Z","END");
 equal(a?.originalArtifactId,12023953469,"ARTIFACT");
 equal(a?.originalArtifactZipBytes,1887,"ZIP_SIZE");
 equal(a?.originalGitHubProviderDigestSha256,"0ada1172a32c4de038b216102040abb26dc7246c554d9de9cbb6662ac1c6a0ee","PROVIDER_DIGEST");
 equal(a?.independentlyDownloadedZipSha256,null,"ZIP_NOT_DOWNLOADED");
 equal(a?.independentlyParsedReceipt,false,"RECEIPT_NOT_PARSED");
 equal(g?.quotaDayUtc,"2026-10-16","QUOTA_DAY");
 equal(g?.checkedSameWorkflowRunCount,10,"RUN_GUARD_COUNT");
 equal(g?.onlyOwnerWriterRunStartedToday,true,"ONE_WRITER");
 equal(g?.crossWriterInterlockAllowed,true,"MUTEX");
 equal(g?.otherSameDayWriterCount,0,"SAME_DAY_WRITERS");
 equal(g?.otherPriorDayBoundaryCount,0,"PREVIOUS_DAY_WRITERS");
 equal(g?.ownerBilledWriteMaxPerUtcDay,80000,"OWNER_CAP");
 equal(g?.additionalWriterSameDayAuthorized,false,"NO_DUPLICATE_WRITE");
 equal(x?.status,"A1_RAW_HISTORY_PARTIAL__RESUME_NEXT_UTC_DAY","PARTIAL");
 equal(x?.chargedRowsWrittenThisRun,71346,"BILLED_WRITES");
 equal(x?.rowsInsertedThisRun,11891,"NEW_BARS");
 equal(x?.sourceA1Rows,84688,"SOURCE");
 equal(x?.previousDestinationA1Rows,47420,"PRIOR_DEST");
 equal(x?.afterDestinationA1Rows,59311,"NEW_DEST");
 equal(x?.remainingSourceA1Rows,25377,"REMAINING");
 equal(x?.afterDestinationBatchRows,129,"BATCHES");
 equal(x?.error,null,"NO_ERROR");
 if(x.rowsInsertedThisRun!==x.afterDestinationA1Rows-x.previousDestinationA1Rows||
  x.remainingSourceA1Rows!==x.sourceA1Rows-x.afterDestinationA1Rows||
  x.chargedRowsWrittenThisRun>x?.sourceA1Rows||
  x.chargedRowsWrittenThisRun>g.ownerBilledWriteMaxPerUtcDay||
  x.afterDestinationA1Rows>=x.sourceA1Rows)throw Error("ORIGINAL_OCT16_ARITHMETIC_OR_LIMIT");
 for(const key of ["importerSourceLinkedFullRowPrecopyParityCompletedBeforeWrite",
 "importerSourceLinkedFullRowPostcopyParityCompletedBeforeSuccess",
 "importerManifestPreAndPostParityCompletedBeforeSuccess"])equal(s?.[key],true,"SCOPED_PARITY_"+key);
 for(const key of ["separateIndependentProviderD1SelectAfterWriter",
 "separateIndependentFullDestinationIdentityDigestAfterWriter",
 "historicalFirstKnownAtAvailableAtCertified",
 "ordinaryShareEffectiveDated61SessionPITCertified",
 "corporateActionHistoricalNoEventNegativeCertified",
 "frozenDecisionPhysicallyVerifiedInSeparatePostcopyReadback",
 "strategyPITCertified","shadowAuthorized","backtestAuthorized",
 "authorizedToRepeatSameUtcDayImport",
 "sourceAccountD1TouchedByOriginalWorkflow",
 "system1FormalOrProductionRuntimeModified"])equal(s?.[key],false,"NO_FALSE_PROMOTION_"+key);
 equal(s?.noD1WritesFromThisEvidenceFile,true,"EVIDENCE_NO_WRITE");
 equal(p?.prNumber,1383,"INDEPENDENT_PR");
 equal(p?.prHeadV8RegressionRun,38849296372,"INDEPENDENT_PR_CI_V8");
 equal(p?.prHeadCredentialCensusRun,38849296322,"INDEPENDENT_PR_CI_CENSUS");
 equal(p?.readbackExecuted,false,"INDEPENDENT_READBACK_PENDING");
 if(!String(p?.reason||"").includes("not physical independent"))throw Error("ORIGINAL_OCT16_READBACK_REASON");
 return true;
}
test("native GitHub original writer and 71346 billed / 11891 inserted / 59311 observed via writer, strict scoped receipt",()=>{
 assert.equal(verify(raw),true);
});
test("tamper negative: never promote writer's self-readback to independent evidence or PIT/Frozen",()=>{
 const cases=[
  ["writer Run",e=>e.originalAuthority.runId=1],
  ["writer Job",e=>e.originalAuthority.jobId=1],
  ["native artifact",e=>e.originalAuthority.originalArtifactId=1],
  ["native provider sha",e=>e.originalAuthority.originalGitHubProviderDigestSha256="0".repeat(64)],
  ["fabricated original parsed",e=>e.originalAuthority.independentlyParsedReceipt=true],
  ["fabricated independent bytes",e=>e.originalAuthority.independentlyDownloadedZipSha256="0".repeat(64)],
  ["writer UTC day",e=>e.originalGuardEvidence.quotaDayUtc="2026-10-15"],
  ["unbounded writes",e=>e.originalGuardEvidence.ownerBilledWriteMaxPerUtcDay=999999],
  ["missing mutex",e=>e.originalGuardEvidence.crossWriterInterlockAllowed=false],
  ["changed billed",e=>e.originalImporterStdout.chargedRowsWrittenThisRun=80001],
  ["changed inserted",e=>e.originalImporterStdout.rowsInsertedThisRun=11892],
  ["changed postcount",e=>e.originalImporterStdout.afterDestinationA1Rows=84688],
  ["changed remaining",e=>e.originalImporterStdout.remainingSourceA1Rows=0],
  ["reported importer error",e=>e.originalImporterStdout.error="unexpected"],
  ["falsified pre-copy parity",e=>e.scopeAssessment.importerSourceLinkedFullRowPrecopyParityCompletedBeforeWrite=false],
  ["falsified post-copy parity",e=>e.scopeAssessment.importerSourceLinkedFullRowPostcopyParityCompletedBeforeSuccess=false],
  ["fake independent SELECT",e=>e.scopeAssessment.separateIndependentProviderD1SelectAfterWriter=true],
  ["fake full digest",e=>e.scopeAssessment.separateIndependentFullDestinationIdentityDigestAfterWriter=true],
  ["fake known-at",e=>e.scopeAssessment.historicalFirstKnownAtAvailableAtCertified=true],
  ["fake CFI vintage",e=>e.scopeAssessment.ordinaryShareEffectiveDated61SessionPITCertified=true],
  ["fake CA completeness",e=>e.scopeAssessment.corporateActionHistoricalNoEventNegativeCertified=true],
  ["fake frozen",e=>e.scopeAssessment.frozenDecisionPhysicallyVerifiedInSeparatePostcopyReadback=true],
  ["fake strategy PIT",e=>e.scopeAssessment.strategyPITCertified=true],
  ["fake Shadow",e=>e.scopeAssessment.shadowAuthorized=true],
  ["unsafe today repeat",e=>e.scopeAssessment.authorizedToRepeatSameUtcDayImport=true],
  ["wrong readback status",e=>e.pendingIndependentReadback.readbackExecuted=true]
 ];
 for(const [label,mutate] of cases){const e=structuredClone(raw);mutate(e);assert.throws(()=>verify(e),undefined,label)}
});
