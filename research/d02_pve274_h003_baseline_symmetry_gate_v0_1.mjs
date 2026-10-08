import {evaluatePVE242LaneBridge} from "./d02_pve242_lane_bridge_guard_v0_1.mjs";

export const PVE274_SCHEMA="D02_PVE274_H003_BASELINE_SYMMETRY_GATE_V0_1";
const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v||""));
const sha256=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
const caOk=new Set(["CLEAN","BRIDGE_VERIFIED","RESET_CLEAN_GE20"]);

function baselineChecks(prefix,b={},marketDate){
  const r=[];
  if(b.clean!==true)r.push(prefix+"_BASELINE_NOT_CLEAN");
  if(!Number.isInteger(b.historyCount)||b.historyCount<20)r.push(prefix+"_HISTORY_LT_20");
  if(b.currentSlotCoverageValid!==true)r.push(prefix+"_CURRENT_SLOT_COVERAGE_INVALID");
  if(!validDate(b.baselineAsOfDate))r.push(prefix+"_AS_OF_DATE_INVALID");
  if(!validDate(b.expectedLatestComparableSlotDate))r.push(prefix+"_EXPECTED_COMPARABLE_DATE_INVALID");
  if(validDate(b.baselineAsOfDate)&&validDate(b.expectedLatestComparableSlotDate)&&b.baselineAsOfDate!==b.expectedLatestComparableSlotDate)
    r.push(prefix+"_FRESHNESS_MISMATCH");
  if(validDate(b.baselineAsOfDate)&&validDate(marketDate)&&b.baselineAsOfDate>=marketDate)
    r.push(prefix+"_NOT_STRICTLY_PRIOR");
  if(b.exactSlotHistoryValidityState!=="PASS")r.push(prefix+"_EXACT_SLOT_VALIDITY_NOT_PASS");
  if(!caOk.has(b.corporateActionContinuityState))r.push(prefix+"_CORPORATE_ACTION_CONTINUITY_NOT_PROVEN");
  if(b.currentSessionExcluded!==true)r.push(prefix+"_CURRENT_SESSION_NOT_EXCLUDED");
  if(b.futureDatesAbsent!==true)r.push(prefix+"_FUTURE_DATES_NOT_EXCLUDED");
  if(!sha256(b.rawPayloadHash))r.push(prefix+"_RAW_PROVIDER_HASH_INVALID");
  if(b.rawPayloadHashBasis!=="EXACT_PROVIDER_RESPONSE_SHA256")r.push(prefix+"_RAW_HASH_BASIS_INVALID");
  return r;
}

export function evaluatePve274H003BaselineSymmetry(receipt={},ctx={}){
  const bridge=evaluatePVE242LaneBridge(receipt,"D02-06:H003",ctx);
  const reasons=[...bridge.reasons];
  const p=ctx.priceOnlyBaseline||{};
  const pv=ctx.pricePlusVolumeBaseline||{};
  reasons.push(...baselineChecks("H003_P_PRICE_RANGE",p,receipt.marketDate));
  reasons.push(...baselineChecks("H003_PV_VOLUME",pv,receipt.marketDate));

  if(ctx.priceOnlyFeatureSetId!=="PRICE_GEOMETRY_ONLY_V0_1")reasons.push("H003_PRICE_ONLY_FEATURE_SET_MISMATCH");
  if(ctx.pricePlusVolumeFeatureSetId!=="PRICE_GEOMETRY_PLUS_VOLUME_EFFORT_V0_1")reasons.push("H003_PV_FEATURE_SET_MISMATCH");
  if(ctx.identicalPriceGeometryInputs!==true)reasons.push("H003_PRICE_GEOMETRY_NOT_IDENTICAL");
  if(ctx.identicalEligibleRows!==true)reasons.push("H003_ELIGIBLE_ROWS_NOT_IDENTICAL");
  if(ctx.volumeEffortOnlyIncrement!==true)reasons.push("H003_PV_INCREMENT_NOT_VOLUME_ONLY");
  if(ctx.sameOutcomeDefinition!==true)reasons.push("H003_OUTCOME_DEFINITION_NOT_IDENTICAL");
  if(ctx.outcomeStrictlyFuture!==true)reasons.push("H003_OUTCOME_NOT_STRICTLY_FUTURE");
  if(ctx.sameEventIdentity!==true)reasons.push("H003_EVENT_IDENTITY_NOT_IDENTICAL");
  if(p.baselineAsOfDate&&pv.baselineAsOfDate&&p.baselineAsOfDate!==pv.baselineAsOfDate)
    reasons.push("H003_P_PV_BASELINE_DATE_ASYMMETRY");
  if(p.expectedLatestComparableSlotDate&&pv.expectedLatestComparableSlotDate&&
     p.expectedLatestComparableSlotDate!==pv.expectedLatestComparableSlotDate)
    reasons.push("H003_P_PV_EXPECTED_DATE_ASYMMETRY");

  const uniq=[...new Set(reasons)];
  return Object.freeze({
    schemaVersion:PVE274_SCHEMA,
    pass:uniq.length===0,
    reasons:Object.freeze(uniq),
    pve242BridgePass:bridge.pass,
    h003ProspectiveAdmissionEligible:uniq.length===0,
    outcomeAccessAuthorized:false,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false
  });
}
