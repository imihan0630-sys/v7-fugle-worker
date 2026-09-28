import { deepFreeze } from "./factor_snapshot.mjs";

const USER_AGENT = "System2-ReadOnly-Trading-Calendar/0.1";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertMarketDate(value) {
  const date = requiredText(value, "marketDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("marketDate must be YYYY-MM-DD");
  return date;
}

export function officialTwseCalendarUrl(year) {
  const y = Number(year);
  if (!Number.isInteger(y) || y < 2000 || y > 2100) throw new Error("invalid calendar year");
  return `https://www.twse.com.tw/rwd/zh/holidaySchedule/holidaySchedule?response=json&queryYear=${y}`;
}

export function parseTwseTradingCalendar(payload, year) {
  const y = Number(year);
  if (Number(payload?.queryYear) !== y || !Array.isArray(payload?.data) || payload.data.length === 0) {
    throw new Error("official TWSE trading calendar payload invalid");
  }

  const holidays = payload.data
    .filter((row) => Array.isArray(row) && !String(row?.[1] || "").includes("交易日"))
    .map((row) => String(row?.[0] || "").trim())
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value));

  return deepFreeze({
    year: y,
    holidays: [...new Set(holidays)].sort(),
    source: "TWSE_OFFICIAL_HOLIDAY_SCHEDULE",
    queryYearVerified: true,
  });
}

export function isTradingDateWithCalendar(marketDate, calendar) {
  const date = assertMarketDate(marketDate);
  if (!calendar || calendar.year !== Number(date.slice(0, 4)) || !Array.isArray(calendar.holidays)) {
    throw new Error("matching official trading calendar is required");
  }
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (day === 0 || day === 6) return false;
  return !calendar.holidays.includes(date);
}

export async function probeTwseTradingDate({
  marketDate,
  fetchImpl = fetch,
  timeoutMs = 30_000,
} = {}) {
  const date = assertMarketDate(marketDate);
  const year = Number(date.slice(0, 4));
  const response = await fetchImpl(officialTwseCalendarUrl(year), {
    method: "GET",
    redirect: "follow",
    headers: { accept: "application/json", "user-agent": USER_AGENT },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    return deepFreeze({
      marketDate: date,
      state: "SOURCE_ERROR",
      httpStatus: Number(response.status),
      expectedTradingDay: null,
      externalMutationPerformed: false,
    });
  }
  let payload;
  try {
    payload = await response.json();
  } catch {
    return deepFreeze({
      marketDate: date,
      state: "INVALID_PAYLOAD",
      httpStatus: Number(response.status),
      expectedTradingDay: null,
      externalMutationPerformed: false,
    });
  }

  let calendar;
  try {
    calendar = parseTwseTradingCalendar(payload, year);
  } catch {
    return deepFreeze({
      marketDate: date,
      state: "INVALID_PAYLOAD",
      httpStatus: Number(response.status),
      expectedTradingDay: null,
      externalMutationPerformed: false,
    });
  }

  return deepFreeze({
    marketDate: date,
    state: "READY",
    httpStatus: Number(response.status),
    expectedTradingDay: isTradingDateWithCalendar(date, calendar),
    calendarYear: year,
    holidayCount: calendar.holidays.length,
    source: calendar.source,
    externalMutationPerformed: false,
  });
}
