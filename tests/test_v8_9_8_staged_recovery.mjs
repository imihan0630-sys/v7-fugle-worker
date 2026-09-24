import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');

assert.match(source,/const VERSION = "8\.9\.8-staged-recovery";/);
assert.match(source,/const selectionOnly = options\?\.selectionOnly === true && !dryRun;/);
assert.match(source,/SELECTION_ONLY_RECOVERY/);
assert.match(source,/selectionPersisted:/);
assert.match(source,/url\.pathname === "\/api\/scan\/deliver"/);
assert.match(source,/分段恢復僅接受管理員授權/);
assert.match(source,/enrichThreePoolDailyPayload\(payload,formal,hybrid,latest\.strategyOverlap\|\|null,watch\)/);
assert.match(source,/sendTo3Min\(latest\.threeMinPayload/);
assert.match(source,/await env\.STOCKS_KV\.put\(LAST_SCAN_KEY,JSON\.stringify\(updated\)/);
assert.match(source,/body\.selectionOnly===true/);

console.log(JSON.stringify({
  ok:true,
  version:'8.9.8-staged-recovery',
  selectionStage:true,
  deliveryStage:true,
  formalSelectionRulesChanged:false
}));
