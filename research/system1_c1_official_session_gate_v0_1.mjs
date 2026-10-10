// System 1 C1 prospective evidence schedule: source-authenticated session
// eligibility classification only. It does NOT inspect/alter Formal selection,
// issue business scans, approve reserves, or interpret missing C1 as zero picks.
import {previousTaipeiDate} from "./system1_c1_readiness_v0_1.mjs";

function validDate(d) {
  if(typeof d!=="string" || !/^\d{4}-\d{2}-\d{2}$/.test(d))return false;
  const t=Date.parse(d+"T00:00:00Z");
  return Number.isFinite(t) && new Date(t).toISOString().slice(0,10)===d;
}
export function decideSystem1C1OfficialSessionV0_1({
  now=new Date(),requestedDate="",calendarDate="",isTradingDay
}={}) {
  const expectedPrior=previousTaipeiDate(now);
  const date=String(requestedDate||expectedPrior).trim();
  if(!validDate(date))throw new Error("C1_OFFICIAL_SESSION_INVALID_DATE");
  // The scheduled collector at 00:10 Taipei examines the just-closed day.
  // Historical manual reads may examine older sessions, never future ones.
  if(date>expectedPrior)throw new Error("C1_OFFICIAL_SESSION_FUTURE_OR_UNCLOSED_DATE");
  if(!validDate(calendarDate) || calendarDate!==date ||
     typeof isTradingDay!=="boolean")
    throw new Error("C1_OFFICIAL_SESSION_CALENDAR_UNVERIFIED");
  const trading=isTradingDay;
  return Object.freeze({
    schemaVersion:"S1_C1_OFFICIAL_SESSION_GATE_V0_1",
    scanDate:date,previousTaipeiCalendarDate:expectedPrior,
    proceed:trading,
    classification:trading?"OFFICIAL_TRADING_SESSION_COLLECT_C1":
      "OFFICIAL_NONTRADING_SESSION_SKIP_C1",
    evidenceState:trading?"READINESS_NOT_YET_VERIFIED":
      "NO_FORMAL_TRADING_SESSION_C1_NOT_EXPECTED",
    calendarSource:"Worker.js loadTradingCalendar/isTradingDate",
    mayCountAsZeroPick:false,
    formalScanConfirmed:false,c1GenerationObserved:false,
    accountD1QuotaCertified:false,physicalBusinessReadbackCertified:false,
    noScan:true,noPlanChange:true,noPush:true,noTrade:true
  });
}
