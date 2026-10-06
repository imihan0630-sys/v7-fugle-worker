import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_RAW_A1_LINEAGE_VERSION = "1.0-RESEARCH";

function text(value) {
  return value == null ? "" : String(value).trim();
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(text(value));
}

function normalizedBoolean(value) {
  return value === true || value === 1 || value === "1";
}

function normalizeRawA1Row(row) {
  if (!row || typeof row !== "object") throw new Error("raw A1 row must be an object");
  return deepFreeze({
    barId: text(row.barId ?? row.bar_id) || null,
    canonicalKey: text(row.canonicalKey ?? row.canonical_key) || null,
    marketDate: text(row.marketDate ?? row.market_date) || null,
    market: text(row.market).toUpperCase() || null,
    symbol: text(row.symbol) || null,
    priceSpace: text(row.priceSpace ?? row.price_space).toUpperCase() || null,
    continuityState: text(row.continuityState ?? row.continuity_state) || null,
    sourceId: text(row.sourceId ?? row.source_id) || null,
    sourceName: text(row.sourceName ?? row.source_name) || null,
    sourceUrl: text(row.sourceUrl ?? row.source_url) || null,
    sourceRowHash: text(row.sourceRowHash ?? row.source_row_hash) || null,
    observedAt: text(row.observedAt ?? row.observed_at) || null,
    availableAt: text(row.availableAt ?? row.available_at) || null,
    pitAvailabilityClass: text(row.pitAvailabilityClass ?? row.pit_availability_class) || null,
    pitReplayEligible: normalizedBoolean(row.pitReplayEligible ?? row.pit_replay_eligible),
    capturedAt: text(row.capturedAt ?? row.captured_at) || null,
    barHash: text(row.barHash ?? row.bar_hash) || null,
    schemaVersion: text(row.schemaVersion ?? row.schema_version) || null,
  });
}

function rowProvenanceBlockers(row, expected) {
  const blockers = [];
  if (row.market !== expected.market || row.symbol !== expected.symbol) {
    blockers.push("RAW_A1_EVENT_IDENTITY_MISMATCH");
  }
  if (row.priceSpace !== "RAW") blockers.push("RAW_A1_PRICE_SPACE_NOT_RAW");
  if (!validDate(row.marketDate)) blockers.push("RAW_A1_MARKET_DATE_INVALID");
  if (row.canonicalKey !== [expected.market, expected.symbol, row.marketDate, "RAW"].join("|")) {
    blockers.push("RAW_A1_CANONICAL_KEY_MISMATCH");
  }
  if (!row.barId || !row.barHash || !row.sourceId || !row.sourceRowHash) {
    blockers.push("RAW_A1_IMMUTABLE_PROVENANCE_MISSING");
  }
  if (!row.observedAt || !Number.isFinite(Date.parse(row.observedAt))) {
    blockers.push("RAW_A1_OBSERVED_AT_MISSING");
  }
  if (!row.availableAt || !Number.isFinite(Date.parse(row.availableAt)) || !row.pitReplayEligible) {
    blockers.push("RAW_A1_PIT_PROVENANCE_NOT_READY");
  }
  return blockers;
}

export function evaluateRawA1LineageV1_0({
  nativeSessionEvidence,
  marketSessions = [],
  rawA1Rows = [],
} = {}) {
  if (!nativeSessionEvidence || typeof nativeSessionEvidence !== "object") {
    throw new Error("nativeSessionEvidence is required");
  }
  const market = text(nativeSessionEvidence.market).toUpperCase();
  const symbol = text(nativeSessionEvidence.symbol);
  const family = text(nativeSessionEvidence.family);
  const stopTradingStart = text(nativeSessionEvidence.stopTradingStart);
  const resumeTradingDate = text(nativeSessionEvidence.resumeTradingDate);
  const sourceId = text(nativeSessionEvidence.sourceId);
  const sourceRowHash = text(nativeSessionEvidence.sourceRowHash);
  const nativeState = text(
    nativeSessionEvidence.state
      ?? (nativeSessionEvidence.boundedNativeSymbolSessionEvidenceReady
        ? "BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY"
        : ""),
  );

  if (!["TWSE", "TPEX"].includes(market)) throw new Error("nativeSessionEvidence.market must be TWSE or TPEX");
  if (!/^[1-9][0-9]{3}$/.test(symbol)) throw new Error("nativeSessionEvidence.symbol must be four digits");
  if (!validDate(stopTradingStart) || !validDate(resumeTradingDate)) {
    throw new Error("nativeSessionEvidence stop/resume dates must be YYYY-MM-DD");
  }
  if (stopTradingStart >= resumeTradingDate) throw new Error("stopTradingStart must precede resumeTradingDate");

  const sessions = [...new Set(
    (Array.isArray(marketSessions) ? marketSessions : []).map(text),
  )].sort();
  if (!sessions.length || !sessions.every(validDate)) {
    throw new Error("marketSessions must contain official YYYY-MM-DD dates");
  }

  const normalizedRows = (Array.isArray(rawA1Rows) ? rawA1Rows : []).map(normalizeRawA1Row);
  const blockers = [];
  if (nativeState !== "BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY") {
    blockers.push("NATIVE_SYMBOL_SESSION_EVIDENCE_NOT_READY");
  }
  if (!sourceId || !sourceRowHash) blockers.push("NATIVE_SESSION_PROVENANCE_MISSING");

  const previousSessions = sessions.filter((date) => date < stopTradingStart);
  const previousOfficialSession = previousSessions.at(-1) || null;
  const suspendedOfficialSessions = sessions.filter(
    (date) => date >= stopTradingStart && date < resumeTradingDate,
  );
  const resumeDateIsOfficialSession = sessions.includes(resumeTradingDate);

  if (!previousOfficialSession) blockers.push("PRE_SUSPENSION_OFFICIAL_SESSION_NOT_RESOLVED");
  if (!resumeDateIsOfficialSession) blockers.push("RESUME_OFFICIAL_SESSION_NOT_VERIFIED");
  if (!suspendedOfficialSessions.length) blockers.push("SUSPENSION_WINDOW_HAS_NO_OFFICIAL_SESSION");

  const targetDates = new Set([
    ...(previousOfficialSession ? [previousOfficialSession] : []),
    ...suspendedOfficialSessions,
    resumeTradingDate,
  ]);

  const rowsByDate = new Map();
  for (const row of normalizedRows) {
    if (!targetDates.has(row.marketDate)) {
      blockers.push("RAW_A1_ROW_OUTSIDE_BOUNDED_LINEAGE_WINDOW");
      continue;
    }
    for (const blocker of rowProvenanceBlockers(row, { market, symbol })) blockers.push(blocker);
    if (!rowsByDate.has(row.marketDate)) rowsByDate.set(row.marketDate, []);
    rowsByDate.get(row.marketDate).push(row);
  }

  const ambiguousDates = [];
  for (const [date, rows] of rowsByDate.entries()) {
    const hashes = new Set(rows.map((row) => row.barHash).filter(Boolean));
    if (hashes.size > 1) ambiguousDates.push(date);
  }
  if (ambiguousDates.length) blockers.push("RAW_A1_REVISION_AMBIGUITY");

  const priorRows = previousOfficialSession ? rowsByDate.get(previousOfficialSession) || [] : [];
  const resumeRows = rowsByDate.get(resumeTradingDate) || [];
  if (previousOfficialSession && priorRows.length === 0) blockers.push("PRE_SUSPENSION_RAW_A1_BAR_MISSING");
  if (resumeRows.length === 0) blockers.push("RESUME_RAW_A1_BAR_MISSING");
  if (priorRows.length > 1) blockers.push("PRE_SUSPENSION_RAW_A1_BAR_NOT_UNIQUE");
  if (resumeRows.length > 1) blockers.push("RESUME_RAW_A1_BAR_NOT_UNIQUE");

  const suspendedRows = suspendedOfficialSessions.flatMap((date) => rowsByDate.get(date) || []);
  if (suspendedRows.length > 0) blockers.push("SUSPENDED_SESSION_RAW_A1_BAR_PRESENT");

  const uniqueBlockers = [...new Set(blockers)];
  const rawA1LineageBound = uniqueBlockers.length === 0;
  const compactRowRef = (row) => row ? deepFreeze({
    barId: row.barId,
    canonicalKey: row.canonicalKey,
    marketDate: row.marketDate,
    sourceId: row.sourceId,
    sourceRowHash: row.sourceRowHash,
    barHash: row.barHash,
    availableAt: row.availableAt,
    pitAvailabilityClass: row.pitAvailabilityClass,
    pitReplayEligible: row.pitReplayEligible,
    continuityState: row.continuityState,
    schemaVersion: row.schemaVersion,
  }) : null;

  return deepFreeze({
    schemaVersion: "S2_S2_07_RAW_A1_LINEAGE_V1_0",
    version: S2_07_RAW_A1_LINEAGE_VERSION,
    market,
    symbol,
    family: family || null,
    stopTradingStart,
    resumeTradingDate,
    nativeSessionState: nativeState || null,
    nativeSessionSourceId: sourceId || null,
    nativeSessionSourceRowHash: sourceRowHash || null,
    previousOfficialSession,
    suspendedOfficialSessions: Object.freeze(suspendedOfficialSessions),
    resumeDateIsOfficialSession,
    observedRawA1RowCount: normalizedRows.length,
    suspendedRawA1RowCount: suspendedRows.length,
    ambiguousDates: Object.freeze(ambiguousDates.sort()),
    preSuspensionBar: compactRowRef(priorRows[0] || null),
    resumeBar: compactRowRef(resumeRows[0] || null),
    state: rawA1LineageBound
      ? "BOUNDED_RAW_A1_LINEAGE_READY"
      : "RAW_A1_LINEAGE_BLOCKED",
    blockers: Object.freeze(uniqueBlockers),
    rawA1LineageBound,
    rawBarsMutated: false,
    adjustedPriceGenerated: false,
    continuityTransformPerformed: false,
    technicalContinuityCertified: false,
    symbolSessionCompletenessCertified: false,
    noSuspensionMayBeClaimed: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}

export function summarizeRawA1LineageV1_0(rows = []) {
  if (!Array.isArray(rows)) throw new Error("rows must be array");
  const blockerCounts = {};
  for (const row of rows) {
    for (const blocker of row?.blockers || []) {
      blockerCounts[blocker] = (blockerCounts[blocker] || 0) + 1;
    }
  }
  const ready = rows.filter((row) => row?.rawA1LineageBound === true);
  return deepFreeze({
    schemaVersion: "S2_S2_07_RAW_A1_LINEAGE_SUMMARY_V1_0",
    version: S2_07_RAW_A1_LINEAGE_VERSION,
    caseCount: rows.length,
    rawA1LineageReadyCount: ready.length,
    blockedCount: rows.length - ready.length,
    readySymbols: Object.freeze(ready.map((row) => row.symbol).sort()),
    blockerCounts: deepFreeze(blockerCounts),
    rawA1LineageBoundForAllCases: rows.length > 0 && ready.length === rows.length,
    rawBarsMutated: false,
    adjustedPriceGenerated: false,
    continuityTransformPerformed: false,
    technicalContinuityCertified: false,
    symbolSessionCompletenessCertified: false,
    selectionAuthority: false,
    finalSelectionEnabled: false,
    livePushEnabled: false,
    capitalImpact: false,
    orderImpact: false,
    system1RuntimeUsed: false,
  });
}
