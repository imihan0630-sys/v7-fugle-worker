import {evaluateD16Receipt} from "./d02_d16_l4_validation_receipt_guard_v0_2.mjs";

export const PVE279_SCHEMA="D02_PVE279_D16_WAVE2_ADMISSION_BINDING_V0_1";
export const PVE278_SCHEMA="D02_PVE278_WAVE2_ANTI_BYPASS_FIREWALL_V0_1";
const sha256=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
const iso=v=>Number.isFinite(Date.parse(v));
const MAP=Object.freeze({
 "D02-04:DRYUP":{moduleId:"D02-04",family:null},
 "D02-05:EXTREME_PARTICIPATION":{moduleId:"D02-05",family:null},
 "D02-07:SVB20":{moduleId:"D02-07",family:null},
 "D02-08:PROVIDER_PRESSURE":{moduleId:"D02-08",family:null},
 "D02-09:PIVOT_SIGNED_VOLUME":{moduleId:"D02-09",family:"PIVOT_SIGNED_VOLUME"},
 "D02-09:PARTICIPATION_TRAJECTORY":{moduleId:"D02-09",family:"PARTICIPATION_TRAJECTORY"},
 "D02-10:TREND_VOLUME_INTERACTION":{moduleId:"D02-10",family:null},
 "D02-11:LIQUIDITY_COUNTERFACTUAL":{moduleId:"D02-11",family:null},
 "D02-12:TIME_OF_DAY_VOLUME_CURVE":{moduleId:"D02-12",family:"TIME_OF_DAY_VOLUME_CURVE"},
 "D02-12:PRICE_BY_VOLUME_PROFILE":{moduleId:"D02-12",family:"PRICE_BY_VOLUME_PROFILE"}
});

export function evaluatePve279D16Wave2Binding(receipt={},expected={}){
  const legacy=evaluateD16Receipt(receipt,expected);
  const key=String(expected.evidenceKey||receipt.evidenceKey||"");
  const spec=MAP[key]||null;
  const reasons=[...legacy.reasons];

  if(spec){
    const a=receipt.preOutcomeAdmissionReceipt||{};
    if(a.schemaVersion!==PVE278_SCHEMA)reasons.push("WAVE2_PVE278_ADMISSION_RECEIPT_REQUIRED");
    if(a.pass!==true)reasons.push("WAVE2_ADMISSION_FIREWALL_NOT_PASS");
    if(a.moduleId!==spec.moduleId)reasons.push("WAVE2_ADMISSION_MODULE_MISMATCH");
    if((a.family??null)!==(spec.family??null))reasons.push("WAVE2_ADMISSION_FAMILY_MISMATCH");
    if(a.outcomeAccessAuthorized!==false)reasons.push("WAVE2_PREOUTCOME_ADMISSION_CANNOT_AUTHORIZE_OUTCOMES");
    if(a.maturityPromotionAuthorized!==false)reasons.push("WAVE2_PREOUTCOME_ADMISSION_CANNOT_AUTHORIZE_MATURITY");
    if(a.outcomeBlind!==true)reasons.push("WAVE2_ADMISSION_NOT_OUTCOME_BLIND");
    if(!sha256(a.receiptHash))reasons.push("WAVE2_ADMISSION_RECEIPT_HASH_INVALID");
    if(!sha256(a.admittedDatasetHash))reasons.push("WAVE2_ADMITTED_DATASET_HASH_INVALID");
    if(!sha256(receipt.d16InputDatasetHash))reasons.push("D16_INPUT_DATASET_HASH_INVALID");
    if(sha256(a.admittedDatasetHash)&&sha256(receipt.d16InputDatasetHash)&&a.admittedDatasetHash!==receipt.d16InputDatasetHash)
      reasons.push("D16_INPUT_DATASET_NOT_EXACT_WAVE2_ADMITTED_DATASET");
    if(!Number.isInteger(a.admittedRowCount)||a.admittedRowCount<1)reasons.push("WAVE2_ADMITTED_ROW_COUNT_INVALID");
    if(Number.isFinite(Number(receipt.commonSupportCount))&&Number.isInteger(a.admittedRowCount)&&Number(receipt.commonSupportCount)!==a.admittedRowCount)
      reasons.push("COMMON_SUPPORT_COUNT_NOT_BOUND_TO_WAVE2_ADMISSION");
    if(!iso(a.createdAt))reasons.push("WAVE2_ADMISSION_CREATED_AT_INVALID");
    if(!iso(receipt.firstOutcomeAccessAt))reasons.push("D16_FIRST_OUTCOME_ACCESS_AT_INVALID");
    if(iso(a.createdAt)&&iso(receipt.firstOutcomeAccessAt)&&Date.parse(a.createdAt)>=Date.parse(receipt.firstOutcomeAccessAt))
      reasons.push("WAVE2_ADMISSION_NOT_FROZEN_BEFORE_OUTCOME_ACCESS");
  }

  const uniq=[...new Set(reasons)];
  return Object.freeze({
    schemaVersion:PVE279_SCHEMA,evidenceKey:key,pass:uniq.length===0,reasons:Object.freeze(uniq),
    legacyD16GuardPass:legacy.pass,
    promotionReviewEligible:uniq.length===0&&legacy.promotionReviewEligible===true,
    maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false,
    directLegacyWave2D16ConsumptionAuthorized:false
  });
}
