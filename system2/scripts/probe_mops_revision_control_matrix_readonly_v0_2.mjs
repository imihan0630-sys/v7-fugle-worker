import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { probeMopsovDirectHistoryV0_1 } from "../runtime/mopsov_direct_history_source_v0_1.mjs";
import {
  MOPS_REVISION_CONTROLS_V0_2,
  summarizeMopsRevisionControlMatrixV0_2,
} from "../runtime/mops_revision_control_matrix_v0_2.mjs";

function curlFetch(url, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const args = [
    "--silent", "--show-error", "--location",
    "--max-time", "30",
    "--request", method,
  ];
  for (const [name, value] of Object.entries(options.headers || {})) {
    args.push("--header", name + ": " + value);
  }
  if (options.body != null) args.push("--data-binary", String(options.body));
  args.push(
    "--write-out",
    "\n__MOPS_HTTP_STATUS__:%{http_code}\n__MOPS_CONTENT_TYPE__:%{content_type}\n",
    String(url),
  );

  const p = spawnSync("curl", args, {
    encoding: "utf8",
    maxBuffer: 24 * 1024 * 1024,
  });
  if (p.error) throw p.error;
  if (p.status !== 0) throw new Error("curl exit " + p.status + ": " + String(p.stderr || "").slice(0, 500));

  const marker = "\n__MOPS_HTTP_STATUS__:";
  const pos = p.stdout.lastIndexOf(marker);
  if (pos < 0) throw new Error("curl response metadata marker missing");
  const body = p.stdout.slice(0, pos);
  const meta = p.stdout.slice(pos + 1);
  const status = Number(meta.match(/__MOPS_HTTP_STATUS__:(\d+)/)?.[1] || 0);
  const contentType = meta.match(/__MOPS_CONTENT_TYPE__:(.*)/)?.[1]?.trim() || null;

  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get(name) {
        return String(name || "").toLowerCase() === "content-type" ? contentType : null;
      },
    },
    text: async () => body,
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const results = [];
for (let index = 0; index < MOPS_REVISION_CONTROLS_V0_2.length; index += 1) {
  const control = MOPS_REVISION_CONTROLS_V0_2[index];
  const args = {
    stockCode: control.stockCode,
    rocYear: control.rocYear,
    month: control.month,
    expectedDate: control.expectedDate,
    baseSubject: control.baseSubject,
  };

  const primary = await probeMopsovDirectHistoryV0_1(args);
  let result = primary;
  let transportUsed = "MOPSOV_NODE_FETCH";

  if (
    primary.state === "DIRECT_HISTORY_TRANSPORT_ERROR" ||
    (primary.state === "MOPSOV_DIRECT_HISTORY_NOT_READY" && primary.historyHttpStatus === 307)
  ) {
    await sleep(750);
    result = await probeMopsovDirectHistoryV0_1({
      ...args,
      fetchImpl: curlFetch,
    });
    transportUsed = "MOPSOV_CURL_FALLBACK";
  }

  results.push({
    controlId: control.id,
    primaryTransportState: primary.state,
    primaryTransportError: primary.error || null,
    transportUsed,
    ...result,
  });

  if (index < MOPS_REVISION_CONTROLS_V0_2.length - 1) await sleep(750);
}

const summary = summarizeMopsRevisionControlMatrixV0_2(results);

assert.equal(summary.revisionCoverageComplete, false);
assert.equal(summary.boundedIntervalCoverageComplete, false);
assert.equal(summary.actionFamilyCoverageComplete, false);
assert.equal(summary.cancellationHistoryComplete, false);
assert.equal(summary.technicalContinuityCertified, false);
assert.equal(summary.historyMutationPerformed, false);
assert.equal(summary.selectionAuthority, false);
assert.equal(summary.system1RuntimeUsed, false);

console.log(JSON.stringify({
  result: summary.state,
  summary,
  rawControls: results.map((x) => ({
    controlId: x.controlId,
    primaryTransportState: x.primaryTransportState,
    primaryTransportError: x.primaryTransportError,
    transportUsed: x.transportUsed,
    state: x.state,
    error: x.error || null,
    gatewayHttpStatus: x.gatewayHttpStatus ?? null,
    historyHttpStatus: x.historyHttpStatus ?? null,
    parsed: x.parsed,
  })),
}, null, 2));
