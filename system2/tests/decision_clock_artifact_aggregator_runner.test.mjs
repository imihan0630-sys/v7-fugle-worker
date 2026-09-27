import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { aggregateFromGithubArtifacts } from "../scripts/aggregate_decision_clock_artifacts_readonly.mjs";

function makeBundle(marketDate, upper) {
  return {
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_2",
    marketDate,
    evidence: {
      evidenceId: "E-" + marketDate,
      evidenceVersion: "S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2",
      marketDate,
      requiredReady: true,
      precisionEligible: true,
      worstObservedRequiredUpperBoundMinutes: upper,
    },
  };
}

const temp = await mkdtemp(join(tmpdir(), "system2-clock-runner-test-"));
try {
  async function zipBundle(name, bundle) {
    const jsonPath = join(temp, name + ".json");
    const zipPath = join(temp, name + ".zip");
    await writeFile(jsonPath, JSON.stringify(bundle), "utf8");
    execFileSync("zip", ["-j", "-q", zipPath, jsonPath]);
    return await readFile(zipPath);
  }

  const zipScheduled = await zipBundle("scheduled", makeBundle("2026-09-29", 20));
  const zipManual = await zipBundle("manual", makeBundle("2026-09-29", 1));

  let baseUrl = "";
  const server = createServer((req, res) => {
    const url = new URL(req.url, baseUrl);
    res.setHeader("content-type", "application/json");

    if (url.pathname.includes("/actions/workflows/") && url.pathname.endsWith("/runs")) {
      res.end(JSON.stringify({
        workflow_runs: [
          {
            id: 200,
            event: "schedule",
            created_at: "2026-09-29T05:25:00Z",
            run_attempt: 1,
            conclusion: "success",
          },
          {
            id: 201,
            event: "workflow_dispatch",
            created_at: "2026-09-29T05:20:00Z",
            run_attempt: 1,
            conclusion: "success",
          },
        ],
      }));
      return;
    }

    if (url.pathname.endsWith("/actions/runs/200/artifacts")) {
      res.end(JSON.stringify({
        artifacts: [{
          id: 900,
          name: "system2-decision-clock-daily-2026-09-29-200",
          expired: false,
          archive_download_url: baseUrl + "/artifact/900",
        }],
      }));
      return;
    }

    if (url.pathname.endsWith("/actions/runs/201/artifacts")) {
      res.end(JSON.stringify({
        artifacts: [{
          id: 901,
          name: "system2-decision-clock-daily-2026-09-29-201",
          expired: false,
          archive_download_url: baseUrl + "/artifact/901",
        }],
      }));
      return;
    }

    if (url.pathname === "/artifact/900") {
      res.statusCode = 200;
      res.setHeader("content-type", "application/zip");
      res.end(zipScheduled);
      return;
    }
    if (url.pathname === "/artifact/901") {
      res.statusCode = 200;
      res.setHeader("content-type", "application/zip");
      res.end(zipManual);
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found", path: url.pathname }));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  baseUrl = "http://127.0.0.1:" + address.port;

  try {
    const outputPath = join(temp, "report.json");
    const report = await aggregateFromGithubArtifacts({
      repo: "owner/repo",
      token: "fixture-token",
      apiBase: baseUrl,
      outputPath,
      probeTradingDate: async ({ marketDate }) => ({
        marketDate,
        state: "READY",
        expectedTradingDay: true,
      }),
    });

    assert.equal(report.aggregation.promotionGradeDateCount, 1);
    assert.equal(report.aggregation.selectedArtifacts[0].runId, "200");
    assert.equal(report.aggregation.manualDiagnosticArtifactCount, 1);
    assert.equal(report.aggregation.promotionCoverageComplete, true);
    assert.equal(report.aggregation.tradingDayArtifactGaps.length, 0);
    assert.equal(report.aggregation.readiness.independentTradingDates, 1);
    assert.equal(report.aggregation.exactDecisionClockAuthorized, false);
    assert.equal(report.reviewPacket.reviewState, "ACCUMULATING");
    assert.equal(report.reviewPacket.exactDecisionClockAuthorized, false);
    assert.equal(report.safety.system2D1Written, false);
    assert.equal(report.safety.system2WorkerCronMutated, false);

    const persisted = JSON.parse(await readFile(outputPath, "utf8"));
    assert.equal(persisted.reportVersion, "S2_DECISION_CLOCK_ARTIFACT_REPORT_V0_1");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}

console.log("System2 decision-clock artifact aggregator runner tests passed");
