import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const health=await readFile(new URL("./scheduled_health.mjs",import.meta.url),"utf8");

{
  const version=source.match(/const VERSION = "(\d+)\.(\d+)\.(\d+)[^"]*";/)?.slice(1,4).map(Number);
  assert.ok(version && (version[0]>8 || (version[0]===8 && (version[1]>3 || (version[1]===3 && version[2]>=1)))),"V8.3.1+ runtime required");
}
for(const marker of [
  'externalPlan:{',
  'planStorageMode:',
  '計畫主存＋外部鏡像',
  '計畫鏡像 ${(pipeline.externalPlanVerified===true || pipeline.threeMinVerified===true)?"✅":"⏳"}'
]) assert.ok(source.includes(marker),marker);

for(const marker of [
  "const bridge=scan.planBridge || scan.threeMin;",
  "runtime.readiness?.planStorageMode==='D1_FIRESTORE'",
  "scan.planBridge?.firebase?.verified",
  "3Min exact readback was not persisted"
]) assert.ok(health.includes(marker),marker);

console.log(JSON.stringify({
  ok:true,
  version:"8.3.1-or-later",
  dashboardProviderAware:true,
  healthSupportsFirestore:true,
  healthSupportsLegacy3Min:true
}));
