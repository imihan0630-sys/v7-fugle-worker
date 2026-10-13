// V8 exact-date source-vintage firewall for the GitHub fallback.
// A future-state market snapshot MUST NOT be injected into a prior session replay.
// This does not certify all original MOPS publication times; only prevents a proven
// future-date contamination path. Formal PIT remains separately UNVERIFIED.
export function checkV8SelectionVintage({targetDate,sourceMarketLastDate,knownOfficialDates=[]}){
 const iso=/^20[0-9]{2}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$/;
 if(!iso.test(String(targetDate||"")))throw Error("TARGET_TRADING_DATE_INVALID");
 const source=sourceMarketLastDate==null?"":String(sourceMarketLastDate);
 if(source&&!iso.test(source))throw Error("SOURCE_MARKET_STATE_DATE_UNVERIFIED");
 if(source>targetDate)throw Error("SOURCE_MARKET_STATE_FROM_FUTURE_REPLAY_BLOCKED");
 for(const x of knownOfficialDates){
  const v=String(x||"");
  if(!iso.test(v))throw Error("OFFICIAL_SOURCE_DATE_UNVERIFIED");
  if(v!==targetDate)throw Error("MIXED_OFFICIAL_MARKET_SESSION_BLOCKED");
 }
 return Object.freeze({targetDate,sourceMarketLastDate:source||null,
  knownOfficialDates:knownOfficialDates.slice(),futureMarketStateRejected:true,
  pitPublicationTimeVerified:false,formalSelectionAuthorized:false});
}
