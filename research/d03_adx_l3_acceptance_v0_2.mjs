import crypto from "node:crypto";
import { computeADX, TECHNICAL_INDICATOR_FORMULA_VERSION } from "./technical_indicator_core_v0_1.mjs";

export const D03_ADX_L3_ACCEPTANCE_VERSION = "D03_ADX_L3_ACCEPTANCE_V0_2";
export const D03_ADX_FORMULA_VERSION = "WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1";
export const D03_ADX_STATE_CONSTRUCTION_VERSION = "ADX14_FULL_REPLAY_ACCEPTANCE_V0_2";

const isoDay = x => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x);
const isoTime = x => typeof x === "string" && Number.isFinite(Date.parse(x));
const finite = x => Number.isFinite(Number(x));
const hash64 = x => typeof x==="string" && /^[0-9a-f]{64}$/i.test(x);
const nonempty = x => typeof x==="string" && x.length>0;
const uniq = xs => [...new Set(xs)];
const key = p => [p.scanDate,p.captureGeneration,p.symbol,p.parentSnapshotHash].join("|");

function hash(value){
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function blocked(parent,status,reasons,extra={}){
  return {
    schemaVersion:D03_ADX_L3_ACCEPTANCE_VERSION,
    parentKey:parent?key(parent):null,
    symbol:parent?.symbol||null,
    status,
    reasons:uniq(reasons),
    l3EvidenceEligible:false,
    formulaVersion:D03_ADX_FORMULA_VERSION,
    stateConstructionVersion:D03_ADX_STATE_CONSTRUCTION_VERSION,
    ...extra,
  };
}

export function evaluateAdxL3ParentV0_2({parent,continuityReceipt}={}){
  const reasons=[];
  if(!parent || typeof parent!=="object") return blocked(null,"UNKNOWN",["PARENT_MISSING"]);
  if(!isoDay(parent.scanDate)||!parent.captureGeneration||!parent.symbol||!hash64(parent.parentSnapshotHash)||!isoTime(parent.knownAt)){
    return blocked(parent,"DATA_BLOCKED",["PARENT_IDENTITY_INVALID"]);
  }
  if(!continuityReceipt || typeof continuityReceipt!=="object"){
    return blocked(parent,"UNKNOWN",["CONTINUITY_RECEIPT_MISSING"]);
  }

  if(continuityReceipt.symbol!==parent.symbol) reasons.push("SYMBOL_MISMATCH");
  if(continuityReceipt.status!=="VALID" && continuityReceipt.status!=="VALID_BUT_CONSTRAINED") reasons.push("CONTINUITY_NOT_VALID");
  if(continuityReceipt.continuitySpace!=="TECHNICAL_CONTINUITY") reasons.push("WRONG_CONTINUITY_SPACE");
  if(continuityReceipt.formulaVersion!==D03_ADX_FORMULA_VERSION) reasons.push("FORMULA_VERSION_MISMATCH");
  if(!nonempty(continuityReceipt.continuityReceiptId)) reasons.push("CONTINUITY_RECEIPT_ID_MISSING");
  if(!isoTime(continuityReceipt.capturedAt) || Date.parse(continuityReceipt.capturedAt)>Date.parse(parent.knownAt)){
    reasons.push("CONTINUITY_CAPTURE_AFTER_PARENT");
  }

  // Upstream continuity identity must be independently addressable; nonempty labels alone are insufficient.
  if(!nonempty(continuityReceipt.sourceFamilyVersion)) reasons.push("SOURCE_FAMILY_VERSION_MISSING");
  if(!hash64(continuityReceipt.sourceHistoryHash)) reasons.push("SOURCE_HISTORY_HASH_INVALID");
  if(!nonempty(continuityReceipt.rawHistoryAdmissionReceiptId)) reasons.push("RAW_HISTORY_ADMISSION_RECEIPT_MISSING");
  if(!nonempty(continuityReceipt.symbolSessionContractVersion)) reasons.push("SYMBOL_SESSION_CONTRACT_VERSION_MISSING");
  if(!nonempty(continuityReceipt.sessionCalendarVersion)) reasons.push("SESSION_CALENDAR_VERSION_MISSING");
  if(!nonempty(continuityReceipt.continuityEngineVersion)) reasons.push("CONTINUITY_ENGINE_VERSION_MISSING");
  if(!nonempty(continuityReceipt.corporateActionRegistryVersion)) reasons.push("CORPORATE_ACTION_REGISTRY_VERSION_MISSING");
  if(!hash64(continuityReceipt.continuityTransformHash)) reasons.push("CONTINUITY_TRANSFORM_HASH_INVALID");
  if(!nonempty(continuityReceipt.receiptVersion)) reasons.push("CONTINUITY_RECEIPT_VERSION_MISSING");

  if(continuityReceipt.stateConstructionMode!=="FULL_REPLAY"){
    reasons.push(
      continuityReceipt.stateConstructionMode==="TRUSTED_PRIOR_STATE"
        ? "TRUSTED_PRIOR_STATE_REQUIRES_SEPARATE_CERTIFIER"
        : "STATE_CONSTRUCTION_MODE_NOT_FULL_REPLAY"
    );
  }
  if(continuityReceipt.stateConstructionVersion!==D03_ADX_STATE_CONSTRUCTION_VERSION) reasons.push("STATE_CONSTRUCTION_VERSION_MISMATCH");
  if(!hash64(continuityReceipt.stateLineageId)) reasons.push("STATE_LINEAGE_ID_INVALID");
  if(continuityReceipt.replayCertificationState!=="REPLAY_EXACT") reasons.push("REPLAY_NOT_CERTIFIED_EXACT");

  if(!isoDay(continuityReceipt.cleanHistoryStartDate)) reasons.push("CLEAN_HISTORY_START_INVALID");
  if(!isoDay(continuityReceipt.initializationAnchorDate)) reasons.push("INITIALIZATION_ANCHOR_INVALID");
  if(continuityReceipt.anchorCertificationState!=="CANONICAL_LINEAGE_ANCHOR_CERTIFIED") reasons.push("CANONICAL_ANCHOR_NOT_CERTIFIED");
  if(
    isoDay(continuityReceipt.cleanHistoryStartDate) &&
    isoDay(continuityReceipt.initializationAnchorDate) &&
    continuityReceipt.cleanHistoryStartDate!==continuityReceipt.initializationAnchorDate
  ){
    reasons.push("FULL_REPLAY_ANCHOR_NOT_CLEAN_HISTORY_START");
  }

  const expected=Array.isArray(continuityReceipt.expectedEligibleSymbolSessions)?continuityReceipt.expectedEligibleSymbolSessions:[];
  const bars=Array.isArray(continuityReceipt.bars)?continuityReceipt.bars:[];
  if(expected.length<29) reasons.push("EXPECTED_REPLAY_SESSION_COUNT_LT_29");
  if(uniq(expected).length!==expected.length) reasons.push("EXPECTED_SESSION_DUPLICATE");
  if(expected.some(x=>!isoDay(x))) reasons.push("EXPECTED_SESSION_DATE_INVALID");
  if(bars.length!==expected.length) reasons.push("BAR_COUNT_EXPECTED_COUNT_MISMATCH");
  if(Number(continuityReceipt.eligibleBarsFromAnchorToAsOf)!==bars.length) reasons.push("ELIGIBLE_BAR_COUNT_FROM_ANCHOR_MISMATCH");

  const barDates=bars.map(x=>x?.date);
  if(uniq(barDates).length!==barDates.length) reasons.push("BAR_DATE_DUPLICATE");
  if(expected.length && JSON.stringify([...barDates].sort())!==JSON.stringify([...expected].sort())){
    reasons.push("BAR_EXPECTED_DATESET_MISMATCH");
  }

  for(const b of bars){
    if(!isoDay(b?.date)) reasons.push("BAR_DATE_INVALID");
    if(!finite(b?.high)||!finite(b?.low)||!finite(b?.close)) reasons.push("BAR_HLC_INVALID");
    if(finite(b?.high)&&finite(b?.low)&&Number(b.high)<Number(b.low)) reasons.push("BAR_HIGH_BELOW_LOW");
    if(finite(b?.close)&&finite(b?.high)&&Number(b.close)>Number(b.high)) reasons.push("BAR_CLOSE_ABOVE_HIGH");
    if(finite(b?.close)&&finite(b?.low)&&Number(b.close)<Number(b.low)) reasons.push("BAR_CLOSE_BELOW_LOW");
    if(!nonempty(b?.observedRawBarIdentity)) reasons.push("OBSERVED_RAW_BAR_IDENTITY_MISSING");
    if(!hash64(b?.sourceBarHash)) reasons.push("SOURCE_BAR_HASH_INVALID");
    if(b?.symbolSessionVerified!==true) reasons.push("SYMBOL_SESSION_UNVERIFIED");
    if(b?.technicalContinuity!==true) reasons.push("TECHNICAL_CONTINUITY_FALSE");
    if(b?.corporateActionContinuityResolved!==true) reasons.push("CORPORATE_ACTION_UNRESOLVED");
    if(!isoTime(b?.sourceFetchedAt) || Date.parse(b.sourceFetchedAt)>Date.parse(parent.knownAt)) reasons.push("BAR_SOURCE_AFTER_PARENT");
  }
  if(Number(continuityReceipt.unresolvedMissingSessions||0)!==0) reasons.push("UNRESOLVED_MISSING_SESSIONS");
  if(Number(continuityReceipt.unresolvedRelevantEvents||0)!==0) reasons.push("UNRESOLVED_RELEVANT_EVENTS");
  if(Number(continuityReceipt.pseudoBarsRejected||0)<0) reasons.push("PSEUDO_BAR_COUNT_INVALID");

  if(reasons.length){
    return blocked(parent,"DATA_BLOCKED",reasons,{
      continuityReceiptId:continuityReceipt.continuityReceiptId||null,
      stateLineageId:continuityReceipt.stateLineageId||null,
    });
  }

  const ordered=[...bars].sort((a,b)=>a.date.localeCompare(b.date));
  if(ordered[0].date!==continuityReceipt.initializationAnchorDate){
    return blocked(parent,"DATA_BLOCKED",["ANCHOR_NOT_FIRST_REPLAY_SESSION"],{
      continuityReceiptId:continuityReceipt.continuityReceiptId,
      stateLineageId:continuityReceipt.stateLineageId,
    });
  }

  const formulaBars=ordered.map(x=>({
    date:x.date,
    high:Number(x.high),
    low:Number(x.low),
    close:Number(x.close),
  }));
  const full=computeADX(formulaBars,{period:14});
  const last=full.values.at(-1);
  if(!full.valid || !last?.ready || !finite(last.adx)){
    return blocked(parent,"DATA_BLOCKED",["ADX_NOT_READY_AFTER_FULL_REPLAY"],{
      continuityReceiptId:continuityReceipt.continuityReceiptId,
      stateLineageId:continuityReceipt.stateLineageId,
    });
  }

  const prefix=computeADX(formulaBars.slice(0,-1),{period:14});
  const prefixLast=prefix.values.at(-1);
  const fullPenultimate=full.values.at(-2);
  const names=["trSmoothed","plusDMSmoothed","minusDMSmoothed","plusDI","minusDI","diSpread","dx","adx"];
  for(const name of names){
    const a=prefixLast?.[name], b=fullPenultimate?.[name];
    if(a===null && b===null) continue;
    if(!finite(a)||!finite(b)||Math.abs(Number(a)-Number(b))>1e-12){
      return blocked(parent,"DATA_BLOCKED",["PREFIX_REPLAY_MISMATCH"],{
        continuityReceiptId:continuityReceipt.continuityReceiptId,
        stateLineageId:continuityReceipt.stateLineageId,
        mismatchField:name,
      });
    }
  }

  const canonicalState={
    tr14Smoothed:last.trSmoothed,
    plusDM14Smoothed:last.plusDMSmoothed,
    minusDM14Smoothed:last.minusDMSmoothed,
    plusDI14:last.plusDI,
    minusDI14:last.minusDI,
    diSpread:last.diSpread,
    dx14:last.dx,
    adx14:last.adx,
  };
  if(Object.values(canonicalState).some(x=>x!==null&&!finite(x))){
    return blocked(parent,"DATA_BLOCKED",["CANONICAL_STATE_NONFINITE"],{
      continuityReceiptId:continuityReceipt.continuityReceiptId,
      stateLineageId:continuityReceipt.stateLineageId,
    });
  }

  const replayInputHash=hash({
    formulaVersion:D03_ADX_FORMULA_VERSION,
    stateConstructionVersion:D03_ADX_STATE_CONSTRUCTION_VERSION,
    stateLineageId:continuityReceipt.stateLineageId,
    rawHistoryAdmissionReceiptId:continuityReceipt.rawHistoryAdmissionReceiptId,
    sourceHistoryHash:continuityReceipt.sourceHistoryHash,
    continuityTransformHash:continuityReceipt.continuityTransformHash,
    continuityReceiptId:continuityReceipt.continuityReceiptId,
    bars:ordered.map(x=>({
      date:x.date,
      high:Number(x.high),
      low:Number(x.low),
      close:Number(x.close),
      observedRawBarIdentity:x.observedRawBarIdentity,
      sourceBarHash:x.sourceBarHash,
    })),
  });
  const canonicalStateHash=hash(canonicalState);
  if(continuityReceipt.expectedCanonicalStateHash && continuityReceipt.expectedCanonicalStateHash!==canonicalStateHash){
    return blocked(parent,"DATA_BLOCKED",["EXPECTED_CANONICAL_STATE_HASH_MISMATCH"],{
      continuityReceiptId:continuityReceipt.continuityReceiptId,
      stateLineageId:continuityReceipt.stateLineageId,
      replayInputHash,
      canonicalStateHash,
    });
  }

  const constrained=continuityReceipt.status==="VALID_BUT_CONSTRAINED" || ordered.some(x=>x.priceLimitConstrained===true);
  return {
    schemaVersion:D03_ADX_L3_ACCEPTANCE_VERSION,
    parentKey:key(parent),
    symbol:parent.symbol,
    scanDate:parent.scanDate,
    captureGeneration:parent.captureGeneration,
    parentSnapshotHash:parent.parentSnapshotHash,
    parentKnownAt:parent.knownAt,
    continuityReceiptId:continuityReceipt.continuityReceiptId,
    rawHistoryAdmissionReceiptId:continuityReceipt.rawHistoryAdmissionReceiptId,
    formulaVersion:D03_ADX_FORMULA_VERSION,
    stateConstructionMode:"FULL_REPLAY",
    stateConstructionVersion:D03_ADX_STATE_CONSTRUCTION_VERSION,
    stateLineageId:continuityReceipt.stateLineageId,
    replayCertificationState:"REPLAY_EXACT",
    anchorCertificationState:"CANONICAL_LINEAGE_ANCHOR_CERTIFIED",
    status:constrained?"VALID_BUT_CONSTRAINED":"VALID",
    reasons:[],
    l3EvidenceEligible:true,
    ordinaryInterpretationEligible:!constrained,
    replaySessionCount:ordered.length,
    initializationAnchorDate:continuityReceipt.initializationAnchorDate,
    cleanHistoryStartDate:continuityReceipt.cleanHistoryStartDate,
    replayInputHash,
    canonicalStateHash,
    canonicalState,
  };
}

export function reconcileAdxL3RunV0_2({expectedParents=[],attempts=[]}={}){
  const expectedKeys=expectedParents.map(key);
  const attemptKeys=attempts.map(x=>x.parentKey);
  const duplicateAttemptKeys=attemptKeys.filter((x,i,a)=>a.indexOf(x)!==i);
  const missingKeys=expectedKeys.filter(x=>!attemptKeys.includes(x));
  const orphanKeys=attemptKeys.filter(x=>!expectedKeys.includes(x));
  const complete=expectedKeys.length>0 && duplicateAttemptKeys.length===0 && missingKeys.length===0 && orphanKeys.length===0 && attempts.length===expectedKeys.length;
  return {
    schemaVersion:"D03_ADX_L3_RUN_RECEIPT_V0_2",
    status:complete?"COMPLETE":"INCOMPLETE",
    expectedAttemptCount:expectedKeys.length,
    persistedAttemptCount:attempts.length,
    missingCount:missingKeys.length,
    orphanCount:orphanKeys.length,
    duplicateCount:duplicateAttemptKeys.length,
    countsByStatus:Object.fromEntries(["VALID","VALID_BUT_CONSTRAINED","DATA_BLOCKED","UNKNOWN"].map(s=>[s,attempts.filter(x=>x.status===s).length])),
    parentKeysetHash:hash([...expectedKeys].sort()),
    completeForDescriptiveCoverage:complete,
  };
}

if(TECHNICAL_INDICATOR_FORMULA_VERSION.adx!==D03_ADX_FORMULA_VERSION){
  throw new Error("D03_ADX_FORMULA_VERSION_DRIFT");
}
