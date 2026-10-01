import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { fetchDailyShadowA1SnapshotV0_1 } from "../runtime/daily_shadow_a1_source_v0_1.mjs";
import { probePitHistoryCoverageV0_1 } from "../runtime/daily_shadow_history_reader_v0_1.mjs";
import { buildDailyShadowInputPreflightV0_1 } from "../runtime/daily_shadow_input_preflight_v0_1.mjs";

function taipeiDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function argMap(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) throw new Error("unexpected argument: " + key);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) throw new Error("missing value for " + key);
    out[key.slice(2)] = value;
    i += 1;
  }
  return out;
}

export async function runDailyShadowInputPreflightReadonly({
  accountId,
  apiToken,
  marketDate = taipeiDate(),
  decisionTimestamp = null,
  fetchImpl = globalThis.fetch,
} = {}) {
  const db = await createRemoteD1RestAdapter({
    accountId,
    apiToken,
    databaseName: "system2-research",
    fetchImpl,
  });

  const a1 = await fetchDailyShadowA1SnapshotV0_1({
    marketDate,
    decisionTimestamp,
    fetchImpl,
  });

  let history;
  if (a1.snapshotBatch) {
    history = await probePitHistoryCoverageV0_1({
      db,
      snapshotBatch: a1.snapshotBatch,
      decisionTimestamp: a1.decisionTimestamp,
      requiredPriorSessions: 60,
      priceSpace: "RAW",
    });
  } else {
    history = {
      version: "0.1-RESEARCH",
      state: "NOT_EVALUATED_CURRENT_SOURCE_UNAVAILABLE",
      marketDate,
      decisionTimestamp: a1.decisionTimestamp,
      requiredPriorSessions: 60,
      currentUniverseCount: 0,
      historyReadyCount: 0,
      continuityReadyCount: 0,
      ambiguousSymbolCount: 0,
      historyCoverage: 0,
      continuityCoverage: 0,
      diagnostics: [],
      readOnly: true,
      externalMutationPerformed: false,
    };
  }

  const preflight = buildDailyShadowInputPreflightV0_1({
    marketDate,
    decisionTimestamp: a1.decisionTimestamp,
    a1Source: a1,
    historyCoverage: history,
  });

  return {
    result: "PASS",
    mode: "READ_ONLY_DIAGNOSTIC",
    databaseName: db.database.name,
    databaseIdPresent: db.database.idPresent,
    marketDate,
    decisionTimestamp: a1.decisionTimestamp,
    decisionClockMode: a1.decisionClockMode,
    preflight,
    d1Metrics: {
      requestCount: db.metrics.requestCount,
      rowsRead: db.metrics.rowsRead,
      rowsWritten: db.metrics.rowsWritten,
    },
    safety: {
      system2D1Written: db.metrics.rowsWritten !== 0,
      expectedRowsWritten: 0,
      system2WorkerMutated: false,
      system1RuntimeUsed: false,
      captureArmRequested: false,
      cronMutationPerformed: false,
      externalMutationPerformed: false,
    },
  };
}

async function main() {
  const args = argMap(process.argv.slice(2));
  const result = await runDailyShadowInputPreflightReadonly({
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.SYSTEM2_CLOUDFLARE_API_TOKEN,
    marketDate: args["market-date"] || taipeiDate(),
    decisionTimestamp: args["decision-timestamp"] || null,
  });
  if (result.d1Metrics.rowsWritten !== 0) {
    throw new Error("read-only preflight unexpectedly wrote isolated D1 rows");
  }
  console.log(JSON.stringify(result, null, 2));
}

const isMain = process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main().catch((error) => {
    console.error(error?.stack || String(error));
    process.exitCode = 1;
  });
}
