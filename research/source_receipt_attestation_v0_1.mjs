import { createHash } from 'node:crypto';

const iso = (s, field) => {
  if (typeof s !== 'string' || !/^\\d{4}-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d(?:\\.\\d+)?(?:Z|[+-]\\d\\d:\\d\\d)$/.test(s))
    throw new Error(`${field}: explicit valid ISO offset is required`);
  const date = new Date(s);
  if (!Number.isFinite(+date)) throw new Error(`${field}: invalid timestamp`);
  return date;
};
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const shaFormat = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const AUTHORIZED_TRANSPORTS = new Set(['AUTHORIZED_HTTP', 'AUTHORIZED_CONNECTOR']);

// This validator deliberately accepts no retrospective reconstruction of first-known clocks.
// It verifies attestation separately from legacy receipt-schema validity.
export function auditSourceAttestation(receipt, {decisionTimestamp, rawBody} = {}) {
  if (!receipt || typeof receipt !== 'object') throw new Error('receipt required');
  const decision = iso(decisionTimestamp, 'decisionTimestamp');
  const evidence = receipt.sourceEvidence;
  if (!evidence || typeof evidence !== 'object') return Object.freeze({
    status: 'LEGACY_SOURCE_NOT_ATTESTED', cleanProspectiveEligible: false,
    reasons: ['SOURCE_RESPONSE_ATTESTATION_ABSENT']
  });
  const reasons = [];
  const responseAt = iso(evidence.responseCompletedAt, 'sourceEvidence.responseCompletedAt');
  const capturedAt = iso(receipt.capturedAt, 'capturedAt');
  const knownAt = iso(receipt.knownAtTaipei, 'knownAtTaipei');
  const observedAt = iso(receipt.observedAt, 'observedAt');
  const firstEligible = iso(receipt.firstEligibleTaiwanDecision, 'firstEligibleTaiwanDecision');
  if (observedAt > responseAt) reasons.push('OBSERVATION_AFTER_RESPONSE');
  if (responseAt > capturedAt) reasons.push('BACKDATED_CAPTURE');
  if (knownAt < responseAt && !evidence.providerNativeAvailabilityProof) reasons.push('BACKDATED_KNOWN_AT');
  if (knownAt > capturedAt) reasons.push('KNOWN_AFTER_CAPTURE');
  if (firstEligible < knownAt) reasons.push('ELIGIBILITY_BEFORE_KNOWN');
  if (responseAt > decision || capturedAt > decision || knownAt > decision || firstEligible > decision)
    reasons.push('AFTER_DECISION');
  if (!AUTHORIZED_TRANSPORTS.has(evidence.transport)) reasons.push('UNVERIFIED_TRANSPORT');
  if (evidence.sourceUrl !== receipt.sourceUrlOrContract) reasons.push('SOURCE_URL_MISMATCH');
  if (evidence.httpStatus !== 200) reasons.push('HTTP_RESPONSE_NOT_200');
  if (!shaFormat(evidence.responseBodySha256) || !Number.isSafeInteger(evidence.responseBodyBytes) || evidence.responseBodyBytes <= 0)
    reasons.push('INVALID_RAW_RESPONSE_IDENTITY');
  if (rawBody == null) reasons.push('RAW_BYTES_UNAVAILABLE_FOR_REPLAY');
  else {
    const bytes = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody);
    if (bytes.length !== evidence.responseBodyBytes || sha256(bytes) !== evidence.responseBodySha256)
      reasons.push('RAW_RESPONSE_HASH_OR_LENGTH_MISMATCH');
  }
  if (evidence.rawArchiveState !== 'IMMUTABLE_RAW_REPLAY_VERIFIED' || !evidence.rawArchiveRef)
    reasons.push('IMMUTABLE_RAW_ARCHIVE_NOT_PROVEN');
  if (receipt.pointInTimeEligible !== true || receipt.staleFlag || receipt.missingReason)
    reasons.push('RECEIPT_NOT_PIT_CLEAN');
  if (!evidence.automatedUseAuthorized) reasons.push('ENTITLEMENT_NOT_PROVEN');
  const eligible = reasons.length === 0;
  return Object.freeze({
    status: eligible ? 'SOURCE_RESPONSE_ATTESTED' : 'SOURCE_ATTESTATION_INCOMPLETE',
    cleanProspectiveEligible: eligible, reasons: Object.freeze(reasons)
  });
}
