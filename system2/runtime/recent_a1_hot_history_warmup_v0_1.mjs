import { deepFreeze } from "./factor_snapshot.mjs";
import { isTradingDateWithCalendar } from "./twse_trading_calendar_readonly.mjs";

export const RECENT_A1_HOT_HISTORY_WARMUP_VERSION = "0.1-RESEARCH";
export const DEFAULT_RECENT_A1_REQUIRED_SESSIONS = 60;
export const DEFAULT_RECENT_A1_MAX_DATES_PER_RUN = 5;

function isoDate(value, field = "marketDate") {
  const text = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(`${field} must be YYYY-MM-DD`);
  return text;
}

function positiveInt(value, field, { min = 1, max = 250 } = {}) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(`${field} must be an integer from ${min} to ${max}`);
  }
  return n;
}

function previousDate(date) {
  const value = new Date(`${isoDate(date)}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() - 1);
  return value.toISOString().slice(0, 10);
}

function calendarForDate(calendars, date) {
  const year = Number(date.slice(0, 4));
  const calendar = calendars instanceof Map
    ? calendars.get(year)
    : calendars?.[year] || calendars?.[String(year)];
  if (!calendar) throw new Error(`official trading calendar missing for ${year}`);
  return calendar;
}

export function buildPriorTradingDatesV0_1({
  anchorMarketDate,
  calendars,
  requiredSessions = DEFAULT_RECENT_A1_REQUIRED_SESSIONS,
} = {}) {
  const anchor = isoDate(anchorMarketDate, "anchorMarketDate");
  const required = positiveInt(requiredSessions, "requiredSessions", { max: 180 });
  if (!calendars || typeof calendars !== "object") throw new Error("calendars are required");

  const out = [];
  let cursor = previousDate(anchor);
  let inspected = 0;
  while (out.length < required) {
    inspected += 1;
    if (inspected > 400) throw new Error("unable to resolve required prior trading dates");
    const calendar = calendarForDate(calendars, cursor);
    if (isTradingDateWithCalendar(cursor, calendar)) out.push(cursor);
    cursor = previousDate(cursor);
  }
  return deepFreeze(out);
}

export async function readRecentA1DateCoverageV0_1({
  db,
  tradingDates,
  minima = { TWSE: 500, TPEX: 450 },
} = {}) {
  if (!db?.prepare) throw new Error("SYSTEM2_DB read adapter is required");
  if (!Array.isArray(tradingDates) || !tradingDates.length) throw new Error("tradingDates are required");
  const dates = tradingDates.map((x) => isoDate(x));
  const placeholders = dates.map(() => "?").join(",");
  const result = await db.prepare(
    `SELECT market_date, market,
            COUNT(DISTINCT symbol) AS symbol_count,
            COUNT(DISTINCT CASE
              WHEN pit_replay_eligible = 1 AND available_at IS NOT NULL
              THEN symbol END) AS pit_eligible_symbol_count,
            COUNT(DISTINCT CASE
              WHEN continuity_state IN ('CLEAR_NO_ACTION','ADJUSTED_CONTINUITY')
              THEN symbol END) AS continuity_eligible_symbol_count
       FROM s2_historical_a1_bars
      WHERE market_date IN (${placeholders})
        AND price_space = 'RAW'
      GROUP BY market_date, market`,
  ).bind(...dates).all();

  const ambiguity = await db.prepare(
    `SELECT market_date, market, COUNT(*) AS ambiguous_key_count
       FROM (
         SELECT market_date, market, canonical_key
           FROM s2_historical_a1_bars
          WHERE market_date IN (${placeholders})
            AND price_space = 'RAW'
          GROUP BY market_date, market, canonical_key
         HAVING COUNT(DISTINCT bar_hash) > 1
       )
      GROUP BY market_date, market`,
  ).bind(...dates).all();

  const coverageRows = Array.isArray(result?.results) ? result.results : [];
  const ambiguityRows = Array.isArray(ambiguity?.results) ? ambiguity.results : [];
  const byKey = new Map(coverageRows.map((row) => [`${row.market_date}|${row.market}`, row]));
  const ambiguityByKey = new Map(
    ambiguityRows.map((row) => [`${row.market_date}|${row.market}`, Number(row.ambiguous_key_count || 0)]),
  );

  const rows = [];
  for (const marketDate of dates) {
    for (const market of ["TWSE", "TPEX"]) {
      const row = byKey.get(`${marketDate}|${market}`) || {};
      const minimum = positiveInt(minima?.[market], `minima.${market}`, { max: 5000 });
      const symbolCount = Number(row.symbol_count || 0);
      const pitEligibleSymbolCount = Number(row.pit_eligible_symbol_count || 0);
      const continuityEligibleSymbolCount = Number(row.continuity_eligible_symbol_count || 0);
      const ambiguousKeyCount = ambiguityByKey.get(`${marketDate}|${market}`) || 0;
      const historyCoverageReady = pitEligibleSymbolCount >= minimum && ambiguousKeyCount === 0;
      rows.push(deepFreeze({
        marketDate,
        market,
        minimum,
        symbolCount,
        pitEligibleSymbolCount,
        continuityEligibleSymbolCount,
        ambiguousKeyCount,
        historyCoverageReady,
        continuityCoverageReady:
          historyCoverageReady && continuityEligibleSymbolCount >= minimum,
        state: ambiguousKeyCount > 0
          ? "AMBIGUOUS_EXISTING_HISTORY"
          : historyCoverageReady
            ? "HISTORY_COVERAGE_READY"
            : symbolCount > 0
              ? "PARTIAL_HISTORY"
              : "MISSING_HISTORY",
      }));
    }
  }
  return deepFreeze(rows);
}

export function planRecentA1HotHistoryWarmupV0_1({
  tradingDates,
  coverage,
  maxDatesPerRun = DEFAULT_RECENT_A1_MAX_DATES_PER_RUN,
} = {}) {
  if (!Array.isArray(tradingDates) || !tradingDates.length) throw new Error("tradingDates are required");
  if (!Array.isArray(coverage)) throw new Error("coverage is required");
  const maxDates = positiveInt(maxDatesPerRun, "maxDatesPerRun", { max: 5 });
  const byKey = new Map(coverage.map((row) => [`${row.marketDate}|${row.market}`, row]));
  const planned = [];
  const blocked = [];
  const complete = [];

  for (const marketDate of tradingDates) {
    const markets = [];
    let blockedDate = false;
    for (const market of ["TWSE", "TPEX"]) {
      const row = byKey.get(`${marketDate}|${market}`);
      if (!row) throw new Error(`coverage missing for ${marketDate} ${market}`);
      if (row.ambiguousKeyCount > 0) {
        blocked.push(deepFreeze({
          marketDate,
          market,
          state: "AMBIGUOUS_EXISTING_HISTORY",
          ambiguousKeyCount: row.ambiguousKeyCount,
        }));
        blockedDate = true;
        continue;
      }
      if (row.symbolCount >= row.minimum && row.pitEligibleSymbolCount < row.minimum) {
        blocked.push(deepFreeze({
          marketDate,
          market,
          state: "EXISTING_NON_PIT_HISTORY_BLOCKS_COVERAGE",
          symbolCount: row.symbolCount,
          pitEligibleSymbolCount: row.pitEligibleSymbolCount,
          minimum: row.minimum,
        }));
        blockedDate = true;
        continue;
      }
      if (!row.historyCoverageReady) markets.push(market);
    }
    if (blockedDate) continue;
    if (!markets.length) {
      complete.push(marketDate);
      continue;
    }
    if (planned.length < maxDates) {
      planned.push(deepFreeze({ marketDate, markets: deepFreeze(markets) }));
    }
  }

  return deepFreeze({
    version: RECENT_A1_HOT_HISTORY_WARMUP_VERSION,
    targetSessionCount: tradingDates.length,
    maxDatesPerRun: maxDates,
    plannedDateCount: planned.length,
    planned: deepFreeze(planned),
    blocked: deepFreeze(blocked),
    completeDateCount: complete.length,
    completeDates: deepFreeze(complete),
    historyCoverageOnly: true,
    continuityPromotionPerformed: false,
    continuityStateForNewRows: "UNVERIFIED",
    selectionAuthority: false,
    system1RuntimeUsed: false,
  });
}

export async function loadExistingA1SymbolsForDateMarketV0_1({
  db,
  marketDate,
  market,
} = {}) {
  if (!db?.prepare) throw new Error("SYSTEM2_DB read adapter is required");
  const date = isoDate(marketDate);
  if (!["TWSE", "TPEX"].includes(market)) throw new Error("market must be TWSE or TPEX");
  const result = await db.prepare(
    `SELECT symbol, COUNT(DISTINCT bar_hash) AS revision_count,
            MAX(pit_replay_eligible) AS any_pit_eligible
       FROM s2_historical_a1_bars
      WHERE market_date = ? AND market = ? AND price_space = 'RAW'
      GROUP BY symbol
      ORDER BY symbol`,
  ).bind(date, market).all();
  const rows = (result?.results || []).map((row) => deepFreeze({
    symbol: String(row.symbol),
    revisionCount: Number(row.revision_count || 0),
    anyPitEligible: Number(row.any_pit_eligible || 0) === 1,
  }));
  return deepFreeze(rows);
}
