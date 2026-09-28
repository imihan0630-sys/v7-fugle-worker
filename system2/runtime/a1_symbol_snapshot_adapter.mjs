import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const A1_SYMBOL_SNAPSHOT_CONTRACT_VERSION = "0.1";

export const A1_SYMBOL_SNAPSHOT_SOURCES = deepFreeze({
  TWSE: {
    sourceId: "A1_TWSE_DAILY_CLOSE",
    sourceName: "TWSE STOCK_DAY_ALL",
    sourceUrl: "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL",
    minimumOrdinarySymbols: 600,
  },
  TPEX: {
    sourceId: "A1_TPEX_DAILY_CLOSE",
    sourceName: "TPEx mainboard daily close quotes",
    sourceUrl: "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes",
    minimumOrdinarySymbols: 450,
  },
});

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  return value.trim();
}

function assertTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(`${field} must be an ISO timestamp`);
  return text;
}

function ordinarySymbol(value) {
  return /^[1-9][0-9]{3}$/.test(String(value || "").trim());
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

function pick(row, keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }
  return null;
}

function numeric(value, { positive = false, nonNegative = false } = {}) {
  const raw = String(value ?? "")
    .replaceAll(",", "")
    .replaceAll("%", "")
    .replace(/^\+/, "")
    .trim();
  if (!raw || raw === "--" || raw === "---" || raw.toUpperCase() === "N/A") return null;
  const normalized = raw
    .replace(/^X/i, "")
    .replace(/^除權息/, "")
    .trim();
  const number = Number(normalized);
  if (!Number.isFinite(number)) return null;
  if (positive && number <= 0) return null;
  if (nonNegative && number < 0) return null;
  return number;
}

const FIELD_MAP = deepFreeze({
  TWSE: {
    symbol: ["Code", "證券代號", "股票代號"],
    companyName: ["Name", "證券名稱", "公司名稱"],
    date: ["Date", "日期", "資料日期"],
    open: ["OpeningPrice", "Open", "開盤價"],
    high: ["HighestPrice", "High", "最高價"],
    low: ["LowestPrice", "Low", "最低價"],
    close: ["ClosingPrice", "Close", "收盤價"],
    volume: ["TradeVolume", "TradingShares", "成交股數", "成交量"],
    tradeValue: ["TradeValue", "TransactionAmount", "成交金額"],
    transactions: ["Transaction", "TransactionNumber", "成交筆數"],
    change: ["Change", "ChangeAmount", "漲跌價差", "漲跌"],
  },
  TPEX: {
    symbol: ["SecuritiesCompanyCode", "Code", "證券代號", "股票代號"],
    companyName: ["CompanyName", "SecuritiesCompanyName", "證券名稱", "公司名稱"],
    date: ["Date", "日期", "資料日期"],
    open: ["Open", "OpeningPrice", "開盤價"],
    high: ["High", "HighestPrice", "最高價"],
    low: ["Low", "LowestPrice", "最低價"],
    close: ["Close", "ClosingPrice", "收盤"],
    volume: ["TradingShares", "TradeVolume", "成交股數", "成交量"],
    tradeValue: ["TransactionAmount", "TradeValue", "成交金額"],
    transactions: ["TransactionNumber", "Transaction", "成交筆數"],
    change: ["Change", "ChangeAmount", "漲跌價差", "漲跌"],
  },
});

function priceState({ open, high, low, close }) {
  if ([open, high, low, close].every(Number.isFinite)) return "COMPLETE_OHLC";
  if (Number.isFinite(close)) return "CLOSE_ONLY";
  return "NO_USABLE_PRICE";
}

function ohlcConsistency({ open, high, low, close }) {
  const values = [open, high, low, close];
  if (!values.every(Number.isFinite)) return "NOT_TESTABLE";
  if (high < low || high < open || high < close || low > open || low > close) return "INCONSISTENT";
  return "CONSISTENT";
}

async function normalizeMarketRows({
  market,
  marketDate,
  observedAt,
  decisionTimestamp,
  rows,
  minimumOrdinarySymbols,
}) {
  const source = A1_SYMBOL_SNAPSHOT_SOURCES[market];
  const map = FIELD_MAP[market];
  if (!source || !map) throw new Error(`unsupported market: ${market}`);
  if (!Array.isArray(rows)) {
    return deepFreeze({
      market,
      sourceId: source.sourceId,
      sourceName: source.sourceName,
      sourceUrl: source.sourceUrl,
      state: "INVALID_PAYLOAD",
      marketDate,
      observedAt,
      decisionTimestamp,
      minimumOrdinarySymbols,
      targetDateOrdinaryRowCount: 0,
      normalizedSymbolCount: 0,
      duplicateSymbols: Object.freeze([]),
      invalidOhlcSymbols: Object.freeze([]),
      noUsablePriceSymbols: Object.freeze([]),
      snapshots: Object.freeze([]),
      blockerCodes: Object.freeze(["PAYLOAD_NOT_ARRAY"]),
    });
  }

  const bySymbol = new Map();
  const duplicateSymbols = new Set();
  const invalidOhlcSymbols = [];
  const noUsablePriceSymbols = [];
  let targetDateOrdinaryRowCount = 0;

  for (const row of rows) {
    const symbol = String(pick(row, map.symbol) || "").trim();
    if (!ordinarySymbol(symbol)) continue;
    const rowDate = normalizeDate(pick(row, map.date));
    if (rowDate !== marketDate) continue;
    targetDateOrdinaryRowCount += 1;

    if (bySymbol.has(symbol)) {
      duplicateSymbols.add(symbol);
      continue;
    }

    const open = numeric(pick(row, map.open), { positive: true });
    const high = numeric(pick(row, map.high), { positive: true });
    const low = numeric(pick(row, map.low), { positive: true });
    const close = numeric(pick(row, map.close), { positive: true });
    const volumeShares = numeric(pick(row, map.volume), { nonNegative: true });
    const tradeValue = numeric(pick(row, map.tradeValue), { nonNegative: true });
    const transactions = numeric(pick(row, map.transactions), { nonNegative: true });
    const change = numeric(pick(row, map.change));
    const pState = priceState({ open, high, low, close });
    const consistency = ohlcConsistency({ open, high, low, close });

    if (consistency === "INCONSISTENT") invalidOhlcSymbols.push(symbol);
    if (pState === "NO_USABLE_PRICE") noUsablePriceSymbols.push(symbol);

    const normalizedPayload = {
      symbol,
      companyName: String(pick(row, map.companyName) || "").trim() || null,
      market,
      marketDate,
      open,
      high,
      low,
      close,
      volumeShares,
      volumeLots: Number.isFinite(volumeShares) ? volumeShares / 1000 : null,
      tradeValue,
      transactions,
      change,
      priceState: pState,
      ohlcConsistency: consistency,
      provenance: {
        sourceId: source.sourceId,
        sourceName: source.sourceName,
        sourceUrl: source.sourceUrl,
        sourceDate: marketDate,
        observedAt,
        availableAt: observedAt,
        capturedAt: observedAt,
        pointInTimeEligible: Date.parse(observedAt) <= Date.parse(decisionTimestamp),
      },
      sourceFields: {
        date: pick(row, map.date),
        symbol: pick(row, map.symbol),
        companyName: pick(row, map.companyName),
        open: pick(row, map.open),
        high: pick(row, map.high),
        low: pick(row, map.low),
        close: pick(row, map.close),
        volume: pick(row, map.volume),
        tradeValue: pick(row, map.tradeValue),
        transactions: pick(row, map.transactions),
        change: pick(row, map.change),
      },
    };

    const sourceRowHash = await sha256Hex(normalizedPayload.sourceFields);
    bySymbol.set(symbol, deepFreeze({ ...normalizedPayload, sourceRowHash }));
  }

  const snapshots = [...bySymbol.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
  const blockerCodes = [];
  if (duplicateSymbols.size) blockerCodes.push("DUPLICATE_TARGET_DATE_SYMBOL");
  if (invalidOhlcSymbols.length) blockerCodes.push("OHLC_INCONSISTENCY");
  if (snapshots.length < minimumOrdinarySymbols) blockerCodes.push("INSUFFICIENT_ORDINARY_SYMBOL_COVERAGE");

  return deepFreeze({
    market,
    sourceId: source.sourceId,
    sourceName: source.sourceName,
    sourceUrl: source.sourceUrl,
    state: blockerCodes.length ? "INCOMPLETE" : "READY",
    marketDate,
    observedAt,
    decisionTimestamp,
    minimumOrdinarySymbols,
    targetDateOrdinaryRowCount,
    normalizedSymbolCount: snapshots.length,
    duplicateSymbols: Object.freeze([...duplicateSymbols].sort()),
    invalidOhlcSymbols: Object.freeze([...invalidOhlcSymbols].sort()),
    noUsablePriceSymbols: Object.freeze([...noUsablePriceSymbols].sort()),
    snapshots: Object.freeze(snapshots),
    blockerCodes: Object.freeze(blockerCodes),
  });
}

export async function buildA1SymbolSnapshotBatch({
  batchId,
  marketDate,
  decisionTimestamp,
  observedAt,
  twseRows,
  tpexRows,
  minimumByMarket = {},
} = {}) {
  const id = requiredText(batchId, "batchId");
  const date = requiredText(marketDate, "marketDate");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("marketDate must be YYYY-MM-DD");
  const clock = assertTimestamp(decisionTimestamp, "decisionTimestamp");
  const observed = assertTimestamp(observedAt, "observedAt");

  const twseMinimum = Number.isInteger(minimumByMarket.TWSE)
    ? minimumByMarket.TWSE
    : A1_SYMBOL_SNAPSHOT_SOURCES.TWSE.minimumOrdinarySymbols;
  const tpexMinimum = Number.isInteger(minimumByMarket.TPEX)
    ? minimumByMarket.TPEX
    : A1_SYMBOL_SNAPSHOT_SOURCES.TPEX.minimumOrdinarySymbols;
  if (twseMinimum < 0 || tpexMinimum < 0) {
    throw new Error("minimumByMarket values must be non-negative integers");
  }

  const [twse, tpex] = await Promise.all([
    normalizeMarketRows({
      market: "TWSE",
      marketDate: date,
      observedAt: observed,
      decisionTimestamp: clock,
      rows: twseRows,
      minimumOrdinarySymbols: twseMinimum,
    }),
    normalizeMarketRows({
      market: "TPEX",
      marketDate: date,
      observedAt: observed,
      decisionTimestamp: clock,
      rows: tpexRows,
      minimumOrdinarySymbols: tpexMinimum,
    }),
  ]);

  const combined = [...twse.snapshots, ...tpex.snapshots];
  const seen = new Map();
  const crossMarketDuplicates = [];
  for (const row of combined) {
    if (seen.has(row.symbol)) {
      crossMarketDuplicates.push({
        symbol: row.symbol,
        firstMarket: seen.get(row.symbol),
        secondMarket: row.market,
      });
    } else {
      seen.set(row.symbol, row.market);
    }
  }

  const blockerCodes = [
    ...twse.blockerCodes.map((x) => `TWSE:${x}`),
    ...tpex.blockerCodes.map((x) => `TPEX:${x}`),
  ];
  if (crossMarketDuplicates.length) blockerCodes.push("CROSS_MARKET_DUPLICATE_SYMBOL");
  if (Date.parse(observed) > Date.parse(clock)) blockerCodes.push("OBSERVED_AFTER_DECISION_CLOCK");

  const bySymbol = Object.fromEntries(
    combined
      .filter((row) => !crossMarketDuplicates.some((x) => x.symbol === row.symbol))
      .sort((a, b) => a.symbol.localeCompare(b.symbol))
      .map((row) => [row.symbol, row]),
  );

  const base = {
    batchId: id,
    contractFamilyId: "A1_TW_DAILY_OHLCV_DERIVED",
    contractVersion: A1_SYMBOL_SNAPSHOT_CONTRACT_VERSION,
    marketDate: date,
    decisionTimestamp: clock,
    observedAt: observed,
    markets: { TWSE: twse, TPEX: tpex },
    ordinarySymbolCount: Object.keys(bySymbol).length,
    symbols: Object.freeze(Object.keys(bySymbol)),
    bySymbol: deepFreeze(bySymbol),
    crossMarketDuplicates: deepFreeze(crossMarketDuplicates),
    blockerCodes: Object.freeze([...new Set(blockerCodes)]),
    state: blockerCodes.length ? "INCOMPLETE" : "READY",
    pointInTimeEligible: blockerCodes.length === 0,
    externalMutationPerformed: false,
    schemaVersion: "S2_A1_SYMBOL_SNAPSHOT_BATCH_V0_1",
  };

  const batchHash = await sha256Hex(base);
  return deepFreeze({ ...base, batchHash });
}

export { FIELD_MAP };
