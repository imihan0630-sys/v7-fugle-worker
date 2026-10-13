import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {buildSharedOfficialA1MarketManifestV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {sourceFirstLedgerFromAuditedOriginalsV0_1 as bridge}
 from '../scripts/run_shared_official_a1_stage1_readonly_v0_1.mjs';
const now='2026-10-13T11:30:00Z';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const dates=Array.from({length:61},(_,i)=>{
 const d=new Date('2026-10-13T00:00:00Z');d.setUTCDate(d.getUTCDate()-(60-i));
 return d.toISOString().slice(0,10);
});
function fakePayload(market){
 const fields=market==='TWSE'?
  ['證券代號','證券名稱','成交股數','開盤價','最高價','最低價','收盤價']:
  ['代號','名稱','成交股數','開盤','最高','最低','收盤'];
 return Buffer.from(JSON.stringify({
  date:'20261013',tables:[{fields,
   data:Array.from({length:market==='TWSE'?700:500},(_,i)=>{
    const symbol=String((market==='TWSE'?1000:5000)+i);
    return [symbol,'COMPANY'+symbol,'100,000','100','102','99','101'];
   })}]
 }));
}
async function fixture({partial=false,duplicate=false}={}){
 const nowSource='2026-10-13T09:00:00Z';
 const raw={TWSE:fakePayload('TWSE'),TPEX:fakePayload('TPEX')};
 const rows=[];
 for(const date of dates)for(const market of ['TWSE','TPEX']){
  if(partial&&date===dates.at(-1)&&market==='TPEX')continue;
  rows.push({market,marketDate:date,
   sourceId:'OFFICIAL_'+market,sourceUrl:'https://example.test/'+market+'/'+date,
   providerReportedDate:date,
   originalRawResponseSha256:date===dates.at(-1)?hash(raw[market]):'a'.repeat(64),
   originalRawResponseBytes:date===dates.at(-1)?raw[market].length:123,
   capturedAt:nowSource,rowCount:market==='TWSE'?700:500,
   rawProviderBytesPreserved:true});
 }
 const calendar={state:partial?'INCOMPLETE':'SOURCE_OBSERVED_UNAUDITED',
  marketDate:dates.at(-1),tradingDates:dates,observedAt:nowSource,
  providerSource:'TWSE_OFFICIAL',verifiedOfficialReadback:false,
  originalCalendarHash:'a'.repeat(64)};
 const source={schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate:dates.at(-1),calendar,state:partial?'INCOMPLETE':'SOURCE_OBSERVED_UNAUDITED',
  requestCount:122,plannedMarketDateRequests:122,receivedMarketDateCount:rows.length,
  sourceWindowFirstDate:dates[0],sourceWindowLastDate:dates.at(-1),
  sourceRowSymbolWindowsCompleteCount:0,markets:['TWSE','TPEX'],
  receipts:rows,errors:partial?[{market:'TPEX',date:dates.at(-1),code:'NOT_READY'}]:[],
  bySymbol:{},sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,
  assessorExecuted:false,qualifiedCandidates:null,selectedCount:null,
  frozenDecisionsDurablyReadBack:false,independentProviderAudited:false,
  noSystem1RuntimeMutations:true};
 const sourceReceipt={...source,receiptHash:await sha256Hex(
  official61SessionSourceReceiptHashBaseV0_1(source))};
 const manifest=buildSharedOfficialA1MarketManifestV0_1({
  sourceReceipt,issuedAtUtc:'2026-10-13T10:00:00Z'
 });
 const auditBase={schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:partial?'BLOCKED_SOURCE_INCOMPLETE':'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  marketDate:dates.at(-1),manifestSha256:manifest.manifestSha256,
  sourceReceiptHash:sourceReceipt.receiptHash,auditedAtUtc:'2026-10-13T11:00:00Z',
  sourceMarketDatePairsVerified:rows.length,
  originalFilesRehashedAfterDownload:rows.length,
  originalFilesDecompressedAndParsed:rows.length,
  officialCalendarTradingDatesVerified:61,
  sourceUrlAndProviderDateVerified:true,
  independentOfficialCalendarReadbackVerified:true,
  auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  strategyPitCertified:false,selectionAuthorized:false};
 const auditReceipt={...auditBase,auditHash:await sha256Hex(auditBase)};
 const packed={TWSE:gzipSync(raw.TWSE),TPEX:gzipSync(raw.TPEX)};
 const readOriginal=async path=>path.includes('TWSE-')?packed.TWSE:packed.TPEX;
 const parseNative=({market,marketDate,payload})=>{
  const count=market==='TWSE'?700:500;
  const rows=Array.from({length:count},(_,i)=>{
   let symbol=String((market==='TWSE'?1000:5000)+i);
   if(duplicate&&market==='TPEX'&&i===0)symbol='1000';
   return {market,marketDate,symbol,companyName:'COMPANY'+symbol,
    open:100,high:102,low:99,close:101,
    volumeShares:100000,tradeValue:10000000,
    sourceFields:[symbol,market,marketDate],sourceId:'OFFICIAL_'+market};
  });
  return {state:'READY',sourceDateEvidence:marketDate,sourceId:'OFFICIAL_'+market,rows};
 };
 return {manifest,sourceReceipt,auditReceipt,originalDirectory:'/tmp/read-injected-only',
  freezeAtUtc:now,readOriginal,parseNative};
}
test('full real-provider-equivalent source+independent audit creates all-universe read-only ledger',async()=>{
 const x=await bridge(await fixture());
 assert.equal(x.state,'SOURCE_LEDGER_READY_STRATEGY_PIT_NOT_CERTIFIED');
 assert.equal(x.sourceLedger.sourceState,'READY');
 assert.equal(x.sourceLedger.sourceOrdinarySymbolCount,1200);
 assert.equal(x.sourceLedger.observations.length,1200);
 assert.equal(x.sourceLedger.selectedCount,null);
 assert.equal(x.sourceLedger.zeroPickDay,null);
 assert.equal(x.selectionAuthorized,false);
 assert.equal(x.frozenDecisionWritten,false);
 assert.equal(x.eligibleSourceSymbolCount,1200);
});
test('121/122 independent audit blocks prospective ledger and selected count stays null',async()=>{
 const x=await bridge(await fixture({partial:true}));
 assert.equal(x.state,'BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER');
 assert.deepEqual(x.blockers,['INDEPENDENT_SOURCE_AUDIT_NOT_122_OF_122']);
 assert.equal(x.sourceLedger,null);
 assert.equal(x.selectedCount,null);assert.equal(x.zeroPickDay,null);
});
test('tampered independently signed audit cannot be used to build source ledger',async()=>{
 const f=await fixture();f.auditReceipt.originalFilesRehashedAfterDownload=121;
 await assert.rejects(()=>bridge(f),/INDEPENDENT_AUDIT_PROVENANCE_INVALID/);
});
test('historical or future clock cannot be backdated as prospective source snapshot',async()=>{
 const f=await fixture();f.freezeAtUtc='2026-10-15T11:30:00Z';
 const x=await bridge(f);
 assert.equal(x.state,'BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER');
 assert.deepEqual(x.blockers,['SOURCE_OBSERVATION_OUTSIDE_T_OR_T_PLUS_ONE_WINDOW']);
});
test('modified original after accepted independent audit is caught by actual byte hash',async()=>{
 const f=await fixture();
 f.readOriginal=async()=>gzipSync(Buffer.from('{"date":"20261013"}'));
 await assert.rejects(()=>bridge(f),/CURRENT_NATIVE_RAW_HASH_MISMATCH/);
});
test('duplicate symbol across TWSE and TPEX hard blocks entire ledger',async()=>{
 const f=await fixture({duplicate:true});
 await assert.rejects(()=>bridge(f),/CROSS_MARKET_DUPLICATE_OR_BAD_SYMBOL/);
});
test('origin and TWSE/TPEx row-count discrepancy blocks, no silent missing symbols',async()=>{
 const f=await fixture();
 const base=f.parseNative;f.parseNative=(args)=>{
  const r=base(args);return args.market==='TPEX'?{...r,rows:r.rows.slice(1)}:r;
 };
 await assert.rejects(()=>bridge(f),/CURRENT_NATIVE_DATE_OR_COUNT_MISMATCH/);
});
test('historical 122/122 observed at next-day 19:19 is NOT prospective Stage1',async()=>{
 const f=await fixture();f.freezeAtUtc='2026-10-14T11:19:00Z';
 const x=await bridge(f);
 assert.equal(x.state,'BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER');
 assert.deepEqual(x.blockers,['SOURCE_OBSERVATION_OUTSIDE_T_OR_T_PLUS_ONE_WINDOW']);
 assert.equal(x.sourceLedger,null);assert.equal(x.selectedCount,null);
});
test('owner-approved next-day 00:15 bounded recovery remains research-only',async()=>{
 const f=await fixture();f.freezeAtUtc='2026-10-13T16:15:00Z';
 const x=await bridge(f);
 assert.equal(x.state,'SOURCE_LEDGER_READY_STRATEGY_PIT_NOT_CERTIFIED');
 assert.equal(x.sourceLedger.selectedCount,null);
 assert.equal(x.strategyPitCertified,false);
});
test('next-day 02:00 or later cannot silently backdate a source clock',async()=>{
 const f=await fixture();f.freezeAtUtc='2026-10-13T18:00:00Z';
 const x=await bridge(f);
 assert.equal(x.state,'BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER');
 assert.equal(x.selectedCount,null);
});
test('same market date before 19:00 remains preliminary source, not Stage1',async()=>{
 const f=await fixture();f.freezeAtUtc='2026-10-13T10:59:00Z';
 const x=await bridge(f);
 assert.equal(x.state,'BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER');
 assert.equal(x.sourceLedger,null);
});
test('source evidence cannot be silently marked as a frozen ranked decision',async()=>{
 const {readFile}=await import('node:fs/promises');
 const s=await readFile('system2/scripts/run_shared_official_a1_stage1_readonly_v0_1.mjs','utf8');
 assert.match(s,/continuityBySymbol:input\.continuityBySymbol\|\|\{\}/);
 assert.doesNotMatch(s,/INSERT INTO|git push|api\.cloudflare\.com/);
 assert.match(s,/selectionAuthorized:false/);
});
