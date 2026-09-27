import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { aggregateDecisionClockEvidence } from "../runtime/decision_clock_evidence_aggregation.mjs";
import { probeTwseTradingDate } from "../runtime/twse_trading_calendar_readonly.mjs";
import { buildDecisionClockReviewPacket } from "../runtime/decision_clock_review_packet.mjs";
import { classifyDecisionClockCoverageRowV02, summarizeDecisionClockCoverageFailuresV02 } from "../runtime/decision_clock_coverage_integrity_v0_2.mjs";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) throw new Error("unexpected argument: " + token);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) throw new Error("missing value for " + token);
    out[token.slice(2)] = value;
    i += 1;
  }
  return out;
}

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function taipeiDate(iso) {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) throw new Error("invalid GitHub run timestamp");
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (type) => parts.find((x) => x.type === type)?.value;
  return get("year") + "-" + get("month") + "-" + get("day");
}

export function previousTaipeiCalendarDate(iso = new Date().toISOString()) {
  const current = taipeiDate(iso);
  const noonUtc = new Date(current + "T12:00:00Z");
  noonUtc.setUTCDate(noonUtc.getUTCDate() - 1);
  return noonUtc.toISOString().slice(0, 10);
}

function inclusiveDates(startDate, endDate) {
  if (!startDate || !endDate || startDate > endDate) return [];
  const out = [];
  let cursor = new Date(startDate + "T00:00:00Z");
  const stop = new Date(endDate + "T00:00:00Z");
  while (cursor <= stop) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor = new Date(cursor.getTime() + 86400000);
  }
  return out;
}

async function githubJson(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: "Bearer " + token,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "System2-Decision-Clock-Aggregator/0.1",
    },
    signal: AbortSignal.timeout(45000),
  });
  const text = await response.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}
  if (!response.ok) throw new Error("GitHub GET failed HTTP " + response.status + ": " + text.slice(0, 300));
  return data;
}

async function downloadArtifactJson(archiveUrl, token, tempRoot, artifactId) {
  const response = await fetch(archiveUrl, {
    method: "GET",
    headers: {
      authorization: "Bearer " + token,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "System2-Decision-Clock-Aggregator/0.1",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error("artifact download failed HTTP " + response.status);
  const zipPath = join(tempRoot, String(artifactId) + ".zip");
  await writeFile(zipPath, Buffer.from(await response.arrayBuffer()));

  const names = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" })
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)
    .filter((x) => x.endsWith(".json"));
  if (names.length !== 1) {
    throw new Error("artifact " + artifactId + " must contain exactly one JSON file; found " + names.length);
  }
  const jsonText = execFileSync("unzip", ["-p", zipPath, names[0]], { encoding: "utf8" });
  return JSON.parse(jsonText);
}

async function getWorkflowRunAttempt({
  apiBase,
  repo,
  run,
  attempt,
  token,
  cache,
}) {
  const attemptNumber = Number(attempt);
  if (!Number.isInteger(attemptNumber) || attemptNumber < 1) {
    throw new Error("workflow run attempt must be a positive integer");
  }
  const key = String(run.id) + ":" + attemptNumber;
  if (cache.has(key)) return cache.get(key);

  let value;
  if (Number(run.run_attempt || 1) === attemptNumber) {
    value = run;
  } else {
    value = await githubJson(
      apiBase + "/repos/" + repo + "/actions/runs/" + run.id
        + "/attempts/" + attemptNumber,
      token,
    );
  }
  if (String(value?.id) !== String(run.id)) {
    throw new Error("workflow attempt run-id mismatch for run " + run.id);
  }
  if (Number(value?.run_attempt || 1) !== attemptNumber) {
    throw new Error("workflow attempt metadata mismatch for run " + run.id
      + " attempt " + attemptNumber);
  }
  cache.set(key, value);
  return value;
}

async function listWorkflowRuns({ apiBase, repo, workflowFile, token }) {
  const runs = [];
  for (let page = 1; page <= 10; page += 1) {
    const url = apiBase + "/repos/" + repo + "/actions/workflows/" + encodeURIComponent(workflowFile)
      + "/runs?status=completed&per_page=100&page=" + page;
    const data = await githubJson(url, token);
    const pageRuns = Array.isArray(data?.workflow_runs) ? data.workflow_runs : [];
    runs.push(...pageRuns);
    if (pageRuns.length < 100) break;
  }
  return runs;
}

export async function aggregateFromGithubArtifacts({
  repo,
  token,
  workflowFile = "system2-prospective-clock-evidence-readonly.yml",
  apiBase = "https://api.github.com",
  outputPath = null,
  probeTradingDate = probeTwseTradingDate,
  coverageStartDate = "2026-09-29",
  coverageThroughDate = previousTaipeiCalendarDate(),
} = {}) {
  const repository = requiredText(repo, "repo");
  const auth = requiredText(token, "token");
  const tempRoot = await mkdtemp(join(tmpdir(), "system2-clock-artifacts-"));

  try {
    const runs = await listWorkflowRuns({ apiBase, repo: repository, workflowFile, token: auth });
    const relevantRuns = runs
      .filter((x) => ["schedule", "workflow_dispatch"].includes(x?.event))
      .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));

    const candidates = [];
    const coverageByDate = new Map();
    const attemptMetadataCache = new Map();
    const pendingUnfinalizedRuns = [];
    const pendingUnfinalizedArtifacts = [];
    const preCoverageWindowRuns = [];

    for (const run of relevantRuns) {
      const artifactsData = await githubJson(
        apiBase + "/repos/" + repository + "/actions/runs/" + run.id + "/artifacts?per_page=100",
        auth,
      );
      const artifacts = Array.isArray(artifactsData?.artifacts) ? artifactsData.artifacts : [];
      const dailyArtifacts = artifacts
        .filter((a) => !a?.expired && String(a?.name || "").startsWith("system2-decision-clock-daily-"));

      let attemptOne = null;
      let attemptOneRunDate = null;
      if (run.event === "schedule") {
        attemptOne = await getWorkflowRunAttempt({
          apiBase,
          repo: repository,
          run,
          attempt: 1,
          token: auth,
          cache: attemptMetadataCache,
        });
        attemptOneRunDate = taipeiDate(attemptOne.created_at);
      }

      const runAnchorDate = run.event === "schedule"
        ? attemptOneRunDate
        : taipeiDate(run.created_at);

      if (runAnchorDate < coverageStartDate) {
        preCoverageWindowRuns.push({
          runId: String(run.id),
          eventName: run.event,
          runAttempt: Number(run.run_attempt || 1),
          anchorMarketDate: runAnchorDate,
          dailyArtifactCount: dailyArtifacts.length,
        });
        continue;
      }

      if (runAnchorDate > coverageThroughDate) {
        pendingUnfinalizedRuns.push({
          runId: String(run.id),
          eventName: run.event,
          runAttempt: Number(run.run_attempt || 1),
          anchorMarketDate: runAnchorDate,
          runConclusion: run.conclusion || null,
          dailyArtifactCount: dailyArtifacts.length,
        });
        for (const artifact of dailyArtifacts) {
          pendingUnfinalizedArtifacts.push({
            runId: String(run.id),
            eventName: run.event,
            anchorMarketDate: runAnchorDate,
            artifactId: String(artifact.id),
            artifactName: String(artifact.name || ""),
          });
        }
        continue;
      }

      let attemptOneDailyArtifactCount = 0;
      for (const artifact of dailyArtifacts) {
        const bundle = await downloadArtifactJson(
          artifact.archive_download_url,
          auth,
          tempRoot,
          artifact.id,
        );

        const embeddedAttempt = Number(
          bundle?.collectorProvenance?.workflowRunAttempt
            ?? run.run_attempt
            ?? 1,
        );
        const attemptMeta = await getWorkflowRunAttempt({
          apiBase,
          repo: repository,
          run,
          attempt: embeddedAttempt,
          token: auth,
          cache: attemptMetadataCache,
        });
        const artifactRunDate = taipeiDate(attemptMeta.created_at);

        if (run.event === "schedule" && bundle.marketDate !== artifactRunDate) {
          throw new Error("scheduled run/bundle Taiwan-date mismatch: run " + run.id
            + " attempt " + embeddedAttempt + "=" + artifactRunDate
            + ", bundle=" + bundle.marketDate);
        }
        if (run.event === "schedule" && embeddedAttempt === 1) {
          attemptOneDailyArtifactCount += 1;
        }

        candidates.push({
          runId: String(run.id),
          runAttempt: embeddedAttempt,
          runHeadSha: String(attemptMeta.head_sha || ""),
          eventName: run.event,
          runCreatedAt: attemptMeta.created_at,
          artifactId: String(artifact.id),
          artifactName: artifact.name,
          bundle,
        });
      }

      if (run.event === "schedule" && !coverageByDate.has(attemptOneRunDate)) {
        coverageByDate.set(attemptOneRunDate, {
          marketDate: attemptOneRunDate,
          runId: String(run.id),
          runAttempt: 1,
          runCreatedAt: attemptOne.created_at || null,
          runConclusion: attemptOne.conclusion || null,
          dailyArtifactCount: attemptOneDailyArtifactCount,
          artifactPresent: attemptOneDailyArtifactCount === 1,
        });
      }
    }

    const integrityCoverageRows = [];
    const scheduledRunCoverage = [];
    for (const marketDate of inclusiveDates(coverageStartDate, coverageThroughDate)) {
      const calendar = await probeTradingDate({ marketDate });
      if (calendar.state !== "READY" || typeof calendar.expectedTradingDay !== "boolean") {
        throw new Error("official trading-calendar coverage audit failed for " + marketDate + ": " + calendar.state);
      }
      const run = coverageByDate.get(marketDate) || null;
      const integrityRow = classifyDecisionClockCoverageRowV02({
        marketDate,
        expectedTradingDay: calendar.expectedTradingDay,
        runId: run?.runId || null,
        runAttempt: run?.runAttempt || null,
        runCreatedAt: run?.runCreatedAt || null,
        runConclusion: run?.runConclusion || null,
        dailyArtifactCount: run?.dailyArtifactCount || 0,
      });
      integrityCoverageRows.push(integrityRow);
      scheduledRunCoverage.push({
        marketDate,
        runId: integrityRow.runId || ("MISSING:" + marketDate),
        expectedTradingDay: integrityRow.expectedTradingDay,
        artifactPresent: integrityRow.promotionCoverageEligible === true && integrityRow.dailyArtifactCount === 1,
        runConclusion: integrityRow.runConclusion || "missing",
      });
    }

    const aggregation = aggregateDecisionClockEvidence({
      candidates,
      scheduledRunCoverage,
      workflowFile,
    });

    const baseReviewPacket = buildDecisionClockReviewPacket(aggregation);
    const coverageFailureClassCounts = summarizeDecisionClockCoverageFailuresV02(integrityCoverageRows);
    const tradingDayGapDates = integrityCoverageRows
      .filter((x) => x.expectedTradingDay === true && x.promotionCoverageEligible !== true)
      .map((x) => x.marketDate);
    const reviewPacket = Object.freeze({
      ...baseReviewPacket,
      coverageIntegrityExtensionVersion: "S2_DECISION_CLOCK_COVERAGE_INTEGRITY_V0_2",
      coverageStartDate,
      coverageThroughDate,
      coverageFailureClassCounts,
      tradingDayGapDates,
      laterScheduledRunsCannotRepairAnchor: true,
      collectorContractConsistencyVersion: aggregation.collectorContractConsistencyVersion,
      collectorContractFingerprints: aggregation.collectorContractFingerprints,
      collectorContractConsistent: aggregation.collectorContractConsistent,
      coverageFinalizationVersion: "S2_DECISION_CLOCK_COVERAGE_FINALIZATION_V0_3",
      coverageFinalizationLagCalendarDays: 1,
      pendingUnfinalizedRunCount: pendingUnfinalizedRuns.length,
      pendingUnfinalizedArtifactCount: pendingUnfinalizedArtifacts.length,
    });

    const report = {
      reportVersion: "S2_DECISION_CLOCK_ARTIFACT_REPORT_V0_1",
      repository,
      workflowFile,
      generatedAt: new Date().toISOString(),
      aggregation,
      reviewPacket,
      coverageIntegrity: {
        version: "S2_DECISION_CLOCK_COVERAGE_INTEGRITY_V0_2",
        coverageStartDate,
        coverageThroughDate,
        rows: integrityCoverageRows,
        failureClassCounts: coverageFailureClassCounts,
        tradingDayGapDates,
        laterScheduledRunsCannotRepairAnchor: true,
        laterRerunAttemptsCannotRepairOrInvalidateAttemptOne: true,
      },
      coverageFinalization: {
        version: "S2_DECISION_CLOCK_COVERAGE_FINALIZATION_V0_3",
        lagCalendarDays: 1,
        coverageStartDate,
        coverageThroughDate,
        currentTaipeiDate: taipeiDate(new Date().toISOString()),
        pendingUnfinalizedRuns,
        pendingUnfinalizedArtifacts,
        preCoverageWindowRunCount: preCoverageWindowRuns.length,
        currentOrFutureDatesCannotCreateFinalizedGaps: true,
        currentOrFutureArtifactsCannotEnterReadiness: true,
      },
      collectorIntegrity: {
        version: aggregation.collectorContractConsistencyVersion,
        fingerprints: aggregation.collectorContractFingerprints,
        consistent: aggregation.collectorContractConsistent,
        mixedCollectorContractsBlockPromotion: true,
      },
      safety: {
        githubReadOnly: true,
        officialCalendarGetOnly: true,
        cloudflareSecretUsed: false,
        system2D1Written: false,
        system2WorkerMutated: false,
        system2WorkerCronMutated: false,
        system1RuntimeUsed: false,
      },
    };

    if (outputPath) {
      const absolute = resolve(outputPath);
      await mkdir(dirname(absolute), { recursive: true });
      await writeFile(absolute, JSON.stringify(report, null, 2) + "\n", "utf8");
    }
    return report;
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = await aggregateFromGithubArtifacts({
    repo: args.repo || process.env.GITHUB_REPOSITORY,
    token: process.env.GITHUB_TOKEN,
    outputPath: args.output,
    coverageStartDate: args["coverage-start-date"] || "2026-09-29",
    coverageThroughDate: args["coverage-through-date"] || previousTaipeiCalendarDate(),
  });
  const a = report.aggregation;
  console.log(JSON.stringify({
    result: "PASS",
    promotionGradeDateCount: a.promotionGradeDateCount,
    promotionReadinessStatus: a.promotionReadinessStatus,
    readinessStatus: a.readiness.status,
    candidateTaipeiTime: a.readiness.candidateTaipeiTime,
    artifactCoverageAudited: a.artifactCoverageAudited,
    promotionCoverageComplete: a.promotionCoverageComplete,
    tradingDayArtifactGapCount: a.tradingDayArtifactGaps.length,
    reviewState: report.reviewPacket.reviewState,
    collectorContractConsistent: report.aggregation.collectorContractConsistent,
    collectorContractFingerprints: report.aggregation.collectorContractFingerprints,
    rerunDiagnosticArtifactCount: report.aggregation.rerunDiagnosticArtifactCount,
    coverageThroughDate: report.coverageFinalization.coverageThroughDate,
    pendingUnfinalizedRunCount: report.coverageFinalization.pendingUnfinalizedRuns.length,
    pendingUnfinalizedArtifactCount: report.coverageFinalization.pendingUnfinalizedArtifacts.length,
    exactDecisionClockAuthorized: false,
    cronAuthorized: false,
    externalMutationPerformed: false,
  }, null, 2));
}

const invoked = process.argv[1] ? resolve(process.argv[1]) : null;
if (invoked && import.meta.url === new URL("file://" + invoked).href) {
  main().catch((error) => {
    console.error(error?.stack || String(error));
    process.exitCode = 1;
  });
}
