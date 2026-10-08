import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  INDEXED_READ_AUDIT_DATE,INDEXED_READ_D1_RESET_AT,
  validateIndexedReadAuditClockV0_1,summarizeIndexedReadAuditV0_1,
} from "../scripts/audit_recent60_indexed_d1_read_cost_readonly_v0_1.mjs";

assert.equal(INDEXED_READ_AUDIT_DATE,"2026-10-08");
assert.equal(INDEXED_READ_D1_RESET_AT,"2026-10-09T00:00:00Z");
await assert.rejects(
  async()=>validateIndexedReadAuditClockV0_1({nowAt:"2026-10-08T23:59:59Z"}),
  /WAIT_D1_ROW_READ_QUOTA_RESET/,
);
const after=validateIndexedReadAuditClockV0_1({nowAt:INDEXED_READ_D1_RESET_AT});
assert.equal(after.clockClass,"POST_FACTO_DIAGNOSTIC_NO_ORIGINAL_PIT_ELIGIBILITY");
const basis={
  result:"PASS",databaseName:"system2-research",marketDate:INDEXED_READ_AUDIT_DATE,
  d1Metrics:{requestCount:45,rowsRead:98456,rowsWritten:0},
  preflight:{history:{currentUniverseCount:1972,historyReadyCount:46,continuityReadyCount:0}},
};
const receipt=summarizeIndexedReadAuditV0_1({result:basis,observedAt:"2026-10-09T00:01:00Z"});
assert.equal(receipt.result,"PASS_REAL_D1_READ_COUNT_OBSERVED_NOT_PIT_REPLAY_CERTIFIED");
assert.equal(receipt.measuredD1.rowsRead,98456);
assert.equal(receipt.ordinarySymbolCount,1972);
assert.equal(receipt.historyReadyCount,46);
assert.equal(receipt.continuityReadyCount,0);
assert.equal(receipt.measuredD1.rowsWritten,0);
assert.equal(receipt.pITPromotionAuthorized,false);
assert.equal(receipt.originalTradeDateFirstKnownAtProven,false);
assert.equal(receipt.rowsReadSavingsVsHistoricalBaseline,"UNMEASURED_NOT_COMPARABLE");

for(const invalid of [
  {...basis,databaseName:"v8-production"},
  {...basis,d1Metrics:{...basis.d1Metrics,rowsWritten:1}},
  {...basis,d1Metrics:{...basis.d1Metrics,rowsRead:0}},
  {...basis,preflight:{history:{...basis.preflight.history,currentUniverseCount:25}}},
  {...basis,marketDate:"2026-10-07"},
]){
  assert.throws(()=>summarizeIndexedReadAuditV0_1({
    result:invalid,observedAt:"2026-10-09T00:01:00Z",
  }));
}
const workflow=await readFile(new URL("../../.github/workflows/system2-recent60-indexed-d1-read-cost-readonly.yml",import.meta.url),"utf8");
assert.match(workflow,/^on:\s*\n\s+workflow_dispatch:/m);
assert.doesNotMatch(workflow,/^\s+(push|schedule|pull_request|workflow_run):/m);
assert.match(workflow,/environment: system2-research/);
assert.match(workflow,/permissions:\s*\n\s+contents: read/);
assert.match(workflow,/audit_recent60_indexed_d1_read_cost_readonly_v0_1\.mjs/);
assert.doesNotMatch(workflow,/wrangler\s+(deploy|delete)|provision_system2_d1|CREATE_SYSTEM2_ISOLATED_D1/);
console.log("System2 indexed D1 read-cost post-reset manual audit guards passed");
