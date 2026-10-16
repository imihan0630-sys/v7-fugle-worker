// BUILD_LANE M09: consume DATA's independently rehashed SOURCE-ONLY PIT handoff.
// This module cannot certify historical PIT, assess a strategy, rank, write
// Frozen D1, or retroactively rewrite the 23:45 Taiwan decision clock.
import {sha256Hex} from './decision_archive.mjs';
import {validatePitSourceHandoffV0_1} from '../migration/issue1068_pit_source_handoff_gate_v0_1.mjs';

const SHA=/^[0-9a-f]{64}$/i;
const fail=code=>{throw Error('S2_BUILD_PIT_HANDOFF_'+code);};
const strip=(v,k)=>Object.fromEntries(Object.entries(v).filter(([key])=>key!==k));

export async function buildPitDataHandoffStage1ReadinessV0_1({
 handoff,a1,cfi,ca,dailyStage1Readiness=null
}={}){
 // Original DATA readback and immutable hash/clock are checked by the DATA
 // contract, which is imported but NEVER modified or bypassed by BUILD.
 const accepted=await validatePitSourceHandoffV0_1({handoff,a1,cfi,ca});
 if(accepted.state!=='DATA_HANDOFF_VALID__ALL_1935_REMAIN_PIT_UNKNOWN_FOR_ORIGINAL_DECISION'||
    accepted.receiptHash!==handoff.receiptHash||
    handoff.handoffScope.pitEligibleSymbolCount!==0||
    handoff.handoffScope.unresolvedSymbolCount!==handoff.handoffScope.sourceSecurityWindowCount)
   fail('DATA_SCOPE_CONTRADICTED');
 let stage1ActuallyAssessedCount=null,stage1ReadinessReceiptHash=null,
     stage1ReadinessState='NO_MATCHING_REAL_STAGE1_RECEIPT';
 if(dailyStage1Readiness!==null){
   const r=dailyStage1Readiness;
   if(r?.schemaVersion!=='S2_DAILY_SELECTION_READINESS_V0_1'||
      r.marketDate!==handoff.marketDate||
      !SHA.test(r.receiptHash||'')||
      await sha256Hex(strip(r,'receiptHash'))!==r.receiptHash||
      r.selectedCount!==null||r.zeroPickDay!==null||
      r.finalSelectionEligible!==false||r.rankCapacityAuthorized!==false||
      r.frozenDecisionWritten!==false||
      r.cloudflareD1Writes!==0||r.cloudflareR2Writes!==0)
      fail('STAGE1_READINESS_HASH_DATE_OR_AUTHORITY_INVALID');
   if(r.state==='BLOCKED_SOURCE_NOT_SELECTION'){
     if(r.ordinaryUniverseCount!==null||r.assessedCount!==null||
        r.incompleteCount!==null)fail('BLOCKED_SOURCE_FAKE_COUNTS');
   }else{
     // Historical 2026-10-15 decision PIT is wholly unresolved, so a later
     // synthetic Stage1 scorer cannot be mistaken for a certified selection.
     if(r.ordinaryUniverseCount!==accepted.sourceSecurityWindowCount||
        r.assessedCount!==0||r.incompleteCount!==accepted.unresolvedSymbolCount||
        r.stage1PitInputPassedCount!==0||
        r.stage1PitInputUnknownCount!==accepted.unresolvedSymbolCount||
        r.qualifiedNotSelectedCount!==0||
        !['DAILY_STRATEGY_INPUT_INCOMPLETE'].includes(r.state))
       fail('STAGE1_FALSE_PIT_OR_DENOMINATOR_PROMOTION');
     stage1ActuallyAssessedCount=0;
   }
   stage1ReadinessState=r.state;
   stage1ReadinessReceiptHash=r.receiptHash;
 }
 const base={
  schemaVersion:'S2_BUILD_PIT_SOURCE_HANDOFF_STAGE1_READINESS_V0_1',
  state:'PIT_SOURCE_ONLY_HANDOFF_CONSUMED__HISTORICAL_SELECTION_BLOCKED',
  dataSourceReceiptHash:handoff.receiptHash,
  dataAcceptance:'SOURCE_INDEPENDENTLY_REHASHED__PIT_SCOPE_NOT_INDEPENDENTLY_ACCEPTED',
  marketDate:handoff.marketDate,originalDecisionCutAtUtc:handoff.originalDecisionCutAtUtc,
  actualSourceOnlyEvaluationAtUtc:handoff.actualSourceOnlyEvaluationAtUtc,
  sourceSecurityWindowCount:accepted.sourceSecurityWindowCount,
  // 0 below means DATA explicitly certified no eligible *proof* for this
  // historical cut. It does NOT mean zero true opportunities or zero picks.
  pitEvidenceEligibleSymbolCount:accepted.pitEligibleSymbolCount,
  pitEvidenceUnknownSymbolCount:accepted.unresolvedSymbolCount,
  stage1ActuallyAssessedCount,stage1ReadinessState,stage1ReadinessReceiptHash,
  blockerScope:'GLOBAL_FULL_SOURCE_UNIVERSE__NO_SYMBOL_LOCAL_NEGATIVE_EVENT_INFERRED',
  blockers:[...handoff.handoffScope.blockers],
  sourceInstrumentClassFullyCertified:false,independentStrategyPitAccepted:false,
  fullUniverseRankingAuthorized:false,shadowAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  frozenIndependentReadbackVerified:false,cloudflareD1Reads:0,
  cloudflareD1Writes:0,cloudflareR2Calls:0,
  system1FormalCoreTouched:false,tradingEnabled:false,livePush:false,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
