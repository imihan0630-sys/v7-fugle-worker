import { deepFreeze } from "./factor_snapshot.mjs";

function requiredYear(value) {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new Error("invalid historical calendar year");
  return year;
}

function normalizeCalendarDate(value, expectedYear) {
  const text = String(value || "").trim();
  let match = text.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (match) {
    const year = Number(match[1]);
    if (year !== expectedYear) return null;
    return [String(year).padStart(4,"0"),String(Number(match[2])).padStart(2,"0"),String(Number(match[3])).padStart(2,"0")].join("-");
  }
  match = text.match(/^(\d{2,3})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (match) {
    const year = Number(match[1]) + 1911;
    if (year !== expectedYear) return null;
    return [String(year).padStart(4,"0"),String(Number(match[2])).padStart(2,"0"),String(Number(match[3])).padStart(2,"0")].join("-");
  }
  return null;
}

export function historicalTwseCalendarUrls(year) {
  const y = requiredYear(year);
  return Object.freeze([
    {
      convention: "GREGORIAN",
      url: "https://www.twse.com.tw/rwd/zh/holidaySchedule/holidaySchedule?response=json&queryYear=" + y,
    },
    {
      convention: "ROC",
      url: "https://www.twse.com.tw/rwd/zh/holidaySchedule/holidaySchedule?response=json&queryYear=" + (y - 1911),
    },
  ]);
}

export function parseHistoricalTwseCalendarV0_1(payload, year) {
  const y = requiredYear(year);
  const payloadYear = Number(payload?.queryYear);
  if (![y, y - 1911].includes(payloadYear) || !Array.isArray(payload?.data) || payload.data.length === 0) {
    throw new Error("official historical TWSE trading calendar payload invalid");
  }

  const normalizedRows = payload.data
    .filter(Array.isArray)
    .map((row) => ({
      date: normalizeCalendarDate(row?.[0], y),
      label: String(row?.[1] || "").trim(),
      raw: row,
    }))
    .filter((row) => row.date);

  if (!normalizedRows.length) {
    throw new Error("official historical TWSE trading calendar has no normalized dates");
  }

  const holidays = normalizedRows
    .filter((row) => !row.label.includes("交易日"))
    .map((row) => row.date);

  return deepFreeze({
    year: y,
    holidays: [...new Set(holidays)].sort(),
    source: "TWSE_OFFICIAL_HOLIDAY_SCHEDULE_HISTORICAL",
    queryYearConvention: payloadYear === y ? "GREGORIAN" : "ROC",
    queryYearVerified: true,
  });
}

export function isHistoricalTradingDateV0_1(marketDate, calendar) {
  const date = String(marketDate || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("marketDate must be YYYY-MM-DD");
  if (!calendar || calendar.year !== Number(date.slice(0,4)) || !Array.isArray(calendar.holidays)) {
    throw new Error("matching historical trading calendar is required");
  }
  const day = new Date(date + "T12:00:00Z").getUTCDay();
  if (day === 0 || day === 6) return false;
  return !calendar.holidays.includes(date);
}

export async function fetchHistoricalTwseCalendarV0_1({
  year,
  fetchImpl = globalThis.fetch,
} = {}) {
  const y = requiredYear(year);
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");
  const errors = [];
  for (const attempt of historicalTwseCalendarUrls(y)) {
    try {
      const response = await fetchImpl(attempt.url, {
        method:"GET",
        headers:{Accept:"application/json","User-Agent":"System2-Historical-Calendar/0.1"},
      });
      if (!response?.ok) {
        errors.push(attempt.convention + ":HTTP_" + response?.status);
        continue;
      }
      return parseHistoricalTwseCalendarV0_1(await response.json(), y);
    } catch (error) {
      errors.push(attempt.convention + ":" + String(error?.message || error));
    }
  }
  throw new Error("official historical TWSE calendar unavailable for " + y + ": " + errors.join(" | "));
}
