import assert from "node:assert/strict";
import {
  checkProspectiveCollectorWorkflowReadOnly,
} from "../scripts/check_prospective_collector_workflow_readonly.mjs";

function response(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return payload; },
  };
}

const ready = await checkProspectiveCollectorWorkflowReadOnly({
  repo: "owner/repo",
  token: "fixture-token",
  apiBase: "https://api.example.test",
  fetchImpl: async (url, options) => {
    assert.equal(
      url,
      "https://api.example.test/repos/owner/repo/actions/workflows/system2-prospective-clock-evidence-readonly.yml",
    );
    assert.equal(options.method, "GET");
    assert.equal(options.headers.authorization, "Bearer fixture-token");
    return response({
      id: 123,
      name: "System2 Prospective Clock Evidence Read-only",
      path: ".github/workflows/system2-prospective-clock-evidence-readonly.yml",
      state: "active",
    });
  },
  now: () => new Date("2026-09-29T04:45:00Z"),
});
assert.equal(ready.state, "READY");
assert.equal(ready.workflowActive, true);
assert.equal(ready.pathMatches, true);
assert.equal(ready.nameMatches, true);
assert.equal(ready.preflightEligible, true);
assert.equal(ready.externalMutationPerformed, false);

const disabled = await checkProspectiveCollectorWorkflowReadOnly({
  repo: "owner/repo",
  token: "fixture-token",
  fetchImpl: async () => response({
    id: 123,
    name: "System2 Prospective Clock Evidence Read-only",
    path: ".github/workflows/system2-prospective-clock-evidence-readonly.yml",
    state: "disabled_manually",
  }),
  now: () => new Date("2026-09-29T04:46:00Z"),
});
assert.equal(disabled.state, "WORKFLOW_NOT_ELIGIBLE");
assert.equal(disabled.workflowActive, false);
assert.equal(disabled.preflightEligible, false);

const wrongPath = await checkProspectiveCollectorWorkflowReadOnly({
  repo: "owner/repo",
  token: "fixture-token",
  fetchImpl: async () => response({
    id: 123,
    name: "System2 Prospective Clock Evidence Read-only",
    path: ".github/workflows/renamed.yml",
    state: "active",
  }),
});
assert.equal(wrongPath.pathMatches, false);
assert.equal(wrongPath.preflightEligible, false);

const transport = await checkProspectiveCollectorWorkflowReadOnly({
  repo: "owner/repo",
  token: "fixture-token",
  fetchImpl: async () => response({}, 503),
});
assert.equal(transport.state, "SOURCE_ERROR");
assert.equal(transport.httpStatus, 503);
assert.equal(transport.preflightEligible, false);

console.log("System2 prospective collector workflow state check tests passed");
