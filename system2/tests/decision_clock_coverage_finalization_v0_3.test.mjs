import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import {
  aggregateFromGithubArtifacts,
  previousTaipeiCalendarDate,
} from "../scripts/aggregate_decision_clock_artifacts_readonly.mjs";

assert.equal(
  previousTaipeiCalendarDate("2026-09-30T00:15:00Z"),
  "2026-09-29",
);
assert.equal(
  previousTaipeiCalendarDate("2026-09-29T16:15:00Z"),
  "2026-09-29",
);

const temp = await mkdtemp(join(tmpdir(), "s2-clock-finalization-"));
try {
  const marketDate = "2026-09-29";
  const jsonPath = join(temp, "bundle.json");
  const zipPath = join(temp, "bundle.zip");
  const sha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

  await writeFile(jsonPath, JSON.stringify({
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3",
    marketDate,
    collectorProvenance: {
      provenanceVersion: "S2_DECISION_CLOCK_COLLECTOR_PROVENANCE_V0_3",
      workflowRunId: "700",
      workflowRunAttempt: 1,
      workflowSha: sha,
      collectorContractFingerprint: "collector-fp-A",
    },
    evidence: {
      evidenceId: "E-" + marketDate,
      evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
      evidenceSemanticsVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1",
      marketDate,
      sameSessionClockReady: true,
      a5ObservedAtDecisionBoundary: "2026-09-29T05:30:00Z",
      a5AvailableByCandidate: true,
      candidateTimestamp: "2026-09-29T06:00:00Z",
      requiredReady: true,
      precisionEligible: true,
      worstObservedRequiredUpperBoundMinutes: 15,
    },
  }), "utf8");
  execFileSync("zip", ["-j", "-q", zipPath, jsonPath]);
  const zip = await readFile(zipPath);

  let artifactDownloadCount = 0;
  let baseUrl = "";
  const server = createServer((req, res) => {
    const url = new URL(req.url, baseUrl);
    res.setHeader("content-type", "application/json");

    if (url.pathname.includes("/actions/workflows/") && url.pathname.endsWith("/runs")) {
      res.end(JSON.stringify({
        workflow_runs: [{
          id: 700,
          event: "schedule",
          created_at: "2026-09-29T05:25:00Z",
          run_attempt: 1,
          head_sha: sha,
          conclusion: "success",
        }],
      }));
      return;
    }
    if (url.pathname.endsWith("/actions/runs/700/artifacts")) {
      res.end(JSON.stringify({
        artifacts: [{
          id: 970,
          name: "system2-decision-clock-daily-2026-09-29-700",
          expired: false,
          archive_download_url: baseUrl + "/artifact/970",
        }],
      }));
      return;
    }
    if (url.pathname === "/artifact/970") {
      artifactDownloadCount += 1;
      res.statusCode = 200;
      res.setHeader("content-type", "application/zip");
      res.end(zip);
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found", path: url.pathname }));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = "http://127.0.0.1:" + server.address().port;

  try {
    const pending = await aggregateFromGithubArtifacts({
      repo: "owner/repo",
      token: "fixture-token",
      apiBase: baseUrl,
      coverageStartDate: "2026-09-29",
      coverageThroughDate: "2026-09-28",
      probeTradingDate: async ({ marketDate: date }) => ({
        marketDate: date,
        state: "READY",
        expectedTradingDay: true,
      }),
    });

    assert.equal(artifactDownloadCount, 0);
    assert.equal(pending.aggregation.promotionGradeDateCount, 0);
    assert.equal(pending.coverageIntegrity.rows.length, 0);
    assert.equal(pending.coverageFinalization.lagCalendarDays, 1);
    assert.equal(pending.coverageFinalization.coverageThroughDate, "2026-09-28");
    assert.equal(pending.coverageFinalization.pendingUnfinalizedRuns.length, 1);
    assert.equal(pending.coverageFinalization.pendingUnfinalizedArtifacts.length, 1);
    assert.equal(pending.coverageFinalization.pendingUnfinalizedRuns[0].anchorMarketDate, marketDate);
    assert.equal(pending.coverageFinalization.currentOrFutureDatesCannotCreateFinalizedGaps, true);
    assert.equal(pending.coverageFinalization.currentOrFutureArtifactsCannotEnterReadiness, true);

    const finalized = await aggregateFromGithubArtifacts({
      repo: "owner/repo",
      token: "fixture-token",
      apiBase: baseUrl,
      coverageStartDate: "2026-09-29",
      coverageThroughDate: "2026-09-29",
      probeTradingDate: async ({ marketDate: date }) => ({
        marketDate: date,
        state: "READY",
        expectedTradingDay: true,
      }),
    });

    assert.equal(artifactDownloadCount, 1);
    assert.equal(finalized.aggregation.promotionGradeDateCount, 1);
    assert.equal(finalized.coverageIntegrity.rows.length, 1);
    assert.equal(finalized.coverageIntegrity.rows[0].marketDate, marketDate);
    assert.equal(finalized.coverageFinalization.pendingUnfinalizedRuns.length, 0);
    assert.equal(finalized.coverageFinalization.pendingUnfinalizedArtifacts.length, 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}

console.log("System2 Decision Clock coverage finalization V0.3 tests passed");
