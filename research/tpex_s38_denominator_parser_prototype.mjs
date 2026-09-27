// Research-only TPEx S38 denominator parser prototype. No production dependency.
// Official EDIS S38 / STKT2QUOTESN.TXT V1.32+ prefix contract:
// code X(6), name X(16), 13 price-ish fields through yearly low,
// volume 9(12) shares, trade count 9(8), value 9(12) NTD,
// issued shares 9(13) shares, market cap 9(14) NTD, industry X(2).

const PREFIX_WIDTHS = [
  ["symbol", 6],
  ["name", 16],
  ["openRaw", 9],
  ["highRaw", 9],
  ["lowRaw", 9],
  ["closeRaw", 9],
  ["changeMark", 1],
  ["changeRaw", 9],
  ["averageRaw", 9],
  ["nextReferenceRaw", 9],
  ["nextLimitUpRaw", 9],
  ["nextLimitDownRaw", 9],
  ["lastBidRaw", 9],
  ["lastAskRaw", 9],
  ["yearHighRaw", 9],
  ["yearLowRaw", 9],
  ["tradeVolumeSharesRaw", 12],
  ["tradeCountRaw", 8],
  ["tradeValueNtdRaw", 12],
  ["issuedSharesRaw", 13],
  ["marketCapNtdRaw", 14],
  ["industryCode", 2]
];

export const S38_PREFIX_LENGTH = PREFIX_WIDTHS.reduce((sum, [, width]) => sum + width, 0);

function digits(raw) {
  const s = String(raw ?? "");
  return /^\d+$/.test(s) ? s : null;
}

function integerField(raw, field) {
  const d = digits(raw);
  if (d === null) throw new Error(`${field}_NON_NUMERIC`);
  const n = Number(d);
  if (!Number.isSafeInteger(n)) throw new Error(`${field}_UNSAFE_INTEGER`);
  return n;
}

export function parseS38Line(line) {
  const raw = String(line ?? "").replace(/\r$/, "");
  if (raw.length < S38_PREFIX_LENGTH) throw new Error("S38_LINE_TOO_SHORT");

  let offset = 0;
  const fields = {};
  for (const [name, width] of PREFIX_WIDTHS) {
    fields[name] = raw.slice(offset, offset + width);
    offset += width;
  }

  const symbol = fields.symbol.trim();
  if (!symbol) throw new Error("S38_SYMBOL_EMPTY");

  const tradeVolumeShares = integerField(fields.tradeVolumeSharesRaw, "S38_TRADE_VOLUME");
  const tradeCount = integerField(fields.tradeCountRaw, "S38_TRADE_COUNT");
  const tradeValueNtd = integerField(fields.tradeValueNtdRaw, "S38_TRADE_VALUE");
  const issuedShares = integerField(fields.issuedSharesRaw, "S38_ISSUED_SHARES");
  const marketCapNtd = integerField(fields.marketCapNtdRaw, "S38_MARKET_CAP");

  return {
    symbol,
    name: fields.name.trim(),
    tradeVolumeShares,
    tradeCount,
    tradeValueNtd,
    issuedShares,
    marketCapNtd,
    industryCode: fields.industryCode.trim(),
    denominatorType: "TPEX_DAILY_ISSUED_SHARES",
    normalizedUnit: "SHARES",
    sourceFileCode: "S38",
    sourceFile: "STKT2QUOTESN.TXT",
    parsedPrefixLength: S38_PREFIX_LENGTH,
    rawPrefix: raw.slice(0, S38_PREFIX_LENGTH),
    researchOnly: true,
    decisionImpact: false
  };
}

export function parseS38Artifact(text) {
  const lines = String(text ?? "")
    .split(/\n/)
    .map(x => x.replace(/\r$/, ""))
    .filter(x => x.length > 0);

  const rows = [];
  const seen = new Set();
  for (const line of lines) {
    const row = parseS38Line(line);
    if (seen.has(row.symbol)) throw new Error(`S38_DUPLICATE_SYMBOL:${row.symbol}`);
    seen.add(row.symbol);
    rows.push(row);
  }
  return {
    rows,
    recordCount: rows.length,
    sourceFileCode: "S38",
    unitContract: "ISSUED_SHARES_AND_TRADE_VOLUME_ARE_SHARES",
    researchOnly: true,
    decisionImpact: false
  };
}
