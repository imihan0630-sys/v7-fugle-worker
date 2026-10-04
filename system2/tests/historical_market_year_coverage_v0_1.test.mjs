import assert from "node:assert/strict";
import {
  buildHistoricalMarketYearCoverageV0_1,
  classifyHistoricalA1ObservationV0_1,
} from "../runtime/historical_market_year_coverage_v0_1.mjs";

function bar(symbol, marketDate, overrides={}) {
  return {
    market:"TWSE",symbol,marketDate,
    open:10,high:11,low:9,close:10.5,
    volumeShares:1000,tradeValue:10500,transactions:20,
    continuityState:"UNVERIFIED",
    sourceId:"A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
    sourceRowHash:"a".repeat(64),
    observedAt:"2026-10-04T08:00:00Z",
    availableAt:marketDate+"T05:30:00Z",
    ...overrides,
  };
}

assert.equal(classifyHistoricalA1ObservationV0_1(bar("1101","2017-01-03")).state,"VALID_OHLC");
assert.equal(classifyHistoricalA1ObservationV0_1(bar("1101","2017-01-03",{
  open:null,high:null,low:null,close:null,volumeShares:0,tradeValue:0,transactions:0,
})).state,"OFFICIAL_ZERO_TRADE_NO_PRICE");
assert.equal(classifyHistoricalA1ObservationV0_1(bar("1101","2017-01-03",{
  open:null,high:null,low:null,close:null,volumeShares:100,tradeValue:1000,transactions:2,
})).state,"POSITIVE_ACTIVITY_NO_VALID_CLOSE");

const registry={
  memberships:[
    {market:"TWSE",symbol:"1101",replayEligible:true,effectiveFrom:"2017-01-01",effectiveTo:null},
    {market:"TWSE",symbol:"1102",replayEligible:true,effectiveFrom:"2017-01-01",effectiveTo:null},
  ],
};
const rows=[
  bar("1101","2017-01-03"),
  bar("1102","2017-01-03"),
  bar("1101","2017-01-04",{
    open:null,high:null,low:null,close:null,volumeShares:0,tradeValue:0,transactions:0,
  }),
];

const classified=buildHistoricalMarketYearCoverageV0_1({
  market:"TWSE",year:2017,fromDate:"2017-01-01",toDate:"2017-12-31",
  tradingDates:["2017-01-03","2017-01-04"],registry,rows,
  suspensionIntervals:[{
    market:"TWSE",symbol:"1102",suspendedFrom:"2017-01-04",resumedOn:"2017-01-05",
    coverageTo:"2017-12-31",sourceRowHash:"b".repeat(64),
  }],
});
assert.equal(classified.expectedSessions,2);
assert.equal(classified.historicalUniverseSize,2);
assert.equal(classified.membershipSessionDenominator,4);
assert.equal(classified.actualBars,3);
assert.equal(classified.missingBars,1);
assert.equal(classified.unknownBars,0);
assert.equal(classified.suspensionClassifiedMissingBars,1);
assert.equal(classified.rawCoverageState,"PASS");
assert.equal(classified.pitReadiness,"PASS_CONSERVATIVE_SESSION_FINALITY");
assert.equal(classified.continuityReadiness,"PARTIAL_UNVERIFIED");
assert.equal(classified.technicalPriceReadiness,"PARTIAL_NONPRICE_OBSERVATIONS");
assert.equal(classified.overallState,"PARTIAL");

const unknown=buildHistoricalMarketYearCoverageV0_1({
  market:"TWSE",year:2017,fromDate:"2017-01-01",toDate:"2017-12-31",
  tradingDates:["2017-01-03","2017-01-04"],registry,rows,suspensionIntervals:[],
});
assert.equal(unknown.unknownBars,1);
assert.equal(unknown.rawCoverageState,"PASS");
assert.equal(unknown.symbolSessionCoverageState,"PARTIAL_UNKNOWN_SYMBOL_SESSIONS");
assert.equal(unknown.overallState,"PARTIAL");
assert.deepEqual(unknown.missingBySymbol,[{
  symbol:"1102",missingCount:1,unknownCount:1,suspensionCount:0,
  firstMissingDate:"2017-01-04",lastMissingDate:"2017-01-04",
}]);

console.log("historical_market_year_coverage_v0_1 tests passed");
