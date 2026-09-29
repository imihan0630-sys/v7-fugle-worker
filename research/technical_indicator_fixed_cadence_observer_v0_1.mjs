import crypto from 'node:crypto';

const TAIPEI_OFFSET = '+08:00';

export function canonicalize(value) {
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

export function toTaipeiIso(httpDate) {
  const date = new Date(httpDate);
  if (Number.isNaN(date.getTime())) throw new Error(`invalid HTTP Date: ${httpDate}`);
  const taipei = new Date(date.getTime() + (8 * 60 * 60 * 1000));
  return `${taipei.toISOString().slice(0, 19)}${TAIPEI_OFFSET}`;
}

export function rocDateToIso(value) {
  const text = String(value ?? '').trim();
  if (!/^\d{7}$/.test(text)) return null;
  const year = Number(text.slice(0, 3)) + 1911;
  return `${year}-${text.slice(3, 5)}-${text.slice(5, 7)}`;
}

function twseHistoricalRows(payload) {
  const table = payload?.tables?.find((candidate) =>
    Array.isArray(candidate?.fields)
    && candidate.fields.includes('證券代號')
    && candidate.fields.includes('開盤價')
    && candidate.fields.includes('收盤價'));
  return table?.data?.length ?? null;
}

function tpexHistoricalRows(payload) {
  const table = payload?.tables?.find((candidate) =>
    Array.isArray(candidate?.fields)
    && candidate.fields.includes('代號')
    && candidate.fields.includes('開盤')
    && candidate.fields.includes('收盤'));
  return table?.data?.length ?? null;
}

export function parsePayload(endpointId, bytes, requestedTradeDate = null) {
  const payload = JSON.parse(bytes.toString('utf8'));
  if (endpointId === 'TWSE_CURRENT_STOCK_DAY_ALL') {
    if (!Array.isArray(payload)) throw new Error('TWSE current payload must be an array');
    return {
      rowCount: payload.length,
      observedTradeDates: [...new Set(payload.map((row) => rocDateToIso(row.Date)).filter(Boolean))].sort(),
    };
  }
  if (endpointId === 'TPEX_CURRENT_DAILY_CLOSE') {
    if (!Array.isArray(payload)) throw new Error('TPEx current payload must be an array');
    return {
      rowCount: payload.length,
      observedTradeDates: [...new Set(payload.map((row) => rocDateToIso(row.Date)).filter(Boolean))].sort(),
    };
  }
  if (endpointId === 'TWSE_HISTORICAL_MI_INDEX') {
    return { rowCount: twseHistoricalRows(payload), observedTradeDates: [requestedTradeDate] };
  }
  if (endpointId === 'TPEX_HISTORICAL_DAILY_QUOTES') {
    return { rowCount: tpexHistoricalRows(payload), observedTradeDates: [requestedTradeDate] };
  }
  throw new Error(`unsupported endpointId: ${endpointId}`);
}

export function appendChainedEntry(entries, observation) {
  const previousEntryDigest = entries.at(-1)?.entryDigest ?? 'GENESIS';
  const sequence = entries.length + 1;
  const body = { sequence, previousEntryDigest, ...observation };
  return [...entries, { ...body, entryDigest: sha256(canonicalJson(body)) }];
}

export function verifyChain(entries) {
  let previous = 'GENESIS';
  for (let index = 0; index < entries.length; index += 1) {
    const { entryDigest, ...body } = entries[index];
    if (body.sequence !== index + 1) return false;
    if (body.previousEntryDigest !== previous) return false;
    if (sha256(canonicalJson(body)) !== entryDigest) return false;
    previous = entryDigest;
  }
  return true;
}

export function classifyRepeatedVersions(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const key = [entry.endpointId, entry.requestedTradeDate ?? '', ...(entry.observedTradeDates ?? [])].join('|');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  const comparisons = [];
  for (const [seriesKey, values] of groups) {
    if (values.length < 2) continue;
    const sorted = [...values].sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
    for (let index = 1; index < sorted.length; index += 1) {
      const before = sorted[index - 1];
      const after = sorted[index];
      comparisons.push({
        seriesKey,
        beforeSequence: before.sequence,
        afterSequence: after.sequence,
        elapsedSeconds: Math.round((new Date(after.capturedAt) - new Date(before.capturedAt)) / 1000),
        classification: before.payloadSha256 === after.payloadSha256
          ? 'UNCHANGED_BYTES'
          : 'CHANGED_BYTES_REQUIRES_ROW_DIFF',
      });
    }
  }
  return comparisons;
}

export function summarizeLedger(ledger) {
  const comparisons = classifyRepeatedVersions(ledger.entries);
  const captureDates = [...new Set(ledger.entries.map((entry) => entry.capturedAt.slice(0, 10)))].sort();
  const observedTradeDates = [...new Set(
    ledger.entries.flatMap((entry) => entry.observedTradeDates ?? []),
  )].sort();
  const changed = comparisons.filter((item) => item.classification.startsWith('CHANGED_')).length;
  return {
    chainValid: verifyChain(ledger.entries),
    entryCount: ledger.entries.length,
    captureCalendarDates: captureDates,
    observedTradeDates,
    repeatedVersionComparisons: comparisons.length,
    unchangedByteComparisons: comparisons.length - changed,
    changedByteComparisons: changed,
    revisionIncidence: 'UNKNOWN',
    reasonRevisionIncidenceUnknown: changed === 0
      ? 'No changed payload was observed; finite unchanged comparisons do not prove zero revisions.'
      : 'A changed payload requires row-level add/remove/change and provider correction identity before it can be called a revision.',
  };
}

export function captureFromResponse(spec, responseEvidence) {
  const bytes = Buffer.isBuffer(responseEvidence.bytes)
    ? responseEvidence.bytes
    : Buffer.from(responseEvidence.bytes);
  const parsed = parsePayload(spec.endpointId, bytes, spec.requestedTradeDate ?? null);
  const httpDate = responseEvidence.headers?.date;
  if (!httpDate) throw new Error(`${spec.endpointId} missing HTTP Date`);
  return {
    captureId: spec.captureId,
    endpointId: spec.endpointId,
    sourceOwner: spec.sourceOwner,
    endpointContract: spec.endpointContract,
    url: spec.url,
    requestedTradeDate: spec.requestedTradeDate ?? null,
    capturedAt: toTaipeiIso(httpDate),
    attempts: responseEvidence.attempts ?? 1,
    elapsedMs: responseEvidence.elapsedMs ?? 'UNKNOWN_NOT_INSTRUMENTED',
    payloadBytes: bytes.length,
    payloadSha256: sha256(bytes),
    etag: responseEvidence.headers?.etag ?? null,
    lastModified: responseEvidence.headers?.lastModified ?? null,
    rowCount: parsed.rowCount,
    observedTradeDates: parsed.observedTradeDates,
    rawPayloadPersisted: false,
    outcomeDataInspected: false,
  };
}

export async function captureEndpoint(spec, fetchImpl = fetch, options = {}) {
  const maxAttempts = options.maxAttempts ?? 3;
  let response;
  let bytes;
  let attempts = 0;
  let lastError;
  const started = performance.now();
  while (attempts < maxAttempts) {
    attempts += 1;
    try {
      response = await fetchImpl(spec.url, {
        headers: {
          accept: 'application/json',
          'user-agent': 'D03-outcome-blind-source-observer/0.1',
        },
      });
      bytes = Buffer.from(await response.arrayBuffer());
      if (response.ok) break;
      lastError = new Error(`${spec.endpointId} HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, attempts * 250));
    }
  }
  const completed = performance.now();
  if (!response?.ok) throw lastError ?? new Error(`${spec.endpointId} capture failed`);
  const httpDate = response.headers.get('date');
  if (!httpDate) throw new Error(`${spec.endpointId} missing HTTP Date`);
  return captureFromResponse(spec, {
    bytes,
    attempts,
    elapsedMs: Math.round(completed - started),
    headers: {
      date: httpDate,
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    },
  });
}
