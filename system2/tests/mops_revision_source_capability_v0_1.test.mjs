import assert from "node:assert/strict";
import {
  buildMopsHistoricalMaterialInformationRequestV0_1,
  parseMopsHistoricalMaterialInformationHtmlV0_1,
  probeMopsRevisionSourceCapabilityV0_1,
} from "../runtime/mops_revision_source_capability_v0_1.mjs";

const request = buildMopsHistoricalMaterialInformationRequestV0_1({
  stockCode: "2467",
  rocYear: 115,
  month: 5,
});
assert.equal(request.body.apiName, "ajax_t05st01");
assert.equal(request.body.parameters.co_id, "2467");
assert.equal(request.body.parameters.year, "115");
assert.equal(request.body.parameters.month, "5");

const html = `
<table>
<tr><th>公司代號</th><th>公司名稱</th><th>發言日期</th><th>發言時間</th><th>主旨</th></tr>
<tr><td>2467</td><td>志聖</td><td>115/05/22</td><td>16:34:06</td><td>公告本公司除息基準日等相關事宜</td>
<td><input onclick="document.t05st01_fm.seq_no.value='3';document.t05st01_fm.spoke_time.value='163406';document.t05st01_fm.spoke_date.value='20260522';document.t05st01_fm.TYPEK.value='sii';"/></td></tr>
<tr><td>2467</td><td>志聖</td><td>115/05/22</td><td>17:42:13</td><td>公告本公司除息基準日等相關事宜(更正)</td>
<td><input onclick="document.t05st01_fm.seq_no.value='4';document.t05st01_fm.spoke_time.value='174213';document.t05st01_fm.spoke_date.value='20260522';document.t05st01_fm.TYPEK.value='sii';"/></td></tr>
</table>`;

const parsed = parseMopsHistoricalMaterialInformationHtmlV0_1({
  html,
  stockCode: "2467",
  expectedDate: "2026-05-22",
  baseSubject: "公告本公司除息基準日等相關事宜",
});
assert.equal(parsed.matchingSubjectRowCount, 2);
assert.equal(parsed.originalRowCount, 1);
assert.equal(parsed.correctionOrCancellationRowCount, 1);
assert.equal(parsed.distinctVersionKeyCount, 2);
assert.equal(parsed.rows[0].seqNo, "3");
assert.equal(parsed.rows[1].seqNo, "4");

const fetchImpl = async (url, options = {}) => {
  if (String(url).includes("/mops/api/redirectToOld")) {
    assert.equal(options.method, "POST");
    const body = JSON.parse(options.body);
    assert.equal(body.apiName, "ajax_t05st01");
    return {
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      text: async () => JSON.stringify({
        code: 200,
        result: { url: "https://mopsov.twse.com.tw/mops/web/example-token" },
      }),
    };
  }
  return {
    ok: true,
    status: 200,
    headers: { get: () => "text/html;charset=UTF-8" },
    text: async () => html,
  };
};

const result = await probeMopsRevisionSourceCapabilityV0_1({
  observedAt: "2026-10-03T16:10:00.000Z",
  fetchImpl,
});
assert.equal(result.state, "MOPS_ORIGINAL_AND_CORRECTION_OBSERVED");
assert.equal(result.revisionHistoryCapabilityObserved, true);
assert.equal(result.boundedIntervalCoverageComplete, false);
assert.equal(result.revisionCoverageComplete, false);
assert.equal(result.noEventMayBeClaimed, false);
assert.equal(result.selectionAuthority, false);
assert.equal(result.system1RuntimeUsed, false);

const badRedirect = await probeMopsRevisionSourceCapabilityV0_1({
  observedAt: "2026-10-03T16:10:00.000Z",
  fetchImpl: async () => ({
    ok: true,
    status: 200,
    headers: { get: () => "application/json" },
    text: async () => JSON.stringify({
      code: 200,
      result: { url: "https://evil.example/mops" },
    }),
  }),
});
assert.equal(badRedirect.state, "GATEWAY_NOT_READY");
assert.equal(badRedirect.revisionHistoryCapabilityObserved, false);

console.log("System2 MOPS revision source capability tests passed");
