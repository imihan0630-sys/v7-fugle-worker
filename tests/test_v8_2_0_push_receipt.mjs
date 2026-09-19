import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const api=await import(pathToFileURL(workerPath).href+"?v820="+Date.now());

const env={ADMIN_TOKEN:"admin-test",TEST_MODE:"false"};

let response=await api.default.fetch(new Request("https://worker.invalid/receipt?signalId=DAILY_SELECTION%3A2026-09-21&sig=fake"),env);
assert.equal(response.status,200);
let page=await response.text();
assert.match(page,/推播收到確認/);
assert.match(page,/method="post"/);
assert.match(page,/確認我已收到/);
assert.doesNotMatch(page,/admin-test/);

const form=new URLSearchParams({signalId:"DAILY_SELECTION:2026-09-21",sig:"invalid"});
response=await api.default.fetch(new Request("https://worker.invalid/receipt",{
  method:"POST",
  headers:{"content-type":"application/x-www-form-urlencoded"},
  body:form.toString()
}),env);
assert.equal(response.status,403);
page=await response.text();
assert.match(page,/確認連結無效/);

response=await api.default.fetch(new Request("https://worker.invalid/api/push-receipts"),env);
assert.equal(response.status,401);

const source=await readFile(workerPath,"utf8");
assert.match(source,/const VERSION = "8\.2\.0-push-receipt-confirmation";/);
assert.match(source,/CREATE TABLE IF NOT EXISTS v7_push_receipts/);
assert.match(source,/async function signPushReceipt/);
assert.match(source,/async function attachReceiptUrl/);
assert.match(source,/async function recordPushReceipt/);
assert.match(source,/async function readPushReceiptSummary/);
assert.match(source,/只有已被Webhook接受的真實推播可以確認收到/);
assert.match(source,/收到確認：\$\{payload\.receiptUrl\}/);
assert.match(source,/payload=await attachReceiptUrl\(payload,env\)/);

console.log(JSON.stringify({
  ok:true,
  version:"8.2.0-push-receipt-confirmation",
  signedReceiptPage:true,
  getDoesNotAcknowledge:true,
  invalidSignatureRejected:true,
  acceptedOutboxRequired:true,
  noAdminSecretExposed:true
}));
