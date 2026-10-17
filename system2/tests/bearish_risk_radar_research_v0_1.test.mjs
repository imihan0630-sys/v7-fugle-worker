import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildA1HistoryPrimitiveBundle} from '../runtime/a1_history_primitives_v0_1.mjs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {evaluateBearishRiskRadarV0_1 as evalBear} from '../runtime/bearish_risk_radar_research_v0_1.mjs';

const HASH='a'.repeat(64),DAY=86400000;
async function caseBundle({falling=true,calendarLast='2026-07-31',symbol='2323'}={}){
 const last=Date.parse(calendarLast+'T00:00:00Z');
 const bars=[];
 for(let i=0;i<61;i++){
  const date=new Date(last-(60-i)*DAY).toISOString().slice(0,10);
  const close=falling?(i===60?176:300-i*2):100+i*2;
  const open=falling?close+1:close-1;
  const high=Math.max(close,open)+2,low=Math.min(close,open)-2;
  const volumeShares=i===60?3000000:1000000;
  bars.push({date,open,high,low,close,volumeShares,tradeValue:close*volumeShares});
 }
 const observedAt=calendarLast+'T13:40:00.000Z';
 const evaluationAtUtc=new Date(last+DAY).toISOString().slice(0,10)+'T02:00:00.000Z';
 const b=await buildA1HistoryPrimitiveBundle({
   bundleId:'BEAR-RESEARCH-'+symbol+'-'+calendarLast,
   symbol,marketDate:calendarLast,decisionTimestamp:evaluationAtUtc,
   observedAt,availableAt:observedAt,bars,sourceId:'SYNTHETIC_UNIT_TEST_ONLY',
   sourceName:'SYNTHETIC NEVER REAL PROVIDER',
   priceSpace:'RAW',volumeUnit:'SHARES',continuityState:'CLEAR_NO_ACTION'
 });
 const evidence={
  symbol,market:'TWSE',marketDate:calendarLast,
  originalNativeSourceSha256:HASH,firstPhysicalObservedAtUtc:observedAt,
  availableAtUtc:observedAt,
  sourceEvidenceClass:'SOURCE_ONLY_PREVIEW_NOT_INDEPENDENT_AUDIT',
  priceContinuityReviewState:'SOURCE_REVIEWED_NO_KNOWN_MATERIAL_EVENT',
  knownMaterialCompanyActionInsideWindow:false
 };
 return {factorBundle:b,market:'TWSE',sourceEvidence:evidence,evaluationAtUtc,regime:'RISK_OFF'};
}
test('bearish confluence can be observed but NEVER borrow/PIT/score/short or rank',async()=>{
 const f=await caseBundle();
 const r=await evalBear(f),{receiptHash,...base}=r;
 assert.equal(r.state,'BEARISH_CONFLUENCE_RESEARCH_ONLY');
 assert.equal(receiptHash,await sha256Hex(base));
 assert.equal(r.observedSignals.length,3);
 assert.equal(r.rank,null);
 assert.equal(r.signalStrengthScore,null);
 assert.equal(r.recommendationToShort,false);
 assert.equal(r.shortEligible,false);
 assert.equal(r.borrowLocateVerified,false);
 assert.equal(r.tradeabilityVerified,false);
 assert.equal(r.formalPITAEligible,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.shortShadowAuthorized,false);
 assert.ok(r.warnings.includes('NO_EVENT_NOT_AUTHORITATIVELY_PROVED_IN_PREVIEW'));
});
test('bullish opposite-direction data does NOT become an inverted short signal',async()=>{
 const r=await evalBear(await caseBundle({falling:false}));
 assert.equal(r.state,'CONTRADICTED_BY_BULLISH_TREND');
 assert.deepEqual(r.observedSignals,[]);
 assert.ok(r.counterEvidence.includes('BULLISH_MA_MOMENTUM_REFUTES_SHORT'));
 assert.equal(r.recommendationToShort,false);
});
test('real known 2330 2026-09-16 dividend cannot be laundered as no event',async()=>{
 const f=await caseBundle({calendarLast:'2026-10-16',symbol:'2330'});
 f.sourceEvidence.knownMaterialCompanyActionInsideWindow=false;
 const r=await evalBear(f);
 assert.equal(r.state,'DATA_BLOCKED');
 assert.ok(r.blockers.includes('KNOWN_PRICE_DISCONTINUITY_DIVIDEND_INSIDE_WINDOW'));
 assert.equal(r.observedBearishRiskSignalCount,0);
 assert.equal(r.shortEligible,false);
});
test('unknown company action evidence blocks preview pattern even if factor snapshot says CLEAR',async()=>{
 const f=await caseBundle();
 f.sourceEvidence.priceContinuityReviewState='UNKNOWN';
 let r=await evalBear(f);
 assert.equal(r.state,'DATA_BLOCKED');
 assert.ok(r.blockers.includes('MATERIAL_CORPORATE_ACTION_CONTINUITY_NOT_VERIFIED'));
 f.sourceEvidence.priceContinuityReviewState='SOURCE_REVIEWED_NO_KNOWN_MATERIAL_EVENT';
 delete f.sourceEvidence.knownMaterialCompanyActionInsideWindow;
 r=await evalBear(f);
 assert.equal(r.state,'DATA_BLOCKED');
 assert.ok(r.blockers.includes('COMPANY_ACTION_EVENT_FLAG_UNKNOWN'));
});
test('source identity, original capture clock and signed metric snapshot are immutable',async()=>{
 const f=await caseBundle();
 await assert.rejects(evalBear({...f,market:'TPEX'}),/SOURCE_EVIDENCE_REQUIRED_OR_IDENTITY_INVALID/);
 await assert.rejects(evalBear({...f,sourceEvidence:{...f.sourceEvidence,
    sourceEvidenceClass:'INDEPENDENT_PIT_CERTIFIED'}}),
  /SOURCE_AUDIT_AUTHORITY_CANNOT_BE_SELF_DECLARED/);
 const late={...f,sourceEvidence:{...f.sourceEvidence,availableAtUtc:'2026-08-02T00:00:00.000Z'}};
 const r=await evalBear(late);
 assert.equal(r.state,'DATA_BLOCKED');
 assert.ok(r.blockers.includes('ASOF_SOURCE_OR_FACTOR_OBSERVED_AFTER_DECISION'));
 const corrupt={...f,factorBundle:{...f.factorBundle,
   coreMetrics:{...f.factorBundle.coreMetrics,ret20:9999}}};
 await assert.rejects(evalBear(corrupt),/FACTOR_SNAPSHOT_CONTENT_HASH_INVALID/);
});
test('unknown market regime cannot be substituted for a verified risk-off label',async()=>{
 const f=await caseBundle();
 const r=await evalBear({...f,regime:'UNKNOWN'});
 assert.equal(r.marketRegimeSourceAudited,false);
 assert.ok(r.warnings.includes('MARKET_REGIME_UNVERIFIED_NO_REGIME_RECOMMENDATION'));
 assert.equal(r.recommendationToShort,false);
});
test('research-only module cannot create broker orders, D1 writes or modify V8',()=>{
 const p=readFileSync('system2/runtime/bearish_risk_radar_research_v0_1.mjs','utf8');
 assert.doesNotMatch(p,/\bfetch\s*\(|\bINSERT\s+INTO\b|\bUPDATE\s+\w+\s+SET\b|\bDELETE\s+FROM\b|wrangler\.toml|orders\.submit|placeOrder\s*\(/);
 assert.match(p,/shortEligible:false/);
 assert.match(p,/formalPITAEligible:false/);
 assert.match(p,/frozenD1Written:false/);
});
