export function deriveBaselineRefreshDecisionV01(input={}) {
  const validSessions=(typeof input.validSessions==="number"&&Number.isInteger(input.validSessions)&&input.validSessions>=0)?input.validSessions:null;
  const baselineAsOfDate=typeof input.baselineAsOfDate==="string"?input.baselineAsOfDate:null;
  const expected=typeof input.expectedLatestComparableSlotDate==="string"?input.expectedLatestComparableSlotDate:null;
  const schemaMatches=input.schemaMatches===true;
  const slotValidity=input.sameSlotHistoryValidityState??null;

  if(!schemaMatches) return {state:"BOOTSTRAP_REQUIRED",reason:"SCHEMA_MISMATCH_OR_UNKNOWN",maySkipHistoricalRefresh:false};
  if(validSessions===null || validSessions<20) return {state:"BOOTSTRAP_REQUIRED",reason:"MIN_HISTORY_NOT_MET",maySkipHistoricalRefresh:false};
  if(!expected) return {state:"UNKNOWN_BLOCK",reason:"EXPECTED_LATEST_COMPARABLE_SLOT_DATE_UNKNOWN",maySkipHistoricalRefresh:false};
  if(!baselineAsOfDate) return {state:"REFRESH_REQUIRED",reason:"BASELINE_AS_OF_DATE_MISSING",maySkipHistoricalRefresh:false};
  if(baselineAsOfDate<expected) return {state:"REFRESH_REQUIRED",reason:"BASELINE_STALE_DESPITE_MIN_HISTORY",maySkipHistoricalRefresh:false};
  if(baselineAsOfDate>expected) return {state:"IDENTITY_CONFLICT",reason:"BASELINE_AHEAD_OF_EXPECTED_COMPARABLE_SLOT",maySkipHistoricalRefresh:false};
  if(slotValidity==="FAIL") return {state:"REFRESH_REQUIRED",reason:"EXACT_SLOT_HISTORY_INVALID",maySkipHistoricalRefresh:false};
  if(slotValidity!=="PASS") return {state:"UNKNOWN_BLOCK",reason:"EXACT_SLOT_HISTORY_VALIDITY_UNKNOWN",maySkipHistoricalRefresh:false};
  return {state:"FRESH_READY",reason:"EXACT_SLOT_BASELINE_CURRENT",maySkipHistoricalRefresh:true};
}
