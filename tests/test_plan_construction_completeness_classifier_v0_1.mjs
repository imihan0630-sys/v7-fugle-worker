import assert from "node:assert/strict";
import {classifyPlanConstructionCompleteness,PLAN_CONSTRUCTION_STATE} from "../research/plan_construction_completeness_classifier_v0_1.mjs";

const R="2026-09-25T10:15:22.123Z";
const stocks=[
  {symbol:"1111",planDate:"2026-09-29",channel:"A",mode:"PULLBACK",buyLow:90,buyHigh:92,stop:86,breakout:null,maxChase:null},
  {symbol:"2222",planDate:"2026-09-29",channel:"B",mode:"MOMENTUM",buyLow:200,buyHigh:205,stop:192,breakout:201,maxChase:205}
];
const scan={dryRun:false,scanDate:"2026-09-25",selectedCount:2,stocks,
  journal:{stored:true,verified:true,scanDate:"2026-09-25",selectedCount:2,recordedAt:R}};
const health={configured:true,ok:true,scanDate:"2026-09-25",selectedCount:2,planCount:2,updatedAt:R};
const journalRead={planRows:[
  {scan_date:"2026-09-25",plan_date:"2026-09-29",symbol:"1111",buy_low:90,buy_high:92,stop:86,breakout:null,max_chase:null,recorded_at:R},
  {scan_date:"2026-09-25",plan_date:"2026-09-29",symbol:"2222",buy_low:200,buy_high:205,stop:192,breakout:201,max_chase:205,recorded_at:R}
]};

assert.equal(classifyPlanConstructionCompleteness({scan, journalHealth:health, journalRead}).state,
  PLAN_CONSTRUCTION_STATE.COMPLETE);

const zeroScan={...scan,selectedCount:0,stocks:[],journal:{...scan.journal,selectedCount:0}};
const zeroHealth={...health,selectedCount:0,planCount:0};
assert.equal(classifyPlanConstructionCompleteness({scan:zeroScan,journalHealth:zeroHealth,journalRead:{planRows:[]}}).state,
  PLAN_CONSTRUCTION_STATE.ZERO_COMPLETE);

// Later same-date rerun/backfill changed D1 generation but LAST_SCAN still carries the older receipt.
assert.equal(classifyPlanConstructionCompleteness({
  scan,journalHealth:{...health,updatedAt:"2026-09-25T10:20:00.000Z"},journalRead
}).state,PLAN_CONSTRUCTION_STATE.UNKNOWN);

// Staged recovery spreads a dry-run journal receipt; it must never masquerade as system-recorded Formal completeness.
assert.equal(classifyPlanConstructionCompleteness({
  scan:{...scan,journal:{stored:false,simulated:true}},journalHealth:health,journalRead
}).state,PLAN_CONSTRUCTION_STATE.UNKNOWN);

// Positive same-run journal failure is observable incompleteness, not UNKNOWN.
assert.equal(classifyPlanConstructionCompleteness({
  scan:{...scan,journal:{stored:false,verified:false,scanDate:scan.scanDate}},journalHealth:health,journalRead
}).state,PLAN_CONSTRUCTION_STATE.INCOMPLETE);

// A bounded reader returning fewer rows than the exact-date health count is reader uncertainty, not a plan failure.
assert.equal(classifyPlanConstructionCompleteness({
  scan,journalHealth:health,journalRead:{planRows:journalRead.planRows.slice(0,1)}
}).state,PLAN_CONSTRUCTION_STATE.UNKNOWN);

// Same-generation value mismatch is positive inconsistency.
const badRows=structuredClone(journalRead);
badRows.planRows[1].buy_high=206;
assert.equal(classifyPlanConstructionCompleteness({scan,journalHealth:health,journalRead:badRows}).state,
  PLAN_CONSTRUCTION_STATE.INCOMPLETE);

// A-channel breakout/maxChase may be null; B-channel breakout/maxChase may not.
const badB=structuredClone(scan);
badB.stocks[1].breakout=null;
assert.equal(classifyPlanConstructionCompleteness({scan:badB,journalHealth:health,journalRead}).state,
  PLAN_CONSTRUCTION_STATE.INCOMPLETE);

console.log("plan construction completeness classifier v0.1: PASS");
