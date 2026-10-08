import assert from "node:assert/strict";
import {
  RECENT60_GAP_TAXONOMY_VERSION,
  classifyRecent60SymbolGap,
  summarizeRecent60PitEligibleGapsV0_1,
} from "../runtime/recent60_pit_gap_taxonomy_v0_1.mjs";

const base={
  market:"TWSE",selectedDateCount:60,expectedSessionCount:60,
  missingExpectedSessionCount:0,unexpectedSessionCount:0,
  ambiguousDateCount:0,continuityEligibleCount:0,
  requiredPriorSessionsForSymbol:60,
  historyReady:true,continuityReady:false,
  exactSessionReconciliationReady:true,
  listingAgeLimited:false,
  sessionReconciliationState:"EXACT_EXPECTED_SESSION_SET_AVAILABLE",
  blockerCodes:["SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED"],
  missingExpectedSessionSample:[],
};
const rows=[
  {...base,symbol:"1101"},
  {...base,symbol:"1102",market:"TPEX",selectedDateCount:17,
    missingExpectedSessionCount:43,expectedSessionCount:60,
    historyReady:false,exactSessionReconciliationReady:false,
    continuityEligibleCount:0,
    blockerCodes:["INSUFFICIENT_PIT_HISTORY","SYMBOL_LOCAL_EXPECTED_SESSION_MISSING"],
    missingExpectedSessionSample:["2026-08-21","2026-08-24"]},
  {...base,symbol:"1103",selectedDateCount:0,expectedSessionCount:0,
    requiredPriorSessionsForSymbol:60,historyReady:false,
    exactSessionReconciliationReady:false,
    sessionReconciliationState:"LISTING_BOUNDARY_UNCERTIFIED",
    blockerCodes:["SYMBOL_LOCAL_LISTING_BOUNDARY_UNCERTIFIED"]},
  {...base,symbol:"1104",selectedDateCount:60,expectedSessionCount:60,
    ambiguousDateCount:1,historyReady:false,exactSessionReconciliationReady:false,
    blockerCodes:["SYMBOL_LOCAL_REVISION_AMBIGUITY","INSUFFICIENT_PIT_HISTORY"]},
  {...base,symbol:"1105",selectedDateCount:3,expectedSessionCount:3,
    requiredPriorSessionsForSymbol:3,listingAgeLimited:true,
    continuityEligibleCount:3,historyReady:true,continuityReady:true,
    blockerCodes:[]},
];
const history={
  marketDate:"2026-10-08",requiredPriorSessions:60,
  diagnostics:rows,accountingComplete:true,currentUniverseCount:5,
  historyReadyCount:2,continuityReadyCount:1,
  exactSessionReconciliationEnabled:true,listingMetadataState:"READY",
  globalIntegrityState:"READY",
};
const summary=summarizeRecent60PitEligibleGapsV0_1({history});
assert.equal(summary.schemaVersion,RECENT60_GAP_TAXONOMY_VERSION);
assert.equal(summary.localSymbolCounts.currentSymbolCount,5);
assert.equal(summary.localSymbolCounts.historyReadyCount,2);
assert.equal(summary.localSymbolCounts.continuityReadyCount,1);
assert.equal(summary.localSymbolCounts.missingExpectedSymbolCount,1);
assert.equal(summary.localSymbolCounts.missingExpectedSessionTotal,43);
assert.equal(summary.localSymbolCounts.ambiguousRevisionSymbolCount,1);
assert.equal(summary.localSymbolCounts.noPriorPitEligibleRowsCount,1);
assert.equal(summary.localSymbolCounts.listingAgeLimitedSymbolCount,1);
assert.equal(summary.localSymbolCounts.zeroExpectedSessionCount,1);
assert.equal(summary.localSymbolCounts.primaryCauseCounts.CONTINUITY_PROOF_MISSING,1);
assert.equal(summary.localSymbolCounts.primaryCauseCounts.EXPECTED_PIT_SESSION_MISSING,1);
assert.equal(summary.localSymbolCounts.primaryCauseCounts.LISTING_BOUNDARY_UNKNOWN,1);
assert.equal(summary.localSymbolCounts.primaryCauseCounts.REVISION_AMBIGUOUS,1);
assert.equal(summary.localSymbolCounts.primaryCauseCounts.READY,1);
assert.equal(summary.byMarket.TWSE.currentSymbolCount,4);
assert.equal(summary.byMarket.TPEX.currentSymbolCount,1);
assert.equal(summary.byMarket.UNKNOWN.currentSymbolCount,0);
assert.equal(summary.localSymbolCounts.blockerIncidence.INSUFFICIENT_PIT_HISTORY,2);
assert.deepEqual(summary.topMissingPITEligibleExamples[0].sampleMissingExpectedDates,
  ["2026-08-21","2026-08-24"]);
assert.equal(summary.topMissingPITEligibleExamples[0].rowSymbol,"1102");
assert.equal(summary.sourcePhysicalGapVsPITFilter,"NOT_DISTINGUISHED_BY_THIS_READ_ONLY_RESULT");
assert.equal(summary.strategyPromotionAuthorized,false);
assert.equal(summary.storageMutationPerformed,false);
assert.match(summary.missingExpectedSessionSemantics,/PHYSICAL_ABSENCE_VS_PIT_FILTER_UNKNOWN/);
assert.equal(classifyRecent60SymbolGap({...base,market:null}),"CURRENT_MARKET_IDENTITY_UNKNOWN");
assert.equal(classifyRecent60SymbolGap({...base,historyReady:false,
  exactSessionReconciliationReady:false,sessionReconciliationState:"EXPECTED_SESSION_CONTRACT_UNAVAILABLE",
  blockerCodes:["SYMBOL_LOCAL_EXPECTED_SESSION_CONTRACT_UNAVAILABLE"]}),
  "EXPECTED_SESSION_CONTRACT_UNKNOWN");
assert.equal(classifyRecent60SymbolGap({...base,historyReady:false,
  exactSessionReconciliationReady:false,sessionReconciliationState:"EXPECTED_SESSION_CALENDAR_WINDOW_INSUFFICIENT"}),
  "EXPECTED_SESSION_CALENDAR_INSUFFICIENT");
assert.equal(classifyRecent60SymbolGap({...base,historyReady:false,
  exactSessionReconciliationReady:false,unexpectedSessionCount:3}),
  "UNEXPECTED_PIT_SESSION_PRESENT");
assert.equal(classifyRecent60SymbolGap({...base,historyReady:false,
  exactSessionReconciliationReady:false,selectedDateCount:21}),
  "INSUFFICIENT_PIT_ELIGIBLE_HISTORY");

for(const invalid of [
  {...history,accountingComplete:false},
  {...history,currentUniverseCount:4},
  {...history,historyReadyCount:3},
  {...history,continuityReadyCount:2},
  {...history,diagnostics:[...rows,rows[0]]},
  {...history,diagnostics:rows.map((r,i)=>i===0?{...r,historyReady:false,continuityReady:true}:r)},
  {...history,diagnostics:rows.map((r,i)=>i===0?{...r,missingExpectedSessionCount:61}:r)},
]){
  assert.throws(()=>summarizeRecent60PitEligibleGapsV0_1({history:invalid}));
}
assert.throws(()=>summarizeRecent60PitEligibleGapsV0_1({history,topN:26}));
console.log("Recent60 PIT-eligible gap taxonomy tests PASS (exclusive causes and fail-closed denominators)");
