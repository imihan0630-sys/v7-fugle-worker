import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDecisionClockDailyEvidence } from "../runtime/decision_clock_daily_evidence.mjs";

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
} = {}) {
  const sourceArrivalReport = JSON.parse(
    await readFile(resolve(sourceArrivalPath), "utf8"),
  );
  const dependencySeriesReport = JSON.parse(
    await readFile(resolve(dependencySeriesPath), "utf8"),
  );
  const marketDate = sourceArrivalReport?.measurement?.marketDate;
  const evidence = buildDecisionClockDailyEvidence({
    evidenceId: `S2-DC-DAY-${marketDate}`,
    sourceArrivalReport,
    dependencySeriesReport,
    createdAt,
  });

  const bundle = {
    bundleVersion: "S2_DECISION_CLOCK_DAILY_BUNDLE_V0_2",
    marketDate,
    evidence,
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
  });
  console.log(JSON.stringify({
    result: "PASS",
    marketDate: bundle.marketDate,
    requiredReady: bundle.evidence.requiredReady,
    precisionEligible: bundle.evidence.precisionEligible,
    candidateTaipeiTime: bundle.evidence.candidateTaipeiTime,
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
