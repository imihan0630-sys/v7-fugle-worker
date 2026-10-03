import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildD18TaiexContextV0_1 } from "../runtime/d18_taiex_context_v0_1.mjs";

function weekdays(startIso, count) {
  const out = [];
  let d = new Date(startIso + "T00:00:00Z");
  while (out.length < count) {
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) out.push(d.toISOString().slice(0, 10));
    d = new Date(d.getTime() + 86400000);
  }
  return out;
}

const sessions = weekdays("2026-08-31", 25);
const marketDate = sessions.at(-1);
const history = sessions.map((date, i) => ({ date, close: 100 + i * 0.8 + (i % 3) * 0.1 }));
const sessionHash = await sha256Hex(sessions);
const sourceProbeReceipt = {
  contractVersion: "S2_SOURCE_ARRIVAL_V0_1",
  sourceId: "A2_TAIEX_CLOSE",
  marketDate,
  state: "READY",
  observedAt: marketDate + "T06:10:00.000Z",
  prospectiveSameDateEligible: true,
};
const calendarReceipt = {
  receiptRef: "FMTQIK|calendar|1",
  throughDate: marketDate,
  state: "READY",
  observedAt: marketDate + "T06:05:00.000Z",
  rawPayloadHash: "a".repeat(64),
  officialSessionWindowHash: sessionHash,
};
const base = {
  receiptId: "D18-A2-1",
  marketDate,
  decisionTimestamp: marketDate + "T06:30:00.000Z",
  history,
  officialSessionDates: sessions,
  sourceProbeReceipt,
  calendarReceipt,
};

const a = await buildD18TaiexContextV0_1(base);
assert.equal(a.state, "KNOWN");
assert.equal(a.pointInTimeEligible, true);
assert.equal(a.trendContext, "UP_TREND_CONTEXT");
assert(["VOL_EXPANDING","VOL_CONTRACTING","VOL_EQUAL"].includes(a.volatilityDirection));
assert.equal(a.selectionImpact, false);
assert.equal(a.policyApplied, false);
assert.equal(a.formula.outcomeTunedThreshold, false);

const replay = await buildD18TaiexContextV0_1(base);
assert.equal(replay.receiptHash, a.receiptHash);
assert.equal(replay.historyWindowHash, a.historyWindowHash);

const late = await buildD18TaiexContextV0_1({
  ...base,
  receiptId: "D18-A2-late",
  sourceProbeReceipt: { ...sourceProbeReceipt, observedAt: marketDate + "T07:00:00.000Z" },
});
assert.equal(late.state, "UNKNOWN");
assert(late.unknownReasons.includes("A2_OBSERVED_AFTER_DECISION"));

const gappedSessions = [...sessions];
gappedSessions[10] = "2026-01-02";
gappedSessions.sort();
const gap = await buildD18TaiexContextV0_1({
  ...base,
  receiptId: "D18-A2-gap",
  officialSessionDates: gappedSessions,
  calendarReceipt: {
    ...calendarReceipt,
    officialSessionWindowHash: await sha256Hex(gappedSessions),
  },
});
assert.equal(gap.state, "UNKNOWN");
assert(gap.unknownReasons.includes("HISTORY_OFFICIAL_SESSION_WINDOW_MISMATCH"));

const mutatedHistory = history.map((x) => ({ ...x }));
mutatedHistory[24].close += 1;
const changed = await buildD18TaiexContextV0_1({ ...base, receiptId: "D18-A2-changed", history: mutatedHistory });
assert.notEqual(changed.historyWindowHash, a.historyWindowHash);
assert.notEqual(changed.receiptHash, a.receiptHash);

const flatHistory = sessions.map((date) => ({ date, close: 100 }));
const flat = await buildD18TaiexContextV0_1({ ...base, receiptId: "D18-A2-flat", history: flatHistory });
assert.equal(flat.state, "KNOWN");
assert.equal(flat.volatilityDirection, "VOL_EQUAL");
assert.equal(flat.metrics.realizedVol5, 0);
assert.equal(flat.metrics.realizedVol20, 0);
assert.equal(flat.metrics.volRatio5to20, null);

await assert.rejects(
  () => buildD18TaiexContextV0_1({
    ...base,
    receiptId: "D18-A2-future",
    history: [...history, { date: "2099-01-01", close: 123 }],
  }),
  /future history row/,
);

console.log("D18 TAIEX context builder tests: PASS");
