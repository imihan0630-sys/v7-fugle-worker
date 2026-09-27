// Research-only prototype. No production dependency.
// Purpose: derive expected symbol trading sessions from official market sessions
// minus verified symbol-specific suspension intervals.

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function normalizeIntervals(intervals = []) {
  const out = [];
  for (const item of Array.isArray(intervals) ? intervals : []) {
    const start = String(item?.start || "");
    const end = String(item?.end || "");
    const quality = String(item?.quality || "UNKNOWN");
    if (!validDate(start) || !validDate(end) || end < start) {
      return { status: "UNKNOWN", reason: "INVALID_SUSPENSION_INTERVAL", intervals: [] };
    }
    if (quality !== "VERIFIED") {
      return { status: "UNKNOWN", reason: "SUSPENSION_PROVENANCE_UNKNOWN", intervals: [] };
    }
    out.push({ start, end, quality });
  }
  out.sort((a, b) => a.start.localeCompare(b.start));
  return { status: "READY", reason: null, intervals: out };
}

function isSuspended(date, intervals) {
  return intervals.some(x => x.start <= date && date <= x.end);
}

export function expectedSymbolSessionsBefore({
  marketSessions,
  targetDate,
  requiredSessions = 60,
  suspensions = []
}) {
  if (!validDate(targetDate)) return { status: "UNKNOWN", reason: "INVALID_TARGET_DATE", sessions: [] };
  const normalized = normalizeIntervals(suspensions);
  if (normalized.status !== "READY") return { ...normalized, sessions: [] };

  const market = [...new Set((Array.isArray(marketSessions) ? marketSessions : [])
    .map(String)
    .filter(validDate)
    .filter(date => date < targetDate))]
    .sort();

  const symbolSessions = market.filter(date => !isSuspended(date, normalized.intervals));
  const required = Math.max(1, Math.floor(Number(requiredSessions) || 60));
  if (symbolSessions.length < required) {
    return {
      status: "UNKNOWN",
      reason: "SYMBOL_SESSION_RANGE_INSUFFICIENT",
      sessions: symbolSessions,
      requiredSessions: required
    };
  }
  return {
    status: "READY",
    reason: null,
    sessions: symbolSessions.slice(-required),
    requiredSessions: required,
    suspensionIntervals: normalized.intervals
  };
}

export function validateSymbolHistoryFreshness({
  historyDates,
  marketSessions,
  targetDate,
  requiredSessions = 60,
  suspensions = []
}) {
  const expected = expectedSymbolSessionsBefore({ marketSessions, targetDate, requiredSessions, suspensions });
  if (expected.status !== "READY") {
    return { usable: false, status: "UNKNOWN", reason: expected.reason, expectedSessions: expected.sessions || [] };
  }
  const observed = (Array.isArray(historyDates) ? historyDates : []).map(String).filter(date => date < targetDate);
  if (new Set(observed).size !== observed.length) return { usable: false, status: "DATA_INCOMPLETE", reason: "DUPLICATE_BAR_DATE" };
  for (let i = 1; i < observed.length; i += 1) {
    if (observed[i] <= observed[i - 1]) return { usable: false, status: "DATA_INCOMPLETE", reason: "OUT_OF_ORDER_BAR_DATE" };
  }
  if (observed.length < requiredSessions) {
    return { usable: false, status: "DATA_INCOMPLETE", reason: "INSUFFICIENT_SYMBOL_SESSIONS" };
  }
  const recent = observed.slice(-requiredSessions);
  const expectedPriorDate = expected.sessions.at(-1);
  const latestPriorDate = recent.at(-1);
  if (latestPriorDate !== expectedPriorDate) {
    return { usable: false, status: "DATA_INCOMPLETE", reason: "STALE_LATEST_SYMBOL_SESSION", latestPriorDate, expectedPriorDate };
  }
  const mismatch = recent.findIndex((date, index) => date !== expected.sessions[index]);
  if (mismatch >= 0) {
    return {
      usable: false,
      status: "DATA_INCOMPLETE",
      reason: "INTERNAL_SYMBOL_SESSION_GAP",
      observedDate: recent[mismatch],
      expectedDate: expected.sessions[mismatch]
    };
  }
  return { usable: true, status: "VALID", reason: null, latestPriorDate, expectedPriorDate };
}
