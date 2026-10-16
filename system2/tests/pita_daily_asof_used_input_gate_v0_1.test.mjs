import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {SOURCE_CORE_PROFILE_V0_1,inspectPitADailyUsedInputsV0_1 as check}
 from '../migration/pita_daily_asof_used_input_gate_v0_1.mjs';
const auditSha='b'.repeat(64),sourceSha='a'.repeat(64);
const cut='2026-10-16T15:45:00.000Z';
const observed='2026-10-16T13:31:18.152Z';
const audited={status:'ASOF_EVIDENCE_AUDITED',marketDate:'2026-10-16',
 firstPhysicalObservedAtUtc:observed,firstKnownAtUtc:observed,availableAtUtc:observed,
 originalNativeSha256:sourceSha,sourceReceiptHash:'c'.repeat(64),
 originalIndependentlyRehashed:true,
 independentAuditSha256:auditSha,
 auditorIndependence:'SEPARATE_FROM_DATA_LANE'};
async function input(changes={}){
 const base={schemaVersion:'S2_DATA_PITA_DAILY_USED_INPUT_EVIDENCE_V0_1',
  profileId:SOURCE_CORE_PROFILE_V0_1.id,
  marketDate:'2026-10-16',symbol:'2330',market:'TWSE',decisionCutAtUtc:cut,
  externalAuditReceiptSha256:auditSha,
  inputs:{
   A1_RAW_PRICE_VOLUME_61:{...audited,officialTradingSessionCount:61,
    nativeRowsVerifiedCount:61,priceSpace:'RAW',historicalPublicationClaimed:false},
   CURRENT_COMMON_SHARE_AT_CUT:{...audited,issuerClass:'ORDINARY_COMMON_SHARE',
    cfi:'ESVUFR',nativeClassEffectiveAtDecisionVerified:true},
   CA_PRICE_SPACE_CONTINUITY_FOR_USED_61_BARS:{...audited,usedFeaturePriceSpaceConsistent:true,
    knownActionsReconciled:true,actionAdjustmentOrExclusionAttested:true},
   TRADING_STATUS_AT_CUT:{...audited,tradeabilitySourceCurrent:true,
    haltReinstatementStateIndependentlyChecked:true,tradingStatus:'TRADEABLE'},
  },
  selectionAuthorized:false,frozenD1Written:false,selectedCount:null,zeroPickDay:null,
  pitBReplayUsedAsSubstitute:false};
 changes(base);
 return {...base,receiptHash:await sha256Hex(base)};
}
test('SYNTHETIC one day has four as-of core facts; still does not authorize Stage1 or formal PIT',async()=>{
 const e=await input(),r=await check({evidence:e,expectedIndependentAuditHash:auditSha});
 assert.equal(r.requiredAsOfAuditedCount,4);
 assert.equal(r.requiredUnknownCount,0);
 assert.equal(r.allSourceCoreInputsAudited,true);
 assert.equal(r.externalAuditDigestPinned,true);
 assert.equal(r.status,'SOURCE_CORE_ASOF_PROOF_COMPLETE__STRATEGY_USE_MANIFEST_UNAPPROVED');
 assert.equal(r.strategyFactorUseManifestPinned,false);
 assert.equal(r.fullPITScopeAccepted,false);
 assert.equal(r.stage1EvaluationAuthorized,false);
 assert.equal(r.selectionAuthorized,false);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.profileMayAuthorizeSelection,false);
 assert.equal(r.pitBHistoricalReplayCertified,false);
 assert.ok(r.excludedPITBOnlyRequirements.includes('CFI_HISTORICAL_61_DAY_EFFECTIVE_VINTAGE'));
 const {receiptHash,...base}=r;assert.equal(await sha256Hex(base),receiptHash);
});
test('absence of unused all-six historical no-event or old-day CFI never independently blocks source-core as-of check',async()=>{
 const e=await input();
 assert.ok(!Object.hasOwn(e.inputs,'CFI_HISTORICAL_61_DAY_EFFECTIVE_VINTAGE'));
 assert.ok(!Object.hasOwn(e.inputs,'GLOBAL_SIX_CA_NEGATIVE_NO_EVENT_HISTORY'));
 const r=await check({evidence:e,expectedIndependentAuditHash:auditSha});
 assert.equal(r.requiredAsOfAuditedCount,4);
 assert.equal(r.excludedDoesNotMeanHistoricallyCertified,true);
 assert.equal(r.fullPITScopeAccepted,false);
});
test('2330 real ex-dividend creates CA continuity blocker if native 6/6 exists but adjustment/exclusion unproven',async()=>{
 for(const fn of [
  x=>{x.inputs.CA_PRICE_SPACE_CONTINUITY_FOR_USED_61_BARS.actionAdjustmentOrExclusionAttested=false;},
  x=>{x.inputs.CA_PRICE_SPACE_CONTINUITY_FOR_USED_61_BARS.knownActionsReconciled=false;},
  x=>{x.inputs.CA_PRICE_SPACE_CONTINUITY_FOR_USED_61_BARS.status='SOURCE_ONLY';},
  x=>{delete x.inputs.CA_PRICE_SPACE_CONTINUITY_FOR_USED_61_BARS;},
 ]){
  const e=await input(fn),r=await check({evidence:e,expectedIndependentAuditHash:auditSha});
  assert.equal(r.allSourceCoreInputsAudited,false);
  assert.equal(r.requiredUnknownCount,1);
  assert.equal(r.stage1EvaluationAuthorized,false);
  assert.equal(r.selectionAuthorized,false);
 }
});
test('current-only CFI is evidence to check, but without audited current effective class it is UNKNOWN',async()=>{
 const e=await input(x=>{x.inputs.CURRENT_COMMON_SHARE_AT_CUT.nativeClassEffectiveAtDecisionVerified=false;});
 const r=await check({evidence:e,expectedIndependentAuditHash:auditSha});
 assert.equal(r.requiredUnknownCount,1);
 assert.equal(r.details[1].reason,'CURRENT_COMMON_SHARE_ASOF_NOT_ATTESTED');
});
test('captured after decision, issuer published later, wrong dates and stale source are rejected per mandatory input',async()=>{
 const scenarios=[
  x=>x.inputs.A1_RAW_PRICE_VOLUME_61.firstPhysicalObservedAtUtc='2026-10-16T15:50:00.000Z',
  x=>x.inputs.TRADING_STATUS_AT_CUT.availableAtUtc='2026-10-16T15:45:01.000Z',
  x=>x.inputs.CURRENT_COMMON_SHARE_AT_CUT.firstKnownAtUtc='2026-10-16T16:00:00.000Z',
  x=>x.inputs.A1_RAW_PRICE_VOLUME_61.marketDate='2026-10-15',
  x=>x.inputs.A1_RAW_PRICE_VOLUME_61.originalNativeSha256='0',
  x=>x.inputs.TRADING_STATUS_AT_CUT.tradingStatus='HALTED',
  x=>x.inputs.A1_RAW_PRICE_VOLUME_61.nativeRowsVerifiedCount=60,
  x=>x.inputs.CURRENT_COMMON_SHARE_AT_CUT.auditorIndependence='DATA_SELF_CERTIFIED',
 ];
 for(const mutate of scenarios){
  const e=await input(mutate),r=await check({evidence:e,expectedIndependentAuditHash:auditSha});
  assert.ok(r.requiredUnknownCount>=1);
  assert.equal(r.status,'REQUIRED_ASOF_DATA_OR_INDEPENDENT_AUDIT_UNKNOWN');
  assert.equal(r.fullPITScopeAccepted,false);
 }
});
test('forged self-sign/omission/alternate policy can never grant status',async()=>{
 for(const mutate of [
  x=>x.profileId='CUSTOM_IGNORE_CA',
  x=>x.selectionAuthorized=true,
  x=>x.frozenD1Written=true,
  x=>x.pitBReplayUsedAsSubstitute=true,
  x=>x.inputs.HISTORIC_BACKTEST_REVISED_ISSUER_VINTAGES={...audited},
  x=>x.decisionCutAtUtc='2026-10-15T15:45:00.000Z',
 ]){
  const e=await input(mutate);
  await assert.rejects(check({evidence:e,expectedIndependentAuditHash:auditSha}),
    /S2_PITA_USED_INPUT_HANDOFF_IDENTITY_SIGNATURE_OR_PROTECTED_OUTPUT_INVALID/);
 }
 const e=await input();
 await assert.rejects(check({evidence:{...e,inputs:{}},expectedIndependentAuditHash:auditSha}),
   /S2_PITA_USED_INPUT_HANDOFF_IDENTITY_SIGNATURE_OR_PROTECTED_OUTPUT_INVALID/);
});
test('external audit hash MUST be separately supplied, and mismatched hash never activates even core source',async()=>{
 const e=await input();
 for(const expectedIndependentAuditHash of [null,'a'.repeat(64),'bad']){
  const r=await check({evidence:e,expectedIndependentAuditHash});
  assert.equal(r.externalAuditDigestPinned,false);
  assert.equal(r.stage1EvaluationAuthorized,false);
 }
});
