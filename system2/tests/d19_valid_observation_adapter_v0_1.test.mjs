import assert from "node:assert/strict";
import {
  D19_OBSERVATION_STATES_V0_1,
  D19_WINDOW_POLICIES_V0_1,
  classifyD19ObservationV0_1,
  evaluateD19MomentumWindowV0_1,
} from "../runtime/d19_valid_observation_adapter_v0_1.mjs";

function dateAt(offset) {
  const d = new Date("2026-08-03T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

function sourceRow({ marketDate, close, volumeShares = 1000, tradeValue = 100000, transactions = 100, suffix = "" }) {
  return {
    market: "TWSE",
    symbol: "2330",
    marketDate,
    open: close,
    high: close,
    low: close,
    close,
    volumeShares,
    tradeValue,
    transactions,
    sourceRowHash: "SRC-" + marketDate + suffix,
  };
}

const valid = [];
for (let i = 0; i < 21; i += 1) {
  const date = dateAt(i);
  valid.push(await classifyD19ObservationV0_1({
    market: "TWSE",
    symbol: "2330",
    marketDate: date,
    sourceRow: sourceRow({ marketDate: date, close: 100 + i }),
  }));
}
assert.ok(valid.every((x) => x.state === D19_OBSERVATION_STATES_V0_1.ELIGIBLE_VALID_PRICE_SESSION));

const strictReady = await evaluateD19MomentumWindowV0_1({
  market: "TWSE",
  symbol: "2330",
  decisionMarketDate: valid.at(-1).marketDate,
  policyId: D19_WINDOW_POLICIES_V0_1.CALENDAR_20_STRICT_V0_1,
  observations: valid,
});
assert.equal(strictReady.state, "READY");
assert.equal(strictReady.validObservationCount, 21);
assert.equal(strictReady.marketSessionCountScanned, 21);
assert.equal(strictReady.returnValue, 120 / 100 - 1);
assert.equal(strictReady.forwardFillPerformed, false);
assert.equal(strictReady.previousCloseSubstitutionPerformed, false);
assert.equal(strictReady.zeroTradeConvertedToReturnZero, false);
assert.equal(strictReady.formalSelectionAuthorized, false);
assert.equal(strictReady.productionImpact, false);

const strictReordered = await evaluateD19MomentumWindowV0_1({
  market: "TWSE",
  symbol: "2330",
  decisionMarketDate: valid.at(-1).marketDate,
  policyId: D19_WINDOW_POLICIES_V0_1.CALENDAR_20_STRICT_V0_1,
  observations: [...valid].reverse(),
});
assert.equal(strictReady.receiptHash, strictReordered.receiptHash);

const zeroTradeDate = valid[10].marketDate;
const zeroTrade = await classifyD19ObservationV0_1({
  market: "TWSE",
  symbol: "2330",
  marketDate: zeroTradeDate,
  sourceRow: {
    market: "TWSE",
    symbol: "2330",
    marketDate: zeroTradeDate,
    open: null,
    high: null,
    low: null,
    close: null,
    volumeShares: 0,
    tradeValue: 0,
    transactions: 0,
    sourceRowHash: "ZERO-" + zeroTradeDate,
  },
});
assert.equal(zeroTrade.state, D19_OBSERVATION_STATES_V0_1.OFFICIAL_ZERO_TRADE_ROW);
assert.equal(zeroTrade.close, null);

const strictWithZero = await evaluateD19MomentumWindowV0_1({
  market: "TWSE",
  symbol: "2330",
  decisionMarketDate: valid.at(-1).marketDate,
  policyId: D19_WINDOW_POLICIES_V0_1.CALENDAR_20_STRICT_V0_1,
  observations: valid.map((x) => x.marketDate === zeroTradeDate ? zeroTrade : x),
});
assert.equal(strictWithZero.state, "INCOMPLETE");
assert.ok(strictWithZero.blockerCodes.some((x) => x.includes("STRICT_WINDOW_NON_PRICE_STATE")));
assert.equal(strictWithZero.returnValue, null);

const extraOldDate = "2026-08-02";
const extraOld = await classifyD19ObservationV0_1({
  market: "TWSE",
  symbol: "2330",
  marketDate: extraOldDate,
  sourceRow: sourceRow({ marketDate: extraOldDate, close: 99 }),
});
const validObservationReady = await evaluateD19MomentumWindowV0_1({
  market: "TWSE",
  symbol: "2330",
  decisionMarketDate: valid.at(-1).marketDate,
  policyId: D19_WINDOW_POLICIES_V0_1.VALID_OBSERVATION_20_V0_1,
  observations: [extraOld, ...valid.map((x) => x.marketDate === zeroTradeDate ? zeroTrade : x)],
  maxCalendarSpanSessions: 22,
});
assert.equal(validObservationReady.state, "READY");
assert.equal(validObservationReady.validObservationCount, 21);
assert.equal(validObservationReady.stateCounts.OFFICIAL_ZERO_TRADE_ROW, 1);
assert.equal(validObservationReady.returnValue, 120 / 99 - 1);

const missingSpanParameter = await evaluateD19MomentumWindowV0_1({
  market: "TWSE",
  symbol: "2330",
  decisionMarketDate: valid.at(-1).marketDate,
  policyId: D19_WINDOW_POLICIES_V0_1.VALID_OBSERVATION_20_V0_1,
  observations: [extraOld, ...valid.map((x) => x.marketDate === zeroTradeDate ? zeroTrade : x)],
});
assert.equal(missingSpanParameter.state, "INCOMPLETE");
assert.ok(missingSpanParameter.blockerCodes.includes("MAX_CALENDAR_SPAN_SESSIONS_REQUIRED"));

const unresolvedDate = valid[8].marketDate;
const unresolved = await classifyD19ObservationV0_1({
  market: "TWSE",
  symbol: "2330",
  marketDate: unresolvedDate,
  sourceRow: {
    market: "TWSE",
    symbol: "2330",
    marketDate: unresolvedDate,
    open: null,
    high: null,
    low: null,
    close: null,
    volumeShares: 5000,
    tradeValue: 900000,
    transactions: 321,
    sourceRowHash: "UNRESOLVED-" + unresolvedDate,
  },
});
assert.equal(
  unresolved.state,
  D19_OBSERVATION_STATES_V0_1.UNRESOLVED_TRADING_ACTIVITY_WITHOUT_VALID_CLOSE,
);
assert.equal(unresolved.close, null);

const unresolvedWindow = await evaluateD19MomentumWindowV0_1({
  market: "TWSE",
  symbol: "2330",
  decisionMarketDate: valid.at(-1).marketDate,
  policyId: D19_WINDOW_POLICIES_V0_1.VALID_OBSERVATION_20_V0_1,
  observations: [extraOld, ...valid.map((x) => x.marketDate === unresolvedDate ? unresolved : x)],
  maxCalendarSpanSessions: 22,
});
assert.equal(unresolvedWindow.state, "INCOMPLETE");
assert.ok(unresolvedWindow.blockerCodes.some((x) => x.startsWith("UNRESOLVED_PRICE_SEMANTICS:")));
assert.equal(unresolvedWindow.returnValue, null);

const sourceUnknown = await classifyD19ObservationV0_1({
  market: "TWSE",
  symbol: "2330",
  marketDate: valid[7].marketDate,
  sourceRow: null,
});
assert.equal(sourceUnknown.state, D19_OBSERVATION_STATES_V0_1.SOURCE_UNKNOWN);

const verifiedNonTrading = await classifyD19ObservationV0_1({
  market: "TWSE",
  symbol: "2330",
  marketDate: valid[6].marketDate,
  sourceRow: null,
  externalSessionEvidence: {
    state: "VERIFIED_NONTRADING_OR_EXCLUDED_SESSION",
    marketDate: valid[6].marketDate,
    reasonCode: "OFFICIAL_TEMPORARY_SUSPENSION",
    sourceId: "TWSE_TWTAWU",
    sourceHash: "OFFICIAL-SUSPENSION-HASH",
  },
});
assert.equal(
  verifiedNonTrading.state,
  D19_OBSERVATION_STATES_V0_1.VERIFIED_NONTRADING_OR_EXCLUDED_SESSION,
);
assert.equal(verifiedNonTrading.localSuspensionInferencePerformed, false);

await assert.rejects(
  () => classifyD19ObservationV0_1({
    market: "TWSE",
    symbol: "2330",
    marketDate: valid[6].marketDate,
    sourceRow: null,
    externalSessionEvidence: {
      state: "VERIFIED_NONTRADING_OR_EXCLUDED_SESSION",
      marketDate: valid[6].marketDate,
      reasonCode: "OFFICIAL_TEMPORARY_SUSPENSION",
      sourceId: "TWSE_TWTAWU",
    },
  }),
  /sourceHash is required/,
);

const decisionZero = await evaluateD19MomentumWindowV0_1({
  market: "TWSE",
  symbol: "2330",
  decisionMarketDate: valid.at(-1).marketDate,
  policyId: D19_WINDOW_POLICIES_V0_1.VALID_OBSERVATION_20_V0_1,
  observations: [
    extraOld,
    ...valid.slice(0, -1),
    await classifyD19ObservationV0_1({
      market: "TWSE",
      symbol: "2330",
      marketDate: valid.at(-1).marketDate,
      sourceRow: {
        market: "TWSE",
        symbol: "2330",
        marketDate: valid.at(-1).marketDate,
        open: null,
        high: null,
        low: null,
        close: null,
        volumeShares: 0,
        tradeValue: 0,
        transactions: 0,
        sourceRowHash: "DECISION-ZERO",
      },
    }),
  ],
  maxCalendarSpanSessions: 22,
});
assert.equal(decisionZero.state, "INCOMPLETE");
assert.ok(decisionZero.blockerCodes.some((x) => x.startsWith("DECISION_SESSION_NOT_VALID_PRICE:")));

await assert.rejects(
  () => evaluateD19MomentumWindowV0_1({
    market: "TWSE",
    symbol: "2330",
    decisionMarketDate: valid.at(-1).marketDate,
    policyId: D19_WINDOW_POLICIES_V0_1.CALENDAR_20_STRICT_V0_1,
    observations: [valid[0], valid[0], ...valid.slice(1)],
  }),
  /duplicate observation marketDate/,
);

console.log("D19 valid-observation contract v0.1 tests passed");
