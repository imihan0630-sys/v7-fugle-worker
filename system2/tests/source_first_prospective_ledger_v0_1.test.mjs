import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSourceFirstProspectiveLedgerV0_1 as build} from '../migration/source_first_prospective_ledger_v0_1.mjs';
import {runPublicSourceFirstLedgerV0_1 as runner} from '../scripts/run_source_first_prospective_ledger_v0_1.mjs';
const h='f'.repeat(64),t='2026-10-12T15:44:01Z',freeze='2026-10-12T15:45:00Z',day='2026-10-12';
const source=()=>({state:'READY',marketDate:day,observedAt:t,decisionTimestamp:t,
 transports:{TWSE:{ok:true,payloadHash:h},TPEX:{ok:true,payloadHash:h}},
 snapshotBatch:{state:'READY',pointInTimeEligible:true,marketDate:day,decisionTimestamp:t,
  batchHash:h,ordinarySymbolCount:1,symbols:['2330'],
  bySymbol:{'2330':{symbol:'2330',companyName:'臺灣積體電路製造',market:'TWSE',marketDate:day,
   open:100,high:103,low:99,close:102,volumeShares:1000000,tradeValue:102000000,
   sourceRowHash:h,provenance:{observedAt:t,availableAt:t,sourceId:'TWSE_DAILY'}}},
  blockerCodes:[]},
});
const run=x=>build({marketDate:day,source:x,freezeAtUtc:freeze});
test('prospective official-input receipt captures an original normalized OHLCV row but does not claim selection',async()=>{
 const r=await run(source());assert.equal(r.sourceState,'READY');assert.equal(r.sourceOrdinarySymbolCount,1);
 assert.equal(r.observations[0].symbol,'2330');assert.equal(r.observations[0].sourceRowHash,h);
 assert.equal(r.selectionState,'NOT_EXECUTED_REQUIRED_PIT_HISTORY_AND_CONTINUITY_MISSING');
 assert.equal(r.zeroPickDay,null);assert.equal(r.qualifiedCandidateCount,null);assert.equal(r.selectedCount,null);
 assert.equal(r.realQualifiedStockSelectionPerformed,false);assert.equal(r.sourceD1Reads,0);assert.equal(r.sourceD1Writes,0);
 assert(/^[a-f0-9]{64}$/.test(r.ledgerSha256));
});
test('deterministic frozen fingerprint on equal inputs',async()=>{
 const a=await run(source()),b=await run(source());assert.equal(a.ledgerSha256,b.ledgerSha256);
});
test('missing provider snapshot is not zero picks',async()=>{
 const r=await run({state:'SOURCE_ERROR',marketDate:day});assert.equal(r.sourceState,'BLOCKED');
 assert.equal(r.zeroPickDay,null);assert.equal(r.sourceOrdinarySymbolCount,null);
});
test('missing TPEx official payload hash blocks acceptance',async()=>{
 const x=source();delete x.transports.TPEX;
 const r=await run(x);assert.equal(r.sourceState,'BLOCKED');
 assert(r.sourceBlockers.includes('BOTH_OFFICIAL_MARKET_SOURCE_HASHES_MISSING'));
});
test('wrong market date prevents stale HTTP 200 source reuse',async()=>{
 const x=source();x.marketDate='2026-10-09';
 const r=await run(x);assert.equal(r.sourceState,'BLOCKED');
});
test('clock observed later than freeze can never backdate',async()=>{
 const x=source();x.observedAt='2026-10-12T15:46:00Z';
 const r=await run(x);assert.equal(r.sourceState,'BLOCKED');
});
test('per-symbol availableAt after observation blocked',async()=>{
 const x=source();x.snapshotBatch.bySymbol['2330'].provenance.availableAt='2026-10-12T15:44:20Z';
 const r=await run(x);assert.equal(r.sourceState,'BLOCKED');
 assert(r.sourceBlockers.includes('PER_SYMBOL_SOURCE_PIT_CLOCK_UNVERIFIED'));
});
test('malformed row data cannot become a daily candidate',async()=>{
 const x=source();x.snapshotBatch.bySymbol['2330'].close=-3;
 const r=await run(x);assert.equal(r.sourceState,'BLOCKED');
 assert(r.sourceBlockers.includes('SOURCE_SYMBOL_ROW_INTEGRITY_INCOMPLETE'));
});
test('full symbol denominator missing is not a certified zero-pick day',async()=>{
 const x=source();x.snapshotBatch.ordinarySymbolCount=2;
 const r=await run(x);assert.equal(r.sourceState,'BLOCKED');assert.equal(r.zeroPickDay,null);
});
test('create only a factual observed receipt from injected current-date source, not orders',async()=>{
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const clock=new Date(Date.now()-1000).toISOString();
 const b={state:'SOURCE_ERROR',marketDate:today,observedAt:clock,snapshotBatch:null};
 const r=await runner({marketDate:today,fetchSnapshot:async()=>b});
 assert.equal(r.sourceState,'BLOCKED');assert.equal(r.livePush,false);assert.equal(r.orders,false);
 assert.equal(r.storageClass,'GITHUB_ACTIONS_TEMPORARY_ARTIFACT_NOT_DURABLE_FROZEN_DECISION');
});
test('cannot manufacture historical daily observation by rerunning an earlier market date',async()=>{
 await assert.rejects(()=>runner({marketDate:'1999-01-01',fetchSnapshot:async()=>source()}),/PROSPECTIVE_SAME_TAIPEI_DATE_ONLY/);
});

test('official no-trade stock remains in source denominator with UNKNOWN trading eligibility',async()=>{const x=source();x.snapshotBatch.bySymbol['2330'].close=null;x.snapshotBatch.bySymbol['2330'].volumeShares=null;x.snapshotBatch.bySymbol['2330'].priceState='NO_USABLE_PRICE';const r=await run(x);assert.equal(r.sourceState,'READY');assert.equal(r.sourceOrdinarySymbolCount,1);assert.equal(r.noUsablePriceSymbolCount,1);assert.equal(r.observations[0].close,null);assert.equal(r.zeroPickDay,null);assert.equal(r.realQualifiedStockSelectionPerformed,false);});
