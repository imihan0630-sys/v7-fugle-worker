import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const B2_INDUSTRY_SNAPSHOT_CONTRACT_VERSION = "0.1";

export const B2_OFFICIAL_ENDPOINTS_V0_1 = deepFreeze({
  TWSE_PROFILE: "https://openapi.twse.com.tw/v1/opendata/t187ap03_L",
  TPEX_PROFILE: "https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap03_O",
  TWSE_DAILY: "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL",
  TPEX_DAILY: "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes",
});

const MARKET_MINIMUMS = deepFreeze({ TWSE: 600, TPEX: 450 });

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function pick(row, keys) {
  for (const key of keys) {
    if (row && row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }
  return null;
}

function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
}

function numberValue(value) {
  const raw = String(value ?? "").replaceAll(",", "").replaceAll("%", "").trim();
  if (!raw || raw === "--" || raw === "---" || raw === "N/A") return null;
  const normalized = raw
    .replace(/^\+/, "")
    .replace(/^X/i, "")
    .replace(/^除權息/, "")
    .trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function normalizeDate(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 7) {
    return `${Number(digits.slice(0, 3)) + 1911}-${digits.slice(3, 5)}-${digits.slice(5, 7)}`;
  }
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return null;
}

export function parseIndustryProfiles(rows, market) {
  if (!Array.isArray(rows)) return { market, state: "INVALID_PAYLOAD", profiles: {} };
  const profiles = {};
  for (const row of rows) {
    const symbol = String(pick(row, [
      "公司代號", "公司代號 ", "Code", "SecuritiesCompanyCode",
    ]) || "").trim();
    if (!ordinarySymbol(symbol)) continue;
    const industry = String(pick(row, [
      "產業別", "Industry", "SecuritiesIndustryCode",
    ]) || "").trim();
    profiles[symbol] = {
      symbol,
      market,
      industry: industry || null,
      profileDate: normalizeDate(pick(row, ["出表日期", "Date", "date"])),
    };
  }
  return {
    market,
    state: Object.keys(profiles).length ? "OBSERVED" : "INVALID_PAYLOAD",
    profiles,
  };
}

export function parseIndustryDailyRows(rows, market, marketDate) {
  if (!Array.isArray(rows)) return { market, state: "INVALID_PAYLOAD", rows: {} };
  const out = {};
  for (const row of rows) {
    const symbol = String(pick(row, [
      "Code", "SecuritiesCompanyCode", "證券代號", "股票代號",
    ]) || "").trim();
    if (!ordinarySymbol(symbol)) continue;
    const rowDate = normalizeDate(pick(row, ["Date", "日期", "資料日期"]));
    if (rowDate && rowDate !== marketDate) continue;

    const changePercent = numberValue(pick(row, [
      "ChangePercent", "ChangeRate", "漲跌幅", "漲跌幅(%)",
    ]));
    const changeAmount = numberValue(pick(row, [
      "Change", "ChangeAmount", "漲跌價差", "漲跌",
    ]));
    let direction = "UNKNOWN";
    const directional = changePercent ?? changeAmount;
    if (directional !== null) {
      direction = directional > 0 ? "UP" : directional < 0 ? "DOWN" : "FLAT";
    }

    out[symbol] = {
      symbol,
      market,
      marketDate,
      direction,
      changePercent,
      close: numberValue(pick(row, ["ClosingPrice", "Close", "收盤價"])),
      tradeValue: numberValue(pick(row, [
        "TradeValue", "TransactionAmount", "成交金額",
      ])),
    };
  }
  return {
    market,
    state: Object.keys(out).length ? "OBSERVED" : "INVALID_PAYLOAD",
    rows: out,
  };
}

function buildMarketSummary(market, daily, profile) {
  const dailyRows = Object.values(daily.rows || {});
  const minimum = MARKET_MINIMUMS[market];
  const joined = dailyRows
    .map((row) => ({ ...row, profile: profile.profiles?.[row.symbol] || null }))
    .filter((row) => row.profile?.industry);

  return {
    market,
    minimumRecordCount: minimum,
    dailyOrdinarySymbolCount: dailyRows.length,
    classifiedJoinedCount: joined.length,
    classificationCoverageRate: dailyRows.length ? joined.length / dailyRows.length : 0,
    dailyCoveragePass: dailyRows.length >= minimum,
  };
}

function aggregateIndustries(marketDate, pairs) {
  const groups = new Map();
  for (const pair of pairs) {
    const industry = pair.profile?.industry;
    if (!industry) continue;
    const key = `${pair.market}:${industry}`;
    if (!groups.has(key)) {
      groups.set(key, {
        industryKey: key,
        market: pair.market,
        industry,
        marketDate,
        memberCount: 0,
        up: 0,
        down: 0,
        flat: 0,
        unknownDirection: 0,
        knownChangePercent: [],
        knownTradeValue: [],
      });
    }
    const g = groups.get(key);
    g.memberCount += 1;
    if (pair.direction === "UP") g.up += 1;
    else if (pair.direction === "DOWN") g.down += 1;
    else if (pair.direction === "FLAT") g.flat += 1;
    else g.unknownDirection += 1;
    if (Number.isFinite(pair.changePercent)) g.knownChangePercent.push(pair.changePercent);
    if (Number.isFinite(pair.tradeValue)) g.knownTradeValue.push(pair.tradeValue);
  }

  return [...groups.values()]
    .map((g) => {
      const directionalCount = g.up + g.down + g.flat;
      const meanChangePercent = g.knownChangePercent.length
        ? g.knownChangePercent.reduce((a, b) => a + b, 0) / g.knownChangePercent.length
        : null;
      const totalTradeValue = g.knownTradeValue.length
        ? g.knownTradeValue.reduce((a, b) => a + b, 0)
        : null;
      return {
        industryKey: g.industryKey,
        market: g.market,
        industry: g.industry,
        marketDate,
        memberCount: g.memberCount,
        up: g.up,
        down: g.down,
        flat: g.flat,
        unknownDirection: g.unknownDirection,
        breadthNetShare: directionalCount ? (g.up - g.down) / directionalCount : null,
        meanChangePercent,
        totalTradeValue,
      };
    })
    .sort((a, b) => a.industryKey.localeCompare(b.industryKey));
}

export async function buildB2IndustrySnapshotReceipt({
  receiptId,
  marketDate,
  observedAt,
  twseProfileRows,
  tpexProfileRows,
  twseDailyRows,
  tpexDailyRows,
} = {}) {
  requiredText(marketDate, "marketDate");
  const seenAt = new Date(requiredText(observedAt, "observedAt")).toISOString();

  const twseProfile = parseIndustryProfiles(twseProfileRows, "TWSE");
  const tpexProfile = parseIndustryProfiles(tpexProfileRows, "TPEX");
  const twseDaily = parseIndustryDailyRows(twseDailyRows, "TWSE", marketDate);
  const tpexDaily = parseIndustryDailyRows(tpexDailyRows, "TPEX", marketDate);

  const marketSummaries = [
    buildMarketSummary("TWSE", twseDaily, twseProfile),
    buildMarketSummary("TPEX", tpexDaily, tpexProfile),
  ];

  const pairs = [
    ...Object.values(twseDaily.rows || {}).map((row) => ({
      ...row,
      profile: twseProfile.profiles?.[row.symbol] || null,
    })),
    ...Object.values(tpexDaily.rows || {}).map((row) => ({
      ...row,
      profile: tpexProfile.profiles?.[row.symbol] || null,
    })),
  ];
  const industries = aggregateIndustries(marketDate, pairs);
  const dailyCoveragePass = marketSummaries.every((x) => x.dailyCoveragePass);
  const hasClassification = marketSummaries.every((x) => x.classifiedJoinedCount > 0);

  const base = {
    receiptId: requiredText(receiptId, "receiptId"),
    contractFamilyId: "B2_INDUSTRY_THESIS_PROSPECTIVE",
    contractVersion: B2_INDUSTRY_SNAPSHOT_CONTRACT_VERSION,
    marketDate,
    observedAt: seenAt,
    endpointClass: "OFFICIAL_PUBLIC_GET_PLUS_DETERMINISTIC_DERIVATION",
    endpoints: B2_OFFICIAL_ENDPOINTS_V0_1,
    marketSummaries,
    industries,
    state:
      dailyCoveragePass && hasClassification
        ? "DERIVED_SNAPSHOT_OBSERVED"
        : "DERIVED_SNAPSHOT_INCOMPLETE",
    classificationVintageSemantics:
      "PROFILE_FIRST_OBSERVED_PROSPECTIVELY_NO_HISTORICAL_BACKFILL",
    thesisDirectionAssigned: false,
    strategyScoreAssigned: false,
    dependencyCoverageEligible: dailyCoveragePass && hasClassification,
    externalMutationPerformed: false,
    schemaVersion: "S2_B2_INDUSTRY_SNAPSHOT_RECEIPT_V0_1",
  };
  const receiptHash = await sha256Hex(base);
  return deepFreeze({ ...base, receiptHash });
}

export { MARKET_MINIMUMS };
