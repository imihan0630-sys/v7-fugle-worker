import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { auditFinalizedDecisionClockDateV01 } from "../runtime/decision_clock_finalized_date_acceptance_v0_1.mjs";

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

export async function runFinalizedDateAcceptanceAudit({
  inputPath,
  outputPath,
  marketDate,
} = {}) {
  if (typeof inputPath !== "string" || !inputPath.trim()) {
    throw new Error("inputPath is required");
  }
  const report = JSON.parse(await readFile(resolve(inputPath), "utf8"));
  const audit = auditFinalizedDecisionClockDateV01({
    report,
    marketDate: marketDate || report.coverageFinalization?.coverageThroughDate,
  });
  if (outputPath) {
    const absolute = resolve(outputPath);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, JSON.stringify(audit, null, 2) + "\n", "utf8");
  }
  return audit;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const audit = await runFinalizedDateAcceptanceAudit({
    inputPath: args.input,
    outputPath: args.output,
    marketDate: args["market-date"],
  });
  console.log(JSON.stringify({
    result: "PASS",
    auditVersion: audit.auditVersion,
    marketDate: audit.marketDate,
    status: audit.status,
    countsTowardIndependentDate: audit.countsTowardIndependentDate,
    countsTowardCompleteTradingDate: audit.countsTowardCompleteTradingDate,
    countsTowardPrecisionEligibleDate: audit.countsTowardPrecisionEligibleDate,
    exactDecisionClockAuthorized: false,
    workerCronAuthorized: false,
    captureEnabled: false,
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
