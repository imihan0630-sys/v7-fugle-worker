import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {buildSystem2IndustryActivityRadarV0_1} from '../runtime/industry_activity_rotation_radar_v0_1.mjs';
import {buildSystem2IndustryThemeOverlapV0_1 as build,renderSystem2IndustryThemeOverlapV0_1 as render} from '../runtime/industry_theme_activity_overlap_v0_1.mjs';
const research=JSON.parse(await readFile(new URL('../data/industry_prior_research_reuse_seeds_v0_1.json',import.meta.url),'utf8'));
const hash=s=>createHash('sha256').update(s).digest('hex'),H='a'.repeat(64);
const stocks=[['TWSE','8046',100,'電子零組件業'],['TWSE','3189',200,'半導體業'],
 ['TWSE','2382',300,'電腦及週邊設備業'],['TWSE','2308',500,'電子零組件業'],
 ['TWSE','2330',400,'半導體業'],['TPEX','1595',60,'半導體業'],
 ['TPEX','3131',40,'半導體業']];
function fixture(day='2026-10-16'){
 const universe=stocks.map(([market,symbol])=>({market,symbol,sourceRowHash:hash(market+symbol+day)}));
 const dailyRows=stocks.map(([market,symbol,v],i)=>({
  market,symbol,marketDate:day,sourceRowHash:hash(market+symbol+day),
  tradeValueTwd:v,volumeShares:1000,priorClosePrice:20,closePrice:i%2?19:22
 }));
 const mapping=stocks.map(([market,symbol, ,industry])=>({
  market,symbol,officialIndustryRawValue:industry,nativeIndustryField:'產業別',
  currentIndustryState:'CURRENT_PROFILE_SOURCE_ONLY',
  instrumentOrdinaryShareClassCertified:false,industryHistoricalEffectiveWindowCertified:false,
  independentB5Audited:false,strategyUseAuthorized:false
 }));
 const summaries=['TWSE','TPEX'].map(m=>({
  market:m,originalRawBodySha256:H,observedAtUtc:day+'T14:00:00Z',beforeEvaluation:true,
  a1SourceInstrumentDenominator:universe.filter(x=>x.market===m).length,
  mapped:universe.filter(x=>x.market===m).length,unknown:0,conflict:0,
  totalAccountsFor:true,independentB5Audited:false
 }));
 const d={schemaVersion:'S2_DATA_B5_ORIGINAL_SOURCE_SCOPE_V0_1',
  marketDate:day,evaluationAtUtc:day+'T15:45:00Z',a1SourceReceiptHash:H,
  sourceScope:'PROSPECTIVE_CURRENT_PROFILE_ONLY',originalSourceAuditState:'PENDING_INDEPENDENT_AUDIT',
  officialB5FullMarketIndependentAccepted:false,certifiedOrdinaryShareDenominator:null,
  independentPITAccepted:false,selectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,mappedInstrumentCount:universe.length,unknownInstrumentCount:0,
  conflictInstrumentCount:0,sourceLateAtEvaluation:false,mapping,summaries};
 const dataB5ScopeReceipt={...d,receiptHash:hash(JSON.stringify(d))};
 return {marketDate:day,observedAtUtc:day+'T14:20:00Z',
  generatedAtUtc:'2026-10-17T13:00:00Z',a1OriginalReceiptHash:H,
  dataB5ScopeReceipt,sourceUniverse:universe,dailyRows};
}
async function run({inputs=fixture(),seeds=research,generatedAtUtc='2026-10-17T14:00:00Z'}={}){
 const radar=await buildSystem2IndustryActivityRadarV0_1(inputs);
 return build({activityReceipt:radar,radarSourceInputs:inputs,priorResearchSeeds:seeds,generatedAtUtc});
}
test('reuses BR046 ABF two different native sectors and BR047 AI two supply roles without whole-sector inference',async()=>{
 const r=await run();
 const abf=r.themeGroups.find(x=>x.cohortCode==='ABF_IC_SUBSTRATE');
 const ai=r.themeGroups.find(x=>x.cohortCode==='AI_DATA_CENTER');
 assert.deepEqual(abf.members.map(x=>x.symbol),['3189','8046']);
 assert.deepEqual(ai.members.map(x=>x.symbol),['2308','2382']);
 assert.equal(abf.observedMemberTradeValueTwd,300);
 assert.equal(ai.observedMemberTradeValueTwd,800);
 assert.equal(r.subindustryGroups.length,4);
 assert.equal(r.themeGroups.length,2);
 assert.equal(r.researchIssuerInA1ScopeCount,6);
 assert.equal(r.researchIssuerKnownButNoProductEdgeCount,2);
 assert.equal(r.themeGrossMemberMembershipCount,4);
 assert.equal(r.uniqueThemeResearchMemberCount,4);
 assert.equal(r.overlappingThemeStockCount,0);
 assert.equal(r.summedThemeMemberGrossTradeValueTwd,1100);
 assert.equal(r.uniqueObservedThemeMemberGrossTradeValueTwd,1100);
 assert.equal(r.fullUniverseThemeCoverageRate,null);
 assert.equal(ai.officiallyCompleteCohortMembership,false);
 assert.equal(ai.trueIssuerRevenueExposureWeightedTradeValueTwd,null);
 assert.equal(r.nativeInstitutionalNetMoneyValueTwd,null);
 assert.equal(r.selectedCount,null);
 assert.match(render(r),/均不是淨流入/);
});
test('two products in same theme count issuer 2308 once for AI',async()=>{
 const r=await run(),ai=r.themeGroups.find(x=>x.cohortCode==='AI_DATA_CENTER');
 const delta=ai.members.find(x=>x.symbol==='2308');
 assert.equal(delta.products.length,2);
 assert.equal(delta.supplyChainRoles.length,2);
 assert.equal(ai.observedResearchMemberCount,2);
 assert.equal(ai.observedMemberTradeValueTwd,800);
});
test('one issuer in two distinct themes is overlap not unique incoming capital',async()=>{
 const seeds=structuredClone(research);
 seeds.records.find(x=>x.symbol==='2308').edges.push({
   subindustry:'ENERGY_STORAGE_POWER',product:'儲能電源',
   supplyRole:'POWER_INFRASTRUCTURE',theme:'ENERGY_STORAGE',exposureMagnitude:'UNKNOWN'
 });
 const r=await run({seeds});
 assert.equal(r.overlappingThemeStockCount,1);
 assert.deepEqual(r.overlapStockIdentities,[{stock:'TWSE|2308',themeCount:2}]);
 assert.equal(r.themeGrossMemberMembershipCount,5);
 assert.equal(r.uniqueThemeResearchMemberCount,4);
 assert.equal(r.summedThemeMemberGrossTradeValueTwd,1600);
 assert.equal(r.uniqueObservedThemeMemberGrossTradeValueTwd,1100);
 assert.equal(r.duplicatedActivityFromCrossThemeMembersTwd,500);
 assert.equal(r.summedThemeAmountIsUniqueMoneyFlow,false);
});
test('prior research after original market T is excluded, not backfilled from 2026 October discoveries',async()=>{
 const r=await run({inputs:fixture('2026-10-05')});
 assert.equal(r.researchIssuerKnownByTCount,2);
 assert.equal(r.researchIssuerExcludedByTimeCount,4);
 assert.equal(r.themeGroups.length,1);
 assert.equal(r.themeGroups[0].cohortCode,'ABF_IC_SUBSTRATE');
 assert.equal(r.subindustryGroups.length,1);
});
test('missing exact bar is UNKNOWN sector turnover rather than zero or capital flight',async()=>{
 const inputs=fixture();
 inputs.dailyRows=inputs.dailyRows.filter(x=>x.symbol!=='3189');
 const r=await run({inputs});
 const abf=r.themeGroups.find(x=>x.cohortCode==='ABF_IC_SUBSTRATE');
 assert.equal(abf.observedMemberTradeValueTwd,null);
 assert.equal(abf.missingTradeValueMembers,1);
 assert.equal(abf.observedPartialMemberTradeValueTwd,100);
 assert.equal(r.summedThemeMemberGrossTradeValueTwd,null);
 assert.equal(r.uniqueObservedThemeMemberGrossTradeValueTwd,null);
 assert.equal(r.duplicatedActivityFromCrossThemeMembersTwd,null);
});
test('bar identity source rowHash must match full A1 original identity even if main radar signature recomputes',async()=>{
 const inputs=fixture();
 inputs.dailyRows[0].sourceRowHash='f'.repeat(64);
 await assert.rejects(run({inputs}),/A1_BAR_ORIGINAL_ROW_HASH_MISMATCH/);
 const missing=fixture();delete missing.sourceUniverse[0].sourceRowHash;
 await assert.rejects(run({inputs:missing}),/SOURCE_UNIVERSE_ROW_HASH_REQUIRED/);
});
test('no duplicate issuer seeds or invented revenue exposure allowed',async()=>{
 const seeds=structuredClone(research);seeds.records.push(structuredClone(seeds.records[0]));
 await assert.rejects(run({seeds}),/DUPLICATED_ISSUER_RESEARCH_SEED/);
 const fake=structuredClone(research);fake.records[0].edges[0].exposureMagnitude='50%';
 await assert.rejects(run({seeds:fake}),/EXISTING_RESEARCH_EVIDENCE_CONTRACT_INVALID/);
});
test('source-signed radar hash and generation clock fail closed',async()=>{
 const inputs=fixture();
 const radar=await buildSystem2IndustryActivityRadarV0_1(inputs);
 const changed={...radar,selectedCount:0};
 await assert.rejects(build({activityReceipt:changed,radarSourceInputs:inputs,
  priorResearchSeeds:research,generatedAtUtc:'2026-10-17T14:00:00Z'}),/ACTIVITY_RECEIPT_INVALID/);
 await assert.rejects(build({activityReceipt:radar,radarSourceInputs:inputs,
  priorResearchSeeds:research,generatedAtUtc:'2026-10-17T12:00:00Z'}),
  /ACTIVITY_DATE_OR_GENERATION_CLOCK_INVALID/);
});
test('moving A1 daily row after radar source receipt blocks exact recomputed lineage',async()=>{
 const inputs=fixture();const radar=await buildSystem2IndustryActivityRadarV0_1(inputs);
 const bad=structuredClone(inputs);bad.dailyRows[0].tradeValueTwd=10000;
 await assert.rejects(build({activityReceipt:radar,radarSourceInputs:bad,
  priorResearchSeeds:research,generatedAtUtc:'2026-10-17T14:00:00Z'}),
  /ACTIVITY_SOURCE_REPLAY_MISMATCH/);
});
test('source-only scope never emits strategy, PIT, Frozen or transaction authority',async()=>{
 const r=await run();
 assert.equal(r.classificationPITAccepted,false);
 assert.equal(r.strategyScoreImpact,0);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.shadowAuthorized,false);
 assert.equal(r.ordersAuthorized,false);
 assert.equal(r.providerGetsAdded,0);
 assert.equal(r.cloudflareD1Writes,0);
 assert.equal(r.cloudflareR2Writes,0);
 assert.equal(r.system1FormalCoreChanged,false);
});
