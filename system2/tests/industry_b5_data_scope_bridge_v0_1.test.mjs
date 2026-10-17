import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {inspectDataB5OriginalScopeForBuildV0_1 as inspect} from '../runtime/industry_b5_data_scope_bridge_v0_1.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const HEX='a'.repeat(64),DAY='2026-10-16';
const universe=[{market:'TWSE',symbol:'8046'},{market:'TWSE',symbol:'2382'},{market:'TPEX',symbol:'1595'}];
function receipt({late=false}={}){
 const mapping=[
  {market:'TWSE',symbol:'8046',currentIndustryState:'CURRENT_PROFILE_SOURCE_ONLY',
   officialIndustryRawValue:'電子零組件業',nativeIndustryField:'產業別'},
  {market:'TWSE',symbol:'2382',currentIndustryState:'OFFICIAL_INDUSTRY_UNKNOWN',
   officialIndustryRawValue:null},
  {market:'TPEX',symbol:'1595',currentIndustryState:'PROFILE_IDENTITY_CONFLICT',
   officialIndustryRawValue:null}
 ].map(x=>({...x,instrumentOrdinaryShareClassCertified:false,
    industryHistoricalEffectiveWindowCertified:false,independentB5Audited:false,
    strategyUseAuthorized:false}));
 const summaries=[
  {market:'TWSE',originalRawBodySha256:HEX,observedAtUtc:DAY+'T14:00:00Z',
   beforeEvaluation:!late,a1SourceInstrumentDenominator:2,mapped:1,unknown:1,
   conflict:0,totalAccountsFor:true,independentB5Audited:false},
  {market:'TPEX',originalRawBodySha256:HEX,observedAtUtc:DAY+'T14:00:00Z',
   beforeEvaluation:true,a1SourceInstrumentDenominator:1,mapped:0,unknown:0,
   conflict:1,totalAccountsFor:true,independentB5Audited:false}
 ];
 const d={schemaVersion:'S2_DATA_B5_ORIGINAL_SOURCE_SCOPE_V0_1',
  marketDate:DAY,evaluationAtUtc:DAY+'T15:45:00Z',a1SourceReceiptHash:HEX,
  sourceScope:'PROSPECTIVE_CURRENT_PROFILE_ONLY',
  originalSourceAuditState:'PENDING_INDEPENDENT_AUDIT',
  officialB5FullMarketIndependentAccepted:false,certifiedOrdinaryShareDenominator:null,
  independentPITAccepted:false,selectionAuthorized:false,selectedCount:null,
  zeroPickDay:null,frozenD1Written:false,mappedInstrumentCount:1,
  unknownInstrumentCount:1,conflictInstrumentCount:1,
  sourceLateAtEvaluation:late,mapping,summaries};
 return {...d,receiptHash:hash(JSON.stringify(d))};
}
const run=d=>inspect({dataReceipt:d,sourceUniverse:universe,marketDate:DAY});
test('source only 1/3 matched is not independently official, eligible or zero picked',()=>{
 const r=run(receipt());
 assert.equal(r.sourceUniverseInstrumentCount,3);
 assert.equal(r.mappedSourceOnlyCount,1);
 assert.equal(r.unknownCount,1);
 assert.equal(r.conflictCount,1);
 assert.equal(r.currentOfficialFullMarketCoverageCertified,null);
 assert.equal(r.sourceForDailyIndustryDisplayAuthorized,false);
 assert.equal(r.sourceForStrategyAuthorized,false);
 assert.equal(r.selectedCount,null);
});
test('late native source is marked blocked even if record matches',()=>{
 const r=run(receipt({late:true}));
 assert.equal(r.sourceLateAtEvaluation,true);
 assert.ok(r.blockers.includes('B5_SOURCE_LATE_AT_EVALUATION'));
});
test('identity mismatch and conflict cannot disappear behind totals',()=>{
 assert.throws(()=>inspect({dataReceipt:receipt(),sourceUniverse:universe.slice(0,2),marketDate:DAY}),
  /DATA_A1_DENOMINATOR_MISMATCH/);
 const d=receipt();d.mapping[2].currentIndustryState='OFFICIAL_INDUSTRY_UNKNOWN';
 d.receiptHash=hash(JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k])=>k!=='receiptHash'))));
 assert.throws(()=>run(d),/PER_MARKET_ORIGINAL_SCOPE_MISMATCH/);
});
test('source signed SHA and original authority cannot be fabricated',()=>{
 const d=receipt();d.mapping[0].officialIndustryRawValue='made up';
 assert.throws(()=>run(d),/DATA_RECEIPT_HASH_INVALID/);
 const promoted=receipt();promoted.independentPITAccepted=true;
 promoted.receiptHash=hash(JSON.stringify(Object.fromEntries(Object.entries(promoted).filter(([k])=>k!=='receiptHash'))));
 assert.throws(()=>run(promoted),/DATA_AUTHORITY_OR_DATE_INVALID/);
});
test('cross-market duplicated identity and backfill are rejected',()=>{
 const d=receipt();d.mapping[0].symbol='1595';
 d.receiptHash=hash(JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k])=>k!=='receiptHash'))));
 assert.throws(()=>run(d),/DATA_A1_IDENTITY_MISMATCH/);
 assert.throws(()=>inspect({dataReceipt:receipt(),sourceUniverse:universe,marketDate:'2026-10-15'}),
  /DATA_AUTHORITY_OR_DATE_INVALID/);
});
