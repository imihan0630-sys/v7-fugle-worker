import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {replayM09CaObservedNegativeOverlapV0_1 as replay}
 from '../scripts/replay_m09_ca_observed_negative_overlap_v0_1.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const ids=[
 'TWSE_EX_RIGHT_DIVIDEND_ACTUAL','TWSE_CAPITAL_REDUCTION_REFERENCE',
 'TWSE_PAR_VALUE_CHANGE_REFERENCE','TPEX_EX_RIGHT_DIVIDEND_ACTUAL',
 'TPEX_CAPITAL_REDUCTION_REFERENCE','TPEX_PAR_VALUE_CHANGE_REFERENCE'
];
const dates=Array.from({length:61},(_,i)=>{
 const d=new Date('2026-07-17T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
});
const first=dates[0],last=dates.at(-1);
const compact=x=>x.replaceAll('-','');
const rtc=x=>String(Number(x.slice(0,4))-1911)+'/'+x.slice(5,7)+'/'+x.slice(8,10);
async function fixture(){
 const sourceReceipt={schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  state:'SOURCE_OBSERVED_UNAUDITED',marketDate:last,
  receivedMarketDateCount:122,receiptHash:'a'.repeat(64),
  calendar:{tradingDates:dates}
 };
 const independentSourceAudit={verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  sourceReceiptHash:sourceReceipt.receiptHash,
  sourceMarketDatePairsVerified:122,selectionAuthorized:false,
  auditHash:'b'.repeat(64)};
 const watchBase={schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  marketDate:last,originalSourceReceiptHash:sourceReceipt.receiptHash,
  independentSourceAuditHash:independentSourceAudit.auditHash,
  selectedCount:null,finalSelectionAuthorized:false,displayedCount:2,
  watchlist:[{market:'TWSE',symbol:'2330'},{market:'TPEX',symbol:'4444'}]};
 const preliminaryWatch={...watchBase,receiptHash:await sha256Hex(watchBase)};
 const originalBySourceId={},records=[];
 for(const id of ids){
  const market=id.split('_')[0];
  const fields=['資料日期','股票代號','名稱'];
  const rows=[[rtc(dates[13]),market==='TWSE'?'5555':'6666','測試樣本']];
  if(id==='TWSE_EX_RIGHT_DIVIDEND_ACTUAL')
   rows.push([rtc(dates[17]),'2330','測試樣本']);
  if(id==='TPEX_EX_RIGHT_DIVIDEND_ACTUAL')
   rows.push([rtc(dates[0]),'7777','測試樣本']);
  const text=JSON.stringify({stat:'OK',date:compact(first)+'~'+compact(last),
   tables:[{fields,data:rows}]});
  const buf=Buffer.from(text);
  originalBySourceId[id]=buf;
  records.push({sourceId:id,exchange:market,
   sourceClass:'HISTORICAL_ACTUAL_RESULT_RANGE',
   state:'RANGE_SCHEMA_CANDIDATE_NOT_VINTAGE_CERTIFIED',
   originalBytesReadBackLocally:true,originalSha256:sha(buf),
   originalBytes:buf.length,capturedAtUtc:'2026-10-15T00:35:00Z'});
 }
 const cb={schemaVersion:'S2_M09_SIX_CA_NATIVE_ORIGINAL_SOURCE_RECEIPT_V0_1',
  requestedStartDate:first,requestedEndDate:last,
  firstPhysicalObservedAtUtc:'2026-10-15T00:35:00Z',
  completedAtUtc:'2026-10-15T00:36:00Z',
  noEventMayBeClaimed:false,continuityCertified:false,selectionAuthorized:false,
  sourceReceipts:records};
 const caReceipt={...cb,receiptHash:await sha256Hex(cb)};
 return {sourceReceipt,independentSourceAudit,preliminaryWatch,caReceipt,originalBySourceId};
}
test('six original hashes + audited A1 61 sessions yields only observed risk conflicts',async()=>{
 const f=await fixture();const r=await replay(f);
 assert.equal(r.originalCaShaRehashed,6);
 assert.equal(r.tradingSessions,61);
 assert.equal(r.previewWithProvenPresentCaIn61Sessions,1);
 assert.equal(r.previewWithoutObservedCaNotClearedCount,1);
 assert.equal(r.flaggedPreview[0].symbol,'2330');
 assert.equal(r.flaggedPreview[0].market,'TWSE');
 assert.equal(r.eventRowsIn61TradingDates,8);
 assert.equal(r.originalCaSourceCount,6);
 assert.equal(r.positiveOrdinaryEquityClassAttested,false);
 assert.equal(r.noEventOrNoActionMayBeCertified,false);
 assert.equal(r.asKnownAtPreviousDecisionClock,false);
 assert.equal(r.formalStrategySelectionAuthorized,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.frozenD1Written,false);
 const {receiptHash,...base}=r;assert.equal(receiptHash,await sha256Hex(base));
 assert(!JSON.stringify(r).includes('測試樣本'));
});
test('modified official source bytes cannot fake a CA match',async()=>{
 const f=await fixture();
 f.originalBySourceId.TWSE_EX_RIGHT_DIVIDEND_ACTUAL=Buffer.from('{"a":"tamper"}');
 await assert.rejects(()=>replay(f),/ORIGINAL_BYTES_HASH_OR_LENGTH_MISMATCH/);
});
test('no silently-cleared CA exposure when six-source native proof missing',async()=>{
 const f=await fixture();
 f.caReceipt.sourceReceipts=f.caReceipt.sourceReceipts.slice(0,5);
 await assert.rejects(()=>replay(f),/CA_SOURCE_OR_RECEIPT_INVALID/);
});
test('tampered preview receipt blocks the cross-source audit',async()=>{
 const f=await fixture();f.preliminaryWatch.watchlist[0].symbol='2317';
 await assert.rejects(()=>replay(f),/PRELIMINARY_WATCH_IDENTITY_OR_HASH_INVALID/);
});
test('unverified A1 independent audit blocks cross-source comparison',async()=>{
 const f=await fixture();f.independentSourceAudit.sourceMarketDatePairsVerified=121;
 await assert.rejects(()=>replay(f),/INDEPENDENT_A1_AUDIT_NOT_BOUND/);
});
test('four-digit action rows with unparseable native effective date fail closed',async()=>{
 const f=await fixture(),r=f.caReceipt.sourceReceipts[0];
 const d=JSON.parse(f.originalBySourceId[r.sourceId]);
 d.tables[0].data[0][0]='not-a-date';
 const raw=Buffer.from(JSON.stringify(d));
 f.originalBySourceId[r.sourceId]=raw;r.originalSha256=sha(raw);r.originalBytes=raw.length;
 const {receiptHash,...unsigned}=f.caReceipt;f.caReceipt.receiptHash=await sha256Hex(unsigned);
 await assert.rejects(()=>replay(f),/FOUR_DIGIT_ACTION_EVENT_DATE_UNPARSEABLE/);
});
test('read-only retrospective replay workflow has no schedule, cloud credential or formal writer',async()=>{
 const [src,w]=await Promise.all([
  readFile('system2/scripts/replay_m09_ca_observed_negative_overlap_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-m09-ca-negative-overlap-20261014-readonly.yml','utf8')]);
 assert.match(w,/permissions:\s*\n\s*contents: read\s*\n\s*actions: read/);
 assert.doesNotMatch(w,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.doesNotMatch(src,/wrangler|api\.cloudflare\.com|INSERT INTO|git push|CREATE TABLE/);
});
