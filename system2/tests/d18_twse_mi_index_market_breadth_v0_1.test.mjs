import assert from "node:assert/strict";
import { normalizeTwseMiIndexMarketBreadthV0_1 } from "../runtime/d18_twse_mi_index_market_breadth_v0_1.mjs";

const payload = {
  tables: [
    {},
    {
      title: "115年10月02日 大盤統計資訊",
      fields: ["成交統計", "成交金額(元)", "成交股數(股)", "成交筆數"],
      data: [["1.一般股票", "863,798,395,102", "4,772,771,103", "3,688,015"]],
    },
    {
      title: "漲跌證券數合計",
      fields: ["類型", "整體市場", "股票"],
      data: [
        ["上漲(漲停)", "8,830(159)", "483(24)"],
        ["下跌(跌停)", "5,152(54)", "506(1)"],
        ["持平", "1,115", "91"],
        ["未成交", "16,950", "0"],
        ["無比價", "3,944", "2"],
      ],
      notes: [
        "\"漲跌價差\"為當日收盤價與前一日收盤價比較。",
        "\"無比價\"含前一日無收盤價、當日除權、除息、新上市、恢復交易者。",
      ],
    },
  ],
  type: "MS",
  stat: "OK",
  date: "20261002",
};

const args = {
  payload,
  targetDate: "2026-10-02",
  observedAt: "2026-10-02T07:52:00.000Z",
  decisionTimestamp: "2026-10-02T07:55:00.000Z",
};

const receipt = normalizeTwseMiIndexMarketBreadthV0_1(args);
assert.equal(receipt.state, "KNOWN");
assert.equal(receipt.pointInTimeEligible, true);
assert.equal(receipt.sourceDate, "20261002");
assert.equal(receipt.counts.advancers, 483);
assert.equal(receipt.counts.limitUp, 24);
assert.equal(receipt.counts.decliners, 506);
assert.equal(receipt.counts.limitDown, 1);
assert.equal(receipt.counts.unchanged, 91);
assert.equal(receipt.counts.untraded, 0);
assert.equal(receipt.counts.noComparison, 2);
assert.equal(receipt.comparableCount, 1080);
assert.equal(receipt.classificationBaseCount, 1082);
assert.equal(receipt.advanceShareComparable, 483 / 1080);
assert.equal(receipt.netBreadthShareComparable, (483 - 506) / 1080);
assert.equal(receipt.comparableCoveragePct, 1080 / 1082);
assert.equal(receipt.noComparisonPct, 2 / 1082);
assert.match(receipt.receiptHash, /^[0-9a-f]{64}$/);
assert.match(receipt.noComparisonSemantics, /EX_DIVIDEND/);

// Reordering unrelated tables must not alter the semantic receipt.
const reordered = normalizeTwseMiIndexMarketBreadthV0_1({
  ...args,
  payload: { ...payload, tables: [...payload.tables].reverse() },
});
assert.equal(reordered.receiptHash, receipt.receiptHash);

// Source date mismatch fails closed.
const stale = normalizeTwseMiIndexMarketBreadthV0_1({
  ...args,
  payload: { ...payload, date: "20261001" },
});
assert.equal(stale.state, "UNKNOWN");
assert.ok(stale.blockerCodes.includes("SOURCE_DATE_MISMATCH"));

// Source status must be OK.
const badStat = normalizeTwseMiIndexMarketBreadthV0_1({
  ...args,
  payload: { ...payload, stat: "查無資料" },
});
assert.equal(badStat.state, "UNKNOWN");
assert.ok(badStat.blockerCodes.includes("SOURCE_STAT_NOT_OK"));

// Missing / duplicated breadth tables fail closed.
const missingTable = normalizeTwseMiIndexMarketBreadthV0_1({
  ...args,
  payload: { ...payload, tables: [{}] },
});
assert.equal(missingTable.reason, "BREADTH_TABLE_NOT_FOUND");

const duplicateTable = normalizeTwseMiIndexMarketBreadthV0_1({
  ...args,
  payload: { ...payload, tables: [payload.tables[2], { ...payload.tables[2] }] },
});
assert.equal(duplicateTable.reason, "DUPLICATE_BREADTH_TABLE");

// Parent/subcount grammar must be valid and subset cannot exceed parent.
const impossibleLimitUp = structuredClone(payload);
impossibleLimitUp.tables[2].data[0][2] = "20(24)";
const impossible = normalizeTwseMiIndexMarketBreadthV0_1({ ...args, payload: impossibleLimitUp });
assert.equal(impossible.state, "UNKNOWN");
assert.ok(impossible.blockerCodes.includes("UP_ROW_INVALID"));

// No-comparison is never coerced into flat.
const noCompareHeavy = structuredClone(payload);
noCompareHeavy.tables[2].data[2][2] = "0";
noCompareHeavy.tables[2].data[3][2] = "10";
noCompareHeavy.tables[2].data[4][2] = "20";
const separated = normalizeTwseMiIndexMarketBreadthV0_1({ ...args, payload: noCompareHeavy });
assert.equal(separated.counts.unchanged, 0);
assert.equal(separated.counts.untraded, 10);
assert.equal(separated.counts.noComparison, 20);

// Future observation relative to the frozen decision timestamp fails closed.
const future = normalizeTwseMiIndexMarketBreadthV0_1({
  ...args,
  observedAt: "2026-10-02T07:56:00.000Z",
});
assert.equal(future.state, "UNKNOWN");
assert.ok(future.blockerCodes.includes("OBSERVED_AFTER_DECISION_CLOCK"));

// Schema drift in exact breadth fields fails closed.
const drift = structuredClone(payload);
drift.tables[2].fields = ["種類", "整體市場", "股票"];
const drifted = normalizeTwseMiIndexMarketBreadthV0_1({ ...args, payload: drift });
assert.equal(drifted.state, "UNKNOWN");
assert.equal(drifted.reason, "BREADTH_FIELDS_UNEXPECTED");

console.log("D18 TWSE MI_INDEX market breadth v0.1 tests passed");
