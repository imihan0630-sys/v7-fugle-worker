import assert from "node:assert/strict";
import { normalizeTwseOfficialMarketBreadthRowsV0_1 } from "../runtime/d18_twse_official_market_breadth_v0_1.mjs";

const rows = [
  {
    "出表日期": "1150930",
    "類型": "整體市場",
    "上漲": "3200",
    "漲停": "50",
    "下跌": "9000",
    "跌停": "300",
    "持平": "500",
    "未成交": "15000",
    "無比價": "2500"
  },
  {
    "出表日期": "1150930",
    "類型": "股票",
    "上漲": "342",
    "漲停": "19",
    "下跌": "671",
    "跌停": "10",
    "持平": "59",
    "未成交": "2",
    "無比價": "4"
  }
];

const baseArgs = {
  rows,
  targetDate: "2026-09-30",
  observedAt: "2026-09-30T06:00:00.000Z",
  decisionTimestamp: "2026-09-30T06:05:00.000Z",
};

const receipt = normalizeTwseOfficialMarketBreadthRowsV0_1(baseArgs);
assert.equal(receipt.state, "KNOWN");
assert.equal(receipt.pointInTimeEligible, true);
assert.equal(receipt.counts.advancers, 342);
assert.equal(receipt.counts.limitUp, 19);
assert.equal(receipt.counts.decliners, 671);
assert.equal(receipt.counts.limitDown, 10);
assert.equal(receipt.counts.unchanged, 59);
assert.equal(receipt.counts.untraded, 2);
assert.equal(receipt.counts.noComparison, 4);
assert.equal(receipt.comparableCount, 1072);
assert.equal(receipt.classificationBaseCount, 1078);
assert.equal(receipt.advanceShareComparable, 342 / 1072);
assert.equal(receipt.netBreadthShareComparable, (342 - 671) / 1072);
assert.equal(receipt.comparableCoveragePct, 1072 / 1078);
assert.equal(receipt.untradedPct, 2 / 1078);
assert.equal(receipt.noComparisonPct, 4 / 1078);
assert.equal(receipt.universeSemantics, "TWSE_EXCHANGE_STOCK_CATEGORY_NOT_COMMON_STOCK_RECONSTRUCTION");
assert.match(receipt.receiptHash, /^[0-9a-f]{64}$/);

// Row order must not matter because the target is identified semantically.
const reordered = normalizeTwseOfficialMarketBreadthRowsV0_1({ ...baseArgs, rows: [...rows].reverse() });
assert.equal(reordered.receiptHash, receipt.receiptHash);

// A stale source date must fail closed instead of being relabeled as today's breadth.
const stale = normalizeTwseOfficialMarketBreadthRowsV0_1({
  ...baseArgs,
  rows: rows.map((row) => ({ ...row, "出表日期": "1150929" })),
});
assert.equal(stale.state, "UNKNOWN");
assert.equal(stale.reason, "TARGET_DATE_STOCK_ROW_NOT_FOUND");

// Duplicate stock rows cannot be silently selected.
const duplicate = normalizeTwseOfficialMarketBreadthRowsV0_1({
  ...baseArgs,
  rows: [rows[1], { ...rows[1] }],
});
assert.equal(duplicate.state, "UNKNOWN");
assert.equal(duplicate.reason, "DUPLICATE_TARGET_DATE_STOCK_ROW");

// Future observation relative to the decision clock fails closed.
const future = normalizeTwseOfficialMarketBreadthRowsV0_1({
  ...baseArgs,
  observedAt: "2026-09-30T06:06:00.000Z",
});
assert.equal(future.state, "UNKNOWN");
assert.ok(future.blockerCodes.includes("OBSERVED_AFTER_DECISION_CLOCK"));

// Limit-up/down are subsets of up/down and therefore cannot exceed their parent counts.
const impossible = normalizeTwseOfficialMarketBreadthRowsV0_1({
  ...baseArgs,
  rows: [{ ...rows[1], "漲停": "400" }],
});
assert.equal(impossible.state, "UNKNOWN");
assert.ok(impossible.blockerCodes.includes("LIMIT_UP_EXCEEDS_ADVANCERS"));

// Untraded / no-comparison are reported explicitly and never coerced into unchanged.
const noCompareHeavy = normalizeTwseOfficialMarketBreadthRowsV0_1({
  ...baseArgs,
  rows: [{ ...rows[1], "持平": "0", "未成交": "10", "無比價": "20" }],
});
assert.equal(noCompareHeavy.counts.unchanged, 0);
assert.equal(noCompareHeavy.counts.untraded, 10);
assert.equal(noCompareHeavy.counts.noComparison, 20);
assert.equal(noCompareHeavy.classificationBaseCount, 342 + 671 + 10 + 20);

console.log("D18 TWSE official market breadth v0.1 tests passed");
