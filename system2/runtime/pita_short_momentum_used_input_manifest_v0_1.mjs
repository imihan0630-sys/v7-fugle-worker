// BUILD_LANE Class A: exact CURRENT Short Momentum launch-Stage1 used-input
// mapping. This is a non-authorizing introspection/checkpoint for review,
// never a waiver of strategy contract, PIT audit, factor completeness, ranking,
// tradeability, Frozen, or production safety gates.
import {SHORT_MOMENTUM_CONTRACT_V0_1} from './strategy_contracts_v0_1.mjs';
import {STAGE1_ASSESSOR_POLICIES_V0_1} from './stage1_assessor_policies_v0_1.mjs';
import {sha256Hex} from './decision_archive.mjs';

const deny=x=>{throw Error('PITA_SM_USED_INPUT_MANIFEST_'+x);};
const expectedFamilies=Object.freeze({
 TECHNICAL_STRUCTURE:{role:'PRIMARY',unknownBlocksEligibility:true},
 PRICE_VOLUME:{role:'PRIMARY',unknownBlocksEligibility:true},
 MARKET_REGIME:{role:'PRIMARY',unknownBlocksEligibility:false},
 CAPITAL_FLOW:{role:'SUPPORTIVE',unknownBlocksEligibility:false},
 RISK_FRICTION:{role:'REQUIRED',unknownBlocksEligibility:true},
 FUNDAMENTAL_QUALITY:{role:'CONTEXT_ONLY',unknownBlocksEligibility:false},
});
// Actual launch-assessor observationKnown prerequisites, including metric
// fields required by factorState even where the final relational predicate
// uses only a subset. DO NOT confuse with every declared strategy-contract
// factor or with dynamically weighted strategic importance.
export const CURRENT_LAUNCH_FACTORS=Object.freeze([
 {id:'TECH.TREND',family:'TECHNICAL_STRUCTURE',
  mandatoryMetrics:['ma5','ma10','ma20','ma60','ret20','ret60'],
  predicateMetrics:['maOrder5gt10gt20','ma20Slope1Pct','ret20'],
  nativeInputs:['close'],historyWindowSessions:61,
  transforms:['SMA_5_10_20_60','MA20_SLOPE_1','RETURN_20_60']},
 {id:'TECH.STRUCTURE',family:'TECHNICAL_STRUCTURE',
  mandatoryMetrics:['priorHigh20','priorHigh60','priorLow20','distanceToMa20','atr14Pct'],
  predicateMetrics:['distanceToMa20'],
  nativeInputs:['high','low','close'],historyWindowSessions:61,
  transforms:['PRIOR_20_60_EXTREMES','ATR_14','DISTANCE_TO_MA20']},
 {id:'PV.RELATIVE_VOLUME',family:'PRICE_VOLUME',
  mandatoryMetrics:['volumeLots','avgVolume20PriorLots','relativeVolume20Prior'],
  predicateMetrics:['relativeVolume20Prior'],
  nativeInputs:['volumeShares'],historyWindowSessions:61,
  transforms:['VOLUME_LOTS','PRIOR_20_MEAN_VOLUME','CURRENT_RELATIVE_VOLUME']},
 {id:'PV.ACCEPTANCE',family:'PRICE_VOLUME',
  mandatoryMetrics:['closePosition','upperShadowRatio','lowerShadowRatio','distanceToPriorHigh20'],
  predicateMetrics:['distanceToPriorHigh20'],
  nativeInputs:['open','high','low','close'],historyWindowSessions:61,
  transforms:['CLOSE_BAR_POSITION','SHADOW_RATIOS','PRIOR_HIGH20_DISTANCE']},
 {id:'PV.RESPONSE',family:'PRICE_VOLUME',
  mandatoryMetrics:['ret20','ret60','volatility20'],
  predicateMetrics:['ret20'],
  nativeInputs:['close'],historyWindowSessions:61,
  transforms:['RETURNS_20_60','DAILY_RETURNS_VOLATILITY_20']},
 {id:'RISK.LIQUIDITY',family:'RISK_FRICTION',
  mandatoryMetrics:['avgVolume20PriorLots','avgAmount20Prior'],
  predicateMetrics:['avgVolume20PriorLots','avgAmount20Prior'],
  nativeInputs:['volumeShares','tradeValue'],historyWindowSessions:61,
  transforms:['PRIOR_20_MEAN_VOLUME','PRIOR_20_MEAN_TURNOVER']},
 {id:'RISK.EXTENSION',family:'RISK_FRICTION',
  mandatoryMetrics:['distanceToMa20','distanceToPriorHigh20','atr14Pct'],
  predicateMetrics:[],
  nativeInputs:['high','low','close'],historyWindowSessions:61,
  transforms:['PRICE_EXTENSION','ATR_14'],
  caution:'KNOWN_REQUIRED_BUT_NO_EXTENSION_NUMERIC_THRESHOLD_FROZEN'},
]);
const hardInvalidationMetrics=Object.freeze([
 {id:'BROKEN_ACTIVE_STRUCTURE',inputs:['close','priorLow20']},
 {id:'FAILED_BREAKOUT',inputs:['high','close','priorHigh20']},
 {id:'SEVERE_ILLIQUIDITY',inputs:['avgVolume20PriorLots','avgAmount20Prior']},
]);
const sourceInputs=Object.freeze([
 {id:'A1_RAW_PRICE_VOLUME_61',mandatory:true,
  fields:['date','open','high','low','close','volumeShares','tradeValue','sourceRowHash','availableAt'],
  nativePriceSpace:'RAW',volumeUnit:'SHARES',
  provenance:'61_official_sessions_and_source_replay_before_exact_cut'},
 {id:'CURRENT_COMMON_SHARE_AT_CUT',mandatory:true,
  fields:['market','symbol','issuerClass','nativeCfi','sourceReceiptHash','availableAtUtc'],
  provenance:'exchange_native_class_at_actual_decision_instant'},
 {id:'CA_PRICE_SPACE_CONTINUITY_FOR_USED_61_BARS',mandatory:true,
  fields:['eventSourceSha256','adjustmentOrExclusionEvidence','effectivePriceSpace','availableAtUtc'],
  provenance:'event_sensitive_price_features_require_actual_native_adjustment_or_safe_exclusion'},
 {id:'TRADING_STATUS_AT_CUT',mandatory:true,
  fields:['market','symbol','haltStatus','reinstatementStatus','availableAtUtc'],
  provenance:'actual_exchange_native_tradeability_and_halt_state'},
 {id:'SAME_DATE_DAILY_SOURCE_LEDGER',mandatory:true,
  fields:['marketDate','sourceBatchHash','ledgerSha256','sourceOrdinarySymbolCount','observations'],
  provenance:'full_market_denominator_must_match_current_date_and_origin'},
 {id:'OFFICIAL_61_SESSION_CALENDAR',mandatory:true,
  fields:['tradingDates','originalCalendarHash','observedAt'],
  provenance:'official_native_dates_exact_61_including_current_session'},
 {id:'INDEPENDENT_ORIGINAL_AND_SCOPE_AUDIT',mandatory:true,
  fields:['sourceOriginalSha256','independentlyPinnedAuditReceiptHash','decisionCutAtUtc'],
  provenance:'auditor_independence_does_not_follow_from_producer_self_hash'},
]);
export async function describeActualShortMomentumLaunchUsedInputsV0_1(){
 const c=SHORT_MOMENTUM_CONTRACT_V0_1,p=STAGE1_ASSESSOR_POLICIES_V0_1.SHORT_MOMENTUM;
 if(c?.strategyId!=='SHORT_MOMENTUM'||c.strategyVersion!=='V0.1-CONTRACT'||
    c.ownerApprovalState!=='OWNER_APPROVED'||p?.strategyId!=='SHORT_MOMENTUM'||
    p.strategyVersion!==c.strategyVersion||
    p.assessorPolicyId!=='S2-ASSESSOR-SM-LAUNCH-001'||
    p.assessorPolicyVersion!=='0.1-LAUNCH')deny('CONTRACT_OR_ASSESSOR_VERSION_DRIFT');
 const actual=c.evidenceFamilies||[];
 const familyNames=Object.keys(expectedFamilies);
 if(actual.length!==familyNames.length||actual.some(x=>{
  const e=expectedFamilies[x.family];
  return !e||x.role!==e.role||x.unknownBlocksEligibility!==e.unknownBlocksEligibility;
 }))deny('FAMILY_ROLE_OR_ELIGIBILITY_DRIFT');
 const required=['TECHNICAL_STRUCTURE','PRICE_VOLUME','RISK_FRICTION'];
 if(JSON.stringify(p.requiredFamilies)!==JSON.stringify(required))
  deny('LAUNCH_REQUIRED_FAMILIES_DRIFT');
 const matrix=actual.map(x=>({
  family:x.family,contractRole:x.role,contractUnknownBlocksEligibility:x.unknownBlocksEligibility,
  contractDeclaredFactorIds:[...x.factorIds],
  launchStage1FactorIds:CURRENT_LAUNCH_FACTORS.filter(f=>f.family===x.family).map(f=>f.id),
  currentLaunchAssessorDecisionRole:required.includes(x.family)
    ?'REQUIRED_FOR_ACTUAL_LAUNCH_ELIGIBILITY':'CONTRACT_DECLARED_CONTEXT_NOT_IN_LAUNCH_RELATIONAL_DECISION',
 }));
 const base={
  schemaVersion:'S2_BUILD_PITA_SM_ACTUAL_USED_INPUT_MANIFEST_V0_1',
  status:'RESEARCH_ONLY__OWNER_CLASS_BC_GATE_APPROVAL_REQUIRED',
  strategyId:c.strategyId,strategyVersion:c.strategyVersion,
  assessorPolicyId:p.assessorPolicyId,assessorPolicyVersion:p.assessorPolicyVersion,
  explicitEvidenceScope:'ACTUAL_SHORT_MOMENTUM_LAUNCH_STAGE1_ASSESSOR_ONLY',
  contractFamilies:matrix,launchStage1FactorCount:CURRENT_LAUNCH_FACTORS.length,
  launchStage1Factors:CURRENT_LAUNCH_FACTORS,
  hardInvalidations:hardInvalidationMetrics,
  mandatorySourceInputs:sourceInputs,
  launchStage1RequiredFamilyCount:required.length,
  contractDeclaredNotSameAsLaunchUse:true,
  noOptionalFactorMayBeSilentlyDroppedInOtherStrategyVersions:true,
  pastIssuerCfiEffectivePeriodsUniversallyRequiredForThisLaunchScope:false,
  pastIssuerCfiBecomesRequiredIfUsedForIPOOrHistoricClassFeature:true,
  historicalSixCaNoEventUniversallyRequiredForThisLaunchScope:false,
  boundedRelevantCaAndPriceContinuityAlwaysRequired:true,
  knownReal2330Dividend:{
    marketDate:'2026-10-16',eventDate:'2026-09-16',
    nativeSourceEventObserved:true,
    crossing61BarPriceFeatureUnsafeUntilVerifiedAdjustmentOrExclusion:true,
    actualAdjustedPriceLineageIndependentlyAccepted:false,
  },
  legacyCaGateAllowsOnlyClearNoAction:true,
  evaluatorRecognizesAdjustedContinuity:true,
  legacyInstrumentGateDemands61SessionHistoricalEffectiveWindow:true,
  unresolvedPolicyConflict:'CLASS_BC_OWNER_REVIEW_REQUIRED_BEFORE_EXISTING_STAGE1_ADMISSION_GATE_CHANGE',
  pitASourceScopeIndependentlyAccepted:false,
  stage1EvaluationAuthorized:false,fullMarketRankingAuthorized:false,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,shadowAuthorized:false,
  pitBHistoricalReplayCertified:false,cloudflareD1Writes:0,
  system1FormalCoreChanged:false,
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
