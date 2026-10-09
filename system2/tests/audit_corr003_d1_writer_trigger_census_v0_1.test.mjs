import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// AUDIT_LANE observational dynamic inventory. PASS means the scan and its
// falsification probes ran; it does NOT mean push-to-D1 or global budget is safe.
// The workflow group serializes concurrent jobs, NOT the account-wide UTC-day
// rowsWritten/rowsRead quota across System 1 and System 2.
const root = fileURLToPath(new URL("../../.github/workflows/", import.meta.url));
const filenames = readdirSync(root).filter(x => /\.ya?ml$/i.test(x)).sort();
assert.ok(filenames.length > 0, "workflow directory must be available");

function eventNames(source) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex(x => /^on:\s*(?:#.*)?$/.test(x));
  if (start < 0) return null; // fail closed: unknown YAML event syntax
  const found = [];
  for (const line of lines.slice(start + 1)) {
    if (line && !/^\s|^#/.test(line)) break;
    const match = /^\s{2}(push|schedule|workflow_dispatch|workflow_run|pull_request|pull_request_target):(?:\s|$)/.exec(line);
    if (match) found.push(match[1]);
  }
  return [...new Set(found)];
}

const physicalEntry = /(?:node\s+system2\/(?:deploy\/(?:provision_system2_d1|ensure_system2_d1_ready)|scripts\/(?:persist_official_historical_a1_smoke_d1_v0_1|historical_pack_real_source_smoke_v0_1|run_daily_shadow_hot_history_bootstrap|historical_current_year_segment_backfill_v0_1|run_recent_a1_hot_history_warmup_v0_1|run_daily_shadow_diagnostic|run_daily_shadow_fugle_hot_history_bootstrap|historical_pack_year_backfill_v0_1|historical_d1_bounded_smoke|historical_tpex_2021_revision_overlay_v0_1))\.mjs|wrangler(?:@[^ ]+)?\s+--\s+deploy)/;
function classify(path, source) {
  const events = eventNames(source);
  const sharedWriterGroup = /^\s*group:\s*system2-isolated-d1-writer\s*$/m.test(source);
  const hasSystem2Credentials = /SYSTEM2_CLOUDFLARE_API_TOKEN/.test(source);
  const declaredExecutionEntrypoint = physicalEntry.test(source);
  const unknownEventSyntax = events === null;
  const push = events?.includes("push") ?? false;
  const schedule = events?.includes("schedule") ?? false;
  const reservationsInWorkflow = /(?:ACCOUNT_WIDE_D1_RESERVATION_GRANTED|D1_RESERVATION_GRANT|D1_QUOTA_RESERVATION_TOKEN)/.test(source);
  return {
    path, events: events ?? ["UNPARSEABLE_TRIGGER"],
    sharedWriterGroup, hasSystem2Credentials, declaredExecutionEntrypoint,
    push, schedule, unknownEventSyntax,
    pushWriterExposure: (push || unknownEventSyntax) && sharedWriterGroup && declaredExecutionEntrypoint,
    ungroupedPhysicalEntrypoint: hasSystem2Credentials && declaredExecutionEntrypoint && !sharedWriterGroup,
    reservationProofObservedAtWorkflowLevel: reservationsInWorkflow,
  };
}

const rows = filenames.map(name => {
  const path = ".github/workflows/" + name;
  return classify(path, readFileSync(root + name, "utf8"));
});
const cohort = rows.filter(x => x.sharedWriterGroup);
assert.ok(cohort.length > 0, "isolated D1 writer registry missing");
assert.equal(new Set(cohort.map(x => x.path)).size, cohort.length);
const pushWriters = cohort.filter(x => x.pushWriterExposure);
const ungrouped = rows.filter(x => x.ungroupedPhysicalEntrypoint);
const unknownTriggers = rows.filter(x => x.unknownEventSyntax && (x.sharedWriterGroup || x.hasSystem2Credentials));
// Negative controls: the scanner must notice a dangerous push being introduced,
// and the loss of the concurrency group, and must not mistake manual for push.
const fixture = [
  "name: synthetic", "on:", "  workflow_dispatch:",
  "permissions: {}", "concurrency:", "  group: system2-isolated-d1-writer",
  "jobs:", "  check:", "    runs-on: ubuntu-latest",
  "    steps:", "      - run: node system2/deploy/provision_system2_d1.mjs",
  "        env:", "          SYSTEM2_CLOUDFLARE_API_TOKEN: ${{ secrets.TEST_TOKEN }}",
].join("\n");
assert.equal(classify("fixture/manual.yml", fixture).pushWriterExposure, false);
const pushFixture = fixture.replace("  workflow_dispatch:", "  push:\n  workflow_dispatch:");
assert.equal(classify("fixture/push.yml", pushFixture).pushWriterExposure, true);
const lostGroup = pushFixture.replace("group: system2-isolated-d1-writer", "group: untracked");
assert.equal(classify("fixture/ungrouped.yml", lostGroup).ungroupedPhysicalEntrypoint, true);
assert.equal(eventNames("name: unknown\non: [push, workflow_dispatch]"), null,
  "unhandled YAML trigger forms must not be silently counted as no-push");
assert.equal(classify("fixture/inline-on.yml", pushFixture.replace("on:\n  push:\n  workflow_dispatch:", "on: [push, workflow_dispatch]")).pushWriterExposure, true,
  "unparsed on: syntax must be conservatively flagged as a writer exposure");

for (const row of cohort) {
  console.log("SYSTEM2_AUDIT_CORR003_WRITER " + JSON.stringify(row));
}
for (const row of ungrouped) {
  console.log("SYSTEM2_AUDIT_CORR003_UNGROUPED_CANDIDATE " + JSON.stringify(row));
}
console.log("SYSTEM2_AUDIT_CORR003_SUMMARY " + JSON.stringify({
  workflowFilesEnumerated: rows.length,
  sharedWriterWorkflows: cohort.length,
  pushEntrypointExposureCount: pushWriters.length,
  pushEntrypointPaths: pushWriters.map(x => x.path),
  ungroupedCandidateCount: ungrouped.length,
  ungroupedCandidatePaths: ungrouped.map(x => x.path),
  unknownTriggerCandidatePaths: unknownTriggers.map(x => x.path),
  globalDailyBudgetPhysicallyVerified: false,
  status: "OBSERVATIONAL_AUDIT_ONLY_CORR003_STILL_OPEN",
  auditProbePassed: true,
  safeToMutateD1: false,
  ownerAuthorityGranted: false,
}));
