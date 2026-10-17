import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildSystem2IndustryActivityRadarV0_1 as build,renderSystem2IndustryActivityRadarV0_1 as render} from '../runtime/industry_activity_rotation_radar_v0_1.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex'),H='a'.repeat(64),DAY='2026-10-16';
const universe=[{market:'TWSE',symbol:'8046'},{market:'TWSE',symbol:'3189'},
 {market:'TWSE',symbol:'2382'},{market:'TPEX',symbol:'1595'}];
const common={instrumentOrdinaryShareClassCertified:false,industryHistoricalEffectiveWindowCertified:false,
 independentB5Audited:false,strategyUseAuthorized:false};
function dataScope(){
 const mapping=[
  {market:'TWSE',symbol:'8046',currentIndustryState:'CURRENT_PROFILE_SOURCE_ONLY',officialIndustryRawValue:'電子零組件業',nativeIndustryField:'產業別'},
  {market:'TWSE',symbol:'3189',currentIndustryState:'CURRENT_PROFILE_SOURCE_ONLY',officialIndustryRawValue:'電子零組件業',nativeIndustryField:'產業別'},
  {market:'TWSE',symbol:'2382',currentIndustryState:'CURRENT_PROFILE_SOURCE_ONLY',officialIndustryRawValue:'電腦及週邊設備業',nativeIndustryField:'產業別'},
  {market:'TPEX',symbol:'1595',currentIndustryState:'CURRENT_PROFILE_SOURCE_ONLY',officialIndustryRawValue:'半導體業',nativeIndustryField:'產業別'}
 ].map(x=>({...x,...common}));
 const summaries=[
  {market:'TWSE',originalRawBodySha256:H,observedAtUtc:DAY+'T14:00:00Z',
   beforeEvaluation:true,a1SourceInstrumentDenominator:3,mapped:3,unknown:0,
   conflict:0,totalAccountsFor:true,independentB5Audited:false},
  {market:'TPEX',originalRawBodySha256:H,observedAtUtc:DAY+'T14:00:00Z',
   beforeEvaluation:true,a1SourceInstrumentDenominator:1,mapped:1,unknown:0,
   conflict:0,totalAccountsFor:true,independentB5Audited:false}
 ];
 const d={schemaVersion:'S2_DATA_B5_ORIGINAL_SOURCE_SCOPE_V0_1',marketDate:DAY,
  evaluationAtUtc:DAY+'T15:45:00Z',a1SourceReceiptHash:H,
  sourceScope:'PROSPECTIVE_CURRENT_PROFILE_ONLY',originalSourceAuditState:'PENDING_INDEPENDENT_AUDIT',
  officialB5FullMarketIndependentAccepted:false,certifiedOrdinaryShareDenominator:null,
  independentPITAccepted:false,selectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,mappedInstrumentCount:4,unknownInstrumentCount:0,conflictInstrumentCount:0,
  sourceLateAtEvaluation:false,mapping,summaries};
 return {...d,receiptHash:hash(JSON.stringify(d))};
}
const prices=[100,200,300,1000],prior=[10,20,30,40],close=[11,18,30,42];
function rows(){
 return universe.map((x,i)=>({...x,marketDate:DAY,sourceRowHash:H,tradeValueTwd:prices[i],
 volumeShares:1000,priorClosePrice:prior[i],closePrice:close[i]}));
}
const input=(over={})=>({
 marketDate:DAY,observedAtUtc:DAY+'T14:20:00Z',
 generatedAtUtc:'2026-10-17T13:00:00Z',
 a1OriginalReceiptHash:H,dataB5ScopeReceipt:dataScope(),
 sourceUniverse:universe,dailyRows:rows(),...over});
test('gross activity, top shares and breadth computed for exact scoped members, no net flow',async()=>{
 const r=await build(input());
 assert.equal(r.state,'SOURCE_ONLY_PARTIAL');
 assert.equal(r.fourDigitInstrumentUniverseCount,4);
 assert.equal(r.actualDailyBarRows,4);
 assert.equal(r.observedFourDigitScopeTradeValueTwd,1600);
 assert.equal(r.mainIndustries.length,3);
 const e=r.mainIndustries.find(x=>x.industryRawValue==='電子零組件業');
 assert.equal(e.tradeValueTwd,300);
 assert.equal(e.top1Concentration,2/3);
 assert.equal(e.top3Concentration,1);
 assert.equal(e.tradeValueShareWithinObservedFourDigitScope,300/1600);
 assert.equal(e.up,1);assert.equal(e.down,1);
 assert.equal(e.equalWeightedReturnPercent,0);
 assert.equal(r.institutionNetAmountTwd,null);
 assert.equal(r.actualOfficialMainIndustryCoverageRate,null);
 assert.equal(r.officialOrdinaryShareDenominator,null);
 assert.equal(r.selectedCount,null);
 assert.equal(r.inferredRotationState,'INSUFFICIENT_EVIDENCE');
 assert.match(render(r),/並非淨買超/);
});
test('absent one price row makes total market amount unknown not apparent capital exit',async()=>{
 const r=await build(input({dailyRows:rows().slice(0,3)}));
 assert.equal(r.state,'SOURCE_NOT_READY');
 assert.equal(r.missingDailyBarRows,1);
 assert.equal(r.observedFourDigitScopeTradeValueTwd,null);
 assert.equal(r.mainIndustries.find(x=>x.market==='TPEX').tradeValueTwd,null);
 assert.equal(r.mainIndustries.find(x=>x.market==='TPEX').top1Concentration,null);
 assert.ok(r.caveats.includes('SOURCE_ROWS_OR_TRADE_VALUE_INCOMPLETE'));
});
test('unknown official industry does not inherit entire other-sector theme membership',async()=>{
 const d=dataScope();
 d.mapping[2].currentIndustryState='OFFICIAL_INDUSTRY_UNKNOWN';
 d.mapping[2].officialIndustryRawValue=null;
 d.mapping[2].nativeIndustryField=null;
 d.summaries[0].mapped=2;d.summaries[0].unknown=1;
 d.mappedInstrumentCount=3;d.unknownInstrumentCount=1;
 d.receiptHash=hash(JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k])=>k!=='receiptHash'))));
 const r=await build(input({dataB5ScopeReceipt:d}));
 assert.equal(r.perMarket[0].b5SourceUnknownCount,1);
 assert.equal(r.mainIndustries.length,2);
 assert.equal(r.themeGroups.length,0);
 assert.equal(r.crossThemeOverlapCount,null);
});
test('late source remains descriptive not cutoff-time flow or PIT',async()=>{
 const r=await build(input({observedAtUtc:'2026-10-17T01:00:00Z'}));
 assert.equal(r.lateRelativeToReferenceCut,true);
 assert.ok(r.caveats.includes('SOURCE_AFTER_T2345_RESEARCH_REFERENCE_CUT'));
 assert.equal(r.classificationPITAccepted,false);
});
test('reject stale dates, duplicate and off-universe A1 row',async()=>{
 const x=rows();x[0].marketDate='2026-10-15';
 await assert.rejects(build(input({dailyRows:x})),/DAILY_ROW_SCOPE_OR_UNIT_INVALID/);
 await assert.rejects(build(input({dailyRows:[...rows(),rows()[0]]})),/DAILY_ROW_SCOPE_OR_UNIT_INVALID/);
 const y=rows();y[0].symbol='7777';
 await assert.rejects(build(input({dailyRows:y})),/DAILY_ROW_SCOPE_OR_UNIT_INVALID/);
});
test('reject incorrect units, invalid negatives, and zero reference price',async()=>{
 for(const bad of [{tradeValueTwd:-1},{tradeValueTwd:'100'},{volumeShares:-2},{priorClosePrice:0},{closePrice:'9'}]){
  const rs=rows();Object.assign(rs[0],bad);
  await assert.rejects(build(input({dailyRows:rs})),/DAILY_ROW_SCOPE_OR_UNIT_INVALID/);
 }
});
test('do not promote forged B5 source authority or A1 mismatched receipts',async()=>{
 const d=dataScope();d.selectionAuthorized=true;
 d.receiptHash=hash(JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k])=>k!=='receiptHash'))));
 await assert.rejects(build(input({dataB5ScopeReceipt:d})),/DATA_AUTHORITY_OR_DATE_INVALID/);
 await assert.rejects(build(input({a1OriginalReceiptHash:'b'.repeat(64)})),/A1_SOURCE_HASH_MISMATCH/);
});
test('never represent observation before availability as research generated',async()=>{
 await assert.rejects(build(input({generatedAtUtc:'2026-10-16T12:00:00Z'})),/TIME_OR_SOURCE_RECEIPT_REQUIRED/);
});
test('all four-digit symbols remain not independently common-stock classified',async()=>{
 const r=await build(input());
 assert.equal(r.sourceEvidenceLevel,'CALLER_BOUND_A1_AND_B5_SOURCE_ONLY_NO_INDEPENDENT_NATIVE_READBACK');
 assert.equal(r.sessionHistory[1],1);
 assert.equal(r.sessionHistory[5],0);
 assert.equal(r.sessionHistory[20],0);
 assert.equal(r.sessionHistory[60],0);
 assert.equal(r.thresholdBasedStateActivated,false);
 assert.equal(r.shadowAuthorized,false);
 assert.equal(r.cloudflareD1Writes,0);
 assert.equal(r.system1FormalCoreChanged,false);
});
