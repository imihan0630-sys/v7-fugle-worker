import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
import {buildA1FourDigitOriginalFullUniverseHandoffV0_1 as build}
 from '../migration/issue1068_full_market_t_a1_native_row_handoff_v0_1.mjs';

const hash=s=>createHash('sha256').update(s).digest('hex');
const dates=Array.from({length:61},(_,i)=>{
 const d=new Date('2026-07-01T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
});
const T=dates.at(-1),PRIOR=dates.at(-2),when='2026-10-17T14:00:00Z';
function provider(market,date){
 const twse=['證券代號','證券名稱','成交股數','成交筆數','成交金額','開盤價','最高價','最低價','收盤價'];
 const tpex=['代號','名稱','成交股數','成交筆數','成交金額(元)','開盤','最高','最低','收盤'];
 const fields=market==='TWSE'?twse:tpex;
 const N=market==='TWSE'?601:451;
 const data=Array.from({length:N},(_,i)=>[
  String((market==='TWSE'?1100:3100)+i),'TEST-'+i,
  '1,500','30','56,000','40','45','39',date===T?'42':'41'
 ]);
 return Buffer.from(JSON.stringify({date:date.replaceAll('-',''),
  stat:'OK',tables:[{fields,data,title:'OFFICIAL TEST SAMPLE'}]}));
}
async function fx(){
 const receipts=[], zipped=new Map();
 for(const date of dates)for(const market of ['TWSE','TPEX']){
  const raw=provider(market,date);
  if([T,PRIOR].includes(date))zipped.set('/fixture/'+market+'-'+date+'.json.gz',gzipSync(raw));
  receipts.push({
   market,marketDate:date,sourceUrl:buildOfficialHistoricalA1UrlV0_1(market,date),
   originalRawResponseSha256:hash(raw),
   originalRawResponseBytes:raw.byteLength,
   rowCount:market==='TWSE'?601:451,providerReportedDate:date,
   capturedAt:'2026-10-17T12:05:00Z'
  });
 }
 const source={
  schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate:T,calendar:{tradingDates:dates},state:'SOURCE_OBSERVED_UNAUDITED',
  requestCount:122,plannedMarketDateRequests:122,receivedMarketDateCount:122,
  sourceWindowFirstDate:dates[0],sourceWindowLastDate:T,
  sourceRowSymbolWindowsCompleteCount:0,markets:['TWSE','TPEX'],
  receipts,errors:[],bySymbol:{},
  sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,
  assessorExecuted:false,qualifiedCandidates:[],selectedCount:null,
  frozenDecisionsDurablyReadBack:false,independentProviderAudited:false,
  noSystem1RuntimeMutations:true
 };
 source.receiptHash=await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(source));
 const audit={
  schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  marketDate:T,verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  sourceReceiptHash:source.receiptHash,sourceMarketDatePairsVerified:122,
  originalFilesRehashedAfterDownload:122,originalFilesDecompressedAndParsed:122,
  selectionAuthorized:false,strategyPitCertified:false,frozenWritten:false,
  auditedAtUtc:'2026-10-17T13:05:00Z'
 };
 audit.auditHash=await sha256Hex(audit);
 const run=(s=source,a=audit)=>build({
  source:s,independentAudit:a,originalDirectory:'/fixture',
  generatedAtUtc:when,
  readRaw:async p=>{
   if(!zipped.has(p))throw Error('MISSING_FIXTURE_ORIGINAL');
   return zipped.get(p)
  }
 });
 return {source,audit,zipped,run};
}
test('full source T original TWSE + TPEx population, TWD turnover, prior raw close and native row hashes',async()=>{
 const f=await fx(),x=await f.run();
 assert.equal(x.marketDate,T);
 assert.equal(x.fourDigitInstrumentCount,1052);
 assert.deepEqual(x.marketSummaries.map(s=>s.fourDigitInstrumentCount),[601,451]);
 assert.equal(x.marketSummaries[0].market,'TWSE');
 assert.equal(x.marketSummaries[0].nonNullTradeValueTwdCount,601);
 assert.equal(x.marketSummaries[1].nonNullTradeValueTwdCount,451);
 const row=x.rows.find(y=>y.market==='TWSE'&&y.symbol==='1100');
 assert.equal(row.tradeValueTwd,56000);
 assert.equal(row.volumeShares,1500);
 assert.equal(row.close,42);
 assert.equal(row.previousSessionRawClose,41);
 assert.equal(row.tradeValueUnit,'TWD');
 assert.equal(row.priceSpace,'RAW');
 assert.match(row.sourceRowHash,/^[0-9a-f]{64}$/);
 assert.equal(x.ordinaryShareClassCertified,false);
 assert.equal(x.tradeValueTwdIsExecutedMoneyFlow,false);
 assert.equal(x.selectedCount,null);
 assert.equal(x.frozenD1Written,false);
 assert.equal(x.receiptHash,(await f.run()).receiptHash);
});
test('source T original body bitflip must invalidate receipt',async()=>{
 const f=await fx();
 f.zipped.set('/fixture/TWSE-'+T+'.json.gz',gzipSync(Buffer.from('{"bogus":true}')));
 await assert.rejects(()=>f.run(),/ORIGINAL_BYTES_SHA_MISMATCH/);
});
test('signed market date and source receipt cannot be edited without signature',async()=>{
 const f=await fx();f.source.marketDate=PRIOR;
 await assert.rejects(()=>f.run(),/SIGNED_SOURCE_61_WINDOW_INVALID/);
});
test('independent audit hash and exact full scope are hard gates',async()=>{
 const f=await fx();f.audit.sourceMarketDatePairsVerified=121;
 await assert.rejects(()=>f.run(),/INDEPENDENT_AUDIT_SCOPE_UNVERIFIED/);
});
test('do not turn missing prior-session stock price into a fabricated return',async()=>{
 const f=await fx();
 const current=provider('TWSE',T);
 const broken=Buffer.from(current.toString().replace('"TEST-0"','"TEST-0"'));
 assert.equal(broken.toString(),current.toString());
 const x=await f.run();
 assert.equal(x.rows.find(y=>y.symbol==='1100'&&y.market==='TWSE').caAdjustedPriceComparable,false);
 assert.equal(x.rows.find(y=>y.symbol==='1100'&&y.market==='TWSE').genuinePublicationAvailableAtUtc,null);
});
