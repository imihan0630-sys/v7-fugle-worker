import assert from "node:assert/strict";
import {
  buildA5FilingVintageReceipt,
  parseA5Rows,
} from "../runtime/a5_filing_vintage_observer.mjs";

const twseRows = Array.from({ length: 620 }, (_, i) => ({
  出表日期: "1150927",
  年度: "115",
  季別: "2",
  公司代號: String(1101 + i).padStart(4, "0"),
  公司名稱: `TWSE-${i}`,
  產業別: i % 2 ? "電子工業" : "食品工業",
  "基本每股盈餘(元)": "1.0",
}));
const tpexRows = Array.from({ length: 470 }, (_, i) => ({
  Date: "1150927",
  Year: "115",
  Quarter: "2",
  SecuritiesCompanyCode: String(3001 + i).padStart(4, "0"),
  SecuritiesIndustryCode: i % 2 ? "電子" : "其他",
}));

const parsed = parseA5Rows([
  { ...twseRows[0], 年度: "114", 季別: "4" },
  twseRows[0],
], "TWSE", "EPS");
assert.equal(parsed.bySymbol[twseRows[0].公司代號].vintageKey, "2026Q2");
assert.equal(parsed.latestOutputDate, "2026-09-27");

const receipt = await buildA5FilingVintageReceipt({
  receiptId: "A5-R1",
  observedAt: "2026-09-27T10:00:00Z",
  twseEpsRows: twseRows,
  twseProfitRows: twseRows,
  tpexEpsRows: tpexRows,
  tpexProfitRows: tpexRows,
});
assert.equal(receipt.state, "OBSERVED_COVERAGE_PASS");
assert.equal(receipt.dependencyCoverageEligible, true);
assert.equal(receipt.publicationTimestampProven, false);
assert.equal(receipt.companyFilingTimestampProven, false);
assert.equal(receipt.markets[0].dominantVintage.key, "2026Q2");
assert.equal(receipt.markets[1].dominantVintage.key, "2026Q2");

const incomplete = await buildA5FilingVintageReceipt({
  receiptId: "A5-R2",
  observedAt: "2026-09-27T10:00:00Z",
  twseEpsRows: twseRows.slice(0, 20),
  twseProfitRows: twseRows.slice(0, 20),
  tpexEpsRows: tpexRows.slice(0, 20),
  tpexProfitRows: tpexRows.slice(0, 20),
});
assert.equal(incomplete.state, "OBSERVED_COVERAGE_INCOMPLETE");
assert.equal(incomplete.dependencyCoverageEligible, false);

console.log("System2 A5 filing-vintage observer tests passed");
