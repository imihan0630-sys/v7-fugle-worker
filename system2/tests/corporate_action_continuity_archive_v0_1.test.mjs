import assert from "node:assert/strict";
import {
  buildCorporateActionSourceCaptureV0_1,
  buildCorporateActionEventVersionV0_1,
  reconcileCorporateActionEventVersionsV0_1,
  buildCorporateActionCompletenessReceiptV0_1,
  buildCorporateActionCompletenessReceiptV0_2,
  classifyCorporateActionSymbolWindowV0_1,
} from "../runtime/corporate_action_continuity_archive_v0_1.mjs";

const baseCapture = await buildCorporateActionSourceCaptureV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  sourceUrl: "https://example.invalid/twse",
  exchange: "TWSE",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE",
  fetchedAt: "2026-10-03T13:00:00.000Z",
  payloadHash: "payload-a",
  parserVersion: "fixture-1",
  sourceStatus: "STRUCTURE_READY",
  recordCount: 1,
  requestedStartDate: "2026-04-05",
  requestedEndDate: "2026-10-02",
  responseRangeVerified: true,
});

assert.equal(baseCapture.immutable, true);
assert.match(baseCapture.captureId, /^S2-CA-CAPTURE:/);

const historical = await buildCorporateActionEventVersionV0_1({
  sourceCapture: baseCapture,
  symbol: "2330",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  eventKey: "TWSE|2330|EX_RIGHT_DIVIDEND|2026-09-21",
  eventStage: "ACTUAL_RESULT",
  effectiveDate: "2026-09-21",
  outcomeState: "ACTIVE",
  continuityEffect: { referencePrice: 95 },
  continuityEffectState: "VERIFIED",
  knowledgeTimeMode: "HISTORICAL_UNKNOWN",
  sourceRowHash: "row-a",
  actualResultVerified: true,
});
assert.equal(historical.firstKnownAt, null);
assert.equal(historical.availableAt, null);
assert.equal(historical.pitEventReplayEligible, false);
assert.equal(historical.technicalContinuityEvidenceEligible, true);

await assert.rejects(
  buildCorporateActionEventVersionV0_1({
    sourceCapture: baseCapture,
    symbol: "2330",
    actionFamilyId: "EX_RIGHT_DIVIDEND",
    eventKey: "bad-clock",
    eventStage: "FORECAST",
    knowledgeTimeMode: "HISTORICAL_UNKNOWN",
    firstKnownAt: "2026-01-01T00:00:00Z",
    sourceRowHash: "row-b",
  }),
  /must not fabricate firstKnownAt/,
);

const prospectiveCapture = await buildCorporateActionSourceCaptureV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_FORECAST",
  sourceUrl: "https://example.invalid/twse-current",
  exchange: "TWSE",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  sourceClass: "CURRENT_PROSPECTIVE_SNAPSHOT",
  fetchedAt: "2026-10-03T13:05:00.000Z",
  payloadHash: "payload-b",
  parserVersion: "fixture-1",
  sourceStatus: "STRUCTURE_READY",
  recordCount: 1,
});

const prospective = await buildCorporateActionEventVersionV0_1({
  sourceCapture: prospectiveCapture,
  symbol: "2330",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  eventKey: "TWSE|2330|EX_RIGHT_DIVIDEND|2026-12-01",
  eventStage: "FORECAST",
  effectiveDate: "2026-12-01",
  outcomeState: "ACTIVE",
  knowledgeTimeMode: "PROSPECTIVE_OBSERVED",
  sourceRowHash: "row-c",
});
assert.equal(prospective.firstKnownAt, prospectiveCapture.fetchedAt);
assert.equal(prospective.availableAt, prospectiveCapture.fetchedAt);
assert.equal(prospective.knowledgeTimeClass, "OBSERVED_AVAILABLE_UPPER_BOUND");
assert.equal(prospective.pitEventReplayEligible, true);

const revCapture = await buildCorporateActionSourceCaptureV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_FORECAST",
  sourceUrl: "https://example.invalid/twse-current",
  exchange: "TWSE",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  sourceClass: "CURRENT_PROSPECTIVE_SNAPSHOT",
  fetchedAt: "2026-10-04T13:05:00.000Z",
  payloadHash: "payload-c",
  parserVersion: "fixture-1",
  sourceStatus: "STRUCTURE_READY",
  recordCount: 1,
});
const revised = await buildCorporateActionEventVersionV0_1({
  sourceCapture: revCapture,
  symbol: "2330",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  eventKey: prospective.eventKey,
  eventStage: "FORECAST",
  effectiveDate: "2026-12-02",
  outcomeState: "ACTIVE",
  knowledgeTimeMode: "PROSPECTIVE_OBSERVED",
  sourceRowHash: "row-d",
  supersedesVersionId: prospective.eventVersionId,
});
const cancelCapture = await buildCorporateActionSourceCaptureV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_FORECAST",
  sourceUrl: "https://example.invalid/twse-current",
  exchange: "TWSE",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  sourceClass: "CURRENT_PROSPECTIVE_SNAPSHOT",
  fetchedAt: "2026-10-05T13:05:00.000Z",
  payloadHash: "payload-d",
  parserVersion: "fixture-1",
  sourceStatus: "STRUCTURE_READY",
  recordCount: 1,
});
const cancelled = await buildCorporateActionEventVersionV0_1({
  sourceCapture: cancelCapture,
  symbol: "2330",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  eventKey: prospective.eventKey,
  eventStage: "FORECAST",
  effectiveDate: "2026-12-02",
  outcomeState: "CANCELLED",
  knowledgeTimeMode: "PROSPECTIVE_OBSERVED",
  sourceRowHash: "row-e",
  supersedesVersionId: revised.eventVersionId,
});

const chain = reconcileCorporateActionEventVersionsV0_1([prospective, revised, cancelled]);
assert.equal(chain.ambiguityCount, 0);
assert.equal(chain.groups[0].versionCount, 3);
assert.equal(chain.groups[0].state, "READY_CANCELLED");
assert.equal(chain.groups[0].currentVersionId, cancelled.eventVersionId);
assert.ok(chain.groups[0].allVersionIds.includes(prospective.eventVersionId));
assert.ok(chain.groups[0].allVersionIds.includes(revised.eventVersionId));

const duplicateCapture = await buildCorporateActionSourceCaptureV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  sourceUrl: "https://example.invalid/twse",
  exchange: "TWSE",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE",
  fetchedAt: "2026-10-03T14:00:00.000Z",
  payloadHash: "payload-a",
  parserVersion: "fixture-1",
  sourceStatus: "STRUCTURE_READY",
  recordCount: 1,
  requestedStartDate: "2026-04-05",
  requestedEndDate: "2026-10-02",
  responseRangeVerified: true,
});
const historicalDuplicate = await buildCorporateActionEventVersionV0_1({
  sourceCapture: duplicateCapture,
  symbol: "2330",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  eventKey: historical.eventKey,
  eventStage: historical.eventStage,
  effectiveDate: historical.effectiveDate,
  outcomeState: historical.outcomeState,
  continuityEffect: historical.continuityEffect,
  continuityEffectState: historical.continuityEffectState,
  knowledgeTimeMode: "HISTORICAL_UNKNOWN",
  sourceRowHash: "row-a-repeat",
  actualResultVerified: true,
});
const duplicateRecon = reconcileCorporateActionEventVersionsV0_1([historical, historicalDuplicate]);
assert.equal(duplicateRecon.ambiguityCount, 0);
assert.equal(duplicateRecon.groups[0].duplicateObservationCount, 1);
assert.equal(duplicateRecon.groups[0].distinctSemanticVersionCount, 1);
assert.equal(duplicateRecon.groups[0].state, "READY_ACTIVE");

const requiredSourceContracts = [
  { exchange: "TWSE", actionFamilyId: "EX_RIGHT_DIVIDEND", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TWSE", actionFamilyId: "CAPITAL_REDUCTION", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TWSE", actionFamilyId: "PAR_VALUE_CHANGE", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TPEX", actionFamilyId: "EX_RIGHT_DIVIDEND", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TPEX", actionFamilyId: "CAPITAL_REDUCTION", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TPEX", actionFamilyId: "PAR_VALUE_CHANGE", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
];
const sourceCoverage = requiredSourceContracts.map((contract, i) => ({
  ...contract,
  sourceId: `SRC-${i}`,
  coverageState: "COMPLETE",
  parserComplete: true,
  revisionCoverageComplete: true,
  requestedStartDate: "2026-04-05",
  requestedEndDate: "2026-10-02",
  responseRangeVerified: true,
  observedRowCount: i === 5 ? 0 : 1,
  emptyRangeSemanticsCertified: i === 5,
  missingSourceDates: [],
}));

const complete = buildCorporateActionCompletenessReceiptV0_1({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage,
  eventVersions: [historical, historicalDuplicate],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  generatedAt: "2026-10-03T15:00:00.000Z",
});
assert.equal(complete.sourceCoverageComplete, true);
assert.equal(complete.revisionCoverageComplete, true);
assert.equal(complete.eventCoverageComplete, true);
assert.equal(complete.noEventMayBeClaimed, true);
assert.equal(complete.suspensionCoverageComplete, true);
assert.equal(complete.symbolSessionCompletenessEvidenceReady, true);
assert.equal(complete.symbolSessionCompletenessCertified, false);
assert.equal(complete.technicalContinuityCertified, false);
assert.equal(complete.selectionAuthority, false);

const present = classifyCorporateActionSymbolWindowV0_1({
  receipt: complete,
  exchange: "TWSE",
  symbol: "2330",
  universeState: "IN_SCOPE",
});
assert.equal(present.state, "EVENT_PRESENT");
assert.deepEqual(present.eventVersionIds, [historical.eventVersionId].sort());

const noEvent = classifyCorporateActionSymbolWindowV0_1({
  receipt: complete,
  exchange: "TWSE",
  symbol: "2317",
  universeState: "IN_SCOPE",
});
assert.equal(noEvent.state, "NO_EVENT");

const unknownUniverse = classifyCorporateActionSymbolWindowV0_1({
  receipt: complete,
  exchange: "TWSE",
  symbol: "2317",
  universeState: "UNKNOWN",
});
assert.equal(unknownUniverse.state, "EVENT_COVERAGE_UNKNOWN");

const emptyNotCertified = sourceCoverage.map((x) => ({ ...x }));
emptyNotCertified[5] = { ...emptyNotCertified[5], emptyRangeSemanticsCertified: false };
const incompleteEmpty = buildCorporateActionCompletenessReceiptV0_1({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage: emptyNotCertified,
  eventVersions: [],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  generatedAt: "2026-10-03T15:00:00.000Z",
});
assert.equal(incompleteEmpty.sourceCoverageComplete, false);
assert.equal(incompleteEmpty.noEventMayBeClaimed, false);
assert.equal(
  classifyCorporateActionSymbolWindowV0_1({
    receipt: incompleteEmpty,
    exchange: "TWSE",
    symbol: "2317",
    universeState: "IN_SCOPE",
  }).state,
  "EVENT_COVERAGE_UNKNOWN",
);

const badRange = sourceCoverage.map((x) => ({ ...x }));
badRange[0] = { ...badRange[0], requestedStartDate: "2026-04-06" };
const incompleteRange = buildCorporateActionCompletenessReceiptV0_1({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage: badRange,
  eventVersions: [],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  generatedAt: "2026-10-03T15:00:00.000Z",
});
assert.equal(incompleteRange.sourceCoverageComplete, false);
assert.equal(incompleteRange.noEventMayBeClaimed, false);

const conflictCapture = await buildCorporateActionSourceCaptureV0_1({
  sourceId: "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  sourceUrl: "https://example.invalid/twse",
  exchange: "TWSE",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE",
  fetchedAt: "2026-10-03T15:30:00.000Z",
  payloadHash: "payload-z",
  parserVersion: "fixture-1",
  sourceStatus: "STRUCTURE_READY",
  recordCount: 1,
  requestedStartDate: "2026-04-05",
  requestedEndDate: "2026-10-02",
  responseRangeVerified: true,
});
const conflicting = await buildCorporateActionEventVersionV0_1({
  sourceCapture: conflictCapture,
  symbol: "2330",
  actionFamilyId: "EX_RIGHT_DIVIDEND",
  eventKey: historical.eventKey,
  eventStage: "ACTUAL_RESULT",
  effectiveDate: "2026-09-22",
  outcomeState: "ACTIVE",
  continuityEffect: { referencePrice: 94 },
  continuityEffectState: "VERIFIED",
  knowledgeTimeMode: "HISTORICAL_UNKNOWN",
  sourceRowHash: "row-z",
  actualResultVerified: true,
});
const ambiguousReceipt = buildCorporateActionCompletenessReceiptV0_1({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage,
  eventVersions: [historical, conflicting],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  generatedAt: "2026-10-03T16:00:00.000Z",
});
assert.equal(ambiguousReceipt.archiveUnambiguous, false);
assert.equal(ambiguousReceipt.noEventMayBeClaimed, false);
assert.equal(
  classifyCorporateActionSymbolWindowV0_1({
    receipt: ambiguousReceipt,
    exchange: "TWSE",
    symbol: "2330",
    universeState: "IN_SCOPE",
  }).state,
  "EVENT_COVERAGE_UNKNOWN",
);

const suspensionEvidence = {
  TWSE: {
    exchange: "TWSE",
    coverageState: "COMPLETE",
    requestedStartDate: "2026-04-05",
    requestedEndDate: "2026-10-02",
    sourceId: "TWSE_TWTAWU_BOUNDED",
    sourceFamily: "TWTAWU",
    sourceContractVersion: "TWSE-TWTAWU-BOUNDED-V0_2",
    receiptDigest: "a".repeat(64),
    observedAt: "2026-10-02T07:00:00Z",
    availabilitySemantics: "PROSPECTIVE_OBSERVED",
  },
  TPEX: {
    exchange: "TPEX",
    coverageState: "COMPLETE",
    requestedStartDate: "2026-04-05",
    requestedEndDate: "2026-10-02",
    sourceId: "TPEX_SUSPENSION_BOUNDED",
    sourceFamily: "TPEX_SUSPENSION",
    sourceContractVersion: "TPEX-SUSPENSION-BOUNDED-V0_2",
    receiptDigest: "b".repeat(64),
    observedAt: "2026-10-02T07:00:00Z",
    availabilitySemantics: "PROSPECTIVE_OBSERVED",
  },
};

const statusOnlyV02 = await buildCorporateActionCompletenessReceiptV0_2({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage,
  eventVersions: [],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  generatedAt: "2026-10-02T07:10:00Z",
});
assert.equal(statusOnlyV02.schemaVersion, "S2_CA_COMPLETENESS_RECEIPT_V0_2");
assert.equal(statusOnlyV02.eventCoverageComplete, true);
assert.equal(statusOnlyV02.suspensionCoverageComplete, false);
assert.equal(statusOnlyV02.symbolSessionCompletenessEvidenceReady, false);
assert.equal(statusOnlyV02.suspensionEvidenceByExchange.TWSE.evidenceReady, false);
assert.ok(statusOnlyV02.suspensionEvidenceByExchange.TWSE.blockerCodes.includes("SUSPENSION_EVIDENCE_RECEIPT_DIGEST_INVALID"));
assert.match(statusOnlyV02.receiptHash, /^[a-f0-9]{64}$/);

const evidenceBoundV02 = await buildCorporateActionCompletenessReceiptV0_2({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage,
  eventVersions: [],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  suspensionEvidenceByExchange: suspensionEvidence,
  generatedAt: "2026-10-02T07:10:00Z",
});
assert.equal(evidenceBoundV02.suspensionCoverageComplete, true);
assert.equal(evidenceBoundV02.symbolSessionCompletenessEvidenceReady, true);
assert.equal(evidenceBoundV02.evidenceBoundSuspensionCompleteness, true);
assert.equal(evidenceBoundV02.legacyStatusOnlyCompletenessAccepted, false);
assert.equal(evidenceBoundV02.suspensionEvidenceByExchange.TWSE.receiptDigest, "a".repeat(64));

const badSuspensionDigestV02 = await buildCorporateActionCompletenessReceiptV0_2({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage,
  eventVersions: [],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  suspensionEvidenceByExchange: {
    ...suspensionEvidence,
    TWSE: { ...suspensionEvidence.TWSE, receiptDigest: "not-a-sha256" },
  },
  generatedAt: "2026-10-02T07:10:00Z",
});
assert.equal(badSuspensionDigestV02.suspensionCoverageComplete, false);
assert.equal(badSuspensionDigestV02.symbolSessionCompletenessEvidenceReady, false);
assert.ok(badSuspensionDigestV02.suspensionEvidenceByExchange.TWSE.blockerCodes.includes("SUSPENSION_EVIDENCE_RECEIPT_DIGEST_INVALID"));

const badSuspensionRangeV02 = await buildCorporateActionCompletenessReceiptV0_2({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage,
  eventVersions: [],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  suspensionEvidenceByExchange: {
    ...suspensionEvidence,
    TWSE: { ...suspensionEvidence.TWSE, requestedStartDate: "2026-04-06" },
  },
  generatedAt: "2026-10-02T07:10:00Z",
});
assert.equal(badSuspensionRangeV02.suspensionCoverageComplete, false);
assert.ok(badSuspensionRangeV02.suspensionEvidenceByExchange.TWSE.blockerCodes.includes("SUSPENSION_EVIDENCE_INTERVAL_MISMATCH"));

const changedSuspensionDigestV02 = await buildCorporateActionCompletenessReceiptV0_2({
  startDate: "2026-04-05",
  endDate: "2026-10-02",
  universeVersion: "fixture-universe-v1",
  universeCoverageComplete: true,
  requiredSourceContracts,
  sourceCoverage,
  eventVersions: [],
  suspensionCoverageByExchange: { TWSE: "COMPLETE", TPEX: "COMPLETE" },
  suspensionEvidenceByExchange: {
    ...suspensionEvidence,
    TWSE: { ...suspensionEvidence.TWSE, receiptDigest: "c".repeat(64) },
  },
  generatedAt: "2026-10-02T07:10:00Z",
});
assert.notEqual(evidenceBoundV02.receiptHash, changedSuspensionDigestV02.receiptHash);

console.log("System2 corporate-action continuity archive core tests passed");
