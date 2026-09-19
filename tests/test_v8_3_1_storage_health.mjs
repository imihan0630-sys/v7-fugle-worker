import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const health=await readFile(new URL("./scheduled_health.mjs",import.meta.url),"utf8");

assert.match(source,/const VERSION = "8\.3\.1-storage-health";/);
for(const marker of [
  'externalPlan:{',
  'planStorageMode:firebaseConfigured(env)?"D1_FIRESTORE":"D1_THREEMIN_COMPAT"',
  '計畫主存＋外部鏡像',
  '計畫鏡像 ${(pipeline.externalPlanVerified===true || pipeline.threeMinVerified===true)?"✅":"⏳"}'
]) assert.ok(source.includes(marker),marker);

for(const marker of [
  "const bridge=scan.planBridge || scan.threeMin;",
  "runtime.readiness?.planStorageMode==='D1_FIRESTORE'",
  "scan.planBridge?.firebase?.verified",
  "Compatibility mode only: verify the existing 3Min record"
]) assert.ok(health.includes(marker),marker);

console.log(JSON.stringify({
  ok:true,
  version:"8.3.1-storage-health",
  dashboardProviderAware:true,
  healthSupportsFirestore:true,
  healthSupportsLegacy3Min:true
}));
