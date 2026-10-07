export const PVE261_SCHEMA="D02_PVE261_BASELINE_REFRESH_ACCEPTANCE_V0_1";

const nonEmpty=v=>typeof v==="string"&&v.trim().length>0;
const sha256=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
const dateOnly=v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v||""))?String(v):null;
const isoInstant=v=>Number.isFinite(Date.parse(v));

function fail(reasons,code,condition){if(!condition)reasons.push(code);return condition;}

export function evaluatePve261CandidateContract(input={}){
  const reasons=[];
  fail(reasons,"CLASS_B_DECLARATION_MISSING",input.changeClass==="CLASS_B_PRODUCTION_RUNTIME");
  fail(reasons,"OWNER_APPROVAL_GATE_MISSING",input.ownerApprovalRequired===true);
  fail(reasons,"FORMAL_CORE_NOT_DECLARED_UNCHANGED",input.formalCoreUnchanged===true);
  fail(reasons,"SELECTION_LOGIC_NOT_DECLARED_UNCHANGED",input.selectionLogicUnchanged===true);
  fail(reasons,"RANKING_LOGIC_NOT_DECLARED_UNCHANGED",input.rankingLogicUnchanged===true);
  fail(reasons,"CAPITAL_LOGIC_NOT_DECLARED_UNCHANGED",input.capitalLogicUnchanged===true);
  fail(reasons,"PUSH_TRADE_LOGIC_NOT_DECLARED_UNCHANGED",input.pushTradeLogicUnchanged===true);
  fail(reasons,"COUNT_BYPASS_NOT_FORBIDDEN",input.minimumCountCannotBypassFreshness===true);
  fail(reasons,"EXPECTED_PRIOR_SLOT_AUTHORITY_NOT_BOUND",nonEmpty(input.expectedLatestComparableSlotAuthority));
  fail(reasons,"EXPECTED_PRIOR_SLOT_MUST_BE_PRE_OUTCOME",input.expectedLatestComparableSlotIsPreOutcome===true);
  fail(reasons,"HISTORICAL_REFRESH_NOT_BOUNDED",Number.isInteger(input.maxHistoricalLookbackDays)&&input.maxHistoricalLookbackDays>=20&&input.maxHistoricalLookbackDays<=366);
  fail(reasons,"REFRESH_TO_PRIOR_SESSION_NOT_REQUIRED",input.refreshThroughExpectedPriorSession===true);
  fail(reasons,"CURRENT_SESSION_LEAKAGE_NOT_FORBIDDEN",input.currentSessionExcludedFromBaselineFetch===true);
  fail(reasons,"FUTURE_LEAKAGE_NOT_FORBIDDEN",input.futureDatesForbidden===true);
  fail(reasons,"EXACT_PROVIDER_PROVENANCE_NOT_REQUIRED",input.requireExactProviderResponseSha256===true);
  fail(reasons,"CORPORATE_ACTION_SEMANTICS_NOT_PRESERVED",input.preserveCorporateActionResetSemantics===true);
  fail(reasons,"MISSING_SLOT_POLICY_NOT_EXPLICIT",nonEmpty(input.missingSlotPolicy)&&input.missingSlotPolicy!=="IGNORE_MISSING_SLOT");
  fail(reasons,"UNKNOWN_NOT_FAIL_CLOSED",input.unknownFreshnessFailsClosed===true);
  fail(reasons,"RETROACTIVE_CLEAN_DATE_FORBIDDEN_MISSING",input.retroactiveCleanDateForbidden===true);
  return {schemaVersion:PVE261_SCHEMA,pass:reasons.length===0,reasons,
    authorization:{mergeAuthorized:false,deployAuthorized:false,formalCoreChangeAuthorized:false,maturityPromotionAuthorized:false,outcomeAccessAuthorized:false}};
}

export function evaluatePve261PhysicalReadback(input={}){
  const reasons=[];
  const marketDate=dateOnly(input.marketDate),expected=dateOnly(input.expectedLatestComparableSlotDate),baseline=dateOnly(input.baselineAsOfDate);
  fail(reasons,"MARKET_DATE_INVALID",marketDate!==null);
  fail(reasons,"EXPECTED_PRIOR_SLOT_DATE_INVALID",expected!==null);
  fail(reasons,"BASELINE_AS_OF_DATE_INVALID",baseline!==null);
  fail(reasons,"EXPECTED_PRIOR_SLOT_NOT_STRICTLY_PRIOR",marketDate!==null&&expected!==null&&expected<marketDate);
  fail(reasons,"BASELINE_FRESHNESS_MISMATCH",expected!==null&&baseline!==null&&baseline===expected);
  fail(reasons,"SAME_SLOT_HISTORY_LT_20",Number.isInteger(input.slotHistoryCount)&&input.slotHistoryCount>=20);
  fail(reasons,"SAME_SLOT_BASELINE_CLEAN_NOT_TRUE",input.sameSlotBaselineClean===true);
  fail(reasons,"EXACT_SLOT_HISTORY_VALIDITY_NOT_PASS",input.sameSlotHistoryValidityState==="PASS");
  fail(reasons,"PROVIDER_MISSING",nonEmpty(input.provider));
  fail(reasons,"ENDPOINT_MISSING",nonEmpty(input.endpoint));
  fail(reasons,"RAW_HASH_INVALID",sha256(input.rawPayloadHash));
  fail(reasons,"RAW_HASH_BASIS_INVALID",input.rawPayloadHashBasis==="EXACT_PROVIDER_RESPONSE_SHA256");
  fail(reasons,"SOURCE_FETCH_TIME_INVALID",isoInstant(input.sourceFetchedAt));
  fail(reasons,"CORPORATE_ACTION_CONTINUITY_NOT_PROVEN",["CLEAN","BRIDGE_VERIFIED","RESET_CLEAN_GE20"].includes(input.corporateActionContinuityState));
  fail(reasons,"CURRENT_SESSION_EXCLUSION_NOT_PROVEN",input.currentSessionExcludedFromBaseline===true);
  fail(reasons,"NO_FUTURE_DATA_PROOF_MISSING",input.futureDatesAbsent===true);
  const deployedAt=Date.parse(input.deployedAt),capturedAt=Date.parse(input.featureCapturedAt);
  fail(reasons,"DEPLOYMENT_TIME_INVALID",Number.isFinite(deployedAt));
  fail(reasons,"FEATURE_CAPTURE_TIME_INVALID",Number.isFinite(capturedAt));
  fail(reasons,"READBACK_NOT_PROSPECTIVE",Number.isFinite(deployedAt)&&Number.isFinite(capturedAt)&&capturedAt>deployedAt);
  fail(reasons,"DECISION_IMPACT_NOT_ZERO",input.decisionImpact===0);
  return {schemaVersion:PVE261_SCHEMA,pass:reasons.length===0,reasons,
    authorizations:{cleanH001DateEligible:reasons.length===0,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false,outcomeAccessAuthorized:false}};
}

export function evaluatePve261(input={}){
  const candidate=evaluatePve261CandidateContract(input.candidate||{});
  const readback=input.readback?evaluatePve261PhysicalReadback(input.readback):null;
  return {schemaVersion:PVE261_SCHEMA,candidateContract:candidate,physicalReadback:readback,
    candidateDesignReady:candidate.pass,
    productionRemediationAccepted:Boolean(candidate.pass&&readback?.pass),
    ownerApprovalStillRequired:true,
    formalCoreUnchanged:true};
}
