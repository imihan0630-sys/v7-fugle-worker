import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const DAILY_SHADOW_HISTORY_READER_VERSION = "0.4-RESEARCH";

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

function dateCsv(value) {
  const text = String(value || "").trim();
  if (!text) return [];
  const out = [...new Set(text.split(",").map((x) => x.trim()).filter(Boolean))].sort();
  for (const date of out) isoDate(date, "selectedSessionDates[]");
  return out;
}

function intervalContainsDate(date, interval) {
  if (date < interval.suspendedFrom) return false;
  if (interval.resumedOn) return date < interval.resumedOn;
  return date <= interval.coverageTo;
}

function buildLifecycleIndex(intervals, coverageTo) {
  if (!Array.isArray(intervals)) throw new Error("certifiedNoTradingIntervals must be an array");
  const index = new Map();
  for (const raw of intervals) {
    if (!raw || typeof raw !== "object") continue;
    const market = requiredText(raw.market, "certifiedNoTradingIntervals[].market");
    const symbol = requiredText(raw.symbol, "certifiedNoTradingIntervals[].symbol");
    const suspendedFrom = isoDate(raw.suspendedFrom, "certifiedNoTradingIntervals[].suspendedFrom");
    const resumedOn = raw.resumedOn ? isoDate(raw.resumedOn, "certifiedNoTradingIntervals[].resumedOn") : null;
    const intervalCoverageTo = isoDate(raw.coverageTo || coverageTo, "certifiedNoTradingIntervals[].coverageTo");
    if (resumedOn && resumedOn < suspendedFrom) {
      throw new Error("certified no-trading interval resumes before suspension");
    }
    const key = market + "|" + symbol;
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(deepFreeze({
      market,
      symbol,
      suspendedFrom,
      resumedOn,
      coverageTo: intervalCoverageTo,
      sourceRowHash: raw.sourceRowHash || null,
      lifecycleSource: raw.lifecycleSource || raw.sourceId || "CERTIFIED_NO_TRADING_INTERVAL",
    }));
  }
  for (const rows of index.values()) {
    rows.sort((a, b) => a.suspendedFrom.localeCompare(b.suspendedFrom)
      || String(a.resumedOn || "").localeCompare(String(b.resumedOn || "")));
  }
  return index;
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
  minimumMarketDate = null,
  expectedSessionHash = null,
} = {}) {
  assertDb(db);
  const code = requiredText(symbol, "symbol");
  const mkt = requiredText(market, "market");
  const date = isoDate(marketDate);
  const clock = timestamp(decisionTimestamp, "decisionTimestamp");
  const limit = positiveInt(lookbackSessions, "lookbackSessions");
  const space = requiredText(priceSpace, "priceSpace");
  const minDate = minimumMarketDate ? isoDate(minimumMarketDate, "minimumMarketDate") : null;
  if (minDate && minDate >= date) throw new Error("minimumMarketDate must be earlier than marketDate");
  if (expectedSessionHash !== null && !/^[a-f0-9]{64}$/.test(String(expectedSessionHash))) {
    throw new Error("expectedSessionHash must be a sha256 hex digest");
  }
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
        AND (? IS NULL OR market_date >= ?)
      ORDER BY market_date DESC, observed_at DESC, bar_hash DESC
      LIMIT ?`,
  ).bind(code, mkt, date, space, clock, minDate, minDate, limit * 2).all();

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

  if (expectedSessionHash) {
    const actualSessionHash = await sha256Hex({
      market: mkt,
      symbol: code,
      marketDate: date,
      dates: selected.map((row) => row.marketDate),
    });
    if (actualSessionHash !== expectedSessionHash) {
      throw new Error(
        "EXPECTED_SESSION_HASH_MISMATCH for daily Shadow history: "
        + mkt + "|" + code + "|" + date,
      );
    }
  }

  return deepFreeze(selected);
}

export async function probePitHistoryCoverageV0_1({
  db,
  snapshotBatch,
  decisionTimestamp,
  requiredPriorSessions = 60,
  priceSpace = "RAW",
  listingMetadata = null,
  priorTradingDates = null,
  certifiedNoTradingIntervals = [],
} = {}) {
  assertDb(db);
  if (!snapshotBatch || typeof snapshotBatch !== "object") {
    throw new Error("snapshotBatch is required");
  }
  const date = isoDate(snapshotBatch.marketDate);
  const clock = timestamp(decisionTimestamp, "decisionTimestamp");
  const required = positiveInt(requiredPriorSessions, "requiredPriorSessions");
  const space = requiredText(priceSpace, "priceSpace");
  const tradingDates = Array.isArray(priorTradingDates)
    ? [...new Set(priorTradingDates.map((x) => isoDate(x, "priorTradingDates[]")))]
        .filter((x) => x < date)
        .sort()
    : null;
  const exactSessionContractAvailable =
    listingMetadata?.state === "READY"
    && listingMetadata?.byMarketSymbol
    && Array.isArray(tradingDates)
    && tradingDates.length > 0;
  const lifecycleIndex = buildLifecycleIndex(certifiedNoTradingIntervals, date);

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
            MAX(market_date) AS last_selected_date,
            GROUP_CONCAT(market_date, ',') AS selected_dates_csv
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
    const listing = market && exactSessionContractAvailable
      ? listingMetadata.byMarketSymbol[`${market}|${symbol}`] || null
      : null;
    const listingDate = listing?.listingDate || null;
    const selectedDates = dateCsv(row?.selected_dates_csv);
    const selectedSet = new Set(selectedDates);
    const selectedFirstDate = selectedDates[0] || row?.first_selected_date || null;
    const selectedLastDate = selectedDates.at(-1) || row?.last_selected_date || null;
    const lifecycleIntervals = market
      ? lifecycleIndex.get(`${market}|${symbol}`) || []
      : [];

    let requiredForSymbol = required;
    let ageLimited = false;
    let expectedDates = [];
    let expectedFirstDate = null;
    let expectedLastDate = null;
    let expectedSessionCalendarSufficient = false;
    let lifecycleExcludedSessionCount = 0;
    let sessionReconciliationState = "EXPECTED_SESSION_CONTRACT_UNAVAILABLE";

    if (exactSessionContractAvailable && market && listingDate) {
      const membershipDates = listingDate === date
        ? []
        : tradingDates.filter((x) => x >= listingDate);
      const eligibleDates = membershipDates.filter((x) => {
        const excluded = lifecycleIntervals.some((interval) => intervalContainsDate(x, interval));
        if (excluded) lifecycleExcludedSessionCount += 1;
        return !excluded;
      });
      const listingBoundaryInsideCalendar = listingDate >= tradingDates[0];
      expectedSessionCalendarSufficient =
        eligibleDates.length >= required || listingBoundaryInsideCalendar;
      if (expectedSessionCalendarSufficient) {
        expectedDates = eligibleDates.slice(-required);
        requiredForSymbol = expectedDates.length;
        ageLimited = requiredForSymbol < required && listingBoundaryInsideCalendar;
        expectedFirstDate = expectedDates[0] || null;
        expectedLastDate = expectedDates.at(-1) || null;
        sessionReconciliationState = "EXACT_EXPECTED_SESSION_SET_AVAILABLE";
      } else {
        expectedDates = eligibleDates;
        expectedFirstDate = expectedDates[0] || null;
        expectedLastDate = expectedDates.at(-1) || null;
        sessionReconciliationState = "EXPECTED_SESSION_CALENDAR_WINDOW_INSUFFICIENT";
      }
    } else if (exactSessionContractAvailable && market && !listingDate) {
      sessionReconciliationState = "LISTING_BOUNDARY_UNCERTIFIED";
    }

    const expectedSet = new Set(expectedDates);
    const missingExpectedSessions = expectedDates.filter((x) => !selectedSet.has(x));
    const unexpectedSelectedSessions = selectedDates.filter((x) => !expectedSet.has(x));
    const observedExpectedSessionCount = expectedDates.length - missingExpectedSessions.length;
    const exactSessionReconciliationReady =
      sessionReconciliationState === "EXACT_EXPECTED_SESSION_SET_AVAILABLE"
      && selectedDates.length === selectedDateCount
      && selectedDateCount === requiredForSymbol
      && missingExpectedSessions.length === 0
      && unexpectedSelectedSessions.length === 0;

    const expectedSessionHash = sessionReconciliationState === "EXACT_EXPECTED_SESSION_SET_AVAILABLE"
      ? await sha256Hex({ market, symbol, marketDate: date, dates: expectedDates })
      : null;
    const observedSessionHash = await sha256Hex({
      market,
      symbol,
      marketDate: date,
      dates: selectedDates,
    });

    const historyReady =
      ambiguousDateCount === 0
      && exactSessionReconciliationReady;
    const continuityReady =
      historyReady
      && continuityEligibleCount >= requiredForSymbol;
    if (historyReady) historyReadyCount += 1;
    if (continuityReady) continuityReadyCount += 1;
    if (ambiguousDateCount > 0) ambiguousCount += 1;

    const blockerCodes = [];
    if (!market) blockerCodes.push("CURRENT_SYMBOL_MARKET_IDENTITY_MISSING");
    if (ambiguousDateCount > 0) blockerCodes.push("SYMBOL_LOCAL_REVISION_AMBIGUITY");
    if (!exactSessionContractAvailable) blockerCodes.push("SYMBOL_LOCAL_EXPECTED_SESSION_CONTRACT_UNAVAILABLE");
    else if (!listingDate) blockerCodes.push("SYMBOL_LOCAL_LISTING_BOUNDARY_UNCERTIFIED");
    if (sessionReconciliationState === "EXPECTED_SESSION_CALENDAR_WINDOW_INSUFFICIENT") {
      blockerCodes.push("SYMBOL_LOCAL_EXPECTED_SESSION_CALENDAR_WINDOW_INSUFFICIENT");
    }
    if (missingExpectedSessions.length > 0) blockerCodes.push("SYMBOL_LOCAL_EXPECTED_SESSION_MISSING");
    if (unexpectedSelectedSessions.length > 0) blockerCodes.push("SYMBOL_LOCAL_UNEXPECTED_SESSION_PRESENT");
    if (!historyReady) blockerCodes.push("INSUFFICIENT_PIT_HISTORY");
    if (historyReady && !continuityReady) blockerCodes.push("SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED");

    diagnostics.push({
      symbol,
      market,
      selectedDateCount,
      ambiguousDateCount,
      continuityEligibleCount,
      firstSelectedDate: selectedFirstDate,
      lastSelectedDate: selectedLastDate,
      listingDate,
      requiredPriorSessionsForSymbol: requiredForSymbol,
      listingAgeLimited: ageLimited,
      listingAgeBasis: exactSessionContractAvailable
        ? listingDate ? "OFFICIAL_CURRENT_LISTING_DATE_PLUS_OFFICIAL_TRADING_DATES" : "LISTING_BOUNDARY_UNCERTIFIED"
        : "EXPECTED_SESSION_CONTRACT_UNAVAILABLE",
      expectedFirstDate,
      expectedLastDate,
      expectedSessionCount: expectedDates.length,
      observedExpectedSessionCount,
      missingExpectedSessionCount: missingExpectedSessions.length,
      unexpectedSessionCount: unexpectedSelectedSessions.length,
      expectedSessionHash,
      observedSessionHash,
      missingExpectedSessionSample: Object.freeze(missingExpectedSessions.slice(0, 8)),
      unexpectedSessionSample: Object.freeze(unexpectedSelectedSessions.slice(0, 8)),
      selectedSessionDateCount: selectedDates.length,
      lifecycleExcludedSessionCount,
      certifiedLifecycleIntervalCount: lifecycleIntervals.length,
      expectedSessionCalendarSufficient,
      sessionReconciliationState,
      exactSessionReconciliationReady,
      historyReady,
      continuityReady,
      evaluationInputReady: continuityReady,
      readinessState: continuityReady ? "READY" : "INCOMPLETE",
      blockerCodes: Object.freeze(blockerCodes),
      denominatorAccounted: true,
    });
  }

  const currentCount = Number(snapshotBatch.ordinarySymbolCount || diagnostics.length);
  const accountedSymbolCount = diagnostics.length;
  const accountingComplete = currentCount > 0 && accountedSymbolCount === currentCount;
  const historyCoverage = currentCount > 0 ? historyReadyCount / currentCount : 0;
  const continuityCoverage = currentCount > 0 ? continuityReadyCount / currentCount : 0;

  // Aggregate coverage state remains descriptive. It is NOT the global fail-closed gate.
  // Symbol-local history/continuity/revision gaps stay in diagnostics; only source-wide
  // integrity failures, clock failures or universe-accounting failures may globally block.
  const state = currentCount === 0
    ? "NO_CURRENT_UNIVERSE"
    : !accountingComplete
      ? "UNIVERSE_ACCOUNTING_INCOMPLETE"
      : ambiguousCount > 0
        ? "REVISION_AMBIGUITY_PRESENT"
        : historyReadyCount < currentCount
          ? "HISTORY_COVERAGE_INCOMPLETE"
          : continuityReadyCount < currentCount
            ? "CONTINUITY_NOT_VERIFIED"
            : "READY";
  const globalIntegrityState =
    currentCount > 0 && accountingComplete ? "READY" : "BLOCKED";
  const globalBlockerCodes = globalIntegrityState === "READY"
    ? []
    : currentCount === 0
      ? ["NO_CURRENT_UNIVERSE"]
      : ["UNIVERSE_ACCOUNTING_INCOMPLETE"];
  const symbolLocalIncompleteCount = Math.max(0, currentCount - continuityReadyCount);
  const selectionDenominatorComplete =
    globalIntegrityState === "READY"
    && symbolLocalIncompleteCount === 0
    && ambiguousCount === 0;

  return deepFreeze({
    version: DAILY_SHADOW_HISTORY_READER_VERSION,
    state,
    marketDate: date,
    decisionTimestamp: clock,
    requiredPriorSessions: required,
    listingAgeAware: exactSessionContractAvailable,
    exactSessionReconciliationEnabled: exactSessionContractAvailable,
    listingMetadataState: listingMetadata?.state || "NOT_PROVIDED",
    priorTradingDateCount: tradingDates?.length || 0,
    certifiedNoTradingIntervalCount: certifiedNoTradingIntervals.length,
    currentUniverseCount: currentCount,
    accountedSymbolCount,
    accountingComplete,
    globalIntegrityState,
    globalBlockerCodes: Object.freeze(globalBlockerCodes),
    historyReadyCount,
    continuityReadyCount,
    symbolLocalIncompleteCount,
    ambiguousSymbolCount: ambiguousCount,
    historyCoverage,
    continuityCoverage,
    selectionDenominatorComplete,
    diagnostics: Object.freeze(diagnostics),
    readOnly: true,
    externalMutationPerformed: false,
  });
}
