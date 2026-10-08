import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildPitReplayWindow } from "../runtime/pit_replay_v0_1.mjs";
import { buildCorporateActionCompletenessReceiptV0_1, buildCorporateActionCompletenessReceiptV0_2 } from "../runtime/corporate_action_continuity_archive_v0_1.mjs";
import {
  buildNct01ReplaySourceIdentityV0_1,
  buildNct01TwseClearNoActionPromotionReceiptV0_1,
  bindNct01ContinuityReceiptToReplayV0_1,
  nct01ContinuitySourceManifestRefsV0_1,
} from "../runtime/nct01_continuity_replay_binding_v0_1.mjs";

const symbol = "1101";
const marketDate = "2026-09-29";
const decisionTimestamp = "2026-09-29T07:30:00Z";

function addDays(start, days) {
  const d = new Date(start + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

async function makeRows({ mutateSourceRowAt = -1 } = {}) {
  const rows = [];
  for (let i = 0; i < 61; i += 1) {
    const date = addDays("2026-07-31", i);
    const close = 100 + i;
    const sourceRowHash = await sha256Hex({
      symbol,
      date,
      revision: i === mutateSourceRowAt ? "B" : "A",
    });
    const base = {
      canonicalKey: ["TWSE", symbol, date, "RAW"].join("|"),
      marketDate: date,
      market: "TWSE",
      symbol,
      companyName: "台泥",
      priceSpace: "RAW",
      open: close - 1,
      high: close + 2,
      low: close - 2,
      close,
      volumeShares: 1_000_000 + i * 1000,
      tradeValue: (1_000_000 + i * 1000) * close,
      transactions: 1000 + i,
      change: 1,
      continuityState: "UNVERIFIED",
      sourceId: "A1_TWSE_HISTORY_FIXTURE",
      sourceName: "fixture",
      sourceRowHash,
      observedAt: date + "T05:30:00Z",
      availableAt: date + "T05:30:00Z",
      pitAvailabilityClass: "PROSPECTIVE_OBSERVED",
      pitReplayEligible: true,
    };
    rows.push({
      ...base,
      barId: "BAR-" + symbol + "-" + date,
      barHash: await sha256Hex(base),
      schemaVersion: "S2_HISTORICAL_A1_BAR_V0_1",
    });
  }
  return rows;
}

async function makeReplay(options = {}) {
  return buildPitReplayWindow({
    replayId: "NCT01-REPLAY-" + (options.mutateSourceRowAt ?? "BASE"),
    symbol,
    marketDate,
    decisionTimestamp,
    priceSpace: "RAW",
    lookbackSessions: 61,
    historicalBars: await makeRows(options),
  });
}

const requiredSourceContracts = [
  { exchange: "TWSE", actionFamilyId: "EX_RIGHT_DIVIDEND", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TWSE", actionFamilyId: "CAPITAL_REDUCTION", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
  { exchange: "TWSE", actionFamilyId: "PAR_VALUE_CHANGE", sourceClass: "HISTORICAL_ACTUAL_RESULT_RANGE" },
];

const suspensionEvidence = {
  exchange: "TWSE",
  coverageState: "COMPLETE",
  requestedStartDate: "2026-07-31",
  requestedEndDate: marketDate,
  sourceId: "TWSE-TWTAWU-BOUNDED",
  sourceFamily: "TWTAWU",
  sourceContractVersion: "TWSE-TWTAWU-BOUNDED-V0_2",
  receiptDigest: "d".repeat(64),
  observedAt: "2026-09-29T07:00:00Z",
  availabilitySemantics: "PROSPECTIVE_OBSERVED",
};

function archiveBaseArgs() {
  return {
    startDate: "2026-07-31",
    endDate: marketDate,
    universeVersion: "TWSE-NCT01-FIXTURE",
    universeCoverageComplete: true,
    requiredSourceContracts,
    sourceCoverage: requiredSourceContracts.map((contract, i) => ({
      ...contract,
      sourceId: "SRC-" + i,
      coverageState: "COMPLETE",
      parserComplete: true,
      revisionCoverageComplete: true,
      requestedStartDate: "2026-07-31",
      requestedEndDate: marketDate,
      responseRangeVerified: true,
      observedRowCount: 0,
      emptyRangeSemanticsCertified: true,
      missingSourceDates: [],
    })),
    eventVersions: [],
    suspensionCoverageByExchange: { TWSE: "COMPLETE" },
    generatedAt: "2026-09-29T07:00:00Z",
  };
}

async function makeArchive(overrides = {}) {
  const evidence = overrides.suspensionEvidence === undefined
    ? suspensionEvidence
    : overrides.suspensionEvidence;
  return buildCorporateActionCompletenessReceiptV0_2({
    ...archiveBaseArgs(),
    ...(overrides.archiveArgs || {}),
    suspensionEvidenceByExchange: evidence ? { TWSE: evidence } : {},
  });
}

function makeLegacyArchive() {
  return buildCorporateActionCompletenessReceiptV0_1(archiveBaseArgs());
}

async function makeSessionEvidence(replay) {
  const dates = replay.bars.map((x) => x.date);
  const expectedSessionHash = await sha256Hex({
    market: "TWSE",
    symbol,
    marketDate,
    dates,
  });
  return {
    expectedEligibleSymbolSessions: dates,
    exactSessionReconciliationReady: true,
    historyReady: true,
    missingExpectedSessionCount: 0,
    unexpectedSessionCount: 0,
    expectedSessionCount: dates.length,
    observedExpectedSessionCount: dates.length,
    expectedSessionHash,
    observedSessionHash: expectedSessionHash,
  };
}

function corporateActionSourceEvidenceRefs(observedAt = "2026-09-29T07:00:00Z") {
  return [0, 1, 2].map((i) => ({
    sourceId: "SRC-" + i,
    digest: String(i + 1).repeat(64),
    observedAt,
    availabilitySemantics: "PROSPECTIVE_OBSERVED",
  }));
}

function suspensionSourceEvidenceRef(overrides = {}) {
  return {
    sourceId: suspensionEvidence.sourceId,
    digest: suspensionEvidence.receiptDigest,
    observedAt: suspensionEvidence.observedAt,
    availabilitySemantics: suspensionEvidence.availabilitySemantics,
    ...overrides,
  };
}

function sourceEvidenceRefs(observedAt = "2026-09-29T07:00:00Z", suspensionOverrides = {}) {
  return [
    ...corporateActionSourceEvidenceRefs(observedAt),
    suspensionSourceEvidenceRef({
      observedAt,
      ...suspensionOverrides,
    }),
  ];
}

async function makeReceipt(replay, overrides = {}) {
  return buildNct01TwseClearNoActionPromotionReceiptV0_1({
    receiptId: overrides.receiptId || "NCT01-CONT-1101-A",
    replayWindow: replay,
    archiveReceipt: overrides.archiveReceipt || await makeArchive(overrides.archiveOverrides),
    universeState: "IN_SCOPE",
    symbolSessionEvidence: await makeSessionEvidence(replay),
    sourceEvidenceRefs: overrides.sourceEvidenceRefs || sourceEvidenceRefs(),
    sourceFamilyVersion: "TWSE-CA-EXACT-WINDOW-V0_1",
    rawHistoryAdmissionReceiptId: "RAW-HISTORY-1101-20260929",
    symbolSessionContractVersion: "S2-EXACT-SESSION-V0_4",
    sessionCalendarVersion: "TWSE-OFFICIAL-CALENDAR-V0_1",
    continuityEngineVersion: "SHARED-TECHNICAL-CONTINUITY-V0_1",
    corporateActionRegistryVersion: "S2-CA-ARCHIVE-V0_1",
    capturedAt: "2026-09-29T07:10:00Z",
    generatedAt: "2026-09-29T07:10:00Z",
  });
}

async function rehashReceipt(receipt, patch) {
  const merged = { ...receipt, ...patch };
  delete merged.receiptHash;
  return { ...merged, receiptHash: await sha256Hex(merged) };
}

const replay = await makeReplay();
assert.equal(replay.state, "READY");
assert.equal(replay.selectedSessionCount, 61);

const replayIdentity = await buildNct01ReplaySourceIdentityV0_1({ replayWindow: replay });
assert.equal(replayIdentity.state, "READY", JSON.stringify(replayIdentity.blockerCodes));
assert.match(replayIdentity.sourceHistoryHash, /^[a-f0-9]{64}$/);
assert.equal(replayIdentity.selectedDates.length, 61);

const legacyStatusOnlyReceipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-LEGACY-V01",
  archiveReceipt: makeLegacyArchive(),
});
assert.equal(legacyStatusOnlyReceipt.disposition, "CONTINUITY_UNKNOWN");
assert.ok(legacyStatusOnlyReceipt.blockerCodes.includes("CORPORATE_ACTION_COMPLETENESS_RECEIPT_V0_2_REQUIRED"));
assert.ok(legacyStatusOnlyReceipt.blockerCodes.includes("TWSE_SUSPENSION_EVIDENCE_MISSING"));

const statusOnlyV02Archive = await makeArchive({ suspensionEvidence: null });
const statusOnlyV02Receipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-V02-STATUS-ONLY",
  archiveReceipt: statusOnlyV02Archive,
});
assert.equal(statusOnlyV02Receipt.disposition, "CONTINUITY_UNKNOWN");
assert.ok(statusOnlyV02Receipt.blockerCodes.includes("SUSPENSION_COVERAGE_NOT_COMPLETE"));
assert.ok(statusOnlyV02Receipt.blockerCodes.includes("TWSE_SUSPENSION_EVIDENCE_NOT_READY"));

const noSuspensionRefReceipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-NO-SUSPENSION-REF",
  sourceEvidenceRefs: corporateActionSourceEvidenceRefs(),
});
assert.equal(noSuspensionRefReceipt.disposition, "CONTINUITY_UNKNOWN");
assert.ok(noSuspensionRefReceipt.blockerCodes.includes("TWSE_SUSPENSION_SOURCE_REF_MISSING"));

const suspensionDigestMismatchReceipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-SUSP-DIGEST-MISMATCH",
  sourceEvidenceRefs: [
    ...corporateActionSourceEvidenceRefs(),
    suspensionSourceEvidenceRef({ digest: "e".repeat(64) }),
  ],
});
assert.equal(suspensionDigestMismatchReceipt.disposition, "CONTINUITY_UNKNOWN");
assert.ok(suspensionDigestMismatchReceipt.blockerCodes.includes("TWSE_SUSPENSION_SOURCE_REF_DIGEST_MISMATCH"));

const suspensionSourceMismatchReceipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-SUSP-SOURCE-MISMATCH",
  sourceEvidenceRefs: [
    ...corporateActionSourceEvidenceRefs(),
    suspensionSourceEvidenceRef({ sourceId: "TWSE-TWTAWU-OTHER" }),
  ],
});
assert.equal(suspensionSourceMismatchReceipt.disposition, "CONTINUITY_UNKNOWN");
assert.ok(suspensionSourceMismatchReceipt.blockerCodes.includes("TWSE_SUSPENSION_SOURCE_REF_SOURCE_ID_MISMATCH"));

const lateSuspensionEvidence = {
  ...suspensionEvidence,
  observedAt: "2026-09-29T08:00:00Z",
};
const lateSuspensionArchive = await makeArchive({ suspensionEvidence: lateSuspensionEvidence });
const lateSuspensionReceipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-SUSP-LATE",
  archiveReceipt: lateSuspensionArchive,
  sourceEvidenceRefs: [
    ...corporateActionSourceEvidenceRefs(),
    {
      sourceId: lateSuspensionEvidence.sourceId,
      digest: lateSuspensionEvidence.receiptDigest,
      observedAt: lateSuspensionEvidence.observedAt,
      availabilitySemantics: "PROSPECTIVE_OBSERVED",
    },
  ],
});
assert.equal(lateSuspensionReceipt.disposition, "CONTINUITY_UNKNOWN");
assert.ok(lateSuspensionReceipt.blockerCodes.includes("SOURCE_EVIDENCE_OBSERVED_AFTER_DECISION"));
assert.ok(lateSuspensionReceipt.blockerCodes.includes("TWSE_SUSPENSION_EVIDENCE_OBSERVED_AFTER_DECISION"));

const verifiedLateEvidence = {
  ...suspensionEvidence,
  availabilitySemantics: "VERIFIED_SOURCE_TIMESTAMP",
  availableAt: "2026-09-29T08:00:00Z",
};
const verifiedLateArchive = await makeArchive({ suspensionEvidence: verifiedLateEvidence });
const verifiedLateReceipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-SUSP-VERIFIED-LATE",
  archiveReceipt: verifiedLateArchive,
  sourceEvidenceRefs: [
    ...corporateActionSourceEvidenceRefs(),
    {
      sourceId: verifiedLateEvidence.sourceId,
      digest: verifiedLateEvidence.receiptDigest,
      observedAt: verifiedLateEvidence.observedAt,
      availableAt: verifiedLateEvidence.availableAt,
      availabilitySemantics: "VERIFIED_SOURCE_TIMESTAMP",
    },
  ],
});
assert.equal(verifiedLateReceipt.disposition, "CONTINUITY_UNKNOWN");
assert.ok(verifiedLateReceipt.blockerCodes.includes("SOURCE_EVIDENCE_AVAILABLE_AFTER_DECISION"));
assert.ok(verifiedLateReceipt.blockerCodes.includes("TWSE_SUSPENSION_EVIDENCE_AVAILABLE_AFTER_DECISION"));

const changedSuspensionArchive = await makeArchive({
  suspensionEvidence: { ...suspensionEvidence, receiptDigest: "f".repeat(64) },
});
const changedSuspensionReceipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-1101-A",
  archiveReceipt: changedSuspensionArchive,
  sourceEvidenceRefs: [
    ...corporateActionSourceEvidenceRefs(),
    suspensionSourceEvidenceRef({ digest: "f".repeat(64) }),
  ],
});
assert.notEqual((await makeArchive()).receiptHash, changedSuspensionArchive.receiptHash);

const receipt = await makeReceipt(replay);
assert.equal(receipt.disposition, "CLEAR_NO_ACTION_ELIGIBLE");
assert.equal(receipt.technicalContinuityCertified, true);
assert.equal(receipt.symbolSessionCompletenessCertified, true);
assert.equal(receipt.historyMutationPerformed, false);
assert.match(receipt.receiptHash, /^[a-f0-9]{64}$/);
assert.notEqual(receipt.receiptHash, changedSuspensionReceipt.receiptHash);

const binding = await bindNct01ContinuityReceiptToReplayV0_1({
  continuityReceipt: receipt,
  replayWindow: replay,
  symbol,
  marketDate,
  decisionTimestamp,
});
assert.equal(binding.state, "READY");
assert.equal(binding.continuityState, "CLEAR_NO_ACTION");
assert.deepEqual(binding.blockerCodes, []);
assert.equal(binding.sourceHistoryHash, receipt.sourceHistoryHash);

const manifestRefs = nct01ContinuitySourceManifestRefsV0_1({ replayWindow: replay, binding });
assert.deepEqual(
  manifestRefs.map((x) => x.refType),
  [
    "PIT_REPLAY_SHA256",
    "SOURCE_HISTORY_SHA256",
    "CONTINUITY_RECEIPT_SHA256",
    "CONTINUITY_TRANSFORM_SHA256",
    "CONTINUITY_BINDING_SHA256",
  ],
);

const wrongSymbol = await rehashReceipt(receipt, { symbol: "2330" });
const wrongSymbolBinding = await bindNct01ContinuityReceiptToReplayV0_1({
  continuityReceipt: wrongSymbol,
  replayWindow: replay,
  symbol,
  marketDate,
  decisionTimestamp,
});
assert.equal(wrongSymbolBinding.state, "INCOMPLETE");
assert.ok(wrongSymbolBinding.blockerCodes.includes("CONTINUITY_RECEIPT_SYMBOL_MISMATCH"));

const shiftedDates = [...receipt.expectedEligibleSymbolSessions];
shiftedDates[0] = "2026-07-30";
const shiftedReceipt = await rehashReceipt(receipt, { expectedEligibleSymbolSessions: shiftedDates });
const shiftedBinding = await bindNct01ContinuityReceiptToReplayV0_1({
  continuityReceipt: shiftedReceipt,
  replayWindow: replay,
  symbol,
  marketDate,
  decisionTimestamp,
});
assert.ok(shiftedBinding.blockerCodes.includes("ELIGIBLE_DATE_SET_MISMATCH"));

const driftReplay = await makeReplay({ mutateSourceRowAt: 10 });
const driftBinding = await bindNct01ContinuityReceiptToReplayV0_1({
  continuityReceipt: receipt,
  replayWindow: driftReplay,
  symbol,
  marketDate,
  decisionTimestamp,
});
assert.ok(driftBinding.blockerCodes.includes("SOURCE_HISTORY_HASH_MISMATCH"));
assert.ok(driftBinding.blockerCodes.includes("PIT_REPLAY_HASH_MISMATCH"));

const missingIdentity = await rehashReceipt(receipt, { rawHistoryAdmissionReceiptId: "" });
const missingIdentityBinding = await bindNct01ContinuityReceiptToReplayV0_1({
  continuityReceipt: missingIdentity,
  replayWindow: replay,
  symbol,
  marketDate,
  decisionTimestamp,
});
assert.ok(missingIdentityBinding.blockerCodes.includes("RAWHISTORYADMISSIONRECEIPTID_MISSING"));

const adjusted = await rehashReceipt(receipt, {
  disposition: "ADJUSTED_CONTINUITY_REQUIRED",
  technicalContinuityCertified: false,
  symbolSessionCompletenessCertified: false,
});
const adjustedBinding = await bindNct01ContinuityReceiptToReplayV0_1({
  continuityReceipt: adjusted,
  replayWindow: replay,
  symbol,
  marketDate,
  decisionTimestamp,
});
assert.ok(adjustedBinding.blockerCodes.includes("RAW_ADJUSTED_CONTINUITY_FORBIDDEN"));
assert.equal(adjustedBinding.continuityState, "UNVERIFIED");

const lateReceipt = await makeReceipt(replay, {
  receiptId: "NCT01-CONT-1101-LATE",
  sourceEvidenceRefs: sourceEvidenceRefs("2026-09-29T08:00:00Z"),
});
assert.equal(lateReceipt.disposition, "CONTINUITY_UNKNOWN");
assert.ok(lateReceipt.blockerCodes.includes("SOURCE_EVIDENCE_OBSERVED_AFTER_DECISION"));

// Availability-clock revision lineage must preserve a single internally
// consistent provenance tuple across pre/post revision clocks.
const revisionDate = "2026-09-29";
const revisionBase = {
  canonicalKey: ["TWSE", symbol, revisionDate, "RAW"].join("|"),
  marketDate: revisionDate,
  market: "TWSE",
  symbol,
  companyName: "台泥",
  priceSpace: "RAW",
  open: 100,
  high: 102,
  low: 99,
  close: 101,
  volumeShares: 1000000,
  tradeValue: 101000000,
  transactions: 1000,
  change: 1,
  continuityState: "UNVERIFIED",
  pitReplayEligible: true,
};
const revisionA = {
  ...revisionBase,
  sourceId: "TWSE_REVISION_A",
  sourceName: "fixture-A",
  sourceRowHash: await sha256Hex({ revision: "A", symbol, revisionDate }),
  observedAt: "2026-09-29T05:40:00Z",
  availableAt: "2026-09-29T05:30:00Z",
  capturedAt: "2026-09-29T05:40:00Z",
  pitAvailabilityClass: "PROSPECTIVE_OBSERVED",
};
revisionA.barHash = await sha256Hex(revisionA);
const revisionB = {
  ...revisionBase,
  close: 102,
  sourceId: "TWSE_REVISION_B",
  sourceName: "fixture-B",
  sourceRowHash: await sha256Hex({ revision: "B", symbol, revisionDate }),
  observedAt: "2026-09-29T06:40:00Z",
  availableAt: "2026-09-29T06:30:00Z",
  capturedAt: "2026-09-29T06:40:00Z",
  pitAvailabilityClass: "PROSPECTIVE_OBSERVED",
};
revisionB.barHash = await sha256Hex(revisionB);

const preRevisionReplay = await buildPitReplayWindow({
  replayId: "NCT01-REVISION-PRE",
  symbol,
  marketDate: revisionDate,
  decisionTimestamp: "2026-09-29T06:00:00Z",
  priceSpace: "RAW",
  lookbackSessions: 1,
  historicalBars: [revisionA, revisionB],
});
const postRevisionReplay = await buildPitReplayWindow({
  replayId: "NCT01-REVISION-POST",
  symbol,
  marketDate: revisionDate,
  decisionTimestamp: "2026-09-29T07:00:00Z",
  priceSpace: "RAW",
  lookbackSessions: 1,
  historicalBars: [revisionA, revisionB],
});
assert.deepEqual(
  {
    sourceId: preRevisionReplay.bars[0].sourceId,
    sourceRowHash: preRevisionReplay.bars[0].sourceRowHash,
    barHash: preRevisionReplay.bars[0].barHash,
    availableAt: preRevisionReplay.bars[0].availableAt,
  },
  {
    sourceId: revisionA.sourceId,
    sourceRowHash: revisionA.sourceRowHash,
    barHash: revisionA.barHash,
    availableAt: revisionA.availableAt,
  },
);
assert.deepEqual(
  {
    sourceId: postRevisionReplay.bars[0].sourceId,
    sourceRowHash: postRevisionReplay.bars[0].sourceRowHash,
    barHash: postRevisionReplay.bars[0].barHash,
    availableAt: postRevisionReplay.bars[0].availableAt,
  },
  {
    sourceId: revisionB.sourceId,
    sourceRowHash: revisionB.sourceRowHash,
    barHash: revisionB.barHash,
    availableAt: revisionB.availableAt,
  },
);
assert.notEqual(preRevisionReplay.bars[0].sourceId, postRevisionReplay.bars[0].sourceId);
assert.notEqual(preRevisionReplay.bars[0].sourceRowHash, postRevisionReplay.bars[0].sourceRowHash);
assert.notEqual(preRevisionReplay.bars[0].barHash, postRevisionReplay.bars[0].barHash);

const legacyLabelRows = await makeRows();
const legacyClearReplayForIdentity = await buildPitReplayWindow({
  replayId: "NCT01-LEGACY-LABEL-SANITIZED",
  symbol,
  marketDate,
  decisionTimestamp,
  priceSpace: "RAW",
  lookbackSessions: 61,
  historicalBars: legacyLabelRows.map((row) => ({ ...row, continuityState: "CLEAR_NO_ACTION" })),
  continuityMode: "UNVERIFIED_UNTIL_POST_REPLAY_CERTIFICATION",
});
const legacyAdjustedReplayForIdentity = await buildPitReplayWindow({
  replayId: "NCT01-LEGACY-LABEL-SANITIZED",
  symbol,
  marketDate,
  decisionTimestamp,
  priceSpace: "RAW",
  lookbackSessions: 61,
  historicalBars: legacyLabelRows.map((row) => ({ ...row, continuityState: "ADJUSTED_CONTINUITY" })),
  continuityMode: "UNVERIFIED_UNTIL_POST_REPLAY_CERTIFICATION",
});
assert.ok(legacyClearReplayForIdentity.bars.every((x) => x.continuityState === "UNVERIFIED"));
assert.ok(legacyAdjustedReplayForIdentity.bars.every((x) => x.continuityState === "UNVERIFIED"));
assert.equal(legacyClearReplayForIdentity.replayHash, legacyAdjustedReplayForIdentity.replayHash);
const legacyClearIdentity = await buildNct01ReplaySourceIdentityV0_1({
  replayWindow: legacyClearReplayForIdentity,
});
const legacyAdjustedIdentity = await buildNct01ReplaySourceIdentityV0_1({
  replayWindow: legacyAdjustedReplayForIdentity,
});
assert.equal(legacyClearIdentity.sourceHistoryHash, legacyAdjustedIdentity.sourceHistoryHash);

console.log("System2 NC-T01 replay continuity binding v0.1 tests passed");
