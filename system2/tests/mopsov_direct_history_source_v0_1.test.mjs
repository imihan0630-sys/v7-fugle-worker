import assert from "node:assert/strict";
import {
  buildMopsovDirectHistoryRequestV0_1,
  probeMopsovDirectHistoryV0_1,
} from "../runtime/mopsov_direct_history_source_v0_1.mjs";

const req = buildMopsovDirectHistoryRequestV0_1({
  stockCode: "2467",
  rocYear: 115,
  month: 5,
});
assert.equal(req.url, "https://mopsov.twse.com.tw/mops/web/ajax_t05st01");
assert.equal(req.method, "POST");
assert.ok(req.formBody.includes("co_id=2467"));
assert.ok(req.formBody.includes("year=115"));
assert.ok(req.formBody.includes("month=5"));

const html = `
<table>
<tr><td>2467</td><td>志聖</td><td>115/05/22</td><td>16:34:06</td><td>公告本公司除息基準日等相關事宜</td>
<td><input onclick="document.t05st01_fm.seq_no.value='2';document.t05st01_fm.spoke_time.value='163406';document.t05st01_fm.spoke_date.value='20260522';document.t05st01_fm.TYPEK.value='sii';"/></td></tr>
<tr><td>2467</td><td>志聖</td><td>115/05/22</td><td>17:42:13</td><td>公告本公司除息基準日等相關事宜(更正)</td>
<td><input onclick="document.t05st01_fm.seq_no.value='4';document.t05st01_fm.spoke_time.value='174213';document.t05st01_fm.spoke_date.value='20260522';document.t05st01_fm.TYPEK.value='sii';"/></td></tr>
</table>`;

const fetchImpl = async (url, options = {}) => {
  assert.equal(url, "https://mopsov.twse.com.tw/mops/web/ajax_t05st01");
  assert.equal(options.method, "POST");
  assert.equal(options.headers["content-type"], "application/x-www-form-urlencoded");
  assert.ok(String(options.body).includes("co_id=2467"));
  return {
    ok: true,
    status: 200,
    headers: { get: () => "text/html;charset=UTF-8" },
    text: async () => html,
  };
};

const result = await probeMopsovDirectHistoryV0_1({
  stockCode: "2467",
  rocYear: 115,
  month: 5,
  expectedDate: "2026-05-22",
  baseSubject: "公告本公司除息基準日等相關事宜",
  observedAt: "2026-10-04T01:04:00.000Z",
  fetchImpl,
});
assert.equal(result.state, "MOPSOV_DIRECT_HISTORY_READABLE");
assert.equal(result.directHistoryCapabilityObserved, true);
assert.equal(result.revisionHistoryCapabilityObserved, true);
assert.equal(result.parsed.matchingSubjectRowCount, 2);
assert.equal(result.monthlyRows.length, 2);
assert.equal(result.parsed.correctionOrCancellationRowCount, 1);
assert.equal(result.revisionCoverageComplete, false);
assert.equal(result.technicalContinuityCertified, false);
assert.equal(result.selectionAuthority, false);

const fail = await probeMopsovDirectHistoryV0_1({
  stockCode: "2467",
  rocYear: 115,
  month: 5,
  observedAt: "2026-10-04T01:04:00.000Z",
  fetchImpl: async () => { throw new Error("network"); },
});
assert.equal(fail.state, "DIRECT_HISTORY_TRANSPORT_ERROR");
assert.equal(fail.revisionCoverageComplete, false);
assert.equal(fail.historyMutationPerformed, false);
assert.equal(fail.system1RuntimeUsed, false);

console.log("System2 MOPSOV direct history source tests passed");
