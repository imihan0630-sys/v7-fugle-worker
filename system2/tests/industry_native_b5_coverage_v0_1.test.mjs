import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildSystem2NativeB5CoverageV0_1 as build} from '../runtime/industry_native_b5_coverage_v0_1.mjs';
const A='a'.repeat(64),B='b'.repeat(64),C='c'.repeat(64),D='d'.repeat(64),T='2026-10-16';
const sign=async x=>({...x,receiptHash:await sha256Hex(x)});
const row=(market,symbol,code,label,extra={})=>({
 market,symbol,officialIndustryCode:code,officialIndustryLabel:label,
 firstKnownAtUtc:T+'T14:00:00Z',availableAtUtc:T+'T14:05:00Z',
 observedAtUtc:T+'T14:10:00Z',effectiveFrom:null,effectiveTo:null,
 supersededBy:null,sourceRowHash:C,...extra
});
async function fixture(){
 const u=await sign({
  schemaVersion:'S2_A1_FOUR_DIGIT_UNIVERSE_HANDOFF_V0_1',
  marketDate:T,observedAtUtc:T+'T14:15:00Z',
  originalSourceReceiptHash:A,independentSourceAuditHash:B,
  ordinaryShareClassCertified:false,fourDigitInstrumentCount:5,
  rows:[['TWSE','8046'],['TWSE','3189'],['TWSE','2330'],
    ['TPEX','1595'],['TPEX','3131']].map(([market,symbol])=>({market,symbol,sourceRowHash:C}))
 });
 const tw=await sign({
  schemaVersion:'S2_DATA_NATIVE_B5_PROFILE_SOURCE_HANDOFF_V0_1',
  market:'TWSE',marketDate:T,sourceObservedAtUtc:T+'T14:25:00Z',
  originalNativeSourceHash:D,sourceFamily:'OFFICIAL_B5_COMPANY_PROFILE',
  rows:[row('TWSE','8046','28','電子零組件業'),
        row('TWSE','3189','24','半導體業')]
 });
 const tp=await sign({
  schemaVersion:'S2_DATA_NATIVE_B5_PROFILE_SOURCE_HANDOFF_V0_1',
  market:'TPEX',marketDate:T,sourceObservedAtUtc:T+'T14:25:00Z',
  originalNativeSourceHash:D,sourceFamily:'OFFICIAL_B5_COMPANY_PROFILE',
  rows:[row('TPEX','1595','24','半導體業'),
        row('TPEX','3131','24','半導體業')]
 });
 return {u,tw,tp};
}
const run=(f,profiles=[f.tw,f.tp])=>build({
 universeReceipt:f.u,profileReceipts:profiles,generatedAtUtc:T+'T16:00:00Z'
});
test('exact symbol denominator TWSE 3 / TPEx 2, mapped 4, missing 1, no ordinary-share claim',async()=>{
 const f=await fixture(),r=await run(f);
 assert.equal(r.fourDigitInstrumentCount,5);
 assert.equal(r.provisionalCurrentB5MappedCount,4);
 assert.equal(r.marketSummaries[0].sourceFourDigitInstrumentCount,3);
 assert.equal(r.marketSummaries[0].provisionalClassifiedCount,2);
 assert.equal(r.marketSummaries[0].unknownCount,1);
 assert.equal(r.marketSummaries[1].provisionalClassifiedCount,2);
 assert.equal(r.marketSummaries[1].conflictCount,0);
 assert.equal(r.fullMarketIndependentlyCertifiedB5Coverage,null);
 assert.equal(r.ordinaryShareUniverseDenominator,null);
 assert.equal(r.selectedCount,null);assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);assert.equal(r.system1FormalCoreChanged,false);
 assert.equal(r.receiptHash,await sha256Hex(Object.fromEntries(Object.entries(r).filter(([k])=>k!=='receiptHash'))));
});
test('missing TPEx source is incomplete not zero company selection or certified zero',async()=>{
 const f=await fixture(),r=await run(f,[f.tw]);
 assert.equal(r.profileReceiptsCount,1);
 assert.equal(r.marketSummaries[1].unknownCount,2);
 assert.equal(r.marketSummaries[1].officialProfileSourcePresent,false);
 assert.equal(r.marketSummaries[1].provisionalClassifiedCount,0);
 assert.equal(r.sourceJoinState,'PROFILE_SOURCE_INCOMPLETE_DO_NOT_ZERO_SELECTION');
 assert.equal(r.selectedCount,null);
});
test('duplicate 1595 official rows count conflict not silent last-write-wins',async()=>{
 const f=await fixture();
 f.tp.rows.push(row('TPEX','1595','28','電子零組件業'));
 const {receiptHash,...without}=f.tp;f.tp=await sign(without);
 const r=await run(f);
 assert.equal(r.marketSummaries[1].conflictCount,1);
 assert.equal(r.marketSummaries[1].unknownCount,1);
 assert.equal(r.observations.find(x=>x.symbol==='1595').officialIndustryCode,null);
});
test('missing native industry code is UNKNOWN rather than fabricated code from sector name',async()=>{
 const f=await fixture();f.tw.rows[0].officialIndustryCode=null;
 const {receiptHash,...without}=f.tw;f.tw=await sign(without);
 const r=await run(f);
 assert.equal(r.marketSummaries[0].missingCodeOrLabelCount,1);
 assert.equal(r.observations.find(x=>x.symbol==='8046').state,'B5_CODE_OR_LABEL_UNKNOWN');
});
test('native B5 captured after T23:45 is late descriptive only, cannot infer earlier source eligibility',async()=>{
 const f=await fixture();f.tw.sourceObservedAtUtc='2026-10-17T00:00:00Z';
 const {receiptHash,...without}=f.tw;f.tw=await sign(without);
 const r=await build({universeReceipt:f.u,profileReceipts:[f.tw,f.tp],generatedAtUtc:'2026-10-17T01:00:00Z'});
 assert.equal(r.marketSummaries[0].sourceAfterPreferredTCut,true);
 assert.equal(r.marketSummaries[0].lateOrClockUnusableCount,2);
 assert.equal(r.marketSummaries[0].provisionalClassifiedCount,0);
});
test('knownAt/availableAt after cutoff or future effective date cannot backfill past sector',async()=>{
 const f=await fixture();f.tw.rows[0].firstKnownAtUtc=T+'T15:55:00Z';
 f.tw.rows[0].availableAtUtc=T+'T15:55:00Z';
 f.tw.rows[0].observedAtUtc=T+'T16:00:00Z';
 f.tw.sourceObservedAtUtc=T+'T16:30:00Z';
 f.tw.rows[1].effectiveFrom='2026-11-01';
 const {receiptHash,...without}=f.tw;f.tw=await sign(without);
 const r=await build({universeReceipt:f.u,profileReceipts:[f.tw,f.tp],generatedAtUtc:T+'T17:00:00Z'});
 assert.equal(r.marketSummaries[0].lateOrClockUnusableCount,2);
 assert.equal(r.observations.find(x=>x.symbol==='3189').officialIndustryLabel,null);
});
test('market or date mismatch, forged profile hash, invalid source native rows are refused',async()=>{
 const f=await fixture();
 const wrong=structuredClone(f.tw);wrong.marketDate='2026-10-15';
 await assert.rejects(()=>run(f,[wrong,f.tp]),/PROFILE_ORIGINAL_RECEIPT_INVALID/);
 const bad=structuredClone(f.tw);bad.rows[0].officialIndustryLabel='偽造';
 await assert.rejects(()=>run(f,[bad,f.tp]),/PROFILE_ORIGINAL_RECEIPT_INVALID/);
 const z=structuredClone(f.tw);z.rows[0].market='TPEX';
 const {receiptHash,...x}=z;
 const invalidRowReceipt=await sign(x);
 await assert.rejects(()=>run(f,[invalidRowReceipt,f.tp]),/PROFILE_ROW_NATIVE_NORMALIZATION_INVALID/);
});
test('replayed universe with duplicated market+symbol or invalid digest denied',async()=>{
 const f=await fixture(),u=structuredClone(f.u);
 u.rows[2]={...u.rows[0]};const {receiptHash,...x}=u;f.u=await sign(x);
 await assert.rejects(()=>run(f),/SOURCE_UNIVERSE_IDENTITY_INVALID/);
 const g=await fixture();g.u.rows.push({market:'TWSE',symbol:'9103',sourceRowHash:C});
 await assert.rejects(()=>run(g),/SOURCE_UNIVERSE_SIGNED_EXACT_SCOPE_REQUIRED/);
});
test('profile may not pretend first-known earlier than observed availability receipt',async()=>{
 const f=await fixture();f.tp.rows[0].observedAtUtc=T+'T15:00:00Z';
 const {receiptHash,...x}=f.tp;f.tp=await sign(x);
 await assert.rejects(()=>run(f),/PROFILE_ROW_NATIVE_NORMALIZATION_INVALID/);
});
test('no original profiles does not block existing source-only preview or create invented industry counts',async()=>{
 const f=await fixture();const r=await run(f,[]);
 assert.equal(r.marketSummaries[0].unknownCount,3);
 assert.equal(r.marketSummaries[1].unknownCount,2);
 assert.equal(r.sourceJoinState,'PROFILE_SOURCE_INCOMPLETE_DO_NOT_ZERO_SELECTION');
 assert.equal(r.independentB5OriginalAuditNotYetBound,true);
 assert.equal(r.strategyRanksAltered,false);
});
