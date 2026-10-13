import test from 'node:test';
import assert from 'node:assert/strict';
import {diagnoseSourceFirstHistoryBlockersV0_1 as diagnose}
 from '../runtime/a1_history_barrier_diagnostic_v0_1.mjs';
const day='2026-10-13',clock='2026-10-13T15:01:00Z',hash='a'.repeat(64);
const dates=Array.from({length:60},(_,i)=>{
 const d=new Date('2026-07-01T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
}).concat([day]);
const bar=(date,symbol)=>({symbol,market:'TWSE',date,priceSpace:'RAW',
 sourceRowHash:hash,availableAt:'2026-10-13T14:00:00Z',
 open:100,high:102,low:99,close:101,volumeShares:1000,tradeValue:100000});
function fixture(){
 const rows=['2330','2454','2317'].map(symbol=>({
  symbol,market:'TWSE',marketDate:day
 }));
 const observations=[
  {symbol:'2330',market:'TWSE',state:'INCOMPLETE',
   reasonCodes:['NO_CERTIFIED_PIT_61_SESSION_HISTORY']},
  {symbol:'2454',market:'TWSE',state:'INCOMPLETE',
   reasonCodes:['NO_CERTIFIED_PIT_61_SESSION_HISTORY']},
  {symbol:'2317',market:'TWSE',state:'INCOMPLETE',
   reasonCodes:['PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED']},
 ];
 const bySymbol={
  'TWSE|2454':{symbol:'2454',market:'TWSE',marketDate:day,providerMarketDate:day,
   priceSpace:'RAW',volumeUnit:'SHARES',originalProviderResponseVerified:true,
   originalResponseSha256:hash,observedAt:'2026-10-13T14:00:00Z',
   bars:dates.map(d=>bar(d,'2454'))}
 };
 bySymbol['TWSE|2454'].bars[3].close=null;
 return {bridge:{
  state:'STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED',marketDate:day,
  freezeAtUtc:clock,auditReceiptHash:hash,
  sourceLedger:{schemaVersion:'S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1',
   ledgerSha256:hash,sourceOrdinarySymbolCount:3,observations:rows},
  evaluation:{evaluation:{
   schemaVersion:'S2_SOURCE_FIRST_SM_EVALUATION_V0_1',
   marketDate:day,universeCount:3,incompleteCount:3,
   evaluationHash:hash,observations
  }}
 },sourceReceipt:{marketDate:day,receivedMarketDateCount:122,
  sourceRowSymbolWindowsCompleteCount:1,
  bySymbol,calendar:{tradingDates:dates}}};
}
test('missing history vs invalid historical OHLCV vs CA remain separate',async()=>{
 const d=await diagnose(fixture());
 assert.equal(d.corporateActionPitUnverifiedCount,1);
 assert.equal(d.remainingHistoryAndOtherIncompleteCount,2);
 assert.equal(d.reasonBreakdown.find(r=>r.reason==='NO_OFFICIAL_61_SESSION_SYMBOL_HISTORY').count,1);
 assert.equal(d.reasonBreakdown.find(r=>r.reason==='BAR_OHLCV_NONTRADE_OR_PRICE_INTEGRITY_INCOMPLETE').count,1);
 assert.equal(d.selectedCount,null);assert.equal(d.noUnknownPITAutoCleared,true);
});
test('future observedAt or bar availableAt is identified, never backdated',async()=>{
 const f=fixture();const h=f.sourceReceipt.bySymbol['TWSE|2454'];
 h.bars[3].close=101;h.bars[2].availableAt='2026-10-13T16:00:00Z';
 const d=await diagnose(f);assert.equal(d.reasonBreakdown.find(x=>
  x.reason==='BAR_PUBLIC_AVAILABILITY_AFTER_EVALUATION_OR_INVALID').count,1);
});
test('off by one history date is not a valid 61bar input',async()=>{
 const f=fixture();const h=f.sourceReceipt.bySymbol['TWSE|2454'];
 h.bars[3].date='2026-10-12';
 const d=await diagnose(f);assert.equal(d.reasonBreakdown.find(x=>
  x.reason==='BAR_SESSION_ORDER_OR_RAW_LINEAGE_MISMATCH').count,1);
});
test('malformed universe or coverage cannot produce plausible diagnosis',async()=>{
 const f=fixture();f.sourceReceipt.sourceRowSymbolWindowsCompleteCount=2;
 await assert.rejects(()=>diagnose(f),/SOURCE_OR_STAGE1_IDENTITY_INVALID/);
});
test('no authority, no thresholds, no Cloudflare access',async()=>{
 const {readFile}=await import('node:fs/promises');
 const c=await readFile('system2/runtime/a1_history_barrier_diagnostic_v0_1.mjs','utf8');
 assert.doesNotMatch(c,/api\.cloudflare\.com|git push|INSERT INTO|BUY_ELIGIBLE/);
});
