import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const A5_FILING_VINTAGE_CONTRACT_VERSION = "0.1";

export const A5_OFFICIAL_ENDPOINTS_V0_1 = deepFreeze({
  TWSE_EPS: "https://openapi.twse.com.tw/v1/opendata/t187ap14_L",
  TPEX_EPS: "https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap14_O",
  TWSE_PROFIT: "https://openapi.twse.com.tw/v1/opendata/t187ap17_L",
  TPEX_PROFIT: "https://www.tpex.org.tw/openapi/v1/mopsfin_187ap17_O",
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

function normalizeOfficialDate(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 7) {
    return `${Number(digits.slice(0, 3)) + 1911}-${digits.slice(3, 5)}-${digits.slice(5, 7)}`;
  }
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return null;
}

function normalizeFinancialYear(value) {
  const n = Number(String(value || "").replace(/\D/g, ""));
  if (!Number.isInteger(n) || n <= 0) return null;
  return n < 1911 ? n + 1911 : n;
}

function normalizeQuarter(value) {
  const match = String(value || "").match(/[1-4]/);
  return match ? Number(match[0]) : null;
}

function vintageKey(year, quarter) {
  return Number.isInteger(year) && Number.isInteger(quarter)
    ? `${year}Q${quarter}`
    : null;
}

function compareVintage(a, b) {
  if (a.year !== b.year) return a.year - b.year;
  return a.quarter - b.quarter;
}

export function parseA5Rows(rows, market, dataset) {
  if (!Array.isArray(rows)) {
    return deepFreeze({
      state: "INVALID_PAYLOAD",
      market,
      dataset,
      rowCount: 0,
      ordinarySymbolCount: 0,
      latestOutputDate: null,
      latestVintage: null,
      bySymbol: {},
      reason: "PAYLOAD_NOT_ARRAY",
    });
  }

  const bySymbol = {};
  const outputDates = [];
  for (const row of rows) {
    const symbol = String(pick(row, [
      "公司代號", "公司代號 ", "Code", "SecuritiesCompanyCode",
    ]) || "").trim();
    if (!ordinarySymbol(symbol)) continue;

    const outputDate = normalizeOfficialDate(pick(row, [
      "出表日期", "出表日期 ", "Date", "date",
    ]));
    const year = normalizeFinancialYear(pick(row, ["年度", "Year", "year"]));
    const quarter = normalizeQuarter(pick(row, ["季別", "Quarter", "Season", "quarter"]));
    const key = vintageKey(year, quarter);
    if (outputDate) outputDates.push(outputDate);

    const normalized = {
      symbol,
      market,
      dataset,
      outputDate,
      financialYear: year,
      financialQuarter: quarter,
      vintageKey: key,
      industry: String(pick(row, [
        "產業別", "Industry", "SecuritiesIndustryCode",
      ]) || "").trim() || null,
    };

    const prior = bySymbol[symbol];
    if (!prior || (
      key && (!prior.vintageKey || compareVintage(normalized, prior) > 0)
    )) {
      bySymbol[symbol] = normalized;
    }
  }

  const rowsBySymbol = Object.values(bySymbol);
  const latest = rowsBySymbol
    .filter((x) => x.vintageKey)
    .sort(compareVintage)
    .at(-1) || null;

  return deepFreeze({
    state: rowsBySymbol.length > 0 ? "OBSERVED" : "INVALID_PAYLOAD",
    market,
    dataset,
    rowCount: rows.length,
    ordinarySymbolCount: rowsBySymbol.length,
    latestOutputDate: outputDates.sort().at(-1) || null,
    latestVintage: latest
      ? { year: latest.financialYear, quarter: latest.financialQuarter, key: latest.vintageKey }
      : null,
    bySymbol,
    reason: rowsBySymbol.length > 0 ? "ROWS_NORMALIZED" : "NO_ORDINARY_SYMBOL_ROWS",
  });
}

function summarizeMarket(market, eps, profit) {
  const symbols = new Set([
    ...Object.keys(eps.bySymbol || {}),
    ...Object.keys(profit.bySymbol || {}),
  ]);
  const intersection = [...symbols].filter(
    (symbol) => eps.bySymbol?.[symbol] && profit.bySymbol?.[symbol],
  );
  const vintages = {};
  for (const symbol of intersection) {
    const a = eps.bySymbol[symbol];
    const b = profit.bySymbol[symbol];
    if (!a.vintageKey || !b.vintageKey || a.vintageKey !== b.vintageKey) continue;
    vintages[a.vintageKey] = (vintages[a.vintageKey] || 0) + 1;
  }
  const dominantVintage = Object.entries(vintages)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .at(0) || null;
  const minimum = MARKET_MINIMUMS[market];

  return {
    market,
    minimumRecordCount: minimum,
    epsOrdinarySymbolCount: eps.ordinarySymbolCount,
    profitOrdinarySymbolCount: profit.ordinarySymbolCount,
    matchedSameVintageCount: Object.values(vintages).reduce((a, b) => a + b, 0),
    dominantVintage: dominantVintage
      ? { key: dominantVintage[0], count: dominantVintage[1] }
      : null,
    epsLatestOutputDate: eps.latestOutputDate,
    profitLatestOutputDate: profit.latestOutputDate,
    coveragePass:
      eps.ordinarySymbolCount >= minimum
      && profit.ordinarySymbolCount >= minimum
      && Object.values(vintages).reduce((a, b) => a + b, 0) >= minimum,
  };
}

export async function buildA5FilingVintageReceipt({
  receiptId,
  observedAt,
  twseEpsRows,
  tpexEpsRows,
  twseProfitRows,
  tpexProfitRows,
} = {}) {
  const seenAt = new Date(requiredText(observedAt, "observedAt")).toISOString();
  const twseEps = parseA5Rows(twseEpsRows, "TWSE", "EPS");
  const tpexEps = parseA5Rows(tpexEpsRows, "TPEX", "EPS");
  const twseProfit = parseA5Rows(twseProfitRows, "TWSE", "PROFIT");
  const tpexProfit = parseA5Rows(tpexProfitRows, "TPEX", "PROFIT");

  const markets = [
    summarizeMarket("TWSE", twseEps, twseProfit),
    summarizeMarket("TPEX", tpexEps, tpexProfit),
  ];
  const coveragePass = markets.every((x) => x.coveragePass);

  const base = {
    receiptId: requiredText(receiptId, "receiptId"),
    contractFamilyId: "A5_QUARTERLY_FINANCIALS",
    contractVersion: A5_FILING_VINTAGE_CONTRACT_VERSION,
    observedAt: seenAt,
    endpointClass: "OFFICIAL_PUBLIC_GET",
    endpoints: A5_OFFICIAL_ENDPOINTS_V0_1,
    markets,
    state: coveragePass ? "OBSERVED_COVERAGE_PASS" : "OBSERVED_COVERAGE_INCOMPLETE",
    publicationTimestampProven: false,
    companyFilingTimestampProven: false,
    firstKnownSemantics:
      "FIRST_OBSERVED_MARKET_WIDE_VINTAGE_UPPER_BOUND_NOT_COMPANY_FILING_TIME",
    pointInTimeUse:
      "PROSPECTIVE_ONLY_UNTIL_PER_COMPANY_PUBLICATION_VINTAGES_ARE_ACCUMULATED",
    dependencyCoverageEligible: coveragePass,
    externalMutationPerformed: false,
    schemaVersion: "S2_A5_FILING_VINTAGE_RECEIPT_V0_1",
  };

  const receiptHash = await sha256Hex(base);
  return deepFreeze({ ...base, receiptHash });
}

export { MARKET_MINIMUMS };
