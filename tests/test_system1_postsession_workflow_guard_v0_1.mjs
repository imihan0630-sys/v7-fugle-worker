import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(new URL("../.github/workflows/system1-postsession-evidence.yml",import.meta.url),"utf8");
let n=0;
assert.match(source,/workflow_dispatch:/);n++;
assert.match(source,/schedule:\s*\n\s*- cron: "45 6 \* \* 1-5"/);n++;
assert.doesNotMatch(source,/\n\s*push:/);n++;
assert.match(source,/permissions:\s*\n\s*contents:\s*read/);n++;
assert.match(source,/id:\s*resolve/);n++;
assert.match(source,/node tests\/resolve_system1_postsession_target_date\.mjs/);n++;
assert.match(source,/C3_TARGET_TRADE_DATE:\s*\$\{\{ steps\.resolve\.outputs\.target_trade_date \}\}/);n++;
assert.match(source,/if:\s*steps\.resolve\.outputs\.should_run == 'true'/);n++;
assert.match(source,/if:\s*always\(\) && steps\.resolve\.outputs\.should_run == 'true'/);n++;
assert.match(source,/system1-postsession-blocker\.json/);n++;
assert.doesNotMatch(source,/wrangler|curl\s+-X\s+(?:POST|PUT|PATCH|DELETE)|gh\s+api.*--method\s+(?:POST|PUT|PATCH|DELETE)/i);n++;
assert.doesNotMatch(source,/contents:\s*write|actions:\s*write|deployments:\s*write/i);n++;
assert.match(source,/Record non-trading-day skip/);n++;
assert.match(source,/Collect read-only C3\/C4\/C5 post-session evidence/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,manualEnabled:true,scheduled:true,cronUtc:"45 6 * * 1-5",
  taipeiTime:"14:45",pushTriggered:false,contentsWrite:false,productionWrites:false,
  tradingDayResolverRequired:true,blockerPreserved:true
}));
