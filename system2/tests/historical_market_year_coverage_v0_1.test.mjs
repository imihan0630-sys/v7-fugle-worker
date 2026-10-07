import assert from "node:assert/strict";
import {
  buildHistoricalMarketYearCoverageV0_1,
  buildObservedIntervalUniverseRegistryV0_1,
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
assert.equal(classified.structuralCoverageState,"PASS");
assert.equal(classified.rawCoverageState,"PASS");
assert.equal(classified.symbolSessionReadiness,"PASS_CLASSIFIED");
assert.equal(classified.pitReadiness,"PASS_CONSERVATIVE_SESSION_FINALITY");
assert.equal(classified.continuityReadiness,"PARTIAL_UNVERIFIED");
assert.equal(classified.technicalPriceReadiness,"PARTIAL_NONPRICE_OBSERVATIONS");
assert.equal(classified.overallState,"PARTIAL");

const unknown=buildHistoricalMarketYearCoverageV0_1({
  market:"TWSE",year:2017,fromDate:"2017-01-01",toDate:"2017-12-31",
  tradingDates:["2017-01-03","2017-01-04"],registry,rows,suspensionIntervals:[],
});
assert.equal(unknown.unknownBars,1);
assert.equal(unknown.expectedBars,4);
assert.equal(unknown.missingBars,1);
assert.equal(unknown.structuralCoverageState,"PASS");
assert.equal(unknown.rawCoverageState,"PASS");
assert.equal(unknown.symbolSessionReadiness,"PARTIAL_UNKNOWN_GAPS");
assert.deepEqual(unknown.missingBySymbol,[{
  symbol:"1102",missingCount:1,unknownCount:1,suspensionCount:0,
  firstMissingDate:"2017-01-04",lastMissingDate:"2017-01-04",
}]);
assert.equal(unknown.overallState,"PARTIAL");

const delistingExclusive=buildHistoricalMarketYearCoverageV0_1({
  market:"TWSE",year:2017,fromDate:"2017-01-01",toDate:"2017-12-31",
  tradingDates:["2017-01-03","2017-01-04"],
  registry:{memberships:[{
    market:"TWSE",symbol:"1101",replayEligible:true,effectiveFrom:"2017-01-01",
    effectiveTo:"2017-01-04",endBasis:"OFFICIAL_DELISTING_DATE",
  }]},
  rows:[bar("1101","2017-01-03")],
  suspensionIntervals:[],
});
assert.equal(delistingExclusive.membershipSessionDenominator,1);
assert.equal(delistingExclusive.actualBars,1);
assert.equal(delistingExclusive.missingBars,0);
assert.equal(delistingExclusive.unknownBars,0);
assert.equal(delistingExclusive.symbolSessionReadiness,"PASS_CLASSIFIED");

const tpexObserved=buildObservedIntervalUniverseRegistryV0_1({
  market:"TPEX",
  fromDate:"2017-01-01",
  toDate:"2017-12-31",
  rows:[
    bar("6488","2017-01-03",{market:"TPEX"}),
    bar("6488","2017-01-04",{market:"TPEX"}),
    bar("1566","2017-03-01",{market:"TPEX"}),
    bar("1566","2017-03-03",{market:"TPEX"}),
  ],
  currentListingByMarketSymbol:{
    "TPEX|6488":{listingDate:"2014-03-28"},
    "TPEX|3105":{listingDate:"2002-01-23"},
  },
});
assert.equal(tpexObserved.state,"PARTIAL_OBSERVED_INTERVAL_UNIVERSE");
assert.equal(tpexObserved.survivorshipComplete,false);
assert.equal(tpexObserved.officialDelistingUnionComplete,false);
assert.equal(tpexObserved.membershipCount,3);
assert.equal(tpexObserved.officialCurrentCount,2);
assert.equal(tpexObserved.observedHistoricalOnlyCount,1);
assert.equal(tpexObserved.currentWithoutObservedRowsCount,1);
assert.deepEqual(tpexObserved.memberships.find(x=>x.symbol==="6488"),{
  market:"TPEX",symbol:"6488",replayEligible:true,
  effectiveFrom:"2017-01-01",effectiveTo:null,listingDate:"2014-03-28",
  firstObservedDate:"2017-01-03",lastObservedDate:"2017-01-04",
  membershipBasis:"OFFICIAL_CURRENT_LISTING_DATE_PLUS_A1_OBSERVED",
});
assert.deepEqual(tpexObserved.memberships.find(x=>x.symbol==="1566"),{
  market:"TPEX",symbol:"1566",replayEligible:true,
  effectiveFrom:"2017-03-01",effectiveTo:"2017-03-03",listingDate:null,
  firstObservedDate:"2017-03-01",lastObservedDate:"2017-03-03",
  membershipBasis:"A1_OBSERVED_INTERVAL_ONLY_NO_OFFICIAL_DELISTING_UNION",
});
assert.deepEqual(tpexObserved.memberships.find(x=>x.symbol==="3105"),{
  market:"TPEX",symbol:"3105",replayEligible:true,
  effectiveFrom:"2017-01-01",effectiveTo:null,listingDate:"2002-01-23",
  firstObservedDate:null,lastObservedDate:null,
  membershipBasis:"OFFICIAL_CURRENT_LISTING_DATE_NO_A1_OBSERVATION",
});

console.log("historical_market_year_coverage_v0_1 tests passed");
