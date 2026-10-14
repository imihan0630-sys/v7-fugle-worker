import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {verifySourceReceiptBytes} from "../migration/issue1236_m07_semantic_original_artifact_replay_v0_1.mjs";
const clocks=Object.fromEntries(["firstKnownAt","availableAt","publishedAt","observedAt","generatedAt","capturedAt"]
 .map(k=>[k,{present:false,isoTimestampShapeValid:false}]));
const a={
 schemaVersion:"S2_M07_SOURCE_SEMANTIC_ORIGINAL_GZIP_PAYLOAD_PIT_DIAGNOSTIC_V0_1",
 status:"SOURCE_R2_SEMANTIC_BODY_REHASH_AND_STRUCTURAL_PARSE__PIT_NOT_CERTIFIED",
 originalProtectedG3ExtraKeysRevalidated:498,originalD08WriterReceiptKeysRevalidated:154,
 originalSourceFullListDigestRevalidated:true,sourceR2OriginalListPages:27,
 originalR2BodyByteSHA256:"b1758c1deb3097a6b16356ee61708f2b002a8ed23a9797cb43a54e5828bf537e",
 originalR2BodySizeBytes:10556,bodyGzipInflatedBytes:446946,
 originalBodyShaHEADGETAndBytesMatched:true,
 membershipEntriesObserved:1101,independentArchivedRegistryMemberCount:1101,
 membershipCountEqualsOriginalSourceReceipt:true,
 payloadSemanticRegistryHashFieldPresent:true,
 payloadSemanticRegistryHashEqualsOriginalSourceReceipt:true,
 independentPublicationClockEstablished:false,
 actualOfficialFirstKnownAtIndependentlyCertified:false,
 historicalResearchPITAdmitted:false,independentAuditorApproved:false,
 sourceClockFieldShapeEvidence:clocks,sourceProvenanceFieldPresent:false,
 sourceR2HEADCalls:1,sourceR2GETBodyCalls:1,sourceR2BodyBytesDownloaded:10556,
 sourceR2Writes:0,sourceD1Queries:0,destinationD1Writes:0,destinationR2Calls:0,
 sourceOriginalWriterIdentityStillUnknown:true,
 archivedSourceD1ManifestByteShaJoinForSemantic:false
};
const verify=v=>verifySourceReceiptBytes(Buffer.from(JSON.stringify(v)),{requireOriginalSha:false});
assert.equal(verify(a).originalMemberships,1101);
assert.equal(verify(a).status,"REPRODUCED_ORIGINAL_GITHUB_SEMANTIC_PAYLOAD_SHA_AND_REGISTRY_EVIDENCE__PIT_REMAINS_BLOCKED");
assert.equal(verify(a).sourceProviderAPICallsFromReplay,0);
assert.equal(verify(a).officialPublicationPITCertified,false);
assert.throws(()=>verifySourceReceiptBytes(Buffer.from(JSON.stringify(a))),/ORIGINAL_GITHUB_ARTIFACT_BYTES_DRIFT/);
assert.throws(()=>verify({...a,membershipEntriesObserved:999}),/SOURCE_STRUCTURE_OR_SCOPE_DIFFERENCE/);
assert.throws(()=>verify({...a,independentAuditorApproved:true}),/SOURCE_STRUCTURE_OR_SCOPE_DIFFERENCE/);
assert.throws(()=>verify({...a,historicalResearchPITAdmitted:true}),/SOURCE_STRUCTURE_OR_SCOPE_DIFFERENCE/);
assert.throws(()=>verify({...a,sourceR2Writes:1}),/SOURCE_WRITER_OR_MUTATION_SCOPE_CHANGED/);
assert.throws(()=>verify({...a,sourceOriginalWriterIdentityStillUnknown:false}),/SOURCE_WRITER_OR_MUTATION_SCOPE_CHANGED/);
assert.throws(()=>verify({...a,sourceClockFieldShapeEvidence:{
 ...clocks,firstKnownAt:{present:true,isoTimestampShapeValid:true}
}}),/PIT_CLOCK_SOURCE_NOT_UNKNOWN/);
assert.throws(()=>verify({...a,sourceClockFieldShapeEvidence:{
 ...clocks,publishedAt:undefined
}}),/PIT_CLOCK_SOURCE_NOT_UNKNOWN/);
const wf=readFileSync(".github/workflows/system2-m07-semantic-original-artifact-replay.yml","utf8");
assert.match(wf,/run-id: 38654562224/);
assert.match(wf,/s2-m07-source-original-semantic-gzip-pit-38654562224-1/);
assert.doesNotMatch(wf,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_R2_SECRET_ACCESS_KEY|S2_SCHEMA_DEST_D1_WRITE_TOKEN/);
const src=readFileSync("system2/migration/issue1236_m07_semantic_original_artifact_replay_v0_1.mjs","utf8");
assert.doesNotMatch(src,/\bfetch\(|putIfAbsent|INSERT INTO|method:"PUT"|method:"POST"|method:"DELETE"/);
console.log("M07 independently recheck exact semantic producer Artifact SHA and PIT-negative evidence PASS");
