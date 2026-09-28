import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deepFreeze } from "../runtime/factor_snapshot.mjs";

export const PROSPECTIVE_COLLECTOR_WORKFLOW_FILE =
  "system2-prospective-clock-evidence-readonly.yml";
export const PROSPECTIVE_COLLECTOR_WORKFLOW_PATH =
  ".github/workflows/system2-prospective-clock-evidence-readonly.yml";
export const PROSPECTIVE_COLLECTOR_WORKFLOW_NAME =
  "System2 Prospective Clock Evidence Read-only";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(field + " is required");
  }
  return value.trim();
}

function repositoryName(value) {
  const text = requiredText(value, "repo");
  if (!/^[^/\s]+\/[^/\s]+$/.test(text)) {
    throw new Error("repo must be owner/name");
  }
  return text;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) throw new Error("unexpected argument: " + token);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error("missing value for " + token);
    }
    out[token.slice(2)] = value;
    i += 1;
  }
  return out;
}

export async function checkProspectiveCollectorWorkflowReadOnly({
  repo,
  token,
  apiBase = "https://api.github.com",
  workflowFile = PROSPECTIVE_COLLECTOR_WORKFLOW_FILE,
  expectedPath = PROSPECTIVE_COLLECTOR_WORKFLOW_PATH,
  expectedName = PROSPECTIVE_COLLECTOR_WORKFLOW_NAME,
  fetchImpl = fetch,
  now = () => new Date(),
} = {}) {
  const repository = repositoryName(repo);
  const auth = requiredText(token, "token");
  const file = requiredText(workflowFile, "workflowFile");
  const base = requiredText(apiBase, "apiBase").replace(/\/$/, "");

  const response = await fetchImpl(
    base + "/repos/" + repository + "/actions/workflows/" + encodeURIComponent(file),
    {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "application/vnd.github+json",
        authorization: "Bearer " + auth,
        "x-github-api-version": "2022-11-28",
        "user-agent": "System2-Prospective-Collector-Preflight/0.1",
      },
    },
  );

  if (!response.ok) {
    return deepFreeze({
      receiptVersion: "S2_PROSPECTIVE_COLLECTOR_WORKFLOW_PREFLIGHT_V0_1",
      observedAt: now().toISOString(),
      repository,
      workflowFile: file,
      state: "SOURCE_ERROR",
      httpStatus: Number(response.status),
      workflowActive: false,
      preflightEligible: false,
      externalMutationPerformed: false,
    });
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    return deepFreeze({
      receiptVersion: "S2_PROSPECTIVE_COLLECTOR_WORKFLOW_PREFLIGHT_V0_1",
      observedAt: now().toISOString(),
      repository,
      workflowFile: file,
      state: "INVALID_PAYLOAD",
      httpStatus: Number(response.status),
      workflowActive: false,
      preflightEligible: false,
      externalMutationPerformed: false,
    });
  }

  const pathMatches = payload?.path === expectedPath;
  const nameMatches = payload?.name === expectedName;
  const stateActive = payload?.state === "active";
  const preflightEligible = pathMatches && nameMatches && stateActive;

  return deepFreeze({
    receiptVersion: "S2_PROSPECTIVE_COLLECTOR_WORKFLOW_PREFLIGHT_V0_1",
    observedAt: now().toISOString(),
    repository,
    workflowFile: file,
    state: preflightEligible ? "READY" : "WORKFLOW_NOT_ELIGIBLE",
    httpStatus: Number(response.status),
    workflowId: Number.isFinite(Number(payload?.id)) ? Number(payload.id) : null,
    workflowName: typeof payload?.name === "string" ? payload.name : null,
    workflowPath: typeof payload?.path === "string" ? payload.path : null,
    workflowState: typeof payload?.state === "string" ? payload.state : null,
    pathMatches,
    nameMatches,
    workflowActive: stateActive,
    preflightEligible,
    externalMutationPerformed: false,
  });
}

export async function runProspectiveCollectorWorkflowReadOnlyCheck({
  repo,
  token,
  apiBase,
  outputPath,
  fetchImpl,
  now,
} = {}) {
  const receipt = await checkProspectiveCollectorWorkflowReadOnly({
    repo,
    token,
    apiBase,
    fetchImpl,
    now,
  });
  if (outputPath) {
    const absolute = resolve(outputPath);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, JSON.stringify(receipt, null, 2) + "\n", "utf8");
  }
  return receipt;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const receipt = await runProspectiveCollectorWorkflowReadOnlyCheck({
    repo: args.repo || process.env.GITHUB_REPOSITORY,
    token: process.env.GITHUB_TOKEN,
    apiBase: args["api-base"],
    outputPath: args.output,
  });

  console.log(JSON.stringify({
    result: receipt.preflightEligible ? "PASS" : "FAIL",
    receiptVersion: receipt.receiptVersion,
    workflowState: receipt.workflowState,
    pathMatches: receipt.pathMatches,
    nameMatches: receipt.nameMatches,
    workflowActive: receipt.workflowActive,
    preflightEligible: receipt.preflightEligible,
    externalMutationPerformed: false,
  }, null, 2));

  if (!receipt.preflightEligible) process.exitCode = 1;
}

const isMain = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main().catch((error) => {
    console.error(error?.stack || String(error));
    process.exitCode = 1;
  });
}
