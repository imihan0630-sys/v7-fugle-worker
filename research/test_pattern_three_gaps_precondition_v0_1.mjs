import assert from "node:assert/strict";
import {
  classifyHistoryPresenceReceipt,
  validateThreeGapsPrecondition,
} from "./pattern_three_gaps_precondition_v0_1.mjs";

const symbol="2330";
const market="TWSE";
const hash="sha256:raw-history-1";
const atClose=d=>`${d}T14:00:00+08:00`;
const rawReceipt={
  id:"RAW-1",complete:true,requestedAdjusted:false,responseAdjusted:false,
  responseModeVerified:true,availableAt:atClose("2026-09-03"),sourceHistoryHash:hash,
};
const actionReceipt={
  id:"CA-1",complete:true,registryCoverageComplete:true,availableAt:atClose("2026-09-03"),
  coverageStart:"2026-09-01",coverageEnd:"2026-09-03",events:[],
};
const continuityReceipt={
  id:"TC-1",version:"TECHNICAL_CONTINUITY_V1",semanticSpace:"TECHNICAL_CONTINUITY",
  complete:true,availableAt:atClose("2026-09-03"),sourceBarsThrough:"2026-09-03",
  sourceRawReceiptId:"RAW-1",sourceHistoryHash:hash,corporateActionReceiptId:"CA-1",
};
const bar=(d,n)=>({
  date:d,
  raw:{barId:`RAW-${n}`,rawReceiptId:"RAW-1",sourceHistoryHash:hash,availableAt:atClose(d),open:100+n,high:104+n,low:99+n,close:103+n},
  technical:{barId:`TC-${n}`,sourceRawBarId:`RAW-${n}`,continuityReceiptId:"TC-1",continuityVersion:"TECHNICAL_CONTINUITY_V1",open:100+n,high:104+n,low:99+n,close:103+n},
});
const calendar=(dates)=>({
  id:"CAL-1",version:"OFFICIAL_MARKET_CALENDAR_V1",market,complete:true,
  availableAt:atClose("2026-09-03"),coverageStart:"2026-09-01",coverageEnd:"2026-09-03",openMarketDates:dates,
});
const presence=(d,tradedSymbols=[symbol],extra={})=>({
  schemaVersion:"HISTORY_PRESENCE_V1",market,marketDate:d,sourceUrl:`https://official.example/${d}`,
  collectedAt:`${d}T05:00:00.000Z`,symbolCount:1000,tradedSymbols,complete:true,
  semantics:"RAW_OFFICIAL_BAR_PRESENCE_BEFORE_FORMAL_FILTERS",...extra,
});
const base={
  asOfDate:"2026-09-03",asOfTimestamp:"2026-09-03T15:00:00+08:00",symbol,market,adjacencyMode:"OBSERVED_TRADE_ADJACENCY",
  previousBar:bar("2026-09-01",1),currentBar:bar("2026-09-02",2),
  rawSourceReceipt:rawReceipt,continuityReceipt,corporateActionReceipt:actionReceipt,
  marketCalendarReceipt:calendar(["2026-09-01","2026-09-02"]),
  historyPresenceReceipts:[presence("2026-09-01"),presence("2026-09-02")],
  symbolSessionEvidence:[],
};

// A. Ordinary consecutive official traded bars are measurement-ready; no detector runs.
const ready=validateThreeGapsPrecondition(base);
assert.equal(ready.status,"READY");
assert.equal(ready.measurementAuthorized,true);
assert.equal(ready.detectorExecuted,false);
assert.equal(ready.gapCount,null);
assert.equal(ready.directionalEffect,"UNKNOWN");

// B. OPEN is mandatory.
assert.throws(()=>validateThreeGapsPrecondition({...base,currentBar:{...base.currentBar,raw:{...base.currentBar.raw,open:null}}}),/INVALID_currentBar.raw.open/);

// C. adjusted=false request is insufficient if the response mode is adjusted or unverified.
const adjusted=validateThreeGapsPrecondition({...base,rawSourceReceipt:{...rawReceipt,responseAdjusted:true}});
assert.equal(adjusted.status,"PROVENANCE_CONFLICT");
assert(adjusted.reasons.includes("RAW_RESPONSE_MODE_NOT_IMMUTABLY_VERIFIED"));

// D. Continuity lineage/version mismatch fails closed.
const versionConflict=validateThreeGapsPrecondition({...base,currentBar:{...base.currentBar,technical:{...base.currentBar.technical,continuityVersion:"MUTATED"}}});
assert.equal(versionConflict.status,"PROVENANCE_CONFLICT");
assert(versionConflict.reasons.includes("TECHNICAL_BAR_LINEAGE_MISMATCH"));

const skippedBase={
  ...base,currentBar:bar("2026-09-03",3),
  marketCalendarReceipt:calendar(["2026-09-01","2026-09-02","2026-09-03"]),
  historyPresenceReceipts:[presence("2026-09-01"),presence("2026-09-02",[]),presence("2026-09-03")],
};

// E. A complete canonical no-trade receipt is enough for adjacent observed traded bars,
// but its reason must remain UNKNOWN and may not be renamed suspension.
const observedSkip=validateThreeGapsPrecondition(skippedBase);
assert.equal(observedSkip.status,"READY_WITH_UNKNOWN_NO_TRADE_REASON");
assert.equal(observedSkip.sessionStates[1].state,"NO_OFFICIAL_TRADED_BAR_REASON_UNKNOWN");

// F. The same evidence cannot prove adjacent eligible symbol sessions.
const eligibleBlocked=validateThreeGapsPrecondition({...skippedBase,adjacencyMode:"ELIGIBLE_SYMBOL_SESSION_ADJACENCY"});
assert.equal(eligibleBlocked.status,"DATA_BLOCKED");
assert(eligibleBlocked.reasons.includes("NO_TRADE_RECEIPT_CANNOT_PROVE_SYMBOL_SESSION_INELIGIBILITY"));

// G. Independent official symbol-session evidence can close that narrower gap.
const verifiedNonEligible=validateThreeGapsPrecondition({
  ...skippedBase,adjacencyMode:"ELIGIBLE_SYMBOL_SESSION_ADJACENCY",
  symbolSessionEvidence:[{date:"2026-09-02",state:"VERIFIED_SYMBOL_NOT_ELIGIBLE",complete:true,evidenceKind:"OFFICIAL_SYMBOL_SESSION_STATUS",knownAt:"2026-09-02T13:30:00+08:00",receiptId:"HALT-1"}],
});
assert.equal(verifiedNonEligible.status,"READY");

// H. An official bar and a verified non-eligible session are contradictory, not two votes.
const pseudoConflict=validateThreeGapsPrecondition({
  ...skippedBase,historyPresenceReceipts:[presence("2026-09-01"),presence("2026-09-02"),presence("2026-09-03")],
  symbolSessionEvidence:[{date:"2026-09-02",state:"VERIFIED_SYMBOL_NOT_ELIGIBLE",complete:true,evidenceKind:"OFFICIAL_SYMBOL_SESSION_STATUS",knownAt:"2026-09-02T13:30:00+08:00",receiptId:"HALT-1"}],
});
assert.equal(pseudoConflict.status,"PROVENANCE_CONFLICT");

// I. A known ex-right event is admissible only with verified transform and residual preservation.
const exRight={eventId:"EXR-1",effectiveDate:"2026-09-02",knownAt:"2026-09-01T18:00:00+08:00",factorVerified:true,appliedToContinuity:true,residualGapPreserved:true};
const exRightReady=validateThreeGapsPrecondition({...base,corporateActionReceipt:{...actionReceipt,events:[exRight]}});
assert.equal(exRightReady.status,"READY");
assert.deepEqual(exRightReady.usableCorporateActionIds,["EXR-1"]);
assert.equal(exRightReady.directionalEffect,"UNKNOWN");

// J. A future-known event cannot be applied to an earlier snapshot.
const futureApplied={...exRight,eventId:"FUTURE",knownAt:"2026-09-03T16:00:00+08:00",appliedToContinuity:true};
const futureConflict=validateThreeGapsPrecondition({...base,corporateActionReceipt:{...actionReceipt,events:[futureApplied]}});
assert.equal(futureConflict.status,"PROVENANCE_CONFLICT");
assert(futureConflict.reasons.includes("FUTURE_KNOWN_CORPORATE_ACTION_APPLIED"));

// K. Missing registry coverage blocks measurement even when there is no event row.
const noCoverage=validateThreeGapsPrecondition({...base,corporateActionReceipt:{...actionReceipt,registryCoverageComplete:false}});
assert.equal(noCoverage.status,"DATA_BLOCKED");

// L. An unapplied future event is invisible to the earlier prefix result.
const futureUnapplied={...futureApplied,appliedToContinuity:false};
const replay=validateThreeGapsPrecondition({...base,corporateActionReceipt:{...actionReceipt,events:[futureUnapplied]}});
assert.deepEqual(replay,ready);

// M. If the canonical full-market receipt says the symbol traded, a missing middle bar is a data defect.
const missingOfficial=validateThreeGapsPrecondition({...skippedBase,historyPresenceReceipts:[presence("2026-09-01"),presence("2026-09-02"),presence("2026-09-03")]});
assert.equal(missingOfficial.status,"DATA_BLOCKED");
assert(missingOfficial.reasons.includes("MISSING_OFFICIAL_TRADED_BAR"));

// N. Incomplete full-market presence evidence stays UNKNOWN.
const incomplete=validateThreeGapsPrecondition({...skippedBase,historyPresenceReceipts:[presence("2026-09-01"),presence("2026-09-02",[],{complete:false}),presence("2026-09-03")]});
assert.equal(incomplete.status,"DATA_BLOCKED");
assert(incomplete.reasons.includes("INTERMEDIATE_SYMBOL_SESSION_UNKNOWN"));

// Receipt classifier itself freezes the safe reuse boundary.
assert.equal(classifyHistoryPresenceReceipt({receipt:presence("2026-09-02",[]),symbol,market,marketDate:"2026-09-02",asOfDate:"2026-09-03",asOfTimestamp:"2026-09-03T15:00:00+08:00"}).state,"NO_OFFICIAL_TRADED_BAR_REASON_UNKNOWN");

console.log(JSON.stringify({ok:true,status:"PATTERN_THREE_GAPS_PRECONDITION_PASS",cases:14}));
