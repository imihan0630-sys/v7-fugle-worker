import {evaluatePve280D16SemanticBinding} from "./d02_pve280_d16_semantic_admission_binding_v0_1.mjs";
import {evaluatePve276D16Wave1Binding} from "./d02_pve276_d16_wave1_admission_binding_v0_1.mjs";
import {evaluatePve279D16Wave2Binding} from "./d02_pve279_d16_wave2_admission_binding_v0_1.mjs";

export const PVE281_SCHEMA="D02_PVE281_CANONICAL_END_TO_END_ADMISSION_LINEAGE_V0_1";
export const D02_ALL_EVIDENCE_KEYS=Object.freeze([
 "D02-01:SEMANTIC_GOVERNANCE",
 "D02-02:H001","D02-03:H20","D02-04:DRYUP","D02-05:EXTREME_PARTICIPATION","D02-06:H003",
 "D02-07:SVB20","D02-08:PROVIDER_PRESSURE","D02-09:PIVOT_SIGNED_VOLUME","D02-09:PARTICIPATION_TRAJECTORY",
 "D02-10:TREND_VOLUME_INTERACTION","D02-11:LIQUIDITY_COUNTERFACTUAL",
 "D02-12:TIME_OF_DAY_VOLUME_CURVE","D02-12:PRICE_BY_VOLUME_PROFILE"
]);
const ALL=new Set(D02_ALL_EVIDENCE_KEYS);
const W1=new Set(["D02-02:H001","D02-03:H20","D02-06:H003"]);

export function evaluatePve281CanonicalD02Lineage(receipt={},expected={}){
  const key=String(expected.evidenceKey||receipt.evidenceKey||"");
  if(!ALL.has(key)) return Object.freeze({
    schemaVersion:PVE281_SCHEMA,evidenceKey:key,lane:"UNKNOWN",pass:false,
    reasons:Object.freeze(["UNKNOWN_D02_EVIDENCE_KEY"]),
    promotionReviewEligible:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false
  });

  let lane,inner;
  if(key==="D02-01:SEMANTIC_GOVERNANCE"){
    lane="SEMANTIC";
    inner=evaluatePve280D16SemanticBinding(receipt,expected);
  }else if(W1.has(key)){
    lane="WAVE1";
    inner=evaluatePve276D16Wave1Binding(receipt,expected);
  }else{
    lane="WAVE2";
    inner=evaluatePve279D16Wave2Binding(receipt,expected);
  }

  return Object.freeze({
    schemaVersion:PVE281_SCHEMA,evidenceKey:key,lane,
    pass:inner.pass===true,reasons:Object.freeze([...(inner.reasons||[])]),
    innerSchemaVersion:inner.schemaVersion??null,
    promotionReviewEligible:inner.pass===true&&inner.promotionReviewEligible===true,
    exactAdmissionDatasetBindingRequired:true,
    outcomeBlindAdmissionRequired:true,
    preOutcomeAdmissionReceiptRequired:true,
    directLegacyAdmissionConsumptionAuthorized:false,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false
  });
}
