import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {gzipSync} from "node:zlib";
import {inspectCompressedSemanticBody,protectedRealSource} from "../migration/issue1236_m07_source_semantic_gzip_schema_pit_diagnostic_v0_1.mjs";
const receipt=JSON.parse(readFileSync("research/d08_twse_official_universe_source_receipt_20261007_v0_2.json","utf8"));
assert.equal(receipt.registry.membershipCount,1101);
const originalHash=receipt.registry.semanticRegistryHash;
const compressed=gzipSync(Buffer.from(JSON.stringify({
 schemaVersion:"TEST_SEMANTIC_V0",registryId:"fixed synthetic",
 registry:{memberships:Array.from({length:1101},()=>({market:"TEST"})),
 semanticRegistryHash:originalHash,availableAt:"2026-10-07T00:00:00Z",
 firstKnownAt:"not-a-datetime",memberCount:1101},
 observedAt:"2026-10-07T01:00:00+08:00",
 payloadRawPrivateField:"DO_NOT_EXPOSE_ME",
 symbol:"9999",fullRawObjectKey:"research/d08/private-source/pin"
})));
const got=inspectCompressedSemanticBody(compressed,{sourceReceipt:receipt});
assert.equal(got.membershipArrayPresent,true);
assert.equal(got.membershipEntriesObserved,1101);
assert.equal(got.membershipCountEqualsOriginalSourceReceipt,true);
assert.equal(got.payloadSemanticRegistryHashEqualsOriginalSourceReceipt,true);
assert.equal(got.sourceClockFieldShapeEvidence.firstKnownAt.present,true);
assert.equal(got.sourceClockFieldShapeEvidence.firstKnownAt.isoTimestampShapeValid,false);
assert.equal(got.sourceClockFieldShapeEvidence.availableAt.isoTimestampShapeValid,true);
assert.equal(got.independentPublicationClockEstablished,false);
assert.equal(got.actualOfficialFirstKnownAtIndependentlyCertified,false);
assert.equal(got.securitiesOrMembersExposedInReceipt,false);
assert.equal(JSON.stringify(got).includes("9999"),false);
assert.equal(JSON.stringify(got).includes("DO_NOT_EXPOSE_ME"),false);
assert.equal(JSON.stringify(got).includes("private-source"),false);
const noMembers=inspectCompressedSemanticBody(gzipSync(Buffer.from(JSON.stringify({
 schemaVersion:"OBSERVATION_ONLY",registry:{memberCount:1101,firstKnownAt:"2026-10-07T01:00:00Z",
 semanticRegistryHash:"0".repeat(64)}}))),{sourceReceipt:receipt});
assert.equal(noMembers.membershipArrayPresent,false);
assert.equal(noMembers.membershipCountEqualsOriginalSourceReceipt,null);
assert.equal(noMembers.payloadSemanticRegistryHashEqualsOriginalSourceReceipt,false);
assert.equal(noMembers.actualOfficialFirstKnownAtIndependentlyCertified,false);
assert.throws(()=>inspectCompressedSemanticBody(Buffer.alloc(20000),{sourceReceipt:receipt}),
 /M07_SEMANTIC_PIT_COMPRESSED_CAP/);
assert.throws(()=>inspectCompressedSemanticBody(Buffer.from("not gzip"),{sourceReceipt:receipt}),
 /M07_SEMANTIC_PIT_INVALID_GZIP_OR_INFLATE_LIMIT/);
assert.throws(()=>inspectCompressedSemanticBody(gzipSync(Buffer.from("[1,2]")),{sourceReceipt:receipt}),
 /M07_SEMANTIC_PIT_SEMANTIC_ROOT_NOT_OBJECT/);
assert.throws(()=>inspectCompressedSemanticBody(gzipSync(Buffer.from("not json")),{sourceReceipt:receipt}),
 /M07_SEMANTIC_PIT_GZIP_BODY_JSON_INVALID/);
assert.throws(()=>inspectCompressedSemanticBody(gzipSync(Buffer.from(JSON.stringify({x:1}))),
 {sourceReceipt:{...receipt,registry:{...receipt.registry,membershipCount:999}}}),
 /M07_SEMANTIC_PIT_PINNED_RESEARCH_RECEIPT_INVALID/);
const bomb=gzipSync(Buffer.alloc(9*1024*1024,0x20));
assert.throws(()=>inspectCompressedSemanticBody(bomb,{sourceReceipt:receipt}),
 /M07_SEMANTIC_PIT_INVALID_GZIP_OR_INFLATE_LIMIT/);
await assert.rejects(()=>protectedRealSource({
 accountId:"a".repeat(32),accessKeyId:"fake",secretAccessKey:"fake",
 bucketName:"other",fetchImpl:async()=>{throw Error("UNAUTHORIZED_NETWORK")}
}),/M07_SEMANTIC_PIT_SOURCE_ACCOUNT_BUCKET_MISMATCH/);
const src=readFileSync("system2/migration/issue1236_m07_source_semantic_gzip_schema_pit_diagnostic_v0_1.mjs","utf8");
const workflow=readFileSync(".github/workflows/system2-m07-source-semantic-gzip-pit-diagnostic.yml","utf8");
assert.match(src,/const COMPRESSED_BYTES=10556, MAX_COMPRESSED_BYTES=16384, MAX_INFLATED_BYTES=8388608/);
assert.match(src,/KNOWN_BYTE_SHA256="b1758c1deb3097a6b16356ee61708f2b002a8ed23a9797cb43a54e5828bf537e"/);
assert.match(src,/retryAttempts:1,retryDelayMs:0/);
assert.match(src,/originalSourceR2ListCalls:originals.sourceR2ListCalls/);
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/run-id: 38527825185/);
assert.doesNotMatch(workflow,/S2_SCHEMA_DEST_D1_WRITE_TOKEN|SYSTEM2_CLOUDFLARE_API_TOKEN/);
assert.doesNotMatch(src,/putIfAbsent|INSERT INTO|method:"PUT"|method:"POST"|method:"DELETE"/);
console.log("M07 semantic compressed 10KB body, 8MiB inflation cap, source time shapes UNKNOWN, no private member leakage PASS");
