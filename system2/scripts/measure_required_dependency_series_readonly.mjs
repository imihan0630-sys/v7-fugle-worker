import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEPENDENCY_OBSERVATION_STATE,
  probeRequiredDependencyObservers,
} from "../runtime/required_dependency_probes.mjs";

const DEPENDENCIES = Object.freeze([
  "A5_QUARTERLY_FINANCIALS",
  "B2_INDUSTRY_THESIS_PROSPECTIVE",
]);

function sleep(milliseconds) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));
}

function boundedInteger(value, field, min, max, fallback) {
  if (value === undefined) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new Error(`${field} must be an integer from ${min} to ${max}`);
  }
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

function summarizeDependency(observations, dependency) {
  const stateOf = (report) => report.dependencyStates?.[dependency] || null;
  const firstReadyIndex = observations.findIndex(
    (report) => stateOf(report) === DEPENDENCY_OBSERVATION_STATE.READY,
  );
  const firstReady = firstReadyIndex >= 0 ? observations[firstReadyIndex] : null;
  const priorNotReady = firstReadyIndex > 0
    ? [...observations.slice(0, firstReadyIndex)]
      .reverse()
      .find((report) => stateOf(report) === DEPENDENCY_OBSERVATION_STATE.NOT_READY) || null
    : null;

  const firstReadyAt = firstReady?.observedAt || null;
  const priorAt = priorNotReady?.observedAt || null;
  const statesObserved = [...new Set(
    observations.map((report) => stateOf(report)).filter(Boolean),
  )];

  return {
    dependency,
    statesObserved,
    firstReadyAt,
    lastObservedNotReadyAt: priorAt,
    observationIntervalMinutes:
      firstReadyAt && priorAt
        ? (Date.parse(firstReadyAt) - Date.parse(priorAt)) / 60000
        : null,
    readyObserved: Boolean(firstReady),
    validNotReadyToReadyBracketObserved: Boolean(firstReadyAt && priorAt),
    sourceErrorObserved: statesObserved.includes(DEPENDENCY_OBSERVATION_STATE.SOURCE_ERROR),
    invalidPayloadObserved: statesObserved.includes(
      DEPENDENCY_OBSERVATION_STATE.INVALID_PAYLOAD,
    ),
    publicationTimestampProven: false,
  };
}

export async function runRequiredDependencyReadOnlySeries({
  marketDate,
  expectedTradingDay = true,
  attempts = 12,
  intervalSeconds = 300,
  outputPath,
  probe = probeRequiredDependencyObservers,
  wait = sleep,
} = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(marketDate || ""))) {
    throw new Error("marketDate must be YYYY-MM-DD");
  }
  if (typeof expectedTradingDay !== "boolean") {
    throw new Error("expectedTradingDay must be boolean");
  }
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 48) {
    throw new Error("attempts must be an integer from 1 to 48");
  }
  if (!Number.isInteger(intervalSeconds) || intervalSeconds < 60 || intervalSeconds > 900) {
    throw new Error("intervalSeconds must be an integer from 60 to 900");
  }

  const observations = [];
  for (let i = 0; i < attempts; i += 1) {
    const report = await probe({ marketDate, expectedTradingDay });
    observations.push(report);
    if (report.prospectiveEvidenceEligible === true) break;
    if (i + 1 < attempts) await wait(intervalSeconds * 1000);
  }

  const dependencySummaries = DEPENDENCIES.map(
    (dependency) => summarizeDependency(observations, dependency),
  );
  const firstAll = observations.find(
    (report) => report.prospectiveEvidenceEligible === true,
  ) || null;

  const result = {
    reportVersion: "S2_REQUIRED_DEPENDENCY_SERIES_V0_1",
    mode: "READ_ONLY_REQUIRED_DEPENDENCY_POLLING",
    marketDate,
    expectedTradingDay,
    attemptCount: observations.length,
    intervalSeconds,
    observations,
    dependencySummaries,
    firstAllEligibleAt: firstAll?.observedAt || null,
    dependencyCoverage: Object.fromEntries(
      dependencySummaries.map((x) => [x.dependency, x.readyObserved]),
    ),
    prospectiveEvidenceEligible: Boolean(firstAll),
    publicationTimestampProven: false,
    safety: {
      httpMethods: ["GET"],
      system2D1Written: false,
      system2WorkerMutated: false,
      system1RuntimeUsed: false,
      captureArmRequested: false,
      cronMutationPerformed: false,
      externalMutationPerformed: false,
    },
  };

  if (outputPath) {
    const absolute = resolve(outputPath);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await runRequiredDependencyReadOnlySeries({
    marketDate: args["market-date"],
    expectedTradingDay: String(
      args["expected-trading-day"] || "true",
    ).toLowerCase() === "true",
    attempts: boundedInteger(args.attempts, "attempts", 1, 48, 12),
    intervalSeconds: boundedInteger(
      args["interval-seconds"],
      "interval-seconds",
      60,
      900,
      300,
    ),
    outputPath: args.output,
  });
  console.log(JSON.stringify({
    result: "PASS",
    marketDate: result.marketDate,
    expectedTradingDay: result.expectedTradingDay,
    attemptCount: result.attemptCount,
    dependencyCoverage: result.dependencyCoverage,
    firstAllEligibleAt: result.firstAllEligibleAt,
    prospectiveEvidenceEligible: result.prospectiveEvidenceEligible,
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
