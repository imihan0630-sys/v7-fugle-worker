import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const evidence=JSON.parse(readFileSync(
 "system2/migration/evidence/S2_DATA_ISSUE1068_ORIGINAL_DEST_IDENTITY_SHA_PHYSICAL_20261015_V0_1.json","utf8"));
const sourceDigest="d56b47494a8bc36b58e610ec12b58adde9ddfb5de5e95b616f716f41da1fb21d";
function verify(x){
 assert.equal(x.schemaVersion,"S2_DATA_ISSUE1068_REAL_20261015_INDEPENDENT_IMPORTED_A1_SOURCE_LINKED_IDENTITY_DIGEST_V0_1");
 assert.equal(x.sourceOriginalProducer.runId,38683991222);
 assert.equal(x.actualPhysicalReadback.runId,38724324504);
 assert.equal(x.actualPhysicalReadback.jobId,116386310167);
 assert.equal(x.actualPhysicalReadback.conclusion,"success");
 assert.equal(x.actualPhysicalReadback.originalProviderTotalRowsWritten,0);
 assert.equal(x.actualPhysicalReadback.originalProviderTotalRowsRead,142518);
 assert.equal(x.actualPhysicalReadback.originalCloudflareSelectQueries,121);
 assert.equal(x.actualPhysicalReadback.identityDigestPageCount,119);
 assert.equal(x.actualPhysicalReadback.identityDigestObservedRows,47420);
 assert.equal(x.actualPhysicalReadback.actualDestinationBarRows,47420);
 assert.equal(x.actualPhysicalReadback.originalIngestBatchCount,129);
 assert.equal(x.actualPhysicalReadback.frozenDecisions,0);
 assert.equal(x.actualPhysicalReadback.independentlyComputedDestinationSha256,sourceDigest);
 assert.equal(x.sourceOriginalProducer.originalProducerSourceLinkedIdentitySha256,sourceDigest);
 assert.equal(x.actualPhysicalReadback.matchesOriginalSourceLinkedProducerDigest,true);
 assert.equal(x.actualPhysicalReadback.destinationD1Writes,0);
 assert.equal(x.actualPhysicalReadback.sourceD1Queries,0);
 assert.equal(x.nativeGithubArtifacts.length,2);
 for(const a of x.nativeGithubArtifacts){
  assert.match(a.githubOriginalZipSha256,/^[0-9a-f]{64}$/);
  assert.equal(a.githubOriginalZipSha256,a.independentDownloadedZipSha256);
  assert.match(a.independentlyComputedInnerSha256,/^[0-9a-f]{64}$/);
  assert.equal(a.originalInnerIndependentlyParsed,true);
 }
 assert.equal(x.limitsAndOpenAcceptance.sourceOriginalA1BarPayloadRawBytesIndependentlyRehashed,false);
 assert.equal(x.limitsAndOpenAcceptance.perBarHistoricalFirstKnownAtAndAvailableAtCertified,false);
 assert.equal(x.limitsAndOpenAcceptance.frozenHistoricalDecisionsCertified,false);
 assert.equal(x.limitsAndOpenAcceptance.formalIndependentAuditLaneSignedOff,false);
 assert.equal(x.limitsAndOpenAcceptance.historicalPITOrShadowOrBacktestAuthorized,false);
 assert.equal(x.limitsAndOpenAcceptance.completeG3G4AndCutoverAccepted,false);
 assert.equal(x.limitsAndOpenAcceptance.sameDayAdditionalImporterAuthorized,false);
 assert.equal(x.sourceToTargetProgress.remainingA1Bars,
  x.sourceToTargetProgress.sourceOriginalA1Bars-x.sourceToTargetProgress.realImportedA1Bars);
 assert.equal(x.sourceToTargetProgress.remainingA1Bars,37268);
 assert.equal(x.safety.thisEvidenceCommitD1Queries,0);
 return true;
}
test("trusted original native physical SHA replay evidence is scoped and intact",()=>assert.ok(verify(evidence)));
for(const [name,mutate] of [
 ["forged original-source SHA",x=>{x.sourceOriginalProducer.originalProducerSourceLinkedIdentitySha256="f".repeat(64)}],
 ["forged target SHA",x=>{x.actualPhysicalReadback.independentlyComputedDestinationSha256="f".repeat(64)}],
 ["missing bar",x=>{x.actualPhysicalReadback.identityDigestObservedRows--}],
 ["unqualified writer",x=>{x.actualPhysicalReadback.originalProviderTotalRowsWritten=1}],
 ["missing read metering",x=>{x.actualPhysicalReadback.originalProviderTotalRowsRead=null}],
 ["forged source account query",x=>{x.actualPhysicalReadback.sourceD1Queries=1}],
 ["faked PIT",x=>{x.limitsAndOpenAcceptance.perBarHistoricalFirstKnownAtAndAvailableAtCertified=true}],
 ["faked Frozen",x=>{x.limitsAndOpenAcceptance.frozenHistoricalDecisionsCertified=true}],
 ["faked audit signature",x=>{x.limitsAndOpenAcceptance.formalIndependentAuditLaneSignedOff=true}],
 ["faked G3G4 acceptance",x=>{x.limitsAndOpenAcceptance.completeG3G4AndCutoverAccepted=true}],
 ["faked extra writer authority",x=>{x.limitsAndOpenAcceptance.sameDayAdditionalImporterAuthorized=true}],
 ["tampered ZIP",x=>{x.nativeGithubArtifacts[0].independentDownloadedZipSha256="f".repeat(64)}]
]){
 test("negative evidence tampering rejects: "+name,()=>{
   const copy=structuredClone(evidence);mutate(copy);assert.throws(()=>verify(copy));
 });
}
