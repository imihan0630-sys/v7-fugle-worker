import crypto from "node:crypto";
import { evaluateBollingerL3ParentV0_2 } from "./d03_bollinger_l3_acceptance_v0_2.mjs";
import { evaluateAdxL3ParentV0_2 } from "./d03_adx_l3_acceptance_v0_2.mjs";

export const D03_EVIDENCE_CUTOFF_SPLIT_VERSION="D03_EVIDENCE_CUTOFF_RECEIPT_SPLIT_V0_1";

const isoTime=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));
const hash64=x=>typeof x==="string"&&/^[0-9a-f]{64}$/i.test(x);
const nonempty=x=>typeof x==="string"&&x.length>0;
const uniq=xs=>[...new Set(xs)];
const h=v=>crypto.createHash("sha256").update(JSON.stringify(v)).digest("hex");

function blocked(reasons,extra={}){
  return {
    schemaVersion:D03_EVIDENCE_CUTOFF_SPLIT_VERSION,
    status:"DATA_BLOCKED",
    eligible:false,
    reasons:uniq(reasons),
    ...extra,
  };
}

export function evaluateEvidenceCutoffReceiptSplitV0_1({parent,evidenceCut,continuityReceipt}={}){
  const reasons=[];
  if(!parent||typeof parent!=="object") return blocked(["PARENT_MISSING"]);
  if(!isoTime(parent.knownAt)) reasons.push("PARENT_KNOWN_AT_INVALID");
  if(!isoTime(parent.decisionAt)) reasons.push("PARENT_DECISION_AT_INVALID");
  if(!isoTime(parent.decisionCutoffAt)) reasons.push("PARENT_DECISION_CUTOFF_AT_INVALID");
  if(
    isoTime(parent.decisionCutoffAt)&&isoTime(parent.decisionAt)&&
    Date.parse(parent.decisionCutoffAt)>Date.parse(parent.decisionAt)
  ) reasons.push("PARENT_DECISION_CUTOFF_AFTER_DECISION_AT");
  if(!evidenceCut||typeof evidenceCut!=="object") return blocked(["EVIDENCE_CUT_MISSING"]);
  if(!continuityReceipt||typeof continuityReceipt!=="object") return blocked(["CONTINUITY_RECEIPT_MISSING"]);

  if(!nonempty(evidenceCut.evidenceCutId)) reasons.push("EVIDENCE_CUT_ID_MISSING");
  if(!isoTime(evidenceCut.evidenceCutoffAt)) reasons.push("EVIDENCE_CUTOFF_AT_INVALID");
  if(
    isoTime(evidenceCut.evidenceCutoffAt)&&
    isoTime(parent.knownAt)&&
    Date.parse(evidenceCut.evidenceCutoffAt)>Date.parse(parent.decisionCutoffAt)
  ) reasons.push("EVIDENCE_CUT_AFTER_PARENT");

  if(evidenceCut.scope!=="MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE") reasons.push("EVIDENCE_CUT_SCOPE_INVALID");
  if(evidenceCut.noRevisionGapThroughCut!==true) reasons.push("NO_REVISION_GAP_THROUGH_CUT_UNPROVEN");
  if(evidenceCut.symbolSessionCompletenessCertified!==true) reasons.push("SYMBOL_SESSION_COMPLETENESS_UNPROVEN");
  if(evidenceCut.queryTruncated===true) reasons.push("EVIDENCE_CUT_QUERY_TRUNCATED");
  if(evidenceCut.budgetExceeded===true) reasons.push("EVIDENCE_CUT_BUDGET_EXCEEDED");
  if(Number(evidenceCut.unknownRequiredLaneCount||0)!==0) reasons.push("EVIDENCE_CUT_UNKNOWN_LANES");
  if(Number(evidenceCut.lateDiscoveredPreCutVersionCount||0)!==0) reasons.push("LATE_DISCOVERED_PRE_CUT_VERSION");
  if(!hash64(evidenceCut.sourceCutManifestHash)) reasons.push("SOURCE_CUT_MANIFEST_HASH_INVALID");

  const expected=Array.isArray(evidenceCut.expectedVersionKeys)?[...evidenceCut.expectedVersionKeys].sort():[];
  const observed=Array.isArray(evidenceCut.observedVersionKeys)?[...evidenceCut.observedVersionKeys].sort():[];
  if(expected.length!==new Set(expected).size) reasons.push("EXPECTED_VERSION_KEY_DUPLICATE");
  if(observed.length!==new Set(observed).size) reasons.push("OBSERVED_VERSION_KEY_DUPLICATE");
  if(JSON.stringify(expected)!==JSON.stringify(observed)) reasons.push("VERSION_KEYSET_MISMATCH");

  if(!isoTime(continuityReceipt.receiptCreatedAt)) reasons.push("RECEIPT_CREATED_AT_INVALID");
  if(
    isoTime(continuityReceipt.receiptCreatedAt)&&
    isoTime(evidenceCut.evidenceCutoffAt)&&
    Date.parse(continuityReceipt.receiptCreatedAt)<Date.parse(evidenceCut.evidenceCutoffAt)
  ) reasons.push("RECEIPT_CREATED_BEFORE_EVIDENCE_CUT");

  if(continuityReceipt.evidenceCutId!==evidenceCut.evidenceCutId) reasons.push("RECEIPT_EVIDENCE_CUT_ID_MISMATCH");
  if(continuityReceipt.derivedOnlyFromEvidenceCut!==true) reasons.push("DERIVED_ONLY_FROM_EVIDENCE_CUT_FALSE");
  if(Number(continuityReceipt.postCutSourceFactCount||0)!==0) reasons.push("POST_CUT_SOURCE_FACT_PRESENT");
  if(!hash64(continuityReceipt.evidenceCutManifestHash)) reasons.push("EVIDENCE_CUT_MANIFEST_REF_INVALID");
  if(continuityReceipt.evidenceCutManifestHash!==evidenceCut.sourceCutManifestHash) reasons.push("EVIDENCE_CUT_MANIFEST_REF_MISMATCH");
  if(!hash64(continuityReceipt.transformInputManifestHash)) reasons.push("TRANSFORM_INPUT_MANIFEST_HASH_INVALID");
  if(!hash64(continuityReceipt.sourceFactRefSetHash)) reasons.push("SOURCE_FACT_REF_SET_HASH_INVALID");
  if(Number(continuityReceipt.unboundSourceFactCount||0)!==0) reasons.push("UNBOUND_SOURCE_FACT_PRESENT");

  const bars=Array.isArray(continuityReceipt.bars)?continuityReceipt.bars:[];
  for(const bar of bars){
    if(
      !isoTime(bar?.sourceFetchedAt) ||
      !isoTime(evidenceCut.evidenceCutoffAt) ||
      Date.parse(bar.sourceFetchedAt)>Date.parse(evidenceCut.evidenceCutoffAt)
    ) reasons.push("BAR_SOURCE_AFTER_EVIDENCE_CUT");
  }

  if(reasons.length) return blocked(reasons,{
    evidenceCutId:evidenceCut.evidenceCutId||null,
    receiptCreatedAt:continuityReceipt.receiptCreatedAt||null,
  });

  const timingIdentity={
    evidenceCutId:evidenceCut.evidenceCutId,
    evidenceCutoffAt:new Date(evidenceCut.evidenceCutoffAt).toISOString(),
    parentDecisionCutoffAt:new Date(parent.decisionCutoffAt).toISOString(),
    parentDecisionAt:new Date(parent.decisionAt).toISOString(),
    parentKnownAt:new Date(parent.knownAt).toISOString(),
    receiptCreatedAt:new Date(continuityReceipt.receiptCreatedAt).toISOString(),
    sourceCutManifestHash:evidenceCut.sourceCutManifestHash,
    evidenceCutManifestHash:continuityReceipt.evidenceCutManifestHash,
    transformInputManifestHash:continuityReceipt.transformInputManifestHash,
    sourceFactRefSetHash:continuityReceipt.sourceFactRefSetHash,
  };

  return {
    schemaVersion:D03_EVIDENCE_CUTOFF_SPLIT_VERSION,
    status:"VALID_EVIDENCE_CUTOFF_SPLIT",
    eligible:true,
    reasons:[],
    timingIdentityHash:h(timingIdentity),
    ...timingIdentity,
    receiptCreatedAfterParent:
      Date.parse(continuityReceipt.receiptCreatedAt)>Date.parse(parent.knownAt),
    receiptCreatedAfterDecision:
      Date.parse(continuityReceipt.receiptCreatedAt)>Date.parse(parent.decisionAt),
    parentEligibilityClock:"DECISION_CUTOFF_AT",
    computationClock:"RECEIPT_CREATED_AT",
  };
}

function projectForV02({evidenceCut,continuityReceipt}){
  return {
    ...continuityReceipt,
    capturedAt:evidenceCut.evidenceCutoffAt,
  };
}

export function evaluateCutoffDerivedBollingerL3V0_3(input={}){
  const timing=evaluateEvidenceCutoffReceiptSplitV0_1(input);
  if(!timing.eligible) return {
    schemaVersion:"D03_CUTOFF_DERIVED_BOLLINGER_L3_V0_3",
    status:timing.status,l3EvidenceEligible:false,timing,indicator:null,
  };
  const indicator=evaluateBollingerL3ParentV0_2({
    parent:input.parent,
    continuityReceipt:projectForV02(input),
  });
  return {
    schemaVersion:"D03_CUTOFF_DERIVED_BOLLINGER_L3_V0_3",
    status:indicator.status,
    l3EvidenceEligible:indicator.l3EvidenceEligible===true,
    timing,
    indicator,
    timingSemantics:"PRE_PARENT_EVIDENCE_CUT_POST_PARENT_DERIVATION_V0_1",
  };
}

export function evaluateCutoffDerivedAdxL3V0_3(input={}){
  const timing=evaluateEvidenceCutoffReceiptSplitV0_1(input);
  if(!timing.eligible) return {
    schemaVersion:"D03_CUTOFF_DERIVED_ADX_L3_V0_3",
    status:timing.status,l3EvidenceEligible:false,timing,indicator:null,
  };
  const indicator=evaluateAdxL3ParentV0_2({
    parent:input.parent,
    continuityReceipt:projectForV02(input),
  });
  return {
    schemaVersion:"D03_CUTOFF_DERIVED_ADX_L3_V0_3",
    status:indicator.status,
    l3EvidenceEligible:indicator.l3EvidenceEligible===true,
    timing,
    indicator,
    timingSemantics:"PRE_PARENT_EVIDENCE_CUT_POST_PARENT_DERIVATION_V0_1",
  };
}
