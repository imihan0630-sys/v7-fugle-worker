import assert from "node:assert/strict";
import { createServer } from "node:http";
import { aggregateFromGithubArtifacts } from "../scripts/aggregate_decision_clock_artifacts_readonly.mjs";

const date = "2026-09-29";
let baseUrl = "";
const server = createServer((req, res) => {
  const url = new URL(req.url, baseUrl);
  res.setHeader("content-type", "application/json");
  if (url.pathname.includes("/actions/workflows/") && url.pathname.endsWith("/runs")) {
    res.end(JSON.stringify({ workflow_runs: [] }));
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
  assert.equal(row.runId, null);
  assert.equal(row.failureClass, "NO_COMPLETED_SCHEDULED_RUN");
  assert.equal(row.promotionCoverageEligible, false);
  assert.deepEqual(report.coverageIntegrity.tradingDayGapDates, [date]);
  assert.equal(report.aggregation.promotionGradeDateCount, 0);
  assert.equal(report.aggregation.promotionCoverageComplete, false);
  assert.equal(report.aggregation.promotionReadinessStatus, "SCHEDULED_TRADING_DAY_ARTIFACT_GAPS");
  assert.equal(report.reviewPacket.reviewState, "BLOCKED");
  assert.equal(report.reviewPacket.coverageFailureClassCounts.NO_COMPLETED_SCHEDULED_RUN, 1);
  assert.deepEqual(report.reviewPacket.tradingDayGapDates, [date]);
  assert.equal(report.reviewPacket.exactDecisionClockAuthorized, false);
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log("System2 Decision Clock missing-run coverage test passed");
