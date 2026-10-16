import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validatePitSourceHandoffV0_1 } from "../migration/issue1068_pit_source_handoff_gate_v0_1.mjs";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const real = Object.freeze({
  handoff: read("system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json"),
  a1: read("system2/migration/evidence/S2_DATA_ISSUE1068_NATIVE_122_A1_PERBAR_PIT_PHYSICAL_20261016_V0_1.json"),
  cfi: read("system2/evidence/S2_M09_REAL_30_NATIVE_CFI_INDEPENDENT_AUDIT_20261015_V0_1.json"),
  ca: read("system2/evidence/S2_M09_20261014_REAL_SIX_CA_NEGATIVE_EXPOSURE_20261015_V0_1.json"),
});

test("real DATA PIT_SOURCE_HANDOFF is valid but all 1935 windows remain UNKNOWN", async () => {
  const result = await validatePitSourceHandoffV0_1(real);
  assert.equal(result.state, "DATA_HANDOFF_VALID__ALL_1935_REMAIN_PIT_UNKNOWN_FOR_ORIGINAL_DECISION");
  assert.equal(result.sourceSecurityWindowCount, 1935);
  assert.equal(result.pitEligibleSymbolCount, 0);
  assert.equal(result.unresolvedSymbolCount, 1935);
  assert.equal(result.formalSelectedCount, null);
  assert.equal(result.zeroPickDay, null);
  assert.equal(result.selectionAuthorized, false);
  assert.equal(result.frozenD1Written, false);
  assert.equal(result.cloudflareD1Writes, 0);
  assert.match(result.receiptHash, /^[0-9a-f]{64}$/);
});

const tamper = [
  ["backdate source-only audit to original decision", (x) => { x.handoff.originalDecisionCutAtUtc = x.handoff.actualSourceOnlyEvaluationAtUtc; }],
  ["remove one official trading date", (x) => { x.handoff.officialTradingDates.pop(); }],
  ["move window start", (x) => { x.handoff.windowStartDate = "2026-07-17"; }],
  ["substitute A1 original artifact", (x) => { x.handoff.a1OriginalEvidence.perPairReconciliationArtifactId = 1; }],
  ["substitute A1 ZIP digest", (x) => { x.handoff.a1OriginalEvidence.artifactZipSha256 = "f".repeat(64); }],
  ["claim historical first-known", (x) => { x.handoff.a1OriginalEvidence.historicalMarketDateFirstKnownAtCertified = 122; }],
  ["promote current CFI into historical period", (x) => { x.handoff.cfiOriginalEvidence.historicalSixtyOneSessionOrdinaryShareCertified = true; }],
  ["promote CA silence into NO_EVENT", (x) => { x.handoff.corporateActionOriginalEvidence.priorPreviewUnknownNotNoEventSymbols = 0; }],
  ["claim CA revision completeness", (x) => { x.handoff.corporateActionOriginalEvidence.historicalCorrectionCancellationSuspensionAndNoEventComplete = true; }],
  ["backdate MOPS retrospective GET", (x) => { x.handoff.otherHistoricalClockState.mopsExactHistoricalFirstKnownAtAvailableAtAccepted = 9; }],
  ["invent one eligible symbol", (x) => { x.handoff.handoffScope.pitEligibleSymbolCount = 1; }],
  ["turn unknown denominator into zero pick", (x) => { x.handoff.handoffScope.zeroPickDay = true; }],
  ["authorize selection", (x) => { x.handoff.handoffScope.selectionAuthorized = true; }],
  ["claim Frozen write", (x) => { x.handoff.handoffScope.frozenD1Written = true; }],
  ["claim migration complete", (x) => { x.handoff.migrationAndAccountState.destinationA1RowsRemaining = 0; }],
  ["claim R2 entitlement", (x) => { x.handoff.migrationAndAccountState.targetR2Entitlement = "ENTITLED"; }],
  ["claim atomic ledger", (x) => { x.handoff.migrationAndAccountState.atomicCrossWorkflowLedgerPhysicallyVerified = true; }],
  ["claim D1 write", (x) => { x.handoff.safety.cloudflareD1WritesForThisHandoff = 1; }],
  ["replace owner", (x) => { x.handoff.buildConsumerOwner = "SYSTEM2_DATA_LANE"; }],
  ["pretend DATA edited BUILD consumer", (x) => { x.handoff.buildConsumerRisk.dataLaneModifiedBuildConsumer = true; }],
  ["pretend runtime ownership transferred", (x) => { x.handoff.buildConsumerRisk.ownershipTransferGranted = true; }],
  ["replace pinned main", (x) => { x.handoff.basedOnMainCommit = "f".repeat(40); }],
  ["forge handoff hash", (x) => { x.handoff.receiptHash = "f".repeat(64); }],
];

for (const [name, mutate] of tamper) {
  test("handoff fail-closed: " + name, async () => {
    const copy = structuredClone(real);
    mutate(copy);
    await assert.rejects(validatePitSourceHandoffV0_1(copy), /S2_PIT_SOURCE_HANDOFF_/);
  });
}
