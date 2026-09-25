import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");

{
  const version=source.match(/const VERSION = "(\d+)\.(\d+)\.(\d+)[^"]*";/)?.slice(1,4).map(Number);
  assert.ok(version && (version[0]>8 || (version[0]===8 && (version[1]>4 || (version[1]===4 && version[2]>=1)))),"V8.4.1+ runtime required");
}
assert.ok(source.includes('26:"完整計畫外部鏡像＋readback"'));
assert.ok(source.includes('latest?.diagnostics?.requirements30?.requirement26?.proof'));
assert.ok(source.includes('D1主封存＋GitHub AES-256-GCM加密鏡像精確readback'));
assert.ok(source.includes('D1主封存＋Firestore外部鏡像精確readback'));
assert.ok(source.includes('既有3Min完整payload精確readback'));

console.log(JSON.stringify({
  ok:true,
  version:"8.4.1-or-later",
  providerNeutralRule26:true,
  githubEvidencePreferred:true,
  legacyEvidenceRetained:true
}));
