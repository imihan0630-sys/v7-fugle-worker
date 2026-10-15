// Offline metadata firewall. Does not replace independently rehashing ORIGINAL
// GitHub Artifact bytes or separately executing a destination-only SQL readback.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../migration/evidence');
const path=resolve(root,'S2_DATA_ISSUE1068_ORIGINAL_ZIP_BYTES_AND_PRODUCER_PARITY_20261015_V0_1.json');
const record=JSON.parse(readFileSync(path,'utf8'));
const digest=/^[a-f0-9]{64}$/;
function verify(x){
 assert.equal(x.schemaVersion,'S2_DATA_ORIGINAL_ARTIFACT_ZIP_REHASH_V0_1');
 assert.equal(x.status,'ORIGINAL_GITHUB_ARTIFACT_BYTE_REHASH_PASS_AUDIT_PENDING');
 assert.equal(x.originalRunId,38683991222);
 assert.equal(x.originalJobId,116254575761);
 assert.equal(x.originalArtifactId,11949362399);
 assert.equal(x.archiveSizeBytes,1889);
 assert.match(x.originalArchiveSha256,digest);
 assert.equal(x.originalArchiveSha256,'7658d6e4b4be903ae4d889f6c3a0c745f3aad3c3a1135a71058dc799f08d9e61');
 assert.equal(x.locallyRecomputedArchiveSha256,x.originalArchiveSha256);
 assert.match(x.originalCopyReceiptSha256,digest);
 assert.match(x.originalGuardReceiptSha256,digest);
 assert.notEqual(x.originalCopyReceiptSha256,x.originalGuardReceiptSha256);
 assert.match(x.afterSourceParityDigest,digest);
 assert.equal(x.originalSourceBars,84688);
 assert.equal(x.importerAfterBarRows,47420);
 assert.ok(x.importerAfterBarRows>0 && x.importerAfterBarRows<x.originalSourceBars);
 assert.equal(x.sourcePITAccepted,false);
 assert.equal(x.destinationIndependentPhysicalAuditAccepted,false);
 assert.equal(x.newCloudflareCalls,0);
 assert.equal(x.ownerApprovalToRepeatSameDayImport,false);
 assert.match(x.reason,/not independent destination readback/i);
 return true;
}
assert.ok(verify(record));
const cases=[
 ['fabricated digest',d=>{d.locallyRecomputedArchiveSha256='f'.repeat(64)}],
 ['fake zip digest',d=>{d.originalArchiveSha256='f'.repeat(64)}],
 ['wrong run',d=>{d.originalRunId=1}],
 ['wrong job',d=>{d.originalJobId=1}],
 ['wrong artifact',d=>{d.originalArtifactId=1}],
 ['wrong bytes',d=>{d.archiveSizeBytes=1}],
 ['wrong row denominator',d=>{d.originalSourceBars=1}],
 ['wrong imported count',d=>{d.importerAfterBarRows=0}],
 ['PIT promotion',d=>{d.sourcePITAccepted=true}],
 ['premature independent audit',d=>{d.destinationIndependentPhysicalAuditAccepted=true}],
 ['extra provider calls',d=>{d.newCloudflareCalls=1}],
 ['same-day writer promotion',d=>{d.ownerApprovalToRepeatSameDayImport=true}],
 ['malformed SHA',d=>{d.afterSourceParityDigest='unknown'}],
 ['missing warning',d=>{d.reason='accepted'}]
];
for(const [label,edit] of cases){
 const copy=structuredClone(record);edit(copy);
 assert.throws(()=>verify(copy),undefined,`${label} must reject`);
}
console.log(`Issue1068 Oct15 original ZIP byte-proof metadata: 1 positive + ${cases.length} fail-closed counterexamples PASS; not independent SQL audit`);
