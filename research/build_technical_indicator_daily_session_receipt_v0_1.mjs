import fs from 'node:fs';
import zlib from 'node:zlib';
import {
  appendChainedEntry,
  captureFromResponse,
  summarizeLedger,
  verifyChain,
} from './technical_indicator_fixed_cadence_observer_v0_1.mjs';
import {
  buildTechnicalManifest,
  compareTechnicalManifests,
  sha256,
  verifyManifest,
} from './technical_indicator_row_diff_manifest_v0_1.mjs';

const [
  ledgerPath,
  outputPath,
  captureDirectory,
  expectedTradeDate,
  prospectiveSessionCountText,
  twseCurrentElapsedMsText,
  tpexCurrentElapsedMsText,
  twseHistoricalElapsedMsText,
  tpexHistoricalElapsedMsText,
  captureTag = 'session',
  providerCallCountText = '4',
  rejectedCaptureCountText = '0',
  rejectedPersistedBytesText = '0',
] = process.argv.slice(2);

if (!ledgerPath || !outputPath || !captureDirectory || !expectedTradeDate) {
  throw new Error(
    'usage: node build_technical_indicator_daily_session_receipt_v0_1.mjs '
    + 'LEDGER OUTPUT CAPTURE_DIR YYYY-MM-DD SESSION_COUNT '
    + 'TWSE_CURRENT_MS TPEX_CURRENT_MS TWSE_HIST_MS TPEX_HIST_MS',
  );
}

const prospectiveSessionCount = Number(prospectiveSessionCountText);
if (!Number.isInteger(prospectiveSessionCount) || prospectiveSessionCount < 1) {
  throw new Error('prospective session count must be a positive integer');
}

const elapsedMs = {
  twse_current: Number(twseCurrentElapsedMsText),
  tpex_current: Number(tpexCurrentElapsedMsText),
  twse_hist: Number(twseHistoricalElapsedMsText),
  tpex_hist: Number(tpexHistoricalElapsedMsText),
};
for (const [name, value] of Object.entries(elapsedMs)) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`invalid elapsed milliseconds for ${name}`);
}

if (!/^[a-z0-9-]+$/.test(captureTag)) throw new Error('captureTag must be lowercase slug text');
const providerCallCount = Number(providerCallCountText);
const rejectedCaptureCount = Number(rejectedCaptureCountText);
const rejectedPersistedBytes = Number(rejectedPersistedBytesText);
for (const [name, value] of Object.entries({ providerCallCount, rejectedCaptureCount, rejectedPersistedBytes })) {
  if (!Number.isInteger(value) || value < 0) throw new Error(`invalid nonnegative integer for ${name}`);
}

function read(name) {
  return fs.readFileSync(`${captureDirectory}/${name}`);
}

function readHeaders(name) {
  const lines = fs.readFileSync(`${captureDirectory}/${name}`, 'utf8')
    .replaceAll('\r', '')
    .split('\n');
  const values = {};
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;
    values[match[1].toLowerCase()] = match[2];
  }
  if (!values.date) throw new Error(`${name} missing final HTTP Date`);
  return {
    date: values.date,
    etag: values.etag ?? null,
    lastModified: values['last-modified'] ?? null,
  };
}

function response(name, elapsed) {
  return {
    bytes: read(`${name}.json`),
    attempts: 1,
    elapsedMs: elapsed,
    headers: readHeaders(`${name}.headers`),
  };
}

const compactDate = expectedTradeDate.replaceAll('-', '');
const specs = [
  {
    name: 'twse_current',
    elapsed: elapsedMs.twse_current,
    spec: {
      captureId: `${compactDate}-afterhours-${captureTag}-twse-current`,
      endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL',
      sourceOwner: 'TWSE',
      endpointContract: 'STOCK_DAY_ALL',
      url: 'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL',
    },
  },
  {
    name: 'tpex_current',
    elapsed: elapsedMs.tpex_current,
    spec: {
      captureId: `${compactDate}-afterhours-${captureTag}-tpex-current`,
      endpointId: 'TPEX_CURRENT_DAILY_CLOSE',
      sourceOwner: 'TPEX',
      endpointContract: 'tpex_mainboard_daily_close_quotes',
      url: 'https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes',
    },
  },
  {
    name: 'twse_hist',
    elapsed: elapsedMs.twse_hist,
    spec: {
      captureId: `${compactDate}-afterhours-${captureTag}-twse-historical`,
      endpointId: 'TWSE_HISTORICAL_MI_INDEX',
      sourceOwner: 'TWSE',
      endpointContract: 'MI_INDEX_ALLBUT0999',
      url: `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=${compactDate}&type=ALLBUT0999&response=json`,
      requestedTradeDate: expectedTradeDate,
    },
  },
  {
    name: 'tpex_hist',
    elapsed: elapsedMs.tpex_hist,
    spec: {
      captureId: `${compactDate}-afterhours-${captureTag}-tpex-historical`,
      endpointId: 'TPEX_HISTORICAL_DAILY_QUOTES',
      sourceOwner: 'TPEX',
      endpointContract: 'dailyQuotes',
      url: `https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=${expectedTradeDate.replaceAll('-', '%2F')}&id=&response=json`,
      requestedTradeDate: expectedTradeDate,
    },
  },
];

const observations = specs.map(({ name, elapsed, spec }) => (
  captureFromResponse(spec, response(name, elapsed))
)).sort((left, right) => (
  left.capturedAt.localeCompare(right.capturedAt) || left.endpointId.localeCompare(right.endpointId)
));

const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const existingIds = new Set(ledger.entries.map((entry) => entry.captureId));
let entries = ledger.entries;
for (const observation of observations) {
  if (existingIds.has(observation.captureId)) throw new Error(`duplicate captureId ${observation.captureId}`);
  entries = appendChainedEntry(entries, observation);
}
if (!verifyChain(entries)) throw new Error('observation chain failed after append');

const twseCurrent = buildTechnicalManifest({
  market: 'TWSE',
  endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL',
  bytes: read('twse_current.json'),
});
const twseHistorical = buildTechnicalManifest({
  market: 'TWSE',
  endpointId: 'TWSE_HISTORICAL_MI_INDEX',
  bytes: read('twse_hist.json'),
  requestedTradeDate: expectedTradeDate,
});
const tpexCurrent = buildTechnicalManifest({
  market: 'TPEX',
  endpointId: 'TPEX_CURRENT_DAILY_CLOSE',
  bytes: read('tpex_current.json'),
});
const tpexHistorical = buildTechnicalManifest({
  market: 'TPEX',
  endpointId: 'TPEX_HISTORICAL_DAILY_QUOTES',
  bytes: read('tpex_hist.json'),
  requestedTradeDate: expectedTradeDate,
});

for (const manifest of [twseCurrent, twseHistorical, tpexCurrent, tpexHistorical]) {
  if (!verifyManifest(manifest)) throw new Error(`${manifest.market} manifest failed verification`);
}
if (twseHistorical.tradeDate !== expectedTradeDate || tpexHistorical.tradeDate !== expectedTradeDate) {
  throw new Error('historical manifest trade date mismatch');
}

function parity(current, historical) {
  if (current.tradeDate !== historical.tradeDate) {
    return {
      classification: 'NOT_COMPARABLE_TRADE_DATE_MISMATCH',
      currentTradeDate: current.tradeDate,
      historicalTradeDate: historical.tradeDate,
    };
  }
  return compareTechnicalManifests(historical, current);
}

const sourceReceipts = Object.fromEntries(specs.map(({ name, spec }) => {
  const bytes = read(`${name}.json`);
  return [name, {
    endpointId: spec.endpointId,
    payloadBytes: bytes.length,
    payloadSha256: sha256(bytes),
  }];
}));
const acceptedBytes = Object.values(sourceReceipts).reduce((sum, item) => sum + item.payloadBytes, 0);
const latestCapturedAt = observations.map((item) => item.capturedAt).sort().at(-1);

const receipt = {
  schemaVersion: 'TECHNICAL_INDICATOR_DAILY_SESSION_RECEIPT_V0_1',
  createdAt: latestCapturedAt,
  scope: 'OUTCOME_BLIND_D03_TECHNICAL_OHLC_PROJECTION',
  formalCoreImpact: 'NONE_LOCKED',
  outcomeDataInspected: false,
  tradeDate: expectedTradeDate,
  purpose: 'Preserve one prospective completed-session OHLC state and same-date endpoint parity without treating a new trading date as a provider revision.',
  sources: sourceReceipts,
  currentEndpointFreshness: {
    TWSE: twseCurrent.tradeDate === expectedTradeDate ? 'CURRENT_TRADE_DATE' : 'STALE_PREVIOUS_TRADE_DATE',
    TPEX: tpexCurrent.tradeDate === expectedTradeDate ? 'CURRENT_TRADE_DATE' : 'STALE_PREVIOUS_TRADE_DATE',
  },
  sameOwnerCrossContractParity: {
    TWSE: parity(twseCurrent, twseHistorical),
    TPEX: parity(tpexCurrent, tpexHistorical),
  },
  currentManifests: { TWSE: twseCurrent, TPEX: tpexCurrent },
  manifests: { TWSE: twseHistorical, TPEX: tpexHistorical },
  classification: {
    crossSessionChange: 'NEW_TRADE_DATE_NOT_A_REVISION_COMPARISON',
    correctionIdentity: 'UNKNOWN_NO_PROVIDER_VERSION_OR_SUPERSESSION_ID',
  },
  limits: {
    projectionOnly: 'symbol/open/high/low/close; non-OHLC payload changes remain detectable only through whole-payload hashes',
    providerCorrectionIdentity: 'UNKNOWN',
    providerFirstKnownAtPerRow: 'UNKNOWN',
    independentAttestation: 'UNKNOWN',
    revisionIncidence: 'UNKNOWN_UNTIL_THREE_SESSION_GATE_AND_REPEATED_SAME_DATE_VERSIONS',
  },
};

const uncompressed = Buffer.from(`${JSON.stringify(receipt)}\n`);
fs.writeFileSync(outputPath, zlib.gzipSync(uncompressed, { level: 9, mtime: 0 }));

const computedSummary = summarizeLedger({ entries });
const updatedLedger = {
  ...ledger,
  createdAt: latestCapturedAt,
  entries,
  summary: {
    ...computedSummary,
    prospectiveCompletedTradingSessionsObserved: prospectiveSessionCount,
    requiredProspectiveCompletedTradingSessions: 3,
    afterHoursRepeatIntervalObserved: true,
    coverageGate: prospectiveSessionCount >= 3
      ? 'THREE_SESSION_COUNT_MET_OTHER_PIT_GATES_PENDING'
      : 'ACCUMULATING_NOT_MET',
    latestBatchTradeDate: expectedTradeDate,
    latestBatchTransportCommands: providerCallCount,
    latestBatchProviderCalls: rejectedCaptureCount > 0
      ? `AT_LEAST_${providerCallCount}_CURL_RETRY_INTERNAL_ATTEMPTS_NOT_EXPOSED`
      : providerCallCount,
    latestBatchAcceptedCaptures: 4,
    latestBatchAcceptedPayloadBytes: acceptedBytes,
    latestBatchRejectedCaptureCount: rejectedCaptureCount,
    latestBatchRejectedPersistedBytes: rejectedPersistedBytes,
    latestBatchPersistedRawPayloadBytes: 0,
    successfulTransportLatencyMs: Object.fromEntries(observations.map((item) => [item.endpointId, item.elapsedMs])),
    latestSessionReceipt: {
      status: 'PROSPECTIVE_SESSION_MATERIAL',
      tradeDate: expectedTradeDate,
      artifact: outputPath.replace(/^.*?research\//, 'research/'),
      artifactBytes: fs.statSync(outputPath).size,
      uncompressedArtifactBytes: uncompressed.length,
      twseRows: twseHistorical.rowCount,
      tpexRows: tpexHistorical.rowCount,
      twseCurrentTradeDate: twseCurrent.tradeDate,
      tpexCurrentTradeDate: tpexCurrent.tradeDate,
    },
    revisionIncidence: 'UNKNOWN',
    fugle: 'ACCESS_NOT_PRESENT_IN_AUTOMATION_RUNTIME',
    independentSourceAttestation: 'UNKNOWN',
    certifiedSymbolSessionReceipt: 'UNKNOWN',
    corporateActionAncestry: 'UNKNOWN',
    immutableParentChildReconciliation: 'UNKNOWN',
    formalOptimizationCandidate: 'NONE',
    maturityPct: 44.6,
  },
  exactNextContinuationPoint: prospectiveSessionCount >= 3
    ? 'Repeat same-trade-date captures and classify any valid byte/manifest change before outcomes; the session-count gate alone does not satisfy attestation, session, corporate-action, Fugle or immutable-parent requirements.'
    : 'Append the next completed Taiwan trading session and retain repeated same-trade-date versions; keep correction incidence UNKNOWN until the three-session gate and remaining PIT dependencies are resolved.',
};
fs.writeFileSync(ledgerPath, `${JSON.stringify(updatedLedger, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  ledgerEntries: entries.length,
  ledgerSummary: updatedLedger.summary,
  receiptPath: outputPath,
  receiptBytes: fs.statSync(outputPath).size,
  receiptUncompressedBytes: uncompressed.length,
  parity: receipt.sameOwnerCrossContractParity,
}, null, 2));
