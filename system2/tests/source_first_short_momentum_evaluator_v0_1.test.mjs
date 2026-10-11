// Synthetic-only regression. Fixture "provider verified" flags are NOT real provider audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateSourceFirstShortMomentumV0_1 as evaluate} from '../runtime/source_first_short_momentum_evaluator_v0_1.mjs';
const H='a'.repeat(64),DAY='2026-10-12',clock='2026-10-12T15:55:00Z';
function dates(){
 const start=new Date('2026-08-13T00:00:00Z');
 return Array.from({length:61},(_,i)=>{const d=new Date(start.getTime()+i*86400e3);return d.toISOString().slice(0,10)});
}
const ds=dates();
assert.equal(ds.at(-1),DAY);
function make(){
 const bars=ds.map((date,i)=>{const close=100+i;return {
    date,marketDate:date,symbol:'2330',market:'TWSE',priceSpace:'RAW',
    open:close-0.2,high:close+0.5,low:close-0.5,close,
    volumeShares:1000000+i*10000,tradeValue:(1000000+i*10000)*close,
    sourceRowHash:i===60?H:'b'.repeat(64),availableAt:date+'T06:00:00Z',
   };});
 const sourceLedger={
   schemaVersion:'S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1',sourceState:'READY',
   ledgerSha256:H,sourceBatchHash:H,marketDate:DAY,
   observedAt:'2026-10-12T15:30:00Z',sourceOrdinarySymbolCount:1,
   selectionState:'NOT_EXECUTED_REQUIRED_PIT_HISTORY_AND_CONTINUITY_MISSING',
   observations:[{symbol:'2330',companyName:'臺灣積體電路製造',market:'TWSE',marketDate:DAY,
     open:bars.at(-1).open,high:bars.at(-1).high,low:bars.at(-1).low,
   close:bars.at(-1).close,volumeShares:bars.at(-1).volumeShares,
   tradeValue:bars.at(-1).tradeValue,sourceRowHash:H}],
 };
 return {sourceLedger,evaluationAtUtc:clock,
   independentOriginalVerification:true,
   calendarReceipt:{state:'READY',verifiedOfficialReadback:true,marketDate:DAY,
     observedAt:'2026-10-12T15:32:00Z',originalCalendarHash:H,tradingDates:ds},
   historyBySymbol:{'2330':{symbol:'2330',market:'TWSE',marketDate:DAY,providerMarketDate:DAY,
     priceSpace:'RAW',volumeUnit:'SHARES',originalProviderResponseVerified:true,
     originalResponseSha256:H,observedAt:'2026-10-12T15:31:00Z',
     sourceId:'OFFICIAL_TEST_FIXTURE',sourceName:'FAKE_FIXTURE_NOT_LIVE',bars}},
   continuityBySymbol:{'2330':{symbol:'2330',marketDate:DAY,
     state:'CLEAR_NO_ACTION',originalCorporateActionEvidenceVerified:true,
     evidenceSha256:H,startSession:ds[0],endSession:DAY,availableAt:'2026-10-12T15:30:00Z'}},
 };
}
test('with fabricated complete inputs: actual pre-existing Stage1 evaluator computes qualified shadow observation, NOT a final pick',async()=>{
 const a=await evaluate(make());
 assert.equal(a.state,'EVALUATED_OFFLINE_RESEARCH_ONLY',JSON.stringify(a));
 assert.equal(a.universeCount,1);assert.equal(a.assessedCount,1);
 assert.equal(a.incompleteCount,0);assert.equal(a.qualifiedNotSelectedCount,1);
 assert.equal(a.observations[0].state,'QUALIFIED_NOT_SELECTED');
 assert.equal(a.observations[0].strategyValidity,'VALID');
 assert.equal(a.observations[0].entryReadiness,'BUY_ELIGIBLE');
 assert.equal(a.observations[0].entryPlan,null);
 assert.equal(a.selectedCount,null);assert.equal(a.zeroPickDay,null);
 assert.equal(a.finalSelectionEnabled,false);assert.equal(a.durableFrozenDecisionReadbackVerified,false);
 assert.equal(a.independentProviderAuditCompletedByThisModule,false);
});
test('stable deterministic hash for replay of exactly the same evidence',async()=>{
 const a=await evaluate(make()),b=await evaluate(make());
 assert.equal(a.evaluationHash,b.evaluationHash);
});
test('missing original provider bytes audit blocks any claimed complete selection',async()=>{
 const p=make();p.independentOriginalVerification=false;
 const a=await evaluate(p);assert.equal(a.state,'INCOMPLETE_SOURCE_OR_STRATEGY_EVIDENCE');
 assert.equal(a.qualifiedCandidateCount,null);assert.equal(a.selectedCount,null);
});
test('61 official sessions required, no calendar gap laundering',async()=>{
 const p=make();p.calendarReceipt.tradingDates.pop();
 const a=await evaluate(p);assert.equal(a.state,'INCOMPLETE_SOURCE_OR_STRATEGY_EVIDENCE');
 assert(a.blockers.includes('OFFICIAL_61_SESSION_CALENDAR_UNVERIFIED'));
});
test('source/prior-history current close mismatch is not qualified',async()=>{
 const p=make();p.historyBySymbol['2330'].bars.at(-1).close=200;
 const a=await evaluate(p);assert.equal(a.incompleteCount,1);
 assert.equal(a.observations[0].reasonCodes[0],'CURRENT_HISTORY_VS_DAILY_SOURCE_HASH_PRICE_VOLUME_MISMATCH');
});
test('real short strategy cannot use UNKNOWN corporate-action continuity',async()=>{
 const p=make();p.continuityBySymbol['2330'].state='UNVERIFIED';
 const a=await evaluate(p);assert.equal(a.incompleteCount,1);
 assert.equal(a.observations[0].reasonCodes[0],'PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED');
});
test('post-evaluation availability is not PIT eligible',async()=>{
 const p=make();p.historyBySymbol['2330'].bars.at(0).availableAt='2026-10-12T16:00:00Z';
 const a=await evaluate(p);assert.equal(a.incompleteCount,1);assert.equal(a.qualifiedNotSelectedCount,0);
});
test('one missing bar blocks this stock only and never claims zero-pick',async()=>{
 const p=make();p.historyBySymbol['2330'].bars.pop();
 const a=await evaluate(p);assert.equal(a.incompleteCount,1);
 assert.equal(a.selectedCount,null);assert.equal(a.zeroPickDay,null);
});
test('nontradable current close must not create a BUY_ELIGIBLE result',async()=>{
 const p=make();p.sourceLedger.observations[0].close=null;
 const a=await evaluate(p);assert.equal(a.incompleteCount,1);
});
test('source date/clock mismatch is rejected before family assessment',async()=>{
 const p=make();p.sourceLedger.marketDate='2026-10-09';
 const a=await evaluate(p);assert.equal(a.state,'INCOMPLETE_SOURCE_OR_STRATEGY_EVIDENCE');
});

test('independently reconciled alternate original official row hash may produce the same OHLCV observation',async()=>{
 const p=make();
 p.historyBySymbol['2330'].bars.at(-1).sourceRowHash='b'.repeat(64);
 p.historyBySymbol['2330'].independentCurrentDailyCrossSourceEquivalenceVerified=true;
 const a=await evaluate(p);
 assert.equal(a.state,'EVALUATED_OFFLINE_RESEARCH_ONLY',JSON.stringify(a));
 assert.equal(a.qualifiedNotSelectedCount,1);
});
test('alternate original row hash without independently attested parity cannot pass',async()=>{
 const p=make();p.historyBySymbol['2330'].bars.at(-1).sourceRowHash='b'.repeat(64);
 const a=await evaluate(p);assert.equal(a.incompleteCount,1);
});
test('a matching raw source hash cannot mask materially different OHLCV',async()=>{
 const p=make();p.historyBySymbol['2330'].bars.at(-1).tradeValue+=999;
 const a=await evaluate(p);assert.equal(a.incompleteCount,1);
});
