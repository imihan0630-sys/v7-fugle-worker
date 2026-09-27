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
  expectedTradingDay = true,
  outputPath,
  probe = probeRequiredDependencyObservers,
} = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(marketDate || ""))) {
    throw new Error("marketDate must be YYYY-MM-DD");
  }
  if (typeof expectedTradingDay !== "boolean") {
    throw new Error("expectedTradingDay must be boolean");
  }
  const report = await probe({ marketDate, expectedTradingDay });
  if (outputPath) {
    const absolute = resolve(outputPath);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  return report;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const expectedTradingDay = String(
    args["expected-trading-day"] || "true",
  ).toLowerCase() === "true";
  const report = await runRequiredDependencyReadOnlyMeasurement({
    marketDate: args["market-date"],
    expectedTradingDay,
    outputPath: args.output,
  });
  console.log(JSON.stringify({
    result: "PASS",
    marketDate: report.marketDate,
    sameTaipeiDate: report.sameTaipeiDate,
    expectedTradingDay: report.expectedTradingDay,
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
