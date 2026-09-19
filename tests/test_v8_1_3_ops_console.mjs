import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const api=await import(pathToFileURL(workerPath).href+"?v813="+Date.now());

const response=await api.default.fetch(new Request("https://worker.invalid/admin"),{TEST_MODE:"false"});
assert.equal(response.status,200);
const page=await response.text();
assert.match(page,/實際持股／成交回填/);
assert.match(page,/外部 App 交叉驗證/);
assert.match(page,/\/api\/positions/);
assert.match(page,/\/api\/external-validation/);
assert.match(page,/\/api\/external-validation\/stats/);
assert.match(page,/不會改買區、停損、資金配置、3Min或推播/);

const workerSource=await readFile(workerPath,"utf8");
assert.match(workerSource,/const VERSION = "8\.1\.3-ops-console-acceptance";/);
assert.match(workerSource,/report=\{\.\.\.report,signalId:dailyPayload\.signalId/);
assert.match(workerSource,/selectedCount:dailyPayload\.selectedCount,checkedAt:new Date\(\)\.toISOString\(\)/);

const health=await readFile(new URL("./scheduled_health.mjs",import.meta.url),"utf8");
assert.match(health,/DAILY_SELECTION:\$\{date\}/);
assert.match(health,/Daily after-market report missing from durable outbox/);
assert.match(health,/Actual intraday notification missing from durable outbox/);
assert.match(health,/delivery_state,'ACCEPTED'/);

console.log(JSON.stringify({
  ok:true,
  adminOpsConsole:true,
  positionReconciliationUi:true,
  externalValidationUi:true,
  dailySignalIdentityPersisted:true,
  scheduledHealthChecksDailyOutbox:true,
  scheduledHealthChecksIntradayOutbox:true
}));
