import assert from "node:assert/strict";
import {classifyPositiveSignalPlanLinkage} from "../research/positive_signal_plan_linkage_v0_1.mjs";

const signal={event_id:"2026-10-02:2454:NONE:BUY:episode-1",signal_type:"BUY",symbol:"2454",plan_scan_date:"2026-10-01"};

let x=classifyPositiveSignalPlanLinkage({
  signal,
  journalDay:{scan_date:"2026-10-01"},
  journalPlans:[{scan_date:"2026-10-01",symbol:"2454"}],
  scanStatus:{scanDate:"2026-10-01",stocks:[{symbol:"2454"}]},
  configStocks:[{symbol:"2454",closeDate:"2026-10-01"}]
});
assert.equal(x.status,"D1_JOURNAL_PLAN_LINKED");
assert.equal(x.attributionEligible,true);

x=classifyPositiveSignalPlanLinkage({
  signal,
  journalDay:null,
  journalPlans:[],
  scanStatus:{scanDate:"2026-10-01",stocks:[{symbol:"2454"}]},
  configStocks:[{symbol:"2454",closeDate:"2026-10-01"}]
});
assert.equal(x.status,"CROSS_STORE_PLAN_PRESENT_D1_JOURNAL_MISSING");
assert.equal(x.attributionEligible,false);
assert.equal(x.evidence.scanStatus,true);

x=classifyPositiveSignalPlanLinkage({
  signal,
  journalDay:null,
  journalPlans:[],
  scanStatus:{scanDate:"2026-09-21",stocks:[{symbol:"3006"}]},
  configStocks:[{symbol:"2454",closeDate:"2026-10-01"}]
});
assert.equal(x.status,"CURRENT_CONFIG_MATCH_ONLY_D1_JOURNAL_MISSING");

x=classifyPositiveSignalPlanLinkage({signal,journalDay:null,journalPlans:[],scanStatus:null,configStocks:[]});
assert.equal(x.status,"POSITIVE_SIGNAL_UNATTRIBUTED_TO_PLAN");

assert.equal(classifyPositiveSignalPlanLinkage({signal:{signal_type:"SELL"}}).status,"UNKNOWN");

console.log(JSON.stringify({ok:true,rule:"positive BUY signal existence is distinct from plan-attribution eligibility; exact LAST_SCAN can prove a cross-store plan even when D1 journal linkage is missing"},null,2));
