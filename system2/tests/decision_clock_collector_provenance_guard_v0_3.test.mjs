import assert from "node:assert/strict";
import { aggregateDecisionClockEvidence } from "../runtime/decision_clock_evidence_aggregation.mjs";

const shaA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const shaB = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

function candidate({
  runId = "200",
  provenanceRunId = runId,
  runHeadSha = shaA,
  workflowSha = runHeadSha,
} = {}) {
  return {
    runId,
    runAttempt: 1,
    runHeadSha,
    eventName: "schedule",
    runCreatedAt: "2026-09-29T05:25:00Z",
    bundle: {
      bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3",
      marketDate: "2026-09-29",
      collectorProvenance: {
        provenanceVersion: "S2_DECISION_CLOCK_COLLECTOR_PROVENANCE_V0_3",
        workflowRunId: provenanceRunId,
        workflowRunAttempt: 1,
        workflowSha,
        collectorContractFingerprint: "collector-fp-A",
      },
      evidence: {
        evidenceId: "E-1",
        evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
        evidenceSemanticsVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1",
        marketDate: "2026-09-29",
        sameSessionClockReady: true,
        a5ObservedAtDecisionBoundary: "2026-09-29T05:30:00Z",
        a5AvailableByCandidate: true,
        candidateTimestamp: "2026-09-29T06:00:00Z",
        requiredReady: true,
        precisionEligible: true,
        worstObservedRequiredUpperBoundMinutes: 15,
      },
    },
  };
}

assert.throws(
  () => aggregateDecisionClockEvidence({
    candidates: [candidate({ provenanceRunId: "999" })],
    scheduledRunCoverage: [],
  }),
  /workflowRunId provenance mismatch/,
);

assert.throws(
  () => aggregateDecisionClockEvidence({
    candidates: [candidate({ runHeadSha: shaA, workflowSha: shaB })],
    scheduledRunCoverage: [],
  }),
  /workflowSha provenance mismatch/,
);

assert.throws(
  () => aggregateDecisionClockEvidence({
    candidates: [{
      ...candidate(),
      bundle: {
        ...candidate().bundle,
        bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_2",
        collectorProvenance: undefined,
      },
    }],
    scheduledRunCoverage: [],
  }),
  /must be V0.3 for scheduled evidence/,
);

console.log("System2 Decision Clock collector provenance guard V0.3 tests passed");
