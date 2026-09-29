import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {
  buildTechnicalManifest,
  compareTechnicalManifests,
  normalizeDecimal,
  verifyManifest,
} from './technical_indicator_row_diff_manifest_v0_1.mjs';

let assertions = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertions += 1;
};

check(normalizeDecimal('2,475.00') === '2475', 'thousands/decimal normalization failed');
check(normalizeDecimal('000.5000') === '0.5', 'leading/trailing zero normalization failed');
check(normalizeDecimal('-0.00') === '0', 'negative zero normalization failed');
check(normalizeDecimal(' -- ') === 'NOT_PRESENT', 'missing marker normalization failed');
check(normalizeDecimal('') === 'NOT_PRESENT', 'blank missing marker normalization failed');
assert.throws(() => normalizeDecimal('not-a-price'), /invalid decimal/, 'invalid price must fail');
assertions += 1;

const twseCurrentBytes = Buffer.from(JSON.stringify([
  { Date: '1150929', Code: '1111', OpeningPrice: '100.00', HighestPrice: '105', LowestPrice: '99', ClosingPrice: '103.00', metadata: 'v1' },
  { Date: '1150929', Code: '2222', OpeningPrice: '', HighestPrice: '--', LowestPrice: '', ClosingPrice: '--' },
]));
const twseHistoricalBytes = Buffer.from(JSON.stringify({
  tables: [{
    fields: ['證券代號', '開盤價', '最高價', '最低價', '收盤價'],
    data: [
      ['1111', '100', '105.00', '99.0', '103'],
      ['2222', '--', '', '---', ''],
    ],
  }],
  responseMetadata: 'different contract representation',
}));

const currentManifest = buildTechnicalManifest({
  market: 'TWSE', endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL', bytes: twseCurrentBytes,
});
const historicalManifest = buildTechnicalManifest({
  market: 'TWSE', endpointId: 'TWSE_HISTORICAL_MI_INDEX', bytes: twseHistoricalBytes,
  requestedTradeDate: '2026-09-29',
});
check(verifyManifest(currentManifest), 'current manifest verification failed');
check(verifyManifest(historicalManifest), 'historical manifest verification failed');
check(
  currentManifest.manifestSha256 === historicalManifest.manifestSha256,
  'economic OHLC projections should match across formatting/contracts',
);
check(
  compareTechnicalManifests(currentManifest, historicalManifest).classification === 'NO_D03_OHLC_ROW_CHANGE',
  'metadata/formatting-only change must not become an OHLC revision',
);

const changedBytes = Buffer.from(JSON.stringify([
  { Date: '1150929', Code: '2222', OpeningPrice: '', HighestPrice: '--', LowestPrice: '', ClosingPrice: '--' },
  { Date: '1150929', Code: '3333', OpeningPrice: '50', HighestPrice: '52', LowestPrice: '49', ClosingPrice: '51' },
  { Date: '1150929', Code: '1111', OpeningPrice: '100', HighestPrice: '106', LowestPrice: '99', ClosingPrice: '103' },
]));
const changedManifest = buildTechnicalManifest({
  market: 'TWSE', endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL', bytes: changedBytes,
});
const diff = compareTechnicalManifests(currentManifest, changedManifest);
check(diff.classification === 'D03_OHLC_ROWS_CHANGED', 'changed rows must be classified');
check(diff.added.length === 1 && diff.added[0] === '3333', 'added symbol failed');
check(diff.removed.length === 0, 'unexpected removed symbol');
check(diff.changed.length === 1 && diff.changed[0].symbol === '1111', 'changed symbol failed');
check(diff.unchanged === 1, 'unchanged count failed');

const removedDiff = compareTechnicalManifests(changedManifest, currentManifest);
check(removedDiff.removed.length === 1 && removedDiff.removed[0] === '3333', 'removed symbol failed');

const tampered = structuredClone(currentManifest);
tampered.rows[0][4] = '999';
check(!verifyManifest(tampered), 'tampering must invalidate manifest');

const duplicateBytes = Buffer.from(JSON.stringify([
  { Date: '1150929', Code: '1111', OpeningPrice: '1', HighestPrice: '1', LowestPrice: '1', ClosingPrice: '1' },
  { Date: '1150929', Code: '1111', OpeningPrice: '1', HighestPrice: '1', LowestPrice: '1', ClosingPrice: '1' },
]));
assert.throws(
  () => buildTechnicalManifest({ market: 'TWSE', endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL', bytes: duplicateBytes }),
  /duplicate symbol/,
  'duplicate symbols must fail closed',
);
assertions += 1;

const durableReceipt = JSON.parse(zlib.gunzipSync(fs.readFileSync(
  new URL('./technical_indicator_row_diff_baseline_20260930.json.gz', import.meta.url),
)).toString('utf8'));
check(durableReceipt.outcomeDataInspected === false, 'durable receipt must stay outcome blind');
check(verifyManifest(durableReceipt.manifests.TWSE), 'durable TWSE manifest failed');
check(verifyManifest(durableReceipt.manifests.TPEX), 'durable TPEx manifest failed');
check(durableReceipt.manifests.TWSE.rowCount === 1382, 'durable TWSE row count changed');
check(durableReceipt.manifests.TPEX.rowCount === 11730, 'durable TPEx row count changed');

console.log(JSON.stringify({
  ok: true,
  assertions,
  scope: 'OUTCOME_BLIND_D03_OHLC_ROW_DIFF_MANIFEST',
  formalCoreImpact: 'NONE_LOCKED',
}));
