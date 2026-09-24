import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const quality=await readFile(new URL('./sync_official_quality.mjs',import.meta.url),'utf8');
const recovery=await readFile(new URL('./recover_after_market.mjs',import.meta.url),'utf8');
const workflow=await readFile(new URL('../.github/workflows/v7-market-data.yml',import.meta.url),'utf8');

assert.match(source,/const VERSION = "8\.9\.(?:7-recovery-hardening|8-staged-recovery)";/);
assert.match(source,/歷史補跑僅接受管理員授權/);
assert.match(source,/補跑日期無效、未來或超過14天/);
assert.match(source,/scheduledTime=Date\.parse\(date\+"T10:20:00Z"\)/);
assert.match(source,/url\.searchParams\.get\("marketDate"\)/);
assert.match(source,/法人查核日期無效、未來或過舊/);

assert.match(quality,/QUALITY_MARKET_DATE/);
assert.match(quality,/readonlyPreviewNonJson/);
assert.match(quality,/readonlyPreviewAccepted/);
assert.match(quality,/bodyPrefix:text\.slice\(0,240\)/);
assert.match(quality,/attempt<=3/);
assert.match(quality,/text\\\/html/);

assert.match(recovery,/RECOVERY_MARKET_DATE/);
assert.match(recovery,/historicalRecovery/);
assert.match(recovery,/\/api\/institution-status\?marketDate=/);
assert.match(recovery,/JSON\.stringify\(\{onlyIfMissing:true,marketDate:date\}\)/);

assert.match(workflow,/market_date:/);
assert.match(workflow,/Historical official quality recovery/);
assert.match(workflow,/Historical after-market recovery/);
assert.match(workflow,/QUALITY_MARKET_DATE:/);
assert.match(workflow,/RECOVERY_MARKET_DATE:/);

assert.doesNotMatch(source,/strategyA.*8\.9\.7|strategyB.*8\.9\.7/i);

console.log(JSON.stringify({
  ok:true,
  version:'8.9.7-recovery-hardening',
  historicalRecovery:true,
  readonlyPreviewBoundedRetry:true,
  responseObservability:true,
  formalSelectionRulesChanged:false
}));
