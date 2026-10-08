import {evaluateD16Receipt} from "./d02_d16_l4_validation_receipt_guard_v0_2.mjs";

export const PVE276_SCHEMA="D02_PVE276_D16_WAVE1_ADMISSION_BINDING_V0_1";
export const PVE275_SCHEMA="D02_PVE275_WAVE1_ANTI_BYPASS_FIREWALL_V0_1";
const WAVE1=new Set(["D02-02:H001","D02-03:H20","D02-06:H003"]);
const sha256=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
const iso=v=>Number.isFinite(Date.parse(v));

export function evaluatePve276D16Wave1Binding(receipt={},expected={}){
  const legacy=evaluateD16Receipt(receipt,expected);
  const key=String(expected.evidenceKey||receipt.evidenceKey||"");
  const reasons=[...legacy.reasons];

  if(WAVE1.has(key)){
    const a=receipt.preOutcomeAdmissionReceipt||{};
    if(a.schemaVersion!==PVE275_SCHEMA)reasons.push("WAVE1_PVE275_ADMISSION_RECEIPT_REQUIRED");
    if(a.evidenceKey!==key)reasons.push("WAVE1_ADMISSION_EVIDENCE_KEY_MISMATCH");
    if(a.pass!==true||a.state!=="WAVE1_PREOUTCOME_ADMISSION_FIREWALL_PASS")reasons.push("WAVE1_ADMISSION_FIREWALL_NOT_PASS");
    if(a.legacyGateDirectUseAuthorized!==false)reasons.push("LEGACY_GATE_DIRECT_USE_MUST_BE_FORBIDDEN");
    if(a.outcomeAccessAuthorized!==false)reasons.push("PREOUTCOME_ADMISSION_CANNOT_AUTHORIZE_OUTCOMES");
    if(a.maturityPromotionAuthorized!==false)reasons.push("PREOUTCOME_ADMISSION_CANNOT_AUTHORIZE_MATURITY");
    if(!sha256(a.receiptHash))reasons.push("WAVE1_ADMISSION_RECEIPT_HASH_INVALID");
    if(!sha256(a.admittedDatasetHash))reasons.push("WAVE1_ADMITTED_DATASET_HASH_INVALID");
    if(!sha256(receipt.d16InputDatasetHash))reasons.push("D16_INPUT_DATASET_HASH_INVALID");
    if(sha256(a.admittedDatasetHash)&&sha256(receipt.d16InputDatasetHash)&&a.admittedDatasetHash!==receipt.d16InputDatasetHash)
      reasons.push("D16_INPUT_DATASET_NOT_EXACT_ADMITTED_DATASET");
    if(!Number.isInteger(a.admittedRowCount)||a.admittedRowCount<1)reasons.push("WAVE1_ADMITTED_ROW_COUNT_INVALID");
    if(Number.isFinite(Number(receipt.commonSupportCount))&&Number.isInteger(a.admittedRowCount)&&
       Number(receipt.commonSupportCount)!==a.admittedRowCount)reasons.push("COMMON_SUPPORT_COUNT_NOT_BOUND_TO_ADMISSION");
    if(!iso(a.createdAt))reasons.push("WAVE1_ADMISSION_CREATED_AT_INVALID");
    if(!iso(receipt.firstOutcomeAccessAt))reasons.push("D16_FIRST_OUTCOME_ACCESS_AT_INVALID");
    if(iso(a.createdAt)&&iso(receipt.firstOutcomeAccessAt)&&Date.parse(a.createdAt)>=Date.parse(receipt.firstOutcomeAccessAt))
      reasons.push("WAVE1_ADMISSION_NOT_FROZEN_BEFORE_OUTCOME_ACCESS");
    if(a.outcomeBlind!==true)reasons.push("WAVE1_ADMISSION_NOT_OUTCOME_BLIND");
  }

  const uniq=[...new Set(reasons)];
  return Object.freeze({
    schemaVersion:PVE276_SCHEMA,
    evidenceKey:key,
    pass:uniq.length===0,
    reasons:Object.freeze(uniq),
    legacyD16GuardPass:legacy.pass,
    promotionReviewEligible:uniq.length===0&&legacy.promotionReviewEligible===true,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false,
    directLegacyD16ConsumptionAuthorized:false
  });
}
