import assert from "node:assert/strict";
import {
  buildB2IndustrySnapshotReceipt,
  parseIndustryDailyRows,
  parseIndustryProfiles,
} from "../runtime/b2_industry_snapshot_observer.mjs";

const twseProfiles = Array.from({ length: 620 }, (_, i) => ({
  公司代號: String(1101 + i).padStart(4, "0"),
  產業別: i % 2 ? "電子工業" : "食品工業",
  出表日期: "1150927",
}));
const tpexProfiles = Array.from({ length: 470 }, (_, i) => ({
  SecuritiesCompanyCode: String(3001 + i).padStart(4, "0"),
  SecuritiesIndustryCode: i % 2 ? "電子" : "其他",
  Date: "1150927",
}));
const twseDaily = twseProfiles.map((x, i) => ({
  Code: x.公司代號,
  Date: "20260927",
  ClosingPrice: "100",
  Change: i % 3 === 0 ? "1" : i % 3 === 1 ? "-1" : "0",
  TradeValue: "1000000",
}));
const tpexDaily = tpexProfiles.map((x, i) => ({
  SecuritiesCompanyCode: x.SecuritiesCompanyCode,
  Date: "1150927",
  Close: "50",
  ChangeAmount: i % 2 ? "0.5" : "-0.5",
  TransactionAmount: "500000",
}));

const p = parseIndustryProfiles(twseProfiles, "TWSE");
assert.equal(Object.keys(p.profiles).length, 620);
const d = parseIndustryDailyRows(twseDaily, "TWSE", "2026-09-27");
assert.equal(Object.keys(d.rows).length, 620);
assert.equal(d.state, "TARGET_DATE_OBSERVED");
assert.equal(d.payloadDate, "2026-09-27");
assert.equal(d.rows[twseProfiles[0].公司代號].direction, "UP");

const undated = parseIndustryDailyRows(
  twseDaily.map(({ Date, ...row }) => row),
  "TWSE",
  "2026-09-27",
);
assert.equal(undated.state, "INVALID_PAYLOAD");
assert.equal(Object.keys(undated.rows).length, 0);
assert.equal(undated.undatedOrdinarySymbolCount, 620);

const receipt = await buildB2IndustrySnapshotReceipt({
  receiptId: "B2-R1",
  marketDate: "2026-09-27",
  observedAt: "2026-09-27T10:00:00Z",
  twseProfileRows: twseProfiles,
  tpexProfileRows: tpexProfiles,
  twseDailyRows: twseDaily,
  tpexDailyRows: tpexDaily,
});
assert.equal(receipt.contractVersion, "0.2");
assert.equal(receipt.state, "DERIVED_SNAPSHOT_OBSERVED");
assert.equal(receipt.availabilityState, "READY");
assert.equal(receipt.marketCloseFinalityReached, true);
assert.equal(receipt.dependencyCoverageEligible, true);
assert.equal(receipt.thesisDirectionAssigned, false);
assert.equal(receipt.strategyScoreAssigned, false);
assert.ok(receipt.industries.length >= 4);
assert.equal(receipt.marketSummaries[0].classificationCoverageRate, 1);
assert.equal(receipt.marketSummaries[1].classificationCoverageRate, 1);

const missingProfiles = await buildB2IndustrySnapshotReceipt({
  receiptId: "B2-R2",
  marketDate: "2026-09-27",
  observedAt: "2026-09-27T10:00:00Z",
  twseProfileRows: [],
  tpexProfileRows: [],
  twseDailyRows: twseDaily,
  tpexDailyRows: tpexDaily,
});
assert.equal(missingProfiles.state, "DERIVED_SNAPSHOT_INCOMPLETE");
assert.equal(missingProfiles.dependencyCoverageEligible, false);


const beforeClose = await buildB2IndustrySnapshotReceipt({
  receiptId: "B2-R3",
  marketDate: "2026-09-27",
  observedAt: "2026-09-27T05:25:00Z",
  twseProfileRows: twseProfiles,
  tpexProfileRows: tpexProfiles,
  twseDailyRows: twseDaily,
  tpexDailyRows: tpexDaily,
});
assert.equal(beforeClose.availabilityState, "NOT_READY");
assert.equal(beforeClose.state, "DERIVED_SNAPSHOT_NOT_READY");
assert.equal(beforeClose.marketCloseFinalityReached, false);
assert.equal(beforeClose.dependencyCoverageEligible, false);

const undatedDaily = await buildB2IndustrySnapshotReceipt({
  receiptId: "B2-R4",
  marketDate: "2026-09-27",
  observedAt: "2026-09-27T10:00:00Z",
  twseProfileRows: twseProfiles,
  tpexProfileRows: tpexProfiles,
  twseDailyRows: twseDaily.map(({ Date, ...row }) => row),
  tpexDailyRows: tpexDaily.map(({ Date, ...row }) => row),
});
assert.equal(undatedDaily.availabilityState, "INVALID_PAYLOAD");
assert.equal(undatedDaily.dependencyCoverageEligible, false);

const thinClassification = await buildB2IndustrySnapshotReceipt({
  receiptId: "B2-R5",
  marketDate: "2026-09-27",
  observedAt: "2026-09-27T10:00:00Z",
  twseProfileRows: twseProfiles.slice(0, 1),
  tpexProfileRows: tpexProfiles.slice(0, 1),
  twseDailyRows: twseDaily,
  tpexDailyRows: tpexDaily,
});
assert.equal(thinClassification.availabilityState, "INVALID_PAYLOAD");
assert.equal(thinClassification.marketSummaries[0].classificationCoveragePass, false);
assert.equal(thinClassification.marketSummaries[1].classificationCoveragePass, false);
assert.equal(thinClassification.dependencyCoverageEligible, false);

console.log("System2 B2 industry snapshot observer tests passed");
