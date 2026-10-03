import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3 } from "../runtime/decision_clock_collector_contract_v0_3.mjs";

const workflowPath=".github/workflows/d04-a2-eod-diagnostic-readonly.yml";
const modulePath="research/runtime/d04_a2_eod_diagnostic_v0_1.mjs";
const workflow=await readFile(new URL("../../"+workflowPath,import.meta.url),"utf8");
const moduleText=await readFile(new URL("../../"+modulePath,import.meta.url),"utf8");

assert.match(workflow,/name: D04 A2 TAIEX EOD Diagnostic Read-only/);
assert.match(workflow,/cron: "30 8 \* \* 1-5"/);
assert.match(workflow,/permissions:\s*\n\s*contents: read/);
assert.match(workflow,/check_twse_trading_day_readonly\.mjs/);
assert.match(workflow,/d04_a2_eod_diagnostic_v0_1\.mjs/);
assert.match(workflow,/retention-days: 90/);
assert.doesNotMatch(workflow,/secrets\./i);
assert.doesNotMatch(workflow,/wrangler\s+(deploy|delete)|d1\s+(create|execute)/i);
assert.doesNotMatch(workflow,/SYSTEM2_CAPTURE_ENABLED\s*=\s*true/i);
assert.doesNotMatch(workflow,/system2-prospective-clock-evidence-readonly\.yml/);

assert.equal(DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3.includes(workflowPath),false);
assert.equal(DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3.includes(modulePath),false);
assert.equal(DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3.length,13);

assert.doesNotMatch(moduleText,/\.prepare\(|wrangler|scoreCandidate|BUY_RESONANCE|notify|env\.SYSTEM2|d1[\\s_.-]*(create|execute|prepare)/i);
assert.match(moduleText,/pointInTimeDecisionEligible:false/);
assert.match(moduleText,/promotionGradeProspectiveDateCount:0/);
assert.match(moduleText,/S2_DECISION_CLOCK_COLLECTOR_CONTRACT_V0_3_UNCHANGED/);
assert.match(moduleText,/SEPARATE_RESEARCH_EOD_EPOCH/);

console.log("D04 A2 EOD diagnostic epoch guard tests passed");
