import assert from "node:assert/strict";
import { auditD05CommonSupportV0_1 } from "../../research/d05_common_support_qa_v0_1.mjs";

const date = "2026-10-02";
function buckets(start, seconds, { badAt = -1, reconnectAt = -1, mechanism = "NORMAL_CONTINUOUS_TWO_SIDED_BOOK" } = {}) {
  const n = 15 / seconds;
  const base = Date.parse(start);
  return Array.from({ length: n }, (_, i) => ({
    bucketStart: new Date(base + i * seconds * 1000).toISOString(),
    mechanismState: i === badAt ? "VI_CALL_OR_TRIAL" : mechanism,
    twoSidedQuote: true,
    crossesReconnect: i === reconnectAt,
    gapBoundaryFlag: false,
    heldAcrossGap: false,
    quoteAgeMs: i * 10,
  }));
}
function cadence(start, seconds, opts = {}, state = "POS") {
  return {
    buckets: buckets(start, seconds, opts),
    localMidquoteRv: seconds / 100000,
    pressureState: state,
    spreadState: "TIGHT",
    depthImbalanceState: "BID",
  };
}
const start = "2026-10-02T01:00:00.000Z";
const good = {
  windowStart: start,
  sessionMechanismState: "NORMAL_CONTINUOUS_TWO_SIDED_BOOK",
  cadences: {
    "1s": cadence(start, 1),
    "5s": cadence(start, 5),
    "15s": cadence(start, 15),
  },
};
{
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [good] });
  assert.equal(x.commonSupportWindowCount, 1);
  assert.equal(x.excludedWindowCount, 0);
  assert.equal(x.matchedWindowDiagnostics[0].pressureAgreement, true);
  assert.equal(x.quoteAgeThresholdApplied, false);
  assert.equal(x.outcomeDataUsed, false);
  assert.equal(x.cadenceWinnerSelected, false);
  assert.equal(x.trueOfiClaimed, false);
  assert.equal(x.auditHash, (await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [good] })).auditHash);
}
{
  const bad = structuredClone(good);
  bad.cadences["1s"].buckets.pop();
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [good, bad] });
  assert.equal(x.totalWindowCount, 2);
  assert.equal(x.commonSupportWindowCount, 1);
  assert.equal(x.commonSupportRatio, 0.5);
  assert.equal(x.exclusionReasonCounts["1s:BUCKET_COUNT_MISMATCH"], 1);
}
{
  const bad = structuredClone(good);
  bad.cadences["5s"].buckets[1].crossesReconnect = true;
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [bad] });
  assert.equal(x.commonSupportWindowCount, 0);
  assert.equal(x.exclusionReasonCounts["5s:RECONNECT_CROSSED"], 1);
}
{
  const bad = structuredClone(good);
  bad.cadences["15s"].buckets[0].mechanismState = "VI_CALL_OR_TRIAL";
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [bad] });
  assert.equal(x.commonSupportWindowCount, 0);
  assert.equal(x.exclusionReasonCounts["15s:NON_PRIMARY_MECHANISM"], 1);
}
{
  const bad = structuredClone(good);
  bad.cadences["1s"].buckets[2].quoteAgeMs = null;
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [bad] });
  assert.equal(x.commonSupportWindowCount, 0);
  assert.equal(x.exclusionReasonCounts["1s:QUOTE_AGE_MISSING"], 1);
}
{
  const bad = structuredClone(good);
  bad.cadences["5s"].buckets[1].bucketStart = new Date(Date.parse(start) + 6000).toISOString();
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [bad] });
  assert.equal(x.commonSupportWindowCount, 0);
  assert.equal(x.exclusionReasonCounts["5s:BUCKET_ALIGNMENT_MISMATCH"], 1);
}
{
  const bad = structuredClone(good);
  bad.sessionMechanismState = "OPEN_CALL";
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [bad] });
  assert.equal(x.commonSupportWindowCount, 0);
  assert.equal(x.exclusionReasonCounts["WINDOW_NON_PRIMARY_MECHANISM"], 1);
}
{
  const bad = structuredClone(good);
  bad.cadences["5s"].localMidquoteRv = null;
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [bad] });
  assert.equal(x.commonSupportWindowCount, 0);
  assert.equal(x.exclusionReasonCounts["5s:LOCAL_MIDQUOTE_RV_MISSING"], 1);
}
{
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [good, structuredClone(good)] });
  assert.equal(x.commonSupportWindowCount, 0);
  assert.equal(x.excludedWindowCount, 2);
  assert.equal(x.exclusionReasonCounts["DUPLICATE_WINDOW_START"], 2);
}
{
  const earlyStart = "2026-10-02T00:59:45.000Z";
  const early = {
    windowStart: earlyStart,
    sessionMechanismState: "NORMAL_CONTINUOUS_TWO_SIDED_BOOK",
    cadences: {
      "1s": cadence(earlyStart, 1),
      "5s": cadence(earlyStart, 5),
      "15s": cadence(earlyStart, 15),
    },
  };
  const x = await auditD05CommonSupportV0_1({ symbol: "2330", marketDate: date, windows: [early] });
  assert.equal(x.commonSupportWindowCount, 0);
  assert.equal(x.exclusionReasonCounts["WINDOW_OUTSIDE_NORMAL_CONTINUOUS_CLOCK"], 1);
}
console.log("D05 common-support QA V0.1 tests: PASS");
