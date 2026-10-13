import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {buildSystem2PreliminaryDailyWatchV0_1 as watch}
 from '../runtime/preliminary_daily_pv_watch_v0_1.mjs';
const at='2026-10-13T15:45:00Z',sha='a'.repeat(64),date='2026-10-13';
const dates=Array.from({length:60},(_,i)=>{
 const d=new Date('2026-07-01T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
}).concat([date]);
async function sample({missing=false,caJump=false,negative=false}={}){
 const makeBars=sym=>dates.map((day,i)=>{
  const close=(negative?200-i:100+i)+(caJump&&i>=30?120:0);
  return {symbol:sym,market:'TWSE',date:day,marketDate:day,priceSpace:'RAW',
    open:close,high:close+1,low:close-1,close,volumeShares:1000,
    tradeValue:close*1000,sourceRowHash:sha,
    availableAt:'2026-10-13T15:00:00Z'};
 });
 const sourceReceipt={
  schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate:date,calendar:{tradingDates:dates},
  receivedMarketDateCount:122,sourceRowSymbolWindowsCompleteCount:missing?0:1,
  bySymbol:missing?{}:{'TWSE|2330':{
   symbol:'2330',market:'TWSE',marketDate:date,priceSpace:'RAW',
   originalProviderResponseVerified:true,originalResponseSha256:sha,
   observedAt:'2026-10-13T15:00:00Z',bars:makeBars('2330')
  }},
 };
 const keys=['schemaVersion','marketDate','calendar','state','requestCount',
 'plannedMarketDateRequests','receivedMarketDateCount','sourceWindowFirstDate',
 'sourceWindowLastDate','sourceRowSymbolWindowsCompleteCount','markets',
 'receipts','errors','bySymbol','sourceQuotaD1Reads','sourceQuotaD1Writes',
 'assessorExecuted','qualifiedCandidates','selectedCount',
 'frozenDecisionsDurablyReadBack','independentProviderAudited','noSystem1RuntimeMutations'];
 Object.assign(sourceReceipt,{
  state:'SOURCE_OBSERVED_UNAUDITED',requestCount:122,
  plannedMarketDateRequests:122,sourceWindowFirstDate:dates[0],
  sourceWindowLastDate:date,markets:['TWSE','TPEX'],receipts:[],errors:[],
  sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,assessorExecuted:false,
  qualifiedCandidates:null,selectedCount:null,
  frozenDecisionsDurablyReadBack:false,independentProviderAudited:false,
  noSystem1RuntimeMutations:true
 });
 const hashbase=official61SessionSourceReceiptHashBaseV0_1(sourceReceipt);
 sourceReceipt.receiptHash=await sha256Hex(hashbase);
 const row={symbol:'2330',market:'TWSE',marketDate:date,companyName:'台積電',
    open:negative?140:159+(caJump?120:0),high:negative?141:160+(caJump?120:0),
    low:negative?139:158+(caJump?120:0),close:negative?140:160+(caJump?120:0),
    volumeShares:1000,tradeValue:(negative?140:160+(caJump?120:0))*1000,
    sourceRowHash:sha};
 // Align exact current OHLCV with latest recorded original.
 if(!missing){
   const b=sourceReceipt.bySymbol['TWSE|2330'].bars.at(-1);
   Object.assign(row,{open:b.open,high:b.high,low:b.low,close:b.close,
     volumeShares:b.volumeShares,tradeValue:b.tradeValue});
 }
 const bridge={state:'SOURCE_LEDGER_READY_STRATEGY_PIT_NOT_CERTIFIED',
   marketDate:date,freezeAtUtc:at,
   sourceReceiptHash:sourceReceipt.receiptHash,auditReceiptHash:sha,
   selectedCount:null,zeroPickDay:null,selectionAuthorized:false,
   frozenDecisionWritten:false,
   auditedSourceOnly:true,actualSourcePairs:122,requiredSourcePairs:122,
   sourceLedger:{sourceState:'READY',marketDate:date,ledgerSha256:sha,
     sourceOrdinarySymbolCount:1,observations:[row]}};
 return {bridge,sourceReceipt};
}
test('present-only rising price above SMA produces CA-UNKNOWN preliminary watch',async()=>{
 const r=await watch(await sample());
 assert.equal(r.preliminaryMatchedCount,1);
 assert.equal(r.watchlist[0].symbol,'2330');
 assert.equal(r.watchlist[0].companyActionPitStatus,'UNKNOWN_NOT_CLEARED');
 assert.equal(r.watchlist[0].formalStrategyValidity,null);
 assert.equal(r.watchlist[0].strategyRank,null);
 assert.equal(r.selectedCount,null);assert.equal(r.frozenWritten,false);
 assert.match(r.receiptHash,/^[0-9a-f]{64}$/);
});
test('TWSE official four-digit TDR -DR company name cannot enter ordinary-equity preview',async()=>{
 const fixture=await sample();
 fixture.bridge.sourceLedger.observations[0].companyName='美德醫療-DR';
 const r=await watch(fixture);
 assert.equal(r.watchVersion,'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2');
 assert.equal(r.schemaVersion,'S2_PRELIMINARY_PV_WATCH_V0_2');
 assert.equal(r.officialUniverseCount,1);
 assert.equal(r.depositaryReceiptQuarantinedCount,1);
 assert.equal(r.historyContinuityUsableCount,0);
 assert.equal(r.preliminaryMatchedCount,0);
 assert.equal(r.ordinaryEquityOnlyUniverseCertified,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.historicalBacktestCertified,false);
});
test('full-width hyphen -DR quote name is also quarantined, and absence of suffix is not proof of ordinary share',async()=>{
 const fixture=await sample();
 fixture.bridge.sourceLedger.observations[0].companyName='美德醫療－DR';
 const r=await watch(fixture);
 assert.equal(r.depositaryReceiptQuarantinedCount,1);
 const ordinary=await sample();
 ordinary.bridge.sourceLedger.observations[0].companyName='台積電';
 const ordinaryR=await watch(ordinary);
 assert.equal(ordinaryR.depositaryReceiptQuarantinedCount,0);
 assert.equal(ordinaryR.preliminaryMatchedCount,1);
 assert.equal(ordinaryR.watchlist[0].instrumentClassPITStatus,
  'ORDINARY_EQUITY_CLASS_NOT_INDEPENDENTLY_ATTESTED');
});
test('falling trend does not force a watchlist selection',async()=>{
 const r=await watch(await sample({negative:true}));
 assert.equal(r.preliminaryMatchedCount,0);
 assert.equal(r.zeroPickDay,null);
});
test('suspect 120pct raw discontinuity quarantined even with rising momentum',async()=>{
 const r=await watch(await sample({caJump:true}));
 assert.equal(r.anomalyQuarantinedCount,1);
 assert.equal(r.watchlist.length,0);
});
test('missing full 61 historical bars withheld rather than backfilled',async()=>{
 const r=await watch(await sample({missing:true}));
 assert.equal(r.withheldHistoryCount,1);
 assert.equal(r.preliminaryMatchedCount,0);
});
test('post-evaluation publicly unavailable bar prevents preliminary inclusion',async()=>{
 const f=await sample();
 f.sourceReceipt.bySymbol['TWSE|2330'].bars[2].availableAt='2026-10-14T10:00:00Z';
 f.sourceReceipt.receiptHash=await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(f.sourceReceipt));
 f.bridge.sourceReceiptHash=f.sourceReceipt.receiptHash;
 const r=await watch(f);
 assert.equal(r.withheldHistoryCount,1);
});
test('corrupt source receipt/identity fails regardless of positive momentum',async()=>{
 const f=await sample();f.sourceReceipt.bySymbol['TWSE|2330'].bars[5].close=999;
 await assert.rejects(()=>watch(f),/SOURCE_AUDIT_OR_HASH_NOT_ACCEPTED/);
});
test('121/122 source is explicit blocked, not a research zero pick',async()=>{
 const {bridge,sourceReceipt}=await sample();
 bridge.state='BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER';
 bridge.actualSourcePairs=121;bridge.sourceLedger=null;bridge.evaluation=null;
 bridge.blockers=['INDEPENDENT_SOURCE_AUDIT_NOT_122_OF_122'];
 const r=await watch({bridge,sourceReceipt});
 assert.equal(r.state,'BLOCKED_SOURCE_INCOMPLETE');
 assert.equal(r.preliminaryMatchedCount,null);
 assert.equal(r.selectedCount,null);
});
test('T+1 05:15 research-only source can create late preliminary but not Shadow',async()=>{
 const s=await sample();
 s.bridge.state='SOURCE_LEDGER_DELAYED_PRELIMINARY_ONLY';
 s.bridge.freezeAtUtc='2026-10-13T21:15:00Z';
 s.bridge.blockers=['STAGE1_CLOCK_EXPIRED_PRELIMINARY_ONLY'];
 const r=await watch(s);
 assert.equal(r.state,'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION');
 assert.equal(r.lateMorningObservationNotBackdated,true);
 assert.equal(r.preliminaryMatchedCount,1);
 assert.equal(r.finalSelectionAuthorized,false);
 assert.equal(r.selectedCount,null);
});
test('never creates authority for backtest, Frozen, orders, System1',async()=>{
 const r=await watch(await sample());
 assert.equal(r.historicalBacktestCertified,false);
 assert.equal(r.finalSelectionAuthorized,false);
 assert.equal(r.orderAuthorized,false);
 assert.equal(r.system1FormalTouched,false);
 assert.equal(r.cloudflareD1Writes,0);
});
