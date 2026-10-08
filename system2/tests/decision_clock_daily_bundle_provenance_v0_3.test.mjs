import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildDecisionClockDailyBundle } from "../scripts/build_decision_clock_daily_bundle.mjs";

const temp = await mkdtemp(join(tmpdir(), "s2-clock-bundle-v03-"));
try {
  const marketDate = "2026-09-29";
  const sourceArrivalPath = join(temp, "source.json");
  const dependencySeriesPath = join(temp, "deps.json");

  await writeFile(sourceArrivalPath, JSON.stringify({
    measurement: {
      measurementRunId: "SAL-1",
      marketDate,
      expectedTradingDay: true,
      dailyGateComplete: true,
      sourceSummaries: [
        {
          sourceId: "A1_TWSE_DAILY_CLOSE",
          readyObserved: true,
          firstReadyAt: "2026-09-29T05:40:00Z",
          lastObservedNotReadyAt: "2026-09-29T05:35:00Z",
          latencyUpperBoundMinutes: 10,
          latencyLowerBoundMinutes: 5,
          observationIntervalMinutes: 5,
        },
        {
          sourceId: "A1_TPEX_DAILY_CLOSE",
          readyObserved: true,
          firstReadyAt: "2026-09-29T05:45:00Z",
          lastObservedNotReadyAt: "2026-09-29T05:40:00Z",
          latencyUpperBoundMinutes: 15,
          latencyLowerBoundMinutes: 10,
          observationIntervalMinutes: 5,
        },
      ],
    },
  }), "utf8");

  await writeFile(dependencySeriesPath, JSON.stringify({
    marketDate,
    expectedTradingDay: true,
    dependencyCoverage: {
      A5_QUARTERLY_FINANCIALS: true,
      B2_INDUSTRY_THESIS_PROSPECTIVE: true,
    },
    dependencySummaries: [
      {
        dependency: "A5_QUARTERLY_FINANCIALS",
        readyObserved: true,
        firstReadyAt: "2026-09-29T05:30:00Z",
        lastObservedNotReadyAt: null,
        observationIntervalMinutes: null,
      },
      {
        dependency: "B2_INDUSTRY_THESIS_PROSPECTIVE",
        readyObserved: true,
        firstReadyAt: "2026-09-29T05:45:00Z",
        lastObservedNotReadyAt: "2026-09-29T05:40:00Z",
        observationIntervalMinutes: 5,
      },
    ],
  }), "utf8");

  const workflowSha = "1234567890abcdef1234567890abcdef12345678";
  const bundle = await buildDecisionClockDailyBundle({
    sourceArrivalPath,
    dependencySeriesPath,
    createdAt: "2026-09-29T05:46:00Z",
    repository: "owner/repo",
    workflowRunId: "999",
    workflowRunAttempt: 1,
    workflowSha,
    workflowRef: "owner/repo/.github/workflows/system2-prospective-clock-evidence-readonly.yml@refs/heads/main",
    rootDir: process.cwd(),
  });

  assert.equal(bundle.bundleVersion, "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3");
  assert.equal(bundle.collectorProvenance.provenanceVersion, "S2_DECISION_CLOCK_COLLECTOR_PROVENANCE_V0_3");
  assert.equal(bundle.collectorProvenance.collectorContractVersion,
    "S2_DECISION_CLOCK_COLLECTOR_CONTRACT_V0_4");
  assert.equal(bundle.collectorProvenance.evidenceEpoch,
    "S2_CLOCK_A1_STAGE1_EXACT_DATE_ALIGNMENT_EPOCH_V0_4");
  assert.equal(bundle.collectorProvenance.collectorContractFiles.length,15);
  assert.ok(bundle.collectorProvenance.collectorContractFiles.some(
    x=>x.path==="system2/runtime/daily_shadow_a1_source_v0_1.mjs"));
  assert.ok(bundle.collectorProvenance.collectorContractFiles.some(
    x=>x.path==="system2/runtime/official_historical_a1_source_v0_1.mjs"));

  assert.equal(bundle.collectorProvenance.workflowRunId, "999");
  assert.equal(bundle.collectorProvenance.workflowRunAttempt, 1);
  assert.equal(bundle.collectorProvenance.workflowSha, workflowSha);
  assert.match(bundle.collectorProvenance.collectorContractFingerprint, /^[0-9a-f]{64}$/);
  assert.ok(bundle.collectorProvenance.collectorContractFiles.length >= 10);
  assert.equal(bundle.evidence.evidenceSemanticsVersion, "S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1");
  assert.equal(bundle.evidence.a5AvailableByCandidate, true);
  assert.equal(bundle.evidence.candidateTimestamp, "2026-09-29T06:00:00.000Z");
  assert.equal(bundle.evidence.requiredReady, true);
  assert.equal(bundle.evidence.precisionEligible, true);
} finally {
  await rm(temp, { recursive: true, force: true });
}

console.log("System2 daily bundle collector provenance V0.3 tests passed");
