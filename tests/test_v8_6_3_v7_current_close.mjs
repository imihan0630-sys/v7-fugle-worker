import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");

for(const marker of [
  'const VERSION = "8.6.3-v7-current-close";',
  'const marketState=await env.STOCKS_KV?.get(MARKET_STATE_KEY,"json");',
  'const stateStock=marketState?.stocks?.[String(sel.symbol)]||null;',
  'const latestClose=useState?stateClose:journalNumber(latest?.close);',
  '正式盤後市場狀態最新收盤價'
]) assert.ok(source.includes(marker),marker);

console.log(JSON.stringify({
  ok:true,
  version:"8.6.3-or-later",
  latestCloseSource:"V7_MARKET_STATE",
  d1HistoryFallback:true
}));
