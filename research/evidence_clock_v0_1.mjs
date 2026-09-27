import { normalizeDateOnly, normalizeInstant } from "./canonical_receipt_hash_v0_1.mjs";

export const EVIDENCE_AS_OF_KINDS = Object.freeze([
  "SESSION_DATE","INSTANT","CALENDAR_MONTH","CALENDAR_QUARTER"
]);

export const AVAILABLE_AT_PRECISIONS = Object.freeze([
  "INSTANT","DATE_ONLY","UNKNOWN"
]);

export function normalizeEvidenceAsOf(kind,value) {
  const k=String(kind??"").trim().toUpperCase();
  if (k==="SESSION_DATE") return {asOfKind:k,asOfKey:normalizeDateOnly(value,"asOf")};
  if (k==="INSTANT") return {asOfKind:k,asOfKey:normalizeInstant(value,"asOf")};
  const text=String(value??"").trim();
  if (k==="CALENDAR_MONTH") {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(text)) throw new Error("INVALID_CALENDAR_MONTH");
    return {asOfKind:k,asOfKey:text};
  }
  if (k==="CALENDAR_QUARTER") {
    if (!/^\d{4}-Q[1-4]$/.test(text)) throw new Error("INVALID_CALENDAR_QUARTER");
    return {asOfKind:k,asOfKey:text};
  }
  throw new Error("UNSUPPORTED_AS_OF_KIND");
}

export function normalizeAvailableAt(precision,value) {
  const p=String(precision??"").trim().toUpperCase();
  if (p==="INSTANT") return {availableAtPrecision:p,availableAt:normalizeInstant(value,"availableAt")};
  if (p==="DATE_ONLY") return {availableAtPrecision:p,availableAt:normalizeDateOnly(value,"availableAt")};
  if (p==="UNKNOWN") {
    if (value!==null && value!==undefined && String(value)!=="") throw new Error("UNKNOWN_PRECISION_REQUIRES_NULL_AVAILABLE_AT");
    return {availableAtPrecision:p,availableAt:null};
  }
  throw new Error("UNSUPPORTED_AVAILABLE_AT_PRECISION");
}

function utcDateInOffset(instant,offsetMinutes) {
  const ms=Date.parse(normalizeInstant(instant,"decisionCutoffAt"));
  const shifted=new Date(ms + Number(offsetMinutes)*60000);
  return shifted.toISOString().slice(0,10);
}

export function assessPointInTimeAvailability({
  decisionCutoffAt,
  decisionTimezoneOffsetMinutes=480,
  availableAtPrecision,
  availableAt,
}) {
  const normalized=normalizeAvailableAt(availableAtPrecision,availableAt);
  if (normalized.availableAtPrecision==="UNKNOWN") return {state:"UNKNOWN",reason:"AVAILABILITY_TIME_UNKNOWN"};

  const cutoff=normalizeInstant(decisionCutoffAt,"decisionCutoffAt");
  if (normalized.availableAtPrecision==="INSTANT") {
    const sourceMs=Date.parse(normalized.availableAt);
    const cutoffMs=Date.parse(cutoff);
    return sourceMs<=cutoffMs
      ? {state:"VALID",reason:"AVAILABLE_BY_CUTOFF"}
      : {state:"BLOCKED",reason:"AVAILABLE_AFTER_CUTOFF"};
  }

  const decisionLocalDate=utcDateInOffset(cutoff,decisionTimezoneOffsetMinutes);
  if (normalized.availableAt<decisionLocalDate) return {state:"VALID",reason:"AVAILABLE_ON_PRIOR_DATE"};
  if (normalized.availableAt>decisionLocalDate) return {state:"BLOCKED",reason:"AVAILABLE_ON_LATER_DATE"};
  return {state:"UNKNOWN",reason:"SAME_DAY_DATE_ONLY_AMBIGUOUS"};
}
