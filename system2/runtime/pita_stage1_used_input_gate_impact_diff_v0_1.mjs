// System 2 BUILD_LANE / Class A. Owner-review impact DIFF only.
// No caller may use this comparison to admit PIT, rank, select, shadow or freeze.
import {describeActualShortMomentumLaunchUsedInputsV0_1}
 from './pita_short_momentum_used_input_manifest_v0_1.mjs';
import {sha256Hex} from './decision_archive.mjs';

const PRICE_FIELDS=new Set(['open','high','low','close']);
const CFI_OLD='HISTORICAL_NATIVE_CFI_EFFECTIVE_PERIODS_61_REQUIRED';
const CA_OLD='GLOBAL_CA_COMPLETENESS_AND_CLEAR_NO_ACTION_REQUIRED';
const fail=c=>{throw Error('PITA_STAGE1_IMPACT_'+c)};
const DAY=/^\d{4}-\d\d-\d\d$/;
function validDay(s){
 return typeof s==='string'&&DAY.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&
  new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
}
// Real known-source cases, explicitly NOT accepted strategy PIT evidence.
// Input window bounds and event dates: 2026-10-17 main DATA evidence #1447/#1454/#1455.
const REAL_SOURCE_ONLY_CONTROLS=Object.freeze([
 Object.freeze({
  symbol:'2330',market:'TWSE',marketDate:'2026-10-16',
  sourceWindowStart:'2026-07-21',sourceWindowEnd:'2026-10-16',
  eventDate:'2026-09-16',eventType:'CASH_DIVIDEND',
  eventNativeSourceObserved:true,original61BarSourceObserved:true,
  independentUsedInputAuditAccepted:false,
  adjustedPriceTransformIndependentlyAccepted:false,
  sourceAtOriginalT2345PITCertified:false,
  historicalClassPeriodIndependentlyAccepted:false,
  tradeabilityAsOfIndependentlyAccepted:false,
  sourceEvidence:'PITA_2330_REAL_SOURCE_20261016__DATA_1068'
 }),
 Object.freeze({
  symbol:'3287',market:'TPEX',marketDate:'2026-10-16',
  sourceWindowStart:'2026-07-21',sourceWindowEnd:'2026-10-16',
  eventDate:'2026-08-26',eventType:'CASH_DIVIDEND',
  eventNativeSourceObserved:true,original61BarSourceObserved:true,
  independentUsedInputAuditAccepted:false,
  adjustedPriceTransformIndependentlyAccepted:false,
  sourceAtOriginalT2345PITCertified:false,
  historicalClassPeriodIndependentlyAccepted:false,
  tradeabilityAsOfIndependentlyAccepted:false,
  knownSourceMetricsCrossingEvent:['ma60','ret60','priorHigh60'],
  sourceEvidence:'PITA_3287_TPEX_REAL_SOURCE_20261016__DATA_1068'
 })
]);

export function inspectActualFactorEventExposureV0_1(factors,sourceControl){
 if(!Array.isArray(factors)||factors.length!==7||
    new Set(factors.map(x=>x.id)).size!==7)
  fail('SEVEN_LAUNCH_FACTORS_REQUIRED');
 if(!sourceControl||!validDay(sourceControl.eventDate)||
    !validDay(sourceControl.sourceWindowStart)||
    !validDay(sourceControl.sourceWindowEnd)||
    !validDay(sourceControl.marketDate)||
    sourceControl.sourceWindowEnd!==sourceControl.marketDate||
    sourceControl.sourceWindowStart>sourceControl.eventDate||
    sourceControl.eventDate>sourceControl.sourceWindowEnd||
    sourceControl.eventNativeSourceObserved!==true)
  fail('SCOPE_OR_REAL_CA_EVIDENCE_INVALID');
 const result=factors.map(f=>{
  if(!Array.isArray(f.nativeInputs)||!Array.isArray(f.mandatoryMetrics)||
     !Array.isArray(f.transforms)||f.historyWindowSessions!==61||
     f.nativeInputs.length===0||f.mandatoryMetrics.length===0)
   fail('FACTOR_INPUT_MANIFEST_INCOMPLETE');
  const native=[...f.nativeInputs];
  const priceSensitive=native.some(x=>PRICE_FIELDS.has(x));
  return Object.freeze({
   factorId:f.id,requiredFamily:f.family,
   nativeInputs:native,mandatoryMetrics:[...f.mandatoryMetrics],
   priceDiscontinuitySensitive:priceSensitive,
   eventInObserved61Window:true,
   effectOfSpecificCashDividendOnFactor:priceSensitive
     ?'CROSSES_UNADJUSTED_PRICE_SPACE__PIT_TRANSFORM_OR_SAFE_EXCLUSION_REQUIRED'
     :'SOURCE_ONLY__DO_NOT_ASSERT_ABSENCE_OF_VOLUME_OR_TRADE_VALUE_EVENT_EFFECT',
   independentlyResolved:false,
   factorInputDroppingAllowed:false
  });
 });
 return Object.freeze(result);
}
export async function buildPitAStage1UsedInputGateImpactV0_1(){
 const manifest=await describeActualShortMomentumLaunchUsedInputsV0_1();
 if(manifest.strategyId!=='SHORT_MOMENTUM'||
    manifest.strategyVersion!=='V0.1-CONTRACT'||
    manifest.assessorPolicyVersion!=='0.1-LAUNCH'||
    manifest.launchStage1FactorCount!==7||
    manifest.mandatorySourceInputs.length!==7||
    manifest.legacyCaGateAllowsOnlyClearNoAction!==true||
    manifest.legacyInstrumentGateDemands61SessionHistoricalEffectiveWindow!==true||
    manifest.stage1EvaluationAuthorized!==false||
    manifest.fullMarketRankingAuthorized!==false)
  fail('CURRENT_STRATEGY_OR_LEGACY_GATE_DRIFT');
 const cases=REAL_SOURCE_ONLY_CONTROLS.map(c=>{
  const factorExposure=inspectActualFactorEventExposureV0_1(
   manifest.launchStage1Factors,c);
  const observedPriceSensitiveFactors=factorExposure.filter(
   f=>f.priceDiscontinuitySensitive).map(f=>f.factorId);
  const status='SOURCE_ONLY__PIT_A_NOT_ACCEPTED';
  return Object.freeze({
   symbol:c.symbol,market:c.market,marketDate:c.marketDate,
   sourceWindowStart:c.sourceWindowStart,sourceWindowEnd:c.sourceWindowEnd,
   knownAction:{eventDate:c.eventDate,eventType:c.eventType,
    sourceObserved:true,independentCutPITAccepted:false},
   native61BarSourceObserved:c.original61BarSourceObserved,
   factorExposure,priceSensitiveLaunchFactors:observedPriceSensitiveFactors,
   knownCrossingMetricExamples:c.knownSourceMetricsCrossingEvent||[],
   effectiveCurrentStage1:{
    ordinaryShareGate:CFI_OLD,corporateActionGate:CA_OLD,
    admitted:false,requiredProofStillMissing:true
   },
   proposedOwnerReviewCandidate:{
    version:'PITA_STAGE1_USED_INPUT_GATES_CANDIDATE_V0_1__NOT_EFFECTIVE',
    // Conceptual comparison; this object is NOT an executable permission grant.
    ordinaryShareGate:'NATIVE_ORDINARY_SHARE_AT_ACTUAL_T_CUT_PLUS_HISTORICAL_CFI_IF_FACTOR_USES_CLASS_HISTORY',
    corporateActionGate:'EVENT_RELEVANCE_PER_ACTUAL_7_FACTOR_INPUT_WINDOW_WITH_AUDITED_TRANSFORM_OR_SAFE_EXCLUSION_AND_SCOPED_NEGATIVE_PROOF',
    stillRequires:['EXACT_A1_SOURCE_AND_AVAILABLE_CLOCK_AT_CUT',
     'CURRENT_NATIVE_ORDINARY_SHARE_INDEPENDENT_AUDIT_AT_CUT',
     'ACTUAL_TRADEABILITY_HALT_RESUME_AT_CUT',
     'PRICE_SPACE_TRANSFORM_OR_SAFE_EXCLUSION_FOR_EACH_AFFECTED_USED_FACTOR',
     'RELEVANT_CA_REVISION_RETRACTION_AND_NEGATIVE_SCOPE_AUDIT',
     'ALL_SEVEN_FACTOR_INPUTS_PINNED_TO_STRATEGY_VERSION',
     'INDEPENDENT_DATA_AND_AUDIT_RUN_ARTIFACT_SHA',
     'SAME_T_FULL_MARKET_DENOMINATOR_OR_EXPLICIT_UNKNOWN'],
    evaluatedAgainstRealSource:false,ownerClassBCApprovalRequired:true,
    candidateWouldAdmitCurrentRealCase:false
   },
   status,
   pitAIndependentlyAccepted:false,eligibleForStage1:false,
   selectedCount:null,zeroPickDay:null,shadowAuthorized:false,
   frozenD1Written:false,canBackdateOriginalDecision:false
  });
 });
 const base={
  schemaVersion:'S2_BUILD_PITA_STAGE1_POLICY_IMPACT_DIFF_V0_1',
  status:'RESEARCH_ONLY_OWNER_REVIEW_NOT_AN_EFFECTIVE_GATE',
  strategyId:manifest.strategyId,strategyVersion:manifest.strategyVersion,
  manifestReceiptHash:manifest.receiptHash,
  existingPolicySourcePaths:[
   'system2/runtime/stage1_ca_pit_evidence_gate_v0_1.mjs',
   'system2/runtime/stage1_instrument_class_pit_gate_v0_1.mjs'
  ],
  impactCases:cases,
  exactLocalControlCount:cases.length,
  realPitAcceptedLocalCount:0,realPitUnknownLocalCount:cases.length,
  fullMarketOrdinaryShareDenominator:null,
  proposedPolicyMayNotBePromotedByCI:true,
  ownerClassBCApprovalRequired:true,
  noPITAOrPITBPromotion:true,
  selectedCount:null,zeroPickDay:null,stage1EvaluationAuthorized:false,
  rankAuthorized:false,shadowAuthorized:false,frozenD1Written:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
  newSourceProviderGET:0,newCronCount:0,formalOrdersAuthorized:false,
  pushAuthorized:false,system1FormalCoreChanged:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
