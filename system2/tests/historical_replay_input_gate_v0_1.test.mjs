import assert from "node:assert/strict";
import { buildHistoricalReplayInputGateV0_1 } from "../runtime/historical_replay_input_gate_v0_1.mjs";

function accepted(market,year){
  return {
    market,year,expectedSessions:240,actualSessions:240,
    missingBars:10,unknownBars:10,mainMissingReasons:{UNKNOWN_SYMBOL_SESSION_GAP:10},
    rawSourceMissingRows:0,rawSourceExtraRows:0,sourceRowHashMismatchCount:0,canonicalA1ValueMismatchCount:0,
    unexpectedBars:0,r2Objects:900,r2ByteHashVerified:900,
    manifestState:"COMPLETE",completionReceipt:"COMPLETE",receiptId:`R-${market}-${year}`,
    pitReadiness:"PASS_CONSERVATIVE_SESSION_FINALITY",continuityReadiness:"PARTIAL_UNVERIFIED",
    technicalPriceReadiness:"PARTIAL_NONPRICE_OBSERVATIONS",symbolSessionReadiness:"PARTIAL_UNKNOWN_GAPS",
    dataCoverageState:"PASS",replayReadinessState:"PARTIAL",overall:"PASS_DATA_PARTIAL_REPLAY",
    evidencePath:`system2/evidence/${market}_${year}.json`,githubRunId:year,
  };
}

const rows=[];
for(const market of ["TWSE","TPEX"]){
  for(let year=2024;year<=2025;year+=1) rows.push(accepted(market,year));
}
const coverageMatrix={rows};

const annualReady=buildHistoricalReplayInputGateV0_1({
  coverageMatrix,annualStartYear:2024,annualThroughYear:2025,currentYear:2026,
});
assert.equal(annualReady.annualReplayInputReady,true);
assert.equal(annualReady.presentScopeReady,false);
assert.equal(annualReady.state,"ANNUAL_READY_CURRENT_YEAR_BLOCKED");
assert.equal(annualReady.annualAcceptedCount,4);
assert.equal(annualReady.currentYearBlockers.length,2);
assert.equal(annualReady.replayDebtCount,4,"PARTIAL replay debt must remain explicit");

const presentReady=buildHistoricalReplayInputGateV0_1({
  coverageMatrix,annualStartYear:2024,annualThroughYear:2025,currentYear:2026,
  currentYearSegmentStateByMarket:{
    TWSE:{state:"PHYSICAL_ACCEPTED",completedThroughMonth:9,evidencePath:"system2/evidence/TWSE_2026_SEGMENTS.json"},
    TPEX:{state:"PHYSICAL_ACCEPTED",completedThroughMonth:9,evidencePath:"system2/evidence/TPEX_2026_SEGMENTS.json"},
  },
});
assert.equal(presentReady.presentScopeReady,true);
assert.equal(presentReady.state,"READY_PRESENT_SCOPE_WITH_EXPLICIT_REPLAY_DEBT");
assert.equal(presentReady.currentYearBlockers.length,0);
assert.equal(presentReady.partialReplayDebtMayNotBeRelabeledFull,true);

const blockedMatrix={rows:rows.map((row)=>row.market==="TPEX"&&row.year===2025
  ?{...row,dataCoverageState:"PENDING",overall:"PENDING",completionReceipt:"PENDING"}:row)};
const blocked=buildHistoricalReplayInputGateV0_1({
  coverageMatrix:blockedMatrix,annualStartYear:2024,annualThroughYear:2025,currentYear:2026,
  currentYearSegmentStateByMarket:{
    TWSE:{state:"PHYSICAL_ACCEPTED",completedThroughMonth:9,evidencePath:"twse.json"},
    TPEX:{state:"PHYSICAL_ACCEPTED",completedThroughMonth:9,evidencePath:"tpex.json"},
  },
});
assert.equal(blocked.annualReplayInputReady,false);
assert.equal(blocked.presentScopeReady,false);
assert.equal(blocked.state,"BLOCKED_ANNUAL_COVERAGE");
assert.equal(blocked.annualBlockers.length,1);
assert.equal(blocked.annualBlockers[0].market,"TPEX");
assert.equal(blocked.annualBlockers[0].year,2025);

const corrupted={rows:rows.map((row)=>row.market==="TWSE"&&row.year===2025
  ?{...row,r2ByteHashVerified:899}:row)};
const corruptGate=buildHistoricalReplayInputGateV0_1({
  coverageMatrix:corrupted,annualStartYear:2024,annualThroughYear:2025,currentYear:2026,
});
assert.equal(corruptGate.annualReplayInputReady,false);
assert.equal(corruptGate.annualBlockers[0].reason,"ANNUAL_MARKET_YEAR_NOT_PHYSICALLY_ACCEPTED");

console.log("System2 historical replay input gate v0.1 tests passed");
