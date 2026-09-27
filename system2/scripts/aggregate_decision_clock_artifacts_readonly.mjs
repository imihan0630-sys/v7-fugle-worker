import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { aggregateDecisionClockEvidence } from "../runtime/decision_clock_evidence_aggregation.mjs";
import { probeTwseTradingDate } from "../runtime/twse_trading_calendar_readonly.mjs";
import { buildDecisionClockReviewPacket } from "../runtime/decision_clock_review_packet.mjs";

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

    for (const run of relevantRuns) {
      const runDate = taipeiDate(run.created_at);
      const artifactsData = await githubJson(
        apiBase + "/repos/" + repository + "/actions/runs/" + run.id + "/artifacts?per_page=100",
        auth,
      );
      const artifacts = Array.isArray(artifactsData?.artifacts) ? artifactsData.artifacts : [];
      const dailyArtifacts = artifacts
        .filter((a) => !a?.expired && String(a?.name || "").startsWith("system2-decision-clock-daily-"));

      if (run.event === "schedule") {
        if (!coverageByDate.has(runDate)) {
          coverageByDate.set(runDate, {
            marketDate: runDate,
            runId: String(run.id),
            runConclusion: run.conclusion || null,
            artifactPresent: dailyArtifacts.length > 0,
          });
        } else {
          const prior = coverageByDate.get(runDate);
          prior.artifactPresent = prior.artifactPresent || dailyArtifacts.length > 0;
        }
      }

      for (const artifact of dailyArtifacts) {
        const bundle = await downloadArtifactJson(
          artifact.archive_download_url,
          auth,
          tempRoot,
          artifact.id,
        );
        if (run.event === "schedule" && bundle.marketDate !== runDate) {
          throw new Error("scheduled run/bundle Taiwan-date mismatch: run " + run.id + "=" + runDate
            + ", bundle=" + bundle.marketDate);
        }
        candidates.push({
          runId: String(run.id),
          runAttempt: Number(run.run_attempt || 1),
          eventName: run.event,
          runCreatedAt: run.created_at,
          artifactId: String(artifact.id),
          artifactName: artifact.name,
          bundle,
        });
      }
    }

    const scheduledRunCoverage = [];
    for (const row of [...coverageByDate.values()].sort((a, b) => a.marketDate.localeCompare(b.marketDate))) {
      const calendar = await probeTradingDate({ marketDate: row.marketDate });
      if (calendar.state !== "READY" || typeof calendar.expectedTradingDay !== "boolean") {
        throw new Error("official trading-calendar coverage audit failed for " + row.marketDate + ": " + calendar.state);
      }
      scheduledRunCoverage.push({
        marketDate: row.marketDate,
        runId: row.runId,
        expectedTradingDay: calendar.expectedTradingDay,
        artifactPresent: row.artifactPresent,
        runConclusion: row.runConclusion,
      });
    }

    const aggregation = aggregateDecisionClockEvidence({
      candidates,
      scheduledRunCoverage,
      workflowFile,
    });

    const reviewPacket = buildDecisionClockReviewPacket(aggregation);

    const report = {
      reportVersion: "S2_DECISION_CLOCK_ARTIFACT_REPORT_V0_1",
      repository,
      workflowFile,
      generatedAt: new Date().toISOString(),
      aggregation,
      reviewPacket,
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
