import fs from 'node:fs';
import zlib from 'node:zlib';
import {
  buildTechnicalManifest,
  compareTechnicalManifests,
  sha256,
  verifyManifest,
} from './technical_indicator_row_diff_manifest_v0_1.mjs';

const [outputPath, captureDirectory, capturedAt = new Date().toISOString()] = process.argv.slice(2);
if (!outputPath || !captureDirectory) {
  throw new Error('usage: node build_technical_indicator_row_diff_baseline_v0_1.mjs OUTPUT CAPTURE_DIR [CAPTURED_AT]');
}

function read(name) {
  return fs.readFileSync(`${captureDirectory}/${name}`);
}

function sourceReceipt(name, endpointId) {
  const bytes = read(name);
  return { endpointId, payloadBytes: bytes.length, payloadSha256: sha256(bytes) };
}

const twseCurrent = buildTechnicalManifest({
  market: 'TWSE', endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL', bytes: read('twse_current.json'),
});
const twseHistorical = buildTechnicalManifest({
  market: 'TWSE', endpointId: 'TWSE_HISTORICAL_MI_INDEX', bytes: read('twse_hist.json'),
  requestedTradeDate: '2026-09-29',
});
const tpexCurrent = buildTechnicalManifest({
  market: 'TPEX', endpointId: 'TPEX_CURRENT_DAILY_CLOSE', bytes: read('tpex_current.json'),
});
const tpexHistorical = buildTechnicalManifest({
  market: 'TPEX', endpointId: 'TPEX_HISTORICAL_DAILY_QUOTES', bytes: read('tpex_hist_repeat.json'),
  requestedTradeDate: '2026-09-29',
});

const twseParity = compareTechnicalManifests(twseHistorical, twseCurrent);
const tpexParity = compareTechnicalManifests(tpexHistorical, tpexCurrent);
if (twseParity.classification !== 'NO_D03_OHLC_ROW_CHANGE') throw new Error('TWSE parity failed');
if (tpexParity.classification !== 'NO_D03_OHLC_ROW_CHANGE') throw new Error('TPEx parity failed');
if (!verifyManifest(twseHistorical) || !verifyManifest(tpexHistorical)) throw new Error('manifest verification failed');

const receipt = {
  schemaVersion: 'TECHNICAL_INDICATOR_ROW_DIFF_BASELINE_RECEIPT_V0_1',
  createdAt: capturedAt,
  scope: 'OUTCOME_BLIND_D03_TECHNICAL_OHLC_PROJECTION',
  formalCoreImpact: 'NONE_LOCKED',
  outcomeDataInspected: false,
  tradeDate: '2026-09-29',
  purpose: 'Retain the compact symbol/OHLC state needed for future add-remove-change reconciliation without retaining multi-megabyte raw payloads.',
  sources: {
    twseCurrent: sourceReceipt('twse_current.json', 'TWSE_CURRENT_STOCK_DAY_ALL'),
    twseHistorical: sourceReceipt('twse_hist.json', 'TWSE_HISTORICAL_MI_INDEX'),
    tpexCurrent: sourceReceipt('tpex_current.json', 'TPEX_CURRENT_DAILY_CLOSE'),
    tpexHistorical: sourceReceipt('tpex_hist_repeat.json', 'TPEX_HISTORICAL_DAILY_QUOTES'),
  },
  sameOwnerCrossContractParity: { TWSE: twseParity, TPEX: tpexParity },
  manifests: { TWSE: twseHistorical, TPEX: tpexHistorical },
  limits: {
    projectionOnly: 'symbol/open/high/low/close; non-OHLC payload changes remain detectable only through whole-payload hashes',
    providerCorrectionIdentity: 'UNKNOWN',
    providerFirstKnownAtPerRow: 'UNKNOWN',
    independentAttestation: 'UNKNOWN',
    revisionIncidence: 'UNKNOWN',
  },
};

const uncompressed = Buffer.from(`${JSON.stringify(receipt)}\n`);
fs.writeFileSync(outputPath, zlib.gzipSync(uncompressed, { level: 9, mtime: 0 }));
console.log(JSON.stringify({
  ok: true,
  outputPath,
  bytes: fs.statSync(outputPath).size,
  uncompressedBytes: uncompressed.length,
  twseRows: twseHistorical.rowCount,
  tpexRows: tpexHistorical.rowCount,
  twseManifestSha256: twseHistorical.manifestSha256,
  tpexManifestSha256: tpexHistorical.manifestSha256,
}));
