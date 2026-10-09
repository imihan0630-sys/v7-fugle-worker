import assert from "node:assert/strict";
import fs from "node:fs";
import {
  buildSizeStrategyInteractionFrame,
  buildSizeInteractionUnknownFrame,
  sha256
} from "../research/d18_06_size_strategy_interaction_l3_v0_1.mjs";

let passed=0;
function test(name,fn){
  try{fn();passed++;console.log("PASS",name);}
  catch(e){console.error("FAIL",name,e?.stack||e);process.exitCode=1;}
}
function throws(name,fn,pat){test(name,()=>assert.throws(fn,pat));}

const realReceipt=JSON.parse(fs.readFileSync(new URL("../research/br037_size_leadership_receipt_20261001_v0_1.json",import.meta.url),"utf8"));
const strategyDay={
  market:"TW",
  marketDate:"2026-10-02",
  decisionTimestamp:"2026-10-02T08:10:00.000Z",
  strategyId:"SHORT_MOMENTUM",
  strategyVersion:"V0.1-CONTRACT",
  frameHash:"a".repeat(64)
};

test("SZ-T01 real D09-08 receipt builds deterministic D18-06 frame",()=>{
  const a=buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:realReceipt,horizon:"D1",producerBlobSha:"blob-br037"});
  const b=buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:realReceipt,horizon:"D1",producerBlobSha:"blob-br037"});
  assert.equal(a.frameHash,b.frameHash);
  assert.equal(a.producerDomain,"D09-08");
  assert.equal(a.sizeState,"LARGE_LED");
  assert.equal(a.commonBasis,"TOTAL_RETURN_INDEX");
  assert.equal(a.currentOrFutureStockOutcomeAccessed,false);
  assert.equal(a.policyValueEvaluated,false);
  assert.equal(a.formalCoreChanged,false);
  assert.equal(a.producerContentHash,sha256(realReceipt));
});
test("SZ-T02 D5 state is horizon-specific and not universal risk-on",()=>{
  const x=buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:realReceipt,horizon:"D5"});
  assert.equal(x.sizeState,"SMALL_MID_LED");
  assert.equal(x.permanentRiskOnLabelAssigned,false);
});
throws("SZ-T03 post-decision producer receipt rejected",()=>{
  buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:{...realReceipt,capturedAt:"2026-10-02T17:00:00+08:00"},horizon:"D1"});
},/SIZE_RECEIPT_AFTER_DECISION/);
throws("SZ-T04 future producer trade date rejected",()=>{
  buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:{...realReceipt,asOfTradeDate:"2026-10-03"},horizon:"D1"});
},/SIZE_RECEIPT_FROM_FUTURE_DATE/);
throws("SZ-T05 non-outcome-blind producer rejected",()=>{
  buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:{...realReceipt,mode:"RETROSPECTIVE"},horizon:"D1"});
},/SIZE_RECEIPT_MODE_INVALID/);
throws("SZ-T06 future stock outcomes opened rejected",()=>{
  buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:{...realReceipt,futureStockOutcomesOpened:true},horizon:"D1"});
},/SIZE_RECEIPT_FUTURE_OUTCOME_OPENED/);
throws("SZ-T07 missing one size leg rejected",()=>{
  const bad=structuredClone(realReceipt); delete bad.indexSeries.small;
  buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:bad,horizon:"D1"});
},/SIZE_RECEIPT_THREE_LEGS_REQUIRED/);
throws("SZ-T08 invalid horizon rejected",()=>{
  buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:realReceipt,horizon:"D3"});
},/HORIZON_NOT_FROZEN/);
throws("SZ-T09 missing horizon return rejected",()=>{
  const bad=structuredClone(realReceipt); delete bad.returnsPct.D20;
  buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:bad,horizon:"D20"});
},/SIZE_HORIZON_NOT_AVAILABLE/);
throws("SZ-T10 wrong market rejected",()=>{
  buildSizeStrategyInteractionFrame({strategyDay:{...strategyDay,market:"US"},sizeReceipt:realReceipt,horizon:"D1"});
},/STRATEGY_DAY_MARKET_MUST_BE_TW/);
test("SZ-T11 explicit unknown frame preserves fail-closed semantics",()=>{
  const x=buildSizeInteractionUnknownFrame({strategyDay,reason:"SIZE_PRODUCER_NOT_AVAILABLE",producerReceiptId:null});
  assert.equal(x.disposition,"DATA_UNKNOWN");
  assert.equal(x.sizeState,null);
  assert.equal(x.policyActionApplied,false);
  assert.equal(x.currentOrFutureStockOutcomeAccessed,false);
});
test("SZ-T12 source mutation changes producer and frame hashes",()=>{
  const a=buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:realReceipt,horizon:"D1"});
  const changed=structuredClone(realReceipt);
  changed.indexSeries.large.asOfValue+=0.01;
  const b=buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:changed,horizon:"D1"});
  assert.notEqual(a.producerContentHash,b.producerContentHash);
  assert.notEqual(a.frameHash,b.frameHash);
});
test("SZ-T13 strategy identity mutation changes frame hash",()=>{
  const a=buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:realReceipt,horizon:"D1"});
  const b=buildSizeStrategyInteractionFrame({strategyDay:{...strategyDay,strategyVersion:"V0.2-TEST"},sizeReceipt:realReceipt,horizon:"D1"});
  assert.notEqual(a.frameHash,b.frameHash);
});
test("SZ-T14 exact replay is insensitive to JSON key order",()=>{
  const reordered=JSON.parse(JSON.stringify(realReceipt));
  const a=buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:realReceipt,horizon:"D1"});
  const b=buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt:reordered,horizon:"D1"});
  assert.equal(a.frameHash,b.frameHash);
});

if(process.exitCode) process.exit(process.exitCode);
console.log(`D18-06 size-strategy L3 suite PASS: ${passed} tests`);
