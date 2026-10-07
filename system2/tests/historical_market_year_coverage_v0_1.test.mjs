import assert from "node:assert/strict";
import {
  buildHistoricalMarketYearCoverageV0_1,
  buildObservedIntervalUniverseRegistryV0_1,
  classifyHistoricalA1ObservationV0_1,
  tpexCmodeRocDateV0_1,
  parseTpexCmodePositiveStopSessionsV0_1,
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

assert.equal(tpexCmodeRocDateV0_1("2023-04-10"),"112/04/10");
assert.equal(parseTpexCmodePositiveStopSessionsV0_1({
  marketDate:"2023-04-10",coverageTo:"2023-12-31",sourceHash:"e".repeat(64),
  payload:{reportDate:"資料日期：112/04/10",aaData:[]},
}).state,"POSITIVE_SESSION_SOURCE_OBSERVED");
assert.equal(parseTpexCmodePositiveStopSessionsV0_1({
  marketDate:"2023-04-10",coverageTo:"2023-12-31",sourceHash:"f".repeat(64),
  payload:{reportDate:"民國112年4月10日",aaData:[]},
}).state,"POSITIVE_SESSION_SOURCE_OBSERVED");

const cmodePositive=parseTpexCmodePositiveStopSessionsV0_1({
  marketDate:"2023-04-10",
  coverageTo:"2023-12-31",
  sourceUrl:"https://www.tpex.org.tw/web/stock/aftertrading/cmode/chtm_result.php?l=zh-tw&o=json&d=112/04/10",
  sourceHash:"c".repeat(64),
  payload:{
    reportDate:"112/04/10",
    aaData:[
      ["4806","昇華","","","","","停止交易","","",""],
      ["6488","環球晶","","","","","","","",""],
      ["3105","穩懋","","","","","-","","",""],
    ],
  },
});
assert.equal(cmodePositive.state,"POSITIVE_SESSION_SOURCE_OBSERVED");
assert.equal(cmodePositive.rowCount,3);
assert.equal(cmodePositive.positiveStopCount,1);
assert.equal(cmodePositive.absenceCertifiesNoStop,false);
assert.match(cmodePositive.intervals[0].sourceRowHash,/^[a-f0-9]{64}$/);
assert.equal(cmodePositive.intervals[0].sourcePayloadHash,"c".repeat(64));
assert.deepEqual(cmodePositive.intervals.map(x=>({
  market:x.market,symbol:x.symbol,suspendedFrom:x.suspendedFrom,resumedOn:x.resumedOn,
  sourceKind:x.sourceKind,sessionEvidenceOnly:x.sessionEvidenceOnly,
})),[{
  market:"TPEX",symbol:"4806",suspendedFrom:"2023-04-10",resumedOn:"2023-04-11",
  sourceKind:"TPEX_CMODE_POSITIVE_STOP_SESSION",sessionEvidenceOnly:true,
}]);

const cmodeDateMismatch=parseTpexCmodePositiveStopSessionsV0_1({
  marketDate:"2023-04-10",
  coverageTo:"2023-12-31",
  sourceUrl:"https://example.invalid/cmode",
  sourceHash:"d".repeat(64),
  payload:{reportDate:"112/04/11",aaData:[["4806","昇華","","","","","停止交易","","",""]]},
});
assert.equal(cmodeDateMismatch.state,"SOURCE_DATE_IDENTITY_UNCERTIFIED");
assert.equal(cmodeDateMismatch.positiveStopCount,0);
assert.equal(cmodeDateMismatch.intervals.length,0);
assert.equal(cmodeDateMismatch.absenceCertifiesNoStop,false);

assert.deepEqual(unknown.unknownSessionDates,["2017-01-04"]);
assert.equal(unknown.schemaVersion,"S2_HISTORICAL_MARKET_YEAR_COVERAGE_V0_3");
assert.deepEqual(classified.unknownSessionDates,[]);

console.log("historical_market_year_coverage_v0_1 tests passed");
