import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDecisionClockDailyEvidence } from "../runtime/decision_clock_daily_evidence.mjs";
import { DECISION_CLOCK_COLLECTOR_PROVENANCE_VERSION, computeDecisionClockCollectorContractFingerprint } from "../runtime/decision_clock_collector_contract_v0_3.mjs";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function positiveInteger(value, field) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) throw new Error(field + " must be positive integer");
  return n;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) throw new Error(`unexpected argument: ${token}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`missing value for ${token}`);
    out[token.slice(2)] = value;
    i += 1;
  }
  return out;
}

export async function buildDecisionClockDailyBundle({
  sourceArrivalPath,
  dependencySeriesPath,
  outputPath,
  createdAt = new Date().toISOString(),
  repository,
  workflowRunId,
  workflowRunAttempt,
  workflowSha,
  workflowRef,
  rootDir = process.cwd(),
} = {}) {
  const sourceArrivalReport = JSON.parse(
    await readFile(resolve(sourceArrivalPath), "utf8"),
  );
  const dependencySeriesReport = JSON.parse(
    await readFile(resolve(dependencySeriesPath), "utf8"),
  );
  const marketDate = sourceArrivalReport?.measurement?.marketDate;
  const contract = await computeDecisionClockCollectorContractFingerprint({ rootDir });
  const runId = requiredText(String(workflowRunId || ""), "workflowRunId");
  const runAttempt = positiveInteger(workflowRunAttempt, "workflowRunAttempt");
  const sha = requiredText(workflowSha, "workflowSha");
  if (!/^[0-9a-f]{40}$/i.test(sha)) throw new Error("workflowSha must be 40-hex commit SHA");
  const evidence = buildDecisionClockDailyEvidence({
    evidenceId: `S2-DC-DAY-${marketDate}`,
    sourceArrivalReport,
    dependencySeriesReport,
    createdAt,
  });

  const bundle = {
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3",
    marketDate,
    evidence,
    collectorProvenance: {
      provenanceVersion: DECISION_CLOCK_COLLECTOR_PROVENANCE_VERSION,
      repository: requiredText(repository, "repository"),
      workflowRunId: runId,
      workflowRunAttempt: runAttempt,
      workflowSha: sha.toLowerCase(),
      workflowRef: requiredText(workflowRef, "workflowRef"),
      collectorContractVersion: contract.contractVersion,
      collectorContractFingerprint: contract.fingerprint,
      fingerprintAlgorithm: contract.fingerprintAlgorithm,
      collectorContractFiles: contract.files,
    },
    sourceArrivalReport,
    dependencySeriesReport,
    safety: {
      artifactOnly: true,
      system2D1Written: false,
      system2WorkerMutated: false,
      system1RuntimeUsed: false,
      captureArmRequested: false,
      workerCronMutationPerformed: false,
    },
  };

  if (outputPath) {
    const absolute = resolve(outputPath);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
  }
  return bundle;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const bundle = await buildDecisionClockDailyBundle({
    sourceArrivalPath: args["source-arrival"],
    dependencySeriesPath: args["dependency-series"],
    outputPath: args.output,
    repository: args.repository,
    workflowRunId: args["workflow-run-id"],
    workflowRunAttempt: args["workflow-run-attempt"],
    workflowSha: args["workflow-sha"],
    workflowRef: args["workflow-ref"],
  });
  console.log(JSON.stringify({
    result: "PASS",
    marketDate: bundle.marketDate,
    requiredReady: bundle.evidence.requiredReady,
    precisionEligible: bundle.evidence.precisionEligible,
    a5AvailableByCandidate: bundle.evidence.a5AvailableByCandidate,
    candidateTimestamp: bundle.evidence.candidateTimestamp,
    candidateTaipeiTime: bundle.evidence.candidateTaipeiTime,
    collectorContractFingerprint: bundle.collectorProvenance.collectorContractFingerprint,
    workflowSha: bundle.collectorProvenance.workflowSha,
    exactDecisionClockAuthorized: false,
    cronAuthorized: false,
    externalMutationPerformed: false,
  }, null, 2));
}

const isMain = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main().catch((error) => {
    console.error(error?.stack || String(error));
    process.exitCode = 1;
  });
}
