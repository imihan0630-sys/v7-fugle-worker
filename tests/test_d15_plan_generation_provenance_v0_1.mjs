import assert from "node:assert/strict";
import {classifyPlanGenerationProvenance} from "../research/d15_plan_generation_provenance_v0_1.mjs";

let x=classifyPlanGenerationProvenance({
 planDate:"2026-09-18",
 d1JournalDay:{scan_date:"2026-09-18"},
 d1JournalPlans:[{scan_date:"2026-09-18"},{scan_date:"2026-09-18"}]
});
assert.equal(x.status,"D1_JOURNAL_CERTIFIED_MULTI_NAME");
assert.equal(x.cleanIndependentDate,true);

x=classifyPlanGenerationProvenance({
 planDate:"2026-09-29",
 lastScan:{scanDate:"2026-09-29",selectedCount:2,status:"歷史恢復已完成選股寫入｜非千元Formal 2/3",stocks:[{},{}]}
});
assert.equal(x.status,"STAGED_HISTORICAL_RECOVERY_KV_PLAN");
assert.equal(x.cleanIndependentDate,false);

x=classifyPlanGenerationProvenance({
 planDate:"2026-10-01",
 currentConfig:{updatedAt:"2026-10-01T15:45:29.639Z",stocks:[{symbol:"2454",closeDate:"2026-10-01"}]},
 recoveryEvidence:{
   marketDate:"2026-10-01",
   postStartedAt:"2026-10-01T15:44:25.124Z",
   postFailedAt:"2026-10-01T15:45:35.494Z",
   result:"UNCONFIRMED_503_NO_RETRY"
 }
});
assert.equal(x.status,"AMBIGUOUS_PARTIAL_SCAN_SIDE_EFFECT");
assert.equal(x.cleanIndependentDate,false);

x=classifyPlanGenerationProvenance({
 planDate:"2026-10-01",
 currentConfig:{updatedAt:"2026-10-01T15:45:29.639Z",stocks:[{symbol:"2454",closeDate:"2026-10-01"}]}
});
assert.equal(x.status,"MUTABLE_CONFIG_PLAN_ORIGIN_UNPROVEN");

assert.equal(classifyPlanGenerationProvenance({planDate:"2026-10-03"}).status,"NO_PLAN_EVIDENCE");

console.log(JSON.stringify({ok:true,contract:"D15 generation provenance tiers prevent recovery/config side effects from being pooled with ordinary D1-journal-certified dates"},null,2));
