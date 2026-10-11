import test from 'node:test';
import assert from 'node:assert/strict';
import {assessD1ExportDownloadReceiptV0_1 as audit} from '../migration/d1_export_download_receipt_v0_1.mjs';
const sha='f'.repeat(64);
const make=()=>({
 request:{databaseName:'system2-research',output_format:'polling',dumpOptions:{},
    scopeSourceSystem2D1Only:true,originalAppliedSchemaPhysicalReadback:true,
    virtualTableInventoryPhysicalReadback:true,virtualTableCount:0},
 response:{success:true,type:'export',status:'complete',at_bookmark:'bookmark-123',
    result:{filename:'backup.sql',signed_url:'https://example.invalid/backup.sql?signature=secret'}},
 download:{exportCompletedAtUtc:'2026-10-11T08:00:00Z',downloadCompletedAtUtc:'2026-10-11T08:20:00Z',
    originalSqlBytesReceived:true,sourceSignedUrlKeptPrivate:true,privateUrlNotPersistedToArtifacts:true,
    rawSqlNotLogged:true,immutableOfflineCopyStored:true,originalSqlByteLength:1024,
    originalSqlSha256:sha,storedSqlSha256:sha,
    exact64BitNumbersLosslessOrAbsentVerified:true,independentOfflineRestoreSchemaAndRowsVerified:true},
});
function rejects(change,code){
 const x=make();change(x);const r=audit(x);
 assert.equal(r.state,'EVIDENCE_BLOCKED');assert(r.blockers.includes(code),JSON.stringify(r));
 assert.equal(r.permissionToImport,false);assert.equal(r.permissionToExport,false);
}
test('absent original evidence fails closed',()=>{
 const r=audit();assert.equal(r.state,'EVIDENCE_BLOCKED');assert.equal(r.permissionToImport,false);
});
test('fixture-complete response is review-only; never logs signed URL or claims Cloudflare export',()=>{
 const x=make(),r=audit(x);assert.equal(r.state,'OFFLINE_DOWNLOAD_REVIEW_ONLY');
 assert.equal(r.downloadedByThisCode,false);assert.equal(r.realSourceBackupAccepted,false);
 assert(!JSON.stringify(r).includes('signature'));assert(!JSON.stringify(r).includes('bookmark-123'));
});
test('source D1 identity cannot collide with unrelated source',()=>{
 rejects(x=>x.request.databaseName='V7_DB','FULL_SOURCE_D1_SQL_EXPORT_REQUEST_UNVERIFIED');
});
test('data-only export cannot serve as full independent original backup',()=>{
 rejects(x=>x.request.dumpOptions.no_schema=true,'FULL_SOURCE_D1_SQL_EXPORT_REQUEST_UNVERIFIED');
});
test('schema-only export cannot serve as full backup',()=>{
 rejects(x=>x.request.dumpOptions.no_data=true,'FULL_SOURCE_D1_SQL_EXPORT_REQUEST_UNVERIFIED');
});
test('single filtered table is not all-source backup',()=>{
 rejects(x=>x.request.dumpOptions.tables=['s2_decisions'],'FULL_SOURCE_D1_SQL_EXPORT_REQUEST_UNVERIFIED');
});
test('virtual table FTS export requires a separate reviewed path',()=>{
 rejects(x=>x.request.virtualTableCount=1,'PHYSICAL_SOURCE_VIRTUAL_TABLE_EXPORT_COMPATIBILITY_UNVERIFIED');
});
test('virtual-table physical census cannot be inferred from repository SQL',()=>{
 rejects(x=>x.request.virtualTableInventoryPhysicalReadback=false,'PHYSICAL_SOURCE_VIRTUAL_TABLE_EXPORT_COMPATIBILITY_UNVERIFIED');
});
test('in-progress export bookmark is not a completed backup',()=>{
 rejects(x=>x.response.status=undefined,'D1_EXPORT_NOT_CONFIRMED_COMPLETE');
});
test('Cloudflare error state cannot be promoted',()=>{
 rejects(x=>{x.response.status='error';x.response.error='failure'},'D1_EXPORT_NOT_CONFIRMED_COMPLETE');
});
test('missing complete-export signed URL is blocked',()=>{
 rejects(x=>x.response.result.signed_url='', 'SIGNED_SOURCE_SQL_DOWNLOAD_METADATA_UNVERIFIED');
});
test('unsigned or HTTP URL not accepted',()=>{
 rejects(x=>x.response.result.signed_url='http://example.invalid/backup.sql?sig=1','SIGNED_SOURCE_SQL_DOWNLOAD_METADATA_UNVERIFIED');
});
test('downloaded after signed URL one-hour window blocked',()=>{
 rejects(x=>x.download.downloadCompletedAtUtc='2026-10-11T09:00:00Z','SIGNED_URL_ONE_HOUR_DOWNLOAD_WINDOW_UNVERIFIED');
});
test('invalid download chronology blocked',()=>{
 rejects(x=>x.download.downloadCompletedAtUtc='2026-10-11T07:59:59Z','SIGNED_URL_ONE_HOUR_DOWNLOAD_WINDOW_UNVERIFIED');
});
test('wrong original/stored hash blocked',()=>{
 rejects(x=>x.download.storedSqlSha256='a'.repeat(64),'ORIGINAL_DOWNLOADED_SQL_BYTES_AND_HASH_NOT_PRESERVED');
});
test('signed URL must not be persisted in ordinary logs or artifacts',()=>{
 rejects(x=>x.download.privateUrlNotPersistedToArtifacts=false,'ORIGINAL_DOWNLOADED_SQL_BYTES_AND_HASH_NOT_PRESERVED');
});
test('64-bit numeric precision risk checked',()=>{
 rejects(x=>x.download.exact64BitNumbersLosslessOrAbsentVerified=false,'SQL_INT64_JAVASCRIPT_PRECISION_RISK_UNREVIEWED');
});
test('offline restore required',()=>{
 rejects(x=>x.download.independentOfflineRestoreSchemaAndRowsVerified=false,'OFFLINE_RESTORE_SCHEMA_ROWS_NOT_VERIFIED');
});
