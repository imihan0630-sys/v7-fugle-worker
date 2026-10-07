import { deepFreeze } from "./factor_snapshot.mjs";
import { historicalUniverseMembershipActiveOnDateV0_1 } from "./historical_universe_registry_v0_1.mjs";

export const HISTORICAL_MARKET_YEAR_COVERAGE_VERSION = "0.2-RESEARCH";


export function buildObservedIntervalUniverseRegistryV0_1({
  market,
  rows = [],
  currentListingByMarketSymbol = {},
  fromDate,
  toDate,
} = {}) {
  const mkt = String(market || "").trim();
  if (!["TWSE","TPEX"].includes(mkt)) throw new Error("market must be TWSE or TPEX");
  const from = requiredDate(fromDate, "fromDate");
  const to = requiredDate(toDate, "toDate");
  if (to < from) throw new Error("toDate cannot be earlier than fromDate");
  if (!Array.isArray(rows)) throw new Error("rows must be an array");

  const observed = new Map();
  for (const row of rows) {
    if (!row || row.market !== mkt) continue;
    if (row.marketDate < from || row.marketDate > to) continue;
    const symbol = String(row.symbol || "").trim();
    if (!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const prior = observed.get(symbol) || { symbol, firstObservedDate: row.marketDate, lastObservedDate: row.marketDate };
    if (row.marketDate < prior.firstObservedDate) prior.firstObservedDate = row.marketDate;
    if (row.marketDate > prior.lastObservedDate) prior.lastObservedDate = row.marketDate;
    observed.set(symbol, prior);
  }

  const symbols = new Set(observed.keys());
  for (const [key, meta] of Object.entries(currentListingByMarketSymbol || {})) {
    if (!key.startsWith(mkt + "|")) continue;
    const symbol = key.slice(mkt.length + 1);
    if (!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const listingDate = meta?.listingDate ? requiredDate(meta.listingDate, "listingDate") : null;
    if (listingDate && listingDate <= to) symbols.add(symbol);
  }

  const memberships = [];
  let officialCurrentCount = 0;
  let observedHistoricalOnlyCount = 0;
  let currentWithoutObservedRowsCount = 0;

  for (const symbol of [...symbols].sort()) {
    const obs = observed.get(symbol) || null;
    const meta = currentListingByMarketSymbol?.[mkt + "|" + symbol] || null;
    const listingDate = meta?.listingDate ? requiredDate(meta.listingDate, "listingDate") : null;
    let effectiveFrom;
    let effectiveTo;
    let membershipBasis;
    if (meta) {
      officialCurrentCount += 1;
      effectiveFrom = listingDate && listingDate > from ? listingDate : from;
      effectiveTo = null;
      membershipBasis = obs
        ? "OFFICIAL_CURRENT_LISTING_DATE_PLUS_A1_OBSERVED"
        : "OFFICIAL_CURRENT_LISTING_DATE_NO_A1_OBSERVATION";
      if (!obs) currentWithoutObservedRowsCount += 1;
    } else {
      observedHistoricalOnlyCount += 1;
      effectiveFrom = obs?.firstObservedDate || from;
      effectiveTo = obs?.lastObservedDate || to;
      membershipBasis = "A1_OBSERVED_INTERVAL_ONLY_NO_OFFICIAL_DELISTING_UNION";
    }
    memberships.push(deepFreeze({
      market:mkt,
      symbol,
      replayEligible:true,
      effectiveFrom,
      effectiveTo,
      listingDate:listingDate || null,
      firstObservedDate:obs?.firstObservedDate || null,
      lastObservedDate:obs?.lastObservedDate || null,
      membershipBasis,
    }));
  }

  return deepFreeze({
    schemaVersion:"S2_OBSERVED_INTERVAL_UNIVERSE_REGISTRY_V0_1",
    state:"PARTIAL_OBSERVED_INTERVAL_UNIVERSE",
    market:mkt,
    fromDate:from,
    toDate:to,
    membershipCount:memberships.length,
    officialCurrentCount,
    observedHistoricalOnlyCount,
    currentWithoutObservedRowsCount,
    survivorshipComplete:false,
    officialDelistingUnionComplete:false,
    memberships:Object.freeze(memberships),
  });
}

function requiredDate(value, field) {
  const text = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function finitePositive(value) {
  return Number.isFinite(value) && value > 0;
}

function finiteNonNegativeOrNull(value) {
  return value === null || value === undefined || (Number.isFinite(value) && value >= 0);
}

function inInterval(date, interval) {
  if (date < interval.suspendedFrom) return false;
  if (interval.resumedOn) return date < interval.resumedOn;
  return date <= interval.coverageTo;
}

export function classifyHistoricalA1ObservationV0_1(row) {
  if (!row || typeof row !== "object") throw new Error("row is required");
  const ohlc = [row.open,row.high,row.low,row.close];
  const validOhlc = ohlc.every(finitePositive)
    && row.high >= row.low
    && row.high >= row.open
    && row.high >= row.close
    && row.low <= row.open
    && row.low <= row.close;
  const validClose = finitePositive(row.close);
  const zeroTrade = [row.volumeShares,row.tradeValue,row.transactions]
    .every((value) => value === 0);
  const positiveActivity = [row.volumeShares,row.tradeValue,row.transactions]
    .some((value) => Number.isFinite(value) && value > 0);

  let state = "VALID_OHLC";
  if (!validOhlc && !validClose && zeroTrade) state = "OFFICIAL_ZERO_TRADE_NO_PRICE";
  else if (!validOhlc && !validClose && positiveActivity) state = "POSITIVE_ACTIVITY_NO_VALID_CLOSE";
  else if (!validOhlc && validClose) state = "PARTIAL_OHLC_WITH_VALID_CLOSE";
  else if (!validOhlc) state = "INVALID_OR_UNKNOWN_OHLC";

  return deepFreeze({ state, validOhlc, validClose, zeroTrade, positiveActivity });
}

export function buildHistoricalMarketYearCoverageV0_1({
  market,
  year,
  fromDate,
  toDate,
  tradingDates = [],
  registry,
  rows = [],
  suspensionIntervals = [],
} = {}) {
  const mkt = String(market || "").trim();
  if (!["TWSE","TPEX"].includes(mkt)) throw new Error("market must be TWSE or TPEX");
  const yr = Number(year);
  if (!Number.isInteger(yr) || yr < 2017) throw new Error("year must be >= 2017");
  const from = requiredDate(fromDate, "fromDate");
  const to = requiredDate(toDate, "toDate");
  if (to < from) throw new Error("toDate cannot be earlier than fromDate");
  if (!registry || !Array.isArray(registry.memberships)) throw new Error("registry.memberships is required");
  if (!Array.isArray(tradingDates) || !tradingDates.length) throw new Error("tradingDates are required");
  if (!Array.isArray(rows)) throw new Error("rows must be an array");

  const sessionSet = new Set(tradingDates);
  if (sessionSet.size !== tradingDates.length) throw new Error("duplicate trading date");
  for (const date of tradingDates) {
    requiredDate(date, "tradingDate");
    if (date < from || date > to) throw new Error("tradingDate outside requested range: " + date);
  }

  const relevantMemberships = registry.memberships.filter((m) =>
    m.market === mkt
    && m.replayEligible === true
    && m.effectiveFrom
    && m.effectiveFrom <= to
    && (
      m.effectiveTo === null
      || m.effectiveTo === undefined
      || (m.endBasis === "OFFICIAL_DELISTING_DATE" ? m.effectiveTo > from : m.effectiveTo >= from)
    )
  );

  const expectedKeys = new Set();
  const activeUniverseByDate = new Map();
  const uniqueUniverseSymbols = new Set();
  for (const date of tradingDates) {
    const seen = new Set();
    const active = relevantMemberships.filter((m) =>
      historicalUniverseMembershipActiveOnDateV0_1(m, date)
    );
    for (const m of active) {
      if (seen.has(m.symbol)) throw new Error("overlapping active membership: " + mkt + "|" + m.symbol + "|" + date);
      seen.add(m.symbol);
      uniqueUniverseSymbols.add(m.symbol);
      expectedKeys.add(date + "|" + m.symbol);
    }
    activeUniverseByDate.set(date, seen);
  }

  const actualKeys = new Set();
  const actualExpectedKeys = new Set();
  const unexpectedBars = [];
  const nonTradingDateBars = [];
  const observationStateCounts = {};
  const continuityStateCounts = {};
  const provenanceIssues = [];
  const actualDateSet = new Set();

  for (const row of rows) {
    if (row.market !== mkt) throw new Error("row market mismatch");
    if (row.marketDate < from || row.marketDate > to) continue;
    const key = row.marketDate + "|" + row.symbol;
    if (actualKeys.has(key)) throw new Error("duplicate market-symbol-date row: " + key);
    actualKeys.add(key);
    actualDateSet.add(row.marketDate);

    if (!sessionSet.has(row.marketDate)) {
      nonTradingDateBars.push(key);
      continue;
    }
    if (!expectedKeys.has(key)) unexpectedBars.push(key);
    else actualExpectedKeys.add(key);

    const obs = classifyHistoricalA1ObservationV0_1(row);
    observationStateCounts[obs.state] = (observationStateCounts[obs.state] || 0) + 1;
    const continuity = String(row.continuityState || "UNKNOWN");
    continuityStateCounts[continuity] = (continuityStateCounts[continuity] || 0) + 1;

    const issues = [];
    if (!row.sourceId) issues.push("SOURCE_ID_MISSING");
    if (!row.sourceRowHash) issues.push("SOURCE_ROW_HASH_MISSING");
    if (!Number.isFinite(Date.parse(row.observedAt || ""))) issues.push("OBSERVED_AT_INVALID");
    if (!Number.isFinite(Date.parse(row.availableAt || ""))) issues.push("AVAILABLE_AT_INVALID");
    if (Number.isFinite(Date.parse(row.observedAt || "")) && Number.isFinite(Date.parse(row.availableAt || ""))
      && Date.parse(row.availableAt) > Date.parse(row.observedAt)) {
      issues.push("AVAILABLE_AFTER_OBSERVED");
    }
    if (![row.open,row.high,row.low,row.close].every((v) => v === null || v === undefined || Number.isFinite(v))) {
      issues.push("NON_NUMERIC_OHLC");
    }
    if (![row.volumeShares,row.tradeValue,row.transactions].every(finiteNonNegativeOrNull)) {
      issues.push("INVALID_ACTIVITY_FIELD");
    }
    if (issues.length) provenanceIssues.push({ key, issues });
  }

  const intervalBySymbol = new Map();
  for (const raw of suspensionIntervals) {
    if (!raw || raw.market !== mkt || !raw.symbol) continue;
    const interval = {
      market:mkt,
      symbol:String(raw.symbol),
      suspendedFrom:requiredDate(raw.suspendedFrom, "suspendedFrom"),
      resumedOn:raw.resumedOn ? requiredDate(raw.resumedOn, "resumedOn") : null,
      coverageTo:requiredDate(raw.coverageTo || to, "coverageTo"),
      sourceRowHash:raw.sourceRowHash || null,
    };
    if (!intervalBySymbol.has(interval.symbol)) intervalBySymbol.set(interval.symbol, []);
    intervalBySymbol.get(interval.symbol).push(interval);
  }

  const missingReasonCounts = {};
  const missingSample = [];
  const missingBySymbolMap = new Map();
  let unknownMissingBars = 0;
  let suspensionMissingBars = 0;
  for (const key of expectedKeys) {
    if (actualExpectedKeys.has(key)) continue;
    const [date,symbol] = key.split("|");
    const matched = (intervalBySymbol.get(symbol) || []).find((x) => inInterval(date, x));
    const reason = matched ? "OFFICIAL_SUSPENSION_INTERVAL" : "UNKNOWN_SYMBOL_SESSION_GAP";
    missingReasonCounts[reason] = (missingReasonCounts[reason] || 0) + 1;
    if (matched) suspensionMissingBars += 1;
    else unknownMissingBars += 1;
    const grouped = missingBySymbolMap.get(symbol) || {
      symbol,missingCount:0,unknownCount:0,suspensionCount:0,firstMissingDate:null,lastMissingDate:null,
    };
    grouped.missingCount += 1;
    if (matched) grouped.suspensionCount += 1;
    else grouped.unknownCount += 1;
    if (!grouped.firstMissingDate || date < grouped.firstMissingDate) grouped.firstMissingDate = date;
    if (!grouped.lastMissingDate || date > grouped.lastMissingDate) grouped.lastMissingDate = date;
    missingBySymbolMap.set(symbol, grouped);
    if (missingSample.length < 100) {
      missingSample.push({ marketDate:date,symbol,reason,sourceRowHash:matched?.sourceRowHash || null });
    }
  }

  const missingBySymbol = [...missingBySymbolMap.values()]
    .sort((a,b) => b.missingCount - a.missingCount || a.symbol.localeCompare(b.symbol));
  const missingTradingDates = tradingDates.filter((d) => !actualDateSet.has(d));
  const continuityUnverified = Object.entries(continuityStateCounts)
    .filter(([state]) => state === "UNVERIFIED" || state === "UNKNOWN")
    .reduce((sum,[,count]) => sum + count, 0);
  const nonPriceRows = Object.entries(observationStateCounts)
    .filter(([state]) => state !== "VALID_OHLC")
    .reduce((sum,[,count]) => sum + count, 0);

  // Missing active-universe symbol sessions are a separate provenance/readiness
  // question from whether the official A1 source was physically captured intact.
  // Do not call an exchange-omitted symbol-session a storage/source loss unless
  // fresh-source reconciliation proves the row was actually present upstream.
  const structuralCoverageState = unexpectedBars.length === 0
      && nonTradingDateBars.length === 0
      && missingTradingDates.length === 0
      && provenanceIssues.length === 0
    ? "PASS" : "BLOCKED";
  const symbolSessionReadiness = unknownMissingBars === 0
    ? "PASS_CLASSIFIED"
    : "PARTIAL_UNKNOWN_GAPS";
  const pitReadiness = provenanceIssues.length === 0 ? "PASS_CONSERVATIVE_SESSION_FINALITY" : "BLOCKED";
  const continuityReadiness = continuityUnverified === 0 ? "PASS" : "PARTIAL_UNVERIFIED";
  const technicalPriceReadiness = nonPriceRows === 0 ? "PASS" : "PARTIAL_NONPRICE_OBSERVATIONS";
  const overallState = structuralCoverageState === "BLOCKED" || pitReadiness === "BLOCKED"
    ? "BLOCKED"
    : (
      symbolSessionReadiness === "PASS_CLASSIFIED"
      && continuityReadiness === "PASS"
      && technicalPriceReadiness === "PASS"
        ? "PASS"
        : "PARTIAL"
    );

  return deepFreeze({
    market:mkt,year:yr,fromDate:from,toDate:to,
    expectedSessions:tradingDates.length,
    actualSessions:actualDateSet.size,
    historicalUniverseSize:uniqueUniverseSymbols.size,
    membershipSessionDenominator:expectedKeys.size,
    actualBars:actualExpectedKeys.size,
    totalStoredRowsInRange:actualKeys.size,
    missingBars:expectedKeys.size - actualExpectedKeys.size,
    unknownBars:unknownMissingBars,
    suspensionClassifiedMissingBars:suspensionMissingBars,
    unexpectedBars:unexpectedBars.length,
    nonTradingDateBars:nonTradingDateBars.length,
    missingTradingDates:Object.freeze(missingTradingDates),
    missingReasonCounts:deepFreeze(missingReasonCounts),
    missingBySymbol:Object.freeze(missingBySymbol.map((x)=>deepFreeze(x))),
    observationStateCounts:deepFreeze(observationStateCounts),
    continuityStateCounts:deepFreeze(continuityStateCounts),
    provenanceIssueCount:provenanceIssues.length,
    provenanceIssueSample:Object.freeze(provenanceIssues.slice(0,100)),
    unexpectedBarSample:Object.freeze(unexpectedBars.slice(0,100)),
    missingSample:Object.freeze(missingSample),
    expectedBars:expectedKeys.size,
    classifiedGapBars:suspensionMissingBars,
    structuralCoverageState,
    rawCoverageState:structuralCoverageState,
    symbolSessionReadiness,
    pitReadiness,continuityReadiness,technicalPriceReadiness,overallState,
    schemaVersion:"S2_HISTORICAL_MARKET_YEAR_COVERAGE_V0_2",
  });
}
