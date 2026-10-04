import crypto from "node:crypto";
import {
  evaluateEvidenceCutoffReceiptSplitV0_1,
  evaluateCutoffDerivedBollingerL3V0_3,
  evaluateCutoffDerivedAdxL3V0_3,
} from "./d03_evidence_cutoff_receipt_split_v0_1.mjs";

export const D03_PARENT_CONTINUITY_BINDING_VERSION_V0_2="D03_PARENT_CONTINUITY_BINDING_V0_2";

const isoDay=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x);
const isoTime=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));
const hash64=x=>typeof x==="string"&&/^[0-9a-f]{64}$/i.test(x);
const nonempty=x=>typeof x==="string"&&x.length>0;
const h=v=>crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex");
const hashDates=xs=>h([...xs].sort());

function parentKey(p){
  return [p.scanDate,p.captureGeneration,p.symbol,p.parentSnapshotHash].join("|");
}
function blocked(reasons,extra={}){
  return {
    schemaVersion:D03_PARENT_CONTINUITY_BINDING_VERSION_V0_2,
    status:"DATA_BLOCKED",bindingEligible:false,reasons:[...new Set(reasons)],...extra
  };
}

export function bindD03ParentCutoffContinuityV0_2({
  parent,evidenceCut,continuityReceipt,bindingCreatedAt=new Date().toISOString()
}={}){
  const reasons=[];
  if(!parent||typeof parent!=="object") return blocked(["PARENT_MISSING"]);
  if(!isoDay(parent.scanDate)||!nonempty(parent.captureGeneration)||!nonempty(parent.symbol)||!hash64(parent.parentSnapshotHash)){
    reasons.push("PARENT_IDENTITY_INVALID");
  }
  if(!isoTime(parent.decisionCutoffAt)) reasons.push("PARENT_DECISION_CUTOFF_NOT_PERSISTED");
  if(!isoTime(parent.decisionAt)) reasons.push("PARENT_DECISION_AT_INVALID");
  if(!isoTime(parent.knownAt)) reasons.push("PARENT_KNOWN_AT_INVALID");
  if(
    isoTime(parent.decisionCutoffAt)&&isoTime(parent.decisionAt)&&
    Date.parse(parent.decisionCutoffAt)>Date.parse(parent.decisionAt)
  ) reasons.push("DECISION_CUTOFF_AFTER_DECISION_AT");
  if(
    isoTime(parent.decisionAt)&&isoTime(parent.knownAt)&&
    Date.parse(parent.decisionAt)>Date.parse(parent.knownAt)
  ) reasons.push("DECISION_AT_AFTER_PARENT_KNOWN_AT");

  const timing=evaluateEvidenceCutoffReceiptSplitV0_1({parent,evidenceCut,continuityReceipt});
  if(!timing.eligible) reasons.push(...timing.reasons);

  if(!continuityReceipt||typeof continuityReceipt!=="object"){
    return blocked([...reasons,"CONTINUITY_RECEIPT_MISSING"],{parentKey:parentKey(parent),timing});
  }
  if(continuityReceipt.symbol!==parent.symbol) reasons.push("SYMBOL_MISMATCH");
  if(!isoDay(continuityReceipt.asOf)||continuityReceipt.asOf!==parent.scanDate) reasons.push("CONTINUITY_ASOF_PARENT_DATE_MISMATCH");
  if(!nonempty(continuityReceipt.continuityReceiptId)) reasons.push("CONTINUITY_RECEIPT_ID_MISSING");
  if(!nonempty(continuityReceipt.receiptVersion)) reasons.push("CONTINUITY_RECEIPT_VERSION_MISSING");
  if(!hash64(continuityReceipt.sourceHistoryHash)) reasons.push("SOURCE_HISTORY_HASH_INVALID");
  if(!hash64(continuityReceipt.continuityTransformHash)) reasons.push("CONTINUITY_TRANSFORM_HASH_INVALID");
  if(!isoTime(bindingCreatedAt)) reasons.push("BINDING_CREATED_AT_INVALID");
  if(
    isoTime(bindingCreatedAt)&&isoTime(continuityReceipt.receiptCreatedAt)&&
    Date.parse(bindingCreatedAt)<Date.parse(continuityReceipt.receiptCreatedAt)
  ) reasons.push("BINDING_CREATED_BEFORE_RECEIPT");

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
    return blocked(reasons,{
      parentKey:parentKey(parent),timing,
      continuityReceiptId:continuityReceipt.continuityReceiptId||null,
      evidenceCutId:evidenceCut?.evidenceCutId||null,
      expectedEligibleDateSetHash:expectedHash,
      continuityBarDateSetHash:actualHash,
    });
  }

  const payload={
    schemaVersion:D03_PARENT_CONTINUITY_BINDING_VERSION_V0_2,
    parentKey:parentKey(parent),
    scanDate:parent.scanDate,
    captureGeneration:parent.captureGeneration,
    symbol:parent.symbol,
    parentSnapshotHash:parent.parentSnapshotHash,
    decisionCutoffAt:parent.decisionCutoffAt,
    decisionAt:parent.decisionAt,
    parentKnownAt:parent.knownAt,
    evidenceCutId:evidenceCut.evidenceCutId,
    evidenceCutoffAt:evidenceCut.evidenceCutoffAt,
    sourceCutManifestHash:evidenceCut.sourceCutManifestHash,
    timingIdentityHash:timing.timingIdentityHash,
    continuityReceiptId:continuityReceipt.continuityReceiptId,
    continuityReceiptVersion:continuityReceipt.receiptVersion,
    receiptCreatedAt:continuityReceipt.receiptCreatedAt,
    transformInputManifestHash:continuityReceipt.transformInputManifestHash,
    sourceFactRefSetHash:continuityReceipt.sourceFactRefSetHash,
    sourceHistoryHash:continuityReceipt.sourceHistoryHash,
    continuityTransformHash:continuityReceipt.continuityTransformHash,
    expectedEligibleDateSetHash:expectedHash,
    continuityBarDateSetHash:actualHash,
    sourceBarsThrough:last,
  };
  return {
    ...payload,
    bindingId:h(payload),
    bindingCreatedAt:new Date(bindingCreatedAt).toISOString(),
    status:"VALID",
    bindingEligible:true,
    reasons:[],
    receiptCreatedAfterParent:timing.receiptCreatedAfterParent,
    decisionAtMaySubstituteForCutoff:false,
  };
}

export function evaluateBoundCutoffDerivedBollingerL3V0_3(input={}){
  const binding=bindD03ParentCutoffContinuityV0_2(input);
  if(!binding.bindingEligible) return {
    schemaVersion:"D03_BOUND_CUTOFF_DERIVED_BOLLINGER_L3_V0_3",
    status:binding.status,l3EvidenceEligible:false,binding,indicator:null,
  };
  const indicator=evaluateCutoffDerivedBollingerL3V0_3(input);
  return {
    schemaVersion:"D03_BOUND_CUTOFF_DERIVED_BOLLINGER_L3_V0_3",
    status:indicator.status,
    l3EvidenceEligible:indicator.l3EvidenceEligible===true,
    binding,indicator,
  };
}

export function evaluateBoundCutoffDerivedAdxL3V0_3(input={}){
  const binding=bindD03ParentCutoffContinuityV0_2(input);
  if(!binding.bindingEligible) return {
    schemaVersion:"D03_BOUND_CUTOFF_DERIVED_ADX_L3_V0_3",
    status:binding.status,l3EvidenceEligible:false,binding,indicator:null,
  };
  const indicator=evaluateCutoffDerivedAdxL3V0_3(input);
  return {
    schemaVersion:"D03_BOUND_CUTOFF_DERIVED_ADX_L3_V0_3",
    status:indicator.status,
    l3EvidenceEligible:indicator.l3EvidenceEligible===true,
    binding,indicator,
  };
}
