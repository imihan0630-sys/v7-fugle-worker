import assert from "node:assert/strict";
import { classifyHistoricalAnnualResumeStateV0_1 } from "../runtime/historical_annual_resume_preflight_v0_1.mjs";

const manifest=(symbol,bars=10)=>({
  market:"TPEX",symbol,year:2024,price_space:"RAW",bar_count:bars,object_key:`k/${symbol}`,
});

let r=classifyHistoricalAnnualResumeStateV0_1({market:"TPEX",year:2024});
assert.equal(r.state,"CLEAN_START");
assert.equal(r.d1WriteAuthorized,false);

r=classifyHistoricalAnnualResumeStateV0_1({
  market:"TPEX",year:2024,
  checkpoint:{state:"IN_PROGRESS",expected_pack_count:2,expected_bar_count:20,manifest_committed_count:1,object_ready_count:1},
  manifests:[manifest("1234")],
});
assert.equal(r.state,"PARTIAL_RESUME_CANDIDATE");
assert.equal(r.resumeAuthorized,true);

r=classifyHistoricalAnnualResumeStateV0_1({
  market:"TPEX",year:2024,
  receipt:{state:"COMPLETE",pack_count:2,bar_count:20},
  checkpoint:{state:"COMPLETE",expected_pack_count:2,expected_bar_count:20,manifest_committed_count:2,object_ready_count:2},
  manifests:[manifest("1234"),manifest("5678")],
});
assert.equal(r.state,"COMPLETE_RECEIPT_PRESENT");
assert.equal(r.checkpointRepairRequired,false);

r=classifyHistoricalAnnualResumeStateV0_1({
  market:"TPEX",year:2024,
  receipt:{state:"COMPLETE",pack_count:2,bar_count:20},
  checkpoint:{state:"OBJECTS_AND_MANIFESTS_READY",expected_pack_count:2,expected_bar_count:20,manifest_committed_count:2,object_ready_count:2},
  manifests:[manifest("1234"),manifest("5678")],
});
assert.equal(r.state,"COMPLETE_RECEIPT_CHECKPOINT_REPAIR_REQUIRED");
assert.equal(r.checkpointRepairRequired,true);
assert.equal(r.resumeAuthorized,true);

r=classifyHistoricalAnnualResumeStateV0_1({
  market:"TPEX",year:2024,
  checkpoint:{state:"IN_PROGRESS",expected_pack_count:2,expected_bar_count:20,manifest_committed_count:1,object_ready_count:1},
  manifests:[manifest("1234")],
  objectHeadFailures:[{objectKey:"k/1234",reason:"MISSING"}],
});
assert.equal(r.state,"BLOCKED_DURABLE_STATE_INCONSISTENT");
assert.equal(r.resumeAuthorized,false);

console.log("System2 historical annual read-only resume preflight tests passed");
