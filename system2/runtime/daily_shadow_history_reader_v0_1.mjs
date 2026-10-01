import { deepFreeze } from "./factor_snapshot.mjs";

export const DAILY_SHADOW_HISTORY_READER_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function isoDate(value, field = "marketDate") {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(`${field} must be YYYY-MM-DD`);
  return text;
}

function timestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function positiveInt(value, field, max = 250) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > max) {
    throw new Error(`${field} must be an integer from 1 to ${max}`);
  }
  return n;
}

function assertDb(db) {
  if (!db || typeof db.prepare !== "function") throw new Error("SYSTEM2_DB read adapter is required");
  return db;
}

function normalizeRow(row) {
  return deepFreeze({
    barId: row.bar_id,
    canonicalKey: row.canonical_key,
    marketDate: row.market_date,
    market: row.market,
    symbol: row.symbol,
    companyName: row.company_name || null,
    priceSpace: row.price_space,
    open: row.open_price,
    high: row.high_price,
    low: row.low_price,
    close: row.close_price,
    volumeShares: row.volume_shares,
    tradeValue: row.trade_value,
    transactions: row.transactions,
    change: row.change_value,
    continuityState: row.continuity_state,
    sourceId: row.source_id,
    sourceName: row.source_name,
    sourceUrl: row.source_url || null,
    sourceRowHash: row.source_row_hash,
    observedAt: row.observed_at,
    availableAt: row.available_at,
    pitAvailabilityClass: row.pit_availability_class,
    pitReplayEligible: Number(row.pit_replay_eligible) === 1,
    capturedAt: row.captured_at,
    barHash: row.bar_hash,
    schemaVersion: row.schema_version,
  });
}

export async function loadPitPriorA1BarsV0_1({
  db,
  symbol,
  market,
  marketDate,
  decisionTimestamp,
  lookbackSessions = 60,
  priceSpace = "RAW",
} = {}) {
  assertDb(db);
  const code = requiredText(symbol, "symbol");
  const mkt = requiredText(market, "market");
  const date = isoDate(marketDate);
  const clock = timestamp(decisionTimestamp, "decisionTimestamp");
  const limit = positiveInt(lookbackSessions, "lookbackSessions");
  const space = requiredText(priceSpace, "priceSpace");

  const result = await db.prepare(
    `SELECT bar_id, canonical_key, market_date, market, symbol, company_name,
            price_space, open_price, high_price, low_price, close_price,
            volume_shares, trade_value, transactions, change_value,
            continuity_state, source_id, source_name, source_url, source_row_hash,
            observed_at, available_at, pit_availability_class, pit_replay_eligible,
            captured_at, bar_hash, schema_version
       FROM s2_historical_a1_bars
      WHERE symbol = ? AND market = ? AND market_date < ?
        AND price_space = ?
        AND pit_replay_eligible = 1
        AND available_at IS NOT NULL
        AND available_at <= ?
      ORDER BY market_date DESC, observed_at DESC, bar_hash DESC
      LIMIT ?`,
  ).bind(code, mkt, date, space, clock, limit * 2).all();

  const raw = Array.isArray(result?.results) ? result.results : [];
  const byDate = new Map();
  const ambiguousDates = [];

  for (const row of raw) {
    const key = String(row.market_date);
    const prior = byDate.get(key);
    if (!prior) {
      byDate.set(key, row);
      continue;
    }
    if (String(prior.bar_hash) !== String(row.bar_hash)) {
      ambiguousDates.push(key);
    }
  }

  if (ambiguousDates.length) {
    throw new Error(
      "REVISION_AMBIGUITY for daily Shadow history: " +
      [...new Set(ambiguousDates)].sort().join(","),
    );
  }

  const selected = [...byDate.values()]
    .sort((a, b) => String(a.market_date).localeCompare(String(b.market_date)))
    .slice(-limit)
    .map(normalizeRow);

  return deepFreeze(selected);
}

export async function probePitHistoryCoverageV0_1({
  db,
  snapshotBatch,
  decisionTimestamp,
  requiredPriorSessions = 60,
  priceSpace = "RAW",
} = {}) {
  assertDb(db);
  if (!snapshotBatch || typeof snapshotBatch !== "object") {
    throw new Error("snapshotBatch is required");
  }
  const date = isoDate(snapshotBatch.marketDate);
  const clock = timestamp(decisionTimestamp, "decisionTimestamp");
  const required = positiveInt(requiredPriorSessions, "requiredPriorSessions");
  const space = requiredText(priceSpace, "priceSpace");

  const result = await db.prepare(
    `WITH eligible AS (
       SELECT symbol, market, market_date, continuity_state, bar_hash
         FROM s2_historical_a1_bars
        WHERE market_date < ?
          AND price_space = ?
          AND pit_replay_eligible = 1
          AND available_at IS NOT NULL
          AND available_at <= ?
     ),
     per_date AS (
       SELECT symbol, market, market_date,
              COUNT(*) AS revision_count,
              MIN(continuity_state) AS continuity_min,
              MAX(continuity_state) AS continuity_max
         FROM eligible
        GROUP BY symbol, market, market_date
     ),
     ranked AS (
       SELECT symbol, market, market_date, revision_count,
              continuity_min, continuity_max,
              ROW_NUMBER() OVER (
                PARTITION BY symbol, market ORDER BY market_date DESC
              ) AS rn
         FROM per_date
     )
     SELECT symbol, market,
            COUNT(*) AS selected_date_count,
            SUM(CASE WHEN revision_count > 1 THEN 1 ELSE 0 END) AS ambiguous_date_count,
            SUM(CASE
              WHEN continuity_min IN ('CLEAR_NO_ACTION','ADJUSTED_CONTINUITY')
               AND continuity_max IN ('CLEAR_NO_ACTION','ADJUSTED_CONTINUITY')
              THEN 1 ELSE 0 END) AS continuity_eligible_count,
            MIN(market_date) AS first_selected_date,
            MAX(market_date) AS last_selected_date
       FROM ranked
      WHERE rn <= ?
      GROUP BY symbol, market`,
  ).bind(date, space, clock, required).all();

  const coverageRows = Array.isArray(result?.results) ? result.results : [];
  const byKey = new Map(
    coverageRows.map((row) => [`${row.market}|${row.symbol}`, row]),
  );
  const diagnostics = [];
  let historyReadyCount = 0;
  let continuityReadyCount = 0;
  let ambiguousCount = 0;

  for (const symbol of snapshotBatch.symbols || []) {
    const current = snapshotBatch.bySymbol?.[symbol];
    const market = current?.market || null;
    const row = market ? byKey.get(`${market}|${symbol}`) : null;
    const selectedDateCount = Number(row?.selected_date_count || 0);
    const ambiguousDateCount = Number(row?.ambiguous_date_count || 0);
    const continuityEligibleCount = Number(row?.continuity_eligible_count || 0);
    const historyReady = selectedDateCount >= required && ambiguousDateCount === 0;
    const continuityReady = historyReady && continuityEligibleCount >= required;
    if (historyReady) historyReadyCount += 1;
    if (continuityReady) continuityReadyCount += 1;
    if (ambiguousDateCount > 0) ambiguousCount += 1;
    diagnostics.push({
      symbol,
      market,
      selectedDateCount,
      ambiguousDateCount,
      continuityEligibleCount,
      firstSelectedDate: row?.first_selected_date || null,
      lastSelectedDate: row?.last_selected_date || null,
      historyReady,
      continuityReady,
    });
  }

  const currentCount = Number(snapshotBatch.ordinarySymbolCount || diagnostics.length);
  const historyCoverage = currentCount > 0 ? historyReadyCount / currentCount : 0;
  const continuityCoverage = currentCount > 0 ? continuityReadyCount / currentCount : 0;
  const state = currentCount === 0
    ? "NO_CURRENT_UNIVERSE"
    : ambiguousCount > 0
      ? "REVISION_AMBIGUITY_PRESENT"
      : historyReadyCount < currentCount
        ? "HISTORY_COVERAGE_INCOMPLETE"
        : continuityReadyCount < currentCount
          ? "CONTINUITY_NOT_VERIFIED"
          : "READY";

  return deepFreeze({
    version: DAILY_SHADOW_HISTORY_READER_VERSION,
    state,
    marketDate: date,
    decisionTimestamp: clock,
    requiredPriorSessions: required,
    currentUniverseCount: currentCount,
    historyReadyCount,
    continuityReadyCount,
    ambiguousSymbolCount: ambiguousCount,
    historyCoverage,
    continuityCoverage,
    diagnostics: Object.freeze(diagnostics),
    readOnly: true,
    externalMutationPerformed: false,
  });
}
