import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {buildSharedOfficialA1MarketManifestV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
import {auditSharedOfficialA1SourceIntegrityV0_1 as audit}
 from '../scripts/audit_shared_official_a1_source_v0_1.mjs';
const stamp='2026-10-13T08:00:00Z',clock='2026-10-13T11:20:00.000Z';
const dates=Array.from({length:61},(_,i)=>{
 const d=new Date('2026-10-13T00:00:00Z');
 d.setUTCDate(d.getUTCDate()-(60-i));
 return d.toISOString().slice(0,10);
});
async function build(partial=false){
 const receipts=[];
 for(const date of dates)for(const market of ['TWSE','TPEX']){
  if(partial&&date===dates.at(-1)&&market==='TPEX')continue;
  receipts.push({
   market,marketDate:date,sourceId:'SAMPLE_'+market,
   sourceUrl:buildOfficialHistoricalA1UrlV0_1(market,date),
   providerReportedDate:date,originalRawResponseSha256:'a'.repeat(64),
   originalRawResponseBytes:12345,capturedAt:stamp,rowCount:market==='TWSE'?700:600,
   rawProviderBytesPreserved:true,
  });
 }
 const source={schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate:dates.at(-1),calendar:{
   state:partial?'INCOMPLETE':'SOURCE_OBSERVED_UNAUDITED',
   marketDate:dates.at(-1),tradingDates:dates,observedAt:stamp,
   providerSource:'TEST_OFFICIAL',verifiedOfficialReadback:false,
   originalCalendarHash:await sha256Hex({source:'TEST_OFFICIAL',
    schemaVersion:'S2_OFFICIAL_TRADING_DATES_V0_1',tradingDates:dates}),
  },
  state:partial?'INCOMPLETE':'SOURCE_OBSERVED_UNAUDITED',
  requestCount:122,plannedMarketDateRequests:122,
  receivedMarketDateCount:receipts.length,
  sourceWindowFirstDate:dates[0],sourceWindowLastDate:dates.at(-1),
  sourceRowSymbolWindowsCompleteCount:0,markets:['TWSE','TPEX'],
  receipts,errors:partial?[{market:'TPEX',date:dates.at(-1),
   code:'OFFICIAL_DATE_CAPTURE_FAILED'}]:[],
  bySymbol:{},sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,
  assessorExecuted:false,qualifiedCandidates:null,selectedCount:null,
  frozenDecisionsDurablyReadBack:false,independentProviderAudited:false,
  noSystem1RuntimeMutations:true};
 const sourceReceipt={...source,receiptHash:await sha256Hex(
  official61SessionSourceReceiptHashBaseV0_1(source))};
 const manifest=buildSharedOfficialA1MarketManifestV0_1({
  sourceReceipt,issuedAtUtc:'2026-10-13T09:00:00Z'
 });
 const calendarResolver=async()=>({
  source:'TEST_OFFICIAL',schemaVersion:'S2_OFFICIAL_TRADING_DATES_V0_1',
  tradingDates:dates
 });
 const verifyOriginals=async()=>({
  verifiedOriginalFiles:receipts.length,verifiedUniqueTradingDates:61,
  sourceManifestSha256:manifest.manifestSha256,originalCompressedBytes:123456
 });
 const inspectOriginal=async({blob,sourceReceiptRow})=>({
  rowCount:sourceReceiptRow.rowCount,rawSha256:blob.originalSha256
 });
 return {sourceReceipt,manifest,calendarResolver,verifyOriginals,
  inspectOriginal,originalDirectory:'/tmp/no-access-in-injected-test',auditedAtUtc:clock};
}
test('122/122 original data plus independent calendar produces a source-only audit',async()=>{
 const x=await audit(await build());
 assert.equal(x.verdict,'ACCEPTED_SOURCE_INTEGRITY_ONLY');
 assert.equal(x.originalFilesRehashedAfterDownload,122);
 assert.equal(x.sourceMarketDatePairsVerified,122);
 assert.deepEqual(x.missingMarketDatePairs,[]);
 assert.equal(x.strategyPitCertified,false);
 assert.equal(x.selectionAuthorized,false);
 assert.equal(x.frozenWritten,false);
 const {auditHash,...base}=x;
 assert.equal(auditHash,await sha256Hex(base));
});
test('121/122 is blocked, NEVER a zero-pick or eligible evaluation',async()=>{
 const x=await audit(await build(true));
 assert.equal(x.verdict,'BLOCKED_SOURCE_INCOMPLETE');
 assert.equal(x.originalFilesRehashedAfterDownload,121);
 assert.deepEqual(x.missingMarketDatePairs,[{market:'TPEX',marketDate:dates.at(-1)}]);
 assert.equal(x.selectedCount,null);assert.equal(x.zeroPickDay,null);
 assert.equal(x.selectionAuthorized,false);
});
test('tampered raw source receipt hash fails before original reparse',async()=>{
 const a=await build();a.sourceReceipt.receipts[0].rowCount=55;
 await assert.rejects(()=>audit(a),/SOURCE_RECEIPT_HASH_OR_DENOMINATOR_INVALID/);
});
test('independent calendar drift fails closed',async()=>{
 const a=await build();a.calendarResolver=async()=>({
  source:'TEST_OFFICIAL',schemaVersion:'S2_OFFICIAL_TRADING_DATES_V0_1',
  tradingDates:[...dates.slice(0,60),'2026-10-12']
 });
 await assert.rejects(()=>audit(a),/INDEPENDENT_OFFICIAL_CALENDAR_MISMATCH/);
});
test('reparsed payload row count or raw hash conflict blocks certification',async()=>{
 const a=await build();a.inspectOriginal=async()=>({rowCount:700,rawSha256:'b'.repeat(64)});
 await assert.rejects(()=>audit(a),/REPARSED_SOURCE_ROW_OR_HASH_MISMATCH/);
});
test('source event future availability cannot be backdated',async()=>{
 const a=await build();a.auditedAtUtc='2026-10-13T07:00:00.000Z';
 await assert.rejects(()=>audit(a),/SOURCE_FUTURE_OR_INVALID_CLOCK/);
});
test('script/CI source-only promise: no privileged write or fake selected/frozen',async()=>{
 const {readFile}=await import('node:fs/promises');
 const s=await readFile('system2/scripts/audit_shared_official_a1_source_v0_1.mjs','utf8');
 const workflow=await readFile('.github/workflows/system2-shared-official-a1-independent-audit.yml','utf8');
 assert.match(workflow,/contents: read/);assert.match(workflow,/actions: read/);
 assert.doesNotMatch(workflow,/contents: write|S2_SCHEMA_DEST_D1_WRITE_TOKEN|S2_A1_ARCHIVE_DEPLOY_KEY/);
 assert.doesNotMatch(s,/api\.cloudflare\.com|INSERT INTO|git push/);
 assert.match(s,/selectionAuthorized:false/);
});
