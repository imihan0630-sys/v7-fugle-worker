import { deepFreeze } from "./factor_snapshot.mjs";

function requiredYear(value) {
  const year = Number(value);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) throw new Error("invalid historical calendar year");
  return year;
}

function requiredMonth(value) {
  const month = Number(value);
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new Error("invalid historical calendar month");
  return month;
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

function compactMonthAnchor(year, month) {
  return String(year) + String(month).padStart(2,"0") + "01";
}

function allWeekdays(year) {
  const out = [];
  for (
    let date = new Date(Date.UTC(year,0,1,12,0,0));
    date.getUTCFullYear() === year;
    date = new Date(date.getTime() + 86400000)
  ) {
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) out.push(date.toISOString().slice(0,10));
  }
  return out;
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

export function historicalTwseMonthlyTradingReportUrl(year, month) {
  const y = requiredYear(year);
  const m = requiredMonth(month);
  return "https://www.twse.com.tw/exchangeReport/FMTQIK?response=json&date=" + compactMonthAnchor(y,m);
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

export function parseHistoricalTwseMonthlyTradingDatesV0_1(payload, year, month) {
  const y = requiredYear(year);
  const m = requiredMonth(month);
  const expectedAnchor = compactMonthAnchor(y,m);
  const payloadAnchor = String(payload?.date || "").replace(/\D/g,"");
  const fields = Array.isArray(payload?.fields) ? payload.fields.map((x)=>String(x || "").trim()) : [];
  const dateIndex = fields.indexOf("日期");

  if (
    String(payload?.stat || "").toUpperCase() !== "OK"
    || payloadAnchor !== expectedAnchor
    || dateIndex < 0
    || !Array.isArray(payload?.data)
    || payload.data.length === 0
  ) {
    throw new Error("official TWSE FMTQIK monthly trading payload invalid");
  }

  const expectedPrefix = String(y) + "-" + String(m).padStart(2,"0") + "-";
  const dates = [];
  for (const row of payload.data) {
    if (!Array.isArray(row)) throw new Error("official TWSE FMTQIK row invalid");
    const date = normalizeCalendarDate(row[dateIndex],y);
    if (!date || !date.startsWith(expectedPrefix)) {
      throw new Error("official TWSE FMTQIK trading date escaped requested month");
    }
    dates.push(date);
  }

  const tradingDates = [...new Set(dates)].sort();
  if (tradingDates.length !== dates.length) {
    throw new Error("official TWSE FMTQIK duplicate trading date");
  }

  return deepFreeze({
    year:y,
    month:m,
    tradingDates:Object.freeze(tradingDates),
    source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
    queryMonthVerified:true,
    sourceMonthAnchor:expectedAnchor,
  });
}

async function fetchMonthlyFmtqik({
  year,
  month,
  fetchImpl,
  retryAttempts = 3,
  retryDelayMs = 250,
}) {
  const url = historicalTwseMonthlyTradingReportUrl(year,month);
  let lastError = null;

  for (let attempt=1; attempt<=retryAttempts; attempt+=1) {
    try {
      const response = await fetchImpl(url,{
        method:"GET",
        headers:{
          Accept:"application/json",
          "User-Agent":"System2-Historical-Calendar/0.2",
          Referer:"https://www.twse.com.tw/zh/trading/historical/fmtqik.html",
        },
      });
      if (!response?.ok) {
        const status = Number(response?.status);
        const error = new Error("TWSE FMTQIK HTTP_" + status);
        if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
          throw Object.assign(error,{nonRetryable:true});
        }
        throw error;
      }
      return parseHistoricalTwseMonthlyTradingDatesV0_1(await response.json(),year,month);
    } catch (error) {
      lastError = error;
      if (error?.nonRetryable === true) throw error;
      if (String(error?.message || "").includes("payload invalid")
        || String(error?.message || "").includes("escaped requested month")
        || String(error?.message || "").includes("duplicate trading date")) {
        throw error;
      }
      if (attempt < retryAttempts && retryDelayMs > 0) {
        await new Promise((resolve)=>setTimeout(resolve,retryDelayMs * attempt));
      }
    }
  }
  throw lastError || new Error("TWSE FMTQIK request failed");
}

export async function fetchHistoricalTwseFmtqikCalendarV0_1({
  year,
  fetchImpl = globalThis.fetch,
} = {}) {
  const y = requiredYear(year);
  if (typeof fetchImpl !== "function") throw new Error("fetchImpl is required");

  const tradingDates = [];
  for (let month=1; month<=12; month+=1) {
    const result = await fetchMonthlyFmtqik({year:y,month,fetchImpl});
    tradingDates.push(...result.tradingDates);
  }

  const exact = [...new Set(tradingDates)].sort();
  if (exact.length !== tradingDates.length) {
    throw new Error("official TWSE FMTQIK annual trading dates contain duplicates");
  }
  if (!exact.length) throw new Error("official TWSE FMTQIK annual trading dates empty");

  const exactSet = new Set(exact);
  const holidays = allWeekdays(y).filter((date)=>!exactSet.has(date));

  return deepFreeze({
    year:y,
    holidays:Object.freeze(holidays),
    tradingDates:Object.freeze(exact),
    source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
    queryYearConvention:"FMTQIK_MONTHLY",
    queryYearVerified:true,
    tradingDatesExact:true,
  });
}

export function isHistoricalTradingDateV0_1(marketDate, calendar) {
  const date = String(marketDate || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("marketDate must be YYYY-MM-DD");
  if (!calendar || calendar.year !== Number(date.slice(0,4))) {
    throw new Error("matching historical trading calendar is required");
  }

  if (Array.isArray(calendar.tradingDates)) {
    return calendar.tradingDates.includes(date);
  }
  if (!Array.isArray(calendar.holidays)) {
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

  // Keep the low-cost holiday schedule path first for compatibility/current-year
  // use. The TWSE endpoint currently ignores historical queryYear values, so
  // any year mismatch is deliberately rejected and falls through to FMTQIK.
  for (const attempt of historicalTwseCalendarUrls(y)) {
    try {
      const response = await fetchImpl(attempt.url, {
        method:"GET",
        headers:{Accept:"application/json","User-Agent":"System2-Historical-Calendar/0.2"},
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

  try {
    return await fetchHistoricalTwseFmtqikCalendarV0_1({year:y,fetchImpl});
  } catch (error) {
    errors.push("FMTQIK:" + String(error?.message || error));
  }

  throw new Error("official historical TWSE calendar unavailable for " + y + ": " + errors.join(" | "));
}
