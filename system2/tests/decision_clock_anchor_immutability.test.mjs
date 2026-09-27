import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { aggregateFromGithubArtifacts } from "../scripts/aggregate_decision_clock_artifacts_readonly.mjs";

const temp = await mkdtemp(join(tmpdir(), "s2-clock-anchor-"));
try {
  const date = "2026-09-29";
  const jsonPath = join(temp, "bundle.json");
  const zipPath = join(temp, "bundle.zip");
  await writeFile(jsonPath, JSON.stringify({
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3",
    marketDate: date,
    collectorProvenance: {
      provenanceVersion: "S2_DECISION_CLOCK_COLLECTOR_PROVENANCE_V0_3",
      workflowRunId: "101",
      workflowRunAttempt: 1,
      workflowSha: "cccccccccccccccccccccccccccccccccccccccc",
      collectorContractFingerprint: "collector-fp-A",
    },
    evidence: {
      evidenceId: "E-" + date,
      evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
      evidenceSemanticsVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1",
      marketDate: date,
      sameSessionClockReady: true,
      a5ObservedAtDecisionBoundary: "2026-09-29T05:30:00Z",
      a5AvailableByCandidate: true,
      candidateTimestamp: "2026-09-29T06:00:00Z",
      requiredReady: true,
      precisionEligible: true,
      worstObservedRequiredUpperBoundMinutes: 10,
    },
  }));
  execFileSync("zip", ["-j", "-q", zipPath, jsonPath]);
  const zip = await readFile(zipPath);

  let baseUrl = "";
  const server = createServer((req, res) => {
    const url = new URL(req.url, baseUrl);
    res.setHeader("content-type", "application/json");

    if (url.pathname.includes("/actions/workflows/") && url.pathname.endsWith("/runs")) {
      res.end(JSON.stringify({ workflow_runs: [
        { id: 100, event: "schedule", created_at: "2026-09-29T05:25:00Z", run_attempt: 1, head_sha: "cccccccccccccccccccccccccccccccccccccccc", conclusion: "failure" },
        { id: 101, event: "schedule", created_at: "2026-09-29T05:30:00Z", run_attempt: 1, head_sha: "cccccccccccccccccccccccccccccccccccccccc", conclusion: "success" },
      ] }));
      return;
    }
    if (url.pathname.endsWith("/actions/runs/100/artifacts")) {
      res.end(JSON.stringify({ artifacts: [] }));
      return;
    }
    if (url.pathname.endsWith("/actions/runs/101/artifacts")) {
      res.end(JSON.stringify({ artifacts: [{
        id: 901,
        name: "system2-decision-clock-daily-2026-09-29-101",
        expired: false,
        archive_download_url: baseUrl + "/artifact/901",
      }] }));
      return;
    }
    if (url.pathname === "/artifact/901") {
      res.statusCode = 200;
      res.setHeader("content-type", "application/zip");
      res.end(zip);
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found" }));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = "http://127.0.0.1:" + server.address().port;
  try {
    const report = await aggregateFromGithubArtifacts({
      repo: "owner/repo",
      token: "fixture-token",
      apiBase: baseUrl,
      coverageStartDate: date,
      coverageThroughDate: date,
      probeTradingDate: async ({ marketDate }) => ({
        marketDate,
        state: "READY",
        expectedTradingDay: true,
      }),
    });

    const row = report.coverageIntegrity.rows[0];
    assert.equal(row.runId, "100");
    assert.equal(row.failureClass, "SCHEDULED_RUN_NOT_SUCCESS");
    assert.equal(row.promotionCoverageEligible, false);
    assert.deepEqual(report.coverageIntegrity.tradingDayGapDates, [date]);
    assert.equal(report.aggregation.promotionCoverageComplete, false);
    assert.equal(report.aggregation.collectorContractConsistent, true);
    assert.equal(report.reviewPacket.reviewState, "BLOCKED");
    assert.deepEqual(report.reviewPacket.tradingDayGapDates, [date]);
    assert.equal(report.reviewPacket.coverageFailureClassCounts.SCHEDULED_RUN_NOT_SUCCESS, 1);
    assert.equal(report.coverageIntegrity.laterScheduledRunsCannotRepairAnchor, true);
    assert.equal(report.reviewPacket.exactDecisionClockAuthorized, false);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}

console.log("System2 Decision Clock immutable anchor test passed");
