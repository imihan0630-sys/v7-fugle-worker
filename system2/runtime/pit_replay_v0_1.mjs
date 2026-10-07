import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { selectHistoricalRevisionAsOfV0_1 } from "./historical_revision_lineage_v0_1.mjs";

export const PIT_REPLAY_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function assertIsoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function normalizeReplayRow(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error("historical bar must be an object");
  const symbol = requiredText(row.symbol, "bar.symbol");
  const marketDate = assertIsoDate(row.marketDate, "bar.marketDate");
  const priceSpace = requiredText(row.priceSpace, "bar.priceSpace");
  const canonicalKey = requiredText(row.canonicalKey, "bar.canonicalKey");
  const barHash = requiredText(row.barHash, "bar.barHash");
  const pitReplayEligible = row.pitReplayEligible === true || row.pitReplayEligible === 1;
  const availableAt = row.availableAt ? assertTimestamp(row.availableAt, "bar.availableAt") : null;
  const observedAt = row.observedAt ? assertTimestamp(row.observedAt, "bar.observedAt") : null;

  return {
    ...row,
    symbol,
    marketDate,
    priceSpace,
    canonicalKey,
    barHash,
    pitReplayEligible,
    availableAt,
    observedAt,
  };
}

function primitiveBar(row) {
  return deepFreeze({
    date: row.marketDate,
    open: row.open ?? row.open_price ?? null,
    high: row.high ?? row.high_price ?? null,
    low: row.low ?? row.low_price ?? null,
    close: row.close ?? row.close_price ?? null,
    volumeShares: row.volumeShares ?? row.volume_shares ?? null,
    tradeValue: row.tradeValue ?? row.trade_value ?? null,
    transactions: row.transactions ?? null,
    change: row.change ?? row.change_value ?? null,
    continuityState: row.continuityState ?? row.continuity_state ?? "UNVERIFIED",
    sourceId: row.sourceId ?? row.source_id ?? null,
    sourceRowHash: row.sourceRowHash ?? row.source_row_hash ?? null,
    availableAt: row.availableAt,
    observedAt: row.observedAt,
    pitAvailabilityClass: row.pitAvailabilityClass ?? row.pit_availability_class ?? null,
    barHash: row.barHash,
  });
}

export async function buildPitReplayWindow({
  replayId,
  symbol,
  marketDate,
  decisionTimestamp,
  priceSpace = "RAW",
  lookbackSessions = 61,
  historicalBars = [],
} = {}) {
  const id = requiredText(replayId, "replayId");
  const code = requiredText(symbol, "symbol");
  const date = assertIsoDate(marketDate, "marketDate");
  const clock = assertTimestamp(decisionTimestamp, "decisionTimestamp");
  const space = requiredText(priceSpace, "priceSpace");
  if (!Number.isInteger(lookbackSessions) || lookbackSessions < 1) {
    throw new Error("lookbackSessions must be a positive integer");
  }
  if (!Array.isArray(historicalBars)) throw new Error("historicalBars must be an array");

  const normalized = historicalBars.map(normalizeReplayRow);
  const candidateRows = normalized.filter((row) =>
    row.symbol === code
    && row.priceSpace === space
    && row.marketDate <= date,
  );

  const excluded = {
    wrongSymbolOrPriceSpace: normalized.length - normalized.filter((row) =>
      row.symbol === code && row.priceSpace === space,
    ).length,
    futureMarketDate: normalized.filter((row) =>
      row.symbol === code && row.priceSpace === space && row.marketDate > date,
    ).length,
    pitIneligible: 0,
    unavailableByDecision: 0,
  };

  const eligible = [];
  for (const row of candidateRows) {
    if (!row.pitReplayEligible || !row.availableAt) {
      excluded.pitIneligible += 1;
      continue;
    }
    if (Date.parse(row.availableAt) > Date.parse(clock)) {
      excluded.unavailableByDecision += 1;
      continue;
    }
    eligible.push(row);
  }

  const grouped = new Map();
  for (const row of eligible) {
    const key = row.canonicalKey;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }

  const resolved = [];
  const ambiguousRevisionKeys = [];
  let resolvedRevisionKeyCount = 0;
  for (const [key, rows] of grouped.entries()) {
    const hashes = [...new Set(rows.map((x) => x.barHash))];
    if (hashes.length > 1) resolvedRevisionKeyCount += 1;
    try {
      const selectedRevision = selectHistoricalRevisionAsOfV0_1({
        rows,
        decisionTimestamp: clock,
      });
      if (selectedRevision) resolved.push(selectedRevision);
    } catch (error) {
      if (/REVISION_AMBIGUITY_AT_SAME_AVAILABILITY/.test(String(error?.message || error))) {
        ambiguousRevisionKeys.push(key);
        continue;
      }
      throw error;
    }
  }

  if (ambiguousRevisionKeys.length) {
    throw new Error(
      "REVISION_AMBIGUITY for PIT replay: " + ambiguousRevisionKeys.sort().join(","),
    );
  }

  resolved.sort((a, b) => a.marketDate.localeCompare(b.marketDate));
  const selected = resolved.slice(-lookbackSessions);
  const targetBarPresent = selected.at(-1)?.marketDate === date;
  const state = selected.length >= lookbackSessions && targetBarPresent ? "READY" : "INCOMPLETE";
  const blockerCodes = [];
  if (selected.length < lookbackSessions) blockerCodes.push("INSUFFICIENT_PIT_HISTORY");
  if (!targetBarPresent) blockerCodes.push("TARGET_DATE_BAR_NOT_PIT_ELIGIBLE");

  const base = {
    replayId: id,
    symbol: code,
    marketDate: date,
    decisionTimestamp: clock,
    priceSpace: space,
    lookbackSessions,
    selectedSessionCount: selected.length,
    firstSelectedDate: selected[0]?.marketDate || null,
    lastSelectedDate: selected.at(-1)?.marketDate || null,
    targetBarPresent,
    state,
    blockerCodes: Object.freeze(blockerCodes),
    excludedCounts: deepFreeze(excluded),
    bars: Object.freeze(selected.map(primitiveBar)),
    pointInTimeEligible: state === "READY",
    revisionPolicy: "LATEST_AVAILABLE_REVISION_BY_AVAILABLE_AT_FAIL_CLOSED_ON_SAME_AVAILABILITY_CONFLICT",
    resolvedRevisionKeyCount,
    schemaVersion: "S2_PIT_REPLAY_WINDOW_V0_2",
  };

  const replayHash = await sha256Hex(base);
  return deepFreeze({ ...base, replayHash });
}
