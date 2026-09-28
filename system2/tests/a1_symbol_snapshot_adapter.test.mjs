import assert from "node:assert/strict";
import { buildA1SymbolSnapshotBatch } from "../runtime/a1_symbol_snapshot_adapter.mjs";

const marketDate = "2026-09-29";
const decisionTimestamp = "2026-09-29T07:30:00Z";
const observedAt = "2026-09-29T07:20:00Z";

const twseRows = [
  {
    Date: "1150929",
    Code: "2330",
    Name: "台積電",
    OpeningPrice: "1,350.00",
    HighestPrice: "1,380.00",
    LowestPrice: "1,340.00",
    ClosingPrice: "1,375.00",
    TradeVolume: "30,000,000",
    TradeValue: "41,000,000,000",
    Transaction: "80,000",
    Change: "+25.00",
  },
  {
    Date: "1150929",
    Code: "0050",
    Name: "ETF should be ignored by ordinary-symbol adapter",
    OpeningPrice: "100",
    HighestPrice: "101",
    LowestPrice: "99",
    ClosingPrice: "100",
  },
  {
    Date: "1150928",
    Code: "2454",
    Name: "wrong date",
    OpeningPrice: "1000",
    HighestPrice: "1010",
    LowestPrice: "990",
    ClosingPrice: "1005",
  },
];

const tpexRows = [
  {
    Date: "115/09/29",
    SecuritiesCompanyCode: "6488",
    CompanyName: "環球晶",
    Open: "510",
    High: "525",
    Low: "505",
    Close: "520",
    TradingShares: "2,500,000",
    TransactionAmount: "1,290,000,000",
    TransactionNumber: "12,345",
    Change: "+10",
  },
];

const ready = await buildA1SymbolSnapshotBatch({
  batchId: "A1-20260929-001",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows,
  tpexRows,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});

assert.equal(ready.state, "READY");
assert.equal(ready.pointInTimeEligible, true);
assert.equal(ready.ordinarySymbolCount, 2);
assert.deepEqual(ready.symbols, ["2330", "6488"]);
assert.deepEqual(ready.blockerCodes, []);
assert.equal(ready.markets.TWSE.normalizedSymbolCount, 1);
assert.equal(ready.markets.TPEX.normalizedSymbolCount, 1);

const tsmc = ready.bySymbol["2330"];
assert.equal(tsmc.companyName, "台積電");
assert.equal(tsmc.market, "TWSE");
assert.equal(tsmc.open, 1350);
assert.equal(tsmc.high, 1380);
assert.equal(tsmc.low, 1340);
assert.equal(tsmc.close, 1375);
assert.equal(tsmc.volumeShares, 30000000);
assert.equal(tsmc.volumeLots, 30000);
assert.equal(tsmc.tradeValue, 41000000000);
assert.equal(tsmc.transactions, 80000);
assert.equal(tsmc.change, 25);
assert.equal(tsmc.priceState, "COMPLETE_OHLC");
assert.equal(tsmc.ohlcConsistency, "CONSISTENT");
assert.equal(tsmc.provenance.pointInTimeEligible, true);
assert.match(tsmc.sourceRowHash, /^[0-9a-f]{64}$/);

const replay = await buildA1SymbolSnapshotBatch({
  batchId: "A1-20260929-001",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows,
  tpexRows,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(ready.batchHash, replay.batchHash);

const futureObserved = await buildA1SymbolSnapshotBatch({
  batchId: "A1-FUTURE",
  marketDate,
  decisionTimestamp,
  observedAt: "2026-09-29T07:31:00Z",
  twseRows,
  tpexRows,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(futureObserved.state, "INCOMPLETE");
assert.equal(futureObserved.pointInTimeEligible, false);
assert.ok(futureObserved.blockerCodes.includes("OBSERVED_AFTER_DECISION_CLOCK"));
assert.equal(futureObserved.bySymbol["2330"].provenance.pointInTimeEligible, false);

const duplicateTwse = await buildA1SymbolSnapshotBatch({
  batchId: "A1-DUP",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows: [twseRows[0], { ...twseRows[0], ClosingPrice: "1376" }],
  tpexRows,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(duplicateTwse.state, "INCOMPLETE");
assert.deepEqual(duplicateTwse.markets.TWSE.duplicateSymbols, ["2330"]);
assert.ok(duplicateTwse.blockerCodes.includes("TWSE:DUPLICATE_TARGET_DATE_SYMBOL"));

const badOhlc = await buildA1SymbolSnapshotBatch({
  batchId: "A1-BAD-OHLC",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows: [{ ...twseRows[0], HighestPrice: "1300" }],
  tpexRows,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(badOhlc.state, "INCOMPLETE");
assert.deepEqual(badOhlc.markets.TWSE.invalidOhlcSymbols, ["2330"]);
assert.ok(badOhlc.blockerCodes.includes("TWSE:OHLC_INCONSISTENCY"));

const noTrade = await buildA1SymbolSnapshotBatch({
  batchId: "A1-NO-TRADE",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows: [{
    ...twseRows[0],
    Code: "2454",
    Name: "聯發科",
    OpeningPrice: "--",
    HighestPrice: "--",
    LowestPrice: "--",
    ClosingPrice: "--",
    TradeVolume: "0",
    TradeValue: "0",
  }],
  tpexRows,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(noTrade.state, "READY");
assert.equal(noTrade.bySymbol["2454"].priceState, "NO_USABLE_PRICE");
assert.deepEqual(noTrade.markets.TWSE.noUsablePriceSymbols, ["2454"]);

const crossMarket = await buildA1SymbolSnapshotBatch({
  batchId: "A1-CROSS",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows,
  tpexRows: [{
    ...tpexRows[0],
    SecuritiesCompanyCode: "2330",
    CompanyName: "duplicate market fixture",
  }],
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(crossMarket.state, "INCOMPLETE");
assert.ok(crossMarket.blockerCodes.includes("CROSS_MARKET_DUPLICATE_SYMBOL"));
assert.equal(crossMarket.bySymbol["2330"], undefined);

console.log("System2 A1 per-symbol snapshot adapter tests passed");
