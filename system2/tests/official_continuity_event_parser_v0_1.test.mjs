import assert from "node:assert/strict";
import {
  parseOfficialHistoricalContinuityPayloadV0_1,
  officialContinuityEventParserSourceConfigV0_1,
} from "../runtime/official_continuity_event_parser_v0_1.mjs";

const start = "2026-04-05";
const end = "2026-10-02";
const fetchedAt = "2026-10-03T15:30:00.000Z";

function twse(fields, data, extra = {}) {
  return JSON.stringify({
    stat: "OK",
    strDate: "20260405",
    endDate: "20261002",
    fields,
    data,
    ...extra,
  });
}

function tpex(fields, data) {
  return JSON.stringify({
    stat: "ok",
    date: "2026/04/05~2026/10/02",
    tables: [{ fields, data, totalCount: data.length }],
  });
}

const fixtures = {
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL: twse(
    ["資料日期","股票代號","股票名稱","除權息前收盤價","除權息參考價","權值+息值","權/息","詳細資料"],
    [["115/09/21","2330","台積電","100","95","5","息","fixture"]],
  ),
  TWSE_CAPITAL_REDUCTION_REFERENCE: twse(
    ["恢復買賣日期","股票代號","名稱","停止買賣前收盤價格","恢復買賣參考價","減資原因","詳細資料"],
    [["115/09/22","3356","奇偶","50","55","退還股款","fixture"]],
  ),
  TWSE_PAR_VALUE_CHANGE_REFERENCE: JSON.stringify({
    stat: "OK",
    params: { startDate: "20260405", endDate: "20261002" },
    fields: ["恢復買賣日期","股票代號","名稱","停止買賣前收盤價格","恢復買賣參考價","詳細資料"],
    data: [["115/09/23","6548","長科*","20","40","fixture"]],
  }),
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL: tpex(
    ["除權息日期","代號","名稱","除權息前收盤價","除權息參考價","權值","息值","權值+息值","權/息","詳細資料"],
    [["115/09/24","6488","環球晶","500","490","0","10","10","息","fixture"]],
  ),
  TPEX_CAPITAL_REDUCTION_REFERENCE: tpex(
    ["恢復買賣日期","股票代號","名稱","最後交易日之收盤價格","減資恢復買賣開始日參考價格","減資原因","詳細資料"],
    [["115/09/25","4530","宏易","20","25","彌補虧損","fixture"]],
  ),
  TPEX_PAR_VALUE_CHANGE_REFERENCE: tpex(
    ["恢復買賣日期","證券代號","證券名稱","最後交易日之收盤價格","恢復買賣開始參考價","詳細資料"],
    [["115/09/28","5314","世紀*","30","60","fixture"]],
  ),
};

const config = officialContinuityEventParserSourceConfigV0_1();
assert.equal(Object.keys(config).length, 6);

for (const [sourceId, rawText] of Object.entries(fixtures)) {
  const parsed = await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,
    sourceUrl: "https://example.invalid/" + sourceId,
    rawText,
    fetchedAt,
    requestedStartDate: start,
    requestedEndDate: end,
  });
  assert.equal(parsed.state, "PARSED", sourceId);
  assert.equal(parsed.responseRangeVerified, true, sourceId);
  assert.equal(parsed.parserComplete, true, sourceId);
  assert.equal(parsed.ordinaryRowCount, 1, sourceId);
  assert.equal(parsed.eventCount, 1, sourceId);
  assert.equal(parsed.events[0].firstKnownAt, null, sourceId);
  assert.equal(parsed.events[0].availableAt, null, sourceId);
  assert.equal(parsed.events[0].knowledgeTimeClass, "UNKNOWN_HISTORICAL_FIRST_KNOWN", sourceId);
  assert.equal(parsed.events[0].pitEventReplayEligible, false, sourceId);
  assert.equal(parsed.events[0].technicalContinuityEvidenceEligible, true, sourceId);
  assert.equal(parsed.revisionCoverageComplete, false, sourceId);
  assert.equal(parsed.emptyRangeSemanticsCertified, false, sourceId);
  assert.equal(parsed.noEventMayBeClaimed, false, sourceId);
  assert.equal(parsed.technicalContinuityCertified, false, sourceId);
  assert.equal(parsed.selectionAuthority, false, sourceId);
  assert.equal(parsed.system1RuntimeUsed, false, sourceId);
}

const mismatch = await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  sourceUrl: "https://example.invalid/mismatch",
  rawText: JSON.stringify({
    stat: "OK",
    strDate: "20260406",
    endDate: "20261002",
    fields: ["資料日期","股票代號","除權息前收盤價","除權息參考價"],
    data: [["115/09/21","2330","100","95"]],
  }),
  fetchedAt,
  requestedStartDate: start,
  requestedEndDate: end,
});
assert.equal(mismatch.state, "RANGE_UNVERIFIED");
assert.equal(mismatch.responseRangeVerified, false);
assert.equal(mismatch.eventCount, 0);
assert.equal(mismatch.noEventMayBeClaimed, false);

const badDate = await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  sourceUrl: "https://example.invalid/bad-date",
  rawText: tpex(
    ["恢復買賣日期","股票代號","名稱","最後交易日之收盤價格","減資恢復買賣開始日參考價格","減資原因"],
    [["not-a-date","4530","宏易","20","25","彌補虧損"]],
  ),
  fetchedAt,
  requestedStartDate: start,
  requestedEndDate: end,
});
assert.equal(badDate.state, "PARSED_WITH_FAILURES");
assert.equal(badDate.parserComplete, false);
assert.equal(badDate.parseFailureCount, 1);
assert.equal(badDate.eventCount, 0);
assert.equal(badDate.noEventMayBeClaimed, false);

const missingPrice = await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId: "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  sourceUrl: "https://example.invalid/missing-price",
  rawText: twse(
    ["恢復買賣日期","股票代號","名稱","停止買賣前收盤價格","恢復買賣參考價"],
    [["115/09/23","6548","長科*","-","40"]],
  ),
  fetchedAt,
  requestedStartDate: start,
  requestedEndDate: end,
});
assert.equal(missingPrice.state, "PARSED");
assert.equal(missingPrice.events[0].continuityEffectState, "UNKNOWN");
assert.equal(missingPrice.events[0].technicalContinuityEvidenceEligible, false);
assert.deepEqual(missingPrice.events[0].readinessReasons, ["OFFICIAL_REFERENCE_PRICE_PAIR_INCOMPLETE"]);

const nonOrdinaryOnly = await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  sourceUrl: "https://example.invalid/non-ordinary",
  rawText: twse(
    ["資料日期","股票代號","股票名稱","除權息前收盤價","除權息參考價"],
    [["115/09/21","0050","ETF","100","99"]],
  ),
  fetchedAt,
  requestedStartDate: start,
  requestedEndDate: end,
});
assert.equal(nonOrdinaryOnly.state, "PARSED_NO_ORDINARY_ROWS_UNCERTIFIED");
assert.equal(nonOrdinaryOnly.ordinaryRowCount, 0);
assert.equal(nonOrdinaryOnly.eventCount, 0);
assert.equal(nonOrdinaryOnly.emptyRangeSemanticsCertified, false);
assert.equal(nonOrdinaryOnly.noEventMayBeClaimed, false);

await assert.rejects(
  parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId: "UNSUPPORTED",
    sourceUrl: "https://example.invalid/nope",
    rawText: "{}",
    fetchedAt,
    requestedStartDate: start,
    requestedEndDate: end,
  }),
  /unsupported historical continuity sourceId/,
);

console.log("System2 official continuity event parser tests passed");
