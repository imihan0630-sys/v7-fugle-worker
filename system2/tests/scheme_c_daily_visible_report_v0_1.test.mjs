import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildSchemeCDailyVisibleReportV0_1 as render}
 from '../runtime/scheme_c_daily_visible_report_v0_1.mjs';
const HASH='a'.repeat(64), AUD='b'.repeat(64), WATCH='c'.repeat(64);
const DATE='2026-10-13';
const sign=async(obj,key='receiptHash')=>({...obj,[key]:await sha256Hex(obj)});
const stock=({hold=false,name='台積電'}={})=>({
 previewDisplayOrder:1,symbol:'2330',companyName:name,market:'TWSE',
 marketDate:DATE,descriptiveRawFiveSessionReturnPct:5.33,
 priceAboveRawSma20:true,sourceRowHash:HASH,
 status:hold?'CA_OR_CLOCK_REVIEW_HOLD':'RESEARCH_OBSERVATION_ONLY',
 warnings:['ORDINARY_SHARE_CLASS_NOT_INDEPENDENTLY_CERTIFIED',
  'COMPANY_ACTION_PIT_NOT_CLEARED','MARKET_REGIME_NOT_CERTIFIED',
  ...(hold?['KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED']:[])],
 formalStrategyScore:null,formalStrategyRank:null,
 previewIsTradeRecommendation:false,entryPrice:null,stop:null,targets:null
});
async function fixture({blocked=false,late=true,hold=false}={}){
 const preview=await sign({
  schemaVersion:'S2_THREE_LAYER_SELECTION_V0_1',
  requestedLayer:'NON_PIT_PREVIEW',
  state:late?'LATE_SOURCE_DESCRIPTIVE_PREVIEW_ONLY':'SOURCE_BOUNDED_NON_PIT_PREVIEW',
  marketDate:DATE,sourceOriginalReceiptHash:HASH,
  sourceAuditHashNotStrategyPIT:AUD,sourcePreliminaryReceiptHash:WATCH,
  previewAuthority:true,pitACertificationGranted:false,
  pitBCertificationGranted:false,frozenD1Written:false,
  ordersAuthorized:false,pushAuthorized:false,
  strategySelectedCount:null,certifiedZeroPickDay:null,
  ordinaryEquityUniverseCertified:false,
  originalObservedAtUtc:late?'2026-10-13T22:21:06Z':'2026-10-13T15:30:00Z',
  sourceUniverseCount:1974,preliminarySourceMatchedCount:580,
  displayedPreviewCount:1,previewRows:[stock({hold})]
 });
 return sign({
  schemaVersion:'S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1',
  state:blocked?'PRELIMINARY_SOURCE_NOT_READY':'NON_PIT_SOURCE_OBSERVATION_READY',
  marketDate:DATE,auditRunId:38469057567,
  auditedAtUtc:late?'2026-10-13T21:50:00Z':'2026-10-13T15:00:00Z',
  originalSourceReceiptHash:HASH,independentSourceAuditHash:AUD,
  previewReceiptHash:WATCH,
  observedPreviewCount:blocked?null:1,
  descriptiveSourceMatches:blocked?null:580,
  previewReport:blocked?null:preview,
  blockers:blocked?['PRELIMINARY_RESEARCH_FEED_NOT_READY']:[],
  pitACertificationGranted:false,pitBCertificationGranted:false,
  fullMarketOrdinaryShareCount:null,selectedCount:null,zeroPickDay:null,
  shadowAuthorized:false,realStrategyRankAuthorized:false,
  frozenD1Written:false,pushAuthorized:false,ordersAuthorized:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreChanged:false
 });
}
test('signed real-shaped daily preview renders stocks, actual T, visible source and warning',async()=>{
 const h=await fixture(),r=await render({handoff:h});
 assert.match(r.markdown,/2026-10-13/);
 assert.match(r.markdown,/台積電/);
 assert.match(r.markdown,/2330/);
 assert.match(r.markdown,/1974/);
 assert.match(r.markdown,/580/);
 assert.match(r.markdown,/LATE_SOURCE/);
 assert.match(r.markdown,/普通股資格未核准/);
 assert.match(r.markdown,/CA PIT 未核准/);
 assert.match(r.markdown,/不是經獨立驗證的全市場普通股數/);
 assert.equal(r.metadata.marketDate,DATE);
 assert.equal(r.metadata.lateSource,true);
 assert.equal(r.metadata.reportHash,await sha256Hex(r.markdown));
 assert.equal(r.metadata.strategySelectedCount,null);
 assert.equal(r.metadata.frozenWritten,false);
 assert.equal(r.metadata.pitACertified,false);
});
test('real known CA positive only flags review hold, never pretends event absence',async()=>{
 const r=await render({handoff:await fixture({hold:true})});
 assert.match(r.markdown,/已知公司行動，價位待查/);
 assert.match(r.markdown,/資料／事件待查/);
 assert.match(r.markdown,/未知不代表 NO_EVENT/);
 assert.doesNotMatch(r.markdown,/建議買進代號/);
});
test('valid prospective observation still not upgraded to forward performance',async()=>{
 const r=await render({handoff:await fixture({late:false})});
 assert.equal(r.metadata.lateSource,false);
 assert.match(r.markdown,/Forward 績效都尚未認證/);
 assert.match(r.markdown,/不是正式選股排名/);
});
test('source missing renders SOURCE_NOT_READY instead of fabricated zero pick',async()=>{
 const r=await render({handoff:await fixture({blocked:true})});
 assert.equal(r.metadata.sourceReady,false);
 assert.equal(r.metadata.displayedCount,null);
 assert.equal(r.metadata.lateSource,null);
 assert.match(r.markdown,/SOURCE_NOT_READY/);
 assert.match(r.markdown,/不得宣稱正式選股為零檔/);
 assert.doesNotMatch(r.markdown,/台積電/);
});
test('signed handoff maliciously forged name, count, PIT and price rejected',async()=>{
 const valid=await fixture();
 const corrupted=structuredClone(valid);
 corrupted.previewReport.previewRows[0].companyName='偽造發行人';
 await assert.rejects(()=>render({handoff:corrupted}),/SIGNED_HANDOFF_NOT_VERIFIED/);
 const badCount=structuredClone(valid);
 badCount.previewReport.displayedPreviewCount=4;
 badCount.previewReport.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(badCount.previewReport).filter(([k])=>k!=='receiptHash')));
 badCount.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(badCount).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>render({handoff:badCount}),/PREVIEW_HASH_LINEAGE_OR_COUNTER_INVALID/);
 const cert=structuredClone(valid);
 cert.pitACertificationGranted=true;
 cert.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(cert).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>render({handoff:cert}),/AUTHORITY_OR_SOURCE_INVALID/);
 const score=structuredClone(valid);
 score.previewReport.previewRows[0].formalStrategyRank=1;
 score.previewReport.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(score.previewReport).filter(([k])=>k!=='receiptHash')));
 score.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(score).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>render({handoff:score}),/PREVIEW_ROW_NOT_SAFE/);
});
test('forged duplicated row is not presented as two unique candidates',async()=>{
 const h=await fixture();
 const row=structuredClone(h.previewReport.previewRows[0]);
 row.previewDisplayOrder=2;
 h.previewReport.previewRows.push(row);
 h.previewReport.displayedPreviewCount=2;
 h.observedPreviewCount=2;
 h.previewReport.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(h.previewReport).filter(([k])=>k!=='receiptHash')));
 h.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(h).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>render({handoff:h}),/DUPLICATE_STOCK/);
});
test('unsafe markdown name cannot inject a table row or fake selection claim',async()=>{
 const h=await fixture();
 h.previewReport.previewRows[0].companyName='假資料|正式BUY\n第二行';
 h.previewReport.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(h.previewReport).filter(([k])=>k!=='receiptHash')));
 h.receiptHash=await sha256Hex(Object.fromEntries(
  Object.entries(h).filter(([k])=>k!=='receiptHash')));
 const r=await render({handoff:h});
 assert.match(r.markdown,/假資料 正式BUY 第二行/);
 assert.doesNotMatch(r.markdown,/\|假資料\|正式BUY/);
 assert.equal(r.metadata.ordersAuthorized,false);
});

test('true T23:45 relative UTC clock is visible, and does not blame GitHub schedule without schedule evidence',async()=>{
 const r=await render({handoff:await fixture()});
 assert.equal(r.metadata.preferredCutAtUtc,'2026-10-13T15:45:00Z');
 assert.equal(r.metadata.independentAuditOffsetMinutes,365);
 assert.equal(r.metadata.previewObservationOffsetMinutes,396.1);
 assert.equal(r.metadata.researchReceiptCutStatus,'SOURCE_OBSERVED_AFTER_T2345_DESCRIPTIVE_ONLY');
 assert.equal(r.metadata.schedulerDispatchDelayMinutes,null);
 assert.equal(r.metadata.officialProviderPublicationAtUtc,null);
 assert.match(r.markdown,/獨立稽核完成相對截止：.*晚於截止 365\.0 分鐘/);
 assert.match(r.markdown,/研究預覽形成相對截止：.*晚於截止 396\.1 分鐘/);
 assert.match(r.markdown,/固定研究參考截止（T 23:45）/);
 assert.match(r.markdown,/不能倒填交易日截止決策/);
});
test('on-time source-only report gives actual negative offsets, without ever making PIT/BUY qualified',async()=>{
 const r=await render({handoff:await fixture({late:false})});
 assert.equal(r.metadata.independentAuditOffsetMinutes,-45);
 assert.equal(r.metadata.previewObservationOffsetMinutes,-15);
 assert.equal(r.metadata.researchReceiptCutStatus,'RESEARCH_RECEIPTS_AT_OR_BEFORE_T2345_NOT_PIT_CERTIFIED');
 assert.equal(r.metadata.lateSource,false);
 assert.equal(r.metadata.pitACertified,false);
 assert.equal(r.metadata.strategySelectedCount,null);
 assert.match(r.markdown,/早於截止 45\.0 分鐘/);
 assert.match(r.markdown,/早於截止 15\.0 分鐘/);
});
test('blocked source still displays actual audit cut offset, NEVER pretends zero selection',async()=>{
 const r=await render({handoff:await fixture({blocked:true})});
 assert.equal(r.metadata.independentAuditOffsetMinutes,365);
 assert.equal(r.metadata.previewObservationOffsetMinutes,null);
 assert.equal(r.metadata.researchReceiptCutStatus,'SOURCE_NOT_READY');
 assert.equal(r.metadata.strategySelectedCount,null);
 assert.match(r.markdown,/SOURCE_NOT_READY/);
 assert.doesNotMatch(r.markdown,/研究預覽形成相對截止/);
});
test('signed impossible audit-after-preview and false on-time source are rejected fail-closed',async()=>{
 const h=await fixture({late:false});
 h.auditedAtUtc='2026-10-13T15:46:00Z';
 const {receiptHash:_,...b}=h;h.receiptHash=await sha256Hex(b);
 await assert.rejects(()=>render({handoff:h}),/AUDIT_PREVIEW_CLOCK_OR_REFERENCE_CUT_CONTRADICTION/);
 const late=await fixture();
 late.auditedAtUtc='2026-10-13T22:45:00Z';
 const {receiptHash:__,...c}=late;late.receiptHash=await sha256Hex(c);
 await assert.rejects(()=>render({handoff:late}),/AUDIT_PREVIEW_CLOCK_OR_REFERENCE_CUT_CONTRADICTION/);
});
