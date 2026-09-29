import assert from "node:assert/strict";
import {
  FUGLE_RESONANCE_SEMANTIC_CONTRACT,
  fugleMicrosecondsToIsoV0_1,
  normalizeFugleIntradayQuoteForDailyResonanceV0_1,
} from "../runtime/fugle_resonance_quote_normalizer_v0_1.mjs";
import { buildCurrentDailyBarFromNormalizedQuoteV0_1 } from "../runtime/daily_resonance_live_adapter_v0_1.mjs";

const quote2330 = {
  date: "2023-05-29",
  type: "EQUITY",
  exchange: "TWSE",
  market: "TSE",
  symbol: "2330",
  name: "台積電",
  referencePrice: 566,
  previousClose: 566,
  openPrice: 574,
  openTime: 1685322000049353,
  highPrice: 574,
  highTime: 1685322000049353,
  lowPrice: 564,
  lowTime: 1685327142152580,
  closePrice: 568,
  closeTime: 1685338200000000,
  avgPrice: 568.77,
  lastPrice: 999,
  total: {
    tradeValue: 31019803000,
    tradeVolume: 54538,
    tradeVolumeAtBid: 19853,
    tradeVolumeAtAsk: 27900,
    transaction: 9530,
    time: 1685338200000000,
  },
  lastTrade: {
    bid: 567,
    ask: 568,
    price: 568,
    size: 4778,
    time: 1685338200000000,
    serial: 6652422,
  },
  isClose: true,
  isTrial: false,
  isDelayedOpen: false,
  isDelayedClose: false,
  isLimitDownHalt: false,
  isLimitUpHalt: false,
  tradingHalt: { isHalted: false, time: null },
  serial: 6652422,
  lastUpdated: 1685338200000000,
};

const ticker2330 = {
  date: "2023-05-29",
  type: "EQUITY",
  exchange: "TWSE",
  market: "TSE",
  symbol: "2330",
  name: "台積電",
  securityType: "01",
  securityStatus: "NORMAL",
  boardLot: 1000,
  tradingCurrency: "TWD",
};

assert.equal(
  fugleMicrosecondsToIsoV0_1(1685338200000000),
  "2023-05-29T05:30:00.000Z",
);
assert.throws(
  () => fugleMicrosecondsToIsoV0_1(1685338200000),
  /Unix-microsecond integer/,
);

{
  const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    fetchedAt: "2023-05-29T05:30:01.000Z",
    rawQuote: quote2330,
    rawTicker: ticker2330,
  });

  assert.equal(normalized.semanticVerified, true);
  assert.deepEqual(normalized.semanticBlockers, []);
  assert.equal(normalized.normalizedQuote.semanticContract, FUGLE_RESONANCE_SEMANTIC_CONTRACT);
  assert.equal(normalized.normalizedQuote.lastPrice, 568, "must use closePrice/actual trade, not trial-capable lastPrice");
  assert.equal(normalized.volumeUnitCheck.state, "VERIFIED_BY_VALUE_VOLUME_AVGPRICE");
  assert.equal(normalized.volumeUnitCheck.cumulativeVolumeShares, 54538000);
  assert.ok(normalized.volumeUnitCheck.relativeAveragePriceError < 0.002);
  assert.equal(normalized.normalizedQuote.cumulativeVolumeShares, 54538000);
  assert.equal(normalized.normalizedQuote.sourceFinality, "FINAL");
  assert.equal(normalized.normalizedQuote.providerTimestamp, "2023-05-29T05:30:00.000Z");
  assert.equal(normalized.normalizedQuote.lastTradeAt, "2023-05-29T05:30:00.000Z");
  assert.equal(normalized.fullMarketScan, false);

  const adapter = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    asOf: "2023-05-29T05:30:02.000Z",
    quote: normalized.normalizedQuote,
    continuityState: "CLEAR_NO_ACTION",
    sourceId: normalized.sourceId,
    sourceName: normalized.sourceName,
    officialSessionCloseConfirmed: true,
  });
  assert.equal(adapter.monitorEligible, true);
  assert.equal(adapter.currentDailyBarState, "FINAL");
  assert.equal(adapter.finalityState, "CONFIRMED_DAILY_CLOSE");
  assert.equal(adapter.currentDailyBar.close, 568);
  assert.equal(adapter.currentDailyBar.volumeShares, 54538000);
}

{
  const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    fetchedAt: "2023-05-29T05:30:01.000Z",
    rawQuote: {
      ...quote2330,
      avgPrice: 500,
    },
    rawTicker: ticker2330,
  });
  assert.equal(normalized.semanticVerified, false);
  assert.ok(normalized.semanticBlockers.includes("QUOTE_VOLUME_UNIT_NOT_VERIFIED"));
  assert.equal(normalized.volumeUnitCheck.state, "MISMATCH_VALUE_VOLUME_AVGPRICE");
  assert.equal(normalized.normalizedQuote.cumulativeVolumeShares, null);
  assert.equal(normalized.normalizedQuote.semanticContract, null);
}

{
  const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    fetchedAt: "2023-05-29T05:30:01.000Z",
    rawQuote: quote2330,
    rawTicker: {
      ...ticker2330,
      securityType: "24",
    },
  });
  assert.equal(normalized.semanticVerified, false);
  assert.ok(normalized.semanticBlockers.includes("SECURITY_TYPE_NOT_ORDINARY_STOCK"));
}

{
  const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    fetchedAt: "2023-05-29T05:30:01.000Z",
    rawQuote: quote2330,
    rawTicker: {
      ...ticker2330,
      securityStatus: "SUSPENDED",
    },
  });
  assert.equal(normalized.semanticVerified, false);
  assert.equal(normalized.normalizedQuote.isSuspended, true);
}

{
  const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    fetchedAt: "2023-05-29T05:30:01.000Z",
    rawQuote: quote2330,
    rawTicker: ticker2330,
    requestType: "ODDLOT",
  });
  assert.equal(normalized.semanticVerified, false);
  assert.ok(normalized.semanticBlockers.includes("ODDLOT_OR_NONREGULAR_REQUEST_NOT_SUPPORTED"));
}

{
  const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    fetchedAt: "2023-05-29T05:29:59.000Z",
    rawQuote: quote2330,
    rawTicker: ticker2330,
  });
  assert.equal(normalized.semanticVerified, false);
  assert.ok(normalized.semanticBlockers.includes("PROVIDER_TIMESTAMP_AFTER_FETCH"));
}

{
  const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    fetchedAt: "2023-05-29T05:30:01.000Z",
    rawQuote: {
      ...quote2330,
      isClose: false,
      isDelayedClose: true,
    },
    rawTicker: ticker2330,
  });
  assert.equal(normalized.semanticVerified, true);
  assert.equal(normalized.normalizedQuote.sourceFinality, "LIVE");
  assert.equal(normalized.normalizedQuote.isDelayedClose, true);

  const adapter = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    asOf: "2023-05-29T05:30:02.000Z",
    quote: normalized.normalizedQuote,
    continuityState: "CLEAR_NO_ACTION",
    sourceId: normalized.sourceId,
    sourceName: normalized.sourceName,
    officialSessionCloseConfirmed: true,
  });
  assert.equal(adapter.monitorEligible, false);
  assert.ok(adapter.blockers.includes("DELAYED_CLOSE_SESSION"));
}

{
  const normalized = normalizeFugleIntradayQuoteForDailyResonanceV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    fetchedAt: "2023-05-29T05:30:01.000Z",
    rawQuote: {
      ...quote2330,
      isLimitUpHalt: true,
      isClose: false,
    },
    rawTicker: ticker2330,
  });
  const adapter = buildCurrentDailyBarFromNormalizedQuoteV0_1({
    symbol: "2330",
    marketDate: "2023-05-29",
    asOf: "2023-05-29T05:30:02.000Z",
    quote: normalized.normalizedQuote,
    continuityState: "CLEAR_NO_ACTION",
    sourceId: normalized.sourceId,
    sourceName: normalized.sourceName,
  });
  assert.equal(adapter.monitorEligible, false);
  assert.ok(adapter.blockers.includes("VOLATILITY_INTERRUPTION_ACTIVE"));
}

console.log("System2 Fugle resonance quote normalizer V0.1 tests passed");
