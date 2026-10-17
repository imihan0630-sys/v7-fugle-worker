import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildSystem2IndustryResearchEnrichmentV0_1 as build,renderIndustryResearchContextV0_1 as render} from '../runtime/industry_research_enrichment_v0_1.mjs';
const EVIDENCE=JSON.parse(await readFile(new URL('../data/industry_prior_research_reuse_seeds_v0_1.json',import.meta.url),'utf8'));
const HASH='a'.repeat(64),AUD='b'.repeat(64);
const sign=async x=>({...x,receiptHash:await sha256Hex(x)});
async function handoff({day='2026-10-13',symbols=[['TWSE','8046'],['TWSE','3189'],['TWSE','2330'],['TPEX','1595']],blocked=false}={}){
 const rows=symbols.map(([market,symbol],i)=>({
  market,symbol,companyName:symbol,marketDate:day,previewDisplayOrder:i+1,
  sourceRowHash:HASH,formalStrategyRank:null,previewIsTradeRecommendation:false
 }));
 const p=blocked?null:await sign({
  marketDate:day,requestedLayer:'NON_PIT_PREVIEW',
  sourceOriginalReceiptHash:HASH,sourceAuditHashNotStrategyPIT:AUD,
  originalObservedAtUtc:day+'T14:00:00Z',sourceUniverseCount:1972,
  strategySelectedCount:null,frozenD1Written:false,ordersAuthorized:false,
  previewRows:rows
 });
 return sign({
  schemaVersion:'S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1',
  marketDate:day,state:blocked?'PRELIMINARY_SOURCE_NOT_READY':'NON_PIT_SOURCE_OBSERVATION_READY',
  auditedAtUtc:day+'T13:00:00Z',originalSourceReceiptHash:HASH,
  independentSourceAuditHash:AUD,previewReport:p,
  observedPreviewCount:blocked?null:rows.length,
  selectedCount:null,zeroPickDay:null,pitACertificationGranted:false,
  pitBCertificationGranted:false,frozenD1Written:false,system1FormalCoreChanged:false
 });
}
const run=async(h,e=EVIDENCE,generatedAtUtc='2026-10-17T12:00:00Z')=>
 build({handoff:h,evidence:e,generatedAtUtc});
test('BR046 official industry != theme: 8046 and 3189 share ABF across distinct industries',async()=>{
 const r=await run(await handoff());
 assert.equal(r.rows.length,4);
 assert.equal(r.previewPriorResearchLabelCount,3);
 assert.equal(r.previewSubindustryProductEvidenceCount,2);
 assert.equal(r.rows[0].formalIndustryLabel,'電子零組件業');
 assert.equal(r.rows[1].formalIndustryLabel,'半導體業');
 assert.deepEqual(r.rows[0].themeIds,['ABF_IC_SUBSTRATE']);
 assert.deepEqual(r.rows[1].themeIds,['ABF_IC_SUBSTRATE']);
 assert.equal(r.rows[2].subindustryState,'SUBINDUSTRY_UNKNOWN');
 assert.deepEqual(r.rows[2].themeIds,[]);
 assert.equal(r.rows[0].supplyChainEdges[0].revenueShare,'UNKNOWN');
 assert.equal(r.rows[0].officialCurrentB5Verified,false);
 assert.equal(r.fullMarketIndustryCoverageRate,null);
 assert.equal(r.selectedCount,null);
 assert.equal(r.industryScoreEffect,undefined);
 assert.equal(r.receiptHash,await sha256Hex(Object.fromEntries(Object.entries(r).filter(([k])=>k!=='receiptHash'))));
 assert.match(render(r),/SUBINDUSTRY_UNKNOWN/);
});
test('BR047 heterogeneity: Quanta server ODM and Delta power/cooling, no revenue equality',async()=>{
 const r=await run(await handoff({symbols:[['TWSE','2382'],['TWSE','2308']]}));
 assert.equal(r.rows[0].formalIndustryLabel,'電腦及週邊設備業');
 assert.equal(r.rows[1].formalIndustryLabel,'電子零組件業');
 assert.deepEqual(r.rows[0].themeIds,['AI_DATA_CENTER']);
 assert.deepEqual(r.rows[1].themeIds,['AI_DATA_CENTER']);
 assert.equal(r.rows[1].supplyChainEdges.length,2);
 assert.equal(r.rows[0].supplyChainEdges[0].supplyRole,'SERVER_MANUFACTURING');
 assert.equal(r.rows[1].supplyChainEdges[0].supplyRole,'POWER_INFRASTRUCTURE');
 assert.equal(r.rows[0].supplyChainEdges[0].orderShare,'UNKNOWN');
});
test('BR083 TPEx June reclassification visible only after research capture, never backfilled',async()=>{
 const current=await run(await handoff({symbols:[['TPEX','1595'],['TPEX','3131']]}));
 assert.equal(current.rows[0].formalIndustryLabel,'半導體業');
 assert.equal(current.rows[0].industryChangeEffectiveFrom,'2026-06-01');
 assert.equal(current.rows[0].subindustryState,'SUBINDUSTRY_UNKNOWN');
 const older=await run(await handoff({day:'2026-06-02',symbols:[['TPEX','1595']]}));
 assert.equal(older.rows[0].formalIndustryLabel,null);
 assert.equal(older.rows[0].industryChangeEffectiveFrom,null);
 const prior=await run(await handoff({day:'2026-05-29',symbols:[['TPEX','1595']]}));
 assert.equal(prior.rows[0].formalIndustryLabel,null);
});
test('future BR047 capture and negative theme example remain UNKNOWN',async()=>{
 const r=await run(await handoff({day:'2026-10-05',symbols:[['TWSE','2382'],['TWSE','2330']]}));
 assert.equal(r.previewPriorResearchLabelCount,0);
 assert.equal(r.previewSubindustryUnknownCount,2);
 assert.equal(r.rows[0].sourcePath,null);
});
test('source unavailable is not false selected=0; enrichment does not suppress preview',async()=>{
 const r=await run(await handoff({blocked:true}));
 assert.equal(r.sourceReady,false);
 assert.equal(r.previewRowCount,null);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.match(render(r),/SOURCE_NOT_READY/);
});
test('signed handoff mutation and upstream PIT/Frozen claim fail closed',async()=>{
 const h=await handoff();h.marketDate='2026-10-14';
 await assert.rejects(()=>run(h),/SIGNED_SOURCE_OR_AUTHORITY_INVALID/);
 const a=await handoff(), u={...a,pitACertificationGranted:true};
 u.receiptHash=await sha256Hex(Object.fromEntries(Object.entries(u).filter(([k])=>k!=='receiptHash')));
 await assert.rejects(()=>run(u),/SIGNED_SOURCE_OR_AUTHORITY_INVALID/);
});
test('forged preview edge, duplicate or corrupt original preview is rejected',async()=>{
 const a=await handoff(),p=structuredClone(a.previewReport);
 p.previewRows[0].symbol='1111';
 const b={...a,previewReport:await sign(Object.fromEntries(Object.entries(p).filter(([k])=>k!=='receiptHash')))};
 b.receiptHash=await sha256Hex(Object.fromEntries(Object.entries(b).filter(([k])=>k!=='receiptHash')));
 const r=await run(b);
 assert.equal(r.rows[0].formalIndustryLabel,null);
 const z=await handoff({symbols:[['TWSE','8046'],['TWSE','8046']]});
 await assert.rejects(()=>run(z),/PREVIEW_ROW_INVALID_OR_DUPLICATED/);
 const x=await handoff();x.previewReport.previewRows[0].symbol='1234';
 await assert.rejects(()=>run(x),/SIGNED_SOURCE_OR_AUTHORITY_INVALID/);
});
test('conflicting seed records, invented revenue, changing rank or wrong cutoff rejected',async()=>{
 const h=await handoff();
 await assert.rejects(()=>run(h,{...EVIDENCE,records:[...EVIDENCE.records,EVIDENCE.records[0]]}),/SEED_INVALID_OR_CONFLICTED/);
 const bad=structuredClone(EVIDENCE);bad.records[0].edges[0].exposureMagnitude='55%';
 await assert.rejects(()=>run(h,bad),/SEED_INVALID_OR_CONFLICTED/);
 const future=await handoff();future.previewReport.previewRows[0].formalStrategyRank=1;
 await assert.rejects(()=>run(future),/SIGNED_SOURCE_OR_AUTHORITY_INVALID/);
 const beforeAudit=await handoff();
 await assert.rejects(()=>run(beforeAudit,EVIDENCE,'2026-10-13T12:00:00Z'),/SIGNED_SOURCE_OR_AUTHORITY_INVALID/);
});
console.log('S2 INDUSTRY CLASS A tests executed');
