import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");

for(const marker of [
  "CREATE TABLE IF NOT EXISTS v7_formal_scan_backfill",
  "async function importV7FormalScanBackfill",
  "async function readV7FormalSelectionPerformance",
  'url.pathname === "/api/v7-formal-performance"',
  'url.pathname === "/api/v7-formal-backfill"',
  "V7 正式盤後選股績效",
  "只包含 V7/V8 系統正式盤後 scan 的入選標的"
]) assert.ok(source.includes(marker),marker);

const rows=JSON.parse(await readFile(new URL("../data/v7_formal_scan_backfill.json",import.meta.url),"utf8"));
assert.equal(rows.length,5);
assert.deepEqual(rows.map(x=>x.symbol),["2820","2201","1301","6278","6530"]);
assert.ok(rows.every(x=>x.scanDate==="2026-09-11"));
assert.equal(rows.find(x=>x.symbol==="6278").formalClose,186.5);
assert.equal(rows.find(x=>x.symbol==="6530").profitCheck,100.5);

console.log(JSON.stringify({
  ok:true,
  version:"8.6.2-or-later",
  backfillRows:rows.length,
  formalScanOnly:true,
  excludesRecoveredCandidates:true
}));
