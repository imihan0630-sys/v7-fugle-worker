import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildB5OriginalIndustrySourceHandoffV0_1 as build}
 from '../migration/issue1068_b5_original_industry_source_scope_v0_1.mjs';
import {B2_OFFICIAL_ENDPOINTS_V0_1 as official}
 from '../runtime/b2_industry_snapshot_observer.mjs';

function fixture(){
 const twse=[
  {公司代號:'2330',產業別:'半導體業',出表日期:'1151019'},
  {公司代號:'8046',產業別:'電子零組件業',出表日期:'1151019'}
 ];
 const tpex=[
  {SecuritiesCompanyCode:'3287',SecuritiesIndustryCode:'24',Date:'1151019'},
  {SecuritiesCompanyCode:'3131',SecuritiesIndustryCode:'28',Date:'1151019'}
 ];
 return {
  marketDate:'2026-10-19',evaluationAtUtc:'2026-10-19T15:45:00Z',
  a1SourceReceiptHash:'a'.repeat(64),
  universe:[{market:'TWSE',symbol:'2330'},{market:'TWSE',symbol:'8046'},
   {market:'TPEX',symbol:'3287'},{market:'TPEX',symbol:'3131'}],
  profileOriginals:[
   {market:'TWSE',sourceUrl:official.TWSE_PROFILE,rawBody:JSON.stringify(twse),
    observedAtUtc:'2026-10-19T12:02:00Z'},
   {market:'TPEX',sourceUrl:official.TPEX_PROFILE,rawBody:JSON.stringify(tpex),
    observedAtUtc:'2026-10-19T12:03:00Z'}
  ]
 };
}
test('source-only current B5 scope is dated, hashed, complete and still not independent PIT',()=>{
 const f=fixture(),q=build(f);
 assert.equal(q.marketDate,'2026-10-19');
 assert.equal(q.summaries.length,2);
 assert.deepEqual(q.summaries.map(x=>[x.mapped,x.unknown,x.conflict]),[[2,0,0],[2,0,0]]);
 assert.equal(q.mappedInstrumentCount,4);
 assert.equal(q.mapping.find(x=>x.symbol==='3287').officialIndustryRawValue,'24');
 assert.equal(q.mapping.find(x=>x.symbol==='2330').nativeIndustryField,'產業別');
 assert.equal(q.summaries[0].originalRawBodySha256,
   createHash('sha256').update(f.profileOriginals[0].rawBody).digest('hex'));
 assert.equal(q.certifiedOrdinaryShareDenominator,null);
 assert.equal(q.originalSourceAuditState,'PENDING_INDEPENDENT_AUDIT');
 assert.equal(q.a1UniverseIndependentVerifiedByThisFunction,false);
 assert.equal(q.independentPITAccepted,false);
 assert.equal(q.selectionAuthorized,false);
 assert.equal(q.frozenD1Written,false);
 assert.equal(q.selectedCount,null);
 assert.equal(q.zeroPickDay,null);
 assert.equal(build(f).receiptHash,q.receiptHash);
});
test('independent original mutations alter byte hash; do not grant provider publication clock',()=>{
 const f=fixture(),a=build(f);
 f.profileOriginals[0].rawBody=f.profileOriginals[0].rawBody.replace('半導體業','其他業');
 const b=build(f);
 assert.notEqual(a.receiptHash,b.receiptHash);
 assert.notEqual(a.summaries[0].originalRawBodySha256,b.summaries[0].originalRawBodySha256);
 assert.equal(b.summaries[0].firstKnownAtUtc,null);
 assert.equal(b.summaries[0].officialPublicationAtUtc,null);
});
test('missing profile and conflicting duplicate stay separate UNKNOWN vs CONFLICT',()=>{
 const f=fixture();
 let rows=JSON.parse(f.profileOriginals[0].rawBody);
 rows.push({公司代號:'2330',產業別:'電子工業',出表日期:'1151019'});
 rows=rows.filter(x=>x.公司代號!=='8046');
 f.profileOriginals[0].rawBody=JSON.stringify(rows);
 const q=build(f);
 assert.equal(q.summaries[0].mapped,0);
 assert.equal(q.summaries[0].unknown,1);
 assert.equal(q.summaries[0].conflict,1);
 assert.equal(q.mapping.find(x=>x.symbol==='2330').currentIndustryState,'PROFILE_IDENTITY_CONFLICT');
 assert.equal(q.mapping.find(x=>x.symbol==='8046').currentIndustryState,'OFFICIAL_INDUSTRY_UNKNOWN');
});
test('future-date profile cannot backfill current market T',()=>{
 const f=fixture(),rows=JSON.parse(f.profileOriginals[1].rawBody);
 rows[0].Date='1151020';
 f.profileOriginals[1].rawBody=JSON.stringify(rows);
 const q=build(f);
 assert.equal(q.summaries[1].conflict,1);
 assert.equal(q.mapping.find(x=>x.symbol==='3287').officialIndustryRawValue,null);
});
test('late original source never masquerades as a before-cut provider observation',()=>{
 const f=fixture();
 f.profileOriginals[0].observedAtUtc='2026-10-20T01:45:00Z';
 const q=build(f);
 assert.equal(q.sourceLateAtEvaluation,true);
 assert.equal(q.summaries[0].beforeEvaluation,false);
 assert.equal(q.mapping.find(x=>x.symbol==='2330').strategyUseAuthorized,false);
});
test('negative source controls reject forged URLs, missing markets, duplicates and invalid clocks',()=>{
 const mutators=[
  f=>f.profileOriginals[0].sourceUrl='https://fake.invalid/b5',
  f=>f.profileOriginals[1].market='TWSE',
  f=>f.profileOriginals[0].rawBody='{"items":[]}',
  f=>f.profileOriginals[0].rawBody='not json',
  f=>f.profileOriginals[0].observedAtUtc='2026-10-19T25:02:00Z',
  f=>f.a1SourceReceiptHash='not-hash',
  f=>f.universe.push({...f.universe[0]}),
  f=>f.universe.push({market:'TWSE',symbol:'0050'}),
  f=>f.marketDate='2026-10-42'
 ];
 for(const mutate of mutators){
  const f=fixture();mutate(f);
  assert.throws(()=>build(f),/B5_DATA_/);
 }
});
test('real 4-digit source instrument population is not certified ordinary share population',()=>{
 const f=fixture();
 f.universe.push({market:'TWSE',symbol:'9103'});
 const q=build(f);
 assert.equal(q.summaries[0].a1SourceInstrumentDenominator,3);
 assert.equal(q.summaries[0].unknown,1);
 assert.equal(q.certifiedOrdinaryShareDenominator,null);
 assert.equal(q.mapping.find(x=>x.symbol==='9103').instrumentOrdinaryShareClassCertified,false);
});
