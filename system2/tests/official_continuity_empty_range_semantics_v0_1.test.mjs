import assert from "node:assert/strict";
import { characterizeOfficialContinuityEmptyRangeV0_1, certifyOfficialContinuityEmptyRangeV0_1, officialContinuityEmptyRangeCertificationRulesV0_1 } from "../runtime/official_continuity_empty_range_semantics_v0_1.mjs";

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


const rules = officialContinuityEmptyRangeCertificationRulesV0_1();
assert.equal(rules.TWSE_EX_RIGHT_DIVIDEND_ACTUAL.positiveControlDate, "2026-04-08");
assert.equal(rules.TWSE_CAPITAL_REDUCTION_REFERENCE.positiveControlDate, "2026-06-29");

const twseParCertified = certifyOfficialContinuityEmptyRangeV0_1({
  observation: await characterizeOfficialContinuityEmptyRangeV0_1({
    sourceId: "TWSE_PAR_VALUE_CHANGE_REFERENCE",
    requestedStartDate: "2026-10-03",
    requestedEndDate: "2026-10-03",
    rawText: JSON.stringify({
      stat: "OK",
      params: { startDate: "20261003", endDate: "20261003" },
      fields: ["恢復買賣日期", "股票代號"],
      data: [],
    }),
    httpStatus: 200,
  }),
});
assert.equal(twseParCertified.emptyRangeSemanticsCertified, true);
assert.equal(twseParCertified.noEventMayBeClaimed, false);

const tpexCertified = certifyOfficialContinuityEmptyRangeV0_1({
  observation: tpexExactEmpty,
});
assert.equal(tpexCertified.emptyRangeSemanticsCertified, true);
assert.equal(tpexCertified.positiveControlRequired, false);

const twseNoDataTarget = await characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  requestedStartDate: "2026-10-03",
  requestedEndDate: "2026-10-03",
  rawText: JSON.stringify({ stat: "很抱歉，沒有符合條件的資料!" }),
  httpStatus: 200,
});
assert.equal(twseNoDataTarget.state, "EMPTY_OR_NO_DATA_RANGE_UNVERIFIED");

const twsePositiveControl = await characterizeOfficialContinuityEmptyRangeV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  requestedStartDate: "2026-04-08",
  requestedEndDate: "2026-04-08",
  rawText: JSON.stringify({
    stat: "OK",
    strDate: "20260408",
    endDate: "20260408",
    fields: ["資料日期", "股票代號"],
    data: [["115/04/08", "3164"]],
  }),
  httpStatus: 200,
});
assert.equal(twsePositiveControl.state, "NON_EMPTY_RANGE");
assert.equal(twsePositiveControl.responseRangeVerified, true);

const twseControlledCertified = certifyOfficialContinuityEmptyRangeV0_1({
  observation: twseNoDataTarget,
  positiveControl: twsePositiveControl,
});
assert.equal(twseControlledCertified.emptyRangeSemanticsCertified, true);
assert.equal(twseControlledCertified.positiveControlMatched, true);
assert.deepEqual(twseControlledCertified.certificationBlockers, []);

const missingControl = certifyOfficialContinuityEmptyRangeV0_1({
  observation: twseNoDataTarget,
});
assert.equal(missingControl.emptyRangeSemanticsCertified, false);
assert.ok(missingControl.certificationBlockers.includes("POSITIVE_CONTROL_NOT_VERIFIED"));

const wrongStatus = certifyOfficialContinuityEmptyRangeV0_1({
  observation: await characterizeOfficialContinuityEmptyRangeV0_1({
    sourceId: "TWSE_CAPITAL_REDUCTION_REFERENCE",
    requestedStartDate: "2026-10-03",
    requestedEndDate: "2026-10-03",
    rawText: JSON.stringify({ stat: "no data" }),
    httpStatus: 200,
  }),
  positiveControl: await characterizeOfficialContinuityEmptyRangeV0_1({
    sourceId: "TWSE_CAPITAL_REDUCTION_REFERENCE",
    requestedStartDate: "2026-06-29",
    requestedEndDate: "2026-06-29",
    rawText: JSON.stringify({
      stat: "OK",
      strDate: "20260629",
      endDate: "20260629",
      fields: ["恢復買賣日期", "股票代號"],
      data: [["115/06/29", "2380"]],
    }),
    httpStatus: 200,
  }),
});
assert.equal(wrongStatus.emptyRangeSemanticsCertified, false);
assert.ok(wrongStatus.certificationBlockers.includes("TARGET_NO_DATA_STATUS_MISMATCH"));

console.log("System2 official continuity empty-range certification tests passed");
