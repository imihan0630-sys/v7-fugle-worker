// Research-only, separate-process readback audit of an original shared A1 artifact.
// Never certifies PIT, corporate actions, strategy eligibility, frozen picks or trades.
// No Cloudflare credentials, GitHub raw publication, or D1/R2 writes.
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {buildOfficialTradingDatesV0_1}
 from '../runtime/official_historical_backfill_source_v0_1.mjs';
import {parseOfficialHistoricalA1PayloadV0_1,buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {assertSharedOfficialA1ConsumerBoundaryV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {planSharedOfficialA1ArchiveDryRunV0_1}
 from './plan_shared_official_a1_archive_dryrun_v0_1.mjs';

const SHA=/^[a-f0-9]{64}$/i;
const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const DAY=/^\d{4}-\d\d-\d\d$/;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function shiftDay(day,n){
 const date=new Date(day+'T00:00:00Z');
 if(!Number.isFinite(+date)||date.toISOString().slice(0,10)!==day)
  throw Error('A1_AUDIT_INVALID_MARKET_DATE');
 date.setUTCDate(date.getUTCDate()+n);
 return date.toISOString().slice(0,10);
}
function assertClock(clock,auditedAtUtc){
 if(!ISO.test(clock||'')||!Number.isFinite(Date.parse(clock))||
    Date.parse(clock)>Date.parse(auditedAtUtc))
  throw Error('A1_AUDIT_SOURCE_FUTURE_OR_INVALID_CLOCK');
}
async function inspectNativeOriginalV0_1({blob,originalDirectory,sourceReceiptRow}){
 const file=resolve(originalDirectory,blob.market+'-'+blob.marketDate+'.json.gz');
 const bytes=await readFile(file);
 const raw=gunzipSync(bytes,{maxOutputLength:32*1024*1024});
 if(hash(raw)!==blob.originalSha256||raw.length!==blob.originalBytes)
  throw Error('A1_AUDIT_ORIGINAL_RAW_SHA_OR_BYTES_MISMATCH');
 const parsed=parseOfficialHistoricalA1PayloadV0_1({
   market:blob.market,marketDate:blob.marketDate,
   observedAt:blob.firstCapturedAtUtc,sourceUrl:blob.sourceUrl,
   payload:JSON.parse(raw.toString('utf8')),
 });
 if(parsed.state!=='READY'||parsed.sourceDateEvidence!==blob.marketDate||
    parsed.rows.length!==sourceReceiptRow.rowCount||
    parsed.rows.length<(blob.market==='TWSE'?600:450)||
    new Set(parsed.rows.map(x=>x.symbol)).size!==parsed.rows.length)
  throw Error('A1_AUDIT_PROVIDER_DATE_OR_UNIVERSE_CONFLICT');
 return {rowCount:parsed.rows.length,rawSha256:hash(raw)};
}
export async function auditSharedOfficialA1SourceIntegrityV0_1({
 manifest,sourceReceipt,originalDirectory,auditedAtUtc=new Date().toISOString(),
 fetchImpl=globalThis.fetch,
 calendarResolver=buildOfficialTradingDatesV0_1,
 verifyOriginals=planSharedOfficialA1ArchiveDryRunV0_1,
 inspectOriginal=inspectNativeOriginalV0_1,
}={}){
 if(!originalDirectory||!ISO.test(auditedAtUtc||'')||
    !Number.isFinite(Date.parse(auditedAtUtc)))
  throw Error('A1_AUDIT_INPUT_CLOCK_OR_ORIGINALS_MISSING');
 const scope=assertSharedOfficialA1ConsumerBoundaryV0_1(manifest,{
   system:'SYSTEM2',purpose:'READ_ONLY_SOURCE_RESEARCH'
 });
 if(scope.pointInTimeStrategyUseAuthorized!==false||
    manifest.sourceMarketDatePairsExpected!==122)
  throw Error('A1_AUDIT_SCOPE_OR_EXPECTED_COUNT_INVALID');
 if(sourceReceipt?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
    sourceReceipt.marketDate!==manifest.effectiveTradingDay||
    sourceReceipt.receiptHash!==manifest.originalOfficialProvenanceHash||
    !Array.isArray(sourceReceipt.receipts)||
    !Array.isArray(sourceReceipt.errors)||
    sourceReceipt.requestCount!==122||
    sourceReceipt.plannedMarketDateRequests!==122||
    sourceReceipt.receivedMarketDateCount!==sourceReceipt.receipts.length||
    sourceReceipt.receivedMarketDateCount!==manifest.sourceMarketDatePairsValidated||
    !SHA.test(sourceReceipt.receiptHash||'')||
    await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(sourceReceipt))!==
      sourceReceipt.receiptHash)
  throw Error('A1_AUDIT_SOURCE_RECEIPT_HASH_OR_DENOMINATOR_INVALID');
 const dates=manifest.tradingDates;
 if(!Array.isArray(dates)||dates.length!==61||
    !Array.isArray(sourceReceipt.calendar?.tradingDates)||
    dates.some((d,i)=>!DAY.test(d)||(i>0&&d<=dates[i-1])||
      d!==sourceReceipt.calendar.tradingDates[i])||
    dates.at(-1)!==manifest.effectiveTradingDay||
    sourceReceipt.sourceWindowFirstDate!==dates[0]||
    sourceReceipt.sourceWindowLastDate!==dates.at(-1))
  throw Error('A1_AUDIT_CALENDAR_WINDOW_MISMATCH');
 assertClock(manifest.issuedAtUtc,auditedAtUtc);
 assertClock(sourceReceipt.calendar.observedAt,auditedAtUtc);
 const independent=await calendarResolver({
  fromDate:shiftDay(sourceReceipt.marketDate,-145),
  toDate:sourceReceipt.marketDate,fetchImpl
 });
 const returned=independent?.tradingDates?.slice(-61);
 if(!Array.isArray(returned)||returned.length!==61||
    returned.some((date,i)=>date!==dates[i])||
    independent.schemaVersion!=='S2_OFFICIAL_TRADING_DATES_V0_1'||
    independent.source!==sourceReceipt.calendar.providerSource||
    await sha256Hex({source:independent.source,
      schemaVersion:independent.schemaVersion,tradingDates:returned})!==
       sourceReceipt.calendar.originalCalendarHash)
  throw Error('A1_AUDIT_INDEPENDENT_OFFICIAL_CALENDAR_MISMATCH');
 const evidence=await verifyOriginals({
   sourceManifest:manifest,originalDirectory,nowUtc:auditedAtUtc
 });
 if(evidence.verifiedOriginalFiles!==manifest.sourceMarketDatePairsValidated||
    evidence.verifiedUniqueTradingDates!==61||
    evidence.sourceManifestSha256!==manifest.manifestSha256||
    evidence.originalCompressedBytes<=0)
  throw Error('A1_AUDIT_RAW_READBACK_COUNT_OR_SHA_MISMATCH');
 const byKey=new Map();
 for(const receipt of sourceReceipt.receipts){
  const key=receipt.market+'|'+receipt.marketDate;
  if(byKey.has(key)||!dates.includes(receipt.marketDate)||
     !['TWSE','TPEX'].includes(receipt.market))
   throw Error('A1_AUDIT_DUPLICATE_OR_OUTSIDE_SOURCE_PAIR');
  byKey.set(key,receipt);
 }
 let independentlyParsed=0;
 for(const blob of manifest.sourceBlobs){
  const receipt=byKey.get(blob.market+'|'+blob.marketDate);
  if(!receipt||receipt.originalRawResponseSha256!==blob.originalSha256||
     receipt.originalRawResponseBytes!==blob.originalBytes||
     receipt.capturedAt!==blob.firstCapturedAtUtc||
     receipt.sourceUrl!==buildOfficialHistoricalA1UrlV0_1(blob.market,blob.marketDate)||
     blob.sourceUrl!==receipt.sourceUrl||
     receipt.providerReportedDate!==blob.marketDate)
   throw Error('A1_AUDIT_ORIGINAL_SOURCE_LINEAGE_MISMATCH');
  assertClock(receipt.capturedAt,auditedAtUtc);
  const native=await inspectOriginal({blob,originalDirectory,sourceReceiptRow:receipt});
  if(native.rowCount!==receipt.rowCount||native.rawSha256!==blob.originalSha256)
   throw Error('A1_AUDIT_REPARSED_SOURCE_ROW_OR_HASH_MISMATCH');
  independentlyParsed++;
 }
 const missing=[];
 for(const date of dates)for(const market of ['TWSE','TPEX'])
   if(!byKey.has(market+'|'+date))missing.push({market,marketDate:date});
 const accepted=independentlyParsed===122&&missing.length===0&&
   sourceReceipt.state==='SOURCE_OBSERVED_UNAUDITED'&&
   sourceReceipt.calendar.state==='SOURCE_OBSERVED_UNAUDITED'&&
   sourceReceipt.errors.length===0&&
   manifest.sourceCoverage==='COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED';
 const base={
  schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:accepted?'ACCEPTED_SOURCE_INTEGRITY_ONLY':'BLOCKED_SOURCE_INCOMPLETE',
  marketDate:sourceReceipt.marketDate,manifestSha256:manifest.manifestSha256,
  sourceReceiptHash:sourceReceipt.receiptHash,auditedAtUtc,
  sourceMarketDatePairsVerified:independentlyParsed,
  originalFilesRehashedAfterDownload:independentlyParsed,
  originalFilesDecompressedAndParsed:independentlyParsed,
  officialCalendarTradingDatesVerified:61,
  sourceUrlAndProviderDateVerified:true,
  independentOfficialCalendarReadbackVerified:true,
  auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  missingMarketDatePairs:missing,
  strategyPitCertified:false,selectionAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenWritten:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalRuntimeTouched:false,
 };
 return Object.freeze({...base,auditHash:await sha256Hex(base)});
}
if(process.argv[1]&&process.argv[1].endsWith('/audit_shared_official_a1_source_v0_1.mjs')){
 try{
  const root=process.env.S2_A1_AUDIT_SOURCE_DIR;
  if(!root)throw Error('A1_AUDIT_ARTIFACT_DIRECTORY_MISSING');
  const manifest=JSON.parse(await readFile(resolve(root,'shared-official-a1-manifest.json'),'utf8'));
  const sourceReceipt=JSON.parse(await readFile(resolve(root,
    'official-61-'+manifest.effectiveTradingDay+'.json'),'utf8'));
  const result=await auditSharedOfficialA1SourceIntegrityV0_1({
   manifest,sourceReceipt,originalDirectory:resolve(root,'original-json')
  });
  const dest='/tmp/s2-shared-a1-independent-audit';
  await mkdir(dest,{recursive:true,mode:0o700});
  await writeFile(resolve(dest,'audit-receipt.json'),
    JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log(JSON.stringify({verdict:result.verdict,marketDate:result.marketDate,
    auditedOriginalPairs:result.sourceMarketDatePairsVerified,
    missing:result.missingMarketDatePairs,
    auditHash:result.auditHash,selectionAuthorized:false}));
  if(result.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'&&
     process.env.S2_A1_EXPECT_INCOMPLETE_DIAGNOSTIC!=='true')process.exitCode=2;
 }catch(e){
  console.error('A1_INDEPENDENT_AUDIT_FAIL_CLOSED_'+
   String(e?.message||'ERROR').replace(/[^A-Z0-9_]/gi,'_').slice(0,110));
  process.exitCode=2;
 }
}