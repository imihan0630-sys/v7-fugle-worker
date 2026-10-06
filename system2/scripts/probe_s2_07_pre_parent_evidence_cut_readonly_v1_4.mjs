import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildOfficialReferenceAvailabilityObservationV1_3 } from "../runtime/s2_07_official_reference_availability_observer_v1_3.mjs";
import {
  buildPreParentEvidenceCutManifestV1_4,
  reconcileNoRevisionGapThroughCutV1_4,
} from "../runtime/s2_07_pre_parent_evidence_cut_v1_4.mjs";

const receipt = JSON.parse(await readFile(
  new URL("../evidence/S2_07_OFFICIAL_REFERENCE_AVAILABILITY_OBSERVER_V1_3_PHYSICAL_20261007.json", import.meta.url),
  "utf8",
));
assert.equal(receipt.status, "PASS_PROSPECTIVE_SAMPLE");
assert.equal(receipt.exactReference.symbol, "4806");

const observation = await buildOfficialReferenceAvailabilityObservationV1_3({
  event: {
    exchange: receipt.exactReference.exchange,
    symbol: receipt.exactReference.symbol,
    actionFamilyId: receipt.exactReference.actionFamilyId,
    effectiveDate: receipt.exactReference.effectiveDate,
    semanticHash: receipt.exactReference.stableSemanticHash,
    sourceRowHash: receipt.exactReference.stableSourceRowHash,
  },
  observedAt: receipt.prospectiveObservation.observedAt,
  observationMode: "PROSPECTIVE_POLL",
  sourceId: "TPEX_CAPITAL_REDUCTION_REFERENCE",
  payloadHash: receipt.exactReference.stableSourceRowHash,
  sourceFetchId: "V1.3_PHYSICAL_RECEIPT_REPLAY",
});
assert.equal(observation.evidenceClass, "PROSPECTIVE_EXACT_VERSION_OBSERVER");
assert.equal(observation.publicAvailabilityObserved, true);

const cut = await buildPreParentEvidenceCutManifestV1_4({
  scanDate: "2026-10-07",
  evidenceCutoffAt: receipt.prospectiveObservation.observedAt,
  scopeClass: "SELECTED_ONLY_SAMPLE",
  requiredMarkets: ["TWSE", "TPEX"],
  coveredMarkets: ["TPEX"],
  expectedVersionKeys: [observation.stableReferenceKey],
  expectedKeysetComplete: false,
  observations: [observation],
  requiredLanes: [{
    laneId: "V1_3_SINGLE_REFERENCE_SAMPLE",
    state: "READY",
    payloadHash: receipt.exactReference.stableSourceRowHash,
    queryComplete: true,
    queryTruncated: false,
  }],
  selectedOnly: true,
});

assert.equal(cut.preCutManifestReady, false);
assert.equal(cut.noRevisionGapThroughCut, false);
assert.equal(cut.selectedOnlyCaptureAuthorized, false);
for (const reason of [
  "EVIDENCE_CUT_SCOPE_INVALID",
  "SELECTED_ONLY_CAPTURE_FORBIDDEN",
  "MARKET_SCOPE_COVERAGE_MISMATCH",
  "EXPECTED_VERSION_KEYSET_NOT_CERTIFIED_COMPLETE",
]) {
  assert.ok(cut.blockers.includes(reason), reason);
}

const reconciliation = await reconcileNoRevisionGapThroughCutV1_4({
  preCutManifest: cut,
  postReconciliation: {
    reconciledAt: "2026-10-07T07:00:00Z",
    boundedPopulationComplete: false,
    populationIdentityStable: false,
    queryTruncated: false,
    versions: [],
  },
});
assert.equal(reconciliation.noRevisionGapThroughCut, false);
assert.ok(reconciliation.blockers.includes("PRE_CUT_MANIFEST_NOT_READY"));
assert.equal(reconciliation.technicalContinuityCertified, false);
assert.equal(reconciliation.selectionAuthority, false);
assert.equal(reconciliation.system1RuntimeUsed, false);

console.log(JSON.stringify({
  result: "S2_07_PRE_PARENT_EVIDENCE_CUT_V1_4_PHYSICAL_DIAGNOSTIC",
  v13Observation: {
    stableReferenceKey: observation.stableReferenceKey,
    availableAt: observation.availableAt,
    evidenceClass: observation.evidenceClass,
  },
  cut: {
    state: cut.state,
    blockers: cut.blockers,
    evidenceCutId: cut.evidenceCutId,
    sourceCutManifestHash: cut.sourceCutManifestHash,
    preCutManifestReady: cut.preCutManifestReady,
    noRevisionGapThroughCut: cut.noRevisionGapThroughCut,
  },
  reconciliation: {
    state: reconciliation.state,
    blockers: reconciliation.blockers,
    noRevisionGapThroughCut: reconciliation.noRevisionGapThroughCut,
  },
  authority: {
    technicalContinuityCertified: reconciliation.technicalContinuityCertified,
    selectionAuthority: reconciliation.selectionAuthority,
    finalSelectionEnabled: reconciliation.finalSelectionEnabled,
    livePushEnabled: reconciliation.livePushEnabled,
    capitalImpact: reconciliation.capitalImpact,
    orderImpact: reconciliation.orderImpact,
    system1RuntimeUsed: reconciliation.system1RuntimeUsed,
  },
}, null, 2));
