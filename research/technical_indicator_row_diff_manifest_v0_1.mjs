import crypto from 'node:crypto';

export const MANIFEST_SCHEMA_VERSION = 'TECHNICAL_OHLC_ROW_DIFF_MANIFEST_V0_1';

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

export function sha256(value) {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(String(value));
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

export function rocDateToIso(value) {
  const text = String(value ?? '').trim();
  if (!/^\d{7}$/.test(text)) return null;
  return `${Number(text.slice(0, 3)) + 1911}-${text.slice(3, 5)}-${text.slice(5, 7)}`;
}

export function normalizeDecimal(value) {
  const text = String(value ?? '').trim().replaceAll(',', '');
  if (text === '' || /^-+$/.test(text)) return 'NOT_PRESENT';
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(text)) {
    throw new Error(`invalid decimal representation: ${String(value)}`);
  }
  const negative = text.startsWith('-');
  const unsigned = text.replace(/^[+-]/, '');
  const [integerPart, fractionPart = ''] = unsigned.split('.');
  const integer = integerPart.replace(/^0+(?=\d)/, '') || '0';
  const fraction = fractionPart.replace(/0+$/, '');
  const magnitude = fraction ? `${integer}.${fraction}` : integer;
  return negative && magnitude !== '0' ? `-${magnitude}` : magnitude;
}

function findTable(payload, symbolField, openField, closeField) {
  const table = payload?.tables?.find((candidate) =>
    Array.isArray(candidate?.fields)
    && candidate.fields.includes(symbolField)
    && candidate.fields.includes(openField)
    && candidate.fields.includes(closeField));
  if (!table || !Array.isArray(table.data)) throw new Error('required historical table not found');
  return table;
}

function tableObjects(table) {
  return table.data.map((values) => Object.fromEntries(
    table.fields.map((field, index) => [field, values[index]]),
  ));
}

export function extractTechnicalRows(endpointId, bytes, requestedTradeDate = null) {
  const payload = JSON.parse(Buffer.from(bytes).toString('utf8'));
  let sourceRows;
  let fieldMap;
  let tradeDate;

  if (endpointId === 'TWSE_CURRENT_STOCK_DAY_ALL') {
    if (!Array.isArray(payload)) throw new Error('TWSE current payload must be an array');
    sourceRows = payload;
    fieldMap = ['Code', 'OpeningPrice', 'HighestPrice', 'LowestPrice', 'ClosingPrice'];
    const dates = [...new Set(payload.map((row) => rocDateToIso(row.Date)).filter(Boolean))];
    if (dates.length !== 1) throw new Error(`TWSE current requires one trade date, got ${dates.length}`);
    [tradeDate] = dates;
  } else if (endpointId === 'TPEX_CURRENT_DAILY_CLOSE') {
    if (!Array.isArray(payload)) throw new Error('TPEx current payload must be an array');
    sourceRows = payload;
    fieldMap = ['SecuritiesCompanyCode', 'Open', 'High', 'Low', 'Close'];
    const dates = [...new Set(payload.map((row) => rocDateToIso(row.Date)).filter(Boolean))];
    if (dates.length !== 1) throw new Error(`TPEx current requires one trade date, got ${dates.length}`);
    [tradeDate] = dates;
  } else if (endpointId === 'TWSE_HISTORICAL_MI_INDEX') {
    const table = findTable(payload, '證券代號', '開盤價', '收盤價');
    sourceRows = tableObjects(table);
    fieldMap = ['證券代號', '開盤價', '最高價', '最低價', '收盤價'];
    tradeDate = requestedTradeDate;
  } else if (endpointId === 'TPEX_HISTORICAL_DAILY_QUOTES') {
    const table = findTable(payload, '代號', '開盤', '收盤');
    sourceRows = tableObjects(table);
    fieldMap = ['代號', '開盤', '最高', '最低', '收盤'];
    tradeDate = requestedTradeDate;
  } else {
    throw new Error(`unsupported endpointId: ${endpointId}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(tradeDate ?? ''))) {
    throw new Error(`invalid or missing trade date for ${endpointId}`);
  }

  const seen = new Set();
  const rows = sourceRows.map((row) => {
    const symbol = String(row[fieldMap[0]] ?? '').trim();
    if (!symbol) throw new Error(`${endpointId} contains a blank symbol`);
    if (seen.has(symbol)) throw new Error(`${endpointId} contains duplicate symbol ${symbol}`);
    seen.add(symbol);
    return [
      symbol,
      normalizeDecimal(row[fieldMap[1]]),
      normalizeDecimal(row[fieldMap[2]]),
      normalizeDecimal(row[fieldMap[3]]),
      normalizeDecimal(row[fieldMap[4]]),
    ];
  }).sort((left, right) => left[0].localeCompare(right[0], 'en'));

  return { tradeDate, rows };
}

export function buildTechnicalManifest({ market, endpointId, bytes, requestedTradeDate = null }) {
  const { tradeDate, rows } = extractTechnicalRows(endpointId, bytes, requestedTradeDate);
  const manifestBody = {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    market,
    tradeDate,
    projection: ['symbol', 'open', 'high', 'low', 'close'],
    missingValue: 'NOT_PRESENT',
    decimalNormalization: 'EXACT_STRING_DECIMAL_NO_FLOAT_V0_1',
    rowCount: rows.length,
    rows,
  };
  return { ...manifestBody, manifestSha256: sha256(canonicalJson(manifestBody)) };
}

function rowMap(manifest) {
  return new Map(manifest.rows.map((row) => [row[0], row]));
}

export function compareTechnicalManifests(before, after) {
  if (before.market !== after.market) throw new Error('cannot compare different markets');
  if (before.tradeDate !== after.tradeDate) throw new Error('cannot compare different trade dates');
  const left = rowMap(before);
  const right = rowMap(after);
  const added = [...right.keys()].filter((symbol) => !left.has(symbol)).sort();
  const removed = [...left.keys()].filter((symbol) => !right.has(symbol)).sort();
  const changed = [];
  let unchanged = 0;
  for (const symbol of [...left.keys()].filter((key) => right.has(key)).sort()) {
    const beforeRow = left.get(symbol);
    const afterRow = right.get(symbol);
    if (canonicalJson(beforeRow) === canonicalJson(afterRow)) {
      unchanged += 1;
    } else {
      changed.push({ symbol, before: beforeRow.slice(1), after: afterRow.slice(1) });
    }
  }
  return {
    beforeRowCount: before.rows.length,
    afterRowCount: after.rows.length,
    added,
    removed,
    changed,
    unchanged,
    classification: added.length || removed.length || changed.length
      ? 'D03_OHLC_ROWS_CHANGED'
      : 'NO_D03_OHLC_ROW_CHANGE',
  };
}

export function verifyManifest(manifest) {
  const { manifestSha256, ...body } = manifest;
  if (body.schemaVersion !== MANIFEST_SCHEMA_VERSION) return false;
  if (body.rowCount !== body.rows?.length) return false;
  const symbols = body.rows.map((row) => row[0]);
  if (new Set(symbols).size !== symbols.length) return false;
  return sha256(canonicalJson(body)) === manifestSha256;
}
