import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workflow=await readFile(new URL("../.github/workflows/system1-c1-evidence.yml",import.meta.url),"utf8");

assert.match(workflow,/name: System 1 C1 Prospective Evidence/);
assert.match(workflow,/push:\n\s+branches: \[main\]/);
assert.match(workflow,/schedule:\n\s+- cron: "10 16 \* \* 1-5"/);

const liveBlock=workflow.slice(
  workflow.indexOf("- name: Read and verify the immutable C1 population receipt"),
  workflow.indexOf("- name: Preserve approved research evidence")
);
assert.match(liveBlock,/if: github\.event_name != 'push'/);
assert.match(liveBlock,/V7_ADMIN_TOKEN:/);
assert.match(liveBlock,/FORMAL_C1_BINDING_OUTPUT: artifacts\/system1-formal-c1-binding\.json/);

const uploadBlock=workflow.slice(workflow.indexOf("- name: Preserve approved research evidence"));
assert.match(uploadBlock,/if: always\(\) && github\.event_name != 'push'/);
assert.match(uploadBlock,/artifacts\/system1-formal-c1-binding\.json/);

assert.match(workflow,/Validate V8\.19 generation inventory semantics/);
assert.match(workflow,/Validate V8\.20 Formal-C1 binding readback semantics/);

console.log(JSON.stringify({
  ok:true,
  pushMode:"STATIC_VALIDATION_ONLY",
  scheduleMode:"LIVE_EVIDENCE",
  workflowDispatchMode:"LIVE_EVIDENCE",
  falseHistoricalFailurePrevented:true,
  formalCoreImpact:false
}));
