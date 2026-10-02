import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { runDailyShadowDiagnosticV0_1 } from "../runtime/daily_shadow_diagnostic_orchestrator_v0_1.mjs";

export async function runDailyShadowDiagnostic({ accountId, apiToken, runId, revision } = {}) {
  const db = await createRemoteD1RestAdapter({ accountId, apiToken, databaseName: "system2-research" });
  const receipt = await runDailyShadowDiagnosticV0_1({ db, runId, revision });
  return { result: "PASS", mode: "IMMUTABLE_DIAGNOSTIC_ONLY", databaseName: db.database.name,
    receipt, d1Metrics: { requestCount: db.metrics.requestCount, rowsRead: db.metrics.rowsRead, rowsWritten: db.metrics.rowsWritten } };
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  if (process.env.SYSTEM2_CONFIRM !== "WRITE_SYSTEM2_DAILY_DIAGNOSTIC_ONLY") {
    throw new Error("explicit isolated diagnostic-write confirmation required");
  }
  runDailyShadowDiagnostic({ accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    apiToken: process.env.SYSTEM2_CLOUDFLARE_API_TOKEN,
    runId: `${process.env.GITHUB_RUN_ID}:${process.env.GITHUB_RUN_ATTEMPT}`,
    revision: process.env.GITHUB_SHA,
  }).then(result => console.log(JSON.stringify(result, null, 2))).catch(() => {
    // Never echo provider errors containing credentials or request payloads.
    console.error("SYSTEM2_DAILY_DIAGNOSTIC_FAILED; inspect isolated workflow steps and receipts");
    process.exitCode = 1;
  });
}
