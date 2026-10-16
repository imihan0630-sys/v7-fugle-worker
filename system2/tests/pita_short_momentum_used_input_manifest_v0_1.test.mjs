import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {describeActualShortMomentumLaunchUsedInputsV0_1 as manifest,
 CURRENT_LAUNCH_FACTORS as factors}
 from '../runtime/pita_short_momentum_used_input_manifest_v0_1.mjs';
const read=p=>readFileSync('system2/runtime/'+p,'utf8');

test('contract-owned launch manifest pins seven observed factors and three required families',async()=>{
 const r=await manifest(),{receiptHash,...base}=r;
 assert.equal(receiptHash,await sha256Hex(base));
 assert.equal(r.strategyId,'SHORT_MOMENTUM');
 assert.equal(r.strategyVersion,'V0.1-CONTRACT');
 assert.equal(r.assessorPolicyVersion,'0.1-LAUNCH');
 assert.equal(r.launchStage1FactorCount,7);
 assert.deepEqual(r.contractFamilies.filter(x=>x.contractUnknownBlocksEligibility)
  .map(x=>x.family).sort(),['PRICE_VOLUME','RISK_FRICTION','TECHNICAL_STRUCTURE']);
 assert.deepEqual(factors.map(x=>x.id),[
  'TECH.TREND','TECH.STRUCTURE','PV.RELATIVE_VOLUME','PV.ACCEPTANCE',
  'PV.RESPONSE','RISK.LIQUIDITY','RISK.EXTENSION']);
 assert.equal(r.contractFamilies.find(x=>x.family==='MARKET_REGIME').contractRole,'PRIMARY');
 assert.equal(r.contractFamilies.find(x=>x.family==='MARKET_REGIME').contractUnknownBlocksEligibility,false);
 assert.equal(r.contractDeclaredNotSameAsLaunchUse,true);
});
test('every used factor and mandatory metric corresponds to checked-in builder source',async()=>{
 const a=read('stage1_assessor_policies_v0_1.mjs');
 const p=read('a1_history_primitives_v0_1.mjs');
 const c=read('source_first_short_momentum_evaluator_v0_1.mjs');
 for(const f of factors){
  assert.match(a,new RegExp(f.id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.ok(p.includes('factorId: "'+f.id+'"'),f.id+' primitive must be present');
  for(const v of f.mandatoryMetrics)assert.ok(p.includes('metrics.'+v),f.id+':'+v);
  for(const n of f.nativeInputs)assert.ok(p.includes(''+n),f.id+':'+n);
 }
 assert.match(c,/hist\.length===61/);
 assert.match(c,/independentOriginalVerification!==true/);
 assert.match(c,/sourceOrdinarySymbolCount===sourceLedger\.observations\.length/);
 assert.match(c,/continuityBySymbol/);
 assert.match(c,/instrumentClassBySymbol/);
});
test('real 2330 dividend requires CA-correct transformed price space or independent safe exclusion',async()=>{
 const r=await manifest();
 assert.equal(r.knownReal2330Dividend.eventDate,'2026-09-16');
 assert.equal(r.knownReal2330Dividend.crossing61BarPriceFeatureUnsafeUntilVerifiedAdjustmentOrExclusion,true);
 assert.equal(r.knownReal2330Dividend.actualAdjustedPriceLineageIndependentlyAccepted,false);
 assert.equal(r.boundedRelevantCaAndPriceContinuityAlwaysRequired,true);
 const ca=read('stage1_ca_pit_evidence_gate_v0_1.mjs');
 const s=read('source_first_short_momentum_evaluator_v0_1.mjs');
 assert.match(ca,/row\?\.state!=='CLEAR_NO_ACTION'/);
 assert.match(ca,/Adjusted-continuity requires separate verified/);
 assert.match(s,/c\.state==='ADJUSTED_CONTINUITY'/);
 assert.equal(r.legacyCaGateAllowsOnlyClearNoAction,true);
 assert.equal(r.evaluatorRecognizesAdjustedContinuity,true);
 assert.equal(r.unresolvedPolicyConflict,'CLASS_BC_OWNER_REVIEW_REQUIRED_BEFORE_EXISTING_STAGE1_ADMISSION_GATE_CHANGE');
});
test('historical issuer classifications are NOT silently exempted by this research manifest',async()=>{
 const r=await manifest();
 assert.equal(r.pastIssuerCfiEffectivePeriodsUniversallyRequiredForThisLaunchScope,false);
 assert.equal(r.pastIssuerCfiBecomesRequiredIfUsedForIPOOrHistoricClassFeature,true);
 const instrument=read('stage1_instrument_class_pit_gate_v0_1.mjs');
 assert.match(instrument,/historicalNativeEffectivePeriodsIndependentlyVerified!==true/);
 assert.match(instrument,/row\.effectiveFromDate>windowStartDate/);
 assert.equal(r.legacyInstrumentGateDemands61SessionHistoricalEffectiveWindow,true);
 assert.equal(r.knownReal2330Dividend.actualAdjustedPriceLineageIndependentlyAccepted,false);
});
test('research manifest never grants strategy admission, selection, zero picks, Shadow or Frozen',async()=>{
 const r=await manifest();
 assert.equal(r.stage1EvaluationAuthorized,false);
 assert.equal(r.fullMarketRankingAuthorized,false);
 assert.equal(r.pitASourceScopeIndependentlyAccepted,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.shadowAuthorized,false);
 assert.equal(r.pitBHistoricalReplayCertified,false);
 assert.equal(r.cloudflareD1Writes,0);
 assert.equal(r.system1FormalCoreChanged,false);
 const s=read('pita_short_momentum_used_input_manifest_v0_1.mjs');
 assert.doesNotMatch(s,/\bfetch\s*\(|INSERT INTO|UPDATE\s+|DELETE FROM|api\.cloudflare\.com/);
});
