import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { probeRequiredDependencyObservers } from "../runtime/required_dependency_probes.mjs";

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

export async function runRequiredDependencyReadOnlyMeasurement({
  marketDate,
  outputPath,
  probe = probeRequiredDependencyObservers,
} = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(marketDate || ""))) {
    throw new Error("marketDate must be YYYY-MM-DD");
  }
  const report = await probe({ marketDate });
  if (outputPath) {
    const absolute = resolve(outputPath);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  return report;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = await runRequiredDependencyReadOnlyMeasurement({
    marketDate: args["market-date"],
    outputPath: args.output,
  });
  console.log(JSON.stringify({
    result: "PASS",
    marketDate: report.marketDate,
    sameTaipeiDate: report.sameTaipeiDate,
    allTransportOk: report.allTransportOk,
    a5State: report.a5.state,
    b2State: report.b2.state,
    prospectiveEvidenceEligible: report.prospectiveEvidenceEligible,
    dependencyCoverage: report.dependencyCoverage,
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
