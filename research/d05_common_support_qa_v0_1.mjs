import { deepFreeze } from "../system2/runtime/factor_snapshot.mjs";
import { sha256Hex } from "../system2/runtime/decision_archive.mjs";

export const D05_COMMON_SUPPORT_QA_VERSION = "D05_COMMON_SUPPORT_QA_V0_1_RESEARCH";
const CADENCES = Object.freeze([
  { key: "1s", seconds: 1, expectedBuckets: 15 },
  { key: "5s", seconds: 5, expectedBuckets: 3 },
  { key: "15s", seconds: 15, expectedBuckets: 1 },
]);
const PRIMARY_MECHANISM = "NORMAL_CONTINUOUS_TWO_SIDED_BOOK";

function requiredText(v, f) {
  if (typeof v !== "string" || !v.trim()) throw new Error(f + " is required");
  return v.trim();
}
function iso(v, f) {
  const x = requiredText(v, f);
  if (!Number.isFinite(Date.parse(x))) throw new Error(f + " must be timestamp");
  return x;
}
function expectedStarts(startMs, seconds) {
  const out = [];
  for (let x = 0; x < 15; x += seconds) out.push(new Date(startMs + x * 1000).toISOString());
  return out;
}
function auditCadence(row, spec, windowStartMs) {
  const reasons = [];
  const buckets = Array.isArray(row?.buckets) ? row.buckets : [];
  if (buckets.length !== spec.expectedBuckets) reasons.push("BUCKET_COUNT_MISMATCH");
  const starts = buckets.map((b) => String(b?.bucketStart || ""));
  const expected = expectedStarts(windowStartMs, spec.seconds);
  if (starts.length !== expected.length || starts.some((v, i) => v !== expected[i])) {
    reasons.push("BUCKET_ALIGNMENT_MISMATCH");
  }
  for (const b of buckets) {
    if (b?.mechanismState !== PRIMARY_MECHANISM) reasons.push("NON_PRIMARY_MECHANISM");
    if (b?.twoSidedQuote !== true) reasons.push("TWO_SIDED_QUOTE_MISSING");
    if (b?.crossesReconnect === true) reasons.push("RECONNECT_CROSSED");
    if (b?.gapBoundaryFlag === true) reasons.push("GAP_BOUNDARY");
    if (b?.heldAcrossGap === true) reasons.push("HELD_ACROSS_GAP");
    const age = b?.quoteAgeMs;
    if (age === null || age === undefined || age === ""
      || !Number.isFinite(Number(age)) || Number(age) < 0) reasons.push("QUOTE_AGE_MISSING");
  }
  const localRvRaw = row?.localMidquoteRv;
  const localRv = localRvRaw === null || localRvRaw === undefined || localRvRaw === ""
    ? null
    : Number(localRvRaw);
  if (localRv === null || !Number.isFinite(localRv) || localRv < 0) {
    reasons.push("LOCAL_MIDQUOTE_RV_MISSING");
  }
  const unique = [...new Set(reasons)].sort();
  return deepFreeze({
    cadence: spec.key,
    structurallyEligible: unique.length === 0,
    exclusionReasons: Object.freeze(unique),
    bucketCount: buckets.length,
    quoteAgeMs: Object.freeze(buckets.map((b) => {
      const age = b?.quoteAgeMs;
      return age === null || age === undefined || age === ""
        || !Number.isFinite(Number(age)) ? null : Number(age);
    })),
    localMidquoteRv: localRv !== null && Number.isFinite(localRv) && localRv >= 0 ? localRv : null,
    pressureState: row?.pressureState ?? null,
    spreadState: row?.spreadState ?? null,
    depthImbalanceState: row?.depthImbalanceState ?? null,
  });
}

export async function auditD05CommonSupportV0_1({ symbol, marketDate, windows = [] } = {}) {
  const sym = requiredText(symbol, "symbol");
  const date = requiredText(marketDate, "marketDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("marketDate must be YYYY-MM-DD");
  if (!Array.isArray(windows)) throw new Error("windows must be array");
  const rawStarts = windows.map((w) => String(w?.windowStart || ""));
  const startCounts = new Map();
  for (const start of rawStarts) startCounts.set(start, (startCounts.get(start) || 0) + 1);
  const rows = [];
  for (let i = 0; i < windows.length; i += 1) {
    const w = windows[i] || {};
    const start = iso(w.windowStart, "windows[" + i + "].windowStart");
    const startMs = Date.parse(start);
    if (startMs % 15000 !== 0) throw new Error("windowStart must align to 15 seconds");
    const end = new Date(startMs + 15000).toISOString();
    const perCadence = CADENCES.map((spec) => auditCadence(w.cadences?.[spec.key], spec, startMs));
    const reasons = [];
    if (new Date(startMs + 8 * 3600_000).toISOString().slice(0, 10) !== date) {
      reasons.push("WINDOW_TAIPEI_DATE_MISMATCH");
    }
    if (w.sessionMechanismState !== PRIMARY_MECHANISM) reasons.push("WINDOW_NON_PRIMARY_MECHANISM");
    if ((startCounts.get(start) || 0) > 1) reasons.push("DUPLICATE_WINDOW_START");
    const taipei = new Date(startMs + 8 * 3600_000);
    const localSeconds = taipei.getUTCHours() * 3600 + taipei.getUTCMinutes() * 60 + taipei.getUTCSeconds();
    if (localSeconds < 9 * 3600 || localSeconds + 15 > 13 * 3600 + 25 * 60) {
      reasons.push("WINDOW_OUTSIDE_NORMAL_CONTINUOUS_CLOCK");
    }
    for (const item of perCadence) {
      if (!item.structurallyEligible) {
        reasons.push(...item.exclusionReasons.map((x) => item.cadence + ":" + x));
      }
    }
    const unique = [...new Set(reasons)].sort();
    rows.push(deepFreeze({
      windowStart: start,
      windowEnd: end,
      commonSupportEligible: unique.length === 0,
      exclusionReasons: Object.freeze(unique),
      cadences: Object.freeze(Object.fromEntries(perCadence.map((x) => [x.cadence, x]))),
    }));
  }
  const eligible = rows.filter((x) => x.commonSupportEligible);
  const counts = {};
  for (const row of rows) {
    for (const reason of row.exclusionReasons) counts[reason] = (counts[reason] || 0) + 1;
  }
  const comparisons = eligible.map((row) => {
    const a = row.cadences["1s"], b = row.cadences["5s"], c = row.cadences["15s"];
    return deepFreeze({
      windowStart: row.windowStart,
      rv1s: a.localMidquoteRv,
      rv5s: b.localMidquoteRv,
      rv15s: c.localMidquoteRv,
      rv1sMinus5s: Number.isFinite(a.localMidquoteRv) && Number.isFinite(b.localMidquoteRv)
        ? a.localMidquoteRv - b.localMidquoteRv : null,
      rv5sMinus15s: Number.isFinite(b.localMidquoteRv) && Number.isFinite(c.localMidquoteRv)
        ? b.localMidquoteRv - c.localMidquoteRv : null,
      pressureAgreement: a.pressureState !== null && a.pressureState === b.pressureState && b.pressureState === c.pressureState,
      spreadAgreement: a.spreadState !== null && a.spreadState === b.spreadState && b.spreadState === c.spreadState,
      depthAgreement: a.depthImbalanceState !== null && a.depthImbalanceState === b.depthImbalanceState && b.depthImbalanceState === c.depthImbalanceState,
    });
  });
  const base = {
    version: D05_COMMON_SUPPORT_QA_VERSION,
    symbol: sym,
    marketDate: date,
    totalWindowCount: rows.length,
    commonSupportWindowCount: eligible.length,
    excludedWindowCount: rows.length - eligible.length,
    commonSupportRatio: rows.length ? eligible.length / rows.length : null,
    exclusionReasonCounts: deepFreeze(counts),
    windows: Object.freeze(rows),
    matchedWindowDiagnostics: Object.freeze(comparisons),
    quoteAgeThresholdApplied: false,
    outcomeDataUsed: false,
    cadenceWinnerSelected: false,
    trueOfiClaimed: false,
    formalDecisionImpact: false,
    semantics: deepFreeze({
      primaryMechanism: PRIMARY_MECHANISM,
      comparisonSupport: "EXACT_SAME_15_SECOND_WINDOWS",
      quoteAge: "RECORDED_NOT_THRESHOLD_TUNED",
      missingWindow: "REMAINS_IN_DENOMINATOR_AS_EXCLUDED",
    }),
  };
  return deepFreeze({ ...base, auditHash: await sha256Hex(base) });
}
