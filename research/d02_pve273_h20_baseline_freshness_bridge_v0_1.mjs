import {evaluatePVE242LaneBridge} from "./d02_pve242_lane_bridge_guard_v0_1.mjs";

export const PVE273_SCHEMA="D02_PVE273_H20_BASELINE_FRESHNESS_BRIDGE_V0_1";
const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v||""));
const sha256=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
const caOk=new Set(["CLEAN","BRIDGE_VERIFIED","RESET_CLEAN_GE20"]);

export function evaluatePve273H20BaselineFreshness(receipt={},ctx={}){
  const bridge=evaluatePVE242LaneBridge(receipt,"D02-03:H20",ctx);
  const reasons=[...bridge.reasons];

  if(ctx.challengerFeatureId!=="SAME_SLOT_RVOL20") reasons.push("H20_CHALLENGER_MUST_BE_SAME_SLOT_RVOL20");
  if(ctx.baselineComparatorFeatureId!=="LOCAL_PREV5_VOLUME_RATIO") reasons.push("H20_BASELINE_COMPARATOR_MUST_BE_LOCAL_PREV5_RATIO");
  if(ctx.sameSlotBaselineClean!==true) reasons.push("H20_SAME_SLOT_BASELINE_NOT_CLEAN");
  if(!Number.isInteger(ctx.slotHistoryCount)||ctx.slotHistoryCount<20) reasons.push("H20_SLOT_HISTORY_LT_20");
  if(ctx.currentSlotCoverageValid!==true) reasons.push("H20_CURRENT_SLOT_COVERAGE_INVALID");
  if(!validDate(ctx.baselineAsOfDate)) reasons.push("H20_BASELINE_AS_OF_DATE_INVALID");
  if(!validDate(ctx.expectedLatestComparableSlotDate)) reasons.push("H20_EXPECTED_COMPARABLE_SLOT_DATE_INVALID");
  if(validDate(ctx.baselineAsOfDate)&&validDate(ctx.expectedLatestComparableSlotDate)&&ctx.baselineAsOfDate!==ctx.expectedLatestComparableSlotDate)
    reasons.push("H20_BASELINE_FRESHNESS_MISMATCH");
  if(validDate(ctx.baselineAsOfDate)&&validDate(receipt.marketDate)&&ctx.baselineAsOfDate>=receipt.marketDate)
    reasons.push("H20_BASELINE_NOT_STRICTLY_PRIOR");
  if(ctx.sameSlotHistoryValidityState!=="PASS") reasons.push("H20_EXACT_SLOT_HISTORY_VALIDITY_NOT_PASS");
  if(!caOk.has(ctx.corporateActionContinuityState)) reasons.push("H20_CORPORATE_ACTION_CONTINUITY_NOT_PROVEN");
  if(ctx.currentSessionExcludedFromBaseline!==true) reasons.push("H20_CURRENT_SESSION_NOT_EXCLUDED_FROM_BASELINE");
  if(ctx.futureDatesAbsent!==true) reasons.push("H20_FUTURE_DATES_NOT_EXCLUDED");
  if(!sha256(ctx.baselineRawPayloadHash)) reasons.push("H20_BASELINE_RAW_PROVIDER_HASH_INVALID");
  if(ctx.baselineRawPayloadHashBasis!=="EXACT_PROVIDER_RESPONSE_SHA256") reasons.push("H20_BASELINE_RAW_HASH_BASIS_INVALID");
  if(ctx.residualIncrementalityTarget!=="RVOL20_BEYOND_LOCAL_PREV5_ON_IDENTICAL_D01_BREAKOUT") reasons.push("H20_RESIDUAL_TARGET_MISMATCH");

  const uniq=[...new Set(reasons)];
  return Object.freeze({
    schemaVersion:PVE273_SCHEMA,
    pass:uniq.length===0,
    reasons:Object.freeze(uniq),
    pve242BridgePass:bridge.pass,
    h20ProspectiveAdmissionEligible:uniq.length===0,
    cleanSelectionDateAuthorized:false,
    outcomeAccessAuthorized:false,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false
  });
}
