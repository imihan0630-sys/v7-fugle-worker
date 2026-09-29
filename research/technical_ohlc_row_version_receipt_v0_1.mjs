// Research-only immutable OHLC row-version receipt.
// This module validates internal integrity and replay timing. It cannot create
// independent source attestation; that authority must come from upstream.

import {
  canonicalJcsJson,
  normalizeDateOnly,
  normalizeInstant,
  sha256HexUtf8,
} from './canonical_receipt_hash_v0_1.mjs';

export const TECHNICAL_OHLC_ROW_VERSION_CONTRACT = Object.freeze({
  schemaVersion: 'TECHNICAL_OHLC_ROW_VERSION_RECEIPT_V0_1',
  normalizationVersion: 'TECHNICAL_OHLC_ROW_VERSION_NORMALIZATION_V0_1',
  rawDigestDomain: 'TWSTOCK_V7|TECHNICAL_OHLC_RAW_ROW_VERSION|V1|',
  transformedDigestDomain: 'TWSTOCK_V7|TECHNICAL_OHLC_TRANSFORMED_ROW_VERSION|V1|',
  eligibleAttestationAuthorities: Object.freeze(['PROVIDER_SIGNED', 'SOURCE_OWNER_VERIFIED']),
});

const hex64 = /^[0-9a-f]{64}$/;
const allowedCompletion = new Set(['COMPLETE', 'PARTIAL']);
const allowedFieldState = new Set(['OBSERVED', 'NOT_PRESENT']);

function plainObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`OBJECT_REQUIRED:${field}`);
  }
  return value;
}

function nonempty(value, field) {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`NONEMPTY_STRING_REQUIRED:${field}`);
  return value;
}

function digest(value, field) {
  const text = nonempty(value, field);
  if (!hex64.test(text)) throw new Error(`LOWERCASE_SHA256_REQUIRED:${field}`);
  return text;
}

function positivePrice(value, field) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`POSITIVE_FINITE_PRICE_REQUIRED:${field}`);
  }
  return value;
}

function normalizeRawFieldBytes(value) {
  const input = plainObject(value, 'rawFieldBytes');
  const output = {};
  for (const field of ['open', 'high', 'low', 'close']) {
    if (!(field in input)) throw new Error(`RAW_FIELD_REQUIRED:${field}`);
    if (input[field] !== null && typeof input[field] !== 'string') {
      throw new Error(`RAW_FIELD_BYTES_STRING_OR_NULL:${field}`);
    }
    output[field] = input[field];
  }
  return output;
}

function normalizeObservedFieldState(value) {
  const input = plainObject(value, 'observedFieldState');
  const output = {};
  for (const field of ['open', 'high', 'low', 'close']) {
    if (!allowedFieldState.has(input[field])) throw new Error(`INVALID_OBSERVED_FIELD_STATE:${field}`);
    output[field] = input[field];
  }
  for (const field of ['high', 'low', 'close']) {
    if (output[field] !== 'OBSERVED') throw new Error(`TECHNICAL_FIELD_NOT_OBSERVED:${field}`);
  }
  return output;
}

function normalizeOhlc(value) {
  const input = plainObject(value, 'transformedOhlc');
  const open = input.open === null ? null : positivePrice(input.open, 'open');
  const high = positivePrice(input.high, 'high');
  const low = positivePrice(input.low, 'low');
  const close = positivePrice(input.close, 'close');
  if (low > high || close < low || close > high || (open !== null && (open < low || open > high))) {
    throw new Error('OHLC_GEOMETRY');
  }
  return {open, high, low, close};
}

function rawDigestPayload(receipt) {
  return {
    schemaVersion: receipt.schemaVersion,
    providerId: receipt.source.providerId,
    providerContractVersion: receipt.source.providerContractVersion,
    canonicalMarket: receipt.rowIdentity.canonicalMarket,
    symbol: receipt.rowIdentity.symbol,
    tradeDate: receipt.rowIdentity.tradeDate,
    barInterval: receipt.rowIdentity.barInterval,
    barIntervalStartAt: receipt.rowIdentity.barIntervalStartAt,
    barIntervalEndAt: receipt.rowIdentity.barIntervalEndAt,
    barCompletionState: receipt.rowIdentity.barCompletionState,
    providerRowVersion: receipt.source.providerRowVersion,
    providerPublishedAt: receipt.source.providerPublishedAt,
    providerFirstKnownAt: receipt.source.providerFirstKnownAt,
    capturedAt: receipt.source.capturedAt,
    rawPayloadReceiptId: receipt.source.rawPayloadReceiptId,
    rawPayloadDigest: receipt.source.rawPayloadDigest,
    rawFieldBytes: receipt.rawFieldBytes,
    observedFieldState: receipt.observedFieldState,
  };
}

function transformedDigestPayload(receipt, rawVersionDigest) {
  return {
    schemaVersion: receipt.schemaVersion,
    rawVersionDigest,
    technicalPriceSpaceVersion: receipt.transformLineage.technicalPriceSpaceVersion,
    transformationSpecVersion: receipt.transformLineage.transformationSpecVersion,
    corporateActionReceiptId: receipt.transformLineage.corporateActionReceiptId,
    technicalPriceFactor: receipt.transformLineage.technicalPriceFactor,
    supersedesRawVersionDigest: receipt.transformLineage.supersedesRawVersionDigest,
    transformedOhlc: receipt.transformedOhlc,
  };
}

export async function computeRawVersionDigest(receipt, cryptoImpl = globalThis.crypto) {
  return sha256HexUtf8(
    TECHNICAL_OHLC_ROW_VERSION_CONTRACT.rawDigestDomain + canonicalJcsJson(rawDigestPayload(receipt)),
    cryptoImpl,
  );
}

export async function computeTransformedRowVersionDigest(receipt, rawVersionDigest, cryptoImpl = globalThis.crypto) {
  return sha256HexUtf8(
    TECHNICAL_OHLC_ROW_VERSION_CONTRACT.transformedDigestDomain
      + canonicalJcsJson(transformedDigestPayload(receipt, rawVersionDigest)),
    cryptoImpl,
  );
}

export async function buildTechnicalOhlcRowVersionReceipt(input, cryptoImpl = globalThis.crypto) {
  plainObject(input, 'receipt');
  const source = plainObject(input.source, 'source');
  const rowIdentity = plainObject(input.rowIdentity, 'rowIdentity');
  const transformLineage = plainObject(input.transformLineage, 'transformLineage');
  const sourceAttestation = plainObject(input.sourceAttestation, 'sourceAttestation');
  const parentCommitment = plainObject(input.parentCommitment, 'parentCommitment');

  const normalized = {
    schemaVersion: TECHNICAL_OHLC_ROW_VERSION_CONTRACT.schemaVersion,
    normalizationVersion: TECHNICAL_OHLC_ROW_VERSION_CONTRACT.normalizationVersion,
    source: {
      providerId: nonempty(source.providerId, 'providerId'),
      providerContractVersion: nonempty(source.providerContractVersion, 'providerContractVersion'),
      providerRowVersion: nonempty(source.providerRowVersion, 'providerRowVersion'),
      providerPublishedAt: source.providerPublishedAt === null ? null : normalizeInstant(source.providerPublishedAt, 'providerPublishedAt'),
      providerFirstKnownAt: source.providerFirstKnownAt === null ? null : normalizeInstant(source.providerFirstKnownAt, 'providerFirstKnownAt'),
      capturedAt: normalizeInstant(source.capturedAt, 'capturedAt'),
      rawPayloadReceiptId: nonempty(source.rawPayloadReceiptId, 'rawPayloadReceiptId'),
      rawPayloadDigest: digest(source.rawPayloadDigest, 'rawPayloadDigest'),
    },
    rowIdentity: {
      canonicalMarket: nonempty(rowIdentity.canonicalMarket, 'canonicalMarket'),
      symbol: nonempty(rowIdentity.symbol, 'symbol'),
      tradeDate: normalizeDateOnly(rowIdentity.tradeDate, 'tradeDate'),
      barInterval: nonempty(rowIdentity.barInterval, 'barInterval'),
      barIntervalStartAt: normalizeInstant(rowIdentity.barIntervalStartAt, 'barIntervalStartAt'),
      barIntervalEndAt: normalizeInstant(rowIdentity.barIntervalEndAt, 'barIntervalEndAt'),
      barCompletionState: nonempty(rowIdentity.barCompletionState, 'barCompletionState'),
      symbolSessionReceiptId: nonempty(rowIdentity.symbolSessionReceiptId, 'symbolSessionReceiptId'),
      symbolSessionState: nonempty(rowIdentity.symbolSessionState, 'symbolSessionState'),
    },
    rawFieldBytes: normalizeRawFieldBytes(input.rawFieldBytes),
    observedFieldState: normalizeObservedFieldState(input.observedFieldState),
    sourceAttestation: {
      authority: nonempty(sourceAttestation.authority, 'attestationAuthority'),
      attestationReceiptId: sourceAttestation.attestationReceiptId === null
        ? null : nonempty(sourceAttestation.attestationReceiptId, 'attestationReceiptId'),
      attestedDigest: sourceAttestation.attestedDigest === null
        ? null : digest(sourceAttestation.attestedDigest, 'attestedDigest'),
    },
    transformLineage: {
      sourceRawVersionDigest: transformLineage.sourceRawVersionDigest ?? null,
      technicalPriceSpaceVersion: nonempty(transformLineage.technicalPriceSpaceVersion, 'technicalPriceSpaceVersion'),
      transformationSpecVersion: nonempty(transformLineage.transformationSpecVersion, 'transformationSpecVersion'),
      corporateActionReceiptId: nonempty(transformLineage.corporateActionReceiptId, 'corporateActionReceiptId'),
      technicalPriceFactor: positivePrice(transformLineage.technicalPriceFactor, 'technicalPriceFactor'),
      supersedesRawVersionDigest: transformLineage.supersedesRawVersionDigest === null
        ? null : digest(transformLineage.supersedesRawVersionDigest, 'supersedesRawVersionDigest'),
    },
    transformedOhlc: normalizeOhlc(input.transformedOhlc),
    parentCommitment: {
      parentDecisionReceiptId: nonempty(parentCommitment.parentDecisionReceiptId, 'parentDecisionReceiptId'),
      captureGeneration: nonempty(parentCommitment.captureGeneration, 'captureGeneration'),
      committedRowVersionDigest: parentCommitment.committedRowVersionDigest ?? null,
    },
  };

  if (!allowedCompletion.has(normalized.rowIdentity.barCompletionState)) {
    throw new Error('INVALID_BAR_COMPLETION_STATE');
  }
  if (Date.parse(normalized.rowIdentity.barIntervalStartAt) >= Date.parse(normalized.rowIdentity.barIntervalEndAt)) {
    throw new Error('INVALID_BAR_INTERVAL');
  }

  const rawVersionDigest = await computeRawVersionDigest(normalized, cryptoImpl);
  if (normalized.transformLineage.sourceRawVersionDigest === null) {
    normalized.transformLineage.sourceRawVersionDigest = rawVersionDigest;
  }
  const transformedRowVersionDigest = await computeTransformedRowVersionDigest(normalized, rawVersionDigest, cryptoImpl);
  if (normalized.parentCommitment.committedRowVersionDigest === null) {
    normalized.parentCommitment.committedRowVersionDigest = transformedRowVersionDigest;
  }
  return {...normalized, rawVersionDigest, transformedRowVersionDigest};
}

const blocked = reason => ({state: 'BLOCKED', reason});
const unknown = reason => ({state: 'UNKNOWN', reason});

export async function evaluateTechnicalRowVersionForDecision(receipt, expectation, cryptoImpl = globalThis.crypto) {
  try {
    plainObject(receipt, 'receipt');
    plainObject(expectation, 'expectation');
    const decisionCutoffAt = normalizeInstant(expectation.decisionCutoffAt, 'decisionCutoffAt');
    const rawVersionDigest = await computeRawVersionDigest(receipt, cryptoImpl);
    if (rawVersionDigest !== receipt.rawVersionDigest) return blocked('RAW_CONTENT_DIGEST_MISMATCH');
    if (receipt.transformLineage?.sourceRawVersionDigest !== rawVersionDigest) {
      return blocked('TRANSFORM_RAW_ANCESTRY_MISMATCH');
    }
    const transformedRowVersionDigest = await computeTransformedRowVersionDigest(receipt, rawVersionDigest, cryptoImpl);
    if (transformedRowVersionDigest !== receipt.transformedRowVersionDigest) {
      return blocked('TRANSFORMED_ROW_DIGEST_MISMATCH');
    }
    if (receipt.parentCommitment?.committedRowVersionDigest !== transformedRowVersionDigest) {
      return blocked('PARENT_ROW_VERSION_COMMITMENT_MISMATCH');
    }
    if (receipt.parentCommitment?.parentDecisionReceiptId !== expectation.parentDecisionReceiptId
        || receipt.parentCommitment?.captureGeneration !== expectation.captureGeneration) {
      return blocked('FOREIGN_PARENT_GENERATION');
    }
    if (receipt.rowIdentity?.symbolSessionState !== 'CERTIFIED') return unknown('SYMBOL_SESSION_NOT_CERTIFIED');
    if (expectation.requiredBarCompletionState
        && receipt.rowIdentity?.barCompletionState !== expectation.requiredBarCompletionState) {
      return blocked('BAR_COMPLETION_SEMANTICS_MISMATCH');
    }
    if (Date.parse(receipt.rowIdentity?.barIntervalEndAt) > Date.parse(decisionCutoffAt)) {
      return blocked('BAR_INTERVAL_AFTER_DECISION');
    }
    if (receipt.source?.providerFirstKnownAt === null) return unknown('ROW_VERSION_FIRST_KNOWN_UNKNOWN');
    if (Date.parse(receipt.source.providerFirstKnownAt) > Date.parse(decisionCutoffAt)
        || Date.parse(receipt.source.capturedAt) > Date.parse(decisionCutoffAt)) {
      return blocked('ROW_VERSION_AFTER_DECISION');
    }
    if (!TECHNICAL_OHLC_ROW_VERSION_CONTRACT.eligibleAttestationAuthorities
      .includes(receipt.sourceAttestation?.authority)) {
      return unknown('INDEPENDENT_SOURCE_ATTESTATION_MISSING');
    }
    if (!receipt.sourceAttestation?.attestationReceiptId
        || receipt.sourceAttestation.attestedDigest !== rawVersionDigest) {
      return blocked('SOURCE_ATTESTATION_DIGEST_MISMATCH');
    }
    return {
      state: 'ELIGIBLE',
      reason: 'PIT_ROW_VERSION_COMMITTED',
      rawVersionDigest,
      transformedRowVersionDigest,
    };
  } catch (error) {
    return blocked(`ROW_VERSION_RECEIPT_QA_FAIL:${error.message}`);
  }
}
