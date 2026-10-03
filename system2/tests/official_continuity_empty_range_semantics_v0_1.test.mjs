import assert from "node:assert/strict";
import { characterizeOfficialContinuityEmptyRangeV0_1 } from "../runtime/official_continuity_empty_range_semantics_v0_1.mjs";

const sourceId = "TWSE_EX_RIGHT_DIVIDEND_ACTUAL";

const exactEmpty = await characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId,
  requestedStartDate: "2026-10-03",
  requestedEndDate: "2026-10-03",
  rawText: JSON.stringify({
    stat: "OK",
    strDate: "20261003",
    endDate: "20261003",
    fields: ["資料日期", "股票代號"],
    data: [],
  }),
  httpStatus: 200,
  contentType: "application/json",
});
assert.equal(exactEmpty.state, "EXACT_RANGE_ZERO_ROWS_OBSERVED");
assert.equal(exactEmpty.responseRangeVerified, true);
assert.equal(exactEmpty.zeroRows, true);
assert.equal(exactEmpty.emptyRangeResponseCandidate, true);
assert.equal(exactEmpty.emptyRangeSemanticsCertified, false);
assert.equal(exactEmpty.noEventMayBeClaimed, false);
assert.equal(exactEmpty.technicalContinuityCertified, false);

const tpexExactEmpty = await characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  requestedStartDate: "2026-10-03",
  requestedEndDate: "2026-10-03",
  rawText: JSON.stringify({
    stat: "ok",
    date: "2026/10/03~2026/10/03",
    tables: [{
      fields: ["恢復買賣日期", "股票代號"],
      data: [],
      totalCount: 0,
    }],
  }),
  httpStatus: 200,
});
assert.equal(tpexExactEmpty.state, "EXACT_RANGE_ZERO_ROWS_OBSERVED");
assert.equal(tpexExactEmpty.emptyRangeResponseCandidate, true);
assert.equal(tpexExactEmpty.emptyRangeSemanticsCertified, false);

const missingRange = await characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId,
  requestedStartDate: "2026-10-03",
  requestedEndDate: "2026-10-03",
  rawText: JSON.stringify({
    stat: "很抱歉，沒有符合條件的資料!",
    fields: ["資料日期", "股票代號"],
    data: [],
  }),
  httpStatus: 200,
});
assert.equal(missingRange.state, "ZERO_ROWS_RANGE_IDENTITY_MISSING");
assert.equal(missingRange.responseRangeVerified, false);
assert.equal(missingRange.emptyRangeResponseCandidate, false);
assert.equal(missingRange.noEventMayBeClaimed, false);

const noContainer = await characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId,
  requestedStartDate: "2026-10-03",
  requestedEndDate: "2026-10-03",
  rawText: JSON.stringify({
    stat: "很抱歉，沒有符合條件的資料!",
    strDate: "20261003",
    endDate: "20261003",
  }),
  httpStatus: 200,
});
assert.equal(noContainer.state, "EXACT_RANGE_WITHOUT_ROW_CONTAINER");
assert.equal(noContainer.zeroRows, false);
assert.equal(noContainer.emptyRangeResponseCandidate, false);

const nonEmpty = await characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId: "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  requestedStartDate: "2026-10-02",
  requestedEndDate: "2026-10-02",
  rawText: JSON.stringify({
    stat: "ok",
    date: "2026/10/02~2026/10/02",
    tables: [{
      fields: ["除權息日期", "代號"],
      data: [["115/10/02", "6488"]],
    }],
  }),
  httpStatus: 200,
});
assert.equal(nonEmpty.state, "NON_EMPTY_RANGE");
assert.equal(nonEmpty.zeroRows, false);
assert.equal(nonEmpty.emptyRangeResponseCandidate, false);

const httpError = await characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId: "TWSE_CAPITAL_REDUCTION_REFERENCE",
  requestedStartDate: "2026-10-03",
  requestedEndDate: "2026-10-03",
  rawText: "upstream unavailable",
  httpStatus: 520,
  contentType: "text/html",
});
assert.equal(httpError.state, "HTTP_ERROR");
assert.equal(httpError.httpOk, false);
assert.equal(httpError.emptyRangeSemanticsCertified, false);

await assert.rejects(
  characterizeOfficialContinuityEmptyRangeV0_1({
    sourceId: "UNSUPPORTED",
    requestedStartDate: "2026-10-03",
    requestedEndDate: "2026-10-03",
    rawText: "{}",
  }),
  /unsupported historical sourceId/,
);

console.log("System2 official continuity empty-range characterization tests passed");
