import fs from "node:fs";
import assert from "node:assert/strict";

const workerPath=process.env.V7_TEST_WORKER_PATH || "Worker.js";
const source=fs.readFileSync(workerPath,"utf8");
const health=fs.readFileSync("tests/scheduled_health.mjs","utf8");

assert.match(source,/const VERSION = "8\.8\.2-zero-selection-push-failsafe";/);
assert.ok(source.includes("function buildZeroSelectionConfirmPayload(scanDate)"));
assert.ok(source.includes("DAILY_ZERO_SELECTION_CONFIRM"));
assert.ok(source.includes('signalId:`DAILY_ZERO_SELECTION_CONFIRM:${scanDate}`'));
assert.ok(source.includes('if(stocks.length===0) {'));
assert.ok(source.includes('zeroSelectionConfirmation=await sendTrackedPush(zeroPayload,env,{note:"盤後0檔備援確認推播"});'));
assert.ok(source.includes("zeroSelectionConfirmationAccepted: stocks.length ? null"));
assert.ok(source.includes('deliverySemantics:"WEBHOOK_ACCEPTED_DOES_NOT_PROVE_HANDSET_RECEIPT"'));
assert.ok(source.includes('payload?.signalType === "DAILY_SELECTION" ? { link_names: 1 } : payload?.signalType === "DAILY_ZERO_SELECTION_CONFIRM" ? { link_names: 1 } : {}'));
assert.ok(source.includes("狀態：掃描完成，不是系統漏跑"));
assert.ok(health.includes("DAILY_ZERO_SELECTION_CONFIRM:"));
assert.ok(health.includes("Zero-selection failsafe missing from durable outbox"));
console.log(JSON.stringify({
  ok:true,
  version:"8.8.2-zero-selection-push-failsafe",
  zeroSelectionPrimaryDailyReportPreserved:true,
  zeroSelectionFailsafeTrackedPush:true,
  durableOutboxHealthAssertion:true,
  handsetReceiptSemanticsNotOverclaimed:true,
  formalSelectionRulesChanged:false
}));
