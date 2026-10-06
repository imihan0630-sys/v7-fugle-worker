import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fetchBufferedOfficialSource} from './official_source_fetch_v0_1.mjs';

const source=await readFile(process.env.V7_TEST_WORKER_PATH || new URL('../Worker.js',import.meta.url),'utf8');
const quality=await readFile(new URL('./sync_official_quality.mjs',import.meta.url),'utf8');
const recovery=await readFile(new URL('./recover_after_market.mjs',import.meta.url),'utf8');
const workflow=await readFile(new URL('../.github/workflows/v7-market-data.yml',import.meta.url),'utf8');

{
  const version=source.match(/const VERSION = "(\d+)\.(\d+)\.(\d+)[^"]*";/)?.slice(1,4).map(Number);
  assert.ok(version && (version[0]>8 || (version[0]===8 && (version[1]>9 || (version[1]===9 && version[2]>=7)))),"V8.9.7+ runtime required");
}
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
assert.match(quality,/fetchBufferedOfficialSource/);

let bodyAttempt=0;
const bodyRetry=await fetchBufferedOfficialSource('https://example.invalid/slow-body',{},{
  sleep:async()=>{},
  fetchImpl:async()=>{
    bodyAttempt+=1;
    return {
      status:200,ok:true,statusText:'OK',headers:new Headers({'content-type':'text/plain'}),
      async arrayBuffer(){
        if(bodyAttempt<3) throw new DOMException('The operation was aborted due to timeout','TimeoutError');
        return new TextEncoder().encode('verified').buffer;
      }
    };
  }
});
assert.equal(await bodyRetry.text(),'verified');
assert.equal(bodyAttempt,3);

let forbiddenAttempts=0;
await assert.rejects(()=>fetchBufferedOfficialSource('https://example.invalid/forbidden',{},{
  sleep:async()=>{},
  fetchImpl:async()=>{forbiddenAttempts+=1;return {status:403,ok:false,statusText:'Forbidden',headers:new Headers(),arrayBuffer:async()=>new ArrayBuffer(0)};}
}),/disallows access/);
assert.equal(forbiddenAttempts,1);


assert.match(recovery,/RECOVERY_MARKET_DATE/);
assert.match(recovery,/historicalRecovery/);
assert.match(recovery,/\/api\/institution-status\?marketDate=/);
assert.match(recovery,/JSON\.stringify\(\{onlyIfMissing:true,marketDate:date\}\)/);

assert.match(workflow,/market_date:/);
assert.match(workflow,/Historical official quality recovery/);
assert.match(workflow,/Historical after-market recovery/);
assert.match(workflow,/QUALITY_MARKET_DATE:/);
assert.match(workflow,/RECOVERY_MARKET_DATE:/);
assert.match(workflow,/quality_only:/);
assert.match(workflow,/QUALITY_RECOVERY_ONLY:/);
assert.match(workflow,/github\.event\.schedule == '45 15 \* \* 1-5'/);
assert.match(workflow,/inputs\.quality_only != true/);

assert.doesNotMatch(source,/strategyA.*8\.9\.7|strategyB.*8\.9\.7/i);

console.log(JSON.stringify({
  ok:true,
  version:'8.9.7-recovery-hardening',
  historicalRecovery:true,
  readonlyPreviewBoundedRetry:true,
  responseObservability:true,
  bodyStreamRetryCovered:true,
  recoveryOnlyFallback:true,
  qualityOnlyVerification:true,
  formalSelectionRulesChanged:false
}));
