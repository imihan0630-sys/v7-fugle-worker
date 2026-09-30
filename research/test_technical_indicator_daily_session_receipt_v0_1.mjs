import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {
  compareTechnicalManifests,
  verifyManifest,
} from './technical_indicator_row_diff_manifest_v0_1.mjs';
import {
  summarizeLedger,
  verifyChain,
} from './technical_indicator_fixed_cadence_observer_v0_1.mjs';

let assertions = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  assertions += 1;
};

const receipt = JSON.parse(zlib.gunzipSync(fs.readFileSync(
  new URL('./technical_indicator_daily_session_receipt_20260930.json.gz', import.meta.url),
)).toString('utf8'));
const repeatReceipt = JSON.parse(zlib.gunzipSync(fs.readFileSync(
  new URL('./technical_indicator_daily_session_repeat_receipt_20260930.json.gz', import.meta.url),
)).toString('utf8'));

check(receipt.schemaVersion === 'TECHNICAL_INDICATOR_DAILY_SESSION_RECEIPT_V0_1', 'receipt schema changed');
check(receipt.outcomeDataInspected === false, 'receipt must remain outcome blind');
check(receipt.formalCoreImpact === 'NONE_LOCKED', 'Formal Core impact changed');
check(receipt.tradeDate === '2026-09-30', 'session trade date changed');
check(verifyManifest(receipt.manifests.TWSE), 'TWSE historical manifest failed');
check(verifyManifest(receipt.manifests.TPEX), 'TPEx historical manifest failed');
check(verifyManifest(receipt.currentManifests.TWSE), 'TWSE current manifest failed');
check(verifyManifest(receipt.currentManifests.TPEX), 'TPEx current manifest failed');
check(receipt.manifests.TWSE.rowCount === 1382, 'TWSE session row count changed');
check(receipt.manifests.TPEX.rowCount === 11772, 'TPEx session row count changed');
check(receipt.currentEndpointFreshness.TWSE === 'STALE_PREVIOUS_TRADE_DATE', 'TWSE stale witness changed');
check(receipt.currentEndpointFreshness.TPEX === 'CURRENT_TRADE_DATE', 'TPEx current-date witness changed');
check(
  receipt.sameOwnerCrossContractParity.TWSE.classification === 'NOT_COMPARABLE_TRADE_DATE_MISMATCH',
  'different TWSE dates must not be compared as revisions',
);
check(
  receipt.sameOwnerCrossContractParity.TPEX.classification === 'NO_D03_OHLC_ROW_CHANGE',
  'TPEx same-date parity failed',
);
check(
  compareTechnicalManifests(receipt.manifests.TPEX, receipt.currentManifests.TPEX).changed.length === 0,
  'TPEx parity recomputation failed',
);
check(
  receipt.classification.crossSessionChange === 'NEW_TRADE_DATE_NOT_A_REVISION_COMPARISON',
  'new session must not be labeled provider revision',
);
check(receipt.limits.revisionIncidence.startsWith('UNKNOWN'), 'revision incidence must remain unknown');
check(
  repeatReceipt.sources.twse_current.payloadSha256 === receipt.sources.twse_current.payloadSha256,
  'TWSE current repeat bytes changed',
);
check(
  repeatReceipt.sources.tpex_current.payloadSha256 === receipt.sources.tpex_current.payloadSha256,
  'TPEx current repeat bytes changed',
);
check(
  repeatReceipt.sources.twse_hist.payloadSha256 === receipt.sources.twse_hist.payloadSha256,
  'TWSE historical repeat bytes changed',
);
check(
  repeatReceipt.sources.tpex_hist.payloadSha256 === receipt.sources.tpex_hist.payloadSha256,
  'TPEx historical repeat bytes changed',
);

const ledger = JSON.parse(fs.readFileSync(
  new URL('./technical_indicator_fixed_cadence_observations_20260930.json', import.meta.url),
  'utf8',
));
const summary = summarizeLedger(ledger);
check(verifyChain(ledger.entries), 'durable observation chain failed');
check(ledger.entries.length === 20, 'unexpected observation count');
check(summary.repeatedVersionComparisons === 12, 'repeated-version comparison count changed');
check(summary.changedByteComparisons === 0, 'unexpected changed same-version payload');
check(ledger.summary.prospectiveCompletedTradingSessionsObserved === 2, 'prospective coverage must be 2/3');
check(ledger.summary.coverageGate === 'ACCUMULATING_NOT_MET', 'three-session gate opened early');
check(ledger.summary.revisionIncidence === 'UNKNOWN', 'revision incidence was fabricated');
check(ledger.summary.latestBatchRejectedCaptureCount === 1, 'invalid transport exclusion changed');
check(ledger.summary.formalOptimizationCandidate === 'NONE', 'Formal candidate must stay absent');
check(ledger.summary.maturityPct === 44.6, 'maturity must stay unchanged');

console.log(JSON.stringify({
  ok: true,
  assertions,
  scope: 'OUTCOME_BLIND_SECOND_PROSPECTIVE_SESSION_RECEIPT',
  formalCoreImpact: 'NONE_LOCKED',
}));
