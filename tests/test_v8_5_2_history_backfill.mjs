import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
{
  const version=source.match(/const VERSION = "(\d+)\.(\d+)\.(\d+)[^"]*";/)?.slice(1,4).map(Number);
  assert.ok(version && (version[0]>8 || (version[0]===8 && (version[1]>5 || (version[1]===5 && version[2]>=2)))),"V8.5.2+ runtime required");
}
for (const marker of [
  "CREATE TABLE IF NOT EXISTS v8_trade_journal_recovered",
  'url.pathname === "/api/journal/history-import"',
  "async function importRecoveredJournalRows",
  "歷史聊天室／專案檔案回填",
  "recoveredSelections",
  "SUPERSEDED / SCREENED 類型不納入主勝率"
]) assert.ok(source.includes(marker),marker);
const recovered=JSON.parse(await readFile(new URL("../data/recovered_chat_selections.json",import.meta.url),"utf8"));
assert.ok(recovered.length>=50);
assert.ok(recovered.some(x=>x.date==="2025-09-09"&&x.symbol==="2357"));
assert.ok(recovered.some(x=>x.date==="2026-09-11"&&x.symbol==="6278"&&x.buyLow===186.56));
assert.ok(recovered.some(x=>x.status==="SUPERSEDED"));
console.log(JSON.stringify({ok:true,version:"8.5.2-or-later",recoveredRows:recovered.length}));
