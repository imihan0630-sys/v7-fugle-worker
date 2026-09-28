import { deepFreeze } from "./factor_snapshot.mjs";
import {
  fetchOfficialHistoricalA1DateV0_1,
  officialHistoricalA1SourceContractV0_1,
} from "./official_historical_a1_source_v0_1.mjs";
import {
  fetchHistoricalTwseCalendarV0_1,
  isHistoricalTradingDateV0_1,
} from "./historical_twse_calendar_v0_1.mjs";

export const OFFICIAL_HISTORICAL_BACKFILL_SOURCE_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value, field) {
  const text = requiredText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field + " must be YYYY-MM-DD");
  return text;
}

function shiftDate(date, days) {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function yearsInRange(fromDate, toDate) {
  const out = [];
  const start = Number(fromDate.slice(0, 4));
  const end = Number(toDate.slice(0, 4));
  for (let year = start; year <= end; year += 1) out.push(year);
  return out;
}

async function fetchCalendar(year, fetchImpl) {
  return fetchHistoricalTwseCalendarV0_1({ year, fetchImpl });
}

export async function buildOfficialTradingDatesV0_1({
  fromDate,
  toDate,
  fetchImpl = globalThis.fetch,
  calendarsByYear = null,
} = {}) {
  const from = isoDate(fromDate, "fromDate");
  const to = isoDate(toDate, "toDate");
  if (to < from) throw new Error("toDate cannot be earlier than fromDate");
  if (typeof fetchImpl !== "function" && !calendarsByYear) throw new Error("fetchImpl is required");

  const calendars = {};
  for (const year of yearsInRange(from, to)) {
    const supplied = calendarsByYear?.[year] || calendarsByYear?.[String(year)] || null;
    calendars[year] = supplied || await fetchCalendar(year, fetchImpl);
  }

  const dates = [];
  for (let date = from; date <= to; date = shiftDate(date, 1)) {
    const calendar = calendars[Number(date.slice(0, 4))];
    if (isHistoricalTradingDateV0_1(date, calendar)) dates.push(date);
  }

  return deepFreeze({
    fromDate: from,
    toDate: to,
    tradingDates: Object.freeze(dates),
    tradingDateCount: dates.length,
    calendarYears: Object.freeze(Object.keys(calendars).map(Number).sort((a,b)=>a-b)),
    source: "TWSE_OFFICIAL_HOLIDAY_SCHEDULE",
    schemaVersion: "S2_OFFICIAL_TRADING_DATES_V0_1",
  });
}

export async function fetchOfficialHistoricalA1RangeV0_1({
  market,
  fromDate,
  toDate,
  observedAt = new Date().toISOString(),
  fetchImpl = globalThis.fetch,
  calendarsByYear = null,
  pauseMs = 0,
  onDateReceipt = null,
} = {}) {
  const contract = officialHistoricalA1SourceContractV0_1(market);
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  if (!Number.isInteger(pauseMs) || pauseMs < 0 || pauseMs > 60000) {
    throw new Error("pauseMs must be an integer from 0 to 60000");
  }
  if (onDateReceipt !== null && typeof onDateReceipt !== "function") {
    throw new Error("onDateReceipt must be a function");
  }

  const trading = await buildOfficialTradingDatesV0_1({
    fromDate,
    toDate,
    fetchImpl,
    calendarsByYear,
  });

  const rows = [];
  const dateReceipts = [];
  for (let i = 0; i < trading.tradingDates.length; i += 1) {
    const marketDate = trading.tradingDates[i];
    const receipt = await fetchOfficialHistoricalA1DateV0_1({
      market,
      marketDate,
      observedAt,
      fetchImpl,
    });
    if (receipt.state !== "READY") {
      throw new Error(`official historical A1 not READY: ${market} ${marketDate} ${receipt.state}`);
    }
    if (receipt.sourceDateEvidence !== marketDate) {
      throw new Error(`source date mismatch escaped parser: ${market} ${marketDate}`);
    }
    rows.push(...receipt.rows);
    const dateReceipt = deepFreeze({
      market,
      marketDate,
      ordinarySymbolCount: receipt.ordinarySymbolCount,
      sourceDateEvidenceBasis: receipt.sourceDateEvidenceBasis,
      sourceId: receipt.sourceId,
      state: receipt.state,
    });
    dateReceipts.push(dateReceipt);
    if (onDateReceipt) await onDateReceipt(dateReceipt);

    if (pauseMs > 0 && i + 1 < trading.tradingDates.length) {
      await new Promise((resolve) => setTimeout(resolve, pauseMs));
    }
  }

  return deepFreeze({
    market,
    fromDate: trading.fromDate,
    toDate: trading.toDate,
    sourceContract: contract,
    tradingDateCount: trading.tradingDateCount,
    fetchedTradingDateCount: dateReceipts.length,
    rowCount: rows.length,
    rows: Object.freeze(rows),
    dateReceipts: Object.freeze(dateReceipts),
    calendarSource: trading.source,
    noNonTradingDateRequests: true,
    schemaVersion: "S2_OFFICIAL_HISTORICAL_A1_RANGE_V0_1",
  });
}

export function buildOfficialBackfillSourceContractsV0_1() {
  return deepFreeze({
    TWSE: officialHistoricalA1SourceContractV0_1("TWSE"),
    TPEX: officialHistoricalA1SourceContractV0_1("TPEX"),
  });
}
