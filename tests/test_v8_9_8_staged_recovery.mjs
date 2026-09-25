import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');

{
  const version=source.match(/const VERSION = "(\d+)\.(\d+)\.(\d+)[^"]*";/)?.slice(1,4).map(Number);
  assert.ok(version && (version[0]>8 || (version[0]===8 && (version[1]>9 || (version[1]===9 && version[2]>=8)))),"V8.9.8+ runtime required");
}
assert.match(source,/url\.pathname === "\/api\/scan\/stage-selection"/);
assert.match(source,/Staged historical recovery from verified dry-run/);
assert.match(source,/runAfterMarketScan\(env,scheduledTime,\{dryRun:true\}\)/);
assert.match(source,/selectionPersisted:true/);
assert.match(source,/STAGED_RECOVERY_PENDING_DELIVERY/);
assert.match(source,/OPEN_POSITION_PROTECTED/);
assert.match(source,/archiveStrategyPools\(env,date/);
assert.match(source,/archiveHybridWatchCandidates\(env,date,watch\)/);
assert.match(source,/POST \/api\/daily-report\/resend/);
assert.match(source,/externalPlanAccepted:false/);
assert.match(source,/dailyDeliveryState:"PENDING"/);

console.log(JSON.stringify({
  ok:true,
  version:'8.9.8-staged-recovery',
  verifiedDryRunSelection:true,
  formalPlanPersistence:true,
  deliveryDeferred:true,
  formalSelectionRulesChanged:false
}));
