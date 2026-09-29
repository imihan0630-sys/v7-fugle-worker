import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  appendChainedEntry,
  captureFromResponse,
  classifyRepeatedVersions,
  parsePayload,
  rocDateToIso,
  summarizeLedger,
  verifyChain,
} from './technical_indicator_fixed_cadence_observer_v0_1.mjs';

let assertions = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertions += 1;
};

check(rocDateToIso('1150929') === '2026-09-29', 'ROC date conversion failed');
check(rocDateToIso('bad') === null, 'invalid ROC date must remain absent');

const current = Buffer.from(JSON.stringify([
  { Date: '1150929', Code: '2330' },
  { Date: '1150929', Code: '2317' },
]));
const parsed = parsePayload('TWSE_CURRENT_STOCK_DAY_ALL', current);
check(parsed.rowCount === 2, 'current row count failed');
check(parsed.observedTradeDates[0] === '2026-09-29', 'current trade date failed');

const responseCapture = captureFromResponse({
  captureId: 'fixture', endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL', sourceOwner: 'TWSE',
  endpointContract: 'STOCK_DAY_ALL', url: 'https://example.invalid/fixture',
}, {
  bytes: current,
  headers: { date: 'Tue, 29 Sep 2026 18:00:00 GMT', etag: 'fixture' },
});
check(responseCapture.capturedAt === '2026-09-30T02:00:00+08:00', 'HTTP Date conversion failed');
check(responseCapture.rawPayloadPersisted === false, 'raw payload persistence must remain false');

let entries = [];
entries = appendChainedEntry(entries, {
  captureId: 'a', endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL', capturedAt: '2026-09-30T01:00:00+08:00',
  observedTradeDates: ['2026-09-29'], requestedTradeDate: null, payloadSha256: 'same',
});
entries = appendChainedEntry(entries, {
  captureId: 'b', endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL', capturedAt: '2026-09-30T02:00:00+08:00',
  observedTradeDates: ['2026-09-29'], requestedTradeDate: null, payloadSha256: 'same',
});
entries = appendChainedEntry(entries, {
  captureId: 'c', endpointId: 'TWSE_CURRENT_STOCK_DAY_ALL', capturedAt: '2026-10-01T02:00:00+08:00',
  observedTradeDates: ['2026-09-29'], requestedTradeDate: null, payloadSha256: 'changed',
});

check(verifyChain(entries), 'valid append-only chain failed');
check(classifyRepeatedVersions(entries).length === 2, 'repeat comparisons failed');
check(classifyRepeatedVersions(entries)[0].classification === 'UNCHANGED_BYTES', 'unchanged classification failed');
check(classifyRepeatedVersions(entries)[1].classification === 'CHANGED_BYTES_REQUIRES_ROW_DIFF', 'changed classification failed');

const summary = summarizeLedger({ entries });
check(summary.revisionIncidence === 'UNKNOWN', 'finite observations must not fabricate revision incidence');
check(summary.changedByteComparisons === 1, 'changed comparison count failed');

const tampered = structuredClone(entries);
tampered[0].payloadSha256 = 'tampered';
check(!verifyChain(tampered), 'tamper must break chain');

const reordered = [entries[1], entries[0], entries[2]];
check(!verifyChain(reordered), 'reorder must break chain');

const durableLedger = JSON.parse(fs.readFileSync(
  new URL('./technical_indicator_fixed_cadence_observations_20260930.json', import.meta.url),
  'utf8',
));
const durableSummary = summarizeLedger(durableLedger);
check(verifyChain(durableLedger.entries), 'durable ledger chain failed');
check(
  durableSummary.repeatedVersionComparisons === durableLedger.summary.repeatedVersionComparisons
    && durableSummary.repeatedVersionComparisons >= 4,
  'durable repeat count failed',
);
check(
  durableSummary.unchangedByteComparisons === durableLedger.summary.unchangedByteComparisons
    && durableSummary.changedByteComparisons === durableLedger.summary.changedByteComparisons,
  'durable comparison classification failed',
);
check(durableLedger.summary.coverageGate === 'ACCUMULATING_NOT_MET', 'three-session gate must stay closed');
check(durableLedger.summary.maturityPct === 44.6, 'maturity must stay unchanged');
check(durableLedger.summary.formalOptimizationCandidate === 'NONE', 'Formal candidate must stay absent');

console.log(JSON.stringify({
  ok: true,
  assertions,
  scope: 'OUTCOME_BLIND_SOURCE_VERSION_OBSERVER',
  formalCoreImpact: 'NONE_LOCKED',
}));
