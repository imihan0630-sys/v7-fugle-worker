import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const p="system2/migration/evidence/S2_DATA_ISSUE1068_OCT16_INDEPENDENT_DEST_A1_59311_FULL_IDENTITY_PHYSICAL_V0_1.json";
const origin=JSON.parse(readFileSync(p,"utf8"));
const SHA="a4a5f3057f3b4ef9f7a0a636c90ccca6d1b9282f4c53f74b6fabd2a88153f234";
const check=r=>{
 const w=r.originalWriter,c=r.firstIndependentPhysicalCount,i=r.independentFullIdentity,s=r.separateScheduleSafety;
 assert.equal(r.schemaVersion,"S2_DATA_ISSUE1068_OCT16_INDEPENDENT_DEST_D1_FULL_IDENTITY_PHYSICAL_V0_1");
 assert.equal(r.status,"INDEPENDENT_CLOUDFLARE_DEST_A1_59311_OF_59311_SOURCE_LINKED_IDENTITY_PASS__HISTORICAL_PIT_FROZEN_BLOCKED");
 assert.equal(r.classification,"DATA_LANE_INDEPENDENT_PHYSICAL_SOURCE_LINKED_IDENTITY_ONLY_NOT_FORMAL_AUDIT");
 assert.equal(w.runId,38848657672);assert.equal(w.originalArtifactId,12023953469);
 assert.equal(w.afterRows,59311);assert.equal(w.originalSourceRows,84688);
 assert.equal(w.remainingRows,25377);assert.equal(w.accountedBilledWriteRows,71346);
 assert.equal(w.sourceLinkedOriginalBarDigest,SHA);
 assert.equal(w.writerSameUtcDayNoSecondPermission,true);
 assert.equal(w.afterRows+w.remainingRows,w.originalSourceRows);
 assert.equal(c.runId,38861058678);assert.equal(c.jobId,116843201870);assert.equal(c.originalArtifactId,12028598651);
 assert.equal(c.originalNativeZipBytes,986);assert.equal(c.innerJsonBytes,1661);
 assert.equal(c.originalNativeZipSha256,"b17c13592925d0123b3ce87866f7aad4fdd6d29add06114bda61ec14b33f51bd");
 assert.equal(c.independentlyDownloadedZipSha256,c.originalNativeZipSha256);
 assert.equal(c.innerJsonSha256,"8a6b90adfda9687a6a0dd33c40ca6386da88631bb1f0a7391c5add3741678c85");
 assert.equal(c.destinationA1Rows,59311);assert.equal(c.destinationFrozenRows,0);
 assert.equal(c.providerAccountCurrentQuotaDay,"2026-10-16");
 assert.equal(c.providerGroupComplete,true);assert.equal(c.accountRowsWrittenLowerBound,71346);
 assert.equal(c.ownerCeiling,80000);assert.equal(c.ownerProjectedIncludingReserve,84476);
 assert.equal(c.anotherHighWriterPermitted,false);assert.equal(c.destinationD1Writes,0);
 assert.equal(i.runId,38861444267);assert.equal(i.jobId,116844411919);
 assert.equal(i.runUrl,"https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38861444267");
 assert.equal(i.runConclusion,"success");
 assert.equal(i.reconciledOriginalWriterRunId,w.runId);
 assert.equal(i.signedOriginalWriterArtifactId,w.originalArtifactId);
 assert.equal(i.targetOriginalRows,59311);assert.equal(i.targetOriginalManifestBatches,129);assert.equal(i.frozenDecisions,0);
 assert.equal(i.providerSelectQueries,151);
 assert.equal(i.providerRowsReadTotal,178191);
 assert.equal(i.providerRowsWrittenTotal,0);
 assert.equal(i.independentFullIdentityBarPages,149);
 assert.equal(i.independentFullIdentityBarRows,59311);
 assert.equal(i.independentSourceLinkedSha256,SHA);
 assert.equal(i.matchedOriginalProducerSourceLinkedDigest,true);
 assert.equal(i.originalArtifactIdentityDigestId,12029935045);
 assert.equal(i.originalArtifactIdentityDigestZipBytes,1266);
 assert.equal(i.githubOriginalNativeDigestZipSha256,"87754c85417327e249a1a9a222058e0e6aa708e509f3a0a3f909693cacaea006");
 assert.equal(i.independentNativeDigestZipSha256,i.githubOriginalNativeDigestZipSha256);
 assert.equal(i.originalInnerDigestJsonBytes,2389);
 assert.equal(i.independentInnerDigestJsonSha256,"cce1d770d663e000fa250d65ff0b3e112ba4a1e67d86cb3eea6a4d7c135d4e46");
 assert.equal(i.originalArtifactCountReadbackId,12029885129);
 assert.equal(i.originalArtifactCountZipBytes,576);
 assert.equal(i.githubOriginalCountNativeDigestZipSha256,"cb3dc28d23db22a3d9b89a4dc0180be50891af1a52b957e561f5064016715e46");
 assert.equal(i.independentCountNativeZipSha256,i.githubOriginalCountNativeDigestZipSha256);
 assert.equal(i.originalInnerCountJsonBytes,665);
 assert.equal(i.independentInnerCountJsonSha256,"2410ed03c446022ae11558608a755c68e5dc58bb374f09b7e0d625fb80115518");
 assert.equal(i.actualProviderCountReadbackA1Rows,59311);
 assert.equal(i.actualProviderCountReadbackBatchRows,129);
 assert.equal(i.actualProviderCountReadbackFrozenRows,0);
 for(const field of ["sourceD1Queries","sourceD1Writes","destinationD1Writes","originalCloudflareWorkerCronMutations"])assert.equal(i[field],0,field);
 for(const field of ["historicalFirstKnownAtPITCertified","rawPayloadByteSHAIndependentlyReplayed","fullMigrationCertified","auditLaneFormalSignoff","frozenCertified","r2Certified","qualifiedShadowOrBacktestAuthorized","sameUtcDayAdditionalWriterAuthorized","system1FormalChanged"])assert.equal(i[field],false,field);
 assert.equal(i.observedAtUtc,"2026-10-16T06:30:05.543Z");
 assert.equal(s.lateRunId,38852270275);assert.equal(s.actualUtcStart,"2026-10-16T04:45:37Z");
 assert.equal(s.desiredUtcStart,"2026-10-16T00:30:00Z");assert.equal(s.scheduleDelaySeconds,15337);
 assert.equal(s.nativeError,"S2_D1_GUARD_SAME_DAY_WRITER_ALREADY_STARTED");
 assert.equal(s.importedAnyRows,false);assert.equal(s.providerD1Queries,false);
 return true;
};
test("three original provider-native ZIPs, full source-linked identity 59311/59311, zero writes, formal not promoted",()=>assert.equal(check(origin),true));
test("fail closed on tampered original Cloudflare actual count/digest or false audit promotion",()=>{
 const bad=[
 ["wrong original writer",r=>r.originalWriter.runId=1],
 ["writer SHA replaced",r=>r.originalWriter.sourceLinkedOriginalBarDigest="0".repeat(64)],
 ["writer changed number",r=>r.originalWriter.afterRows=84688],
 ["fabricated remaining 0",r=>r.originalWriter.remainingRows=0],
 ["billed write exceeded",r=>r.originalWriter.accountedBilledWriteRows=90000],
 ["same-day repeat authorized",r=>r.originalWriter.writerSameUtcDayNoSecondPermission=false],
 ["count run",r=>r.firstIndependentPhysicalCount.runId=1],
 ["count native ZIP",r=>r.firstIndependentPhysicalCount.independentlyDownloadedZipSha256="0".repeat(64)],
 ["count inner JSON",r=>r.firstIndependentPhysicalCount.innerJsonSha256="0".repeat(64)],
 ["count wrong rows",r=>r.firstIndependentPhysicalCount.destinationA1Rows=59310],
 ["changed quota day",r=>r.firstIndependentPhysicalCount.providerAccountCurrentQuotaDay="2026-10-15"],
 ["incomplete provider quota",r=>r.firstIndependentPhysicalCount.providerGroupComplete=false],
 ["claim writer allowed",r=>r.firstIndependentPhysicalCount.anotherHighWriterPermitted=true],
 ["full digest wrong run",r=>r.independentFullIdentity.runId=1],
 ["digest wrong job",r=>r.independentFullIdentity.jobId=1],
 ["digest wrong original writer",r=>r.independentFullIdentity.reconciledOriginalWriterRunId=1],
 ["digest wrong artifact",r=>r.independentFullIdentity.originalArtifactIdentityDigestId=1],
 ["digest changed ZIP",r=>r.independentFullIdentity.independentNativeDigestZipSha256="0".repeat(64)],
 ["digest changed inner JSON",r=>r.independentFullIdentity.independentInnerDigestJsonSha256="0".repeat(64)],
 ["count recheck changed ZIP",r=>r.independentFullIdentity.independentCountNativeZipSha256="0".repeat(64)],
 ["count recheck changed inner",r=>r.independentFullIdentity.independentInnerCountJsonSha256="0".repeat(64)],
 ["changed independent rows",r=>r.independentFullIdentity.independentFullIdentityBarRows=59310],
 ["changed identity hash",r=>r.independentFullIdentity.independentSourceLinkedSha256="0".repeat(64)],
 ["fake matched hash",r=>r.independentFullIdentity.matchedOriginalProducerSourceLinkedDigest=false],
 ["missing pages",r=>r.independentFullIdentity.independentFullIdentityBarPages=148],
 ["provider write",r=>r.independentFullIdentity.providerRowsWrittenTotal=1],
 ["source D1 query",r=>r.independentFullIdentity.sourceD1Queries=1],
 ["fake historical PIT",r=>r.independentFullIdentity.historicalFirstKnownAtPITCertified=true],
 ["fake raw payload hash",r=>r.independentFullIdentity.rawPayloadByteSHAIndependentlyReplayed=true],
 ["fake full migration",r=>r.independentFullIdentity.fullMigrationCertified=true],
 ["fake audit lane",r=>r.independentFullIdentity.auditLaneFormalSignoff=true],
 ["fake frozen",r=>r.independentFullIdentity.frozenCertified=true],
 ["fake shadow",r=>r.independentFullIdentity.qualifiedShadowOrBacktestAuthorized=true],
 ["fake same-day write",r=>r.independentFullIdentity.sameUtcDayAdditionalWriterAuthorized=true],
 ["fake system1",r=>r.independentFullIdentity.system1FormalChanged=true],
 ["claim Cron importer",r=>r.separateScheduleSafety.importedAnyRows=true],
 ["changed Cron lateness",r=>r.separateScheduleSafety.scheduleDelaySeconds=0]
 ];
 for(const [name,mutate] of bad){const r=structuredClone(origin);mutate(r);assert.throws(()=>check(r),undefined,name)}
});
