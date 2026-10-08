import { createHash } from "node:crypto";

export const D18_DIRECTION_BREADTH_SEMANTICS_VERSION = "0.1-RESEARCH";

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return value;
}

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function sha256(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function rawChangeText(snapshot) {
  const raw = snapshot?.sourceFields?.change;
  if (raw === null || raw === undefined) return null;
  const text = String(raw)
    .replace(/<[^>]*>/g, "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&#43;", "+")
    .replaceAll("&#45;", "-")
    .replaceAll("＋", "+")
    .replaceAll("－", "-")
    .trim();
  return text || null;
}

function numericChange(text) {
  if (!text) return null;
  const raw = text.replaceAll(",", "").replaceAll("%", "").replace(/^\+/, "").trim();
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function classifyDirectionBreadthSnapshot(snapshot) {
  const market = requiredText(snapshot?.market, "snapshot.market");
  const symbol = requiredText(snapshot?.symbol, "snapshot.symbol");
  const rawChange = rawChangeText(snapshot);

  if (snapshot?.priceState === "NO_USABLE_PRICE" || !Number.isFinite(snapshot?.close)) {
    return deepFreeze({
      market,
      symbol,
      directionState: "UNKNOWN",
      reason: "NO_USABLE_CLOSE",
      rawChange,
      numericChange: null,
      comparable: false,
    });
  }

  if (!rawChange) {
    return deepFreeze({
      market,
      symbol,
      directionState: "UNKNOWN",
      reason: "CHANGE_MISSING",
      rawChange: null,
      numericChange: null,
      comparable: false,
    });
  }

  if (/^X/i.test(rawChange) || /^除權息/i.test(rawChange)) {
    return deepFreeze({
      market,
      symbol,
      directionState: "NOT_COMPARABLE",
      reason: "EXCHANGE_NOT_COMPARABLE_MARKER",
      rawChange,
      numericChange: null,
      comparable: false,
    });
  }

  if (/^[+^~]/.test(rawChange)) {
    return deepFreeze({
      market,
      symbol,
      directionState: "UP",
      reason: null,
      rawChange,
      numericChange: numericChange(rawChange.replace(/^[^0-9.+-]+/, "")),
      comparable: true,
    });
  }

  if (/^[-vV]/.test(rawChange)) {
    const stripped = rawChange.replace(/^[vV]/, "-");
    return deepFreeze({
      market,
      symbol,
      directionState: "DOWN",
      reason: null,
      rawChange,
      numericChange: numericChange(stripped),
      comparable: true,
    });
  }

  const n = numericChange(rawChange);
  if (n === null) {
    return deepFreeze({
      market,
      symbol,
      directionState: "UNKNOWN",
      reason: "CHANGE_UNPARSEABLE",
      rawChange,
      numericChange: null,
      comparable: false,
    });
  }

  return deepFreeze({
    market,
    symbol,
    directionState: n > 0 ? "UP" : n < 0 ? "DOWN" : "FLAT",
    reason: null,
    rawChange,
    numericChange: n,
    comparable: true,
  });
}

function summarize(rows) {
  const counts = {
    base: rows.length,
    up: 0,
    down: 0,
    flat: 0,
    notComparable: 0,
    unknown: 0,
  };
  const reasonCounts = {};
  for (const row of rows) {
    if (row.directionState === "UP") counts.up += 1;
    else if (row.directionState === "DOWN") counts.down += 1;
    else if (row.directionState === "FLAT") counts.flat += 1;
    else if (row.directionState === "NOT_COMPARABLE") counts.notComparable += 1;
    else counts.unknown += 1;
    if (row.reason) reasonCounts[row.reason] = (reasonCounts[row.reason] || 0) + 1;
  }
  const knownComparable = counts.up + counts.down + counts.flat;
  return {
    ...counts,
    knownComparable,
    advanceShareKnown: knownComparable ? counts.up / knownComparable : null,
    declineShareKnown: knownComparable ? counts.down / knownComparable : null,
    flatShareKnown: knownComparable ? counts.flat / knownComparable : null,
    netBreadthShareKnown: knownComparable ? (counts.up - counts.down) / knownComparable : null,
    comparableCoveragePct: counts.base ? knownComparable / counts.base : null,
    notComparablePct: counts.base ? counts.notComparable / counts.base : null,
    unknownPct: counts.base ? counts.unknown / counts.base : null,
    reasonCounts,
  };
}

export function buildDirectionBreadthResearchV0_1({
  snapshotBatch,
  featureId = "D18.DIRECTION_BREADTH",
} = {}) {
  if (!snapshotBatch || typeof snapshotBatch !== "object") throw new Error("snapshotBatch is required");
  if (snapshotBatch.state !== "READY" || snapshotBatch.pointInTimeEligible !== true) {
    return deepFreeze({
      featureId,
      version: D18_DIRECTION_BREADTH_SEMANTICS_VERSION,
      state: "UNKNOWN",
      reason: "A1_BATCH_NOT_READY_OR_NOT_PIT",
      marketDate: snapshotBatch.marketDate || null,
      decisionTimestamp: snapshotBatch.decisionTimestamp || null,
      batchHash: snapshotBatch.batchHash || null,
      externalMutationPerformed: false,
    });
  }

  const snapshots = Object.values(snapshotBatch.bySymbol || {})
    .slice()
    .sort((a, b) =>
      String(a.market).localeCompare(String(b.market))
      || String(a.symbol).localeCompare(String(b.symbol)));

  const accounts = snapshots.map(classifyDirectionBreadthSnapshot);
  const byMarket = {};
  for (const market of ["TWSE", "TPEX"]) {
    byMarket[market] = summarize(accounts.filter((x) => x.market === market));
  }
  const total = summarize(accounts);

  const base = {
    featureId,
    version: D18_DIRECTION_BREADTH_SEMANTICS_VERSION,
    state: total.knownComparable > 0 ? "KNOWN" : "UNKNOWN",
    reason: total.knownComparable > 0 ? null : "NO_COMPARABLE_DIRECTION_ROWS",
    marketDate: snapshotBatch.marketDate,
    decisionTimestamp: snapshotBatch.decisionTimestamp,
    availableAt: snapshotBatch.observedAt || null,
    pointInTimeEligible: snapshotBatch.pointInTimeEligible === true,
    sourceBatchId: snapshotBatch.batchId,
    sourceBatchHash: snapshotBatch.batchHash,
    universeSemantics: "TWSE_TPEX_ORDINARY_SYMBOLS_FROM_READY_A1_BATCH",
    breadthSemantics: "OFFICIAL_MARKET_DIRECTION_NOT_FORMAL_OPPORTUNITY_SET",
    denominatorSemantics: "UP_DOWN_FLAT_ONLY; X_NOT_COMPARABLE_AND_UNKNOWN_EXCLUDED_BUT_REPORTED",
    total,
    byMarket,
    accounts,
    researchOnly: true,
    decisionImpact: false,
    externalMutationPerformed: false,
    schemaVersion: "D18_DIRECTION_BREADTH_RESEARCH_V0_1",
  };
  return deepFreeze({ ...base, featureHash: sha256(base) });
}
