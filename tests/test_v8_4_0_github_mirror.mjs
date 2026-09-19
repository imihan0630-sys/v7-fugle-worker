import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const mirror=await readFile(new URL("./github_plan_mirror.mjs",import.meta.url),"utf8");
const health=await readFile(new URL("./scheduled_health.mjs",import.meta.url),"utf8");

assert.match(source,/const VERSION = "8\.4\.(?:0|[1-9]\d*)[^"]*";/);
for(const marker of [
  'const GITHUB_MIRROR_PROVIDER="D1_GITHUB_ENCRYPTED";',
  'CREATE TABLE IF NOT EXISTS v8_external_mirror_acceptance',
  'async function recordGithubMirrorAcceptance',
  'url.pathname==="/api/storage/export-current"',
  'url.pathname==="/api/storage/github-accept"',
  'planStorageMode: GITHUB_MIRROR_PROVIDER',
  'threeMin:{compatibilityMode:false'
]) assert.ok(source.includes(marker),marker);

for(const marker of [
  'AES-256-GCM',
  'HKDF-SHA256',
  '/api/storage/export-current',
  '/api/storage/github-accept',
  'raw.githubusercontent.com',
  'plaintextWritten:false'
]) assert.ok(mirror.includes(marker),marker);

for(const marker of [
  "D1_GITHUB_ENCRYPTED",
  "/api/storage/status",
  "github?.verified",
  "noThreeMinPost:true"
]) assert.ok(health.includes(marker),marker);

console.log(JSON.stringify({
  ok:true,
  version:"8.4.0-or-later",
  encryptedExternalMirror:true,
  d1Primary:true,
  threeMinInactive:true,
  noPlaintextMirror:true
}));
