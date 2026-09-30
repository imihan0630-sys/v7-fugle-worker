import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {
  buildTechnicalOhlcRowVersionReceipt,
  evaluateTechnicalRowVersionForDecision,
} from './technical_ohlc_row_version_receipt_v0_1.mjs';

const sha = char => char.repeat(64);
const parentDecisionReceiptId = 'parent-2026-09-29-2330';
const captureGeneration = 'generation-2026-09-29-A';

const baseInput = {
  source: {
    providerId: 'SYNTHETIC_SOURCE_OWNER',
    providerContractVersion: 'SYNTHETIC_DAILY_OHLC_V1',
    providerRowVersion: '2330-2026-09-29-v1',
    providerPublishedAt: '2026-09-29T13:34:00+08:00',
    providerFirstKnownAt: '2026-09-29T13:35:00+08:00',
    capturedAt: '2026-09-29T13:36:00+08:00',
    rawPayloadReceiptId: 'payload-2330-20260929-v1',
    rawPayloadDigest: sha('a'),
  },
  rowIdentity: {
    canonicalMarket: 'TWSE',
    symbol: '2330',
    tradeDate: '2026-09-29',
    barInterval: 'P1D_REGULAR_SESSION',
    barIntervalStartAt: '2026-09-29T09:00:00+08:00',
    barIntervalEndAt: '2026-09-29T13:33:00+08:00',
    barCompletionState: 'COMPLETE',
    symbolSessionReceiptId: 'session-2330-20260929',
    symbolSessionState: 'CERTIFIED',
  },
  rawFieldBytes: {open: '100.0', high: '110.0', low: '98.0', close: '108.0'},
  observedFieldState: {open: 'OBSERVED', high: 'OBSERVED', low: 'OBSERVED', close: 'OBSERVED'},
  sourceAttestation: {authority: 'LOCAL_CAPTURE_ONLY', attestationReceiptId: null, attestedDigest: null},
  transformLineage: {
    sourceRawVersionDigest: null,
    technicalPriceSpaceVersion: 'TECHNICAL_CONTINUITY_V1',
    transformationSpecVersion: 'NO_ADJUSTMENT_V1',
    corporateActionReceiptId: 'ca-none-2330-20260929',
    technicalPriceFactor: 1,
    supersedesRawVersionDigest: null,
  },
  transformedOhlc: {open: 100, high: 110, low: 98, close: 108},
  parentCommitment: {parentDecisionReceiptId, captureGeneration, committedRowVersionDigest: null},
};

const mergeInput = overrides => {
  const copy = structuredClone(baseInput);
  for (const [key, value] of Object.entries(overrides ?? {})) {
    copy[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? {...copy[key], ...value}
      : value;
  }
  return copy;
};

async function buildAttested(overrides = {}) {
  const draft = await buildTechnicalOhlcRowVersionReceipt(mergeInput(overrides), webcrypto);
  const input = mergeInput(overrides);
  input.sourceAttestation = {
    authority: 'SOURCE_OWNER_VERIFIED',
    attestationReceiptId: `attestation-${input.source.providerRowVersion}`,
    attestedDigest: draft.rawVersionDigest,
  };
  return buildTechnicalOhlcRowVersionReceipt(input, webcrypto);
}

const afterMarketExpectation = {
  decisionCutoffAt: '2026-09-29T16:00:00+08:00',
  parentDecisionReceiptId,
  captureGeneration,
  requiredBarCompletionState: 'COMPLETE',
};

// TI-412 positive control: a completed, attested and parent-committed row is eligible.
const valid = await buildAttested();
assert.equal(
  (await evaluateTechnicalRowVersionForDecision(valid, afterMarketExpectation, webcrypto)).state,
  'ELIGIBLE',
);

// TI-413 / TI-409 consolidation: exact raw bytes cannot change under an old digest.
const rawTamper = structuredClone(valid);
rawTamper.rawFieldBytes.high = '112.0';
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(rawTamper, afterMarketExpectation, webcrypto),
  {state: 'BLOCKED', reason: 'RAW_CONTENT_DIGEST_MISMATCH'},
);

// Transformed values are bound separately to raw ancestry and transform semantics.
const transformedTamper = structuredClone(valid);
transformedTamper.transformedOhlc.high = 112;
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(transformedTamper, afterMarketExpectation, webcrypto),
  {state: 'BLOCKED', reason: 'TRANSFORMED_ROW_DIGEST_MISMATCH'},
);

// TI-414 / TI-410 consolidation: a genuine later correction is not visible to an earlier decision.
const correction = await buildAttested({
  source: {
    ...baseInput.source,
    providerRowVersion: '2330-2026-09-29-v2',
    providerPublishedAt: '2026-09-30T08:55:00+08:00',
    providerFirstKnownAt: '2026-09-30T09:00:00+08:00',
    capturedAt: '2026-09-30T09:01:00+08:00',
    rawPayloadReceiptId: 'payload-2330-20260929-v2',
    rawPayloadDigest: sha('b'),
  },
  rawFieldBytes: {open: '100.0', high: '112.0', low: '98.0', close: '108.0'},
  transformedOhlc: {open: 100, high: 112, low: 98, close: 108},
  transformLineage: {...baseInput.transformLineage, supersedesRawVersionDigest: valid.rawVersionDigest},
});
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(correction, afterMarketExpectation, webcrypto),
  {state: 'BLOCKED', reason: 'ROW_VERSION_AFTER_DECISION'},
);
assert.equal(
  (await evaluateTechnicalRowVersionForDecision(correction, {
    ...afterMarketExpectation,
    decisionCutoffAt: '2026-09-30T16:00:00+08:00',
  }, webcrypto)).state,
  'ELIGIBLE',
);

// TI-415 / TI-411 consolidation: a full daily bar cannot exist at a 09:00 decision.
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(valid, {
    ...afterMarketExpectation,
    decisionCutoffAt: '2026-09-29T09:00:00+08:00',
  }, webcrypto),
  {state: 'BLOCKED', reason: 'BAR_INTERVAL_AFTER_DECISION'},
);

// A PARTIAL bar is a distinct contract and cannot silently satisfy COMPLETE semantics.
const partial = await buildAttested({
  source: {
    ...baseInput.source,
    providerRowVersion: '2330-2026-09-29-partial-1000',
    providerPublishedAt: '2026-09-29T10:00:01+08:00',
    providerFirstKnownAt: '2026-09-29T10:00:02+08:00',
    capturedAt: '2026-09-29T10:00:03+08:00',
    rawPayloadReceiptId: 'payload-2330-20260929-partial-1000',
  },
  rowIdentity: {
    ...baseInput.rowIdentity,
    barInterval: 'PT60M_PARTIAL',
    barIntervalEndAt: '2026-09-29T10:00:00+08:00',
    barCompletionState: 'PARTIAL',
  },
});
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(partial, afterMarketExpectation, webcrypto),
  {state: 'BLOCKED', reason: 'BAR_COMPLETION_SEMANTICS_MISMATCH'},
);

// TI-416: self-issued/local capture strings do not become independent attestation.
const localOnly = await buildTechnicalOhlcRowVersionReceipt(baseInput, webcrypto);
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(localOnly, afterMarketExpectation, webcrypto),
  {state: 'UNKNOWN', reason: 'INDEPENDENT_SOURCE_ATTESTATION_MISSING'},
);

// Missing first-known time remains UNKNOWN even when capture time is early enough.
const missingFirstKnownDraft = await buildTechnicalOhlcRowVersionReceipt(mergeInput({
  source: {...baseInput.source, providerFirstKnownAt: null},
}), webcrypto);
const missingFirstKnownInput = mergeInput({source: {...baseInput.source, providerFirstKnownAt: null}});
missingFirstKnownInput.sourceAttestation = {
  authority: 'SOURCE_OWNER_VERIFIED',
  attestationReceiptId: 'attestation-missing-first-known',
  attestedDigest: missingFirstKnownDraft.rawVersionDigest,
};
const missingFirstKnown = await buildTechnicalOhlcRowVersionReceipt(missingFirstKnownInput, webcrypto);
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(missingFirstKnown, afterMarketExpectation, webcrypto),
  {state: 'UNKNOWN', reason: 'ROW_VERSION_FIRST_KNOWN_UNKNOWN'},
);

// Certified content cannot attach to another parent generation.
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(valid, {
    ...afterMarketExpectation,
    captureGeneration: 'generation-foreign',
  }, webcrypto),
  {state: 'BLOCKED', reason: 'FOREIGN_PARENT_GENERATION'},
);

// Corporate-action/price-space ancestry and exact parent commitment are fail-closed.
const badAncestry = structuredClone(valid);
badAncestry.transformLineage.sourceRawVersionDigest = sha('c');
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(badAncestry, afterMarketExpectation, webcrypto),
  {state: 'BLOCKED', reason: 'TRANSFORM_RAW_ANCESTRY_MISMATCH'},
);
const badCommitment = structuredClone(valid);
badCommitment.parentCommitment.committedRowVersionDigest = sha('d');
assert.deepEqual(
  await evaluateTechnicalRowVersionForDecision(badCommitment, afterMarketExpectation, webcrypto),
  {state: 'BLOCKED', reason: 'PARENT_ROW_VERSION_COMMITMENT_MISMATCH'},
);

console.log(JSON.stringify({
  ok: true,
  contract: 'TECHNICAL_OHLC_ROW_VERSION_RECEIPT_V0_1',
  assertions: 12,
  scope: 'SYNTHETIC_RESEARCH_QA_ONLY',
}));
