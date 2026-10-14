import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildPreliminaryUserReportV0_1 as report}
 from '../runtime/preliminary_daily_user_report_v0_1.mjs';
const h='a'.repeat(64);
async function sample(blocked=false){
 const base={
  schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  watchVersion:'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2',
  marketDate:'2026-10-13',observedAtUtc:'2026-10-13T22:21:06.029Z',
  originalSourceReceiptHash:h,independentSourceAuditHash:h,
  state:blocked?'BLOCKED_SOURCE_INCOMPLETE':
    'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION',
  ordinaryEquityOnlyUniverseCertified:false,
  officialUniverseCount:blocked?null:3,
  historyContinuityUsableCount:blocked?null:1,
  preliminaryMatchedCount:blocked?null:1,
  displayedCount:blocked?0:1,withheldHistoryCount:blocked?null:1,
  anomalyQuarantinedCount:blocked?null:1,
  depositaryReceiptQuarantinedCount:blocked?null:0,
  watchlist:blocked?[]:[{symbol:'3597',companyName:'映興',market:'TPEX',
   marketDate:'2026-10-13',fiveSessionReturnPct:59.60591,
   sourceRowHash:h,aboveSma20:true,positiveFiveSessionReturn:true,
   companyActionPitStatus:'UNKNOWN_NOT_CLEARED',
   instrumentClassPITStatus:'ORDINARY_EQUITY_CLASS_NOT_INDEPENDENTLY_ATTESTED',
   formalStrategyValidity:null,strategyRank:null,triggerPrice:null,
   stop:null,targets:null}],
  selectedCount:null,zeroPickDay:null,finalSelectionAuthorized:false,
  historicalBacktestCertified:false,frozenWritten:false,
  orderAuthorized:false,pushAuthorized:false,
 };
 return {...base,receiptHash:await sha256Hex(base)};
}
test('human format reveals explicit source date + company identity with no buy rank',async()=>{
 const a=await report({receipt:await sample()});
 assert.match(a.markdown,/映興/);assert.match(a.markdown,/3597/);
 assert.match(a.markdown,/\+59\.61%/);
 assert.match(a.markdown,/2026-10-13/);assert.match(a.markdown,/不是策略排名/);
 assert.equal(a.metadata.selectedCount,null);assert.equal(a.metadata.frozenWritten,false);
});
test('source-incomplete is not a certified zero-pick',async()=>{
 const a=await report({receipt:await sample(true)});
 assert.match(a.markdown,/來源不完整/);assert.equal(a.metadata.displayedCount,0);
});
test('tampered row without hash change refused',async()=>{
 const x=await sample();x.watchlist[0].companyName='改名';
 await assert.rejects(()=>report({receipt:x}),/SOURCE_HASH_TAMPERED/);
});
test('signed fake formal rank still denied',async()=>{
 const x=await sample();x.watchlist[0].strategyRank=1;
 const {receiptHash,...rest}=x;x.receiptHash=await sha256Hex(rest);
 await assert.rejects(()=>report({receipt:x}),/WATCHLIST_ROW_UNAUTHORIZED/);
});
test('source denominator mismatch denied',async()=>{
 const x=await sample();x.withheldHistoryCount=3;
 const {receiptHash,...rest}=x;x.receiptHash=await sha256Hex(rest);
 await assert.rejects(()=>report({receipt:x}),/SOURCE_UNIVERSE_DENOMINATOR_INVALID/);
});
