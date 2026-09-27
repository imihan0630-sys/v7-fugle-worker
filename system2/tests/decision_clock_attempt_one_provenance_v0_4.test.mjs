import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { aggregateFromGithubArtifacts } from "../scripts/aggregate_decision_clock_artifacts_readonly.mjs";

const sha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

function bundle({ marketDate, runId, attempt, upper = 15 }) {
  return {
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3",
    marketDate,
    collectorProvenance: {
      provenanceVersion: "S2_DECISION_CLOCK_COLLECTOR_PROVENANCE_V0_3",
      workflowRunId: String(runId),
      workflowRunAttempt: attempt,
      workflowSha: sha,
      collectorContractFingerprint: "collector-fp-A",
    },
    evidence: {
      evidenceId: `E-${marketDate}-A${attempt}`,
      evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
      evidenceSemanticsVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1",
      marketDate,
      sameSessionClockReady: true,
      a5ObservedAtDecisionBoundary: marketDate + "T05:30:00Z",
      a5AvailableByCandidate: true,
      candidateTimestamp: marketDate + "T06:00:00Z",
      requiredReady: true,
      precisionEligible: true,
      worstObservedRequiredUpperBoundMinutes: upper,
    },
  };
}

const temp = await mkdtemp(join(tmpdir(), "s2-attempt-one-"));
try {
  async function zip(name, value) {
    const jsonPath = join(temp, name + ".json");
    const zipPath = join(temp, name + ".zip");
    await writeFile(jsonPath, JSON.stringify(value), "utf8");
    execFileSync("zip", ["-j", "-q", zipPath, jsonPath]);
    return readFile(zipPath);
  }

  const zip500a1 = await zip("500-a1", bundle({
    marketDate: "2026-09-29",
    runId: 500,
    attempt: 1,
    upper: 15,
  }));
  const zip500a2 = await zip("500-a2", bundle({
    marketDate: "2026-09-29",
    runId: 500,
    attempt: 2,
    upper: 1,
  }));
  const zip600a2 = await zip("600-a2", bundle({
    marketDate: "2026-09-30",
    runId: 600,
    attempt: 2,
    upper: 1,
  }));

  let baseUrl = "";
  const server = createServer((req, res) => {
    const url = new URL(req.url, baseUrl);
    res.setHeader("content-type", "application/json");

    if (url.pathname.includes("/actions/workflows/") && url.pathname.endsWith("/runs")) {
      res.end(JSON.stringify({
        workflow_runs: [
          {
            id: 500,
            event: "schedule",
            created_at: "2026-09-29T05:25:00Z",
            run_attempt: 2,
            head_sha: sha,
            conclusion: "success",
          },
          {
            id: 600,
            event: "schedule",
            created_at: "2026-09-30T05:25:00Z",
            run_attempt: 2,
            head_sha: sha,
            conclusion: "success",
          },
        ],
      }));
      return;
    }

    if (url.pathname.endsWith("/actions/runs/500/attempts/1")) {
      res.end(JSON.stringify({
        id: 500,
        event: "schedule",
        created_at: "2026-09-29T05:25:00Z",
        run_attempt: 1,
        head_sha: sha,
        conclusion: "success",
      }));
      return;
    }
    if (url.pathname.endsWith("/actions/runs/600/attempts/1")) {
      res.end(JSON.stringify({
        id: 600,
        event: "schedule",
        created_at: "2026-09-30T05:25:00Z",
        run_attempt: 1,
        head_sha: sha,
        conclusion: "failure",
      }));
      return;
    }

    if (url.pathname.endsWith("/actions/runs/500/artifacts")) {
      res.end(JSON.stringify({ artifacts: [
        {
          id: 950,
          name: "system2-decision-clock-daily-2026-09-29-500-a1",
          expired: false,
          archive_download_url: baseUrl + "/artifact/950",
        },
        {
          id: 951,
          name: "system2-decision-clock-daily-2026-09-29-500-a2",
          expired: false,
          archive_download_url: baseUrl + "/artifact/951",
        },
      ] }));
      return;
    }
    if (url.pathname.endsWith("/actions/runs/600/artifacts")) {
      res.end(JSON.stringify({ artifacts: [
        {
          id: 960,
          name: "system2-decision-clock-daily-2026-09-30-600-a2",
          expired: false,
          archive_download_url: baseUrl + "/artifact/960",
        },
      ] }));
      return;
    }

    if (url.pathname === "/artifact/950") {
      res.statusCode = 200;
      res.setHeader("content-type", "application/zip");
      res.end(zip500a1);
      return;
    }
    if (url.pathname === "/artifact/951") {
      res.statusCode = 200;
      res.setHeader("content-type", "application/zip");
      res.end(zip500a2);
      return;
    }
    if (url.pathname === "/artifact/960") {
      res.statusCode = 200;
      res.setHeader("content-type", "application/zip");
      res.end(zip600a2);
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found", path: url.pathname }));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = "http://127.0.0.1:" + server.address().port;
  try {
    const report = await aggregateFromGithubArtifacts({
      repo: "owner/repo",
      token: "fixture-token",
      apiBase: baseUrl,
      coverageStartDate: "2026-09-29",
      coverageThroughDate: "2026-09-30",
      probeTradingDate: async ({ marketDate }) => ({
        marketDate,
        state: "READY",
        expectedTradingDay: true,
      }),
    });

    assert.equal(report.aggregation.scheduledArtifactCount, 3);
    assert.equal(report.aggregation.promotionEligibleScheduledArtifactCount, 1);
    assert.equal(report.aggregation.rerunDiagnosticArtifactCount, 2);
    assert.equal(report.aggregation.promotionGradeDateCount, 1);
    assert.deepEqual(report.aggregation.promotionGradeMarketDates, ["2026-09-29"]);
    assert.equal(report.aggregation.selectedArtifacts[0].runId, "500");
    assert.equal(report.aggregation.selectedArtifacts[0].runAttempt, 1);
    assert.equal(report.aggregation.selectedArtifacts[0].candidateTaipeiTime, undefined);
    assert.equal(report.aggregation.rerunDiagnosticArtifacts[0].reason, "RERUN_ATTEMPT_DIAGNOSTIC_ONLY");

    const day29 = report.coverageIntegrity.rows.find((x) => x.marketDate === "2026-09-29");
    assert.equal(day29.runId, "500");
    assert.equal(day29.runAttempt, 1);
    assert.equal(day29.runConclusion, "success");
    assert.equal(day29.dailyArtifactCount, 1);
    assert.equal(day29.promotionCoverageEligible, true);

    const day30 = report.coverageIntegrity.rows.find((x) => x.marketDate === "2026-09-30");
    assert.equal(day30.runId, "600");
    assert.equal(day30.runAttempt, 1);
    assert.equal(day30.runConclusion, "failure");
    assert.equal(day30.dailyArtifactCount, 0);
    assert.equal(day30.failureClass, "SCHEDULED_RUN_NOT_SUCCESS");
    assert.equal(day30.promotionCoverageEligible, false);

    assert.deepEqual(report.coverageIntegrity.tradingDayGapDates, ["2026-09-30"]);
    assert.equal(report.aggregation.promotionCoverageComplete, false);
    assert.equal(report.reviewPacket.reviewState, "BLOCKED");
    assert.equal(report.coverageIntegrity.laterRerunAttemptsCannotRepairOrInvalidateAttemptOne, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}

console.log("System2 Decision Clock attempt-one provenance V0.4 tests passed");
