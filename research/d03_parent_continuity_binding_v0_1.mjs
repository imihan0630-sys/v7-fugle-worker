import crypto from "node:crypto";
import {evaluateAdxL3ParentV0_2} from "./d03_adx_l3_acceptance_v0_2.mjs";
import {evaluateBollingerL3ParentV0_2} from "./d03_bollinger_l3_acceptance_v0_2.mjs";

export const D03_PARENT_CONTINUITY_BINDING_VERSION="D03_PARENT_CONTINUITY_BINDING_V0_1";
const isoDay=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x);
const isoTime=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));
const hash64=x=>typeof x==="string"&&/^[0-9a-f]{64}$/i.test(x);
const nonempty=x=>typeof x==="string"&&x.length>0;
const parentKey=p=>[p.scanDate,p.captureGeneration,p.symbol,p.parentSnapshotHash].join("|");
function hash(v){return crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex");}
function hashDates(xs){return hash([...xs].sort());}

export function bindD03ParentContinuityV0_1({parent,continuityReceipt,bindingCreatedAt=new Date().toISOString()}={}){
  const reasons=[];
  if(!parent||typeof parent!=="object") return {schemaVersion:D03_PARENT_CONTINUITY_BINDING_VERSION,status:"UNKNOWN",reasons:["PARENT_MISSING"],bindingEligible:false};
  if(!isoDay(parent.scanDate)||!nonempty(parent.captureGeneration)||!nonempty(parent.symbol)||!hash64(parent.parentSnapshotHash)||!isoTime(parent.knownAt)){
    reasons.push("PARENT_IDENTITY_INVALID");
  }
  if(!continuityReceipt||typeof continuityReceipt!=="object"){
    return {schemaVersion:D03_PARENT_CONTINUITY_BINDING_VERSION,status:"UNKNOWN",reasons:["CONTINUITY_RECEIPT_MISSING"],bindingEligible:false,parentKey:parentKey(parent)};
  }
  if(continuityReceipt.symbol!==parent.symbol) reasons.push("SYMBOL_MISMATCH");
  if(!isoDay(continuityReceipt.asOf)||continuityReceipt.asOf!==parent.scanDate) reasons.push("CONTINUITY_ASOF_PARENT_DATE_MISMATCH");
  if(!isoTime(continuityReceipt.capturedAt)||Date.parse(continuityReceipt.capturedAt)>Date.parse(parent.knownAt)) reasons.push("CONTINUITY_CAPTURE_AFTER_PARENT");
  if(!isoTime(bindingCreatedAt)) reasons.push("BINDING_CREATED_AT_INVALID");
  if(!nonempty(continuityReceipt.continuityReceiptId)) reasons.push("CONTINUITY_RECEIPT_ID_MISSING");
  if(!nonempty(continuityReceipt.receiptVersion)) reasons.push("CONTINUITY_RECEIPT_VERSION_MISSING");
  if(!hash64(continuityReceipt.sourceHistoryHash)) reasons.push("SOURCE_HISTORY_HASH_INVALID");
  if(!hash64(continuityReceipt.continuityTransformHash)) reasons.push("CONTINUITY_TRANSFORM_HASH_INVALID");

  const expected=Array.isArray(continuityReceipt.expectedEligibleSymbolSessions)?continuityReceipt.expectedEligibleSymbolSessions:[];
  const bars=Array.isArray(continuityReceipt.bars)?continuityReceipt.bars:[];
  const expectedDates=expected.filter(isoDay);
  const actualDates=bars.map(x=>x?.date).filter(isoDay);
  if(expectedDates.length!==expected.length||new Set(expectedDates).size!==expectedDates.length) reasons.push("EXPECTED_DATESET_INVALID");
  if(actualDates.length!==bars.length||new Set(actualDates).size!==actualDates.length) reasons.push("BAR_DATESET_INVALID");
  const expectedHash=hashDates(expectedDates),actualHash=hashDates(actualDates);
  if(expectedHash!==actualHash) reasons.push("ELIGIBLE_DATE_SET_MISMATCH");
  const last=[...actualDates].sort().at(-1)||null;
  if(!isoDay(continuityReceipt.sourceBarsThrough)||continuityReceipt.sourceBarsThrough!==last) reasons.push("SOURCE_BARS_THROUGH_MISMATCH");
  if(last&&last>parent.scanDate) reasons.push("FUTURE_BAR_RELATIVE_TO_PARENT");

  if(reasons.length){
    return {
      schemaVersion:D03_PARENT_CONTINUITY_BINDING_VERSION,
      status:"DATA_BLOCKED",reasons:[...new Set(reasons)],bindingEligible:false,
      parentKey:parentKey(parent),continuityReceiptId:continuityReceipt.continuityReceiptId||null,
      expectedEligibleDateSetHash:expectedHash,continuityBarDateSetHash:actualHash,
    };
  }
  const payload={
    schemaVersion:D03_PARENT_CONTINUITY_BINDING_VERSION,
    parentKey:parentKey(parent),
    scanDate:parent.scanDate,captureGeneration:parent.captureGeneration,symbol:parent.symbol,
    parentSnapshotHash:parent.parentSnapshotHash,parentKnownAt:parent.knownAt,
    continuityReceiptId:continuityReceipt.continuityReceiptId,
    continuityReceiptVersion:continuityReceipt.receiptVersion,
    continuityAsOf:continuityReceipt.asOf,
    continuityCapturedAt:continuityReceipt.capturedAt,
    sourceHistoryHash:continuityReceipt.sourceHistoryHash,
    continuityTransformHash:continuityReceipt.continuityTransformHash,
    expectedEligibleDateSetHash:expectedHash,
    continuityBarDateSetHash:actualHash,
    sourceBarsThrough:last,
  };
  const bindingId=hash(payload);
  return {
    ...payload,bindingId,bindingCreatedAt:new Date(bindingCreatedAt).toISOString(),
    status:"VALID",reasons:[],bindingEligible:true,
  };
}

export function evaluateBoundBollingerL3V0_1(input={}){
  const binding=bindD03ParentContinuityV0_1(input);
  if(!binding.bindingEligible) return {schemaVersion:"D03_BOUND_BOLLINGER_L3_V0_1",binding,indicator:null,status:binding.status,l3EvidenceEligible:false};
  const indicator=evaluateBollingerL3ParentV0_2(input);
  return {
    schemaVersion:"D03_BOUND_BOLLINGER_L3_V0_1",binding,indicator,
    status:indicator.status,
    l3EvidenceEligible:indicator.l3EvidenceEligible===true,
  };
}
export function evaluateBoundAdxL3V0_1(input={}){
  const binding=bindD03ParentContinuityV0_1(input);
  if(!binding.bindingEligible) return {schemaVersion:"D03_BOUND_ADX_L3_V0_1",binding,indicator:null,status:binding.status,l3EvidenceEligible:false};
  const indicator=evaluateAdxL3ParentV0_2(input);
  return {
    schemaVersion:"D03_BOUND_ADX_L3_V0_1",binding,indicator,
    status:indicator.status,
    l3EvidenceEligible:indicator.l3EvidenceEligible===true,
  };
}
