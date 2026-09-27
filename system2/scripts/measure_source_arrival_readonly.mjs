import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  REQUIRED_DAILY_CLOCK_SOURCES_V0_1,
  SOURCE_PROBE_STATE,
  assessDecisionClockReadiness,
  buildSourceArrivalMeasurement,
} from "../runtime/source_arrival_latency.mjs";
import { probeOfficialSources } from "../runtime/official_source_probes.mjs";

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new Error(`unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`missing value for --${key}`);
    values[key] = value;
    index += 1;
  }
  return values;
}

function boundedInteger(value, field, minimum, maximum, fallback) {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum || number > maximum) {
    throw new Error(`${field} must be an integer from ${minimum} to ${maximum}`);
  }
  return number;
}

function sleep(milliseconds) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));
}

export async function runReadOnlySourceArrivalMeasurement({
  marketDate,
  attempts = 1,
  intervalSeconds = 300,
  expectedTradingDay = true,
  stopWhenDailyGateReady = false,
  outputPath,
  probe = probeOfficialSources,
  now = () => new Date(),
  wait = sleep,
} = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(marketDate || ""))) {
    throw new Error("marketDate must be YYYY-MM-DD");
  }
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 48) {
    throw new Error("attempts must be an integer from 1 to 48");
  }
  if (!Number.isInteger(intervalSeconds) || intervalSeconds < 60 || intervalSeconds > 900) {
    throw new Error("intervalSeconds must be an integer from 60 to 900");
  }
  if (typeof expectedTradingDay !== "boolean") throw new Error("expectedTradingDay must be boolean");
  if (typeof stopWhenDailyGateReady !== "boolean") {
    throw new Error("stopWhenDailyGateReady must be boolean");
  }

  const startedAt = now().toISOString();
  const receipts = [];
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    receipts.push(...await probe({ marketDate }));
    const requiredReady = REQUIRED_DAILY_CLOCK_SOURCES_V0_1.every((sourceId) =>
      receipts.some((receipt) =>
        receipt.sourceId === sourceId && receipt.state === SOURCE_PROBE_STATE.READY));
    if (stopWhenDailyGateReady && requiredReady) break;
    if (attempt + 1 < attempts) await wait(intervalSeconds * 1000);
  }
  const createdAt = now().toISOString();
  const measurement = buildSourceArrivalMeasurement({
    measurementRunId: `S2-SAL-${marketDate}-${startedAt.replace(/\D/g, "").slice(0, 14)}`,
    marketDate,
    expectedTradingDay,
    attempts: receipts,
    createdAt,
  });
  const decisionClockAssessment = assessDecisionClockReadiness({ measurements: [measurement] });
  const report = {
    reportVersion: "S2_SOURCE_ARRIVAL_READONLY_REPORT_V0_1",
    mode: "READ_ONLY_OFFICIAL_SOURCE_MEASUREMENT",
    startedAt,
    completedAt: createdAt,
    measurement,
    decisionClockAssessment,
    safety: {
      httpMethods: ["GET"],
      system2D1Written: false,
      system2WorkerMutated: false,
      system1RuntimeUsed: false,
      captureArmRequested: false,
      cronMutationPerformed: false,
      liveWorkerStateQueried: false,
    },
  };

  if (outputPath) {
    const absolute = resolve(outputPath);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  return report;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const attempts = boundedInteger(args.attempts, "attempts", 1, 48, 1);
  const intervalSeconds = boundedInteger(args["interval-seconds"], "interval-seconds", 60, 900, 300);
  const expectedTradingDay = String(args["expected-trading-day"] || "true").toLowerCase() === "true";
  const report = await runReadOnlySourceArrivalMeasurement({
    marketDate: args["market-date"],
    attempts,
    intervalSeconds,
    expectedTradingDay,
    stopWhenDailyGateReady: String(
      args["stop-when-daily-gate-ready"] || "false",
    ).toLowerCase() === "true",
    outputPath: args.output,
  });
  console.log(JSON.stringify({
    result: "PASS",
    reportVersion: report.reportVersion,
    marketDate: report.measurement.marketDate,
    dailyGateComplete: report.measurement.dailyGateComplete,
    decisionClockStatus: report.decisionClockAssessment.status,
    decisionClockFrozen: false,
    captureArmRequested: false,
    cronMutationPerformed: false,
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
