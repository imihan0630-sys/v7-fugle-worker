// D01 11-module research-only evidence readiness oracle.
// Evaluates supplied certified evidence contracts; never upgrades tracker/market rules.
// Not a substitute for independent D16 review of receipt authenticity.
export const MODULES=Object.freeze(Array.from({length:11},(_,i)=>"D01-"+String(i+1).padStart(2,"0")));
const BLOCK=(gate,reason,completed={})=>({eligibleLevel:"L3",promotionAllowed:false,blockedAt:gate,reason,completed});
const yes=(o,k)=>o?.[k]===true;
const validId=s=>typeof s==="string"&&/^[\w.-]{8,}$/.test(s);
const integerAtLeast=(x,n)=>Number.isInteger(x)&&x>=n;
const eqArray=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.every((x,i)=>x===b[i]);
const physical=e=>e?.origin==="PHYSICAL_PROSPECTIVE_OR_OOS"&&
  validId(e?.sourceReceiptHash)&&validId(e?.sourceCommitSha)&&
  validId(e?.ownerSignedReceiptId)&&e?.syntheticFixture!==true;
export function evaluateL3ToL5(e={}){
 const completed={pit:false,l4:false,l5:false};
 if(!MODULES.includes(e.moduleId))return BLOCK("MODULE","NOT_D01_CANONICAL_MODULE",completed);
 if(!physical(e))return BLOCK("PHYSICAL","SOURCE_RECEIPTS_NOT_PHYSICALLY_CERTIFIED",completed);
 if(!e?.manifest||!validId(e.manifest.frozenManifestHash)||
    e.manifest.frozenBeforeOutcomes!==true||
    e.manifest.holdoutUntouched===false||
    !eqArray(e.manifest.horizons,[1,5,20]))
   return BLOCK("PREREG","FROZEN_HORIZON_OR_MANIFEST_NOT_ACCEPTED",completed);
 if(e?.source?.r1toR7ExactWindowAccepted!==true||
    e.source.pitClockCertified!==true||
    e.source.corporateActionContinuityCertified!==true||
    e.source.symbolSessionCoverageComplete!==true||
    e.source.exchangeLimitAndDispositionCertified!==true||
    e.source.rawToContinuityHashCertified!==true)
   return BLOCK("PIT","EXACT_WINDOW_R1_TO_R7_CHAIN_INCOMPLETE",completed);
 completed.pit=true;
 if(!e?.denominator||!integerAtLeast(e.denominator.rawObserved,1)||
    !integerAtLeast(e.denominator.sourceBlocked,0)||
    !integerAtLeast(e.denominator.nonSignal,0)||
    !integerAtLeast(e.denominator.uniqueEpisodes,0)||
    !integerAtLeast(e.denominator.duplicateSignals,0)||
    e.denominator.rawObserved!==e.denominator.sourceBlocked+e.denominator.nonSignal+
      e.denominator.uniqueEpisodes+e.denominator.duplicateSignals||
    e.denominator.missingResultsPreserved!==true)
   return BLOCK("DENOMINATOR","FULL_FAILURE_AND_MISSING_DENOMINATOR_NOT_CERTIFIED",completed);
 if(!e?.statistics||!validId(e.statistics.commonParentHash)||
    !validId(e.statistics.sameSupportHash)||
    !validId(e.statistics.experimentLedgerHash)||
    e.statistics.multiplicityReviewed!==true||
    !["SUPPORTED","REFUTED","INCONCLUSIVE"].includes(e.statistics.resultDisposition))
   return BLOCK("COMPARATOR","COMMON_PARENT_OR_MULTIPLICITY_NOT_REVIEWED",completed);
 if(!e?.validation||!validId(e.validation.d16ReceiptId)||
    e.validation.independentReviewerDomain!=="D16"||
    e.validation.accepted===false||
    e.validation.accepted!==true||
    e.validation.outcomesActuallyJoined!==true||
    e.validation.costFieldsPreserved!==true||
    e.validation.noOutcomeTunedParameters!==true)
   return BLOCK("D16","INDEPENDENT_ACTUAL_OUTCOME_REVIEW_MISSING",completed);
 if(e.validation.mode==="OOS"){
   const w=e.validation.oos;
   if(!w||w.trainYears<3||w.testCompleteYearsPerFold<1||
     w.holdoutYear!==2024||w.holdoutUntouchedBeforeFreeze!==true||
     w.purgeEmbargoEligibleSessions<20||w.timeOrderCertified!==true)
      return BLOCK("OOS","FROZEN_2018_2024_CHRONOLOGICAL_HOLDOUT_NOT_CERTIFIED",completed);
 }else if(e.validation.mode==="PROSPECTIVE"){
   const w=e.validation.prospective;
   if(!w||w.completeSamples<30||w.independentScanDates<15||
     w.regimeCount<2||w.capturedBeforeOutcome!==true||
     w.completeNoPickPopulation!==true)
      return BLOCK("PROSPECTIVE","MINIMUM_PROSPECTIVE_INDEPENDENCE_OR_REGIME_NOT_MET",completed);
 }else return BLOCK("VALIDATION_MODE","NO_TRUE_OOS_OR_PROSPECTIVE_ENDPOINT",completed);
 completed.l4=true;
 const infrastructure=e.moduleId==="D01-01";
 if(!e?.robustness||e.robustness.independentDateClustersVerified!==true||
    e.robustness.multipleRegimesCertified!==true||
    e.robustness.effectStabilityOrRobustNullTested!==true||
    e.robustness.multipleTestingFamilyExhaustive!==true||
    e.robustness.negativeControlsPassedOrRefuted!==true||
    e.robustness.sectorAndLiquidityConcentrationReviewed!==true||
    e.robustness.survivorshipAndMissingnessSensitiveTested!==true)
   return {eligibleLevel:"L4",promotionAllowed:false,blockedAt:"ROBUSTNESS",reason:"MULTI_REGIME_OR_COUNTEREVIDENCE_INCOMPLETE",completed};
 if(!e?.redundancy||e.redundancy.sharedPriceRootDeDuplicated!==true||
    e.redundancy.fullContextBaselineChecked!==true||
    e.redundancy.residualIncrementalityConcluded!==true)
   return {eligibleLevel:"L4",promotionAllowed:false,blockedAt:"REDUNDANCY",reason:"SHARED_PRICE_ROOT_OR_RESIDUAL_NOT_CERTIFIED",completed};
 const cost=e?.cost;
 if(infrastructure){
   if(!cost||cost.infrastructureNonTradingApplicabilityAcceptedByD16!==true)
     return {eligibleLevel:"L4",promotionAllowed:false,blockedAt:"COST",reason:"INFRA_COST_NOT_APPLICABLE_NOT_REVIEWED",completed};
 }else if(!cost||cost.tradingCostSourceCertified!==true||
    cost.commissionsTaxesSpreadSlippageReviewed!==true||
    cost.executableFillOrNonfillIncluded!==true||
    cost.costStressSensitivityValidated!==true)
   return {eligibleLevel:"L4",promotionAllowed:false,blockedAt:"COST",reason:"NET_EXECUTABILITY_NOT_VALIDATED",completed};
 if(!e?.validation?.l5D16IndependentSignoffId||
    !validId(e.validation.l5D16IndependentSignoffId)||
    e.validation.robustnessAuditAccepted!==true)
   return {eligibleLevel:"L4",promotionAllowed:false,blockedAt:"L5_REVIEW",reason:"INDEPENDENT_L5_REVIEW_NOT_ACCEPTED",completed};
 completed.l5=true;
 return {eligibleLevel:"L5",promotionAllowed:true,blockedAt:null,
   reason:"EXTERNAL_PHYSICAL_D16_L5_RECEIPTS_REQUIRE_HUMAN_READBACK_BEFORE_TRACKER_EDIT",
   completed,economicEdge:e.statistics.resultDisposition};
}
export function summariseModuleDecisions(results=[]){
 const out={total:results.length,L3:0,L4:0,L5:0,blockedBy:{}};
 for(const x of results){
   const lv=x?.eligibleLevel;
   if(lv==="L3"||lv==="L4"||lv==="L5")out[lv]++;
   else out.L3++;
   if(x?.blockedAt)out.blockedBy[x.blockedAt]=(out.blockedBy[x.blockedAt]||0)+1;
 }
 return out;
}
