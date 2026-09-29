import assert from "node:assert/strict";
import { buildA1SymbolSnapshotBatch } from "../system2/runtime/a1_symbol_snapshot_adapter.mjs";
import {
  buildDirectionBreadthResearchV0_1,
  classifyDirectionBreadthSnapshot,
} from "../research/d18_direction_breadth_semantics_v0_1.mjs";

const marketDate = "2026-09-30";
const decisionTimestamp = "2026-09-30T07:40:00Z";
const observedAt = "2026-09-30T07:35:00Z";

const twseRows = [
  {
    Date: "1150930", Code: "2330", Name: "台積電",
    OpeningPrice: "1300", HighestPrice: "1330", LowestPrice: "1290", ClosingPrice: "1320",
    TradeVolume: "1000", TradeValue: "1320000", Transaction: "100", Change: "+20",
  },
  {
    Date: "1150930", Code: "2002", Name: "中鋼",
    OpeningPrice: "20", HighestPrice: "20", LowestPrice: "20", ClosingPrice: "20",
    TradeVolume: "1000", TradeValue: "20000", Transaction: "20", Change: "X0.00",
  },
  {
    Date: "1150930", Code: "2454", Name: "聯發科",
    OpeningPrice: "1000", HighestPrice: "1000", LowestPrice: "1000", ClosingPrice: "1000",
    TradeVolume: "1000", TradeValue: "1000000", Transaction: "10", Change: "0.00",
  },
  {
    Date: "1150930", Code: "1101", Name: "台泥",
    OpeningPrice: "--", HighestPrice: "--", LowestPrice: "--", ClosingPrice: "--",
    TradeVolume: "0", TradeValue: "0", Transaction: "0", Change: "0.00",
  },
];

const tpexRows = [
  {
    Date: "115/09/30", SecuritiesCompanyCode: "6488", CompanyName: "環球晶",
    Open: "500", High: "510", Low: "495", Close: "508",
    TradingShares: "1000", TransactionAmount: "508000", TransactionNumber: "10", Change: "+8",
  },
  {
    Date: "115/09/30", SecuritiesCompanyCode: "3105", CompanyName: "穩懋",
    Open: "250", High: "252", Low: "245", Close: "247",
    TradingShares: "1000", TransactionAmount: "247000", TransactionNumber: "10", Change: "-3",
  },
  {
    Date: "115/09/30", SecuritiesCompanyCode: "4123", CompanyName: "晟德",
    Open: "45", High: "45", Low: "45", Close: "45",
    TradingShares: "1000", TransactionAmount: "45000", TransactionNumber: "10", Change: "X0",
  },
  {
    Date: "115/09/30", SecuritiesCompanyCode: "5009", CompanyName: "榮剛",
    Open: "50", High: "50", Low: "50", Close: "50",
    TradingShares: "1000", TransactionAmount: "50000", TransactionNumber: "10", Change: "0",
  },
];

const batch = await buildA1SymbolSnapshotBatch({
  batchId: "D18-BREADTH-FIXTURE",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows,
  tpexRows,
  minimumByMarket: { TWSE: 4, TPEX: 4 },
});

assert.equal(batch.state, "READY");

// Existing A1 numeric normalization can turn X0 into numeric 0.
// The D18 semantic observer must recover the raw exchange marker from sourceFields.change.
assert.equal(batch.bySymbol["2002"].change, 0);
assert.equal(batch.bySymbol["4123"].change, 0);

const xTwse = classifyDirectionBreadthSnapshot(batch.bySymbol["2002"]);
const xTpex = classifyDirectionBreadthSnapshot(batch.bySymbol["4123"]);
assert.equal(xTwse.directionState, "NOT_COMPARABLE");
assert.equal(xTpex.directionState, "NOT_COMPARABLE");
assert.equal(xTwse.reason, "EXCHANGE_NOT_COMPARABLE_MARKER");
assert.equal(xTpex.reason, "EXCHANGE_NOT_COMPARABLE_MARKER");

const noTrade = classifyDirectionBreadthSnapshot(batch.bySymbol["1101"]);
assert.equal(noTrade.directionState, "UNKNOWN");
assert.equal(noTrade.reason, "NO_USABLE_CLOSE");

const breadth = buildDirectionBreadthResearchV0_1({ snapshotBatch: batch });
assert.equal(breadth.state, "KNOWN");
assert.equal(breadth.total.base, 8);
assert.equal(breadth.total.up, 2);
assert.equal(breadth.total.down, 1);
assert.equal(breadth.total.flat, 2);
assert.equal(breadth.total.notComparable, 2);
assert.equal(breadth.total.unknown, 1);
assert.equal(breadth.total.knownComparable, 5);
assert.equal(breadth.total.advanceShareKnown, 0.4);
assert.equal(breadth.total.netBreadthShareKnown, 0.2);
assert.equal(breadth.breadthSemantics, "OFFICIAL_MARKET_DIRECTION_NOT_FORMAL_OPPORTUNITY_SET");
assert.equal(breadth.denominatorSemantics.includes("X_NOT_COMPARABLE"), true);

// Input order changes must not change the semantic feature hash.
const reorderedBatch = await buildA1SymbolSnapshotBatch({
  batchId: "D18-BREADTH-FIXTURE",
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows: [...twseRows].reverse(),
  tpexRows: [...tpexRows].reverse(),
  minimumByMarket: { TWSE: 4, TPEX: 4 },
});
const replay = buildDirectionBreadthResearchV0_1({ snapshotBatch: reorderedBatch });
assert.equal(replay.featureHash, breadth.featureHash);

// A non-PIT batch must fail closed.
const futureBatch = await buildA1SymbolSnapshotBatch({
  batchId: "D18-BREADTH-FUTURE",
  marketDate,
  decisionTimestamp,
  observedAt: "2026-09-30T07:41:00Z",
  twseRows,
  tpexRows,
  minimumByMarket: { TWSE: 4, TPEX: 4 },
});
const blocked = buildDirectionBreadthResearchV0_1({ snapshotBatch: futureBatch });
assert.equal(blocked.state, "UNKNOWN");
assert.equal(blocked.reason, "A1_BATCH_NOT_READY_OR_NOT_PIT");

console.log("D18 direction breadth semantic observer tests passed");
