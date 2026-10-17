import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {routeSystem2ThreeLayerSelectionV0_1 as route,
 SYSTEM2_THREE_LAYER_SELECTION_V0_1 as registry}
 from '../runtime/three_layer_selection_preview_router_v0_1.mjs';

const H='a'.repeat(64);
const row=(symbol,name='測試樣本')=>({
 symbol,companyName:name,market:'TWSE',marketDate:'2026-10-16',
 fiveSessionReturnPct:3,aboveSma20:true,positiveFiveSessionReturn:true,
 sourceRowHash:H,
 instrumentClassPITStatus:'ORDINARY_EQUITY_CLASS_NOT_INDEPENDENTLY_ATTESTED',
 companyActionPitStatus:'UNKNOWN_NOT_CLEARED',
 riskLevel:'PRELIMINARY_OBSERVATION_ONLY',
 formalStrategyValidity:null,strategyRank:null,
 triggerPrice:null,stop:null,targets:null
});
async function actualWatchShape(){
 const b={
  schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  watchVersion:'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2',
  state:'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION',
  marketDate:'2026-10-16',observedAtUtc:'2026-10-16T14:50:00Z',
  originalSourceReceiptHash:H,independentSourceAuditHash:H,
  selectedCount:null,zeroPickDay:null,finalSelectionAuthorized:false,
  finalStrategyRankApproved:false,frozenWritten:false,
  orderAuthorized:false,pushAuthorized:false,
  historicalBacktestCertified:false,ordinaryEquityOnlyUniverseCertified:false,
  originalFourDigitSecurityUniverse:true,
  officialUniverseCount:1974,preliminaryMatchedCount:580,displayedCount:2,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  watchlist:[row('2330','台積電'),row('2454','聯發科')]
 };
 return {...b,receiptHash:await sha256Hex(b)};
}
const event=(observed='2026-10-16T13:48:50Z')=>({
 symbol:'2330',market:'TWSE',eventDate:'2026-09-16',
 firstObservedAtUtc:observed,nativeRowSha256:'b'.repeat(64),
});
test('approved registry is exactly preview / daily as-of PIT-A / historical PIT-B',()=>{
 assert.deepEqual(registry.layers.map(x=>x.id),[
   'NON_PIT_PREVIEW','PIT_A_PROSPECTIVE','PIT_B_HISTORICAL']);
});
test('original physical-preliminary RECEIPT SHAPE can display bounded source observations only',async()=>{
 const r=await route({preliminaryReceipt:await actualWatchShape()});
 const {receiptHash,...unsigned}=r;
 assert.equal(await sha256Hex(unsigned),receiptHash);
 assert.equal(r.state,'SOURCE_BOUNDED_NON_PIT_PREVIEW');
 assert.equal(r.sourceUniverseCount,1974);
 assert.equal(r.preliminarySourceMatchedCount,580);
 assert.equal(r.displayedPreviewCount,2);
 assert.equal(r.ordinaryEquityUniverseCertified,false);
 assert.equal(r.previewRows[0].previewDisplayOrder,1);
 assert.equal(r.previewRows[0].status,'CA_OR_CLOCK_REVIEW_HOLD');
 assert.equal(r.previewRows[0].companyActionPositiveAtCut,true);
 assert.equal(r.previewRows[0].formalStrategyRank,null);
 assert.equal(r.previewRows[0].entryPrice,null);
 assert.equal(r.previewRows[0].warnings.includes('COMPANY_ACTION_PIT_NOT_CLEARED'),true);
 for(const k of ['pitACertificationGranted','pitBCertificationGranted','shadowAuthorized',
   'frozenD1Written','pushAuthorized','ordersAuthorized','formalPerformanceCertified'])
   assert.equal(r[k],false,k);
 assert.equal(r.strategySelectedCount,null);
 assert.equal(r.certifiedZeroPickDay,null);
 assert.equal(r.futureProspectiveForwardReturnsUsableForThisDecision,false);
});
test('2330 source-positive ex-dividend is a restrictive overlay, NEVER a CA negative',async()=>{
 const r=await route({preliminaryReceipt:await actualWatchShape(),
  positiveCorporateActionOverlays:[event()]});
 assert.equal(r.previewRows[0].status,'CA_OR_CLOCK_REVIEW_HOLD');
 assert.equal(r.previewRows[0].companyActionPositiveAtCut,true);
 assert.ok(r.previewRows[0].warnings.includes('KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED'));
 assert.equal(r.previewRows[1].status,'RESEARCH_OBSERVATION_ONLY');
 assert.equal(r.positiveEventsProvideOnlyVetoNotNoEventCert,true);
});
test('late event source cannot be inserted into earlier preview decision history',async()=>{
 const r=await route({preliminaryReceipt:await actualWatchShape(),
   positiveCorporateActionOverlays:[{...event('2026-10-17T10:00:00Z'),symbol:'2454'}]});
 assert.equal(r.previewRows[1].companyActionPositiveAtCut,false);
 assert.equal(r.previewRows[1].retrospectiveCompanyActionPositiveLater,true);
 assert.ok(r.previewRows[1].warnings.includes('LATE_DISCOVERED_CA_EVENT_NOT_BACKDATED'));
 assert.equal(r.previewRows[0].companyActionPositiveAtCut,true);
 assert.equal(r.historicalPreliminaryReceiptRetainedUnchanged,true);
});
test('T+1 readback requested at prior T-cut is LATE observation, not a historical entry',async()=>{
 const r=await route({preliminaryReceipt:await actualWatchShape(),
  requestedDecisionAtUtc:'2026-10-16T13:45:00Z'});
 assert.equal(r.state,'LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY');
 assert.equal(r.observedAfterRequestedCut,true);
 assert.equal(r.previewRows[0].status,'CA_OR_CLOCK_REVIEW_HOLD');
 assert.equal(r.futureProspectiveForwardReturnsUsableForThisDecision,false);
 assert.equal(r.certifiedZeroPickDay,null);
});
test('preliminary physical late after preferred T 23:45 Taipei cannot be called on-time',async()=>{
 const w=await actualWatchShape();
 w.observedAtUtc='2026-10-16T16:20:00Z';
 w.lateMorningObservationNotBackdated=true;
 const {receiptHash,...body}=w;w.receiptHash=await sha256Hex(body);
 const r=await route({preliminaryReceipt:w});
 assert.equal(r.state,'LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY');
 assert.equal(r.observedAfterTradingDatePreferredCut,true);
 assert.equal(r.observedAfterRequestedCut,false);
 assert.equal(r.lateMorningObservationNotBackdated,true);
 assert.equal(r.futureProspectiveForwardReturnsUsableForThisDecision,false);
 assert.equal(r.strategySelectedCount,null);
});
test('a signed preliminary is STILL no source/strategy PIT admission',async()=>{
 for(const layer of ['PIT_A_PROSPECTIVE','PIT_B_HISTORICAL']){
  const r=await route({layer,preliminaryReceipt:await actualWatchShape()});
  assert.equal(r.certifyingPipelineInvoked,false);
  assert.equal(r.pitACertificationGranted,false);
  assert.equal(r.pitBCertificationGranted,false);
  assert.equal(r.previewRows.length,0);
  assert.equal(r.strategySelectedCount,null);
  assert.equal(r.certifiedZeroPickDay,null);
  assert.equal(r.sourceUniverseCount,null);
  assert.equal(r.frozenD1Written,false);
 }
});
test('the source record may not be mutated, rewritten, or false-authorized',async()=>{
 const r=await actualWatchShape();
 const invalid=[
  x=>x.selectedCount=0,
  x=>x.zeroPickDay=true,
  x=>x.frozenWritten=true,
  x=>x.finalSelectionAuthorized=true,
  x=>x.ordinaryEquityOnlyUniverseCertified=true,
  x=>x.preliminaryMatchedCount=3000,
  x=>x.watchlist[0].companyActionPitStatus='CLEAR_NO_ACTION',
  x=>x.watchlist[0].strategyRank=1,
  x=>x.watchlist[0].companyName='美德醫療-DR',
  x=>x.watchlist[1].symbol='2330',
  x=>x.observedAtUtc='2030-13-42T14:50:00Z'
 ];
 for(const change of invalid){
  const d=structuredClone(r);change(d);
  const {receiptHash,...body}=d;d.receiptHash=await sha256Hex(body);
  await assert.rejects(()=>route({preliminaryReceipt:d}),/PREVIEW_.*INVALID|PREVIEW_CANDIDATE_NOT_ALLOWED|DUPLICATE_PREVIEW_CANDIDATE|ACTUAL_PRELIMINARY_SOURCE_RECEIPT_NOT_VERIFIED/);
 }
 const withoutProof=structuredClone(r);
 withoutProof.watchlist[0].companyName='偷改公司名稱';
 await assert.rejects(()=>route({preliminaryReceipt:withoutProof}),/ACTUAL_PRELIMINARY_SOURCE_RECEIPT_NOT_VERIFIED/);
});
test('no-data preview remains missing evidence, not zero selected stocks',async()=>{
 await assert.rejects(()=>route({}),/ACTUAL_PRELIMINARY_SOURCE_RECEIPT_NOT_VERIFIED/);
 const r=await actualWatchShape();
 r.displayedCount=0;r.watchlist=[];r.preliminaryMatchedCount=0;
 const {receiptHash,...body}=r;r.receiptHash=await sha256Hex(body);
 const ans=await route({preliminaryReceipt:r});
 assert.equal(ans.displayedPreviewCount,0);
 assert.equal(ans.zeroPreviewRowsWouldMeanZeroPicks,false);
 assert.equal(ans.certifiedZeroPickDay,null);
});

function weekdaySourceDatesEndingOn(end){
 const a=[],d=new Date(end+'T00:00:00Z');
 while(a.length<61){
  if(d.getUTCDay()!==0&&d.getUTCDay()!==6)
   a.push(d.toISOString().slice(0,10));
  d.setUTCDate(d.getUTCDate()-1);
 }
 return a.reverse();
}
// Unit calendar is a synthetic 61-business-day example; the production
// receipt's original dates are signed by an independently source-audited A1.
async function previewWithDates(day){
 const r=await actualWatchShape();
 r.marketDate=day;
 r.observedAtUtc=day+'T14:50:00Z'; // 22:50 Taipei
 r.source61TradingDates=weekdaySourceDatesEndingOn(day);
 for(const x of r.watchlist)x.marketDate=day;
 const {receiptHash,...unsigned}=r;
 r.receiptHash=await sha256Hex(unsigned);
 return r;
}
test('Oct19: the actually signed 61 source-date window still contains the known 2330 Sep16 dividend',async()=>{
 const r=await route({preliminaryReceipt:await previewWithDates('2026-10-19')});
 assert.equal(r.source61SessionCalendarProvided,true);
 assert.equal(r.known2330ExdivDateInSource61Window,true);
 assert.equal(r.previewRows[0].status,'CA_OR_CLOCK_REVIEW_HOLD');
 assert.equal(r.previewRows[0].companyActionPositiveAtCut,true);
 assert.ok(r.previewRows[0].warnings.includes('KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED'));
 assert.equal(r.previewRows[1].status,'RESEARCH_OBSERVATION_ONLY');
 assert.equal(r.pitACertificationGranted,false);
 assert.equal(r.strategySelectedCount,null);
});
test('when a real 61-session window no longer contains Sep16, do not invent a 2330 new event',async()=>{
 const r=await route({preliminaryReceipt:await previewWithDates('2027-02-15')});
 assert.equal(r.source61SessionCalendarProvided,true);
 assert.equal(r.known2330ExdivDateInSource61Window,false);
 assert.equal(r.previewRows[0].companyActionPositiveAtCut,false);
 assert.equal(r.previewRows[0].status,'RESEARCH_OBSERVATION_ONLY');
 assert.equal(r.positiveEventsProvideOnlyVetoNotNoEventCert,true);
 assert.ok(r.previewRows[0].warnings.includes('COMPANY_ACTION_PIT_NOT_CLEARED'));
});
test('new T with no exact signed source calendar is blocked, but historic fixture remains replayable',async()=>{
 const r=await previewWithDates('2026-10-19');
 delete r.source61TradingDates;
 const {receiptHash,...rest}=r;
 r.receiptHash=await sha256Hex(rest);
 await assert.rejects(()=>route({preliminaryReceipt:r}),
  /SOURCE_61_OFFICIAL_SESSION_CALENDAR_REQUIRED_FOR_CURRENT_PREVIEW/);
 const historical=await route({preliminaryReceipt:await actualWatchShape()});
 assert.equal(historical.source61SessionCalendarProvided,false);
 assert.equal(historical.previewRows[0].status,'CA_OR_CLOCK_REVIEW_HOLD');
});
test('tampered/fake 61 dates, duplicates, and wrong T cannot falsely clear CA',async()=>{
 for(const mutate of [
  a=>a.pop(),
  a=>{a[10]=a[9];},
  a=>{a[60]='2026-10-20';},
  a=>{a[1]='2026-99-99';}
 ]){
  const x=await previewWithDates('2026-10-19');
  mutate(x.source61TradingDates);
  const {receiptHash,...base}=x;x.receiptHash=await sha256Hex(base);
  await assert.rejects(()=>route({preliminaryReceipt:x}),
   /SOURCE_61_OFFICIAL_SESSION_CALENDAR_INVALID/);
 }
});
test('source-only previous capture clock cannot be retrospectively assigned to known 2330 CA event',async()=>{
 const old=await previewWithDates('2026-10-15');
 const r=await route({preliminaryReceipt:old});
 assert.equal(r.known2330ExdivDateInSource61Window,true);
 assert.equal(r.previewRows[0].companyActionPositiveAtCut,false);
 assert.equal(r.previewRows[0].retrospectiveCompanyActionPositiveLater,true);
 assert.ok(r.previewRows[0].warnings.includes('LATE_DISCOVERED_CA_EVENT_NOT_BACKDATED'));
 assert.equal(r.previewRows[0].status,'CA_OR_CLOCK_REVIEW_HOLD');
});
