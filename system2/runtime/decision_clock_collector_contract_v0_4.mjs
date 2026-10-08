import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { deepFreeze } from "./factor_snapshot.mjs";

export const DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION = "S2_DECISION_CLOCK_COLLECTOR_CONTRACT_V0_4";
export const DECISION_CLOCK_COLLECTOR_EVIDENCE_EPOCH = "S2_CLOCK_A1_STAGE1_EXACT_DATE_ALIGNMENT_EPOCH_V0_4";
export const DECISION_CLOCK_COLLECTOR_PROVENANCE_VERSION = "S2_DECISION_CLOCK_COLLECTOR_PROVENANCE_V0_3";

export const DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_4 = Object.freeze([
  ".github/workflows/system2-prospective-clock-evidence-readonly.yml",
  "system2/runtime/source_arrival_latency.mjs",
  "system2/runtime/official_source_probes.mjs",
  "system2/runtime/daily_shadow_a1_source_v0_1.mjs",
  "system2/runtime/official_historical_a1_source_v0_1.mjs",
  "system2/scripts/measure_source_arrival_readonly.mjs",
  "system2/runtime/required_dependency_probes.mjs",
  "system2/runtime/a5_filing_vintage_observer.mjs",
  "system2/runtime/b2_industry_snapshot_observer.mjs",
  "system2/scripts/measure_required_dependency_series_readonly.mjs",
  "system2/runtime/decision_clock_daily_evidence.mjs",
  "system2/scripts/build_decision_clock_daily_bundle.mjs",
  "system2/runtime/twse_trading_calendar_readonly.mjs",
  "system2/scripts/check_twse_trading_day_readonly.mjs",
  "system2/runtime/decision_clock_collector_contract_v0_4.mjs",
]);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function fingerprintCollectorContractEntries(entries = []) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("collector contract entries are required");
  }
  const normalized = entries
    .map((entry, index) => {
      if (!entry || typeof entry.path !== "string" || !entry.path.trim()) {
        throw new Error(`entries[${index}].path is required`);
      }
      if (typeof entry.content !== "string") {
        throw new Error(`entries[${index}].content must be string`);
      }
      return {
        path: entry.path.trim(),
        content: entry.content,
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  const seen = new Set();
  const files = normalized.map((entry) => {
    if (seen.has(entry.path)) throw new Error("duplicate collector contract path: " + entry.path);
    seen.add(entry.path);
    return {
      path: entry.path,
      sha256: sha256(entry.content),
    };
  });

  const aggregate = createHash("sha256");
  for (const file of files) {
    aggregate.update(file.path);
    aggregate.update("\0");
    aggregate.update(file.sha256);
    aggregate.update("\0");
  }

  return deepFreeze({
    contractVersion: DECISION_CLOCK_COLLECTOR_CONTRACT_VERSION,
    fingerprintAlgorithm: "SHA256_PATH_AND_FILE_SHA256_V0_3",
    fingerprint: aggregate.digest("hex"),
    files,
  });
}

export async function computeDecisionClockCollectorContractFingerprint({
  rootDir = process.cwd(),
  filePaths = DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_4,
  readFileImpl = readFile,
} = {}) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    throw new Error("filePaths are required");
  }
  const entries = [];
  for (const path of filePaths) {
    const content = await readFileImpl(resolve(rootDir, path), "utf8");
    entries.push({ path, content });
  }
  return fingerprintCollectorContractEntries(entries);
}
