import {evaluateD16Receipt} from "./d02_d16_l4_validation_receipt_guard_v0_2.mjs";

export const PVE280_SCHEMA="D02_PVE280_D16_SEMANTIC_ADMISSION_BINDING_V0_1";
export const SEMANTIC_ADMISSION_VERSION="D02_01_L4_SEMANTIC_ADMISSION_V0_1";
const KEY="D02-01:SEMANTIC_GOVERNANCE";
const sha256=v=>typeof v==="string"&&/^[0-9a-f]{64}$/i.test(v);
const iso=v=>Number.isFinite(Date.parse(v));

export function evaluatePve280D16SemanticBinding(receipt={},expected={}){
  const legacy=evaluateD16Receipt(receipt,expected);
  const key=String(expected.evidenceKey||receipt.evidenceKey||"");
  const reasons=[...legacy.reasons];

  if(key===KEY){
    const a=receipt.preOutcomeSemanticAdmissionReceipt||{};
    if(a.admissionVersion!==SEMANTIC_ADMISSION_VERSION) reasons.push("D02_01_SEMANTIC_ADMISSION_RECEIPT_REQUIRED");
    if(a.evidenceKey!==KEY) reasons.push("D02_01_SEMANTIC_EVIDENCE_KEY_MISMATCH");
    if(a.l4SemanticEvidenceAdmissionReady!==true) reasons.push("D02_01_SEMANTIC_ADMISSION_NOT_READY");
    if(a.fatalIntegrity!==false) reasons.push("D02_01_SEMANTIC_FATAL_INTEGRITY_NOT_FALSE");
    if(a.outcomeBlind!==true) reasons.push("D02_01_SEMANTIC_ADMISSION_NOT_OUTCOME_BLIND");
    if(a.economicOutcomeAccessAuthorized!==false) reasons.push("D02_01_SEMANTIC_ADMISSION_CANNOT_AUTHORIZE_ECONOMIC_OUTCOME");
    if(a.l4MaturityAuthorized!==false) reasons.push("D02_01_SEMANTIC_ADMISSION_CANNOT_AUTHORIZE_MATURITY");
    if(!sha256(a.receiptHash)) reasons.push("D02_01_SEMANTIC_RECEIPT_HASH_INVALID");
    if(!sha256(a.admittedDatasetHash)) reasons.push("D02_01_SEMANTIC_DATASET_HASH_INVALID");
    if(!sha256(receipt.d16InputDatasetHash)) reasons.push("D16_INPUT_DATASET_HASH_INVALID");
    if(sha256(a.admittedDatasetHash)&&sha256(receipt.d16InputDatasetHash)&&a.admittedDatasetHash!==receipt.d16InputDatasetHash)
      reasons.push("D16_INPUT_DATASET_NOT_EXACT_SEMANTIC_ADMITTED_DATASET");
    if(!Number.isInteger(a.admittedRowCount)||a.admittedRowCount<1) reasons.push("D02_01_SEMANTIC_ADMITTED_ROW_COUNT_INVALID");
    if(Number.isFinite(Number(receipt.commonSupportCount))&&Number.isInteger(a.admittedRowCount)&&
       Number(receipt.commonSupportCount)!==a.admittedRowCount) reasons.push("COMMON_SUPPORT_COUNT_NOT_BOUND_TO_SEMANTIC_ADMISSION");
    if(!iso(a.createdAt)) reasons.push("D02_01_SEMANTIC_ADMISSION_CREATED_AT_INVALID");
    if(!iso(receipt.firstOutcomeAccessAt)) reasons.push("D16_FIRST_OUTCOME_ACCESS_AT_INVALID");
    if(iso(a.createdAt)&&iso(receipt.firstOutcomeAccessAt)&&Date.parse(a.createdAt)>=Date.parse(receipt.firstOutcomeAccessAt))
      reasons.push("D02_01_SEMANTIC_ADMISSION_NOT_FROZEN_BEFORE_OUTCOME_ACCESS");
  }

  const uniq=[...new Set(reasons)];
  return Object.freeze({
    schemaVersion:PVE280_SCHEMA,evidenceKey:key,pass:uniq.length===0,reasons:Object.freeze(uniq),
    legacyD16GuardPass:legacy.pass,
    promotionReviewEligible:uniq.length===0&&legacy.promotionReviewEligible===true,
    maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false,
    directLegacySemanticD16ConsumptionAuthorized:false
  });
}
