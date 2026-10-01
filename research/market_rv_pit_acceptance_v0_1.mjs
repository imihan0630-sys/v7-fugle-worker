import { deepFreeze } from "../../system2/runtime/factor_snapshot.mjs";
import { sha256Hex } from "../../system2/runtime/decision_archive.mjs";
import { buildMarketRvBundleV0_1, MARKET_RV_FACTOR_IDS } from "../../system2/runtime/market_rv_builder_v0_1.mjs";

export const D04_PIT_ACCEPTANCE_VERSION = "D04_MARKET_RV_PIT_ACCEPTANCE_V0_1_RESEARCH";
const HASH_RE = /^[a-f0-9]{64}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_OFFSET_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function parsedTimestamp(value) {
  return typeof value === "string" && ISO_OFFSET_RE.test(value) && Number.isFinite(Date.parse(value))
    ? Date.parse(value) : null;
}
function validDate(text) {
  if (typeof text !== "string" || !DATE_RE.test(text)) return false;
  const d = new Date(text + "T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === text;
}
function taipeiDate(iso) {
  const n = parsedTimestamp(iso);
  return n === null ? null : new Date(n + 8 * 3600_000).toISOString().slice(0, 10);
}
function sameTimestamp(a, b) {
  const x = parsedTimestamp(a), y = parsedTimestamp(b);
  return x !== null && y !== null && x === y;
}
function chronology({ availableAt, observedAt, capturedAt, decisionTimestamp }, reasons, tag) {
  const a = parsedTimestamp(availableAt), o = parsedTimestamp(observedAt);
  const c = parsedTimestamp(capturedAt), d = parsedTimestamp(decisionTimestamp);
  if ([a, o, c, d].some(x => x === null)) {
    reasons.push(tag + "_INVALID_CLOCK");
    return;
  }
  if (a > o) reasons.push(tag + "_AVAILABLE_AFTER_OBSERVED");
  if (o > c) reasons.push(tag + "_OBSERVED_AFTER_CAPTURED");
  if (a > d) reasons.push(tag + "_AVAILABLE_AFTER_DECISION");
  if (o > d) reasons.push(tag + "_OBSERVED_AFTER_DECISION");
  if (c > d) reasons.push(tag + "_CAPTURED_AFTER_DECISION");
}
function unknownFactor(factorId, input, reasonCodes) {
  return deepFreeze({
    factorId, factorVersion: D04_PIT_ACCEPTANCE_VERSION, scope:"MARKET", scopeKey:"TAIEX",
    marketDate:input.marketDate || null, decisionTimestamp:input.decisionTimestamp || null,
    state:"UNKNOWN", rawValue:null, normalizedValue:null, confidence:null,
    unknownReason:reasonCodes.join("|"),
    qualityFlags:Object.freeze([...reasonCodes]),
    provenance: deepFreeze({sourceId:"A2_TAIEX_CLOSE",pointInTimeEligible:false})
  });
}

// This gate checks self-consistency, not cryptographic proof that a caller's purported
// official receipts actually came from TWSE. External attestation AND physical
// immutable write/readback/replay remain independent downstream requirements.
export async function auditMarketRvPitCandidateV0_1({
  bundleId, marketDate, decisionTimestamp, history,
  availableAt, observedAt, capturedAt,
  sourceReceipt, calendarReceipt,
} = {}) {
  const input={marketDate,decisionTimestamp};
  const reasons=[];
  if(!validDate(marketDate)) reasons.push("INVALID_MARKET_DATE");
  if(taipeiDate(decisionTimestamp)!==marketDate) reasons.push("DECISION_CLOCK_TAIPEI_DATE_MISMATCH");
  chronology({availableAt,observedAt,capturedAt,decisionTimestamp},reasons,"CAPTURE");
  if(!Array.isArray(history)) reasons.push("HISTORY_NOT_ARRAY");
  const rows=Array.isArray(history) ? history.map(x=>({
    date:x?.date ?? x?.marketDate ?? null,
    close: x?.close
  })) : [];
  if(rows.some(x=>!validDate(x.date))) reasons.push("INVALID_HISTORY_DATE");
  if(rows.some(x=>typeof x.close!=="number"||!Number.isFinite(x.close)||x.close<=0))
    reasons.push("INVALID_HISTORY_CLOSE");
  rows.sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  if(new Set(rows.map(x=>x.date)).size!==rows.length) reasons.push("DUPLICATE_HISTORY_DATE");
  if(rows.some(x=>typeof x.date==="string"&&validDate(marketDate)&&x.date>marketDate))
    reasons.push("FUTURE_HISTORY_ROW");
  if(rows.length<21) reasons.push("INSUFFICIENT_21_SESSIONS");
  const last21=rows.slice(-21);
  if(last21.at(-1)?.date!==marketDate) reasons.push("HISTORY_LAST_DATE_MISMATCH");
  const windowHash=await sha256Hex(last21);

  if(!sourceReceipt||typeof sourceReceipt!=="object"){
    reasons.push("MISSING_A2_SOURCE_RECEIPT");
  }else{
    if(sourceReceipt.sourceId!=="A2_TAIEX_CLOSE"||sourceReceipt.marketDate!==marketDate
      ||sourceReceipt.sourceDate!==marketDate||sourceReceipt.state!=="READY")
      reasons.push("A2_SOURCE_RECEIPT_NOT_SAME_DATE_READY");
    if(!sameTimestamp(sourceReceipt.decisionTimestamp,decisionTimestamp))
      reasons.push("A2_RECEIPT_DECISION_CLOCK_MISMATCH");
    if(!sameTimestamp(sourceReceipt.availableAt,availableAt)
      ||!sameTimestamp(sourceReceipt.observedAt,observedAt)
      ||!sameTimestamp(sourceReceipt.capturedAt,capturedAt))
      reasons.push("A2_RECEIPT_CAPTURE_CLOCK_MISMATCH");
    if(sourceReceipt.historyWindowHash!==windowHash)
      reasons.push("A2_RECEIPT_HISTORY_HASH_MISMATCH");
    if(typeof sourceReceipt.receiptRef!=="string"||!sourceReceipt.receiptRef)
      reasons.push("A2_SOURCE_RECEIPT_REF_MISSING");
    if(!HASH_RE.test(String(sourceReceipt.rawPayloadHash||"")))
      reasons.push("A2_RAW_PAYLOAD_HASH_MISSING");
    chronology(sourceReceipt,reasons,"A2_RECEIPT");
  }
  if(!calendarReceipt||typeof calendarReceipt!=="object"){
    reasons.push("MISSING_INDEPENDENT_CALENDAR_RECEIPT");
  }else{
    if(calendarReceipt.sourceId!=="TWSE_FMTQIK_MONTHLY_SESSION_CALENDAR"
      ||calendarReceipt.throughDate!==marketDate
      ||!HASH_RE.test(String(calendarReceipt.rawPayloadHash||"")))
      reasons.push("CALENDAR_SOURCE_PROVENANCE_INCOMPLETE");
    const days=calendarReceipt.officialSessionDates;
    if(!Array.isArray(days)||days.length<21||days.some(x=>!validDate(x))
      ||new Set(days).size!==days.length||days.some((x,i)=>i>0 && x<=days[i-1]))
      reasons.push("OFFICIAL_CALENDAR_SESSION_LIST_INVALID");
    else{
      const expected=days.slice(-21);
      if(expected.some((day,i)=>day!==last21[i]?.date))
        reasons.push("OFFICIAL_21_SESSION_WINDOW_MISMATCH");
      if(await sha256Hex(days)!==calendarReceipt.sessionDatesHash)
        reasons.push("CALENDAR_SESSION_HASH_MISMATCH");
    }
    if(parsedTimestamp(calendarReceipt.firstObservedAt)===null
      ||parsedTimestamp(calendarReceipt.firstObservedAt)>parsedTimestamp(decisionTimestamp))
      reasons.push("CALENDAR_RECEIPT_NOT_OBSERVED_BY_DECISION");
    if(!calendarReceipt.receiptRef) reasons.push("CALENDAR_RECEIPT_REF_MISSING");
  }
  const unique=Object.freeze([...new Set(reasons)]);
  const passed=unique.length===0;
  const builder=passed?await buildMarketRvBundleV0_1({
    bundleId,marketDate,decisionTimestamp,observedAt,availableAt,capturedAt,
    sourceDate:sourceReceipt.sourceDate,
    sourceReceiptRef:sourceReceipt.receiptRef,
    sourceReceiptState:sourceReceipt.state,
    sourcePointInTimeEligible:true,history:rows
  }):null;
  const factorObservations=passed?builder.factorObservations:
    Object.freeze(MARKET_RV_FACTOR_IDS.map(x=>unknownFactor(x,input,unique)));
  const base={
    version:D04_PIT_ACCEPTANCE_VERSION,
    marketDate:marketDate||null,decisionTimestamp:decisionTimestamp||null,
    windowHash,sourceReceiptRef:sourceReceipt?.receiptRef||null,
    calendarReceiptRef:calendarReceipt?.receiptRef||null,
    structuralState:passed?"STRUCTURAL_PASS":"UNKNOWN",
    blockerCodes:unique,
    factorObservations,
    builderBundleHash:builder?.bundleHash||null,
    externalRawSourceAttestation:"REQUIRED_NOT_PROVEN_BY_THIS_PURE_FUNCTION",
    immutableWriteReadbackReplay:"NOT_PERFORMED",
    runFingerprintLinkage:"NOT_PERFORMED",
    promotionGradeProspectiveDateCount:0,
    formalDecisionImpact:false,
    persistencePerformed:false
  };
  return deepFreeze({...base,acceptanceHash:await sha256Hex(base)});
}
