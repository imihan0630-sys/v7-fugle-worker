import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import {
  SHORT_MOMENTUM_CONTRACT_V0_1, SWING_GROWTH_CONTRACT_V0_1,
} from "./strategy_contracts_v0_1.mjs";

export const D06_A1_EVIDENCE_POLICY_VERSION = "S2_D06_A1_EVIDENCE_POLICY_V0_1_RESEARCH";

const A1_FACTOR_FAMILIES = Object.freeze({
  TECHNICAL_STRUCTURE: Object.freeze(["TECH.TREND", "TECH.STRUCTURE"]),
  PRICE_VOLUME: Object.freeze(["PV.RELATIVE_VOLUME", "PV.ACCEPTANCE", "PV.RESPONSE"]),
  // RISK.REWARD_RISK has not been separately attested by the A1 primitive
  // bundle. It MUST NOT be inferred from a price chart or silently scored 0.
  RISK_FRICTION: Object.freeze(["RISK.LIQUIDITY", "RISK.EXTENSION", "RISK.REWARD_RISK"]),
});
const HAS_SHA = /^[0-9a-f]{64}$/;

function known(value) {
  return typeof value === "string" && value.length > 0;
}
function time(x) {
  if (typeof x !== "string"
      || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(x)) return null;
  const t = Date.parse(x);
  return Number.isFinite(t) ? t : null;
}
function assertIdentity(ctx) {
  const {contract,shadowSpec,marketDate,decisionTimestamp,symbol,factorBundle}=ctx;
  if (![SHORT_MOMENTUM_CONTRACT_V0_1,SWING_GROWTH_CONTRACT_V0_1].some(
    c=>c.strategyId===contract?.strategyId&&c.strategyVersion===contract?.strategyVersion
  )) throw new Error("D06_UNREGISTERED_STRATEGY");
  if (shadowSpec?.strategyId!==contract.strategyId
      ||shadowSpec.strategyVersion!==contract.strategyVersion
      ||shadowSpec.selectionLayerEnabled!==false) throw new Error("D06_SHADOW_CONTRACT_MISMATCH");
  if (!known(symbol)||!known(marketDate)||time(decisionTimestamp)===null) {
    throw new Error("D06_INVALID_DECISION_IDENTITY");
  }
  if (!factorBundle||factorBundle.symbol!==symbol||factorBundle.marketDate!==marketDate
      ||factorBundle.decisionTimestamp!==decisionTimestamp) {
    throw new Error("D06_A1_FACTOR_BUNDLE_IDENTITY_MISMATCH");
  }
}
function unknown(reason) {
  return deepFreeze({
    observationState:"UNKNOWN",thesisState:"INDETERMINATE",
    reasons:Object.freeze([reason]),warnings:Object.freeze([]),
  });
}
function deriveFamily(family, contract, factors, sourceIssues) {
  if (sourceIssues.length) return unknown("D06_A1_SOURCE_NOT_PIT_OR_CONTINUITY_VERIFIED");
  const ids=A1_FACTOR_FAMILIES[family];
  if (!ids) return unknown("D06_NON_A1_FAMILY_UNATTESTED");
  const missing=ids.filter(id=>factors.get(id)?.state!=="KNOWN");
  if (missing.length) return deepFreeze({
    observationState:"UNKNOWN",thesisState:"INDETERMINATE",
    reasons:Object.freeze(missing.map(id=>"D06_REQUIRED_FACTOR_UNATTESTED:"+id)),
    warnings:Object.freeze([]),
  });
  // KNOWN means observations are available, not positive evidence about
  // price direction, a valid entry setup, alpha or price/volume confluence.
  return deepFreeze({
    observationState:"KNOWN",thesisState:"INDETERMINATE",
    reasons:Object.freeze(["D06_A1_DESCRIPTIVE_FACTORS_ONLY_NO_ALPHA_VERDICT"]),
    warnings:Object.freeze([]),
  });
}
function validateFactor(o,ctx,bundle) {
  if (!o||!known(o.factorId)||!["KNOWN","UNKNOWN","STALE","INVALID","NOT_APPLICABLE"].includes(o.state)) {
    throw new Error("D06_FACTOR_OBSERVATION_INVALID");
  }
  if (o.scopeKey!==ctx.symbol || o.marketDate!==ctx.marketDate
      || o.decisionTimestamp!==ctx.decisionTimestamp) throw new Error("D06_FACTOR_IDENTITY_MISMATCH");
  if (o.state==="KNOWN") {
    const p=o.provenance;
    if (!p || p.sourceId!==bundle.sourceId || p.sourceDate!==ctx.marketDate
        || p.pointInTimeEligible!==true
        || p.payloadHash!==bundle.sourcePayloadHash || p.availableAt!==bundle.availableAt
        || time(p.availableAt)===null || time(p.availableAt)>time(ctx.decisionTimestamp)) {
      throw new Error("D06_FACTOR_PROVENANCE_NOT_BOUND");
    }
  }
}
export async function evaluateD06LimitedShadowEvidenceV0_1(ctx={}) {
  assertIdentity(ctx);
  const {contract, factorBundle:bundle}=ctx;
  const claimed=bundle.bundleHash;
  if (!HAS_SHA.test(claimed||"")) throw new Error("D06_A1_BUNDLE_HASH_MISSING");
  const rest={...bundle};
  delete rest.bundleHash;
  if(await sha256Hex(rest)!==claimed) throw new Error("D06_A1_BUNDLE_HASH_MISMATCH");
  if(!Array.isArray(bundle.factorObservations)) throw new Error("D06_A1_FACTORS_MISSING");
  const factors=new Map();
  for(const obs of bundle.factorObservations) {
    validateFactor(obs,ctx,bundle);
    if(factors.has(obs.factorId)) throw new Error("D06_DUPLICATE_FACTOR_ID:"+obs.factorId);
    factors.set(obs.factorId,obs);
  }
  const sourceIssues=[];
  if(bundle.pointInTimeEligible!==true||time(bundle.availableAt)===null
      ||time(bundle.availableAt)>time(ctx.decisionTimestamp)
      ||time(bundle.observedAt)===null||time(bundle.observedAt)<time(bundle.availableAt)
      ||time(bundle.observedAt)>time(ctx.decisionTimestamp)) {
    sourceIssues.push("D06_SOURCE_PIT_UNPROVEN");
  }
  if(bundle.continuityEligible!==true || !["CLEAR_NO_ACTION","ADJUSTED_CONTINUITY"].includes(bundle.continuityState)) {
    sourceIssues.push("D06_OFFICIAL_PRICE_CONTINUITY_NOT_VERIFIED");
  }
  if(bundle.lastBarDate!==ctx.marketDate) sourceIssues.push("D06_TARGET_BAR_NOT_PROVEN");
  const familyAssessments={};
  for(const family of contract.evidenceFamilies) {
    familyAssessments[family.family] = deriveFamily(
      family.family,contract,factors,sourceIssues
    );
  }
  const missingRequired=contract.evidenceFamilies.filter(x=>x.unknownBlocksEligibility===true
    && familyAssessments[x.family]?.observationState!=="KNOWN").map(x=>x.family);
  const receipt={
    schemaVersion:D06_A1_EVIDENCE_POLICY_VERSION,
    strategyId:contract.strategyId,strategyVersion:contract.strategyVersion,
    symbol:ctx.symbol,marketDate:ctx.marketDate,decisionTimestamp:ctx.decisionTimestamp,
    sourceBundleHash:claimed,sourceIssues:Object.freeze(sourceIssues),
    familyAssessments:deepFreeze(familyAssessments),
    missingRequiredFamilies:Object.freeze(missingRequired),
    assessorState:missingRequired.length?"INCOMPLETE":"DESCRIPTIVE_ONLY_NO_ENTRY_SIGNAL",
    entryReadiness:missingRequired.length?"BLOCKED":"WATCH",
    selectionLayerEnabled:false,score:null,rank:null,alphaValidated:false,
    pitCertified:false,physicalSourceReadbackVerified:false,readyForLiveSelection:false,
  };
  return deepFreeze({...receipt,policyReceiptHash:await sha256Hex(receipt)});
}

// Optional callback adapter for existing daily_shadow_orchestrator_v0_1.
// This does not activate scheduled scanning or produce BUY_ELIGIBLE signals.
export function createD06LimitedShadowAssessorV0_1() {
  return async function assessSymbol(input) {
    const receipt=await evaluateD06LimitedShadowEvidenceV0_1(input);
    return deepFreeze({
      familyAssessments:receipt.familyAssessments,
      entryReadiness:receipt.entryReadiness,
      reasons:["D06_RESEARCH_ONLY_POLICY:"+receipt.policyReceiptHash],
      assessmentWarnings:[...receipt.sourceIssues,...receipt.missingRequiredFamilies.map(x=>"REQUIRED_FAMILY_UNKNOWN:"+x)],
      importantRejected:false,
      entryPlan:null,
      assessorPolicyReceipt:receipt,
    });
  };
}
