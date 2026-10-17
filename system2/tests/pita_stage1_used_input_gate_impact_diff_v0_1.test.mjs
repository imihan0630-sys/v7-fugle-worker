import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {CURRENT_LAUNCH_FACTORS}
 from '../runtime/pita_short_momentum_used_input_manifest_v0_1.mjs';
import {buildPitAStage1UsedInputGateImpactV0_1 as build,
 inspectActualFactorEventExposureV0_1 as inspect}
 from '../runtime/pita_stage1_used_input_gate_impact_diff_v0_1.mjs';

const gate=p=>readFileSync('system2/runtime/'+p,'utf8');
test('real current seven-factor manifest is immutable impact baseline with hashed contract',async()=>{
 const r=await build();
 assert.equal(r.status,'RESEARCH_ONLY_OWNER_REVIEW_NOT_AN_EFFECTIVE_GATE');
 assert.equal(r.strategyId,'SHORT_MOMENTUM');
 assert.equal(r.strategyVersion,'V0.1-CONTRACT');
 assert.equal(r.exactLocalControlCount,2);
 assert.equal(r.realPitAcceptedLocalCount,0);
 assert.equal(r.realPitUnknownLocalCount,2);
 assert.equal(r.fullMarketOrdinaryShareDenominator,null);
 const {receiptHash,...base}=r;
 assert.equal(await sha256Hex(base),receiptHash);
 assert.match(r.manifestReceiptHash,/^[a-f0-9]{64}$/);
 assert.deepEqual(r.impactCases.map(x=>x.symbol),['2330','3287']);
});
test('both actual event positive controls cross their real original source 61-session windows',async()=>{
 const r=await build();
 const t=r.impactCases[0],q=r.impactCases[1];
 assert.equal(t.market,'TWSE');
 assert.equal(t.knownAction.eventDate,'2026-09-16');
 assert.equal(q.market,'TPEX');
 assert.equal(q.knownAction.eventDate,'2026-08-26');
 for(const c of r.impactCases){
  assert.equal(c.sourceWindowStart,'2026-07-21');
  assert.equal(c.sourceWindowEnd,c.marketDate);
  assert.ok(c.sourceWindowStart<=c.knownAction.eventDate);
  assert.ok(c.knownAction.eventDate<=c.sourceWindowEnd);
  assert.equal(c.native61BarSourceObserved,true);
  assert.equal(c.pitAIndependentlyAccepted,false);
  assert.equal(c.eligibleForStage1,false);
  assert.equal(c.knownAction.independentCutPITAccepted,false);
  assert.equal(c.factorExposure.length,7);
  assert.ok(c.priceSensitiveLaunchFactors.length>=5);
  assert.equal(c.factorExposure.every(x=>x.factorInputDroppingAllowed===false),true);
 }
 assert.deepEqual(q.knownCrossingMetricExamples,['ma60','ret60','priorHigh60']);
});
test('CA signal is per actual factor inputs, never blanket safe because volume does not use price',async()=>{
 const r=await build();
 const by=Object.fromEntries(r.impactCases[0].factorExposure.map(x=>[x.factorId,x]));
 assert.equal(by['TECH.TREND'].priceDiscontinuitySensitive,true);
 assert.equal(by['TECH.STRUCTURE'].priceDiscontinuitySensitive,true);
 assert.equal(by['PV.RELATIVE_VOLUME'].priceDiscontinuitySensitive,false);
 assert.match(by['PV.RELATIVE_VOLUME'].effectOfSpecificCashDividendOnFactor,/DO_NOT_ASSERT_ABSENCE/);
 assert.equal(by['PV.ACCEPTANCE'].priceDiscontinuitySensitive,true);
 assert.equal(by['PV.RESPONSE'].priceDiscontinuitySensitive,true);
 assert.equal(by['RISK.LIQUIDITY'].priceDiscontinuitySensitive,false);
 assert.equal(by['RISK.EXTENSION'].priceDiscontinuitySensitive,true);
 assert.equal(r.impactCases[0].factorExposure.every(x=>x.independentlyResolved===false),true);
});
test('positive source identity does not waive exact-cut audited current class, price continuity or tradeability',async()=>{
 const r=await build();
 for(const x of r.impactCases){
  assert.equal(x.status,'SOURCE_ONLY__PIT_A_NOT_ACCEPTED');
  assert.equal(x.proposedOwnerReviewCandidate.candidateWouldAdmitCurrentRealCase,false);
  assert.equal(x.proposedOwnerReviewCandidate.evaluatedAgainstRealSource,false);
  assert.equal(x.proposedOwnerReviewCandidate.ownerClassBCApprovalRequired,true);
  assert.ok(x.proposedOwnerReviewCandidate.stillRequires.includes('ACTUAL_TRADEABILITY_HALT_RESUME_AT_CUT'));
  assert.ok(x.proposedOwnerReviewCandidate.stillRequires.includes('RELEVANT_CA_REVISION_RETRACTION_AND_NEGATIVE_SCOPE_AUDIT'));
  assert.ok(x.proposedOwnerReviewCandidate.stillRequires.includes('ALL_SEVEN_FACTOR_INPUTS_PINNED_TO_STRATEGY_VERSION'));
  assert.equal(x.selectedCount,null);
  assert.equal(x.zeroPickDay,null);
  assert.equal(x.canBackdateOriginalDecision,false);
 }
});
test('real existing Stage1 CFI and CA gates are still strict and were not touched',()=>{
 const ca=gate('stage1_ca_pit_evidence_gate_v0_1.mjs');
 const cfi=gate('stage1_instrument_class_pit_gate_v0_1.mjs');
 assert.match(ca,/row\?\.state!=='CLEAR_NO_ACTION'/);
 assert.match(ca,/revisionCoverageComplete!==true/);
 assert.match(ca,/a\.verdict!=='ACCEPTED_SOURCE_COMPLETENESS_ONLY'/);
 assert.match(cfi,/historicalNativeEffectivePeriodsIndependentlyVerified!==true/);
 assert.match(cfi,/row\.effectiveFromDate>windowStartDate/);
 assert.match(cfi,/originalProviderHistoricalVersionReadbackVerified!==true/);
 assert.match(cfi,/depositaryName\(source\.companyName\)/);
});
test('negative: a known event outside the required window is NOT reused as if in scope',()=>{
 const source={
  marketDate:'2026-10-16',sourceWindowStart:'2026-07-21',
  sourceWindowEnd:'2026-10-16',eventDate:'2026-07-20',eventNativeSourceObserved:true
 };
 assert.throws(()=>inspect(CURRENT_LAUNCH_FACTORS,source),/SCOPE_OR_REAL_CA_EVIDENCE_INVALID/);
 assert.throws(()=>inspect(CURRENT_LAUNCH_FACTORS,{...source,eventDate:'2026-10-17'}),/SCOPE_OR_REAL_CA_EVIDENCE_INVALID/);
 assert.throws(()=>inspect(CURRENT_LAUNCH_FACTORS,{...source,eventDate:'2026-02-30'}),/SCOPE_OR_REAL_CA_EVIDENCE_INVALID/);
 assert.throws(()=>inspect(CURRENT_LAUNCH_FACTORS,{...source,eventDate:'2026-09-16',eventNativeSourceObserved:false}),/SCOPE_OR_REAL_CA_EVIDENCE_INVALID/);
});
test('negative: user-edited fewer factors, missing native fields, wrong window rejected',()=>{
 const ok={
  marketDate:'2026-10-16',sourceWindowStart:'2026-07-21',
  sourceWindowEnd:'2026-10-16',eventDate:'2026-09-16',eventNativeSourceObserved:true
 };
 assert.throws(()=>inspect(CURRENT_LAUNCH_FACTORS.slice(1),ok),/SEVEN_LAUNCH_FACTORS_REQUIRED/);
 assert.throws(()=>inspect([...CURRENT_LAUNCH_FACTORS.slice(0,6),CURRENT_LAUNCH_FACTORS[0]],ok),/SEVEN_LAUNCH_FACTORS_REQUIRED/);
 assert.throws(()=>inspect(CURRENT_LAUNCH_FACTORS.map((f,i)=>i===0?{...f,nativeInputs:[]}:f),ok),/FACTOR_INPUT_MANIFEST_INCOMPLETE/);
 assert.throws(()=>inspect(CURRENT_LAUNCH_FACTORS.map((f,i)=>i===0?{...f,historyWindowSessions:20}:f),ok),/FACTOR_INPUT_MANIFEST_INCOMPLETE/);
});
test('proposal never owns strategy admission or runtime side effect, nor masquerades CI for PIT',async()=>{
 const r=await build();
 assert.equal(r.ownerClassBCApprovalRequired,true);
 assert.equal(r.noPITAOrPITBPromotion,true);
 assert.equal(r.proposedPolicyMayNotBePromotedByCI,true);
 assert.equal(r.stage1EvaluationAuthorized,false);
 assert.equal(r.rankAuthorized,false);
 assert.equal(r.shadowAuthorized,false);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.newSourceProviderGET,0);
 assert.equal(r.newCronCount,0);
 assert.equal(r.cloudflareD1Reads,0);
 assert.equal(r.cloudflareD1Writes,0);
 assert.equal(r.cloudflareR2Calls,0);
 assert.equal(r.formalOrdersAuthorized,false);
 assert.equal(r.pushAuthorized,false);
 assert.equal(r.system1FormalCoreChanged,false);
 const s=gate('pita_stage1_used_input_gate_impact_diff_v0_1.mjs');
 assert.doesNotMatch(s,/\bfetch\s*\(|\bINSERT INTO\b|\bUPDATE\s+s2_|\bDELETE FROM\b|api\.cloudflare\.com|\.\/stage1_ca_pit_evidence_gate_v0_1\.mjs/);
});
