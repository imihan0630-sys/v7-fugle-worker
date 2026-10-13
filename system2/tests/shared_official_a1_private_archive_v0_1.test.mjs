import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {gzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildSharedOfficialA1MarketManifestV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
import {publishSharedOfficialA1PrivateArchiveV0_1 as publish}
 from '../scripts/publish_shared_official_a1_private_archive_v0_1.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const observedAt='2026-10-13T06:00:00Z',marketDate='2026-10-13',date='2026-07-16';
function raw(){
 return Buffer.from(JSON.stringify({date:date.replaceAll('-',''),stat:'OK',
  tables:[{fields:['證券代號','證券名稱','成交股數','開盤價','最高價','最低價','收盤價'],
   data:[['2330','台積電','123,000','100','101','99','100']]}]}));
}
async function fixture(){
 const source=await mkdtemp(join(tmpdir(),'s2-private-archive-source-'));
 const archive=await mkdtemp(join(tmpdir(),'s2-private-archive-target-'));
 const body=raw(),packed=gzipSync(body);
 await writeFile(join(source,'TWSE-'+date+'.json.gz'),packed);
 const dates=Array.from({length:61},(_,i)=>{
  const d=new Date('2026-08-14T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
  return d.toISOString().slice(0,10);
 });
 const receiptBase={schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate,calendar:{tradingDates:dates},state:'INCOMPLETE',requestCount:1,
  plannedMarketDateRequests:122,receivedMarketDateCount:1,
  sourceWindowFirstDate:dates[0],sourceWindowLastDate:dates.at(-1),
  sourceRowSymbolWindowsCompleteCount:0,markets:['TWSE','TPEX'],
  receipts:[{market:'TWSE',marketDate:date,sourceId:'A1_TWSE_MI_INDEX_HISTORICAL_DAILY',
   sourceUrl:buildOfficialHistoricalA1UrlV0_1('TWSE',date),providerReportedDate:date,
   originalRawResponseSha256:sha(body),originalRawResponseBytes:body.length,
   capturedAt:observedAt,rowCount:1,rawProviderBytesPreserved:true}],errors:[],bySymbol:{},
  sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,assessorExecuted:false,
  qualifiedCandidates:null,selectedCount:null,frozenDecisionsDurablyReadBack:false,
  independentProviderAudited:false,noSystem1RuntimeMutations:true};
 const sourceReceipt={...receiptBase,receiptHash:await sha256Hex(
   official61SessionSourceReceiptHashBaseV0_1(receiptBase)),
  originalCount:1,originals:[{market:'TWSE',date,sourceSha256:sha(body),
   originalBytes:body.length,gzipBytes:packed.length,observedAt}],
  sharedOriginalSourceReuse:{trustedReusedMarketDatePairs:0},
  retrospectiveDiagnosticOnly:true,retrospectiveSelectionClaimDisabled:true,
  genuineProspectiveDecisionCapture:false};
 const sourceManifest=buildSharedOfficialA1MarketManifestV0_1({
  sourceReceipt,issuedAtUtc:'2026-10-13T06:10:00Z',runId:'TEST'
 });
 const authorization={schemaVersion:'SHARED_OFFICIAL_A1_PRIVATE_ARCHIVE_AUTHORIZATION_V0_1',
  approvedBy:'OWNER_EXPLICIT_2026_10_13',sourceRepository:'imihan0630-sys/v7-fugle-worker',
  targetRepository:'imihan0630-sys/v7-system2-official-a1-archive',
  targetVisibilityVerified:'PRIVATE',storageMode:'PRIVATE_GIT_CONTENT_ADDRESSED_APPEND_ONLY',
  writerCredential:'DEDICATED_TARGET_REPO_DEPLOY_KEY',writerSecretName:'S2_A1_ARCHIVE_DEPLOY_KEY',
  writerScopeOnlyTargetRepository:true,paidPlanAuthorized:false,publicRawPublicationAllowed:false,
  attributionRequired:true,system1FormalUseAuthorized:false,system2SelectionUseAuthorized:false,
  cloudflareWriteAuthorized:false,sourceDataLicenses:[
   {market:'TWSE',license:'政府資料開放授權條款-第1版',licenseUrl:'https://data.gov.tw/license'},
   {market:'TPEX',license:'政府資料開放授權條款-第1版',licenseUrl:'https://data.gov.tw/license'}]};
 return {source,archive,sourceReceipt,sourceManifest,authorization,body,packed,
  async cleanup(){await rm(source,{recursive:true,force:true});await rm(archive,{recursive:true,force:true});}};
}
test('owner-approved private target writes content-addressed evidence, attribution, and no trading authority',async()=>{
 const f=await fixture();try{
  const out=await publish({...f,originalDirectory:f.source,archiveDirectory:f.archive,
   nowUtc:'2026-10-13T06:20:00.000Z'});
  assert.equal(out.targetVisibility,'PRIVATE');assert.equal(out.sourceMarketDatePairs,1);
  assert.equal(out.newFiles,4);assert.equal(out.publicRawPublication,false);
  assert.equal(out.cloudflareD1Writes,0);assert.equal(out.selectionPerformed,false);
  const path=join(f.archive,'raw','TWSE','2026',date+'--'+sha(f.body)+'.json.gz');
  assert.deepEqual(await readFile(path),f.packed);
  assert.match(await readFile(join(f.archive,'SOURCE_NOTICE.md'),'utf8'),/data\.gov\.tw\/dataset\/11549/);
 }finally{await f.cleanup();}
});
test('same source replay is deduplicated and exact existing bytes are independently compared',async()=>{
 const f=await fixture();try{
  const input={...f,originalDirectory:f.source,archiveDirectory:f.archive,
   nowUtc:'2026-10-13T06:20:00.000Z'};
  const first=await publish(input),second=await publish(input);
  assert.equal(first.archiveReceiptHash,second.archiveReceiptHash);
  assert.equal(second.newFiles,0);assert.equal(second.verifiedExistingFiles,4);
  assert.equal(second.archiveReceiptPathState,'VERIFIED_EXISTING');
 }finally{await f.cleanup();}
});
test('content-addressed path conflict cannot be overwritten',async()=>{
 const f=await fixture();try{
  const input={...f,originalDirectory:f.source,archiveDirectory:f.archive,
   nowUtc:'2026-10-13T06:20:00.000Z'};
  await publish(input);
  const path=join(f.archive,'raw','TWSE','2026',date+'--'+sha(f.body)+'.json.gz');
  await writeFile(path,Buffer.from('tampered'));
  await assert.rejects(()=>publish(input),/IMMUTABLE_RAW_CONFLICT/);
 }finally{await f.cleanup();}
});
test('source receipt hash and manifest lineage are independently required',async()=>{
 const f=await fixture();try{
  f.sourceReceipt={...f.sourceReceipt,receiptHash:'f'.repeat(64)};
  await assert.rejects(()=>publish({...f,originalDirectory:f.source,archiveDirectory:f.archive}),
   /SOURCE_RECEIPT_INTEGRITY_INVALID/);
 }finally{await f.cleanup();}
});
test('post-capture persistence metadata is outside the frozen collector hash domain',async()=>{
 const f=await fixture();try{
  f.sourceReceipt.originalCount=999;
  const out=await publish({...f,originalDirectory:f.source,archiveDirectory:f.archive});
  assert.equal(out.sourceReceiptHash,f.sourceReceipt.receiptHash);
 }finally{await f.cleanup();}
});
test('public or alternate target authorization is rejected',async()=>{
 const f=await fixture();try{
  f.authorization={...f.authorization,targetVisibilityVerified:'PUBLIC'};
  await assert.rejects(()=>publish({...f,originalDirectory:f.source,archiveDirectory:f.archive}),
   /OWNER_LICENSE_OR_SCOPE_AUTHORIZATION_INVALID/);
 }finally{await f.cleanup();}
});
test('workflow has read-only source token and target-only deploy key; no Cloudflare or public raw path',()=>{
 const workflow=readFileSync('.github/workflows/system2-shared-official-a1-private-archive.yml','utf8');
 assert.match(workflow,/contents:\s*read/);assert.match(workflow,/actions:\s*read/);
 assert.doesNotMatch(workflow,/contents:\s*write/);
 assert.match(workflow,/secrets\.S2_A1_ARCHIVE_DEPLOY_KEY/);
 assert.match(workflow,/v7-system2-official-a1-archive\.git/);
 assert.doesNotMatch(workflow,/V7_DB|R2_BUCKET|api\.cloudflare\.com/);
});
