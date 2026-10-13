import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {buildSharedOfficialA1MarketManifestV0_1} from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {buildOfficialHistoricalA1UrlV0_1} from '../runtime/official_historical_a1_source_v0_1.mjs';
import {planSharedOfficialA1ArchiveDryRunV0_1} from '../scripts/plan_shared_official_a1_archive_dryrun_v0_1.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const observation='2026-10-13T07:00:00Z';
function sampleRaw(date){
 return Buffer.from(JSON.stringify({date:date.replaceAll('-',''),stat:'OK',
  tables:[{fields:['證券代號','證券名稱','成交股數','開盤價','最高價','最低價','收盤價'],
   data:[['2330','台積電','123,000','100','101','99','100']]}]}));
}
function makeManifest(raw,date){
 const first='2026-07-16',dates=[];
 for(let i=0;i<61;i++){
  const d=new Date(first+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
  dates.push(d.toISOString().slice(0,10));
 }
 return buildSharedOfficialA1MarketManifestV0_1({
  issuedAtUtc:'2026-10-13T12:10:00Z',
  sourceReceipt:{
   schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
   marketDate:dates.at(-1),receiptHash:'f'.repeat(64),
   calendar:{tradingDates:dates},state:'INCOMPLETE',
   receivedMarketDateCount:1,plannedMarketDateRequests:122,
   receipts:[{market:'TWSE',marketDate:date,
     sourceId:'A1_TWSE_MI_INDEX_HISTORICAL_DAILY',
     sourceUrl:buildOfficialHistoricalA1UrlV0_1('TWSE',date),
     originalRawResponseSha256:sha(raw),originalRawResponseBytes:raw.length,
     capturedAt:observation}]
  }
 });
}
async function withFiles(f){
 const dir=await mkdtemp(join(tmpdir(),'s2shared-dryrun-'));
 const date='2026-07-16',raw=sampleRaw(date);
 const filename='TWSE-'+date+'.json.gz';
 await writeFile(join(dir,filename),gzipSync(raw));
 const manifest=makeManifest(raw,date);
 try{await f({dir,date,raw,manifest,filename});}
 finally{await rm(dir,{recursive:true,force:true});}
}
test('real original gzip bytes, original SHA, date and PIT are not auto-promoted',async()=>{
 await withFiles(async({dir,manifest})=>{
  const result=await planSharedOfficialA1ArchiveDryRunV0_1({
   originalDirectory:dir,sourceManifest:manifest,
   nowUtc:'2026-10-13T12:20:00.000Z'
  });
  assert.equal(result.verifiedOriginalFiles,1);
  assert.equal(result.targetReleaseGroups.length,1);
  assert.equal(result.githubContentsWriteApproved,false);
  assert.equal(result.archivalAssetsPublished,0);
  assert.equal(result.accountD1Writes,0);
  assert.equal(result.independentPITCertified,false);
  assert.equal(result.publishRawSourceToCurrentPublicRepoPermitted,false);
  assert.equal(result.selectedCount,null);
  assert.equal(result.frozenWritten,false);
  assert.match(result.plannedSourceAssets[0].candidateReleaseAsset,/TWSE-2026-07-16--[a-f0-9]{64}\.json\.gz/);
 });
});
test('corrupted gzip body cannot pass content-addressed SHA verification',async()=>{
 await withFiles(async({dir,manifest,filename})=>{
  await writeFile(join(dir,filename),gzipSync(Buffer.from('{"date":"20260716"}')));
  await assert.rejects(()=>planSharedOfficialA1ArchiveDryRunV0_1({
   originalDirectory:dir,sourceManifest:manifest
  }),/RAW_BODY_SHA256_OR_LENGTH_MISMATCH/);
 });
});
test('a parsed incorrect source-reported date is refused even with newly matching hashes',async()=>{
 await withFiles(async({dir,manifest,filename})=>{
  const wrong=sampleRaw('2026-07-17');
  await writeFile(join(dir,filename),gzipSync(wrong));
  const {manifestSha256,...old}=manifest;
  const updated={...old,sourceBlobs:[{...manifest.sourceBlobs[0],
   originalSha256:sha(wrong),originalBytes:wrong.length}]};
  // Create an internally matching new source manifest to reach provider parser.
  const fresh={...updated,manifestSha256:sha(Buffer.from(JSON.stringify(updated)))};
  await assert.rejects(()=>planSharedOfficialA1ArchiveDryRunV0_1({
   originalDirectory:dir,sourceManifest:fresh
  }),/ORIGINAL_OFFICIAL_BAR_SEMANTICS_INVALID/);
 });
});
test('manifest tampering, path escape, file symlink and unexpected billing code fail closed',async()=>{
 await withFiles(async({dir,manifest})=>{
  const bad={...manifest,sourceMarketDatePairsValidated:99};
  await assert.rejects(()=>planSharedOfficialA1ArchiveDryRunV0_1({
   originalDirectory:dir,sourceManifest:bad
  }),/MANIFEST_HASH_MISMATCH/);
  const {readFileSync}=await import('node:fs');
  const src=readFileSync('system2/scripts/plan_shared_official_a1_archive_dryrun_v0_1.mjs','utf8');
  assert.doesNotMatch(src,/gh release create|github\.com\/repos\/.*\/releases\/.*POST/);
  assert.match(src,/githubContentsWriteApproved:false/);
 });
});
test('independently valid manifest cannot silently be used as formal decision',async()=>{
 await withFiles(async({dir,manifest})=>{
  const r=await planSharedOfficialA1ArchiveDryRunV0_1({
   originalDirectory:dir,sourceManifest:manifest
  });
  assert.equal(r.proposedStorage,'PRIVATE_GITHUB_IMMUTABLE_RELEASES_OR_PRIVATE_R2_PENDING_OWNER_PERMISSION_AND_SOURCE_RIGHTS');
  assert.equal(r.currentRepositoryKnownPublic,true);
  assert.equal(r.publishRawSourceToCurrentPublicRepoPermitted,false);
  assert.equal(r.sourcePublicationOrAutomationRightsVerified,false);
  assert.equal(r.approvedPrivateDestinationAvailable,false);
  assert.equal(r.projectedFiveYearOriginalCompressedBytes,
   r.estimatedNewOriginalCompressedBytesPerYear*5);
 });
});
