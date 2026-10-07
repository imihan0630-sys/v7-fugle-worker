const ALLOWED_CA = new Set(["CLEAN","BRIDGE_VERIFIED","RESET_CLEAN_GE20"]);

export function deriveSameSlotBaselineCleanV01(input={}) {
  const reasons=[];
  const marketDate=typeof input.marketDate==="string" ? input.marketDate : null;
  const baselineAsOfDate=typeof input.baselineAsOfDate==="string" ? input.baselineAsOfDate : null;
  const expected=typeof input.expectedLatestComparableSlotDate==="string" ? input.expectedLatestComparableSlotDate : null;
  const n=(typeof input.slotHistoryCount==="number" && Number.isFinite(input.slotHistoryCount)) ? input.slotHistoryCount : null;
  const rvol=(typeof input.pvSlotRvol20==="number" && Number.isFinite(input.pvSlotRvol20)) ? input.pvSlotRvol20 : null;
  const ca=input.corporateActionContinuityState ?? null;
  const slotValidity=input.sameSlotHistoryValidityState ?? null;

  if (n === null || n < 20) reasons.push("SLOT_HISTORY_LT_20");
  if (rvol === null) reasons.push("RVOL_NOT_FINITE");
  if (marketDate && baselineAsOfDate && baselineAsOfDate >= marketDate) reasons.push("BASELINE_NOT_STRICTLY_PRIOR");
  if (baselineAsOfDate && expected && baselineAsOfDate !== expected) reasons.push("BASELINE_FRESHNESS_MISMATCH");
  if (ca === "FAIL") reasons.push("CORPORATE_ACTION_CONTINUITY_FAIL");
  if (slotValidity === "FAIL") reasons.push("SAME_SLOT_HISTORY_VALIDITY_FAIL");
  if (reasons.length) return {state:"FAIL",clean:false,reasons};

  const unknown=[];
  if (!marketDate) unknown.push("MARKET_DATE_UNKNOWN");
  if (!baselineAsOfDate) unknown.push("BASELINE_AS_OF_DATE_UNKNOWN");
  if (!expected) unknown.push("EXPECTED_LATEST_COMPARABLE_SLOT_DATE_UNKNOWN");
  if (!ALLOWED_CA.has(ca)) unknown.push("CORPORATE_ACTION_CONTINUITY_UNKNOWN");
  if (slotValidity !== "PASS") unknown.push("SAME_SLOT_HISTORY_VALIDITY_UNKNOWN");
  if (unknown.length) return {state:"UNKNOWN",clean:null,reasons:unknown};

  return {state:"PASS",clean:true,reasons:[]};
}
